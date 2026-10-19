# LEGEND — Opening Experience Redesign Brief

**Status:** Active design brief / partially implemented; updated 2026-10-16  
**Scope:** The title experience, new-traveler creation, the first arrival, and the handoff into Ashmere  
**Priority:** High. This is the first public-facing experience of the LEGEND IP.

## Current direction update — 2026-10-16

The product title is **LEGEND: The Awakening**. “The Unquiet Road” is a retired working subtitle and should not be used as current branding. The production title screen is being shaped as a fantasy RPG main menu: panoramic local art, the Awakening wordmark, a framed dark-fantasy menu panel, one obvious Continue/Begin action, and quieter New Traveler, Profile, Settings, and Credits options. Keep the production game playable and separate from the isolated Phaser reboot experiment.

## Implementation direction update — 2026-10-19

The opening is now being implemented on the production browser RPG in branch `feature/veil-road-opening-v140`, not in the isolated Phaser experiment. New travelers meet the unknown voice as `???` during memory-led creation, then begin on the Old Road outside Ashmere. Captain Oric finds them beneath the dead lantern and asks whether they are friend or foe. A response changes his dialogue and leaves a journal memory. A Blackroot Wolf ambushes him; the voice says “Awaken,” and the player uses the existing ACT command in the production combat screen to defeat the one-HP tutorial enemy. The player then learns the existing fork, clue inspection, search, travel, waystation rest, and secured return. The sequence leaves the player free to skip to Ashmere after the ambush.

The production title now also has an in-game News & Roadmap page. Its notes distinguish shipped items from the opening preview and planned direction; it must not present planned features as shipped or invent live player activity. This is an active branch preview; desktop/mobile Playwright and live deployment checks remain release gates.

## North star

The opening should feel like stepping into a living dark-fantasy RPG world. The player should not feel as though they are filling out a sequence of website forms before the game begins. The title screen should establish a world already in motion; character creation should let the player discover who they are through choices, objects, scenes, and consequences.

The game remains browser-based. Build the feeling of a larger online RPG through art direction, movement, ambient sound, persistent travelers, strong world presentation, and clear account/continue paths—not by pretending that other players are present when the game has no live multiplayer population.

The opening should make a new player think: **“I want to know what happened here, and I want to see where this road goes.”**

## 1. Design principles

1. **Show the world before explaining it.** Use a compelling scene, light, weather, sound, and small events to establish tone before presenting many buttons.
2. **Make creation roleplay.** Identity choices should be framed as moments in the traveler's life, not a survey. The player should see and feel what a choice means.
3. **Every step should change something.** Choices can affect starting skills, keepsake, journal text, how the intro is narrated, dialogue flavor, or starting supplies. Do not promise consequences the game does not implement.
4. **Keep the player moving toward the game.** A narrative sequence may be atmospheric, but it should not become a long unskippable movie. Keep choices short, readable, reversible where sensible, and easy to revisit.
5. **Land in a real place.** End creation with a compact first scene that leads naturally into Ashmere and a clear first objective.
6. **Respect saves and player identity.** Existing travelers should be able to Continue without being pushed through creation again. Do not destroy or migrate real saves casually.
7. **The browser is the platform.** Use the current HTML/CSS/JavaScript, local assets, and existing systems. Do not assume a new engine or a full 3D character creator is necessary.
8. **Accessible by default.** Motion, sound, text, focus, keyboard use, tap targets, and a reduced-motion path are part of the design—not later patches.

## 2. Proposed first-session journey

This is a design target, not the current behavior.

### Beat A — The title world

The title screen is an RPG main menu, not a landing-page hero: the world scene establishes place, the wordmark establishes identity, and a framed menu makes the player's next action unmistakable.

**Visual direction**
- A wide, atmospheric Ashmere/Old Road scene with foreground, middle-distance, and background layers.
- Gentle environmental motion: drifting fog, moving branches or hanging signs, lantern flicker, falling drizzle or ash, distant birds, and restrained light movement.
- A few tiny world events that can happen independently of the menu: a traveler crossing the road, a gate guard changing posture, a cart moving in the distance, or a lantern being tended. These should be subtle ambient animation, not clickable systems unless implemented deliberately.
- Distinct warm shelter light against cold road mist. A few cold-blue hints may suggest the wider mystery without explaining it.
- Weather and time-of-day variants can come later. Start with one highly polished scene and a small number of lightweight layered effects.
- The LEGEND emblem and title should feel integrated into the composition, not like a bubble or generic webpage logo.

**Menu hierarchy**
- Primary: Continue (when a saved traveler exists) or Begin Your Journey (when none exists).
- Secondary: New Traveler, Traveler Selection/Profiles when applicable, Settings, Credits.
- If accounts/cloud saves are available, show their real status clearly. Do not invent population counts, live messages, guild activity, or “players online” to simulate an MMO.
- A player's saved traveler should be contextual metadata, not a competing large card that obscures the world.

**Sound**
- A recognizable LEGEND theme/motif.
- Layered, quiet ambience such as wind, distant town sounds, wood creak, and lantern/fire texture.
- UI sounds should be understated and consistent. Audio begins only after a user gesture where browser autoplay rules require it.
- Settings and reduced-motion/sound preferences must be respected.

### Beat B — The first threshold

Before the player is buried in choices, give them one short, sensory introduction to the road and the mystery already in the project: the traveler wakes beneath a dead lantern outside Ashmere.

The scene should contain a small number of inspectable details, such as the lantern, a damaged route marker, and the path toward distant lights. The player learns through observation that:
- the world is grounded and physical;
- this traveler has an incomplete past;
- the road holds an unanswered question;
- Ashmere is a destination with human life, not just a hub menu.

Keep the cause of the dead lantern and the Bell mystery open. The opening should create curiosity, not reveal the franchise's central answers.

The player may be able to inspect one object or make one short initial response. Make this meaningful but not permanent enough to overwrite all possible traveler origins or define an unwanted fixed protagonist backstory.

### Beat C — Character creation as an RPG sequence

Keep the current creation data model and choices where possible, but gradually transform how they are presented. Each choice should happen in a small scene with a clear prompt, strong artwork, contextual narration, and visible consequences.

Possible scene framing for the current categories:

| Current choice | Proposed in-world framing | What the player should understand |
|---|---|---|
| Name | A name entered into a gate ledger, travel record, or personal journal | This is the identity used in the world |
| Gender / presentation | A respectful identity moment with clear options and no forced assumption | The character is theirs to define |
| Personality | A short response to a grounded human dilemma or encounter | This describes approach and dialogue tone, not a moral cage |
| Origin | A memory vignette: a place, trade, failure, or obligation that shaped the traveler | Origin contributes to skills and a few contextual story details |
| Class | A roadside kit, training memory, or demonstration of tools and technique | The player sees the role's visual identity, starting equipment, and signature move |
| Keepsake | A small object presented with a brief story and physical illustration | The object has personal meaning and a clear starting effect |
| Review / confirmation | A compact character portrait and in-world travel record | The player sees the combined result, can go back, and then commits |

**Recommended presentation**
- One main question or decision per scene, with minimal competing UI.
- Distinct background art or framing per scene, using consistent visual composition.
- Short contextual text before the options, not paragraphs of lore.
- A persistent but compact preview of the traveler where it helps, especially class portrait, name, origin, and keepsake.
- Skill/stat changes explained in plain language next to their effects.
- Choice tiles show differences honestly; do not make every choice appear equally powerful if it is not.
- Back/continue controls remain reliable and accessible. A skip/fast path should be available for repeat players.
- Review feels like reading the traveler's own record or packing list, not a form submission summary.

**Important:** Do not generate seven unrelated pieces of interface art and call the creation RPG-like. All scenes should feel like connected moments in one journey, sharing the same framing, lighting, typography, transition language, and sound identity.

### Beat D — Arrival in Ashmere

The player should see Ashmere as a living place before facing the full hub UI. Use a brief arrival vignette: lanterns in wet stone, someone doing ordinary work, a keeper noticing the traveler, and a clear invitation to approach or speak.

The first actionable goal should be specific and human. An NPC should welcome, question, or direct the traveler—not dump the whole world bible at once. Let the player discover services as they need them. Establish the first quest and the first person worth remembering.

The introduction should hand off into the real town controller rather than create a parallel scripted town that is abandoned as soon as the player finishes the intro.

## 3. Making the title feel like a persistent online RPG

“Online RPG feeling” should come from a credible sense of a larger persistent world:
- An elegant Continue flow with the saved traveler's name, level/class, and last location.
- A world scene with gentle independent life.
- Real account and cloud-save status when available, with obvious guest/local play fallback where supported.
- A grounded “world notices” or regional bulletin panel in the future, populated only by real game notices, events, or authored in-world rumors—not fake live-player messages.
- A sense that regions, NPCs, and stories exist beyond the current screen.
- A clear distinction between solo persistent play and any actual multiplayer/social features if those are ever built.

Do not block the first session behind account creation. Make account linking useful and transparent, not a prerequisite to feel immersed.

## 4. Visual and technical implementation approach

Use a staged browser-friendly approach:
1. **Scene composition:** Choose or commission one strong wide title image with safe space for UI; layer local foreground and background details.
2. **Ambient life:** Use lightweight CSS transforms and/or small sprite sequences. Avoid expensive full-screen filters, runaway animations, and large video backgrounds.
3. **Scene transitions:** Use brief fades or wipes that preserve context and do not delay controls. Respect reduced-motion preferences.
4. **Creation shell:** Establish a reusable scene frame that can host different prompts and choice sets without rebuilding the entire screen for each step.
5. **Choice feedback:** Surface skill bonuses, gear previews, inventory effects, and journal text from the current game data. Avoid duplicating authoritative values in static copy.
6. **Persistence:** Save draft creation selections safely between steps; confirm before finalizing. Test old travelers, fresh travelers, reloads, and Back navigation.
7. **Asset budget:** Deliver responsive WebP backgrounds, light PNG/SVG details where appropriate, local stable paths, and fallbacks. Keep image sizes and motion manageable on phones.
8. **Audio:** Add a theme and small set of reusable UI/world cues, with user-gesture startup and settings integration.
9. **Manual review:** Check Continue/Begin, Profile/Settings access, every creation step, back/forward persistence, effects on stats/items, reduced motion, keyboard focus, mobile overflow, and final arrival in a browser.

## 5. Suggested build phases

### Phase 1 — Audit and creative direction
- Play through the current title → create traveler → arrive in Ashmere path.
- Inventory current art, sounds, saved-data fields, step handlers, and intro transitions.
- Sketch the opening sequence as storyboards before generating a large volume of assets.
- Decide how the dead lantern, the traveler, and the first NPC are introduced without locking the central mystery prematurely.

### Phase 2 — Title scene prototype
- Create one polished, lightweight living title scene.
- Integrate emblem, menu, Continue state, atmosphere, and sound.
- Check desktop and 360–430px mobile widths.
- Do not build fake online-player signals.

### Phase 3 — Character creation vertical slice
- Reframe one or two existing steps as connected scenes.
- Preserve the existing data model and mechanics.
- Verify Back/Next, reload, and saved draft persistence.
- Only expand the pattern once the prototype feels like roleplay rather than forms.

### Phase 4 — Full creation and arrival
- Move all creation steps into the shared narrative presentation.
- Add contextual outcomes and the in-world record/summary.
- Build a short Ashmere arrival sequence and link it to the real town and quest systems.
- Let repeat players skip or accelerate the intro.

### Phase 5 — Polish and validate
- Art, sound, transitions, accessibility, mobile performance.
- Test fresh and returning travelers in Chromium and WebKit.
- Validate every choice's true mechanical effects and save compatibility.
- Record actual test outcomes before calling the work complete.

## 6. Acceptance criteria

The opening is ready for release review when:
- A first-time player sees a distinctive LEGEND world before confronting a large UI.
- The title feels alive without relying on fake multiplayer activity or heavy assets.
- A returning player can continue quickly and clearly.
- Character creation feels like connected roleplay scenes, not seven independent form pages.
- The player can explain their origin, class, and keepsake in their own words.
- Every displayed stat, item, and bonus matches the authoritative game data.
- Back/Next, reload, and confirmation behave predictably.
- The arrival introduces at least one memorable person, one practical goal, and one intriguing question.
- The sequence does not answer the whole Bell/lantern mystery.
- Mobile users can complete it comfortably at 360–430px; reduced-motion and sound settings work.
- The real town gameplay starts without a disorienting duplicate hub or broken transition.
- Automated tests and live smoke checks are recorded separately.

## 7. Out of scope for the first pass

- A full 3D character creator.
- A new game engine or rewrite of the browser runtime.
- Fake concurrent players, chat, guilds, server messages, or population counts.
- Multiple title environments before one is polished.
- A huge cinematic intro that delays player agency.
- Resolving every mystery before the first expedition.
- Adding many new character stats or class systems just to make creation look deeper.

The goal is not “more screens.” It is **more roleplay per choice, more world per frame, and a stronger emotional reason to begin the first journey**.
