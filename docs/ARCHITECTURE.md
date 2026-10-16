# Production architecture audit
Updated: 2026-10-16

This is a working map of the production browser game. It is not a map of `prototypes/reboot/`. The code uses classic browser scripts and shared `window` namespaces, so script order and global names must be treated as runtime contracts.

## Entry point and module model

- `index.html` loads the production scripts directly, in an explicit order. There is no bundler or native ES-module graph.
- `js/data.js` defines `window.LEGEND_DATA`: version, active save key, legacy keys, class/origin/keepsake data, item names/prices, and region definitions.
- `js/storage.js` publishes `window.LegendStorage` and owns player normalization, save/load/delete, and settings persistence. See `docs/SAVE_DATA_CONTRACT.md` for the current field map, keys, normalization behavior, and compatibility guardrails.
- `js/screens/title-screen-v120.js` owns the active title menu, title ambience/UI cues, transition notice, optional gate screen, and credits dialog. Navigation actions are injected.
- `js/game.js` is the thin bootstrap/navigation adapter for continue, new traveler, account, settings, and title-screen callbacks. It publishes `window.LegendGameBootstrap`.
- `js/screens/settings-screen-v090.js` owns settings presentation and its control binding. Persistence remains in `js/storage.js`.
- Feature systems use classic browser scripts and shared `window` namespaces; injection objects provide the dependencies between extracted screens.

## Confirmed hot spots

| File | Size (source lines) | Responsibility currently mixed together | Refactor direction |
| --- | ---: | --- | --- |
| `js/systems/ashmere-controller-v099.js` | 176 lines | Town route façade, route-board content, hub entry, and runtime initialization | Keep public routes stable and avoid adding feature-screen logic to the router |
| `js/systems/town/ashmere-assets-v099.js` | 95 lines | Item ID aliases, item display names, region/art lookups, equipment names, and icon markup | Own town presentation/catalog helper mappings via injected data/assets/player accessors |
| `js/systems/town/ashmere-view-v099.js` | 84 lines | Town framing, header/back controls, and pointer/click UI-audio bindings | Own the shared screen shell; receive player, image, icon, and navigation adapters through `create()` |
| `js/systems/town/ashmere-hub-v099.js` | 79 lines | Ashmere/Greyfen home-screen goal selection, route strip, destination cards, status, and footer navigation | Own the hub presentation; receive formatting, image, shell, and navigation helpers through context |
| `js/systems/town/ashmere-features-v099.js` | 223 lines | Shared dependency assembly and dispatch to records, jobs, commerce, people, inn, contracts, and crossing modules | Own feature adapters; keep feature modules independently injected and route-compatible |
| `js/content/roads/old-road-v100.js` | Data-only catalog | Old Road metadata, route checks, finds, enemies, six stage scenes, and base points of interest | Keep reusable road text/data separate from stateful expedition logic |
| `js/systems/road-controller-v100.js` | 171 lines | Expedition state/transitions, camp interactions, combat context and module initialization | Keep as expedition orchestrator; effects, presentation, discovery, and settlement are delegated |
| `js/core/game-runtime-v120.js` | 102 | Return-to-Ashmere/navigation bridge | Player load/save delegates to `LegendStorage`; retain return/recovery flow until browser-verified |
| `js/storage.js` | 132 | Player normalization, save/load/delete, settings storage and accessibility settings | Document and test current persistence contracts before changing them |
| `js/screens/title-screen-v120.js` | 168 | Active title menu markup, title audio, transition notice and credits | Keep presentation and local title interactions separate from navigation/player-state owners |
| `js/game.js` | 104 | Continue/new-traveler/account/settings adapters and `LegendGameBootstrap` | Keep as a thin entry/facade layer, not a dumping ground for feature systems |
| `js/systems/beginning-v094.js` | UI flow + choice state | Seven-step traveler creation, choice validation, and intro transition | Keep presentation/choice state here; delegate persisted record construction to the focused builder |
| `js/systems/player/player-record-v094.js` | Focused record builder | Starting identity, stats, inventory/equipment, quest log, memories, and storage normalization adapter | Keep player record assembly independent of UI rendering and pass catalogs/normalization explicitly |
| `js/systems/town/ashmere-records-v099.js` | 98 | Traveler sheet and journal/archive screen rendering | Read-only view module; shared dependencies are passed in explicitly |
| `js/systems/town/ashmere-workboard-v099.js` | 151 | Job definitions, work board, timing/choice/sequence challenges, rewards and completion loop | Owns Work Board gameplay; player access, saving and progression are injected from town facade |
| `js/systems/town/ashmere-commerce-v099.js` | 155 | Market transactions, crafting recipes, smithy gear listings, purchase/equip rules and related rendering | Cohesive commerce boundary; persistence, inventory helpers and town presentation are injected |
| `js/systems/town/ashmere-people-v099.js` | 262 | Ashmere/Greyfen people lists, NPC dialogue, returning-traveler evidence text and token hand-in shortcut | Preserves dialogue, quest-flag branches, and journal updates with injected dependencies |
| `js/systems/town/ashmere-inn-v099.js` | 46 | Inn screen, rest/supply purchases, and region-sensitive rumors | Owns existing inn service interactions; persistence and view helpers are injected |
| `js/systems/town/ashmere-contracts-v099.js` | 137 | Side-contract definitions/counters, accept/turn-in handling, Greyfen Dry Crossing choices and rewards | Owns current contract/crossing logic; player/save/progression/navigation dependencies are injected |
| `js/systems/road/road-discovery-v100.js` | 224 lines | Points of interest, route choices, evidence flags, moved-cairn decisions, discovery rewards, and journal updates | Own discovery/story consequences through injected state, save, and render adapters |
| `js/systems/road/road-view-v100.js` | 132 lines | Scene rendering, DOM-preserving shell updates, sound toggle, hotspot event delegation, and expedition header markup | Own presentation/input mechanics; injected callbacks route gameplay actions to their state owners |
| `js/systems/road/road-actions-v100.js` | 96 lines | Travel/search resolution, pressure, skill checks, finds, and encounter selection | Own the effectful road action layer through injected save/state/render/combat services |
| `js/systems/road/road-results-v100.js` | 68 lines | Expedition reward/XP/token settlement, first-return story report, and outcome screen | Own settlement/reward decisions through injected persistence, progression, view, and town-return adapters |
| `js/systems/road/road-combat-v100.js` | 165 | v100 turn-based battle display, commands, enemy intents, player actions, victory rewards and progression | Combat module injected with save, expedition, progression, and audiovisual adapters |
| `js/systems/road/road-audio-v100.js` | 55 | Road sound preference, UI tones, battle sound effects, and battle music lifecycle | Single road-audio API for the v100 expedition and combat modules; owns `legend-road-sound` preference |

## Road-controller overlap audit

- `index.html` now loads only `js/content/roads/old-road-v100.js` and `js/systems/road-controller-v100.js` for road content and expedition flow.
- `LegendRoadControllerV100` is the sole active road controller. The old v087 controller and its button-interception side effect have been removed from the production path and the source file is deleted.
- Road content now exports `window.LegendRoadsV100`; the old `LegendRoadsV087` namespace is no longer used.
- Active v100 state is `flags.roadExpeditionV100`, and XP/rewards come from `LegendProgressionV100.award` and the v100 expedition rules. The normalizer discards legacy `flags.roadV087`/`xpUntil` state rather than trying to translate it.
- Combat behavior is isolated in `js/systems/road/road-combat-v100.js`; sound preference and effects are isolated in `js/systems/road/road-audio-v100.js`.

## Runtime and storage call-site inventory

| Caller | Current dependency | Why the bridge must be preserved for now |
| --- | --- | --- |
| `js/game.js` | Direct `LegendStorage` load/save/settings calls | Title menu uses player presence to choose Begin/Continue; settings are device-local. |
| `js/systems/beginning-v094.js` | Direct `LegendStorage` save/load; `LegendPlayerRecordV094` builder; runtime return fallback | Collects traveler choices, saves the builder-created record, then marks the intro complete and enters the town. |
| `js/systems/account-v09x.js` | Direct `LegendStorage` load/save, including returned traveler data | Profile/account flows depend on the existing player object and storage normalization behavior. |
| `js/systems/ashmere-controller-v099.js` | `LegendRuntimeV120.loadPlayer/savePlayer/onRender` | Town screens read/write current player state; the render hook restores the town shell when necessary. |
| `js/systems/region-controller-v100.js` | Runtime player load/save | Region unlock/travel mutates region, inventory, and travel state. |

| `js/systems/road-controller-v100.js` | Runtime load/save/return | Expedition stage, pressure, combat results, and town return depend on the bridge. |
| `js/core/game-runtime-v120.js` | Delegates player load/save to `LegendStorage` | Also owns pending-return session state, title continue-click fallback, mutation-observer hooks, and return-to-town recovery. |

The static caller inventory is complete enough to guide the next review, but it is not yet proof that the runtime return/MutationObserver hook can be simplified. v087 no longer registers the hook or rewrites click handlers. Keep the hook until title, traveler creation, town, expedition, combat, and return flows have been browser-smoke-tested.

## Critical runtime APIs

| Boundary | Current public API / role |
| --- | --- |
| Game data | `window.LEGEND_DATA` |
| Player/settings storage | `window.LegendStorage` |
| Legacy runtime bridge | `window.LegendRuntimeV120` |
| Progression helper | `window.LegendProgressionV100` |
| Title presentation | `window.LegendTitleScreenV120` |
| Title/bootstrap/navigation | `window.LegendGameBootstrap` |
| Traveler record builder | `window.LegendPlayerRecordV094` |
| Traveler creation | `window.LegendBeginningV094` |
| Ashmere/Greyfen home hub | `window.LegendAshmereHubV099` |
| Ashmere asset/catalog helpers | `window.LegendAshmereAssetsV099.create()` |
| Ashmere shared view shell | `window.LegendAshmereViewV099.create()` |
| Ashmere feature adapter | `window.LegendAshmereFeaturesV099.create()` |
| Ashmere town | `window.LegendAshmereV099` |
| Region travel | `window.LegendRegionsV100` |
| Expedition/road path | `window.LegendRoadControllerV100` |
| v100 road audio | `window.LegendRoadAudioV100` |
| Account/profile | `window.LegendAccountV09x` |
| Scene transition click delegation | `window.__legendSceneTransitionsV120` and document-level handlers |

These APIs are not necessarily ideal long-term boundaries; they are current compatibility points. Inspect the complete call graph before changing them.

## Persistence contracts — do not casually rename

The current field-level contract is maintained in `docs/SAVE_DATA_CONTRACT.md`. Legacy-save import and the v087 controller are intentionally retired from the active path.

- Active player save key: `legend-roads-of-ashmere-v09` (`LEGEND_DATA.SAVE_KEY`).
- Player persistence reads only `LEGEND_DATA.SAVE_KEY`; legacy recovered-build save keys are no longer imported.
- Settings key: `legend-settings-v1`, owned by `js/storage.js`.
- Road audio preference key: `legend-road-sound`, owned by `js/systems/road/road-audio-v100.js`.
- Title-gate session key: `legend-roads-of-ashmere-title-gate-v09x`, used by the older optional title-gate flow.
- Runtime return key: `legend-awakening-return-to-town-v1`, owned by the runtime bridge.
- The player record is JSON in local storage and is normalized in place by `LegendStorage`. Fields, nested flags, inventory IDs, region IDs, and old creation-version fields are consumed by multiple systems.

The settings, records, workboard, commerce, people, inn, contracts/crossing, v100 combat, road-audio extractions, and removal of unused town helpers do not change player-save schema, normalization, active/historical player keys, or settings persistence. The existing `legend-road-sound` preference remains intact and is now owned by the road audio service. The Ashmere controller remains the public router. `renderSheet()` and `renderArchive()` delegate to the records module; `renderWorkBoard()` delegates to the workboard module; `renderTrader()`, `renderCrafting()`, and `renderSmith()` delegate to the commerce module; `renderPeople()` and `renderNPC()` delegate to the people module; `renderInn()` delegates to the inn module; `renderSideContracts()` and `renderDryCrossing()` delegate to the contracts module. These modules receive their required helpers through explicit context values.

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
