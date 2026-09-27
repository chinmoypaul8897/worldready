# i18n Plan — Galaxium Travels (WorldReady Task 01)

**Date:** 2026-09-27  
**Scope:** Internationalize this English-only React + TypeScript app into English (`en`), French Quebec (`fr-CA`), and Arabic (`ar`, RTL) using **react-i18next** and the **`Intl`** APIs.  
**Constraint:** No product-code changes in this task — this document is the deliverable.

---

## Top-Level Overview

Galaxium Travels is a React 19 + TypeScript + Vite app with Tailwind CSS. It has 4 pages, 14 components, 1 data file with user-visible strings, and 1 formatter utility. Currently there is **no i18n runtime** — all strings are hard-coded English. The ESLint plugin (`eslint-plugin-i18next`) is already installed and configured. The work splits cleanly across five namespaces with no cross-namespace file overlap, enabling five workers to extract strings in parallel with zero merge conflicts.

---

## 1. Key Naming Convention and Namespaces

### Convention

```
<namespace>.<context>.<leafKey>
```

- **Namespace** — one of the five declared namespaces (see below).
- **Context** — the component or section name in `lowerCamelCase`. For pages this is the page name; for data it is the entity name.
- **Leaf key** — a short `lowerCamelCase` descriptor for the string. Never use the English text verbatim as a key.
- Depth is **max three levels**. Avoid nesting deeper than `namespace.context.leafKey`.
- Plural variants use the i18next convention: `_one`, `_other`; for Arabic add `_zero`, `_two`, `_few`, `_many`.
- Interpolation variables are `{{camelCase}}` (e.g. `{{count}}`, `{{name}}`).

### Five Namespaces and Worked Examples

| Namespace | Coverage | Worked example |
|---|---|---|
| `pages` | `src/pages/` | `pages.home.heroTitle` → `"Journey Beyond The Stars"` |
| `flights` | `src/components/flights/` | `flights.flightCard.seatEconomy` → `"Economy"` |
| `bookings` | `src/components/bookings/` | `bookings.bookingModal.confirmButton` → `"Confirm Booking"` |
| `common` | `src/components/layout/`, `src/components/common/`, `src/components/user/` | `common.header.navFlights` → `"Flights"` |
| `destinations` | `src/data/destinations.ts` | `destinations.earth.tagline` → `"The cradle of humanity…"` |

#### Extended key examples by namespace

**`pages`**
```
pages.home.heroTitle
pages.home.heroSubtitle
pages.home.exploreFlightsButton
pages.home.featuresHeading
pages.home.ctaHeading
pages.home.ctaButton
pages.flights.pageHeading
pages.flights.noResultsMessage
pages.myBookings.pageHeading
pages.myBookings.emptyState
pages.destinationDetail.factsHeading
pages.destinationDetail.hazardsHeading
```

**`flights`**
```
flights.flightCard.seatEconomy
flights.flightCard.seatBusiness
flights.flightCard.seatGalaxium
flights.flightCard.seatsAvailable_one
flights.flightCard.seatsAvailable_other
flights.flightCard.bookButton
flights.flightCard.duration
flights.flightFilters.originLabel
flights.flightFilters.destinationLabel
flights.flightFilters.priceLabel
flights.flightFilters.applyButton
```

**`bookings`**
```
bookings.bookingModal.stepSelectClass
bookings.bookingModal.stepQuote
bookings.bookingModal.stepHold
bookings.bookingModal.confirmButton
bookings.bookingModal.releaseButton
bookings.bookingCard.status
bookings.bookingCard.cancelButton
bookings.holdCard.expiresIn
bookings.holdCard.confirmButton
```

**`common`**
```
common.header.brand
common.header.navHome
common.header.navFlights
common.header.navMyBookings
common.header.loginButton
common.header.logoutButton
common.footer.copyright
common.modal.closeButton
common.spinner.loading
common.user.signInHeading
common.user.registerHeading
common.user.emailLabel
common.user.nameLabel
```

**`destinations`**
```
destinations.earth.name
destinations.earth.tagline
destinations.earth.description
destinations.mars.name
destinations.mars.tagline
...
destinations.europa.name        (fr: "Europe" — see glossary note)
destinations.pluto.tagline
```

---

## 2. File-Ownership Map — 5 Parallel Workers

Each worker owns exactly one namespace JSON file. No source file is touched by more than one worker.

### Translation file paths

```
public/locales/
  en/
    pages.json
    flights.json
    bookings.json
    common.json
    destinations.json
  fr-CA/
    pages.json
    flights.json
    bookings.json
    common.json
    destinations.json
  ar/
    pages.json
    flights.json
    bookings.json
    common.json
    destinations.json
```

### Worker assignments

| Worker | Namespace JSON | Source files to extract from |
|---|---|---|
| **1** | `pages` | `src/pages/Home.tsx`, `src/pages/Flights.tsx`, `src/pages/MyBookings.tsx`, `src/pages/DestinationDetail.tsx` |
| **2** | `flights` | `src/components/flights/FlightCard.tsx`, `src/components/flights/FlightFilters.tsx` |
| **3** | `bookings` | `src/components/bookings/BookingCard.tsx`, `src/components/bookings/BookingModal.tsx`, `src/components/bookings/HoldCard.tsx` |
| **4** | `common` | `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/Layout.tsx`, `src/components/common/Button.tsx`, `src/components/common/Card.tsx`, `src/components/common/Input.tsx`, `src/components/common/Modal.tsx`, `src/components/common/LoadingSpinner.tsx`, `src/components/common/Starfield.tsx`, `src/components/common/index.ts`, `src/components/user/UserIdentification.tsx` |
| **5** | `destinations` | `src/data/destinations.ts` |

### Notes on Worker 4

`Layout.tsx` itself has no user-visible strings but wraps Header/Footer — no extraction needed from it. `Button.tsx`, `Card.tsx`, `Starfield.tsx` have no translatable strings. Worker 4 focuses on `Header.tsx`, `Footer.tsx`, `Modal.tsx` ("Close"), `LoadingSpinner.tsx` ("Loading…"), and `UserIdentification.tsx`.

### Notes on Worker 5

`destinations.ts` contains 7 destination objects with English `name`, `tagline`, `description`, `facts` (object with labels as keys and string values), and `hazards` (string array). Worker 5 creates keys for all translatable string fields. **Data rule:** `slug` values (`earth`, `mars`, `moon`, `venus`, `jupiter`, `europa`, `pluto`) are **never translated** — they are used as URL route params (e.g. `/destinations/europa`) and as filter values passed to the flights API. Only the visible label keys (`destinations.*.name`, `destinations.*.tagline`, etc.) are localized.

### Glossary compliance (all workers)

The following terms are **do-not-translate** per the glossary (`Do not translate = YES`) and must appear verbatim in all locale JSON files:

| Term | Rule |
|---|---|
| `Galaxium` | Keep Latin script in every language including Arabic. |
| `Galaxium Travels` | App/company name — verbatim in all locales. |
| `Galaxium Class` | Premium seat class brand term — not translated. |
| `WorldReady` | Product name — not translated. |
| `Bob` | IBM Bob — not translated. |

Planet names have `Do not translate = LABEL ONLY`: translate only the displayed label; the underlying slug/data value stays English. Example: the destination card for Europa displays `"Europe"` in fr-CA (see glossary row 32 note re: disambiguation from the continent) and `"أوروبا"` in Arabic, but the route remains `/destinations/europa` and all API filter values remain `"Europa"`.

---

## 3. i18next Runtime Setup

### `src/i18n/index.ts`

Initialize i18next with:

- **Languages:** `['en', 'fr-CA', 'ar']`
- **Namespaces:** `['pages', 'flights', 'bookings', 'common', 'destinations']`
- **Default namespace:** `'common'`
- **Fallback language:** `'en'`
- **Detection:** `i18next-browser-languagedetector` — check `localStorage('i18nextLng')` first, then `navigator.language`, fall back to `en`.
- **Backend:** `i18next-http-backend` — load from `public/locales/{{lng}}/{{ns}}.json`.
- **Interpolation:** `escapeValue: false` (React already escapes).
- **Plural separator:** `_` (default i18next convention).

```ts
// Conceptual init shape — not implementation code
i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'fr-CA', 'ar'],
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['pages', 'flights', 'bookings', 'common', 'destinations'],
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    interpolation: { escapeValue: false },
    returnNull: false,
  });
```

### Wiring in `src/main.tsx`

Import `src/i18n/index.ts` **before** rendering `<App />`. Because `i18next.init()` is async, wrap the render in the `i18next.init` promise (or use `React.Suspense` with `useSuspense: true` in i18next config). The recommended pattern is:

```ts
// main.tsx — conceptual
import './i18n';           // side-effect import; triggers init
import App from './App';   // rendered inside <React.Suspense>
```

`App.tsx` wraps children in `<React.Suspense fallback={<LoadingSpinner />}>` so the app waits for the first locale bundle before painting.

### `LanguageSwitcher` component

New file: `src/components/common/LanguageSwitcher.tsx`

- Reads `i18n.language` and `i18n.changeLanguage` from `useTranslation()`.
- Renders three buttons/options: `EN`, `FR`, `AR`.
- On language change: calls `i18n.changeLanguage(lang)`, then sets `document.documentElement.lang = lang` and `document.documentElement.dir = i18n.dir()` (i18next provides `.dir()` based on language RTL data).
- Placed in `Header.tsx` (Worker 4 concern).
- Export from `src/components/common/index.ts`.

---

## 4. The `Intl` Approach

All number, currency, date, and relative-time formatting is centralized in `src/utils/formatters.ts`. Each formatter accepts a `locale: string` parameter (defaulting to `i18n.language`). **No raw `Intl` calls outside this file.**

### Functions to update

| Function | Current behavior | i18n-aware behavior |
|---|---|---|
| `formatCurrency(amount, locale)` | Hard-codes `en-US` / USD | `fr-CA` → CAD (style guide §1); `ar` → USD with `numberingSystem: 'latn'`; `en` → USD. Use `Intl.NumberFormat(locale, { style:'currency', currency, numberingSystem })`. |
| `formatDate(dateString, locale)` | Hard-codes `MMM dd, yyyy HH:mm` in English | Use `date-fns/format` with the matching locale object: `enUS` for `en`, `frCA` for `fr-CA`, `arSA` for `ar`. fr-CA: day-month-year, 24h clock. |
| `formatDateShort(dateString, locale)` | English abbreviations | Same locale switching as `formatDate`. |
| `formatTime(dateString, locale)` | English AM/PM | 24-hour for fr-CA; Arabic uses `Intl.DateTimeFormat` with `hour12:false` and `'latn'` numbering. |
| `getRelativeTime(dateString, locale)` | Hard-coded `"minutes ago"` strings | Replace with `Intl.RelativeTimeFormat(locale, { numeric:'auto' })`. |
| `calculateDuration(dep, arr, locale)` | Hard-codes `"h"`, `"m"` suffix strings | These unit labels are translatable; move `"h"`/`"m"` strings to `common.formatters.hours`/`common.formatters.minutes` or use `Intl.DurationFormat` if available, otherwise `t('common.formatters.hoursMinutes', {h, m})`. |

### Currency per locale (from glossary + style guide)

| Locale | Currency | Example output |
|---|---|---|
| `en` | USD | `$1,200` |
| `fr-CA` | CAD | `1 200,00 $ CA` |
| `ar` | USD | `1,200 USD` (Western digits; `numberingSystem:'latn'`) |

### date-fns locale imports

```ts
import { enUS } from 'date-fns/locale/en-US';
import { frCA } from 'date-fns/locale/fr-CA';
import { arSA } from 'date-fns/locale/ar-SA';

const dateFnsLocales: Record<string, Locale> = { en: enUS, 'fr-CA': frCA, ar: arSA };
```

---

## 5. The RTL Approach

### `<html lang dir>` management

On every language change, update `document.documentElement`:

```ts
document.documentElement.lang = lang;         // e.g. 'ar'
document.documentElement.dir = i18n.dir();    // 'rtl' or 'ltr'
```

This is done in `LanguageSwitcher` and also on initial mount (in `src/i18n/index.ts` init callback) so a page reload with a persisted Arabic preference sets direction correctly before React hydrates.

### Tailwind logical utilities

Replace all **physical** directional Tailwind classes with **logical** equivalents. No `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right` in any component that holds user-facing content.

| Physical (remove) | Logical (use) |
|---|---|
| `ml-*` | `ms-*` (margin-inline-start) |
| `mr-*` | `me-*` (margin-inline-end) |
| `pl-*` | `ps-*` (padding-inline-start) |
| `pr-*` | `pe-*` (padding-inline-end) |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `left-0` (absolute/fixed) | `start-0` |
| `right-0` (absolute/fixed) | `end-0` |

`Header.tsx` uses `left-0 right-0` on the fixed bar — replace with `inset-x-0` (already logical) or `start-0 end-0`.

### Mirrored directional icons

From the style guide: directional icons (arrows, chevrons, progress indicators) must flip in RTL. Non-directional icons (Rocket, User, Clock, Globe, Shield, Zap, Crown) stay as-is.

Apply `rtl:scale-x-[-1]` (Tailwind RTL variant) to every icon that indicates direction:
- `ArrowLeft` / `ArrowRight` (navigation, back buttons)
- `ChevronLeft` / `ChevronRight` (carousels, dropdowns)
- Any progress/stepper arrows in `BookingModal.tsx`

Non-directional icons confirmed safe (no flip needed): `Rocket`, `Globe`, `Shield`, `Zap`, `Crown`, `Plane`, `Star`, `Clock`, `User`.

### No string concatenation

Per the style guide engineering rules, **never concatenate translated fragments**. Every pluralized or interpolated string must use a single i18next key with `{{count}}` or `{{name}}` placeholders. Arabic requires all six plural forms: `_zero`, `_one`, `_two`, `_few`, `_many`, `_other`.

---

## 6. The Data Rule — Filter Keys vs. Display Labels

> **Rule:** Any value used as a **filter key, URL route segment, or API query parameter keeps its English value.** Only the visible display label is translated. The lookup path is: English slug/id → translation key → localized label.

### Planet name example

In `src/data/destinations.ts`:
- `slug: 'europa'` — **never translated** — used in `/destinations/europa` route and passed to `getFlights({ destination: 'Europa' })`.
- `name: 'Europa'` — the _current_ English value used as a display string. After i18n this field is replaced by a translation lookup: `t('destinations.europa.name')` which returns `"Europe"` in fr-CA (per glossary: add disambiguation context in the translator spreadsheet), `"أوروبا"` in Arabic, `"Europa"` in English.

### Implementation pattern

```tsx
// DestinationDetail.tsx — conceptual (Worker 1 + Worker 5)
const { slug } = useParams();                       // 'europa' — stable English value
const dest = getDestinationBySlug(slug);            // looks up by English slug
const label = t(`destinations.${slug}.name`);       // localized display name
```

```tsx
// FlightFilters.tsx — conceptual (Worker 2)
// The option VALUE sent to the API remains English:
<option value="Europa">{t('destinations.europa.name')}</option>
```

This applies to all 7 planet slugs: `earth`, `mars`, `moon`, `venus`, `jupiter`, `europa`, `pluto`. It also applies to seat class values: `'economy'`, `'business'`, `'galaxium'` are the API/type values; only the display labels are translated (and `'Galaxium Class'` is a brand term — kept verbatim per glossary).

---

## Sub-Tasks

### Sub-task 1 — Install packages and scaffold i18n init
**Intent:** Add react-i18next runtime dependencies and create the i18n init module.  
**Expected Outcomes:** `react-i18next`, `i18next`, `i18next-browser-languagedetector`, `i18next-http-backend` are in `package.json`; `src/i18n/index.ts` exists and initializes i18next correctly; `src/main.tsx` imports it; `src/App.tsx` wraps routes in `<Suspense>`.  
**Todo List:**
- [ ] `npm install react-i18next i18next i18next-browser-languagedetector i18next-http-backend`
- [ ] Create `src/i18n/index.ts` with init (three languages, five namespaces, fallback `en`, HTTP backend, language detector)
- [ ] Add `import './i18n'` to `src/main.tsx` before App render
- [ ] Wrap `<Routes>` in `<React.Suspense>` in `src/App.tsx`
**Relevant Context:** `src/main.tsx`, `src/App.tsx`, `src/components/common/LoadingSpinner.tsx`  
**Status:** `[ ] pending`

---

### Sub-task 2 — Create `public/locales/` scaffold and English source strings (Worker 1: `pages`)
**Intent:** Extract all hard-coded strings from `src/pages/` into `public/locales/en/pages.json` and replace with `useTranslation('pages')` calls.  
**Expected Outcomes:** `public/locales/en/pages.json` has all page strings; all four page components use `t()` with `pages.*` keys; fr-CA and ar JSON files are stubbed with English values (to be translated).  
**Todo List:**
- [ ] Create `public/locales/en/pages.json` (all keys for Home, Flights, MyBookings, DestinationDetail)
- [ ] Replace hard-coded strings in `src/pages/Home.tsx`
- [ ] Replace hard-coded strings in `src/pages/Flights.tsx`
- [ ] Replace hard-coded strings in `src/pages/MyBookings.tsx`
- [ ] Replace hard-coded strings in `src/pages/DestinationDetail.tsx`
- [ ] Stub `public/locales/fr-CA/pages.json` and `public/locales/ar/pages.json`
**Relevant Context:** Pages files listed in Worker 1 row above.  
**Status:** `[ ] pending`

---

### Sub-task 3 — Worker 2: `flights` namespace
**Intent:** Extract strings from `src/components/flights/` into `public/locales/en/flights.json`.  
**Expected Outcomes:** `FlightCard.tsx` and `FlightFilters.tsx` use `useTranslation('flights')`; seat class display names are translated but values (`'economy'`, `'business'`, `'galaxium'`) remain English; `<option value="Mars">` pattern follows the data rule.  
**Todo List:**
- [ ] Create `public/locales/en/flights.json`
- [ ] Replace hard-coded strings in `FlightCard.tsx` (seat class names, "Book", seat count plurals)
- [ ] Replace hard-coded strings in `FlightFilters.tsx` (filter labels, apply button, planet option labels)
- [ ] Stub fr-CA and ar JSON files
**Relevant Context:** `src/components/flights/FlightCard.tsx`, `src/components/flights/FlightFilters.tsx`, `src/types/index.ts` (SeatClass type)  
**Status:** `[ ] pending`

---

### Sub-task 4 — Worker 3: `bookings` namespace
**Intent:** Extract strings from `src/components/bookings/` into `public/locales/en/bookings.json`.  
**Expected Outcomes:** All three booking components use `useTranslation('bookings')`; hold countdown display (`{{minutes}}:{{seconds}}`) uses i18next interpolation; step labels and action buttons translated.  
**Todo List:**
- [ ] Create `public/locales/en/bookings.json`
- [ ] Replace hard-coded strings in `BookingCard.tsx`
- [ ] Replace hard-coded strings in `BookingModal.tsx`
- [ ] Replace hard-coded strings in `HoldCard.tsx`
- [ ] Stub fr-CA and ar JSON files
**Relevant Context:** `src/components/bookings/`, `src/utils/formatters.ts`  
**Status:** `[ ] pending`

---

### Sub-task 5 — Worker 4: `common` namespace + `LanguageSwitcher`
**Intent:** Extract strings from layout, common UI, and user components; add `LanguageSwitcher`.  
**Expected Outcomes:** `Header.tsx`, `Footer.tsx`, `Modal.tsx`, `LoadingSpinner.tsx`, `UserIdentification.tsx` use `useTranslation('common')`; `LanguageSwitcher` component exists, changes language and updates `<html lang dir>`; `common.header.brand` value is `"Galaxium Travels"` verbatim in all locales.  
**Todo List:**
- [ ] Create `public/locales/en/common.json`
- [ ] Replace hard-coded strings in `Header.tsx`, `Footer.tsx`, `Modal.tsx`, `LoadingSpinner.tsx`, `UserIdentification.tsx`
- [ ] Create `src/components/common/LanguageSwitcher.tsx`
- [ ] Export `LanguageSwitcher` from `src/components/common/index.ts`
- [ ] Add `<LanguageSwitcher />` to `Header.tsx`
- [ ] Stub fr-CA and ar JSON files
**Relevant Context:** Layout and common component files listed in Worker 4 row above.  
**Status:** `[ ] pending`

---

### Sub-task 6 — Worker 5: `destinations` namespace
**Intent:** Extract all destination content strings from `src/data/destinations.ts` into `public/locales/en/destinations.json`; update lookup components to use translation keys.  
**Expected Outcomes:** `destinations.ts` retains stable `slug` values; `name`, `tagline`, `description`, `facts.*`, `hazards[]` values are moved to locale JSON; `DestinationDetail.tsx` and `Home.tsx` use `t('destinations.${slug}.*')` for display labels; planet option values in `FlightFilters.tsx` remain English strings.  
**Todo List:**
- [ ] Create `public/locales/en/destinations.json` (7 destinations × all translatable fields)
- [ ] Stub fr-CA and ar JSON files (translations to be filled by translator)
- [ ] Update `src/data/destinations.ts` — remove translatable string fields (or mark as English-only source), keep slug, accent colors, gallery colorClass
- [ ] Update callers in `Home.tsx` and `DestinationDetail.tsx` to use `t()` for planet labels
**Relevant Context:** `src/data/destinations.ts`, `src/pages/Home.tsx`, `src/pages/DestinationDetail.tsx`  
**Status:** `[ ] pending`

---

### Sub-task 7 — Update `src/utils/formatters.ts` for locale-aware `Intl`
**Intent:** Replace all hard-coded locale and currency assumptions with locale-aware `Intl` calls keyed to the active i18n language.  
**Expected Outcomes:** All formatter functions accept an optional `locale` param (default `i18n.language`); currency uses CAD for fr-CA, USD for en/ar; Arabic uses `numberingSystem:'latn'`; relative time uses `Intl.RelativeTimeFormat`; date-fns locale objects switch per language; `"h"`/`"m"` unit strings use translation keys.  
**Todo List:**
- [ ] Add `locale` param to all formatter functions
- [ ] Implement locale → currency map (`en`→USD, `fr-CA`→CAD, `ar`→USD)
- [ ] Import `frCA` and `arSA` from `date-fns/locale`
- [ ] Replace hard-coded `"minutes ago"` / `"hours ago"` strings with `Intl.RelativeTimeFormat`
- [ ] Replace hard-coded `"h"`/`"m"` unit strings with i18next keys in `common` namespace
- [ ] Update all callers that pass no locale to pick up `i18n.language` automatically
**Relevant Context:** `src/utils/formatters.ts`  
**Status:** `[ ] pending`

---

### Sub-task 8 — RTL: Tailwind logical utilities audit + icon flip
**Intent:** Ensure all directional Tailwind classes are logical and directional icons flip in RTL.  
**Expected Outcomes:** No physical directional Tailwind classes (`ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `text-right`, `left-*`, `right-*`) in any user-visible component; directional icons carry `rtl:scale-x-[-1]`; `<html dir>` is set on init and on every language change.  
**Todo List:**
- [ ] Audit all components for physical directional Tailwind classes and replace with logical equivalents
- [ ] Add `rtl:scale-x-[-1]` to `ArrowLeft`/`ArrowRight`/`ChevronLeft`/`ChevronRight` usages
- [ ] Confirm `document.documentElement.dir` is set in `LanguageSwitcher` and on `i18n` init
- [ ] Verify `Header.tsx` `left-0 right-0` → `inset-x-0` (or `start-0 end-0`)
**Relevant Context:** All component files; `tailwind.config.js`  
**Status:** `[ ] pending`

---

### Sub-task 9 — Translation files: French (fr-CA) and Arabic (ar)
**Intent:** Populate the fr-CA and ar locale JSON files for all five namespaces using glossary terms and style-guide rules.  
**Expected Outcomes:** All five namespaces have complete fr-CA and ar JSON files; glossary do-not-translate terms appear verbatim; planet labels are translated but slug values are unchanged; Arabic plural keys include all six forms (`_zero`, `_one`, `_two`, `_few`, `_many`, `_other`); fr-CA currency is CAD; Arabic uses Western digits.  
**Todo List:**
- [ ] Populate `public/locales/fr-CA/*.json` for all five namespaces
- [ ] Populate `public/locales/ar/*.json` for all five namespaces
- [ ] Verify brand terms (`Galaxium`, `Galaxium Travels`, `Galaxium Class`) are verbatim in all locales
- [ ] Verify planet slugs are English in data; only labels are translated
- [ ] Add all six Arabic plural forms for every countable string
- [ ] Run `scripts/key-parity.mjs` and `scripts/english-parity.mjs` to validate
**Relevant Context:** `docs/glossary.xlsx`, `docs/style-guide.pdf`, `scripts/key-parity.mjs`, `scripts/english-parity.mjs`  
**Status:** `[ ] pending`

---

## Acceptance Checklist

- [ ] `plans/i18n-plan.md` exists and covers all six specification points.
- [ ] Ownership map assigns every worker exactly one namespace and lists real files (verified against actual `src/` tree from Explore pass).
- [ ] Plan references glossary do-not-translate brand terms (`Galaxium`, `Galaxium Travels`, `Galaxium Class`, `WorldReady`, `Bob`).
- [ ] Plan documents the planet label-vs-value rule (section 6 + Worker 5 notes).
- [ ] `Europa` → `"Europe"` in fr-CA disambiguation noted (glossary row 32).
- [ ] fr-CA currency is CAD; Arabic uses `numberingSystem:'latn'`; en uses USD.
- [ ] RTL approach covers `<html dir>`, logical Tailwind utilities, and mirrored directional icons.
- [ ] No product-code changes made in this task.
