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
    const buildVersion = config.buildVersion || (() => String(window.LEGEND_DATA?.VERSION || 'v0.20.36'));
    const applySettings = config.applySettings || (() => {});
    const continueGame = config.onContinue;
    const newTraveler = config.onNewTraveler;
    const account = config.onAccount;
    const settings = config.onSettings;
    const credits = config.onCredits || openCredits;
    applySettings();
    const player = loadPlayer();
    const name = player?.username || 'No Traveler';
    const cls = player?.className || player?.class || 'Wayfarer';
    const savedRegion = String(player?.currentRegion || player?.town || 'Ashmere');
    const town = ['Ashmere', 'Greyfen'].includes(savedRegion) ? savedRegion : 'Ashmere';
    const day = Number(player?.day || 1);
    const tokens = Number(player?.inventory?.roadToken || 0);
    const titleView = window.LegendTitleScreenViewV120;
    if (typeof titleView?.render !== 'function' || !titleView.render({
      root: root(),
      player,
      name,
      cls,
      town,
      day,
      tokens,
      buildVersion: buildVersion(),
      backgroundImage: window.LegendAssetsV090?.title?.background,
      logoImage: window.LegendAssetsV090?.logo?.main
    })) {
      const host = root();
      if (host) host.innerHTML = '<main class="settings09x"><div class="settings09x-wrap"><h1>Title screen unavailable</h1><p>The title menu view could not be loaded. Refresh before continuing.</p></div></main>';
      return;
    }
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
