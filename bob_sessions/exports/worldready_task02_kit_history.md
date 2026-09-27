# Bob task 1da972e2c73ac0b46b3757e612b08bea

- Title: # WorldReady — Task 02: create the `.bob` kit (custom mode + skill + commit-gate hook)- **Mode:** Agent- **Date:** 2026-09-27- **Bobcoin budget:** 0.8 (stop and ask if you would exceed it)Create three things under `.bob/`. Write the files exactly as specified below (these are theproject's own i18n conventions, phrased from the public i18next and MDN `Intl` docs). Do **not**touch `src/`, `scripts/`, `docs/`, `evidence/` or `.github/` in this task — only create the `.bob/`kit files. After writing, confirm each file exists.## 1. Custom mode → `.bob/custom_modes.yaml`An **i18n Extractor** persona whose `edit` tool is hard-limited by `fileRegex` to app source,locale JSON, `index.html` and `tailwind.config.js`. It must **never** be able to edit `scripts/`,`docs/`, `evidence/`, `.github/`, `vite.config.ts`, or the two API service files(`src/services/api.ts`, `src/services/demoApi.ts`). Write this file verbatim:```yamlcustomModes:  - slug: i18n-extractor    name: 🌍 i18n Extractor    description: Retrofits i18n into an existing React app. Cannot touch the verifiers, the API layer, or the build/CI config.    roleDefinition: >-      You are an internationalization engineer. You move hard-coded user-visible      English text in an existing React + TypeScript app into i18next keys and      locale formatting, without changing the app's English behaviour.    whenToUse: Use when moving hard-coded UI text into i18next keys, adding locale-aware Intl formatting, or fixing RTL layout.    customInstructions: >-      Follow the i18n-extract skill. Never change English rendering or app logic;      only externalize strings and formatting. Write only your assigned namespace file.    groups:      - read      - execute      - skill      - subagent      - todo      - - edit        - fileRegex: "^(src/(?!services/(api|demoApi)\\.ts$).*\\.(tsx?|json|css)|index\\.html|tailwind\\.config\\.js)$"          description: App source, locale JSON, index.html and tailwind.config.js only; never scripts/, docs/, evidence/, .github/, vite.config.ts or the API service files.```## 2. Skill → `.bob/skills/i18n-extract/SKILL.md`Six rules, general i18n best practice (no reference to any specific file). Write verbatim:```markdown---name: i18n-extractdescription: Externalize hard-coded UI strings into i18next keys with locale-aware formatting and RTL-safe layout. Use when internationalizing an existing React/TypeScript app.---When internationalizing React components, follow these rules:1. **Never concatenate translated fragments.** Build one key with interpolation   (`t('key', { name })`) instead of joining strings; word order differs per language.2. **Use i18next `count` for plurals.** Let i18next pick the plural form   (`t('seats', { count })` with `_zero/_one/_two/_few/_many/_other` as the language needs);   never append an "s" in code.3. **Externalize accessibility and form text too**: `aria-label`, `alt`, `title`, and   `placeholder` values are user-visible and must go through `t()`.4. **Format dates, numbers and money only through `Intl`** (or date-fns), keyed by   `i18n.language` — never hand-format with string templates or hard-coded symbols.5. **Values used as a filter key or a URL/route value keep their English value.** Translate   only the visible label, looked up by a stable English slug or id.6. **Each worker writes only its own namespace file**, so parallel extraction never conflicts.Return the list of keys you added and confirm English rendering is unchanged.```## 3. Commit-gate hook → `.bob/hooks/gate-commit.mjs` + `.bob/settings.json`A **PreToolUse** hook on `execute_command` that blocks `git commit` when the staged changes stillcontain hard-coded strings or when locale key parity fails. It exits **2** with a clear reason.`.bob/hooks/gate-commit.mjs` (Node, because Windows runs hooks via `cmd /c`):```javascript#!/usr/bin/env node// PreToolUse gate: block `git commit` while staged files carry hard-coded UI strings// or while locale key parity fails. Exit 2 blocks the tool; exit 0 allows it.import { spawnSync } from 'node:child_process';function readStdin() {  try { return require('node:fs').readFileSync(0, 'utf8'); } catch { return ''; }}const raw = readStdin();let cmd = '';try {  const j = JSON.parse(raw || '{}');  cmd = (j.input && j.input.command) || (j.tool_input && j.tool_input.command) || '';} catch { cmd = ''; }// Only gate git commits; everything else passes straight through.if (!/\bgit\s+commit\b/.test(cmd)) process.exit(0);function run(args) {  const r = spawnSync(process.execPath, args, { encoding: 'utf8' });  return { code: r.status ?? 1, out: (r.stdout || '') + (r.stderr || '') };}// 1) No hard-coded user-visible strings in staged files.const lit = run(['scripts/count-literals.mjs', '--staged']);if (lit.code !== 0) {  console.error('Commit blocked: staged files still contain hard-coded UI strings. '    + 'Move them into i18next keys (t(...)). Run `node scripts/count-literals.mjs --staged` to see them.');  process.exit(2);}// 2) Locale key parity (skips cleanly until src/locales exists; then all plural forms required).const kp = run(['scripts/key-parity.mjs']);if (kp.code !== 0) {  console.error('Commit blocked: locale key parity failed (a locale is missing keys or plural forms). '    + 'Run `node scripts/key-parity.mjs` to see which.');  process.exit(2);}process.exit(0);````.bob/settings.json`:```json{  "hooks": {    "PreToolUse": [      {        "matcher": "^execute_command$",        "hooks": [          { "type": "command", "command": "node .bob/hooks/gate-commit.mjs", "timeout": 60 }        ]      }    ]  }}```## Acceptance checks- `.bob/custom_modes.yaml`, `.bob/skills/i18n-extract/SKILL.md`, `.bob/hooks/gate-commit.mjs`  and `.bob/settings.json` all exist with exactly the content above.- The mode YAML is valid (single `customModes:` list, one mode, the `fileRegex` intact).- No files outside `.bob/` were changed.Push back directly if any of this is wrong or if you would exceed the budget.
- Workspace: file:c:\Users\chinm\bob-hackathon-app
- Bobcoins: 0.40043800000000007
- Context tokens: 19886
- Created: 2026-09-27 05:34:03

**User:**

# WorldReady — Task 02: create the `.bob` kit (custom mode + skill + commit-gate hook)- **Mode:** Agent- **Date:** 2026-09-27- **Bobcoin budget:** 0.8 (stop and ask if you would exceed it)Create three things under `.bob/`. Write the files exactly as specified below (these are theproject's own i18n conventions, phrased from the public i18next and MDN `Intl` docs). Do **not**touch `src/`, `scripts/`, `docs/`, `evidence/` or `.github/` in this task — only create the `.bob/`kit files. After writing, confirm each file exists.## 1. Custom mode → `.bob/custom_modes.yaml`An **i18n Extractor** persona whose `edit` tool is hard-limited by `fileRegex` to app source,locale JSON, `index.html` and `tailwind.config.js`. It must **never** be able to edit `scripts/`,`docs/`, `evidence/`, `.github/`, `vite.config.ts`, or the two API service files(`src/services/api.ts`, `src/services/demoApi.ts`). Write this file verbatim:```yamlcustomModes:  - slug: i18n-extractor    name: 🌍 i18n Extractor    description: Retrofits i18n into an existing React app. Cannot touch the verifiers, the API layer, or the build/CI config.    roleDefinition: >-      You are an internationalization engineer. You move hard-coded user-visible      English text in an existing React + TypeScript app into i18next keys and      locale formatting, without changing the app's English behaviour.    whenToUse: Use when moving hard-coded UI text into i18next keys, adding locale-aware Intl formatting, or fixing RTL layout.    customInstructions: >-      Follow the i18n-extract skill. Never change English rendering or app logic;      only externalize strings and formatting. Write only your assigned namespace file.    groups:      - read      - execute      - skill      - subagent      - todo      - - edit        - fileRegex: "^(src/(?!services/(api|demoApi)\\.ts$).*\\.(tsx?|json|css)|index\\.html|tailwind\\.config\\.js)$"          description: App source, locale JSON, index.html and tailwind.config.js only; never scripts/, docs/, evidence/, .github/, vite.config.ts or the API service files.```## 2. Skill → `.bob/skills/i18n-extract/SKILL.md`Six rules, general i18n best practice (no reference to any specific file). Write verbatim:```markdown---name: i18n-extractdescription: Externalize hard-coded UI strings into i18next keys with locale-aware formatting and RTL-safe layout. Use when internationalizing an existing React/TypeScript app.---When internationalizing React components, follow these rules:1. **Never concatenate translated fragments.** Build one key with interpolation   (`t('key', { name })`) instead of joining strings; word order differs per language.2. **Use i18next `count` for plurals.** Let i18next pick the plural form   (`t('seats', { count })` with `_zero/_one/_two/_few/_many/_other` as the language needs);   never append an "s" in code.3. **Externalize accessibility and form text too**: `aria-label`, `alt`, `title`, and   `placeholder` values are user-visible and must go through `t()`.4. **Format dates, numbers and money only through `Intl`** (or date-fns), keyed by   `i18n.language` — never hand-format with string templates or hard-coded symbols.5. **Values used as a filter key or a URL/route value keep their English value.** Translate   only the visible label, looked up by a stable English slug or id.6. **Each worker writes only its own namespace file**, so parallel extraction never conflicts.Return the list of keys you added and confirm English rendering is unchanged.```## 3. Commit-gate hook → `.bob/hooks/gate-commit.mjs` + `.bob/settings.json`A **PreToolUse** hook on `execute_command` that blocks `git commit` when the staged changes stillcontain hard-coded strings or when locale key parity fails. It exits **2** with a clear reason.`.bob/hooks/gate-commit.mjs` (Node, because Windows runs hooks via `cmd /c`):```javascript#!/usr/bin/env node// PreToolUse gate: block `git commit` while staged files carry hard-coded UI strings// or while locale key parity fails. Exit 2 blocks the tool; exit 0 allows it.import { spawnSync } from 'node:child_process';function readStdin() {  try { return require('node:fs').readFileSync(0, 'utf8'); } catch { return ''; }}const raw = readStdin();let cmd = '';try {  const j = JSON.parse(raw || '{}');  cmd = (j.input && j.input.command) || (j.tool_input && j.tool_input.command) || '';} catch { cmd = ''; }// Only gate git commits; everything else passes straight through.if (!/\bgit\s+commit\b/.test(cmd)) process.exit(0);function run(args) {  const r = spawnSync(process.execPath, args, { encoding: 'utf8' });  return { code: r.status ?? 1, out: (r.stdout || '') + (r.stderr || '') };}// 1) No hard-coded user-visible strings in staged files.const lit = run(['scripts/count-literals.mjs', '--staged']);if (lit.code !== 0) {  console.error('Commit blocked: staged files still contain hard-coded UI strings. '    + 'Move them into i18next keys (t(...)). Run `node scripts/count-literals.mjs --staged` to see them.');  process.exit(2);}// 2) Locale key parity (skips cleanly until src/locales exists; then all plural forms required).const kp = run(['scripts/key-parity.mjs']);if (kp.code !== 0) {  console.error('Commit blocked: locale key parity failed (a locale is missing keys or plural forms). '    + 'Run `node scripts/key-parity.mjs` to see which.');  process.exit(2);}process.exit(0);````.bob/settings.json`:```json{  "hooks": {    "PreToolUse": [      {        "matcher": "^execute_command$",        "hooks": [          { "type": "command", "command": "node .bob/hooks/gate-commit.mjs", "timeout": 60 }        ]      }    ]  }}```## Acceptance checks- `.bob/custom_modes.yaml`, `.bob/skills/i18n-extract/SKILL.md`, `.bob/hooks/gate-commit.mjs`  and `.bob/settings.json` all exist with exactly the content above.- The mode YAML is valid (single `customModes:` list, one mode, the `fileRegex` intact).- No files outside `.bob/` were changed.Push back directly if any of this is wrong or if you would exceed the budget.

**Assistant:**



_spend: {'cost': 0.03265, 'contextTokens': 16325}_

**Tool:**

To do list updated: 5 items total.

Next to do item inprogress: Create .bob/custom_modes.yaml (i18n-extractor mode)

**Assistant:**



_spend: {'cost': 0.033594, 'contextTokens': 16797}_

**Tool:**

Created file: .bob/custom_modes.yaml

<result>
customModes:
  - slug: i18n-extractor
    name: 🌍 i18n Extractor
    description: Retrofits i18n into an existing React app. Cannot touch the verifiers, the API layer, or the build/CI config.
    roleDefinition: >-

...17 lines truncated. You do not need to re-read the file. The complete file was written successfully. Use read_file if you need to see the full contents.
</result>

**Assistant:**



_spend: {'cost': 0.034142, 'contextTokens': 17071}_

**Tool:**

To do list updated: 5 items total.

Next to do item inprogress: Create .bob/skills/i18n-extract/SKILL.md

**Assistant:**



_spend: {'cost': 0.035122, 'contextTokens': 17561}_

**Tool:**

Created file: .bob/skills/i18n-extract/SKILL.md

<result>
---
name: i18n-extract
description: Externalize hard-coded UI strings into i18next keys with locale-aware formatting and RTL-safe layout. Use when internationalizing an existing React/TypeScript app.
---


...22 lines truncated. You do not need to re-read the file. The complete file was written successfully. Use read_file if you need to see the full contents.
</result>

**Assistant:**



_spend: {'cost': 0.035648, 'contextTokens': 17824}_

**Tool:**

To do list updated: 5 items total.

Next to do item inprogress: Create .bob/hooks/gate-commit.mjs

**Assistant:**



_spend: {'cost': 0.036964, 'contextTokens': 18482}_

**Tool:**

Created file: .bob/hooks/gate-commit.mjs

<result>
#!/usr/bin/env node
// PreToolUse gate: block `git commit` while staged files carry hard-coded UI strings
// or while locale key parity fails. Exit 2 blocks the tool; exit 0 allows it.

import { spawnSync } from 'node:child_process';

...38 lines truncated. You do not need to re-read the file. The complete file was written successfully. Use read_file if you need to see the full contents.
</result>

**Assistant:**



_spend: {'cost': 0.03752, 'contextTokens': 18760}_

**Tool:**

To do list updated: 5 items total.

Next to do item inprogress: Create .bob/settings.json

**Assistant:**



_spend: {'cost': 0.037956, 'contextTokens': 18978}_

**Tool:**

Created file: .bob/settings.json

<result>
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "^execute_command$",

...8 lines truncated. You do not need to re-read the file. The complete file was written successfully. Use read_file if you need to see the full contents.
</result>

**Assistant:**

Now verify all four files exist:

_spend: {'cost': 0.038312, 'contextTokens': 19156}_

**Tool:**

Directory listing for .bob:

.bob\custom_modes.yaml
.bob\hooks\
.bob\settings.json
.bob\skills\
.bob\hooks\gate-commit.mjs
.bob\skills\i18n-extract\
.bob\skills\i18n-extract\SKILL.md

**Assistant:**



_spend: {'cost': 0.038758, 'contextTokens': 19379}_

**Tool:**

To do list updated: 5 items total.

To do list completed.

**Assistant:**

All four files are in place under `.bob/` — nothing outside that directory was touched:

| File | Status |
|------|--------|
| [`.bob/custom_modes.yaml`](.bob/custom_modes.yaml) | ✅ Created — single `customModes:` list, `i18n-extractor` mode, `fileRegex` intact |
| [`.bob/skills/i18n-extract/SKILL.md`](.bob/skills/i18n-extract/SKILL.md) | ✅ Created — 6-rule skill, valid frontmatter |
| [`.bob/hooks/gate-commit.mjs`](.bob/hooks/gate-commit.mjs) | ✅ Created — `PreToolUse` commit gate, exits 2 on literal or parity failures |
| [`.bob/settings.json`](.bob/settings.json) | ✅ Created — wires `gate-commit.mjs` to `^execute_command$` matcher |

**What each piece does:**
- **Mode** (`i18n-extractor`) — restricts `edit` via `fileRegex` to `src/**` (excluding the two API service files), `index.html`, and `tailwind.config.js`. `scripts/`, `docs/`, `evidence/`, `.github/`, and `vite.config.ts` are all outside the regex and therefore blocked.
- **Skill** (`i18n-extract`) — six portable i18n rules (interpolation over concatenation, i18next plurals, a11y text, `Intl` formatting, stable filter keys, namespace isolation).
- **Hook** (`gate-commit.mjs` + `settings.json`) — intercepts every `execute_command` call, pattern-matches for `git commit`, then runs `count-literals.mjs --staged` and `key-parity.mjs`; exits 2 (blocking the commit) if either fails, exits 0 (passes) for all non-commit commands or clean checks.

_spend: {'cost': 0.039772, 'contextTokens': 19886}_
