# WorldReady — Task 03: parallel i18n extraction (5 subagents)

- **Mode:** 🌍 i18n Extractor
- **Date:** 2026-09-27
- **Bobcoin budget:** 5.0 (stop and tell me if you would exceed it)

Follow `plans/i18n-plan.md` and the **i18n-extract skill**, with the path/language
overrides in this prompt (they win over the plan).

## What to do

**Spawn 5 general subagents in parallel — one per group in the ownership map below.**
Each subagent moves **every user-visible English string** in *its own files* into its
namespace file and replaces it in the component with a `t()` call (or `<Trans>` when the
string wraps inline markup), using `useTranslation('<namespace>')`.

"User-visible string" means: JSX text, **and** the values of `aria-label`, `alt`, `title`,
and `placeholder` attributes, **and** the literal message passed to `toast(...)` /
`toast.success/error(...)`, **and** user-facing label strings inside data objects.

### Path & language overrides (IMPORTANT — these differ from the plan text)

- Locale files go in **`src/locales/en/<namespace>.json`** — NOT `public/locales`, and NOT
  `i18next-http-backend`. The runtime bundles `src/locales` directly (a separate task wires
  it up). One JSON file per namespace.
- The English language code is **`en`** (folder `src/locales/en/`).
- **Create only the English (`en`) locale files in this task.** Do not create `fr`, `ar`,
  or `pseudo` — later tasks own those.

### Ownership map — one subagent per row (no file is touched by two subagents)

| Subagent | Namespace file (create) | Source files it edits |
|---|---|---|
| 1 | `src/locales/en/pages.json` | `src/pages/Home.tsx`, `src/pages/Flights.tsx`, `src/pages/MyBookings.tsx`, `src/pages/DestinationDetail.tsx` |
| 2 | `src/locales/en/flights.json` | `src/components/flights/FlightCard.tsx`, `src/components/flights/FlightFilters.tsx` |
| 3 | `src/locales/en/bookings.json` | `src/components/bookings/BookingCard.tsx`, `src/components/bookings/BookingModal.tsx`, `src/components/bookings/HoldCard.tsx` |
| 4 | `src/locales/en/common.json` | `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/common/Modal.tsx`, `src/components/common/LoadingSpinner.tsx`, `src/components/user/UserIdentification.tsx` |
| 5 | `src/locales/en/destinations.json` | `src/data/destinations.ts` (+ update its callers only if the caller is in this same file; do not edit page components — subagent 1 owns those) |

`Layout.tsx`, `Button.tsx`, `Card.tsx`, `Starfield.tsx`, `Input.tsx`, `index.ts` have no
user-visible strings (or only a stray one); leave them unless a subagent finds a real
user-visible literal in its own file.

### Rules every subagent must follow (from the i18n-extract skill)

1. **Keep the English output identical.** The rendered English text must not change at all.
2. **Never concatenate** translated fragments — one key with interpolation
   (`t('k', { name })`), never string joins.
3. **Plurals go through i18next `count`** — any countable string (e.g. a seats-left / results
   count) uses `t('key', { count })` with `_one` / `_other` forms in English; never append
   an "s" in code.
4. **Externalize `aria-label`, `alt`, `title`, `placeholder`** too — they are user-visible.
5. **Values used as a filter key, URL/route segment, or API query parameter keep their English
   value.** Translate only the visible label, looked up by a stable English slug/id. In
   particular: destination `slug` values (`earth`, `mars`, `moon`, `venus`, `jupiter`,
   `europa`, `pluto`) and seat-class values (`economy`, `business`, `galaxium`) stay English;
   only their display labels move to `t()`.
6. **Brand terms stay verbatim in every language:** `Galaxium`, `Galaxium Travels`,
   `Galaxium Class`, `WorldReady`, `Bob`.
7. **Key convention:** `<namespace>.<context>.<leafKey>`, all `lowerCamelCase`, max depth 3,
   never use the English text itself as the key.
8. **Each subagent writes only its own namespace JSON and its own source files.**

### Hard boundaries (all subagents)

- **Do not edit files outside your row.** Do not touch: `scripts/**`,
  `src/services/api.ts`, `src/services/demoApi.ts`, `src/i18n/**`, `src/utils/formatters.ts`,
  `src/main.tsx`, `src/App.tsx`, `src/components/common/index.ts`, `vite.config.ts`,
  `package.json`, `.github/**`, `docs/**`, `evidence/**`. A **parallel task** is creating the
  i18n runtime, the `LanguageSwitcher`, and the formatters at the same time — leave those to it.
- **Do not run `npm install` and do not run the build.** The parallel task installs the
  packages; the build runs afterward. Add the `import { useTranslation } from 'react-i18next'`
  lines even though the package may not be installed yet — that is expected.
- **Do not commit.** I handle commits.

### When done

Report, per namespace: the count of keys added and a one-line confirmation that the English
rendering is unchanged for those files. Then stop.

Push back directly if any of this is wrong.
