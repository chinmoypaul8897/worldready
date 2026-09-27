# WorldReady — video script (voice recorded in the morning)

**Target: ≤ 2:50** of narration at ~140 words/min (~370 words). MP4, 1920×1080, H.264, ≤ 3:00 and < 300 MB.
Human voice-over, no dead air. `[CAPTION: ...]` marks an on-screen text overlay (used for the numbers).
Cold open follows NIGHT_CONTEXT red-team fix 3: lead with **"Bob built this app English-only; Bob made it
world-ready"**, the Arabic RTL flip, and the Arabic plural showcase — red outlines are secondary.

All numbers are the **measured** values from `evidence/evidence.json`. Do not change them.

---

### 0:00–0:16 · Cold open (live viewer) — ~35 words
> "Bob built this app — IBM's own demo — English-only. Watch Bob make it world-ready. Here it is in English. Now pick **Arabic**."
- **On screen:** the live viewer at English → click **العربية** → the After pane mirrors to right-to-left.
- `[CAPTION: Bob built this app English-only. Bob made it world-ready.]`

### 0:16–0:30 · Name, tagline, what it beats — ~34 words
> "**WorldReady.** World-ready in a day — proven, and kept that way. Translating text is the easy part. The weeks go into glued plurals, hard-coded prices, left-to-right layout, and English creeping back in."
- **On screen:** title card / the viewer counters strip.
- `[CAPTION: WorldReady — world-ready in a day. Proven, and kept that way.]`

### 0:30–2:00 · Product in action, 90 s, one golden path (live viewer) — ~155 words
> "Start with the live viewer. Before — IBM's English-only app — press **Scan**: forty-seven hard-coded strings light up. After — WorldReady: zero."
- **On screen:** Scan; Before pane red outlines, After pane clean. `[CAPTION: Scan — Before: 47 · After: 0]`
> "Flip to **Arabic** and the whole space-themed app flips with it — navigation mirrored, icons flipped, dates and numbers in Arabic format, destinations translated. **Français**: also clean."
- **On screen:** Arabic RTL home, then French.
> "Here's what machine translation can't do. Arabic has **six** plural forms — showing zero flights, one, two, a few, many, one hundred — all six, rendered from the real shipped bundle. 'One seats left' never happens."
- **On screen:** the Arabic Plural Showcase card (0/1/2/3/11/100). `[CAPTION: Arabic plurals — all 6 forms]`
> "On the flights page the planet route names are translated — but the search filter still finds the same flights. And it holds up on a phone: right-to-left at three-hundred-ninety pixels."
- **On screen:** flights page in Arabic; then the phone-width clip.
> "The proof travels with the app — an evidence drawer with the trap scores, the held-out key's fingerprint, the translator sheet, and every Bob session."
- **On screen:** open the Evidence Drawer → Traps tab.

### 2:00–2:33 · Bob on screen — ~72 words
> "How? All of it was built in **IBM Bob**. Bob planned the retrofit reading the glossary and style guide, then authored a custom **i18n-extractor mode**, a **skill**, and a **commit hook**. **Five subagents** fanned out in parallel and moved three-hundred-five strings into keys. Bob translated to French and Arabic, did the right-to-left pass, and built this viewer."
- **On screen:** Bob IDE — `.bob/` (mode YAML with `fileRegex`, the skill, the hook), the `bob_sessions/` folder, the Tasks list (stills from `bob_sessions/*.png`; do **not** start new paid tasks).
> "Watch the gate. Bob adds a hard-coded badge and commits — the **hook blocks it**. Bob moves it into a key — now it commits."
- **On screen:** `worldready_task10_hook_blocks_commit_chat.png` → `worldready_task10_hook_fix_summary.png`; then PR #1 red → green. `[CAPTION: 17 tasks · 17.67 / 40 Bobcoins]`

### 2:33–2:50 · Recap + call to action — ~58 words
> "What you saw: **three-hundred-five** hard-coded strings to **zero**. **Twenty-four of thirty** i18n traps fixed — scored against a key committed **before** Bob ran, never fed the answers. **Zero** characters of existing English changed. **One** language to **three**. And a gate that keeps it there. Translations are machine drafts for native review. Try it — pick Arabic."
- `[CAPTION: 305 → 0 · 24/30 traps · 0 English changed · 1 → 3 languages · a gate]`
- `[CAPTION: chinmoypaul8897.github.io/worldready]`

---

## Notes for the recorder (morning)
- The **translator read-back beat** (human edits 5 cells → Bob applies "5/5") happens in the morning (P10, task T07). If you record it, drop a ~10 s clip into beat 3 after the plural showcase; otherwise the script works without it.
- Keep total ≤ 3:00 (judges stop at 3:00). This script runs ~2:40 at 140 wpm, leaving headroom.
- Raw clips already captured are listed in `bob-hackathon-tools/video/EDIT_NOTES.md`. A silent first cut with number captions is at `bob-hackathon-tools/video/worldready_cut1_silent.mp4` — lay the voice on top of it.
