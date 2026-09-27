# Task 10 (hook demo, phase 2) — internationalize the badge, then commit succeeds

Now fix it properly so the gate lets the commit through.

1. In `src/components/layout/Header.tsx`, replace the hard-coded `New!` with `{t('common.header.newBadge')}` (the `common` namespace, key path `header.newBadge`). Keep the logical spacing class (`ms-2`).
2. Add the key `header.newBadge` to **ALL FOUR** locales so key parity stays green:
   - `src/locales/en/common.json` → `"newBadge": "New!"`
   - `src/locales/fr/common.json` → a French value (e.g. `"Nouveau !"`)
   - `src/locales/ar/common.json` → an Arabic value (e.g. `"جديد"`)
   - `src/locales/pseudo/common.json` → a bracketed pseudo value (e.g. `"⟦Ñéŵ!⟧"`)
   Add it inside each file's existing `header` object.
3. Stage the code + the four locale files and commit:
   `git add src/components/layout/Header.tsx src/locales/en/common.json src/locales/fr/common.json src/locales/ar/common.json src/locales/pseudo/common.json`
   then `git commit -m "Add internationalized New! badge to header"`.
4. The gate should now **ALLOW** the commit (0 hard-coded strings staged; key parity intact). Report the result and the commit hash.

Do NOT run `npm run build` or the counters yourself — I verify those.
