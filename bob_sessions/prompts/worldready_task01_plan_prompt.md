# WorldReady — Task 01: i18n plan (Plan mode + document understanding)

- **Mode:** Plan
- **Date:** 2026-09-27
- **Bobcoin budget:** 0.8 (stop and ask if you would exceed it)
- **Context to attach:** `@docs/glossary.xlsx` `@docs/style-guide.pdf` `@src`

## Task

You are planning how to internationalize this existing **English-only React + TypeScript** app
(Galaxium Travels) into English, French (fr-CA) and Arabic (RTL) using **react-i18next** and the
**`Intl`** APIs. **Do not change any product code in this task** — only produce a written plan.

**First**, use an **Explore subagent** to map the codebase (components, pages, data, utils) so the
plan reflects the real file tree. Then read the attached glossary and style guide.

Write the plan to **`plans/i18n-plan.md`**. It must cover:

1. **Key naming convention and namespaces.** Use these five namespaces: `pages`, `flights`,
   `bookings`, `common`, `destinations`. Give the key-naming rule (e.g. dot-nested, lowerCamel
   leaf keys) and one worked example per namespace.
2. **File-ownership map for 5 parallel workers**, so five people can extract strings at once with
   **no merge conflicts**. Exactly one namespace JSON per worker:
   | Worker | Owns (source files) | Namespace JSON |
   |---|---|---|
   | 1 | `src/pages/` | `pages` |
   | 2 | `src/components/flights/` | `flights` |
   | 3 | `src/components/bookings/` | `bookings` |
   | 4 | `src/components/layout/`, `src/components/common/`, `src/components/user/` | `common` |
   | 5 | `src/data/destinations.ts` | `destinations` |
   List the actual files each worker touches (from the Explore pass).
3. **i18next runtime setup**: `src/i18n/index.ts` (init with the three languages, namespaces,
   fallback `en`, interpolation), wiring in `src/main.tsx`, and a `LanguageSwitcher` component.
4. **The `Intl` approach**: numbers, currency, dates, and relative time formatted through `Intl`
   (and date-fns locales where helpful), **keyed by `i18n.language`**, centralized in
   `src/utils/formatters.ts`.
5. **The RTL approach**: `<html lang dir>` driven by the active language, Tailwind **logical**
   utilities (`ms-*`/`me-*`/`ps-*`/`pe-*`, `text-start`/`text-end`) instead of physical
   left/right, and mirrored directional icons.
6. **The data rule**: any value used as a **filter key or URL/route value keeps its English
   value**; translate only the visible label (look up the label by a stable English slug/id).

## Acceptance checks

- `plans/i18n-plan.md` exists and covers all six points above.
- The ownership map assigns every worker exactly one namespace and lists real files.
- The plan references the glossary's do-not-translate brand terms (e.g. Galaxium) and the planet
  label-vs-value rule.

Push back directly if any of this is wrong or if you would exceed the budget.
