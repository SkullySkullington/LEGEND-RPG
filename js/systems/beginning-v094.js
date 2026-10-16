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
  function gender(id){return genderOptions.find(x=>x.id===id)||genderOptions[3];}
  function personality(id){return personalityOptions.find(x=>x.id===id)||personalityOptions[0];}
  function startCreation(){state.name='';state.gender=null;state.personality=null;state.origin=null;state.className=null;state.keepsake=null;renderName();}
  function creationViewUnavailable(){
    const root=ROOT();
    if(root)root.innerHTML='<main class="v094-beginning"><div class="v094-beginning-shell"><section class="v094-beginning-card"><h1>Traveler creation is unavailable</h1><p>The creation view module did not load. Refresh before continuing.</p><button class="v094-btn primary" id="v094ViewBack" type="button">Back to Title</button></section></div></main>';
    root?.querySelector('#v094ViewBack')?.addEventListener('click',()=>window.LegendGameBootstrap?.title?.());
  }
  function renderName(){
    const view=window.LegendPlayerCreationViewV094;
    if(typeof view?.renderName!=='function')return creationViewUnavailable();
    view.renderName({
      root:ROOT(),
      name:state.name,
      onBack:()=>window.LegendGameBootstrap?.title?.(),
      onSubmit:(input,error)=>{
        const n=String(input?.value||'').trim();
        if(!n||/\\s/.test(n)){
          if(error){
            error.textContent=!n?'Please enter a traveler name.':'Use a name without spaces.';
            error.style.display='block';
          }
          input?.setAttribute('aria-invalid','true');
          input?.focus();
          return;
        }
        state.name=n;
        renderGender();
      }
    });
  }
  function renderChoiceStep(options){
    const view=window.LegendPlayerCreationViewV094;
    if(typeof view?.renderChoiceStep!=='function')return creationViewUnavailable();
    const {step,kicker,title,description,items,key,next,back,rerender,nextLabel,progress,scene}=options;
    const stateKey=key==='class'?'className':key;
    view.renderChoiceStep({
      root:ROOT(),
      step,kicker,title,description,items,key,
      selected:state[stateKey],
      classPortraits:window.LegendAssetsV090?.classes||{},
      nextLabel,progress,scene,
      onSelect:value=>{state[stateKey]=value;rerender();},
      onBack:back,
      onNext:next
    });
  }
  function renderGender(){renderChoiceStep({step:2,kicker:'Identity',title:'How does Ashmere know you?',description:'This shapes how your traveler is described, never what you are allowed to become.',items:genderOptions,key:'gender',next:renderPersonality,back:renderName,rerender:renderGender,nextLabel:'Choose Personality',progress:'Decide what the world sees first. You can revisit the details before setting out.',scene:'The gatekeeper lifts a lantern, waiting for a name and a face to match. There is no correct answer—only the one that feels like yours.'});}
  function renderPersonality(){renderChoiceStep({step:3,kicker:'Temperament',title:'What survived with you?',description:'Your instinct gives a small starting bonus and colors the way you meet the world.',items:personalityOptions,key:'personality',next:renderOrigin,back:renderGender,rerender:renderPersonality,nextLabel:'Remember Your Past',progress:'Every survivor has a habit that kept them alive.',scene:'A memory comes back in a flash: a hand reaching out, a door closing, a choice made in the dark. Which instinct did you carry through?' });}
  function renderOrigin(){const items=Object.entries(D().origins||{}).map(([id,d])=>({id,label:id,text:d.text,tag:Object.entries(d.bonus||{}).map(([k,v])=>'+'+v+' '+k).join(', ')}));renderChoiceStep({step:4,kicker:'Origins',title:'Who were you before?',description:'Your past is part of your story, not a cage. Origins can add skills, supplies, or a little coin.',items,key:'origin',next:renderClass,back:renderPersonality,rerender:renderOrigin,nextLabel:'Choose Your Calling',progress:'Before the road found you, you belonged somewhere—or you made your own way.',scene:'Rain runs down the old milestone. For a moment you remember a place, a voice, and the reason you left. What part of that life still travels with you?' });}
  function renderClass(){const items=Object.entries(D().classes||{}).map(([id,d])=>({id,label:id,text:d.desc,tag:'HP '+d.hp+' · '+d.move}));renderChoiceStep({step:5,kicker:'Calling',title:'How do you survive?',description:'Choose the playstyle that sounds fun. Each class begins with its own strengths and a distinct battle technique.',items,key:'class',next:renderKeepsake,back:renderOrigin,rerender:renderClass,nextLabel:'Choose a Keepsake',progress:'You are not choosing your whole future—just the first tool you trust.',scene:'At the edge of the gate, the guard asks what you can do when the road turns cruel. You think of the skill you reach for before fear can answer.' });}
  function renderKeepsake(){const items=Object.entries(D().keepsakes||{}).map(([id,d])=>({id,label:id,text:d.text,tag:Object.entries(d.bonus||{}).map(([k,v])=>'+'+v+' '+k).join(', ')}));renderChoiceStep({step:6,kicker:'Keepsake',title:'What did you refuse to leave behind?',description:'A small object can carry a memory—or give you an edge when the road gets hard.',items,key:'keepsake',next:renderConfirm,back:renderClass,rerender:renderKeepsake,nextLabel:'Review Your Story',progress:'One last piece of your old life remains in your pack.',scene:'Your hand finds something familiar beneath the wet cloth in your pack. For the first time since waking, the fog feels a little less empty.' });}
  function renderConfirm(){
    const view=window.LegendPlayerCreationViewV094;
    if(typeof view?.renderConfirmation!=='function')return creationViewUnavailable();
    view.renderConfirmation({
      root:ROOT(),
      name:state.name,
      gender:gender(state.gender),
      personality:personality(state.personality),
      origin:state.origin,
      className:state.className,
      keepsake:state.keepsake,
      onBack:renderKeepsake,
      onBegin:createTraveler
    });
  }
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
  function renderIntro(pl){
    const view=window.LegendPlayerCreationViewV094;
    if(typeof view?.renderIntro!=='function')return creationViewUnavailable();
    view.renderIntro({root:ROOT(),onEnter:()=>enterAshmere(pl)});
  }
  window.LegendBeginningV094={startCreation,renderIntro};
})();