/* LEGEND v0.21.0 — immersive scene-first expedition interface.
 * Presentation is rebuilt around the road scene, compact route progress,
 * contextual actions, and focused map / field-journal overlays.
 * Existing discovery, travel, camp, combat, inventory, and return services remain authoritative.
 */
(() => {
 function create(context = {}) {
  const {getPlayer,ensureState,areaForStage,escapeHtml,shell,header,scene,roadDiscovery,
    bindHotspotDelegation,savePlayer,resolveChoice,finish,addInventory,clamp,returnToAshmere}=context;
  if(typeof getPlayer!=='function'||typeof ensureState!=='function'||typeof areaForStage!=='function'||
    typeof escapeHtml!=='function'||typeof shell!=='function'||
    typeof roadDiscovery?.routeChoicePanel!=='function'||typeof bindHotspotDelegation!=='function'||
    typeof savePlayer!=='function'||typeof resolveChoice!=='function'||typeof finish!=='function'||
    typeof addInventory!=='function'||typeof clamp!=='function')return null;
  const p=getPlayer,ensure=ensureState,esc=escapeHtml,save=savePlayer,inv=addInventory,ret=returnToAshmere;
  const journalFor=pl=>{
    pl.flags=pl.flags||{};
    pl.flags.roadFieldJournalV150=pl.flags.roadFieldJournalV150||{visitedPlaces:[],discoveries:[],routes:[]};
    const journal=pl.flags.roadFieldJournalV150;
    journal.visitedPlaces=Array.isArray(journal.visitedPlaces)?journal.visitedPlaces:[];
    journal.discoveries=Array.isArray(journal.discoveries)?journal.discoveries:[];
    journal.routes=Array.isArray(journal.routes)?journal.routes:[];
    return journal;
  };
  function campActions(pl,s){
    const camp=Number(pl.inventory?.camp||0),food=Number(pl.inventory?.food||0),herb=Number(pl.inventory?.roadHerb||0),cloth=Number(pl.inventory?.clothScrap||0);
    return '<section class="exp100-camp exp150-camp"><div class="exp100-camp-heading"><span>WAYSTATION</span><strong>Make this stop count</strong><small>Rest, recover, or turn field finds into something useful before moving on.</small></div><div class="exp100-camp-actions"><button class="exp100-choice" id="campRest" '+((camp<1&&food<1)?'disabled':'')+'><strong>Rest by the Fire</strong><span>Recover 20% of maximum health and reduce Road Pressure by 12.</span><em>Cost: 1 Camp Supply or 1 Ration</em></button><button class="exp100-choice" id="campCraft" '+((herb<1||cloth<1)?'disabled':'')+'><strong>Craft a Road Poultice</strong><span>Use 1 Road Herb and 1 Cloth Scrap to make a healing potion.</span><em>Materials: '+herb+' herbs · '+cloth+' cloth</em></button></div></section>';
  }
  function statusMetric(label,value,percent,kind=''){
    return '<div class="exp150-meter '+kind+'"><div><span>'+label+'</span><strong>'+value+'</strong></div><i><b style="width:'+clamp(Number(percent)||0,0,100)+'%"></b></i></div>';
  }
  function trackerMarkup(pl,s,stage){
    const journal=journalFor(pl);
    const visited=new Set(journal.visitedPlaces);
    return '<nav class="exp150-route-tracker" aria-label="Expedition progress"><div class="exp150-tracker-label"><span>YOUR JOURNEY</span><small>'+stage+' / 5 travel legs</small></div><ol>'+Array.from({length:6},(_,i)=>{
      const stop=areaForStage(i),name=String(stop.name||('Road '+(i+1))),isCurrent=i===stage,isVisited=visited.has(name)||i<stage;
      return '<li class="'+(isCurrent?'is-current ':'')+(isVisited?'is-visited':'')+'"><span class="exp150-stop-marker">'+(isVisited&&!isCurrent?'✓':String(i+1).padStart(2,'0'))+'</span><span class="exp150-stop-name">'+esc(name)+'</span></li>';
    }).join('')+'</ol></nav>';
  }
  function mapPanel(pl,s,stage){
    const journal=journalFor(pl),visited=new Set(journal.visitedPlaces),route=s.routeChoice;
    return '<div class="exp150-map-sheet"><div class="exp150-map-intro"><span class="exp150-kicker">FIELD MAP · OLD ROAD</span><h2>The road you know</h2><p>Known places are recorded as you travel. Unvisited stretches stay uncertain until you reach them.</p></div><div class="exp150-map-line">'+Array.from({length:6},(_,i)=>{
      const stop=areaForStage(i),name=String(stop.name||('Road '+(i+1))),isCurrent=i===stage,isVisited=visited.has(name)||i<stage;
      const status=isCurrent?'You are here':isVisited?'Visited':'Unexplored';
      const detail=i===0&&route?(route==='ridge'?'Route chosen: High Ridge':'Route chosen: Reed Cut'):i===0&&!route?'The fork is still ahead':stop.type||'Road location';
      return '<div class="exp150-map-stop '+(isCurrent?'is-current ':'')+(isVisited?'is-visited':'')+'"><span class="exp150-map-dot">'+(isVisited?'✓':String(i+1))+'</span><div><strong>'+esc(name)+'</strong><small>'+esc(detail)+'</small></div><em>'+status+'</em></div>';
    }).join('')+'</div><div class="exp150-map-legend"><span><i class="visited"></i> Visited</span><span><i class="current"></i> Current stop</span><span><i class="unknown"></i> Unknown</span></div></div>';
  }
  function journalPanel(pl){
    const journal=journalFor(pl);
    const discoveries=[...journal.discoveries].slice().reverse();
    const routes=[...journal.routes].slice().reverse();
    const discoveryMarkup=discoveries.length?discoveries.map(item=>'<article class="exp150-journal-entry"><span class="exp150-journal-entry-type">'+esc(item.kind||'Discovery')+' · '+esc(item.place||'The Old Road')+'</span><strong>'+esc(item.name||'Field note')+'</strong><p>'+esc(item.note||'The traveler recorded a detail worth remembering.')+'</p></article>').join(''):'<div class="exp150-journal-empty"><span>✧</span><strong>No clues recorded yet</strong><p>Investigate a landmark in the world to add a field note here.</p></div>';
    const routeMarkup=routes.length?routes.map(item=>'<article class="exp150-route-entry"><span>'+esc(item.place||'The Old Road')+'</span><strong>'+esc(item.title||'Route decision')+'</strong><small>'+esc(item.note||'A choice made on the road.')+'</small></article>').join(''):'<p class="exp150-journal-muted">Route decisions will be recorded here as you explore.</p>';
    const places=journal.visitedPlaces.length?journal.visitedPlaces.map(name=>'<span class="exp150-place-chip">'+esc(name)+'</span>').join(''):'<p class="exp150-journal-muted">Places appear as your journey reaches them.</p>';
    return '<div class="exp150-journal-sheet"><div class="exp150-map-intro"><span class="exp150-kicker">TRAVELER’S FIELD JOURNAL</span><h2>What the road remembers</h2><p>Your discoveries persist between expeditions. Quest evidence and inventory remain in their own existing records.</p></div><section class="exp150-journal-section"><h3>Places visited <span>'+journal.visitedPlaces.length+'</span></h3><div class="exp150-place-list">'+places+'</div></section><section class="exp150-journal-section"><h3>Clues & discoveries <span>'+discoveries.length+'</span></h3>'+discoveryMarkup+'</section><section class="exp150-journal-section"><h3>Route decisions <span>'+routes.length+'</span></h3>'+routeMarkup+'</section></div>';
  }
  function openPanel(kind){
    const pl=p();if(!pl)return;
    const s=ensure(pl),stage=clamp(Number(s.stage||0),0,5),overlay=document.getElementById('exp150Modal');
    const content=document.getElementById('exp150ModalContent');
    if(!overlay||!content)return;
    content.innerHTML=(kind==='map'?mapPanel(pl,s,stage):journalPanel(pl))+'<button type="button" class="exp150-modal-close" id="exp150ModalClose">Return to the road</button>';
    overlay.hidden=false;
    overlay.classList.add('is-open');
    document.body.classList.add('exp150-modal-open');
    document.getElementById('exp150ModalClose')?.focus();
    const close=()=>{
      overlay.hidden=true;
      overlay.classList.remove('is-open');
      document.body.classList.remove('exp150-modal-open');
    };
    document.getElementById('exp150ModalClose')?.addEventListener('click',close,{once:true});
    overlay.onclick=event=>{if(event.target===overlay)close();};
    overlay.onkeydown=event=>{if(event.key==='Escape')close();};
  }
  function renderExpedition(note=''){
    const pl=p();if(!pl)return;
    const s=ensure(pl),stage=clamp(Number(s.stage||0),0,5),area=areaForStage(stage),atCamp=!!area.camp;
    const searchDone=!!s.searchUsed?.[stage];
    const guide=window.LegendRoadOpeningV140?.guide?.(pl,s,stage)||'';
    const travelGate=window.LegendRoadOpeningV140?.travelGate?.(pl,s,stage)||{allowed:true};
    const travelLocked=travelGate.allowed===false;
    const openingLesson=pl.flags?.openingRoadV140?.phase==='road'&&!pl.flags.openingRoadV140.completed;
    const discoveryFound=Object.values(s.poiUsed||{}).some(Boolean);
    const searchLocked=openingLesson&&stage===0&&(!s.routeChoice||!discoveryFound);
    const journal=journalFor(pl),discoveryCount=journal.discoveries.length;
    const nextArea=areaForStage(Math.min(5,stage+1));
    const roadMood=s.pressure>=65?'The mist closes around the road. Something has found your trail.':s.pressure>=40?'The birds have gone quiet. Footsteps pace you somewhere beyond the reeds.':'Rain beads on the old stones. A lantern flickers far beyond the bend.';
    const sceneText=area.text||roadMood;
    const sceneMarkup=typeof scene==='function'?scene(stage,stage<5):header(pl,s,'OLD ROAD EXPEDITION',area.name,sceneText);
    let choices=stage>=5
      ? '<button class="exp150-action primary" id="finish"><span class="exp150-action-symbol">↩</span><span><strong>Return to Ashmere</strong><small>Secure what you found and bring the road report home.</small></span><b>→</b></button>'
      : '<button class="exp150-action primary" id="push" '+(travelLocked?'disabled aria-disabled="true"':'')+'><span class="exp150-action-symbol">➜</span><span><strong>'+(travelLocked?'Complete the first road lesson':'Travel On')+'</strong><small>'+(travelLocked?esc(travelGate.message):'Continue toward '+esc(nextArea.name))+'</small></span><b>→</b></button><button class="exp150-action" id="search" '+(searchDone||searchLocked?'disabled aria-disabled="true"':'')+'><span class="exp150-action-symbol">⌕</span><span><strong>'+(searchDone?'Nothing left to search':searchLocked?'Inspect the marker first':'Search the roadside')+'</strong><small>'+(searchDone?'You have searched this stretch':searchLocked?'A clue may reveal something useful':'Look for supplies and useful traces')+'</small></span><b>+</b></button><button class="exp150-action" id="careful"><span class="exp150-action-symbol">◉</span><span><strong>Read the Road</strong><small>Study the ground and lower Road Pressure.</small></span><b>↗</b></button>';
    const pressureNote=s.pressure>=65?'The road is closing in. A dangerous encounter may follow.':s.pressure>=40?'Your trail is growing easier to follow. Consider slowing down or finding shelter.':'You have a little room to breathe, but the road never stays quiet for long.';
    const status=Number(pl.hp||0)/maxHpSafe(pl);
    const markup=sceneMarkup+
      '<div class="exp150-world-page"><header class="exp150-expedition-head"><div class="exp150-title-group"><span class="exp150-kicker">OLD ROAD · EXPEDITION</span><h1>'+esc(area.name)+'</h1><p>'+esc(openingLesson?'Oric is waiting for you to read the road before moving on.':'Every mile offers a clue, a cost, or a choice.')+'</p></div><div class="exp150-vitals">'+statusMetric('Health',Number(pl.hp||0)+' / '+Number(pl.maxHp||0),status*100,'health')+statusMetric('Road Pressure',Number(s.pressure||0)+'%',s.pressure,'pressure')+'</div><div class="exp150-utility-actions"><button type="button" id="exp150OpenMap"><span>⌖</span>Road Map</button><button type="button" id="exp150OpenJournal"><span>✧</span>Field Journal <i>'+discoveryCount+'</i></button></div></header>'+
      trackerMarkup(pl,s,stage)+
      '<div class="exp150-main-grid"><section class="exp150-scene-column"><section class="exp150-narrative"><div><span class="exp150-kicker">'+esc(area.type||'ROAD SCENE')+'</span><p>'+esc(sceneText)+'</p></div>'+(note?'<div class="exp150-result-note" role="status">'+esc(note)+'</div>':'')+'</section>'+
      (guide?'<div class="exp150-guide">'+guide+'</div>':'')+
      '<div class="exp150-interactions">'+roadDiscovery.routeChoicePanel(s,stage)+roadDiscovery.pointOfInterestPanel(pl,s,stage)+roadDiscovery.movedCairnDecisionPanel(pl,s,stage)+'</div>'+
      (atCamp?campActions(pl,s):'')+
      '<section class="exp150-action-dock"><div class="exp150-section-heading"><div><span class="exp150-kicker">YOUR NEXT MOVE</span><h2>How will you proceed?</h2></div><span class="exp150-current-mark">STOP '+(stage+1)+' / 6</span></div><div class="exp150-action-list">'+choices+'</div><button class="exp150-abandon" id="town" type="button">Leave the expedition and return to Ashmere</button></section></section>'+
      '<aside class="exp150-journey-aside"><section class="exp150-aside-card exp150-next-stop"><span class="exp150-kicker">AHEAD ON THE ROAD</span><h2>'+(stage>=5?'Ashmere':esc(nextArea.name))+'</h2><p>'+(stage>=5?'The trip is complete. Your finds can be secured in town.':'The route can change what you find, how much pressure builds, and what follows you.')+'</p>'+(stage===0?'<div class="exp150-route-reminder"><span>THE FIRST FORK</span><strong>'+(s.routeChoice?(s.routeChoice==='ridge'?'High Ridge chosen':'Reed Cut chosen'):'High Ridge · Reed Cut')+'</strong><small>'+(s.routeChoice?'Your route choice is recorded for this journey.':'Compare a safer ridge path with a riskier trail through the reeds.')+'</small></div>':'')+'</section>'+
      '<section class="exp150-aside-card exp150-pressure-card"><div class="exp150-aside-title"><span class="exp150-kicker">ROAD PRESSURE</span><span>'+Number(s.pressure||0)+'%</span></div><div class="exp150-pressure-track"><i style="width:'+clamp(s.pressure,0,100)+'%"></i></div><p>'+esc(pressureNote)+'</p></section>'+
      '<section class="exp150-aside-card exp150-supplies-card"><span class="exp150-kicker">FIELD SUPPLIES</span><div class="exp150-supply-row"><span>Rations</span><strong>'+Number(pl.inventory?.food||0)+'</strong></div><div class="exp150-supply-row"><span>Camp Supplies</span><strong>'+Number(pl.inventory?.camp||0)+'</strong></div><div class="exp150-supply-row"><span>Road Herbs</span><strong>'+Number(pl.inventory?.roadHerb||0)+'</strong></div><div class="exp150-supply-row"><span>Healing Potions</span><strong>'+Number(pl.inventory?.potion||0)+'</strong></div><p>Resting and crafting use the supplies you carry. Check the waystation when you find one.</p></section>'+
      '<section class="exp150-aside-card exp150-journal-callout"><span class="exp150-kicker">FIELD NOTES</span><h2>'+discoveryCount+' recorded '+(discoveryCount===1?'discovery':'discoveries')+'</h2><p>Important clues travel with you. Open your journal to revisit what you have learned.</p><button type="button" class="exp150-text-action" id="exp150OpenJournalAside">Review field journal →</button></section></aside></div>'+
      '<div class="exp150-modal-layer" id="exp150Modal" hidden tabindex="-1"><section class="exp150-modal-dialog" role="dialog" aria-modal="true" aria-label="Road map or field journal"><div id="exp150ModalContent"></div></section></div></div>';
    shell(markup);
    bindHotspotDelegation();
    document.getElementById('poiLeave')?.addEventListener('click',()=>{const player=p();if(!player)return;const state=ensure(player);state.discoveryOpen=false;state.discoveryStage=null;roadDiscovery.hide();save(player);document.querySelector('.exp150-interactions .exp100-discovery-beat')?.remove();});
    document.getElementById('poiInspect')?.addEventListener('click',roadDiscovery.inspectPointOfInterest);
    document.querySelectorAll('[data-moved-cairn]').forEach(button=>button.addEventListener('click',()=>roadDiscovery.chooseMovedCairnDecision(button.dataset.movedCairn)));
    document.getElementById('routeRidge')?.addEventListener('click',()=>roadDiscovery.chooseRoadRoute('ridge'));
    document.getElementById('routeReeds')?.addEventListener('click',()=>roadDiscovery.chooseRoadRoute('reeds'));
    document.getElementById('careful')?.addEventListener('click',()=>resolveChoice('careful'));
    document.getElementById('search')?.addEventListener('click',()=>resolveChoice('search'));
    document.getElementById('push')?.addEventListener('click',()=>resolveChoice('push'));
    document.getElementById('finish')?.addEventListener('click',finish);
    document.getElementById('exp150OpenMap')?.addEventListener('click',()=>openPanel('map'));
    document.getElementById('exp150OpenJournal')?.addEventListener('click',()=>openPanel('journal'));
    document.getElementById('exp150OpenJournalAside')?.addEventListener('click',()=>openPanel('journal'));
    document.getElementById('town').onclick=()=>{const player=p();if(player?.flags?.openingRoadV140?.phase==='road'&&!player.flags.openingRoadV140.completed)window.LegendRoadOpeningV140?.complete?.(player,'abandoned');ret();};
    document.getElementById('campRest')?.addEventListener('click',()=>{
      const player=p();if(!player)return;const state=ensure(player);
      const supply=Number(player.inventory?.camp||0)>0?'camp':'food';
      player.inventory[supply]=Math.max(0,Number(player.inventory?.[supply]||0)-1);
      const healed=Math.min(Math.max(0,Number(player.maxHp||1)-Number(player.hp||1)),Math.max(1,Math.ceil(Number(player.maxHp||1)*.2)));
      player.hp=Number(player.hp||0)+healed;player.fatigue=Math.max(0,Number(player.fatigue||0)-20);
      state.pressure=clamp(state.pressure-12,0,100);player.day=Number(player.day||1)+1;
      player.stats=player.stats||{};player.stats.campsMade=Number(player.stats.campsMade||0)+1;save(player);
      renderExpedition('You rest at '+area.name+', recover '+healed+' health, and let the road quiet down.');
    });
    document.getElementById('campCraft')?.addEventListener('click',()=>{
      const player=p();if(!player)return;
      if(Number(player.inventory?.roadHerb||0)<1||Number(player.inventory?.clothScrap||0)<1)return;
      player.inventory.roadHerb--;player.inventory.clothScrap--;inv(player,'potion',1);save(player);
      renderExpedition('You bind a Road Herb into clean cloth and make a healing potion.');
    });
  }
  function maxHpSafe(pl){return Math.max(1,Number(pl.maxHp||1));}
  return Object.freeze({render:renderExpedition});
 }
 window.LegendRoadExpeditionScreenV100=Object.freeze({create});
})();