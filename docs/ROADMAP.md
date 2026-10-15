# LEGEND: Roads of Ashmere — Development Roadmap

This is the active roadmap for the current modular HTML5 RPG. Priorities are ordered by player impact, not by a fixed release date. The current region system and loader sequence should remain stable unless a change clearly improves the game; because this is a private early playtest, traveler saves may be reset or migrated when needed.

## Current foundation

- [x] Guided traveler creation with visible selections, Back/Next persistence, and inline validation.
- [x] Ashmere as the home base for preparation, work, gear, and travel.
- [x] Five-stage Old Road expedition with named stops, points of interest, camp actions, Road Pressure, combat, and return-to-town rewards.
- [x] First South Fork decision with a safer High Ridge and riskier Reed Cut.
- [x] Initial route consequence: the High Ridge limits the first travel pressure increase; the Reed Cut earns a Bell Fragment but draws more danger from the marsh.
- [x] Route-specific second-stop discoveries: Ridgeway Cairn on High Ridge; watcher tracks in Reed Cut, with distinct rewards and pressure changes.
- [x] Shared art direction and asset integration rules in [ART-DIRECTION.md](ART-DIRECTION.md).

## High-priority narrative brief: First Session

The first-session story spine links the dead lantern, first conversations in Ashmere, preparation, the High Ridge/Reed Cut decision, expedition return, and Greyfen. It distinguishes implemented facts from proposed connective scenes and leaves central mysteries deliberately open. See [ASHMERE_STORY_SPINE.md](ASHMERE_STORY_SPINE.md). This is a narrative design document, not a claim that all proposed scenes are implemented.

## High-priority design brief: Opening Experience

The title screen and new-traveler journey are planned for a deliberate redesign after the current browser regressions are stabilized. The target is a living world presentation and roleplay-led character creation—not a bigger pile of form screens. See [OPENING_EXPERIENCE_REDESIGN.md](OPENING_EXPERIENCE_REDESIGN.md) for the player journey, in-world creation framing, technical constraints, and acceptance criteria. This is a design brief, not a claim that the redesign is implemented.

## Next priorities

### 1. Make road choices echo through the expedition

**Goal:** A route decision should change what the player experiences later, not only adjust a number.

- [x] Give High Ridge and Reed Cut distinct follow-up narration and points of interest.
- [x] Add a later waystation scene that reacts to the chosen route.
- [x] Lock route choice after the first selection; test the choice is no longer available.
- [x] Add Playwright coverage for both route branches and their distinct discovery/pressure outcomes.
- [x] Add repeat-selection lockout coverage and a later route-reactive waystation event.

**Done when:** A fresh traveler can take either path, observe a later difference, finish or retreat, and start another expedition without carrying a temporary branch flag into the next trip.

### 2. Establish the first production art set

**Goal:** Replace placeholder-feeling scenes with a coherent, readable visual identity across Ashmere, Greyfen, and the Old Road that joins them.

- [x] Generate the initial Runway art batch: title, Ashmere/Greyfen scenes and interiors, Old Road/camp/route variants, six class portraits, three enemy portraits, and a starter icon sheet.
- [x] Export and optimize the 25 generated images into stable local WebP files under `assets/generated/`; the import report confirms 25/25 exports succeeded.
- [x] Replace temporary preview URLs in `js/systems/assets-v090.js` with committed local file paths.
- [x] Slice the nine-cell item sheet into nine individual starter item icons and commit them beside the source sheet.
- [x] Add generated class portraits to character creation and generated enemy portraits to combat.
- [x] Simplify Ashmere's hub hierarchy and remove the duplicate "Your Camp" panel that repeated bottom-navigation links.
- [x] Replace the town controller's inline SVG service symbols with local art from the committed scene, portrait, and item asset families.
- [x] Rework the Trading Post into Buy/Sell tabs with item thumbnails, a clear purse summary, and a single bulk-sell action.
- [x] Rework the Blacksmith around equipped gear first, with separate Weapons/Armor tabs and actual item artwork.
- [x] Reframe Character Sheet as a Traveler profile with class portrait, vital stats, equipped kit, and illustrated inventory.
- [x] Give Greyfen its own cold-water palette and use the committed Greyfen scene as its hub backdrop.
- [x] Make the Town Square keeper roles, local rumors, and route board aware of Greyfen instead of repeating Ashmere-only copy.
- [x] Add Greyfen-specific work contracts for peat, salvage, and flood markers; peat work now produces a named, sellable `Dry Peat Brick` item.
- [x] Implement the one-time “A Dry Crossing” contract with a guaranteed safer path, a disclosed 65% shortcut chance, explicit reward/health outcomes, saved completion state, and a regression test.
- [x] Gate the roadmap in order: Greyfen → complete A Dry Crossing → Ironpass. Ironpass, Blackwood, and The Ruined March remain visible as in-development regions without unlock/travel actions until their hubs exist.
- [x] Add smoke-test coverage for Greyfen scene selection, keeper dialogue, local work contracts, regional unlock order, and avoiding the Ashmere-only expedition from Greyfen.
- [ ] Review all screens at desktop widths first; verify scene crops, icon centering, contrast, file size, and fallback behavior, then smoke-check critical layouts at 390px mobile width.
- [ ] Generate a dedicated, cohesive town/service UI icon atlas (inn, market, forge, journal, map, work board, traveler, route). Current buttons use committed local item/portrait images instead of inline SVGs, but several are interim semantic matches until a dedicated icon family is available.
- Keep UI labels as HTML, never baked into the art.
- See [PRODUCTION_ASSET_PACK.md](PRODUCTION_ASSET_PACK.md) for task IDs and target file paths.

### 3. Make expedition rewards feed town progression

**Goal:** Road loot should lead to a useful decision back in Ashmere.

- Audit current Bell Fragments, Road Tokens, materials, and loot for clear descriptions and uses.
- [x] Connect the Reed Cut's Bell Fragment to the Wisp Lantern Wick recipe; consuming the crafted wick reduces opening Road Pressure by 5 on the next expedition.
- Make reward feedback explicit and ensure inventory changes persist after returning to town.
- Avoid adding a new currency unless it has a distinct purpose.

### 4. Expand encounters without bloating the interface

**Goal:** Add variety while keeping the road exploration-first and touch-friendly.

- Add a small number of distinct road events and enemy behaviors.
- Reuse clear telegraphs and class techniques rather than adding a large menu of actions.
- Keep encounter text concise and readable on mobile.
- Test retreat, victory, defeat, and return paths.

### 5. Stabilize and validate

- Run the full regression suite on Desktop Chrome and focused touch-critical smoke tests on Mobile Safari and Mobile Chrome. Use the full browser matrix for deliberate cross-browser sweeps; investigate failures before release.
- Verify the visible version, page title, data version, and cache-busting references agree.
- Playtest the full first-session loop on desktop first, then confirm the critical creation, town, road, and combat flows at mobile width.
- Preserve existing save keys and avoid account/cloud-save changes unless explicitly prioritized.

## Guardrails

- Desktop-first visual design (target 1440×900); retain responsive 360–430px mobile support, touch-safe controls, and no horizontal page overflow.
- Prefer incremental changes in the current controllers over replacing the main game bootstrap.
- Keep the existing region system working; traveler saves may be reset or migrated if needed during early development.
- No account/Supabase work is in scope for this pass.
- Production assets must be clean exports without visible watermarks; watermarked previews are reference-only.
- Do not call a feature complete based on source changes alone; record whether it passed automated or live-browser testing.


## v0.20.12 — Town conversations, refreshed services, and turn-based battle UI

- Split Ashmere's former combined Town Hall destination into **Town Square** and **Work Board**; added a persistent People navigation entry so NPC conversations remain accessible.
- Rebuilt the Inn service panel with a purse/health summary and distinct recovery, supplies, and rumor actions. Corrected the Market camp-supply price to match the 90g inn price.
- Reworked encounters into a four-command turn menu (FIGHT / ACT / ITEM / GUARD) with secondary heavy-strike, poultice, and retreat actions; kept the existing combat calculations, class effects, rewards, and save model.
- Added enemy-intent telegraphing, animated hit/guard feedback, player HP/gear display, a looping battle theme, and local battle action sounds.
- Added Playwright assertions for reaching Town Square and talking to Captain Oric, and for the four-command battle interface.
- Source implementation is complete; automated Playwright and live-browser checks must pass before this entry is treated as fully validated.


## v0.20.17 — Bell Fragment crafting and expedition preparation

- Made the Wisp Lantern Wick a real route-reward recipe: craft it from a Bell Fragment and Lamp Oil at the workbench.
- The next expedition consumes the wick and limits its opening Road Pressure increase to 3 instead of 8, making the route discovery a tangible preparation choice.
- Added a Playwright regression test for ingredient consumption, single-use behavior, and the pressure reduction. Automated test execution is still pending.

## v0.20.13 — expedition layering and compact enemy plate

- Removed the negative-margin overlap between the animated Old Road artwork and its heading card, so expedition title/body copy begins below the image.
- Refined the battle opponent nameplate width, contrast, stacking order, and mobile safe area so it is less likely to collide with the enemy sprite.
- Added a Playwright check that the expedition heading has a zero top margin, and made the enemy-intent assertion case-insensitive to match the visible UI.
- Layout change has been committed; confirm via live-browser and automated test results.
