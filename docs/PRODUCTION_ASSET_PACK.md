# Production Asset Pack — Ashmere & Greyfen

**Scope:** First two towns plus the Old Road art needed to connect them.  
**Art direction:** [ART-DIRECTION.md](ART-DIRECTION.md) — weathered storybook dark fantasy, grounded medieval materials, mist, moss, tarnished brass, ember light, and restrained blue magic.  
**Generation provider:** Runway connected workspace. All 500 available credits were used for this initial pack (25 outputs at the configured 20-credit generation cost).

## Important export status

The outputs exist in the connected Runway workspace and can be looked up by the task IDs below. The live code currently uses the returned **signed preview URLs** for a visual pass and keeps legacy local artwork as fallbacks. These signed links expire; they are not the permanent production files.

**Still required before calling this asset pack production-complete:** export/download the originals from Runway, commit local image files under the target paths below, update `js/systems/assets-v090.js` to point to those local files, remove the temporary `productionPreview` URL map, optimize wide scenes to WebP, and visually inspect every result at desktop and 390px mobile widths. Do not remove the fallback paths until the replacement files are verified in the repository.

## Environment and location scenes

| Asset | Runway task ID | Intended stable path | Used for |
|---|---|---|---|
| Title / Ashmere road panorama | `9c1b471b-3f5c-49bd-891c-a8cd1ba46df4` | `assets/generated/title/title-ashmere-road.webp` | Cinematic title background |
| Ashmere town | `002a1265-9d17-4953-9e90-b6ecffebe596` | `assets/generated/locations/ashmere-town.webp` | Ashmere hub |
| Old Road / South Fork | `4cfd673e-4847-4240-8e0d-50bc62f142e1` | `assets/generated/locations/old-road-south-fork.webp` | Opening expedition scene |
| Roadside camp | `aa182f8a-cbed-47ac-83b2-7a83d92e0124` | `assets/generated/locations/roadside-camp.webp` | Wayfarer's Camp scene |
| High Ridge route | `25490a0e-e46e-4405-b009-dce23caff336` | `assets/generated/locations/high-ridge.webp` | Safer branch scene |
| Reed Cut route | `0a55ecb5-c845-48c5-a222-a1c508c5de42` | `assets/generated/locations/reed-cut.webp` | Riskier branch scene |
| Greyfen town | `77ab5ebb-f382-4a4a-b6b9-9475b44ca6ff` | `assets/generated/locations/greyfen-town.webp` | Second town hub |
| Ashmere Inn | `661239d9-231c-4892-86a2-049aa8f2ff67` | `assets/generated/locations/ashmere-inn.webp` | Rest and rumor screen |
| Ashmere Market | `22f64875-ba4b-40f5-bc41-1c37ce20417a` | `assets/generated/locations/ashmere-market.webp` | Buy and sell screen |
| Ashmere Forge | `141cf40c-cefc-46d5-bb9b-69b06aba55ba` | `assets/generated/locations/ashmere-forge.webp` | Blacksmith and crafting |
| Ashmere Archive | `4839c289-0170-44a4-afb7-8acb93d98d37` | `assets/generated/locations/ashmere-archive.webp` | Lore and memory screen |
| Greyfen Inn | `141b39da-bbb0-4420-9a07-b30059f4242a` | `assets/generated/locations/greyfen-inn.webp` | Rest and rumors in Greyfen |
| Greyfen Market | `48dd7c72-3746-47f8-b97b-5e2da547b586` | `assets/generated/locations/greyfen-market.webp` | Lowland trade screen |
| Greyfen Smithy | `0d4b76e3-8fbb-4874-8ba3-916aeb69f755` | `assets/generated/locations/greyfen-forge.webp` | Repairs and crafting in Greyfen |
| Greyfen Boundary Archive | `e69121f6-e2cb-4374-b8f2-ac8fe99cc205` | `assets/generated/locations/greyfen-archive.webp` | Boundary marks and bell-keeper lore |

## Class portraits

| Asset | Runway task ID | Intended stable path |
|---|---|---|
| Adventurer | `48b92d0e-8076-4c51-8974-d85f7f8843b6` | `assets/generated/classes/class-adventurer.webp` |
| Warrior | `7d2b45a2-7055-4675-a8a4-fd4b10dd99ad` | `assets/generated/classes/class-warrior.webp` |
| Ranger | `91c6f47b-d2f5-40a4-b487-4fbcd133270f` | `assets/generated/classes/class-ranger.webp` |
| Mage | `88444e9c-6c8e-495f-8c71-c1ed2c9ddde1` | `assets/generated/classes/class-mage.webp` |
| Thief | `920ded18-1ece-4f82-84b3-74d850217c32` | `assets/generated/classes/class-thief.webp` |
| Skiller | `a5d9e7b7-2c62-4845-85d4-9ce1668edc61` | `assets/generated/classes/class-skiller.webp` |

## Enemy portraits

| Asset | Runway task ID | Intended stable path |
|---|---|---|
| Blackroot Wolf | `e4d636a7-14f1-4de7-a262-fc158f2627e7` | `assets/generated/enemies/blackroot-wolf.webp` |
| Road Goblin | `f60fa014-58bf-423b-ace8-65e3f1da6ef8` | `assets/generated/enemies/road-goblin.webp` |
| Lantern Wisp | `8d2320be-fd79-4104-81c4-2c4a2d468248` | `assets/generated/enemies/lantern-wisp.webp` |

## Item icon sheet

| Asset | Runway task ID | Intended stable path |
|---|---|---|
| Nine-icon sprite sheet (Bell Fragment, Road Token, potion, ration, sword, bow, shield, Camp Supplies, Road Herbs) | `1a27ec00-7e03-42a0-9430-1ca6643b34fd` | `assets/generated/items/item-icon-sheet.png` |

## Integration notes

- The title, Ashmere/Greyfen hubs, service screens, route scenes, class-selection step, and combat portraits can currently preview the generated art through `LegendAssetsV090.productionPreview`.
- Remote preview failures should fall back to existing repository artwork rather than leave a broken image.
- The Road controller selects the camp scene at Wayfarer's Camp and High Ridge/Reed Cut art for the route-specific Lantern Ditch stop.
- Class and enemy portrait preview URLs are not a substitute for local exports. Some screens fall back to text or existing portraits when the signed URL is no longer valid.
- The item sprite sheet has not been sliced into individual optimized icon files yet. Validate grid alignment visually before cropping.
- Do not call the work done until local copies are committed and title, Ashmere, Greyfen, location screens, character creation, and combat have passed desktop and mobile visual review.
