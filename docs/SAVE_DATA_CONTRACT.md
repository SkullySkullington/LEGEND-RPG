# LEGEND player/save data contract
Last reviewed: 2026-10-16

This is a working compatibility contract for the production browser game. It records the current implementation, including legacy behavior that should not be “cleaned up” until its call sites and saves are accounted for. It is not a strict schema validator yet.

## Persistence owners and keys

| Data | Owner | Storage key / behavior |
| --- | --- | --- |
| Active player record | `js/storage.js` / `window.LegendStorage` | `legend-roads-of-ashmere-v09` from `LEGEND_DATA.SAVE_KEY` |
| Legacy player records | `LegendStorage.loadPlayer()` | `LEGEND_DATA.OLD_KEYS`: `legend-recovered-build-v06`, `legend-recovered-build-v051`, `legend-recovered-build-v05`, `legend-recovered-build-v041`, `legend-recovered-build-v04`, `legend-recovered-build-v03`, `legend-recovered-build-v02` |
| Settings | `LegendStorage` | `legend-settings-v1` |
| Road audio preference | `js/systems/road/road-audio-v100.js` | `legend-road-sound` (`off` disables; other/missing values mean on) |
| Pending return to town | `js/core/runtime-v080.js` | session key `legend-v080-return-ashmere` |
| Older optional title gate | `js/game.js` | session key `legend-roads-of-ashmere-title-gate-v09x` |

`LegendStorage.loadPlayer()` reads the active key first and, if no value exists there, selects the first populated legacy key. It parses that selected value and calls `normalize()`. It does not delete the original legacy key or automatically write the migrated record to the active key; a later save writes through the active key. If the selected value is malformed JSON, the load returns `null` rather than trying the next legacy key.

`LegendRuntimeV080` has a separate hard-coded fallback key/list for when `LegendStorage` is unavailable. In the normal `index.html` script order, storage loads before the runtime bridge and the bridge delegates to `LegendStorage`; its fallback remains a separate compatibility path. Do not remove it until its callers and required old-build behavior are verified.

## Normalization behavior

`LegendStorage.normalize(player)` mutates the parsed player object in place and sets `player.version = LEGEND_DATA.VERSION`. It adds defaults for missing fields but does not enforce a strict whitelist or remove unknown fields. Existing unknown inventory entries, stat counters, flags, and nested state must therefore be preserved by refactors.

Current defaults include:

- Identity: `origin` (`Lost Squire`), `keepsake` (`Rusty Charm`), `gender` (`unspoken`), `genderLabel` (`Unspoken`), `pronouns` (`they/them`), `personality` (`kind`), and `personalityLabel` (`Kind-Hearted`).
- Creation bonuses: `creationV094.bonuses` and `creationV090.bonuses`. The normalized `creationV090.bonuses` combines its existing bonuses with `creationV094.bonuses`, with v094 values taking precedence.
- Inventory/equipment: missing item keys from `LEGEND_DATA.itemNames` become zero; missing `ownedWeapons` and `ownedArmor` default to `{hand:1}` and `{none:1}`.
- Stats: missing `stats` becomes an object. Defaults include `monstersDefeated`, `timesDied`, `checksPassed`, `checksFailed`, `oldRoadClears`, `oldRoadSuccesses`, `roadEvents`, `resourcesFound`, `townErrands`, `campsMade`, and `routesDiscovered`. Feature modules currently add additional counters such as `roadVictories` and `pointsOfInterest` dynamically.
- Flags: missing `flags` becomes an object. Known defaults include the Bell/first-road flags, Greyfen evidence flags, Sella errand flags, `introV094Complete`, and `tutorialStep`. Feature modules add more flags dynamically, including `sideContracts`, `greyfenDryCrossingComplete`, `roadExpeditionV100`, and legacy `roadV087` state. Never replace flags with a fixed allowlist.
- Collections and travel: missing `skills`, `mastery`, `memories`, `questLog`, `quests`, `traits`, `bank`, `townTrust`, `npcTalk`, `discoveredRoutes`, `discoveredTowns`, `unlockedRegions`, and `discoveredRegions` get defaults. `currentRegion` defaults to `Ashmere` and is reset to `Ashmere` if it is not in `discoveredRegions`.

The defaults are not a guarantee of strict runtime types for every field; some are only filled when missing. Tightening validation requires a separate, compatibility-tested change.

## Player record fields observed in traveler creation

`js/systems/beginning-v094.js` creates new records with these fields:

| Group | Fields |
| --- | --- |
| Identity | `username`, `gender`, `genderLabel`, `pronouns`, `personality`, `personalityLabel`, `origin`, `className`, `keepsake`, `traits`, `creationV094` |
| World and travel | `world`, `town`, `currentRegion`, `day`, `timeOfDay`, `fatigue`, `roadDanger`, `regionTravelCount`, `discoveredRoutes`, `discoveredTowns`, `unlockedRegions`, `discoveredRegions` |
| Progression | `level`, `hp`, `maxHp`, `xp`, legacy/alternate `xpUntil`, `gold`, `momentum` |
| Inventory and equipment | `inventory`, `weapon`, `armor`, `ownedWeapons`, `ownedArmor`, `bank` |
| Records and systems | `stats`, `flags`, `skills`, `mastery`, `questLog`, `quests`, `memories`, `townTrust`, `npcTalk` |

This is a field map, not an exhaustive schema. Existing saves can contain fields added by later systems or earlier versions.

## Region and item identifiers

- Canonical region definitions and IDs live in `LEGEND_DATA.regions`: `Ashmere`, `Greyfen`, `Ironpass`, `Blackwood`, and `RuinedMarch`. Some listed regions are not yet available for normal play.
- Item/inventory identifiers are keys, not display labels; names live in `LEGEND_DATA.itemNames`. Examples include `roadToken`, `roadHerb`, `roadPoultice`, `bellFragment`, `wispLanternWick`, `food`, `camp`, and `potion`.
- Weapon and armor identifiers are defined in `LEGEND_DATA.weapons` and `LEGEND_DATA.armors`. Current examples include `hand`, `woodenSword`, `ironSword`, `none`, and `clothArmor`.
- `town` and `currentRegion` are not interchangeable in all old records. Keep compatibility fallbacks until all callers are mapped.

## XP and road-controller compatibility warning

The two road controllers currently have different persisted state and progression rules:

- v087 uses `flags.roadV087` and a custom `xpUntil` countdown. Its local level-up code increases max HP by 22 and fully heals the player.
- v100 uses `flags.roadExpeditionV100` and `LegendProgressionV100.award()`. That helper advances from the `xp` field using a level-scaled threshold, increases max HP by 8, and heals by 8. v100 also maintains counters such as `roadVictories`, `monstersDefeated`, and `oldRoadClears` and awards Road Tokens on different events.

Do not remove `xpUntil`, `roadV087`, or any stats/flags merely because the v100 path is preferred. First verify real saved-player compatibility and determine whether v087 still needs to be supported. Do not change XP or reward balance as an accidental side effect of extracting code.

## Refactor invariants

1. Keep `LEGEND_DATA.SAVE_KEY`, `LEGEND_DATA.OLD_KEYS`, settings/session keys, and the `legend-road-sound` preference unchanged during structural refactors.
2. Keep `LegendStorage` as the normal save/load/normalize owner; runtime fallback behavior must be separately reviewed before removal.
3. Preserve unknown fields and dynamically added keys when loading, normalizing, or saving.
4. Do not rename flags, item IDs, region IDs, or equipment IDs without a dedicated migration plan.
5. Before changing normalization, add fixtures from current and older saved-player shapes and verify load/continue/region travel/return-to-Ashmere behavior.
6. No player-save migration or reset is part of the current refactor PR.
