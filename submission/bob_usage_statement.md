# How we used IBM Bob

**Who wrote what.** The product i18n work was done by IBM Bob 2.0 across **19 tasks (19.41 of 40 Bobcoins)**; independent verifiers, the demo mock and deploy plumbing were written separately so Bob never graded itself. The 19 include the plain-Bob baseline (T11: no kit, a fairness control) and the T02b proof; ~1.09 of the Bobcoins (Bob's DB total) were retried/diagnostic runs. Evidence: `bob_sessions/`.

**Bob 2.0 features, by task:**

- **Plan mode, Explore subagent, document understanding** (T01): read the glossary (.xlsx) and style guide (.pdf) to write the i18n plan.
- **Custom mode, skill, PreToolUse hook** (T02): Bob authored the `.bob/` kit: an `i18n-extractor` mode scoped by `fileRegex`, an `i18n-extract` skill and a commit-gate hook. In T02b, that mode *refused* to edit a checker outside its scope.
- **Five parallel subagents** (T03): one per app area, 348 strings into i18next keys in about 12 minutes.
- **Parallel task** (T04): wired i18next, a language switcher and Intl formatters.
- **Document understanding, Office-file write** (T06): French (Québec) and Arabic translations per the glossary and style guide, six Arabic plural forms, and the translator sheet.
- **Agent, Explore subagent** (T08): RTL pass: logical Tailwind utilities, mirrored icons, Noto Sans Arabic.
- **Agent mode** (T09, T09b): the live comparison viewer, then polish (taller panes, no overlap at 390 px).
- **Agent, i18n-extractor, PreToolUse hook** (T10, T13): the GitHub Actions gate; on camera the hook *blocked* a commit with a hard-coded "New!" badge, then passed once Bob moved it into a key; a sweep fix for English planet names.
- **i18n-extractor, document understanding** (T07, human in the loop): Bob read the human-reviewed `docs/translator.xlsx` with its Office tool and applied the 7 differing cells ("7/7 reviewer edits applied").

**Claude Code (not Bob) wrote** the independent verifiers (`scripts/`), the demo mock, deploy plumbing, the held-out trap key, evidence JSON, docs, submission texts and the video.

**Disclosures:**

- An early commit (`918222d`) accidentally contained the trap list for about 3 minutes *before any Bob task ran*. No Bob prompt referenced it; the trap score was frozen before the key was published; the plain-Bob baseline on the same folder is the fairness control.
- 24/30 is honest: the 6 residual traps were never answer-fed.
- Translations are machine drafts. The human reviewer (project owner) decided 5 flagged items (7 cells); Claude Code typed the decisions into `docs/translator.csv` and generated the `.xlsx`; Bob applied them (T07).
- Claude made two small bug-fixes to Bob's viewer (an iframe reload; a null reference on re-scan) and two trivial TypeScript type annotations so Bob's code compiled, and pre-diagnosed some small Bob fix tasks (stated in their prompts).
- The demo PR #1 commits were made by hand to demonstrate the gate, not by Bob.
- Narration in the demo video: AI-generated voice (Microsoft neural TTS).

No watsonx.ai or watsonx Orchestrate was used.
