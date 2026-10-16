// LEGEND v0.9.x - Ashmere Town Hub Controller
// Owns Ashmere directly: RPG town terminal, direct routes, no title reload for town returns.
(() => {
  const RT = () => window.LegendRuntimeV080 || {};
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
  function stat(label, value){ return `<div class="ash099-stat"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`; }
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
  function needsText(pl, needs){ return needs.map(([k,v]) => `${v} ${itemName(k)} (${owned(pl,k)})`).join(', '); }
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

  function actionCard(view, title, desc, label = 'Open', featured = false, ic = view){
    return `<button class="ash099-btn ash099-action ${featured ? 'featured' : ''}" data-ash-view="${esc(view)}">${icon(ic)}<span><strong>${esc(title)}</strong><small>${esc(desc)}</small></span><em>${esc(label)}</em></button>`;
  }
  function actionGroup(title, text, body, kind = ''){
    return `<section class="ash099-action-group ${kind}"><header><h3>${esc(title)}</h3><p>${esc(text)}</p></header><div class="ash099-group-grid">${body}</div></section>`;
  }
  function miniMeter(pl){ return `<div class="ash099-meter"><span>Health</span><strong>${Number(pl.hp || 0)}/${Number(pl.maxHp || 0)}</strong><i style="width:${hpPct(pl)}%"></i></div>`; }
  function currentRouteCard(g){
    return `<aside class="ash100-route-strip"><span class="ash100-route-strip-icon">${icon('route')}</span><div class="ash100-route-strip-copy"><span>Current Route</span><strong>${esc(g.title)}</strong><small>${esc(g.text)}</small></div><button class="ash099-btn primary" data-ash-view="${esc(g.view)}">${esc(g.cta)}</button></aside>`;
  }
  function travelerTerminal(pl){
    const name = pl.username || 'Traveler';
    return `<aside class="ash099-panel ash099-traveler-panel ash099-terminal-card"><h3>Traveler Terminal</h3><div class="ash099-traveler-identity"><div class="ash099-avatar"><span>${esc(String(name).slice(0,1)).toUpperCase()}</span></div><div><strong>${esc(name)}</strong><small>${esc(pl.className || 'Wanderer')}</small></div></div>${miniMeter(pl)}<div class="ash099-stats">${stat('Class', pl.className || 'Wanderer')}${stat('Level', Number(pl.level||1))}${stat('XP', `${Number(pl.xp||0)}/${Number(pl.level||1)*100}`)}${stat('Gold', gold(pl.gold))}${stat('Road Tokens', `${Number(pl.inventory?.roadToken || 0)}/5`)}${stat('Weapon', weaponName(pl.weapon))}${stat('Armor', armorName(pl.armor))}${stat('Jobs Done', Number(pl.flags?.ashmereJobs || 0))}</div><p class="ash099-trait"><strong>Origin & Nature</strong><br>${esc(pl.personalityLabel || 'Unknown traveler')} • ${esc(pl.origin || 'Unknown origin')}</p></aside>`;
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

  const sideContracts=[
    {id:'watchlightSurvey',title:'The Watchlight Survey',giver:'Captain Oric',description:'The watch captain needs fresh proof of what lies beyond the lantern line. Find one roadside point of interest after accepting this contract.',objective:'Investigate one new roadside discovery on the Old Road.',counter:'poi',gold:55,xp:25,item:'food',amount:1,completeText:'Oric studies your notes and marks a safer stretch of the lantern line.'},
    {id:'blackrootProof',title:'Proof from the Blackroot Road',giver:'Old Brenn',description:'Brenn will pay for proof that you can handle the dangers beyond Ashmere. Win a road battle after taking the posting.',objective:'Win one road battle after accepting this contract.',counter:'battle',gold:75,xp:35,item:'clothScrap',amount:1,completeText:'Brenn accepts your proof without asking how close the fight came.'},
    {id:'maraSafeReturn',title:'Mara’s Missing Road Ledger',giver:'Mara Vell',description:'Mara needs a complete field report, not another half-told rumor. Secure a five-stage expedition and return after accepting the posting.',objective:'Complete and secure one five-stage Old Road expedition.',counter:'return',gold:95,xp:50,item:'oil',amount:1,completeText:'Mara copies your route notes into the town archive and rewards the complete report.'},
    {id:'movedCairn',title:'The Moved Cairn',giver:'Captain Oric',description:'Oric suspects the Ridgeway Cairn no longer points where it was meant to. Take the High Ridge, inspect the stone, then choose whether to restore it, record both alignments, or mark the hazard.',objective:'Investigate the Ridgeway Cairn and file a report on its shifted stone.',counter:'movedCairn',gold:70,xp:40,item:'roadHerb',amount:1,completeText:'Oric files your report as a real warning instead of another rumor.'}
  ];
  function sideContractCounter(pl,key){
    const stats=pl?.stats||{};
    if(key==='poi')return Number(stats.pointsOfInterest||0);
    if(key==='battle')return Number(stats.roadVictories||0);
    if(key==='return')return Number(stats.oldRoadClears||0);
    if(key==='movedCairn')return pl?.flags?.sideContracts?.movedCairn?.decision?1:0;
    return 0;
  }
  function renderSideContracts(message=''){
    const pl=p();if(!pl)return;
    pl.flags=pl.flags||{};
    const saved=pl.flags.sideContracts||{};
    const cards=sideContracts.map(q=>{
      const state=saved[q.id];
      let status='AVAILABLE',action='<button type="button" class="ash099-btn primary" data-contract-accept="'+q.id+'">Accept Contract</button>',progress='Not started';
      if(state?.complete){
        status='COMPLETED';action='<span class="ash099-contract-complete">✓ Recorded in Journal</span>';progress='Reward claimed';
      }else if(state){
        const now=sideContractCounter(pl,q.counter),ready=now>Number(state.startedAt||0);
        progress=ready?'Objective fulfilled · ready to report':'In progress · 0 / 1';
        if(ready){status='READY TO REPORT';action='<button type="button" class="ash099-btn primary" data-contract-turnin="'+q.id+'">Report Completion</button>';}
        else{status='IN PROGRESS';action='<span class="ash099-contract-pending">Return when the objective is complete</span>';}
      }
      return '<article class="ash099-contract-card ash099-contract-'+status.toLowerCase().replaceAll(' ','-')+'"><header><span>'+esc(status)+'</span><small>POSTED BY '+esc(q.giver.toUpperCase())+'</small></header><h2>'+esc(q.title)+'</h2><p>'+esc(q.description)+'</p><div class="ash099-contract-objective"><span>OBJECTIVE</span><strong>'+esc(q.objective)+'</strong><small>'+esc(progress)+'</small></div><footer><div><span>REWARD</span><strong>'+q.gold+'g · '+q.xp+' XP</strong><small>Bonus: '+esc(itemName(q.item))+' ×'+q.amount+'</small></div>'+action+'</footer></article>';
    }).join('');
    const body='<section class="ash099-contract-ledger"><div class="ash099-contract-intro"><span class="ash099-job-overline">LOCAL STORIES · FIELD CONTRACTS</span><h2>Work that takes you beyond the board</h2><p>These one-time requests progress while you explore and fight. Accept a posting before doing the work; completed objectives can be turned in here.</p></div><div class="ash099-contract-list">'+cards+'</div>'+(message?'<p class="ash099-note" role="status">'+esc(message)+'</p>':'')+'</section>';
    screen(head('Journal & Notices','Side Stories & Road Contracts','Four local requests add reasons to investigate the road, win a dangerous encounter, investigate a shifted marker, and bring a complete expedition home.',locationInterior('archive'),'quest'),body);
    document.querySelectorAll('[data-contract-accept]').forEach(b=>b.onclick=()=>{
      const q=sideContracts.find(x=>x.id===b.dataset.contractAccept);if(!q)return;
      const player=p();if(!player)return;player.flags=player.flags||{};player.flags.sideContracts=player.flags.sideContracts||{};
      if(player.flags.sideContracts[q.id])return renderSideContracts('That posting is already in your journal.');
      player.flags.sideContracts[q.id]={startedAt:sideContractCounter(player,q.counter),complete:false};
      save(player);renderSideContracts('Accepted: '+q.title+'. '+q.objective);
    });
    document.querySelectorAll('[data-contract-turnin]').forEach(b=>b.onclick=()=>{
      const q=sideContracts.find(x=>x.id===b.dataset.contractTurnin);if(!q)return;
      const player=p();if(!player)return;player.flags=player.flags||{};player.flags.sideContracts=player.flags.sideContracts||{};
      const state=player.flags.sideContracts[q.id];
      if(!state||state.complete||sideContractCounter(player,q.counter)<=Number(state.startedAt||0))return renderSideContracts('The objective is not ready to turn in yet.');
      state.complete=true;player.gold=Number(player.gold||0)+q.gold;player.inventory=player.inventory||{};player.inventory[q.item]=Number(player.inventory[q.item]||0)+q.amount;
      player.flags.ashmereFavor=Number(player.flags.ashmereFavor||0)+2;player.stats=player.stats||{};player.stats.sideContractsCompleted=Number(player.stats.sideContractsCompleted||0)+1;
      player.memories=Array.isArray(player.memories)?player.memories:[];
      player.memories.push('Completed side contract: '+q.title+'.');
      let completeText=q.completeText;
      if(q.id==='movedCairn'){
        player.flags.highRidgeCairnOutcome=state.decision||'record';
        completeText=state.decision==='restore'
          ?'Oric records the repair and sends a warning to the road crew: the shifted stone must be checked before carts use the lower track.'
          :state.decision==='warn'
            ?'Oric accepts the warning and logs the hazard. The stone stays in place until a proper survey can be arranged.'
            :'Oric files both alignments in the route ledger. He will not let a clean-looking marker erase the evidence that it was moved.';
      }
      const progress=window.LegendProgressionV100?.award(player,q.xp);
      save(player);
      renderSideContracts('Contract complete. '+completeText+' +'+q.gold+'g, '+q.xp+' XP, and '+q.amount+' '+itemName(q.item)+'.'+(progress?.levels?' Level up! You are now level '+progress.level+'.':''));
    });
  }
function renderDryCrossing(){
    const pl=p(); if(!pl)return;
    if(String(pl.currentRegion||'Ashmere')!=='Greyfen')return renderAshmere();
    const completed=Boolean(pl.flags?.greyfenDryCrossingComplete);
    const description="The Landing Warden needs a route marker that washed loose from the raised path. The marker will help travelers avoid a newly opened sink in the marsh.";
    if(completed){
      return screen(head('Greyfen Contract','A Dry Crossing','The marker has been recovered and entered in the Boundary Archive.',locationInterior('archive'),'route'),
        '<div class="ash099-lines"><p>The recovered marker now points travelers toward the raised causeway. The bellkeeper has copied its position into the lowland ledger.</p><p><strong>Contract complete.</strong> This one-time contract cannot be claimed again.</p></div>');
    }
    screen(head('Greyfen Contract','A Dry Crossing',description,locationInterior('archive'),'route'),
      '<div class="ash099-lines"><p>Choose a route before leaving the landing. Both options are explained up front; a failed reed-bed attempt can be retried, but the marsh will take a toll.</p></div>'+
      '<div class="ash099-cards">'+
        '<button class="ash099-btn ash099-card" data-crossing-choice="posts"><strong>Follow the Old Posts</strong><small>Safer and slower. Guaranteed marker recovery. Reward: 35g and 1 Road Herb. No health risk.</small><em>Take the raised path</em></button>'+
        '<button class="ash099-btn ash099-card" data-crossing-choice="reeds"><strong>Cut Through the Reed Bed</strong><small>Faster but uncertain. 65% chance to recover the marker for 65g and 2 Road Herbs. On a miss: no reward, lose 5 HP, and you may retry.</small><em>Risk the shortcut</em></button>'+
      '</div>');
    document.querySelectorAll('[data-crossing-choice]').forEach(b=>b.onclick=()=>settleDryCrossing(b.dataset.crossingChoice));
  }
  function settleDryCrossing(choice){
    const pl=p(); if(!pl)return;
    if(String(pl.currentRegion||'Ashmere')!=='Greyfen')return renderAshmere();
    pl.flags=pl.flags||{}; pl.inventory=pl.inventory||{};
    if(pl.flags.greyfenDryCrossingComplete)return renderDryCrossing();
    let heading='',detail='';
    if(choice==='posts'){
      pl.flags.greyfenDryCrossingComplete=true;
      pl.gold=Number(pl.gold||0)+35;
      pl.inventory.roadHerb=Number(pl.inventory.roadHerb||0)+1;
      heading='The marker is safe';
      detail='You followed the old posts and found the marker caught between two raised stones. Reward: 35g and 1 Road Herb. No health lost.';
      pl.memories=pl.memories||[]; pl.memories.push('You recovered Greyfen’s washed route marker by following the old posts.');
    }else if(choice==='reeds'){
      pl.flags.greyfenCrossingAttempts=Number(pl.flags.greyfenCrossingAttempts||0)+1;
      if(Math.random()<0.65){
        pl.flags.greyfenDryCrossingComplete=true;
        pl.gold=Number(pl.gold||0)+65;
        pl.inventory.roadHerb=Number(pl.inventory.roadHerb||0)+2;
        heading='The shortcut pays off';
        detail='You read the current correctly and caught the marker before it slipped beneath the reeds. Reward: 65g and 2 Road Herbs.';
        pl.memories=pl.memories||[]; pl.memories.push('You recovered Greyfen’s washed route marker through the reed bed.');
      }else{
        pl.hp=Math.max(1,Number(pl.hp||1)-5);
        heading='The reeds turn you back';
        detail='The mud gives way before you reach the marker. You escape with nothing but a bruised shoulder and lose 5 HP. You may try again or take the safer raised path.';
        pl.memories=pl.memories||[]; pl.memories.push('The reed bed turned you back from Greyfen’s washed route marker; you lost 5 HP.');
      }
    }else return renderDryCrossing();
    save(pl);
    screen(head('Contract Result',heading,'Your choice has been recorded.',locationInterior('archive'),'route'),
      '<div class="ash099-lines"><p>'+esc(detail)+'</p><p>'+esc(pl.flags.greyfenDryCrossingComplete?'The marker’s location is now recorded in the Boundary Archive.':'The contract remains open until the marker is recovered.')+'</p></div>');
  }

  function renderPeople(){
    const greyfen=String(p()?.currentRegion||'Ashmere')==='Greyfen';
    const people=greyfen?[
      ['mara','Mara Vell','Boundary Archivist','Copies the bell-marks and boundary stones that emerge from the drowned roads.'],
      ['brenn','Old Brenn','Bellkeeper’s Ledger','Records causeway crossings, missing travelers, and recovered proof.'],
      ['oric','Captain Oric','Causeway Watch','Knows which raised paths hold after rain and which vanish beneath the reeds.']
    ]:[
      ['mara','Mara Vell','Archive Keeper','The first person to ask about the bell that rang when you arrived.'],
      ['brenn','Old Brenn','Ledger Keeper','Records Road Tokens, proof, and what Ashmere owes returning travelers.'],
      ['oric','Captain Oric','Gate Captain','Offers practical warnings before you leave the lantern line.']
    ];
    const cards=people.map(([id,name,role,desc])=>'<button class="ash099-btn ash099-npc-card" data-ash-view="'+id+'">'+img(npc(id),name)+'<strong>'+name+'</strong><small>'+role+' · '+desc+'</small></button>').join('');
    screen(head(greyfen?'Lowland Keepers':'Town Square',greyfen?'People of Greyfen':'People of Ashmere',greyfen?'The causeway brings records, warnings, and rumors up from the drowned roads.':'The square is where Ashmere watches newcomers decide who they are.',bg(),'people'),'<div class="ash099-npc-grid">'+cards+'</div>');
  }

  function renderNPC(id){
    const pl=p(); if(!pl)return;
    const greyfen=String(pl.currentRegion||'Ashmere')==='Greyfen';
    const ashMap={
      mara:{name:'Mara Vell',role:'Archive Keeper',art:npc('mara'),text:'Mara keeps Ashmere\'s records in careful stacks, as if the town might fall apart without her hands holding it together.',lines:['The bell rang once when you arrived. That should not be possible.','If the road truly woke for you, Old Road may still hide proof of what changed.','Bring back Road Tokens. Bring back anything the road should not have remembered.']},
      brenn:{name:'Old Brenn',role:'Ledger Keeper',art:npc('brenn'),text:'Brenn keeps ink, coin, and consequences in the same room. Nothing counts in Ashmere until it is written down.',lines:['Road Tokens matter. Bell Fragments matter more.','The road forgets. I do not.','If you have three Road Tokens, I can record your first proof.']},
      oric:{name:'Captain Oric',role:'Gate Captain',art:npc('oric'),text:'Oric watches the gate like the road owes him blood.',lines:['Out there, hesitation gets people buried.','Guard when the hit looks heavy. Fall back before pride gets you killed.','Preparation is not cowardice. It is why veterans get old.']}
    };
    const fenMap={
      mara:{name:'Mara Vell',role:'Boundary Archivist',art:npc('mara'),text:'Mara has set up a temporary desk in Greyfen’s boundary archive. Every bell-mark she copies seems older than the stone it was carved into.',lines:['These stones were markers before they were graves. I am still deciding which they are now.','The light in the reeds is not a lantern. It only wants you to follow it like one.','Bring me a rubbing of any bell-mark you find. I will compare it to the drowned records.']},
      brenn:{name:'Old Brenn',role:'Bellkeeper’s Ledger',art:npc('brenn'),text:'Brenn has carried his ledger across the causeway. Here, the ink records more than rewards: crossings, disappearances, and debts no one wants to claim.',lines:['Greyfen pays in proof, not promises. Keep every token you earn.','A crossing costs coin. A safe crossing costs preparation.','I am keeping a separate line for those who hear the bell after dark.']},
      oric:{name:'Captain Oric',role:'Causeway Watch',art:npc('oric'),text:'Oric watches the raised paths between Greyfen and the drowned lowlands. He marks every stretch that can vanish after heavy rain.',lines:['Stay on the old stone where you can. Reeds hide holes deep enough to swallow a cart.','If something keeps pace with you in the water, do not turn your lantern toward it.','Rest before the causeway narrows. There is nowhere to stand once the flood reaches the markers.']}
    };
    const n=(greyfen?fenMap:ashMap)[id]||(greyfen?fenMap:ashMap).mara;
    if(greyfen&&id==='mara'&&pl.flags?.greyfenEvidenceFiled){
      n.lines=[
        'The field note, the crossing ledger, and the earlier weekly return are now preserved together. Each record tells a different part of the same route history.',
        'The lower crossing was officially closed pending inspection, then marked open without initials. We have evidence of an alteration, not the name of the person who made it.',
        'The missing closure order is our next lead. Until it is found, no honest record lets us say who authorized the change.'
      ];
    }else if(greyfen&&id==='mara'&&pl.flags?.greyfenWeeklyReturnReported){
      n.lines=[
        'The field note, the crossing ledger, and the earlier weekly return are now preserved together. Each record tells a different part of the same route history.',
        'The lower crossing was officially closed pending inspection, then marked open without initials. We have evidence of an alteration, not the name of the person who made it.',
        'The missing closure order is our next lead. Until it is found, no honest record lets us say who authorized the change.'
      ];
    }else if(greyfen&&id==='mara'&&pl.flags?.greyfenFieldNoteFound){
      n.lines=[
        'The field note is dated two days after Greyfen logged the flood’s retreat. Its sketch already shows the newer cut pointing into the reed bed.',
        'The date means the cut was present after the flood was recorded; the water alone does not account for it. The signature is lost, so the writer remains unknown.',
        'Take the date to Brenn. His ledger may show which deliveries changed direction that week.'
      ];
    }else if(greyfen&&id==='mara'&&pl.flags?.greyfenBoundaryCompared){
      n.lines=[
        'The Blackroot mark appears beneath the newer cut here. Water has worn the surface, but it did not make that clean, directional groove.',
        'The later line turns toward the reed bed instead of the raised path. Someone may have been diverting travelers—or trying to hide the higher route. The stone alone cannot tell us which.',
        'I will preserve both layers in the Boundary Archive. Next we need a dated record or physical sign that tells us when the newer cut was made.'
      ];
    }else if(greyfen&&id==='mara'&&pl.flags?.bellRoadSearched){
      n.lines=[
        'You have a Blackroot record now. Bring it to the boundary stone on the approach; I need a second mark before I compare the records.',
        'Do not scrape the stone or try to improve the cut. Its surface is evidence exactly as it stands.',
        'A second location may tell us whether the sign has been copied, altered, or only worn by the water.'
      ];
    }
    if(!greyfen&&pl.flags?.firstRoadReturnSeen){
      const route=pl.flags.firstRoadReturnRoute||'unknown';
      const discovery=pl.flags.firstRoadReturnDiscovery||'none';
      if(id==='mara'){
        if(pl.flags.greyfenArchiveRead){
          n.lines=[
            'The Greyfen archive now preserves both surfaces, but we still do not know when the newer cut was made.',
            'The matching mark shows that the Blackroot seal and the boundary stone belong in the same record. It does not identify the hand that changed either stone.',
            'We need a dated field note or another physical trace before we can say when the route was altered.'
          ];
        }else if(pl.flags.greyfenBoundaryCompared){
          n.lines=[
            'You found the same older bell-mark at the Greyfen Approach beneath a newer cut. That is stronger evidence than either stone alone.',
            'Do not move the boundary stone. Bring the comparison to my desk in Greyfen so I can preserve both surfaces in the archive.',
            'The marker shows an alteration, but not who made it or why.'
          ];
        }else if(pl.flags.bellRoadSearched){
          n.lines=[
            'The Blackroot seal bears the same bell-mark you saw near Ashmere. A repeated symbol is evidence of a pattern, not a complete explanation.',
            'I will keep the seal and your first route report together. The record must preserve what we saw, not what we wish it meant.',
            'When Greyfen’s Boundary Archive is available, compare its old marks against this one.'
          ];
        }else if(route==='ridge'&&discovery==='ridge-cairn'){
          n.lines=[
            'The Ridgeway Cairn marks a dry line above the low ground. That tells us how travelers were meant to pass, not why the bell rang.',
            'I want the cairn’s mark recorded beside the old route sketches. A second account may show whether the line has been kept or changed.',
            'Next, inspect the bell-marked seal at Blackroot Bend and bring back what you can actually observe.'
          ];
        }else if(route==='reeds'&&discovery==='marsh-watcher-tracks'){
          n.lines=[
            'The Bell Fragment is physical evidence, and the tracks beneath the blue light are another observation. Neither tells us who—or what—made them.',
            'I will record the fragment without assigning it a purpose. The route records disagree about the lower path.',
            'Next, inspect the bell-marked seal at Blackroot Bend and bring back what you can actually observe.'
          ];
        }else if(route==='ridge'){
          n.lines=[
            'You kept to the High Ridge and returned. I can record the route, but I still need a close observation of its markers before comparing them with the archive.',
            'A safer passage is useful evidence; it is not an explanation for the single bell.',
            'Next, inspect the bell-marked seal at Blackroot Bend and bring back what you can actually observe.'
          ];
        }else if(route==='reeds'){
          n.lines=[
            'You brought back a Bell Fragment from the Reed Cut. That confirms the metal is real; it does not tell us why it lay beneath the blue light.',
            'I will leave the source of the tracks unassigned until we have a description that can be checked.',
            'Next, inspect the bell-marked seal at Blackroot Bend and bring back what you can actually observe.'
          ];
        }else{
          n.lines=[
            'Your return gives us an account to work from, but we should not decide what the bell meant yet.',
            'I will record the observations separately from our guesses.',
            'Next, inspect the bell-marked seal at Blackroot Bend and bring back what you can actually observe.'
          ];
        }
      }else if(id==='brenn'){
        n.lines=route==='ridge'?[
          'I have recorded your return from the High Ridge. A route report tells me where you went; it does not promise the path will stay safe.',
          'If a marker is moved, a tidy ledger can still be wrong. Tell me what you saw, not what you suspect.'
        ]:route==='reeds'?[
          'The Bell Fragment is entered in the ledger. That proves you brought back metal; it does not prove who placed it in the mud.',
          'I will leave the route report open until the tracks can be described and checked.'
        ]:[
          'You are back with a report. I will record what you observed separately from what you believe it means.'
        ];
      }else if(id==='oric'){
        n.lines=route==='ridge'?[
          'The ridge was the cautious choice. Keep watching the cairns next time; a safer route can still be changed by careless hands.',
          'Report a damaged marker before you try to repair it. I need to know what was there first.'
        ]:route==='reeds'?[
          'You came back from the Reed Cut. Good. Next time, do not follow a light or a set of tracks unless you have a clear way to retreat.',
          'If the marks look wrong, leave them where they are and bring back a description.'
        ]:[
          'You returned. Keep the next report practical: route, conditions, signs of trouble, and a way out.'
        ];
      }
    }
    if(greyfen&&id==='brenn'&&pl.flags?.greyfenWeeklyReturnFound&&!pl.flags.greyfenWeeklyReturnReported){
      n.lines=[
        'This is an earlier return than the entries I showed you. The lower crossing is clearly marked CLOSED pending inspection; the later OPEN correction is written in a different ink and carries no initials.',
        'That gives us an order of events, but not an author. I will compare it against the crossing ledger and leave the discrepancy open.',
        'Take both versions to Mara. A record should preserve a contradiction until evidence resolves it.'
      ];
    }else if(greyfen&&id==='brenn'&&pl.flags?.greyfenWeeklyReturnReported){
      n.lines=[
        'The weekly return predates the overwritten ledger entries. The closure was recorded first; the unsigned OPEN correction came later.',
        'We cannot accuse a person from handwriting alone. Mara has the copies, and we still need the missing closure order.',
        'Until that order turns up, the lower crossing stays marked uncertain in my ledger.'
      ];
    }else if(greyfen&&id==='brenn'&&pl.flags?.greyfenFieldNoteReported){
      n.lines=[
        'I have two crossings entered within days of the flood’s retreat. Both destinations were overwritten in a later hand, and neither entry carries the usual closure order.',
        'That does not tell us who changed the route. It does tell us the newer cut and the redirected deliveries belong in the same investigation.',
        'I will leave the discrepancy open until the earlier weekly route return can be found.'
      ];
      if(!pl.flags.greyfenLedgerCompared){
        pl.flags.greyfenLedgerCompared=true;
        pl.memories=Array.isArray(pl.memories)?pl.memories:[];
        const memory='Old Brenn found two Greyfen crossing entries rewritten within days of the flood’s retreat. Both lack a closure order; who changed the destinations is still unknown.';
        if(!pl.memories.includes(memory))pl.memories.push(memory);
        setBellQuestObjective(pl,'Find the earlier weekly route return that accompanied the overwritten Greyfen ledger.');
      }
    }
    if(!greyfen&&id==='oric'&&pl.flags?.highRidgeCairnOutcome){
      n.lines=pl.flags.highRidgeCairnOutcome==='restore'
        ?['You reset the Ridgeway Cairn. I have asked the road crew to check the lower cart track before anyone trusts the old line.','Keep the fresh scrape in your report. If someone moved it once, we need to know why before we call it settled.']
        :pl.flags.highRidgeCairnOutcome==='warn'
         ?['The warning strip is still doing a job. I have logged the shifted cairn as unsafe until we can survey it properly.','A warning is not a repair, but it gives the next traveler a chance to stop before the ground fails.']
         :['You recorded both alignments and left the stone untouched. Good. A route mark should be evidence, not an order no one can question.','I have copied both positions into the ledger. If someone moved it, we need the reason—not a cleaner story.'];
    }
    if(greyfen&&id==='brenn'&&pl.flags?.greyfenWeeklyReturnFound&&!pl.flags.greyfenWeeklyReturnReported){
      pl.flags.greyfenWeeklyReturnReported=true;
      pl.memories=Array.isArray(pl.memories)?pl.memories:[];
      const memory='Old Brenn compared the earlier weekly route return with the overwritten Greyfen ledger: the lower crossing was closed pending inspection before a later, unsigned correction marked it open.';
      if(!pl.memories.includes(memory))pl.memories.push(memory);
      setBellQuestObjective(pl,'Ask Mara to preserve the field note, overwritten ledger, and weekly return together in the Boundary Archive.');
    }
    if(greyfen&&id==='mara'&&pl.flags?.greyfenWeeklyReturnReported&&!pl.flags.greyfenEvidenceFiled){
      pl.flags.greyfenEvidenceFiled=true;
      pl.memories=Array.isArray(pl.memories)?pl.memories:[];
      const memory='Mara filed the Blackroot seal, Greyfen boundary comparison, Reedwatch field note, and weekly route return together. The route alteration is documented, but its author and the missing closure order remain unknown.';
      if(!pl.memories.includes(memory))pl.memories.push(memory);
      setBellQuestObjective(pl,'Find the missing closure order that authorized the later change to the lower crossing.');
    }
    if(greyfen&&id==='mara'&&pl.flags?.greyfenFieldNoteFound&&!pl.flags.greyfenFieldNoteReported){
      pl.flags.greyfenFieldNoteReported=true;
      pl.memories=Array.isArray(pl.memories)?pl.memories:[];
      const memory='Mara confirms the Reedwatch field note was recorded two days after the flood’s retreat was logged and that its sketch already shows the newer cut. The date narrows when the mark appeared, but the writer remains unknown.';
      if(!pl.memories.includes(memory))pl.memories.push(memory);
      setBellQuestObjective(pl,'Ask Old Brenn to compare the dated field note with Greyfen’s crossing ledger.');
    }
    if(greyfen&&id==='mara'&&pl.flags?.greyfenBoundaryCompared&&!pl.flags.greyfenArchiveRead){
      pl.flags.greyfenArchiveRead=true;
      pl.memories=Array.isArray(pl.memories)?pl.memories:[];
      const memory='Mara compared the Blackroot seal record with the Greyfen boundary stone. The older bell-mark continues beneath a newer groove turned toward the reed bed; the evidence shows alteration, but not who ordered it.';
      if(!pl.memories.includes(memory))pl.memories.push(memory);
      setBellQuestObjective(pl,'Find a dated record or physical sign showing when the newer Greyfen cut was made.');
    }
    pl.flags=pl.flags||{}; pl.npcTalk=pl.npcTalk||{}; pl.npcTalk[id]=Number(pl.npcTalk[id]||0)+1;
    if(id==='mara'&&!greyfen){
      pl.flags.talkedToMara=true;
      pl.flags.bellQuestStarted=true;
      if(pl.flags.firstRoadReturnSeen&&!pl.flags.firstRoadReturnMaraBriefed){
        pl.flags.firstRoadReturnMaraBriefed=true;
      }
      if(pl.flags.firstRoadReturnSeen){
        const objective=pl.flags.greyfenEvidenceFiled
          ? 'Find the missing closure order that authorized the later change to the lower crossing.'
          : pl.flags.greyfenWeeklyReturnReported
            ? 'Ask Mara to preserve the field note, overwritten ledger, and weekly return together in the Boundary Archive.'
            : pl.flags.greyfenWeeklyReturnFound
              ? 'Bring the earlier weekly route return to Old Brenn in Greyfen’s Bellkeeper’s Ledger.'
              : pl.flags.greyfenLedgerCompared
                ? 'Find the earlier weekly route return that accompanied the overwritten Greyfen ledger.'
                : pl.flags.greyfenFieldNoteReported
            ? 'Ask Old Brenn to compare the dated field note with Greyfen’s crossing ledger.'
            : pl.flags.greyfenFieldNoteFound
              ? 'Bring the dated Reedwatch field note to Mara in Greyfen’s Boundary Archive.'
              : pl.flags.greyfenArchiveRead
                ? 'Find a dated record or physical sign showing when the newer Greyfen cut was made.'
                : pl.flags.greyfenBoundaryCompared
                  ? 'Take the matching boundary mark to Mara in Greyfen’s Boundary Archive.'
                  : pl.flags.bellRoadSearched
                    ? 'Compare the Blackroot seal record with Greyfen’s boundary marks when the lowland archive is available.'
                    : 'Inspect the bell-marked seal at Blackroot Bend and return with your observations.';
        setBellQuestObjective(pl,objective);
      }
    }
    save(pl);
    let extra='';
    if(id==='brenn'&&Number(pl.inventory?.roadToken||0)>=3) extra='<button class="ash099-btn" id="turnTokens">Open the Regional Ledger</button>';
    screen(head(n.role,n.name,n.text,n.art,id),'<div class="ash099-lines">'+n.lines.map(x=>'<p>'+esc(x)+'</p>').join('')+'</div>',extra);
    const turn=document.getElementById('turnTokens');
    if(turn) turn.onclick=()=>window.LegendRegionsV100?.render?.() || renderNPC('brenn');
  }

  function renderInn(){
 const pl=p();if(!pl)return;
 const greyfen=String(pl.currentRegion||'Ashmere')==='Greyfen';
 const title=greyfen?'Reedlight Inn':'Ashmere Inn';
 const desc=greyfen?'Dry your cloak, recover, and listen for lowland rumors.':'A warm room, a locked door, and one night away from the mud.';
 const intro=greyfen?'The room is damp, but the fire is steady. Rest before the causeway takes another toll.':'The inn smells of cedar smoke and wet wool. The road can wait until morning.';
 screen(head('Inn & Lodging',title,desc,locationInterior('inn'),'inn'),
  '<section class="ash099-service-dashboard">'+
   '<div class="ash099-service-overview"><div class="ash099-service-note"><span>THE INNKEEPER’S NOTE</span><strong>'+esc(intro)+'</strong><p>Take a breath, stock the pack, or ask what the regulars have heard.</p></div><div class="ash099-service-wallet"><span>YOUR PURSE</span><strong>'+gold(pl.gold)+'</strong><small>HEALTH · '+Number(pl.hp||0)+' / '+Number(pl.maxHp||1)+'</small><i><b style="width:'+Math.max(0,Math.min(100,Math.round(Number(pl.hp||0)/Math.max(1,Number(pl.maxHp||1))*100)))+'%"></b></i></div></div>'+
   '<div class="ash099-service-actions">'+
    '<button class="ash099-btn ash099-service-card" id="rest" type="button"><span class="ash099-service-icon">'+serviceArt('inn',icon('inn'))+'</span><span class="ash099-service-copy"><small>RECOVER</small><strong>Rest for the night</strong><span>Restore all health and return to the road ready.</span></span><em>35g</em></button>'+
    '<button class="ash099-btn ash099-service-card" id="camp" type="button"><span class="ash099-service-icon">'+serviceArt('milestone',icon('road'))+'</span><span class="ash099-service-copy"><small>PACK SUPPLIES</small><strong>Camp Supplies</strong><span>Carry shelter and dry kindling for safer expeditions.</span></span><em>90g</em></button>'+
    '<button class="ash099-btn ash099-service-card" id="rumor" type="button"><span class="ash099-service-icon">'+serviceArt('journal',icon('archive'))+'</span><span class="ash099-service-copy"><small>LISTEN IN</small><strong>Hear a Rumor</strong><span>Ask what has been happening beyond the lantern line.</span></span><em>FREE</em></button>'+
   '</div><div id="ashNote" class="ash099-note" style="display:none"></div></section>');
 document.getElementById('rest').onclick=()=>buyService(35,pl=>{pl.hp=pl.maxHp},'You rest at the inn and recover completely.');
 document.getElementById('camp').onclick=()=>buyService(90,pl=>{pl.inventory.camp=Number(pl.inventory.camp||0)+1},'Bought camp supplies.');
 document.getElementById('rumor').onclick=()=>{
  const rumors=greyfen
   ?['The water rose after the bell rang, though no rain had fallen.','A blue light is seen near the drowned boundary stones at dusk.','The causeway markers have shifted. Or something has turned them.']
   :['A broken shrine showed itself in the fog last night.','Blackroot wolves hate firelight.','Brenn pays extra for proof that still bleeds.'];
  note(rumors[Math.floor(Math.random()*rumors.length)]);
 };
}
function buyService(cost,fn,msg){const pl=p();if(Number(pl.gold||0)<cost)return note('Not enough gold.');pl.gold-=cost;fn(pl);save(pl);note(msg);}

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
      armorName
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

  function startRoad(){if(window.LegendRoadControllerV100?.start)return window.LegendRoadControllerV100.start();if(window.LegendRoadControllerV087?.start)return window.LegendRoadControllerV087.start();screen(head('Town Gate','Old Road','The road controller did not load.',roadBg(),'road'),'<p>Try a hard refresh.</p>');}
  function intercept(){const text=document.body?.innerText||'';if(/Ashmere Menu|Ashmere • First Town/.test(text)&&!document.querySelector('.ash099'))renderAshmere();}
  window.LegendAshmereV099={renderAshmere,route};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',intercept);else intercept();
  const rt=RT(); if(rt.onRender)rt.onRender(intercept);
})();