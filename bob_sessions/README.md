# Bob sessions — WorldReady

Every IBM Bob IDE task used to build WorldReady, in order. A PNG of each task's
consumption summary (Task Id, Context Length, Workspace, Bobcoins) was taken right after the
task; prompt files live in [`prompts/`](prompts/), exported task histories in [`exports/`](exports/).
Bobcoins and wall-clock are read from Bob's task DB (`~/.bob/db/bob.db`); wall-clock is
`updated_at − created_at` for the task.

## How Bob was used (one paragraph)

WorldReady was built end-to-end in **IBM Bob 2.0**. Bob **planned** the retrofit in Plan mode with an
Explore subagent and document understanding (reading the glossary and style guide), then authored a
reusable **`.bob` kit** — a custom `i18n-extractor` mode whose edit scope is limited by `fileRegex`, a
custom `i18n-extract` skill, and a PreToolUse commit-gate hook. The **hero task** ran **five parallel
subagents at once**, one per app area, moving 348 user-visible strings into i18next keys; a **parallel
task** wired i18next, the language switcher and Intl formatters concurrently. Bob then **translated** all
five namespaces to French (Québec) and Arabic (document understanding + Office-file write of the
translator round-trip sheet), did the **RTL pass** (logical utilities, mirrored icons, Noto Sans Arabic)
with an Explore subagent, built the **live comparison viewer**, and shipped the **gate** (a GitHub
Actions workflow plus an on-camera PreToolUse commit block and fix). An honest **plain-Bob baseline**
(the same task with no kit) is committed as a fairness control.

> **Disclosure:** Claude Code wrote the independent verifiers, demo mock, deploy plumbing and
> documentation; IBM Bob wrote the product i18n work.

## Every task

| # | Task | Mode + Bob features used | Bobcoins | Wall-clock | Task id | Main files | Screenshot |
|---|---|---|---|---|---|---|---|
| T01 | i18n plan (key convention, ownership map, i18next/Intl/RTL/data rules) | Plan mode + `create-plan` skill + Explore subagent + document understanding (`glossary.xlsx` + `style-guide.pdf`) | 0.576 | 243 s | `4593193355a8c601be89e9368f417114` | `plans/i18n-plan.md` | [png](worldready_task01_plan_summary.png) |
| T02 | Create the `.bob` kit: custom `i18n-extractor` mode (`fileRegex`), `i18n-extract` skill, PreToolUse commit-gate hook | Agent mode | 0.400 | 64 s | `1da972e2c73ac0b46b3757e612b08bea` | `.bob/custom_modes.yaml`, `.bob/skills/i18n-extract/SKILL.md`, `.bob/hooks/gate-commit.mjs`, `.bob/settings.json` | [png](worldready_task02_kit_summary.png) |
| T02-fix | Pre-diagnosed fix: hook read stdin via ESM `import` (was `require`, failed open) | Agent mode | 0.130 | 16 s | `e19859aae3c49bbf2e283a680053d5f7` | `.bob/hooks/gate-commit.mjs` | (in kit summary) |
| T02-fix-2 | Pre-diagnosed fix: gate key-parity only once `src/locales/en` exists (no false blocks) | Agent mode | 0.134 | 16 s | `6f08e5d552503c8dfa7f3613189424db` | `.bob/hooks/gate-commit.mjs` | (in kit summary) |
| T02b | Mode-restriction proof: in `i18n Extractor` mode, asked to edit `scripts/count-literals.mjs` → **Bob refused** (`fileRegex` blocks it) | 🌍 i18n Extractor mode | 0.024 | 9 s | `243260a8b02b2935a12e62c5a1fde565` | (no edit — refusal) | [png](worldready_task02b_mode_refusal_summary.png) · [chat](worldready_task02b_mode_refusal_chat.png) |
| T11 | Plain-Bob baseline (no kit) on a copy of `v0-before`: 3/5 bookings traps, literals 55→14, stopped by the cost cap | Agent mode, **no** kit | 1.064 | 166 s | `090ce6865907faf00e558d448673a5ff` | scratch `bob-sandbox/**` (scored to `evidence/baseline-plain-bob.json`) | [png](worldready_task11_plain_baseline_summary.png) |
| T03 | **Parallel i18n extraction — 5 general subagents at once** (the hero moment): 348 en strings into `src/locales/en/*.json` + `t()`/`<Trans>` | 🌍 i18n Extractor mode + i18n-extract skill + **5 parallel subagents** | 5.16 | 740 s | `f44585c5aed55170d1beb12b66454ab6` | `src/locales/en/*.json`, `src/pages/*.tsx`, `src/components/**`, `src/data/destinations.ts` | [png](worldready_task03_parallel_subagents_hero.png) |
| T04 | Runtime wiring (ran in parallel with T03): i18next + LanguageDetector, `LanguageSwitcher`, locale-aware Intl formatters | Agent mode (Bob 2.0 **parallel task**) | 0.675 | 125 s | `ba080509d8970ec1abd49ef8614d5bc9` | `src/i18n/index.ts`, `src/main.tsx`, `src/components/common/LanguageSwitcher.tsx`, `src/utils/formatters.ts` | [png](worldready_tasks_panel_all_costs.png) |
| T05a | Merge fixes (pre-diagnosed): `nsSeparator:'.'`, destination key resolution, one leftover `Loading...` | 🌍 i18n Extractor mode | 1.094 | 112 s | `26647736b7e88b2bcd01d5ea0db1f9d5` | `src/i18n/index.ts`, `src/pages/{DestinationDetail,Home}.tsx`, `src/components/common/Button.tsx` | [png](worldready_task05a_merge_fixes_summary.png) |
| T05b | Place `LanguageSwitcher` in the header (site-wide EN/FR/AR) | 🌍 i18n Extractor mode | 0.106 | 24 s | `8e3b8c75eb676be5b7fd96dd4f77e958` | `src/components/layout/Header.tsx` | [png](worldready_task05b_switcher_header_summary.png) |
| T06 | French (Québec) + Arabic translation of all 5 namespaces (348 keys each) + translator round-trip sheet; ar all 6 plural forms | Agent mode + document understanding (glossary + style guide) + Office-file **write** (CSV) | 3.62 | see note¹ | `60fa3dfe0da14b05066c173069cb3efb` | `src/locales/fr/*.json`, `src/locales/ar/*.json`, `docs/translator.csv` | [png](worldready_task06_fr_ar_translate_summary.png) |
| T08 | RTL layout pass: 12 physical → logical utilities, 3 icons mirrored (`rtl:-scale-x-100`), Noto Sans Arabic scoped to ar | Agent mode + Explore subagent | 1.34 | 167 s | `d8984dc930b951148242923f8bb9bdd4` | `src/components/**`, `src/pages/{Flights,DestinationDetail}.tsx`, `src/index.css`, `index.html` | [png](worldready_task08_rtl_pass_summary.png) |
| T13 | Sweep fix: render raw English flight-route planet names through i18next in 5 display sites | 🌍 i18n Extractor mode | 0.974 | ~113 s | `c452b8c22e4e125414863610f848d24a` | `src/components/flights/FlightCard.tsx`, `src/components/bookings/{BookingCard,BookingModal,HoldCard}.tsx`, `src/pages/DestinationDetail.tsx` | [png](worldready_task13_planet_labels_summary.png) |
| T09 | The live comparison viewer (picker, 5-tile counters, Before/After iframes, 6-form Arabic plural showcase, Scan, evidence drawer) | Agent mode | 0.756 | ~40 s | `6be2caca4e0a29e05a1e1a5571938917` | `viewer/index.html` (1132 lines) | [png](worldready_task09_viewer_summary.png) |
| T10-gate | The CI gate: `.github/workflows/i18n-gate.yml` (count-literals=0 · key-parity · build · frozen-verifier diff) + improved hook block message | Agent mode | 0.146 | ~30 s | `52a6efbf6e16fbfb7fdbeca16d2c6eef` | `.github/workflows/i18n-gate.yml`, `.bob/hooks/gate-commit.mjs` | [png](worldready_task10_ci_gate_summary.png) |
| T10-block | On-camera commit block: hard-coded `New!` badge → **PreToolUse hook blocked** the commit (exit 2) | 🌍 i18n Extractor mode + PreToolUse hook | 0.175 | ~35 s | `ea99824c110c97ad1ba6b834dc44093f` | `src/components/layout/Header.tsx` (staged, blocked) | [png](worldready_task10_hook_blocks_commit_summary.png) · [chat](worldready_task10_hook_blocks_commit_chat.png) |
| T10-fix | Then the fix commits cleanly: `t('header.newBadge')` added to all 4 locales; commit `b4b2d55` | 🌍 i18n Extractor mode + PreToolUse hook (passed) | 0.203 | ~40 s | `200d749b6ce9d0e83c4b82e96fe6985b` | `src/components/layout/Header.tsx`, `src/locales/{en,fr,ar,pseudo}/common.json` | [png](worldready_task10_hook_fix_summary.png) |
| T07 | **Translator read-back:** Bob read the human-reviewed `docs/translator.xlsx` (Office read), found the 7 cells that differ from `src/locales/{fr,ar}` and applied them — **"7/7 reviewer edits applied"**; astroport approved unchanged | 🌍 i18n Extractor mode + **document understanding** (`office_read` of `.xlsx`) | 1.29 | ~4 min | `fa7bcd8a303eb1cc61252af1b2548606` | `src/locales/ar/{pages,flights,bookings}.json`, `src/locales/fr/{flights,bookings}.json` | [png](worldready_task07_translator_readback_summary.png) |
| T09b | Viewer polish: taller Before/After panes on desktop (68vh) + `body { height: auto }` so the Arabic plural showcase is no longer squeezed on desktop or overlapping the panes at 390 px (pre-diagnosed by Claude, verified in a browser) | Agent mode | 0.449 | ~3 min | `95d87050bfdb03191148ad4544d9a9d5` | `viewer/index.html` (CSS only) | [png](worldready_task09b_viewer_taller_panes_summary.png) |

¹ **T06 wall-clock:** the DB span is ~11 505 s, but that **includes a ~3 h API-outage gap** between a crashed first attempt and the resume; actual Bob compute was a small fraction.

**Also captured (attempt / evidence, not standalone product tasks):** `worldready_task12_review_panel.png` (Bob's `/review` panel — see the T12 note below); T03 rerun/midrun frames (`worldready_task03_parallel_subagents_rerun1.png`, `_rerun_live.png`, `_midrun1..3.png`).

## Totals

- **17 itemized product tasks**, summing to **≈ 16.58 Bobcoins**.
- **DB-verified account total: 17.67 / 40 Bobcoins** (the ≈ 1.09 difference is retried/exploratory/diagnostic Bob runs — the P06 first-attempt crash, T03 reruns, and the P08 pre-restart badge take + echo probe — documented in the P06 & P08 reports). **Balance ≈ 22.33 / 40.**
- Trap score **frozen at 24 / 30**; `count-literals` **0**; `key-parity` **PASS**.

---

## Detailed per-task notes & independent verification (Claude Code)

**P05 verification (T03/T04/T05).** Build **green** (`tsc -b && vite build`); **English parity = 0 changed
characters** across 5 routes (`scripts/english-parity.mjs`, live `/before/` vs local build); every literal
`t()` key (206) and destinations data key-path (137) resolves; `key-parity` pseudo **OK** (fr/ar are T06).
count-literals **320 → 155**, but all 155 are false positives (date-format strings, English-kept filter
values, i18next key references) — true hard-coded-English residual **0**; see `evidence/after-extraction.json`.
Claude-authored plumbing this prompt: pseudo locale generation (`scripts/pseudo.mjs`), `evidence/after-*.json`,
and **two trivial TypeScript type-annotation fixes** to make Bob's T04 code compile.

**P06 verification of T06.** `key-parity` **PASS** for fr (`{one,many,other}`) and ar
(`{zero,one,two,few,many,other}`), 0 missing / 0 extra vs en (348 keys); build **green**; independent
check — **0 placeholder mismatches, 0 brand-term losses, 0 missing keys** across fr+ar; `translator.csv`
header exact, **352 data rows**, 7 Galaxium rows retained. One residual: `ar/pages.json →
myBookings.titlePart2` is an **empty string** (Arabic "حجوزاتي" collapses "My Bookings" into one word in
`titlePart1`); renders as an empty accent span, no English leak / no raw key — flagged for the morning
human reviewer.

**P06 verification of T08 (RTL).** **0 residual** physical `ml-/mr-/pl-/pr-/left-/right-/text-left/text-right`
in component markup and **0** inline left/right styles; all **3 rendered** `ArrowLeft` icons carry
`rtl:-scale-x-100`; `index.html` links Noto Sans Arabic + title fixed; Arabic font scoped so English DOM is
unchanged; build **green**; **English parity = 0 changed chars** across 5 routes. 16 Playwright screenshots
(ar RTL + fr LTR, 4 routes × 2 widths) in `bob-hackathon-tools/evidence/p06_*.png`. Evidence:
`evidence/after-translation.json`.

**P07 verification of T09 (viewer).** Playwright-verified live at desktop 1366 + phone 390: the picker flips
the After pane to Arabic `<html dir=rtl lang=ar>` and to Pseudo (`⟦…⟧`); **Scan** shows **Before: 47
hard-coded · After: 0 ✓ clean** in ar and pseudo (brand "Galaxium Travels" correctly NOT flagged); the
Arabic plural showcase renders all **six** categories for counts [0,1,2,3,11,100]; **no console errors**;
responsive; evidence drawer, deep links, credits present. **Two Claude finishing fixes to Bob's viewer
(disclosed):** (1) language switch now persists on same-origin localStorage + reloads the After iframe with
a cache-busting query (a hash-only change did not reload it); (2) `runScan()` referenced `#scan-status`
after `innerHTML=''` had destroyed it. Commits `9db6042`, `bd87f41`.

**P07 verification of T13 (sweep).** Build **green**; `count-literals` still **0** real hard-coded English;
the 5 display sites render `t(destData.name)`/`t(originData.name)`, and `flight.origin`/`flight.destination`/
`nameEn` stay English for filter/search/lookup. Genuine sweep finding (the scored **data** category was
already 4/4); no trap key referenced.

**P08 verification of T10 (gate).** Hook block re-verified end-to-end (staged literal → hook exit 2 with
"Blocked: 1 hard-coded string in src/components/layout/Header.tsx (1)"; non-commit → exit 0; clean commit →
exit 0). After the badge fix, `count-literals` = **0** and `key-parity` = **PASS**. `t('header.newBadge')`
resolves via defaultNS fallback (`common`) identically to the `common.header.*` convention. The CI-gate YAML
and the frozen-baseline diff were verified locally before commit. Screen recording of the block:
`bob-hackathon-tools/video/raw/task10_hook_block.mp4` (private).

**T12 — Bob `/review` (attempted) + independent review (P08).** `/review v0-before` opened Bob's Review
panel (Source Control → REVIEW; `worldready_task12_review_panel.png`) but did not auto-run: Bob's review
compares *branches* and `v0-before` is a *tag*, so completing it needs an interactive **Start Review** click
the headless driver can't perform. In its place Claude ran an equivalent independent review of the
`v0-before..main` diff plus a full verifier re-run: **0** physical directional Tailwind classes and **0**
inline left/right styles, `count-literals` **0**, `key-parity` **PASS**, `score-traps` **24/30** (unchanged)
— no real i18n/layout findings to fix. (A genuine Bob `/review` is a ~2-minute morning human step: create a
`before-baseline` branch from the tag, then REVIEW AGAINST it → Start Review.)
