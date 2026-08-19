# Cloudflared Web GUI 教學站設計

## 目標

建立獨立公開教學站 `WOOWTECH/Woow_ha_cloudflare_tunnel_tutorial_site`，以 12 章繁體中文內容帶 Home Assistant 使用者理解並操作 Cloudflared Web GUI。正式網址規劃為 `https://ha-cloudflare-tunnel-guide.woowtech.io/`。

## 架構

教學站沿用 WoowTech 靜態教學系統：`chapters.json` 是章節、SEO、導覽與 sitemap 的單一來源；`scripts/build_nav.js` 產生重複結構；`assets/css/style.css` 與 `assets/js/toc.js` 提供共用品牌與響應式體驗。套件原始碼與教學站分開維護，避免套件發布與內容更新互相耦合。

## 課程結構

1. 開始前：需求、安全邊界與本地／遠端管理模式
2. 安裝 Web GUI add-on
3. 第一次開啟 Web GUI
4. Setup 首次設定精靈
5. Cloudflare 授權流程
6. Dashboard 與 Tunnel 狀態
7. Config 與 Supervisor options
8. external hostname 與 Home Assistant 入口
9. additional hosts 與轉送範圍
10. Logs 與日常維護
11. 安全檢查與最小暴露
12. 排錯、更新與交接

每章包含目的、心智模型、至少四個操作步驟、選項判斷、安全檢查、驗收、排錯、FAQ 與官方來源。

## 截圖與安全

Browserless 只進行唯讀瀏覽。允許登入 Home Assistant ingress 並切換 Dashboard、Setup、Config、Logs，不允許 Save、Restart、Authorize、Delete 或任何狀態變更。輸出前遮罩 HA 帳號、hostname、Tunnel ID、token、IP、Cloudflare 帳戶資料、授權網址及敏感 log。若畫面必須透過狀態變更才能出現，改用文字、表格或程式碼範例，不偽造介面。

## 發布

內容通過導覽、連結、瀏覽器與隱私檢查後，建立公開 GitHub repo、啟用 GitHub Pages，再於 Cloudflare DNS 新增 `ha-cloudflare-tunnel-guide.woowtech.io`。不修改 `jznha.woowtech.io`、現有 Tunnel 或 Cloudflared Web GUI 設定。外部變更已獲使用者批准，但仍必須在可用憑證與工具存在時才執行並驗證。
