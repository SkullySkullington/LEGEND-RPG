# LEGEND refactor plan
Last updated: 2026-10-15

## Current priority: finish the production title screen
Do not start new gameplay features until the title screen's final art is committed locally, its controls are regression-tested, and the live page has been checked.

### Title completion checklist
- [ ] Commit the approved cinematic castle-and-river background from the generated asset output to a stable repository path.
- [ ] Commit the approved transparent gold LEGEND / THE AWAKENING wordmark.
- [ ] Commit the compass sigil and reusable button-frame assets.
- [ ] Wire only committed local assets into `js/systems/assets-v090.js` and the title view; do not use temporary signed URLs.
- [ ] Keep New Traveler, Continue, Profile, Settings, and Credits behavior intact.
- [ ] Verify image loading, desktop/mobile layout, keyboard focus, reduced-motion behavior, and title-to-game transitions.
- [ ] Run the Playwright smoke tests and verify the deployed site.

## Refactor phase: stability before features
The refactor is an incremental extraction of the existing game, not a rewrite. Preserve current gameplay, save keys, and saved-player compatibility.

1. **Baseline and inventory:** map script load order, global state, localStorage/sessionStorage keys, event handlers, and cross-system dependencies. Capture smoke-test behavior before moving code.
2. **Shared contracts:** document player/save data shape, region IDs, item IDs, and system boundaries. Add tests around save/load and region transitions.
3. **UI and routing:** centralize screen transitions and reusable dialog behavior while retaining existing screen markup and interactions.
4. **Domain systems:** extract one bounded area at a time (inventory/equipment, combat, progression, travel/regions, shops/crafting/quests). Avoid broad file moves.
5. **Regression gate:** run tests after each extraction; keep commits small and revertible. Fix regressions immediately; defer feature requests to the backlog.
6. **Resume features:** only after the core flows are stable and documented.

## Out of scope during the refactor
- New classes, regions, combat mechanics, crafting features, and content expansions.
- Save-format migrations unless a verified bug requires one and backward compatibility is covered by tests.
- A full framework rewrite or replacement of the production game with the Phaser prototype.
