#!/usr/bin/env node
// count-literals.mjs — counts hard-coded, user-visible strings in the app.
//
// Authored by Claude Code (worker P03), never by IBM Bob:
// "the checker is not written by the agent it grades."
//
// It measures WorldReady metric #1 ("hard-coded user-visible strings: ~250 -> 0") using
// THREE independent passes, summed, with per-file counts:
//
//   A. JSX pass  — ESLint (eslint-plugin-i18next, no-literal-string, jsx-only mode via
//      eslint.i18n.config.mjs): JSX text + the attributes placeholder/alt/title/aria-label.
//   B. Data pass — TypeScript compiler API over src/data/*.ts: user-visible string-valued
//      properties in the data objects.
//   C. Toast pass — TypeScript compiler API over all *.ts/*.tsx: toast() / toast.<x>() calls
//      whose first argument is a string or template literal.
//
// The three passes cover disjoint syntax (JSX literals vs. data object values vs. toast call
// arguments), so there is no double counting.
//
// Usage:
//   node scripts/count-literals.mjs [--dir <root>] [--json <out>] [--staged]
//
//   --dir <root>   App root to scan (default ".").
//   --json <out>   Write a machine-readable report to this path.
//   --staged       Only scan files staged in git (git diff --cached), for the commit hook.
//
// Exit code: 0 normally. With --staged, exits 1 if any hard-coded string is found (so the
// PreToolUse / CI gate can block). Without --staged it always exits 0 (informational).

import { ESLint } from 'eslint';
import ts from 'typescript';
import { readFileSync, existsSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep, posix, isAbsolute, resolve } from 'node:path';
import { execSync } from 'node:child_process';

// ── config ─────────────────────────────────────────────────────────────────
const ESLINT_CONFIG = new URL('../eslint.i18n.config.mjs', import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  '$1'
); // strip leading slash on Windows drive paths

// Property names in src/data/*.ts treated as ids / slugs / urls / style tokens, and thus
// NOT user-visible strings (excluded from the data pass):
//   slug          — URL slug / lookup key
//   name          — planet display name that ALSO doubles as the flight-search filter value
//                   (trap DA-04); kept canonical/English by design, so treated as an id.
//   accentColor / bgAccent / borderAccent / colorClass — Tailwind class-name tokens.
const DATA_EXCLUDE_KEYS = new Set([
  'slug',
  'name',
  'accentColor',
  'bgAccent',
  'borderAccent',
  'colorClass',
]);

const TOAST_METHODS = new Set(['success', 'error', 'loading', 'custom', 'message']);

// ── args ───────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const out = { dir: '.', json: null, staged: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dir') out.dir = argv[++i];
    else if (a === '--json') out.json = argv[++i];
    else if (a === '--staged') out.staged = true;
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node scripts/count-literals.mjs [--dir <root>] [--json <out>] [--staged]');
      process.exit(0);
    }
  }
  return out;
}

// ── file discovery ─────────────────────────────────────────────────────────
function walk(dir, exts) {
  const out = [];
  const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', 'site', '.next']);
  const rec = (d) => {
    let entries;
    try { entries = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = join(d, e.name);
      if (e.isDirectory()) {
        if (IGNORE.has(e.name)) continue;
        rec(full);
      } else if (exts.some((x) => e.name.endsWith(x))) {
        out.push(full);
      }
    }
  };
  rec(dir);
  return out;
}

function stagedFiles(dir) {
  let list = [];
  try {
    const out = execSync('git diff --cached --name-only --diff-filter=ACM', {
      cwd: dir,
      encoding: 'utf8',
    });
    list = out.split(/\r?\n/).filter(Boolean).map((p) => join(dir, p));
  } catch (e) {
    console.error('warning: could not read staged files:', e.message);
  }
  return list.filter((f) => existsSync(f));
}

function relPath(dir, file) {
  const r = isAbsolute(file) ? relative(dir, file) : file;
  return r.split(sep).join(posix.sep);
}

// ── Pass A: ESLint JSX literals ──────────────────────────────────────────────
async function countJsx(dir, files) {
  const jsxFiles = files.filter((f) => f.endsWith('.tsx') || f.endsWith('.jsx'));
  if (jsxFiles.length === 0) return { total: 0, perFile: {} };

  const eslint = new ESLint({
    cwd: dir,
    overrideConfigFile: ESLINT_CONFIG,
    errorOnUnmatchedPattern: false,
  });
  const results = await eslint.lintFiles(jsxFiles);

  const perFile = {};
  let total = 0;
  for (const r of results) {
    const hits = r.messages.filter((m) => m.ruleId === 'i18next/no-literal-string');
    if (hits.length) {
      perFile[relPath(dir, r.filePath)] = hits.length;
      total += hits.length;
    }
  }
  return { total, perFile };
}

// ── TypeScript AST helpers ───────────────────────────────────────────────────
function makeSource(file) {
  const text = readFileSync(file, 'utf8');
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, /*setParentNodes*/ true, kind);
}
function isStringish(node) {
  return (
    ts.isStringLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node) ||
    ts.isTemplateExpression(node)
  );
}

// ── Pass B: data-file user-visible strings ───────────────────────────────────
function countData(dir, files) {
  const dataFiles = files.filter((f) => {
    const rel = relPath(dir, f);
    return /(^|\/)src\/data\/[^/]+\.ts$/.test(rel);
  });
  const perFile = {};
  let total = 0;

  for (const file of dataFiles) {
    const sf = makeSource(file);
    let count = 0;

    const nearestKey = (node) => {
      let n = node.parent;
      while (n) {
        if (ts.isPropertyAssignment(n)) {
          const name = n.name;
          if (ts.isIdentifier(name) || ts.isStringLiteral(name)) return name.text;
          return null;
        }
        n = n.parent;
      }
      return null;
    };

    const visit = (node) => {
      if (isStringish(node)) {
        // Skip if this string node IS a property key.
        const p = node.parent;
        const isKey =
          (ts.isPropertyAssignment(p) && p.name === node) ||
          (ts.isPropertySignature(p) && p.name === node);
        // Skip import/export specifiers.
        const isModuleSpecifier =
          (ts.isImportDeclaration(p) && p.moduleSpecifier === node) ||
          (ts.isExportDeclaration(p) && p.moduleSpecifier === node);
        if (!isKey && !isModuleSpecifier) {
          const key = nearestKey(node);
          if (key !== null && !DATA_EXCLUDE_KEYS.has(key)) {
            count++;
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);

    if (count) {
      perFile[relPath(dir, file)] = count;
      total += count;
    }
  }
  return { total, perFile };
}

// ── Pass C: toast() literal arguments ────────────────────────────────────────
function countToasts(dir, files) {
  const tsFiles = files.filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'));
  const perFile = {};
  let total = 0;

  for (const file of tsFiles) {
    const sf = makeSource(file);
    let count = 0;

    const isToastCallee = (expr) => {
      if (ts.isIdentifier(expr)) return expr.text === 'toast';
      if (ts.isPropertyAccessExpression(expr)) {
        return (
          ts.isIdentifier(expr.expression) &&
          expr.expression.text === 'toast' &&
          TOAST_METHODS.has(expr.name.text)
        );
      }
      return false;
    };

    const visit = (node) => {
      if (ts.isCallExpression(node) && isToastCallee(node.expression)) {
        const arg0 = node.arguments[0];
        if (arg0 && isStringish(arg0)) count++;
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);

    if (count) {
      perFile[relPath(dir, file)] = count;
      total += count;
    }
  }
  return { total, perFile };
}

// ── merge per-file maps ──────────────────────────────────────────────────────
function mergePerFile(...maps) {
  const merged = {};
  for (const m of maps) {
    for (const [f, n] of Object.entries(m)) merged[f] = (merged[f] || 0) + n;
  }
  return merged;
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dir = resolve(args.dir); // ESLint requires an absolute cwd

  let files;
  if (args.staged) {
    files = stagedFiles(dir).filter((f) => /\.(tsx?|jsx?)$/.test(f));
  } else {
    files = walk(join(dir, 'src'), ['.ts', '.tsx', '.js', '.jsx']);
  }

  const jsx = await countJsx(dir, files);
  const data = countData(dir, files);
  const toasts = countToasts(dir, files);

  const perFile = mergePerFile(jsx.perFile, data.perFile, toasts.perFile);
  const total = jsx.total + data.total + toasts.total;

  // ── output ───────────────────────────────────────────────────────────────
  console.log(`\nHard-coded user-visible string count  —  dir: ${dir}${args.staged ? '  (staged only)' : ''}`);
  console.log(`  JSX text + attributes (eslint-plugin-i18next): ${jsx.total}`);
  console.log(`  Data-file user-visible strings (src/data/*.ts): ${data.total}`);
  console.log(`  toast() literal arguments: ${toasts.total}`);
  console.log(`  ------------------------------------------------`);
  console.log(`  TOTAL: ${total}\n`);

  const sorted = Object.entries(perFile).sort((a, b) => b[1] - a[1]);
  if (sorted.length) {
    console.log('  Per file:');
    for (const [f, n] of sorted) console.log(`    ${String(n).padStart(4)}  ${f}`);
    console.log('');
  }

  if (args.json) {
    const report = {
      tool: 'count-literals.mjs',
      dir,
      staged: args.staged,
      generatedUtc: new Date().toISOString(),
      total,
      byPass: { jsx: jsx.total, data: data.total, toasts: toasts.total },
      perFile,
    };
    writeFileSync(args.json, JSON.stringify(report, null, 2));
    console.log(`  wrote ${args.json}`);
  }

  if (args.staged && total > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
