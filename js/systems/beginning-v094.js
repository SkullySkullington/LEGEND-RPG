// LEGEND v0.9.x - Beginning, traveler identity, and guided intro layer
(()=>{
  const ROOT=()=>document.getElementById('root');
  const D=()=>window.LEGEND_DATA||{};
  const S=()=>window.LegendStorage||{};
  const state={name:'',gender:null,personality:null,origin:null,className:null,keepsake:null};
  const genderOptions=[
    {id:'woman',label:'Woman',pronouns:'she/her',text:'Ashmere reads you as a woman of the road. Flavor only.'},
    {id:'man',label:'Man',pronouns:'he/him',text:'Ashmere reads you as a man of the road. Flavor only.'},
    {id:'nonbinary',label:'Nonbinary',pronouns:'they/them',text:'Ashmere reads you as neither one thing nor another. Flavor only.'},
    {id:'unspoken',label:'Keep It Unspoken',pronouns:'they/them',text:'Ashmere learns your name first. The rest can stay yours.'}
  ];
  const personalityOptions=[
    {id:'kind',label:'Kind-Hearted',tag:'+1 luck',bonus:{luck:1},text:'You notice fear before weakness.'},
    {id:'grim',label:'Grim Survivor',tag:'+1 survival',bonus:{survival:1},text:'You expect the worst and prepare for it.'},
    {id:'bold',label:'Bold Wanderer',tag:'+1 strength',bonus:{strength:1},text:'You step forward before doubt gets a vote.'},
    {id:'clever',label:'Clever Talker',tag:'+1 lore',bonus:{lore:1},text:'You listen for what people almost say.'},
    {id:'quiet',label:'Quiet Watcher',tag:'+1 thieving',bonus:{thieving:1},text:'You survive by noticing what others miss.'}
  ];
  function esc(s){return String(s==null?'':s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function gender(id){return genderOptions.find(x=>x.id===id)||genderOptions[3];}
  function personality(id){return personalityOptions.find(x=>x.id===id)||personalityOptions[0];}
  function wrap(html){const r=ROOT();if(!r)return;r.innerHTML='<main class="v094-beginning"><div class="v094-beginning-bg" aria-hidden="true"></div><div class="v094-beginning-shell">'+html+'</div></main>';}
  function buttons(back,next,label='Continue'){return '<div class="v094-actions">'+(next?'<button class="v094-btn primary" id="v094Next">'+esc(label)+'</button>':'')+(back?'<button class="v094-btn" id="v094Back">Back</button>':'')+'</div>';}
  function choices(items,key){const stateKey=key==='class'?'className':key;const selected=state[stateKey];return '<div class="v094-choice-grid '+(key==='class'?'v094-class-grid':'')+'">'+items.map(x=>{const active=selected===x.id;const portrait=key==='class'?window.LegendAssetsV090?.classes?.[x.id]:'';return '<button class="v094-choice'+(active?' is-selected':'')+(portrait?' v094-choice-has-art':'')+'" data-'+key+'="'+esc(x.id)+'" aria-pressed="'+active+'">'+(portrait?'<img class="v094-class-art" src="'+esc(portrait)+'" alt="" aria-hidden="true" onerror="this.style.display=\'none\'">':'')+'<strong>'+esc(x.label)+'</strong><span>'+esc(x.text||'')+'</span>'+(x.tag?'<em>'+esc(x.tag)+'</em>':'')+'<small class="v094-choice-prompt">'+(active?'Selected · change any time':'Tap to choose')+'</small></button>';}).join('')+'</div>';}
  function stepProgress(step,label){return '<div class="v094-stepper" aria-label="Character creation progress"><div class="v094-stepper-top"><span>YOUR TRAVELER</span><strong>STEP '+step+' OF 7</strong></div><div class="v094-stepper-track"><i style="width:'+(step/7*100)+'%"></i></div><p>'+esc(label)+'</p></div>';}
  function startCreation(){state.name='';state.gender=null;state.personality=null;state.origin=null;state.className=null;state.keepsake=null;renderName();}
  function renderName(){wrap('<section class="v094-beginning-card"><div class="v094-kicker">Traveler Creation</div>'+stepProgress(1,'Start with the name you want the world to remember.')+'<h1>Who reaches Ashmere?</h1><p>You wake under a dead lantern with road mud on your boots. Give the town a name to remember.</p><div class="v094-field"><label for="v094Name">Traveler Name</label><input id="v094Name" maxlength="24" placeholder="Name, no spaces" value="'+esc(state.name)+'"><p id="v094NameError" role="alert" style="display:none;color:#ffb4a9;margin:8px 0 0"></p></div>'+buttons(true,true,'Choose Identity')+'</section>');document.getElementById('v094Back').onclick=()=>window.LegendGameBootstrap?.title?.();document.getElementById('v094Next').onclick=()=>{const input=document.getElementById('v094Name');const n=input.value.trim();if(!n||/\s/.test(n)){const error=document.getElementById('v094NameError');error.textContent=!n?'Please enter a traveler name.':'Use a name without spaces.';error.style.display='block';input.setAttribute('aria-invalid','true');input.focus();return;}state.name=n;renderGender();};}
  function renderChoiceStep({step,kicker,title,description,items,key,next,back,rerender,nextLabel,progress,scene}){
    const stateKey=key==='class'?'className':key;
    wrap('<section class="v094-beginning-card v094-choice-scene"><div class="v094-kicker">'+esc(kicker)+'</div>'+stepProgress(step,progress)+'<h2>'+esc(title)+'</h2><p>'+esc(description)+'</p><aside class="v094-scene-note"><span>FIELD NOTE · THE OLD ROAD</span><p>'+esc(scene)+'</p></aside>'+choices(items,key)+'<p id="v094ChoiceError" role="alert" class="v094-choice-error" hidden>Please choose an option to continue.</p>'+buttons(true,true,nextLabel)+'</section>');
    document.querySelectorAll('[data-'+key+']').forEach(b=>b.onclick=()=>{state[stateKey]=b.dataset[key];rerender();});
    document.getElementById('v094Back').onclick=back;
    document.getElementById('v094Next').onclick=()=>{if(!state[stateKey]){const e=document.getElementById('v094ChoiceError');e.hidden=false;e.textContent='Choose the option that feels right for your traveler, then continue.';return;}next();};
  }
  function renderGender(){renderChoiceStep({step:2,kicker:'Identity',title:'How does Ashmere know you?',description:'This shapes how your traveler is described, never what you are allowed to become.',items:genderOptions,key:'gender',next:renderPersonality,back:renderName,rerender:renderGender,nextLabel:'Choose Personality',progress:'Decide what the world sees first. You can revisit the details before setting out.',scene:'The gatekeeper lifts a lantern, waiting for a name and a face to match. There is no correct answer—only the one that feels like yours.'});}
  function renderPersonality(){renderChoiceStep({step:3,kicker:'Temperament',title:'What survived with you?',description:'Your instinct gives a small starting bonus and colors the way you meet the world.',items:personalityOptions,key:'personality',next:renderOrigin,back:renderGender,rerender:renderPersonality,nextLabel:'Remember Your Past',progress:'Every survivor has a habit that kept them alive.',scene:'A memory comes back in a flash: a hand reaching out, a door closing, a choice made in the dark. Which instinct did you carry through?' });}
  function renderOrigin(){const items=Object.entries(D().origins||{}).map(([id,d])=>({id,label:id,text:d.text,tag:Object.entries(d.bonus||{}).map(([k,v])=>'+'+v+' '+k).join(', ')}));renderChoiceStep({step:4,kicker:'Origins',title:'Who were you before?',description:'Your past is part of your story, not a cage. Origins can add skills, supplies, or a little coin.',items,key:'origin',next:renderClass,back:renderPersonality,rerender:renderOrigin,nextLabel:'Choose Your Calling',progress:'Before the road found you, you belonged somewhere—or you made your own way.',scene:'Rain runs down the old milestone. For a moment you remember a place, a voice, and the reason you left. What part of that life still travels with you?' });}
  function renderClass(){const items=Object.entries(D().classes||{}).map(([id,d])=>({id,label:id,text:d.desc,tag:'HP '+d.hp+' · '+d.move}));renderChoiceStep({step:5,kicker:'Calling',title:'How do you survive?',description:'Choose the playstyle that sounds fun. Each class begins with its own strengths and a distinct battle technique.',items,key:'class',next:renderKeepsake,back:renderOrigin,rerender:renderClass,nextLabel:'Choose a Keepsake',progress:'You are not choosing your whole future—just the first tool you trust.',scene:'At the edge of the gate, the guard asks what you can do when the road turns cruel. You think of the skill you reach for before fear can answer.' });}
  function renderKeepsake(){const items=Object.entries(D().keepsakes||{}).map(([id,d])=>({id,label:id,text:d.text,tag:Object.entries(d.bonus||{}).map(([k,v])=>'+'+v+' '+k).join(', ')}));renderChoiceStep({step:6,kicker:'Keepsake',title:'What did you refuse to leave behind?',description:'A small object can carry a memory—or give you an edge when the road gets hard.',items,key:'keepsake',next:renderConfirm,back:renderClass,rerender:renderKeepsake,nextLabel:'Review Your Story',progress:'One last piece of your old life remains in your pack.',scene:'Your hand finds something familiar beneath the wet cloth in your pack. For the first time since waking, the fog feels a little less empty.' });}
  function renderConfirm(){const g=gender(state.gender),pers=personality(state.personality);wrap('<section class="v094-beginning-card"><div class="v094-kicker">Your Story So Far</div>'+stepProgress(7,'One last look before your first steps into Ashmere.')+'<h2>'+esc(state.name)+'</h2><p>A '+esc(pers.label.toLowerCase())+' traveler reaches Ashmere. The bell is silent. The gate is open.</p><div class="v094-summary"><div><span>Gender</span><strong>'+esc(g.label)+' ('+esc(g.pronouns)+')</strong></div><div><span>Personality</span><strong>'+esc(pers.label)+'</strong></div><div><span>Origin</span><strong>'+esc(state.origin)+'</strong></div><div><span>Class</span><strong>'+esc(state.className)+'</strong></div><div><span>Keepsake</span><strong>'+esc(state.keepsake)+'</strong></div></div>'+buttons(true,true,'Begin the Road')+'</section>');document.getElementById('v094Back').onclick=renderKeepsake;document.getElementById('v094Next').onclick=createTraveler;}
  function showCreationError(message){
    let error=document.getElementById('v094CreationError');
    if(!error){
      error=document.createElement('p');
      error.id='v094CreationError';
      error.setAttribute('role','alert');
      error.className='v094-choice-error';
      const actions=document.querySelector('.v094-beginning-card .v094-actions');
      if(actions?.parentNode)actions.parentNode.insertBefore(error,actions);
      else return;
    }
    error.textContent=message;
    error.hidden=false;
  }
  function createTraveler(){
    const recordBuilder=window.LegendPlayerRecordV094;
    if(typeof recordBuilder?.create!=='function'){
      showCreationError('Traveler records are unavailable. Refresh before beginning your journey.');
      return;
    }
    const pl=recordBuilder.create({
      data:D(),
      name:state.name,
      gender:gender(state.gender),
      personality:personality(state.personality),
      originId:state.origin,
      classId:state.className,
      keepsakeId:state.keepsake,
      baseSkills:S().baseSkills,
      normalize:S().normalize
    });
    if(!pl){
      showCreationError('Your traveler details are incomplete. Go back and review each choice before continuing.');
      return;
    }
    S().savePlayer?.(pl);
    renderIntro(pl);
  }
  function enterAshmere(pl){const fresh=S().loadPlayer?.()||pl;fresh.flags=fresh.flags||{};fresh.flags.introV094Complete=true;fresh.flags.tutorialStep='people';fresh.town='Ashmere';S().savePlayer?.(fresh);if(window.LegendAshmereV099?.renderAshmere)return window.LegendAshmereV099.renderAshmere();if(window.LegendRuntimeV120?.returnToAshmere)return window.LegendRuntimeV120.returnToAshmere();window.LegendGameBootstrap?.continueGame?.();}
  function renderIntro(pl){wrap('<section class="v094-beginning-card"><div class="v094-kicker">The Road to Ashmere</div><h2>The bell rings once.</h2><div class="v094-intro-lines"><p>You wake beneath a dead lantern with no memory of the last mile.</p><p>Behind you, the Old Road has folded into fog. Ahead, Ashmere burns with tired yellow light.</p><p>A guard sees your face, then the mud on your boots. He does not ask where you came from.</p><p>Inside the gate, three choices matter first: speak to the townsfolk, prepare supplies, and only then test the road.</p></div><div class="v094-summary"><div><span>First Goal</span><strong>Talk in Town Square</strong></div><div><span>Then</span><strong>Prepare at Inn / Shops</strong></div><div><span>Then</span><strong>Travel the Old Road</strong></div></div>'+buttons(false,true,'Enter Ashmere')+'</section>');document.getElementById('v094Next').onclick=()=>enterAshmere(pl);}
  window.LegendBeginningV094={startCreation,renderIntro};
})();