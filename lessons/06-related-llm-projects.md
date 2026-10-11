# 06｜bai-collab 其他 LLM 相關專案（延伸案例）

> 依「可以拿來講什麼」分類。每個專案標出**教學切入點**，方便直接挑來當課堂案例。
> 整理日期：2026-10-11（依各 repo 當時的 README／檔案結構）。

---

## A. Harness／Agent 治理

| 專案 | 是什麼 | 教學切入點 | 對應課 |
|---|---|---|---|
| [eduHarness_Nooa](https://github.com/bai-collab/eduHarness_Nooa) | eduHarness Cloud 的 Canonical Distribution（ChatGPT Web / Gemini Spark） | Descriptor-first、Registry v3、Human Gate | [04](04-eduharness-nooa-cloud-registry-v3.md) |
| [eduHarness-](https://github.com/bai-collab/eduHarness-) | Local Pluggable Harness（本機版）＋ 教育 Skills | adaptive loop、Route Plan、verifier budget、`AGENTS.md` 規則寫法 | [02](02-local-harness-adaptive-loop.md)、[03](03-eduharness-skills-workflow.md) |
| [eduHarness-docs](https://github.com/bai-collab/eduHarness-docs) | 「eduHarness 架構地圖」單頁網站＋Pixel Art 闖關遊戲範例 | 用視覺化網頁介紹架構 | [03](03-eduharness-skills-workflow.md) |
| [claude_code_mod](https://github.com/bai-collab/claude_code_mod) | Claude Code plugin 集合（prompt-optimizer） | **function hooks 事件管線、context 注入、plugin 測試** | [05](05-claude-code-mod-hook-flow.md) |
| [Codex_Workspace_Presentation](https://github.com/bai-collab/Codex_Workspace_Presentation) | 「Codex Workspace Starter Pack 架構解析簡報」HTML 簡報 | Codex 工作區結構、可直接上課投影 | [02](02-local-harness-adaptive-loop.md)（Codex 角色） |

## B. Skill 套件實例

| 專案 | 是什麼 | 教學切入點 |
|---|---|---|
| [teacher_UI](https://github.com/bai-collab/teacher_UI) | `teacher-workspace-ui` Skill：教師工作台（學生搜尋、作答時間軸、AI 分析助手、集中設定 API KEY / GAS URL / RECORD_TOKEN） | **一個完整 Skill package 的長相**：`SKILL.md`＋`references/`＋`assets/template/`＋`agents/openai.yaml`＋`VERSION`；AI 分析把「觀察／推測／建議／限制」分開呈現；本機摘要預設不呼叫模型，按送出才用真 AI |

## C. 瀏覽器端（離線）模型

| 專案 | 是什麼 | 教學切入點 |
|---|---|---|
| [webLM_repo](https://github.com/bai-collab/webLM_repo) | 三國志 3D 立體繪本（Three.js + GSAP + **WebLLM**） | 用小模型 **SmolLM2-360M 只做意圖分類（semantic router）**，回答走預設腳本 → 「LLM 不一定要負責生成」；需 WebGPU |
| [offline-sanitizer-ner](https://github.com/bai-collab/offline-sanitizer-ner) | 100% 前端離線去個資化（Transformers.js + 量化繁中 BERT-NER + 台灣在地正則） | **送進 LLM 前先去識別化**；神經 NER＋規則混合；`EntityMap` 讓同一人全文一致代換（`林小美 → [姓名A]`） |

## D. 平台規劃／多 Agent 視覺化

| 專案 | 是什麼 | 教學切入點 |
|---|---|---|
| [ptt_teach](https://github.com/bai-collab/ptt_teach) | AI-native 協作簡報／研習平台**規劃文件** | Context Engine + Agent / Skill / Tool / Workflow；Artifact 在 sandboxed iframe 執行；**Context Firewall**；按需檢索而非整份塞進模型 |
| [agent-monitor](https://github.com/bai-collab/agent-monitor) | React + Vite 的多 Agent 模擬監控介面（PixelOffice、AgentGraph、EventTimeline、HiringPanel） | 把多 Agent 協作「看得見」；README 仍是 Vite 範本，需看 `src/` 才知內容 |

> 未納入：`LibreChat`、`osep-judge`、`GeoLibre`、`build-your-own-x`（fork）；遊戲／模擬類 repo 與 LLM 教學關聯低。`ai-office` 為空 repo。私有 repo 未檢視。

---

## 可以怎麼串成一堂課

| 想講的主題 | 建議組合 |
|---|---|
| 「LLM 不等於整個系統」 | [01](01-what-is-a-harness.md) → webLM_repo（小模型只做路由） |
| 「資料安全與隱私」 | offline-sanitizer-ner → [04](04-eduharness-nooa-cloud-registry-v3.md) 可攜性／隱私 → ptt_teach Context Firewall |
| 「怎麼改造 AI 工具本身」 | [05](05-claude-code-mod-hook-flow.md) → [02](02-local-harness-adaptive-loop.md) 使用者權限原則 |
| 「教師如何用 Skill」 | [03](03-eduharness-skills-workflow.md) → teacher_UI 實例 |
