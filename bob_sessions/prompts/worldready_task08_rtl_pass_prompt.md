# WorldReady — Task 08: Right-to-left (RTL) layout pass for Arabic

**Mode:** Agent · **Date:** 2026-09-27 · **Bobcoin budget for this task: 1.0** (push back directly if this is wrong).

The app now ships English + French + **Arabic**. At runtime `src/i18n/index.ts` already sets
`document.documentElement.dir = 'rtl'` and `lang = 'ar'` when Arabic is active (see lines 27–31).
Your job is the **layout** side of RTL: make every screen mirror correctly in `dir="rtl"` **without
changing the English (LTR) rendering by a single pixel.**

## Step 1 — Use an **Explore subagent** to inventory the physical/directional layout

Spawn **one Explore subagent** and have it report (file + line) every place that hard-codes a
horizontal side and would break under `dir="rtl"`:
- Tailwind **physical margin/padding/position** classes: `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`,
  `right-*` (including `ml-auto`).
- Tailwind **physical text alignment**: `text-left`, `text-right`.
- **Directional icons** (they point a specific way): lucide `ArrowLeft` / `ArrowRight` /
  `ChevronLeft` / `ChevronRight`, and any "Back"/"Next" chevrons.
- Inline styles or fixed positions using `left:`/`right:`/`marginLeft`/`marginRight`.

As a cross-check, the independent baseline for this repo is **7 positional/margin hits, 5
text-left/right, 5 directional `ArrowLeft` icons** (in `BookingModal.tsx`, `Header.tsx`,
`Flights.tsx`, `Card.tsx`, `FlightCard.tsx`, `DestinationDetail.tsx`). If your subagent finds
materially more or fewer, say so.

## Step 2 — Convert to logical / direction-aware utilities

- `ml-* → ms-*`, `mr-* → me-*`, `pl-* → ps-*`, `pr-* → pe-*`, `left-* → start-*`, `right-* → end-*`
  (Tailwind 3.4 supports these logical utilities and the `rtl:`/`ltr:` variants natively).
  `ml-auto → ms-auto`. For the Flights search box, the icon `left-3` and input `pl-10 pr-4` must
  become `start-3` and `ps-10 pe-4` so the search icon sits on the correct side in Arabic.
- `text-left → text-start`, `text-right → text-end`.
- **Mirror directional icons** by adding `rtl:-scale-x-100` to the icon's className (so a back
  arrow flips to point the other way in Arabic; it is unchanged in English). Do **not** swap the
  icon component; just add the class. Keep the existing size/color classes.
- If any inline `style={{ left / right / marginLeft / marginRight }}` exists, convert to the
  logical CSS property (`insetInlineStart`/`insetInlineEnd`/`marginInlineStart`/`marginInlineEnd`)
  or a Tailwind logical class.

**Do not** change spacing amounts, colors, sizes, flex direction, or component structure — only the
left/right *axis* handling. `space-x-*`, `gap-*`, `flex`, `justify-*` already mirror automatically
under `dir=rtl`; leave them alone.

## Step 3 — Arabic web font (Noto Sans Arabic), Arabic-only

- Add **Noto Sans Arabic** from Google Fonts. Preferred: add a `<link>` in `index.html`
  (`https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap`,
  with the `preconnect` links). While you are in `index.html`, also fix the stale `<title>` to
  `Galaxium Travels`.
- Apply the font **only when Arabic is active**, so English/French stay on the current Inter/system
  stack and remain pixel-identical. Scope it with a CSS rule keyed on the runtime attribute, e.g. in
  `src/index.css`:
  ```css
  html[lang="ar"] body, [dir="rtl"] body { font-family: 'Noto Sans Arabic', 'Inter', system-ui, sans-serif; }
  ```
  (You may instead add an Arabic `fontFamily` token in `tailwind.config.js` and apply it on the
  `[dir=rtl]` selector — either is fine, but the English path must not change.)

## Constraints (ownership)
- You may edit: any `src/**` component/css, `index.html`, `tailwind.config.js`.
- Do **not** edit `src/locales/**` (translations are done), `src/data/**`, `src/services/**`,
  `scripts/**`, `vite.config.ts`, `.github/**`, `evidence/**`, `src/i18n/index.ts` (the dir/lang
  wiring already works — don't touch it).

## Acceptance checks (state each in your final message)
- A grep of `ml-/mr-/pl-/pr-/left-/right-` and `text-left/right` over `src/**` returns **0 physical
  classes** in component markup (all converted to logical) — or, for any you intentionally kept,
  name the file+line and why.
- All 5 directional icons carry `rtl:-scale-x-100`.
- `index.html` links Noto Sans Arabic and the `<title>` is `Galaxium Travels`.
- The Arabic font is scoped so the **English DOM/classes are unchanged** (English layout pixel-identical).
- `npm run build` (with `VITE_DEMO=1`) stays green.

Keep this to **one task**; the Explore subagent is for discovery only. Push back if any instruction
conflicts with keeping English pixel-identical.
