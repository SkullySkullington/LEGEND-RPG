# LEGEND refactor plan
Last updated: 2026-10-16

## The actual goal: a substantial, staged production refactor

The goal is not simply to make `js/game.js` smaller. LEGEND's production code has accumulated overlapping controller generations, wide controllers that own many unrelated screens, implicit save/data contracts, and browser-global dependencies. Refactor those boundaries in small, reviewable slices while keeping the new active game path coherent. Legacy recovered-build saves are no longer supported, by project direction.

The reboot prototype under `prototypes/reboot/` is not the target. Do not replace production with it, and do not turn this into a framework rewrite.

## Confirmed structural hot spots

- `js/systems/ashmere-controller-v099.js`: started at 93.6 KB / 883 lines. After the current branch's extractions, it is about 9.4 KB / 176 lines; the route façade and initialization remain, while records, home hub, shared screen shell, catalog/art helpers, feature-context assembly, jobs, commerce, people/NPCs, inn, and contracts/crossing live in focused modules.
- `js/systems/road-controller-v100.js`: now about 19.8 KB / 257 lines; owns expedition state/transitions, camping, checks, combat handoff, and completion. Content, discovery, and presentation/input are delegated to focused road modules.
- `js/systems/road-controller-v087.js`: retired and deleted from the active project; v100 is now the only road controller.
- `js/core/game-runtime-v120.js` delegates player persistence to `LegendStorage`; it remains as the return/navigation bridge while its observer/recovery behavior awaits browser verification.
- `js/game.js` shrank from 325 to about 104 lines after extracting the active title screen into `js/screens/title-screen-v120.js`; current menu markup/classes and navigation actions are preserved.
- `index.html` loads versioned classic scripts that publish APIs on `window`. Script order and global names are part of the runtime contract until migrated deliberately.
- `js/storage.js` normalizes the player record, but its data shape is implicit rather than described by a stable save contract.

## Refactor phases

### 0. Baseline and contracts
- [x] Record production script boundaries and critical storage keys in `docs/ARCHITECTURE.md`.
- [x] Start a low-risk settings-screen extraction as a first wiring/pattern exercise (draft PR #17; not deployed).
- [x] Retire and delete the v087 road controller and make `LegendRoadControllerV100` the only road entry point; move road data to `LegendRoadsV100`.
- [x] Extract v100 enemy intent, class techniques, fight rendering/actions, and victory rewards into `js/systems/road/road-combat-v100.js`; preserve the existing expedition controller entry point and inject state/audio/progression adapters.
- [x] Extract road sound preference, UI tones, battle effects, and battle music into `js/systems/road/road-audio-v100.js`; preserve the existing `legend-road-sound` preference and delegate both expedition and combat controls to the same audio service.
- [x] Document the current player/save shape, active key, dynamic flags/stats, item/region IDs, and v100 progression contract in `docs/SAVE_DATA_CONTRACT.md`.
- [x] Inventory current production callers of `LegendRuntimeV120` and direct `LegendStorage` users: title/bootstrap, traveler creation, account/profile, Ashmere/region screens, and the active v100 road controller.
- [x] Complete the current persistence ownership pass: `LegendStorage` is the sole owner of player save/load; `LegendRuntimeV120` delegates to it and retains return/navigation only.
- [x] Extract starting player record construction from the seven-step traveler-creation UI into `js/systems/player/player-record-v094.js`; preserve starting values and verify merged origin/keepsake inventory with a browser regression test.
- [x] Extract active title rendering, title audio hooks, transition notice, optional gate screen, and credits into `js/screens/title-screen-v120.js`; inject navigation handlers through `LegendGameBootstrap` and remove unused legacy portal/menu builders from `js/game.js`.
- [x] Extract the traveler sheet and archive/journal screens into `js/systems/town/ashmere-records-v099.js`, leaving the existing Ashmere route names as compatibility wrappers.
- [x] Extract Ashmere/Greyfen home goal selection, destination cards, status, and footer navigation into `js/systems/town/ashmere-hub-v099.js`; keep `LegendAshmereV099.renderAshmere()` as the routed façade.
- [x] Extract the town shell, header/back controls, and UI audio bindings into `js/systems/town/ashmere-view-v099.js`; inject player, art, and route callbacks and preserve the existing markup/hooks.
- [x] Move town feature context assembly and feature-screen dispatch into `js/systems/town/ashmere-features-v099.js`; retain the existing `LegendAshmereV099.route()` contract.
- [x] Extract shared item/art lookup maps and catalog presentation helpers into `js/systems/town/ashmere-assets-v099.js`; inject data/assets/player accessors while preserving icon, equipment-name, and region-art mappings.
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
1. the route dispatcher and route-board content; simplify the compatibility façade only after a caller inventory and focused flow coverage.

Pass shared dependencies through small context objects or explicit function arguments instead of introducing more hidden global coupling. Keep current HTML/CSS classes and saved flags stable in this phase.

### 2. Consolidate road and combat ownership
- [x] Extract the v100 combat implementation behind a focused module boundary.
- [x] Move route choice, POI interactions, evidence recording, and discovery rewards into `js/systems/road/road-discovery-v100.js`; retain the existing `LegendRoadControllerV100` entry point and injected state/save/render contracts.
- [x] Extract Old Road scene markup, DOM-preserving shell, sound toggle, hotspot delegation, and expedition header into `js/systems/road/road-view-v100.js`; keep gameplay mutations injected.
- [x] Move reusable Old Road stage descriptions and base point-of-interest definitions into `js/content/roads/old-road-v100.js`; retain route/state-dependent clue variants in the controller.
- [x] Make v100 the sole active road path and remove its v087 fallback/interceptor.
- [x] Remove legacy save-key import, the runtime’s duplicate persistence fallback, `xpUntil` from new travelers, and `roadV087`/`xpUntil` fields from normalized active saves. The v100 progression rules are now authoritative.
- [ ] Browser-smoke-test active v100 flows and confirm XP, level-up, token rewards, audio, and return-to-Ashmere.
- Make progression/reward decisions come from one clearly owned service where feasible.
- Redirect call sites in small steps. Only remove a legacy path after static reference review and a focused manual regression pass show it is unused.

### 3. Establish state and persistence contracts
- [x] Make `LegendStorage` the single owner for player-save and settings persistence.
- [x] Retire imports from old `legend-recovered-build-v0*` keys; only the current active save key is supported.
- [x] Remove the v087-specific `xpUntil`/`roadV087` progression state from new/normalized current saves.
- Describe normalized player fields, region values, inventory item IDs, and flags. Add a save-fixture test or lightweight validation without altering stored data.
- Avoid schema migration until a real compatibility bug is found and tested.

### 4. Reduce shared UI/runtime coupling
- [x] Introduce focused title and settings screen boundaries with navigation injected through `LegendGameBootstrap`.
- Create a broader shared navigation contract only after town, traveler-creation, and road call sites have been fully mapped.
- Replace broad document-wide event interception only when every affected caller is understood.
- Keep scene-transition behavior and focus/keyboard interactions intact.
- Extract shared safe HTML/formatting utilities only after the duplication and escaping rules are inventoried.

### 5. Verification and stabilization
For each extraction: review the diff, run syntax checks on changed files, add focused regression coverage, and manually smoke-test the touched production flow where the deployed site is reachable. Playwright is an active CI regression gate; investigate failures from the report before changing assertions. A passing PR-branch run verifies the branch against its local test server, not the deployed GitHub Pages build. Document anything not verified, especially production flows not reached by a live smoke test.

## Guardrails

- No changes to active or historical storage keys merely for organization.
- No breaking save-format changes or resets; preserve backward compatibility.
- Do not mix refactoring with new classes, regions, combat mechanics, story content, or art revisions.
- Do not mass-rename files or strip version suffixes until script references are fully mapped.
- No giant rewrite. Each PR should make a meaningful, bounded structural improvement and remain easy to revert.
- The settings extraction is only the first small slice, not the completion of the major refactor.
