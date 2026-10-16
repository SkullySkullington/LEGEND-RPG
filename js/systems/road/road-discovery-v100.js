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
      setBellQuestObjective,
      renderExpedition,
      tone
    } = context;

    if (typeof getPlayer !== 'function' || typeof savePlayer !== 'function' ||
        typeof ensureState !== 'function' || typeof getRoadData !== 'function' ||
        typeof addInventory !== 'function' || typeof escapeHtml !== 'function' ||
        typeof renderExpedition !== 'function') return null;

    const p = getPlayer;
    const save = savePlayer;
    const ensure = ensureState;
    const road = getRoadData;
    const inv = addInventory;
    const esc = escapeHtml;
    const clamp = typeof clampValue === 'function' ? clampValue : (n, lo, hi) => Math.max(lo, Math.min(hi, n));
    let visibleDiscoveryStage = null;

function pointOfInterest(stage){
 const points=road().pointsOfInterest||[],index=clamp(Number(stage||0),0,5);
 const point={...(points[index]||{key:'road-marker',name:'Roadside Marker',kind:'Trail Clue',text:'The road holds a faint sign of passage.',action:'Inspect the marker',icon:'⌖',short:'Marker',x:50,y:50})};
 if(index===2){
  const pl=p();
  if(pl?.flags?.greyfenLedgerCompared&&!pl?.flags?.greyfenWeeklyReturnFound){
   return {key:'camp-firepit',name:'The Earlier Weekly Return',kind:'Route Record',text:'Beneath a warped plank beside the abandoned firepit, you find an oilskin packet. The weekly return predates the overwritten Greyfen entries: “Lower crossing — CLOSED pending inspection.” A second line, in darker ink, says “OPEN” but has no initials.',action:'Recover the weekly route return',icon:'▤',short:'Route return',x:28,y:57};
  }
 }
 if(index===4){
  const pl=p();
  if(pl?.flags?.greyfenArchiveRead&&!pl?.flags?.greyfenFieldNoteFound){
   return {key:'reedwatch-locker',name:'A Dated Field Note',kind:'Route Record',text:'Inside the swollen locker, beneath a wrap of oilcloth, you find a rain-blurred field note. Its date falls two days after Greyfen logged the flood’s retreat, and the sketch already shows the newer cut pointing toward the reed bed. The signature has run to ink.',action:'Recover the field note',icon:'▣',short:'Field note',x:25,y:52};
  }
 }
 if(index===5){
  const pl=p();
  if(pl?.flags?.bellRoadSearched){
   return {key:'greyfen-marker',name:'The Greyfen Boundary Stone',kind:'Regional Clue',text:'The same bell-mark from Blackroot appears beneath a newer cut. That later groove points toward the reed bed, away from the raised line.',action:'Compare the marks with your Blackroot notes',icon:'⚑',short:'Boundary',x:78,y:48};
  }
 }
 if(index===1){
  const pl=p(),route=pl?ensure(pl).routeChoice:null;
  if(route==='ridge'){
   const prior=pl?.flags?.highRidgeCairnOutcome||pl?.flags?.sideContracts?.movedCairn?.decision;
   const cairnText=prior==='restore'
    ?'The cairn sits in the older groove you restored. A fresh scrape still shows where the stone was moved; the tracks now bend toward firmer ground.'
    :prior==='record'
     ?'Chalk marks preserve both positions of the shifted stone. Two sets of cart tracks pass without agreeing on the same line.'
     :prior==='warn'
      ?'A strip of cloth marks the shifted stone as unsafe. Travelers are keeping their distance, but the original alignment remains unresolved.'
      :'A stack of old stones marks a dry line above the floodwater. One stone sits outside a weathered groove, and cart tracks turn toward the lower ground. Someone has tucked road herbs behind the cairn.';
   const cairnAction=prior?'Examine the cairn and trail marks':'Collect the trail herbs';
   return {key:'ridge-cairn',name:'The Ridgeway Cairn',kind:'Trail Clue',text:cairnText,action:cairnAction,icon:'⌖',short:'Cairn',x:76,y:48};
  }
  if(route==='reeds')return {key:'marsh-watcher-tracks',name:'Tracks Beneath the Blue Light',kind:'Danger Sign',text:'The blue glow has gone dark. Long, narrow tracks circle your own bootprints, and a torn herb pouch lies in the mud.',action:'Recover the dropped herbs',icon:'✧',short:'Tracks',x:76,y:48};
 }
 return point;
}
function pointOfInterestPanel(pl,s,stage){
 const point=pointOfInterest(stage);
 if(s.poiUsed&&s.poiUsed[point.key])return '';
 if(visibleDiscoveryStage!==Number(stage))return '';
 return '<section class="exp100-poi exp100-discovery-beat"><div class="exp100-poi-icon">'+esc(point.icon)+'</div><div class="exp100-poi-copy"><span>YOU NOTICE SOMETHING · '+esc(point.kind)+'</span><strong>'+esc(point.name)+'</strong><p>'+esc(point.text)+'</p><button class="exp100-poi-action" id="poiInspect">'+esc(point.action)+'</button><button class="exp100-poi-dismiss" id="poiLeave">Leave it</button></div></section>';
}
function routeChoicePanel(s,stage){
 if(stage!==0)return '';
 if(s.routeChoice){const chosen=s.routeChoice==='ridge'?'High Ridge':'Reed Cut';return '<section class="exp100-poi exp100-poi-done"><div class="exp100-poi-icon">↗</div><div class="exp100-poi-copy"><span>ROUTE DECISION · RECORDED</span><strong>'+chosen+'</strong><p>Your choice has shaped this expedition. The other track disappears into the mist behind you.</p></div></section>';}
 return '<section class="exp100-panel exp100-route-choice"><div class="exp100-kicker">THE ROAD FORKS</div><h2>Two ways through the lowlands</h2><p>The High Ridge looks longer but firm underfoot. The Reed Cut is shorter, though a cold blue glimmer moves between the reeds.</p><div class="exp100-choices"><button class="exp100-choice" id="routeRidge"><strong>Take the High Ridge</strong><span>Keep to firmer ground and avoid drawing attention.</span><em>Safer · Road Pressure −8</em></button><button class="exp100-choice" id="routeReeds"><strong>Risk the Reed Cut</strong><span>Follow the strange light and search for what it is guarding.</span><em>Riskier · Gain 1 Bell Fragment, Road Pressure +10</em></button></div></section>';
 }
function movedCairnDecisionPanel(pl,s,stage){
 const contract=pl?.flags?.sideContracts?.movedCairn;
 if(stage!==1||s.routeChoice!=='ridge'||!contract||contract.complete||contract.decision||!s.poiUsed?.['ridge-cairn'])return '';
 return '<section class="exp100-panel exp100-moved-cairn"><div class="exp100-kicker">SIDE STORY · THE MOVED CAIRN</div><h2>One stone sits wrong</h2><p>The cairn looks ordinary until you notice the fresh split face set beyond an older groove. Cart tracks turn toward softer ground below. Oric asked you to report the danger, but the safest next step is yours to choose.</p><div class="exp100-choices"><button type="button" class="exp100-choice" data-moved-cairn="restore"><strong>Restore the older alignment</strong><span>Set the stone back into its weathered groove. The repair will be visible, but you cannot know why it was moved.</span><em>Act now · leave a fresh trace</em></button><button type="button" class="exp100-choice" data-moved-cairn="record"><strong>Record both positions</strong><span>Sketch the old groove and the current stone before leaving it untouched. Preserve the evidence for Mara and Oric.</span><em>Preserve evidence · leave the site unchanged</em></button><button type="button" class="exp100-choice" data-moved-cairn="warn"><strong>Mark the hazard and step back</strong><span>Warn the next travelers without shifting the stone. The route remains uncertain until someone can inspect it properly.</span><em>Prioritize caution · defer the repair</em></button></div></section>';
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
 let foundGreyfenFieldNote=false,foundGreyfenWeeklyReturn=false;
 if(point.key==='blackroot-mark'){
  pl.flags=pl.flags||{};
  pl.flags.bellRoadSearched=true;
  pl.memories=Array.isArray(pl.memories)?pl.memories:[];
  const memory='At Blackroot Bend, black roots split a stone seal bearing the same bell-mark found near Ashmere. The mark repeats, but its purpose remains unclear.';
  if(!pl.memories.includes(memory))pl.memories.push(memory);
  if(pl.flags.firstRoadReturnMaraBriefed){
   setBellQuestObjective(pl,'Return to Mara with your observation of the bell-marked seal at Blackroot Bend.');
  }
 }else if(point.key==='greyfen-marker'&&pl.flags?.bellRoadSearched&&!pl.flags?.greyfenBoundaryCompared){
  pl.flags=pl.flags||{};
  pl.flags.greyfenBoundaryCompared=true;
  pl.memories=Array.isArray(pl.memories)?pl.memories:[];
  const memory='At the Greyfen Approach, the boundary stone carries the bell-mark seen at Blackroot Bend beneath a newer cut angled toward the reed bed. The mark proves a change in the stone, not who made it.';
  if(!pl.memories.includes(memory))pl.memories.push(memory);
  setBellQuestObjective(pl,'Take the matching boundary mark to Mara in Greyfen’s Boundary Archive.');
 }else if(point.key==='reedwatch-locker'&&pl.flags?.greyfenArchiveRead&&!pl.flags?.greyfenFieldNoteFound){
  foundGreyfenFieldNote=true;
  pl.flags=pl.flags||{};
  pl.flags.greyfenFieldNoteFound=true;
  pl.memories=Array.isArray(pl.memories)?pl.memories:[];
  const memory='At Reedwatch Shelter, you found a field note dated two days after Greyfen logged the flood’s retreat. Its sketch already shows the newer cut angled toward the reed bed; the signature is unreadable.';
  if(!pl.memories.includes(memory))pl.memories.push(memory);
  setBellQuestObjective(pl,'Bring the dated Reedwatch field note to Mara in Greyfen’s Boundary Archive.');
 }else if(point.key==='camp-firepit'&&pl.flags?.greyfenLedgerCompared&&!pl.flags?.greyfenWeeklyReturnFound){
  foundGreyfenWeeklyReturn=true;
  pl.flags=pl.flags||{};
  pl.flags.greyfenWeeklyReturnFound=true;
  pl.memories=Array.isArray(pl.memories)?pl.memories:[];
  const memory='At Wayfarer’s Camp, you found an earlier weekly route return: the lower crossing was marked CLOSED pending inspection, then overwritten as OPEN without initials. The record shows a changed instruction, not who changed it.';
  if(!pl.memories.includes(memory))pl.memories.push(memory);
  setBellQuestObjective(pl,'Bring the earlier weekly route return to Old Brenn in Greyfen’s Bellkeeper’s Ledger.');
 }
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
