# WorldReady — Task 09b: taller Before/After panes in the viewer (desktop only)

- **Mode:** Agent
- **Date:** 2026-09-27
- **Bobcoin budget:** 0.3 (stop and tell me if you would exceed it)

On desktop, the viewer's Before/After iframes in `viewer/index.html` are only about 260 px tall, so
the app's hero ("Journey Beyond The Stars") is cut off. Make them about 65–70 % of the viewport tall.

**Diagnosis (provided by Claude Code analysis):** `html, body` are `height: 100%` and `body` is a flex
column. `#pane-area` and `#frames` have `flex: 1; min-height: 0`, so they shrink to leave room for the
plural showcase below; the `height: calc(100vh - 280px)` on `#frames` is overridden by the flex basis.

## Do this (only in `viewer/index.html`, CSS only)

1. Add a desktop-only rule (`@media (min-width: 769px)`) that gives `#pane-area` and `#frames`
   `flex: none`, and `#frames` `height: 68vh; min-height: 460px`. The page may scroll to reach the
   plural showcase and the evidence drawer; that is fine.
2. Do not change the mobile layout (the existing `@media (max-width: 768px)` block, tabs, `.pane { height: 70vh; }`).
3. Change nothing else: no JS, no markup, no other files.

## Acceptance

- Show me the CSS diff.
- Do NOT run the build and do not commit; I verify on desktop and at 390 px.

Push back directly if this is wrong.
