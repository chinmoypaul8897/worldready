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
  // nameEn — the stable English planet name used as the flight-search FILTER
  // value and for programmatic lookups (getDestinationByName); the code marks it
  // "do NOT translate". Same id role as `name` (the display `name` field now
  // holds an i18next key path; the T05a refactor split the English value out into
  // nameEn). Kept English by design (trap DA-04), so it is an id, not user copy.
  'nameEn',
  'accentColor',
  'bgAccent',
  'borderAccent',
  'colorClass',
]);

const TOAST_METHODS = new Set(['success', 'error', 'loading', 'custom', 'message']);

// ── documented exclusions (architect ruling, P07, 07:15 IST) ─────────────────
// The three passes above are heuristic: they flag any string literal in a
// user-visible position. But three kinds of literal are NOT hard-coded English
// copy, and counting them overstates the "hard-coded strings" metric. Each is
// excluded here, on evidence, and the excluded totals are reported separately so
// the subtraction is auditable. See evidence/literals-method.md.
//
//   (a) i18next KEY PATHS — a string that exactly equals a key that exists in
//       src/locales/en/*.json (e.g. 'destinations.mars.tagline',
//       'flights.filters.seatEconomy'). These are resolved by t(...) at render;
//       the visible text lives in the locale files, not the code. Excluded ONLY
//       when the en locale bundle exists (so on v0-before, which has no locales,
//       inline English marketing copy in src/data still counts — as it should).
//   (b) DATE-FNS / Intl FORMAT PATTERNS — strings made only of date-field tokens
//       and separators (e.g. 'MMM dd', 'MMM dd, yyyy'). They are format
//       specifiers passed to formatDate/Intl, not sentences; the localized output
//       is produced by the formatter per-locale.
//   (c) ENUM / FILTER VALUES kept English on purpose — the internal option values
//       the UI sends to the API (the visible LABEL next to each is translated via
//       t()). Kept canonical/English by design so filtering/sorting is stable
//       across locales; never shown as prose.

// (c) explicit enum/filter/sort values — internal API values, not user copy.
const ENUM_ALLOWLIST = new Set([
  // seat classes (FlightFilters seat-class buttons; label via t(labelKey))
  'economy', 'business', 'galaxium',
  // time-of-day filter values (label via t())
  'morning', 'afternoon', 'evening', 'night',
  // route-category filter values (label via t())
  'inner_planets', 'outer_planets', 'moons',
  // sort field + order values (<option value>, kept English for the API)
  'departure_time', 'base_price', 'duration', 'seats_available', 'asc', 'desc',
]);

// (a) load the flattened set of en key paths, e.g. "flights.filters.seatEconomy".
// namespace = file basename; nested objects join with '.'. Plural suffixes
// (_zero/_one/_two/_few/_many/_other) are also collapsed to their base key so a
// code reference to the base key (t('...seatsLeft', {count})) is recognised too.
const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;
function loadEnKeyPaths(dir) {
  const set = new Set();
  const enDir = join(dir, 'src', 'locales', 'en');
  if (!existsSync(enDir)) return set; // no locales yet (e.g. v0-before) → (a) is a no-op
  let files;
  try { files = readdirSync(enDir).filter((f) => f.endsWith('.json')); } catch { return set; }
  const addLeaf = (path) => {
    set.add(path);
    if (PLURAL_SUFFIX.test(path)) set.add(path.replace(PLURAL_SUFFIX, ''));
  };
  const recurse = (obj, prefix) => {
    for (const [k, v] of Object.entries(obj)) {
      const p = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) recurse(v, p);
      else addLeaf(p);
    }
  };
  for (const f of files) {
    const ns = f.replace(/\.json$/, '');
    try {
      const json = JSON.parse(readFileSync(join(enDir, f), 'utf8'));
      recurse(json, ns);
    } catch { /* skip malformed */ }
  }
  return set;
}

// (b) date/Intl format pattern detector. A string is a format pattern iff it is
// composed ONLY of date-field token letters and separators, AND it looks like a
// real pattern (has a separator, OR a token run of length >= 3, OR a yy+ run).
// This admits 'MMM dd' / 'MMM dd, yyyy' / 'HH:mm' but not short real words that
// happen to use token letters (e.g. 'add', 'may').
const DATE_TOKENS = 'GyYMLwWDdEeccaHhKkmsSzZXx';
const DATE_TOKEN_RE = new RegExp(`^[${DATE_TOKENS}\\s,./:·'\\-]+$`);
function isDatePattern(s) {
  if (!s || s.length < 3) return false;
  // the whole string is only date-field token letters and separators
  if (!DATE_TOKEN_RE.test(s)) return false;
  // a real date field is a run of the SAME letter (MM, dd, yy, HH, MMM, yyyy),
  // NOT an arbitrary run of different token letters — so 'Max' (M+a+x) is NOT a
  // token. Split into maximal same-character runs and keep the ones that are
  // date-token letters.
  const sameCharRuns = (s.match(/(.)\1*/g) || []).filter((r) => DATE_TOKENS.includes(r[0]));
  const hasStrongToken = sameCharRuns.some((r) => r.length >= 3); // MMM, MMMM, yyy, yyyy, EEE…
  const hasMultiCharToken = sameCharRuns.some((r) => r.length >= 2); // MM, dd, yy, HH, mm…
  const hasSeparator = /[\s,./:·'\-]/.test(s);
  // strong token alone (e.g. 'MMMM', 'yyyy'), or a separated pattern that
  // contains at least one multi-char field (e.g. 'MMM dd', 'HH:mm').
  return hasStrongToken || (hasSeparator && hasMultiCharToken);
}

// classify one candidate literal; returns null if it counts as real English, or
// the exclusion bucket ('keyPath' | 'datePattern' | 'enum') if it is excluded.
function exclusionBucket(value, keyPaths) {
  if (keyPaths.has(value)) return 'keyPath';
  if (isDatePattern(value)) return 'datePattern';
  if (ENUM_ALLOWLIST.has(value)) return 'enum';
  return null;
}

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

// pull the exact flagged literal text out of the source using the message range,
// stripping surrounding quotes. Returns '' if it can't (multi-line / no quotes),
// in which case the hit is treated as real English (kept).
function literalFromRange(lines, m) {
  if (!m.endLine || m.endLine !== m.line) return '';
  const line = lines[m.line - 1];
  if (line == null) return '';
  let text = line.slice(m.column - 1, m.endColumn - 1);
  const q = text[0];
  if ((q === "'" || q === '"' || q === '`') && text[text.length - 1] === q) {
    text = text.slice(1, -1);
  } else {
    return ''; // not a bare quoted literal → keep (count it)
  }
  return text;
}

// ── Pass A: ESLint JSX literals ──────────────────────────────────────────────
async function countJsx(dir, files, keyPaths, excluded) {
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
    if (!hits.length) continue;
    const lines = readFileSync(r.filePath, 'utf8').split(/\r?\n/);
    let kept = 0;
    for (const m of hits) {
      const value = literalFromRange(lines, m);
      const bucket = value ? exclusionBucket(value, keyPaths) : null;
      if (bucket) { excluded[bucket]++; continue; }
      kept++;
    }
    if (kept) {
      perFile[relPath(dir, r.filePath)] = kept;
      total += kept;
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
function countData(dir, files, keyPaths, excluded) {
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
            // exclude i18next key paths / date patterns / enum values (see top)
            const value =
              ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
                ? node.text
                : '';
            const bucket = value ? exclusionBucket(value, keyPaths) : null;
            if (bucket) excluded[bucket]++;
            else count++;
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
function countToasts(dir, files, keyPaths, excluded) {
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
        if (arg0 && isStringish(arg0)) {
          const value =
            ts.isStringLiteral(arg0) || ts.isNoSubstitutionTemplateLiteral(arg0)
              ? arg0.text
              : '';
          const bucket = value ? exclusionBucket(value, keyPaths) : null;
          if (bucket) excluded[bucket]++;
          else count++;
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

  const keyPaths = loadEnKeyPaths(dir);
  const excluded = { keyPath: 0, datePattern: 0, enum: 0 };

  const jsx = await countJsx(dir, files, keyPaths, excluded);
  const data = countData(dir, files, keyPaths, excluded);
  const toasts = countToasts(dir, files, keyPaths, excluded);

  const perFile = mergePerFile(jsx.perFile, data.perFile, toasts.perFile);
  const total = jsx.total + data.total + toasts.total;
  const excludedTotal = excluded.keyPath + excluded.datePattern + excluded.enum;

  // ── output ───────────────────────────────────────────────────────────────
  console.log(`\nHard-coded user-visible string count  —  dir: ${dir}${args.staged ? '  (staged only)' : ''}`);
  console.log(`  JSX text + attributes (eslint-plugin-i18next): ${jsx.total}`);
  console.log(`  Data-file user-visible strings (src/data/*.ts): ${data.total}`);
  console.log(`  toast() literal arguments: ${toasts.total}`);
  console.log(`  ------------------------------------------------`);
  console.log(`  TOTAL (real hard-coded English): ${total}`);
  console.log(`  excluded as non-copy (not counted): ${excludedTotal}` +
    `  [i18next key paths ${excluded.keyPath} · date/Intl patterns ${excluded.datePattern} · enum/filter values ${excluded.enum}]`);
  console.log(`  ${keyPaths.size ? 'en locale bundle present → key-path exclusion active' : 'no en locale bundle → key-path exclusion inactive (inline copy counts)'}\n`);

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
      excluded: { ...excluded, total: excludedTotal },
      enLocaleBundlePresent: keyPaths.size > 0,
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
