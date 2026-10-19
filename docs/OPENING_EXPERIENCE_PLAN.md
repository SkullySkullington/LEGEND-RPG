# Opening Experience, Tutorial, and Story Integration Plan

**Status:** Proposed production plan, updated 2026-10-19  
**Canon authority:** [CANON.md](CANON.md) is authoritative. This document proposes pacing and player-facing implementation; it does not lock unanswered lore or claim unimplemented scenes are playable.

## Experience goal

LEGEND should feel like entering a dark-fantasy RPG world, not navigating a stack of website panels. Screens should read as places: a gate in the rain, a lantern-lit room, a weathered work board, a road stretching into fog, a chamber with a visible threat. Character portrait + speaker name + text box + player response should be a recurring language for important conversations and tutorials.

The world should be uneasy but humane. Ashmere is a warm refuge; roads carry uncertainty; the people causing harm are not automatically monsters. Art and dialogue must reinforce the same tone, and player actions should have understandable consequences.

## First-session flow

### 1. Outside Ashmere — create a traveler

**Implemented in the v0.20.38 presentation slice, pending CI and deployed verification:** retain the existing seven-step record builder, visible choices, class portrait art and save contracts, but place the form in a scene with Captain Oric's portrait and changing dialogue.

Oric speaks like a tired watch captain rather than a narrator explaining the mythology. He asks what to enter in the ledger, what instinct carried the traveler, what past they choose to share, what they can do, and what keepsake survived the fog. He does not claim to know the traveler's history and does not suggest a hidden explanation for the dead lantern or the traveler's existence.

Acceptance:
- The local LEGEND: The Awakening raster wordmark is shown, with Ashmere road art behind the creator.
- Every creation step has an in-world line from Oric; the current choice cards and validation stay usable.
- Portraits, progress and controls are readable at desktop and narrow mobile sizes; reduced-motion preferences are respected.
- Existing save keys and player-record fields remain compatible.

### 2. Ashmere gate — teach the world's language

When creation is confirmed, transition to Ashmere as a scene, not another settings form. Oric opens the gate and establishes three simple first-session goals: meet the townsfolk, prepare, then decide when to travel. The explanation should be brief and skippable.

Use the portrait-and-dialogue presentation for the first essential interactions:
- **Captain Oric:** gate rules, safety and practical warnings. He is not an all-knowing lore guide.
- **Mara Vell, Archive Keeper:** the bell rang once when the traveler arrived, which should not be possible. She distinguishes what she observed from what she merely suspects.
- **Old Brenn, Ledger Keeper:** how the town's records and practical obligations work; he introduces the value of comparing accounts and evidence.
- **Sella Marr, inn cook and road provisioner:** rest, rations and preparation, taught through useful actions rather than exposition.

A dialogue panel should include a character portrait, speaker name, readable text area, explicit Continue/choice affordance, and a clear way to leave. Typewriter effects may be optional and instantly skippable; reduced-motion mode should display text immediately. Important dialogue should be replayable from a journal/people destination.

### 3. Prepare — turn the town into a place

The first tutorial should guide the player through a small, coherent loop:
1. Speak with the people in Town Square.
2. Visit the inn for preparation/recovery, then inspect the market or forge if useful.
3. Open the road board and compare the safer High Ridge against the riskier Reed Cut.
4. Take the Old Road when ready; make the route choice and learn that it changes later narration and discoveries.
5. Return to Ashmere and debrief with the townsfolk, using discoveries and rewards to unlock the next sensible action.

The Ashmere hub should favor illustrated destinations and location language. Remove mismatched icons, baked-in words, misaligned strokes and stray side lines rather than placing generic dashboard glyphs in new cards. Labels remain HTML and accessible. Loading/transition moments should bridge places with a short fade, location name and scene art; no long unskippable sequence should block play.

### 4. The first mystery — prove, don't announce

The player should see evidence before being told what it means. The opening uses the dead lantern and one impossible bell ring as unsettling details, not as a full explanation. The Greyfen crossing story then introduces a distinct, human problem: the Landing Warden reopened the lower crossing early under trade pressure. She is a sympathetic wrong-doer and the player chooses how to respond.

Preserve the established evidence order:
1. Bell-marked seal at Blackroot Bend.
2. Greyfen Boundary Stone: an older bell-mark lies under a newer cut angled toward the reed bed.
3. Reedwatch field note dated two days after the flood's retreat, already showing the newer cut.
4. Brenn's ledger with two crossing entries rewritten in a later hand.
5. An earlier weekly return changed from CLOSED pending inspection to OPEN, in darker ink and without initials.
6. Mara's conclusion: the records establish a changed status, but do not yet identify the Landing Warden. The missing closure order is the next lead.

Do not shortcut this chain into a convenient confession. Let the player's next evidence and dialogue choices do the work.

## Proposed long-form story arc

These are structural proposals, not new locked canon.

### Act I — The Bell Rang Once
Ashmere is the home base. The traveler wakes beneath a dead lantern outside the gate, and Mara says the bell rang once. First-session play establishes the town's people, the Old Road and the value of returning with proof. Keep the supernatural details small and deniable.

### Act II — The Lower Crossing
Greyfen turns exploration into a social and civic mystery. Trade pressure, flood damage, a missing closure order and the Landing Warden's decision reveal that dangerous outcomes can begin with ordinary compromises. Player choices should affect trust, access and what help is offered—not just change a gold reward.

### Act III — An Old Peace
Ironpass, Blackwood and the Ruined March widen the game beyond Ashmere and Greyfen. Each region needs its own local problem, community and relationship to the old war agreement. The attacking goblins and ogres are Veil-touched creatures, but monster peoples must not collapse into one enemy army. Distinct threats should have understandable behaviors, motives and environmental signatures. Untouched creatures and the wider politics remain open until decided.

### Act IV — The Wound in the Veil
The crossing records and regional discoveries gradually lead to older evidence about the Last Mercy and the Hollow Saint. The Saint's promise is emotionally dangerous because it offers bereaved people a version of the dead they desperately want back. Reveal the facts through conflicting records, consequences and character-specific experiences; avoid a villain monologue that explains everything at once.

**Strict hidden-story rule:** L4 in CANON.md says the traveler is an echo left by the Last Mercy, does not know it, and must not have this stated or implied by any NPC, journal or UI before an owner-approved reveal plan. The opening must not hint that the creator choices are false or that the traveler's chosen origin is necessarily fake.

### Act V — What Should Be Returned?
The final act should make the player choose how to treat the wound and the people drawn toward the Hollow Saint's promise. Whether the wound can be closed, repaired, controlled or only contained remains open. The ending should resolve consequences for companions and regions, not turn the entire story into a single abstract lore answer.

## Dungeon design direction

Dungeons should be a separate exploration loop, not the road expedition with different artwork. First prove one compact, replayable ruin before building a dungeon catalog.

**Suggested first slice (name and location open):**
- A distinct illustrated entrance and a readable small room map.
- Three to five connected rooms, with at least one optional branch or environmental obstacle.
- A resource/preparation decision and one interaction that changes risk.
- At least one encounter whose behavior fits the room and enemy identity.
- A clue or useful material, a capstone foe or obstacle, and an explicit choice to press on or withdraw.
- A return report that explains what was recovered and unlocks a town conversation or practical upgrade.
- Persistence for discovered rooms and cleared state only when a replayable dungeon needs it; do not introduce a new save schema until the slice requires one.

Dungeons can uncover traces of the old war and the agreements between kingdoms and monster peoples. Avoid making every ruin a Hollow Saint shrine or turning ordinary bells into the universe's central mechanism. Let regional history exist beyond the deepest antagonist.

## Presentation and interaction rules

- Use portraits and in-world dialogue for the story's important conversations; use concise contextual prompts for mechanical tutorials.
- Make the next action visible but never force the player through every shop in a fixed order.
- Keep tutorial state explicit and replayable. A dismissible hint is not the same as a completed story conversation.
- Scene transitions should be quick, skippable, and reduced-motion safe.
- Keep scene illustration separate from readable UI text, captions and buttons.
- Do not use extra assets to mask unclear interaction design. Reuse the committed title, town, class and NPC art first; generate only gaps with a specific shot list and check clean export, crop and mobile performance before integration.
- Mark every lore idea as LOCKED, APPROVED DIRECTION, ESTABLISHED, PROPOSED or OPEN using CANON.md's meanings. Assistant-generated ideas remain PROPOSED until the owner approves them.

## Implementation order

1. **Traveler creation + hub service art** — in PR #27; require Playwright and deployed smoke validation before merge.
2. **First-session tutorial conversations** — Oric, Mara, Brenn and Sella; explicit tutorial steps, skip/replay and small player choices.
3. **Scene loading and transitions** — fade, location splash, reduced-motion behavior, asset fallback and timing tests.
4. **First dungeon vertical slice** — three-to-five-room loop with one encounter, one decision, one find and persistent return consequences.
5. **Regional story expansion** — connect the crossing evidence to the old agreement while preserving player choice and the locked reveal guardrails.

This sequencing favors one polished, tested journey over simultaneous rewrites of the loader, saves, combat and narrative systems.
