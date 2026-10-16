// LEGEND v0.10.1 - Regional Travel Controller
// Owns the world-map layer: Road Tokens unlock regions; gold pays for travel between them.
(() => {
  const RT=()=>window.LegendRuntimeV120||{}, D=()=>window.LEGEND_DATA||{}, A=()=>window.LegendAssetsV090||{}, root=()=>document.getElementById('root');
  const p=()=>RT().loadPlayer?.()||null, save=pl=>RT().savePlayer?.(pl);
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const gold=n=>Number(n||0).toLocaleString()+'g';
  const regions=()=>D().regions||{};
  const unlocked=pl=>Array.isArray(pl.discoveredRegions)?pl.discoveredRegions:['Ashmere'];
  function backToTown(){
    const player=p();
    if(player&&!['Ashmere','Greyfen'].includes(String(player.currentRegion||'Ashmere'))){
      player.currentRegion='Ashmere';
      save(player);
    }
    window.LegendAshmereV099?.renderAshmere?.();
  }

  const regionView=window.LegendRegionViewV100?.create({
    root,
    getPlayer:p,
    getRegions:regions,
    getAssets:A,
    escapeHtml:esc,
    formatGold:gold,
    onBack:backToTown,
    onUnlock:unlock,
    onTravel:travel
  });

  function render(note=''){
    if(regionView?.render)return regionView.render(note);
    const host=root();
    if(host)host.innerHTML='<main class="reg100"><div class="reg100-wrap"><section class="reg100-screen"><h1>Roads & Regions unavailable</h1><p>The region view did not load. Refresh before continuing.</p></section></div></main>';
  }
  function unlock(id){
    const pl=p(), r=regions()[id]; if(!pl||!r)return;
    const known=unlocked(pl);
    if(known.includes(id))return render('That region is already open.');
    if(r.requiresRegion&&!known.includes(r.requiresRegion)){
      const required=regions()[r.requiresRegion]?.name||r.requiresRegion;
      return render('Unlock '+required+' before opening '+r.name+'.');
    }
    if(r.requiresFlag&&!p()?.flags?.[r.requiresFlag])return render('Complete '+(r.requiresFlagLabel||r.requiresFlag)+' before opening '+r.name+'.');
    if(r.available===false)return render(r.name+' is mapped, but its playable region is still in development. Greyfen remains the active frontier.');
    const cost=Number(r.unlockTokens||0);
    if(Number(pl.inventory?.roadToken||0)<cost)return render('The road ledger is still short on tokens.');
    pl.inventory.roadToken-=cost;
    pl.discoveredRegions=known.concat(id);
    pl.currentRegion=id;
    pl.stats=pl.stats||{}; pl.stats.regionsUnlocked=Number(pl.stats.regionsUnlocked||0)+1;
    pl.memories=pl.memories||[]; pl.memories.push('You opened the road to '+r.name+'.');
    save(pl);
    render(r.name+' is now part of your road network. The first crossing is yours; future crossings cost gold.');
  }
  function travel(id){
    const pl=p(), r=regions()[id]; if(!pl||!r)return;
    if(!unlocked(pl).includes(id))return render('That road is still closed.');
    if(pl.currentRegion===id)return render('You are already in '+r.name+'.');
    if(r.available===false)return render(r.name+' is not playable yet. Continue from Greyfen while its next region is built.');
    const fare=Number(r.travelCost||0);
    if(Number(pl.gold||0)<fare)return render('You need '+gold(fare)+' to make that crossing.');
    pl.gold-=fare; pl.currentRegion=id;
    pl.memories=pl.memories||[]; pl.memories.push('You traveled to '+r.name+' for '+gold(fare)+'.');
    save(pl);
    render('You arrive in '+r.name+'. The road network is open in both directions.');
  }
  window.LegendRegionsV100={render,unlock,travel};
})();
