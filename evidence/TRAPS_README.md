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

- **Key location (uncommitted):** `C:\Users\chinm\worldready-key\traps.json`
- **Committed hash:** [`traps-key.sha256`](./traps-key.sha256)
- **Trap count:** 30, across the 8 categories below.

### Verify the hash (after the key is published)

```
# from the folder containing the published traps.json
sha256sum -c traps-key.sha256
# or, cross-platform:
node -e "const c=require('crypto'),fs=require('fs');console.log(c.createHash('sha256').update(fs.readFileSync('traps.json')).digest('hex'))"
```

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
