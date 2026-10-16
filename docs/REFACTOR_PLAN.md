# LEGEND refactor plan
Last updated: 2026-10-16

## Production status
The title refresh is merged and deployed as **LEGEND: The Awakening v0.20.36**. Desktop deployment was checked at 1440×900. A separate manual mobile-width visual pass remains outstanding. Playwright debugging is explicitly deferred and is not a gate for the refactor steps below.

## Refactor phase: stability before features

This is an incremental extraction of the production game, not a rewrite. Preserve current gameplay, save keys, and saved-player compatibility.

### First extraction: settings screen
- [x] Move settings markup and event wiring into `js/screens/settings-screen-v090.js`.
- [x] Keep settings persistence in `LegendStorage`; inject settings load/save and navigation callbacks into the screen renderer.
- [x] Keep a graceful fallback in `js/game.js` if the screen module is not available.
- [ ] Manually smoke-test opening settings, saving each option, returning to the title, and returning to Ashmere with a loaded player.
- [ ] Add focused automated coverage for save/load and region transitions without changing the save format.

### Sequence
1. **Baseline and inventory:** map script load order, global entry points, persistence keys, and cross-system dependencies before larger moves.
2. **Shared contracts:** document player/save shape, region IDs, item IDs, and system boundaries. Add tests around save/load and region transitions.
3. **UI and routing:** centralize screen transitions and reusable dialog behavior while retaining existing screen markup and interactions.
4. **Domain systems:** extract one bounded area at a time (inventory/equipment, combat, progression, travel/regions, shops/crafting/quests). Avoid broad file moves.
5. **Regression gate:** inspect each focused diff and run the relevant non-Playwright checks after each extraction. Keep commits small and revertible; fix regressions immediately.
6. **Resume features:** only after core flows are stable and documented.

## Guardrails
- Do not rename or remove current/legacy storage keys as part of a code-organization change.
- Do not change the player save shape or introduce a migration without a verified bug and backward-compatibility coverage.
- Do not add new classes, regions, combat mechanics, crafting features, or content expansions during this phase.
- Do not replace production game code with the Phaser prototype or perform a full framework rewrite.
- Defer Playwright debugging; prefer bounded source review and targeted checks for these refactor steps.
