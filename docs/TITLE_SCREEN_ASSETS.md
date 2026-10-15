# LEGEND: The Unquiet Road — Title & Menu Art

## Current direction

The active production title screen is rendered by `js/game.js`; it layers the committed landscape behind a transparent, left-aligned hero and accessible HTML controls. Do not add a second title replacement overlay. Keep one clear brand, one primary action, concise player context, and Settings/Profile secondary actions.

## Stable art

- `assets/generated/title/title-ashmere-road.webp` — 1536×857 cinematic title background, local and cache-independent.
- `assets/ui/logos/logo_legend_awakening_wordmark.svg` — full antique-gold LEGEND: The Awakening wordmark used on the title screen.
- `assets/ui/icons/awakening-sigil.svg` — compact title insignia used in the top bar.
- `css/title-screen-v135.css` — final cinematic layout and mobile behavior, loaded after earlier title passes.
- `js/systems/assets-v090.js` — stable local manifest for the panorama, wordmark, and sigil.
- `js/game.js` — active title rendering and menu actions.

## Behavior and QA

- New traveler flow must remain one obvious primary action.
- With an existing save, Continue is primary and New Traveler is secondary.
- Settings/Profile stay available but visually quiet.
- Preserve keyboard focus, readable contrast, 390px mobile layout, and `prefers-reduced-motion`.
- Background failure should fall back to the previous local Ashmere title scene.
- See [PRODUCTION_ASSET_PACK.md](PRODUCTION_ASSET_PACK.md) for all town/road portraits and [ART-DIRECTION.md](ART-DIRECTION.md) for shared visual rules.
