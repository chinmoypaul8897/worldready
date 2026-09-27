# Bob sessions — WorldReady

Every IBM Bob IDE task used to build WorldReady, in order; screenshots taken right after each
task (the task-consumption summary: Task Id, Context Length, Workspace, Bobcoins). Prompt files
live in `prompts/`, exported task histories in `exports/`. Bobcoins and wall-clock are read from
Bob's task DB (`~/.bob/db/bob.db`); wall-clock is `updated_at − created_at` for the task.

| # | Task | Mode + Bob features used | Bobcoins | Wall-clock | Task id | Main files | Screenshot |
|---|---|---|---|---|---|---|---|
| T01 | i18n plan (key convention, 5-worker ownership map, i18next runtime, Intl, RTL, data rule) | **Plan mode** + `create-plan` skill + **Explore subagent** + document understanding (read `docs/glossary.xlsx` + `docs/style-guide.pdf`) | 0.576 | 243 s | `4593193355a8c601be89e9368f417114` | `plans/i18n-plan.md` | `worldready_task01_plan_summary.png` |
| T02 | Create the `.bob` kit: **custom mode** (`i18n-extractor`, `edit` limited by `fileRegex`), **skill** (`i18n-extract`, 6 i18next/Intl rules), **PreToolUse commit-gate hook** | Agent mode | 0.400 | 64 s | `1da972e2c73ac0b46b3757e612b08bea` | `.bob/custom_modes.yaml`, `.bob/skills/i18n-extract/SKILL.md`, `.bob/hooks/gate-commit.mjs`, `.bob/settings.json` | `worldready_task02_kit_summary.png` |
| T02-fix | Pre-diagnosed fix: hook read stdin via ESM `import` (was `require`, failed open) | Agent mode | 0.130 | 16 s | `e19859aae3c49bbf2e283a680053d5f7` | `.bob/hooks/gate-commit.mjs` | (in kit summary panel) |
| T02-fix-2 | Pre-diagnosed fix: gate key-parity only once `src/locales/en` exists (no false blocks) | Agent mode | 0.134 | 16 s | `6f08e5d552503c8dfa7f3613189424db` | `.bob/hooks/gate-commit.mjs` | (in kit summary panel) |
| T02b | **Mode-restriction proof:** in `i18n Extractor` mode, asked to edit `scripts/count-literals.mjs` → **Bob refused** (`fileRegex` blocks it); file left unedited | 🌍 i18n Extractor mode | 0.024 | 9 s | `243260a8b02b2935a12e62c5a1fde565` | (no edit — refusal) | `worldready_task02b_mode_refusal_summary.png`, `worldready_task02b_mode_refusal_chat.png` |
| T11 | **Plain-Bob baseline** (no `.bob` kit) in `bob-sandbox` on a copy of `v0-before`: "Internationalize `baseline-app/src/components/bookings/` with react-i18next…". Result: **3/5 bookings traps, literals 55→14**, stopped by the 1.0-coin cap before finishing HoldCard | Agent mode, **no** custom mode/skill/hook | 1.064 | 166 s | `090ce6865907faf00e558d448673a5ff` | `bob-sandbox/baseline-app/**` (scratch, not in repo); scored to `evidence/baseline-plain-bob.json` | `worldready_task11_plain_baseline_summary.png` |
