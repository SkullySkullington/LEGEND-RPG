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
      food:'food',ration:'rationBundle',rationBundle:'rationBundle',potion:'potion',roadPoultice:'potion',blackrootTonic:'potion',
      roadToken:'roadToken',bellFragment:'bellFragment',camp:'camp',campSupply:'camp',roadHerb:'roadHerb',huntersCharm:'bellFragment',wispLanternWick:'camp',
      woodenSword:'shortSword',stoneSword:'shortSword',bronzeSword:'shortSword',ironSword:'shortSword',steelSword:'shortSword',shortSword:'shortSword',bow:'bow',huntingBow:'bow',shield:'shield',
      none:'shield',clothArmor:'shield',chainArmor:'shield',bronzeArmor:'shield',ironArmor:'shield',woodScrap:'camp',peatBrick:'camp',clothScrap:'camp',wolfFang:'shortSword',tornHide:'shield',ore:'shield',wispAsh:'bellFragment',oil:'camp',goblinTrinket:'roadToken',blackrootThorn:'roadHerb',tradeBundle:'camp'
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
  const npc = id => A().npcs?.[id] || '';
  const weaponName = id => (D().weapons || []).find(w => w.id === id)?.name || id || 'Hands';
  const armorName = id => (D().armors || []).find(a => a.id === id)?.name || id || 'None';

  const iconArt = k => {
    const assets=A(), locations=assets.locations||{}, items=assets.items||{}, classes=assets.classes||{}, npcs=assets.npcs||{};
    const imageFor = {
      people:npcs.mara||classes[p()?.className],
      inn:items.camp||npcs.innkeeper,
      trader:items.roadToken||npcs.trader,
      smith:items.shortSword||npcs.blacksmith,
      road:items.roadToken||items.bow,
      sheet:classes[p()?.className]||items.shortSword,
      brenn:npcs.brenn||items.bellFragment,
      archive:items.bellFragment||npcs.mara,
      mara:npcs.mara||items.bellFragment,
      oric:npcs.oric||items.shield,
      work:items.camp||npcs.oric,
      craft:items.roadHerb||items.potion,
      profile:classes[p()?.className]||npcs.mara,
      quest:items.bellFragment||items.roadToken,
      route:items.roadToken||items.bow,
      regions:items.roadToken,
      settings:items.camp
    };
    return imageFor[k]||items.bellFragment||items.roadToken||locations.ashmereMain||'';
  };
  const icon = (k, alt='') => {
    const src=iconArt(k);
    return `<span class="ash099-icon" aria-hidden="true">${src?`<img src="${esc(src)}" alt="" loading="lazy" onerror="this.onerror=null;this.style.display='none'">`:''}</span>`;
  };
  function shell(html){ root().innerHTML = `<main class="ash099 ash099-terminal"><div class="ash099-wrap">${html}</div></main>`; }
  function stat(label, value){ return `<div class="ash099-stat"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`; }
  function hpPct(pl){ return Math.max(0, Math.min(100, Math.round((Number(pl.hp || 0) / Math.max(1, Number(pl.maxHp || 1))) * 100))); }
  function owned(pl, k){ return Number(pl.inventory?.[k] || 0); }
  function canAfford(pl, cost){ return Number(pl.gold || 0) >= Number(cost || 0); }
  function canCraft(pl, needs){ return needs.every(([k,v]) => owned(pl,k) >= Number(v || 0)); }
  function needsText(pl, needs){ return needs.map(([k,v]) => `${v} ${itemName(k)} (${owned(pl,k)})`).join(', '); }
  function note(msg){ const n = document.getElementById('ashNote'); if(n){ n.style.display='block'; n.textContent=msg; } }

  function goal(pl){
    const t = Number(pl?.inventory?.roadToken || 0);
    if(String(pl?.currentRegion||'Ashmere')==='Greyfen') return { view:'people', title:'Learn Greyfen’s Old Marks', text:'The lowland town sits on drowned foundations. Ask the road-worn keepers what they know, trade what the marsh has yielded, and prepare before following the next marker.', cta:'Meet the Town’s Keepers', icon:'people', tasks:['Ask about the boundary stones','Trade or prepare supplies','Return to Ashmere when ready'] };
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
    return `<nav class="ash099-footer ash099-topnav" aria-label="${ariaLabel}"><button class="ash099-footer-item active" data-ash-view="home">${icon('inn')}<span>${townLabel}</span></button><button class="ash099-footer-item" data-ash-view="routes">${icon('road')}<span>Routes</span></button><button class="ash099-footer-item" data-ash-view="archive">${icon('archive')}<span>Journal</span></button><button class="ash099-footer-item" data-ash-view="profile">${icon('profile')}<span>Profile</span></button><button class="ash099-footer-item" data-ash-view="sheet">${icon('sheet')}<span>Traveler</span></button></nav>`;
  }

  function renderAshmere(){
    const pl=p(); if(!pl) return;
    const g=goal(pl);
    const isGreyfen=String(pl.currentRegion||'Ashmere')==='Greyfen';
    const townName=isGreyfen?'Greyfen':'Ashmere';
    const tokenCount=Number(pl.inventory?.roadToken||0);
    const health=Math.max(0,Math.min(100,Math.round(Number(pl.hp||0)/Math.max(1,Number(pl.maxHp||1))*100)));
    const townCard=(view,title,desc,cta,ic,featured=false)=>`<button class="ash100-destination ${featured?'featured':''}" data-ash-view="${esc(view)}"><span class="ash100-destination-icon">${icon(ic)}</span><span class="ash100-destination-copy"><strong>${esc(title)}</strong><small>${esc(desc)}</small></span><em>${esc(cta)}</em></button>`;
    const destinations=isGreyfen?[
      townCard('inn','Reedlight Inn','Rest, recover, and hear what the lowland travelers whisper.','Rest & prepare','inn',g.view==='inn'),
      townCard('trader','Marsh Market','Trade road loot for rations, medicine, and useful supplies.','Trade','trader',false),
      townCard('smith','Causeway Smithy','Equip better gear and turn gathered materials into useful things.','Gear & craft','smith',false),
      townCard('people','Town Square','Meet the keepers and travelers who know the drowned roads.','Meet the town','people',g.view==='people'),
      townCard('work','Bellkeeper’s Hall','Take practical work while learning the rhythms of Greyfen.','Find work','work',g.view==='work'),
      townCard('regions','Road Network','Return to Ashmere or travel between lands you have unlocked.','Travel','regions',g.view==='regions')
    ].join(''):[
      townCard('inn','Ashmere Inn','Rest, recover, buy supplies, and hear what travelers are saying.','Rest & prepare','inn',g.view==='inn'),
      townCard('trader','Market','Buy essentials, sell road loot, and turn discoveries into gold.','Trade','trader',false),
      townCard('smith','Forge & Workshop','Upgrade weapons and armor, then use the crafting bench for road finds.','Gear & craft','smith',false),
      townCard('work','Town Hall','Meet the town, take work, manage road proof, and track what Ashmere needs.','Jobs & people','work',g.view==='people'||g.view==='brenn'||g.view==='work'),
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
    if(v === 'craft') return renderCrafting();
    if(v === 'sheet') return renderSheet();
    if(v === 'archive') return renderArchive();
    if(v === 'profile') {
      if(window.LegendAccountV09x?.renderAccount) return window.LegendAccountV09x.renderAccount();
      return renderAshmere();
    }
    if(v === 'routes') return renderRoutes();
    if(v === 'road') return startRoad();
    if(v === 'regions') {
      if(window.LegendRegionsV100?.render) return window.LegendRegionsV100.render();
      return renderAshmere();
    }
    return renderAshmere();
  }
  function back(extra = ''){ return `<div class="ash099-bottom">${extra}<button class="ash099-btn primary" id="ashBack">Back to Ashmere</button></div>`; }
  function head(k,t,d,im='',fallbackIcon='quest'){ return `<div class="ash099-head ${im ? 'has-art' : 'no-art'}">${im ? img(im,t) : `<div class="ash099-head-icon">${icon(fallbackIcon)}</div>`}<div><div class="ash099-kicker">${esc(k)}</div><h1>${esc(t)}</h1><p>${esc(d)}</p></div></div>`; }
  function screen(h,b,extra=''){ shell(`<section class="ash099-screen">${h}${b}${back(extra)}</section>`); document.getElementById('ashBack').onclick = renderAshmere; bind(); }

  function renderRoutes(){
    const greyfen=String(p()?.currentRegion||'Ashmere')==='Greyfen';
    if(greyfen){
      screen(head('Causeway Board','Lowland Crossings','The Old Road begins in Ashmere. From Greyfen, choose a known route, check local records, or learn which crossings remain safe.',locationInterior('archive'),'route'),`
        <div class="ash099-cards">
          <button class="ash099-btn ash099-card" data-ash-view="regions">${icon('regions')}<strong>Road Network</strong><small>Pay the fare to return to Ashmere or travel onward to lands already opened.</small><em>Open map</em></button>
          <button class="ash099-btn ash099-card" data-ash-view="people">${icon('people')}<strong>Ask the Keepers</strong><small>Compare the old boundary marks and hear the latest causeway warnings.</small><em>Visit the hall</em></button>
        </div>`);
      return;
    }
    screen(head('Route Board','Routes & Expeditions','Choose your next destination. Open the regional network to unlock new lands, or enter the Old Road to search, fight, and bring proof home.',bg(),'route'),`
      <div class="ash099-cards">
        <button class="ash099-btn ash099-card" data-ash-view="road">${icon('road')}<strong>The Old Road</strong><small>Start a five-stage expedition with encounters, finds, and a safe return path.</small><em>Begin expedition</em></button>
        <button class="ash099-btn ash099-card" data-ash-view="regions">${icon('regions')}<strong>Road Network</strong><small>View known regions, spend Road Tokens to unlock new lands, and travel between places.</small><em>Open map</em></button>
      </div>`);
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
    pl.flags=pl.flags||{}; pl.npcTalk=pl.npcTalk||{}; pl.npcTalk[id]=Number(pl.npcTalk[id]||0)+1;
    if(id==='mara'&&!greyfen){ pl.flags.talkedToMara=true; pl.flags.bellQuestStarted=true; }
    save(pl);
    let extra='';
    if(id==='brenn'&&Number(pl.inventory?.roadToken||0)>=3) extra='<button class="ash099-btn" id="turnTokens">Open the Regional Ledger</button>';
    screen(head(n.role,n.name,n.text,n.art,id),'<div class="ash099-lines">'+n.lines.map(x=>'<p>'+esc(x)+'</p>').join('')+'</div>',extra);
    const turn=document.getElementById('turnTokens');
    if(turn) turn.onclick=()=>window.LegendRegionsV100?.render?.() || renderNPC('brenn');
  }

  function renderInn(){
    screen(head('Service',String(p()?.currentRegion||'Ashmere')==='Greyfen'?'Reedlight Inn':'Ashmere Inn',String(p()?.currentRegion||'Ashmere')==='Greyfen'?'Dry your cloak, recover, and listen for lowland rumors.':'A warm room, a locked door, and one night away from the mud.',locationInterior('inn'),'inn'),`<div class="ash099-cards"><button class="ash099-btn ash099-card" id="rest">${icon('inn')}<strong>Rest</strong><small>Restore HP before returning to the Old Road.</small><em>35g</em></button><button class="ash099-btn ash099-card" id="camp">${icon('road')}<strong>Camp Supplies</strong><small>Useful for road pressure and travel prep.</small><em>90g</em></button><button class="ash099-btn ash099-card" id="rumor">${icon('archive')}<strong>Hear a Rumor</strong><small>Ask what travelers are whispering tonight.</small><em>Free</em></button></div><div id="ashNote" class="ash099-note" style="display:none"></div>`);
    document.getElementById('rest').onclick=()=>buyService(35,pl=>{pl.hp=pl.maxHp},'You rest at the inn.');
    document.getElementById('camp').onclick=()=>buyService(90,pl=>{pl.inventory.camp=Number(pl.inventory.camp||0)+1},'Bought camp supplies.');
    document.getElementById('rumor').onclick=()=>{
      const greyfen=String(p()?.currentRegion||'Ashmere')==='Greyfen';
      const rumors=greyfen
        ?['The water rose after the bell rang, though no rain had fallen.','A blue light is seen near the drowned boundary stones at dusk.','The causeway markers have shifted. Or something has turned them.']
        :['A broken shrine showed itself in the fog last night.','Blackroot wolves hate firelight.','Brenn pays extra for proof that still bleeds.'];
      note(rumors[Math.floor(Math.random()*rumors.length)]);
    };
  }
  function buyService(cost,fn,msg){const pl=p();if(Number(pl.gold||0)<cost)return note('Not enough gold.');pl.gold-=cost;fn(pl);save(pl);note(msg);}

  const workJobs = {
    wood:{title:'Split Firewood',desc:'Line up the axe strike and split clean through wet ash logs.',skill:'strength',pay:38,item:'woodScrap',amount:1,verb:'Strike',hint:'Hit the gold band for a clean split.'},
    gate:{title:'Watch the Gate',desc:'Spot movement beyond the lantern line before Oric has to shout.',skill:'survival',pay:42,item:'food',amount:1,verb:'Signal',hint:'Signal when the marker crosses the watchlight.'},
    records:{title:'Sort Archive Records',desc:'Find the right ledger tab before Mara loses patience.',skill:'lore',pay:45,item:'roadHerb',amount:1,verb:'File',hint:'Click when the marker reaches the stamped section.'},
    crates:{title:'Carry Market Crates',desc:'Move heavy crates without dropping trader stock into the mud.',skill:'strength',pay:34,item:'camp',amount:1,verb:'Lift',hint:'Click in the steady zone to keep your grip.'},
    yard:{title:'Clean Stable Yard',desc:'Unpleasant work, steady coin, and no monsters.',skill:'luck',pay:30,item:'clothScrap',amount:1,verb:'Shovel',hint:'Time the shovel when the rhythm lines up.'},
    message:{title:'Run a Message',desc:'Carry sealed word through rain-heavy alleys before the ink runs.',skill:'survival',pay:46,item:'goblinTrinket',amount:1,verb:'Deliver',hint:'Click as the marker crosses the seal.'}
  };
  const greyfenWorkJobs = {
    peat:{title:'Dry Peat Bricks',desc:'Stack wet-cut peat beneath the Reedlight awning before the next shower.',skill:'strength',pay:40,item:'peatBrick',amount:2,verb:'Stack',hint:'Time the stack when the marker enters the dry band.'},
    salvage:{title:'Sort a Salvage Basket',desc:'Separate usable iron and cloth from a basket lifted off the drowned walk.',skill:'luck',pay:44,item:'ore',amount:1,verb:'Sort',hint:'Click when the marker reaches the clean sorting band.'},
    markers:{title:'Reset Flood Markers',desc:'Set the causeway stakes back to the bellkeeper’s recorded waterline.',skill:'survival',pay:48,item:'roadHerb',amount:2,verb:'Set Marker',hint:'Set the marker when the moving line crosses the old waterline.'}
  };
  function jobsForCurrentRegion(){return String(p()?.currentRegion||'Ashmere')==='Greyfen'?greyfenWorkJobs:workJobs;}
  function renderWorkBoard(){
    const greyfen=String(p()?.currentRegion||'Ashmere')==='Greyfen';
    const jobs=jobsForCurrentRegion();
    screen(head('Town Work',greyfen?'Bellkeeper’s Hall':'Town Hall',greyfen?'Dry peat, sort salvaged goods, and reset flood markers to keep the lowland crossings usable.':'Pick a job around Ashmere, then complete a quick timing check. Better timing means better pay and better odds at bonus supplies.',locationInterior('archive'),'work'),`<div class="ash099-cards">${Object.entries(jobs).map(([id,j])=>`<button class="ash099-btn ash099-card" data-job-open="${id}">${icon('work')}<strong>${j.title}</strong><small>${j.desc} Check: ${j.skill.toUpperCase()}.</small><em>${j.pay}g</em></button>`).join('')}</div><div id="ashNote" class="ash099-note" style="display:none"></div>`);
    document.querySelectorAll('[data-job-open]').forEach(b=>b.onclick=()=>renderJobActivity(b.dataset.jobOpen));
  }
  function renderJobActivity(id){
    const jobs=jobsForCurrentRegion();
    const j=jobs[id]||Object.values(jobs)[0];
    const zoneStart=34+Math.floor(Math.random()*16);
    const zoneWidth=18;
    screen(head('Town Work',j.title,j.desc,locationInterior('archive'),'work'),`<section class="ash099-job-game"><p>${esc(j.hint)}</p><div class="ash099-job-track" id="jobTrack"><i class="ash099-job-zone" style="left:${zoneStart}%;width:${zoneWidth}%"></i><b class="ash099-job-marker" id="jobMarker"></b></div><div class="ash099-job-meta"><span>Skill: ${esc(j.skill.toUpperCase())}</span><span>Base Pay: ${gold(j.pay)}</span><span>Bonus: ${esc(itemName(j.item))}</span></div><button class="ash099-btn primary" id="jobStrike">${esc(j.verb)}</button><p class="ash099-note" id="jobResult" style="display:none"></p><p class="ash099-note">Keyboard: press Space or Enter to complete the action.</p></section>`, `<button class="ash099-btn" id="backJobs">Choose Another Job</button>`);
    const marker=document.getElementById('jobMarker');
    const strike=document.getElementById('jobStrike');
    const result=document.getElementById('jobResult');
    let pos=0,dir=1,done=false;
    const timer=setInterval(()=>{ if(done) return; pos+=dir*2.35; if(pos>=100){pos=100;dir=-1;} if(pos<=0){pos=0;dir=1;} if(marker) marker.style.left=pos+'%'; },24);
    function finish(){
      if(done) return;
      done=true;
      clearInterval(timer);
      document.removeEventListener('keydown',onKey);
      const center=zoneStart+(zoneWidth/2);
      const dist=Math.abs(pos-center);
      const grade=dist<=4?'Perfect':dist<=9?'Good':dist<=17?'Messy':'Miss';
      const mult=grade==='Perfect'?1.45:grade==='Good'?1.12:grade==='Messy'?.72:.38;
      const pay=Math.max(5,Math.round(j.pay*mult));
      const bonusChance=grade==='Perfect'?.95:grade==='Good'?.62:grade==='Messy'?.24:.05;
      const pl=p();
      pl.flags=pl.flags||{}; pl.inventory=pl.inventory||{};
      const progress=window.LegendProgressionV100?.award(pl,grade==='Perfect'?28:grade==='Good'?20:grade==='Messy'?14:10);
      pl.flags.ashmereJobs=Number(pl.flags.ashmereJobs||0)+1;
      pl.flags.ashmereFavor=Number(pl.flags.ashmereFavor||0)+(grade==='Perfect'?2:1);
      pl.gold=Number(pl.gold||0)+pay;
      let bonus='';
      if(Math.random()<bonusChance){ pl.inventory[j.item]=Number(pl.inventory[j.item]||0)+j.amount; bonus=` Bonus gained: ${j.amount} ${itemName(j.item)}.`; }
      if(grade==='Miss'&&Number(pl.hp||0)>1){ pl.hp=Math.max(1,Number(pl.hp||0)-1); bonus+=' You lose 1 HP from the rough work.'; }
      save(pl);
      const xpNote=progress?' XP +'+progress.gained+(progress.levels?' · Level up! You are now level '+progress.level+'.':'')+'.':'';
      if(result){ result.style.display='block'; result.textContent=`${grade}! Earned ${pay}g.${bonus} Local standing increased.`+xpNote; }
      if(strike){ strike.disabled=true; strike.textContent='Job Complete'; }
      setTimeout(()=>renderWorkBoard(),1600);
    }
    if(strike) strike.onclick=finish;
    const onKey=e=>{ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); document.removeEventListener('keydown',onKey); finish(); } };
    document.addEventListener('keydown',onKey);
    const backJobs=document.getElementById('backJobs');
    if(backJobs) backJobs.onclick=()=>{ done=true; clearInterval(timer); document.removeEventListener('keydown',onKey); renderWorkBoard(); };
  }

  function renderTrader(tab='buy'){
    const pl=p();
    const greyfen=String(pl.currentRegion||'Ashmere')==='Greyfen';
    const goods=[['food','Rations',60,'A day’s food for the road.'],['potion','Healing Potion',120,'Restore your strength in a fight.'],['camp','Camp Supplies',90,'Prepare a safe stop beyond the gate.'],['clothScrap','Cloth Scrap',34,'Material for field medicine.'],['oil','Lamp Oil',70,'Fuel for lanterns and preparations.']];
    const sellables=[['wolfFang',12],['tornHide',8],['roadHerb',10],['wispAsh',22],['goblinTrinket',16],['blackrootThorn',14],['woodScrap',7],['peatBrick',6],['clothScrap',9],['ore',24],['tradeBundle',72],['brokenBellShard',60]];
    const sellAllValue=sellables.reduce((sum,[k,v])=>sum+(owned(pl,k)*v),0);
    const itemCard=(k,name,price,desc,action,disabled,tail)=>{
      const art=itemIcon(k)||A().items?.roadToken||'';
      const thumb=art?'<img class="ash099-market-art" src="'+esc(art)+'" alt="" aria-hidden="true" loading="lazy" onerror="this.onerror=null;this.style.display=\'none\'">':'<span class="ash099-market-art ash099-market-art-fallback" aria-hidden="true">✦</span>';
      return '<button class="ash099-market-item" data-'+action+'="'+esc(k)+'" data-'+(action==='buy'?'cost':'value')+'="'+price+'" '+(disabled?'disabled':'')+'>'+thumb+'<span class="ash099-market-item-copy"><strong>'+esc(name)+'</strong><small>'+esc(desc)+'</small><em>'+esc(tail)+'</em></span><b class="ash099-market-price">'+price+'g</b></button>';
    };
    const content=tab==='buy'
      ?goods.map(([k,n,cost,desc])=>itemCard(k,n,cost,desc,'buy',!canAfford(pl,cost),'You own '+owned(pl,k))).join('')
      :sellables.filter(([k])=>owned(pl,k)>0).map(([k,value])=>itemCard(k,itemName(k),value,'A road find, ready to trade.','sell',false,'You own '+owned(pl,k))).join('');
    const noLoot=tab==='sell'&&!sellables.some(([k])=>owned(pl,k)>0)?'<div class="ash099-empty-state">No road finds to sell yet.<small>Bring back herbs, hides, fangs, and fragments to stock the market.</small></div>':'';
    screen(head('Market',greyfen?'Marsh Market':'Trading Post',greyfen?'Trade the marsh’s finds for what you need to cross the water.':'Buy what you need. Sell what the road has left behind.',locationInterior('market'),'trader'),
      '<section class="ash099-market-console">'+
        '<div class="ash099-market-wallet"><div><span>YOUR PURSE</span><strong>'+gold(pl.gold)+'</strong></div><div><span>ROAD LOOT VALUE</span><strong>'+gold(sellAllValue)+'</strong></div>'+(tab==='sell'?'<button class="ash099-btn primary" id="sellAllLoot" '+(sellAllValue>0?'':'disabled')+'>Sell all loot</button>':'<span class="ash099-market-note">Prices are per item</span>')+'</div>'+
        '<div class="ash099-market-tabs" role="tablist" aria-label="Market actions"><button class="'+(tab==='buy'?'active':'')+'" data-market-tab="buy" role="tab" aria-selected="'+(tab==='buy')+'">Buy supplies</button><button class="'+(tab==='sell'?'active':'')+'" data-market-tab="sell" role="tab" aria-selected="'+(tab==='sell')+'">Sell road loot <span>'+sellables.reduce((n,[k])=>n+owned(pl,k),0)+'</span></button></div>'+
        '<div class="ash099-market-grid">'+content+noLoot+'</div><div id="ashNote" class="ash099-note" style="display:none"></div></section>');
    document.querySelectorAll('[data-market-tab]').forEach(b=>b.onclick=()=>renderTrader(b.dataset.marketTab));
    document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buyItem(b.dataset.buy,Number(b.dataset.cost)));
    document.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>sellItem(b.dataset.sell,Number(b.dataset.value)));
    const sellAll=document.getElementById('sellAllLoot');
    if(sellAll)sellAll.onclick=()=>sellAllLoot(sellables);
  }
  function buyItem(k,cost){const pl=p();if(Number(pl.gold||0)<cost)return note('Not enough gold.');pl.gold-=cost;pl.inventory[k]=Number(pl.inventory[k]||0)+1;save(pl);renderTrader('buy');}
  function sellItem(k,value){const pl=p();if(owned(pl,k)<=0)return note('Nothing to sell.');pl.inventory[k]-=1;pl.gold=Number(pl.gold||0)+value;save(pl);renderTrader('sell');}
  function sellAllLoot(sellables){const pl=p();let total=0;sellables.forEach(([k,v])=>{const qty=owned(pl,k);if(qty>0){total+=qty*v;pl.inventory[k]=0;}});if(total<=0)return note('No sellable road loot.');pl.gold=Number(pl.gold||0)+total;save(pl);renderTrader('sell');}

  function renderCrafting(){
    const pl=p();
    const recipes=[
      ['roadPoultice','Road Poultice',[['roadHerb',2],['clothScrap',1]],'Healing item for rough travel.'],
      ['blackrootTonic','Blackroot Tonic',[['blackrootThorn',1],['wolfFang',1]],'Prepared for fear, bleed, and cursed road events later.'],
      ['huntersCharm','Hunter\'s Charm',[['wolfFang',2],['camp',1]],'+1 survival flavor for next road trip later.'],
      ['reinforcedBuckle','Reinforced Buckle',[['ore',1],['tornHide',1]],'Minor armor improvement material for the blacksmith later.'],
      ['wispLanternWick','Wisp Lantern Wick',[['wispAsh',1],['oil',1]],'Prepared to reveal hidden road events later.'],
      ['tradeBundle','Trade Bundle',[['goblinTrinket',2],['tornHide',1],['woodScrap',1]],'Sellable bundle worth more than raw scraps.']
    ];
    const cards=recipes.map(([id,name,needs,desc])=>`<button class="ash099-btn ash099-card" data-craft="${id}" data-needs="${needs.map(n=>n.join(':')).join(',')}" ${canCraft(pl,needs)?'':'disabled'}>${icon('craft')}<strong>${name}</strong><small>${desc}<br>Needs ${needsText(pl,needs)}.</small><em>${canCraft(pl,needs)?'Craft':'Missing'}</em></button>`).join('');
    screen(head('Crafting',String(p()?.currentRegion||'Ashmere')==='Greyfen'?'Marsh Workbench':'Crafting Bench','Road drops should matter. Convert herbs, fangs, hides, ash, and scraps into useful items or better sellables.',locationInterior('forge'),'craft'),`<div class="ash099-market-summary"><strong>Bench Stock</strong><span>Use road drops here before selling raw loot.</span><button class="ash099-btn" id="openTrader">Open Trading Post</button></div><div class="ash099-cards">${cards}</div><div id="ashNote" class="ash099-note" style="display:none"></div>`);
    document.querySelectorAll('[data-craft]').forEach(b=>b.onclick=()=>craftItem(b.dataset.craft,b.dataset.needs));
    const openTrader=document.getElementById('openTrader');
    if(openTrader) openTrader.onclick=renderTrader;
  }
  function craftItem(id,needsTextRaw){const pl=p();const needs=String(needsTextRaw||'').split(',').filter(Boolean).map(x=>{const [k,v]=x.split(':');return [k,Number(v||0)];});if(!canCraft(pl,needs))return note('Missing ingredients.');needs.forEach(([k,v])=>pl.inventory[k]-=v);pl.inventory[id]=Number(pl.inventory[id]||0)+1;save(pl);renderCrafting();}

  function renderSmith(tab='weapon'){
    const pl=p(),assets=A().items||{};
    const weapons=(D().weapons||[]).filter(w=>w.id!=='hand'),armors=(D().armors||[]).filter(a=>a.id!=='none');
    const equippedWeapon=weapons.find(w=>w.id===pl.weapon),equippedArmor=armors.find(a=>a.id===pl.armor);
    const portrait=A().classes?.[pl.className]||'';
    const loadoutItem=(name,detail,art,kind)=>'<div class="ash099-loadout-slot">'+(art?'<img src="'+esc(art)+'" alt="" aria-hidden="true" onerror="this.onerror=null;this.style.display=\'none\'">':icon(kind==='weapon'?'smith':'sheet'))+'<span><small>'+(kind==='weapon'?'WEAPON':'ARMOR')+'</small><strong>'+esc(name)+'</strong><em>'+esc(detail)+'</em></span></div>';
    const list=tab==='weapon'?weapons:armors;
    screen(head('Workshop',String(pl.currentRegion||'Ashmere')==='Greyfen'?'Causeway Smithy':'The Blacksmith','A good weapon is chosen. Good armor is earned. Equip what you own, or spend gold to improve your odds.',locationInterior('forge'),'smith'),
      '<section class="ash099-forge-console">'+
        '<div class="ash099-forge-loadout">'+(portrait?'<img class="ash099-forge-traveler" src="'+esc(portrait)+'" alt="'+esc(pl.className||'Traveler')+'" onerror="this.onerror=null;this.style.display=\'none\'">':'')+'<div class="ash099-forge-loadout-copy"><span class="ash099-eyebrow">YOUR CURRENT KIT</span><h2>Level '+Number(pl.level||1)+' · '+esc(pl.className||'Traveler')+'</h2><p>Owned gear stays yours. New gear is equipped as soon as you buy it.</p></div><div class="ash099-forge-slots">'+loadoutItem(equippedWeapon?.name||weaponName(pl.weapon),equippedWeapon?'Damage '+equippedWeapon.min+'–'+equippedWeapon.max:'Basic attack',assets.shortSword||'','weapon')+loadoutItem(equippedArmor?.name||armorName(pl.armor),equippedArmor?'Defense '+equippedArmor.defense:'No protection',assets.shield||assets.camp||'','armor')+'</div></div>'+
        '<div class="ash099-forge-tabs" role="tablist" aria-label="Workshop category"><button data-forge-tab="weapon" class="'+(tab==='weapon'?'active':'')+'" role="tab" aria-selected="'+(tab==='weapon')+'">Weapons</button><button data-forge-tab="armor" class="'+(tab==='armor'?'active':'')+'" role="tab" aria-selected="'+(tab==='armor')+'">Armor</button><span>YOUR GOLD <strong>'+gold(pl.gold)+'</strong></span></div>'+
        '<div class="ash099-forge-grid">'+list.map(x=>gearCard(x,tab)).join('')+'</div><div id="ashNote" class="ash099-note" style="display:none"></div></section>');
    document.querySelectorAll('[data-forge-tab]').forEach(b=>b.onclick=()=>renderSmith(b.dataset.forgeTab));
    document.querySelectorAll('[data-gear]').forEach(b=>b.onclick=()=>buyGear(b.dataset.gear,b.dataset.kind));
  }
  function gearCard(x,kind){
    const pl=p(),ownedMap=kind==='weapon'?pl.ownedWeapons:pl.ownedArmor,assets=A().items||{};
    const art=kind==='weapon'?(assets.shortSword||assets.bow):(assets.shield||assets.camp);
    const isOwned=Number(ownedMap?.[x.id]||0)>0,level=Number(pl.level||1),required=Number(x.level||1);
    const equipped=(kind==='weapon'?pl.weapon:pl.armor)===x.id,locked=level<required,canBuy=canAfford(pl,x.cost);
    const label=equipped?'Equipped':isOwned?'Equip owned':locked?'Unlock at Lv. '+required:canBuy?'Buy & equip':'Need '+gold(x.cost);
    const disabled=equipped||(!isOwned&&(locked||!canBuy));
    return '<button class="ash099-gear-item '+(equipped?'equipped ':'')+(locked&&!isOwned?'locked':'')+'" data-gear="'+esc(x.id)+'" data-kind="'+kind+'" '+(disabled?'disabled':'')+'>'+
      (art?'<img class="ash099-gear-art" src="'+esc(art)+'" alt="" aria-hidden="true" loading="lazy" onerror="this.onerror=null;this.style.display=\'none\'">':'')+
      '<span class="ash099-gear-copy"><strong>'+esc(x.name)+'</strong><small>'+(kind==='weapon'?'Damage '+x.min+'–'+x.max:'Defense '+x.defense)+'</small><em>'+(isOwned?'Owned':locked?'Requires level '+required:gold(x.cost))+'</em></span><b class="ash099-gear-action">'+label+'</b></button>';
  }
  function buyGear(id,kind){
    const pl=p();if(!pl)return;
    const list=kind==='weapon'?D().weapons:D().armors,item=(list||[]).find(x=>x.id===id);
    if(!item||kind!=='weapon'&&kind!=='armor')return renderSmith();
    const level=Number(pl.level||1),required=Number(item.level||1),ownedMap=kind==='weapon'?(pl.ownedWeapons=pl.ownedWeapons||{}):(pl.ownedArmor=pl.ownedArmor||{});
    if(level<required&&!Number(ownedMap[id]||0))return note('You need level '+required+' to use '+item.name+'.');
    if(Number(ownedMap[id]||0)>0){
      if(kind==='weapon')pl.weapon=id;else pl.armor=id;
      save(pl);renderSmith(kind);note('Equipped '+item.name+'.');
      return;
    }
    if(Number(pl.gold||0)<Number(item.cost||0))return note('Not enough gold.');
    pl.gold-=Number(item.cost||0);ownedMap[id]=1;
    if(kind==='weapon')pl.weapon=id;else pl.armor=id;
    save(pl);renderSmith(kind);note('Purchased and equipped '+item.name+'.');
  }

  function renderSheet(){
    const pl=p(),assets=A(),items=assets.items||{},portrait=assets.classes?.[pl.className]||'';
    const inventoryEntries=Object.entries(pl.inventory||{}).filter(([,v])=>Number(v)>0);
    const inv=inventoryEntries.map(([k,v])=>{
      const art=itemIcon(k);
      return '<article class="ash099-inventory-item">'+(art?'<img src="'+esc(art)+'" alt="" aria-hidden="true" loading="lazy" onerror="this.onerror=null;this.style.display=\'none\'">':'<span class="ash099-item-placeholder" aria-hidden="true">✦</span>')+'<div class="ash099-inventory-item-copy"><strong>'+esc(itemName(k))+'</strong><small>In your pack</small></div><b>×'+Number(v)+'</b></article>';
    }).join('')||'<p class="ash099-inventory-empty">Your pack is light. The road may change that.</p>';
    const xp=Number(pl.xp||0),nextXp=Number(pl.level||1)*100;
    const weapon=(D().weapons||[]).find(w=>w.id===pl.weapon),armor=(D().armors||[]).find(a=>a.id===pl.armor);
    const equipment=(label,name,detail,art)=>'<article class="ash099-profile-equipment"><span class="ash099-eyebrow">'+label+'</span>'+(art?'<img src="'+esc(art)+'" alt="" aria-hidden="true" onerror="this.onerror=null;this.style.display=\'none\'">':'')+'<strong>'+esc(name)+'</strong><small>'+esc(detail)+'</small></article>';
    screen(head('Traveler',pl.username||'Traveler','Who you are, what you can endure, and what you carry beyond the lantern line.','','profile'),
      '<section class="ash099-traveler-profile">'+
        '<div class="ash099-traveler-profile-top">'+(portrait?'<img class="ash099-traveler-profile-portrait" src="'+esc(portrait)+'" alt="'+esc(pl.className||'Traveler')+'" onerror="this.onerror=null;this.style.display=\'none\'">':'')+
          '<div class="ash099-traveler-profile-identity"><span class="ash099-eyebrow">YOUR TRAVELER</span><h2>'+esc(pl.className||'Wanderer')+'</h2><p>'+esc(pl.personalityLabel||'Traveler')+' · '+esc(pl.origin||'Unknown origin')+'</p><p class="ash099-flavor">'+esc(pl.keepsake||'A life not yet written')+'</p></div>'+
          '<div class="ash099-traveler-profile-level"><span>LEVEL</span><strong>'+Number(pl.level||1)+'</strong><small>'+xp+' / '+nextXp+' XP</small><i><b style="width:'+Math.max(0,Math.min(100,Math.round(xp/Math.max(1,nextXp)*100)))+'%"></b></i></div></div>'+
        '<div class="ash099-traveler-vitals"><div class="ash099-vital-hp"><span>HEALTH</span><strong>'+Number(pl.hp||0)+' <small>/ '+Number(pl.maxHp||0)+'</small></strong><i><b style="width:'+hpPct(pl)+'%"></b></i></div><div><span>GOLD</span><strong>'+gold(pl.gold)+'</strong></div><div><span>ROAD TOKENS</span><strong>'+Number(pl.inventory?.roadToken||0)+' <small>/ 5</small></strong></div></div>'+
        '<div class="ash099-profile-equipment-grid">'+equipment('IN HAND',weapon?.name||weaponName(pl.weapon),weapon?'Damage '+weapon.min+'–'+weapon.max:'Basic attack',items.shortSword)+equipment('WORN',armor?.name||armorName(pl.armor),armor?'Defense '+armor.defense:'No protection',items.shield)+'</div>'+
        '<div class="ash099-traveler-detail-grid"><div><span>PRONOUNS</span><strong>'+esc(pl.pronouns||'they/them')+'</strong></div><div><span>HOME</span><strong>'+esc(pl.currentRegion||'Ashmere')+'</strong></div><div><span>TOWN WORK</span><strong>'+Number(pl.flags?.ashmereJobs||0)+' jobs</strong></div><div><span>ROAD PROOF</span><strong>'+Number(pl.inventory?.bellFragment||0)+' Bell Fragments</strong></div></div>'+
      '</section><section class="ash099-traveler-inventory"><div class="ash099-traveler-inventory-head"><div><span class="ash099-eyebrow">WHAT YOU CARRY</span><h2>Your Pack</h2></div><span>'+inventoryEntries.reduce((sum,[,v])=>sum+Number(v),0)+' items</span></div><div class="ash099-inventory-grid">'+inv+'</div></section>');
  }
  function renderArchive(){const pl=p();screen(head('Records',String(p()?.currentRegion||'Ashmere')==='Greyfen'?'Boundary Archive':'Archive Hall',String(p()?.currentRegion||'Ashmere')==='Greyfen'?'The bell keeper’s ledgers track the old boundary stones and drowned roads.':'Mara keeps records, maps, and town memory.',locationInterior('archive'),'archive'),`<div class="ash099-lines">${(pl.memories||[]).map(m=>`<p>${esc(m)}</p>`).join('')||'<p>No memories recorded yet. The road has not left enough ink on you.</p>'}</div>`);}
  function startRoad(){if(window.LegendRoadControllerV100?.start)return window.LegendRoadControllerV100.start();if(window.LegendRoadControllerV087?.start)return window.LegendRoadControllerV087.start();screen(head('Town Gate','Old Road','The road controller did not load.',roadBg(),'road'),'<p>Try a hard refresh.</p>');}
  function intercept(){const text=document.body?.innerText||'';if(/Ashmere Menu|Ashmere • First Town/.test(text)&&!document.querySelector('.ash099'))renderAshmere();}
  window.LegendAshmereV099={renderAshmere,route};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',intercept);else intercept();
  const rt=RT(); if(rt.onRender)rt.onRender(intercept);
})();