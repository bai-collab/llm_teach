---
name: tri-family-conjecture-swarm
description: Three-model-family conjecturing discussion for critiquing a plan, design, or proposal. Three groups from different model families (e.g. Claude, Codex, Gemini via AGY) each run an internal red/blue adversarial round, then share conclusions across groups; only points where groups reach opposite conclusions go to a bounded inter-group adversarial round, and the facilitator lists positions side by side and leaves unresolved disagreements to the user. Use for 三家臆測討論, 群蜂討論, 組內組間對抗, 雙飛輪討論流程, or requests to have several model families debate and improve a plan. Do not use for single-reviewer code review, for formal acceptance review (use the review loop), or for security-sensitive work.
---
# 三家臆測討論

## 定位

把臆測教學的「組內討論＋組間分享」搬到 AI 身上：三個**不同模型家族**各自成組，組內先紅藍對抗，組間再分享；只有結論相反的點才進行組間對抗。目的不是讓模型投票，而是讓不同家族的盲點互相抵消，最後把分歧原樣交給使用者裁決。

適合改進「還沒動工的計畫書、設計或提案」。它擅長找**方向錯誤與漏掉的情況**，不擅長抓**條文之間的前後矛盾**；後者要在討論完另外送外審（見第 6 節）。

## 觸發與反觸發

- 觸發：三家臆測討論、群蜂討論、組內組間對抗、雙飛輪討論流程、「讓幾家模型一起找漏洞／辯論這份計畫」。
- 不觸發：一般程式碼審查或正式驗收審查（改用工作區的審查迴圈）；只要一家意見；安全敏感工作（認證授權、憑證、加密、漏洞分析一律不交一般外部代理）。

## 1. 開始前要確認（缺一項就停下來問）

1. **題目**：要討論的檔案（附行號），以及「這次要改進的目標」。
2. **代理數量**：預設每組紅藍各 1、共 6 個；使用者另有上限時照使用者的。
3. **差異判準**：預設「同一點結論相反（一組說要、另一組說不要，或方向相反）就算差異大」。
4. **最後裁決**：預設「主持人只統整並列，分歧交使用者裁決」。三家都參與時沒有中立第四家，不能讓主持人自己判輸贏。
5. **執行模式**：長任務先問 AUTO（一路跑完，只在範圍變動或外部變更時停）或 ASK（每階段停一次）。
6. **外傳範圍**：只送題目檔案；送出前掃描，確認沒有秘密與個人資料。

## 2. 分組（每組紅藍各一）

| 組 | 藍隊 | 紅隊 |
|---|---|---|
| Claude 組 | 主持人自己（主 session） | Claude 子代理 |
| Codex 組 | Codex 唯讀呼叫 #1 | Codex 唯讀呼叫 #2 |
| AGY 組 | AGY 唯讀呼叫 #1（指定 Gemini） | AGY 唯讀呼叫 #2 |

- 模型與推理強度依工作區的分工表；**三組強度要對等**，不要讓某一組用低強度。
- 所有外部呼叫都唯讀：Codex 用唯讀沙箱；AGY 用規劃模式＋沙箱，提示詞走標準輸入。
- 主持人同時是 Claude 組藍隊時，**先把自己的主張寫進檔案封存，才去讀任何別組的輸出**；組間對抗也一樣。

## 3. 流程

```text
① 組內討論（三組同時）
   藍隊第 1 輪：提 4–7 條主張（至少 1 條質疑前提）
   紅隊：逐條判 接受／修正／駁回，另提最多 3 條漏掉的問題
   藍隊第 2 輪：逐條回應，輸出固定格式的「組內結論表」
② 組間分享：主持人逐點對照三張結論表
③ 有任何一點結論相反 → 只針對那幾點做組間對抗（每組一位代表，最多 2 輪）
   沒有相反 → 直接統整
④ 統整：共識（標出來源組別與條目）、各組獨有主張、待使用者裁決的分歧
```

- 任務說明範本在 `templates/`：`brief-blue-r1.md`、`brief-red-r1.md`、`brief-blue-r2.md`、`brief-inter-r1.md`。範本內的 `{{SUBJECT}}`、`{{GROUP}}`、`{{CONFLICTS}}` 由主持人填入。
- `scripts/build-prompt.sh` 把範本、上一輪輸出與題目全文串成提示詞檔；`scripts/run-agy.mjs` 以唯讀方式呼叫 AGY 並解析輸出。
- **質疑前提**：藍隊範本要求至少 1 條主張回答「這件事值不值得做、有沒有更簡單的替代做法」。沒有這條，三組會只在題目給的框架裡改良，漏掉最根本的問題（2026-11-20 實跑的盲點）。

## 4. 每次外部呼叫後都要核對

1. 輸出檔真的產生且非空，內容切題、格式符合範本。
2. **實際模型與指定相同**：Codex 看 stderr 的 `model:` 與 `reasoning effort:`；AGY 看 stream-json 第一個 `init` 事件的 `init.model`。
3. **沒有工具步驟**：純討論任務不應讀檔、執行指令或上網；AGY 檢查 `step_update` 的 `step_type` 只有 `user_input` 與 `agent_response`。
4. 不對等或失敗時：保留原輸出存檔、改正後重跑，並在報告記錄原本指定的與實際執行的差異。空回應、逾時都記「未知」，不是登入問題。

## 5. 統整報告格式

1. 過程：各組角色、模型、強度、輪數。
2. 三組共識：每項標優先度（P0–P3）與來源（例：Claude R1、Codex B1、AGY R3）。
3. 組間對抗結果：每個衝突點三組最後的立場。
4. 各組獨有主張（沒有衝突，也沒有被其他組驗證過）。
5. 待使用者裁決的事。
6. 限制：重跑紀錄、主持人身兼參與者可能偏向、沒有中立第四家。

主持人是參與者時，**統整只並列、不判輸贏**；組間對抗後仍相反的點，把雙方理由列給使用者。

## 6. 討論之後

- 依共識與使用者裁決改寫題目檔案時，先備份原檔。
- 改寫完**一定送一次非作者家族的外審**：討論找得到方向錯誤，但抓不到改寫後條文之間的前後矛盾。2026-11-20 實跑時，三組討論後的修訂版仍被外審找出 6 項內部不一致，修正後重審才通過。
- 討論中沒有人給過依據的新數值（門檻、比例、係數），不要由主持人自己填，列為待使用者拍板。

## 停止規則

- 題目、代理上限、差異判準、裁決方式任一項沒定 → 先問。
- 任一組的外部呼叫連續兩次失敗 → 停下回報，不改由主持人代寫該組意見。
- 組間對抗 2 輪後仍相反 → 不再加輪，交使用者裁決。
- 討論過程中發現需要寫檔、執行或上網才能回答 → 停下，另開任務。

## 參考

- `references/run-2026-11-20.md`：第一次實跑的流程數字、踩到的坑與改善建議。
