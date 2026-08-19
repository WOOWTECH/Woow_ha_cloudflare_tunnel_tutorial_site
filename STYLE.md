# 撰寫新章節的規格書（給內容作者 agent）

這是《Home Assistant 新居入住指南》的房規。**任何新章節都必須完全遵守**，否則風格會跟現有 12 章脫節。

---

## 0. 讀者與語氣

- **讀者**：國三～高中生，零程式背景，只會基本電腦操作。家長／小型辦公室行政也在射程內。
- **語氣**：極度白話、直接、有「把空間升級」的情境感。像學長帶你操作，不是軟體手冊。
- **禁止**：翻譯腔、「本章節將介紹」、「綜上所述」、行銷詞。
- **語言**：繁體中文（台灣用語）。技術名詞第一次出現時中英並陳，例如「實體（Entity）」，之後用中文。
- **每個抽象概念都要落地成一個具體家庭情境**（客廳、房間、玄關、陽台、辦公室茶水間）。

---

## 1. 檔案骨架（必須一字不差照抄這個結構）

```html
<!doctype html>
<html lang="zh-Hant">
<head>
</head>
<body>
<div class="layout">
  <aside class="sidebar"></aside>

  <main class="content">
    <div class="chapter-header">
      <div class="kicker">第 N 章</div>
      <h1>章節標題</h1>
      <p class="lead">兩到三句話：這章解決什麼問題、讀完你會多出什麼能力。</p>
    </div>

    <section id="why" data-nav="為什麼要學這個">
      <h2 data-icon="why">為什麼要學這個</h2>
      ...
    </section>

    <!-- 更多 section -->

    <div class="pager"></div>
  </main>
</div>
<script src="assets/js/toc.js"></script>
</body>
</html>
```

**重要**：`<head>`、`<aside class="sidebar">`、`<div class="pager">`、頁尾 **留空就好**，`scripts/build_nav.js` 會自動產生。你只要負責 `chapter-header` 與所有 `<section>`。

### section 的鐵則

- 每個 `<section>` 都必須同時有 `id`（英數底線）與 `data-nav`（側欄顯示的短標題，**8 個中文字以內**）。
- `<h2>` 必須帶 `data-icon`，值從下面「可用圖示」清單挑。
- `data-nav` 是短標題，`<h2>` 內文可以更長更完整，兩者不必相同。

### 可用圖示 data-icon

`why` `concept` `what` `steps` `plan` `now` `done` `assign` `rename` `labels` `persons` `tabs` `tips` `app` `login` `test` `advanced` `faq` `troubleshoot` `url` `enter` `profile` `companion` `modes` `auto` `blueprints` `restore` `location` `remote` `hacs` `addons` `warning` `entity_id_trap` `theme` `integration` `protocol` `todo` `energy` `history` `ai` `docker` `network` `records` `hardware` `security` `compare` `cost`

用不在清單裡的值會顯示成空白方塊。

---

## 2. 可用的內容元件（只能用這些）

### 步驟（最重要的元件，動手章節一定要有）

```html
<ol class="steps">
  <li>
    <h3>打開設定頁</h3>
    <p>說明文字。</p>
  </li>
  <li>
    <h3>第二步</h3>
    <p>說明文字。</p>
  </li>
</ol>
```

### 提示框（四種）

```html
<div class="callout"><strong>觀念：</strong>中性說明。</div>
<div class="callout tip"><strong>提示：</strong>省時間的小技巧。</div>
<div class="callout warn"><strong>注意：</strong>會踩到的坑。</div>
<div class="callout danger"><strong>危險：</strong>會弄壞系統或有資安風險。</div>
```

### 常見問題（每章結尾必備，至少 4 則）

```html
<details class="faq">
  <summary>問題一句話</summary>
  <div class="body">回答，可以含 <code>行內程式碼</code>。</div>
</details>
```

### 表格（比較、對照、速查一律用表格）

```html
<table class="data-table">
  <thead>
    <tr><th>欄位</th><th>說明</th><th>什麼時候用</th></tr>
  </thead>
  <tbody>
    <tr><td><code>light</code></td><td>燈</td><td>調亮度、色溫</td></tr>
  </tbody>
</table>
```

**注意**：用 `class="data-table"`，不要寫 inline style。

### 程式碼區塊（YAML / 範本 / 指令）

```html
<pre class="code-block"><code>alias: 日落開燈
triggers:
  - trigger: sun
    event: sunset
actions:
  - action: light.turn_on
    target:
      entity_id: light.living_room</code></pre>
```

行內用 `<code>light.living_room</code>`、按鍵用 `<kbd>Ctrl</kbd>`。

### 絕對不要用

- **`<img>` 或 `<figure class="shot">`** —— 新章節沒有截圖，引用不存在的圖片會讓 CI 的連結檢查失敗。需要視覺輔助就用表格或 `<ol class="steps">` 拆解。
- inline `style=` 屬性（`chapter-index` 那種既有例外除外）。
- 自己發明的 class。

---

## 3. 章節結構模板

每一章至少要有這幾個 section，順序固定：

1. `why` — 為什麼要學這個（痛點 → 學完的能力）
2. 一到兩個概念 section（`concept` / `what`）—— 先把名詞和心智模型講清楚
3. `steps` — 動手做（`<ol class="steps">`，最少 4 步，每步都寫清楚點哪裡）
4. 二到五個主題 section —— 這章的肉，用表格、對照、實例填滿
5. `troubleshoot` — 常見卡關（至少 4 條，用 `<ol class="steps">` 或列表）
6. `faq` — 常見問題（至少 4 則 `details.faq`）

**份量要求**：8～14 個 section，成品 HTML 15KB 以上。寧可厚，不要薄。這是「盡量豐富」的專案。

---

## 4. 事實正確性（最重要）

Home Assistant 改版很快，**你的訓練資料八成過時了**。動筆前必須用 WebSearch / WebFetch 查證：

- 官方文件 `https://www.home-assistant.io/docs/`、`https://www.home-assistant.io/integrations/<name>/`
- 官方部落格改版說明 `https://www.home-assistant.io/blog/`

**已知的重要改名（一定要用新說法，並在適當處註明舊名）**：

| 舊說法 | 現在的說法 |
|---|---|
| 服務 Service / `service:` | 動作 Action / `action:` |
| `service_data` | `data` |
| 自動化 YAML 的 `trigger:` / `condition:` / `action:` | `triggers:` / `conditions:` / `actions:` |
| Server Controls / 重新載入 | 開發者工具 → YAML |

其他需要查證的例子：Energy Dashboard 的設定路徑、Assist / conversation agent 的現況、Matter 與 Thread 的支援狀態、Recorder 與 `purge_keep_days` 預設值、備份（Backup）在新版的位置與雲端上傳選項。

**規則**：任何具體的路徑、選單名稱、預設值、版本行為，**查到才寫**；查不到就用比較保守的描述，不要杜撰。文末不要放參考資料清單（站上沒有這個慣例），但事實必須來自查證。

---

## 5. 與既有章節的關係

現有章節與其檔名（可以在文中互相連結，用相對路徑）：

| 章 | 檔名 | 主題 |
|---|---|---|
| 1 | `ch1_login.html` | 登入 HA |
| 2 | `ch2_system_settings.html` | 時區、語言、單位、位置 |
| 3 | `ch3_floors_areas.html` | 樓層與區域 |
| 4 | `ch4_naming_labels.html` | 命名、entity_id、標籤 |
| 5 | `ch5_users.html` | 使用者、Persons、MFA、Zone |
| 6 | `ch6_dashboard.html` | 儀表板編輯、多分頁、檢視類型 |
| 7 | `ch7_notifications.html` | Companion App、通知 |
| 8 | `ch8_first_automation.html` | 自動化三段式、device_id 陷阱、Blueprint |
| 9 | `ch9_backups.html` | 備份與還原 |
| 10 | `ch10_scripts.html` | 腳本、Fields、執行模式 |
| 11 | `ch11_devices.html` | 裝置頁、韌體、停用/隱藏/刪除、Repairs |
| 12 | `ch12_domains.html` | 各 Domain 控制圖鑑 |
| A | `appendix_hacs_addons.html` | Add-on 商店、HACS、遠端連線概觀 |
| B | `appendix_scenes_helpers_groups.html` | 場景、Helper、群組 |

- **不要重複**既有章節已經講完的內容，改成一句話帶過並連結過去：
  `已經在<a href="ch3_floors_areas.html">第 3 章</a>設好區域的話，這裡直接往下看。`
- 你的章節如果是既有章節的延伸，要在 `why` 段明講銜接點。

---

## 6. 交付

把完成的 HTML 寫進 `/tmp/site/<指定檔名>`。**只寫你被指派的那一個檔案**，不要碰 `chapters.json`、CSS、其他章節。

寫完自我檢查：

- [ ] 每個 `<section>` 都有 `id` + `data-nav`，`<h2>` 都有合法的 `data-icon`
- [ ] 沒有任何 `<img>`
- [ ] 表格都是 `class="data-table"`
- [ ] 有 `troubleshoot` 與 `faq` 兩個結尾 section，FAQ 至少 4 則
- [ ] `<head>`、`<aside class="sidebar">`、`<div class="pager">` 都留空
- [ ] 檔案 15KB 以上
- [ ] 所有具體路徑／選單名稱／預設值都查證過
