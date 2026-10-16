# LEGEND refactor plan
Last updated: 2026-10-16

## The actual goal: a substantial, staged production refactor

The goal is not simply to make `js/game.js` smaller. LEGEND's production code has accumulated overlapping controller generations, wide controllers that own many unrelated screens, implicit save/data contracts, and browser-global dependencies. Refactor those boundaries in small, reviewable slices while keeping the existing game playable and all current saves compatible.

The reboot prototype under `prototypes/reboot/` is not the target. Do not replace production with it, and do not turn this into a framework rewrite.

## Confirmed structural hot spots

- `js/systems/ashmere-controller-v099.js`: started at 93.6 KB / 883 lines. After the current branch's extractions, it is about 60.6 KB / 706 lines; remaining concerns include town routing, contracts/crossing, people/NPCs, and inn/services. The records, jobs, and commerce responsibilities now have dedicated modules.
- `js/systems/road-controller-v100.js`: approximately 59 KB / 654 lines. It combines expedition scenes, road choices, points of interest, camping, quest decisions, combat, and audio effects.
- `js/systems/road-controller-v087.js`: still loaded alongside v100; contains a second road/combat implementation and its own XP logic. Its live references must be traced before retiring or consolidating it.
- `js/core/runtime-v080.js` duplicates legacy save fallbacks as well as return-to-Ashmere behavior already adjacent to `LegendStorage`. Persistence ownership needs to be clarified before this bridge can be simplified.
- `index.html` loads versioned classic scripts that publish APIs on `window`. Script order and global names are part of the runtime contract until migrated deliberately.
- `js/storage.js` normalizes the player record, but its data shape is implicit rather than described by a stable save contract.

## Refactor phases

### 0. Baseline and contracts
- [x] Record production script boundaries and critical storage keys in `docs/ARCHITECTURE.md`.
- [x] Start a low-risk settings-screen extraction as a first wiring/pattern exercise (draft PR #17; not deployed).
- [ ] Inventory all callers of `LegendAshmereV099`, `LegendRoadControllerV087`, `LegendRoadControllerV100`, `LegendRuntimeV080`, and `LegendStorage`.
- [x] Extract the traveler sheet and archive/journal screens into `js/systems/town/ashmere-records-v099.js`, leaving the existing Ashmere route names as compatibility wrappers.
- [x] Extract Work Board data, challenge rendering, and job completion/reward logic into `js/systems/town/ashmere-workboard-v099.js`; keep the existing `work` route as the entry point and inject player/save/progression dependencies.
- [x] Extract trader, buy/sell, crafting recipes, equipment browsing, and purchase/equip behavior into `js/systems/town/ashmere-commerce-v099.js`; keep current routes and inject persistence/presentation helpers.
- [ ] Smoke-test the traveler sheet, journal entries, work board challenge modes/rewards, market transactions, crafting, equipment purchases, and return navigation.
- [ ] Document the player/save shape, core flags, region IDs, item IDs, and current script load order before moving domain logic.

### 1. Split the Ashmere monolith
Keep `LegendAshmereV099` as a compatibility façade while moving responsibilities to narrow town modules. The current branch has extracted:
1. traveler sheet and archive/records;
2. work board and activity/jobs;
3. trader, inventory transactions, crafting, smithing, and gear.

Still to extract:
1. side contracts and Greyfen crossing;
2. people, NPC dialogue, inn, and remaining town services.

Pass shared dependencies through small context objects or explicit function arguments instead of introducing more hidden global coupling. Keep current HTML/CSS classes and saved flags stable in this phase.

### 2. Consolidate road and combat ownership
- Trace how the v087 road system is entered from current town code and which v100 flows are authoritative.
- Compare combat, rewards, experience, retreat/death handling, flags, and road-token behavior before changing either implementation.
- Make progression/reward decisions come from one clearly owned service where feasible.
- Redirect call sites in small steps. Only remove a legacy path after static reference review and a focused manual regression pass show it is unused.

### 3. Establish state and persistence contracts
- Make `LegendStorage` the single owner for player-save and settings persistence.
- Keep legacy key recovery and the active save key unchanged while clarifying how callers read/write the player.
- Describe normalized player fields, region values, inventory item IDs, and flags. Add a save-fixture test or lightweight validation without altering stored data.
- Avoid schema migration until a real compatibility bug is found and tested.

### 4. Reduce shared UI/runtime coupling
- Create a small, explicit screen/navigation boundary used by the title, town, traveler creation, settings, and road screens.
- Replace broad document-wide event interception only when every affected caller is understood.
- Keep scene-transition behavior and focus/keyboard interactions intact.
- Extract shared safe HTML/formatting utilities only after the duplication and escaping rules are inventoried.

### 5. Verification and stabilization
For each extraction: review the diff, run syntax checks on changed files, add or run relevant non-Playwright checks where available, and manually smoke-test the touched flow (title, traveler creation, Ashmere, travel, combat, return, save/load). Document anything not verified. Playwright debugging remains deferred as agreed; do not claim a flow is verified when it has not been manually checked.

## Guardrails

- No changes to active or historical storage keys merely for organization.
- No breaking save-format changes or resets; preserve backward compatibility.
- Do not mix refactoring with new classes, regions, combat mechanics, story content, or art revisions.
- Do not mass-rename files or strip version suffixes until script references are fully mapped.
- No giant rewrite. Each PR should make a meaningful, bounded structural improvement and remain easy to revert.
- The settings extraction is only the first small slice, not the completion of the major refactor.
