# WorldReady: Problem & Solution

**The workflow.** WorldReady improves application maintenance and release: retrofitting localization into an existing app, then keeping new code world-ready on every PR.

**The problem.** Entering a new market is a *code* problem. Quebec's Bill 96 requires French; Gulf and MENA growth requires Arabic: RTL layout and Arabic-locale dates, currency and plural forms. Translation alone cannot fix what breaks: strings hard-coded in JSX, glued plurals ("1 seats left"), physical `left`/`right` layout, English baked into data and toasts. And one hard-coded string added later ships broken UI. Baseline (Galaxium Travels, Apache-2.0, English-only): **305 hard-coded user-visible strings, one language, no `dir` attribute, 12 physical left/right classes.**

**The solution.** IBM Bob retrofits that app into **English + French (Québec) + Arabic (RTL)**, then installs a gate that keeps new English out. Bob extracts every user-visible string into i18next keys (five parallel subagents), wires Intl formatting, CLDR plurals, logical RTL utilities and mirrored icons, and adds a **PreToolUse commit hook + GitHub Actions gate** that fails the build on new hard-coded strings (PR #1: red → green). Human in the loop: the owner decided 5 flagged translations (7 cells), recorded in the translator sheet; Bob read the `.xlsx` back and applied all 7.

**Who uses it.** Product teams entering regulated or RTL markets, and agencies retrofitting client apps: run Bob's `i18n-extractor` mode, review machine-draft translations, merge; the gate protects every later PR. Judges use a **live comparison viewer**: pick العربية and the app mirrors to RTL; press *Scan* and hard-coded English is outlined (home view: **Before 47–48, After 0**), beside the six-form Arabic plural showcase.

**Why it is unique.** Lingo.dev, i18next-parser and Crowdin *extract* or *translate*; none fix the code traps **and** install a regression gate. *TransCreate localizes developer videos; WorldReady localizes app code: keys, plurals, formatting, RTL, and a gate. Accessibility tools such as Usher and CurbCut ask whether everyone can use the app; WorldReady asks whether every market can.*

**Measured impact (independent verifiers).** Hard-coded user-visible English **305 → 0**; **24/30** engineered i18n traps fixed (frozen; held-out key, SHA-256 committed *before any Bob task ran*); **0 characters** of existing English changed; **1 → 3** languages plus a pseudo-locale; key-parity **PASS**; physical left/right classes **12 → 0**; Arabic plural forms **6/6**.

**Effort (Bob's measured time).** 348 strings extracted into keys in about 12 minutes (five parallel subagents); the whole retrofit took about 40 minutes of Bob time across 16 product tasks, not counting translation (untimed: an API outage broke its clock).

**Who built what.** The product i18n work was done by IBM Bob 2.0 across 19 tasks (19.41 of 40 Bobcoins); independent verifiers, the demo mock and deploy plumbing were written separately so Bob never graded itself. Sessions: `bob_sessions/`. Live: https://chinmoypaul8897.github.io/worldready/
