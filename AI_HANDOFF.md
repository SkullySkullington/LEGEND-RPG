# AI Handoff — LEGEND: Roads of Ashmere

Last updated: 2026-10-14. Read this file before changing code, and update it when project status changes.

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

## Immediate next steps
1. Run the broader Playwright suite when an execution environment is available, especially Wick ingredients/inventory, opening Pressure +3, one-time consumption followed by +8 next trip, first-click return, and level-up punctuation. Do not claim the full suite passes until it runs to completion.
2. Investigate the previously observed Profile message `Supabase could not be reached: Failed to fetch` as a separate service/config/network issue. Do not change database/auth settings blindly.
3. Resume game-facing work with combat presentation, particularly the enemy fight box and battle-state readability, then transitions, distinct Greyfen presentation, town/NPC interactions, and cohesive icons. Recheck desktop and mobile layouts.

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
