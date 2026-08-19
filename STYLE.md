# Cloudflared Web GUI 教學撰寫規格

- 讀者：會操作 Home Assistant Apps，但不需要會寫程式。
- 語言：台灣繁體中文；以「你」稱呼讀者，不使用 emoji。
- 每章：8–12 個 section；每個 section 要有 `id`、`data-nav`，每個 h2 要有已定義的 `data-icon`。
- 元件：只使用 `steps`、`callout`、`data-table`、`code-block`、`details.faq`、`figure.shot`。
- 安全：授權 URL、Tunnel token、憑證、hostname、Tunnel ID、IP 與完整 Logs 都視為敏感資料。
- 變更：必須明確說明 Save & Restart 會寫入 Supervisor options 並重新啟動 App；Restart Add-on 也會中斷 Tunnel。
- 模式：local-managed 與 remote-managed 的管理責任不可混寫；token 模式下 local options 會被忽略。
- 截圖：Browserless 只做唯讀導覽，不點 Save、Restart、Authorize、Delete 或 Download。圖片須先人工檢查與遮罩。
- 事實來源：優先使用 WOOWTECH 套件 README/DOCS、Cloudflare Developers 與 Home Assistant 官方文件。

修改後執行：

```bash
node scripts/build_nav.js
node scripts/build_nav.js --check
node scripts/check_links.js
```
