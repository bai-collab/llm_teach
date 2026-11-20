#!/usr/bin/env bash
# 組出各輪提示詞檔。討論資料夾結構：<dir>/subject-numbered.md、<dir>/<group>/...
# 用法：
#   bash build-prompt.sh init  <dir> <題目檔>                 產生附行號的 subject-numbered.md 與 SHA-256
#   bash build-prompt.sh blue1 <dir> <group> <題目名稱>       → <group>/prompt-blue-r1.md
#   bash build-prompt.sh red   <dir> <group> <題目名稱>       → <group>/prompt-red-r1.md（需要 blue-r1.md）
#   bash build-prompt.sh blue2 <dir> <group> <題目名稱>       → <group>/prompt-blue-r2.md（需要 blue-r1.md、red-r1.md）
# <題目名稱> 會填進範本的 {{SUBJECT}}，例如「計畫書」。
set -euo pipefail
skill="$(cd "$(dirname "$0")/.." && pwd)"
stage="$1"; dir="$2"
fill() { sed "s/{{SUBJECT}}/$1/g" "$2"; }

case "$stage" in
  init)
    awk '{printf "%3d| %s\n", NR, $0}' "$3" > "$dir/subject-numbered.md"
    sha256sum "$3" > "$dir/subject.sha256"
    wc -c "$dir/subject-numbered.md" ;;
  blue1)
    g="$3"; mkdir -p "$dir/$g"
    { fill "$4" "$skill/templates/brief-blue-r1.md"; cat "$dir/subject-numbered.md"; } > "$dir/$g/prompt-blue-r1.md"
    wc -c "$dir/$g/prompt-blue-r1.md" ;;
  red)
    g="$3"
    { fill "$4" "$skill/templates/brief-red-r1.md"; echo; echo "## 藍隊主張"; cat "$dir/$g/blue-r1.md"; echo; echo "---"; echo "## 全文（附行號）"; cat "$dir/subject-numbered.md"; } > "$dir/$g/prompt-red-r1.md"
    wc -c "$dir/$g/prompt-red-r1.md" ;;
  blue2)
    g="$3"
    { fill "$4" "$skill/templates/brief-blue-r2.md"; echo; echo "## 你第 1 輪的主張"; cat "$dir/$g/blue-r1.md"; echo; echo "## 紅隊的攻擊"; cat "$dir/$g/red-r1.md"; echo; echo "---"; echo "## 全文（附行號）"; cat "$dir/subject-numbered.md"; } > "$dir/$g/prompt-blue-r2.md"
    wc -c "$dir/$g/prompt-blue-r2.md" ;;
  *) echo "未知階段：$stage" >&2; exit 2 ;;
esac
