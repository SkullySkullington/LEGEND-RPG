/* LEGEND v0.20.38 — illustrated location transitions; preserves existing navigation and save contracts */
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
    el.setAttribute('aria-hidden','true');
    el.innerHTML = '<div class="legend-transition-scene"><img class="legend-transition-wordmark" src="assets/ui/logos/logo_legend_awakening_wordmark.svg" alt="" decoding="async"><span class="legend-transition-location">THE OLD ROAD</span><i class="legend-transition-rule" aria-hidden="true"></i><div class="legend-transition-loader" aria-hidden="true"><i></i></div><small class="legend-transition-caption">PREPARING THE NEXT SCENE</small></div>';
    document.body.appendChild(el);
    return el;
  }
  function destinationLabel(target) {
    if (target.dataset.legendSceneTransition) return target.dataset.legendSceneTransition;
    if (target.matches('[data-ash-view="road"]')) return 'Leaving Ashmere';
    if (target.matches('[data-travel]')) return 'Crossing the realm';
    if (target.matches('[data-unlock]')) return 'Opening a new road';
    const labels = {home:'Returning to Ashmere',people:'Meeting the townsfolk',inn:'Entering the inn',trader:'Opening the market',smith:'Entering the forge',work:'Opening the work board',crossing:'Approaching the crossing',craft:'Opening the workshop',sheet:'Reviewing your traveler',archive:'Opening the field journal',routes:'Opening the route board',quests:'Reviewing local contracts',regions:'Opening the road network',dungeon:'Descending beneath the bell',profile:'Opening traveler records'};
    if (target.dataset.ashView) return labels[target.dataset.ashView] || 'The road turns';
    if (target.closest('.rpg-battle,.exp100-combat')) return 'Into the fray';
    return 'The road turns';
  }
  document.addEventListener('click', event => {
    if (window.__legendSceneTransitionBypass || busy || event.defaultPrevented) return;
    const target = event.target?.closest?.('[data-legend-scene-transition],[data-ash-view],[data-travel],[data-unlock]');
    if (!target || target.disabled || reduced()) return;
    if (target.dataset.legendTransitioning === '1') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    busy = true;
    const curtain = overlay();
    const location = curtain.querySelector('.legend-transition-location');
    if (location) location.textContent = destinationLabel(target).toUpperCase();
    curtain.classList.remove('is-revealing');
    curtain.classList.add('is-covering');
    const delay = 290;
    const waitForSceneAssets = () => {
      const images = Array.from(document.getElementById('root')?.querySelectorAll('img') || []).filter(img => !img.complete);
      const paint = new Promise(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
      const assets = Promise.all(images.map(img => new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      })));
      const safety = new Promise(resolve => window.setTimeout(resolve, 1600));
      return Promise.race([Promise.all([assets, paint]), safety]);
    };
    window.setTimeout(() => {
      const advance = async () => {
        target.dataset.legendTransitioning = '1';
        window.__legendSceneTransitionBypass = true;
        try { target.click(); } finally {
          window.__legendSceneTransitionBypass = false;
          delete target.dataset.legendTransitioning;
        }
        await waitForSceneAssets();
        curtain.classList.remove('is-covering');
        curtain.classList.add('is-revealing');
        window.setTimeout(() => {
          curtain.classList.remove('is-revealing');
          busy = false;
        }, 380);
      };
      void advance();
    }, delay);
  }, true);
  const root = document.getElementById('root');
  if (root && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => {
      if (reduced()) return;
      const screen = root.firstElementChild;
      if (!screen || screen.classList.contains('legend-scene-arriving')) return;
      screen.classList.add('legend-scene-arriving');
      window.requestAnimationFrame(() => screen.classList.add('legend-scene-arrived'));
      window.setTimeout(() => screen.classList.remove('legend-scene-arriving','legend-scene-arrived'), 520);
    });
    observer.observe(root,{childList:true});
  }
})();
