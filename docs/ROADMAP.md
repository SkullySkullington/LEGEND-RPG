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

**Goal:** Replace placeholder-feeling scenes with a coherent, readable visual identity.

- Produce an Ashmere establishing scene and an Old Road/South Fork scene.
- Review the same scene at desktop width and at 390px mobile width before integrating.
- Export web-sized WebP scenes; keep source masters outside the runtime bundle where practical.
- Add descriptive, stable filenames and preserve graceful fallbacks.
- Keep UI labels as HTML, never baked into the art.

### 3. Make expedition rewards feed town progression

**Goal:** Road loot should lead to a useful decision back in Ashmere.

- Audit current Bell Fragments, Road Tokens, materials, and loot for clear descriptions and uses.
- Connect at least one road discovery to a town service, recipe, or unlock.
- Make reward feedback explicit and ensure inventory changes persist after returning to town.
- Avoid adding a new currency unless it has a distinct purpose.

### 4. Expand encounters without bloating the interface

**Goal:** Add variety while keeping the road exploration-first and touch-friendly.

- Add a small number of distinct road events and enemy behaviors.
- Reuse clear telegraphs and class techniques rather than adding a large menu of actions.
- Keep encounter text concise and readable on mobile.
- Test retreat, victory, defeat, and return paths.

### 5. Stabilize and validate

- Run the Playwright smoke suite and investigate failures before release.
- Verify the visible version, page title, data version, and cache-busting references agree.
- Playtest the full first-session loop in desktop and mobile viewports.
- Preserve existing save keys and avoid account/cloud-save changes unless explicitly prioritized.

## Guardrails

- Mobile-first at 360–430px; large tap targets and no horizontal page overflow.
- Prefer incremental changes in the current controllers over replacing the main game bootstrap.
- Keep the existing region system working; traveler saves may be reset or migrated if needed during early development.
- No account/Supabase work is in scope for this pass.
- Production assets must be clean exports without visible watermarks; watermarked previews are reference-only.
- Do not call a feature complete based on source changes alone; record whether it passed automated or live-browser testing.
