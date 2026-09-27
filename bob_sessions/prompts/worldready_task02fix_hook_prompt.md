# WorldReady — Task 02-fix: make the commit-gate hook read stdin (it currently fails open)

- **Mode:** Agent
- **Date:** 2026-09-27
- **Bobcoin budget:** 0.3 (stop and ask if you would exceed it)

**Diagnosis (provided by Claude Code analysis).** `.bob/hooks/gate-commit.mjs` is an ES module
(`.mjs`, uses `import`). Inside `readStdin()` it calls `require('node:fs')`, but `require` is not
defined in an ES module, so it throws `ReferenceError: require is not defined`. The `try/catch`
swallows the error and returns an empty string, so the hook never parses the git command and
**never blocks a commit** (verified: piping a `git commit` payload with a staged hard-coded string
returns exit 0 instead of 2).

**Fix — edit only `.bob/hooks/gate-commit.mjs`:**

1. Add an import at the top, next to the existing `import { spawnSync } ...` line:
   ```javascript
   import { readFileSync } from 'node:fs';
   ```
2. In `readStdin()`, replace the body so it uses the imported `readFileSync` on file descriptor 0:
   ```javascript
   function readStdin() {
     try { return readFileSync(0, 'utf8'); } catch { return ''; }
   }
   ```

Do not change anything else. After the edit, the hook should: parse the piped JSON, detect
`git commit`, run `node scripts/count-literals.mjs --staged` and `node scripts/key-parity.mjs`,
and `process.exit(2)` when either fails.

## Acceptance check
- `.bob/hooks/gate-commit.mjs` no longer references `require`; it imports `readFileSync` from
  `node:fs` and uses it in `readStdin()`.

Push back directly if this diagnosis is wrong.
