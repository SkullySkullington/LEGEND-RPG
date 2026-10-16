// LEGEND: The Awakening v0.20.36 - classic RPG title menu refresh
// Owns title/start/settings/account entry. Ashmere is owned by ashmere-controller-v099.js.
(() => {
  const S = () => window.LegendStorage || {};
  const TITLE_GATE_KEY = 'legend-roads-of-ashmere-title-gate-v09x';
  const AUDIO = {
    ambience:'assets/audio/title/ashmere_ambience_loop.wav',
    hover:'assets/audio/ui/ui_hover_soft.wav',
    confirm:'assets/audio/ui/ui_confirm_gate.wav'
  };
  let titleAmbience = null;

  function esc(s){ return String(s == null ? '' : s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function root(){ return document.getElementById('root'); }
  function loadPlayer(){ return S().loadPlayer ? S().loadPlayer() : null; }
  function saveSettings(settings){ if(S().saveSettings) S().saveSettings(settings); }
  function loadSettings(){ return S().loadSettings ? S().loadSettings() : { largeText:false, boldText:false, highContrast:false, reducedMotion:false, simpleAscii:false, spacious:false, readableFont:false }; }
  function applySettings(){ if(S().applySettings) S().applySettings(); }
  function profile(){ return window.LegendAccountV09x?.getProfile?.() || null; }
  function buildVersion(){ return String(window.LEGEND_DATA?.VERSION || 'v0.20.36'); }

  function playUi(kind){
    const src = AUDIO[kind];
    if(!src) return;
    try {
      const audio = new Audio(src);
      audio.volume = kind === 'hover' ? 0.16 : 0.26;
      audio.play().catch(() => {});
    } catch {}
  }

  function startAmbience(){
    if(titleAmbience || !AUDIO.ambience) return;
    try {
      titleAmbience = new Audio(AUDIO.ambience);
      titleAmbience.loop = true;
      titleAmbience.volume = 0.28;
      titleAmbience.play().catch(() => { titleAmbience = null; });
    } catch { titleAmbience = null; }
  }

  const titleRumors = [
    'The fog remembers names better than men do.',
    'Road Tokens prove you returned. Not why.',
    'Mara says the Old Road keeps its own ledger.',
    'Three tokens buys trust. A fourth asks what trust costs.',
    'The lantern gate opens for travelers, not heroes.'
  ];
  function titleRumor(){ return titleRumors[Math.floor(Date.now() / 7000) % titleRumors.length]; }

  const paths={continue:'M5 12h12M13 6l6 6-6 6',new:'M12 5v14M5 12h14',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M3 12h3m12 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',account:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9c1.4-4.2 4.5-6.5 8-6.5s6.6 2.3 8 6.5',feedback:'M4 5h16v11H8l-4 4V5z',delete:'M6 7h12M9 7V5h6v2m-7 3v9m4-9v9m4-9v9',text:'M5 7h14M5 12h14M5 17h10',bold:'M8 5h5a4 4 0 0 1 0 8H8zM8 13h6a4 4 0 0 1 0 8H8z',contrast:'M12 3a9 9 0 1 0 0 18V3z',motion:'M4 12h10M10 6l6 6-6 6',space:'M4 8h16M4 16h16M8 4v16M16 4v16',font:'M4 19l6-14h4l6 14M8 14h8',world:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',gate:'M4 20V9a8 8 0 0 1 16 0v11M8 20V9a4 4 0 0 1 8 0v11',road:'M8 21c2-6 2-12 0-18M16 21c-2-6-2-12 0-18M5 14h14M6 8h12',cloud:'M7 18a4 4 0 1 1 1-7 5 5 0 0 1 10 2 3 3 0 0 1-1 5H7z',people:'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 20c.8-4 3-6 5-6s4.2 2 5 6M10 20c.8-4 3-6 5-6s4.2 2 5 6',notice:'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5',lock:'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6z',slot:'M12 3l8 5v8l-8 5-8-5V8z'};
  const icon=k=>`<span class="game-menu-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[k]||paths.continue}"/></svg></span>`;
  const portalIcon=k=>`<span class="portal-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[k]||paths.slot}"/></svg></span>`;
  const portalAction=(id,kind,label,desc,ic)=>`<button class="btn ${kind||''} game-menu-btn portal-action" id="${id}">${icon(ic)}<span><strong>${label}</strong><small>${desc}</small></span></button>`;

  function profileName(profileData){ return esc(profileData?.displayName || 'Wandering Traveler'); }
  function registryStatus(profileData){ return profileData?.authUserId ? 'Bound' : window.LegendSupabaseV09x?.client ? 'Ready' : 'Local'; }

  function portalHeader(profileData){
    return `<header class="portal-header">
      <div class="portal-brand">
        <img src="${esc(window.LegendAssetsV090?.logo?.emblemFull || 'assets/ui/logos/logo_legend_emblem_v2.svg')}" alt="LEGEND emblem" onerror="this.style.display='none'">
        <div><h1>LEGEND</h1><p>The Awakening</p><span>✧ Lantern Gate of Ashmere ✧</span></div>
      </div>
      <div class="portal-profile-card">
        <span class="portal-crest" aria-hidden="true">◆</span>
        <div><p>Traveler: <strong>${profileName(profileData)}</strong></p><p>Registry: <strong>${registryStatus(profileData)}</strong></p><p>Road: <strong>Open</strong></p></div>
        <button class="portal-gear" id="settingsTop" type="button" aria-label="Open settings">⚙</button>
      </div>
    </header>`;
  }

  function statusRow(iconKey,label,value,tone){
    return `<div class="portal-status-row"><span>${portalIcon(iconKey)}${label}</span><strong class="${tone||''}">${value}</strong></div>`;
  }

  function worldStatusPanel(profileData){
    return `<aside class="portal-panel portal-world-panel"><h2>Ashmere Gate</h2>
      <div class="portal-status-list">
        ${statusRow('gate','Lantern Gate','Open','good')}
        ${statusRow('world','Settlement','Ashmere','gold')}
        ${statusRow('road','Old Road','Restless','warn')}
        ${statusRow('notice','Notice Board','Posted')}
        ${statusRow('cloud','Traveler Registry',registryStatus(profileData),'good')}
        ${statusRow('people','Companions','Not Yet Gathered','gold')}
      </div>
      <div class="portal-side-actions">
        ${portalAction('account','', 'Traveler Registry','Sign in, bind your profile, and manage traveler slots.','account')}
        ${portalAction('settings','', 'Options','Adjust readability, contrast, spacing, and motion.','settings')}
        <a class="btn game-menu-btn portal-action" href="feedback.html">${icon('feedback')}<span><strong>Leave a Report</strong><small>Send word back from the road.</small></span></a>
      </div>
    </aside>`;
  }

  function travelerSlots(player){
    return `<div class="portal-slot-list">
      <div class="portal-slot active"><b>1</b><span>${player ? 'Current Traveler' : 'Empty Bed'}</span><em>${player ? 'ready' : 'open'}</em></div>
      <div class="portal-slot"><b>2</b><span>Empty Bed</span><em>local</em></div>
      <div class="portal-slot locked"><b>3</b><span>Reserved Room</span><em>sealed</em></div>
      <div class="portal-slot locked"><b>4</b><span>Reserved Room</span><em>later</em></div>
    </div>`;
  }

  function travelerRosterPanel(player){
    const cls = player?.className || player?.class || 'Wayfarer';
    const name = player?.username || 'No Traveler Chosen';
    const day = player?.day || 1;
    const tokens = Number(player?.inventory?.roadToken || 0);
    const activeRegion=String(player?.currentRegion||'Ashmere');
    const town=['Ashmere','Greyfen'].includes(activeRegion)?activeRegion:'Ashmere';
    const trust = Number(player?.townTrust?.Ashmere || 0);
    const status = player ? `${esc(cls)} last seen in ${esc(town)}. The Old Road still knows your footsteps.` : 'Choose a name and step through the lantern gate for the first time.';
    return `<main class="portal-panel portal-roster-panel"><h2>Choose Your Traveler</h2>
      <section class="portal-traveler-card ${player ? '' : 'empty'}">
        <div class="portal-portrait" aria-hidden="true"><span>${player ? esc(String(name).slice(0,1)).toUpperCase() : '?'}</span></div>
        <div class="portal-traveler-info"><h3>${esc(name)}</h3><p class="portal-traveler-line">${status}</p>
          <dl>
            <div><dt>Calling</dt><dd>${esc(cls)}</dd></div>
            <div><dt>Resting At</dt><dd>${esc(town)}</dd></div>
            <div><dt>Day</dt><dd>${day}</dd></div>
            <div><dt>Ashmere Trust</dt><dd>${trust}</dd></div>
            <div><dt>Road Tokens</dt><dd>${tokens}</dd></div>
          </dl>
        </div>
      </section>
      ${travelerSlots(player)}
      <div class="portal-roster-actions">
        ${player ? `<button class="portal-enter-btn" id="continue" type="button">Enter Ashmere</button>` : `<button class="portal-enter-btn" id="newPrimary" type="button">Begin the Road</button>`}
        <button class="portal-secondary-btn" id="new" type="button">New Traveler</button>
        <button class="portal-secondary-btn" id="registry" type="button">Registry</button>
      </div>
    </main>`;
  }

  function noticeBoardPanel(){
    return `<aside class="portal-panel portal-notice-panel"><h2>Town Notices</h2>
      <article class="portal-parchment"><h3>Posted at the Gate</h3><ul><li>The Old Road is unsafe beyond the lantern line.</li><li>Returning travelers should bring Road Tokens to Mara.</li><li>Rooms remain open for newly named travelers.</li><li>The registry clerk is accepting account bindings.</li></ul></article>
      <article class="portal-parchment small"><h3>Town Rumor</h3><p>${esc(titleRumor())}</p></article>
      <a class="portal-secondary-btn portal-patch-link" href="feedback.html">Send Word</a>
    </aside>`;
  }

  function portalFooter(){
    return `<footer class="portal-footer"><p><strong>Ashmere Services:</strong> Traveler Registry • Account Rewards • Cloud Lodging • Companions Later</p><p><strong>Build:</strong> ${esc(buildVersion())}</p></footer>`;
  }

  function titleGate(){
    applySettings();
    root().innerHTML = `
      <div class="title-wrap title-gate-wrap title-gate-cinematic">
        <div class="title-embers" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        <div class="title-fog" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="title-gate-border" aria-hidden="true"></div>
        <main class="title-gate-card">
          <h1 class="game-title">LEGEND</h1>
          <p class="title-gate-subtitle">The Awakening</p>
          <p class="title-gate-kicker">✧ Ashmere Gate ✧</p>
          <button class="title-gate-prompt" id="enterRealm" type="button">Press Any Key to Enter Ashmere</button>
          <p class="title-gate-quote">The lantern gate opens for travelers, not heroes.</p>
        </main>
      </div>`;
    const enter = document.getElementById('enterRealm');
    const activate = () => {
      document.removeEventListener('keydown', onKey);
      try { sessionStorage.setItem(TITLE_GATE_KEY, 'opened'); } catch {}
      startAmbience();
      playUi('confirm');
      title();
    };
    const onKey = e => { if(e.key !== 'Tab') activate(); };
    document.addEventListener('keydown', onKey);
    if(enter) enter.onclick = e => { e.stopPropagation(); activate(); };
  }

  function titleTransition(message, action){
    playUi('confirm');
    const wrap = document.querySelector('.title-wrap');
    if(!wrap) return action();
    wrap.classList.add('title-is-opening');
    const notice = document.createElement('div');
    notice.className = 'title-transition-notice';
    notice.textContent = message;
    wrap.appendChild(notice);
    setTimeout(action, 340);
  }

  function bindTitleAudio(){
    document.querySelectorAll('.game-menu-btn,.v136-menu-btn,.portal-enter-btn,.portal-secondary-btn,.portal-gear,.portal100-primary,.portal100-header-actions button').forEach(btn => {
      btn.addEventListener('pointerenter', () => playUi('hover'));
      btn.addEventListener('focus', () => playUi('hover'));
    });
    const unlockAudio=()=>{ startAmbience(); document.removeEventListener('pointerdown',unlockAudio); document.removeEventListener('keydown',unlockAudio); };
    document.addEventListener('pointerdown',unlockAudio);
    document.addEventListener('keydown',unlockAudio);
  }

  function credits(){
    const overlay=document.createElement('div');
    overlay.className='legend-credits-overlay';
    overlay.innerHTML='<section class="legend-credits-panel" role="dialog" aria-modal="true" aria-labelledby="legendCreditsTitle"><div class="legend-credits-kicker">A WORLD IN THE MAKING</div><h2 id="legendCreditsTitle">LEGEND</h2><h3>THE AWAKENING</h3><div class="legend-credits-rule"></div><p>A dark-fantasy role-playing game about the roads we travel, the magic we awaken, and the places we choose to protect.</p><p><strong>World &amp; game:</strong> LEGEND RPG project</p><p><strong>Visual development:</strong> Original game art and AI-assisted asset production</p><p><strong>First light:</strong> Ashmere<br><strong>Beyond the lanterns:</strong> Greyfen and the wider realm</p><div class="legend-credits-rule"></div><p>Thank you for walking the road.</p><button class="legend-credits-close" type="button" data-credits-close>Return to the Title</button></section>';
    const close=()=>{overlay.remove();document.removeEventListener('keydown',onKey);document.getElementById('credits')?.focus();};
    const onKey=e=>{if(e.key==='Escape'){e.preventDefault();close();}};
    overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
    overlay.querySelector('[data-credits-close]').addEventListener('click',close);
    document.addEventListener('keydown',onKey);
    document.body.appendChild(overlay);
    overlay.querySelector('button').focus();
  }
  function title(){
    applySettings();
    const player = loadPlayer();
    const prof = profile();
    const name = player?.username || 'No Traveler';
    const cls = player?.className || player?.class || 'Wayfarer';
    const savedRegion = String(player?.currentRegion || player?.town || 'Ashmere');
    const town = ['Ashmere', 'Greyfen'].includes(savedRegion) ? savedRegion : 'Ashmere';
    const day = Number(player?.day || 1);
    const tokens = Number(player?.inventory?.roadToken || 0);
    root().innerHTML = `
      <div class="title-wrap title-v100 portal-shell portal-v100 v120-title title-v136-rpg">
        <img class="v120-title-backdrop" src="${esc(window.LegendAssetsV090?.title?.background || 'assets/title/title_bg_ashmere_road_v089.jpg')}" alt="" aria-hidden="true" loading="eager" fetchpriority="high" decoding="async" onerror="if(this.dataset.fallbackApplied){this.style.display='none'}else{this.dataset.fallbackApplied='1';this.src='assets/title/title_bg_ashmere_road_v089.jpg'}">
        <div class="title-atmosphere" aria-hidden="true"><div class="title-embers"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="title-fog"><i></i><i></i><i></i></div></div>
        <header class="portal100-header">
          <div class="portal100-brand">
            <div><span>ASHMERE · THE OLD ROAD</span></div>
          </div>
          <img class="v136-corner-sigil" src="assets/ui/icons/awakening-sigil.svg" alt="" aria-hidden="true" onerror="this.style.display='none'">
        </header>
        <main class="v120-title-main">
          <section class="v120-title-hero" aria-labelledby="legendTitleAccessibleName">
            <h1 class="v120-title-accessible-name" id="legendTitleAccessibleName">LEGEND: The Awakening</h1>
            <div class="portal100-kicker">A DARK FANTASY RPG</div>
            <img class="v120-legend-logo" src="${esc(window.LegendAssetsV090?.logo?.main || 'assets/ui/logos/logo_legend_awakening_wordmark.svg')}" alt="" aria-hidden="true" decoding="async" onerror="this.style.display='none'">
            <p>Monsters press against the borders. Old magic stirs beneath a wounded realm.</p>
            <div class="v120-divider"><span></span><b>THE BORDERLANDS ARE WAKING</b><span></span></div>
            <div class="v120-traveler-line">
              <span class="v120-avatar" aria-hidden="true">${player ? esc(String(name).slice(0,1)).toUpperCase() : '✦'}</span>
              <div><small>${player ? 'CURRENT TRAVELER' : 'YOUR STORY BEGINS HERE'}</small><strong>${player ? esc(name) : 'No journey has begun'}</strong><span>${player ? `${esc(cls)} · Day ${day} · ${tokens} Road Tokens` : 'Create a traveler and discover what the road remembers.'}</span></div>
            </div>
            <nav class="v120-title-actions v136-rpg-menu" aria-label="Main menu">
              <div class="v136-menu-heading"><span>CHOOSE YOUR PATH</span><i aria-hidden="true"></i></div>
              <div class="v136-menu-list">
                ${player ? `<button class="v136-menu-btn v136-menu-primary" id="continue" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2.8 14.5 9.5 21.2 12 14.5 14.5 12 21.2 9.5 14.5 2.8 12 9.5 9.5Z"/></svg></span><span class="v136-menu-copy"><strong>Continue Journey</strong><small>Return to ${esc(town)}</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>` : '<button class="v136-menu-btn v136-menu-primary" id="newPrimary" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2.8 14.5 9.5 21.2 12 14.5 14.5 12 21.2 9.5 14.5 2.8 12 9.5 9.5Z"/></svg></span><span class="v136-menu-copy"><strong>Begin Your Journey</strong><small>Create your traveler</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>'}
                ${player ? '<button class="v136-menu-btn" id="new" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="10" cy="7.5" r="3"/><path d="M4 19c.5-3.1 2.5-4.8 6-4.8 1.7 0 3 .4 4 1.2M18 14v7M14.5 17.5h7"/></svg></span><span class="v136-menu-copy"><strong>New Traveler</strong><small>Begin a different journey</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>' : ''}
                <button class="v136-menu-btn" id="account" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M5 20c.7-3.6 3-5.3 7-5.3s6.3 1.7 7 5.3"/></svg></span><span class="v136-menu-copy"><strong>Profile</strong><small>Traveler identity and registry</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>
                <button class="v136-menu-btn" id="settings" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3"/></svg></span><span class="v136-menu-copy"><strong>Settings</strong><small>Readability and game comfort</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>
                <button class="v136-menu-btn v136-menu-credits" id="credits" type="button"><span class="v136-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3.5h10.5A1.5 1.5 0 0 1 18 5v15.5H7.5A1.5 1.5 0 0 1 6 19Z"/><path d="M6 6H4.8A1.8 1.8 0 0 0 3 7.8v11.4A1.8 1.8 0 0 0 4.8 21H18M9 8h5M9 11.5h5"/></svg></span><span class="v136-menu-copy"><strong>Credits</strong><small>The people and craft behind LEGEND</small></span><span class="v136-menu-arrow" aria-hidden="true">›</span></button>
              </div>
            </nav>
          </section>
        </main>
        <footer class="portal100-footer portal-footer v120-title-footer"><span>LEGEND: THE AWAKENING</span><span>${esc(buildVersion())} · ASHMERE · OLD ROAD · GREYFEN</span></footer>
      </div>`;
    startAmbience();
    bindTitleAudio();
    const cont = document.getElementById('continue');
    if(cont) cont.onclick = () => titleTransition('Returning to '+town+'...', continueGame);
    const newPrimary = document.getElementById('newPrimary');
    if(newPrimary) newPrimary.onclick = () => titleTransition('Preparing New Traveler...', newTraveler);
    const newButton = document.getElementById('new');
    if(newButton) newButton.onclick = () => titleTransition('Preparing New Traveler...', newTraveler);
    document.getElementById('account').onclick = () => titleTransition('Opening Traveler Profile...', account);
    document.getElementById('settings').onclick = () => titleTransition('Opening Options...', settings);
    document.getElementById('credits').onclick = credits;
  }

  function continueGame(){
    const player = loadPlayer();
    if(!player) return title();
    const activeRegion=String(player.currentRegion||'Ashmere');
    if(['Ashmere','Greyfen'].includes(activeRegion)){
      player.town=activeRegion;
    }else{
      // A save may reference a mapped region that is not playable yet. Keep it safe.
      player.currentRegion='Ashmere';
      player.town='Ashmere';
      player.memories=Array.isArray(player.memories)?player.memories:[];
      const note='You returned to Ashmere while the next region is still being built.';
      if(!player.memories.includes(note))player.memories.push(note);
    }
    S().savePlayer?.(player);
    if(window.LegendAshmereV099?.renderAshmere) return window.LegendAshmereV099.renderAshmere();
    root().innerHTML = `<div class="shell"><section class="panel"><h2>Ashmere is loading...</h2><p>Try a hard refresh if this screen does not change.</p><div class="actions"><button class="btn primary" id="backTitle">Back to Title</button></div></section></div>`;
    document.getElementById('backTitle').onclick = title;
  }

  function newTraveler(){
    if(window.LegendBeginningV094?.startCreation) return window.LegendBeginningV094.startCreation();
    root().innerHTML = `<div class="shell"><section class="panel"><h2>Traveler creation is loading...</h2><p>Try a hard refresh if this screen does not change.</p><div class="actions"><button class="btn primary" id="backTitle">Back to Title</button></div></section></div>`;
    document.getElementById('backTitle').onclick = title;
  }

  function account(){
    if(window.LegendAccountV09x?.renderAccount) return window.LegendAccountV09x.renderAccount();
    root().innerHTML = `<main class="account09x"><div class="account09x-wrap"><section class="account09x-hero"><div class="account09x-hero-content"><div class="account09x-kicker">Profile / Travelers</div><h1>Traveler Profile</h1><p>Profile screens are loading. Try a hard refresh if this screen does not change.</p></div></section><div class="account09x-actions"><button class="account09x-btn primary" id="backTitle">Back to Title</button></div></div></main>`;
    document.getElementById('backTitle').onclick = title;
  }

  function settings(){
    const settingsScreen = window.LegendSettingsScreenV090;
    if (settingsScreen && typeof settingsScreen.render === 'function') {
      return settingsScreen.render({
        root: root(),
        loadSettings,
        saveSettings,
        buildVersion,
        loadPlayer,
        onBackTitle: title,
        onBackGame: continueGame
      });
    }

    const container = root();
    if (!container) return;
    container.innerHTML = '<main class="settings09x"><div class="settings09x-wrap"><section class="settings09x-hero"><h1>Settings</h1><p>The settings screen could not be loaded. Return to the title and refresh before retrying.</p></section><div class="settings09x-actions"><button class="settings09x-btn" id="backTitle" type="button">Back to Title</button></div></div></main>';
    container.querySelector('#backTitle')?.addEventListener('click', title);
  }

  window.LegendGameBootstrap = { title, titleGate, continueGame, newTraveler, settings, account, credits };
  // v0.20.26: enter directly on the actual title menu. The former Ashmere Gate
  // splash was a redundant extra screen before the title and required an extra click.
  const boot = () => title();
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();