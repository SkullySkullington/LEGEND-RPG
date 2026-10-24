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
    const logoSrc = window.LegendAssetsV090?.logo?.main || 'assets/ui/logos/logo_legend_awakening_wordmark.png?v=0.21.0-local-raster-wordmark';
    el.innerHTML = '<div class="legend-transition-scene"><img class="legend-transition-wordmark" src="' + logoSrc + '" alt="" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="legend-transition-wordmark-fallback" hidden><strong>LEGEND</strong><em>THE AWAKENING</em></span><span class="legend-transition-mode">REALM TRANSITION</span><span class="legend-transition-location">THE OLD ROAD</span><i class="legend-transition-rule" aria-hidden="true"></i><div class="legend-transition-loader" aria-hidden="true"><i></i></div><small class="legend-transition-caption">PREPARING LOCAL SCENE ASSETS</small></div>';
    document.body.appendChild(el);
    return el;
  }

  function destinationLabel(target) {
    if (target.dataset.legendSceneTransition) return target.dataset.legendSceneTransition;
    if (target.matches('[data-ash-view="road"]')) return 'Leaving Ashmere for the Old Road';
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

  function transitionArt(target, label) {
    const view = target?.dataset?.ashView || '';
    const byView = {
      home: 'assets/generated/locations/ashmere-town.webp',
      people: 'assets/generated/locations/ashmere-town.webp',
      inn: 'assets/generated/locations/ashmere-inn.webp',
      trader: 'assets/generated/locations/ashmere-market.webp',
      smith: 'assets/generated/locations/ashmere-forge.webp',
      work: 'assets/generated/locations/ashmere-archive.webp',
      crossing: 'assets/generated/locations/old-road-south-fork.webp',
      craft: 'assets/generated/locations/ashmere-forge.webp',
      sheet: 'assets/generated/locations/ashmere-town.webp',
      archive: 'assets/generated/locations/ashmere-archive.webp',
      routes: 'assets/generated/locations/old-road-south-fork.webp',
      quests: 'assets/generated/locations/ashmere-archive.webp',
      regions: 'assets/generated/locations/old-road-south-fork.webp',
      dungeon: 'assets/generated/locations/bell-cellar-undercroft.webp',
      profile: 'assets/generated/locations/ashmere-town.webp'
    };
    if (view) return byView[view] || 'assets/generated/title/title-ashmere-road.webp';
    if (target?.matches?.('[data-travel]')) return 'assets/generated/locations/greyfen-marsh-walkway.webp';
    if (target?.matches?.('[data-unlock]')) return 'assets/generated/locations/old-road-south-fork.webp';
    if (/bell chamber|cellar|dungeon/i.test(String(label || ''))) return 'assets/generated/locations/bell-cellar-undercroft.webp';
    if (/old road|road|expedition|field/i.test(String(label || ''))) return 'assets/generated/locations/old-road-south-fork.webp';
    if (/greyfen|marsh|crossing|travel/i.test(String(label || ''))) return 'assets/generated/locations/greyfen-marsh-walkway.webp';
    if (/ashmere|inn|market|forge|town/i.test(String(label || ''))) return 'assets/generated/locations/ashmere-town.webp';
    return 'assets/generated/title/title-ashmere-road.webp';
  }

  function transitionCaption(label) {
    if (/bell chamber|cellar|dungeon/i.test(String(label || ''))) return 'DESCENDING INTO THE BELL CELLAR';
    if (/old road|road|expedition|field/i.test(String(label || ''))) return 'PREPARING THE FRONTIER SCENE';
    if (/greyfen|marsh|crossing|travel/i.test(String(label || ''))) return 'READING THE LOWLAND ROUTE';
    if (/ashmere|inn|market|forge|town/i.test(String(label || ''))) return 'RETURNING TO THE LANTERN TOWN';
    if (/traveler|journey|title/i.test(String(label || ''))) return 'RESTORING THE TRAVELER RECORD';
    return 'PREPARING LOCAL SCENE ASSETS';
  }

  function waitForSceneAssets(destinationArt) {
    const images = Array.from(document.getElementById('root')?.querySelectorAll('img') || []).filter(img => !img.complete);
    const paint = new Promise(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
    const assets = Promise.all(images.map(img => new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    })));
    const destination = destinationArt ? new Promise(resolve => {
      const image = new Image();
      const settle = () => resolve();
      image.addEventListener('load', settle, { once: true });
      image.addEventListener('error', settle, { once: true });
      image.src = destinationArt;
      if (image.complete) resolve();
    }) : Promise.resolve();
    const safety = new Promise(resolve => window.setTimeout(resolve, 2400));
    return Promise.race([Promise.all([assets, paint, destination]), safety]);
  }

  function transitionTo(label, action, artPath) {
    if (typeof action !== 'function') return;
    if (busy) return;
    if (reduced()) return action();
    busy = true;
    const startedAt = Date.now();
    const curtain = overlay();
    const location = curtain.querySelector('.legend-transition-location');
    if (location) location.textContent = String(label || 'The road turns').toUpperCase();
    const caption = curtain.querySelector('.legend-transition-caption');
    if (caption) caption.textContent = transitionCaption(label);
    const art = String(artPath || transitionArt(null, label)).replace(/["\\]/g, '');
    curtain.style.setProperty('--legend-transition-art', 'url("' + art + '")');
    curtain.classList.remove('is-revealing');
    curtain.classList.add('is-covering');

    // Render the destination behind the curtain synchronously. This preserves
    // the existing navigation/save contract: handlers and tests can observe
    // the new screen immediately, while the player only sees it after the
    // entrance assets have had a chance to settle.
    try {
      const result = action();
      if (result && typeof result.then === 'function') result.catch(() => {});
    } catch (error) {
      // Always uncover the game, even when a screen handler throws.
    }

    void (async () => {
      await waitForSceneAssets(art);
      const minimumCoverMs = Math.max(0, 1650 - (Date.now() - startedAt));
      window.setTimeout(() => {
        curtain.classList.remove('is-covering');
        curtain.classList.add('is-revealing');
        window.setTimeout(() => {
          curtain.classList.remove('is-revealing');
          busy = false;
        }, 560);
      }, minimumCoverMs);
    })();
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
    }, transitionArt(target, destinationLabel(target)));
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
