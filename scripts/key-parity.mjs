#!/usr/bin/env node
// key-parity.mjs — plural-aware translation-key parity across locales.
//
// Authored by Claude Code (worker P03), never by IBM Bob.
//
// It compares the translation resources in src/locales/{en,fr,ar,pseudo}/*.json against the
// English reference and reports, per locale, any MISSING keys. It is PLURAL-AWARE:
//
//   - i18next plural suffixes (_zero/_one/_two/_few/_many/_other) are stripped to a base key;
//   - each locale must then supply exactly the plural categories that its own language needs,
//     taken from  Intl.PluralRules(lang).resolvedOptions().pluralCategories.
//     English needs {one, other}; French needs {one, many, other}; ARABIC needs all SIX
//     {zero, one, two, few, many, other}. So an English `seats_one/seats_other` pair requires
//     six Arabic forms `seats_zero/…/seats_other` — a naive key-diff would wrongly pass.
//
// Usage:
//   node scripts/key-parity.mjs [--dir <root>] [--locales en,fr,ar,pseudo] [--ref en] [--json <out>]
//
// Exit code: 0 if every locale is complete, else 1 (so it can gate a commit / PR).

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PLURAL_SUFFIX = /^(.*)_(zero|one|two|few|many|other)$/;

function parseArgs(argv) {
  const out = { dir: '.', locales: ['en', 'fr', 'ar', 'pseudo'], ref: 'en', json: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dir') out.dir = argv[++i];
    else if (a === '--locales') out.locales = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--ref') out.ref = argv[++i];
    else if (a === '--json') out.json = argv[++i];
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node scripts/key-parity.mjs [--dir <root>] [--locales en,fr,ar,pseudo] [--ref en] [--json <out>]');
      process.exit(0);
    }
  }
  return out;
}

// Map a locale directory name to a BCP-47 tag for Intl.PluralRules.
function langOf(locale) {
  if (locale === 'pseudo') return 'en'; // pseudo uses English plural rules
  return locale;
}
function pluralCategories(locale) {
  try {
    return new Intl.PluralRules(langOf(locale)).resolvedOptions().pluralCategories;
  } catch {
    return new Intl.PluralRules('en').resolvedOptions().pluralCategories;
  }
}

// Flatten a namespace object to a set of leaf key paths ("a.b.c").
function flatten(obj, prefix, set) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, path, set);
    } else {
      set.add(path); // string / number / boolean / null / array = leaf
    }
  }
  return set;
}

function loadLocale(dir, locale) {
  const locDir = join(dir, 'src', 'locales', locale);
  if (!existsSync(locDir) || !statSync(locDir).isDirectory()) return null;
  const files = readdirSync(locDir).filter((f) => f.endsWith('.json'));
  const namespaces = {}; // nsName -> Set(leafPaths)
  for (const f of files) {
    const ns = f.replace(/\.json$/, '');
    let data;
    try { data = JSON.parse(readFileSync(join(locDir, f), 'utf8')); }
    catch (e) { console.error(`  ! ${locale}/${f}: invalid JSON (${e.message})`); data = {}; }
    namespaces[ns] = flatten(data, '', new Set());
  }
  return namespaces;
}

// From a reference set of leaf paths, derive singular keys + plural base keys.
function analyzeRef(leafSet) {
  const singular = new Set();
  const pluralBases = new Set();
  for (const leaf of leafSet) {
    const segs = leaf.split('.');
    const last = segs[segs.length - 1];
    const m = last.match(PLURAL_SUFFIX);
    if (m) {
      segs[segs.length - 1] = m[1];
      pluralBases.add(segs.join('.'));
    } else {
      singular.add(leaf);
    }
  }
  return { singular, pluralBases };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const ref = loadLocale(args.dir, args.ref);
  if (!ref) {
    console.error(`ERROR: reference locale not found: ${join(args.dir, 'src', 'locales', args.ref)}`);
    console.error('(Run this after the translation resources exist.)');
    process.exit(2);
  }

  const report = { tool: 'key-parity.mjs', dir: args.dir, ref: args.ref, generatedUtc: new Date().toISOString(), locales: {} };
  let anyFail = false;

  console.log(`\nKey parity  —  reference: ${args.ref}  (namespaces: ${Object.keys(ref).join(', ')})\n`);

  for (const locale of args.locales) {
    if (locale === args.ref) continue;
    const cats = pluralCategories(locale);
    const loc = loadLocale(args.dir, locale);
    const missing = [];
    const extra = [];

    if (!loc) {
      console.log(`  ${locale.padEnd(8)} MISSING LOCALE (no src/locales/${locale})`);
      report.locales[locale] = { present: false, categories: cats, missing: ['<entire locale>'], extra: [] };
      anyFail = true;
      continue;
    }

    for (const [ns, refSet] of Object.entries(ref)) {
      const locSet = loc[ns];
      if (!locSet) { missing.push(`${ns}:<entire namespace>`); continue; }
      const { singular, pluralBases } = analyzeRef(refSet);

      for (const key of singular) {
        if (!locSet.has(key)) missing.push(`${ns}:${key}`);
      }
      for (const base of pluralBases) {
        for (const cat of cats) {
          const need = `${base}_${cat}`;
          if (!locSet.has(need)) missing.push(`${ns}:${need}`);
        }
      }

      // Extra keys present in the locale but not derivable from the reference.
      const allowed = new Set(singular);
      for (const base of pluralBases) for (const cat of cats) allowed.add(`${base}_${cat}`);
      // also allow the locale to carry other plural cats it needs even if ref lists fewer
      for (const key of locSet) {
        if (allowed.has(key)) continue;
        const segs = key.split('.');
        const m = segs[segs.length - 1].match(PLURAL_SUFFIX);
        if (m) {
          segs[segs.length - 1] = m[1];
          if (pluralBases.has(segs.join('.'))) continue; // a valid plural form of a known base
        }
        extra.push(`${ns}:${key}`);
      }
    }

    const pass = missing.length === 0;
    if (!pass) anyFail = true;
    console.log(`  ${locale.padEnd(8)} ${pass ? 'OK ' : '!! '} cats={${cats.join(',')}}  missing: ${missing.length}  extra: ${extra.length}`);
    for (const m of missing.slice(0, 40)) console.log(`         - missing ${m}`);
    if (missing.length > 40) console.log(`         … and ${missing.length - 40} more`);
    report.locales[locale] = { present: true, categories: cats, missing, extra };
  }

  console.log(`\n  RESULT: ${anyFail ? 'FAIL (some locales incomplete)' : 'PASS (all locales complete, plural-aware)'}\n`);

  if (args.json) {
    writeFileSync(args.json, JSON.stringify(report, null, 2));
    console.log(`  wrote ${args.json}`);
  }
  process.exit(anyFail ? 1 : 0);
}

main();
