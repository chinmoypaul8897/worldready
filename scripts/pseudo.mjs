#!/usr/bin/env node
// pseudo.mjs — generates a pseudo-locale from the English locale resources.
//
// Authored by Claude Code (worker P03), never by IBM Bob.
//
// The pseudo-locale accents every translatable character and wraps each string in ⟦ … ⟧
// with ~30% length expansion. It is a checker in disguise: on the live viewer, ANY on-screen
// text that is NOT wrapped in ⟦ … ⟧ is a string that never went through i18next — i.e. a
// hard-coded literal. Expansion also surfaces layouts that clip or overflow in longer
// languages (French/Arabic run longer than English).
//
// It preserves:
//   - i18next interpolation:      {{name}}, {{count}}, {val, number}
//   - nesting / references:        $t(ns:key)
//   - simple HTML / Trans tags:    <0>...</0>, <strong>, <br/>
//   - printf-style tokens:         %s, %d, %{x}
//   - i18next plural KEYS:         key_one / key_other / key_zero ... (keys are copied verbatim;
//                                  only VALUES are pseudo-ized)
//
// Usage:
//   node scripts/pseudo.mjs [--dir <root>] [--src en] [--out pseudo] [--expansion 0.3]
//
// Reads  <dir>/src/locales/<src>/*.json  and writes  <dir>/src/locales/<out>/*.json.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

function parseArgs(argv) {
  const out = { dir: '.', src: 'en', out: 'pseudo', expansion: 0.3 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dir') out.dir = argv[++i];
    else if (a === '--src') out.src = argv[++i];
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--expansion') out.expansion = parseFloat(argv[++i]);
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node scripts/pseudo.mjs [--dir <root>] [--src en] [--out pseudo] [--expansion 0.3]');
      process.exit(0);
    }
  }
  return out;
}

// ── accent map (Latin letters -> look-alike accented glyphs) ──────────────────
const MAP = {
  a: 'à', b: 'ƀ', c: 'ç', d: 'ð', e: 'é', f: 'ƒ', g: 'ĝ', h: 'ĥ', i: 'í', j: 'ĵ',
  k: 'ķ', l: 'ļ', m: 'ɱ', n: 'ñ', o: 'ô', p: 'þ', q: 'ɋ', r: 'ŕ', s: 'š', t: 'ţ',
  u: 'û', v: 'ṽ', w: 'ŵ', x: 'ẋ', y: 'ý', z: 'ž',
  A: 'À', B: 'Ɓ', C: 'Ç', D: 'Ð', E: 'É', F: 'Ƒ', G: 'Ĝ', H: 'Ĥ', I: 'Í', J: 'Ĵ',
  K: 'Ķ', L: 'Ļ', M: 'Ṁ', N: 'Ñ', O: 'Ô', P: 'Þ', Q: 'Ɋ', R: 'Ŕ', S: 'Š', T: 'Ţ',
  U: 'Û', V: 'Ṽ', W: 'Ŵ', X: 'Ẋ', Y: 'Ý', Z: 'Ž',
};

// Matches tokens that must be preserved verbatim.
const TOKEN_RE = /(\{\{[^}]*\}\}|\{[^}]*\}|\$t\([^)]*\)|<\/?[^>]+>|%\{[^}]*\}|%[sd])/g;

function accentSegment(seg) {
  let out = '';
  for (const ch of seg) out += MAP[ch] ?? ch;
  return out;
}

function pseudoString(str, expansion) {
  // Split into preserved tokens and free text, accent only the free text.
  const parts = str.split(TOKEN_RE);
  let body = '';
  let letterCount = 0;
  for (const part of parts) {
    if (part === undefined || part === '') continue;
    if (TOKEN_RE.test(part)) {
      // TOKEN_RE has the global flag; reset lastIndex after test.
      TOKEN_RE.lastIndex = 0;
      body += part; // preserve token verbatim
    } else {
      TOKEN_RE.lastIndex = 0;
      body += accentSegment(part);
      letterCount += (part.match(/[A-Za-z]/g) || []).length;
    }
  }
  // Expand ~expansion of the original letter count using middle dots (visible padding).
  const pad = Math.max(0, Math.round(letterCount * expansion));
  const padding = pad > 0 ? ' ' + '·'.repeat(pad) : '';
  return '⟦' + body + padding + '⟧';
}

function transform(node, expansion) {
  if (typeof node === 'string') return pseudoString(node, expansion);
  if (Array.isArray(node)) return node.map((n) => transform(n, expansion));
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = transform(v, expansion); // keys copied verbatim
    return out;
  }
  return node; // numbers / booleans / null pass through
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const srcDir = join(args.dir, 'src', 'locales', args.src);
  const outDir = join(args.dir, 'src', 'locales', args.out);

  if (!existsSync(srcDir)) {
    console.error(`ERROR: source locale dir not found: ${srcDir}`);
    console.error('(Run this after the English locale resources exist.)');
    process.exit(2);
  }
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const files = readdirSync(srcDir).filter((f) => f.endsWith('.json'));
  let strings = 0;
  for (const file of files) {
    const data = JSON.parse(readFileSync(join(srcDir, file), 'utf8'));
    const countStrings = (n) => {
      if (typeof n === 'string') strings++;
      else if (Array.isArray(n)) n.forEach(countStrings);
      else if (n && typeof n === 'object') Object.values(n).forEach(countStrings);
    };
    countStrings(data);
    const pseudo = transform(data, args.expansion);
    writeFileSync(join(outDir, file), JSON.stringify(pseudo, null, 2) + '\n');
    console.log(`  ${args.src}/${file} -> ${args.out}/${file}`);
  }
  console.log(`\n  generated ${files.length} namespace file(s), ${strings} string(s), expansion ${Math.round(args.expansion * 100)}%`);
}

main();
