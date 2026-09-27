# WorldReady — Task 05b: place LanguageSwitcher in the header (pre-diagnosed)

- **Mode:** 🌍 i18n Extractor
- **Date:** 2026-09-27
- **Bobcoin budget:** 0.5 (stop and tell me if you would exceed it)

**Diagnosis (provided by Claude Code analysis).** `src/components/common/LanguageSwitcher.tsx`
(EN / FR / AR buttons calling `i18n.changeLanguage`) already exists but is not rendered
anywhere, so users cannot switch language. Place it in the header.

## Exact edits — `src/components/layout/Header.tsx` only

1. Add an import (with the other imports near the top):
   ```ts
   import LanguageSwitcher from '../common/LanguageSwitcher';
   ```
2. In the right-hand controls container — the `<div className="flex items-center gap-4">`
   that wraps the user/login/logout block (around line 73) — add `<LanguageSwitcher />` as the
   **first child**, before the `{user ? ( ... ) : ( ... )}` expression. So it becomes:
   ```tsx
   <div className="flex items-center gap-4">
     <LanguageSwitcher />
     {user ? (
       ...
   ```

Change nothing else. Do not edit `LanguageSwitcher.tsx`, any locale file, or any other file.
Do not run the build and do not commit — I handle that. Push back directly if this is wrong.
