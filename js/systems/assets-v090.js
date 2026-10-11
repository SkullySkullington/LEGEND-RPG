// LEGEND v0.9.x - Asset Manifest
// Centralizes asset paths so new art can be wired without hunting through systems.
(() => {
  window.LegendAssetsV090 = {
    logo: {
      main: 'assets/ui/logos/logo_legend_main_v1.png',
      emblem: 'assets/ui/logos/logo_legend_emblem_v1.png',
      emblemFull: 'assets/ui/logos/logo_legend_emblem_full_v1.png'
    },
    title: {
      background: 'assets/title/title_bg_ashmere_road_v089.jpg'
    },
    // Runway-hosted preview copies for the current art pass. These signed URLs are
    // temporary; every consumer below keeps a local legacy fallback. Stable exports
    // should replace these preview URLs in this manifest before a public release.
    productionPreview: {
      titleBackground: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/9c1b471b-3f5c-49bd-891c-a8cd1ba46df4/52bede6b-8d3c-43ed-987a-1063bd778883/Create_ONE_standalone__production_ready_environment_backgrou.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiZmRlMjVlOWUwN2M5ZmEyNyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTg4NzAwNn0.9_eH7fYX9Nkaa6DQVeLYJdXcPRhO3BgLaSXMim-L7Rw',
      locations: {
        ashmereTown: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/002a1265-9d17-4953-9e90-b6ecffebe596/7d71fded-a914-492c-acf7-8d687f9d3d8e/LEGEND__Roads_of_Ashmere_production_asset_pack__One_standalo.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiODlhODJiNzAwNzc2Mjc3ZSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTg3NzM2MH0.7iMEtz3ySByzmlTkUVAADGYh-hSLV0ig5CdekDMgc',
        oldRoad: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/4cfd673e-4847-4240-8e0d-50bc62f142e1/b8a0cf09-d600-4e8c-af97-f219100c2318/LEGEND__Roads_of_Ashmere_production_asset_pack__One_standalo.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiOTk4NmI1Y2U1ZjQ2OWNhZCIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTgzNTIxNH0.VBeG6aqB_qnWjf9dOWFx6-eJulAChkrNqzhzM8cswqY',
        camp: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/aa182f8a-cbed-47ac-83b2-7a83d92e0124/3d406d29-254a-454a-8749-abef657f48ed/LEGEND__Roads_of_Ashmere_production_asset_pack__One_standalo.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiZDNmMWQ2N2VlODI5ZGI0NiIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTg5OTI2Mn0.nJuHxRTHtLphQbOARnEPkWix_HoLtEn4SLV5p9U2MMM',
        highRidge: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/25490a0e-e46e-4405-b009-dce23caff336/8af1cbfe-7ec5-4ac0-aae1-d26cab00aa5e/Original_production_environment_concept_art_for_LEGEND__Road.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMDAzMmJjOTBhNzYyOWM5MSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTg5MTQ3Mn0.3GQQOWMJDP2w0PqsSHZKk1wnpHwZosNnHty67BzhY0I',
        reedCut: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/0a55ecb5-c845-48c5-a222-a1c508c5de42/30813276-21c6-4df1-9bc9-589c36602f3f/Original_production_environment_concept_art_for_LEGEND__Road.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYzQ0YTg5YTNjYjMxZDY1MSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTg0NjQzNX0.IPrx2XKkJOem_bIiOfBpol2izYue7ghxKFi-du6PUoU',
        greyfenTown: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/77ab5ebb-f382-4a4a-b6b9-9475b44ca6ff/c6ec25e6-d8d7-4e09-966d-52faa4502eac/Original_production_environment_concept_art_for_LEGEND__Road.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNmJmZDMxNTc4N2QxNmMwMiIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTg4MzM1MX0.PwcQcwQ5H7NM_MRqOpmseJzmw6mVwSY7-_EfEGvFDX0',
        ashmereInn: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/661239d9-231c-4892-86a2-049aa8f2ff67/316d38ec-c06b-41f9-ae4c-915c24db7bf3/Original_production_environment_concept_art_for_LEGEND__Road.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNmRmNDM5MzQ1ZDY4Y2YxNSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTg0NTE3Mn0.zuS-cJV7g4Lnx6I6mE6zhwYPjEwbhKNLKxpXdaKb-uU',
        ashmereMarket: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/22f64875-ba4b-40f5-bc41-1c37ce20417a/130d197c-165c-4493-8e24-52241647ecbd/Original_production_environment_concept_art_for_LEGEND__Road.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNzM4NDUwMWQwYjc4MmYyZiIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTg2MjMwMX0.64yIwEhl4bj9btfb-hOXkTBu2KwcTbcp0pyhUUeK3FY',
        ashmereForge: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/141cf40c-cefc-46d5-bb9b-69b06aba55ba/5ac8484b-75a4-4ee5-9e95-d6d7fe580470/Original_production_environment_concept_art_for_LEGEND__Road.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNGZlMmJhZmRkNzJkODFkZCIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTg3MTg2OX0.zdm0XuGK1Yi13FenNf0CLGb_b5zC92RN4sycqUNsWLY',
        ashmereArchive: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/4839c289-0170-44a4-afb7-8acb93d98d37/aaf6eca3-6c43-4c79-9a15-ac71b12854ac/Original_production_environment_concept_art_for_LEGEND__Road.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiODk0MDVlMjBkNDhiOWYyYiIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTkwMDE5Mn0.DviIu2JfMqPhHXZ9B-KoSTh0z_yiUq8M-Z-JzjxkXE',
        greyfenInn: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/141b39da-bbb0-4420-9a07-b30059f4242a/097927c5-5470-4e3d-95d2-023a73e87a18/Original_production_environment_concept_art_for_LEGEND__Road.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNjBmYWU5YjY4MWZmNDUzZiIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTkwNzc2Nn0.uQOUP1gLvcjox8I36t1llpd8Gg3kCVqhkYnzyQI0Us0',
        greyfenMarket: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/48dd7c72-3746-47f8-b97b-5e2da547b586/f3c06a6d-66c1-47d8-8331-670741ec15ca/Original_production_concept_art_for_LEGEND__Roads_of_Ashmere.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiOGVjMWY4MzgyZTNlY2Y4YyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTgzMTg2NH0.E2-5XpDgMI07cPnybVLz6kwsbsic9AfwHy4Bs3UnIxg',
        greyfenForge: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/0d4b76e3-8fbb-4874-8ba3-916aeb69f755/6e82a1f3-afe2-4a14-b790-33bc7561ef20/Original_production_concept_art_for_LEGEND__Roads_of_Ashmere.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNzY4YWRlYzNkYzk0MmUwZSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTkwNjg4M30.-up31RwWY9jzO_IS0rrZk2ZKRzaLDvTA730sPWF4g1M',
        greyfenArchive: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/e69121f6-e2cb-4374-b8f2-ac8fe99cc205/e65cff90-228d-491f-9d19-f52dbeda6b7a/Original_production_concept_art_for_LEGEND__Roads_of_Ashmere.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNjA0ZGQxY2EzOTNkOGM0MiIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTg4MjMxNH0.xfCNKV70qLlhj-ceRuMvMFkHV1FPXLwZDA-viEp90j4'
      },
      classes: {
        Adventurer: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/48b92d0e-8076-4c51-8974-d85f7f8843b6/b2c91caa-a6a8-4726-94e2-a1ad2f75dd16/Original_character_portrait_for_LEGEND__Roads_of_Ashmere__gr.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMWUyMDI0YmFmNzIzZWY2OSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTgzMjYzNH0.oGt40-uKCa3zKKI305IpQn5JuC4wlzo6wwsIZC6J-Po',
        Warrior: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/7d2b45a2-7055-4675-a8a4-fd4b10dd99ad/994f3bd2-5721-42e5-b299-93e4465c8e9f/Original_character_portrait_for_LEGEND__Roads_of_Ashmere__gr.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiZDcxOTc5MTZlY2RlNDcxOSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTg2NTIzOH0.8paJ9XEj5wrWsxfQ295fIjWMJ3lEPYtfQgH7gpTGfBc',
        Ranger: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/91c6f47b-d2f5-40a4-b487-4fbcd133270f/c63c487f-61eb-4147-a3bb-513adbdc0e26/Original_character_portrait_for_LEGEND__Roads_of_Ashmere__gr.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiOTE1Zjk0ZTk0NTE0MWM4NCIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTkxMDc2MX0.V9CEomqQEijELkUabeMDUiwbBASOimvcNPp7AOqSORs',
        Mage: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/88444e9c-6c8e-495f-8c71-c1ed2c9ddde1/6aa3f2ed-0da0-4f5c-b3f5-1a2155f4943d/Original_character_portrait_for_LEGEND__Roads_of_Ashmere__gr.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNjY3NzY4ZjgzYzMxOTM3OSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTg1MDQ4OH0.ZANE7Njh3USVFU8WddtF2TRQ0Yul7nE1SijB5XeeGZM',
        Thief: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/920ded18-1ece-4f82-84b3-74d850217c32/2a383a7e-d6d1-426f-8849-2daadb1e32d6/Original_character_portrait_for_LEGEND__Roads_of_Ashmere__gr.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiOTgxNjVlOGY3ZDUzY2Y5NyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTg4NzYzMX0.OtM0LwWi1Aq-QE1y_vZxqPXOBHRvX4C0NzB4PN4uUYM',
        Skiller: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/a5d9e7b7-2c62-4845-85d4-9ce1668edc61/b59ff641-60f4-4fba-8b9d-a795adabc11f/Original_character_portrait_for_LEGEND__Roads_of_Ashmere__gr.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMWI0ZDg4ZTIyZmNjMDE3NiIsImJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTkwOTM0Nn0.GjzcCD2Iz52FrmU7TnBPEnZfVlysHGh5SuzI1IZe9k0'
      },
      enemies: {
        blackrootWolf: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/e4d636a7-14f1-4de7-a262-fc158f2627e7/0ada7c72-33a4-4390-8ad6-b0a689b9874d/Original_enemy_portrait_for_LEGEND__Roads_of_Ashmere__cohesi.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYTM0ZmJhNTlhY2NiMjI1YiIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTg0NDA1N30.UMzaEgc-vmDOJGfiClZcbD-WeqJM_N2ND8g0MsqOwtE',
        roadGoblin: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/f60fa014-58bf-423b-ace8-65e3f1da6ef8/e599a354-d142-496e-8c4d-b418d3cee23e/Original_enemy_portrait_for_LEGEND__Roads_of_Ashmere__cohesi.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiZjhjYmE3M2Y4NWE4ODc5MyIsImJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTg3NTM5MX0.6z9p6htVcaVm4HTzWqi4z-CFQ67gs49ZvX7ydAJeiL4',
        lanternWisp: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/8d2320be-fd79-4104-81c4-2c4a2d468248/4136b898-583a-4e49-882b-5600c75eea9c/Original_enemy_portrait_for_LEGEND__Roads_of_Ashmere__cohesi.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiZTRmMGQyYTcyYjgyYzdjYSIsImJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTgzOTAxNX0.9T9joB8jjenQtn4JTcPnI6y6OWYuAwg7kx-RXdxjCGg'
      },
      itemIconSheet: 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/1a27ec00-7e03-42a0-9430-1ca6643b34fd/3b13938e-ead7-415a-96de-180e4760aebd/Create_ONE_clean__production_ready_3_by_3_SPRITE_SHEET_of_ni.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMWM1NDZlNjRiMDliNzEzYSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsImV4cCI6MTc5MTg1ODUzMn0.NFuZBm1EDYUB6X64tCY9DYh_5XwyNl5c-j5LuW7y3BM'
    },
    locations: {
      ashmereMain: 'assets/locations/ashmere/location_ashmere_mainstreet_v1.jpg',
      oldRoad: 'assets/locations/roads/location_old_road_main_v1.jpg',
      oldRoadScene: 'assets/locations/roads/old_road_exploration_v1.svg'
    },
    npcs: {
      mara: 'assets/npcs/ashmere/npc_mara_portrait_v1.jpg',
      brenn: 'assets/npcs/ashmere/npc_brenn_portrait_v1.jpg',
      oric: 'assets/npcs/ashmere/npc_oric_portrait_v1.jpg',
      innkeeper: 'assets/npcs/vendors/npc_innkeeper_portrait_v1.jpg',
      blacksmith: 'assets/npcs/vendors/npc_blacksmith_portrait_v1.jpg',
      trader: 'assets/npcs/vendors/npc_trader_portrait_v1.jpg'
    },
    enemies: {
      roadGoblin: 'assets/enemies/road/enemy_road_goblin_v1.jpg',
      blackrootWolf: 'assets/enemies/road/enemy_blackroot_wolf_v1.jpg',
      lanternWisp: 'assets/enemies/road/enemy_lantern_wisp_v1.jpg'
    },
    items: {
      food: 'assets/items/consumables/item_food_rations_v1.png',
      potion: 'assets/items/consumables/item_healing_potion_v1.png',
      roadToken: 'assets/items/quest/item_road_token_v1.png',
      bellFragment: 'assets/items/quest/item_bell_fragment_v1.png',
      pelt: 'assets/items/materials/item_pelt_v1.png'
    },
    byName(name='') {
      const n = String(name).toLowerCase();
      if(n.includes('mara')) return this.npcs.mara;
      if(n.includes('brenn')) return this.npcs.brenn;
      if(n.includes('oric')) return this.npcs.oric;
      if(n.includes('inn') || n.includes('keeper')) return this.npcs.innkeeper;
      if(n.includes('smith') || n.includes('weapon') || n.includes('armor')) return this.npcs.blacksmith;
      if(n.includes('trade') || n.includes('market') || n.includes('merchant')) return this.npcs.trader;
      if(n.includes('goblin')) return this.enemies.roadGoblin;
      if(n.includes('wolf') || n.includes('hound') || n.includes('blackroot')) return this.enemies.blackrootWolf;
      if(n.includes('wisp') || n.includes('spirit') || n.includes('lantern')) return this.enemies.lanternWisp;
      return '';
    }
  };
})();
