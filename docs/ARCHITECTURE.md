# Production architecture audit
Updated: 2026-10-16

This is a working map of the production browser game. It is not a map of `prototypes/reboot/`. The code uses classic browser scripts and shared `window` namespaces, so script order and global names must be treated as runtime contracts.

## Entry point and module model

- `index.html` loads the production scripts directly, in an explicit order. There is no bundler or native ES-module graph.
- `js/data.js` defines `window.LEGEND_DATA`: version, active save key, legacy keys, class/origin/keepsake data, item names/prices, and region definitions.
- `js/storage.js` publishes `window.LegendStorage` and owns player normalization, save/load/delete, and settings persistence.
- `js/game.js` renders the title and owns entry/navigation adapters, settings entry, and credits. It publishes `window.LegendGameBootstrap`.
- Feature systems are separate files but often have broad responsibilities and call each other via `window` APIs.
- The current settings extraction on draft PR #17 adds `js/screens/settings-screen-v090.js`. It is a small boundary exercise only and is not deployed.

## Confirmed hot spots

| File | Size (source lines) | Responsibility currently mixed together | Refactor direction |
| --- | ---: | --- | --- |
| `js/systems/ashmere-controller-v099.js` | 411 | Town shell/routing and navigation façade; routes to focused town modules | Preserve its public façade and split/clarify remaining navigation and shared helpers |
| `js/systems/road-controller-v100.js` | 527 | Expedition rendering, route and POI choices, camping, special quest decisions, encounter selection/completion | Combat and audio are delegated to focused road modules; keep this file as expedition-flow owner |
| `js/systems/road-controller-v087.js` | 31 very dense lines (~16 KB) | Legacy route, checks/finds, combat, rewards and XP | Trace current usage; do not remove until no active callers remain |
| `js/core/runtime-v080.js` | 110 | Return-to-Ashmere bridge and fallback save code | Make storage ownership explicit; preserve legacy recovery and return behavior |
| `js/storage.js` | 132 | Player normalization, save/load/delete, settings storage and accessibility settings | Document and test current persistence contracts before changing them |
| `js/game.js` | 325 | Title screen, account/settings entry, credits and navigation | Keep it an entry/facade layer, not a dumping ground for feature systems |
| `js/systems/beginning-v094.js` | 47 dense lines (~13 KB) | Multi-step traveler creation and creation-time player record construction | Later extract data construction/validation from step rendering without changing the flow
| `js/systems/town/ashmere-records-v099.js` | 98 | Traveler sheet and journal/archive screen rendering | Read-only view module; shared dependencies are passed in explicitly |
| `js/systems/town/ashmere-workboard-v099.js` | 151 | Job definitions, work board, timing/choice/sequence challenges, rewards and completion loop | Owns Work Board gameplay; player access, saving and progression are injected from town facade |
| `js/systems/town/ashmere-commerce-v099.js` | 155 | Market transactions, crafting recipes, smithy gear listings, purchase/equip rules and related rendering | Cohesive commerce boundary; persistence, inventory helpers and town presentation are injected |
| `js/systems/town/ashmere-people-v099.js` | 262 | Ashmere/Greyfen people lists, NPC dialogue, returning-traveler evidence text and token hand-in shortcut | Preserves dialogue, quest-flag branches, and journal updates with injected dependencies |
| `js/systems/town/ashmere-inn-v099.js` | 46 | Inn screen, rest/supply purchases, and region-sensitive rumors | Owns existing inn service interactions; persistence and view helpers are injected |
| `js/systems/town/ashmere-contracts-v099.js` | 137 | Side-contract definitions/counters, accept/turn-in handling, Greyfen Dry Crossing choices and rewards | Owns current contract/crossing logic; player/save/progression/navigation dependencies are injected |
| `js/systems/road/road-combat-v100.js` | 165 | v100 turn-based battle display, commands, enemy intents, player actions, victory rewards and progression | Combat module injected with save, expedition, progression, and audiovisual adapters |
| `js/systems/road/road-audio-v100.js` | 55 | Road sound preference, UI tones, battle sound effects, and battle music lifecycle | Single road-audio API for the v100 expedition and combat modules; owns `legend-road-sound` preference |

## Road-controller overlap audit

- `index.html` still loads both `js/systems/road-controller-v087.js` and `js/systems/road-controller-v100.js`.
- The Ashmere `startRoad()` adapter prefers `LegendRoadControllerV100.start()` and falls back to `LegendRoadControllerV087.start()` if v100 is unavailable.
- v087 also registers an `intercept()` callback with `LegendRuntimeV080.onRender()` (or a DOM-ready handler) that scans buttons for legacy labels and can replace their click handlers. This is an independent side effect to account for before removing the old script.
- The v100 controller exports `start`, `renderHub`, and `renderExpedition`, and existing smoke-test source references v100 directly. No v087 removal or combat-balancing change is included in this refactor slice.
- Combat behavior is isolated in `js/systems/road/road-combat-v100.js`; sound preferences and effects are isolated in `js/systems/road/road-audio-v100.js`. The controller still owns expedition stage/pressure, encounter selection, road choices, and expedition completion.

## Critical runtime APIs

| Boundary | Current public API / role |
| --- | --- |
| Game data | `window.LEGEND_DATA` |
| Player/settings storage | `window.LegendStorage` |
| Legacy runtime bridge | `window.LegendRuntimeV080` |
| Progression helper | `window.LegendProgressionV100` |
| Title/bootstrap/navigation | `window.LegendGameBootstrap` |
| Traveler creation | `window.LegendBeginningV094` |
| Ashmere town | `window.LegendAshmereV099` |
| Region travel | `window.LegendRegionsV100` |
| Legacy road path | `window.LegendRoadControllerV087` |
| Expedition/road path | `window.LegendRoadControllerV100` |
| v100 road audio | `window.LegendRoadAudioV100` |
| Account/profile | `window.LegendAccountV09x` |
| Scene transition click delegation | `window.__legendSceneTransitionsV120` and document-level handlers |

These APIs are not necessarily ideal long-term boundaries; they are current compatibility points. Inspect the complete call graph before changing them.

## Persistence contracts — do not casually rename

- Active player save key: `legend-roads-of-ashmere-v09` (`LEGEND_DATA.SAVE_KEY`).
- Historical player-save keys: `LEGEND_DATA.OLD_KEYS`, plus a separate legacy fallback list in `js/core/runtime-v080.js`.
- Settings key: `legend-settings-v1`, owned by `js/storage.js`.
- Road audio preference key: `legend-road-sound`, owned by `js/systems/road/road-audio-v100.js`.
- Title-gate session key: `legend-roads-of-ashmere-title-gate-v09x`, used by the older optional title-gate flow.
- Runtime return key: `legend-v080-return-ashmere`, owned by the runtime bridge.
- The player record is JSON in local storage and is normalized in place by `LegendStorage`. Fields, nested flags, inventory IDs, region IDs, and old creation-version fields are consumed by multiple systems.

The settings, records, workboard, commerce, people, inn, contracts/crossing, v100 combat, and road-audio extractions do not change player-save schema, normalization, active/historical player keys, or settings persistence. The existing `legend-road-sound` preference remains intact and is now owned by the road audio service. The Ashmere controller remains the public router. `renderSheet()` and `renderArchive()` delegate to the records module; `renderWorkBoard()` delegates to the workboard module; `renderTrader()`, `renderCrafting()`, and `renderSmith()` delegate to the commerce module; `renderPeople()` and `renderNPC()` delegate to the people module; `renderInn()` delegates to the inn module; `renderSideContracts()` and `renderDryCrossing()` delegate to the contracts module. These modules receive their required helpers through explicit context values.

## Practical extraction strategy

1. Maintain existing public `window.Legend...` facades until all call sites have migrated.
2. Split the Ashmere controller into narrowly scoped town modules first, because it has the broadest mix of unrelated UI/domain responsibilities. Start with the lowest-coupling screen group, not a large rewrite of the whole controller.
3. Inventory v087/v100 road calls and saved flags before consolidating the road system. Treat reward/XP/combat differences as gameplay behavior, not just duplicate code.
4. Keep `LegendStorage` as the only persistence owner; bridge code should request load/save through its API rather than invent another save path.
5. Introduce a small shared navigation contract after the screen paths are mapped. Avoid a second competing router or another document-wide event interceptor.
6. Run focused static checks and manually smoke-test every touched journey; Playwright debugging is out of scope for this pass.

## Rules

- One cohesive responsibility per PR, no unrelated gameplay/content changes.
- Preserve script load order until changed deliberately with verified dependencies.
- No storage-key renames, save resets, or migrations as a side effect of refactoring.
- Prefer simple browser-native modules and explicit data flow; do not add a framework just to reorganize code.
