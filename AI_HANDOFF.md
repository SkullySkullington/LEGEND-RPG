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


## Source release v0.20.22 — first expedition story progression (verification pending)

Source changes on \`main\`:
- New \`docs/LEGEND_MYSTERY_AND_STORY_ARC.md\` proposes a coherent interpretation of the Bell/lantern/route-marker mystery, a first-game reveal ladder, route stories, NPC arcs, and implementation acceptance criteria. This is proposed direction, not locked canon.
- \`docs/LEGEND_WORLD_BIBLE.md\` and \`docs/ASHMERE_STORY_SPINE.md\` now link to that blueprint.
- The first secured Old Road expedition records its first route and discovered route clue in save flags and updates The Bell That Rang Once quest-log line.
- Ashmere NPC dialogue now reacts to the first route report. Talking to Mara moves the journal objective to the bell-marked seal at Blackroot Bend; inspecting the seal records a memory and advances the objective back to Mara, then toward comparing Greyfen boundary marks.
- \`tests/legend-smoke.spec.js\` adds regression tests for the High Ridge and Reed Cut first-return branches and Blackroot Bend clue progression.
- Version labels are bumped to \`v0.20.22\`.

**Verification status:** The files and test cases are committed on main, but the Playwright suite and live GitHub Pages deployment have not yet been verified for this release. Do not describe the new story callbacks as live-tested until that verification is complete.

Relevant commits:
- \`5facef122e405895488fef2b64332f76898fad3f\`: proposed mystery/story arc blueprint.
- \`276a9f8256671da6afd55120c59f77b67125fe95\`: world bible companion link.
- \`6b51591b3f058d60f58c965dd6be6ceb3b7aebe0\`: story spine companion link.
- \`bbbc7bb21914224952afe378f8ec234dca21fc2c\`: route-aware NPC callbacks.
- \`dacf01f721d3c732798c982494d392dcc760eb85\`: first expedition story flags and quest updates.
- \`36151c8d69e71e38a405b9bb11f595410eb2e01d\`: normalized story flags.
- \`1d5c7e57133859f2397fe90c6ed5bfa29e4c8b41\`: story regression tests.

Next:
1. Run \`npm run test:e2e\` locally and fix any regressions before treating this release as verified.
2. Verify the first Ridge and Reed return paths in a fresh save, including reload persistence and the Blackroot clue step.
3. Confirm GitHub Pages is serving \`v0.20.22\` before reporting the changes as live.
4. Continue only after this slice is stable: design the Moved Cairn side chain and Greyfen archive follow-up using existing quest flags and route discovery patterns.
