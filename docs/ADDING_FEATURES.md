# Adding Features to LEGEND Without Growing the Monolith

This guide records where a new gameplay change belongs in the current production architecture. It applies to the active classic-script game under `index.html`, not the isolated `prototypes/reboot/` project.

## First rule: keep the public facade stable

Production scripts are loaded in order by `index.html` and publish APIs on `window`. Most feature modules export a small `create(context)` or `render(context)` API, and controllers pass their dependencies explicitly. Preserve existing public names such as `LegendAshmereV099`, `LegendRegionsV100`, and `LegendRoadControllerV100` when adding a feature. Do not add another global click interceptor or a second router.

When introducing a new script, add it to `index.html` before the module that consumes it, and bump its cache query token. Add `node --check path/to/new-file.js` to `.github/workflows/playwright.yml`.

## Where each kind of feature belongs

| Title menu or title presentation cue | `js/screens/title-screen-v120.js` for markup/actions; `js/systems/title-audio-v120.js` for ambience and UI sounds | Preserve menu CSS hooks and injected navigation callbacks | Load the audio service before the title screen; keep player/navigation state in `LegendGameBootstrap` |

| Feature type | Data / rules | View / interaction | Public wiring |
| --- | --- | --- | --- |
| Ashmere or Greyfen town screen | The relevant domain module under `js/systems/town/` | Same module, using injected `head`, `screen`, and artwork helpers | Add a destination to `js/systems/town/ashmere-navigation-v099.js`; add the feature adapter to `js/systems/town/ashmere-features-v099.js`; retain `LegendAshmereV099.route()` |
| NPC conversation or evidence step | `js/systems/town/ashmere-npc-catalog-v099.js` for baseline character text; `ashmere-greyfen-evidence-story-v099.js` for the Greyfen archive/evidence chain; `ashmere-npc-story-v099.js` for general return/cairn dialogue and talk-state progression; `ashmere-npc-dialogue-v099.js` for save/render orchestration | Story services receive the player, NPC id, region, baseline dialogue, and objective updater; the facade injects save/view helpers | Put static copy in the catalog, Greyfen evidence mutations in the quest-specific service, other town dialogue progression in the story service, and DOM wiring only in the facade; keep save flags stable |
| Work Board task | `js/systems/town/ashmere-job-catalog-v099.js` for job definitions, prompts, grades and rewards | `js/systems/town/ashmere-workboard-v099.js` for challenge lifecycle | Add catalog data first; keep persistence and reward decisions in the Work Board service |
| Market, recipe, or equipment option | `js/data.js` for canonical item IDs, names, prices, weapons/armor; `js/systems/town/ashmere-assets-v099.js` for visual/name lookup mappings | `ashmere-market-v099.js`, `ashmere-crafting-v099.js`, or `ashmere-forge-v099.js` respectively | Keep `ashmere-commerce-v099.js` as the dispatcher; route sibling screens through injected callbacks |
| Road encounter or turn action | `js/content/roads/old-road-v100.js` for reusable stage/find/check/enemy data; `js/systems/road/road-state-v100.js` for canonical state helpers | `road-view-v100.js` for scene/battle interaction; `road-combat-v100.js` for combat behavior; `road-actions-v100.js` for travel/search/encounters | Keep `LegendRoadControllerV100` as the expedition facade |
| Road point of interest / clue | `js/content/roads/old-road-v100.js` for base data; `road-poi-catalog-v100.js` for contextual variants; `js/systems/quests/bell-road-evidence-v120.js` for Bell quest flags/memories/objectives | `road-discovery-view-v100.js` renders panels; `road-discovery-v100.js` preserves the public facade; `road-poi-outcomes-v100.js` records evidence and applies rewards/pressure changes; `road-view-v100.js` handles reveal/hotspot interaction | Inject state/save/render callbacks; keep clue selection, panel markup, and stateful outcomes in their own modules |
| Road route fork or special branch decision | `js/systems/road/road-decisions-v100.js` for route/side-story state mutations; `road-poi-catalog-v100.js` for contextual clue selection | `road-discovery-view-v100.js` renders prompts and `road-discovery-v100.js` preserves the public discovery API | Keep decisions injected into discovery; preserve pressure, inventory, flags, and memory behavior |
| Expedition completion or reward | `js/systems/road/road-results-v100.js` for settlement, XP/tokens, first-return reporting and outcome handling | Results module uses injected header/shell/render adapters | Use `LegendProgressionV100.award()` for XP and preserve existing outcome/return routes |
| Region unlock or travel rule | `js/systems/region-service-v100.js` for prerequisites, unlock tokens, fares, state mutations, memories and saves | `js/systems/region-view-v100.js` for cards/map affordances | Keep `LegendRegionsV100.render/unlock/travel` as the public facade |
| Player identity or starting equipment | `js/data.js` for classes/origins/keepsakes; `js/systems/player/player-record-v094.js` for the resulting record; `player-creation-options-v094.js` for personality/gender options | `player-creation-view-v094.js` for the seven-step creation UI | Preserve `LegendBeginningV094` and `LegendStorage` API methods |
| Progression or level-up | `js/systems/progression-v100.js` is the one XP/level rule owner | Road combat/results display the returned award summary | Preserve the threshold and level-up contract; a gameplay-rule change must update contract tests and documentation together |
| Account/profile/cloud slot | `js/systems/account/account-profile-store-v09x.js` for local profile metadata; `cloud-traveler-slots-v09x.js` for cloud slot CRUD; `account-auth-v09x.js` for auth | `account-profile-view-v09x.js` and `account-auth-view-v09x.js` | Preserve the account facade and current storage/table contracts |

## Current data and save contracts

- Add new item IDs to `LEGEND_DATA.itemNames` in `js/data.js`. The current normalizer fills missing canonical inventory keys with zero. Add display/asset aliases to the town asset helper where needed.
- Region IDs in `LEGEND_DATA.regions` are save data. Keep names/IDs stable. Use `available:false` for mapped-but-unplayable regions rather than exposing a region that has no playable loop.
- Flags, quest-log prefixes, region IDs, item IDs, and equipment IDs are used across services and saves. Treat renames as migrations, not refactors.
- `LegendStorage` owns player save/load/delete and exposes the stable `baseSkills()` and `normalize()` facade methods. `LegendPlayerNormalizerV120` owns defaulting/normalization rules; `LegendSettingsStorageV120` owns device-local accessibility preferences.
- `LegendQuestLogV120` is the shared helper for updating the Bell quest objective. Reuse it rather than implementing a second matching/replacement routine.
- Current-only player saves use `LEGEND_DATA.SAVE_KEY`; do not resurrect legacy recovered-build imports, change the key, or clear saves as part of a feature.

## Feature implementation checklist

1. Put data/decisions in the owner listed above; keep markup and DOM listeners with the appropriate view.
2. Pass dependencies through the existing context object. Avoid reaching into another module's closure or introducing new document-wide click rewriting.
3. If a route is user-facing, register it in the navigation map and feature dispatcher, and load the script before the facade.
4. Preserve the public facade and save fields. Add new flags/IDs rather than reusing a similarly named field with different semantics.
5. Update architecture/save-contract docs when the ownership or persisted state really changes.
6. Add a focused regression test for the behavior plus a journey-level assertion where the player experiences it. A passing PR-local test run checks the branch's local server; it does not verify the live GitHub Pages deployment.
7. Review every changed file's syntax and script load order; check that the changed script URL has a fresh cache token.

The goal is not to make every helper its own file. Split a module when the new behavior has a distinct owner or a clear testing boundary; keep cohesive operations together.
