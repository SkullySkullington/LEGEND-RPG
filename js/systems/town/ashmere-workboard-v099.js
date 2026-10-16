/* LEGEND Ashmere work board and job activity.
 * Keeps existing job definitions and reward behavior while isolating the work
 * loop from the general town router. Runtime dependencies are injected.
 */
(() => {
  function render(context) {
    if (!context || typeof context.getPlayer !== 'function' ||
        typeof context.savePlayer !== 'function' || typeof context.screen !== 'function') return;
    const p = () => context.getPlayer();
    const save = player => context.savePlayer(player);
    const { screen, head, locationInterior, esc, gold, itemName } = context;

const workJobs = {
    wood:{title:'Split Firewood',desc:'Split wet ash logs cleanly without sending the axe skidding into the block.',skill:'strength',pay:38,item:'woodScrap',amount:1,verb:'Strike',hint:'Catch the moving marker inside the gold band.',mode:'timing'},
    gate:{title:'Watch the Gate',desc:'Read the lantern signals beyond Oric’s watch line before panic spreads through town.',skill:'survival',pay:42,item:'food',amount:1,mode:'signal',prompt:'A traveler flashes two short lights, pauses, then gives one more. What should the watch report?',choices:[{label:'A coded request for help',grade:'Perfect',feedback:'You recognize Oric’s distress pattern and send the correct reply.'},{label:'A wagon asking for the gate to open',grade:'Good',feedback:'You avoid sounding an alarm, but the signal is misread.'},{label:'An enemy charge; ring the great bell',grade:'Messy',feedback:'The bell draws every guard to the gate for a false alarm.'}]},
    records:{title:'Sort Archive Records',desc:'Find the one ledger entry that matches Mara’s clue instead of filing a false record.',skill:'lore',pay:45,item:'roadHerb',amount:1,mode:'ledger',prompt:'Mara needs a ledger sealed with the old bell mark and dated before the first frost. Which entry fits?',choices:[{label:'Bell seal · Last week’s market tally',grade:'Messy',feedback:'The seal is right, but the date is too recent.'},{label:'Crow seal · Before first frost',grade:'Messy',feedback:'The date fits, but the wrong family kept this ledger.'},{label:'Bell seal · Late autumn, before first frost',grade:'Perfect',feedback:'You match both the seal and the date. Mara finds the page she needs.'}]},
    crates:{title:'Carry Market Crates',desc:'Remember the porter’s safe lifting order and get the whole stack inside without a spill.',skill:'strength',pay:34,item:'camp',amount:1,mode:'sequence',sequence:['BRACE','LIFT','TURN','SET'],actions:['BRACE','LIFT','TURN','SET','DROP']},
    yard:{title:'Clean Stable Yard',desc:'Clear the clogged drain before the next rain pushes muck beneath the stable door.',skill:'luck',pay:30,item:'clothScrap',amount:1,mode:'triage',prompt:'The yard drain is backing up and rain is coming. What do you clear first?',choices:[{label:'Open the main runoff channel',grade:'Perfect',feedback:'Water drains away from the stable before it can flood the bedding.'},{label:'Move the dry straw to higher ground',grade:'Good',feedback:'You save the bedding, though the drain still needs attention.'},{label:'Scrub the decorative railings',grade:'Miss',feedback:'The yard looks better, but the water keeps rising.'}]},
    message:{title:'Run a Message',desc:'Carry sealed instructions across town before the rain ruins the ink.',skill:'survival',pay:46,item:'goblinTrinket',amount:1,mode:'route',prompt:'Rain is turning the streets to rivers. Which route keeps the sealed message dry?',choices:[{label:'Covered arcade behind the bakeries',grade:'Perfect',feedback:'You keep under the awnings and deliver the seal untouched.'},{label:'Market lane, cutting through the crowd',grade:'Good',feedback:'You arrive quickly, but the seal is damp around the edges.'},{label:'Ford the stream by the old mill',grade:'Miss',feedback:'The current soaks the wrapping before you reach the far bank.'}]}
  };
  const greyfenWorkJobs = {
    peat:{title:'Dry Peat Bricks',desc:'Stack fresh-cut peat in the right order beneath the Reedlight awning before the shower.',skill:'strength',pay:40,item:'peatBrick',amount:2,mode:'sequence',sequence:['DRY','PRESS','STACK','COVER'],actions:['DRY','PRESS','STACK','COVER','RUSH']},
    salvage:{title:'Sort a Salvage Basket',desc:'Separate useful metal and cloth from finds lifted off the drowned walk.',skill:'luck',pay:44,item:'ore',amount:1,mode:'triage',prompt:'The basket smells of brackish water. What do you save first before the rust spreads?',choices:[{label:'Dry the iron scraps on clean sacking',grade:'Perfect',feedback:'The metal is saved before the saltwater eats through it.'},{label:'Rinse everything together in the stream',grade:'Miss',feedback:'The fresh water spreads the grit into every seam.'},{label:'Separate cloth from metal, then dry both',grade:'Good',feedback:'You save most of the useful stock, though the finest pieces still need work.'}]},
    markers:{title:'Reset Flood Markers',desc:'Use the keeper’s record to reset the causeway stakes to the correct waterline.',skill:'survival',pay:48,item:'roadHerb',amount:2,mode:'ledger',prompt:'The brass notch marks the last safe tide. The bell post stands east of the drowned stair. Which plan matches the record?',choices:[{label:'Set the east bell post first, then align the brass notch',grade:'Perfect',feedback:'The marker line matches the keeper’s record and the path becomes legible again.'},{label:'Raise every post to the highest mark',grade:'Messy',feedback:'The path looks clear, but the reading is no longer useful.'},{label:'Align the brass notch to the water, ignoring the bell post',grade:'Good',feedback:'The tide mark is close, but the causeway bearing is still wrong.'}]}
  };
  function jobsForCurrentRegion(){return String(p()?.currentRegion||'Ashmere')==='Greyfen'?greyfenWorkJobs:workJobs;}
  function jobModeName(mode){return ({timing:'Timing challenge',signal:'Read the signal',ledger:'Solve the clue',sequence:'Memory sequence',triage:'Worksite decision',route:'Route choice'}[mode]||'Field task');}

  function renderWorkBoard(){
    const greyfen=String(p()?.currentRegion||'Ashmere')==='Greyfen';
    const jobs=jobsForCurrentRegion();
    screen(head(greyfen?'Local Work':'Ashmere Jobs',greyfen?'Bellkeeper’s Hall':'Work Board',greyfen?'Take on lowland work with a mix of memory, judgment, clues, and careful handling.':'Every contract works a little differently: time a strike, decode a signal, solve a ledger clue, remember a work sequence, or choose the right approach.',locationInterior('archive'),'work'),`<div class="ash099-job-board"><div class="ash099-job-board-intro"><span>FIELD CONTRACTS</span><strong>${Object.keys(jobs).length} ways to earn your keep</strong><small>Clean work pays better. Thoughtful choices can earn supplies as well as coin.</small></div><div class="ash099-cards">${Object.entries(jobs).map(([id,j])=>`<button class="ash099-btn ash099-card ash099-job-board-card" data-job-open="${id}"><span class="ash099-job-board-mode">${esc(jobModeName(j.mode))}</span><strong>${j.title}</strong><small>${j.desc}</small><em>${j.pay}g base pay</em></button>`).join('')}</div></div><div id="ashNote" class="ash099-note" style="display:none"></div>`);
    document.querySelectorAll('[data-job-open]').forEach(b=>b.onclick=()=>renderJobActivity(b.dataset.jobOpen));
  }
  function renderJobActivity(id){
    const greyfen=String(p()?.currentRegion||'Ashmere')==='Greyfen';
    const jobs=jobsForCurrentRegion();
    const j=jobs[id]||Object.values(jobs)[0];
    const mode=j.mode||'timing';
    const zoneStart=34+Math.floor(Math.random()*16);
    const zoneWidth=18;
    const choices=['signal','ledger','triage','route'].includes(mode);
    const sequence=Array.isArray(j.sequence)?j.sequence.slice():[];
    let challengeMarkup='';
    if(mode==='timing'){
      challengeMarkup='<section class="ash099-job-challenge ash099-job-timing"><span class="ash099-job-overline">TIMING TEST</span><p>'+esc(j.hint||'Strike when the marker reaches the gold band.')+'</p><div class="ash099-job-track" id="jobTrack"><i class="ash099-job-zone" style="left:'+zoneStart+'%;width:'+zoneWidth+'%"></i><b class="ash099-job-marker" id="jobMarker"></b></div><small>Gold band = clean work · Outside the band = lost time or stock</small></section>';
    }else if(choices){
      challengeMarkup='<section class="ash099-job-challenge ash099-job-choice-challenge"><div class="ash099-job-challenge-heading"><span class="ash099-job-overline">'+esc(jobModeName(mode))+'</span><h2>'+esc(j.prompt||j.desc)+'</h2><p>Read the details, then commit to the response you think is right.</p></div><div class="ash099-job-choice-grid">'+(j.choices||[]).map((choice,i)=>'<button type="button" class="ash099-job-choice" data-job-choice="'+i+'" data-grade="'+esc(choice.grade||'Messy')+'" data-feedback="'+esc(choice.feedback||'You commit to your choice.')+'"><span class="ash099-job-choice-index">'+String(i+1).padStart(2,'0')+'</span><span class="ash099-job-choice-copy"><strong>'+esc(choice.label)+'</strong>'+(choice.detail?'<small>'+esc(choice.detail)+'</small>':'')+'</span><span class="ash099-job-choice-arrow">↗</span></button>').join('')+'</div></section>';
    }else if(mode==='sequence'){
      challengeMarkup='<section class="ash099-job-challenge ash099-job-sequence"><div class="ash099-job-challenge-heading"><span class="ash099-job-overline">MEMORY SEQUENCE</span><h2>Study the order, then repeat it</h2><p>The steps will flash once. Remember the order and choose each action in sequence.</p></div><div class="ash099-sequence-preview" id="jobSequencePreview" aria-live="polite">Ready when you are</div><button class="ash099-btn primary ash099-sequence-start" id="jobStartSequence" type="button">Study the sequence</button><div class="ash099-sequence-actions">'+(j.actions||[]).map((action,i)=>'<button type="button" class="ash099-sequence-action" data-job-sequence="'+esc(action)+'" disabled><span>'+String(i+1).padStart(2,'0')+'</span><strong>'+esc(action)+'</strong></button>').join('')+'</div><p class="ash099-sequence-status" id="jobSequenceStatus">Choose Study the sequence to begin.</p></section>';
    }
    const body='<section class="ash099-job-game ash099-job-mode-'+esc(mode)+'" data-job-mode="'+esc(mode)+'">'+
      '<div class="ash099-job-meta"><span>Skill: '+esc(j.skill.toUpperCase())+'</span><span>Base Pay: '+gold(j.pay)+'</span><span>Bonus: '+esc(itemName(j.item))+' ×'+Number(j.amount||1)+'</span></div>'+
      challengeMarkup+
      (mode==='timing'?'<button class="ash099-btn primary ash099-job-submit" id="jobStrike" type="button">'+esc(j.verb||'Commit')+'</button>':'')+
      '<p class="ash099-note" id="jobResult" style="display:none" aria-live="polite"></p>'+
      (mode==='timing'?'<p class="ash099-note">Keyboard: press Space or Enter to commit the action.</p>':'')+
      '</section>';
    screen(head(greyfen?'Local Work':'Work Board',j.title,j.desc,locationInterior('archive'),'work'),body,'<button class="ash099-btn" id="backJobs">Choose Another Job</button>');
    const marker=document.getElementById('jobMarker');
    const strike=document.getElementById('jobStrike');
    const result=document.getElementById('jobResult');
    let pos=0,dir=1,done=false,timer=null;
    let sequenceIndex=0,sequenceErrors=0,sequenceReady=false;
    const sequenceTimers=[];
    function cleanup(){
      if(timer)clearInterval(timer);
      sequenceTimers.forEach(t=>clearTimeout(t));
      document.removeEventListener('keydown',onKey);
    }
    if(mode==='timing'){
      timer=setInterval(()=>{if(done)return;pos+=dir*2.35;if(pos>=100){pos=100;dir=-1;}if(pos<=0){pos=0;dir=1;}if(marker)marker.style.left=pos+'%';},24);
    }
    function finish(gradeOverride,feedback){
      if(done)return;
      done=true;
      cleanup();
      const center=zoneStart+(zoneWidth/2);
      const dist=Math.abs(pos-center);
      const grade=gradeOverride||(dist<=4?'Perfect':dist<=9?'Good':dist<=17?'Messy':'Miss');
      const mult=grade==='Perfect'?1.45:grade==='Good'?1.12:grade==='Messy'?.72:.38;
      const pay=Math.max(5,Math.round(j.pay*mult));
      const bonusChance=grade==='Perfect'?.95:grade==='Good'?.62:grade==='Messy'?.24:.05;
      const player=p();
      player.flags=player.flags||{};player.inventory=player.inventory||{};player.stats=player.stats||{};
      const progress=context.awardProgress?.(player,grade==='Perfect'?28:grade==='Good'?20:grade==='Messy'?14:10);
      player.flags.ashmereJobs=Number(player.flags.ashmereJobs||0)+1;
      player.flags.ashmereFavor=Number(player.flags.ashmereFavor||0)+(grade==='Perfect'?2:1);
      player.gold=Number(player.gold||0)+pay;
      let bonus='';
      if(Math.random()<bonusChance){player.inventory[j.item]=Number(player.inventory[j.item]||0)+Number(j.amount||1);bonus=' Bonus gained: '+Number(j.amount||1)+' '+itemName(j.item)+'.';}
      if(grade==='Miss'&&Number(player.hp||0)>1){player.hp=Math.max(1,Number(player.hp||0)-1);bonus+=' You lose 1 HP from the rough work.';}
      save(player);
      const xpNote=progress?' XP +'+progress.gained+(progress.levels?' · Level up! You are now level '+progress.level:'')+'.':'';
      if(result){result.style.display='block';result.textContent=grade+'! '+(feedback?feedback+' ':'')+'Earned '+pay+'g.'+bonus+' Local standing increased.'+xpNote;}
      if(strike){strike.disabled=true;strike.textContent='Job Complete';}
      document.querySelectorAll('[data-job-choice],[data-job-sequence],#jobStartSequence').forEach(b=>b.disabled=true);
      // Keep the reward summary visible until the player chooses to leave the activity.
      // An auto-refresh here can erase the result before it is read or asserted by a smoke test.
    }
    if(strike)strike.onclick=()=>finish();
    if(choices){
      document.querySelectorAll('[data-job-choice]').forEach(b=>b.onclick=()=>finish(b.dataset.grade,b.dataset.feedback));
    }
    if(mode==='sequence'){
      const start=document.getElementById('jobStartSequence');
      const preview=document.getElementById('jobSequencePreview');
      const status=document.getElementById('jobSequenceStatus');
      start?.addEventListener('click',()=>{
        if(done)return;
        start.disabled=true;
        let revealIndex=0;
        const reveal=()=>{
          if(done)return;
          if(revealIndex>=sequence.length){
            sequenceReady=true;
            if(preview)preview.textContent='Your turn · repeat all '+sequence.length+' steps';
            if(status)status.textContent='Repeat the sequence from memory.';
            document.querySelectorAll('[data-job-sequence]').forEach(b=>b.disabled=false);
            return;
          }
          if(preview)preview.innerHTML='<span>STEP '+(revealIndex+1)+' / '+sequence.length+'</span><strong>'+esc(sequence[revealIndex])+'</strong>';
          revealIndex++;
          sequenceTimers.push(setTimeout(reveal,670));
        };
        reveal();
      });
      document.querySelectorAll('[data-job-sequence]').forEach(b=>b.addEventListener('click',()=>{
        if(done||!sequenceReady)return;
        if(b.dataset.jobSequence===sequence[sequenceIndex]){
          sequenceIndex++;
          if(status)status.textContent='Correct · '+sequenceIndex+' of '+sequence.length+' steps';
          if(sequenceIndex>=sequence.length)finish(sequenceErrors===0?'Perfect':sequenceErrors===1?'Good':'Messy','You repeated the full handling sequence.');
        }else{
          sequenceErrors++;
          if(status)status.textContent='Out of order. Take a breath and continue from the same step.';
          if(sequenceErrors>=2)finish('Messy','You finish the work, but the sequence costs you time.');
        }
      }));
    }
    const onKey=e=>{if(mode!=='timing'||(e.key!==' '&&e.key!=='Enter'))return;e.preventDefault();document.removeEventListener('keydown',onKey);finish();};
    if(mode==='timing')document.addEventListener('keydown',onKey);
    const backJobs=document.getElementById('backJobs');
    if(backJobs)backJobs.onclick=()=>{done=true;cleanup();renderWorkBoard();};
  }

    renderWorkBoard();
  }

  window.LegendAshmereWorkV099 = Object.freeze({ render });
})();
