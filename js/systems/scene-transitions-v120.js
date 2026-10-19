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
    el.innerHTML = '<div class="legend-transition-scene"><img class="legend-transition-wordmark" src="assets/ui/logos/logo_legend_main_v1.png" alt="" decoding="async"><span class="legend-transition-location">THE OLD ROAD</span><i class="legend-transition-rule" aria-hidden="true"></i><small class="legend-transition-caption">A TURNING IN THE TALE</small></div>';
    document.body.appendChild(el);
    return el;
  }
  function destinationLabel(target) {
    if (target.matches('[data-ash-view="road"]')) return 'Leaving Ashmere';
    if (target.matches('[data-travel]')) return 'Crossing the realm';
    if (target.matches('[data-unlock]')) return 'Opening a new road';
    if (target.closest('.rpg-battle,.exp100-combat')) return 'Into the fray';
    return 'The road turns';
  }
  document.addEventListener('click', event => {
    if (window.__legendSceneTransitionBypass || busy || event.defaultPrevented) return;
    const target = event.target?.closest?.('[data-ash-view="road"],[data-travel],[data-unlock]');
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
    window.setTimeout(() => {
      target.dataset.legendTransitioning = '1';
      window.__legendSceneTransitionBypass = true;
      try { target.click(); } finally {
        window.__legendSceneTransitionBypass = false;
        delete target.dataset.legendTransitioning;
      }
      curtain.classList.remove('is-covering');
      curtain.classList.add('is-revealing');
      window.setTimeout(() => {
        curtain.classList.remove('is-revealing');
        busy = false;
      }, 380);
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
