# Task 13 — Translate flight route planet labels (sweep fix)

**Mode:** 🌍 i18n Extractor · **Date:** 2026-09-27 · **Bobcoin budget: 0.5 (hard cap).**

Push back directly if any step is wrong.

## Diagnosis (provided by Claude Code analysis)

A runtime sweep of the live app in the Arabic and pseudo locales found that the **flight route
header shows raw English planet names** (`Earth`, `Mars`, `Moon`, `Venus`, `Jupiter`, `Europa`,
`Pluto`). They come straight from the flight data (`flight.origin` / `flight.destination`) and are
printed without going through i18next, so they stay English in every language. Every planet already
has a translated label in the locale bundle (`destinations.<slug>.name`, e.g.
`destinations.mars.name`), reachable from a flight's origin/destination via the existing
`getDestinationByName(...)` helper (it returns the destination whose `nameEn` matches, and its
`.name` field is the i18next key path).

## The fix — render each planet name through its existing i18next key

In the **five** files below, wherever a planet name from flight data is **displayed**, look it up and
translate it. Do **not** change any code that uses `flight.origin` / `flight.destination` /
`nameEn` for **filtering, search, or lookup** — those must stay the canonical English value.

Helper to use in each display site (import `getDestinationByName` from the destinations data module;
in a component file that is `src/components/...`, that is `../../data/destinations`; in
`src/pages/...` it is `../data/destinations`):

```tsx
// translated planet label, falling back to the raw value if the planet is unknown
const originData = getDestinationByName(flight.origin);
const label = originData ? t(originData.name) : flight.origin; // same pattern for destination
```

`t(...)` works even though these components bind a different default namespace: the key
`destinations.<slug>.name` is fully qualified and resolves via the app's `nsSeparator: '.'` (this is
exactly how `Home.tsx` / `DestinationDetail.tsx` already render `t(dest.name)`).

### The five display sites

1. **`src/components/flights/FlightCard.tsx`**
   - `destData` already exists (line ~19). Add `const originData = getDestinationByName(flight.origin);`.
   - The route header (line ~81) `{flight.origin} → {destLabel}` → render the **origin** as
     `{originData ? t(originData.name) : flight.origin}`.
   - Inside `destLabel` (lines ~26 and ~29) the visible text `{flight.destination}` → render as
     `{destData ? t(destData.name) : flight.destination}` (keep the `<Link to={...destData.slug}>`
     wrapper and the `onClick` stopPropagation exactly as they are).

2. **`src/components/bookings/BookingCard.tsx`** — line ~122 `{flight.origin} → {flight.destination}`.
3. **`src/components/bookings/BookingModal.tsx`** — line ~133 `{flight.origin} → {flight.destination}`.
4. **`src/components/bookings/HoldCard.tsx`** — line ~143 `{flight.origin} → {flight.destination}`.
5. **`src/pages/DestinationDetail.tsx`** — line ~213 `{flight.origin} → {flight.destination}`.

For files 2–5: they already have `const { t } = useTranslation('bookings')` (or `t` in
DestinationDetail); add the `getDestinationByName` import if missing, look up origin **and**
destination, and render `{originData ? t(originData.name) : flight.origin} → {destData ? t(destData.name) : flight.destination}`.

## Acceptance checks

- `npx tsc -b` and `VITE_DEMO=1 npm run build` are green.
- No remaining raw `{flight.origin}` / `{flight.destination}` in **displayed** JSX text in those five
  files (search/filter/lookup uses of those fields are unchanged and still English).
- Nothing else changes; the English UI is byte-identical (the English label for `destinations.mars.name`
  is still "Mars", etc.).
