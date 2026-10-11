// LEGEND v0.20.4 - Stable local production asset manifest.
// Generated production art is committed locally under assets/generated/.
(() => {
  window.LegendAssetsV090 = {
    logo: {
      main: 'assets/ui/logos/logo_legend_main_v1.png',
      emblem: 'assets/ui/logos/logo_legend_emblem_v1.png',
      emblemFull: 'assets/ui/logos/logo_legend_emblem_full_v1.png'
    },
    title: {
      background: 'assets/generated/title/title-ashmere-road.webp'
    },
    locations: {
      ashmereMain: 'assets/generated/locations/ashmere-town.webp',
      greyfenMain: 'assets/generated/locations/greyfen-town.webp',
      oldRoad: 'assets/generated/locations/old-road-south-fork.webp',
      roadCamp: 'assets/generated/locations/roadside-camp.webp',
      highRidge: 'assets/generated/locations/high-ridge.webp',
      reedCut: 'assets/generated/locations/reed-cut.webp',
      ashmereInn: 'assets/generated/locations/ashmere-inn.webp',
      ashmereMarket: 'assets/generated/locations/ashmere-market.webp',
      ashmereForge: 'assets/generated/locations/ashmere-forge.webp',
      ashmereArchive: 'assets/generated/locations/ashmere-archive.webp',
      greyfenInn: 'assets/generated/locations/greyfen-inn.webp',
      greyfenMarket: 'assets/generated/locations/greyfen-market.webp',
      greyfenForge: 'assets/generated/locations/greyfen-forge.webp',
      greyfenArchive: 'assets/generated/locations/greyfen-archive.webp',
      oldRoadScene: 'assets/locations/roads/old_road_exploration_v1.svg'
    },
    classes: {
      Adventurer: 'assets/generated/classes/class-adventurer.webp',
      Warrior: 'assets/generated/classes/class-warrior.webp',
      Ranger: 'assets/generated/classes/class-ranger.webp',
      Mage: 'assets/generated/classes/class-mage.webp',
      Thief: 'assets/generated/classes/class-thief.webp',
      Skiller: 'assets/generated/classes/class-skiller.webp'
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
      roadGoblin: 'assets/generated/enemies/road-goblin.webp',
      blackrootWolf: 'assets/generated/enemies/blackroot-wolf.webp',
      lanternWisp: 'assets/generated/enemies/lantern-wisp.webp'
    },
    items: {
      food: 'assets/generated/items/ration-bundle.webp',
      rationBundle: 'assets/generated/items/ration-bundle.webp',
      potion: 'assets/generated/items/healing-potion.webp',
      roadToken: 'assets/generated/items/road-token.webp',
      bellFragment: 'assets/generated/items/bell-fragment.webp',
      camp: 'assets/generated/items/camp-supplies.webp',
      roadHerb: 'assets/generated/items/road-herbs.webp',
      shortSword: 'assets/generated/items/short-sword.webp',
      bow: 'assets/generated/items/hunting-bow.webp',
      shield: 'assets/generated/items/round-shield.webp',
      iconSheet: 'assets/generated/items/item-icon-sheet.webp',
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
