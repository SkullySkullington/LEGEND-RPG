# LEGEND Architecture Refactor Baseline

## Purpose

Refactor the browser RPG in small, reviewable changes while preserving existing gameplay, narrative text, save compatibility, flags, rewards, UI behavior, audio behavior, and event ordering. This document records the starting architecture and the safety rules for the work.

## Current browser load order

The current `index.html` loads classic scripts in this order:

1. `js/data.js` — `window.LEGEND_DATA`
2. `js/version-v090.js`
3. `js/storage.js`
4. `js/core/runtime-v080.js` — save/load and return-to-town bridge
5. `js/systems/progression-v100.js` — currently exposes `window.LegendProgressionV100.award`
6. `js/systems/assets-v090.js`
7. Supabase client, configuration, and account scripts
8. `js/game.js`
9. `js/content/roads/old-road-v087.js` — `window.LegendRoadsV087.oldRoad`
10. `js/systems/road-controller-v087.js` (legacy controller)
11. `js/systems/beginning-v094.js`
12. `js/systems/region-controller-v100.js`
13. `js/systems/ashmere-controller-v099.js`
14. `js/systems/road-audio-v100.js` — expedition sound effects and battle music adapter
15. `js/systems/road-controller-v100.js` — expedition behavior using the audio adapter
16. `js/systems/scene-transitions-v120.js`

Do not reorder or remove scripts until references and runtime behavior have been verified. The presence of both road controller versions is a dependency-audit item, not proof that the older controller is safe to remove.

## Existing responsibilities and integration points

- `js/data.js`: global game data, save-key metadata, and class definitions.
- `js/storage.js`: player persistence and normalization.
- `js/core/runtime-v080.js`: runtime bridge, loading/saving players, and returning to Ashmere.
- `js/systems/progression-v100.js`: XP awards, level thresholds, and HP gains on level-up.
- `js/content/roads/old-road-v087.js`: road content including stages, checks, enemies, and finds.
- `js/systems/road-controller-v100.js`: expedition flow and battle-related behavior; currently a large controller with inline rendering. Audio delegates to `LegendRoadAudioV100` while the controller keeps its existing local call contract.
- `js/systems/road-audio-v100.js`: extracted sound preference, UI tones, battle sound effects, and battle-music lifecycle.
- `js/systems/town-audio-v100.js`: extracted Ashmere hover/confirm cues and their per-control binding behavior.
- `js/systems/ashmere-controller-v099.js`: town actions and inline rendering; delegates town UI cues to `LegendTownAudioV100`.
- `js/systems/region-controller-v100.js`: region/town progression and travel behavior.
- `js/game.js`: core game and scene behavior.

## Invariants

1. Preserve all existing flag names and meanings.
2. Preserve save keys, old-key migration, and player object shape unless a backward-compatible migration is explicitly tested.
3. Preserve exact story/UI text; moving text is allowed, rewriting it is not.
4. Preserve random-number call order where practical; changing it can change gameplay outcomes.
5. Preserve XP thresholds, HP caps, pressure bounds, rewards, stage numbering, quest transitions, and region unlock conditions.
6. Preserve DOM IDs, data attributes, event delegation, accessibility labels, and interaction timing.
7. Keep the existing browser-global interfaces working during incremental extraction.
8. Do not remove legacy code based only on filename/version or assumptions about usage.

## Refactor sequence

### Phase 1 — Baseline and dependency map
- Record script load order and global APIs.
- Inventory gameplay state mutations and inline HTML/event handlers.
- Identify existing Playwright coverage and establish reproducible baseline runs.
- Add targeted regression cases before changing behavior-sensitive code.

### Phase 2 — Data and progression
- Expand existing `LEGEND_DATA` structures instead of duplicating static content.
- Extend progression APIs only when exact current rules are captured by tests.
- Keep existing call signatures working while migrating callers incrementally.

### Phase 3 — Narrative, combat, and expedition
- Extract one responsibility at a time behind compatibility wrappers.
- Preserve side-effect order, save timing, random calls, and narrative strings.
- Add focused tests around each extracted path.

### Phase 4 — Rendering and audio
- [x] Extract the Old Road audio behavior behind `LegendRoadAudioV100` while preserving the existing `legend-road-sound` preference and controller-facing calls.
- [ ] Move markup into shared render functions while preserving DOM contracts.
- [x] Extract Ashmere hover/confirm cues behind `LegendTownAudioV100`, retaining existing asset paths, volumes, throttle, and binding marker.
- [ ] Centralize remaining title audio behind adapters that retain existing toggles and playback behavior.

### Phase 5 — ES modules and cleanup
- Move to named ES-module exports only after the app loading/build/deployment model is verified.
- Remove compatibility wrappers and legacy controllers only after reference searches and regression tests pass.

## Definition of done for each change

- The change has a narrow scope and a reviewable diff.
- Existing and new relevant Playwright tests pass, or any environment limitation is recorded explicitly.
- Story text, save compatibility, and relevant state transitions are checked.
- No gameplay behavior is claimed preserved without evidence from tests or direct comparison.
