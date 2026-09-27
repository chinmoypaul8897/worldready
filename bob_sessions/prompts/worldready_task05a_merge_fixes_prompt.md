# WorldReady — Task 05a: merge fixes (pre-diagnosed)

- **Mode:** 🌍 i18n Extractor
- **Date:** 2026-09-27
- **Bobcoin budget:** 1.0 (stop and tell me if you would exceed it)

**Diagnosis (provided by Claude Code analysis).** The parallel extraction (Task 03) is in
place, but four issues stop the English rendering from being byte-identical. Apply exactly the
edits below and nothing else. Do **not** externalize date-format strings (`'MMM dd, yyyy'`
etc.), filter/enum values kept in English (`'economy'`, `'business'`, `'galaxium'`,
`'morning'`, `'afternoon'`, `'evening'`, `'night'`, `'inner_planets'`, `'outer_planets'`,
`'moons'`), or `labelKey` strings — those are intentional and must stay as they are.

## Fix 1 — i18next namespace separator (`src/i18n/index.ts`)

Components call `t('<namespace>.<context>.<leaf>')` (e.g. `t('common.header.brandName')`), and
the destination data holds keys such as `destinations.earth.name`. For i18next to take the
namespace from the first dotted segment, add **one** option to the `.init({ ... })` object:

```ts
nsSeparator: '.',
```

Put it next to `keySeparator`/`interpolation` (keep `keySeparator` at its default `'.'`; if it
is not set, leave it unset). Change nothing else in this file.

## Fix 2 — `src/pages/DestinationDetail.tsx`

The destination data fields now hold i18next **key paths**, not English. Resolve them with
`t(...)` where they are rendered, and use the English `nameEn` field wherever the value is used
as an API filter, a URL query, or the `getFlights`/filter match (not for display):

- Line ~59: `getFlights({ destination: destination.name })` → `getFlights({ destination: destination.nameEn })`
- Line ~61: `f.destination === destination.name` → `f.destination === destination.nameEn`
- Line ~103: add `nameEn` to the destructure:
  `const { name, nameEn, tagline, description, facts, hazards, gallery, accentColor, bgAccent, borderAccent } = destination;`
- Line ~126: `<h1 ...>{name}</h1>` → `{t(name)}`
- Line ~127: `<p ...>{tagline}</p>` → `{t(tagline)}`
- Line ~128: `<p ...>{description}</p>` → `{t(description)}`
- Lines ~136–141 (the six `FactTile`s): `value={facts.gravity}` → `value={t(facts.gravity)}`,
  and the same for `facts.distanceFromEarth`, `facts.typicalTransitTime`, `facts.surfaceTemp`,
  `facts.moons`, `facts.atmosphere`.
- Line ~156: `<span ...>{hazard}</span>` → `{t(hazard)}`
- Line ~173: `aria-label={item.alt}` → `aria-label={t(item.alt)}`
- Line ~175: `<p ...>{item.alt}</p>` → `{t(item.alt)}`
- Line ~179: `<p ...>{item.description}</p>` → `{t(item.description)}`
- Line ~191: `{t('pages.destination.flightsSoonSubtitle', { name })}` → `{ name: t(name) }`,
  i.e. `t('pages.destination.flightsSoonSubtitle', { name: t(name) })`
- Line ~199: `t('pages.destination.noFlightsTitle', { name })` → `t('pages.destination.noFlightsTitle', { name: t(name) })`
- Line ~225: `encodeURIComponent(name)` → `encodeURIComponent(nameEn)`

## Fix 3 — `src/pages/Home.tsx`

In the destinations grid the card fields are key paths — resolve them:

- Line ~141: `<h3 ...>{dest.name}</h3>` → `{t(dest.name)}`
- Line ~142: `<p ...>{dest.tagline}</p>` → `{t(dest.tagline)}`

(`dest.slug` in the `to={...}` link is correct — leave it.)

## Fix 4 — `src/components/common/Button.tsx`

There is one hard-coded visible string, the fallback loading text `Loading...`. Externalize it:

- Add `import { useTranslation } from 'react-i18next';` and inside the component
  `const { t } = useTranslation('common');`.
- Replace the visible `Loading...` text with `{t('common.button.loading')}`.
- Add the key to `src/locales/en/common.json` under a new `button` section:
  `"button": { "loading": "Loading..." }` (keep the exact English text `Loading...`).

## When done

Confirm: (1) `nsSeparator: '.'` is set; (2) every destination key-path is rendered through
`t()`; (3) `nameEn` is used for the flight filter, the match and the URL; (4) `Loading...` is
externalized. List the files you changed. Do not run the build and do not commit — I handle
that. Push back directly if any of this is wrong.
