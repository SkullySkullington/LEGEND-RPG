/* LEGEND v0.21.0 — shared branded transitions for the playable route.
 * Navigation stays owned by existing screens; this layer gives destinations one
 * loading curtain and waits for scene images to settle before revealing them.
 */
(() => {
  if (window.__legendSceneTransitionsV120) return;
  window.__legendSceneTransitionsV120 = true;
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let busy = false;

  function overlay() {
    let el = document.getElementById('legend-scene-curtain');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'legend-scene-curtain';
    el.setAttribute('aria-hidden', 'true');
    const logoSrc = window.LegendAssetsV090?.logo?.main || 'https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/829ddbad-fc3f-41bf-9608-da9d1f301524/eabf3688-a5f1-4942-8df7-dbb7fa967585/Make_a_careful__near_identical_edit_of__existing_logo_for_th.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMTJkYTc3MzYxMmM2NmVkZiIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MjYyNDA1NH0.3yik4_Px4ebuv5daDg_OGg_2tdSnvLkQKue24frd_qg';
    el.innerHTML = '<div class="legend-transition-scene"><img class="legend-transition-wordmark" src="' + logoSrc + '" alt="" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="legend-transition-wordmark-fallback" hidden><strong>LEGEND</strong><em>THE AWAKENING</em></span><span class="legend-transition-location">THE OLD ROAD</span><i class="legend-transition-rule" aria-hidden="true"></i><div class="legend-transition-loader" aria-hidden="true"><i></i></div><small class="legend-transition-caption">PREPARING THE NEXT SCENE</small></div>';
    document.body.appendChild(el);
    return el;
  }

  function destinationLabel(target) {
    if (target.dataset.legendSceneTransition) return target.dataset.legendSceneTransition;
    if (target.matches('[data-ash-view="road"]')) return 'Leaving Ashmere';
    if (target.matches('[data-travel]')) return 'Crossing the realm';
    if (target.matches('[data-unlock]')) return 'Opening a new road';
    const labels = {
      home: 'Returning to Ashmere', people: 'Meeting the townsfolk', inn: 'Entering the inn',
      trader: 'Opening the market', smith: 'Entering the forge', work: 'Opening the work board',
      crossing: 'Approaching the crossing', craft: 'Opening the workshop', sheet: 'Reviewing your traveler',
      archive: 'Opening the field journal', routes: 'Opening the route board', quests: 'Reviewing local contracts',
      regions: 'Opening the road network', dungeon: 'Descending beneath the bell', profile: 'Opening traveler records'
    };
    if (target.dataset.ashView) return labels[target.dataset.ashView] || 'The road turns';
    return 'The road turns';
  }

  function waitForSceneAssets() {
    const images = Array.from(document.getElementById('root')?.querySelectorAll('img') || []).filter(img => !img.complete);
    const paint = new Promise(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
    const assets = Promise.all(images.map(img => new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    })));
    const safety = new Promise(resolve => window.setTimeout(resolve, 1600));
    return Promise.race([Promise.all([assets, paint]), safety]);
  }

  function transitionTo(label, action) {
    if (typeof action !== 'function') return;
    if (busy || reduced()) return action();
    busy = true;
    const curtain = overlay();
    const location = curtain.querySelector('.legend-transition-location');
    if (location) location.textContent = String(label || 'The road turns').toUpperCase();
    curtain.classList.remove('is-revealing');
    curtain.classList.add('is-covering');
    window.setTimeout(async () => {
      try {
        await action();
        await waitForSceneAssets();
      } catch (error) {
        // Reveal the destination even when a screen handler throws, rather than
        // leaving the loading curtain permanently covering the playable UI.
      } finally {
        curtain.classList.remove('is-covering');
        curtain.classList.add('is-revealing');
        window.setTimeout(() => {
          curtain.classList.remove('is-revealing');
          busy = false;
        }, 380);
      }
    }, 290);
  }

  document.addEventListener('click', event => {
    if (window.__legendSceneTransitionBypass || busy || event.defaultPrevented) return;
    const target = event.target?.closest?.('[data-legend-scene-transition],[data-ash-view],[data-travel],[data-unlock]');
    if (!target || target.disabled || reduced()) return;
    if (target.dataset.legendTransitioning === '1') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    transitionTo(destinationLabel(target), () => {
      target.dataset.legendTransitioning = '1';
      window.__legendSceneTransitionBypass = true;
      try {
        target.click();
      } finally {
        window.__legendSceneTransitionBypass = false;
        delete target.dataset.legendTransitioning;
      }
    });
  }, true);

  // Other systems (notably combat outcomes) can use the same curtain when a
  // scene changes as the result of game state rather than a direct navigation.
  window.LegendSceneTransitionsV120 = Object.freeze({ transitionTo });

  const root = document.getElementById('root');
  if (root && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => {
      if (reduced()) return;
      const screen = root.firstElementChild;
      if (!screen || screen.classList.contains('legend-scene-arriving')) return;
      screen.classList.add('legend-scene-arriving');
      window.requestAnimationFrame(() => screen.classList.add('legend-scene-arrived'));
      window.setTimeout(() => screen.classList.remove('legend-scene-arriving', 'legend-scene-arrived'), 520);
    });
    observer.observe(root, { childList: true });
  }
})();
