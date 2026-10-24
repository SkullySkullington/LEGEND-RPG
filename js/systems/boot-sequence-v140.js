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
    { title: 'Loading local game files', detail: 'Reading the world data and loading the game’s script modules.' },
    { title: 'Wiring game systems', detail: 'Bringing screens, traveler records, combat, and progression online.' },
    { title: 'Preparing the world', detail: 'Loading Ashmere, the Old Road, regional scenes, and encounters.' },
    { title: 'Finalizing the journey', detail: 'Checking the last game modules before opening the realm.' },
    { title: 'Opening the Borderlands', detail: 'The lanterns are lit. The road is almost ready.' }
  ];
  const trackedScripts = Array.from(document.querySelectorAll('script[src]'));
  const settledScripts = new WeakSet();
  let settledScriptCount = 0;
  let failedScriptCount = 0;
  const scriptTotal = trackedScripts.length;
  const title = document.getElementById('legend-boot-phase');
  const detail = document.getElementById('legend-boot-detail');
  const bar = document.getElementById('legend-boot-progress-fill');
  const value = document.getElementById('legend-boot-progress-value');
  const progress = overlay.querySelector('[role="progressbar"]');
  const fileCount = document.getElementById('legend-boot-file-count');
  const fileStatus = document.querySelector('.legend-boot-status span:first-child');
  const retry = document.getElementById('legend-boot-retry');
  const root = document.getElementById('root');
  retry?.addEventListener('click', () => window.location.reload());
  const metrics = window.__legendBootMetricsV140 = {
    startedAt, completedAt: null, minimumDurationMs: MIN_DURATION_MS,
    scriptTotal, scriptSettled: 0, scriptFailures: 0
  };
  function settleScript(script, failed) {
    if (!script || settledScripts.has(script)) return;
    settledScripts.add(script);
    settledScriptCount += 1;
    if (failed) failedScriptCount += 1;
    metrics.scriptSettled = settledScriptCount;
    metrics.scriptFailures = failedScriptCount;
    paint();
  }
  trackedScripts.forEach(script => {
    script.addEventListener('load', () => settleScript(script, false), { once: true });
    script.addEventListener('error', () => settleScript(script, true), { once: true });
  });
  function paint() {
    if (removed) return;
    const ratio = scriptTotal ? Math.min(1, settledScriptCount / scriptTotal) : 1;
    const index = Math.min(phases.length - 1, Math.floor(ratio * phases.length));
    const active = phases[index];
    if (title) title.textContent = active.title;
    if (detail) detail.textContent = failedScriptCount
      ? 'Some files could not be reached. The game is checking whether the remaining systems can start.'
      : active.detail;
    const pct = Math.min(94, Math.max(7, Math.round(7 + ratio * 87)));
    if (bar) bar.style.width = pct + '%';
    if (value) value.textContent = String(pct).padStart(2, '0') + '%';
    if (fileCount) fileCount.textContent = 'GAME FILES READY ' + settledScriptCount + ' / ' + scriptTotal;
    if (fileStatus) fileStatus.textContent = settledScriptCount >= scriptTotal ? 'GAME FILES PROCESSED' : 'LOADING GAME FILES';
    if (progress) {
      progress.setAttribute('aria-valuenow', String(pct));
      progress.setAttribute('aria-valuetext', pct + ' percent; ' + settledScriptCount + ' of ' + scriptTotal + ' game files processed');
    }
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
    if (fileCount) fileCount.textContent = 'ALL GAME FILES PROCESSED';
    if (fileStatus) fileStatus.textContent = 'REALM READY';
    if (progress) { progress.setAttribute('aria-valuenow', '100'); progress.setAttribute('aria-valuetext', '100 percent; realm ready'); }
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
    if (removed || (sceneMounted() && window.__legendRuntimeScriptsReadyV140)) return;
    if (title) title.textContent = 'The realm is taking longer than expected';
    if (detail) detail.textContent = 'The game is still waiting for its first scene. Try refreshing if this message remains.';
    if (bar) bar.style.width = '94%';
    if (value) value.textContent = '94%';
    if (progress) { progress.setAttribute('aria-valuenow', '94'); progress.setAttribute('aria-valuetext', '94 percent'); }
    if (retry) retry.hidden = false;
  }, 9000);
})();
