# How "hard-coded user-visible strings" is counted (the ruler), and why it changed

Metric #1 of WorldReady is *"hard-coded, user-visible English strings → 0"*. The number is
produced by `scripts/count-literals.mjs` — a checker **authored by Claude Code, never by the
agent it grades (IBM Bob)**. This note documents the counting rule, a refinement made by worker
P07, and the results under **both** rules on **both** builds, so the headline number is auditable.

## The tool

Three disjoint static passes, summed, with per-file counts:

- **A. JSX** — ESLint (`eslint-plugin-i18next`, `no-literal-string`, jsx-only via
  `eslint.i18n.config.mjs`): JSX text + the attributes `placeholder` / `alt` / `title` /
  `aria-label`.
- **B. Data** — TypeScript compiler API over `src/data/*.ts`: user-visible string-valued object
  properties.
- **C. Toast** — TypeScript compiler API over all `*.ts`/`*.tsx`: `toast()` / `toast.<x>()` calls
  whose first argument is a string literal.

## Why the rule was refined (P07, architect ruling 07:15 IST)

The three passes are heuristic: they flag *any* string literal in a user-visible position. But
three kinds of literal are **not** hard-coded English copy, and counting them **overstates** the
metric. After the i18n retrofit landed on `main`, the old rule reported **155** "literals" — and
P05 verified that **all 155 were false positives**, not English copy. Counting them made the
"after" build look worse than it is (it renders zero English in a non-English locale).

The fix is to the **ruler, never the numbers**: the counter now excludes three evidenced,
documented categories, and prints the excluded totals separately so the subtraction is visible.

### The three documented exclusions

- **(a) i18next key paths** — a string that *exactly equals* a key present in
  `src/locales/en/*.json` (e.g. `destinations.mars.tagline`, `flights.filters.seatEconomy`). These
  are resolved by `t(...)` at render; the visible text lives in the locale files, not the code.
  Applied **only when the en locale bundle exists** — so on `v0-before` (no locales) the inline
  English marketing copy in `src/data/destinations.ts` still counts, exactly as it should.
- **(b) date-fns / Intl format patterns** — strings composed only of date-field token letters and
  separators, shaped like a real pattern (a same-letter token run `MMM`/`yyyy`, or a separated
  pattern with a multi-char field such as `MMM dd` / `HH:mm`). They are format specifiers passed to
  `formatDate` / Intl, not sentences; the localized output is produced per-locale by the formatter.
  The detector requires a genuine same-letter run so real words made of token letters are **not**
  misclassified (e.g. the placeholder `Max` — `M`,`a`,`x` are all token letters but not a token —
  correctly stays counted).
- **(c) enum / filter values kept English on purpose** — the internal option values the UI sends to
  the API (`economy`, `business`, `galaxium`, `morning`…`night`, `inner_planets`/`outer_planets`/
  `moons`, `asc`/`desc`, sort fields). The visible **label** next to each is translated via `t()`;
  the value is kept canonical/English by design so filtering/sorting is stable across locales.

Also: `nameEn` in `src/data/destinations.ts` is added to the existing data-id exclusion set. It is
the stable English planet name used as the flight-search **filter value** and for lookups
(`getDestinationByName`); the code marks it *"do NOT translate"*. It is the same id role as `name`
(trap DA-04) — the T05a refactor split the English value out of `name` into `nameEn`.

> **Rule (a)–(c) find real English?** If the refined counter still reports real English on `main`,
> that is a pre-diagnosed Bob fix (i18n Extractor), **not** a new exclusion. It reported **0**.

## Results — old rule vs new rule, both builds

| Build | Old rule (P03/P05) | New rule (P07) | Excluded by new rule (not counted) |
|---|---|---|---|
| **v0-before** (tag `v0-before` = `f053de3`, no i18n) | **320** | **305** | 15 = 5 date patterns + 10 enum values (0 key paths — no locale bundle) |
| **main / after** (i18n retrofit) | **155** | **0** | 148 = 133 key paths + 5 date patterns + 10 enum values (+ 7 `nameEn` ids) |

**Honest headline: 305 → 0 hard-coded user-visible English strings.** (The older "320 → 155"
under-counted the retrofit's success; 155 were all false positives.) The new baseline **305** is the
honest one: it drops the 15 non-copy strings (format patterns + English-kept enum values) that were
never translatable UI copy on either build.

### Exact commands (reproducible)

```
# after / main (run from repo root; en locale bundle present):
node scripts/count-literals.mjs --json evidence/after-literals.json

# v0-before (a detached worktree at tag v0-before, scanned by the SAME refined script):
git worktree add --detach ../wr-v0-before v0-before
node scripts/count-literals.mjs --dir ../wr-v0-before --json evidence/before-literals-refined.json
```

Machine-readable reports: `evidence/after-literals.json` (main, new rule),
`evidence/before-literals-refined.json` (v0-before, new rule). The pre-refinement numbers are
preserved in `evidence/baseline.json` (v0-before, old rule = 320) and
`evidence/after-extraction.json` (main, old rule = 155).

### Change provenance

The exclusions were added to `scripts/count-literals.mjs` by worker **P07** (see the Bob task-07
commit on `main`). The script's authorship is unchanged: Claude Code owns the checker; Bob never
edits `scripts/**` (enforced by the `i18n-extractor` mode `fileRegex`, proven in task T02b).
