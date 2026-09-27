# WorldReady — Task 06: French (Quebec) + Arabic translations + translator.xlsx

**Mode:** Agent · **Date:** 2026-09-27 · **Bobcoin budget for this task: 2.5** (push back directly if this is wrong).

You are localizing the Galaxium Travels app that you already extracted into i18next keys.
English lives in `src/locales/en/{pages,flights,bookings,common,destinations}.json` (348 keys).
Your job: produce **French (Quebec, fr-CA)** and **Arabic (ar)** for **every** key, and write a
translator round-trip spreadsheet.

First **read** these for terminology and rules (use your document-understanding to open the Office/PDF files):
`docs/glossary.xlsx`, `docs/style-guide.pdf`, and every file in `src/locales/en/`.
(The glossary and the essential rules are also copied below so you never guess.)

## What to create

1. **`src/locales/fr/pages.json`, `fr/flights.json`, `fr/bookings.json`, `fr/common.json`, `fr/destinations.json`**
   and the same five files under **`src/locales/ar/`**.
   - **Identical structure and key names to `en`** — same nesting, same top-level context objects, no
     namespace wrapper (the app resolves `<ns>.<path>` with the namespace = the JSON file name). Translate
     **values only**. Do not rename, add, or drop any key (except the plural expansion in rule 5).
   - Do **not** edit `src/locales/en/**` (it is the reference), `src/data/**`, `src/services/**`,
     `scripts/**`, `vite.config.ts`, or anything under `.github/` or `evidence/`. Only create the fr/ and
     ar/ JSON files and the spreadsheet in rule 6.

2. **Keep every `{{placeholder}}` byte-for-byte** — `{{count}}`, `{{name}}`, `{{id}}`, `{{date}}`,
   `{{ref}}`, `{{year}}`, `{{attempt}}`, `{{max}}`, `{{timer}}`, `{{slug}}`, `{{duration}}`. Never
   translate or reorder the text *inside* the braces. Also keep any tag markers such as the `<1>…</1>`
   in `pages.destination.notFoundBody`.

3. **Glossary compliance (both languages):**
   - **Never translate or transliterate** the brand terms — keep them verbatim in **Latin script even
     in Arabic**: `Galaxium`, `Galaxium Travels`, `Galaxium Class`, `WorldReady`, `Bob`.
   - Translate all "NO" terms normally.
   - **Planet display labels** (the `name` field and any label text in `destinations.json`) **do** get
     translated (e.g. Earth→Terre/الأرض, Mars→Mars/المريخ, Europa→Europe/أوروبا). The English *filter/URL
     value* is stored elsewhere (`src/data/destinations.ts`, which you must NOT touch), so translating the
     label here is correct and safe.

4. **French = Quebec French (fr-CA):** use **vous**; **courriel** (never "e-mail"/"mail"); **CAD** context
   for prices; **place** (not "siège") for seat availability counts; **se connecter** for the sign-in verb
   (not the noun "connexion"); **réservation temporaire** for *hold* (never "prise"/"blocage");
   **s'inscrire** for register; **devis** for quote. Follow the glossary column "French (fr-CA)".

5. **Plurals — this is the only structural change from `en`.** The **only** pluralized key in `en` is in
   `pages.json` under `flights`: `showingCount_one` / `showingCount_other`
   ("Showing {{count}} flight" / "Showing {{count}} flights"). Provide the plural forms each language needs:
   - **fr/pages.json** `flights`: `showingCount_one`, `showingCount_many`, `showingCount_other`
     (French needs one/many/other; `_many` may reuse the `_other` wording).
   - **ar/pages.json** `flights`: **all six** — `showingCount_zero`, `showingCount_one`, `showingCount_two`,
     `showingCount_few`, `showingCount_many`, `showingCount_other` — each grammatically correct Arabic for
     that count band, `{{count}}` kept.
   - **Every other key stays a single key with the exact `en` name** — in particular do **not** add plural
     suffixes to `seatsLeft` (flights & bookings), `pendingHolds`, `activeBookings`, `pastBookings`, etc.

6. **Write `docs/translator.xlsx`** — a real Office spreadsheet (this is your Office-write capability).
   One sheet, a header row, then **one row per English key = 348 data rows**. Columns:
   `key` (dotted path, e.g. `flights.showingCount_one`) · `namespace` (pages/flights/bookings/common/destinations) ·
   `English` · `French draft` · `Arabic draft` · `max length` (character budget — use the longest of the
   three strings, rounded up) · `context` (which screen/element uses it) · `reviewer note` (any term a human
   reviewer should double-check, e.g. Quebec-specific wording or an ambiguous label).
   For the plural keys, add one row per plural form actually present in each language (they share the same
   `key` base with the suffix). Keep `Galaxium` untranslated in every row.
   **If you have no library to write .xlsx**, instead write `docs/translator.csv` (UTF-8, same columns) and
   say so in your final message — do not stop.

## Acceptance checks (state each in your final message)
- `src/locales/fr/*.json` and `src/locales/ar/*.json` exist for all 5 namespaces, valid JSON, same keys as en.
- Arabic `pages.flights` has all 6 `showingCount_*` forms; French has one/many/other.
- Every `{{placeholder}}` preserved; brand terms verbatim (incl. Latin `Galaxium` inside Arabic).
- `docs/translator.xlsx` (or `.csv`) written with 348+ data rows.

Do the whole task yourself in this one task — **do not spawn subagents** (keep the cost predictable).

---

## Glossary (copied from docs/glossary.xlsx — authoritative)

| English | French (fr-CA) | Arabic (ar) | Do-not-translate | Note |
|---|---|---|---|---|
| Galaxium | Galaxium | Galaxium | YES | Brand; Latin script even in Arabic |
| Galaxium Travels | Galaxium Travels | Galaxium Travels | YES | App name / header brand |
| Galaxium Class | Galaxium Class | Galaxium Class | YES | Premium seat class; keep English |
| WorldReady | WorldReady | WorldReady | YES | Product name |
| Bob | Bob | Bob | YES | IBM Bob |
| flight | vol | رحلة | NO | |
| booking | réservation | حجز | NO | |
| hold | réservation temporaire | حجز مؤقت | NO | not "prise"/"blocage" |
| quote | devis | عرض سعر | NO | |
| seat | place | مقعد | NO | prefer "place" for availability counts |
| destination | destination | وجهة | NO | |
| origin | origine | المنشأ | NO | |
| departure | départ | المغادرة | NO | |
| arrival | arrivée | الوصول | NO | |
| economy | économique | الدرجة الاقتصادية | NO | seat class |
| business | affaires | درجة رجال الأعمال | NO | "Classe affaires" |
| passenger | passager | مسافر | NO | |
| cancel | annuler | إلغاء | NO | |
| confirm | confirmer | تأكيد | NO | |
| release | libérer | إلغاء الحجز المؤقت | NO | release a hold |
| sign in | se connecter | تسجيل الدخول | NO | verb, not "connexion" |
| register | s'inscrire | إنشاء حساب | NO | |
| price | prix | السعر | NO | CAD in fr-CA |
| email | courriel | البريد الإلكتروني | NO | Quebec: "courriel", not "e-mail" |
| spaceport | astroport | ميناء فضائي | NO | |
| Earth | Terre | الأرض | LABEL ONLY | translate label; keep "Earth" as value |
| Mars | Mars | المريخ | LABEL ONLY | keep "Mars" as value |
| Moon | Lune | القمر | LABEL ONLY | keep "Moon" as value |
| Venus | Vénus | الزهرة | LABEL ONLY | keep "Venus" as value |
| Jupiter | Jupiter | المشتري | LABEL ONLY | keep "Jupiter" as value |
| Europa | Europe | أوروبا | LABEL ONLY | moon; fr "Europe"; keep "Europa" as value |
| Pluto | Pluton | بلوتو | LABEL ONLY | keep "Pluto" as value |

## Style rules (from docs/style-guide.pdf — essentials)
- **French:** Quebec (fr-CA). Use **vous**. Currency **CAD**. **courriel** for email. Dates spelled in French.
  Never concatenate sentence fragments; translate whole strings. Respect length budgets (French runs ~15–20% longer).
- **Arabic:** right-to-left; use **Western digits (0-9)** — do not convert `{{count}}`. Brand/planet-value
  terms stay Latin. Six plural forms. Mirrored UI is handled separately (not your job here).
- **Engineering:** keep placeholders and tags exactly; do not add or remove keys; values only.
