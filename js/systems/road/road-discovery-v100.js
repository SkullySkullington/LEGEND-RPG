/* LEGEND v0.20.36 - Old Road discovery and route-clue system.
 * Owns points of interest, route choice, evidence discoveries, and story-specific
 * field decisions. Expedition state/save/render services are injected.
 */
(() => {
  function create(context = {}) {
    const {
      getPlayer,
      savePlayer,
      ensureState,
      getRoadData,
      addInventory,
      escapeHtml,
      clamp: clampValue,
      bellRoadEvidence,
      getPointOfInterest,
      renderExpedition,
      tone
    } = context;

    if (typeof getPlayer !== 'function' || typeof savePlayer !== 'function' ||
        typeof ensureState !== 'function' || typeof getRoadData !== 'function' ||
        typeof addInventory !== 'function' || typeof escapeHtml !== 'function' ||
        typeof renderExpedition !== 'function' ||
        typeof bellRoadEvidence?.recordPointEvidence !== 'function') return null;

    const p = getPlayer;
    const save = savePlayer;
    const ensure = ensureState;
    const road = getRoadData;
    const inv = addInventory;
    const esc = escapeHtml;
    const clamp = typeof clampValue === 'function' ? clampValue : (n, lo, hi) => Math.max(lo, Math.min(hi, n));
    let visibleDiscoveryStage = null;
    const discoveryView = window.LegendRoadDiscoveryViewV100?.create({ escapeHtml: esc, getPointOfInterest: pointOfInterest });

function pointOfInterest(stage){
 const contextual=typeof getPointOfInterest==='function'?getPointOfInterest(stage):null;
 if(contextual)return contextual;
 const points=road().pointsOfInterest||[],index=clamp(Number(stage||0),0,5);
 return {...(points[index]||{key:'road-marker',name:'Roadside Marker',kind:'Trail Clue',text:'The road holds a faint sign of passage.',action:'Inspect the marker',icon:'⌖',short:'Marker',x:50,y:50})};
}
function pointOfInterestPanel(pl,s,stage){
 return discoveryView?.pointOfInterestPanel(pl,s,stage,visibleDiscoveryStage)||'';
}
function routeChoicePanel(s,stage){
 return discoveryView?.routeChoicePanel(s,stage)||'';
}
function movedCairnDecisionPanel(pl,s,stage){
 return discoveryView?.movedCairnDecisionPanel(pl,s,stage)||'';
}
function chooseMovedCairnDecision(decision){
 const pl=p();if(!pl)return;
 const s=ensure(pl),contract=pl.flags?.sideContracts?.movedCairn;
 if(s.stage!==1||s.routeChoice!=='ridge'||!s.poiUsed?.['ridge-cairn']||!contract||contract.complete||contract.decision)return renderExpedition('The cairn report is no longer open on this stretch.');
 const outcomes={
  restore:{
   title:'The older groove takes the stone',
   result:'You ease the stone back into the weathered groove. The face settles with a gritty scrape. It now points toward the higher line, but the fresh marks make it clear that someone moved it—and you still do not know why.',
   memory:'On the Ridgeway, you restored the cairn stone to its older groove. The fresh scrape records your intervention; the reason for the original move remains unknown.'
  },
  record:{
   title:'Both alignments are recorded',
   result:'You sketch the stone as it stands, then copy the older groove beneath it. You leave the cairn untouched. Anyone who follows can compare the two positions instead of trusting a single clean-looking mark.',
   memory:'At the Ridgeway Cairn, you recorded both the shifted stone and its older groove without moving it. The route evidence is preserved, but the safe alignment remains unsettled.'
  },
  warn:{
   title:'A warning marks the stone',
   result:'You tie a strip of cloth where the track narrows and leave the stone in place. The warning may keep a cart from taking the lower line, but it cannot tell travelers which mark to trust.',
   memory:'At the Ridgeway Cairn, you marked the shifted stone as a hazard and left it untouched. Travelers are warned, but the route still needs a proper survey.'
  }
 };
 const outcome=outcomes[decision];if(!outcome)return renderExpedition('That report choice is not available.');
 contract.decision=decision;
 contract.decisionStage=Number(s.stage||0);
 pl.flags=pl.flags||{};
 pl.memories=Array.isArray(pl.memories)?pl.memories:[];
 if(!pl.memories.includes(outcome.memory))pl.memories.push(outcome.memory);
 save(pl);
 renderExpedition(outcome.result);
}
function chooseRoadRoute(route){
 const pl=p();if(!pl)return;const s=ensure(pl);
 if(Number(s.stage)!==0||s.routeChoice)return renderExpedition('The fork has already been settled for this expedition.');
 if(route==='ridge'){s.routeChoice='ridge';s.pressure=clamp(s.pressure-8,0,100);save(pl);return renderExpedition('You choose the High Ridge. The ground firms beneath your boots, and the road feels a little less watchful. Road Pressure falls by 8.');}
 s.routeChoice='reeds';inv(pl,'bellFragment',1);s.pressure=clamp(s.pressure+10,0,100);save(pl);return renderExpedition('You slip into the Reed Cut and pluck a Bell Fragment from the mud beside the blue light. Something stirs deeper in the reeds. +1 Bell Fragment; Road Pressure rises by 10.');
}
function inspectPointOfInterest(){
 const pl=p();if(!pl)return;const s=ensure(pl),stage=clamp(Number(s.stage||0),0,5),point=pointOfInterest(stage);
 s.poiUsed=s.poiUsed||{};
 if(s.poiUsed[point.key])return renderExpedition('You have already investigated this spot on the current expedition.');
 s.poiUsed[point.key]=true;s.discoveryOpen=false;s.discoveryStage=null;visibleDiscoveryStage=null;
 const {foundGreyfenFieldNote,foundGreyfenWeeklyReturn}=bellRoadEvidence.recordPointEvidence(pl,point);
 let note='',reward='';
 if(stage===0){pl.gold=Number(pl.gold||0)+5;s.pressure=clamp(s.pressure-4,0,100);note='You follow the drier tracks and find a small coin purse caught beneath the marker. +5 gold; Road Pressure falls by 4.';}
 else if(stage===1&&s.routeChoice==='ridge'){
  inv(pl,'roadHerb',1);s.pressure=clamp(s.pressure-3,0,100);
  const cairnOutcome=pl.flags?.highRidgeCairnOutcome||pl.flags?.sideContracts?.movedCairn?.decision;
  note=cairnOutcome==='restore'
   ?'You check the cairn you reset and compare its fresh scrape with the older groove. A Road Herb remains tucked behind the stones. +1 Road Herb; Road Pressure falls by 3.'
   :cairnOutcome==='record'
    ?'Your notes preserve both positions; the chalk still matches the groove beneath the shifted stone. You recover a Road Herb. +1 Road Herb; Road Pressure falls by 3.'
    :cairnOutcome==='warn'
     ?'The warning cloth still marks the shifted cairn. You check the track without moving the stone and recover a Road Herb. +1 Road Herb; Road Pressure falls by 3.'
     :'You collect the herbs tucked behind the Ridgeway Cairn and follow its dry trail marks. +1 Road Herb; Road Pressure falls by 3.';
 }
 else if(stage===1&&s.routeChoice==='reeds'){inv(pl,'roadHerb',1);s.pressure=clamp(s.pressure+4,0,100);note='You recover the torn herb pouch, but the tracks circle closer as you leave. +1 Road Herb; Road Pressure rises by 4.';}
 else if(stage===1){inv(pl,'bellFragment',1);s.pressure=clamp(s.pressure+2,0,100);note='The blue glow fades into a Bell Fragment in your palm. The ditch feels less quiet now. +1 Bell Fragment.';}
 else if(stage===2){
  inv(pl,'food',1);inv(pl,'roadHerb',1);
  note=foundGreyfenWeeklyReturn
   ?'The oilskin return is damp but legible: the lower crossing was closed pending inspection, then changed to open in darker ink without initials. You wrap it separately for Brenn. +1 Ration, +1 Road Herb.'
   :'You recover a sealed ration and a usable Road Herb from the cold ashes. +1 Ration, +1 Road Herb.';
 }
 else if(stage===3){s.pressure=clamp(s.pressure-8,0,100);inv(pl,'bellFragment',1);note='The seal’s pattern matches an old Ashmere mark. You take a Bell Fragment and learn a safer way around the roots. +1 Bell Fragment; Road Pressure falls by 8.';}
 else if(stage===4){
  inv(pl,'clothScrap',1);inv(pl,'roadHerb',1);
  note=foundGreyfenFieldNote
   ?'You copy the date and sketch before wrapping the field note for Mara. The newer cut is already drawn two days after Greyfen logged the flood’s retreat. +1 Cloth Scrap, +1 Road Herb.'
   :'The locker gives way. Inside are clean cloth strips and a bundle of preserved herbs. +1 Cloth Scrap, +1 Road Herb.';
 }
 else if(stage===5&&point.key==='greyfen-marker'&&pl.flags?.greyfenBoundaryCompared){
  pl.gold=Number(pl.gold||0)+10;s.pressure=clamp(s.pressure-5,0,100);pl.flags=pl.flags||{};pl.flags.greyfenRouteRecorded=true;
  note='The Greyfen boundary mark matches the older bell-mark at Blackroot, but a newer cut turns toward the reed bed. The stone shows that someone altered the marker; it does not say who. +10 gold; Road Pressure falls by 5.';
 }
 else {pl.gold=Number(pl.gold||0)+10;s.pressure=clamp(s.pressure-5,0,100);pl.flags=pl.flags||{};pl.flags.greyfenRouteRecorded=true;note='You copy the scratched route marks into your journal. The safer line is recorded, and you find 10 gold wedged behind the stone.';}
 pl.stats=pl.stats||{};pl.stats.pointsOfInterest=Number(pl.stats.pointsOfInterest||0)+1;save(pl);
 tone('success');renderExpedition(note);
}

    function reveal(stage) {
      visibleDiscoveryStage = Number(stage);
    }

    function hide() {
      visibleDiscoveryStage = null;
    }

    return Object.freeze({
      pointOfInterest,
      pointOfInterestPanel,
      routeChoicePanel,
      movedCairnDecisionPanel,
      chooseMovedCairnDecision,
      chooseRoadRoute,
      inspectPointOfInterest,
      reveal,
      hide
    });
  }

  window.LegendRoadDiscoveryV100 = Object.freeze({ create });
})();
