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
  const townAssets = window.LegendAshmereAssetsV099?.create({
    getAssets: A,
    getData: D,
    getPlayer: p,
    escapeHtml: esc
  }) || {};
  const img = townAssets.imageMarkup || (() => '');
  const itemIcon = townAssets.itemIcon || (() => '');
  const itemName = townAssets.itemName || (key => D().itemNames?.[key] || key);
  const gold = townAssets.gold || (amount => `${Number(amount || 0)}g`);
  const bg = townAssets.background || (() => '');
  const locationInterior = townAssets.locationInterior || (() => '');
  const roadBg = townAssets.roadBackground || (() => '');
  const npc = townAssets.npcArt || (() => '');
  const weaponName = townAssets.weaponName || (id => id || 'Hands');
  const armorName = townAssets.armorName || (id => id || 'None');
  const icon = townAssets.icon || (() => '');
  const regionShopArt = townAssets.regionShopArt || (() => '');
  const armorArt = townAssets.armorArt || (() => '');
  const serviceArt = townAssets.serviceArt || ((key, fallback = '') => fallback);
  const townView = window.LegendAshmereViewV099?.create({
    root,
    getPlayer: p,
    escapeHtml: esc,
    imageMarkup: img,
    icon,
    renderTown: renderAshmere,
    bindNavigation: bind
  });
  function unavailableTownView(){
    const host = root();
    if (host) host.innerHTML = '<main class="ash099 ash099-terminal"><div class="ash099-wrap"><section class="ash099-screen"><h1>Town screens are unavailable</h1><p>The shared town view module did not load. Refresh before continuing.</p></section></div></main>';
  }
  function shell(html){
    if (townView?.shell) return townView.shell(html);
    unavailableTownView();
  }
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

  function renderAshmere(){
    const hub = window.LegendAshmereHubV099;
    if (hub?.render) {
      return hub.render({
        getPlayer: p,
        escapeHtml: esc,
        gold,
        background: bg,
        imageMarkup: img,
        regionShopArt,
        icon,
        shell,
        bind
      });
    }
    const host = root();
    if (host) host.innerHTML = '<main class="ash099 ash099-terminal"><div class="ash099-wrap"><section class="ash099-screen"><h1>Ashmere is unavailable</h1><p>The town hub did not load. Refresh before continuing.</p></section></div></main>';
  }
  function feature(name, ...args){
    const render = townFeatures?.[name];
    if (typeof render === 'function') return render(...args);
    screen(head('Town Systems', 'Town Screen Unavailable', 'The feature router did not load. Refresh before continuing.', bg(), 'notice'),
      '<p>This town screen is unavailable. Return to the title and refresh before retrying.</p>');
  }
  function bind(){ document.querySelectorAll('[data-ash-view]').forEach(b => b.onclick = () => route(b.dataset.ashView)); }
  function route(v){
    if(v === 'home') return renderAshmere();
    if(v === 'people') return feature('renderPeople');
    if(v === 'mara' || v === 'brenn' || v === 'oric') return feature('renderNPC', v);
    if(v === 'inn') return feature('renderInn');
    if(v === 'trader') return feature('renderTrader');
    if(v === 'smith') return feature('renderSmith');
    if(v === 'work') return feature('renderWorkBoard');
    if(v === 'crossing') return feature('renderDryCrossing');
    if(v === 'craft') return feature('renderCrafting');
    if(v === 'sheet') return feature('renderSheet');
    if(v === 'archive') return feature('renderArchive');
    if(v === 'profile') {
      if(window.LegendAccountV09x?.renderAccount) return window.LegendAccountV09x.renderAccount();
      return renderAshmere();
    }
    if(v === 'routes') return renderRoutes();
    if(v === 'quests') return feature('renderSideContracts');
    if(v === 'road') return startRoad();
    if(v === 'regions') {
      if(window.LegendRegionsV100?.render) return window.LegendRegionsV100.render();
      return renderAshmere();
    }
    return renderAshmere();
  }
  function back(extra = ''){ return townView?.back?.(extra) || ''; }
  function head(k,t,d,im='',fallbackIcon='quest'){ return townView?.head?.(k,t,d,im,fallbackIcon) || ''; }
  function screen(h,b,extra=''){
    if (townView?.screen) return townView.screen(h,b,extra);
    unavailableTownView();
  }

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

  const townFeatures = window.LegendAshmereFeaturesV099?.create({
    getPlayer: p,
    savePlayer: save,
    getAssets: A,
    getData: D,
    escapeHtml: esc,
    imageMarkup: img,
    background: bg,
    npcArt: npc,
    setBellQuestObjective,
    note,
    head,
    screen,
    locationInterior,
    renderTown: renderAshmere,
    awardProgress: (player, amount) => window.LegendProgressionV100?.award(player, amount),
    gold,
    serviceArt,
    icon,
    itemName,
    itemIcon,
    canAfford,
    owned,
    canCraft,
    needsMarkup,
    armorArt,
    weaponName,
    armorName,
    regionShopArt,
    hpPct
  }) || {};
  function startRoad(){if(window.LegendRoadControllerV100?.start)return window.LegendRoadControllerV100.start();screen(head('Town Gate','Old Road','The expedition system could not load.',roadBg(),'road'),'<p>Return to the title and refresh before trying again.</p>');}
  function intercept(){const text=document.body?.innerText||'';if(/Ashmere Menu|Ashmere • First Town/.test(text)&&!document.querySelector('.ash099'))renderAshmere();}
  window.LegendAshmereV099={renderAshmere,route};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',intercept);else intercept();
  const rt=RT(); if(rt.onRender)rt.onRender(intercept);
})();