# Bob task 6f08e5d552503c8dfa7f3613189424db

- Title: # WorldReady — Task 02-fix-2: gate parity only once locales exist (no false blocks)- **Mode:** Agent- **Date:** 2026-09-27- **Bobcoin budget:** 0.3 (stop and ask if you would exceed it)**Diagnosis (provided by Claude Code analysis).** `.bob/hooks/gate-commit.mjs` runs`node scripts/key-parity.mjs` unconditionally. That script **exits 2 when `src/locales/en` doesnot exist yet** (it prints "reference locale not found"). So right now — before any translationresources exist — the hook blocks **every** `git commit`, with a misleading "locale key parityfailed" message. The hook's own comment already says it should "skip cleanly until src/localesexists", but the code does not do that.**Fix — edit only `.bob/hooks/gate-commit.mjs`:**1. Add `existsSync` to the `node:fs` import:   ```javascript   import { readFileSync, existsSync } from 'node:fs';   ```2. Wrap the key-parity check so it only runs once the English locale exists. Replace the whole   "`// 2) Locale key parity ...`" block with:   ```javascript   // 2) Locale key parity — only meaningful once the English locale resources exist.   if (existsSync('src/locales/en')) {     const kp = run(['scripts/key-parity.mjs']);     if (kp.code !== 0) {       console.error('Commit blocked: locale key parity failed (a locale is missing keys or plural forms). '         + 'Run `node scripts/key-parity.mjs` to see which.');       process.exit(2);     }   }   ```Leave the hard-coded-string check (step 1 in the file) and everything else unchanged.## Acceptance check- The hook imports `existsSync` and only calls `key-parity.mjs` when `src/locales/en` exists.- The literal-counter block (`count-literals.mjs --staged`) is unchanged and still runs always.Push back directly if this diagnosis is wrong.
- Workspace: file:c:\Users\chinm\bob-hackathon-app
- Bobcoins: 0.134154
- Context tokens: 18036
- Created: 2026-09-27 05:39:12

**User:**

# WorldReady — Task 02-fix-2: gate parity only once locales exist (no false blocks)- **Mode:** Agent- **Date:** 2026-09-27- **Bobcoin budget:** 0.3 (stop and ask if you would exceed it)**Diagnosis (provided by Claude Code analysis).** `.bob/hooks/gate-commit.mjs` runs`node scripts/key-parity.mjs` unconditionally. That script **exits 2 when `src/locales/en` doesnot exist yet** (it prints "reference locale not found"). So right now — before any translationresources exist — the hook blocks **every** `git commit`, with a misleading "locale key parityfailed" message. The hook's own comment already says it should "skip cleanly until src/localesexists", but the code does not do that.**Fix — edit only `.bob/hooks/gate-commit.mjs`:**1. Add `existsSync` to the `node:fs` import:   ```javascript   import { readFileSync, existsSync } from 'node:fs';   ```2. Wrap the key-parity check so it only runs once the English locale exists. Replace the whole   "`// 2) Locale key parity ...`" block with:   ```javascript   // 2) Locale key parity — only meaningful once the English locale resources exist.   if (existsSync('src/locales/en')) {     const kp = run(['scripts/key-parity.mjs']);     if (kp.code !== 0) {       console.error('Commit blocked: locale key parity failed (a locale is missing keys or plural forms). '         + 'Run `node scripts/key-parity.mjs` to see which.');       process.exit(2);     }   }   ```Leave the hard-coded-string check (step 1 in the file) and everything else unchanged.## Acceptance check- The hook imports `existsSync` and only calls `key-parity.mjs` when `src/locales/en` exists.- The literal-counter block (`count-literals.mjs --staged`) is unchanged and still runs always.Push back directly if this diagnosis is wrong.

**Assistant:**

Let me read the current hook file before making any changes.

_spend: {'cost': 0.030734, 'contextTokens': 15367}_

**Tool:**

Contents of file .bob/hooks/gate-commit.mjs:

1 | #!/usr/bin/env node
2 | // PreToolUse gate: block `git commit` while staged files carry hard-coded UI strings
3 | // or while locale key parity fails. Exit 2 blocks the tool; exit 0 allows it.
4 | 
5 | import { spawnSync } from 'node:child_process';
6 | import { readFileSync } from 'node:fs';
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
35 | // 2) Locale key parity (skips cleanly until src/locales exists; then all plural forms required).
36 | const kp = run(['scripts/key-parity.mjs']);
37 | if (kp.code !== 0) {
38 |   console.error('Commit blocked: locale key parity failed (a locale is missing keys or plural forms). '
39 |     + 'Run `node scripts/key-parity.mjs` to see which.');
40 |   process.exit(2);
41 | }
42 | 
43 | process.exit(0);
44 |

**Assistant:**

The diagnosis is correct. Line 36 runs `key-parity.mjs` unconditionally despite the comment saying it should skip until `src/locales` exists. Applying the fix now:

_spend: {'cost': 0.033022, 'contextTokens': 16511}_

**Tool:**

Edited file: .bob/hooks/gate-commit.mjs

You do not need to re-read the file, as you have seen all changes.
Proceed with the task using these changes as the new baseline.

If the user's edits have addressed part of the task or changed the requirements, adjust your approach accordingly.

Patch of edit:

<patch>
@@ -2,9 +2,9 @@
 // PreToolUse gate: block `git commit` while staged files carry hard-coded UI strings
 // or while locale key parity fails. Exit 2 blocks the tool; exit 0 allows it.
 
 import { spawnSync } from 'node:child_process';
-import { readFileSync } from 'node:fs';
+import { readFileSync, existsSync } from 'node:fs';
 
 function readStdin() {
   try { return readFileSync(0, 'utf8'); } catch { return ''; }
 }
@@ -31,13 +31,15 @@
     + 'Move them into i18next keys (t(...)). Run `node scripts/count-literals.mjs --staged` to see them.');
   process.exit(2);
 }
 
-// 2) Locale key parity (skips cleanly until src/locales exists; then all plural forms required).
-const kp = run(['scripts/key-parity.mjs']);
-if (kp.code !== 0) {
-  console.error('Commit blocked: locale key parity failed (a locale is missing keys or plural forms). '
-    + 'Run `node scripts/key-parity.mjs` to see which.');
-  process.exit(2);
+// 2) Locale key parity — only meaningful once the English locale resources exist.
+if (existsSync('src/locales/en')) {
+  const kp = run(['scripts/key-parity.mjs']);
+  if (kp.code !== 0) {
+    console.error('Commit blocked: locale key parity failed (a locale is missing keys or plural forms). '
+      + 'Run `node scripts/key-parity.mjs` to see which.');
+    process.exit(2);
+  }
 }
 
 process.exit(0);

</patch>

**Assistant:**

Let me do a quick verification of the final file:

_spend: {'cost': 0.034326, 'contextTokens': 17163}_

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

Both acceptance criteria are met:

1. **`existsSync` is imported** — line 6: `import { readFileSync, existsSync } from 'node:fs';`
2. **Key-parity check is gated** — lines 36–43: `key-parity.mjs` only runs when `existsSync('src/locales/en')` is truthy; before that directory exists the block is skipped entirely and the hook exits 0.
3. **Literal-counter block is unchanged** — lines 27–33: `count-literals.mjs --staged` still runs unconditionally on every `git commit`.

_spend: {'cost': 0.036072, 'contextTokens': 18036}_
