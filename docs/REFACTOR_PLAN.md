# LEGEND refactor plan
Last updated: 2026-10-16

## The actual goal: a substantial, staged production refactor

The goal is not simply to make `js/game.js` smaller. LEGEND's production code has accumulated overlapping controller generations, wide controllers that own many unrelated screens, implicit save/data contracts, and browser-global dependencies. Refactor those boundaries in small, reviewable slices while keeping the existing game playable and all current saves compatible.

The reboot prototype under `prototypes/reboot/` is not the target. Do not replace production with it, and do not turn this into a framework rewrite.

## Confirmed structural hot spots

- `js/systems/ashmere-controller-v099.js`: started at 93.6 KB / 883 lines. After the current branch's extractions, it is about 26.7 KB / 398 lines; the town shell/router and shared helpers remain, while records, jobs, commerce, people/NPCs, inn, and contracts/crossing now have dedicated modules.
- `js/systems/road-controller-v100.js`: approximately 59 KB / 654 lines. It combines expedition scenes, road choices, points of interest, camping, quest decisions, combat, and audio effects.
- `js/systems/road-controller-v087.js`: still loaded alongside v100; contains a second road/combat implementation and its own XP logic. Its live references must be traced before retiring or consolidating it.
- `js/core/runtime-v080.js` duplicates legacy save fallbacks as well as return-to-Ashmere behavior already adjacent to `LegendStorage`. Persistence ownership needs to be clarified before this bridge can be simplified.
- `index.html` loads versioned classic scripts that publish APIs on `window`. Script order and global names are part of the runtime contract until migrated deliberately.
- `js/storage.js` normalizes the player record, but its data shape is implicit rather than described by a stable save contract.

## Refactor phases

### 0. Baseline and contracts
- [x] Record production script boundaries and critical storage keys in `docs/ARCHITECTURE.md`.
- [x] Start a low-risk settings-screen extraction as a first wiring/pattern exercise (draft PR #17; not deployed).
- [x] Begin the road-controller call-site audit: `LegendRoadControllerV100` is the preferred path from Ashmere; `LegendRoadControllerV087` is still loaded and remains a fallback, so it is not removed in this phase.
- [x] Extract v100 enemy intent, class techniques, fight rendering/actions, and victory rewards into `js/systems/road/road-combat-v100.js`; preserve the existing expedition controller entry point and inject state/audio/progression adapters.
- [x] Extract road sound preference, UI tones, battle effects, and battle music into `js/systems/road/road-audio-v100.js`; preserve the existing `legend-road-sound` preference and delegate both expedition and combat controls to the same audio service.
- [x] Document the current player/save shape, keys, legacy fallback, dynamic flags/stats, item/region IDs, and v087/v100 XP compatibility in `docs/SAVE_DATA_CONTRACT.md`.
- [ ] Complete the caller/side-effect audit for `LegendRuntimeV080` and `LegendStorage` before simplifying those bridges.
- [x] Extract the traveler sheet and archive/journal screens into `js/systems/town/ashmere-records-v099.js`, leaving the existing Ashmere route names as compatibility wrappers.
- [x] Extract Work Board data, challenge rendering, and job completion/reward logic into `js/systems/town/ashmere-workboard-v099.js`; keep the existing `work` route as the entry point and inject player/save/progression dependencies.
- [x] Extract trader, buy/sell, crafting recipes, equipment browsing, and purchase/equip behavior into `js/systems/town/ashmere-commerce-v099.js`; keep current routes and inject persistence/presentation helpers.
- [x] Extract inn rendering, rest/supply purchases, and rumors into `js/systems/town/ashmere-inn-v099.js`; preserve existing service costs and inject persistence/presentation helpers.
- [x] Extract side-contract counters, acceptance/turn-in rewards, Greyfen crossing choices/retries, and existing evidence text into `js/systems/town/ashmere-contracts-v099.js`; preserve quest flags and inject player/save/progression/navigation helpers.
- [ ] Smoke-test traveler records, NPC evidence dialogue, side-contract acceptance/turn-in, Dry Crossing safe/risky routes, work board challenge modes/rewards, market/crafting/gear, inn services, and return navigation.
- [x] Document the player/save shape, core flags, region IDs, item IDs, and current script load order before moving domain logic.

### 1. Split the Ashmere monolith
Keep `LegendAshmereV099` as a compatibility façade while moving responsibilities to narrow town modules. The current branch has extracted:
1. traveler sheet and archive/records;
2. work board and activity/jobs;
3. trader, inventory transactions, crafting, smithing, and gear;
4. people/NPC dialogue and town keeper interactions;
5. inn and lodging services;
6. side contracts and the Greyfen Dry Crossing.

Still to review:
1. town shell and navigation helpers; then simplify the compatibility façade only after a caller inventory.

Pass shared dependencies through small context objects or explicit function arguments instead of introducing more hidden global coupling. Keep current HTML/CSS classes and saved flags stable in this phase.

### 2. Consolidate road and combat ownership
- [x] Extract the v100 combat implementation behind a focused module boundary.
- [x] Confirm v100 is preferred in the Ashmere road-entry adapter; v087 is still a loaded fallback and an event-interception path, so defer removal until its live behavior is resolved.
- [x] Record key v087/v100 behavior conflicts from source: v087 uses `flags.roadV087`, its own `xpUntil` countdown and +22 max-HP level-up; v100 uses `flags.roadExpeditionV100`, `LegendProgressionV100.award`, +8 max HP per level, battle victory stats, and different Road Token reward timing.
- [ ] Verify these differences against actual saved-player flows and manually smoke-test v100 before considering legacy retirement.
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
