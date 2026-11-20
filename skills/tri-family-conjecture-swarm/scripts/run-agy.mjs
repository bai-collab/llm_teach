// 唯讀呼叫 AGY（Antigravity CLI）並解析 stream-json 輸出。
// 用法：node run-agy.mjs <prompt.md> <out-prefix> <model>
//       node run-agy.mjs --reparse <out-prefix>      只重新解析既有的 <out-prefix>.raw.jsonl
// 執行檔：環境變數 AGY_EXE；沒設時用 Windows 預設安裝位置 %LOCALAPPDATA%\agy\bin\agy.exe。
// 產出：<out-prefix>.raw.jsonl、.stderr.txt、.md（回覆正文）、.meta.json（實際模型、狀態、工具步驟數）。
// 判讀：meta.init_model 必須等於指定模型；step_types 只能有 user_input 與 agent_response；text_chars 不可為 0。
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function parse(outPrefix, code, argv) {
  const out = readFileSync(`${outPrefix}.raw.jsonl`, 'utf8');
  const events = out.split(/\r?\n/).filter(Boolean).map(l => {
    try { return JSON.parse(l); } catch { return { event: '_unparsed', _unparsed: l }; }
  });
  // AGY 的事件格式是 { "event": "<名稱>", "<名稱>": { ... } }，不是 { "type": ... }
  const body = e => e[e.event] ?? {};
  const init = events.find(e => e.event === 'init');
  const result = events.find(e => e.event === 'result');
  const stepTypes = [...new Set(events.filter(e => e.event === 'step_update').map(e => body(e).step_type))];
  const r = result ? body(result) : {};
  const text = typeof r.response === 'string' ? r.response : '';
  writeFileSync(`${outPrefix}.md`, text);
  const meta = {
    exit: code, argv,
    init_model: init ? body(init).model ?? null : null,
    result_status: r.status ?? null,
    duration_seconds: r.duration_seconds ?? null,
    usage: r.usage ?? null,
    step_types: stepTypes,
    tool_steps_suspected: stepTypes.some(t => t && !['user_input', 'agent_response'].includes(t)),
    text_chars: text.length,
  };
  writeFileSync(`${outPrefix}.meta.json`, JSON.stringify(meta, null, 2));
  console.log(JSON.stringify(meta));
}

if (process.argv[2] === '--reparse') {
  parse(process.argv[3], null, null);
} else {
  const [promptPath, outPrefix, model] = process.argv.slice(2);
  if (!promptPath || !outPrefix || !model) {
    console.error('用法：node run-agy.mjs <prompt.md> <out-prefix> <model>（model 必填，先用 agy models 核對）');
    process.exit(2);
  }
  const exe = process.env.AGY_EXE || join(process.env.LOCALAPPDATA ?? '', 'agy', 'bin', 'agy.exe');
  const argv = ['--mode', 'plan', '--sandbox', '--model', model, '--output-format', 'stream-json', '--print-timeout', '900s'];
  const child = spawn(exe, argv, { stdio: ['pipe', 'pipe', 'pipe'] });
  let out = '', err = '';
  child.stdout.on('data', d => (out += d));
  child.stderr.on('data', d => (err += d));
  child.on('error', e => { console.error(`無法啟動 AGY：${e.message}`); process.exit(1); });
  child.stdin.end(readFileSync(promptPath, 'utf8'), 'utf8'); // 長提示詞一律走標準輸入
  child.on('close', code => {
    writeFileSync(`${outPrefix}.raw.jsonl`, out);
    writeFileSync(`${outPrefix}.stderr.txt`, err);
    parse(outPrefix, code, argv);
  });
}
