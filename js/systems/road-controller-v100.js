// LEGEND v0.10.0 - Old Road Expedition Controller
// Mobile-first expedition loop. Meaningful choices replace visible D20 gates.
(() => {
const RT=()=>window.LegendRuntimeV080||{}, ROADS=()=>window.LegendRoadsV087||{}, A=()=>window.LegendAssetsV090||{}, root=()=>document.getElementById('root');
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])), p=()=>RT().loadPlayer?.()||null, save=pl=>RT().savePlayer?.(pl), ret=()=>RT().returnToAshmere?.();
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a, clamp=(n,a,b)=>Math.max(a,Math.min(b,n)), pick=a=>a?.length?a[Math.floor(Math.random()*a.length)]:null;
const road=()=>ROADS().oldRoad||{stages:[],checks:[],finds:[],enemies:[]};
const inv=(pl,k,n)=>{pl.inventory=pl.inventory||{};pl.inventory[k]=Number(pl.inventory[k]||0)+n};
const itemName=k=>window.LEGEND_DATA?.itemNames?.[k]||({food:'Rations',camp:'Camp Supplies',roadToken:'Road Tokens',potion:'Healing Potions',fur:'Furs',bellFragment:'Bell Fragments',log:'Logs'}[k]||k);
const score=(pl,skill)=>{const c=window.LEGEND_DATA?.classes?.[pl.className]?.mod||{},o=window.LEGEND_DATA?.origins?.[pl.origin]?.bonus||{},k=window.LEGEND_DATA?.keepsakes?.[pl.keepsake]?.bonus||{},a=pl.creationV090?.bonuses||{};return Number(c[skill]||0)+Number(o[skill]||0)+Number(k[skill]||0)+Number(a[skill]||0)};
const weapon=pl=>(window.LEGEND_DATA?.weapons||[]).find(w=>w.id===pl.weapon)||{name:'Hands',min:1,max:3}, armor=pl=>(window.LEGEND_DATA?.armors||[]).find(a=>a.id===pl.armor)||{name:'None',defense:0};
const state=pl=>{pl.flags=pl.flags||{};pl.flags.roadExpeditionV100=pl.flags.roadExpeditionV100||{stage:0,pressure:0,trips:0,events:0,finds:0,battles:0};return pl.flags.roadExpeditionV100};
const ensure=pl=>{const s=state(pl);s.stage=clamp(Number(s.stage||0),0,5);s.pressure=clamp(Number(s.pressure||0),0,100);return s};
const hpPct=pl=>clamp(Math.round(Number(pl.hp||0)/Math.max(1,Number(pl.maxHp||1))*100),0,100);
const soundOn=()=>{try{return localStorage.getItem('legend-road-sound')!=='off'}catch(e){return true}};
function tone(kind='tap'){
 if(!soundOn())return;
 try{
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  const ctx=new C(),osc=ctx.createOscillator(),gain=ctx.createGain(),now=ctx.currentTime;
  const impact=kind==='impact';osc.type=impact?'sawtooth':'triangle';
  osc.frequency.setValueAtTime(impact?145:520,now);
  osc.frequency.exponentialRampToValueAtTime(impact?68:kind==='success'?780:390,now+(impact?.13:.07));
  gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(impact?.075:.025,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+(impact?.15:.085));
  osc.connect(gain);gain.connect(ctx.destination);osc.start(now);osc.stop(now+(impact?.16:.09));
  osc.onended=()=>ctx.close();
 }catch(e){}
}
const skillLabel=k=>({survival:'Roadsense',strength:'Force',lore:'Lore',luck:'Fortune',thieving:'Guile',craft:'Craft'}[k]||k).toUpperCase();
function scene(stage=0,interactive=true){
 const path=A().locations?.oldRoadScene||'assets/locations/roads/old_road_exploration_v1.svg';
 const point=pointOfInterest(stage),stageNum=clamp(Number(stage||0),0,5),pl=p(),s=pl?ensure(pl):{};
 const stageClass='exp100-stage-'+stageNum;
 const searched=!!s.searchUsed?.[stageNum],poiDone=!!s.poiUsed?.[point.key];
 const hotspots=interactive
  ? '<div class="exp100-hotspots" aria-label="Explore the road"><button class="exp100-hotspot exp100-hotspot-find '+(poiDone?'is-done':'')+'" data-hotspot="poi" '+(poiDone?'disabled':'')+' style="--hx:'+point.x+'%;--hy:'+point.y+'%"><i>'+(poiDone?'✓':esc(point.icon))+'</i><span>'+(poiDone?'Investigated':esc(point.short))+'</span></button>'+(stageNum<5?'<button class="exp100-hotspot exp100-hotspot-tracks '+(searched?'is-done':'')+'" data-hotspot="search" '+(searched?'disabled':'')+' style="--hx:38%;--hy:72%"><i>'+(searched?'✓':'⌕')+'</i><span>'+(searched?'Searched':'Search')+'</span></button><button class="exp100-hotspot exp100-hotspot-road" data-hotspot="move" style="--hx:70%;--hy:68%"><i>➜</i><span>Travel</span></button>':'<button class="exp100-hotspot exp100-hotspot-road" data-hotspot="finish" style="--hx:70%;--hy:68%"><i>⚑</i><span>Return</span></button>')+'</div>'
  : '<div class="exp100-hotspots" aria-hidden="true"></div>';
 return '<div class="exp100-scene exp100-scene-live '+stageClass+'" data-stage="'+clamp(Number(stage||0),0,5)+'"><img src="'+esc(path)+'" alt="The Old Road winding through misty woodland"><div class="exp100-scene-shade"></div>'+hotspots+'<span class="exp100-scene-label">THE OLD ROAD <i>•</i> '+esc(areaForStage(stage).name.toUpperCase())+'</span><button class="exp100-sound" id="exp100-sound" type="button" aria-label="Toggle sound effects">Sound: '+(soundOn()?'On':'Off')+'</button></div>';
}
function shell(body){
 const host=root(),current=host.querySelector('.exp100-wrap');
 if(current){
  const holder=document.createElement('div');holder.innerHTML=body;
  const nextScene=holder.querySelector('.exp100-scene');
  const liveScene=current.querySelector(':scope > .exp100-scene');
  if(nextScene&&liveScene){
   const nextHotspots=nextScene.querySelector('.exp100-hotspots');
   const liveHotspots=liveScene.querySelector('.exp100-hotspots');
   if(nextHotspots&&liveHotspots)liveHotspots.innerHTML=nextHotspots.innerHTML;
   liveScene.className=nextScene.className;
   liveScene.dataset.stage=nextScene.dataset.stage||'0';
   const nextLabel=nextScene.querySelector('.exp100-scene-label'),liveLabel=liveScene.querySelector('.exp100-scene-label');
   if(nextLabel&&liveLabel)liveLabel.innerHTML=nextLabel.innerHTML;
   nextScene.remove();
   current.querySelectorAll(':scope > :not(.exp100-scene)').forEach(el=>el.remove());
   current.append(...holder.childNodes);
  }else host.innerHTML='<main class="exp100"><div class="exp100-wrap">'+body+'</div></main>';
 }else host.innerHTML='<main class="exp100"><div class="exp100-wrap">'+body+'</div></main>';
 host.querySelectorAll('.exp100 button').forEach(btn=>{
  if(btn.id==='exp100-sound'||btn.dataset.soundBound)return;
  btn.dataset.soundBound='1';
  btn.addEventListener('click',()=>tone(['strike','heavy','skill'].includes(btn.id)?'impact':'tap'));
 });
 const soundButton=document.getElementById('exp100-sound');
 if(soundButton&&!soundButton.dataset.toggleBound){
  soundButton.dataset.toggleBound='1';
  soundButton.addEventListener('click',e=>{
   try{localStorage.setItem('legend-road-sound',soundOn()?'off':'on')}catch(err){}
   e.currentTarget.textContent='Sound: '+(soundOn()?'On':'Off');
   e.currentTarget.setAttribute('aria-label','Toggle sound effects');
   if(soundOn())tone('success');
  });
 }
}
function header(pl,s,kicker,title,text){const stage=Math.min(5,Number(s.stage||0)),pressure=Number(s.pressure||0);return scene(stage,kicker!=='ROAD ENCOUNTER')+'<section class="exp100-head"><div class="exp100-kicker">'+esc(kicker)+'</div><h1>'+esc(title)+'</h1><p>'+esc(text)+'</p><div class="exp100-bars"><div><span>Expedition</span><strong>'+stage+'/5</strong><i><b style="width:'+stage*20+'%"></b></i></div><div><span>Road Pressure</span><strong>'+pressure+'%</strong><i><b style="width:'+pressure+'%"></b></i></div><div><span>Health</span><strong>'+Number(pl.hp||0)+'/'+Number(pl.maxHp||0)+'</strong><i><b style="width:'+hpPct(pl)+'%"></b></i></div></div></section>'}
function stats(pl){return '<section class="exp100-stats"><div><strong>'+Number(pl.inventory?.food||0)+'</strong><span>Rations</span></div><div><strong>'+Number(pl.inventory?.camp||0)+'</strong><span>Camp</span></div><div><strong>'+Number(pl.inventory?.roadToken||0)+'</strong><span>Tokens</span></div><div><strong>'+Number(pl.gold||0)+'g</strong><span>Gold</span></div></section>'}
function start(){const pl=p();if(!pl)return;const s=ensure(pl);s.stage=0;s.poiUsed={};s.searchUsed={};s.readUsed={};s.pressure=clamp(s.pressure+8,0,100);s.trips=Number(s.trips||0)+1;pl.flags.firstRoadEvent=true;save(pl);renderExpedition('You leave Ashmere with a clear route and a reason to come back.')}
function areaForStage(stage){
  const areas=[
    {name:'South Fork',type:'Crossroads',text:'Two muddy tracks leave Ashmere behind. The lanterns are still visible, but the road is already asking you to choose carefully.',icon:'↗'},
    {name:'Lantern Ditch',type:'Roadside Hazard',text:'A low ditch cuts across the old stone road. Cart tracks vanish into the reeds and something glimmers in the mud.',icon:'⌁'},
    {name:"Wayfarer's Camp",type:'Rest & Craft',text:'A sheltered clearing sits just off the road. Old firewood is stacked beneath a canvas lean-to; someone planned to return.',icon:'⌂',camp:true},
    {name:'Blackroot Bend',type:'Dangerous Crossing',text:'Black roots buckle the road and the trees crowd close. The air is damp, and the next mile feels watched.',icon:'✦'},
    {name:'Reedwatch Shelter',type:'Rest & Craft',text:'An abandoned watch shelter overlooks the lowlands. Its roof holds, its hearth can be lit, and its worktable is still usable.',icon:'⌂',camp:true},
    {name:'Greyfen Approach',type:'Regional Threshold',text:'The road slopes toward Greyfen. Beyond the last marker, reeds and drowned stone stretch into the mist.',icon:'⚑'}
  ];
  return areas[clamp(Number(stage||0),0,5)];
}
function pointOfInterest(stage){
 const points=[
  {key:'fork-marker',name:'The Split Milestone',kind:'Trail Clue',text:'Fresh cart tracks split around a toppled mile-marker. One set avoids the flooded ground.',action:'Read the tracks',icon:'⌖',short:'Milestone',x:26,y:48},
  {key:'ditch-lantern',name:'A Lantern in the Reeds',kind:'Strange Find',text:'A cold blue glow flickers beneath the ditch grass. It might be a lost charm—or bait.',action:'Investigate the glow',icon:'✧',short:'Lantern',x:76,y:48},
  {key:'camp-firepit',name:'The Abandoned Firepit',kind:'Useful Supplies',text:'Under the ash you spot a dry tinder bundle and a few scraps left by the last travelers.',action:'Salvage the firepit',icon:'♨',short:'Firepit',x:28,y:57},
  {key:'blackroot-mark',name:'Roots Around an Old Seal',kind:'Old Road Mystery',text:'The black roots have split a stone seal bearing the same bell-mark found near Ashmere.',action:'Study the seal',icon:'✦',short:'Old seal',x:78,y:53},
  {key:'reedwatch-locker',name:'The Shelter Locker',kind:'Forgotten Stores',text:'A swollen wooden locker sits beneath a shelter bench, held shut by a rusted catch.',action:'Open the locker',icon:'▣',short:'Locker',x:25,y:52},
  {key:'greyfen-marker',name:'The Greyfen Boundary Stone',kind:'Regional Clue',text:'The boundary stone is scored with route marks. A few fresh scratches point beyond the reeds.',action:'Record the route marks',icon:'⚑',short:'Boundary',x:78,y:48}
 ];
 return points[clamp(Number(stage||0),0,5)];
}
function pointOfInterestPanel(pl,s,stage){
 const point=pointOfInterest(stage);
 if(s.poiUsed&&s.poiUsed[point.key])return '<section class="exp100-poi exp100-poi-done"><div class="exp100-poi-icon">✓</div><div class="exp100-poi-copy"><span>POINT OF INTEREST · INVESTIGATED</span><strong>'+esc(point.name)+'</strong><p>You have already taken what you can from this spot on this expedition.</p></div></section>';
 return '<section class="exp100-poi"><div class="exp100-poi-icon">'+esc(point.icon)+'</div><div class="exp100-poi-copy"><span>POINT OF INTEREST · '+esc(point.kind)+'</span><strong>'+esc(point.name)+'</strong><p>'+esc(point.text)+'</p><button class="exp100-poi-action" id="poiInspect">'+esc(point.action)+'</button></div></section>';
}
function inspectPointOfInterest(){
 const pl=p();if(!pl)return;const s=ensure(pl),stage=clamp(Number(s.stage||0),0,5),point=pointOfInterest(stage);
 s.poiUsed=s.poiUsed||{};
 if(s.poiUsed[point.key])return renderExpedition('You have already investigated this spot on the current expedition.');
 s.poiUsed[point.key]=true;
 let note='',reward='';
 if(stage===0){pl.gold=Number(pl.gold||0)+5;s.pressure=clamp(s.pressure-4,0,100);note='You follow the drier tracks and find a small coin purse caught beneath the marker. +5 gold; Road Pressure falls by 4.';}
 else if(stage===1){inv(pl,'bellFragment',1);s.pressure=clamp(s.pressure+2,0,100);note='The blue glow fades into a Bell Fragment in your palm. The ditch feels less quiet now. +1 Bell Fragment.';}
 else if(stage===2){inv(pl,'food',1);inv(pl,'roadHerb',1);note='You recover a sealed ration and a usable Road Herb from the cold ashes. +1 Ration, +1 Road Herb.';}
 else if(stage===3){s.pressure=clamp(s.pressure-8,0,100);inv(pl,'bellFragment',1);note='The seal’s pattern matches an old Ashmere mark. You take a Bell Fragment and learn a safer way around the roots. +1 Bell Fragment; Road Pressure falls by 8.';}
 else if(stage===4){inv(pl,'clothScrap',1);inv(pl,'roadHerb',1);note='The locker gives way. Inside are clean cloth strips and a bundle of preserved herbs. +1 Cloth Scrap, +1 Road Herb.';}
 else {pl.gold=Number(pl.gold||0)+10;s.pressure=clamp(s.pressure-5,0,100);pl.flags=pl.flags||{};pl.flags.greyfenRouteRecorded=true;note='You copy the scratched route marks into your journal. The safer line is recorded, and you find 10 gold wedged behind the stone.';}
 pl.stats=pl.stats||{};pl.stats.pointsOfInterest=Number(pl.stats.pointsOfInterest||0)+1;save(pl);
 tone('success');renderExpedition(note);
}
function campActions(pl,s){
  const camp=Number(pl.inventory?.camp||0),food=Number(pl.inventory?.food||0),herb=Number(pl.inventory?.roadHerb||0),cloth=Number(pl.inventory?.clothScrap||0);
  return '<section class="exp100-camp"><div class="exp100-camp-heading"><span>WAYSTATION</span><strong>Make this stop count</strong><small>Resting uses supplies. Crafting turns road finds into something useful.</small></div><div class="exp100-camp-actions"><button class="exp100-choice" id="campRest" '+((camp<1&&food<1)?'disabled':'')+'><strong>Rest by the Fire</strong><span>Recover 20% of maximum health and reduce Road Pressure by 12.</span><em>Cost: 1 Camp Supply or 1 Ration</em></button><button class="exp100-choice" id="campCraft" '+((herb<1||cloth<1)?'disabled':'')+'><strong>Craft a Road Poultice</strong><span>Use 1 Road Herb and 1 Cloth Scrap to make a healing potion.</span><em>Materials: '+herb+' herbs • '+cloth+' cloth</em></button></div></section>';
}
function renderExpedition(note=''){
  const pl=p();if(!pl)return;
  const s=ensure(pl),stage=Math.min(5,s.stage),area=areaForStage(stage),atCamp=!!area.camp;
  const readDone=!!s.readUsed?.[stage],searchDone=!!s.searchUsed?.[stage];
  let choices=stage>=5
    ? '<button class="exp100-dock-action primary" id="finish"><strong>Secure Expedition</strong><span>Bank your finds and return to Ashmere.</span></button>'
    : '<button class="exp100-dock-action" id="careful" '+(readDone?'disabled':'')+'><strong>'+(readDone?'Road Read':'Read the Road')+'</strong><span>'+(readDone?'Already studied here':'Reduce pressure')+'</span></button><button class="exp100-dock-action" id="search" '+(searchDone?'disabled':'')+'><strong>'+(searchDone?'Searched':'Search Nearby')+'</strong><span>'+(searchDone?'Already searched here':'Look for useful finds')+'</span></button><button class="exp100-dock-action primary" id="push"><strong>Travel On</strong><span>Move toward '+esc(areaForStage(Math.min(5,stage+1)).name)+'</span></button>';
  const areaPanel='<section class="exp100-area"><div class="exp100-area-icon">'+esc(area.icon)+'</div><div class="exp100-area-copy"><span>'+esc(area.type)+'</span><h2>'+esc(area.name)+'</h2><p>'+esc(area.text)+'</p></div></section>';
  shell(header(pl,s,'OLD ROAD EXPEDITION',area.name,note||'Explore the scene. Tap a landmark, search the roadside, or travel onward when ready.')+stats(pl)+areaPanel+pointOfInterestPanel(pl,s,stage)+(atCamp?campActions(pl,s):'')+'<section class="exp100-panel exp100-explore-dock"><div class="exp100-route"><span>YOUR NEXT MOVE</span><strong>'+esc(areaForStage(Math.min(5,stage+1)).name)+'</strong><small>Explore freely before moving on</small></div><div class="exp100-dock-actions">'+choices+'</div><div class="exp100-actions"><button class="exp100-btn" id="town">Return to Ashmere</button></div></section>');
  document.querySelectorAll('.exp100-hotspot').forEach(btn=>btn.addEventListener('click',()=>{
   const action=btn.dataset.hotspot;
   if(action==='poi')return inspectPointOfInterest();
   if(action==='search')return resolveChoice('search');
   if(action==='move')return resolveChoice('push');
   if(action==='finish')return finish();
  }));
  document.getElementById('poiInspect')?.addEventListener('click',inspectPointOfInterest);
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
function resolveChoice(kind){
 const pl=p();if(!pl)return;const s=ensure(pl),stageBefore=s.stage,area=areaForStage(stageBefore);
 s.events=Number(s.events||0)+1;
 if(kind==='careful'){
   s.readUsed=s.readUsed||{};
   if(s.readUsed[s.stage])return renderExpedition('You have already studied this stretch of road.');
   s.readUsed[s.stage]=true;
   const roadSense=score(pl,'survival')+score(pl,'lore');
   const reduction=10+Math.max(0,roadSense);
   s.pressure=clamp(s.pressure-reduction,0,100);save(pl);
   return renderExpedition('You study the ground around '+areaForStage(s.stage).name+'. Road Pressure falls by '+reduction+'.'+(roadSense>=2?' Your road sense reveals a dry crossing and a useful trail marker.':''));
 }
 if(kind==='search'){
   s.searchUsed=s.searchUsed||{};
   if(s.searchUsed[s.stage])return renderExpedition('You have already searched this stretch of road.');
   s.searchUsed[s.stage]=true;
   const f=pick(road().finds)||{title:'Roadside Cache',text:'Something useful was left behind.',item:'food',amount:1};
   const aptitude=score(pl,'survival')+score(pl,'lore')+score(pl,'luck');
   const amount=Number(f.amount||1)+(aptitude>=4?1:0);
   inv(pl,f.item,amount);s.finds=Number(s.finds||0)+1;
   s.pressure=clamp(s.pressure+(aptitude>=3?1:5),0,100);
   pl.stats=pl.stats||{};pl.stats.resourcesFound=Number(pl.stats.resourcesFound||0)+1;save(pl);
   return renderExpedition(f.title+': '+f.text+' You recover '+itemName(f.item)+' ×'+amount+'. You can keep exploring here or travel onward.');
 }
 s.pressure=clamp(s.pressure+12,0,100);
 if(s.pressure>=65){save(pl);return battleEvent()}
 const roadSense=score(pl,'survival')+score(pl,'strength');
 s.stage=clamp(s.stage+1,0,5);
 if(roadSense<0){const loss=Math.min(Math.max(0,Number(pl.hp||1)-1),3);pl.hp=Number(pl.hp||1)-loss;s.pressure=clamp(s.pressure+5,0,100);save(pl);return renderExpedition('You force the pace through '+area.name+'. The shortcut costs '+loss+' health, but you reach the next marker.')}
 save(pl);return renderExpedition('You keep moving through '+area.name+'. The next stretch comes into view before the road can close around you.');
}
function eventCheck(skill,bonus){
 const pl=p();if(!pl)return;const s=ensure(pl),ev=pick(road().checks)||{title:'A Strange Silence',text:'The road goes quiet around you.',skill:'survival',success:'You keep your footing.',fail:'The silence costs time and nerves.'};
 const actual=ev.skill||skill,modifier=score(pl,actual)+Number(bonus||0),success=modifier>=0;
 s.stage=clamp(s.stage+1,0,5);
 if(success){s.pressure=clamp(s.pressure-4,0,100);pl.stats=pl.stats||{};pl.stats.checksPassed=Number(pl.stats.checksPassed||0)+1;save(pl);return renderExpedition(ev.success+' Your '+skillLabel(actual).toLowerCase()+' helps you make steady progress.')}
 const loss=Math.min(Math.max(0,Number(pl.hp||1)-1),3+Math.max(0,-modifier));pl.hp=Number(pl.hp||1)-loss;s.pressure=clamp(s.pressure+5,0,100);pl.stats=pl.stats||{};pl.stats.checksFailed=Number(pl.stats.checksFailed||0)+1;save(pl);return renderExpedition(ev.fail+' You lose '+loss+' HP, but keep moving.');
}
function findEvent(){
 const pl=p();if(!pl)return;const s=ensure(pl),f=pick(road().finds)||{title:'Roadside Cache',text:'Something useful was left behind.',item:'food',amount:1};
 const aptitude=score(pl,'survival')+score(pl,'lore')+score(pl,'luck'),amount=Number(f.amount||1)+(aptitude>=4?1:0);
 inv(pl,f.item,amount);s.finds=Number(s.finds||0)+1;s.stage=clamp(s.stage+1,0,5);s.pressure=clamp(s.pressure+2,0,100);
 pl.stats=pl.stats||{};pl.stats.resourcesFound=Number(pl.stats.resourcesFound||0)+1;save(pl);
 return renderExpedition(f.title+': '+f.text+' You recover '+itemName(f.item)+' ×'+amount+'.');
}
function battleEvent(){
 const pl=p();if(!pl)return;const s=ensure(pl),base=pick(road().enemies);if(!base)return eventCheck('survival',2);
 const enemy={...base,hp:rand(base.hp?.[0]||20,base.hp?.[1]||35)};enemy.maxHp=enemy.hp;enemy.intent='attack';
 s.battles=Number(s.battles||0)+1;save(pl);combat(enemy);
}
function enemyIntent(enemy){
 const n=Number(enemy.turn||0)%3;
 return n===0?'heavy':n===1?'attack':'guardbreak';
}
function combat(enemy,note=''){
 const pl=p();if(!pl)return;const s=ensure(pl),w=weapon(pl),a=armor(pl);
 enemy.turn=Number(enemy.turn||0);enemy.intent=enemy.intent||enemyIntent(enemy);
 const intentText=enemy.intent==='heavy'?'Winding up a heavy attack':enemy.intent==='guardbreak'?'Preparing to break your guard':'Watching for an opening';
 const art=A().byName?.(enemy.name)||'';
 shell(header(pl,s,'ROAD ENCOUNTER',enemy.name,enemy.text||'Something blocks the road.')+stats(pl)+
 '<section class="exp100-panel exp100-combat"><div class="exp100-battlefield">'+(art?'<img class="exp100-enemy-art" src="'+esc(art)+'" alt="'+esc(enemy.name)+'" onerror="this.style.display=\'none\'">':'')+
 '<div class="exp100-enemy"><strong>'+esc(enemy.name)+'</strong><span>'+Math.max(0,Number(enemy.hp))+' / '+Number(enemy.maxHp)+' HP</span><i><b style="width:'+clamp(Math.round(enemy.hp/enemy.maxHp*100),0,100)+'%"></b></i><em class="exp100-intent">Enemy intent · '+intentText+'</em></div></div>'+
 '<p class="exp100-combat-note">'+esc(note||'Choose your move. The enemy’s next action is telegraphed so you can answer it.')+'</p><p class="exp100-gear">Weapon: '+esc(w.name)+' · Armor: '+esc(a.name)+' · Potions: '+Number(pl.inventory?.potion||0)+' · Poultices: '+Number(pl.inventory?.roadPoultice||0)+'</p>'+
 '<div class="exp100-choices exp100-battle-actions"><button class="exp100-choice primary" id="strike"><strong>Attack</strong><span>Reliable weapon damage. No hit roll.</span><em>'+Math.max(1,Number(w.min||1)+score(pl,'strength'))+'–'+Math.max(2,Number(w.max||3)+score(pl,'strength'))+' damage</em></button>'+
 '<button class="exp100-choice" id="heavy"><strong>Heavy Strike</strong><span>Commit to a stronger blow; leaves you exposed.</span><em>High damage · takes a hit if enemy survives</em></button>'+
 '<button class="exp100-choice" id="guard"><strong>Guard</strong><span>Brace for the telegraphed attack and reduce its damage.</span><em>Best against heavy attacks</em></button>'+
 '<button class="exp100-choice" id="skill"><strong>'+(pl.className==='Mage'?'Rune Bolt':pl.className==='Ranger'?'Trap Shot':pl.className==='Warrior'?'Cleave':pl.className==='Thief'?'Swipe':'Class Technique')+'</strong><span>Use your class strengths for a focused move.</span><em>Scales with your character</em></button>'+
 '<button class="exp100-choice" id="item" '+(Number(pl.inventory?.potion||0)<1||Number(pl.hp||0)>=Number(pl.maxHp||1)?'disabled':'')+'><strong>Use Healing Potion</strong><span>Restore 30% of maximum health.</span><em>Potions: '+Number(pl.inventory?.potion||0)+'</em></button>'+
 '<button class="exp100-choice" id="poultice" '+(Number(pl.inventory?.roadPoultice||0)<1||Number(pl.hp||0)>=Number(pl.maxHp||1)?'disabled':'')+'><strong>Use Road Poultice</strong><span>Restore 20% of maximum health.</span><em>Poultices: '+Number(pl.inventory?.roadPoultice||0)+'</em></button>'+
 '<button class="exp100-choice" id="flee"><strong>Fall Back</strong><span>Leave the encounter, losing a little progress pressure.</span><em>Retreat</em></button></div></section>');
 document.getElementById('strike').onclick=()=>combatAction(enemy,'attack');
 document.getElementById('heavy').onclick=()=>combatAction(enemy,'heavy');
 document.getElementById('guard').onclick=()=>combatAction(enemy,'guard');
 document.getElementById('skill').onclick=()=>combatAction(enemy,'skill');
 document.getElementById('item').onclick=()=>combatAction(enemy,'item');
 document.getElementById('poultice').onclick=()=>combatAction(enemy,'poultice');
 document.getElementById('flee').onclick=()=>{s.pressure=clamp(s.pressure-8,0,100);save(pl);renderExpedition('You withdraw from '+enemy.name+' and regroup on the road.');};
}
function combatAction(enemy,action){
 const pl=p();if(!pl)return;const s=ensure(pl),w=weapon(pl),a=armor(pl);
 let note='',guarding=action==='guard';
 if(action==='item'){
   if(Number(pl.inventory?.potion||0)<1)return combat(enemy,'You have no healing potions left.');
   pl.inventory.potion--;const heal=Math.min(Number(pl.maxHp||1)-Number(pl.hp||1),Math.max(1,Math.ceil(Number(pl.maxHp||1)*.3)));pl.hp=Number(pl.hp||1)+heal;note='You use a Healing Potion and recover '+heal+' HP.';
 }else if(action==='poultice'){
   if(Number(pl.inventory?.roadPoultice||0)<1)return combat(enemy,'You have no Road Poultices left.');
   if(Number(pl.hp||0)>=Number(pl.maxHp||1))return combat(enemy,'Your health is already full.');
   pl.inventory.roadPoultice--;const heal=Math.min(Number(pl.maxHp||1)-Number(pl.hp||1),Math.max(1,Math.ceil(Number(pl.maxHp||1)*.2)));pl.hp=Number(pl.hp||1)+heal;note='You apply a Road Poultice and recover '+heal+' HP.';
 }else if(action==='guard'){
   note='You set your stance and brace for the incoming blow.';
 }else{
   let damage=0;
   if(action==='attack')damage=Math.max(1,rand(Number(w.min||1),Number(w.max||3))+score(pl,'strength'));
   if(action==='heavy')damage=Math.max(2,rand(Number(w.min||1),Number(w.max||3))*2+score(pl,'strength')+2);
   if(action==='skill')damage=Math.max(2,rand(Number(w.min||1),Number(w.max||3))+Math.max(1,Number(pl.level||1))+Math.max(0,score(pl,'strength')+score(pl,'magic')+score(pl,'agility')));
   enemy.hp-=damage;note=(action==='heavy'?'Your Heavy Strike lands for ':action==='skill'?'Your class technique hits for ':'Your attack lands for ')+damage+' damage.';
 }
 if(enemy.hp<=0){save(pl);return win(enemy)}
 const base=enemy.damage||[3,7],raw=enemy.intent==='heavy'?Number(base[1]||7)+3:enemy.intent==='guardbreak'?Number(base[0]||3)+2:rand(Number(base[0]||3),Number(base[1]||7));
 const reduction=Math.max(0,Number(a.defense||0))+(guarding?(enemy.intent==='heavy'?8:5):action==='heavy'?0:0);
 const incoming=Math.max(0,raw-reduction);pl.hp=Math.max(0,Number(pl.hp||1)-incoming);
 enemy.turn=Number(enemy.turn||0)+1;enemy.intent=enemyIntent(enemy);
 note+=(guarding?' Your guard absorbs most of the blow.':' '+enemy.name+' hits you for '+incoming+' damage.');
 if(pl.hp<=0){pl.hp=1;s.stage=0;s.poiUsed={};s.pressure=clamp(s.pressure+12,0,100);save(pl);return outcome('Driven Back','The road overwhelms you. You make it back alive, badly wounded, and the expedition is cut short.','Defeat')}
 save(pl);combat(enemy,note);
}
function win(enemy){
 const pl=p();if(!pl)return;const s=ensure(pl);inv(pl,enemy.reward||'fur',1);
 s.stage=clamp(s.stage+1,0,5);s.pressure=clamp(s.pressure-8,0,100);pl.stats=pl.stats||{};pl.stats.monstersDefeated=Number(pl.stats.monstersDefeated||0)+1;
 save(pl);renderExpedition(enemy.name+' defeated. You recover '+itemName(enemy.reward||'fur')+' and continue along the Old Road.');
}
function finish(){const pl=p();if(!pl)return;const s=ensure(pl),complete=s.stage>=5,reward=30+s.stage*20+Math.floor(s.pressure/20)*10;pl.gold=Number(pl.gold||0)+reward;if(complete)inv(pl,'roadToken',1);pl.stats=pl.stats||{};pl.stats.oldRoadClears=Number(pl.stats.oldRoadClears||0)+1;s.stage=0;s.pressure=clamp(Math.floor(s.pressure*.35),0,100);save(pl);outcome('Expedition Secured','You bring the expedition home: '+reward+'g'+(complete?' and a Road Token. The Road Tokens can now open a new region.':'.'),'Return')}
function outcome(title,text,kicker,skill,modifier){
 const pl=p();if(!pl)return;renderExpedition(title+': '+text);
}
window.LegendRoadControllerV100={start,renderHub:renderExpedition,renderExpedition};
})();