# Browserless Illustrated Chapters Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add comprehensive, privacy-safe Browserless-captured screenshots to all 12 Tailscale tutorial chapters, with each image placed beside the operation it explains.

**Architecture:** Extend the existing `scripts/capture.js` pipeline to use Browserless CDP when a token is available, while retaining local Playwright as a fallback. Keep screenshot definitions and redactions in `scripts/annotations.json`; add only semantic `<figure class="shot">` elements to chapter content. The existing shared CSS already keeps instructional screenshots neutral and readable.

**Tech Stack:** Browserless CDP WebSocket, Playwright, Node.js, annotated PNG screenshots, static HTML, existing link/navigation checks.

---

### Task 1: Establish a safe Browserless capture session

**Files:**
- Modify: `scripts/capture.js`
- Modify: `.env.example` (create if none exists)
- Verify: `.env` and `storage_state.json` (untracked; never commit)

**Step 1: Confirm capture prerequisites without logging sensitive values.**

Run: `test -s .env && test -s /data/pi-agent/.browserless-token`
Expected: both exit 0.

**Step 2: Add Browserless connection support.**

Read the Browserless token from the existing agent token file or `BROWSERLESS_TOKEN`; connect via `chromium.connectOverCDP('wss://production-sfo.browserless.io?token=...')`. Use local `chromium.launch()` only when Browserless configuration is intentionally unavailable. Never print the token, Home Assistant URL, username, password, tailnet name, private IPs, or auth URLs.

**Step 3: Confirm authenticated, read-only access.**

Use the existing login flow to open the Home Assistant landing page. Do not save, delete, enable, disable, modify, approve, revoke, or otherwise mutate Home Assistant or Tailscale settings. Save login state only to ignored `storage_state.json`.

**Step 4: Capture and inspect one redacted pilot image.**

Run: `node scripts/capture.js --chapter=ch3`
Expected: a new `assets/screenshots/ch3/*.png` image with a successful UI state, readable callout, and all personally identifying data covered.

### Task 2: Define comprehensive, privacy-safe screenshot coverage

**Files:**
- Modify: `scripts/annotations.json`

**Step 1: Create a chapter coverage matrix before capturing.**

Capture at least one useful screenshot per chapter, with a second screenshot for an action-heavy or safety-critical concept:

| Chapter | Required image topic |
|---|---|
| 1 | Tailscale App / Machines planning context |
| 2 | HA Apps page and Tailscale App detail |
| 3 | Tailscale Web UI and successful Machine state |
| 4 | App status and safe log-reading view |
| 5 | Private HA access from a tailnet device |
| 6 | Machines list and device detail lifecycle controls |
| 7 | Tailscale policy/access-control view |
| 8 | Serve status or private HTTPS explanation view |
| 9 | Subnet router configuration and advertised route state |
| 10 | Admin-console route approval workflow |
| 11 | Daily client connection/status check |
| 12 | Troubleshooting evidence: App status/logs and Machines state |

**Step 2: Define every shot in `annotations.json`.**

Use a chapter-local `01_` / `02_` naming convention, 1440×900 capture viewport, explicit waits, and only read-only navigation. Add redactions before output for tailnet domain, device name, machine ID, IP address, subnet CIDR, user identity, access-policy specifics, log tokens, and any home/location information. Use callouts sparingly; do not obscure the UI that teaches the step.

**Step 3: Capture in batches and inspect each PNG.**

Run chapter batches, opening each generated image after capture. If a spinner, login page, failed selector, empty state, or unredacted identifier appears, correct the shot definition and recapture before proceeding.

### Task 3: Insert captions where readers need them

**Files:**
- Modify: `ch1_overview.html` through `ch12_troubleshooting.html`
- Verify: `scripts/build_nav.js`, `scripts/check_links.js`

**Step 1: Place figures immediately after their associated step or explanation.**

For each image insert this semantic structure, using a chapter-local caption number and meaningful alt text:

```html
<figure class="shot">
  <img src="assets/screenshots/chN/01_descriptive_name.png" alt="描述讀者應辨識的安全設定畫面" />
  <figcaption><strong>圖 N-1</strong>一句話說明這張圖協助你確認的狀態。</figcaption>
</figure>
```

**Step 2: Keep the teaching text unchanged except for the figure caption and a short adjacent reference when needed.**

Do not add speculative UI paths. If the live interface differs from the chapter wording, retain the conservative wording and document the current UI in the caption.

**Step 3: Regenerate static structures and validate references.**

Run: `node scripts/build_nav.js && node scripts/build_nav.js --check && node scripts/check_links.js`
Expected: each command exits 0.

### Task 4: Browser and privacy acceptance check

**Files:**
- Verify: `index.html`, every `ch*.html`, `assets/screenshots/ch*/**.png`

**Step 1: Use a browser to inspect each image in context.**

At desktop and 320px/360px widths, check one content page from every chapter group and every image-bearing page. Confirm screenshot cards are not cropped, captions remain readable, and no page-wide horizontal overflow appears.

**Step 2: Recheck all images for sensitive data.**

Verify that no image exposes credentials, auth URLs, personal names, tailnet names/domains, device names, private/public IPs, MAC addresses, serials, detailed routes, location, or logs containing secrets.

**Step 3: Report verifiable coverage.**

List the chapter-to-image mapping, generated asset paths, validation commands, browser viewports, and any page where a live target did not provide a safe or representative screenshot.
