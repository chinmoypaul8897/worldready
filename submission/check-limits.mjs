#!/usr/bin/env node
// check-limits.mjs — verify every lablab.ai submission field is within its limit.
// Authored by Claude Code (worker P09). Run: node submission/check-limits.mjs
//
// Limits (from knowledge/02-submission-and-judging.md):
//   title.txt              <= 50 characters
//   short_description.txt  60..255 characters
//   long_description.md    <= 500 words
//   bob_usage_statement.md <= 500 words
//   tags.txt               non-empty (one tag per line)
//   links.txt              non-empty
//
// Word count = whitespace-separated tokens after stripping Markdown heading '#'
// markers and list bullets, so prose length is what is measured.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

function charCount(s) {
  // Count Unicode code points (so Arabic / accented chars count as 1 each),
  // trimming a single trailing newline the way a form field would.
  return [...s.replace(/\n$/, '')].length;
}
function wordCount(s) {
  return s
    .replace(/```[\s\S]*?```/g, ' ') // drop fenced code
    .replace(/[#>*_`|-]/g, ' ') // drop common md punctuation
    .split(/\s+/)
    .filter(Boolean).length;
}

const checks = [
  { file: 'title.txt', kind: 'chars', max: 50 },
  { file: 'short_description.txt', kind: 'chars', min: 60, max: 255 },
  { file: 'long_description.md', kind: 'words', max: 500 },
  { file: 'bob_usage_statement.md', kind: 'words', max: 500 },
  { file: 'tags.txt', kind: 'nonempty' },
  { file: 'links.txt', kind: 'nonempty' },
];

let ok = true;
const rows = [];
for (const c of checks) {
  const p = join(HERE, c.file);
  if (!existsSync(p)) {
    rows.push([c.file, 'MISSING', '', 'FAIL']);
    ok = false;
    continue;
  }
  const raw = readFileSync(p, 'utf8');
  if (c.kind === 'chars') {
    const n = charCount(raw);
    let pass = n <= c.max;
    if (c.min) pass = pass && n >= c.min;
    ok = ok && pass;
    rows.push([c.file, `${n} chars`, `${c.min ? c.min + '..' : '<= '}${c.max}`, pass ? 'PASS' : 'FAIL']);
  } else if (c.kind === 'words') {
    const n = wordCount(raw);
    const pass = n <= c.max;
    ok = ok && pass;
    rows.push([c.file, `${n} words`, `<= ${c.max}`, pass ? 'PASS' : 'FAIL']);
  } else {
    const n = raw.trim().length;
    const pass = n > 0;
    ok = ok && pass;
    rows.push([c.file, `${raw.trim().split(/\r?\n/).filter(Boolean).length} lines`, 'non-empty', pass ? 'PASS' : 'FAIL']);
  }
}

const w = Math.max(...rows.map((r) => r[0].length));
console.log('\nWorldReady submission — field limit check\n');
for (const [f, val, lim, res] of rows) {
  console.log(`  ${res === 'PASS' ? 'OK  ' : 'FAIL'} ${f.padEnd(w)}  ${String(val).padEnd(12)} (limit ${lim})`);
}
console.log(`\n${ok ? 'ALL WITHIN LIMITS' : 'SOME FIELDS OUT OF LIMITS'}\n`);
process.exit(ok ? 0 : 1);
