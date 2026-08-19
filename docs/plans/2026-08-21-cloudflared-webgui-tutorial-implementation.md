# Cloudflared Web GUI Tutorial Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build, illustrate, validate, and publish a 12-chapter Traditional-Chinese WoowTech tutorial for the Home Assistant Cloudflared Web GUI add-on.

**Architecture:** Fork the proven static tutorial scaffold into an independent repository. Keep chapter metadata and generated navigation in `chapters.json`/`scripts/build_nav.js`, presentation in shared CSS/JS, and privacy-safe Browserless captures in `assets/screenshots/` driven by `scripts/annotations.json`.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js generators/checks, Playwright over Browserless CDP, GitHub Pages, Cloudflare DNS.

---

### Task 1: Rebrand and configure the independent site

**Files:**
- Modify: `chapters.json`
- Modify: `README.md`, `STYLE.md`, `404.html`, `CNAME`, `robots.txt`
- Modify: `scripts/build_nav.js`
- Verify: `assets/css/style.css`, `assets/js/toc.js`

**Steps:**
1. Replace Tailscale metadata with Cloudflared Web GUI title, domain, repository, description, and 12-chapter structure.
2. Ensure every entry page will load version-locked MDI, the same Google fonts, shared CSS, and theme color.
3. Update landing-page copy and iconography without changing the shared WoowTech token contract.
4. Run `node scripts/build_nav.js`; expect generated index, navigation, pager, metadata, and sitemap.

### Task 2: Author the 12 verified chapters

**Files:**
- Create: `ch1_overview.html` through `ch12_troubleshooting.html`

**Steps:**
1. Research current Cloudflare Tunnel documentation, Home Assistant proxy requirements, and the add-on README/DOCS.
2. Draft each chapter using the fixed content skeleton and existing components.
3. Require 8–12 sections, at least four steps, at least four FAQ entries, safety boundaries, validation, troubleshooting, and official sources.
4. Avoid claims that require mutating the designated HA environment to prove.
5. Run `node scripts/build_nav.js && node scripts/check_links.js`; expect exit 0.

### Task 3: Capture privacy-safe Browserless screenshots

**Files:**
- Modify: `scripts/capture.js`
- Modify: `scripts/annotations.json`
- Create: `assets/screenshots/ch*/NN_*.png`
- Modify: selected `ch*.html`

**Steps:**
1. Configure Browserless CDP and untracked HA credentials.
2. Log in via the page-scoped ingress OAuth flow.
3. Navigate read-only among Dashboard, Setup, Config, and Logs; never Save, Restart, Authorize, Delete, or mutate state.
4. Redact account name, hostname, tunnel IDs, IPs, tokens, authorization URLs, and sensitive log passages.
5. Inspect each PNG manually and insert semantic figure/alt/caption markup only for safe representative images.

### Task 4: Validate responsive UX and privacy

**Files:**
- Verify all 14 HTML entry points and screenshot assets.

**Steps:**
1. Run `node --check` on both scripts.
2. Run `node scripts/build_nav.js --check` and `node scripts/check_links.js`.
3. Serve locally and use Playwright at desktop, 360px, and 320px widths.
4. Assert no page-wide overflow, mobile menu operation, contained table/code scrolling, visible focus, and loaded fonts/MDI/CSS.
5. Inspect landing, 404, first chapter, screenshot-bearing chapter, and last chapter screenshots.
6. Perform a manual privacy audit of every committed screenshot.

### Task 5: Publish the site

**Files/Resources:**
- Create GitHub repo: `WOOWTECH/Woow_ha_cloudflare_tunnel_tutorial_site`
- Enable GitHub Pages
- Create Cloudflare DNS record for `ha-cloudflare-tunnel-guide.woowtech.io`

**Steps:**
1. Confirm fresh local validation before publishing.
2. Create and push the public GitHub repo using an authenticated GitHub mechanism.
3. Enable Pages from the default branch and confirm its generated hostname.
4. Retrieve current Cloudflare DNS endpoint documentation and current zone state.
5. Create only the approved DNS record; do not modify existing tunnel or `jznha` resources.
6. Verify HTTPS and report exact deployment evidence. If credentials/tools are unavailable, stop and report the blocker without claiming publication.
