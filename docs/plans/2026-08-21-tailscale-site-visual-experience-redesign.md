# Tailscale Tutorial Site Visual Experience Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Give the landing page, 404 page, and every Tailscale tutorial chapter a coherent, accessible WoowTech visual experience without changing instructional content, URLs, or screenshot annotations.

**Architecture:** Keep all presentation changes in the shared `assets/css/style.css` and the progressive-enhancement navigation in `assets/js/toc.js`; this means all generated chapter pages inherit the redesign. Update only the hand-authored landing and 404 markup where a richer page-specific information hierarchy is needed. Continue using `scripts/build_nav.js` as the single source for all repeated chapter navigation, metadata, pagers, footers, and chapter cards.

**Tech Stack:** Static HTML, shared CSS custom properties, vanilla JavaScript, Google Fonts (Poppins, Outfit, Yellowtail, Noto Sans TC), Material Design Icons 7.4.47, Node.js validation scripts, Playwright browser checks when available.

---

### Task 1: Establish shared visual and accessibility foundations

**Files:**
- Modify: `assets/css/style.css`
- Modify: `assets/js/toc.js`

**Step 1: Inspect the current shared selectors and confirm all HTML entry points load the same stylesheet, font stylesheet, and MDI stylesheet.**

Run: `rg -L 'assets/css/style.css|materialdesignicons|fonts.googleapis.com' index.html 404.html ch*.html`
Expected: no output.

**Step 2: Add the shared design-system rules.**

Implement exact WoowTech variables in `:root`; preserve the existing public component class names. Apply the 4px spacing system, 12/20/28/pill radii, white/gray-dominant surfaces, soft diffuse shadows, and `220ms cubic-bezier(.4,0,.2,1)` interaction transitions. Add visible `:focus-visible` styling and `prefers-reduced-motion` support.

**Step 3: Rework shared components rather than chapter copy.**

Style the sidebar as a readable course navigator, chapter header as an editorial introduction, section headings as uniform MDI tiles, and callouts/steps/FAQ/tables/code/screenshots/pagers as responsive instructional components. Keep screenshots visually plain so red annotations remain legible. Contain wide tables and code through their own horizontal scrolling.

**Step 4: Improve navigation behavior.**

Keep the no-JavaScript navigation fully usable. In `toc.js`, retain the mobile collapse and section highlighting, add appropriate accessible labels/state, and ensure links cannot cause a horizontal overflow.

**Step 5: Verify the static contract.**

Run: `node scripts/build_nav.js --check && node scripts/check_links.js`
Expected: both commands exit 0.

### Task 2: Redesign the landing and 404 experiences

**Files:**
- Modify: `index.html`
- Modify: `404.html`
- Modify: `assets/css/style.css`

**Step 1: Preserve the generated entry contracts.**

Do not hand-edit generated chapter cards, metadata, or footer content that `scripts/build_nav.js` owns. Add only semantic page-level wrappers/classes which the generator can preserve, or adjust `build_nav.js` when generated markup needs a shared structural improvement.

**Step 2: Build the landing-page hierarchy.**

Give the home page a calm blue-wash hero, clear course context, a compact learning-path summary, and chapter groups that remain generated from `chapters.json`. Use MDI tiles for non-textual wayfinding; do not use emoji, fabricated logos, or visual-heavy gradients.

**Step 3: Build the 404 recovery route.**

Use the same home-shell language and offer clear, large recovery links to the course index and sensible starting chapters.

**Step 4: Run generator and link checks.**

Run: `node scripts/build_nav.js && node scripts/check_links.js`
Expected: navigation is regenerated and links pass.

### Task 3: Validate all entry pages and responsive rendering

**Files:**
- Verify: `index.html`, `404.html`, `ch1_overview.html` through `ch12_troubleshooting.html`
- Verify: `assets/css/style.css`, `assets/js/toc.js`

**Step 1: Check the generated navigation drift.**

Run: `node scripts/build_nav.js --check`
Expected: reports `導覽結構與 chapters.json 同步`.

**Step 2: Check all local references.**

Run: `node scripts/check_links.js`
Expected: exit 0 with no missing local asset, page, or anchor.

**Step 3: Serve the site locally and run browser verification.**

Run: `python3 -m http.server 4173 --directory .`

At desktop and 320px/360px widths, open the landing page, 404 page, first chapter, a screenshot-heavy middle chapter, and last chapter. Confirm font and MDI network resources load, no document horizontal overflow exists, mobile navigation can open/close, focus rings are visible, tables/code scroll within their containers, and pager links stack on narrow screens.

**Step 4: Capture evidence.**

Save desktop and mobile screenshots of `index.html` and one chapter page under a temporary verification directory outside the site source tree; inspect them for brand conformance and annotation legibility.

**Step 5: Report only verified results.**

State the commands and viewport evidence, list modified paths, and disclose any unavailable browser tooling or remaining limitations.
