# Bob sessions — WorldReady

Every IBM Bob IDE task used to build WorldReady, in order; screenshots taken right after each
task (the task-consumption summary: Task Id, Context Length, Workspace, Bobcoins). Prompt files
live in `prompts/`, exported task histories in `exports/`. Bobcoins and wall-clock are read from
Bob's task DB (`~/.bob/db/bob.db`); wall-clock is `updated_at − created_at` for the task.

| # | Task | Mode + Bob features used | Bobcoins | Wall-clock | Task id | Main files | Screenshot |
|---|---|---|---|---|---|---|---|
| T01 | i18n plan (key convention, 5-worker ownership map, i18next runtime, Intl, RTL, data rule) | **Plan mode** + `create-plan` skill + **Explore subagent** + document understanding (read `docs/glossary.xlsx` + `docs/style-guide.pdf`) | 0.576 | 243 s | `4593193355a8c601be89e9368f417114` | `plans/i18n-plan.md` | `worldready_task01_plan_summary.png` |
