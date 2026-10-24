# LEGEND: The Awakening — Title & Menu Art

**Last updated:** 2026-10-16  
**Production title:** **LEGEND: The Awakening**. “The Unquiet Road” is a retired working subtitle and must not appear as the product subtitle in current UI, documentation, or promotional copy.

## Current visual direction

The production title should read as a **fantasy RPG main menu**, not a web landing page. Use the approved panoramic Ashmere landscape as a full-screen scene, with the gold Awakening wordmark and a compact, framed menu panel on the left. The panel should feel like dark-stained timber/blackened iron and aged gold: clear, tactile, slightly ornate, and restrained enough for the landscape to remain present.

The production view is rendered by `js/game.js` and styled by `css/title-screen-v135.css` plus the new last-loaded `css/title-rpg-menu-v136.css`. Do not add a second title replacement overlay. All menu text and controls stay in semantic HTML; text must never be baked into the background image.

## Stable art

- `assets/generated/title/title-ashmere-road.webp` — 1536×857 cinematic title background, local and cache-independent.
- `assets/ui/logos/logo_legend_awakening_wordmark.png` — local transparent Runway raster wordmark; exact visible title is `LEGEND` / `THE AWAKENING`.
- `js/systems/assets-v090.js` — asset manifest for the panorama, generated wordmark, and scene art.
- `js/game.js` — active title rendering and menu actions.
- `css/title-rpg-menu-v136.css` — framed RPG menu, menu hierarchy, responsive behavior, focus state, and motion preferences.

## Menu hierarchy

- With an existing traveler: **Continue Journey** is primary; New Traveler, Profile, Settings, and Credits remain available.
- Without a save: **Begin Your Journey** is primary; Profile, Settings, and Credits remain available.
- The saved traveler summary is contextual information, not a competing action.
- No Quit button: a browser game should not offer a misleading control that cannot reliably close the browser tab.

## Behavior and art guardrails

- Keep keyboard focus visible and labels readable over the landscape.
- Preserve `prefers-reduced-motion` and existing accessibility settings.
- Keep the responsive layout usable around 390px wide and on short desktop viewports.
- The corrected Runway PNG is committed locally; title, traveler-memory, and transition views use it with an HTML text fallback. No signed external asset URL is required.
- Title, memory-creation, and transition views render the Runway PNG with an HTML `LEGEND / THE AWAKENING` fallback; the title wordmark must not use SVG artwork.
- The background image may fail without blocking the menu; fallback branding remains readable.
- Historical filenames and save keys may keep older wording for compatibility. That does not make the old subtitle current branding.
- See [PRODUCTION_ASSET_PACK.md](PRODUCTION_ASSET_PACK.md) for the production art list and [ART-DIRECTION.md](ART-DIRECTION.md) for shared visual rules.
