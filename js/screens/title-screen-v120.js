// LEGEND v0.20.36 - Active title screen presentation and menu interaction.
// Rendering keeps the established CSS hooks; navigation/state are injected by the bootstrap.
(() => {
  const TITLE_GATE_KEY = 'legend-roads-of-ashmere-title-gate-v09x';
  const titleAudio = window.LegendTitleAudioV120 || Object.freeze({
    playUi: () => {},
    startAmbience: () => {},
    bindTitleAudio: () => {}
  });

  function esc(s){ return String(s == null ? '' : s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  function renderGate(config){
    const root = () => config?.root || document.getElementById('root');
    const applySettings = config?.applySettings || (() => {});
    const title = () => render(config);
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
      titleAudio.startAmbience();
      titleAudio.playUi('confirm');
      title();
    };
    const onKey = e => { if(e.key !== 'Tab') activate(); };
    document.addEventListener('keydown', onKey);
    if(enter) enter.onclick = e => { e.stopPropagation(); activate(); };
  }

  function titleTransition(message, action){
    titleAudio.playUi('confirm');
    const wrap = document.querySelector('.title-wrap');
    if(!wrap) return action();
    wrap.classList.add('title-is-opening');
    const notice = document.createElement('div');
    notice.className = 'title-transition-notice';
    notice.textContent = message;
    wrap.appendChild(notice);
    setTimeout(action, 340);
  }

  function openCredits(){
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

  function render(config){
    if (!config) return;
    const root = () => config.root || document.getElementById('root');
    const loadPlayer = config.loadPlayer || (() => null);
    const profile = config.profile || (() => null);
    const buildVersion = config.buildVersion || (() => String(window.LEGEND_DATA?.VERSION || 'v0.20.36'));
    const applySettings = config.applySettings || (() => {});
    const continueGame = config.onContinue;
    const newTraveler = config.onNewTraveler;
    const account = config.onAccount;
    const settings = config.onSettings;
    const credits = config.onCredits || openCredits;
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
    titleAudio.startAmbience();
    titleAudio.bindTitleAudio();
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
  
  window.LegendTitleScreenV120 = Object.freeze({ render, renderGate, openCredits });
})();
