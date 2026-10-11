# 07｜AI Agent 完整架構 V4.1：Harness → Agent → 核心循環 → Hooks

> **一句話**：**Harness 管整體運作，Agent 負責解決任務**；Agent 內部跑 Think → Act → Action Input → Observe 的循環，透過 Skill → Tool → MCP 動手；**Hooks 是 Harness 在生命週期特定時間點插進來的檢查點**，不是 Agent 流程的一步。
>
> 來源：`ai_agent_architecture_v4_1.html`（使用者提供）｜本地：[`references/ai_agent_architecture/ai_agent_architecture_v4_1.html`](../references/ai_agent_architecture/ai_agent_architecture_v4_1.html)（可直接用瀏覽器開，點各方塊展開說明，適合上課投影）
>
> 建議放在 [01 什麼是 Harness](01-what-is-a-harness.md) 之後、[02 本機 Harness](02-local-harness-adaptive-loop.md) 之前講；Hooks 段落接 [05 Claude Code Mod Hook 流程](05-claude-code-mod-hook-flow.md)。

---

## 1. 三層結構總覽

```mermaid
flowchart TB
    subgraph L1["Layer 1｜HARNESS：最外層控制與執行框架"]
        direction LR
        O[Orchestration<br/>任務／Agent／Skill 調度]
        P[Policy & Guardrails<br/>權限、安全、Human Gate]
        R[Runtime<br/>Session／Sandbox／Context]
        E[Eval · Trace · Logs<br/>評估、追蹤與稽核]
    end
    subgraph L2["Layer 2｜AGENT：處理任務的智慧代理"]
        G[🎯 User Goal] --> PL[1. Planner] --> RS[2. Reasoning]
        MEM[🧠 Memory<br/>短期／工作／長期] -- 提供上下文 --> L3
        subgraph L3["Layer 3｜Agent 核心循環"]
            T[① Think] --> A[② Act] --> AI[③ Action Input] --> OB[④ Observe] --> T
        end
        RS --> L3
        A -- Act → Skill --> SK[🧩 Skill<br/>這類任務怎麼做]
        SK -- 編排／呼叫 --> TL[🔧 Tool<br/>真正執行動作]
        TL -- 外部連接 --> MCP[🔌 MCP]
        OB <-.結果.- TL
        L3 --> RF[♻️ Reflection / Evaluation]
        RF -. Feedback Loop .-> PL
        RF --> FA[✅ Final Answer]
        RF --> AR[📦 Artifact]
    end
    L1 --- L2
```

## 2. Layer 1：Harness 四大職責

| 元件 | 負責什麼 |
|---|---|
| **Orchestration** | 任務怎麼拆、交給哪個 Agent／Skill／Tool；失敗後重試、fallback、轉交或停止 |
| **Policy & Guardrails** | 權限、安全、資料邊界、Human Gate、工具限制、失敗政策 |
| **Runtime** | session、sandbox、context、狀態與運算資源（Agent 的執行環境） |
| **Eval · Trace · Logs** | 保存執行軌跡、工具呼叫、錯誤、成本與結果，用於品質評估與除錯 |

> 對照 [01](01-what-is-a-harness.md) 的六元件：Orchestration ≈ 規劃控制＋路由；Policy ≈ 權限防護；Runtime ≈ 脈絡＋狀態；Eval/Trace ≈ 驗證與可觀測性。

## 3. Layer 2：Agent

| 元件 | 重點 |
|---|---|
| 🎯 **User Goal** | 整個系統的起點；Planner、Reasoning、Skill、Tool 都服務它，**不是為了用某個工具而硬套流程** |
| 1. **Planner** | 把目標拆成可執行步驟；**遇到新 Observation 可能重新規劃**，不只在開頭跑一次 |
| 2. **Reasoning** | 依 Goal、Memory、狀態、限制、Observation 判斷下一步策略 |
| 🧠 **Memory** | 不是孤立資料庫；**持續**把短期上下文、工作狀態、長期資訊餵給 Reasoning 與核心循環 |

## 4. Layer 3：Agent 核心循環

**Think → Act → Action Input → Observe → Think ↻**

| 步驟 | 做什麼 | 課堂例子（Claude Code） |
|---|---|---|
| ① Think | 讀狀態與上下文，形成下一步決策 | 「要先找出 bug 在哪個檔案」 |
| ② Act | 決定做什麼：直接呼叫 Tool，或先選 Skill 引導後續 | 決定用 Grep |
| ③ Action Input | 自然語言決策 → 結構化輸入（query、JSON、路徑、參數） | `{ pattern: "isPaused", path: "hooks/" }` |
| ④ Observe | 取得 Tool／MCP／環境的回傳，送回下一輪 Think | 讀到搜尋結果 |

## 5. 能力層：Skill → Tool → MCP

| 層 | 定義 | 易混淆點 |
|---|---|---|
| 🧩 **Skill** | 封裝「某類任務應該怎麼做」的程序、知識、規則、工作流（如文獻分析、簡報製作）；**比單一 Tool 高階** | 對照 [03](03-eduharness-skills-workflow.md)：eduHarness 的 Skill package |
| 🔧 **Tool** | 真正執行外部操作：搜尋、讀寫檔案、分析、執行程式、寄訊息 | Skill 會**編排／呼叫** Tool |
| 🔌 **MCP** | Model Context Protocol：Host／Agent 以標準方式連接外部 Tools、Resources、Services | **MCP 是一種連接方式，不代表所有 Tool 都必須走 MCP** |

## 6. 🪝 Hooks：Harness 對生命週期的介入點（重點）

> 原文：「Hook **不是** Agent 固定流程的一步，而是在特定事件發生時插入**檢查、轉換、紀錄或治理**邏輯。」

```mermaid
flowchart LR
    S([開始]) -->|Pre-Agent| LOOP
    subgraph LOOP[Agent 執行中]
        direction LR
        TH[Think/Act] -->|Pre-Tool| TOOL[Tool 執行] -->|Post-Tool| OBS[Observe]
        TOOL -. 失敗 .->|Error Hook| ERR[重試/fallback/停止]
        CTX[(Context 快滿)] -->|Pre-Compact| CMP[壓縮]
    end
    LOOP -->|Post-Agent| END([完成])
```

| Hook | 時機 | 典型用途 |
|---|---|---|
| **Pre-Agent** | Agent 啟動前 | 載入 context、驗證權限、準備環境、套用政策 |
| **Pre-Tool** | Tool 執行前 | 參數驗證、安全檢查、權限確認、**Human Gate** |
| **Post-Tool** | Tool 執行後 | 驗證結果、整理輸出、記錄 log、壓縮內容 |
| **Error Hook** | 發生異常 | 重試、fallback、切換工具、通知使用者、停止 |
| **Pre-Compact** | Context 壓縮前 | 保存重要狀態、摘要必要資訊（原文：是否存在取決於 Harness 實作） |
| **Post-Agent** | 任務完成後 | 最終驗證、寫紀錄、輸出後處理、觸發後續任務 |

### 對照 Claude Code（講到這裡可以接第 05 課）

| 本課概念 | Claude Code `settings.json` hooks | Claude Code function hooks（mod） | 證據 |
|---|---|---|---|
| Pre-Agent | `SessionStart`、`UserPromptSubmit` | `session.start`、`prompt.submit` | ✅ mod 事件見 [05](05-claude-code-mod-hook-flow.md) 原始碼 |
| Pre-Tool | `PreToolUse` | — | ✅ settings hooks；mod 對應事件本課未查證 |
| Post-Tool | `PostToolUse` | — | ✅ settings hooks |
| Error Hook | 依版本（如工具失敗事件） | — | ⚠️ 依 Claude Code 版本，未逐一查證 |
| Pre-Compact | `PreCompact` | — | ✅ settings hooks |
| Post-Agent | `Stop`、`SubagentStop`、`SessionEnd` | — | ✅ settings hooks |

> 第 05 課的 prompt-optimizer 就是一個 **Pre-Agent 類 hook**：在 prompt 送進 Agent 前插入隱藏 `context`（轉換），且只處理人打的字（治理）。

## 7. Reflection 與輸出

- **♻️ Reflection / Evaluation**：檢查結果是否符合 User Goal；不足就修正策略、換 Skill、換 Tool，甚至**回到 Planner**。
- **Feedback Loop**：可回到 Planner、Reasoning 或核心循環，**不是只能一路往下**。
- **輸出兩種**：✅ **Final Answer**（自然語言回覆）／📦 **Artifact**（網頁、簡報、文件、程式、圖表、資料檔等可持續使用的成果）。

## 8. 和 eduHarness 系列的對應

| V4.1 概念 | eduHarness 本機 Harness（[02](02-local-harness-adaptive-loop.md)） |
|---|---|
| Orchestration | route-plan、dispatch、fallback |
| Policy & Guardrails / Human Gate | user-authority、安全敏感節點不進 Codex |
| Planner + Reflection → 回到 Planner | verify → replan（只重規劃受影響路徑） |
| Memory | Brain（CONSULT-before-act、error-log 回寫） |
| Skill → Tool | Skill resolution → runtime adapters |
| Eval · Trace · Logs | State 紀錄、verifier budget |

## 9. 圖例（原圖配色）

🔵 控制／規劃　🟢 Context／Memory　🟣 Skill／能力　🟠 Tool／外部連接　🔴 Reflection／回饋

## 10. 課堂提問

1. Hook 和 Tool 都能「做事」，差在哪？（提示：誰觸發、是否在 Agent 流程內）
2. 為什麼 Human Gate 最適合放在 **Pre-Tool**，而不是 Post-Tool？
3. 「所有 Tool 都是 MCP」——這句話哪裡錯？
4. 如果 Planner 只在開頭跑一次，遇到什麼情況會失敗？
