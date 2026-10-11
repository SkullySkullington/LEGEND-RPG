// LEGEND v0.10.1 - Regional Travel Controller
// Owns the world-map layer: Road Tokens unlock regions; gold pays for travel between them.
(() => {
  const RT=()=>window.LegendRuntimeV080||{}, D=()=>window.LEGEND_DATA||{}, root=()=>document.getElementById('root');
  const p=()=>RT().loadPlayer?.()||null, save=pl=>RT().savePlayer?.(pl);
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const gold=n=>Number(n||0).toLocaleString()+'g';
  const regions=()=>D().regions||{};
  const list=()=>Object.values(regions());
  const unlocked=pl=>Array.isArray(pl.discoveredRegions)?pl.discoveredRegions:['Ashmere'];
  function shell(body){root().innerHTML='<main class="reg100"><div class="reg100-wrap">'+body+'</div></main>'}
  function card(pl,r){
    const known=unlocked(pl), has=known.includes(r.id), current=pl.currentRegion===r.id, tokens=Number(pl.inventory?.roadToken||0), cost=Number(r.unlockTokens||0), travel=Number(r.travelCost||0);
    const requirement=r.requiresRegion?regions()[r.requiresRegion]:null, regionMet=!r.requiresRegion||known.includes(r.requiresRegion);
    const flagMet=!r.requiresFlag||Boolean(pl.flags?.[r.requiresFlag]), available=r.available!==false;
    let action='';
    if(current) action='<span class="reg100-state current">You are here</span>';
    else if(!regionMet) action='<span class="reg100-state">Requires '+esc(requirement?.name||r.requiresRegion)+' first</span>';
    else if(!flagMet) action='<span class="reg100-state">Complete '+esc(r.requiresFlagLabel||r.requiresFlag)+' first</span>';
    else if(!available) action='<span class="reg100-state">In development</span>';
    else if(!has&&cost>0) action='<button class="reg100-btn" data-unlock="'+esc(r.id)+'">'+(tokens>=cost?'Unlock':'Need '+Math.max(0,cost-tokens)+' more token'+(cost-tokens===1?'':'s'))+'</button>';
    else if(!has) action='<span class="reg100-state">Locked</span>';
    else if(!available) action='<span class="reg100-state">In development</span>';
    else action='<button class="reg100-btn" data-travel="'+esc(r.id)+'">'+(travel?'Travel • '+gold(travel):'Enter')+'</button>';
    const meta=has?(current?'Current location':'Unlocked'):(!regionMet?'First unlock '+esc(requirement?.name||r.requiresRegion):!flagMet?'Complete '+esc(r.requiresFlagLabel||r.requiresFlag):!available?'In development':'Unlock: '+cost+' Road Tokens');
    return '<article class="reg100-card '+(has?'unlocked ':'locked ')+(current?'current':'')+'"><div class="reg100-card-top"><span class="reg100-mark">'+(has?'✦':'•')+'</span><div><div class="reg100-kicker">'+(r.type==='home'?'HOME REGION':'REGION')+'</div><h2>'+esc(r.name)+'</h2></div></div><p>'+esc(r.description||'A place beyond the known road.')+'</p><div class="reg100-meta">'+meta+(has&&!current&&available?' • Fare '+travel+'g':'')+'</div>'+action+'</article>';
  }
  function render(note=''){
    const pl=p(); if(!pl)return;
    const tokens=Number(pl.inventory?.roadToken||0), known=unlocked(pl);
    shell('<section class="reg100-screen"><header class="reg100-head"><div class="reg100-kicker">THE REALM</div><h1>Roads & Regions</h1><p>Road Tokens open new lands when they are ready to play. Greyfen is the active frontier; later regions stay on the ledger until their story and town hub are built.</p><div class="reg100-wallet"><div><strong>'+tokens+'</strong><span>Road Tokens</span></div><div><strong>'+gold(pl.gold)+'</strong><span>Gold</span></div><div><strong>'+known.length+'</strong><span>Regions Known</span></div></div></header><section class="reg100-panel"><div class="reg100-title"><div><div class="reg100-kicker">TRAVEL NETWORK</div><h2>Where will the road take you?</h2></div><span>Unlock • Travel • Return</span></div><div class="reg100-grid">'+list().map(r=>card(pl,r)).join('')+'</div></section><div class="reg100-actions"><button class="reg100-btn wide" id="regBack">Back to Ashmere</button></div>'+ (note?'<div class="reg100-note">'+esc(note)+'</div>':'')+'</section>');
    document.getElementById('regBack').textContent=String(pl.currentRegion||'Ashmere')==='Greyfen'?'Back to Greyfen':'Back to Ashmere';
    document.getElementById('regBack').onclick=()=>{
      const player=p();
      if(player&&!['Ashmere','Greyfen'].includes(String(player.currentRegion||'Ashmere'))){
        player.currentRegion='Ashmere';save(player);
      }
      window.LegendAshmereV099?.renderAshmere?.();
    };
    document.querySelectorAll('[data-unlock]').forEach(b=>b.onclick=()=>unlock(b.dataset.unlock));
    document.querySelectorAll('[data-travel]').forEach(b=>b.onclick=()=>travel(b.dataset.travel));
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
