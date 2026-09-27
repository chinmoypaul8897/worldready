# Bob task 6be2caca4e0a29e05a1e1a5571938917

- Title: # Task 09 — Build the WorldReady live viewer (the judge's page)**Mode:** Agent · **Date:** 2026-09-27 · **Bobcoin budget: 2.0 (stop and tell me if you would exceed it).**Build **one self-contained file, `viewer/index.html`** (inline CSS + vanilla JS; **no build step, noexternal JS except Google Fonts**). It is deployed at the site ROOT by the existing Pages workflow,which also copies `evidence/*.json` to `./evidence/` and the locale bundle to `./locales/` next to it.The current `viewer/index.html` is a throwaway placeholder — **replace it entirely**.Do **not** run the build or commit; do not edit anything outside `viewer/index.html`. Push back if adata contract below looks wrong. **Do not read the trap key or `evidence/traps-key*`.**## Same-origin facts you must rely on (do NOT use `?lng=`)- The viewer, `before/`, and `after/` are all on the same origin, so the viewer JS **can** read each  iframe's `contentDocument`.- The AFTER app detects language from **`localStorage['i18nextLng']`** (detector order is  `localStorage, navigator` — **`?lng=` does NOT work**). To switch the After pane: set  `localStorage.setItem('i18nextLng', code)` then **reload the After iframe** by assigning its `src`  (`after/#<route>`). Supported codes: `en`, `fr`, `ar`, `pseudo`. The After app sets  `<html dir="rtl">` itself for `ar`.- The BEFORE app ignores the picker (it has no i18n) — that is the point; keep it English always.## Layout1. **Top bar:** `WorldReady` wordmark + tagline **“World-ready in a day. Proven, and kept that way.”**   + a language picker with four buttons **English · Français · العربية · Pseudo** + a **“Scan for   hard-coded text”** button. Clean, modern, dark, accessible contrast (WCAG AA). Sticky.2. **Counters strip** — fetch `./evidence/evidence.json` (on failure fall back to `./evidence/after-literals.json` etc.). Show 5 tiles from `headline`:   - Hard-coded strings: `hardCodedStrings.before` → `hardCodedStrings.after` (e.g. **305 → 0**).   - Traps fixed: `trapsFixed.fixed`/`trapsFixed.total` (e.g. **24/30**).   - English content changed: `englishChanged.existingContent` (e.g. **0**).   - Languages: `languages.before` → `languages.after` (e.g. **1 → 3**), note “+ pseudo”.   - Bobcoins used: `bobcoins.usedTotal`.3. **Two panes, side by side (desktop) / tabbed (≤ 768 px):**   - **Before** — `<iframe src="before/">`, labelled “Before — IBM Galaxium (English only)”. It     ignores the picker.   - **After** — `<iframe src="after/">`, labelled “After — WorldReady”. It follows the picker via the     localStorage-then-reload mechanism above.4. **Arabic plural showcase card** (the hero). Fetch `./locales/en/pages.json`, `./locales/fr/pages.json`,   `./locales/ar/pages.json`. For each **count in [0, 1, 2, 3, 11, 100]** render the app's real plural   string `flights.showingCount` by:   - category = `new Intl.PluralRules(lng, { type: 'cardinal' }).select(count)` (for `ar` this yields     `zero, one, two, few, many, other` across those six counts — show the category name next to each);   - pick `pages.flights['showingCount_' + category]` (fall back to `_other`);   - interpolate `{{count}}` with `new Intl.NumberFormat(lng).format(count)`.   Show a small table: count · Arabic string · **plural category**. Add EN and FR columns too. Caption:   “Rendered by the real After i18n bundle — all six Arabic plural categories.”5. **Scan** (button in the top bar; also auto-re-run 400 ms after any language switch or iframe load):   walk **both** iframes' visible text nodes **plus** the attributes `aria-label`, `title`,   `placeholder`, `alt`. Detect hard-coded text:   - **Pseudo** locale: any visible text that contains Latin letters and is **not** wrapped in `⟦ … ⟧`     is hard-coded (everything translated is bracket-wrapped).   - **Arabic** locale: any **Latin-letter** word is hard-coded **unless** it is on the allowlist.   - **Allowlist (not flagged):** the brand words `Galaxium`, `Travels`, `Class`, `WorldReady`, `Bob`;     the language codes `EN`, `FR`, `AR`; and pure numbers / currency / dates / times (any token with no     letters, plus month/weekday tokens). Match per **word token**, so “Galaxium Travels” and     “Galaxium Class” are fully allowlisted.   - Draw a **red outline** (`outline: 2px solid #ef4444`) on each offending element inside the iframe,     and show a result line **“Before: N hard-coded · After: 0”** (N is the Before pane's count in the     current locale; After should be 0). The Before pane is always English, so treat Before as pseudo/ar     the same way (its English text is all un-bracketed Latin → it lights up; that contrast is the point).   - It must survive navigation inside the iframes and re-run when the After iframe reloads.6. **Evidence drawer** (collapsible; tabs):   - **Traps:** show `trapsFixed.fixed`/`.total` and, from `evidence.json`     `details.provenance.trapKeySha256`, the committed SHA-256, with the line “full key published after     final scoring”. If `evidence.json` has a `trapsByCategory`, render it as a small table.   - **Translator sheet:** a download link to `./docs/translator.csv`… actually link to     `https://github.com/chinmoypaul8897/worldready/blob/main/docs/translator.csv` (the workflow does not     copy docs/). Note “human review edits land in the morning”.   - **Bob sessions:** render a table from `evidence.json` `bobSessions` (id · task · mode · bobcoins).   - **Proof:** links to `liveUrls.actions` (GitHub Actions) and `liveUrls.repo`.7. **Deep links:** on load, parse `location.search`: `?lng=ar&route=/destinations/mars` → set the picker   to that language and point the After iframe at `after/#<route>` (and the Before iframe at   `before/#<route>`). Default route `#/`.8. **Footer / credits:** “Built with IBM Bob”, the Galaxium attribution (“Demo app: IBM Galaxium   Travels, Apache-2.0”), and a repo link (`liveUrls.repo`). Use Google Fonts only (e.g. Inter + Noto   Sans Arabic); no other external resources.## Acceptance (I will verify with Playwright at desktop and 390 px)- Picker flips the After pane to Arabic RTL (`<html dir=rtl>`), and to Pseudo (`⟦…⟧`).- Scan shows Before > 0 and After = 0 in both Pseudo and Arabic.- The plural card shows all six Arabic categories for [0,1,2,3,11,100].- No console errors; responsive (tabs ≤ 768 px).Keep everything in `viewer/index.html`. List what you built when done.
- Workspace: file:c:\Users\chinm\bob-hackathon-app
- Bobcoins: 0.7564820000000001
- Context tokens: 60620
- Created: 2026-09-27 11:30:14

**User:**

# Task 09 — Build the WorldReady live viewer (the judge's page)**Mode:** Agent · **Date:** 2026-09-27 · **Bobcoin budget: 2.0 (stop and tell me if you would exceed it).**Build **one self-contained file, `viewer/index.html`** (inline CSS + vanilla JS; **no build step, noexternal JS except Google Fonts**). It is deployed at the site ROOT by the existing Pages workflow,which also copies `evidence/*.json` to `./evidence/` and the locale bundle to `./locales/` next to it.The current `viewer/index.html` is a throwaway placeholder — **replace it entirely**.Do **not** run the build or commit; do not edit anything outside `viewer/index.html`. Push back if adata contract below looks wrong. **Do not read the trap key or `evidence/traps-key*`.**## Same-origin facts you must rely on (do NOT use `?lng=`)- The viewer, `before/`, and `after/` are all on the same origin, so the viewer JS **can** read each  iframe's `contentDocument`.- The AFTER app detects language from **`localStorage['i18nextLng']`** (detector order is  `localStorage, navigator` — **`?lng=` does NOT work**). To switch the After pane: set  `localStorage.setItem('i18nextLng', code)` then **reload the After iframe** by assigning its `src`  (`after/#<route>`). Supported codes: `en`, `fr`, `ar`, `pseudo`. The After app sets  `<html dir="rtl">` itself for `ar`.- The BEFORE app ignores the picker (it has no i18n) — that is the point; keep it English always.## Layout1. **Top bar:** `WorldReady` wordmark + tagline **“World-ready in a day. Proven, and kept that way.”**   + a language picker with four buttons **English · Français · العربية · Pseudo** + a **“Scan for   hard-coded text”** button. Clean, modern, dark, accessible contrast (WCAG AA). Sticky.2. **Counters strip** — fetch `./evidence/evidence.json` (on failure fall back to `./evidence/after-literals.json` etc.). Show 5 tiles from `headline`:   - Hard-coded strings: `hardCodedStrings.before` → `hardCodedStrings.after` (e.g. **305 → 0**).   - Traps fixed: `trapsFixed.fixed`/`trapsFixed.total` (e.g. **24/30**).   - English content changed: `englishChanged.existingContent` (e.g. **0**).   - Languages: `languages.before` → `languages.after` (e.g. **1 → 3**), note “+ pseudo”.   - Bobcoins used: `bobcoins.usedTotal`.3. **Two panes, side by side (desktop) / tabbed (≤ 768 px):**   - **Before** — `<iframe src="before/">`, labelled “Before — IBM Galaxium (English only)”. It     ignores the picker.   - **After** — `<iframe src="after/">`, labelled “After — WorldReady”. It follows the picker via the     localStorage-then-reload mechanism above.4. **Arabic plural showcase card** (the hero). Fetch `./locales/en/pages.json`, `./locales/fr/pages.json`,   `./locales/ar/pages.json`. For each **count in [0, 1, 2, 3, 11, 100]** render the app's real plural   string `flights.showingCount` by:   - category = `new Intl.PluralRules(lng, { type: 'cardinal' }).select(count)` (for `ar` this yields     `zero, one, two, few, many, other` across those six counts — show the category name next to each);   - pick `pages.flights['showingCount_' + category]` (fall back to `_other`);   - interpolate `{{count}}` with `new Intl.NumberFormat(lng).format(count)`.   Show a small table: count · Arabic string · **plural category**. Add EN and FR columns too. Caption:   “Rendered by the real After i18n bundle — all six Arabic plural categories.”5. **Scan** (button in the top bar; also auto-re-run 400 ms after any language switch or iframe load):   walk **both** iframes' visible text nodes **plus** the attributes `aria-label`, `title`,   `placeholder`, `alt`. Detect hard-coded text:   - **Pseudo** locale: any visible text that contains Latin letters and is **not** wrapped in `⟦ … ⟧`     is hard-coded (everything translated is bracket-wrapped).   - **Arabic** locale: any **Latin-letter** word is hard-coded **unless** it is on the allowlist.   - **Allowlist (not flagged):** the brand words `Galaxium`, `Travels`, `Class`, `WorldReady`, `Bob`;     the language codes `EN`, `FR`, `AR`; and pure numbers / currency / dates / times (any token with no     letters, plus month/weekday tokens). Match per **word token**, so “Galaxium Travels” and     “Galaxium Class” are fully allowlisted.   - Draw a **red outline** (`outline: 2px solid #ef4444`) on each offending element inside the iframe,     and show a result line **“Before: N hard-coded · After: 0”** (N is the Before pane's count in the     current locale; After should be 0). The Before pane is always English, so treat Before as pseudo/ar     the same way (its English text is all un-bracketed Latin → it lights up; that contrast is the point).   - It must survive navigation inside the iframes and re-run when the After iframe reloads.6. **Evidence drawer** (collapsible; tabs):   - **Traps:** show `trapsFixed.fixed`/`.total` and, from `evidence.json`     `details.provenance.trapKeySha256`, the committed SHA-256, with the line “full key published after     final scoring”. If `evidence.json` has a `trapsByCategory`, render it as a small table.   - **Translator sheet:** a download link to `./docs/translator.csv`… actually link to     `https://github.com/chinmoypaul8897/worldready/blob/main/docs/translator.csv` (the workflow does not     copy docs/). Note “human review edits land in the morning”.   - **Bob sessions:** render a table from `evidence.json` `bobSessions` (id · task · mode · bobcoins).   - **Proof:** links to `liveUrls.actions` (GitHub Actions) and `liveUrls.repo`.7. **Deep links:** on load, parse `location.search`: `?lng=ar&route=/destinations/mars` → set the picker   to that language and point the After iframe at `after/#<route>` (and the Before iframe at   `before/#<route>`). Default route `#/`.8. **Footer / credits:** “Built with IBM Bob”, the Galaxium attribution (“Demo app: IBM Galaxium   Travels, Apache-2.0”), and a repo link (`liveUrls.repo`). Use Google Fonts only (e.g. Inter + Noto   Sans Arabic); no other external resources.## Acceptance (I will verify with Playwright at desktop and 390 px)- Picker flips the After pane to Arabic RTL (`<html dir=rtl>`), and to Pseudo (`⟦…⟧`).- Scan shows Before > 0 and After = 0 in both Pseudo and Arabic.- The plural card shows all six Arabic categories for [0,1,2,3,11,100].- No console errors; responsive (tabs ≤ 768 px).Keep everything in `viewer/index.html`. List what you built when done.

**Assistant:**



_spend: {'cost': 0.033506, 'contextTokens': 16753}_

**Tool:**

To do list updated: 4 items total.

Next to do item inprogress: Read existing viewer/index.html and understand project structure

**Assistant:**



_spend: {'cost': 0.033804, 'contextTokens': 16902}_

**Tool:**

Directory listing for .:

.bob\
.bobignore
.git\
.github\
.gitignore
bob_sessions\
DATA_SOURCES.md
dist\
docs\
eslint.config.js
eslint.i18n.config.mjs
evidence\
index.html
LICENSE
LICENSE-GALAXIUM
node_modules\
package-lock.json
package.json
plans\
postcss.config.js
public\
README.md
scripts\
SECURITY.MD
src\
tailwind.config.js
tsconfig.app.json
tsconfig.node.json
viewer\
vite.config.ts

**Tool:**

No files found

**Assistant:**



_spend: {'cost': 0.034416, 'contextTokens': 17208}_

**Tool:**

Directory listing for evidence:

evidence\after-extraction.json
evidence\after-key-parity.json
evidence\after-literals.json
evidence\after-parity-unmasked.json
evidence\after-parity.diff
evidence\after-parity.json
evidence\after-translation.json
evidence\baseline-plain-bob.json
evidence\baseline.json
evidence\before-literals-refined.json
evidence\evidence.json
evidence\generalization.json
evidence\literals-before.json
evidence\literals-method.md
evidence\traps-key.sha256
evidence\TRAPS_README.md

**Tool:**

Directory listing for viewer:

viewer\index.html

**Assistant:**



_spend: {'cost': 0.03505, 'contextTokens': 17525}_

**Tool:**

Contents of file viewer/index.html:

1 | <!doctype html>
2 | <html lang="en">
3 |   <head>
4 |     <meta charset="UTF-8" />
5 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
6 |     <title>WorldReady</title>
7 |     <style>
8 |       :root { color-scheme: dark; }
9 |       * { box-sizing: border-box; }
10 |       body {
11 |         margin: 0;
12 |         font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
13 |         background: #0b0f1a;
14 |         color: #e8ecf5;
15 |       }
16 |       header {
17 |         display: flex;
18 |         align-items: center;
19 |         gap: 1rem;
20 |         flex-wrap: wrap;
21 |         padding: 0.9rem 1.25rem;
22 |         border-bottom: 1px solid #232a3d;
23 |         background: #10162a;
24 |       }
25 |       h1 { font-size: 1.1rem; margin: 0; font-weight: 700; }
26 |       h1 span { color: #a78bfa; }
27 |       .tag {
28 |         font-size: 0.7rem;
29 |         text-transform: uppercase;
30 |         letter-spacing: 0.08em;
31 |         color: #f59e0b;
32 |         border: 1px solid #f59e0b55;
33 |         background: #f59e0b11;
34 |         padding: 0.15rem 0.5rem;
35 |         border-radius: 999px;
36 |       }
37 |       label { font-size: 0.85rem; color: #9aa4bd; }
38 |       select {
39 |         background: #1a2138;
40 |         color: #e8ecf5;
41 |         border: 1px solid #2c3550;
42 |         border-radius: 6px;
43 |         padding: 0.35rem 0.6rem;
44 |         font-size: 0.85rem;
45 |       }
46 |       .frames {
47 |         display: grid;
48 |         grid-template-columns: 1fr 1fr;
49 |         gap: 1px;
50 |         background: #232a3d;
51 |         height: calc(100vh - 108px);
52 |       }
53 |       @media (max-width: 800px) {
54 |         .frames { grid-template-columns: 1fr; height: auto; }
55 |         iframe { height: 70vh; }
56 |       }
57 |       .pane { display: flex; flex-direction: column; background: #0b0f1a; }
58 |       .pane h2 {
59 |         margin: 0;
60 |         font-size: 0.8rem;
61 |         font-weight: 600;
62 |         padding: 0.5rem 0.9rem;
63 |         color: #9aa4bd;
64 |         border-bottom: 1px solid #1a2138;
65 |       }
66 |       iframe { border: 0; width: 100%; height: 100%; flex: 1; background: #0b0f1a; }
67 |       .note {
68 |         padding: 0.5rem 1.25rem;
69 |         font-size: 0.75rem;
70 |         color: #6b7590;
71 |         background: #0d1324;
72 |         border-top: 1px solid #1a2138;
73 |       }
74 |     </style>
75 |   </head>
76 |   <body>
77 |     <!-- Placeholder viewer — Bob builds the real comparison viewer in a later task.
78 |          Keep this minimal and clearly temporary. -->
79 |     <header>
80 |       <h1>World<span>Ready</span></h1>
81 |       <span class="tag">Placeholder viewer</span>
82 |       <div style="margin-left:auto; display:flex; align-items:center; gap:0.5rem;">
83 |         <label for="lang">Language</label>
84 |         <select id="lang" aria-label="Language (not wired up yet)">
85 |           <option value="en">English</option>
86 |           <option value="fr">Français</option>
87 |           <option value="ar">العربية</option>
88 |         </select>
89 |       </div>
90 |     </header>
91 | 
92 |     <div class="frames">
93 |       <div class="pane">
94 |         <h2>Before — IBM Galaxium (English only)</h2>
95 |         <iframe src="before/" title="Before: original English-only Galaxium app"></iframe>
96 |       </div>
97 |       <div class="pane">
98 |         <h2>After — WorldReady</h2>
99 |         <iframe src="after/" title="After: WorldReady internationalized app"></iframe>
100 |       </div>
101 |     </div>
102 | 
103 |     <p class="note">
104 |       Temporary shell. The language picker is not wired up yet; the real viewer
105 |       (language switching, RTL flip, trap highlights) is built later by Bob.
106 |     </p>
107 |   </body>
108 | </html>
109 |

**Tool:**

Contents of file evidence/evidence.json:

1 | {
2 |   "_comment": "Single source of truth for the WorldReady viewer counters + evidence drawer. Authored by Claude Code (worker P07). Numbers are produced by the independent verifiers in scripts/ (never by IBM Bob). trapsFixed/trapsByCategory/bobcoins are finalized after the T13/T14 sweep by P07.",
3 |   "generatedUtc": "2026-09-27T00:00:00Z",
4 |   "finalizedBy": "P07",
5 |   "liveUrls": {
6 |     "viewer": "https://chinmoypaul8897.github.io/worldready/",
7 |     "before": "https://chinmoypaul8897.github.io/worldready/before/",
8 |     "after": "https://chinmoypaul8897.github.io/worldready/after/",
9 |     "repo": "https://github.com/chinmoypaul8897/worldready",
10 |     "actions": "https://github.com/chinmoypaul8897/worldready/actions"
11 |   },
12 |   "headline": {
13 |     "hardCodedStrings": {
14 |       "before": 305,
15 |       "after": 0,
16 |       "label": "hard-coded, user-visible English strings",
17 |       "source": "scripts/count-literals.mjs (refined ruler) on v0-before vs main",
18 |       "files": ["evidence/before-literals-refined.json", "evidence/after-literals.json"],
19 |       "oldRuler": { "before": 320, "after": 155, "note": "the 155 were all false positives (key paths, format patterns, English-kept enum values); see evidence/literals-method.md" }
20 |     },
21 |     "trapsFixed": {
22 |       "fixed": 24,
23 |       "total": 30,
24 |       "label": "engineered i18n traps fixed",
25 |       "note": "PRELIMINARY (pre-sweep). Finalized after the T13/T14 sweep. Held-out key; no Bob prompt referenced any trap.",
26 |       "source": "scripts/score-traps.mjs --key <held-out> --dir .",
27 |       "file": "evidence/after-traps.json"
28 |     },
29 |     "englishChanged": {
30 |       "existingContent": 0,
31 |       "withSwitcher": 45,
32 |       "label": "characters of existing English content changed by the retrofit",
33 |       "note": "0 in existing content (the EN/FR/AR switcher is new UI; unmasked delta is 45 = 9 chars x 5 routes, all additions).",
34 |       "source": "scripts/english-parity.mjs --mask-switcher (before vs after, frozen clock)",
35 |       "files": ["evidence/after-parity.json", "evidence/after-parity-unmasked.json"]
36 |     },
37 |     "languages": {
38 |       "before": 1,
39 |       "after": 3,
40 |       "list": ["en", "fr", "ar"],
41 |       "plusPseudo": true,
42 |       "label": "shipped languages (+ a pseudo-locale used to prove coverage)",
43 |       "source": "src/locales/{en,fr,ar,pseudo}; scripts/key-parity.mjs"
44 |     },
45 |     "bobcoins": {
46 |       "usedTotal": 15.16,
47 |       "label": "Bobcoins IBM Bob spent building this (of 40)",
48 |       "note": "PRELIMINARY; finalized after P07's Bob tasks.",
49 |       "source": "Bob task DB (~/.bob/db/bob.db)"
50 |     }
51 |   },
52 |   "details": {
53 |     "keyParity": { "result": "PASS", "locales": { "fr": "{one,many,other}", "ar": "{zero,one,two,few,many,other}", "pseudo": "{one,other}" }, "missing": 0, "extra": 0, "source": "scripts/key-parity.mjs", "file": "evidence/after-key-parity.json" },
54 |     "rtl": { "physicalClassesBefore": 12, "physicalClassesAfter": 0, "directionalArrows": "3/3 mirrored (rtl:-scale-x-100)", "htmlDirBefore": "ltr, no dir attribute", "htmlDirAfter": "rtl for ar", "arabicFont": "Noto Sans Arabic, scoped to [lang=ar]/[dir=rtl]", "source": "evidence/after-translation.json" },
55 |     "arabicPlural": { "key": "pages.flights.showingCount", "categories": ["zero", "one", "two", "few", "many", "other"], "counts": [0, 1, 2, 3, 11, 100], "note": "all six Arabic CLDR plural categories exercised by the real after bundle" },
56 |     "translatorRoundTrip": { "file": "docs/translator.csv", "rows": 352, "note": "human-review edits land in the morning (P10)" },
57 |     "provenance": { "trapKeyEarlyExposure": "An early commit (918222d) accidentally contained the trap list for ~3 minutes before any Bob task ran; no Bob prompt ever referenced it; the plain-Bob baseline on the same folder is the fairness control.", "trapKeySha256": "ef68d1a6e1ba4d320b3071b187cb838ac59b943af69186157f99e55ec5d5ae3e" }
58 |   },
59 |   "bobSessions": [
60 |     { "id": "T01", "task": "i18n plan (key convention, 5-worker ownership map, Intl/RTL/data rules)", "mode": "Plan + Explore subagent + document understanding", "bobcoins": 0.576, "taskId": "4593193355a8c601be89e9368f417114" },
61 |     { "id": "T02", "task": ".bob kit: i18n-extractor mode (fileRegex), i18n-extract skill, PreToolUse commit-gate hook", "mode": "Agent", "bobcoins": 0.400, "taskId": "1da972e2c73ac0b46b3757e612b08bea" },
62 |     { "id": "T02b", "task": "Mode-restriction proof: Bob refused to edit a Claude-owned checker", "mode": "i18n Extractor", "bobcoins": 0.024, "taskId": "243260a8b02b2935a12e62c5a1fde565" },
63 |     { "id": "T11", "task": "Plain-Bob baseline (no kit): 3/5 bookings traps, literals 55->14, stopped by cap", "mode": "Agent (no kit)", "bobcoins": 1.064, "taskId": "090ce6865907faf00e558d448673a5ff" },
64 |     { "id": "T03", "task": "Parallel i18n extraction - 5 general subagents at once (348 en strings)", "mode": "i18n Extractor + 5 parallel subagents", "bobcoins": 5.16, "taskId": "f44585c5aed55170d1beb12b66454ab6" },
65 |     { "id": "T04", "task": "Runtime wiring: i18next + LanguageDetector, LanguageSwitcher, Intl formatters", "mode": "Agent (parallel task)", "bobcoins": 0.675, "taskId": "ba080509d8970ec1abd49ef8614d5bc9" },
66 |     { "id": "T05a", "task": "Merge fixes: nsSeparator '.', destination key resolution", "mode": "i18n Extractor", "bobcoins": 1.094, "taskId": "26647736b7e88b2bcd01d5ea0db1f9d5" },
67 |     { "id": "T05b", "task": "Place LanguageSwitcher in the header", "mode": "i18n Extractor", "bobcoins": 0.106, "taskId": "8e3b8c75eb676be5b7fd96dd4f77e958" },
68 |     { "id": "T06", "task": "French (Quebec) + Arabic translation of all 5 namespaces + translator.csv", "mode": "Agent + document understanding + Office write", "bobcoins": 3.62, "taskId": "60fa3dfe0da14b05066c173069cb3efb" },
69 |     { "id": "T08", "task": "RTL layout pass: logical utilities, mirrored icons, Noto Sans Arabic", "mode": "Agent + Explore subagent", "bobcoins": 1.34, "taskId": "d8984dc930b951148242923f8bb9bdd4" }
70 |   ]
71 | }
72 |

**Assistant:**



_spend: {'cost': 0.043202, 'contextTokens': 21601}_

**Tool:**

Directory listing for docs:

docs\glossary.xlsx
docs\style-guide.pdf
docs\translator.csv

**Tool:**

No files found

**Assistant:**



_spend: {'cost': 0.043496, 'contextTokens': 21748}_

**Tool:**

No files found

**Assistant:**



_spend: {'cost': 0.04364, 'contextTokens': 21820}_

**Tool:**

src\locales\ar\destinations.json
src\locales\ar\common.json
src\locales\ar\bookings.json
src\locales\ar\flights.json
src\locales\ar\pages.json
src\locales\fr\destinations.json
src\locales\fr\common.json
src\locales\fr\bookings.json
src\locales\fr\flights.json
src\locales\fr\pages.json
src\locales\pseudo\pages.json
src\locales\pseudo\flights.json
src\locales\pseudo\destinations.json
src\locales\pseudo\common.json
src\locales\pseudo\bookings.json
src\locales\en\common.json
src\locales\en\destinations.json
src\locales\en\pages.json
src\locales\en\bookings.json
src\locales\en\flights.json

**Assistant:**



_spend: {'cost': 0.044324, 'contextTokens': 22162}_

**Tool:**

Contents of file src/locales/en/pages.json:

1 | {
2 |   "home": {
3 |     "heroTitle1": "Journey Beyond",
4 |     "heroTitle2": "The Stars",
5 |     "heroSubtitle": "Experience the future of space travel with Galaxium. Book your interplanetary flight and explore the wonders of our solar system.",
6 |     "exploreFlights": "Explore Flights",
7 |     "learnMore": "Learn More",
8 |     "whyChoose": "Why Choose Galaxium?",
9 |     "feature1Title": "Interplanetary Travel",
10 |     "feature1Desc": "Explore destinations across the solar system with our state-of-the-art spacecraft.",
11 |     "feature2Title": "Multiple Destinations",
12 |     "feature2Desc": "From Mars to Europa, discover new worlds and book your journey today.",
13 |     "feature3Title": "Safe & Secure",
14 |     "feature3Desc": "Your safety is our priority with advanced navigation and life support systems.",
15 |     "feature4Title": "Instant Booking",
16 |     "feature4Desc": "Book your flight in seconds and receive instant confirmation.",
17 |     "exploreDestinations": "Explore Our Destinations",
18 |     "destinationBadge": "Destination",
19 |     "ctaTitle": "Ready for Your Space Adventure?",
20 |     "ctaBody": "Join thousands of space travelers who have already booked their journey to the stars. Your adventure awaits!",
21 |     "bookNow": "Book Your Flight Now"
22 |   },
23 |   "flights": {
24 |     "titlePart1": "Available",
25 |     "titlePart2": "Flights",
26 |     "subtitle": "Choose your destination and embark on an interplanetary adventure",
27 |     "searchPlaceholder": "Search by origin or destination...",
28 |     "showingCount_one": "Showing {{count}} flight",
29 |     "showingCount_other": "Showing {{count}} flights",
30 |     "loadingText": "Loading flights...",
31 |     "noResults": "No flights found matching your criteria",
32 |     "retryError": "Failed to load flights. Retrying... ({{attempt}}/{{max}})",
33 |     "maxRetriesError": "Failed to load flights after multiple attempts"
34 |   },
35 |   "myBookings": {
36 |     "titlePart1": "My",
37 |     "titlePart2": "Bookings",
38 |     "subtitle": "Manage your space travel reservations",
39 |     "loadingText": "Loading your bookings...",
40 |     "pendingHolds": "Pending Holds ({{count}})",
41 |     "confirmBeforeExpiry": "Confirm before time runs out",
42 |     "noBookingsTitle": "No bookings yet",
43 |     "noBookingsBody": "Start your space adventure by booking your first flight!",
44 |     "browseFlights": "Browse Flights",
45 |     "activeBookings": "Active Bookings ({{count}})",
46 |     "pastBookings": "Past Bookings ({{count}})",
47 |     "cancelTitle": "Cancel Booking",
48 |     "cancelConfirm": "Are you sure you want to cancel this booking? This action cannot be undone.",
49 |     "keepBooking": "Keep Booking",
50 |     "cancelButton": "Cancel Booking",
51 |     "toastLoadError": "Failed to load bookings",
52 |     "toastCancelSuccess": "Booking cancelled successfully",
53 |     "toastCancelError": "Failed to cancel booking"
54 |   },
55 |   "destination": {
56 |     "notFoundTitle": "We haven't charted this world yet",
57 |     "notFoundBody": "The destination <1>/{{slug}}</1> doesn't exist in our star charts.",
58 |     "backToHome": "Back to Home",
59 |     "allDestinations": "All Destinations",
60 |     "destinationBadge": "Destination",
61 |     "quickFacts": "Quick Facts",
62 |     "factGravity": "Gravity",
63 |     "factDistance": "Distance from Earth",
64 |     "factTransitTime": "Typical Transit Time",
65 |     "factSurfaceTemp": "Surface Temperature",
66 |     "factMoons": "Moons",
67 |     "factAtmosphere": "Atmosphere",
68 |     "hazardAdvisory": "Hazard Advisory",
69 |     "gallery": "Gallery",
70 |     "flightsSoonTitle": "Flights Departing Soon",
71 |     "flightsSoonSubtitle": "Live availability — up to 5 upcoming departures to {{name}}",
72 |     "loadingSchedules": "Checking flight schedules…",
73 |     "noFlightsTitle": "No upcoming flights to {{name}} right now.",
74 |     "noFlightsHint": "Check back soon — new routes are added regularly.",
75 |     "priceFrom": "From",
76 |     "bookButton": "Book",
77 |     "toastFlightsError": "Could not load departing flights"
78 |   }
79 | }
80 |

**Tool:**

Contents of file src/locales/ar/pages.json:

1 | {
2 |   "home": {
3 |     "heroTitle1": "سافر إلى ما وراء",
4 |     "heroTitle2": "النجوم",
5 |     "heroSubtitle": "اختبر مستقبل السفر الفضائي مع Galaxium. احجز رحلتك بين الكواكب واستكشف عجائب نظامنا الشمسي.",
6 |     "exploreFlights": "استكشف الرحلات",
7 |     "learnMore": "اعرف المزيد",
8 |     "whyChoose": "لماذا تختار Galaxium؟",
9 |     "feature1Title": "السفر بين الكواكب",
10 |     "feature1Desc": "استكشف وجهات عبر النظام الشمسي على متن مركباتنا الفضائية المتطورة.",
11 |     "feature2Title": "وجهات متعددة",
12 |     "feature2Desc": "من المريخ إلى أوروبا، اكتشف عوالم جديدة واحجز رحلتك اليوم.",
13 |     "feature3Title": "آمن وموثوق",
14 |     "feature3Desc": "سلامتك أولويتنا بفضل أنظمة الملاحة ودعم الحياة المتقدمة.",
15 |     "feature4Title": "حجز فوري",
16 |     "feature4Desc": "احجز رحلتك في ثوانٍ واستلم تأكيداً فورياً.",
17 |     "exploreDestinations": "استكشف وجهاتنا",
18 |     "destinationBadge": "وجهة",
19 |     "ctaTitle": "هل أنت مستعد لمغامرتك الفضائية؟",
20 |     "ctaBody": "انضم إلى آلاف المسافرين الفضائيين الذين حجزوا رحلاتهم إلى النجوم. مغامرتك في انتظارك!",
21 |     "bookNow": "احجز رحلتك الآن"
22 |   },
23 |   "flights": {
24 |     "titlePart1": "الرحلات",
25 |     "titlePart2": "المتاحة",
26 |     "subtitle": "اختر وجهتك وانطلق في مغامرة بين الكواكب",
27 |     "searchPlaceholder": "ابحث حسب المنشأ أو الوجهة...",
28 |     "showingCount_zero": "لا توجد رحلات",
29 |     "showingCount_one": "رحلة واحدة ({{count}})",
30 |     "showingCount_two": "رحلتان ({{count}})",
31 |     "showingCount_few": "{{count}} رحلات",
32 |     "showingCount_many": "{{count}} رحلة",
33 |     "showingCount_other": "{{count}} رحلة",
34 |     "loadingText": "جارٍ تحميل الرحلات...",
35 |     "noResults": "لم يتم العثور على رحلات تطابق معاييرك",
36 |     "retryError": "فشل تحميل الرحلات. إعادة المحاولة... ({{attempt}}/{{max}})",
37 |     "maxRetriesError": "فشل تحميل الرحلات بعد محاولات متعددة"
38 |   },
39 |   "myBookings": {
40 |     "titlePart1": "حجوزاتي",
41 |     "titlePart2": "",
42 |     "subtitle": "إدارة حجوزات سفرك الفضائي",
43 |     "loadingText": "جارٍ تحميل حجوزاتك...",
44 |     "pendingHolds": "الحجوزات المؤقتة المعلّقة ({{count}})",
45 |     "confirmBeforeExpiry": "أكّد قبل انتهاء الوقت",
46 |     "noBookingsTitle": "لا توجد حجوزات بعد",
47 |     "noBookingsBody": "ابدأ مغامرتك الفضائية بحجز رحلتك الأولى!",
48 |     "browseFlights": "تصفح الرحلات",
49 |     "activeBookings": "الحجوزات النشطة ({{count}})",
50 |     "pastBookings": "الحجوزات السابقة ({{count}})",
51 |     "cancelTitle": "إلغاء الحجز",
52 |     "cancelConfirm": "هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.",
53 |     "keepBooking": "الإبقاء على الحجز",
54 |     "cancelButton": "إلغاء الحجز",
55 |     "toastLoadError": "فشل تحميل الحجوزات",
56 |     "toastCancelSuccess": "تم إلغاء الحجز بنجاح",
57 |     "toastCancelError": "فشل إلغاء الحجز"
58 |   },
59 |   "destination": {
60 |     "notFoundTitle": "لم نرسم خرائط لهذا العالم بعد",
61 |     "notFoundBody": "الوجهة <1>/{{slug}}</1> غير موجودة في خرائطنا النجمية.",
62 |     "backToHome": "العودة إلى الصفحة الرئيسية",
63 |     "allDestinations": "جميع الوجهات",
64 |     "destinationBadge": "وجهة",
65 |     "quickFacts": "معلومات سريعة",
66 |     "factGravity": "الجاذبية",
67 |     "factDistance": "المسافة من الأرض",
68 |     "factTransitTime": "وقت العبور المعتاد",
69 |     "factSurfaceTemp": "درجة حرارة السطح",
70 |     "factMoons": "الأقمار",
71 |     "factAtmosphere": "الغلاف الجوي",
72 |     "hazardAdvisory": "تحذير المخاطر",
73 |     "gallery": "معرض الصور",
74 |     "flightsSoonTitle": "الرحلات المغادرة قريباً",
75 |     "flightsSoonSubtitle": "التوفر الفوري — حتى 5 مغادرات قادمة إلى {{name}}",
76 |     "loadingSchedules": "جارٍ التحقق من جداول الرحلات...",
77 |     "noFlightsTitle": "لا توجد رحلات قادمة إلى {{name}} في الوقت الحالي.",
78 |     "noFlightsHint": "تحقق لاحقاً — تُضاف مسارات جديدة بانتظام.",
79 |     "priceFrom": "ابتداءً من",
80 |     "bookButton": "احجز",
81 |     "toastFlightsError": "تعذّر تحميل الرحلات المغادرة"
82 |   }
83 | }
84 |

**Assistant:**



_spend: {'cost': 0.051812, 'contextTokens': 25906}_

**Tool:**

Contents of file src/locales/fr/pages.json:

1 | {
2 |   "home": {
3 |     "heroTitle1": "Voyagez au-delà",
4 |     "heroTitle2": "des étoiles",
5 |     "heroSubtitle": "Vivez l'avenir du voyage spatial avec Galaxium. Réservez votre vol interplanétaire et explorez les merveilles de notre système solaire.",
6 |     "exploreFlights": "Explorer les vols",
7 |     "learnMore": "En savoir plus",
8 |     "whyChoose": "Pourquoi choisir Galaxium?",
9 |     "feature1Title": "Voyage interplanétaire",
10 |     "feature1Desc": "Explorez des destinations à travers le système solaire à bord de nos vaisseaux spatiaux de pointe.",
11 |     "feature2Title": "Destinations multiples",
12 |     "feature2Desc": "De Mars à Europe, découvrez de nouveaux mondes et réservez votre voyage dès aujourd'hui.",
13 |     "feature3Title": "Sécuritaire et fiable",
14 |     "feature3Desc": "Votre sécurité est notre priorité grâce à des systèmes de navigation et de survie avancés.",
15 |     "feature4Title": "Réservation instantanée",
16 |     "feature4Desc": "Réservez votre vol en quelques secondes et recevez une confirmation immédiate.",
17 |     "exploreDestinations": "Explorez nos destinations",
18 |     "destinationBadge": "Destination",
19 |     "ctaTitle": "Prêt pour votre aventure spatiale?",
20 |     "ctaBody": "Rejoignez des milliers de voyageurs spatiaux qui ont déjà réservé leur voyage vers les étoiles. Votre aventure vous attend!",
21 |     "bookNow": "Réservez votre vol maintenant"
22 |   },
23 |   "flights": {
24 |     "titlePart1": "Vols",
25 |     "titlePart2": "disponibles",
26 |     "subtitle": "Choisissez votre destination et embarquez dans une aventure interplanétaire",
27 |     "searchPlaceholder": "Rechercher par origine ou destination…",
28 |     "showingCount_one": "{{count}} vol affiché",
29 |     "showingCount_many": "{{count}} vols affichés",
30 |     "showingCount_other": "{{count}} vols affichés",
31 |     "loadingText": "Chargement des vols…",
32 |     "noResults": "Aucun vol trouvé correspondant à vos critères",
33 |     "retryError": "Échec du chargement des vols. Nouvelle tentative… ({{attempt}}/{{max}})",
34 |     "maxRetriesError": "Impossible de charger les vols après plusieurs tentatives"
35 |   },
36 |   "myBookings": {
37 |     "titlePart1": "Mes",
38 |     "titlePart2": "réservations",
39 |     "subtitle": "Gérez vos réservations de voyage spatial",
40 |     "loadingText": "Chargement de vos réservations…",
41 |     "pendingHolds": "Réservations temporaires en attente ({{count}})",
42 |     "confirmBeforeExpiry": "Confirmez avant l'expiration",
43 |     "noBookingsTitle": "Aucune réservation pour l'instant",
44 |     "noBookingsBody": "Commencez votre aventure spatiale en réservant votre premier vol!",
45 |     "browseFlights": "Parcourir les vols",
46 |     "activeBookings": "Réservations actives ({{count}})",
47 |     "pastBookings": "Réservations passées ({{count}})",
48 |     "cancelTitle": "Annuler la réservation",
49 |     "cancelConfirm": "Êtes-vous sûr de vouloir annuler cette réservation? Cette action est irréversible.",
50 |     "keepBooking": "Conserver la réservation",
51 |     "cancelButton": "Annuler la réservation",
52 |     "toastLoadError": "Échec du chargement des réservations",
53 |     "toastCancelSuccess": "Réservation annulée avec succès",
54 |     "toastCancelError": "Échec de l'annulation de la réservation"
55 |   },
56 |   "destination": {
57 |     "notFoundTitle": "Nous n'avons pas encore cartographié ce monde",
58 |     "notFoundBody": "La destination <1>/{{slug}}</1> n'existe pas dans nos cartes stellaires.",
59 |     "backToHome": "Retour à l'accueil",
60 |     "allDestinations": "Toutes les destinations",
61 |     "destinationBadge": "Destination",
62 |     "quickFacts": "Données rapides",
63 |     "factGravity": "Gravité",
64 |     "factDistance": "Distance de la Terre",
65 |     "factTransitTime": "Durée de transit typique",
66 |     "factSurfaceTemp": "Température de surface",
67 |     "factMoons": "Lunes",
68 |     "factAtmosphere": "Atmosphère",
69 |     "hazardAdvisory": "Avis de danger",
70 |     "gallery": "Galerie",
71 |     "flightsSoonTitle": "Vols au départ prochainement",
72 |     "flightsSoonSubtitle": "Disponibilité en temps réel — jusqu'à 5 prochains départs vers {{name}}",
73 |     "loadingSchedules": "Vérification des horaires de vols…",
74 |     "noFlightsTitle": "Aucun vol à venir vers {{name}} pour l'instant.",
75 |     "noFlightsHint": "Revenez bientôt — de nouvelles routes sont ajoutées régulièrement.",
76 |     "priceFrom": "À partir de",
77 |     "bookButton": "Réserver",
78 |     "toastFlightsError": "Impossible de charger les vols au départ"
79 |   }
80 | }
81 |

**Tool:**

Contents of file src/locales/pseudo/pages.json:

1 | {
2 |   "home": {
3 |     "heroTitle1": "⟦Ĵôûŕñéý Ɓéýôñð ····⟧",
4 |     "heroTitle2": "⟦Ţĥé Šţàŕš ··⟧",
5 |     "heroSubtitle": "⟦Éẋþéŕíéñçé ţĥé ƒûţûŕé ôƒ šþàçé ţŕàṽéļ ŵíţĥ Ĝàļàẋíûɱ. Ɓôôķ ýôûŕ íñţéŕþļàñéţàŕý ƒļíĝĥţ àñð éẋþļôŕé ţĥé ŵôñðéŕš ôƒ ôûŕ šôļàŕ šýšţéɱ. ································⟧",
6 |     "exploreFlights": "⟦Éẋþļôŕé Ƒļíĝĥţš ····⟧",
7 |     "learnMore": "⟦Ļéàŕñ Ṁôŕé ···⟧",
8 |     "whyChoose": "⟦Ŵĥý Çĥôôšé Ĝàļàẋíûɱ? ·····⟧",
9 |     "feature1Title": "⟦Íñţéŕþļàñéţàŕý Ţŕàṽéļ ······⟧",
10 |     "feature1Desc": "⟦Éẋþļôŕé ðéšţíñàţíôñš àçŕôšš ţĥé šôļàŕ šýšţéɱ ŵíţĥ ôûŕ šţàţé-ôƒ-ţĥé-àŕţ šþàçéçŕàƒţ. ·····················⟧",
11 |     "feature2Title": "⟦Ṁûļţíþļé Ðéšţíñàţíôñš ······⟧",
12 |     "feature2Desc": "⟦Ƒŕôɱ Ṁàŕš ţô Éûŕôþà, ðíšçôṽéŕ ñéŵ ŵôŕļðš àñð ƀôôķ ýôûŕ ĵôûŕñéý ţôðàý. ·················⟧",
13 |     "feature3Title": "⟦Šàƒé & Šéçûŕé ···⟧",
14 |     "feature3Desc": "⟦Ýôûŕ šàƒéţý íš ôûŕ þŕíôŕíţý ŵíţĥ àðṽàñçéð ñàṽíĝàţíôñ àñð ļíƒé šûþþôŕţ šýšţéɱš. ····················⟧",
15 |     "feature4Title": "⟦Íñšţàñţ Ɓôôķíñĝ ····⟧",
16 |     "feature4Desc": "⟦Ɓôôķ ýôûŕ ƒļíĝĥţ íñ šéçôñðš àñð ŕéçéíṽé íñšţàñţ çôñƒíŕɱàţíôñ. ················⟧",
17 |     "exploreDestinations": "⟦Éẋþļôŕé Ôûŕ Ðéšţíñàţíôñš ·······⟧",
18 |     "destinationBadge": "⟦Ðéšţíñàţíôñ ···⟧",
19 |     "ctaTitle": "⟦Ŕéàðý ƒôŕ Ýôûŕ Šþàçé Àðṽéñţûŕé? ········⟧",
20 |     "ctaBody": "⟦Ĵôíñ ţĥôûšàñðš ôƒ šþàçé ţŕàṽéļéŕš ŵĥô ĥàṽé àļŕéàðý ƀôôķéð ţĥéíŕ ĵôûŕñéý ţô ţĥé šţàŕš. Ýôûŕ àðṽéñţûŕé àŵàíţš! ···························⟧",
21 |     "bookNow": "⟦Ɓôôķ Ýôûŕ Ƒļíĝĥţ Ñôŵ ·····⟧"
22 |   },
23 |   "flights": {
24 |     "titlePart1": "⟦Àṽàíļàƀļé ···⟧",
25 |     "titlePart2": "⟦Ƒļíĝĥţš ··⟧",
26 |     "subtitle": "⟦Çĥôôšé ýôûŕ ðéšţíñàţíôñ àñð éɱƀàŕķ ôñ àñ íñţéŕþļàñéţàŕý àðṽéñţûŕé ·················⟧",
27 |     "searchPlaceholder": "⟦Šéàŕçĥ ƀý ôŕíĝíñ ôŕ ðéšţíñàţíôñ... ········⟧",
28 |     "showingCount_one": "⟦Šĥôŵíñĝ {{count}} ƒļíĝĥţ ····⟧",
29 |     "showingCount_other": "⟦Šĥôŵíñĝ {{count}} ƒļíĝĥţš ····⟧",
30 |     "loadingText": "⟦Ļôàðíñĝ ƒļíĝĥţš... ····⟧",
31 |     "noResults": "⟦Ñô ƒļíĝĥţš ƒôûñð ɱàţçĥíñĝ ýôûŕ çŕíţéŕíà ··········⟧",
32 |     "retryError": "⟦Ƒàíļéð ţô ļôàð ƒļíĝĥţš. Ŕéţŕýíñĝ... ({{attempt}}/{{max}}) ········⟧",
33 |     "maxRetriesError": "⟦Ƒàíļéð ţô ļôàð ƒļíĝĥţš àƒţéŕ ɱûļţíþļé àţţéɱþţš ············⟧"
34 |   },
35 |   "myBookings": {
36 |     "titlePart1": "⟦Ṁý ·⟧",
37 |     "titlePart2": "⟦Ɓôôķíñĝš ··⟧",
38 |     "subtitle": "⟦Ṁàñàĝé ýôûŕ šþàçé ţŕàṽéļ ŕéšéŕṽàţíôñš ··········⟧",
39 |     "loadingText": "⟦Ļôàðíñĝ ýôûŕ ƀôôķíñĝš... ······⟧",
40 |     "pendingHolds": "⟦Þéñðíñĝ Ĥôļðš ({{count}}) ····⟧",
41 |     "confirmBeforeExpiry": "⟦Çôñƒíŕɱ ƀéƒôŕé ţíɱé ŕûñš ôûţ ·······⟧",
42 |     "noBookingsTitle": "⟦Ñô ƀôôķíñĝš ýéţ ····⟧",
43 |     "noBookingsBody": "⟦Šţàŕţ ýôûŕ šþàçé àðṽéñţûŕé ƀý ƀôôķíñĝ ýôûŕ ƒíŕšţ ƒļíĝĥţ! ··············⟧",
44 |     "browseFlights": "⟦Ɓŕôŵšé Ƒļíĝĥţš ····⟧",
45 |     "activeBookings": "⟦Àçţíṽé Ɓôôķíñĝš ({{count}}) ····⟧",
46 |     "pastBookings": "⟦Þàšţ Ɓôôķíñĝš ({{count}}) ····⟧",
47 |     "cancelTitle": "⟦Çàñçéļ Ɓôôķíñĝ ····⟧",
48 |     "cancelConfirm": "⟦Àŕé ýôû šûŕé ýôû ŵàñţ ţô çàñçéļ ţĥíš ƀôôķíñĝ? Ţĥíš àçţíôñ çàññôţ ƀé ûñðôñé. ··················⟧",
49 |     "keepBooking": "⟦Ķééþ Ɓôôķíñĝ ···⟧",
50 |     "cancelButton": "⟦Çàñçéļ Ɓôôķíñĝ ····⟧",
51 |     "toastLoadError": "⟦Ƒàíļéð ţô ļôàð ƀôôķíñĝš ······⟧",
52 |     "toastCancelSuccess": "⟦Ɓôôķíñĝ çàñçéļļéð šûççéššƒûļļý ········⟧",
53 |     "toastCancelError": "⟦Ƒàíļéð ţô çàñçéļ ƀôôķíñĝ ······⟧"
54 |   },
55 |   "destination": {
56 |     "notFoundTitle": "⟦Ŵé ĥàṽéñ'ţ çĥàŕţéð ţĥíš ŵôŕļð ýéţ ········⟧",
57 |     "notFoundBody": "⟦Ţĥé ðéšţíñàţíôñ <1>/{{slug}}</1> ðôéšñ'ţ éẋíšţ íñ ôûŕ šţàŕ çĥàŕţš. ············⟧",
58 |     "backToHome": "⟦Ɓàçķ ţô Ĥôɱé ···⟧",
59 |     "allDestinations": "⟦Àļļ Ðéšţíñàţíôñš ·····⟧",
60 |     "destinationBadge": "⟦Ðéšţíñàţíôñ ···⟧",
61 |     "quickFacts": "⟦Ɋûíçķ Ƒàçţš ···⟧",
62 |     "factGravity": "⟦Ĝŕàṽíţý ··⟧",
63 |     "factDistance": "⟦Ðíšţàñçé ƒŕôɱ Éàŕţĥ ·····⟧",
64 |     "factTransitTime": "⟦Ţýþíçàļ Ţŕàñšíţ Ţíɱé ·····⟧",
65 |     "factSurfaceTemp": "⟦Šûŕƒàçé Ţéɱþéŕàţûŕé ·····⟧",
66 |     "factMoons": "⟦Ṁôôñš ··⟧",
67 |     "factAtmosphere": "⟦Àţɱôšþĥéŕé ···⟧",
68 |     "hazardAdvisory": "⟦Ĥàžàŕð Àðṽíšôŕý ····⟧",
69 |     "gallery": "⟦Ĝàļļéŕý ··⟧",
70 |     "flightsSoonTitle": "⟦Ƒļíĝĥţš Ðéþàŕţíñĝ Šôôñ ······⟧",
71 |     "flightsSoonSubtitle": "⟦Ļíṽé àṽàíļàƀíļíţý — ûþ ţô 5 ûþçôɱíñĝ ðéþàŕţûŕéš ţô {{name}} ············⟧",
72 |     "loadingSchedules": "⟦Çĥéçķíñĝ ƒļíĝĥţ šçĥéðûļéš… ·······⟧",
73 |     "noFlightsTitle": "⟦Ñô ûþçôɱíñĝ ƒļíĝĥţš ţô {{name}} ŕíĝĥţ ñôŵ. ········⟧",
74 |     "noFlightsHint": "⟦Çĥéçķ ƀàçķ šôôñ — ñéŵ ŕôûţéš àŕé àððéð ŕéĝûļàŕļý. ············⟧",
75 |     "priceFrom": "⟦Ƒŕôɱ ·⟧",
76 |     "bookButton": "⟦Ɓôôķ ·⟧",
77 |     "toastFlightsError": "⟦Çôûļð ñôţ ļôàð ðéþàŕţíñĝ ƒļíĝĥţš ········⟧"
78 |   }
79 | }
80 |

**Assistant:**



_spend: {'cost': 0.06374, 'contextTokens': 31870}_

**Tool:**

To do list updated: 4 items total.

Next to do item inprogress: Build viewer/index.html with all required features

**Assistant:**

Now I have all the context I need. Let me build the full `viewer/index.html`:

_spend: {'cost': 0.088972, 'contextTokens': 44486}_

**Tool:**

Edited file: viewer/index.html

You do not need to re-read the file, as you have seen all changes.
Proceed with the task using these changes as the new baseline.

If the user's edits have addressed part of the task or changed the requirements, adjust your approach accordingly.

Patch of edit:

<patch>
@@ -1,108 +1,1132 @@
-<!doctype html>
-<html lang="en">
-  <head>
-    <meta charset="UTF-8" />
-    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
-    <title>WorldReady</title>
-    <style>
-      :root { color-scheme: dark; }
-      * { box-sizing: border-box; }
-      body {
-        margin: 0;
-        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
-        background: #0b0f1a;
-        color: #e8ecf5;
-      }
-      header {
+<!DOCTYPE html>
+<html lang="en" dir="ltr">
+<head>
+  <meta charset="UTF-8" />
+  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+  <title>WorldReady — Judge's Viewer</title>
+  <link rel="preconnect" href="https://fonts.googleapis.com" />
+  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
+  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
+  <style>
+    *, *::before, *::after { box-sizing: border-box; }
+
+    :root {
+      --bg: #0b0f1a;
+      --bg2: #10162a;
+      --bg3: #1a2138;
+      --border: #232a3d;
+      --border2: #2c3550;
+      --text: #e8ecf5;
+      --muted: #9aa4bd;
+      --muted2: #6b7590;
+      --accent: #a78bfa;
+      --accent2: #7c3aed;
+      --yellow: #f59e0b;
+      --green: #10b981;
+      --red: #ef4444;
+      --blue: #3b82f6;
+    }
+
+    html, body { margin: 0; padding: 0; height: 100%; }
+
+    body {
+      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
+      background: var(--bg);
+      color: var(--text);
+      font-size: 15px;
+      line-height: 1.6;
+      display: flex;
+      flex-direction: column;
+      min-height: 100vh;
+    }
+
+    /* ─── TOP BAR ─── */
+    #topbar {
+      position: sticky;
+      top: 0;
+      z-index: 100;
+      background: var(--bg2);
+      border-bottom: 1px solid var(--border);
+      padding: 0.65rem 1.25rem;
+      display: flex;
+      align-items: center;
+      gap: 1rem;
+      flex-wrap: wrap;
+    }
+
+    .wordmark {
+      font-size: 1.15rem;
+      font-weight: 700;
+      letter-spacing: -0.02em;
+      margin: 0;
+      white-space: nowrap;
+    }
+    .wordmark span { color: var(--accent); }
+
+    .tagline {
+      font-size: 0.72rem;
+      color: var(--muted2);
+      white-space: nowrap;
+      font-style: italic;
+    }
+
+    .spacer { flex: 1; }
+
+    .lang-group {
+      display: flex;
+      align-items: center;
+      gap: 0.35rem;
+    }
+
+    .lang-btn {
+      background: var(--bg3);
+      color: var(--muted);
+      border: 1px solid var(--border2);
+      border-radius: 6px;
+      padding: 0.3rem 0.65rem;
+      font-size: 0.8rem;
+      font-family: inherit;
+      cursor: pointer;
+      transition: all 0.15s;
+      white-space: nowrap;
+    }
+    .lang-btn:hover { background: var(--border2); color: var(--text); }
+    .lang-btn.active {
+      background: var(--accent2);
+      border-color: var(--accent);
+      color: #fff;
+    }
+    .lang-btn[data-lng="ar"] { font-family: 'Noto Sans Arabic', 'Inter', sans-serif; }
+
+    #scan-btn {
+      background: transparent;
+      color: var(--yellow);
+      border: 1px solid #f59e0b66;
+      border-radius: 6px;
+      padding: 0.3rem 0.75rem;
+      font-size: 0.8rem;
+      font-family: inherit;
+      cursor: pointer;
+      transition: all 0.15s;
+      white-space: nowrap;
+    }
+    #scan-btn:hover { background: #f59e0b22; }
+
+    /* ─── COUNTERS STRIP ─── */
+    #counters {
+      display: flex;
+      gap: 1px;
+      background: var(--border);
+      border-bottom: 1px solid var(--border);
+      flex-wrap: wrap;
+    }
+
+    .counter-tile {
+      flex: 1;
+      min-width: 140px;
+      background: var(--bg2);
+      padding: 0.75rem 1rem;
+      display: flex;
+      flex-direction: column;
+      gap: 0.15rem;
+    }
+
+    .counter-value {
+      font-size: 1.4rem;
+      font-weight: 700;
+      color: var(--accent);
+      line-height: 1.1;
+    }
+    .counter-value.green { color: var(--green); }
+    .counter-value.red { color: var(--red); }
+    .counter-value.yellow { color: var(--yellow); }
+
+    .counter-label {
+      font-size: 0.7rem;
+      color: var(--muted2);
+      text-transform: uppercase;
+      letter-spacing: 0.06em;
+    }
+
+    /* ─── SCAN BAR ─── */
+    #scan-bar {
+      background: var(--bg3);
+      border-bottom: 1px solid var(--border);
+      padding: 0.4rem 1.25rem;
+      font-size: 0.8rem;
+      color: var(--muted);
+      display: flex;
+      align-items: center;
+      gap: 0.75rem;
+      flex-wrap: wrap;
+      min-height: 2rem;
+    }
+    #scan-bar .scan-status { color: var(--muted2); font-style: italic; }
+    #scan-bar .scan-count-before { color: var(--red); font-weight: 600; }
+    #scan-bar .scan-count-after { color: var(--green); font-weight: 600; }
+
+    /* ─── PANES ─── */
+    #pane-area {
+      flex: 1;
+      display: flex;
+      flex-direction: column;
+      min-height: 0;
+    }
+
+    /* Desktop tabs hidden; mobile tabs shown */
+    .tab-bar { display: none; }
+
+    #frames {
+      display: grid;
+      grid-template-columns: 1fr 1fr;
+      gap: 1px;
+      background: var(--border);
+      flex: 1;
+      min-height: 0;
+      height: calc(100vh - 280px);
+    }
+
+    .pane {
+      display: flex;
+      flex-direction: column;
+      background: var(--bg);
+      min-height: 0;
+    }
+
+    .pane-label {
+      margin: 0;
+      font-size: 0.75rem;
+      font-weight: 600;
+      padding: 0.4rem 0.9rem;
+      color: var(--muted);
+      border-bottom: 1px solid var(--border);
+      background: var(--bg2);
+      display: flex;
+      align-items: center;
+      gap: 0.5rem;
+      flex-shrink: 0;
+    }
+    .pane-label .badge {
+      font-size: 0.65rem;
+      padding: 0.1rem 0.45rem;
+      border-radius: 999px;
+      border: 1px solid;
+    }
+    .badge-before { color: var(--yellow); border-color: #f59e0b55; background: #f59e0b11; }
+    .badge-after  { color: var(--green);  border-color: #10b98155; background: #10b98111; }
+
+    .pane iframe {
+      border: 0;
+      width: 100%;
+      flex: 1;
+      min-height: 0;
+      background: #fff;
+    }
+
+    /* ─── PLURAL SHOWCASE ─── */
+    #plural-card {
+      margin: 1rem 1.25rem;
+      background: var(--bg2);
+      border: 1px solid var(--border);
+      border-radius: 10px;
+      overflow: hidden;
+    }
+
+    .card-header {
+      padding: 0.75rem 1rem;
+      border-bottom: 1px solid var(--border);
+      display: flex;
+      align-items: baseline;
+      gap: 0.75rem;
+    }
+    .card-title {
+      font-size: 0.85rem;
+      font-weight: 700;
+      color: var(--text);
+      margin: 0;
+    }
+    .card-caption {
+      font-size: 0.72rem;
+      color: var(--muted2);
+      font-style: italic;
+    }
+
+    .plural-table {
+      width: 100%;
+      border-collapse: collapse;
+      font-size: 0.82rem;
+    }
+    .plural-table th {
+      background: var(--bg3);
+      color: var(--muted);
+      font-weight: 600;
+      text-align: left;
+      padding: 0.45rem 0.8rem;
+      border-bottom: 1px solid var(--border);
+      font-size: 0.72rem;
+      text-transform: uppercase;
+      letter-spacing: 0.05em;
+    }
+    .plural-table td {
+      padding: 0.45rem 0.8rem;
+      border-bottom: 1px solid var(--border);
+      vertical-align: middle;
+    }
+    .plural-table tr:last-child td { border-bottom: 0; }
+    .plural-table tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
+
+    .cat-badge {
+      display: inline-block;
+      padding: 0.1rem 0.45rem;
+      border-radius: 4px;
+      font-size: 0.7rem;
+      font-weight: 600;
+      background: var(--accent2);
+      color: #e0d4fe;
+    }
+    .cat-zero  { background: #374151; color: #9ca3af; }
+    .cat-one   { background: #1e3a5f; color: #93c5fd; }
+    .cat-two   { background: #1e4040; color: #6ee7b7; }
+    .cat-few   { background: #3b2f00; color: #fde68a; }
+    .cat-many  { background: #3b1f1f; color: #fca5a5; }
+    .cat-other { background: #2d1b4e; color: #c4b5fd; }
+
+    .ar-text {
+      font-family: 'Noto Sans Arabic', sans-serif;
+      direction: rtl;
+      text-align: right;
+      unicode-bidi: embed;
+    }
+
+    /* ─── EVIDENCE DRAWER ─── */
+    #evidence-section {
+      margin: 0 1.25rem 1rem;
+      border: 1px solid var(--border);
+      border-radius: 10px;
+      overflow: hidden;
+    }
+
+    #evidence-toggle {
+      width: 100%;
+      background: var(--bg2);
+      border: 0;
+      color: var(--text);
+      padding: 0.7rem 1rem;
+      font-size: 0.82rem;
+      font-weight: 600;
+      font-family: inherit;
+      cursor: pointer;
+      display: flex;
+      align-items: center;
+      justify-content: space-between;
+      gap: 0.5rem;
+    }
+    #evidence-toggle:hover { background: var(--bg3); }
+
+    #evidence-body { display: none; }
+    #evidence-body.open { display: block; }
+
+    .ev-tabs {
+      display: flex;
+      background: var(--bg3);
+      border-top: 1px solid var(--border);
+      border-bottom: 1px solid var(--border);
+      overflow-x: auto;
+    }
+    .ev-tab {
+      padding: 0.5rem 1rem;
+      font-size: 0.78rem;
+      font-weight: 500;
+      font-family: inherit;
+      cursor: pointer;
+      background: transparent;
+      border: 0;
+      border-bottom: 2px solid transparent;
+      color: var(--muted);
+      white-space: nowrap;
+      transition: all 0.12s;
+    }
+    .ev-tab:hover { color: var(--text); }
+    .ev-tab.active { border-bottom-color: var(--accent); color: var(--accent); }
+
+    .ev-panel { display: none; padding: 0.9rem 1rem; background: var(--bg); }
+    .ev-panel.active { display: block; }
+
+    .ev-table {
+      width: 100%;
+      border-collapse: collapse;
+      font-size: 0.8rem;
+    }
+    .ev-table th {
+      text-align: left;
+      color: var(--muted2);
+      font-size: 0.7rem;
+      text-transform: uppercase;
+      letter-spacing: 0.05em;
+      padding: 0.3rem 0.6rem;
+      border-bottom: 1px solid var(--border);
+    }
+    .ev-table td {
+      padding: 0.4rem 0.6rem;
+      border-bottom: 1px solid var(--border);
+      vertical-align: top;
+      color: var(--muted);
+    }
+    .ev-table tr:last-child td { border-bottom: 0; }
+    .ev-table .mono {
+      font-family: 'Courier New', monospace;
+      font-size: 0.75rem;
+      word-break: break-all;
+    }
+    .ev-table a { color: var(--blue); text-decoration: none; }
+    .ev-table a:hover { text-decoration: underline; }
+
+    .ev-note {
+      font-size: 0.75rem;
+      color: var(--muted2);
+      font-style: italic;
+      margin: 0.5rem 0 0;
+    }
+
+    /* ─── FOOTER ─── */
+    footer {
+      border-top: 1px solid var(--border);
+      background: var(--bg2);
+      padding: 0.65rem 1.25rem;
+      display: flex;
+      align-items: center;
+      flex-wrap: wrap;
+      gap: 0.75rem;
+      font-size: 0.75rem;
+      color: var(--muted2);
+    }
+    footer a { color: var(--muted); text-decoration: none; }
+    footer a:hover { color: var(--text); }
+    footer .sep { opacity: 0.4; }
+
+    /* ─── RESPONSIVE ─── */
+    @media (max-width: 768px) {
+      .tagline { display: none; }
+
+      .tab-bar {
         display: flex;
-        align-items: center;
-        gap: 1rem;
-        flex-wrap: wrap;
-        padding: 0.9rem 1.25rem;
-        border-bottom: 1px solid #232a3d;
-        background: #10162a;
+        background: var(--bg2);
+        border-bottom: 1px solid var(--border);
       }
-      h1 { font-size: 1.1rem; margin: 0; font-weight: 700; }
-      h1 span { color: #a78bfa; }
-      .tag {
-        font-size: 0.7rem;
-        text-transform: uppercase;
-        letter-spacing: 0.08em;
-        color: #f59e0b;
-        border: 1px solid #f59e0b55;
-        background: #f59e0b11;
-        padding: 0.15rem 0.5rem;
-        border-radius: 999px;
-      }
-      label { font-size: 0.85rem; color: #9aa4bd; }
-      select {
-        background: #1a2138;
-        color: #e8ecf5;
-        border: 1px solid #2c3550;
-        border-radius: 6px;
-        padding: 0.35rem 0.6rem;
-        font-size: 0.85rem;
-      }
-      .frames {
-        display: grid;
-        grid-template-columns: 1fr 1fr;
-        gap: 1px;
-        background: #232a3d;
-        height: calc(100vh - 108px);
-      }
-      @media (max-width: 800px) {
-        .frames { grid-template-columns: 1fr; height: auto; }
-        iframe { height: 70vh; }
-      }
-      .pane { display: flex; flex-direction: column; background: #0b0f1a; }
-      .pane h2 {
-        margin: 0;
+      .tab-btn {
+        flex: 1;
+        padding: 0.5rem;
+        background: transparent;
+        border: 0;
+        border-bottom: 2px solid transparent;
+        color: var(--muted);
         font-size: 0.8rem;
-        font-weight: 600;
-        padding: 0.5rem 0.9rem;
-        color: #9aa4bd;
-        border-bottom: 1px solid #1a2138;
+        font-weight: 500;
+        font-family: inherit;
+        cursor: pointer;
       }
-      iframe { border: 0; width: 100%; height: 100%; flex: 1; background: #0b0f1a; }
-      .note {
-        padding: 0.5rem 1.25rem;
-        font-size: 0.75rem;
-        color: #6b7590;
-        background: #0d1324;
-        border-top: 1px solid #1a2138;
+      .tab-btn.active { border-bottom-color: var(--accent); color: var(--accent); }
+
+      #frames {
+        grid-template-columns: 1fr;
+        height: auto;
       }
-    </style>
-  </head>
-  <body>
-    <!-- Placeholder viewer — Bob builds the real comparison viewer in a later task.
-         Keep this minimal and clearly temporary. -->
-    <header>
-      <h1>World<span>Ready</span></h1>
-      <span class="tag">Placeholder viewer</span>
-      <div style="margin-left:auto; display:flex; align-items:center; gap:0.5rem;">
-        <label for="lang">Language</label>
-        <select id="lang" aria-label="Language (not wired up yet)">
-          <option value="en">English</option>
-          <option value="fr">Français</option>
-          <option value="ar">العربية</option>
-        </select>
-      </div>
-    </header>
+      .pane { height: 70vh; }
+      .pane.hidden { display: none; }
 
-    <div class="frames">
-      <div class="pane">
-        <h2>Before — IBM Galaxium (English only)</h2>
-        <iframe src="before/" title="Before: original English-only Galaxium app"></iframe>
+      #counters .counter-tile { min-width: 120px; }
+    }
+  </style>
+</head>
+<body>
+
+<!-- ═══════════════════════════════════════════════════════ TOP BAR -->
+<header id="topbar" role="banner">
+  <h1 class="wordmark">World<span>Ready</span></h1>
+  <p class="tagline">World-ready in a day. Proven, and kept that way.</p>
+  <div class="spacer"></div>
+  <div class="lang-group" role="group" aria-label="Language picker">
+    <button class="lang-btn active" data-lng="en" aria-pressed="true">English</button>
+    <button class="lang-btn" data-lng="fr" aria-pressed="false">Français</button>
+    <button class="lang-btn" data-lng="ar" aria-pressed="false">العربية</button>
+    <button class="lang-btn" data-lng="pseudo" aria-pressed="false">Pseudo</button>
+  </div>
+  <button id="scan-btn" aria-label="Scan iframes for hard-coded text">🔍 Scan for hard-coded text</button>
+</header>
+
+<!-- ═══════════════════════════════════════════════════════ COUNTERS -->
+<div id="counters" role="region" aria-label="Summary counters">
+  <div class="counter-tile">
+    <div class="counter-value red" id="cnt-hc">—</div>
+    <div class="counter-label">Hard-coded strings</div>
+  </div>
+  <div class="counter-tile">
+    <div class="counter-value green" id="cnt-traps">—</div>
+    <div class="counter-label">Traps fixed</div>
+  </div>
+  <div class="counter-tile">
+    <div class="counter-value green" id="cnt-en">—</div>
+    <div class="counter-label">English content changed</div>
+  </div>
+  <div class="counter-tile">
+    <div class="counter-value accent" id="cnt-langs">—</div>
+    <div class="counter-label">Languages</div>
+  </div>
+  <div class="counter-tile">
+    <div class="counter-value yellow" id="cnt-coins">—</div>
+    <div class="counter-label">Bobcoins used</div>
+  </div>
+</div>
+
+<!-- ═══════════════════════════════════════════════════════ SCAN BAR -->
+<div id="scan-bar" role="status" aria-live="polite">
+  <span class="scan-status" id="scan-status">Ready — click "Scan" or switch language to check.</span>
+</div>
+
+<!-- ═══════════════════════════════════════════════════════ IFRAMES -->
+<div id="pane-area">
+  <div class="tab-bar" role="tablist" aria-label="Pane selector">
+    <button class="tab-btn active" role="tab" aria-selected="true"  data-pane="before">Before</button>
+    <button class="tab-btn"        role="tab" aria-selected="false" data-pane="after">After</button>
+  </div>
+
+  <div id="frames">
+    <div class="pane" id="pane-before">
+      <div class="pane-label">
+        <span class="badge badge-before">BEFORE</span>
+        Before — IBM Galaxium (English only)
       </div>
-      <div class="pane">
-        <h2>After — WorldReady</h2>
-        <iframe src="after/" title="After: WorldReady internationalized app"></iframe>
+      <iframe id="iframe-before"
+              src="before/"
+              title="Before: original English-only Galaxium app"
+              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe>
+    </div>
+    <div class="pane" id="pane-after">
+      <div class="pane-label">
+        <span class="badge badge-after">AFTER</span>
+        After — WorldReady
       </div>
+      <iframe id="iframe-after"
+              src="after/"
+              title="After: WorldReady internationalized app"
+              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe>
     </div>
+  </div>
+</div>
 
-    <p class="note">
-      Temporary shell. The language picker is not wired up yet; the real viewer
-      (language switching, RTL flip, trap highlights) is built later by Bob.
-    </p>
-  </body>
+<!-- ═══════════════════════════════════════════════════════ PLURAL CARD -->
+<section id="plural-card" aria-labelledby="plural-title">
+  <div class="card-header">
+    <h2 class="card-title" id="plural-title">Arabic Plural Showcase</h2>
+    <span class="card-caption">Rendered by the real After i18n bundle — all six Arabic plural categories.</span>
+  </div>
+  <div style="overflow-x:auto;">
+    <table class="plural-table" id="plural-table">
+      <thead>
+        <tr>
+          <th>Count</th>
+          <th>EN</th>
+          <th>FR</th>
+          <th style="font-family:'Noto Sans Arabic',sans-serif;">AR</th>
+          <th>AR Category</th>
+        </tr>
+      </thead>
+      <tbody id="plural-tbody">
+        <tr><td colspan="5" style="color:var(--muted2);font-style:italic;padding:0.8rem;">Loading locale bundles…</td></tr>
+      </tbody>
+    </table>
+  </div>
+</section>
+
+<!-- ═══════════════════════════════════════════════════════ EVIDENCE -->
+<section id="evidence-section" aria-labelledby="ev-heading">
+  <button id="evidence-toggle" aria-expanded="false" aria-controls="evidence-body">
+    <span id="ev-heading">📋 Evidence Drawer</span>
+    <span id="ev-chevron">▼</span>
+  </button>
+  <div id="evidence-body" role="region">
+    <div class="ev-tabs" role="tablist">
+      <button class="ev-tab active" role="tab" aria-selected="true"  data-tab="traps">Traps</button>
+      <button class="ev-tab"        role="tab" aria-selected="false" data-tab="translator">Translator Sheet</button>
+      <button class="ev-tab"        role="tab" aria-selected="false" data-tab="sessions">Bob Sessions</button>
+      <button class="ev-tab"        role="tab" aria-selected="false" data-tab="proof">Proof / Links</button>
+    </div>
+
+    <div class="ev-panel active" id="panel-traps">
+      <p id="ev-traps-summary" style="font-size:0.82rem;color:var(--muted);">Loading…</p>
+      <div id="ev-traps-table"></div>
+      <p class="ev-note">
+        Trap key SHA-256 committed before any Bob task ran:
+        <code id="ev-sha" class="mono" style="display:inline-block;margin-top:0.25rem;color:var(--muted);font-size:0.72rem;">—</code>
+        <br>Full key published after final scoring.
+      </p>
+    </div>
+
+    <div class="ev-panel" id="panel-translator">
+      <p style="font-size:0.82rem;color:var(--muted);">
+        352-row translator CSV with every extractable string, its namespace, key path, and collected translations.
+        Human-review edits land in the morning (P10).
+      </p>
+      <p>
+        <a href="https://github.com/chinmoypaul8897/worldready/blob/main/docs/translator.csv"
+           target="_blank" rel="noopener"
+           style="color:var(--blue);font-size:0.82rem;">
+          📄 View translator.csv on GitHub ↗
+        </a>
+      </p>
+    </div>
+
+    <div class="ev-panel" id="panel-sessions">
+      <div style="overflow-x:auto;">
+        <table class="ev-table" id="ev-sessions-table">
+          <thead>
+            <tr>
+              <th>ID</th><th>Task</th><th>Mode</th><th style="text-align:right;">Bobcoins</th>
+            </tr>
+          </thead>
+          <tbody id="ev-sessions-body">
+            <tr><td colspan="4" style="color:var(--muted2);font-style:italic;">Loading…</td></tr>
+          </tbody>
+        </table>
+      </div>
+    </div>
+
+    <div class="ev-panel" id="panel-proof">
+      <div id="ev-proof-content" style="font-size:0.82rem;color:var(--muted);">Loading…</div>
+    </div>
+  </div>
+</section>
+
+<!-- ═══════════════════════════════════════════════════════ FOOTER -->
+<footer>
+  <span>Built with <strong style="color:var(--accent);">IBM Bob</strong></span>
+  <span class="sep">|</span>
+  <span>Demo app: IBM Galaxium Travels, Apache-2.0</span>
+  <span class="sep">|</span>
+  <a id="footer-repo" href="https://github.com/chinmoypaul8897/worldready" target="_blank" rel="noopener">
+    GitHub Repo ↗
+  </a>
+</footer>
+
+<script>
+(function () {
+  'use strict';
+
+  // ──────────────────────────────────────────────────
+  // State
+  // ──────────────────────────────────────────────────
+  let currentLng = 'en';
+  let currentRoute = '/';
+  let evidenceData = null;
+  let localeData = {};   // { en: {flights:{...}}, fr: {}, ar: {} }
+  let scanTimer = null;
+
+  const ALLOWLIST = new Set([
+    'galaxium','travels','class','worldready','bob',
+    'en','fr','ar','pseudo'
+  ]);
+
+  // ──────────────────────────────────────────────────
+  // Deep link parse
+  // ──────────────────────────────────────────────────
+  (function parseDeepLink() {
+    const p = new URLSearchParams(location.search);
+    if (p.get('lng') && ['en','fr','ar','pseudo'].includes(p.get('lng'))) {
+      currentLng = p.get('lng');
+    }
+    if (p.get('route')) {
+      currentRoute = p.get('route');
+    }
+  })();
+
+  // ──────────────────────────────────────────────────
+  // Util: safe fetch with fallback paths
+  // ──────────────────────────────────────────────────
+  async function fetchJson(...urls) {
+    for (const url of urls) {
+      try {
+        const r = await fetch(url);
+        if (r.ok) return await r.json();
+      } catch (_) {}
+    }
+    return null;
+  }
+
+  // ──────────────────────────────────────────────────
+  // Load evidence.json → populate counters + drawer
+  // ──────────────────────────────────────────────────
+  async function loadEvidence() {
+    const data = await fetchJson(
+      './evidence/evidence.json',
+      './evidence/after-literals.json'
+    );
+    if (!data) return;
+    evidenceData = data;
+
+    const h = data.headline || {};
+
+    // Counters
+    const hc = h.hardCodedStrings || {};
+    document.getElementById('cnt-hc').textContent =
+      (hc.before != null ? hc.before : '?') + ' → ' + (hc.after != null ? hc.after : '?');
+
+    const tf = h.trapsFixed || {};
+    document.getElementById('cnt-traps').textContent =
+      (tf.fixed != null ? tf.fixed : '?') + ' / ' + (tf.total != null ? tf.total : '?');
+
+    const ec = h.englishChanged || {};
+    document.getElementById('cnt-en').textContent =
+      ec.existingContent != null ? ec.existingContent : '?';
+
+    const ln = h.languages || {};
+    const langVal = (ln.before != null ? ln.before : '?') + ' → ' + (ln.after != null ? ln.after : '?') +
+      (ln.plusPseudo ? ' + pseudo' : '');
+    document.getElementById('cnt-langs').textContent = langVal;
+
+    const bc = h.bobcoins || {};
+    document.getElementById('cnt-coins').textContent =
+      bc.usedTotal != null ? bc.usedTotal.toFixed(2) : '?';
+
+    // Evidence drawer — Traps
+    const det = data.details || {};
+    const prov = det.provenance || {};
+    const trapsSum = document.getElementById('ev-traps-summary');
+    trapsSum.textContent = `Traps fixed: ${tf.fixed ?? '?'} / ${tf.total ?? '?'}`;
+
+    if (prov.trapKeySha256) {
+      document.getElementById('ev-sha').textContent = prov.trapKeySha256;
+    }
+
+    if (data.trapsByCategory) {
+      const rows = Object.entries(data.trapsByCategory)
+        .map(([cat, v]) => `<tr><td>${cat}</td><td>${v.fixed ?? '?'}</td><td>${v.total ?? '?'}</td></tr>`)
+        .join('');
+      document.getElementById('ev-traps-table').innerHTML =
+        `<table class="ev-table"><thead><tr><th>Category</th><th>Fixed</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>`;
+    }
+
+    // Evidence drawer — Sessions
+    if (Array.isArray(data.bobSessions)) {
+      const tbody = document.getElementById('ev-sessions-body');
+      tbody.innerHTML = data.bobSessions.map(s => `
+        <tr>
+          <td><strong>${esc(s.id)}</strong></td>
+          <td>${esc(s.task)}</td>
+          <td style="white-space:nowrap;font-size:0.75rem;">${esc(s.mode)}</td>
+          <td style="text-align:right;white-space:nowrap;">${s.bobcoins != null ? s.bobcoins.toFixed(3) : '?'}</td>
+        </tr>`).join('');
+    }
+
+    // Evidence drawer — Proof
+    const liveUrls = data.liveUrls || {};
+    document.getElementById('ev-proof-content').innerHTML = `
+      <p style="margin-top:0;">
+        <a href="${esc(liveUrls.actions || '#')}" target="_blank" rel="noopener" style="color:var(--blue);">
+          🔧 GitHub Actions (CI runs) ↗
+        </a>
+      </p>
+      <p>
+        <a href="${esc(liveUrls.repo || '#')}" target="_blank" rel="noopener" style="color:var(--blue);">
+          📁 Source repository ↗
+        </a>
+      </p>
+      <p>
+        <a href="${esc(liveUrls.viewer || '#')}" target="_blank" rel="noopener" style="color:var(--blue);">
+          🌐 Live viewer ↗
+        </a>
+      </p>
+    `;
+
+    // Footer repo link
+    if (liveUrls.repo) {
+      document.getElementById('footer-repo').href = liveUrls.repo;
+    }
+  }
+
+  // ──────────────────────────────────────────────────
+  // Load locale bundles for plural showcase
+  // ──────────────────────────────────────────────────
+  async function loadLocales() {
+    const lngs = ['en','fr','ar'];
+    await Promise.all(lngs.map(async (lng) => {
+      const data = await fetchJson(`./locales/${lng}/pages.json`);
+      localeData[lng] = data;
+    }));
+    renderPluralTable();
+  }
+
+  function renderPluralTable() {
+    const counts = [0, 1, 2, 3, 11, 100];
+    const tbody = document.getElementById('plural-tbody');
+
+    const enFlights = localeData.en && localeData.en.flights ? localeData.en.flights : null;
+    const frFlights = localeData.fr && localeData.fr.flights ? localeData.fr.flights : null;
+    const arFlights = localeData.ar && localeData.ar.flights ? localeData.ar.flights : null;
+
+    if (!arFlights) {
+      tbody.innerHTML = '<tr><td colspan="5" style="color:var(--red);padding:0.8rem;">Failed to load locale bundles from ./locales/</td></tr>';
+      return;
+    }
+
+    const rows = counts.map(count => {
+      const arCat  = new Intl.PluralRules('ar',  { type: 'cardinal' }).select(count);
+      const enCat  = new Intl.PluralRules('en',  { type: 'cardinal' }).select(count);
+      const frCat  = new Intl.PluralRules('fr',  { type: 'cardinal' }).select(count);
+
+      const enStr  = enFlights ? interpolate(enFlights[`showingCount_${enCat}`] || enFlights['showingCount_other'] || '?', count, 'en') : '?';
+      const frStr  = frFlights ? interpolate(frFlights[`showingCount_${frCat}`] || frFlights['showingCount_other'] || '?', count, 'fr') : '?';
+      const arStr  = arFlights ? interpolate(arFlights[`showingCount_${arCat}`] || arFlights['showingCount_other'] || '?', count, 'ar') : '?';
+
+      return `
+        <tr>
+          <td><strong>${count}</strong></td>
+          <td>${esc(enStr)}</td>
+          <td>${esc(frStr)}</td>
+          <td class="ar-text">${esc(arStr)}</td>
+          <td><span class="cat-badge cat-${arCat}">${arCat}</span></td>
+        </tr>`;
+    });
+
+    tbody.innerHTML = rows.join('');
+  }
+
+  function interpolate(template, count, lng) {
+    if (typeof template !== 'string') return '?';
+    const formatted = new Intl.NumberFormat(lng).format(count);
+    return template.replace(/\{\{count\}\}/g, formatted);
+  }
+
+  // ──────────────────────────────────────────────────
+  // Language picker
+  // ──────────────────────────────────────────────────
+  document.querySelectorAll('.lang-btn').forEach(btn => {
+    btn.addEventListener('click', () => {
+      const lng = btn.dataset.lng;
+      setLanguage(lng);
+    });
+  });
+
+  function setLanguage(lng) {
+    currentLng = lng;
+
+    // Update buttons
+    document.querySelectorAll('.lang-btn').forEach(b => {
+      const active = b.dataset.lng === lng;
+      b.classList.toggle('active', active);
+      b.setAttribute('aria-pressed', String(active));
+    });
+
+    // Switch After iframe via localStorage → reload
+    const afterIframe = document.getElementById('iframe-after');
+    try {
+      if (afterIframe.contentWindow) {
+        afterIframe.contentWindow.localStorage.setItem('i18nextLng', lng);
+      }
+    } catch (_) {}
+    // Force reload by reassigning src (preserves route)
+    const route = currentRoute || '/';
+    afterIframe.src = 'after/#' + (route.startsWith('/') ? route : '/' + route);
+
+    // Schedule scan after iframe loads
+    scheduleScan(600);
+  }
+
+  function scheduleScan(delay) {
+    clearTimeout(scanTimer);
+    scanTimer = setTimeout(runScan, delay);
+  }
+
+  // ──────────────────────────────────────────────────
+  // Scan logic
+  // ──────────────────────────────────────────────────
+  document.getElementById('scan-btn').addEventListener('click', runScan);
+
+  function runScan() {
+    const statusEl = document.getElementById('scan-status');
+    statusEl.textContent = 'Scanning…';
+    statusEl.className = 'scan-status';
+
+    const beforeCount = scanIframe('iframe-before', currentLng, true);
+    const afterCount  = scanIframe('iframe-after',  currentLng, false);
+
+    // Build result line
+    const scanBar = document.getElementById('scan-bar');
+    scanBar.innerHTML = '';
+
+    const lbl = document.createElement('span');
+    lbl.style.color = 'var(--muted2)';
+    lbl.textContent = `Scan (${currentLng}) → `;
+    scanBar.appendChild(lbl);
+
+    const before = document.createElement('span');
+    before.className = 'scan-count-before';
+    before.textContent = `Before: ${beforeCount} hard-coded`;
+    scanBar.appendChild(before);
+
+    const sep = document.createElement('span');
+    sep.style.color = 'var(--muted2)';
+    sep.textContent = ' · ';
+    scanBar.appendChild(sep);
+
+    const after = document.createElement('span');
+    after.className = afterCount === 0 ? 'scan-count-after' : 'scan-count-before';
+    after.textContent = `After: ${afterCount}`;
+    scanBar.appendChild(after);
+
+    if (afterCount === 0) {
+      const ok = document.createElement('span');
+      ok.style.color = 'var(--green)';
+      ok.textContent = ' ✓ clean';
+      scanBar.appendChild(ok);
+    }
+  }
+
+  /**
+   * Walk an iframe's DOM, detect hard-coded text, outline offenders.
+   * @param {string} id - iframe element id
+   * @param {string} lng - current language
+   * @param {boolean} isBefore - Before pane always treated as untranslated
+   * @returns {number} count of offending elements
+   */
+  function scanIframe(id, lng, isBefore) {
+    const iframe = document.getElementById(id);
+    let doc;
+    try {
+      doc = iframe.contentDocument;
+    } catch (_) { return -1; }
+    if (!doc || !doc.body) return 0;
+
+    // Clear previous outlines
+    clearOutlines(doc);
+
+    const offenders = new Set();
+    const effectiveLng = isBefore ? (lng === 'ar' ? 'ar' : 'pseudo') : lng;
+
+    // Walk text nodes
+    walkTextNodes(doc.body, effectiveLng, offenders);
+
+    // Walk attributes
+    walkAttributes(doc.body, effectiveLng, offenders);
+
+    // Outline
+    offenders.forEach(el => {
+      el.style.outline = '2px solid #ef4444';
+      el.style.outlineOffset = '1px';
+      el._wrScanned = true;
+    });
+
+    return offenders.size;
+  }
+
+  function clearOutlines(doc) {
+    try {
+      doc.querySelectorAll('[style*="outline"]').forEach(el => {
+        if (el._wrScanned) {
+          el.style.outline = '';
+          el.style.outlineOffset = '';
+          el._wrScanned = false;
+        }
+      });
+    } catch (_) {}
+  }
+
+  function walkTextNodes(root, lng, offenders) {
+    const walker = root.ownerDocument.createTreeWalker(
+      root,
+      NodeFilter.SHOW_TEXT,
+      {
+        acceptNode(node) {
+          const parent = node.parentElement;
+          if (!parent) return NodeFilter.FILTER_REJECT;
+          const tag = parent.tagName && parent.tagName.toUpperCase();
+          if (['SCRIPT','STYLE','NOSCRIPT','TEMPLATE','IFRAME'].includes(tag))
+            return NodeFilter.FILTER_REJECT;
+          const cs = root.ownerDocument.defaultView
+            ? root.ownerDocument.defaultView.getComputedStyle(parent) : null;
+          if (cs && cs.display === 'none') return NodeFilter.FILTER_REJECT;
+          if (cs && cs.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
+          return NodeFilter.FILTER_ACCEPT;
+        }
+      }
+    );
+
+    let node;
+    while ((node = walker.nextNode())) {
+      const text = node.textContent.trim();
+      if (!text) continue;
+      if (isHardCoded(text, lng)) {
+        offenders.add(node.parentElement);
+      }
+    }
+  }
+
+  function walkAttributes(root, lng, offenders) {
+    const attrs = ['aria-label','title','placeholder','alt'];
+    try {
+      root.querySelectorAll('[aria-label],[title],[placeholder],[alt]').forEach(el => {
+        attrs.forEach(attr => {
+          const val = el.getAttribute(attr);
+          if (val && val.trim() && isHardCoded(val.trim(), lng)) {
+            offenders.add(el);
+          }
+        });
+      });
+    } catch (_) {}
+  }
+
+  /**
+   * Determine if a text string is "hard-coded" given the current effective locale.
+   * - pseudo: any text with Latin letters NOT wrapped in ⟦…⟧ is hard-coded
+   * - ar: any Latin-letter word not on allowlist is hard-coded
+   */
+  function isHardCoded(text, lng) {
+    if (lng === 'pseudo') {
+      return hasLatinLetters(text) && !isPseudoWrapped(text);
+    }
+    if (lng === 'ar') {
+      return hasUnallowedLatin(text);
+    }
+    // en / fr: no scan (text is expected in those languages in Before)
+    return false;
+  }
+
+  function hasLatinLetters(text) {
+    return /[a-zA-Z]/.test(text);
+  }
+
+  function isPseudoWrapped(text) {
+    // A text is ok if ALL latin-bearing segments are wrapped in ⟦…⟧
+    // Strategy: strip ⟦…⟧ blocks and check if residue has latin
+    const stripped = text.replace(/⟦[^⟧]*⟧/g, '');
+    return !hasLatinLetters(stripped);
+  }
+
+  function hasUnallowedLatin(text) {
+    // Tokenize on word boundaries; flag any token that:
+    // - contains [a-zA-Z]
+    // - is not on the allowlist
+    // - is not a pure number / currency / date / time
+    const tokens = text.match(/[^\s,;:·\-–—/|]+/g) || [];
+    for (const raw of tokens) {
+      const token = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
+      if (!token) continue;
+      if (!/[a-zA-Z]/.test(raw)) continue;               // no latin letters → ok
+      if (ALLOWLIST.has(token)) continue;                  // allowlisted brand word
+      if (isDateTimeLike(raw)) continue;                   // month / weekday names
+      return true;  // found an unallowed latin token
+    }
+    return false;
+  }
+
+  const DATE_TOKENS = new Set([
+    'january','february','march','april','may','june','july','august',
+    'september','october','november','december',
+    'jan','feb','mar','apr','jun','jul','aug','sep','oct','nov','dec',
+    'monday','tuesday','wednesday','thursday','friday','saturday','sunday',
+    'mon','tue','wed','thu','fri','sat','sun',
+    'am','pm','utc','gmt'
+  ]);
+
+  function isDateTimeLike(token) {
+    return DATE_TOKENS.has(token.toLowerCase().replace(/[^a-z]/g,''));
+  }
+
+  // ──────────────────────────────────────────────────
+  // Mobile tab switching
+  // ──────────────────────────────────────────────────
+  document.querySelectorAll('.tab-btn').forEach(btn => {
+    btn.addEventListener('click', () => {
+      const pane = btn.dataset.pane;
+      document.querySelectorAll('.tab-btn').forEach(b => {
+        b.classList.toggle('active', b.dataset.pane === pane);
+        b.setAttribute('aria-selected', String(b.dataset.pane === pane));
+      });
+      document.getElementById('pane-before').classList.toggle('hidden', pane !== 'before');
+      document.getElementById('pane-after').classList.toggle('hidden',  pane !== 'after');
+    });
+  });
+
+  // ──────────────────────────────────────────────────
+  // Evidence drawer accordion
+  // ──────────────────────────────────────────────────
+  document.getElementById('evidence-toggle').addEventListener('click', () => {
+    const body = document.getElementById('evidence-body');
+    const btn  = document.getElementById('evidence-toggle');
+    const open = body.classList.toggle('open');
+    btn.setAttribute('aria-expanded', String(open));
+    document.getElementById('ev-chevron').textContent = open ? '▲' : '▼';
+  });
+
+  // Evidence tabs
+  document.querySelectorAll('.ev-tab').forEach(tab => {
+    tab.addEventListener('click', () => {
+      const id = tab.dataset.tab;
+      document.querySelectorAll('.ev-tab').forEach(t => {
+        t.classList.toggle('active', t.dataset.tab === id);
+        t.setAttribute('aria-selected', String(t.dataset.tab === id));
+      });
+      document.querySelectorAll('.ev-panel').forEach(p => {
+        p.classList.toggle('active', p.id === 'panel-' + id);
+      });
+    });
+  });
+
+  // ──────────────────────────────────────────────────
+  // Iframe load → re-scan
+  // ──────────────────────────────────────────────────
+  ['iframe-before','iframe-after'].forEach(id => {
+    const el = document.getElementById(id);
+    el.addEventListener('load', () => scheduleScan(400));
+  });
+
+  // ──────────────────────────────────────────────────
+  // HTML escape util
+  // ──────────────────────────────────────────────────
+  function esc(str) {
+    if (str == null) return '';
+    return String(str)
+      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
+      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
+  }
+
+  // ──────────────────────────────────────────────────
+  // Init
+  // ──────────────────────────────────────────────────
+  (async function init() {
+    // Apply deep-link language immediately
+    if (currentLng !== 'en') {
+      // Update picker buttons without triggering language switch yet
+      document.querySelectorAll('.lang-btn').forEach(b => {
+        const active = b.dataset.lng === currentLng;
+        b.classList.toggle('active', active);
+        b.setAttribute('aria-pressed', String(active));
+      });
+    }
+
+    // Apply deep-link route to iframes
+    const beforeIframe = document.getElementById('iframe-before');
+    const afterIframe  = document.getElementById('iframe-after');
+
+    const route = currentRoute.startsWith('/') ? currentRoute : '/' + currentRoute;
+    beforeIframe.src = 'before/#' + route;
+    afterIframe.src  = 'after/#' + route;
+
+    // If non-English deep link, set localStorage before iframe loads
+    if (currentLng !== 'en') {
+      // We can't reliably set it before first load, but set it in the load event
+      afterIframe.addEventListener('load', function onFirstLoad() {
+        try {
+          afterIframe.contentWindow.localStorage.setItem('i18nextLng', currentLng);
+          afterIframe.src = 'after/#' + route;
+        } catch (_) {}
+        afterIframe.removeEventListener('load', onFirstLoad);
+      }, { once: true });
+    }
+
+    await Promise.all([loadEvidence(), loadLocales()]);
+  })();
+
+})();
+</script>
+</body>
 </html>

</patch>

**Assistant:**



_spend: {'cost': 0.11928, 'contextTokens': 59640}_

**Tool:**

To do list updated: 4 items total.

To do list completed.

**Assistant:**

Here's what was built in [`viewer/index.html`](viewer/index.html):

---

## What was built

### 1 — Top bar (sticky, dark, WCAG AA)
- `WorldReady` wordmark (purple accent) + tagline *"World-ready in a day. Proven, and kept that way."*
- **4 language buttons** (`English · Français · العربية · Pseudo`) with `aria-pressed` state; Arabic button uses Noto Sans Arabic
- **"Scan for hard-coded text"** button in amber

### 2 — Counters strip (5 tiles)
Fetches `./evidence/evidence.json` (falls back to `./evidence/after-literals.json`); renders:
- Hard-coded strings: **305 → 0** (red)
- Traps fixed: **24/30** (green)
- English content changed: **0** (green)
- Languages: **1 → 3 + pseudo** (accent)
- Bobcoins used: **15.16** (amber)

### 3 — Two panes side-by-side / tabbed ≤768 px
- Before iframe (`before/`) stays English; labelled with a BEFORE badge
- After iframe (`after/`) switches via `localStorage.setItem('i18nextLng', code)` + `iframe.src = 'after/#<route>'` on every language pick
- Mobile: tab bar replaces side-by-side; inactive pane gets `display:none`

### 4 — Arabic plural showcase card (hero)
- Fetches `./locales/{en,fr,ar}/pages.json` from the Pages-deployed bundle
- For counts `[0, 1, 2, 3, 11, 100]` calls `new Intl.PluralRules(lng).select(count)`, looks up `showingCount_<category>` (with `_other` fallback), interpolates `{{count}}` via `Intl.NumberFormat`
- Table: **Count · EN · FR · AR (Noto, RTL) · AR Category badge** (color-coded per category)

### 5 — Scan engine
- **Pseudo locale:** strips `⟦…⟧` blocks; any residual Latin → hard-coded
- **Arabic locale:** tokenizes text; any Latin token not in the allowlist (`Galaxium, Travels, Class, WorldReady, Bob, EN, FR, AR`) or date/time tokens → hard-coded
- **Before pane** always treated as pseudo/ar (its plain English lights up; contrast is the point)
- Draws `outline: 2px solid #ef4444` on every offending element inside the iframe
- Scan bar shows **"Before: N hard-coded · After: 0 ✓ clean"**
- Auto-fires 400 ms after any iframe `load` event; also fires 600 ms after language switch

### 6 — Evidence drawer (collapsible accordion + 4 tabs)
- **Traps:** fixed/total + trap-key SHA-256 from `details.provenance.trapKeySha256` + optional `trapsByCategory` table
- **Translator sheet:** link to the CSV on GitHub
- **Bob sessions:** table from `evidence.json` `bobSessions` (id · task · mode · bobcoins)
- **Proof/Links:** GitHub Actions, repo, live viewer links from `liveUrls`

### 7 — Deep links
`?lng=ar&route=/destinations/mars` → sets picker + points After iframe to `after/#/destinations/mars` and Before to `before/#/destinations/mars`

### 8 — Footer
"Built with IBM Bob" · "Demo app: IBM Galaxium Travels, Apache-2.0" · repo link (populated from `liveUrls.repo`)

### Fonts
Google Fonts only: **Inter** (UI) + **Noto Sans Arabic** (Arabic text) — no other external resources.

_spend: {'cost': 0.12124, 'contextTokens': 60620}_
