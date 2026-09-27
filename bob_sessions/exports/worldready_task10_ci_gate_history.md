# Bob task 52a6efbf6e16fbfb7fdbeca16d2c6eef

- Title: # Task 10 — The WorldReady CI gate (GitHub Actions) + a clearer commit-block message**Mode:** Agent (this task edits `.github/`, which the i18n Extractor mode cannot touch).**Date:** 2026-09-27 (night shift).**Bobcoin budget for this task: 1.0.** Do NOT run `npm ci`, `npm run build`, or any long command — I (Claude Code) verify the workflow and the hook separately. Just write the two files below. Push back directly if any instruction is wrong.You built WorldReady's i18n retrofit. This task makes the result **stay** world-ready by adding a CI gate and by making the local commit-gate's block message name the offending file.## Part A — create `.github/workflows/i18n-gate.yml`A GitHub Actions workflow named **`WorldReady i18n gate`** that runs on:- `pull_request` (any branch into `main`), and- `push` to `main`.One job called `gate` on `ubuntu-latest` with these steps, **in this order**:1. Checkout with **full history** (needed for the frozen-baseline diff and the `v0-before` tag):   ```yaml   - uses: actions/checkout@v4     with:       fetch-depth: 0   ```2. `actions/setup-node@v4` with `node-version: '22'`.3. Install deps: `npm ci`.4. **No hard-coded English strings (must be 0).** The counter script only exits non-zero in `--staged` mode, so read its JSON total instead:   ```yaml   - name: No hard-coded English strings (must be 0)     run: |       node scripts/count-literals.mjs --json count.json       node -e "const t=require('./count.json').total; if(t>0){console.error('FAIL: '+t+' hard-coded English string(s) — the WorldReady gate blocks this. See count.json / the log above.');process.exit(1)} else {console.log('OK: 0 hard-coded English strings')}"   ```5. **Locale key parity** (exits non-zero itself on any missing/extra key or plural form):   ```yaml   - name: Locale key parity (en/fr/ar/pseudo)     run: node scripts/key-parity.mjs   ```6. **Build must pass:**   ```yaml   - name: Build     run: npm run build   ```7. **Claude-owned files unchanged (independent verifiers + demo mock).** These files were authored by Claude Code (the independent verifiers in `scripts/` and the demo mock services) and are frozen so the "0 hard-coded strings" proof can't be gamed by editing the ruler. Compare against the frozen baseline commit `bd87f41ec49b747915d2f3967a35fa488fac97ba` (the commit at which all Claude-owned files reached their final state; `v0-before` predates the verifiers so it cannot be the baseline — document this in a YAML comment):   ```yaml   - name: Claude-owned files frozen (verifiers + demo mock)     run: |       BASE=bd87f41ec49b747915d2f3967a35fa488fac97ba       CHANGED=$(git diff --name-only "$BASE" HEAD -- scripts/ eslint.i18n.config.mjs src/services/api.ts src/services/demoApi.ts vite.config.ts)       if [ -n "$CHANGED" ]; then         echo "FAIL: Claude-owned protected files changed since the frozen baseline:"; echo "$CHANGED"; exit 1       fi       echo "OK: verifiers + demo mock unchanged since the frozen baseline"   ```Add a top-of-file comment block explaining what the gate enforces and why the baseline is `bd87f41`, not `v0-before`.## Part B — improve the local commit-gate block messageEdit `.bob/hooks/gate-commit.mjs` so that when it blocks a commit for hard-coded strings (the first check, exit 2), the error message **names the count and the offending file(s)**, e.g. reads like:`Blocked: 1 hard-coded string in src/components/layout/Header.tsx — move it into an i18next key (t(...)).`The counter already prints a per-file breakdown; the simplest robust approach is to run the staged count with `--json` to a path in the OS temp dir (NOT inside the repo, so it never gets staged), read `total` and the `perFile` map, and build the message from them. Keep the exit code **2** (that is what blocks the tool). Do not change the key-parity check or the non-commit passthrough. Keep it a valid ES module (the hook is `import`-based, not `require`).## Acceptance (I verify these myself — do not run them):- `.github/workflows/i18n-gate.yml` exists, triggers on `pull_request` + `push:main`, one `gate` job with the 7 steps above.- `.bob/hooks/gate-commit.mjs` still exits 0 on non-commit commands and on a clean commit, exits 2 on a staged hard-coded string, and its block message names the count + file.Write only these two files. Then stop.
- Workspace: file:c:\Users\chinm\bob-hackathon-app
- Bobcoins: 0.145758
- Context tokens: 20108
- Created: 2026-09-27 12:01:25

**User:**

# Task 10 — The WorldReady CI gate (GitHub Actions) + a clearer commit-block message**Mode:** Agent (this task edits `.github/`, which the i18n Extractor mode cannot touch).**Date:** 2026-09-27 (night shift).**Bobcoin budget for this task: 1.0.** Do NOT run `npm ci`, `npm run build`, or any long command — I (Claude Code) verify the workflow and the hook separately. Just write the two files below. Push back directly if any instruction is wrong.You built WorldReady's i18n retrofit. This task makes the result **stay** world-ready by adding a CI gate and by making the local commit-gate's block message name the offending file.## Part A — create `.github/workflows/i18n-gate.yml`A GitHub Actions workflow named **`WorldReady i18n gate`** that runs on:- `pull_request` (any branch into `main`), and- `push` to `main`.One job called `gate` on `ubuntu-latest` with these steps, **in this order**:1. Checkout with **full history** (needed for the frozen-baseline diff and the `v0-before` tag):   ```yaml   - uses: actions/checkout@v4     with:       fetch-depth: 0   ```2. `actions/setup-node@v4` with `node-version: '22'`.3. Install deps: `npm ci`.4. **No hard-coded English strings (must be 0).** The counter script only exits non-zero in `--staged` mode, so read its JSON total instead:   ```yaml   - name: No hard-coded English strings (must be 0)     run: |       node scripts/count-literals.mjs --json count.json       node -e "const t=require('./count.json').total; if(t>0){console.error('FAIL: '+t+' hard-coded English string(s) — the WorldReady gate blocks this. See count.json / the log above.');process.exit(1)} else {console.log('OK: 0 hard-coded English strings')}"   ```5. **Locale key parity** (exits non-zero itself on any missing/extra key or plural form):   ```yaml   - name: Locale key parity (en/fr/ar/pseudo)     run: node scripts/key-parity.mjs   ```6. **Build must pass:**   ```yaml   - name: Build     run: npm run build   ```7. **Claude-owned files unchanged (independent verifiers + demo mock).** These files were authored by Claude Code (the independent verifiers in `scripts/` and the demo mock services) and are frozen so the "0 hard-coded strings" proof can't be gamed by editing the ruler. Compare against the frozen baseline commit `bd87f41ec49b747915d2f3967a35fa488fac97ba` (the commit at which all Claude-owned files reached their final state; `v0-before` predates the verifiers so it cannot be the baseline — document this in a YAML comment):   ```yaml   - name: Claude-owned files frozen (verifiers + demo mock)     run: |       BASE=bd87f41ec49b747915d2f3967a35fa488fac97ba       CHANGED=$(git diff --name-only "$BASE" HEAD -- scripts/ eslint.i18n.config.mjs src/services/api.ts src/services/demoApi.ts vite.config.ts)       if [ -n "$CHANGED" ]; then         echo "FAIL: Claude-owned protected files changed since the frozen baseline:"; echo "$CHANGED"; exit 1       fi       echo "OK: verifiers + demo mock unchanged since the frozen baseline"   ```Add a top-of-file comment block explaining what the gate enforces and why the baseline is `bd87f41`, not `v0-before`.## Part B — improve the local commit-gate block messageEdit `.bob/hooks/gate-commit.mjs` so that when it blocks a commit for hard-coded strings (the first check, exit 2), the error message **names the count and the offending file(s)**, e.g. reads like:`Blocked: 1 hard-coded string in src/components/layout/Header.tsx — move it into an i18next key (t(...)).`The counter already prints a per-file breakdown; the simplest robust approach is to run the staged count with `--json` to a path in the OS temp dir (NOT inside the repo, so it never gets staged), read `total` and the `perFile` map, and build the message from them. Keep the exit code **2** (that is what blocks the tool). Do not change the key-parity check or the non-commit passthrough. Keep it a valid ES module (the hook is `import`-based, not `require`).## Acceptance (I verify these myself — do not run them):- `.github/workflows/i18n-gate.yml` exists, triggers on `pull_request` + `push:main`, one `gate` job with the 7 steps above.- `.bob/hooks/gate-commit.mjs` still exits 0 on non-commit commands and on a clean commit, exits 2 on a staged hard-coded string, and its block message names the count + file.Write only these two files. Then stop.

**Assistant:**



_spend: {'cost': 0.03207, 'contextTokens': 16035}_

**Tool:**

Contents of file .bob/hooks/gate-commit.mjs:

1 | #!/usr/bin/env node
2 | // PreToolUse gate: block `git commit` while staged files carry hard-coded UI strings
3 | // or while locale key parity fails. Exit 2 blocks the tool; exit 0 allows it.
4 | 
5 | import { spawnSync } from 'node:child_process';
6 | import { readFileSync, existsSync } from 'node:fs';
7 | 
8 | function readStdin() {
9 |   try { return readFileSync(0, 'utf8'); } catch { return ''; }
10 | }
11 | 
12 | const raw = readStdin();
13 | let cmd = '';
14 | try {
15 |   const j = JSON.parse(raw || '{}');
16 |   cmd = (j.input && j.input.command) || (j.tool_input && j.tool_input.command) || '';
17 | } catch { cmd = ''; }
18 | 
19 | // Only gate git commits; everything else passes straight through.
20 | if (!/\bgit\s+commit\b/.test(cmd)) process.exit(0);
21 | 
22 | function run(args) {
23 |   const r = spawnSync(process.execPath, args, { encoding: 'utf8' });
24 |   return { code: r.status ?? 1, out: (r.stdout || '') + (r.stderr || '') };
25 | }
26 | 
27 | // 1) No hard-coded user-visible strings in staged files.
28 | const lit = run(['scripts/count-literals.mjs', '--staged']);
29 | if (lit.code !== 0) {
30 |   console.error('Commit blocked: staged files still contain hard-coded UI strings. '
31 |     + 'Move them into i18next keys (t(...)). Run `node scripts/count-literals.mjs --staged` to see them.');
32 |   process.exit(2);
33 | }
34 | 
35 | // 2) Locale key parity — only meaningful once the English locale resources exist.
36 | if (existsSync('src/locales/en')) {
37 |   const kp = run(['scripts/key-parity.mjs']);
38 |   if (kp.code !== 0) {
39 |     console.error('Commit blocked: locale key parity failed (a locale is missing keys or plural forms). '
40 |       + 'Run `node scripts/key-parity.mjs` to see which.');
41 |     process.exit(2);
42 |   }
43 | }
44 | 
45 | process.exit(0);
46 |

**Assistant:**

Now I have what I need. Let me write both files.

_spend: {'cost': 0.03567, 'contextTokens': 17835}_

**Tool:**

Created file: .github/workflows/i18n-gate.yml

<result>
# WorldReady i18n gate
#
# What this gate enforces:
#   1. Zero hard-coded English strings remain in the source tree.
#   2. All locale files (en / fr / ar / pseudo) have identical key sets and

...72 lines truncated. You do not need to re-read the file. The complete file was written successfully. Use read_file if you need to see the full contents.
</result>

**Assistant:**



_spend: {'cost': 0.037802, 'contextTokens': 18901}_

**Tool:**

Edited file: .bob/hooks/gate-commit.mjs

You do not need to re-read the file, as you have seen all changes.
Proceed with the task using these changes as the new baseline.

If the user's edits have addressed part of the task or changed the requirements, adjust your approach accordingly.

Patch of edit:

<patch>
@@ -2,9 +2,11 @@
 // PreToolUse gate: block `git commit` while staged files carry hard-coded UI strings
 // or while locale key parity fails. Exit 2 blocks the tool; exit 0 allows it.
 
 import { spawnSync } from 'node:child_process';
-import { readFileSync, existsSync } from 'node:fs';
+import { readFileSync, existsSync, writeFileSync } from 'node:fs';
+import { tmpdir } from 'node:os';
+import { join } from 'node:path';
 
 function readStdin() {
   try { return readFileSync(0, 'utf8'); } catch { return ''; }
 }
@@ -24,12 +26,30 @@
   return { code: r.status ?? 1, out: (r.stdout || '') + (r.stderr || '') };
 }
 
 // 1) No hard-coded user-visible strings in staged files.
-const lit = run(['scripts/count-literals.mjs', '--staged']);
+//    Run with --json to a temp file (outside the repo so it is never staged)
+//    so we can read the total count and the per-file breakdown for a precise
+//    block message.
+const jsonOut = join(tmpdir(), `count-literals-${process.pid}.json`);
+const lit = run(['scripts/count-literals.mjs', '--staged', '--json', jsonOut]);
 if (lit.code !== 0) {
-  console.error('Commit blocked: staged files still contain hard-coded UI strings. '
-    + 'Move them into i18next keys (t(...)). Run `node scripts/count-literals.mjs --staged` to see them.');
+  // Build a human-readable message from the JSON report when available.
+  let msg = 'Commit blocked: staged files still contain hard-coded UI strings.';
+  try {
+    const report = JSON.parse(readFileSync(jsonOut, 'utf8'));
+    const total = report.total ?? 0;
+    const perFile = report.perFile ?? {};
+    const files = Object.keys(perFile).filter(f => (perFile[f] ?? 0) > 0);
+    if (total > 0 && files.length > 0) {
+      const fileList = files
+        .map(f => `${f} (${perFile[f]})`)
+        .join(', ');
+      const noun = total === 1 ? 'string' : 'strings';
+      msg = `Blocked: ${total} hard-coded ${noun} in ${fileList} — move it into an i18next key (t(...)).`;
+    }
+  } catch { /* fall back to generic message */ }
+  console.error(msg);
   process.exit(2);
 }
 
 // 2) Locale key parity — only meaningful once the English locale resources exist.

</patch>

**Assistant:**

Both files are written.

---

**`.github/workflows/i18n-gate.yml`** — new file with:
- Triggers on `pull_request` (→ `main`) and `push` to `main`
- One `gate` job on `ubuntu-latest` with the 7 steps in exact order: full-history checkout, Node 22 setup, `npm ci`, literal-count JSON check, key-parity, build, frozen-baseline diff
- Top-of-file comment block explaining what the gate enforces and why the baseline is `bd87f41`, not `v0-before` (the verifier scripts didn't exist at the `v0-before` tag, so diffing against it would always false-positive)

**`.bob/hooks/gate-commit.mjs`** — edited:
- Imports `tmpdir` and `join` alongside the existing imports; also imports `writeFileSync` (unused directly but `readFileSync` on the temp path is the key read)
- Writes the JSON report to `join(tmpdir(), 'count-literals-<pid>.json')` — outside the repo so it is never accidentally staged
- Parses `total` and `perFile` from the report to produce a message like:  
  `Blocked: 1 hard-coded string in src/components/layout/Header.tsx (1) — move it into an i18next key (t(...)).`
- Falls back to the generic message if the JSON is absent or malformed
- Exit code remains **2**; key-parity check and non-commit passthrough are unchanged

_spend: {'cost': 0.040216, 'contextTokens': 20108}_
