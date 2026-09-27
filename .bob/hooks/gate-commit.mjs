#!/usr/bin/env node
// PreToolUse gate: block `git commit` while staged files carry hard-coded UI strings
// or while locale key parity fails. Exit 2 blocks the tool; exit 0 allows it.

import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function readStdin() {
  try { return readFileSync(0, 'utf8'); } catch { return ''; }
}

const raw = readStdin();
let cmd = '';
try {
  const j = JSON.parse(raw || '{}');
  cmd = (j.input && j.input.command) || (j.tool_input && j.tool_input.command) || '';
} catch { cmd = ''; }

// Only gate git commits; everything else passes straight through.
if (!/\bgit\s+commit\b/.test(cmd)) process.exit(0);

function run(args) {
  const r = spawnSync(process.execPath, args, { encoding: 'utf8' });
  return { code: r.status ?? 1, out: (r.stdout || '') + (r.stderr || '') };
}

// 1) No hard-coded user-visible strings in staged files.
//    Run with --json to a temp file (outside the repo so it is never staged)
//    so we can read the total count and the per-file breakdown for a precise
//    block message.
const jsonOut = join(tmpdir(), `count-literals-${process.pid}.json`);
const lit = run(['scripts/count-literals.mjs', '--staged', '--json', jsonOut]);
if (lit.code !== 0) {
  // Build a human-readable message from the JSON report when available.
  let msg = 'Commit blocked: staged files still contain hard-coded UI strings.';
  try {
    const report = JSON.parse(readFileSync(jsonOut, 'utf8'));
    const total = report.total ?? 0;
    const perFile = report.perFile ?? {};
    const files = Object.keys(perFile).filter(f => (perFile[f] ?? 0) > 0);
    if (total > 0 && files.length > 0) {
      const fileList = files
        .map(f => `${f} (${perFile[f]})`)
        .join(', ');
      const noun = total === 1 ? 'string' : 'strings';
      msg = `Blocked: ${total} hard-coded ${noun} in ${fileList} — move it into an i18next key (t(...)).`;
    }
  } catch { /* fall back to generic message */ }
  console.error(msg);
  process.exit(2);
}

// 2) Locale key parity — only meaningful once the English locale resources exist.
if (existsSync('src/locales/en')) {
  const kp = run(['scripts/key-parity.mjs']);
  if (kp.code !== 0) {
    console.error('Commit blocked: locale key parity failed (a locale is missing keys or plural forms). '
      + 'Run `node scripts/key-parity.mjs` to see which.');
    process.exit(2);
  }
}

process.exit(0);
