# AI Handoff — LEGEND: Roads of Ashmere

Last updated: 2026-10-15. Read this file before changing code, and update it when project status changes.

## Identity and hard constraints
- Game: **LEGEND: Roads of Ashmere**
- Repository: https://github.com/TDTRIA/LEGEND-RPG
- Live site: https://tdtria.github.io/LEGEND-RPG/
- Default branch: `main`; GitHub is the source of truth.
- Keep the game browser-based. Do not migrate to Unity/Godot/another engine without the owner's explicit request.
- Budget is $0/very low: prefer free/local tools and ask before introducing paid services, APIs, hosting, or subscriptions.
- Art direction: weathered storybook dark fantasy; cinematic RPG presentation; readable UI; distinct locations; cohesive bespoke icons; avoid reused/placeholder-looking assets.
- Production art must be watermark-free. OpenArt previews are reference-only unless watermark-free production output/use is confirmed.
- Preserve working systems and save behavior. Inspect current source before editing; make small, targeted changes; add regression tests; never claim a test or live fix passed without evidence.

## Current game overview
Working RPG core includes title/character creation, Ashmere hub and NPC dialogue, Work Board jobs, trading/equipment/crafting, five-stage Old Road expeditions, meaningful exploration choices/discoveries, resting/field crafting, turn-based combat with class abilities/cooldowns, rewards, XP/leveling, and regional travel. Previous live playtesting found no horizontal overflow at 390×844 and no expedition event text/art overlap in checked scenes.

Important files:
- `index.html`: page shell, stylesheet/script loading, cache-busting query strings.
- `js/game.js`: bootstrap; `js/data.js`: game data; `js/storage.js`: persistence.
- `js/core/runtime-v080.js`: runtime bridge, save access, return-to-town handling.
- `js/systems/beginning-v094.js`: character creation/entry.
- `js/systems/ashmere-controller-v099.js`: Ashmere/Greyfen hub, NPCs, jobs, market, Forge, crafting, profile/sheet routes.
- `js/systems/road-controller-v100.js`: current Old Road expedition flow.
- `js/systems/road-controller-v087.js` and `js/content/roads/old-road-v087.js`: older/underlying road systems; inspect dependencies before edits.
- `js/systems/progression-v100.js`: XP and levels.
- `js/systems/region-controller-v100.js`: regional unlocks/travel.
- Relevant styles include `css/road-expedition-v100.css`, `css/ashmere-town-v100.css`, `css/ashmere-workshops-v100.css`, `css/title-cinematic-v120.css`.
- `tests/legend-smoke.spec.js`: Playwright regression suite; `package.json`: scripts/dependencies.
Always inspect current files; these notes are not a substitute for source.

## World and design direction
- Ashmere is the first town/home base.
- Greyfen is an implemented lowland/marsh settlement, not a reskin: drowned stone, reeds, boundary marks, keepers, marsh trading, causeway/crossing contract.
- Progression has used 5 Road Tokens to unlock Greyfen. Later proposed regions include Ironpass (10), Blackwood (15), Ruined March (25); verify current code before describing later areas as implemented.
- Old Road has five stages. Target: one meaningful decision at a time, contextual discoveries, escalating tension, route consequences, useful rewards, clear return flow.
- Combat should feel like a readable, entertaining turn-based RPG; Deltarune was a broad feel reference, not a request to copy its art/characters.
- Polish priorities include combat feedback, transitions (including a fade into the road), town/NPC usability, title screen, cohesive UI icons, and keeping desktop/mobile stable.
- Expedition text/art overlap was previously reported, but a live run on desktop and 390px mobile found no overlap in inspected scenes. Recheck if layout changes.

## Last live playtest (2026-10-14)
Live site: https://tdtria.github.io/LEGEND-RPG/ . Build label shown during the run: **v0.20.14**.

Passed:
- Character creation and entry to Ashmere.
- Forge opens Crafting Bench.
- Wisp Lantern Wick consumes 1 Bell Fragment + 1 Lamp Oil and creates 1 wick.
- Wick reduces opening Road Pressure increase to +3 instead of +8, and is consumed.
- Next expedition has no wick message and uses normal +8, proving one-time use.
- Event text stayed below art on desktop and 390px mobile; no horizontal overflow.
- Local gameplay continued despite Profile reporting `Supabase could not be reached: Failed to fetch.`

Failed:
1. At 5/5, after securing an expedition, first **Return to Ashmere** click reopened the secured summary; a second click was needed.
2. Work Board level-up text ended with double punctuation: `You are now level 2..`

## Release v0.20.19 — live verification complete (2026-10-14)

Live URL: https://tdtria.github.io/LEGEND-RPG/

Verified on the deployed site using an isolated browser save:
- Page title, visible build label, and `window.LEGEND_DATA.VERSION` all report `v0.20.19`.
- Loaded `js/data.js`, `js/version-v090.js`, and `js/game.js` use `?v=0.20.19-build-label`.
- Ashmere and Road controllers load with `?v=0.20.19-return-xp-fix`.
- After a secured stage-5 expedition, clicking `#finish` and then `#outcomeReturn` once makes `.ash100-town` visible and removes the outcome summary.
- The Work Board test starting at 95 XP produces `You are now level 2.` with one final period.
- Forge/Crafting Bench still opens and displays recipes.
- No console errors/uncaught exceptions occurred along these tested paths.
- Live checks ran without editing source. The full local Playwright suite has not yet been run.

Relevant commits:
- `9b6c4d67d46725f50859de1a76cff2f4b2203b90`: direct expedition return.
- `844aed6717186bab0ec2000daf5b6c15bdf60121`: level-up punctuation.
- `7e64b1810935e854335564de3cf39ef52e33fcd5`: controller cache-busting.
- `1cf5e3a4647a7342347a86235e91a0cb08dffb58`: punctuation regression assertion.
- `04a9e5558fa4f59be732720a8eaed0479e384c45`: visible build labels to v0.20.19.
- `45f42da8eadea83f70db7598eda03ddc4224502c`: game data version to v0.20.19.
- `1633282d38caf1fa3e931d8be45f2801338ac8ef`: internal version declaration.
- `bf66686eb1847000d85158e9a7ee1d1d61708aba`: package version.
- `3bf793e20d9610b69d58c26106c2ecc3b70673a1`: build-version and punctuation regression test updates.
- `f4b348e4fb508fdd99dd21d425e1fdfb5fd9d74a`: HTML title and cache-busting consistency.

Historical baseline:
The earlier live playtest was on a page labeled v0.20.14. It had verified Crafting Bench, the Wisp Lantern Wick's material consumption, the +3 opening Road Pressure bonus instead of +8, one-time wick consumption, and no art/text overlap on the tested desktop/mobile scenes. It initially found the two bugs fixed above.

## Source release v0.20.20 — deployment pending (2026-10-14)

New main-branch code adds enemy intent feedback to the battle UI:
- `js/systems/road-controller-v100.js` adds `rpg-intent-attack`, `rpg-intent-guardbreak`, `rpg-intent-heavy`, and `rpg-intent-snared` classes, plus intent labels in the foe nameplate.
- `css/road-expedition-v100.css` styles the nameplate and Enemy Intent warning with matching amber/violet/red/green accents.
- `tests/legend-smoke.spec.js` extends the Ranger battle test to check the initial state and transition through Guard Break and Heavy Wind-Up.
- Active source/package version labels were bumped to `v0.20.20`; `index.html` loads the road controller and expedition CSS with `?v=0.20.20-enemy-telegraph`, and data/version/game scripts with `?v=0.20.20-build-label`.

**Live deployment status:** the first browser check after these commits still served title/data version `v0.20.19`, road controller `?v=0.20.19-return-xp-fix`, and the old CSS reference. This is a stale/old deployment observation, not a confirmed failure of the source change. Do not describe enemy intent labels/colors as live or verified until the page loads the v0.20.20 references and the encounter test passes. GitHub connector currently confirms main-branch files contain the v0.20.20 changes, but no CI status checks were returned.

Relevant implementation commits:
- `5a8f1fbe76bf02876fd6d1fe8b49566ff143d88f`: enemy state classes/labels in the Road controller.
- `af133002198220bdc2e857d7cdaa8e262b0a9433`: enemy intent visual styles.
- `c8be18315b8aa6d5742fc9053f1568424468ef5f`: HTML asset cache-busting and v0.20.20 title.
- `11bba6462950415a59a574b2a3ad0941a60da8d8`: visible in-game labels.
- `2512d9d1eec446d4cdfad47150359b229a9fadd3`: core data version.
- `02fb0fe33fafaf01dce7e0d8cb792586b8608fd4`: version override.
- `566a0c1308b8ffeb885339500d2a8ba5c20c867b`: package version.
- `29472490f1baf712429c427abe351296bf9a9184`: battle intent regression checks.

## Source release v0.20.21 — gameplay variety pass (deployment/test verification pending)

Source changes on `main`:
- Work Board now contains different interaction modes instead of a single moving-marker minigame: timing (firewood), signal reading (gate watch), ledger clues (archive records), memory sequence (crates and peat), and situational decisions (yard cleanup, delivery route, salvage).
- Route Board now has a Side Stories & Road Contracts entry in Ashmere and Greyfen.
- Three one-time save-persistent contracts track a new point-of-interest discovery, a road battle victory, and a secured five-stage expedition. Contracts grant gold, XP, and supplies on turn-in.
- Blacksmith swords have material-specific SVG illustrations and visible combat passives; battle logic applies each passive.
- Enemy art motion is tied to heavy wind-up/guard-break/snared state.
- Desktop title panel gets a wider max width; mobile width override remains unchanged.
- Release/version strings and asset query params are bumped to `v0.20.21`.

Weapon passives: Wooden quickdraw +5 versus Guard Break; Stone Heavy Strike +25%; Bronze ACT +5; Iron FIGHT +7 versus Heavy Wind-Up; Steel 20% chance of 1.5× critical.

**Full browser suite and live deployment verification are pending.** GitHub Pages previously lagged behind `main`; don't call the v0.20.21 release verified until it loads and the relevant tests pass.

## v0.20.21 controller syntax repair — interactive re-test pending

The first live v0.20.21 smoke run found that the Ashmere controller failed to parse due to quote escaping in the weapon-art markup, leaving the game at “Ashmere is loading…”. Fixed the equipped-weapon image fallback quoting, then fixed a missing closing quote in the hand/neutral weapon-art palette and the same over-escaped `onerror` quote pattern in weapon cards.

- Repair commit: `03b8d3ae3a24912fb30dc9d6b779150dece0be9c` (controller parse repair).
- Controller cache-busting update: `70b4687798f5908dd2ea5f89097ffe24ae4cf09b`, query `v=0.20.21-controller-syntaxfix`.
- Static V8 compilation now passes for `js/systems/ashmere-controller-v099.js`, `js/systems/road-controller-v100.js`, `js/data.js`, `js/game.js`, `js/version-v090.js`, and `tests/legend-smoke.spec.js`.
- The interactive Browser Use smoke could not be rerun because its project reported insufficient credits. **Do not claim Work Board, contract, Forge, or combat paths are live-verified until interactive testing is available.** The previous run did verify title panel width at 600px on a 1440×900 viewport and no horizontal overflow at 390px.

- Follow-up fit fix: the unique weapon SVG in the equipped-kit row is reduced to the 34px loadout slot size (`css/ashmere-workshops-v100.css?v=0.20.21-jobs-weapons-fit`). Base `LEGEND_DATA.VERSION` is now also set to `v0.20.21` and the data ref is cache-busted to `?v=0.20.21-release-data`.

## Immediate next steps
1. Check GitHub Pages after the v0.20.21 main-branch files publish. Confirm title/footer/data version `v0.20.21` and the updated job, weapon, battle, and title assets load.
2. Verify Work Board variety, side-contract progress/turn-in, each Forge sword passive/illustration, and enemy intent motion on desktop and mobile. If Pages still serves an older version, troubleshoot publish/cache rather than claiming source UI failed.
3. Re-run regression coverage for the Wisp Lantern Wick ingredients/inventory, opening Pressure +3, wick consumed once then +8 on the next trip, first-click expedition return, and level-up punctuation. The last three paths passed during live QA on v0.20.19, but the new full local Playwright suite has not run.
4. Investigate the previously observed Profile message `Supabase could not be reached: Failed to fetch` separately as a service/config/network issue. Do not change database/auth settings blindly.
5. Continue combat polish only after v0.20.20 deploy verification. Keep all changes browser-safe, test responsive layout, and preserve current save format.

## Local Playwright testing
Requires Node.js/npm and a checkout.

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Local preview command:
```bash
npm run serve
```
Configured server uses port 4173. Inspect `playwright.config.*` before assuming the test runner auto-starts it or which base URL it uses.

Scripts in `package.json`:
- `npm run test:e2e`: run tests
- `npm run test:e2e:headed`: visible browser
- `npm run test:e2e:ui`: Playwright UI
- `npm run test:e2e:report`: open report

If a test fails, retain failure details and distinguish app bugs from environment/deployment failures. Never claim tests passed unless the run completed.

## Safe workflow for any AI assistant
1. Read this handoff and the relevant source/tests first.
2. Inspect the current `main` branch and recent commits; don't rely on stale chat context.
3. Explain the intended change and risks before broad/irreversible edits.
4. Make the smallest coherent change; keep the browser architecture and preserve working routes/save behavior unless explicitly authorized.
5. Add/update a regression test for each bug fix.
6. Run the targeted test, then broader tests when feasible.
7. Review diffs and check desktop/mobile where possible.
8. Commit with a descriptive message. Don't claim deployment or test success without evidence.
9. Update this handoff with what is fixed, committed, deployed, and verified.
10. If an AI reaches its usage limit, this file plus Git history should allow the next assistant to resume without making the owner reconstruct the project.

## Budget/tooling notes
- GitHub remains the shared source of truth.
- Prefer free tiers and local tooling. Check current credit limits before planning work using Runway, Mirelo, or OpenArt; do not assume credits are available.
- Validate generated assets for style fit, watermarks, format, dimensions, transparency, and in-game readability before integrating.


## Source release v0.20.22 — first expedition story progression (partial live verification; story callbacks pending)

Source changes on `main`:
- New `docs/LEGEND_MYSTERY_AND_STORY_ARC.md` proposes a coherent interpretation of the Bell/lantern/route-marker mystery, a first-game reveal ladder, route stories, NPC arcs, and implementation acceptance criteria. This is proposed direction, not locked canon.
- `docs/LEGEND_WORLD_BIBLE.md` and `docs/ASHMERE_STORY_SPINE.md` now link to that blueprint.
- The first secured Old Road expedition records its first route and discovered route clue in save flags and updates The Bell That Rang Once quest-log line.
- Ashmere NPC dialogue now reacts to the first route report. Talking to Mara moves the journal objective to the bell-marked seal at Blackroot Bend; inspecting the seal records a memory and advances the objective back to Mara, then toward comparing Greyfen boundary marks.
- `tests/legend-smoke.spec.js` adds regression tests for the High Ridge and Reed Cut first-return branches and Blackroot Bend clue progression.
- Version labels are bumped to `v0.20.22`.

**Verification status (2026-10-15):** Live GitHub Pages returned title/footer v0.20.22 and passed one fresh-save High Ridge five-stage journey through return to Ashmere, with no console messages or errors during the inspected flow and reload. This validates the deployment, source parsing, and generic route flow only. The specific new Mara/dialogue/journal/Blackroot callback test and the local Playwright suite have not run to completion; do not describe the new story callback chain as fully verified until those checks pass.

Relevant commits:
- `5facef122e405895488fef2b64332f76898fad3f`: proposed mystery/story arc blueprint.
- `276a9f8256671da6afd55120c59f77b67125fe95`: world bible companion link.
- `6b51591b3f058d60f58c965dd6be6ceb3b7aebe0`: story spine companion link.
- `bbbc7bb21914224952afe378f8ec234dca21fc2c`: route-aware NPC callbacks.
- `dacf01f721d3c732798c982494d392dcc760eb85`: first expedition story flags and quest updates.
- `36151c8d69e71e38a405b9bb11f595410eb2e01d`: normalized story flags.
- `1d5c7e57133859f2397fe90c6ed5bfa29e4c8b41`: story regression tests.
- `054b1f18fd39ccdb9e4a9994b21b01b14c92cc38`: align the browser title assertion with v0.20.22.
- `9147ef932e1d505a7f6601c5df7d32e77326f5b3`, `ebc48cedfa23f265d0e219412308704b70ed6ed3`, `50928025084e1e0bfc4de72a945cd8e2b11fc5b0`, `2b9cc3d46cd3b9974b2d86e86cad1d7f05f2d2dd`, and `de72b27eeaa63f3912ed86d3188f1db13e8f73ae`: HTML, runtime data/version, bootstrap, and package version bumps.
- `c2cfa85330f7954a1d3780874b1a2f79369b6252`: README release summary; `d40b6fee18e9094704967678904a24ac1a000b0c`: changelog entry; `bae3ea903782f755e38466b56cf19979f42525cc`: initial release handoff; `8e6834b7403c2c49021124834a9ae2f2873d62b0`: test version label; `054b1f18fd39ccdb9e4a9994b21b01b14c92cc38`: title assertion; `50d59334df5b1d790ab35b34ee94596acfa1e24b`: partial live verification record.

Historical next steps for v0.20.22 (superseded by v0.20.23):
1. Run `npm run test:e2e` locally when a checkout is available.
2. Verify the first Ridge and Reed return paths and Blackroot clue step.
3. The v0.20.22 live smoke was subsequently completed; its result is recorded above.
4. The Moved Cairn work now exists in v0.20.23 source; verify that path before expanding the Greyfen archive follow-up.


## Source release v0.20.23 — The Moved Cairn (implementation complete in source; verification blocked)

Source changes on `main`:
- Added the one-time Side Stories contract `movedCairn`, posted by Captain Oric and paid in gold, XP, and one Road Herb.
- When the accepted contract's player investigates the High Ridge's Ridgeway Cairn, three disclosed options are available: restore the older alignment, record both positions, or mark the hazard and step back.
- The selected outcome is stored inside the existing persistent side-contract flag. It adds a memory, can be reported for a reward, changes Oric's later dialogue, and changes the cairn's description and repeat-inspection narration on future expeditions.
- No new subsystem or currency was added; current route choices, POI discovery, Side Stories board, save flags, and memory list are reused.
- `tests/legend-smoke.spec.js` adds an end-to-end test for accepting, choosing, reporting, and observing the callback.
- Version labels moved to `v0.20.23`.

**Verification status (2026-10-15):** Source and test changes are committed. The new live route-story QA attempt was blocked by `ERR_TUNNEL_CONNECTION_FAILED` in two fresh isolated browser sessions; the page never loaded and no game save was changed. This is not evidence of an app failure, but it also does not verify the quest. The full Playwright suite has not been run locally. Do not call this release fully verified until the accepted-contract path, report turn-in, later cairn description, and desktop/mobile behavior are checked.


Relevant v0.20.23 commits:
- `e93bf272ee3af836677d484c6c3b2c4330f4bae5`: persistent Moved Cairn decision panel and route callback.
- `4f61c8683d3138120dbd094bdbc25464df2d0881`: repeat discovery text reflects the stored cairn outcome.
- `cc9cf1d67a8a187c5b8a6b1062fd7e6a9558496c`: cache-busting for the route follow-up update.
- `3a9cfbf861ac59218d006e7a1766aaf5569c3fcd`: side contract, turn-in reward, and Oric dialogue callback.
- `62b39516b1b1c7b73914981b6c448928f942c974`: align title-version assertion to v0.20.23.
- `68ebc0109046bb70feaa74637e3c7dedf3eeb02a`: test saved decision and journal memory across a reload.
- `c661fc3e6e64e028fb055a93eb91f61fc5ea8cee`: HTML title and asset cache-busting.
- `19b0ee0f94c6f23b86e236396499889dec03b3c8`: package version; `ceaac84e4b142986b7881e9f6ef5ede2a33e768e`: README; `1bf94b473d062ae280a89a7aeb9dcb894396eac3`: changelog; `c9ccd3b1214afa5169321504f25bf583e9287384`: handoff; `19fd065b885814b5c6cd6d78fb6f869c6bb3c9f2`, `8484b4b68c58ade92ee148e029ebcb07ce1e5e6e`, `b871068ceed8eb9348ff248b29312575a5a758df`: lore/documentation updates.


## Source release v0.20.24 — A Mark Beneath the Mark (verification pending)

Source changes on `main`:
- The existing Greyfen Boundary Stone discovery now reacts to the saved Blackroot seal clue. Inspecting it records a memory that distinguishes the repeated older bell-mark from a newer cut angled toward the reed bed.
- The Bell That Rang Once journal objective advances to taking the matching mark to Mara in Greyfen’s Boundary Archive.
- Mara’s Greyfen dialogue compares the two surfaces, records the comparison in the memory list, and advances the objective to finding a dated record or physical evidence for when the newer cut was made.
- `storage.js` normalizes the two new story flags; no new currency, quest engine, or separate regional system was added.
- `tests/legend-smoke.spec.js` adds regression coverage for the evidence and archive response; the Moved Cairn test now checks persistence across a reload.
- Version labels and route-controller cache-busting move to `v0.20.24`.

**Verification status (2026-10-15):** Source and tests are committed, but the Playwright suite has not run locally. The latest browser attempt, made while checking the preceding source release, was blocked by `ERR_TUNNEL_CONNECTION_FAILED` before the page loaded. The v0.20.24 UI and quest callbacks therefore remain unverified in the deployed game. Do not interpret the tunnel error as an application failure or as a pass. Confirm the page version, run the targeted quest tests, and check desktop/mobile layout when a browser session is available.


Relevant v0.20.24 commits:
- `9e36bfbaabdf7ec4f43a94a5c63ac96cda993967`: Greyfen boundary marker uses Blackroot evidence and advances the main quest.
- `6a4c639cfd678feaa69649dec3237866431265c9`: Greyfen Boundary Archive dialogue and memory callback.
- `524f30fdc89b28fcccefc8c65c3cc4692ed30882`: normalize persistent Greyfen story flags.
- `0986791bf9feeb950c200b74e96fdbb7131bef16`: regression test for Blackroot-to-Greyfen evidence.
- `da7fbb115dbee78549c16229eb1ea1f80bb8eb1e`: prevent Ashmere dialogue from regressing an advanced Greyfen objective.
- `bc4e3488d48c59d1218a5b81108f5b0e40a78439`: test objective persistence across the Ashmere dialogue callback.
- `6d90394944b0644eb277bf8b9c76073244127278`: refresh the Ashmere controller cache key.
- `c2faf02fbbc6d01ffd9a39612453a138753bec96`, `c9d3ad69170dd7c1acfeb44f59529c9b120221b7`, `9061861670b83226e1e560b63ea805882b4b51b2`, `20f2a5ff3668a8947e177c9de6ac6a12cb3905b4`, and `ca24725c00940dc5e295603dd67848a33b44ef00`: HTML, data, runtime version, bootstrap, and package version changes.
- `bc578d232c9cacd2fac49025d39ba0bd2eeefe99`, `2360b270e3dd3c2a6878c60b0cb1ff5b45e6dab5`, `b0774129f717ad773f29fdbf774c0bd4078b1abf`, `81a5fdd22d05c54774695f18253fec24c79fd9d0`, `11ddc39506b785c6cec5e7136aebd6a658dea250`, `2ca87f0c224bfb78b63b46657a67ce8f358654f7`, and `fd74c51582346fdc41fe00e8dd4dc4914d217eac`: tests, release docs, and story/world documentation.


## Source release v0.20.25 — The Reedwatch Field Note (verification pending)

Source changes on `main`:
- After the player compares the Blackroot seal with the Greyfen boundary stone and speaks to Mara in Greyfen, Reedwatch Shelter’s stage-4 locker becomes a dated field-note discovery.
- Inspecting the note records its date and sketch in memories and advances The Bell That Rang Once to returning the note to Mara.
- Mara directs the player to Old Brenn; Brenn records two crossing destinations overwritten in a later hand and advances the objective to finding the earlier weekly route return.
- New persistent flags `greyfenFieldNoteFound`, `greyfenFieldNoteReported`, and `greyfenLedgerCompared` are normalized in storage. The feature uses existing route POIs, save flags, NPC dialogue, and quest log.
- `tests/legend-smoke.spec.js` adds regression coverage for the dated clue and Mara/Brenn handoff. Title assertion and visible runtime labels are set to `v0.20.25`.

**Verification status (2026-10-15):** Source and regression tests are committed, but the Playwright suite has not run locally. The live browser route was previously blocked before page load with `ERR_TUNNEL_CONNECTION_FAILED`; v0.20.25 is not live-verified. This is a tooling/network blocker, not evidence of game failure. Before treating this release as verified, confirm the page build, run the Moved Cairn, Greyfen boundary, Reedwatch, and save/reload tests, and check desktop/mobile layouts.

Relevant v0.20.25 commits:
- `90d0489245155ee23834777f04bb0a708751ef20`: Reedwatch field-note discovery and saved memory.
- `39f508e71e277f97ab3c1fb92510bac196be7236`: Mara/Brenn dialogue and quest handoff.
- `f6ba96b8a0a3cf463303d0ba754a1e39b2e7e332`: normalized field-note story flags.
- `ae7b9de94daf4bd4ee7465a0160bc351c7a8e4fd`: field-note and ledger regression test.
- `3dd264de98fc75c21947d4609a94099465012db5`, `718cc128e26c60ec6a8307772aeec5f9cbe058ec`, `55307e64598370879d3b8b204e8fd9a3cc4dfb06`, `4541f1080e3e693eaf99cbf3165b3aed06d1a572`, and `4ab864f715f3dc8a6c41840c5ddca8db06a5dda3`: HTML/cache, data, runtime, bootstrap, and package version.


## Source release v0.20.26 — The Earlier Weekly Return (verification pending)

Source changes on `main`:
- Once `greyfenLedgerCompared` is saved, the Wayfarer's Camp / stage-2 POI can reveal an earlier weekly route return. It records the lower crossing as `CLOSED pending inspection`, then shows a later `OPEN` correction without initials.
- Inspecting the document sets `greyfenWeeklyReturnFound`, records a memory, and advances The Bell That Rang Once objective to Old Brenn in Greyfen.
- Brenn compares the earlier return with the overwritten ledger, stores a memory, and directs the player to Mara. Mara preserves the Blackroot seal, Greyfen boundary comparison, Reedwatch note, and weekly return together, then points to the missing closure order.
- Storage normalizes `greyfenWeeklyReturnFound`, `greyfenWeeklyReturnReported`, and `greyfenEvidenceFiled`. The existing POI, NPC, save, memory, and quest-log systems are reused.
- `tests/legend-smoke.spec.js` adds coverage for the document, both NPC handoffs, the final objective, and persistence across reload.
- Build labels and controller cache keys are v0.20.26.

**Verification status (2026-10-15):** Code and regression cases are committed, but the Playwright suite has not run locally. The live browser attempt most recently failed before page load with `ERR_TUNNEL_CONNECTION_FAILED`, so v0.20.26 is not live-verified. The tunnel failure is an environment blocker, not evidence of application failure. Do not report the story path as passing until the targeted tests and responsive browser checks complete.

Relevant v0.20.26 commits:
- `94cd95d4ce01b9b76f7e2990c8a9e1012d009a1a`: earlier weekly return POI, saved memory, and quest update.
- `55c35ee9b375548581ef26ca884a2037c6cb1b17`: Brenn/Mara evidence filing and missing-closure-order lead.
- `2830c5e9b5de4d7b90bf9460e7226927fc21795c`: normalized weekly-return flags.
- `9d8dee7160aea08bb9743e304d838e40cabaad28`: weekly-return story regression test.
- `5d60a4c9b3e6f6bc3c7c0a021799397ecdb760e6`: adjust Mara’s filing dialogue to match the saved callback.
- `570d768dc85beae8b59053b1d4a645df7114d9d7`: Ashmere controller cache refresh.
- `91fef40d28bea3cfb9ea3afa2576a0341a4e1057`, `718a086116b596c2d1928a5277730597109e6361`, `a7aadd062ffe67b5159580e8395e532fcb5adc6c`, `74d718c01936fbcc12610536044ad1e83995f968`, and `fb9028bf8d49a02a43ba139cd68a383889f96b5e`: HTML, data, runtime, bootstrap, and package version.
