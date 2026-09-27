# Task 10 (hook demo, phase 1) — add a "New!" badge and try to commit

**Mode:** i18n Extractor. **Bobcoin budget: 0.5.**

This is a deliberate, on-camera test of WorldReady's local commit gate (the PreToolUse hook in `.bob/hooks/gate-commit.mjs`).

1. In `src/components/layout/Header.tsx`, add a small **"New!"** badge — a `<span>` pill placed next to the "Galaxium Travels" logo. Use **logical** Tailwind spacing (e.g. `ms-2`, not `ml-2`) so it stays correct in RTL.
2. For THIS step only, put the visible text as a **plain hard-coded string** `New!` — do NOT wrap it in `t()` yet. We are intentionally checking that the commit gate catches an un-internationalized string.
3. Stage only that file: `git add src/components/layout/Header.tsx`, then run `git commit -m "Add New! badge to header"`.
4. The commit gate is expected to **BLOCK** this commit because "New!" is a hard-coded UI string. After the commit attempt, **STOP** and report the exact message the gate printed. Do **NOT** fix it yet — a follow-up message will handle the proper fix.

Push back if anything is unexpected.
