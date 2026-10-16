# LEGEND refactor plan
Last updated: 2026-10-15

## Current priority: establish the right title identity and RPG menu

The current product title is **LEGEND: The Awakening**. “The Unquiet Road” is a retired working subtitle. The production title should use the approved local landscape and wordmark with a classic RPG-style framed menu, not a collection of website cards or a second splash overlay.

### Current title pass
- [x] Keep the approved local panorama, antique-gold wordmark, and compact awakening sigil.
- [x] Give Continue/Begin one obvious primary action.
- [x] Keep New Traveler, Profile, Settings, and Credits available as quieter menu choices.
- [x] Keep labels in semantic HTML, retain keyboard focus and accessibility settings, and provide responsive/reduced-motion styles.
- [ ] Visually inspect the branch at desktop and mobile widths.
- [ ] Confirm the merged/deployed page when this branch is released.

Do not block title/art direction on Playwright troubleshooting during this pass. Prefer direct source review and manual browser inspection for this visual change.

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
