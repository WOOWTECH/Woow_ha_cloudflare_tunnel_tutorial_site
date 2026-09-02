# Home Assistant Cloudflared 資源總站

**規劃網址：<https://ha-cloudflare-tunnel-guide.woowtech.io/>**

這個 repo 是 Cloudflare Tunnel × Home Assistant 的四份資源集中地：

- **教學（`tutorial.html`）** — 12 章繁體中文 [WoowTech Cloudflared Web GUI](https://github.com/WOOWTECH/Woow_ha_cloudflare_tunnel_webgui) 入住教學：安裝、Setup、Cloudflare 授權、hostname、Dashboard、Config、Logs、安全與排錯。
- **銷售手冊（`sales.html`）** — WoowTech 兩種 Cloudflare Tunnel 代管方案：HAOS 內建 add-on 代設定，或雲端 PaaS 完整代管（CF Access + Workers + SSO + Analytics）。
- **提示詞庫（`prompts.html`）** — 40+ 條給 AI agent 用來透過 API/MCP 操作 Cloudflare 的自然語言提示詞，分 8 類。
- **Skill 手冊（`skills.html`）** — 精選 8 顆與 Cloudflare 相關的 agent skills，加 6 大熱門集合入口與安全守則。

`index.html` 是 4 卡片資源總覽（人手維護），其他三本手冊為自包含單檔 HTML（離線可讀）。

## 安全範圍

- 截圖採唯讀瀏覽，不在指定 Home Assistant 環境儲存、重啟、授權或變更 Tunnel。
- 圖片必須遮罩帳號、hostname、Tunnel ID、token、IP、授權網址與敏感日誌。
- 教學不鼓勵把管理介面或不必要的內網服務公開到網際網路。

## 維護

`chapters.json` 是章節、導覽、SEO 與 sitemap 的單一來源：

```bash
node scripts/build_nav.js        # 重新產生 tutorial.html、章節側欄、sitemap
node scripts/build_nav.js --check # CI 檢查漂移
node scripts/check_links.js      # 站內連結、錨點、id、data-icon 健檢
```

hub 區塊（`chapters.json` 的 `hub`）指定：

- `catalog: tutorial.html` — 章節目錄頁由 build_nav 自動產生
- `pages: [sales.html, prompts.html, skills.html]` — 自帶樣式的獨立單檔手冊，只納入 sitemap 與 check_links 白名單，不會被 build_nav 覆寫

## 多語系（en/）

同一個 repo、同一支 generator、第二個 site root：zh-TW 永遠在根目錄一個位元組不動，英文版在 `en/`（同檔名、同 section id），網址 `https://ha-cloudflare-tunnel-guide.woowtech.io/en/…`。站別差異（pager 圖示、字型、footer 聲明句、目錄分組 class）全部住在 `chapters.json` 的 `site.strings` / `site.chrome` / `site.fontsUrl` / `site.footerMeta`，`scripts/` 底下的 kit 檔案 13 站 byte-identical，請勿改。

```
根目錄            zh-TW（primary）— chapters.json + 各頁 + assets/
en/               英文 site root  — 自己的 chapters.json，頁面共用 ../assets/
i18n/ledger.json  翻譯帳本：每個 <section id>／章首／chapters.json 欄位一筆 {sourceHash, status}
i18n/strings.en.json  chrome 字串（第 N 章、上一章、footer…）只翻一次
i18n/policy.json  逐單元政策：translate | localize | transcreate | rewrite | skip
i18n/locales.json published=false 時 zh 頁不輸出 hreflang／語言切換（上線那天翻成 true）
scripts/lib/i18n.js  13 個教學站共用、byte-identical 的多語系邏輯
```

```bash
SITE_ROOT=en node scripts/build_nav.js       # 重生 en/ 的 head、側欄、pager、footer、sitemap（pending 頁自動 noindex）
SITE_ROOT=en node scripts/check_links.js
node scripts/check_i18n.js                   # 報告 + 閘門（結構 parity、code freeze、CJK 外漏、chrome canary、帳本、索引）
node scripts/check_i18n.js --strict          # PR 用：zh 改了 en 沒跟 → 紅燈（掛 label i18n-defer 可放行）
node scripts/check_i18n.js --update-ledger   # main 用：把 zh 已變的單元標 stale（en 頁出現提醒橫幅）
node scripts/check_i18n.js --accept en:ch1_overview.html#steps   # 翻好一個單元後記帳（整頁：en:ch1_overview.html）
node scripts/build_og.js                     # 翻完 en/chapters.json 的 title／subtitle 後重產英文分享卡（需 playwright）
```

規則：改 zh 章節的作者區（章首、`<section>`）時，同 PR 順手更新 `en/<同檔名>` 對應 section 並 `--accept`，或掛 `i18n-defer` 讓它先變 stale。翻譯寫作規範見 [`i18n/STYLE.en.md`](i18n/STYLE.en.md)，術語見 [`i18n/glossary.json`](i18n/glossary.json)。

本站內容以 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh-hant) 授權，保留 WoowTech 出處。
