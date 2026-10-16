# Production architecture baseline
Updated: 2026-10-16

This is a working map of the production browser game, not the isolated reboot prototype. It records boundaries to preserve during incremental refactoring.

## Runtime model

- `index.html` is the production entry point. The game uses classic browser scripts and shared `window` namespaces rather than ES modules or a bundler.
- `js/data.js` defines `window.LEGEND_DATA` (version, active save key, legacy keys, classes, item names/prices, and region definitions).
- `js/storage.js` owns player normalization, player save/load, and per-device settings persistence through `window.LegendStorage`.
- `js/game.js` owns title-menu rendering and routes actions to narrower systems. It publishes `window.LegendGameBootstrap`.
- Other systems are loaded by explicit script tags. Several are accessed lazily when the player selects an action, so do not reorder or convert script tags without checking call timing and global dependencies.

## Important script boundaries

| File | Responsibility / public boundary |
| --- | --- |
| `js/data.js` | Game data and save-key definitions; `window.LEGEND_DATA` |
| `js/version-v090.js` | Applies the canonical display title and version to `LEGEND_DATA` |
| `js/storage.js` | Player and settings persistence; `window.LegendStorage` |
| `js/core/runtime-v080.js` | Legacy runtime bridge for save loading and continue/return-to-town behavior |
| `js/systems/progression-v100.js` | Progression award helper; `window.LegendProgressionV100` |
| `js/systems/assets-v090.js` | Shared asset references; `window.LegendAssetsV090` |
| `js/systems/account-v09x.js` | Profile/account UI; `window.LegendAccountV09x` |
| `js/game.js` | Title menu, settings-screen entry point, credits, and navigation adapters; `window.LegendGameBootstrap` |
| `js/systems/beginning-v094.js` | Traveler creation flow; called through `LegendBeginningV094` |
| `js/systems/ashmere-controller-v099.js` | Ashmere rendering/controller; called through `LegendAshmereV099` |
| `js/systems/region-controller-v100.js`, `js/systems/road-controller-v100.js`, `js/systems/scene-transitions-v120.js` | Region travel, road flow, and scene-transition behavior; inspect their own boundaries before extraction |

The settings screen is now a separate, small production module at `js/screens/settings-screen-v090.js`. Its renderer receives persistence and navigation callbacks; it does not own storage keys or mutate player state. Keep that boundary narrow.

## Persistence contracts — do not casually rename

- Active player save key: `legend-roads-of-ashmere-v09` (`LEGEND_DATA.SAVE_KEY`).
- Historical player-save keys: `LEGEND_DATA.OLD_KEYS`, plus legacy fallbacks in `js/core/runtime-v080.js`. Read both paths before modifying compatibility behavior.
- Settings key: `legend-settings-v1`, owned by `js/storage.js`.
- Title-gate session key: `legend-roads-of-ashmere-title-gate-v09x`, used by the older optional title-gate flow.
- Runtime return key: `legend-v080-return-ashmere`, owned by the runtime bridge.

The settings extraction does not change the player save shape, these storage keys, normalization, or save/load behavior.

## Refactor guardrails

1. Prefer one responsibility and a small, reversible diff per extraction.
2. Keep global names and script load order stable until all call sites are migrated deliberately.
3. Do not mix refactoring with story/content/features or title visual changes.
4. Source-review the affected contracts and run focused checks after each slice. Playwright debugging remains deferred for this effort.
