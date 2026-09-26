# Data sources

Every external data or code source used by WorldReady (name, URL, license, what we used it for).

| Name | URL | License | Used for |
|---|---|---|---|
| IBM Galaxium Travels (booking system frontend) | https://github.com/IBM/galaxium-travels | Apache-2.0 | Base English-only React/Vite app that WorldReady internationalizes. Copied `booking_system_frontend/` (commit e4e18ae1b05e0c899abaefd920f5ffcb4326b021, snapshot 2026-09-26) into `src/` as the "before" app; seed data from `booking_system_backend/seed.py` used to build the in-memory demo mock. |
| bulletproof-react | https://github.com/alan2207/bulletproof-react | MIT | Generalization check only (not shipped). Ran `scripts/count-literals.mjs` unmodified on `apps/react-vite` (commit 9506629ed003a561c6627735480cce4994244bb4, ~35.9k stars, English-only, no i18n) to show the literal counter works on an unfamiliar app: 105 hard-coded user-visible strings found. Cloned to a temp dir, not committed. See `evidence/generalization.json`. |

