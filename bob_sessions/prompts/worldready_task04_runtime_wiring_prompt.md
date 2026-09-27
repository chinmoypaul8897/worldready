# WorldReady — Task 04: i18n runtime wiring (runs in parallel with Task 03)

- **Mode:** Agent
- **Date:** 2026-09-27
- **Bobcoin budget:** 1.0 (stop and tell me if you would exceed it)

You are wiring up the i18next runtime **while a separate task extracts strings into
`src/locales/en/*.json` at the same time.** Touch only the files listed here. Follow
`plans/i18n-plan.md` §3–§5 for intent, but use the concrete overrides below (they win).

## 1. Install packages (use npm, do not hand-edit package.json)

```
npm install react-i18next i18next i18next-browser-languagedetector
```

Do **not** install `i18next-http-backend` — locales are bundled from `src/locales`.

## 2. Create `src/i18n/index.ts`

- Import `i18next`, `initReactI18next` (from `react-i18next`), and `LanguageDetector`
  (from `i18next-browser-languagedetector`).
- Build the `resources` object **from bundled JSON using Vite's glob** so it works no matter
  which namespace files exist yet:
  ```ts
  const mods = import.meta.glob('../locales/*/*.json', { eager: true });
  const resources: Record<string, Record<string, unknown>> = {};
  for (const p in mods) {
    const m = p.match(/\.\.\/locales\/([^/]+)\/([^/]+)\.json$/);
    if (!m) continue;
    const [, lng, ns] = m;
    (resources[lng] ??= {})[ns] = (mods[p] as { default: unknown }).default;
  }
  ```
- Init **synchronously** (resources are in memory, so no async backend and **no Suspense**):
  ```ts
  i18next.use(LanguageDetector).use(initReactI18next).init({
    resources,
    supportedLngs: ['en', 'fr', 'ar', 'pseudo'],
    fallbackLng: 'en',
    ns: ['pages', 'flights', 'bookings', 'common', 'destinations'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnNull: false,
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  });
  ```
- Apply direction on load and on every change:
  ```ts
  const applyDir = (lng: string) => {
    document.documentElement.lang = lng;
    document.documentElement.dir = i18next.dir(lng); // 'rtl' for ar, else 'ltr'
  };
  applyDir(i18next.language || 'en');
  i18next.on('languageChanged', applyDir);
  ```
- `export default i18next;`

## 3. Wire it into `src/main.tsx`

Add `import './i18n';` **before** the `App` import / render. Change nothing else in the file.

## 4. Create `src/components/common/LanguageSwitcher.tsx`

- A small component using `useTranslation()`; renders buttons **EN / FR / AR** (and, if
  trivial, a `عربي`/`pseudo` is not required). On click: `i18n.changeLanguage(code)` with
  codes `'en' | 'fr' | 'ar'`. Highlight the active language.
- `export default LanguageSwitcher;` (a named export is fine too).
- **Do NOT edit `src/components/common/index.ts` or `Header.tsx`** — a later task places the
  switcher into the header. Just create the standalone file.

## 5. Make `src/utils/formatters.ts` locale-aware

Key every formatter to the active language via `i18next.language`, with an optional
`locale?: string` last parameter that defaults to it. Use `Intl.NumberFormat`,
`Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`, and date-fns locale objects
(`enUS`, `frCA`, `arSA` from `date-fns/locale`) mapped by language:
`en → en-US / USD`, `fr → fr-CA / CAD`, `ar → ar / USD with numberingSystem 'latn'`,
`pseudo → en-US`.

**CRITICAL — English parity is checked byte-for-byte.** The output for language `en` must be
**identical** to the current implementation for every function (same currency format, same
date format string `MMM dd, yyyy HH:mm`, same relative-time wording, same `Hh Mm` duration).
If switching an `en` code path to `Intl` would change even one English character, keep the
existing English code path for `en` and branch to the new locale behaviour only for
`fr`/`ar`/`pseudo`. Keep every existing call site working (parameters stay optional).

## Hard boundaries

- **Only** create/edit: `src/i18n/index.ts`, `src/main.tsx`,
  `src/components/common/LanguageSwitcher.tsx`, `src/utils/formatters.ts`, and
  `package.json`/`package-lock.json` **via `npm install` only**.
- **Do NOT touch** any file the extraction task owns: everything under `src/pages`,
  `src/components/flights`, `src/components/bookings`, `src/components/layout`,
  `src/components/user`, `src/data/**`, `src/locales/**`, and
  `src/components/common/index.ts`.
- **Do NOT touch** `scripts/**`, `src/services/api.ts`, `src/services/demoApi.ts`,
  `vite.config.ts`, `.github/**`, `docs/**`, `evidence/**`, `App.tsx`.
- Do not run the production build and do not commit — a later merge step builds and commits.

When done, list the files you changed and confirm English formatter output is unchanged.
Push back directly if any of this is wrong.
