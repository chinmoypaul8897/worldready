#!/usr/bin/env node
// gen-style-guide.mjs — renders docs/style-guide.pdf from embedded HTML using Playwright's
// page.pdf(), so no new PDF dependency is needed.
//
// Authored by Claude Code (worker P03) — original content, no copied proprietary text.
// Bob reads this style guide during the i18n work.
//
// Usage:  node scripts/gen-style-guide.mjs [--out docs/style-guide.pdf]
// Requires Playwright chromium.

import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

function arg(name, def) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
}
const OUT = arg('--out', 'docs/style-guide.pdf');

const HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<style>
  :root{ --ink:#111827; --muted:#4b5563; --accent:#4338ca; --rule:#e5e7eb; --chip:#eef2ff; }
  *{ box-sizing:border-box; }
  html,body{ margin:0; padding:0; color:var(--ink); font:13px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; }
  .page{ padding:40px 48px; }
  .brk{ page-break-before:always; }
  h1{ font-size:24px; margin:0 0 2px; letter-spacing:-.2px; }
  .tag{ color:var(--muted); font-size:12px; margin:0 0 18px; }
  h2{ font-size:16px; margin:22px 0 6px; color:var(--accent); border-bottom:2px solid var(--rule); padding-bottom:4px; }
  h3{ font-size:13px; margin:14px 0 4px; }
  p,li{ color:var(--ink); }
  ul{ margin:4px 0 8px; padding-left:20px; }
  li{ margin:2px 0; }
  code{ background:#f3f4f6; padding:1px 5px; border-radius:4px; font-family:Consolas,Menlo,monospace; font-size:12px; }
  .good{ color:#065f46; } .bad{ color:#991b1b; }
  table{ border-collapse:collapse; width:100%; margin:6px 0 10px; font-size:12px; }
  th,td{ border:1px solid var(--rule); padding:6px 8px; text-align:left; vertical-align:top; }
  th{ background:var(--chip); }
  .rtl{ direction:rtl; text-align:right; }
  .note{ background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:8px 12px; margin:10px 0; }
  .foot{ color:var(--muted); font-size:11px; margin-top:20px; border-top:1px solid var(--rule); padding-top:6px; }
</style></head>
<body>

<div class="page">
  <h1>WorldReady — Localization Style Guide</h1>
  <p class="tag">Galaxium Travels · English → French (Quebec) + Arabic (RTL) · authored by Claude Code (P03)</p>

  <h2>1 · French for Quebec (fr-CA)</h2>
  <ul>
    <li><b>Register:</b> address the user with <b>« vous »</b>, never « tu ». Keep it professional and concise.</li>
    <li><b>Currency:</b> format money as <b>Canadian dollars (CAD)</b> in fr-CA, e.g. <code>1 200,00&nbsp;$&nbsp;CA</code> — comma decimal, space thousands, symbol after the number. Use <code>Intl.NumberFormat('fr-CA', { style:'currency', currency:'CAD' })</code>; never hard-code <code>en-US</code>/<code>USD</code>.</li>
    <li><b>Dates &amp; numbers:</b> day-month-year (<code>1&nbsp;juin&nbsp;2025</code>), 24-hour clock, comma decimal, space as thousands separator. Localize month names via a date-fns <code>fr</code> locale — never English month abbreviations.</li>
    <li><b>Quebec terminology:</b> use <b>courriel</b> (not « e-mail »), <b>clavardage</b> (chat), <b>téléverser</b> (upload). See the glossary for domain terms (vol, réservation, place, devis).</li>
    <li><b>Spacing:</b> French uses a non-breaking space before <code>: ; ! ?</code> and inside « guillemets ».</li>
    <li><b>Why it matters:</b> Quebec's Bill 96 / Law 14 has required French commercial web content since <b>1 June 2025</b>, with fines of <b>$3,000–$30,000 per violation</b>.</li>
  </ul>

  <h2>3 · Engineering rules (all languages)</h2>
  <h3>Never concatenate translated fragments</h3>
  <ul>
    <li class="bad">✗ <code>"Showing " + n + " flight" + (n!==1?"s":"")</code> — word order and plurals differ per language.</li>
    <li class="good">✓ <code>t('flights.count', { count: n })</code> with i18next plural keys (<code>_one</code>, <code>_other</code>, and for Arabic <code>_zero/_two/_few/_many</code>).</li>
  </ul>
  <h3>Keep placeholders &amp; markup intact</h3>
  <ul>
    <li>Preserve every <code>{{name}}</code> / <code>{{count}}</code> and <code>&lt;0&gt;…&lt;/0&gt;</code> tag exactly — do not translate, reorder-break, or delete them. Translators may move a placeholder within the sentence but must keep it verbatim.</li>
    <li>Numbers, dates and currency come from <code>Intl</code> keyed to the active language — not from the translation string.</li>
  </ul>
  <h3>String length limits</h3>
  <ul>
    <li>Translations run <b>up to ~30% longer</b> than English (French especially). Keep button/label copy tight; test with the <b>pseudo-locale</b> (⟦…⟧, +30%) to catch clipping before shipping.</li>
    <li>Respect the <code>max length</code> column in the translator spreadsheet for constrained UI (buttons, chips, nav).</li>
  </ul>

  <div class="foot">WorldReady localization style guide — page 1 of 2</div>
</div>

<div class="page brk">
  <h2>2 · Arabic (ar) — right-to-left</h2>
  <ul>
    <li><b>Direction:</b> the whole UI mirrors. Set <code>&lt;html dir="rtl" lang="ar"&gt;</code> (via <code>document.documentElement.dir = i18n.dir()</code>) and use logical CSS: <code>ms-/me-</code>, <code>ps-/pe-</code>, <code>start-/end-</code> instead of <code>ml-/mr-</code>, <code>pl-/pr-</code>, <code>left-/right-</code>.</li>
    <li><b>Mirrored icons:</b> directional icons (back arrows, chevrons, progress) must flip: <code>rtl:-scale-x-100</code> or swap <code>ArrowLeft</code>↔<code>ArrowRight</code>. Non-directional icons (rocket, user, clock) stay as-is.</li>
    <li><b>Digits:</b> use <b>Western/Latin digits</b> (0-9), not Eastern-Arabic (٠-٩), for prices and counts — match the product's market convention via <code>Intl.NumberFormat('ar', { numberingSystem:'latn' })</code>.</li>
    <li><b>Currency &amp; dates:</b> format through <code>Intl</code> keyed to <code>ar</code>; keep the currency the market expects (USD/CAD per business rule). Localize month names with a date-fns Arabic locale.</li>
    <li><b>Plurals:</b> Arabic has <b>six</b> plural forms — <code>zero, one, two, few, many, other</code>. Every countable string needs all six i18next keys; the key-parity checker enforces this.</li>
    <li><b>Brand names &amp; planet values:</b> keep <b>Galaxium</b> and other brand terms in Latin script (allow-listed). Translate planet <i>labels</i> (المريخ) but keep the English value (<code>Mars</code>) as the search/filter value.</li>
    <li><b>Punctuation:</b> use Arabic comma (،) and question mark (؟) where natural.</li>
  </ul>

  <div class="note">
    <b>Quality note:</b> machine drafts are for native review. This guide governs structure, formatting, placeholders and layout — not literary polish. Flag anything a native reviewer must confirm in the translator spreadsheet's <i>reviewer note</i> column.
  </div>

  <h3>Example (RTL)</h3>
  <table>
    <tr><th>English</th><th>Arabic (label)</th></tr>
    <tr><td>Available Flights</td><td class="rtl">الرحلات المتاحة</td></tr>
    <tr><td>{{count}} seats left</td><td class="rtl">‏{{count}} مقاعد متبقية</td></tr>
    <tr><td>Book a Flight</td><td class="rtl">احجز رحلة</td></tr>
  </table>

  <div class="foot">WorldReady localization style guide — page 2 of 2 · © Galaxium demo content authored by Claude Code (P03)</div>
</div>

</body></html>`;

const main = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(HTML, { waitUntil: 'networkidle' });
  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  await browser.close();
  console.log(`wrote ${OUT}`);
};

main().catch((e) => { console.error(e); process.exit(1); });
