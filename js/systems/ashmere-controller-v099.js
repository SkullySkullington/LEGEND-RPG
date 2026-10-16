// LEGEND v0.9.x - Ashmere Town Hub Controller
// Owns Ashmere directly: RPG town terminal, direct routes, no title reload for town returns.
(() => {
  const RT = () => window.LegendRuntimeV120 || {};
  const A = () => window.LegendAssetsV090 || {};
  const D = () => window.LEGEND_DATA || {};
  const root = () => document.getElementById('root');
  const esc = s => String(s == null ? '' : s).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
  const p = () => RT().loadPlayer?.() || null;
  const save = pl => RT().savePlayer?.(pl);
  const img = (path, alt = '') => path ? `<img src="${esc(path)}" alt="${esc(alt)}" onerror="if(this.src.startsWith('https://')){this.onerror=null;this.src='assets/locations/ashmere/location_ashmere_mainstreet_v1.jpg'}else{this.style.display='none'}">` : '';
  const itemIcon = key => {
    const items=A().items||{};
    const aliases={
      food:'food',ration:'rationBundle',rationBundle:'rationBundle',potion:'potion',roadPoultice:'potion',blackrootTonic:'blackrootTonicIngredients',
      roadToken:'roadToken',bellFragment:'bellFragmentCraft',camp:'camp',campSupply:'camp',roadHerb:'roadHerbBundle',huntersCharm:'huntersCharm',wispLanternWick:'lampOil',
      reinforcedBuckle:'reinforcedBuckle',woodenSword:'shortSword',stoneSword:'shortSword',bronzeSword:'shortSword',ironSword:'shortSword',steelSword:'shortSword',shortSword:'shortSword',bow:'bow',huntingBow:'bow',shield:'shield',
      none:'shield',clothArmor:'clothArmorIcon',chainArmor:'chainArmorIcon',bronzeArmor:'bronzeArmorIcon',ironArmor:'ironArmorIcon',woodScrap:'armorRepairKit',peatBrick:'camp',clothScrap:'armorRepairKit',wolfFang:'huntersCharm',tornHide:'tornHide',ore:'ironOreChunk',wispAsh:'bellFragmentCraft',oil:'lampOil',goblinTrinket:'tradeBundle',blackrootThorn:'blackrootTonicIngredients',tradeBundle:'tradeBundle'
    };
    return items[aliases[key]||key]||items.pelt||'';
  };
  const itemName = k => D().itemNames?.[k] || ({
    food:'Rations', potion:'Healing Potion', camp:'Camp Supplies', roadToken:'Road Token',
    woodScrap:'Wood Scrap', clothScrap:'Cloth Scrap', roadHerb:'Road Herb', wolfFang:'Wolf Fang',
    tornHide:'Torn Hide', ore:'Ore', wispAsh:'Wisp Ash', oil:'Lamp Oil', goblinTrinket:'Goblin Trinket',
    blackrootThorn:'Blackroot Thorn', brokenBellShard:'Broken Bell Shard', roadPoultice:'Road Poultice',
    blackrootTonic:'Blackroot Tonic', huntersCharm:'Hunter\'s Charm', reinforcedBuckle:'Reinforced Buckle',
    wispLanternWick:'Wisp Lantern Wick', tradeBundle:'Trade Bundle'
  }[k] || k);
  const gold = n => `${Number(n || 0)}g`;
  const bg = () => {
    const pl=p(), locations=A().locations||{};
    if(String(pl?.currentRegion||'Ashmere')==='Greyfen') return locations.greyfenMain || locations.ashmereMain || 'assets/locations/ashmere/location_ashmere_mainstreet_v1.jpg';
    return locations.ashmereMain || 'assets/locations/ashmere/location_ashmere_mainstreet_v1.jpg';
  };
  const locationInterior = kind => {
    const greyfen=String(p()?.currentRegion||'Ashmere')==='Greyfen', locations=A().locations||{};
    const key=greyfen?({inn:'greyfenInn',market:'greyfenMarket',forge:'greyfenForge',archive:'greyfenArchive'}[kind]):({inn:'ashmereInn',market:'ashmereMarket',forge:'ashmereForge',archive:'ashmereArchive'}[kind]);
    return locations[key] || bg();
  };
  const roadBg = () => A().locations?.oldRoad || 'assets/locations/roads/location_old_road_main_v1.jpg';
  const npc = id => A().npcs?.[id] || (id === 'oric' ? 'assets/generated/npcs/captain-oric.webp' : '');
  const weaponName = id => (D().weapons || []).find(w => w.id === id)?.name || id || 'Hands';
  const armorName = id => (D().armors || []).find(a => a.id === id)?.name || id || 'None';

  const icon = (k, alt='') => {
    const symbol = {"people":"people","inn":"inn","trader":"trader","smith":"smith","road":"road","sheet":"sheet","brenn":"ledger","archive":"archive","mara":"quill","oric":"captain","work":"work","craft":"craft","profile":"profile","quest":"quest","route":"route","regions":"regions","settings":"settings","gate":"gate","world":"world","notice":"notice","cloud":"cloud","account":"profile","feedback":"quest","delete":"quest","text":"ledger","bold":"sheet","contrast":"settings","motion":"road","space":"regions","font":"sheet","lock":"captain","slot":"regions","continue":"road","new":"work"}[k] || 'quest';
    return `<span class="ash099-icon" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><use href="assets/ui/icons/legend-ui-icons-v1.svg#icon-${symbol}"></use></svg></span>`;
  };
  const regionShopArt = key => {
    const path=A().ui?.regionShops?.[key];
    return path ? '<span class="ash099-icon ash099-asset-icon ash099-region-shop-icon" aria-hidden="true"><img src="'+esc(path)+'" alt="" loading="lazy" onerror="this.onerror=null;this.style.display=\'none\'"></span>' : '';
  };
  const armorArt = id => {
    const items=A().items||{};
    const keys={clothArmor:'clothArmorIcon',chainArmor:'chainArmorIcon',bronzeArmor:'bronzeArmorIcon',ironArmor:'ironArmorIcon',none:'shield'};
    const path=items[keys[id]||id]||items.shield||items.camp||'';
    return path;
  };
  const serviceArt = (key, fallback='') => {
    const path=A().ui?.serviceIcons?.[key];
    if(!path) return fallback;
    return '<span class="ash099-icon ash099-asset-icon" aria-hidden="true"><img src="'+esc(path)+'" alt="" loading="lazy" onerror="this.onerror=null;this.style.display=\'none\'"></span>';
  };
  const AUDIO_CUE = { hover:'assets/audio/ui/ui_hover_soft.wav', confirm:'assets/audio/ui/ui_confirm_gate.wav' };
  let lastHoverCue = 0;
  function playUiCue(kind){ try { const audio = new Audio(AUDIO_CUE[kind]); audio.volume = kind==='hover' ? 0.10 : 0.18; audio.play().catch(()=>{}); } catch {} }
  function bindUiAudio(){
    const host=root(); if(!host)return;
    host.querySelectorAll('button, a.btn, a.portal-secondary-btn').forEach(el=>{
      if(el.dataset.legendAudioBound)return;
      el.dataset.legendAudioBound='1';
      el.addEventListener('pointerenter',()=>{const now=Date.now();if(now-lastHoverCue>110){lastHoverCue=now;playUiCue('hover');}});
      el.addEventListener('click',()=>playUiCue('confirm'));
    });
  }
  function shell(html){ root().innerHTML = `<main class="ash099 ash099-terminal"><div class="ash099-wrap">${html}</div></main>`; bindUiAudio(); }
  function hpPct(pl){ return Math.max(0, Math.min(100, Math.round((Number(pl.hp || 0) / Math.max(1, Number(pl.maxHp || 1))) * 100))); }
  function owned(pl, k){ return Number(pl.inventory?.[k] || 0); }

  function setBellQuestObjective(pl, objective){
    pl.questLog=Array.isArray(pl.questLog)?pl.questLog:[];
    const prefix='The Bell That Rang Once:';
    const entry=prefix+' '+objective;
    const index=pl.questLog.findIndex(item=>String(item).startsWith(prefix));
    if(index>=0)pl.questLog[index]=entry;else pl.questLog.unshift(entry);
  }

  function canAfford(pl, cost){ return Number(pl.gold || 0) >= Number(cost || 0); }
  function canCraft(pl, needs){ return needs.every(([k,v]) => owned(pl,k) >= Number(v || 0)); }
  function needsMarkup(pl, needs){ return needs.map(([k,v])=>{const art=itemIcon(k);return '<span class="ash099-craft-ingredient">'+(art?'<img src="'+esc(art)+'" alt="" aria-hidden="true" loading="lazy" onerror="this.onerror=null;this.style.display=\'none\'">':'')+'<span>'+Number(v)+' '+esc(itemName(k))+' <small>('+owned(pl,k)+')</small></span></span>';}).join(''); }
  function note(msg){ const n = document.getElementById('ashNote'); if(n){ n.style.display='block'; n.textContent=msg; } }

  function goal(pl){
    const t = Number(pl?.inventory?.roadToken || 0);
    if(String(pl?.currentRegion||'Ashmere')==='Greyfen'){
      if(!pl?.flags?.greyfenDryCrossingComplete) return { view:'crossing', title:'Recover the Washed Marker', text:'The Landing Warden needs the route marker before travelers can trust the raised causeway again. Choose the safer posts or risk the reed-bed shortcut.', cta:'Take A Dry Crossing', icon:'route', tasks:['Choose a route with disclosed risks','Recover the marker','Record the crossing in the Boundary Archive'] };
      return { view:'people', title:'Learn Greyfen’s Old Marks', text:'The lowland town sits on drowned foundations. Ask the road-worn keepers what they know, trade what the marsh has yielded, and prepare before following the next marker.', cta:'Meet the Town’s Keepers', icon:'people', tasks:['Ask about the boundary stones','Trade or prepare supplies','Return to Ashmere when ready'] };
    }
    if(!pl?.flags?.talkedToMara) return { view:'people', title:'Report to the Square', text:'Ashmere does not trust strangers from the road. Speak with Mara, Brenn, and Oric before crossing the lantern line.', cta:'Enter Town Square', icon:'people', tasks:['Meet Mara Vell','Speak with Old Brenn','Hear Oric\'s warning'] };
    if(!pl.flags.firstRoadEvent) return { view:'inn', title:'Prepare Before the Gate', text:'Rest, gather supplies, check gear, or take a small town job before your first Old Road expedition.', cta:'Prepare in Town', icon:'inn', tasks:['Visit the Work Board','Check gear at the Blacksmith','Rest at the Inn'] };
    if(t < 5) return { view:'road', title:'Open the First Region', text:`You have ${t}/5 Road Tokens. Explore the Old Road, bring back proof, and use the tokens to open Greyfen.`, cta:'Leave Through the Gate', icon:'road', tasks:[`${t}/5 Road Tokens collected`,'Return alive','Open Greyfen on the world map'] };
    return { view:'regions', title:'Open the Regional Ledger', text:'You have enough Road Tokens to begin opening the world beyond Ashmere. Spend them on a region, then pay gold to travel between places you know.', cta:'View the Road Network', icon:'regions', tasks:['Spend Road Tokens to unlock a region','Pay gold to travel','Return to Ashmere whenever you need'] };
  }

  function currentRouteCard(g){
    return `<aside class="ash100-route-strip"><span class="ash100-route-strip-icon">${icon('route')}</span><div class="ash100-route-strip-copy"><span>Current Route</span><strong>${esc(g.title)}</strong><small>${esc(g.text)}</small></div><button class="ash099-btn primary" data-ash-view="${esc(g.view)}">${esc(g.cta)}</button></aside>`;
  }
  function terminalNav(){
    const greyfen=String(p()?.currentRegion||'Ashmere')==='Greyfen',townLabel=greyfen?'Greyfen':'Town';
    const ariaLabel=greyfen?'Greyfen town navigation':'Ashmere terminal navigation';
    return `<nav class="ash099-footer ash099-topnav" aria-label="${ariaLabel}"><button class="ash099-footer-item active" data-ash-view="home">${icon('inn')}<span>${townLabel}</span></button><button class="ash099-footer-item" data-ash-view="people">${icon('people')}<span>People</span></button><button class="ash099-footer-item" data-ash-view="routes">${icon('road')}<span>Routes</span></button><button class="ash099-footer-item" data-ash-view="archive">${icon('archive')}<span>Journal</span></button><button class="ash099-footer-item" data-ash-view="profile">${icon('profile')}<span>Profile</span></button><button class="ash099-footer-item" data-ash-view="sheet">${icon('sheet')}<span>Traveler</span></button></nav>`;
  }

  function renderAshmere(){
    const pl=p(); if(!pl) return;
    const g=goal(pl);
    const isGreyfen=String(pl.currentRegion||'Ashmere')==='Greyfen';
    const townName=isGreyfen?'Greyfen':'Ashmere';
    const tokenCount=Number(pl.inventory?.roadToken||0);
    const health=Math.max(0,Math.min(100,Math.round(Number(pl.hp||0)/Math.max(1,Number(pl.maxHp||1))*100)));
    const townCard=(view,title,desc,cta,ic,featured=false)=>{
      const shopKey=isGreyfen?({trader:'greyfenMarket',smith:'greyfenForge'}[view]):({inn:'ashmereInn',trader:'ashmereTrader',smith:'ashmereForge'}[view]);
      const shopIcon=shopKey?regionShopArt(shopKey):'';
      return `<button class="ash100-destination ${featured?'featured':''}" data-ash-view="${esc(view)}"><span class="ash100-destination-icon">${shopIcon||icon(ic)}</span><span class="ash100-destination-copy"><strong>${esc(title)}</strong><small>${esc(desc)}</small></span><em>${esc(cta)}</em></button>`;
    };
    const destinations=isGreyfen?[
      townCard('inn','Reedlight Inn','Rest, recover, and hear what the lowland travelers whisper.','Rest & prepare','inn',g.view==='inn'),
      townCard('trader','Marsh Market','Trade road loot for rations, medicine, and useful supplies.','Trade','trader',false),
      townCard('smith','Causeway Smithy','Equip better gear and turn gathered materials into useful things.','Gear & craft','smith',false),
      townCard('people','Town Square','Meet the keepers and travelers who know the drowned roads.','Meet the town','people',g.view==='people'),
      townCard('crossing','A Dry Crossing',pl.flags?.greyfenDryCrossingComplete?'The washed route marker is recovered and recorded.':'Recover a washed route marker. Choose the raised posts or risk the reed bed. ',pl.flags?.greyfenDryCrossingComplete?'Review contract':'Take contract','route',g.view==='crossing'),
      townCard('work','Bellkeeper’s Hall','Take practical work while learning the rhythms of Greyfen.','Find work','work',g.view==='work'),
      townCard('regions','Road Network','Return to Ashmere or travel between lands you have unlocked.','Travel','regions',g.view==='regions')
    ].join(''):[
      townCard('inn','Ashmere Inn','Rest, recover, buy supplies, and hear what travelers are saying.','Rest & prepare','inn',g.view==='inn'),
      townCard('trader','Market','Buy essentials, sell road loot, and turn discoveries into gold.','Trade','trader',false),
      townCard('smith','Forge & Workshop','Upgrade weapons and armor, then use the crafting bench for road finds.','Gear & craft','smith',false),
      townCard('people','Town Square','Talk with Mara Vell, Old Brenn, and Captain Oric. Hear warnings and follow local stories.','Meet the town','people',g.view==='people'||g.view==='mara'||g.view==='brenn'||g.view==='oric'),
      townCard('work','Work Board','Take paid jobs, test your timing, and earn gold plus useful supplies.','Browse jobs','work',g.view==='work'),
      townCard('road','Old Road Gate','Begin the expedition; find clues, face danger, and bring proof home.','Begin expedition','road',g.view==='road'),
      townCard('regions','Road Network','Unlock new regions with Road Tokens, then travel between places you know for gold.','Open map','regions',g.view==='regions')
    ].join('');
    shell(`
      <section class="ash100-town ${isGreyfen?'ash100-town-greyfen':'ash100-town-ashmere'}">
        <div class="ash100-hero">${img(bg(),townName+' at dusk')}<div class="ash100-hero-copy"><div class="ash099-kicker">${isGreyfen?'THE LOWLANDS · GREYFEN':'ROADS OF ASHMERE'}</div><h1>${townName}</h1><p>${isGreyfen?'Built on drowned stone, held together by lanterns, and full of old boundary marks.':'Warm lights. Open roads. A place to return to.'}</p></div></div>
        <div class="ash100-route-dock">${currentRouteCard(g)}</div>
        <section class="ash100-status" aria-label="Traveler status">
          <div class="ash100-status-traveler"><span>${esc(pl.username||'Traveler')}</span><small>${esc(pl.className||'Wanderer')} · Day ${Number(pl.day||1)}</small></div>
          <div class="ash100-status-health"><span>Health</span><strong>${Number(pl.hp||0)} / ${Number(pl.maxHp||0)}</strong><i><b style="width:${health}%"></b></i></div>
          <div class="ash100-status-resources"><span>${tokenCount} Road Tokens</span><small>${gold(pl.gold)} · ${townName}${tokenCount>=5?' · Greyfen open':''}</small></div>
        </section>
        <section class="ash100-destination-section">
          <div class="ash100-section-head"><div><div class="ash099-kicker">${isGreyfen?'LOWLAND DISTRICT':'ASHMERE'}</div><h2>${isGreyfen?'Find your footing':'Where next?'}</h2></div></div>
          <div class="ash100-destinations">${destinations}</div>
        </section>
        ${terminalNav()}
      </section>`);
    bind();
  }
  function bind(){ document.querySelectorAll('[data-ash-view]').forEach(b => b.onclick = () => route(b.dataset.ashView)); }
  function route(v){
    if(v === 'home') return renderAshmere();
    if(v === 'people') return renderPeople();
    if(v === 'mara' || v === 'brenn' || v === 'oric') return renderNPC(v);
    if(v === 'inn') return renderInn();
    if(v === 'trader') return renderTrader();
    if(v === 'smith') return renderSmith();
    if(v === 'work') return renderWorkBoard();
    if(v === 'crossing') return renderDryCrossing();
    if(v === 'craft') return renderCrafting();
    if(v === 'sheet') return renderSheet();
    if(v === 'archive') return renderArchive();
    if(v === 'profile') {
      if(window.LegendAccountV09x?.renderAccount) return window.LegendAccountV09x.renderAccount();
      return renderAshmere();
    }
    if(v === 'routes') return renderRoutes();
    if(v === 'quests') return renderSideContracts();
    if(v === 'road') return startRoad();
    if(v === 'regions') {
      if(window.LegendRegionsV100?.render) return window.LegendRegionsV100.render();
      return renderAshmere();
    }
    return renderAshmere();
  }
  function back(extra = ''){ const region=String(p()?.currentRegion||'Ashmere'); const label=region==='Greyfen'?'Back to Greyfen':'Back to Ashmere'; return `<div class="ash099-bottom">${extra}<button class="ash099-btn primary" id="ashBack">${label}</button></div>`; }
  function head(k,t,d,im='',fallbackIcon='quest'){ return `<div class="ash099-head ${im ? 'has-art' : 'no-art'}">${im ? img(im,t) : `<div class="ash099-head-icon">${icon(fallbackIcon)}</div>`}<div><div class="ash099-kicker">${esc(k)}</div><h1>${esc(t)}</h1><p>${esc(d)}</p></div></div>`; }
  function screen(h,b,extra=''){ shell(`<section class="ash099-screen">${h}${b}${back(extra)}</section>`); document.getElementById('ashBack').onclick = renderAshmere; bind(); }

  function renderRoutes(){
    const greyfen=String(p()?.currentRegion||'Ashmere')==='Greyfen';
    if(greyfen){
      screen(head('Causeway Board','Lowland Crossings','The Old Road begins in Ashmere. From Greyfen, choose a known route, check local records, or learn which crossings remain safe.',locationInterior('archive'),'route'),`
        <div class="ash099-cards">
          <button class="ash099-btn ash099-card" data-ash-view="regions">${icon('regions')}<strong>Road Network</strong><small>Pay the fare to return to Ashmere or travel onward to lands already opened.</small><em>Open map</em></button>
          <button class="ash099-btn ash099-card" data-ash-view="people">${icon('people')}<strong>Ask the Keepers</strong><small>Compare the old boundary marks and hear the latest causeway warnings.</small><em>Visit the hall</em></button>
          <button class="ash099-btn ash099-card" data-ash-view="quests">${icon('quest')}<strong>Side Stories & Contracts</strong><small>Take keeper requests that reward exploration, victories, and a safe return.</small><em>Read postings</em></button>
        </div>`);
      return;
    }
    screen(head('Route Board','Routes & Expeditions','Choose your next destination. Open the regional network to unlock new lands, or enter the Old Road to search, fight, and bring proof home.',bg(),'route'),`
      <div class="ash099-cards">
        <button class="ash099-btn ash099-card" data-ash-view="road">${icon('road')}<strong>The Old Road</strong><small>Start a five-stage expedition with encounters, finds, and a safe return path.</small><em>Begin expedition</em></button>
        <button class="ash099-btn ash099-card" data-ash-view="regions">${icon('regions')}<strong>Road Network</strong><small>View known regions, spend Road Tokens to unlock new lands, and travel between places.</small><em>Open map</em></button>
        <button class="ash099-btn ash099-card" data-ash-view="quests">${icon('quest')}<strong>Side Stories & Contracts</strong><small>Follow local stories that ask you to scout, survive a fight, or bring an expedition home.</small><em>Read postings</em></button>
      </div>`);
  }

  function contractsContext(){
    return {
      getPlayer: p,
      savePlayer: save,
      escapeHtml: esc,
      itemName,
      head,
      screen,
      locationInterior,
      renderTown: renderAshmere,
      awardProgress: (player, amount) => window.LegendProgressionV100?.award(player, amount)
    };
  }

  function renderSideContracts(message=''){
    const contracts = window.LegendAshmereContractsV099;
    if (contracts?.render) return contracts.render(contractsContext(), 'contracts', message);
    screen(head('Journal & Notices', 'Side Stories & Road Contracts', 'The contracts module did not load.', locationInterior('archive'), 'quest'),
      '<p>Contracts are unavailable. Return to town and refresh before trying again.</p>');
  }

  function renderDryCrossing(){
    const contracts = window.LegendAshmereContractsV099;
    if (contracts?.render) return contracts.render(contractsContext(), 'crossing');
    screen(head('Greyfen Contract', 'A Dry Crossing', 'The crossing module did not load.', locationInterior('archive'), 'route'),
      '<p>The crossing contract is unavailable. Return to town and refresh before trying again.</p>');
  }

  function peopleContext(){
    return {
      getPlayer: p,
      savePlayer: save,
      getAssets: A,
      escapeHtml: esc,
      imageMarkup: img,
      background: bg,
      npcArt: npc,
      setBellQuestObjective,
      note,
      head,
      screen
    };
  }

  function renderPeople(){
    const people = window.LegendAshmerePeopleV099;
    if (people?.render) return people.render(peopleContext(), 'people');
    screen(head('Town Square', 'People of Ashmere', 'The people module did not load.', bg(), 'people'),
      '<p>Town characters are unavailable. Return to town and refresh before trying again.</p>');
  }

  function renderNPC(id){
    const people = window.LegendAshmerePeopleV099;
    if (people?.render) return people.render(peopleContext(), 'npc', id);
    screen(head('Town Square', 'Town Character', 'The people module did not load.', bg(), 'people'),
      '<p>Dialogue is unavailable. Return to town and refresh before trying again.</p>');
  }

  function renderInn(){
    const inn = window.LegendAshmereInnV099;
    if (inn?.render) {
      return inn.render({
        getPlayer: p,
        savePlayer: save,
        locationInterior,
        head,
        screen,
        escapeHtml: esc,
        gold,
        serviceArt,
        icon,
        note
      });
    }
    screen(head('Inn & Lodging', 'The Inn', 'The inn module did not load.', locationInterior('inn'), 'inn'),
      '<p>Inn services are unavailable. Return to town and refresh before trying again.</p>');
  }

  function renderWorkBoard(){
    const workBoard = window.LegendAshmereWorkV099;
    if (workBoard?.render) {
      return workBoard.render({
        getPlayer: p,
        savePlayer: save,
        screen,
        head,
        locationInterior,
        esc,
        gold,
        itemName,
        awardProgress: (player, amount) => window.LegendProgressionV100?.award(player, amount)
      });
    }
    screen(head('Local Work', 'Work Board', 'The work board module did not load.', locationInterior('archive'), 'work'),
      '<p>Local jobs are unavailable. Return to town and refresh before trying again.</p>');
  }

  function commerceContext(){
    return {
      getPlayer: p,
      savePlayer: save,
      getAssets: A,
      getData: D,
      itemIcon,
      itemName,
      gold,
      locationInterior,
      head,
      screen,
      esc,
      icon,
      canAfford,
      owned,
      note,
      canCraft,
      needsMarkup,
      armorArt,
      weaponName,
      armorName,
      regionShopArt
    };
  }

  function renderTrader(tab='buy'){
    const commerce = window.LegendAshmereCommerceV099;
    if (commerce?.render) return commerce.render(commerceContext(), 'trader', tab);
    screen(head('Market', 'Trading Post', 'The commerce module did not load.', locationInterior('market'), 'trader'),
      '<p>Trading is unavailable. Return to town and refresh before trying again.</p>');
  }

  function renderCrafting(feedback=''){
    const commerce = window.LegendAshmereCommerceV099;
    if (commerce?.render) return commerce.render(commerceContext(), 'crafting', feedback);
    screen(head('Crafting', 'Crafting Bench', 'The crafting module did not load.', locationInterior('forge'), 'craft'),
      '<p>Crafting is unavailable. Return to town and refresh before trying again.</p>');
  }

  function renderSmith(tab='weapon'){
    const commerce = window.LegendAshmereCommerceV099;
    if (commerce?.render) return commerce.render(commerceContext(), 'smith', tab);
    screen(head('Workshop', 'The Blacksmith', 'The equipment module did not load.', locationInterior('forge'), 'smith'),
      '<p>Equipment services are unavailable. Return to town and refresh before trying again.</p>');
  }

  function renderSheet(){
    const records = window.LegendAshmereRecordsV099;
    if (records?.renderSheet) {
      return records.renderSheet({
        player: p(),
        assets: A(),
        data: D(),
        esc,
        itemIcon,
        itemName,
        weaponName,
        armorName,
        armorArt,
        gold,
        hpPct,
        head,
        screen
      });
    }
    screen(head('Traveler', 'Traveler', 'The traveler records module did not load.', '', 'profile'),
      '<p>Traveler records are unavailable. Return to town and refresh before trying again.</p>');
  }

  function renderArchive(){
    const records = window.LegendAshmereRecordsV099;
    if (records?.renderArchive) {
      const pl = p();
      return records.renderArchive({
        player: pl,
        currentRegion: pl?.currentRegion || 'Ashmere',
        locationInterior,
        esc,
        head,
        screen
      });
    }
    screen(head('Records', 'Archive Hall', 'The archive module did not load.', '', 'archive'),
      '<p>The journal is unavailable. Return to town and refresh before trying again.</p>');
  }

  function startRoad(){if(window.LegendRoadControllerV100?.start)return window.LegendRoadControllerV100.start();screen(head('Town Gate','Old Road','The expedition system could not load.',roadBg(),'road'),'<p>Return to the title and refresh before trying again.</p>');}
  function intercept(){const text=document.body?.innerText||'';if(/Ashmere Menu|Ashmere • First Town/.test(text)&&!document.querySelector('.ash099'))renderAshmere();}
  window.LegendAshmereV099={renderAshmere,route};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',intercept);else intercept();
  const rt=RT(); if(rt.onRender)rt.onRender(intercept);
})();