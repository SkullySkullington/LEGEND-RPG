(() => {
  if (window.__legendBootSequenceV140) return;
  const overlay = document.getElementById('legend-boot-sequence');
  if (!overlay) return;
  const MIN_DURATION_MS = 3200;
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  const startedAt = performance.now();
  let finishScheduled = false;
  let removed = false;
  let intervalId = null;
  let timeoutId = null;
  const phases = [
    { at: 0, title: 'Reading world archives', detail: 'Preparing known regions, routes, and field records.' },
    { at: 650, title: 'Initializing game systems', detail: 'Waking the scene controller, progression, and combat systems.' },
    { at: 1280, title: 'Restoring local assets', detail: 'Preparing the illustrated realm and its familiar landmarks.' },
    { at: 1920, title: 'Checking traveler records', detail: 'Keeping your existing journey, equipment, and inventory safe.' },
    { at: 2540, title: 'Opening the Borderlands', detail: 'The lanterns are lit. The road is almost ready.' }
  ];
  const title = document.getElementById('legend-boot-phase');
  const detail = document.getElementById('legend-boot-detail');
  const bar = document.getElementById('legend-boot-progress-fill');
  const value = document.getElementById('legend-boot-progress-value');
  const progress = overlay.querySelector('[role="progressbar"]');
  const retry = document.getElementById('legend-boot-retry');
  const root = document.getElementById('root');
  retry?.addEventListener('click', () => window.location.reload());
  window.__legendBootMetricsV140 = { startedAt, completedAt: null, minimumDurationMs: MIN_DURATION_MS };
  function paint() {
    if (removed) return;
    const elapsed = performance.now() - startedAt;
    let active = phases[0];
    let index = 0;
    phases.forEach((phase, i) => { if (elapsed >= phase.at) { active = phase; index = i; } });
    if (title) title.textContent = active.title;
    if (detail) detail.textContent = active.detail;
    const pct = Math.min(90, Math.max(7, Math.round(7 + Math.min(1, elapsed / MIN_DURATION_MS) * 78 + index * 1.2)));
    if (bar) bar.style.width = pct + '%';
    if (value) value.textContent = String(pct).padStart(2, '0') + '%';
    if (progress) { progress.setAttribute('aria-valuenow', String(pct)); progress.setAttribute('aria-valuetext', pct + ' percent'); }
    overlay.setAttribute('aria-label', 'Starting LEGEND: The Awakening — ' + active.title);
  }
  function exit() {
    if (removed) return;
    removed = true;
    if (intervalId) window.clearInterval(intervalId);
    if (timeoutId) window.clearTimeout(timeoutId);
    if (title) title.textContent = 'Realm ready';
    if (detail) detail.textContent = 'Welcome to the Borderlands. Your journey is yours to shape.';
    if (bar) bar.style.width = '100%';
    if (value) value.textContent = '100%';
    if (progress) { progress.setAttribute('aria-valuenow', '100'); progress.setAttribute('aria-valuetext', '100 percent'); }
    window.__legendBootMetricsV140.completedAt = performance.now();
    overlay.setAttribute('aria-label', 'LEGEND: The Awakening is ready');
    overlay.classList.add('is-exiting');
    window.setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('legend-booting');
      document.dispatchEvent(new CustomEvent('legend:boot-complete'));
    }, reducedMotion() ? 50 : 660);
  }
  function sceneMounted() { return Boolean(root && root.firstElementChild); }
  function checkReady() {
    if (finishScheduled || removed || !sceneMounted() || !window.__legendRuntimeScriptsReadyV140) return;
    finishScheduled = true;
    timeoutId = window.setTimeout(exit, Math.max(0, MIN_DURATION_MS - (performance.now() - startedAt)));
  }
  intervalId = window.setInterval(paint, 130);
  paint();
  if (root && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => { checkReady(); if (removed) observer.disconnect(); });
    observer.observe(root, { childList: true, subtree: true });
  }
  window.addEventListener('DOMContentLoaded', checkReady, { once: true });
  window.addEventListener('load', checkReady, { once: true });
  checkReady();
  window.__legendBootSequenceV140 = Object.freeze({ checkReady });
  window.setTimeout(() => {
    if (removed || sceneMounted()) return;
    if (title) title.textContent = 'The realm is taking longer than expected';
    if (detail) detail.textContent = 'The game is still waiting for its first scene. Try refreshing if this message remains.';
    if (bar) bar.style.width = '94%';
    if (value) value.textContent = '94%';
    if (retry) retry.hidden = false;
  }, 9000);
})();
