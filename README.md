# llm_teach｜跟 AI 一起工作：給老師的四單元課程

把 bai-collab 各 repo 中與 **LLM／Agent Harness／Claude Code** 相關的內容，整理成一門由淺入深的課。
**網站版（含動畫）：<https://bai-collab.github.io/llm_teach/>**
**遊戲版：<https://bai-collab.github.io/llm_teach/world/>**（操控 3D 老師走過四座島，每座島對應一個單元）

## 🧭 課程地圖

```text
[單元一] 認識 AI 協作｜所有老師｜約 15 分鐘
  動畫：老師當導演 → 教師儀表板 → 闖關教材（2D＋3D）
  │
  ▼
[單元二] 為什麼要這樣管 AI｜觀念｜約 30 分鐘
  講義 01 什麼是 Harness → 動畫：為什麼要換家審查（3D）→ 講義 07 Agent 架構
  │
  ▼
[單元三] 本工作區怎麼做｜實務｜約 40 分鐘
  動畫：本工作區的 Harness → 講義 02 本機 Harness → 03 eduHarness Skill → 04 Nooa 雲端版
  │
  ▼
[單元四] 動手改造工具｜進階・開發者｜約 40 分鐘
  講義 05 Claude Code Mod Hook → 06 延伸專案
```

講義編號沿用建立時的順序（01～07），上課順序以這張地圖為準；每篇講義開頭都有「上一步／下一步」導覽。

### 單元一　認識 AI 協作（所有老師）

**學完能說出**：老師在 AI 協作裡扮演導演；AI 可以加快速度、協助發想、分析、批判、整理。

| 步驟 | 內容 | 形式 |
|---|---|---|
| 1 | [老師當導演](https://bai-collab.github.io/llm_teach/animations/teacher-as-director/)：AI 五種角色與備課流程 | 動畫 123 秒 |
| 2 | [教師儀表板導覽](https://bai-collab.github.io/llm_teach/animations/teacher-dashboard/)：看懂全班作答，再請 AI 分析 | 動畫 60 秒 |
| 3 | [闖關教材製作](https://bai-collab.github.io/llm_teach/animations/quest-material/)：用 Claude Code 做出 2D＋3D 關卡 | 動畫 92 秒 |

**課堂提問**：你下一個單元，最想請 AI 扮演五種角色中的哪一種？為什麼？

### 單元二　為什麼要這樣管 AI（觀念）

**學完能說出**：模型外面為什麼需要一層 Harness；為什麼同家族做的要交給不同家族審查。

| 步驟 | 內容 | 形式 |
|---|---|---|
| 1 | [01 什麼是 Harness](lessons/01-what-is-a-harness.md)：上下文、工具、護欄、狀態、驗證 | 講義 |
| 2 | [為什麼要換家審查](https://bai-collab.github.io/llm_teach/animations/review-landscape/)：答案地形、局部解、盲點 | 動畫 100 秒（3D） |
| 3 | [07 AI Agent 架構 V4.1](lessons/07-ai-agent-architecture-v4-1.md)：Harness → Agent → 核心循環 → Hooks | 講義（附互動圖） |

**課堂提問**：你自己檢查自己的作業時，最容易漏掉什麼？換別人看會不同嗎？

### 單元三　本工作區怎麼做（實務）

**學完能說出**：一件任務從分類、路線圖、老師核准、派工到驗證的完整流程，以及 Skill 怎麼讓流程可重複。

| 步驟 | 內容 | 形式 |
|---|---|---|
| 1 | [本工作區的 Harness](https://bai-collab.github.io/llm_teach/animations/harness-tour/)：十段規則總覽 | 動畫 110 秒 |
| 2 | [02 本機 Harness](lessons/02-local-harness-adaptive-loop.md)：Adaptive Loop、Route Plan、分工、驗證預算 | 講義 |
| 3 | [03 eduHarness Skill](lessons/03-eduharness-skills-workflow.md)：Skill 套件與用途 → 工作流程 | 講義 |
| 4 | [04 eduHarness_Nooa](lessons/04-eduharness-nooa-cloud-registry-v3.md)：雲端版與 Registry v3 | 講義 |

**課堂提問**：你的備課流程中，哪一步最需要「老師核准」才能往下走？

### 單元四　動手改造工具（進階・開發者）

**學完能說出**：Hook 怎麼在事件管線中插入檢查；還有哪些 LLM 專案可以拿來當案例。

| 步驟 | 內容 | 形式 |
|---|---|---|
| 1 | [05 Claude Code Mod Hook 流程](lessons/05-claude-code-mod-hook-flow.md)：prompt-optimizer 拆解 | 講義（附練習） |
| 2 | [06 延伸專案](lessons/06-related-llm-projects.md)：瀏覽器端模型、教師工作台等 | 講義 |

**課堂提問**：如果要寫一個 hook 擋住你最怕 AI 犯的錯，你會擋什麼？

### 三種上課路線

- **只有一堂課（50 分鐘）**：單元一的動畫 1 → 單元二全部 → 單元三的動畫 1。
- **教師研習（半天）**：單元一 → 單元二 → 單元三（講義 04 可只講 §3 Human Gate）。
- **開發者工作坊**：單元二的講義 07 §6（Hooks）→ 單元三的講義 02 → 單元四全部。

## 🔎 快速查找：我要講…（依主題）

| 我要講… | 看這篇 | 關鍵字 |
|---|---|---|
| Harness 是什麼？跟模型差在哪？ | [01 什麼是 Harness](lessons/01-what-is-a-harness.md) | context、tools、guardrails、state、verification |
| Agent 完整架構：Harness／Agent／核心循環三層 | [07 AI Agent 架構 V4.1](lessons/07-ai-agent-architecture-v4-1.md) §1–§4 | Orchestration、Planner、Think→Act→Observe |
| Skill、Tool、MCP 差在哪 | [07](lessons/07-ai-agent-architecture-v4-1.md) §5 | Skill 編排 Tool、MCP 是連接方式 |
| **Hooks 生命週期介入點（Pre-Agent / Pre-Tool / Post-Tool…）** | [07](lessons/07-ai-agent-architecture-v4-1.md) §6 | 對照 Claude Code hooks |
| Reflection 與回饋迴圈、Final Answer vs Artifact | [07](lessons/07-ai-agent-architecture-v4-1.md) §7 | Feedback Loop |
| AI 任務怎麼一步步跑（分類→規劃→核准→執行→驗證） | [02 本機 Harness](lessons/02-local-harness-adaptive-loop.md) §2 | adaptive loop、11 blocks |
| Route Plan 是什麼、每個節點要寫什麼 | [02](lessons/02-local-harness-adaptive-loop.md) §3 | objective、depends_on、fallback、verifier |
| Claude / Codex / agy 怎麼分工、怎麼派工 | [02](lessons/02-local-harness-adaptive-loop.md) §5 | 腦／手／眼、codex-rescue、advisory |
| 驗證要做多少？「誰做的不由自己審」 | [02](lessons/02-local-harness-adaptive-loop.md) §6 | Simple / Standard / Complex、verifier budget |
| 使用者權限為什麼最高 | [02](lessons/02-local-harness-adaptive-loop.md) §1、§5 | user-authority、Human Gate |
| Skill 是什麼、和 prompt 差在哪 | [03 eduHarness Skills](lessons/03-eduharness-skills-workflow.md) §1 | Registry、按需載入、package hash |
| 教育用 Skill 清單（教案、命題、遊戲…） | [03](lessons/03-eduharness-skills-workflow.md) §2 | 17 Skills |
| 一個需求怎麼變成 Skill 工作流程 | [03](lessons/03-eduharness-skills-workflow.md) §3–§5 | Skill resolution、dependency 條件、PDF→教案→題庫 |
| eduHarness 雲端版（ChatGPT / Gemini） | [04 eduHarness_Nooa](lessons/04-eduharness-nooa-cloud-registry-v3.md) | Descriptor、ENV、Notion、Dropbox |
| Official / Local 雙層 Registry | [04](lessons/04-eduharness-nooa-cloud-registry-v3.md) §4 | Registry v3、snapshot、Effective Routing View |
| 四代架構比較表 | [04](lessons/04-eduharness-nooa-cloud-registry-v3.md) §6 | 基本 → 本機 → eduHarness → Nooa |
| **Claude Code mod / plugin 怎麼寫** | [05 Claude Code Mod Hook 流程](lessons/05-claude-code-mod-hook-flow.md) | plugin.json、hooks.json、register.ts |
| **hook 事件流程（session.start / command.run / prompt.submit）** | [05](lessons/05-claude-code-mod-hook-flow.md) §3–§4 | middleware、`next(e)`、context 注入 |
| plugin 狀態保存與測試 | [05](lessons/05-claude-code-mod-hook-flow.md) §5–§6 | atom、claude-code/testing |
| 瀏覽器端小模型、離線去個資化、教師工作台 | [06 其他 LLM 專案](lessons/06-related-llm-projects.md) | WebLLM、Transformers.js、teacher_UI |
| **跟老師介紹 AI 怎麼用（教師研習開場動畫）** | [老師當導演（網頁動畫）](https://bai-collab.github.io/llm_teach/animations/teacher-as-director/)｜[原始檔](animations/teacher-as-director/index.html) | AI 五種角色、四處找資料、路網圖整理、換人檢查、錯誤筆記本 |
| **教師儀表板怎麼用（作答紀錄＋AI 分析）** | [教師儀表板導覽（網頁動畫）](https://bai-collab.github.io/llm_teach/animations/teacher-dashboard/)｜[原始檔](animations/teacher-dashboard/index.html) | 找學生、作答時間軸、最後有效成績、按送出才呼叫 AI、引用回查 |
| **老師用 Claude Code 做闖關教材（2D＋3D）** | [闖關教材製作（網頁動畫）](https://bai-collab.github.io/llm_teach/animations/quest-material/)｜[原始檔](animations/quest-material/index.html) | 下指令、先出規格再核准、2D 關卡作答、three.js 地形與淹水情境、三道驗收 |
| **為什麼同家族做的要給不同家族審（局部解）** | [為什麼要換家審查（3D 動畫）](https://bai-collab.github.io/llm_teach/animations/review-landscape/)｜[原始檔](animations/review-landscape/index.html) | 答案地形（比喻）、最佳解與局部解、同家族盲點相近、反例跳出局部解 |
| **本工作區的 Harness 怎麼運作** | [本工作區的 Harness（2D 動畫）](https://bai-collab.github.io/llm_teach/animations/harness-tour/)｜[原始檔](animations/harness-tour/index.html) | 分類、翻筆記、路線圖、老師核准、派工、review-loop、錯誤紀錄、交接 |

## 🗂️ 目錄

```text
llm_teach/
├─ index.html                        # 網站首頁（課程地圖＋動畫入口）
├─ world/index.html                  # 遊戲版：AI 協作群島（three.js，四座島對應四單元）
├─ README.md                         # ← 你在這裡：課程地圖與主題索引
├─ animations/                       # 教學動畫（單檔 HTML，GitHub Pages 可直接播放）
│  ├─ teacher-as-director/index.html # 老師當導演：跟 AI 一起備課（123 秒・10 段，成果牆可點開作品）
│  ├─ teacher-dashboard/index.html   # 教師儀表板導覽（60 秒・6 段，假資料）
│  ├─ quest-material/index.html      # 闖關教材製作（92 秒・8 段，2D＋three.js 3D）
│  ├─ review-landscape/index.html    # 為什麼要換家審查（100 秒・8 段，3D 答案地形）
│  └─ harness-tour/index.html        # 本工作區的 Harness（110 秒・10 段，2D）
├─ lessons/                          # 講義（Markdown，GitHub 上可直接看 Mermaid 圖）
│  ├─ 01-what-is-a-harness.md
│  ├─ 02-local-harness-adaptive-loop.md
│  ├─ 03-eduharness-skills-workflow.md
│  ├─ 04-eduharness-nooa-cloud-registry-v3.md
│  ├─ 05-claude-code-mod-hook-flow.md
│  ├─ 06-related-llm-projects.md
│  └─ 07-ai-agent-architecture-v4-1.md
└─ references/                       # 原始資料快照（離線可用）
   ├─ ai_agent_architecture/         # AI Agent 完整架構 V4.1 互動 HTML
   ├─ eduHarness_Nooa/               # harness-map.html、architecture.html、流程圖 png
   └─ claude_code_mod/               # prompt-optimizer plugin 原始碼＋marketplace.json
```

## 🔗 原始來源

| 來源 | 線上 | 本地快照 |
|---|---|---|
| 治理 Harness 全景圖 | [harness-map.html](https://bai-collab.github.io/eduHarness_Nooa/docs/harness-map.html) | [references/eduHarness_Nooa/harness-map.html](references/eduHarness_Nooa/harness-map.html) |
| Harness → eduHarness → Nooa 架構視覺化 | [harness-eduharness-nooa-architecture.html](https://bai-collab.github.io/eduHarness_Nooa/docs/harness-eduharness-nooa-architecture.html) | [references/eduHarness_Nooa/harness-eduharness-nooa-architecture.html](references/eduHarness_Nooa/harness-eduharness-nooa-architecture.html) |
| eduHarness_Nooa 流程圖 | [repo docs/](https://github.com/bai-collab/eduHarness_Nooa/tree/main/docs) | [references/eduHarness_Nooa/eduHarness_Nooa-flow.png](references/eduHarness_Nooa/eduHarness_Nooa-flow.png) |
| AI Agent 完整架構 V4.1 | （使用者提供） | [references/ai_agent_architecture/ai_agent_architecture_v4_1.html](references/ai_agent_architecture/ai_agent_architecture_v4_1.html) |
| claude_code_mod | [bai-collab/claude_code_mod](https://github.com/bai-collab/claude_code_mod) | [references/claude_code_mod/](references/claude_code_mod/) |

快照版本：eduHarness_Nooa `dfd42ae`、claude_code_mod `e1ee8a0`（2026-10-11 擷取）。原 repo 更新後，以線上版本為準。

## ⚠️ 講課時注意

- 各來源的 Skill 數量不一致（17 / 27 / 40），隨版本成長；以 `skill-registry.json` 為準。
- Nooa README 仍寫 v0.2 / Registry v2，但 active Distribution 已是 v0.3 / Registry v3。
- Claude Code function hooks 是 early access API，介面可能變動。
- 原文中的模型版本名稱（如 Opus 4.8、gpt-5.6-luna）照原文引用，可能已更新。
