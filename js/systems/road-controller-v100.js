// LEGEND v0.20.36 - Active Old Road Expedition Controller
// Mobile-first expedition loop. Meaningful choices replace visible D20 gates.
(() => {
const RT=()=>window.LegendRuntimeV120||{}, ROADS=()=>window.LegendRoadsV100||{}, A=()=>window.LegendAssetsV090||{}, root=()=>document.getElementById('root');
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])), p=()=>RT().loadPlayer?.()||null, save=pl=>RT().savePlayer?.(pl), ret=()=>RT().returnToAshmere?.();
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a, clamp=(n,a,b)=>Math.max(a,Math.min(b,n)), pick=a=>a?.length?a[Math.floor(Math.random()*a.length)]:null;
const road=()=>ROADS().oldRoad||{stages:[],checks:[],finds:[],enemies:[]};
const inv=(pl,k,n)=>{pl.inventory=pl.inventory||{};pl.inventory[k]=Number(pl.inventory[k]||0)+n};

function setBellQuestObjective(pl,objective){
 pl.questLog=Array.isArray(pl.questLog)?pl.questLog:[];
 const prefix='The Bell That Rang Once:';
 const entry=prefix+' '+objective;
 const index=pl.questLog.findIndex(item=>String(item).startsWith(prefix));
 if(index>=0)pl.questLog[index]=entry;else pl.questLog.unshift(entry);
}
const itemName=k=>window.LEGEND_DATA?.itemNames?.[k]||({food:'Rations',camp:'Camp Supplies',roadToken:'Road Tokens',potion:'Healing Potions',fur:'Furs',bellFragment:'Bell Fragments',log:'Logs'}[k]||k);
const score=(pl,skill)=>{const c=window.LEGEND_DATA?.classes?.[pl.className]?.mod||{},o=window.LEGEND_DATA?.origins?.[pl.origin]?.bonus||{},k=window.LEGEND_DATA?.keepsakes?.[pl.keepsake]?.bonus||{},a=pl.creationV094?.bonuses||pl.creationV090?.bonuses||{};return Number(c[skill]||0)+Number(o[skill]||0)+Number(k[skill]||0)+Number(a[skill]||0)};
const weapon=pl=>(window.LEGEND_DATA?.weapons||[]).find(w=>w.id===pl.weapon)||{name:'Hands',min:1,max:3}, armor=pl=>(window.LEGEND_DATA?.armors||[]).find(a=>a.id===pl.armor)||{name:'None',defense:0};
const state=pl=>{pl.flags=pl.flags||{};pl.flags.roadExpeditionV100=pl.flags.roadExpeditionV100||{stage:0,pressure:0,trips:0,events:0,finds:0,battles:0};return pl.flags.roadExpeditionV100};
const ensure=pl=>{const s=state(pl);s.stage=clamp(Number(s.stage||0),0,5);s.pressure=clamp(Number(s.pressure||0),0,100);return s};
const roadDiscovery=window.LegendRoadDiscoveryV100.create({
 getPlayer:p,
 savePlayer:save,
 ensureState:ensure,
 getRoadData:road,
 addInventory:inv,
 escapeHtml:esc,
 clamp,
 setBellQuestObjective,
 renderExpedition,
 tone
});

const hpPct=pl=>clamp(Math.round(Number(pl.hp||0)/Math.max(1,Number(pl.maxHp||1))*100),0,100);
const roadAudio=()=>window.LegendRoadAudioV100||{};
const soundOn=()=>roadAudio().soundOn?.()??true;
function tone(kind='tap'){return roadAudio().tone?.(kind);}
function playBattleFx(kind){return roadAudio().playBattleFx?.(kind);}
function startBattleMusic(){return roadAudio().startBattleMusic?.();}
function stopBattleMusic(){return roadAudio().stopBattleMusic?.();}
const skillLabel=k=>({survival:'Roadsense',strength:'Force',lore:'Lore',luck:'Fortune',thieving:'Guile',craft:'Craft'}[k]||k).toUpperCase();

const roadView=window.LegendRoadViewV100?.create({
 getRoot:root,getPlayer:p,getAssets:A,ensureState:ensure,roadDiscovery,escapeHtml:esc,clamp,
 getRoadAudio:roadAudio,soundOn,tone,hpPercent:hpPct,resolveChoice,finish,areaForStage
});
function scene(stage=0,interactive=true){return roadView?.scene(stage,interactive)||'';}
function shell(body){return roadView?.shell(body);}
function bindHotspotDelegation(){return roadView?.bindHotspotDelegation();}
function header(pl,s,kicker,title,text){return roadView?.header(pl,s,kicker,title,text)||'';}
function start(){stopBattleMusic();roadDiscovery.hide();const pl=p();if(!pl)return;const s=ensure(pl);s.stage=0;s.poiUsed={};s.searchUsed={};s.readUsed={};s.routeChoice=null;const lanternWard=Number(pl.inventory?.wispLanternWick||0)>0;if(lanternWard)pl.inventory.wispLanternWick--;s.pressure=clamp(s.pressure+(lanternWard?3:8),0,100);s.trips=Number(s.trips||0)+1;pl.flags.firstRoadEvent=true;save(pl);renderExpedition(lanternWard?'You light the crafted Wisp Lantern Wick before leaving. Its pale flame steadies your nerves; opening Road Pressure rises by only 3 instead of 8. The wick is spent.':'You leave Ashmere with a clear route and a reason to come back.')}
function areaForStage(stage){
 const index=clamp(Number(stage||0),0,5),areas=road().scenes||[];
 const area={...(areas[index]||{name:'Old Road',type:'Road',text:'The road disappears into the mist.',icon:'↗'})};
 const pl=p(),s=pl?ensure(pl):{};
 if(index===2&&s.routeChoice==='ridge')area.text='The High Ridge drops into a sheltered clearing. Dry kindling and a line of pale stones make this a safer place to rest; the ridge markers continue beyond the firepit.';
 if(index===2&&s.routeChoice==='reeds')area.text='The Reed Cut spills into a sheltered clearing, but wet reeds cling to your boots and long tracks circle the firepit. The blue light is gone; something followed you out.';
 return area;
}
function campActions(pl,s){
  const camp=Number(pl.inventory?.camp||0),food=Number(pl.inventory?.food||0),herb=Number(pl.inventory?.roadHerb||0),cloth=Number(pl.inventory?.clothScrap||0);
  return '<section class="exp100-camp"><div class="exp100-camp-heading"><span>WAYSTATION</span><strong>Make this stop count</strong><small>Resting uses supplies. Crafting turns road finds into something useful.</small></div><div class="exp100-camp-actions"><button class="exp100-choice" id="campRest" '+((camp<1&&food<1)?'disabled':'')+'><strong>Rest by the Fire</strong><span>Recover 20% of maximum health and reduce Road Pressure by 12.</span><em>Cost: 1 Camp Supply or 1 Ration</em></button><button class="exp100-choice" id="campCraft" '+((herb<1||cloth<1)?'disabled':'')+'><strong>Craft a Road Poultice</strong><span>Use 1 Road Herb and 1 Cloth Scrap to make a healing potion.</span><em>Materials: '+herb+' herbs • '+cloth+' cloth</em></button></div></section>';
}
function renderExpedition(note=''){
  const pl=p();if(!pl)return;
  const s=ensure(pl),stage=Math.min(5,s.stage),area=areaForStage(stage),atCamp=!!area.camp;
  const searchDone=!!s.searchUsed?.[stage];
  let choices=stage>=5
    ? '<button class="exp100-dock-action primary" id="finish"><strong>Return to Ashmere</strong><span>Secure what you found.</span></button>'
    : '<button class="exp100-dock-action" id="search" '+(searchDone?'disabled':'')+'><strong>'+(searchDone?'Nothing left to search':'Search the roadside')+'</strong><span>'+(searchDone?'You have searched this stretch':'Look for something useful')+'</span></button><button class="exp100-dock-action primary" id="push"><strong>Travel On</strong><span>Continue toward '+esc(areaForStage(Math.min(5,stage+1)).name)+'</span></button>';
  const roadMood=s.pressure>=55?'A second set of footsteps keeps pace just beyond the lantern light.':s.pressure>=30?'The birds fall silent. Somewhere ahead, a branch snaps.':'The road bends into mist. Somewhere beyond it, a lantern flickers.';
  const sceneText=(stage===2&&s.routeChoice&&note)?note+' '+area.text:(note||area.text||roadMood);
  shell(header(pl,s,'OLD ROAD EXPEDITION',area.name,sceneText)+roadDiscovery.routeChoicePanel(s,stage)+roadDiscovery.pointOfInterestPanel(pl,s,stage)+roadDiscovery.movedCairnDecisionPanel(pl,s,stage)+(atCamp?campActions(pl,s):'')+'<section class="exp100-explore-dock"><div class="exp100-route"><span>BEYOND THE MIST</span><strong>'+esc(areaForStage(Math.min(5,stage+1)).name)+'</strong><small>Follow the road when you are ready.</small></div><div class="exp100-dock-actions">'+choices+'</div><div class="exp100-actions"><button class="exp100-btn" id="town">Abandon expedition</button></div></section>');
  bindHotspotDelegation();
  document.getElementById('poiLeave')?.addEventListener('click',()=>{const pl=p();if(!pl)return;const s=ensure(pl);s.discoveryOpen=false;s.discoveryStage=null;roadDiscovery.hide();save(pl);document.querySelector('.exp100-discovery-beat')?.remove();});
  document.getElementById('poiInspect')?.addEventListener('click',roadDiscovery.inspectPointOfInterest);
  document.querySelectorAll('[data-moved-cairn]').forEach(button=>button.addEventListener('click',()=>roadDiscovery.chooseMovedCairnDecision(button.dataset.movedCairn)));
  document.getElementById('routeRidge')?.addEventListener('click',()=>roadDiscovery.chooseRoadRoute('ridge'));
  document.getElementById('routeReeds')?.addEventListener('click',()=>roadDiscovery.chooseRoadRoute('reeds'));
  document.getElementById('careful')?.addEventListener('click',()=>resolveChoice('careful'));
  document.getElementById('search')?.addEventListener('click',()=>resolveChoice('search'));
  document.getElementById('push')?.addEventListener('click',()=>resolveChoice('push'));
  document.getElementById('finish')?.addEventListener('click',finish);
  document.getElementById('town').onclick=ret;
  document.getElementById('campRest')?.addEventListener('click',()=>{
    const supply=Number(pl.inventory?.camp||0)>0?'camp':'food';
    pl.inventory[supply]=Math.max(0,Number(pl.inventory?.[supply]||0)-1);
    const healed=Math.min(Math.max(0,Number(pl.maxHp||1)-Number(pl.hp||1)),Math.max(1,Math.ceil(Number(pl.maxHp||1)*.2)));
    pl.hp=Number(pl.hp||1)+healed;pl.fatigue=Math.max(0,Number(pl.fatigue||0)-20);
    s.pressure=clamp(s.pressure-12,0,100);pl.day=Number(pl.day||1)+1;
    pl.stats=pl.stats||{};pl.stats.campsMade=Number(pl.stats.campsMade||0)+1;save(pl);
    renderExpedition('You rest at '+area.name+', recover '+healed+' health, and let the road quiet down.');
  });
  document.getElementById('campCraft')?.addEventListener('click',()=>{
    if(Number(pl.inventory?.roadHerb||0)<1||Number(pl.inventory?.clothScrap||0)<1)return;
    pl.inventory.roadHerb--;pl.inventory.clothScrap--;inv(pl,'potion',1);save(pl);
    renderExpedition('You bind a Road Herb into clean cloth and make a healing potion.');
  });
}
const roadActions=window.LegendRoadActionsV100?.create({
 getPlayer:p,
 savePlayer:save,
 ensureState:ensure,
 getRoadData:road,
 getScore:score,
 addInventory:inv,
 pick,
 randomInt:rand,
 clamp,
 itemName,
 skillLabel,
 renderExpedition,
 combat
});
function resolveChoice(kind){return roadActions?.resolveChoice(kind);}
function roadCombatContext(){
 return {
  getPlayer:p,
  savePlayer:save,
  getAssets:A,
  getWeapon:weapon,
  getArmor:armor,
  score,
  ensureState:ensure,
  hpPercent:hpPct,
  escapeHtml:esc,
  clamp,
  randomInt:rand,
  addInventory:inv,
  itemName,
  renderShell:shell,
  renderExpedition,
  outcome,
  soundOn,
  startMusic:startBattleMusic,
  stopMusic:stopBattleMusic,
  playBattleFx,
  tone,
  toggleSound:()=>roadAudio().toggleSound?.(),
  awardProgress:(player,amount)=>window.LegendProgressionV100?.award(player,amount)
 };
}
function combat(enemy,note=''){
 const combatSystem=window.LegendRoadCombatV100;
 if(combatSystem?.start)return combatSystem.start(roadCombatContext(),enemy,note);
 stopBattleMusic();
 return renderExpedition('A road encounter begins, but the combat module did not load. Return to Ashmere and refresh before another attempt.');
}

const roadResults=window.LegendRoadResultsV100?.create({
 getPlayer:p,savePlayer:save,ensureState:ensure,addInventory:inv,clamp,setBellQuestObjective,
 awardProgress:(player,amount)=>window.LegendProgressionV100?.award(player,amount),
 stopMusic:stopBattleMusic,renderHeader:header,renderShell:shell,escapeHtml:esc,getRoot:root,
 returnToTown:()=> {
  const player=p();
  if(player){player.town='Ashmere';save(player);}
  const host=root();
  if(host)host.innerHTML='';
  if(window.LegendAshmereV099?.renderAshmere){
   window.LegendAshmereV099.renderAshmere();
   if(document.querySelector('.ash100-town'))return;
  }
  ret();
 },
 returnToAshmere:ret
});
function finish(){return roadResults?.finish();}
function outcome(title,text,kicker,skill,modifier){return roadResults?.outcome(title,text,kicker,skill,modifier);}
window.LegendRoadControllerV100={start,renderHub:renderExpedition,renderExpedition};
})();