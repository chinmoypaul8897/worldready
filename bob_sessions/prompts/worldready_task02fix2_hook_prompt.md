# WorldReady — Task 02-fix-2: gate parity only once locales exist (no false blocks)

- **Mode:** Agent
- **Date:** 2026-09-27
- **Bobcoin budget:** 0.3 (stop and ask if you would exceed it)

**Diagnosis (provided by Claude Code analysis).** `.bob/hooks/gate-commit.mjs` runs
`node scripts/key-parity.mjs` unconditionally. That script **exits 2 when `src/locales/en` does
not exist yet** (it prints "reference locale not found"). So right now — before any translation
resources exist — the hook blocks **every** `git commit`, with a misleading "locale key parity
failed" message. The hook's own comment already says it should "skip cleanly until src/locales
exists", but the code does not do that.

**Fix — edit only `.bob/hooks/gate-commit.mjs`:**

1. Add `existsSync` to the `node:fs` import:
   ```javascript
   import { readFileSync, existsSync } from 'node:fs';
   ```
2. Wrap the key-parity check so it only runs once the English locale exists. Replace the whole
   "`// 2) Locale key parity ...`" block with:
   ```javascript
   // 2) Locale key parity — only meaningful once the English locale resources exist.
   if (existsSync('src/locales/en')) {
     const kp = run(['scripts/key-parity.mjs']);
     if (kp.code !== 0) {
       console.error('Commit blocked: locale key parity failed (a locale is missing keys or plural forms). '
         + 'Run `node scripts/key-parity.mjs` to see which.');
       process.exit(2);
     }
   }
   ```

Leave the hard-coded-string check (step 1 in the file) and everything else unchanged.

## Acceptance check
- The hook imports `existsSync` and only calls `key-parity.mjs` when `src/locales/en` exists.
- The literal-counter block (`count-literals.mjs --staged`) is unchanged and still runs always.

Push back directly if this diagnosis is wrong.
