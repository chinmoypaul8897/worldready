#!/usr/bin/env node
// english-parity.mjs — proves the WorldReady retrofit did NOT change the English UI.
//
// Authored by Claude Code (worker P03), never by IBM Bob:
// "the checker is not written by the agent it grades."
//
// It loads the SAME routes in the BEFORE build and the AFTER build, both in English, with a
// frozen clock and countdown/timer nodes masked, extracts the visible text, and reports the
// number of characters that changed (target: 0). It writes a human-readable diff too.
//
// Works against:
//   - vite preview servers / any http(s) base URL (e.g. GitHub Pages), via --before/--after URLs;
//   - local build output directories (dist), which it serves with a built-in static server.
//
// Usage:
//   node scripts/english-parity.mjs --before <urlOrDir> --after <urlOrDir> \
//        [--routes "/,/flights,/bookings,/destinations/mars,/destinations/europa"] \
//        [--json evidence/english-parity.json] [--diff evidence/english-parity.diff] \
//        [--fixed-time 2026-06-01T12:00:00Z]
//
// Examples:
//   # against two vite preview servers
//   node scripts/english-parity.mjs --before http://localhost:4173/before/ --after http://localhost:4174/after/
//   # against two local dist folders (served internally)
//   node scripts/english-parity.mjs --before ./dist-before --after ./dist-after
//   # against live GitHub Pages
//   node scripts/english-parity.mjs --before https://chinmoypaul8897.github.io/worldready/before/ \
//        --after https://chinmoypaul8897.github.io/worldready/after/
//
// Requires Playwright chromium (npm i -D playwright && npx playwright install chromium).
// Exit code: 0 if total changed chars == 0, else 1.

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';

// ── args ─────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const out = {
    before: null,
    after: null,
    routes: ['/', '/flights', '/bookings', '/destinations/mars', '/destinations/europa'],
    json: null,
    diff: null,
    fixedTime: '2026-06-01T12:00:00Z',
    lang: 'en',
    mask: [],
    maskSwitcher: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--before') out.before = argv[++i];
    else if (a === '--after') out.after = argv[++i];
    else if (a === '--routes') out.routes = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--json') out.json = argv[++i];
    else if (a === '--diff') out.diff = argv[++i];
    else if (a === '--fixed-time') out.fixedTime = argv[++i];
    else if (a === '--lang') out.lang = argv[++i];
    else if (a === '--mask') out.mask.push(...argv[++i].split(',').map((s) => s.trim()).filter(Boolean));
    else if (a === '--mask-switcher') out.maskSwitcher = true;
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
  }
  return out;
}
function printHelp() {
  console.log('Usage: node scripts/english-parity.mjs --before <urlOrDir> --after <urlOrDir> [--routes ...] [--json ...] [--diff ...] [--fixed-time ISO] [--mask <css,css>] [--mask-switcher]');
  console.log('  --mask <css>       blank elements matching these CSS selectors before comparing (non-content chrome).');
  console.log('  --mask-switcher    blank the EN/FR/AR language switcher (new UI absent from the before build).');
}

// ── minimal static file server (for local dist dirs) ─────────────────────────
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ico': 'image/x-icon', '.map': 'application/json', '.ttf': 'font/ttf',
};
function startStaticServer(rootDir) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      try {
        let urlPath = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0]);
        if (urlPath.endsWith('/')) urlPath += 'index.html';
        let filePath = normalize(join(rootDir, urlPath));
        if (!filePath.startsWith(normalize(rootDir))) { res.writeHead(403); res.end(); return; }
        if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
          // SPA fallback to index.html (HashRouter keeps routing client-side)
          filePath = join(rootDir, 'index.html');
        }
        const body = readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404); res.end('not found');
      }
    });
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, base: `http://127.0.0.1:${port}/` });
    });
  });
}

// ── resolve a target (url or dir) to a base URL + optional server ────────────
async function resolveTarget(target) {
  if (/^https?:\/\//i.test(target)) return { base: target.endsWith('/') ? target : target + '/', server: null };
  if (!existsSync(target)) throw new Error(`not a URL and not an existing directory: ${target}`);
  const { server, base } = await startStaticServer(target);
  return { base, server };
}

// ── normalize + mask volatile text ───────────────────────────────────────────
function normalizeText(raw) {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, '[TIME]') // countdown / clock timers
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .filter((l) => l.length > 0)
    .join('\n');
}

// ── two-row Levenshtein (character edit distance) ────────────────────────────
function editDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array(b.length + 1);
  let curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    const ai = a.charCodeAt(i - 1);
    for (let j = 1; j <= b.length; j++) {
      const cost = ai === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

// ── simple line diff for the human-readable diff file ────────────────────────
function lineDiff(before, after) {
  const A = before.split('\n');
  const B = after.split('\n');
  const setB = new Set(B);
  const setA = new Set(A);
  const removed = A.filter((l) => !setB.has(l));
  const added = B.filter((l) => !setA.has(l));
  const lines = [];
  for (const l of removed) lines.push('- ' + l);
  for (const l of added) lines.push('+ ' + l);
  return lines;
}

// ── grab visible text of one route ───────────────────────────────────────────
async function grabRoute(context, base, route, fixedTime, lang, mask, maskSwitcher) {
  const page = await context.newPage();
  // Freeze the clock so relative-time / countdown output is identical across builds.
  try { await page.clock.setFixedTime(new Date(fixedTime)); } catch { /* older PW */ }
  // Pin language for both builds (BEFORE ignores it; AFTER should render English).
  await page.addInitScript((lng) => {
    try {
      localStorage.setItem('i18nextLng', lng);
      localStorage.setItem('i18next', lng);
    } catch { /* ignore */ }
  }, lang);

  const url = base + '#' + route;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  // give async data (mock API) + animations a moment
  await page.waitForTimeout(1200);

  // Mask known countdown/timer nodes, any caller-supplied selectors, and the
  // (new-UI) EN/FR/AR language switcher before reading text.
  await page.evaluate(({ mask, maskSwitcher }) => {
    const selectors = ['.tabular-nums', '[class*="tabular-nums"]', ...(mask || [])];
    for (const sel of selectors) {
      try { document.querySelectorAll(sel).forEach((el) => { el.textContent = '[MASKED]'; }); } catch { /* bad selector */ }
    }
    if (maskSwitcher) {
      // The language switcher is a set of buttons whose exact label is EN/FR/AR
      // (see src/components/common/LanguageSwitcher.tsx). No content button uses
      // those exact strings, so this targets only the switcher. It exists solely
      // in the AFTER build, so masking it makes existing-content parity symmetric.
      document.querySelectorAll('button').forEach((el) => {
        const t = (el.textContent || '').trim();
        if (t === 'EN' || t === 'FR' || t === 'AR') el.textContent = '';
      });
    }
  }, { mask, maskSwitcher }).catch(() => {});

  let text = '';
  try { text = await page.locator('body').innerText({ timeout: 5000 }); } catch { text = ''; }
  await page.close();
  return normalizeText(text);
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.before || !args.after) {
    console.error('ERROR: --before and --after are required.');
    printHelp();
    process.exit(2);
  }

  const before = await resolveTarget(args.before);
  const after = await resolveTarget(args.after);

  const browser = await chromium.launch();
  const context = await browser.newContext({ locale: 'en-US' });

  const perRoute = [];
  const diffChunks = [];
  let totalChanged = 0;

  for (const route of args.routes) {
    const [bText, aText] = [
      await grabRoute(context, before.base, route, args.fixedTime, args.lang, args.mask, args.maskSwitcher),
      await grabRoute(context, after.base, route, args.fixedTime, args.lang, args.mask, args.maskSwitcher),
    ];
    const changed = editDistance(bText, aText);
    totalChanged += changed;
    perRoute.push({ route, changedChars: changed, beforeChars: bText.length, afterChars: aText.length });
    console.log(`  ${changed === 0 ? 'OK ' : '!! '} ${route.padEnd(28)} changed chars: ${changed}`);
    if (changed !== 0) {
      diffChunks.push(`\n=== route ${route}  (changed chars: ${changed}) ===`);
      diffChunks.push(...lineDiff(bText, aText));
    }
  }

  await browser.close();
  if (before.server) before.server.close();
  if (after.server) after.server.close();

  console.log(`\n  TOTAL CHANGED CHARACTERS: ${totalChanged}  (across ${args.routes.length} routes, English)\n`);

  if (args.json) {
    writeFileSync(args.json, JSON.stringify({
      tool: 'english-parity.mjs',
      before: args.before,
      after: args.after,
      lang: args.lang,
      fixedTime: args.fixedTime,
      mask: args.mask,
      maskSwitcher: args.maskSwitcher,
      generatedUtc: new Date().toISOString(),
      totalChangedChars: totalChanged,
      routes: perRoute,
    }, null, 2));
    console.log(`  wrote ${args.json}`);
  }
  if (args.diff) {
    writeFileSync(args.diff, (diffChunks.length ? diffChunks.join('\n') : 'No differences.') + '\n');
    console.log(`  wrote ${args.diff}`);
  }

  process.exit(totalChanged === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(2); });
