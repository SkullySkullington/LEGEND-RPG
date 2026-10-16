// LEGEND - Ashmere town UI audio adapter
// Preserves the existing cue paths, volumes, hover throttle, and DOM binding marker.
(() => {
  const AUDIO_CUE = {
    hover: 'assets/audio/ui/ui_hover_soft.wav',
    confirm: 'assets/audio/ui/ui_confirm_gate.wav'
  };
  let lastHoverCue = 0;

  function playUiCue(kind) {
    try {
      const audio = new Audio(AUDIO_CUE[kind]);
      audio.volume = kind === 'hover' ? 0.10 : 0.18;
      audio.play().catch(() => {});
    } catch (error) {}
  }

  function bindUiAudio(host) {
    if (!host) return;
    host.querySelectorAll('button, a.btn, a.portal-secondary-btn').forEach(element => {
      if (element.dataset.legendAudioBound) return;
      element.dataset.legendAudioBound = '1';
      element.addEventListener('pointerenter', () => {
        const now = Date.now();
        if (now - lastHoverCue > 110) {
          lastHoverCue = now;
          playUiCue('hover');
        }
      });
      element.addEventListener('click', () => playUiCue('confirm'));
    });
  }

  window.LegendTownAudioV100 = { bindUiAudio };
})();
