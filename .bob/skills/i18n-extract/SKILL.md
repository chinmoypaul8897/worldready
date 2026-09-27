---
name: i18n-extract
description: Externalize hard-coded UI strings into i18next keys with locale-aware formatting and RTL-safe layout. Use when internationalizing an existing React/TypeScript app.
---

When internationalizing React components, follow these rules:

1. **Never concatenate translated fragments.** Build one key with interpolation
   (`t('key', { name })`) instead of joining strings; word order differs per language.

2. **Use i18next `count` for plurals.** Let i18next pick the plural form
   (`t('seats', { count })` with `_zero/_one/_two/_few/_many/_other` as the language needs);
   never append an "s" in code.

3. **Externalize accessibility and form text too**: `aria-label`, `alt`, `title`, and
   `placeholder` values are user-visible and must go through `t()`.

4. **Format dates, numbers and money only through `Intl`** (or date-fns), keyed by
   `i18n.language` — never hand-format with string templates or hard-coded symbols.

5. **Values used as a filter key or a URL/route value keep their English value.** Translate
   only the visible label, looked up by a stable English slug or id.

6. **Each worker writes only its own namespace file**, so parallel extraction never conflicts.

Return the list of keys you added and confirm English rendering is unchanged.
