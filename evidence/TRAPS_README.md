# Held-out i18n trap key

WorldReady proves that internationalizing IBM's English-only *Galaxium Travels*
frontend fixes real bugs that plain text translation cannot. The proof is a set of
**held-out i18n traps**: real defects that exist in the original app, each with a
deterministic automatic check that decides — purely from the source tree — whether the
defect has been fixed.

## Why the key is held out

> *The checker is not written by the agent it grades.*

The traps and their checks are authored by **Claude Code**, never by **IBM Bob** (the
agent that does the internationalization work). To keep the metric honest — so the score
cannot be tuned to the answer key — the key file lives **outside** the repository, outside
every Bob workspace, and is never placed in any prompt Bob can read. Only its SHA-256 hash
is committed here, *before* Bob's i18n work begins. The full key is published next to this
hash **after final scoring**, so anyone can verify the hash matches and audit every trap.

- **Committed hash:** [`traps-key.sha256`](./traps-key.sha256) =
  `ef68d1a6e1ba4d320b3071b187cb838ac59b943af69186157f99e55ec5d5ae3e`, first committed in
  `918222d` — **before any Bob i18n task ran**.
- **Published key (after final scoring):** [`traps-key.json`](./traps-key.json) — its SHA-256 matches
  the committed hash above.
- **Trap count:** 30, across the 8 categories below.

### Verify the hash

```
# from evidence/ :
node -e "const c=require('crypto'),fs=require('fs');console.log(c.createHash('sha256').update(fs.readFileSync('traps-key.json')).digest('hex'))"
# -> ef68d1a6e1ba4d320b3071b187cb838ac59b943af69186157f99e55ec5d5ae3e
```

## Final score (frozen 2026-09-27 by worker P07)

**24 / 30 traps fixed.** Per category: plural 3/3 · reltime 0/2 · format 1/3 · toast 5/5 ·
attr 4/4 · data 4/4 · rtl 6/6 · backend 1/3. Full machine-readable result:
[`after-traps.json`](./after-traps.json). The original English-only app scores **0/30**
([`baseline.json`](./baseline.json)).

The 6 residual traps (2 relative-time, 2 formatting, 2 backend-error strings) are on
error/format code paths the autonomous kit+Bob run did not reach. They were **not** answer-fed:
per the project's fairness rules, no Bob prompt ever named a trap, a file:line from the key, or
"the traps you'll be scored on", and pre-diagnosed fixes were never written for trap items before
the score was frozen. The **plain-Bob baseline** (`baseline-plain-bob.json`), run on the same
folder with the same rules and no kit, is the fairness control.

### Provenance disclosure (held-out-key hygiene)

An early commit, **`918222d`** (worker P03's first commit), accidentally contained the detailed
trap list (`evidence/traps-before.json`) for about **3 minutes** before it was removed in `15e4144`
— **and before any Bob task ran at all**. History was not rewritten (the repo is shared; force-push
over shared history is prohibited), so that blob still exists at `918222d`. **No Bob prompt ever
referenced that commit, that file, or any trap entry.** Because the traps are genuine i18n defects
that Bob had to fix in real code (the checks require real fixes, not string matching), and because
the plain-Bob baseline is the fairness control, the practical effect on the score's integrity is
nil. This is disclosed here, in the README limits section, and in the Bob Usage Statement.

## Method

Each trap records: a stable id, its category, the file it lives in, a stable locator
(a code anchor, not just a line number), a "before" snippet, a plain-English rationale, and
an **automatic check**. A check resolves a target (a file path or glob) against the app tree
and evaluates regular-expression conditions:

- `absent` — none of these patterns may appear (the bad code is gone);
- `present` — all of these patterns must appear (the required fix is in place);
- `presentAny` — at least one of these must appear (e.g. the file now imports i18n).

A trap counts as **fixed** only when its target resolves to at least one file and every
condition passes. The scorer is [`scripts/score-traps.mjs`](../scripts/score-traps.mjs):

```
node scripts/score-traps.mjs --key <path\to\traps.json> --dir <appRoot> --json evidence/traps.json
```

The original English-only app is expected to score about **0/30**; the internationalized
app should score **>= 28/30**. The scorer prints `fixed/total` per category and per trap,
with the reason each unfixed trap failed.

## The 8 trap categories

1. **Glued plurals** — English pluralization built with a ternary or string concatenation
   (`flight{n !== 1 ? 's' : ''}`, `` `${n} left` ``), which breaks for languages with
   different plural rules (Arabic has 6 forms).
2. **Hand-made relative time** — hard-coded "just now / minutes ago / hours ago / days ago"
   strings instead of `Intl.RelativeTimeFormat` or i18next plurals.
3. **Hard-coded locale formatting** — `Intl.NumberFormat('en-US')`, `currency: 'USD'`, and
   date-fns `format()` calls with no locale, so numbers, money and dates never localize.
4. **Template-literal toasts carrying variables** — notifications built with backtick
   interpolation instead of i18next interpolation keys.
5. **Untranslated attributes** — `placeholder`, `aria-label`, `title` and `alt` text left in
   English (user-visible, and read aloud by screen readers).
6. **Data-file copy & filter values** — user-visible marketing copy inlined in data files,
   plus a planet name used simultaneously as a display label and a search-filter value
   (translating it would break the filter).
7. **RTL layout** — physical `left`/`right` Tailwind classes, directional icons that don't
   mirror, and `<html>` with no `dir`, so Arabic renders left-to-right.
8. **Raw backend English shown to users** — backend error strings surfaced verbatim, and the
   raw project name in `<title>`.

*(This document intentionally lists no individual trap entries, files-by-id, or checks. The
full key is released after final scoring.)*

— Authored by Claude Code (worker P03).
