<div align="center">

# WorldReady

### Bob built this app English-only. Bob made it world-ready.

**An IBM Bob–driven internationalization retrofit: an English-only React app becomes English + Français (Québec) + العربية (right-to-left) — with a gate that keeps new English out.**

**▶ Live:** **https://chinmoypaul8897.github.io/worldready/**
&nbsp;·&nbsp; [Before (English-only)](https://chinmoypaul8897.github.io/worldready/before/)
&nbsp;·&nbsp; [After (world-ready)](https://chinmoypaul8897.github.io/worldready/after/)

</div>

---

## The headline numbers

All numbers are produced by **independent verifier scripts** in [`scripts/`](scripts/) (written by a teammate, never by the agent being graded), not by estimates. Source of truth: [`evidence/evidence.json`](evidence/evidence.json).

| Metric | Before | After |
|---|---|---|
| Hard-coded, user-visible English strings | **305** | **0** |
| Engineered i18n traps fixed (held-out key) | — | **24 / 30** |
| Characters of existing English content changed | — | **0** *(the language switcher is +45 chars of new UI)* |
| Shipped languages | **1** | **3** + a pseudo-locale |
| Locale key-parity (en / fr / ar / pseudo) | — | **PASS** (0 missing / 0 extra) |
| Physical `left`/`right` layout classes | **12** | **0** (logical utilities; 3/3 directional icons mirrored) |
| Arabic plural forms exercised | 0 | **6 / 6** (zero · one · two · few · many · other) |

Built end-to-end in **IBM Bob 2.0** across **17 tasks** using **17.67 of 40 Bobcoins**.

## See it flip

<div align="center">

![Arabic RTL flip — the whole app mirrors from left-to-right to right-to-left](docs/media/arabic-flip.gif)

*Switch to العربية and the whole app mirrors to right-to-left. Press **Scan** in the [live viewer](https://chinmoypaul8897.github.io/worldready/) and hard-coded English is outlined in both panes — Before: 47, After: 0.*

</div>

## Built with IBM Bob

Every row was authored in IBM Bob 2.0. Screenshots and exported task histories are in [`bob_sessions/`](bob_sessions/).

| Bob 2.0 feature | Where it was used | Evidence |
|---|---|---|
| **Plan mode** + **Explore subagent** + **document understanding** | The i18n plan, key convention, ownership map (read `glossary.xlsx` + `style-guide.pdf`) | `bob_sessions/` T01 · `plans/i18n-plan.md` |
| **Custom mode** (`i18n-extractor`, edit scope limited by `fileRegex`) | Scoped extraction; a proof that Bob **refused** to edit a file outside its scope | `.bob/custom_modes.yaml` · T02, T02b |
| **Custom skill** (`i18n-extract`, i18next/Intl rules) | Consistent extraction rules across every subagent | `.bob/skills/i18n-extract/SKILL.md` |
| **5 parallel subagents** (one per app area) | Moved 348 user-visible strings into `src/locales/en/*.json` + `t()`/`<Trans>` | T03 (the hero moment) |
| **Parallel task** | Wired i18next + detector, language switcher, Intl formatters — concurrently | `src/i18n/`, `src/utils/formatters.ts` · T04 |
| **Document understanding + Office-file write** | French (Québec) + Arabic for all 5 namespaces + the translator round-trip sheet | `src/locales/{fr,ar}`, `docs/translator.csv` · T06 |
| **PreToolUse commit hook** | Blocks a commit that adds a hard-coded string — demonstrated on camera | `.bob/hooks/gate-commit.mjs` · T10 |
| **GitHub Actions gate** | Fails CI on any new hard-coded string; a public PR goes red → green | `.github/workflows/i18n-gate.yml` · [PR #1](https://github.com/chinmoypaul8897/worldready/pull/1) |

An honest **plain-Bob baseline** (the same task with *no* kit) is committed as a fairness control (T11).

## How it works (5 steps)

1. **Extract.** Bob's `i18n-extractor` mode + `i18n-extract` skill run five parallel subagents that move every user-visible string (JSX, attributes, toasts, data files) into i18next keys — English kept byte-identical.
2. **Wire real i18n.** i18next + language detector, a language switcher, and locale-aware `Intl` number/date/relative-time formatting — including CLDR plurals (Arabic's six forms).
3. **Translate + review.** Bob drafts French (Québec) and Arabic following a glossary and style guide, and emits a **translator round-trip spreadsheet** so a native reviewer edits drafts, not code.
4. **Go right-to-left.** Physical `left`/`right` classes become logical utilities, directional icons mirror, `<html dir>` flips, and Noto Sans Arabic loads — English layout stays pixel-identical.
5. **Keep it at zero.** A commit hook and a GitHub Actions gate fail the build on any new hard-coded string, so the retrofit doesn't rot.

## Run it locally

```bash
git clone https://github.com/chinmoypaul8897/worldready.git
cd worldready
npm install

# Dev server with the in-memory demo mock (no backend needed):
#   PowerShell:  $env:VITE_DEMO=1; npm run dev
#   bash:        VITE_DEMO=1 npm run dev

# The independent verifiers (what produces the headline numbers):
npm run count-literals     # hard-coded user-visible strings  -> 0
npm run key-parity         # en / fr / ar / pseudo key parity -> PASS
npm run score-traps -- --key evidence/traps-key.json --dir .   # -> 24/30
npm run build              # tsc -b && vite build
```

## The live viewer

The [viewer](https://chinmoypaul8897.github.io/worldready/) is the judge's page: a language picker (English / Français / العربية / Pseudo), a **Scan** that outlines hard-coded text across side-by-side Before/After panes, a six-form Arabic plural showcase rendered from the *real* shipped bundle, and an evidence drawer (traps, the held-out key's SHA-256, the translator sheet, Bob sessions, and the gate).

## Honest limits

- **Translations are machine drafts for native review.** The translator round-trip sheet (`docs/translator.csv`) ships for exactly that; five cells are flagged for a human reviewer.
- **24 / 30 traps, not 30.** The 6 residual traps live on error/format code paths off the happy path. They were **never answer-fed**: no Bob prompt referenced any trap item, so the score is earned, not gamed.
- **Trap-key provenance.** An early commit (`918222d`) accidentally contained the trap list for about **3 minutes before any Bob task ran**; no Bob prompt ever referenced it, and the plain-Bob baseline on the same folder is the fairness control. The key's SHA-256 was committed up front ([`evidence/traps-key.sha256`](evidence/traps-key.sha256)) and matches the now-published key.
- **Two small Claude bug-fixes** to Bob's viewer (an iframe reload and a null reference on re-scan) and trivial TypeScript annotations are disclosed in [`bob_sessions/README.md`](bob_sessions/README.md).

## Why WorldReady is different

> **TransCreate localizes developer videos; WorldReady localizes app code — keys, plurals, formatting, RTL, and a gate.** Accessibility tools such as Usher and CurbCut ask whether *everyone* can use the app; **WorldReady asks whether every *market* can.**

Alternatives — **Lingo.dev, i18next-parser, Crowdin** — help you *extract* or *translate*. None retrofit the code traps (plurals, formatting, RTL, data & toasts) **and** install a regression gate in one Bob-driven pass.

## Attribution & licenses

- **Base app:** [IBM Galaxium Travels](https://github.com/IBM/galaxium-travels) booking-system frontend, **Apache-2.0** — the English-only React/Vite app WorldReady internationalizes. Its license is preserved as [`LICENSE-GALAXIUM`](LICENSE-GALAXIUM).
- **WorldReady kit, scripts, verifiers and docs:** **MIT** — see [`LICENSE`](LICENSE).
- Every external data/code source (name, URL, license, use) is recorded in [`DATA_SOURCES.md`](DATA_SOURCES.md).

<div align="center">

**Built with IBM Bob 2.0** · IBM Bob 2.0 Hackathon · lablab.ai · September 2026

</div>
