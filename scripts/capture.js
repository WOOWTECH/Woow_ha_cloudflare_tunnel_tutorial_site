// Screenshot + on-image annotation capture pipeline.
// Reads annotations.json, opens HA (with cached login), injects annotation DOM
// per shot, then saves an annotated PNG to assets/screenshots/<chapter>/<filename>.
//
// Usage:
//   node scripts/capture.js                # all shots
//   node scripts/capture.js --chapter=ch3   # one chapter (comma separated ok)
//   node scripts/capture.js --shot=01_login_page.png
//
// Login cache: first run does UI login and saves storage_state.json; later runs
// reuse it. Delete the file to force re-login.

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// 專案根目錄 = 這個檔案的上一層，clone 到哪都能跑
const ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');
const SHOTS_JSON = path.join(ROOT, 'scripts', 'annotations.json');
const SHOTS_DIR = path.join(ROOT, 'assets', 'screenshots');
const BROWSERLESS_TOKEN_PATH = process.env.BROWSERLESS_TOKEN_FILE || '/data/pi-agent/.browserless-token';

function loadEnv() {
  const env = {};
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  if (env.HA_URL) env.HA_URL = env.HA_URL.replace(/\/+$/, '');
  return env;
}

function parseArgs() {
  const out = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([a-z]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

async function gotoWithRetry(page, url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      return;
    } catch (e) {
      lastErr = e;
      console.log(`  navigation retry ${i + 1}/${tries}`);
      await page.waitForTimeout(2000);
    }
  }
  throw lastErr;
}

// Inject annotation overlay into current page and return so screenshot picks it up.
async function injectAnnotations(page, annotations) {
  await page.evaluate((defs) => {
    // Remove any previous overlay
    document.querySelectorAll('[data-ha-tut-overlay]').forEach((n) => n.remove());
    const overlay = document.createElement('div');
    overlay.setAttribute('data-ha-tut-overlay', '1');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483647',
    });
    // SVG for arrows
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    Object.assign(svg.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
    });
    const defsEl = document.createElementNS(svgNS, 'defs');
    defsEl.innerHTML = `<marker id="ha-tut-arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#e53935"/></marker>`;
    svg.appendChild(defsEl);
    overlay.appendChild(svg);

    function rectFor(selector) {
      const el = document.querySelector(selector);
      if (!el) return null;
      return el.getBoundingClientRect();
    }

    // The HA sidebar displays the signed-in account at the lower-left. Always
    // cover it before processing the shot-specific overlays.
    const safeDefs = [
      { type: 'redact', at: { x: 0, y: 55 }, w: 252, h: 270, text: '其他側欄項目已遮罩' },
      { type: 'redact', at: { x: 0, y: 370 }, w: 252, h: 470, text: '其他側欄項目已遮罩' },
      { type: 'redact', at: { x: 0, y: 840 }, w: 252, h: 60, text: '帳號已遮罩' },
      ...defs,
    ];
    for (const a of safeDefs) {
      if (a.type === 'box') {
        const r = a.selector ? rectFor(a.selector) : { left: a.at.x, top: a.at.y, width: a.w, height: a.h };
        if (!r) continue;
        const box = document.createElement('div');
        Object.assign(box.style, {
          position: 'absolute',
          left: (r.left - 6) + 'px',
          top: (r.top - 6) + 'px',
          width: (r.width + 12) + 'px',
          height: (r.height + 12) + 'px',
          border: '3px solid #e53935',
          borderRadius: '8px',
          boxShadow: '0 0 0 3px rgba(229,57,53,0.15)',
        });
        overlay.appendChild(box);
      } else if (a.type === 'arrow') {
        const r = a.selector ? rectFor(a.selector) : null;
        const target = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : a.to;
        const from = a.from;
        if (!target || !from) continue;
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', from.x);
        line.setAttribute('y1', from.y);
        line.setAttribute('x2', target.x);
        line.setAttribute('y2', target.y);
        line.setAttribute('stroke', '#e53935');
        line.setAttribute('stroke-width', '4');
        line.setAttribute('marker-end', 'url(#ha-tut-arrowhead)');
        svg.appendChild(line);
      } else if (a.type === 'redact') {
        const box = document.createElement('div');
        Object.assign(box.style, {
          position: 'absolute',
          left: a.at.x + 'px',
          top: a.at.y + 'px',
          width: a.w + 'px',
          height: a.h + 'px',
          background: '#f4f4f4',
          border: '2px solid #9e9e9e',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#616161',
          fontFamily: '-apple-system, "Noto Sans TC", sans-serif',
          fontSize: '13px',
          fontWeight: '600',
        });
        box.textContent = a.text || '已遮罩';
        overlay.appendChild(box);
      } else if (a.type === 'callout') {
        const at = a.at;
        const wrap = document.createElement('div');
        Object.assign(wrap.style, {
          position: 'absolute',
          left: at.x + 'px',
          top: at.y + 'px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transform: 'translateY(-50%)',
        });
        const num = document.createElement('div');
        num.textContent = String(a.number ?? '');
        Object.assign(num.style, {
          background: '#e53935',
          color: '#fff',
          fontFamily: 'Inter, -apple-system, "Noto Sans TC", sans-serif',
          fontWeight: '700',
          fontSize: '18px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
          flexShrink: '0',
        });
        const txt = document.createElement('div');
        txt.textContent = a.text || '';
        Object.assign(txt.style, {
          background: '#fff',
          color: '#212121',
          fontFamily: '-apple-system, "Noto Sans TC", sans-serif',
          fontSize: '15px',
          fontWeight: '500',
          padding: '8px 14px',
          borderRadius: '18px',
          border: '2px solid #e53935',
          boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
          whiteSpace: 'nowrap',
          maxWidth: '520px',
        });
        wrap.appendChild(num);
        wrap.appendChild(txt);
        overlay.appendChild(wrap);
      }
    }
    document.body.appendChild(overlay);
  }, annotations);
  // Give browser a beat to paint the overlay
  await page.waitForTimeout(200);
}

// Execute a list of pre-screenshot actions. Supported forms:
//   { click: "text=系統" }               → click first match (locator syntax)
//   { hover: "..." }                     → hover
//   { press: "Escape" }                  → keyboard press on page
//   { type: { selector: "...", text: "..." } }
//   { wait: 500 }                        → sleep ms
//   { waitFor: "selector" }              → wait for selector visible
//   { url: "/path" }                     → navigate within HA
async function runActions(page, env, actions) {
  const safeTabs = new Set(['text=Dashboard', 'text=Setup', 'text=Config', 'text=Logs']);
  for (const act of actions) {
    if (act.wait) {
      await page.waitForTimeout(act.wait);
    } else if (act.waitFor) {
      await page.waitForSelector(act.waitFor, { timeout: 8000 }).catch(() => {});
    } else if (act.press === 'Escape') {
      await page.keyboard.press('Escape');
    } else if (act.click && safeTabs.has(act.click)) {
      await page.locator(act.click).first().click({ timeout: 8000 });
    } else {
      throw new Error('Unsafe capture action blocked by read-only policy');
    }
  }
}

async function captureOne(ctx, env, shot) {
  const page = await ctx.newPage();
  await page.setViewportSize(shot.viewport || { width: 1440, height: 900 });
  const url = /^https?:\/\//.test(shot.url || '') ? shot.url : env.HA_URL + (shot.url || '/');
  console.log(`  → ${shot.chapter}/${shot.filename}`);
  // HA sidebar panels use a page-scoped OAuth callback. Navigate through the
  // sidebar for these shots instead of deep-linking before the callback settles.
  if (shot.haPanel) {
    await gotoWithRetry(page, env.HA_URL + '/');
    await page.waitForTimeout(3000);
    const haLogin = page.locator('input[name="username"]');
    if (await haLogin.isVisible().catch(() => false)) {
      console.log('    · logging into HA for sidebar capture');
      await haLogin.fill(env.HA_USER);
      await page.locator('input[name="password"]').fill(env.HA_PASS);
      await page.locator('input[name="password"]').press('Enter');
      await page.waitForTimeout(6000);
    }
    // HA keeps sidebar labels inside a hidden light-DOM mirror. Follow the
    // panel's real href programmatically so Browserless receives the OAuth
    // callback that loads the ingress page.
    const panelPath = new URL(shot.url || '/', env.HA_URL).pathname;
    const panelLink = page.locator(`a[href="${panelPath}"]`).first();
    await panelLink.evaluate((link) => link.click(), { timeout: 15000 });
    await page.waitForTimeout(7000);
  } else {
    await gotoWithRetry(page, url);
  }
  if (shot.waitFor) {
    const sel = shot.waitFor.split(',').map((s) => s.trim()).join(', ');
    await page.waitForSelector(sel, { timeout: 15000 }).catch(() => {});
  }
  if (shot.waitMs) await page.waitForTimeout(shot.waitMs);
  if (shot.actions && shot.actions.length) {
    await runActions(page, env, shot.actions);
  }
  await injectAnnotations(page, shot.annotations || []);
  const outDir = path.join(SHOTS_DIR, shot.chapter);
  fs.mkdirSync(outDir, { recursive: true });
  await page.screenshot({
    path: path.join(outDir, shot.filename),
    fullPage: false,
  });
  await page.close();
}

async function freshContext(browser, viewport) {
  return await browser.newContext({
    viewport: viewport || { width: 1440, height: 900 },
  });
}

function browserlessToken() {
  if (process.env.BROWSERLESS_TOKEN) return process.env.BROWSERLESS_TOKEN.trim();
  if (fs.existsSync(BROWSERLESS_TOKEN_PATH)) return fs.readFileSync(BROWSERLESS_TOKEN_PATH, 'utf8').trim();
  return '';
}

async function connectBrowser() {
  const token = browserlessToken();
  if (!token) {
    console.log('· Browserless token unavailable; using local Chromium');
    return await chromium.launch({ headless: true });
  }
  const endpoint = process.env.BROWSERLESS_CDP_ENDPOINT || 'wss://production-sfo.browserless.io';
  const separator = endpoint.includes('?') ? '&' : '?';
  console.log('· connecting to Browserless CDP');
  return await chromium.connectOverCDP(`${endpoint}${separator}token=${encodeURIComponent(token)}`);
}

(async () => {
  const args = parseArgs();
  const env = loadEnv();
  const config = JSON.parse(fs.readFileSync(SHOTS_JSON, 'utf8'));
  let shots = config.shots;
  if (args.chapter) {
    const wanted = new Set(args.chapter.split(',').map((s) => s.trim()));
    shots = shots.filter((s) => wanted.has(String(s.chapter)));
  }
  if (args.shot) shots = shots.filter((s) => s.filename === args.shot);
  if (!shots.length) {
    console.error('No shots matched filter.');
    process.exit(1);
  }
  console.log(`Capturing ${shots.length} shot(s)...`);
  const browser = await connectBrowser();
  // HA ingress uses a page-scoped OAuth callback. Start with a fresh context
  // for each capture run and let the panel flow authenticate in its own page.
  const loggedInCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const freshCtxCache = { ctx: null };
  for (const shot of shots) {
    let ctx = loggedInCtx;
    if (shot.fresh) {
      if (!freshCtxCache.ctx) {
        freshCtxCache.ctx = await freshContext(browser, shot.viewport);
      }
      ctx = freshCtxCache.ctx;
    }
    try {
      await captureOne(ctx, env, shot);
    } catch (e) {
      console.error(`  ✗ ${shot.chapter}/${shot.filename}: capture failed`);
    }
  }
  await loggedInCtx.close();
  if (freshCtxCache.ctx) await freshCtxCache.ctx.close();
  await browser.close();
  console.log('done.');
})();
