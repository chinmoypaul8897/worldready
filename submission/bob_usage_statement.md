# How we used IBM Bob

**IBM Bob wrote the product.** The entire internationalization retrofit — planning, the reusable kit, extraction, runtime wiring, translations, RTL, the live viewer, and the gate — was done in IBM Bob 2.0 across **17 tasks (17.67 of 40 Bobcoins)**. Every task's consumption summary is screenshotted and its history exported in [`bob_sessions/`](../bob_sessions).

**Bob 2.0 features, by task:**

- **Plan mode + Explore subagent + document understanding** (T01): read `docs/glossary.xlsx` and `docs/style-guide.pdf` to produce the i18n plan, key convention, and a 5-area ownership map.
- **Custom mode + custom skill + PreToolUse hook** (T02): Bob authored a `.bob/` kit — an `i18n-extractor` mode whose edit scope is limited by `fileRegex`, an `i18n-extract` skill (i18next/Intl rules), and a commit-gate hook. A mode-restriction proof (T02b): in that mode Bob *refused* to edit a checker outside its `fileRegex`.
- **Five parallel subagents** (T03, the hero moment): one subagent per app area moved every user-visible JSX/attribute/toast/data string into `src/locales/en/*.json` and replaced it with `t()`/`<Trans>` — 348 keys.
- **Parallel task** (T04): concurrently wired i18next + language detector, a language switcher, and locale-aware Intl formatters.
- **Document understanding + Office-file write** (T06): translated all five namespaces to French (Québec) and Arabic following the glossary/style guide, including Arabic's six plural forms, and wrote the translator round-trip sheet.
- **Agent + Explore subagent** (T08): RTL pass — physical→logical Tailwind utilities, mirrored icons, Noto Sans Arabic.
- **Agent mode** (T09): built the entire live comparison viewer (picker, scan, plural showcase, evidence drawer) as one self-contained file.
- **Agent + i18n-extractor** (T10, T13): a GitHub Actions i18n gate; an on-camera demo where the PreToolUse hook *blocked* a commit containing a hard-coded "New!" badge, then allowed it after Bob moved it into a key across all four locales; and a runtime sweep fix for leftover English planet names.

We also ran an **honest plain-Bob baseline** (T11): the same task with *no* kit, committed as a fairness control.

**What Claude Code (not Bob) did — disclosed for honesty.** Claude wrote only the *scaffolding around* Bob's work: copying the app in, the demo mock and deploy plumbing (Vite base, HashRouter, GitHub Pages workflow), the **independent verifier scripts in `scripts/`** ("the checker is not written by the agent it grades"), the held-out trap key, the evidence JSON, and these submission documents. Claude also made two small bug-fixes to Bob's viewer and trivial TypeScript annotations so Bob's code compiled; all are noted in `bob_sessions/README.md`.

**One disclosure:** an early commit (`918222d`) accidentally contained the trap list for about three minutes *before any Bob task ran*; no Bob prompt ever referenced it, and the plain-Bob baseline on the same folder is the fairness control. The trap key's SHA-256 was committed up front (`evidence/traps-key.sha256`) and matches the now-published key.

No watsonx.ai or watsonx Orchestrate was used.
