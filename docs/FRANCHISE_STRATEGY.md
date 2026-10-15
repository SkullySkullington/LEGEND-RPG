# LEGEND — Franchise Strategy & IP Roadmap

**Status:** Internal strategy draft; adapt as the project grows.  
**Principle:** Build one compelling, coherent world first, then expand into other formats from a stable canon.

## 1. The long-term vision

LEGEND should be more than a single RPG release. The franchise can eventually support connected games, character-led stories, an identifiable soundtrack and sound library, illustrated world material, and carefully chosen companion experiences. Every format should deepen the same identity rather than dilute it.

The durable franchise engine is:

**A memorable place + a human problem + a road into uncertainty + a consequential choice + evidence that changes what the characters believe.**

The first game remains the anchor. A broad IP needs a strong, understandable entry point before it needs a large number of products.

## 2. The pillars that must stay consistent

1. **Distinctive setting:** Weathered dark fantasy, lived-in towns, roads with history, and restrained uncanny elements.
2. **Player agency:** Clear choices, visible risks, outcomes that matter later.
3. **Human scale:** Personal needs, labor, relationships, local customs, and practical consequences sit beside the larger mystery.
4. **Recurring symbols with evolving meaning:** Bells, lanterns, route marks, maps, ledgers, waterlines, and tracks can connect stories across regions and formats.
5. **A world that supports multiple protagonists:** The setting and its conflicts are bigger than any one traveler; new games can follow other people without invalidating the first story.
6. **Canon discipline:** Shared facts remain consistent, while mysteries may stay open until their payoff is planned.

## 3. Product architecture

### The flagship line: games
The main game series carries the central playable journey and major canon revelations. Each game needs its own local conflict, a complete emotional arc, meaningful progression, and a larger question that naturally points forward. Do not make a sequel feel like an oversized content update, or require an external book to understand its plot.

**Current flagship:** *LEGEND: Roads of Ashmere* — Ashmere, the Old Road, the first route choice, the Bell mystery, and the initial move toward Greyfen.

### Companion stories: short fiction and illustrated pieces
Use short stories, character vignettes, journal entries, illustrated route reports, or a limited web-serial to explore people and places that the game cannot fully cover. These should:
- Be satisfying on their own.
- Add context rather than deliver mandatory plot information.
- Avoid pre-answering the central game mystery.
- Reuse approved designs, names, and history from the world bible.

Good early experiments are one complete short story and one illustrated in-world document—not a giant lore encyclopedia.

### Audio identity
A recognizable main motif, region motifs, restrained discovery stings, and signature sounds can tie the franchise together. Reuse motifs deliberately; a bell tone should have an emotional or narrative reason to return. Store source projects and usage/licensing notes alongside finished exports.

### Art book / field guide
Only after enough regions and creatures have stable designs, compile maps, location art, creature notes, object sketches, and in-world records. Clearly distinguish in-world beliefs from production commentary and unresolved mysteries.

### Tabletop or side experiences
A small tabletop scenario, narrative side game, or road-event anthology could fit the choice-driven identity later. Build from the existing rules and world; do not create a second, incompatible canon or a major parallel game before the flagship loop is stable.

### Community, merchandise, and adaptation
Consider these only when there is sustained audience interest and a clear visual identity. Do not let speculative merchandising dictate character or story decisions early. Any future commercial adaptation requires deliberate rights, asset provenance, and production review.

## 4. Roadmap by phase

### Phase 0 — Make the foundation trustworthy (now)
**Goal:** A new player can enter, understand the game, play the core loop, and trust that choices and saves work.

- Fix current road discovery and UI regressions.
- Pass automated source tests and the live GitHub Pages smoke test.
- Confirm title/version/cache references agree.
- Verify save/load, route choice, item counts, combat outcomes, and region transitions.
- Record known issues honestly instead of marking source changes as tested.
- Keep the IP bible, art direction, asset inventory, and active roadmap aligned.

**Exit gate:** Core first-session tests pass on desktop and mobile, and the live build is confirmed to match the tested commit.

### Phase 1 — Deliver the Ashmere vertical slice
**Goal:** A small complete RPG experience that is fun to repeat and narratively memorable.

- Deepen the Town Square and named NPC interactions.
- Give Work Board activities clear rules, variety, and rewards.
- Make combat legible, tactical, and satisfying.
- Make loot and crafted tools feed back into the next expedition.
- Use route consequences, discoveries, and environmental storytelling to establish the Bell mystery.
- Finish the title screen, transitions, signature art, and basic soundscape.
- End the slice with a satisfying return and a strong, intentional hint of the wider world.

**Exit gate:** The player can complete the loop, explain their last meaningful choice, remember at least one NPC, and identify an unanswered question worth pursuing.

### Phase 2 — Make Greyfen a genuinely different chapter
**Goal:** Add a place that changes how the player thinks and plays, not a reskinned Ashmere.

- Center the town on water, raised routes, salvage, flood knowledge, and working docks.
- Give local NPCs goals linked to water levels, routes, records, and livelihood.
- Develop A Dry Crossing into a memorable introductory local problem.
- Use route navigation, visibility, flooded paths, and resource recovery to give the region its own gameplay feel.
- Add distinct environment composition, icon set, ambient audio, and local vocabulary.
- Let Greyfen reveal a new aspect of existing mysteries without explaining everything.

**Exit gate:** Greyfen is visually, mechanically, economically, and narratively distinct; its route and save progression survive a full round of testing.

### Phase 3 — Build the shared world one region at a time
**Goal:** Add new geography only when its identity is strong enough to justify it.

For every new region, define before implementation:
- Physical geography and climate.
- Main livelihoods and resource pressures.
- Local power structures and ordinary routines.
- One signature route or traversal problem.
- One local conflict with an understandable human stake.
- One distinct gameplay mechanic or decision pattern.
- New materials and enemies with clear uses and behaviors.
- How the region connects to existing mysteries without repeating the prior region’s story.

Do not start Ironpass, Blackwood, or the Ruined March simply because the map lists them. Each should earn its place.

### Phase 4 — Test the transmedia identity
**Goal:** Learn what parts of the setting work outside the game without expanding the production burden.

Recommended pilots:
1. One self-contained short story featuring an established character or a local resident.
2. One illustrated in-world artifact (a route notice, field journal page, ledger extract, or archive entry).
3. One polished audio motif or short soundtrack release tied to an actual in-game scene.

Evaluate whether each item stands alone, feels unmistakably like LEGEND, and increases interest in the game. Avoid launching several formats at once.

### Phase 5 — Scale only when the audience and production process justify it
Potential directions: further mainline games, compact spin-offs following other travelers, a field guide/art book, tabletop scenarios, soundtrack releases, or adaptations. These are possibilities, not commitments or canon. Pick the direction that fits actual player interest and the team's ability to deliver.

## 5. Every release needs a continuity packet

Before calling a game, story, region, or audio/art release ready, prepare:
- A one-paragraph premise and the audience entry point.
- A timeline of relevant events.
- A list of canon facts used or changed.
- Character, place, item, and name references.
- Unresolved questions intentionally left open.
- Asset provenance and rights/usage notes.
- Save and compatibility implications for game releases.
- Acceptance tests and the exact build that passed them.
- A short “what this adds to LEGEND” statement.

This packet keeps future work consistent and makes collaboration easier.

## 6. Decision rules for protecting the IP

- **Quality before volume:** One great region beats four thin regions.
- **A clear entry point:** No newcomer should need to research older material to enjoy the current release.
- **No accidental canon:** Generated assets, tool output, and placeholder dialogue are reference material until reviewed.
- **One mystery, multiple angles:** Different stories may show different evidence, but they must not casually contradict established facts.
- **No forced expansion:** A story should end well even when the world continues.
- **Keep player choice meaningful:** Avoid declaring a specific protagonist history mandatory if the game supports different origins.
- **Be honest about state:** “Implemented,” “tested locally,” “passed CI,” and “verified live” are different claims.
- **Use original identity:** Inspiration is a design reference, not a substitute for LEGEND’s own characters, symbols, prose, music, or visual language.

## 7. Suggested near-term priorities

1. Stabilize and verify the existing browser build.
2. Resolve the outstanding road discovery interaction.
3. Bring existing Ashmere NPC conversations and artwork to a consistent quality bar.
4. Finish the most visible title, combat, and transition polish.
5. Complete one full Ashmere–Old Road session with audio, rewards, retreat, and return flows.
6. Bring Greyfen up to the same quality bar, preserving its water-facing identity.
7. Use the canon bible to plan the first major reveal and deliberately keep some questions for later.

This order keeps the IP ambition connected to a game people can actually play and remember.


## 8. Proposed connected saga: The Pale Surveyor

The companion [Series Myth Arc](LEGEND_SERIES_MYTH_ARC.md) is a proposed franchise-level antagonist and reveal plan. It builds around an enemy who seeks to eliminate uncertainty by forcing roads, records, and communities to agree with one master map. That premise ties the Bell, route markers, contradictory ledgers, and later regional conflicts into a single saga while preserving distinct local stories.

The proposed escalation uses the planned regions as narrative opportunities:
- **Ashmere and Greyfen:** prove that route markers and records have been deliberately altered; resolve a local crisis without naming the full enemy.
- **Ironpass:** discover the institutional and economic costs of standardizing every route, and encounter the title of the Pale Surveyor.
- **Blackwood:** uncover the original road network's protective purpose and the creator's choice to turn it coercive.
- **The Ruined March:** confront the master network and decide how to preserve connection without giving one map authority over every community.

These beats are not fixed release commitments. They should guide foreshadowing and continuity while the first game remains the production priority. The central idea can be approved or revised before names, timelines, and faction details become canon.
