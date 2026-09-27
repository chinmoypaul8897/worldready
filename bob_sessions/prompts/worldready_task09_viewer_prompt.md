# Task 09 — Build the WorldReady live viewer (the judge's page)

**Mode:** Agent · **Date:** 2026-09-27 · **Bobcoin budget: 2.0 (stop and tell me if you would exceed it).**

Build **one self-contained file, `viewer/index.html`** (inline CSS + vanilla JS; **no build step, no
external JS except Google Fonts**). It is deployed at the site ROOT by the existing Pages workflow,
which also copies `evidence/*.json` to `./evidence/` and the locale bundle to `./locales/` next to it.
The current `viewer/index.html` is a throwaway placeholder — **replace it entirely**.

Do **not** run the build or commit; do not edit anything outside `viewer/index.html`. Push back if a
data contract below looks wrong. **Do not read the trap key or `evidence/traps-key*`.**

## Same-origin facts you must rely on (do NOT use `?lng=`)
- The viewer, `before/`, and `after/` are all on the same origin, so the viewer JS **can** read each
  iframe's `contentDocument`.
- The AFTER app detects language from **`localStorage['i18nextLng']`** (detector order is
  `localStorage, navigator` — **`?lng=` does NOT work**). To switch the After pane: set
  `localStorage.setItem('i18nextLng', code)` then **reload the After iframe** by assigning its `src`
  (`after/#<route>`). Supported codes: `en`, `fr`, `ar`, `pseudo`. The After app sets
  `<html dir="rtl">` itself for `ar`.
- The BEFORE app ignores the picker (it has no i18n) — that is the point; keep it English always.

## Layout
1. **Top bar:** `WorldReady` wordmark + tagline **“World-ready in a day. Proven, and kept that way.”**
   + a language picker with four buttons **English · Français · العربية · Pseudo** + a **“Scan for
   hard-coded text”** button. Clean, modern, dark, accessible contrast (WCAG AA). Sticky.
2. **Counters strip** — fetch `./evidence/evidence.json` (on failure fall back to `./evidence/after-literals.json` etc.). Show 5 tiles from `headline`:
   - Hard-coded strings: `hardCodedStrings.before` → `hardCodedStrings.after` (e.g. **305 → 0**).
   - Traps fixed: `trapsFixed.fixed`/`trapsFixed.total` (e.g. **24/30**).
   - English content changed: `englishChanged.existingContent` (e.g. **0**).
   - Languages: `languages.before` → `languages.after` (e.g. **1 → 3**), note “+ pseudo”.
   - Bobcoins used: `bobcoins.usedTotal`.
3. **Two panes, side by side (desktop) / tabbed (≤ 768 px):**
   - **Before** — `<iframe src="before/">`, labelled “Before — IBM Galaxium (English only)”. It
     ignores the picker.
   - **After** — `<iframe src="after/">`, labelled “After — WorldReady”. It follows the picker via the
     localStorage-then-reload mechanism above.
4. **Arabic plural showcase card** (the hero). Fetch `./locales/en/pages.json`, `./locales/fr/pages.json`,
   `./locales/ar/pages.json`. For each **count in [0, 1, 2, 3, 11, 100]** render the app's real plural
   string `flights.showingCount` by:
   - category = `new Intl.PluralRules(lng, { type: 'cardinal' }).select(count)` (for `ar` this yields
     `zero, one, two, few, many, other` across those six counts — show the category name next to each);
   - pick `pages.flights['showingCount_' + category]` (fall back to `_other`);
   - interpolate `{{count}}` with `new Intl.NumberFormat(lng).format(count)`.
   Show a small table: count · Arabic string · **plural category**. Add EN and FR columns too. Caption:
   “Rendered by the real After i18n bundle — all six Arabic plural categories.”
5. **Scan** (button in the top bar; also auto-re-run 400 ms after any language switch or iframe load):
   walk **both** iframes' visible text nodes **plus** the attributes `aria-label`, `title`,
   `placeholder`, `alt`. Detect hard-coded text:
   - **Pseudo** locale: any visible text that contains Latin letters and is **not** wrapped in `⟦ … ⟧`
     is hard-coded (everything translated is bracket-wrapped).
   - **Arabic** locale: any **Latin-letter** word is hard-coded **unless** it is on the allowlist.
   - **Allowlist (not flagged):** the brand words `Galaxium`, `Travels`, `Class`, `WorldReady`, `Bob`;
     the language codes `EN`, `FR`, `AR`; and pure numbers / currency / dates / times (any token with no
     letters, plus month/weekday tokens). Match per **word token**, so “Galaxium Travels” and
     “Galaxium Class” are fully allowlisted.
   - Draw a **red outline** (`outline: 2px solid #ef4444`) on each offending element inside the iframe,
     and show a result line **“Before: N hard-coded · After: 0”** (N is the Before pane's count in the
     current locale; After should be 0). The Before pane is always English, so treat Before as pseudo/ar
     the same way (its English text is all un-bracketed Latin → it lights up; that contrast is the point).
   - It must survive navigation inside the iframes and re-run when the After iframe reloads.
6. **Evidence drawer** (collapsible; tabs):
   - **Traps:** show `trapsFixed.fixed`/`.total` and, from `evidence.json`
     `details.provenance.trapKeySha256`, the committed SHA-256, with the line “full key published after
     final scoring”. If `evidence.json` has a `trapsByCategory`, render it as a small table.
   - **Translator sheet:** a download link to `./docs/translator.csv`… actually link to
     `https://github.com/chinmoypaul8897/worldready/blob/main/docs/translator.csv` (the workflow does not
     copy docs/). Note “human review edits land in the morning”.
   - **Bob sessions:** render a table from `evidence.json` `bobSessions` (id · task · mode · bobcoins).
   - **Proof:** links to `liveUrls.actions` (GitHub Actions) and `liveUrls.repo`.
7. **Deep links:** on load, parse `location.search`: `?lng=ar&route=/destinations/mars` → set the picker
   to that language and point the After iframe at `after/#<route>` (and the Before iframe at
   `before/#<route>`). Default route `#/`.
8. **Footer / credits:** “Built with IBM Bob”, the Galaxium attribution (“Demo app: IBM Galaxium
   Travels, Apache-2.0”), and a repo link (`liveUrls.repo`). Use Google Fonts only (e.g. Inter + Noto
   Sans Arabic); no other external resources.

## Acceptance (I will verify with Playwright at desktop and 390 px)
- Picker flips the After pane to Arabic RTL (`<html dir=rtl>`), and to Pseudo (`⟦…⟧`).
- Scan shows Before > 0 and After = 0 in both Pseudo and Arabic.
- The plural card shows all six Arabic categories for [0,1,2,3,11,100].
- No console errors; responsive (tabs ≤ 768 px).

Keep everything in `viewer/index.html`. List what you built when done.
