---
name: text-to-creature
description: 文字造獸（text → game-ready 3D creature）。當使用者要「用一句話／一段描述生成一隻可用於遊戲的 3D 生物」時觸發——產生帶骨架、動畫、頂點著色的 glTF/GLB，走 anyCreature 引擎（程序化、無美術資產、engine 零依賴）。核心紀律：一句下單＋最多兩個澄清問題 → 寫 ACS JSON spec → `node engine/cli.js` 編 GLB → 用「瀏覽器 render + 不知情 subagent 盲讀剪影」做免裝品管閘（設計者不能自評）→ 交付 GLB＋離線 viewer。動畫要順：引擎只有線性內插，須加密關鍵影格假造 easing、驅動關節根、子關節做跟隨、端點回原點無縫循環。反觸發：2D／DOM／CSS 動畫、皮影戲（用 shadow-movie）、改既有 mesh 檔、單純美術分鏡（visual-art-storyboard）、或不需要 3D 生物的任務。
metadata:
  type: reference
---

# 文字造獸（text-to-creature）

把「一句生物描述」變成一隻**遊戲可用的 3D 生物 GLB**（帶骨架＋動畫＋頂點色＋離線 viewer），走 [anyCreature](https://github.com/Ariescar/anyCreature) 引擎：純程序化、不吃任何美術資產、**核心引擎零 npm 依賴**。

此 skill 是**流程與品管紀律**，不是產生器；幾何由 anyCreature 的 `engine/` 編出、品管靠「瀏覽器 render + 盲讀 subagent」替代官方的 Playwright/Python 那套。價值在：① 引導出可編譯的 spec；② 用免裝盲讀閘客觀判「這隻讀不讀得出來」；③ 讓動畫在只有線性內插的引擎上看起來順。

## 觸發 / 反觸發

- **觸發**：文字造獸、一句話生成 3D 生物、程序化生物、anyCreature、make a creature、遊戲用怪物/動物 GLB。
- **反觸發（優先）**：2D／DOM／CSS 動畫；皮影戲 → `shadow-movie`；把既有 mesh/貼圖檔改一改；純角色/場景分鏡美術 → `visual-art-storyboard`；一張圖轉 3D 展示頁 → `image-to-3d-scene`；不需要 3D 生物的任務。

## 免裝架構（本 skill 的核心賣點）

anyCreature 的核心是「spec → 幾何數字」，**畫不畫像素分兩層**：

| 步驟 | 官方做法 | 本 skill 免裝做法 |
|---|---|---|
| 編 GLB | `node engine/cli.js`（node 內建 fs/path，零依賴） | 同 ✅ 免裝 |
| 剪影 render | Playwright + Chromium（要 npm + 下載瀏覽器） | 瀏覽器分頁 + CDN three.js（`assets/silhouette_gate.html`） |
| 剪影度量 | Python numpy/pillow | 瀏覽器 canvas `getImageData`，或盲讀者目測 |
| 盲讀品管閘 | `judge.mjs` 模型判讀 | fresh-context **subagent** 盲讀 |

→ 整條「造生物＋品管」可零本地安裝，只用 node、一個可驅動的瀏覽器、一個 Claude subagent。

## 流程

### 0. 準備 engine（一次性）
`engine/` 零依賴，不需安裝，只需取得一次。優先用本機既有 clone；否則：
```bash
git clone --depth 1 https://github.com/Ariescar/anyCreature.git
```
（clone 不是「安裝套件」；engine 只 `require('fs')`/`require('path')`。官方 `setup.sh` 裝的 three/playwright/python 只給官方品管用，本 skill 不需要。）

### 1. 下單與訪談
接一句生物描述（"a menacing mountain giant"）。**最多問兩個**會改變造型的澄清問題（體型比例？招牌部位？氣質偏兇/萌？），問完就做。

### 2. 寫 ACS spec
依 `references/acs-quickref.md` 寫 JSON：`joints → chains → volumes → parts → shading → animations`。關節即點、引擎自己推理比例；雙側用 `mirror`。先求**剪影可辨識**再談細節。

### 3. 編譯（免裝）
```bash
node engine/cli.js spec.json out/creature.glb
```
看輸出 JSON 的 `"checks":"all green"` 與 `"contract":"ok"` 才算過。

### 4. 免裝盲讀品管閘（設計者不能自評）
1. 用 `assets/silhouette_gate.html?glb=<你的GLB>` 在瀏覽器 render 四視角**純黑剪影**、存成 PNG。
2. 開一個**完全不知情的 subagent**（只給 4 張圖、不提你想做什麼），問「這是什麼動物」。
3. 認得出＝Gate 1 過；認錯或認不出＝剪影未過，**回頭把剪影做更大膽/更清楚**，別自己說「這看起來就是 X」。後續每輪只能更有辨識度、不可退步（Gate 2）。

### 5. 動畫（要順）
引擎只有**線性內插**，所以：
- **加密關鍵影格**：每個往復用正弦取樣 ~8–12 點，而非只 `[0, 峰值, 0]`——這是「不 robotic」的最大槓桿。
- **驅動關節根、子關節做跟隨**：關節階層會自動帶動子關節；子關節只加小幅、相位延後的 follow-through。
- **無縫循環**：每條 track `t=0` 與 `t=1` 同值。
- 軸向慣例（照 wolf 範例）：尾巴左右擺＝`ry`；頭上下點＝`rx`；腿彎＝`rx`（`LFront*/LBack*`）；四足對角步態用 `mirror_phase:0.5`。
- schema 與更多細節見 `references/acs-quickref.md`。

### 6. 交付
- `out/creature.glb`（標準 glTF 2.0，可進任何 three.js / `<model-viewer>` / Babylon）。
- 用 `assets/viewer.html?glb=<GLB>&clip=<clipName>` 給離線預覽；要單檔可雙擊版就把 GLB base64 內嵌進 viewer。

## Model 路由（依專案慣例）

- 計畫、品管判斷、盲讀閘裁決＝主 session（Opus）。
- 大量寫 spec／調動畫這類粗工可派 `codex:codex-rescue`（gpt-6-luna max：任務文字帶 `--model gpt-6-luna`，不覆寫 effort）；**在 C: 類可寫路徑工作，別讓它寫進唯讀/同步磁碟**。
- 任何安全敏感（憑證、外部 mutation）永不進 Codex。

## 邊界（誠實）

- 這是 **3D 骨骼 clip 播放**，不是 2D/DOM 動畫，也不做 morph target／IK／物理。
- 「造型美不美」是 spec 的 geometry/shading 決定，**動畫改不了**；要更好看得改 spec 的 volumes/silhouette/配色。
- 盲讀閘替代了官方 render 那套，但**不等於**官方的像素級 mask 度量；要嚴格數值就自己在 canvas 算 bounding box/質量分佈。
