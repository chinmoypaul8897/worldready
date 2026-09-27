# WorldReady — Task 07: translator read-back (apply the human reviewer's edits)

- **Mode:** 🌍 i18n Extractor
- **Date:** 2026-09-27
- **Bobcoin budget:** 0.6 (stop and tell me if you would exceed it)

A human reviewer has edited the translator round-trip sheet you wrote in Task 06.
Read **@docs/translator.xlsx** (sheet `translator`; columns: `key`, `namespace`, `English`,
`French draft`, `Arabic draft`, `max length`, `context`, `reviewer note`). Rows the reviewer
touched have a `reviewer note` starting with `REVIEWED (human)` and are highlighted.

## Do this

1. For every row whose `reviewer note` starts with `REVIEWED (human)`, compare the sheet's
   `French draft` with `src/locales/fr/<namespace>.json` and the `Arabic draft` with
   `src/locales/ar/<namespace>.json` at that key (the `key` column does not repeat the namespace;
   nested keys use dots, e.g. `features.business.extraLegroom`).
2. Where the sheet differs from the JSON, **apply the sheet's value** to the JSON. An empty cell
   means the value must become the empty string `""` (keep the key; do not delete it).
3. Change nothing else: no other keys, no English, no `pseudo`, no code files.
4. Keep the glossary rules: brand terms such as `Galaxium` stay untranslated; `{{placeholders}}`
   stay intact.

## Acceptance

- Report a table: namespace · key · language · old value → new value, and a line
  **"N/N reviewer edits applied"** (N = the number of cells where the sheet differed).
- Rows whose note says "no change" need no edit; list them as "approved, unchanged".
- Do not run the build and do not commit. I verify the JSON, key parity and the build afterwards.

Push back directly if any of this is wrong.
