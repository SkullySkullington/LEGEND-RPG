# LEGEND — Canon

Story decisions made by the project owner. **If any other document disagrees with a LOCKED item here, this file wins.**
Last updated: 2026-10-16.

## How every AI assistant uses this file

- Only the owner locks decisions. An assistant may propose, draft options, or flag conflicts, but never marks something LOCKED on its own.
- Check this file before writing story, dialogue, quests, or lore. LOCKED items are facts, not suggestions.
- To change a LOCKED item, ask the owner first, then record the change with its date in the change log below. Do not edit it silently.
- Locked is not the same as implemented. Do not describe anything as playable until source and tests confirm it (see `AI_HANDOFF.md`).
- Status labels: **LOCKED** (owner decided) · **APPROVED DIRECTION** (owner approved the direction, details still open) · **ESTABLISHED** (already in the shipped game) · **PROPOSED** (an idea in the docs, not approved) · **OPEN** (undecided).

## Locked decisions

### L1 — The deepest threat is the Hollow Saint and the Last Mercy (locked 2026-10-16)

Long ago a healer's ritual, the **Last Mercy**, tried to save the dead. It failed: instead of restoring people it left echoes that imitate them. The figure behind it, the **Hollow Saint**, offers to bring people's lost loved ones back.

- **Locked:** the Hollow Saint and the Last Mercy are the deepest threat behind the awakening.
- **Still open:** the Hollow Saint's personality and agency; how much of the monster invasion it causes versus merely accelerates (not every monster is its servant); when and how the player learns of it; whether the ritual can be ended or repaired; any link to the player's traveler.
- **Working detail (PROPOSED, not locked):** `docs/LEGEND_GAME_REBOOT_PLAN.md` section 4, including the Veil, the Afterwake and Strain.

### L2 — The Greyfen crossing was reopened because of trade pressure (locked 2026-10-16)

The crossing records were altered because of trade pressure: **someone with authority reopened the lower crossing early to protect money and routes, knowing it was still unsafe.** This is a human decision.

- **Still open:** why the crossing was still unsafe; whether the Warden ever re-inspected; whether anyone was hurt; how the closure order went missing; what proof the player can recover; what happens when the player confronts, exposes, or protects her; whether the danger itself has a supernatural cause.

### L3 — The Landing Warden reopened the crossing (locked 2026-10-16)

Greyfen's own authority, **the Landing Warden**, was squeezed by caravan merchants after the flood and reopened the lower crossing early. The OPEN went in unsigned because she meant to re-inspect within days and did not want her name on an order saying the crossing was safe. The newer cut toward the reed bed marks the risky shortcut she made official. She is a sympathetic wrong-doer, not a villain, and how the player treats her is the player's choice.

- **Still open:** whether she ever re-inspected; whether anyone was hurt; how the player finds proof and what happens when they confront her; what the game does with the player's choice; her name (the compendium proposes "Yara Fen," which is not approved).
- **Consistency note:** in the existing "A Dry Crossing" contract the Landing Warden discloses the reed-bed shortcut's risk openly. Anything written for her must stay consistent with that contract, or update the contract and its test together.

### L4 — The traveler is an echo, but not an ordinary one (locked 2026-10-16)

The traveler is an echo left by the Last Mercy and does not know it. The game does not say so early. Small signs build up (the bell that rang once, the dead lantern, people who recognize the traveler too well) and the truth lands late. Unlike ordinary echoes, the traveler is different: **the Veil touched them before the Last Mercy could finish making them, and that contact is why they are the way they are.**

- **Still open:** what the Veil's touch actually did (abilities, limits, what the traveler can become); whose echo the traveler is (a particular dead person, or something new); whether the player's chosen origin is the echo's inherited memory or stays true to the player; whether the game ever states it outright or leaves lasting doubt; what the late choice is and how it changes the ending; how the bell and the dead lantern fit.
- **Hidden knowledge:** until the owner approves a reveal plan, no NPC, journal text or UI should state or imply this, and nothing in the existing game should contradict it.
- **Conflict flag:** `docs/ASHMERE_STORY_SPINE.md` says to keep the traveler's prior life flexible and not require every origin to be false. L4 may override that, depending on how the origin question is settled. The owner decides.

## Approved direction (approved by the owner 2026-10-15, as recorded in `AI_HANDOFF.md`)

- **Monster Wars & the Awakening:** a fantasy RPG about monster incursions, returning magic and regional conflict, with a deeper mystery behind it. Details: `docs/LEGEND_FANTASY_RPG_DIRECTION.md`.
- Monsters are not one army. Goblins, orcs, ogres and the Changed have different motives, and not every monster is evil or connected to the awakening.
- Bells are ordinary Ashmere currency, not the universe's central mechanism. Region access combines money, preparation, permits, standing, relationships and proof.
- The first game spans Ashmere, the Old Road, Greyfen, Ironpass, Blackwood and the Ruined March. Only Ashmere, the Old Road and Greyfen exist in the game today.
- The Pale Surveyor, Hollow Mile, Unreturned, Four Witnesses, Office of Measure, Seven-Wagon Dispatch, Aren Vey and Ivara are demoted legacy ideas. Do not build on them without the owner's re-approval.

## Established in the shipped game (v0.20.35)

These are facts players can already see. Changing one means updating the game, its save flags and its tests.

- The traveler wakes beneath a dead lantern outside Ashmere with no memory of the last mile. Mara says the bell rang once when the traveler arrived, which should not be possible.
- Recurring cast: Mara Vell (Archive Keeper), Old Brenn (Ledger Keeper), Captain Oric (gate and watch captain), Sella Marr (inn cook and road provisioner).
- The evidence chain, in order:
  1. A bell-marked seal at Blackroot Bend.
  2. Greyfen's Boundary Stone: the older bell-mark sits under a newer cut angled toward the reed bed.
  3. The Reedwatch field note, dated two days after Greyfen logged the flood's retreat; its sketch already shows the newer cut.
  4. Brenn's ledger: two crossing entries rewritten in a later hand within days of the flood's retreat, with no closure order.
  5. An earlier weekly return: the lower crossing marked "CLOSED pending inspection," later marked OPEN in darker ink with no initials.
  6. Mara's conclusion: the records establish that the crossing status was altered; the existing player-facing evidence does not yet identify the Landing Warden. The missing closure order is the next lead, and later scenes must connect it to the locked production truth without skipping the player's evidence and choices.
- The Moved Cairn side story (three choices at the High Ridge cairn) exists, and the choice is saved.
- "A Dry Crossing" in Greyfen offers a safer path or a reed-bed shortcut with a disclosed 65% chance. It is requested by "the Landing Warden," who is unnamed in the game. The name Yara Fen appears only in `docs/LEGEND_CHARACTER_COMPENDIUM.md` as a proposal.

## Open questions, in the order we will settle them

1. What did the Veil's touch do to the traveler: abilities, limits, and what can they become? (Next up. A combined draft was proposed on 2026-10-16 and awaits the owner's decision.)
2. Is the player's chosen origin the echo's inherited memory, or does it stay true to the player? (See the conflict flag under L4.)
3. The Hollow Saint: what does it want, how does it act, and when is it revealed?
4. The late choice: when the traveler learns what they are, what can the player decide, and how does it shape the ending?
5. Greyfen details: why was the lower crossing unsafe (flood damage, or something else), did the Warden re-inspect, was anyone hurt, and how does the player resolve it?
6. Is the magic system approved: the Veil, the Afterwake, Strain and the Five Arts (Ember, Tide, Root, Gale, Veil)?
7. Exactly how do Bells, permits and standing combine to open regions, and is there a separate "Bellmarks" currency?
8. What crisis does the player solve by the end of the first game?

## Change log

- 2026-10-16: File created. L1 and L2 locked by the owner in conversation with Claude.
- 2026-10-16: L3 locked (the Landing Warden reopened the crossing). "Who ordered it" removed from the open questions.
- 2026-10-16: L4 locked (the traveler is an echo, but not an ordinary one). "What is the traveler" removed from the open questions; its details added as new ones.
- 2026-10-16: L4 amended by the owner: the traveler was touched by the Veil before the Last Mercy could finish, which is why they differ.
