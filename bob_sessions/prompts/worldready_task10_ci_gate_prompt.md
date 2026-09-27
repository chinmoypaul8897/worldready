# Task 10 — The WorldReady CI gate (GitHub Actions) + a clearer commit-block message

**Mode:** Agent (this task edits `.github/`, which the i18n Extractor mode cannot touch).
**Date:** 2026-09-27 (night shift).
**Bobcoin budget for this task: 1.0.** Do NOT run `npm ci`, `npm run build`, or any long command — I (Claude Code) verify the workflow and the hook separately. Just write the two files below. Push back directly if any instruction is wrong.

You built WorldReady's i18n retrofit. This task makes the result **stay** world-ready by adding a CI gate and by making the local commit-gate's block message name the offending file.

## Part A — create `.github/workflows/i18n-gate.yml`

A GitHub Actions workflow named **`WorldReady i18n gate`** that runs on:
- `pull_request` (any branch into `main`), and
- `push` to `main`.

One job called `gate` on `ubuntu-latest` with these steps, **in this order**:

1. Checkout with **full history** (needed for the frozen-baseline diff and the `v0-before` tag):
   ```yaml
   - uses: actions/checkout@v4
     with:
       fetch-depth: 0
   ```
2. `actions/setup-node@v4` with `node-version: '22'`.
3. Install deps: `npm ci`.
4. **No hard-coded English strings (must be 0).** The counter script only exits non-zero in `--staged` mode, so read its JSON total instead:
   ```yaml
   - name: No hard-coded English strings (must be 0)
     run: |
       node scripts/count-literals.mjs --json count.json
       node -e "const t=require('./count.json').total; if(t>0){console.error('FAIL: '+t+' hard-coded English string(s) — the WorldReady gate blocks this. See count.json / the log above.');process.exit(1)} else {console.log('OK: 0 hard-coded English strings')}"
   ```
5. **Locale key parity** (exits non-zero itself on any missing/extra key or plural form):
   ```yaml
   - name: Locale key parity (en/fr/ar/pseudo)
     run: node scripts/key-parity.mjs
   ```
6. **Build must pass:**
   ```yaml
   - name: Build
     run: npm run build
   ```
7. **Claude-owned files unchanged (independent verifiers + demo mock).** These files were authored by Claude Code (the independent verifiers in `scripts/` and the demo mock services) and are frozen so the "0 hard-coded strings" proof can't be gamed by editing the ruler. Compare against the frozen baseline commit `bd87f41ec49b747915d2f3967a35fa488fac97ba` (the commit at which all Claude-owned files reached their final state; `v0-before` predates the verifiers so it cannot be the baseline — document this in a YAML comment):
   ```yaml
   - name: Claude-owned files frozen (verifiers + demo mock)
     run: |
       BASE=bd87f41ec49b747915d2f3967a35fa488fac97ba
       CHANGED=$(git diff --name-only "$BASE" HEAD -- scripts/ eslint.i18n.config.mjs src/services/api.ts src/services/demoApi.ts vite.config.ts)
       if [ -n "$CHANGED" ]; then
         echo "FAIL: Claude-owned protected files changed since the frozen baseline:"; echo "$CHANGED"; exit 1
       fi
       echo "OK: verifiers + demo mock unchanged since the frozen baseline"
   ```

Add a top-of-file comment block explaining what the gate enforces and why the baseline is `bd87f41`, not `v0-before`.

## Part B — improve the local commit-gate block message

Edit `.bob/hooks/gate-commit.mjs` so that when it blocks a commit for hard-coded strings (the first check, exit 2), the error message **names the count and the offending file(s)**, e.g. reads like:

`Blocked: 1 hard-coded string in src/components/layout/Header.tsx — move it into an i18next key (t(...)).`

The counter already prints a per-file breakdown; the simplest robust approach is to run the staged count with `--json` to a path in the OS temp dir (NOT inside the repo, so it never gets staged), read `total` and the `perFile` map, and build the message from them. Keep the exit code **2** (that is what blocks the tool). Do not change the key-parity check or the non-commit passthrough. Keep it a valid ES module (the hook is `import`-based, not `require`).

## Acceptance (I verify these myself — do not run them):
- `.github/workflows/i18n-gate.yml` exists, triggers on `pull_request` + `push:main`, one `gate` job with the 7 steps above.
- `.bob/hooks/gate-commit.mjs` still exits 0 on non-commit commands and on a clean commit, exits 2 on a staged hard-coded string, and its block message names the count + file.

Write only these two files. Then stop.
