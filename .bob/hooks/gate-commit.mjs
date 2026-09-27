#!/usr/bin/env node
// PreToolUse gate: block `git commit` while staged files carry hard-coded UI strings
// or while locale key parity fails. Exit 2 blocks the tool; exit 0 allows it.

import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

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
const lit = run(['scripts/count-literals.mjs', '--staged']);
if (lit.code !== 0) {
  console.error('Commit blocked: staged files still contain hard-coded UI strings. '
    + 'Move them into i18next keys (t(...)). Run `node scripts/count-literals.mjs --staged` to see them.');
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
