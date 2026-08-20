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

本站內容以 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh-hant) 授權，保留 WoowTech 出處。
