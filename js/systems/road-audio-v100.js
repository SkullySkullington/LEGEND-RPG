// LEGEND v0.20.37 - Old Road audio adapter
// Owns expedition sound effects and battle music while preserving the existing
// localStorage preference and the controller's current call contract.
(() => {
  const AUDIO_KEY = 'legend-road-sound';
  const BATTLE_AUDIO = {
    theme:'assets/audio/battle/old-road-battle_loop.wav',
    swing:'assets/audio/battle/battle_swing.wav',
    heavy:'assets/audio/battle/battle_heavy.wav',
    hit:'assets/audio/battle/battle_hit.wav',
    guard:'assets/audio/battle/battle_guard.wav',
    heal:'assets/audio/battle/battle_heal.wav',
    magic:'assets/audio/battle/battle_magic.wav',
    victory:'assets/audio/battle/battle_victory.wav'
  };
  let battleMusic = null;

  function soundOn() {
    try { return localStorage.getItem(AUDIO_KEY) !== 'off'; }
    catch (error) { return true; }
  }

  function tone(kind = 'tap') {
    if (!soundOn()) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const impact = kind === 'impact';
      oscillator.type = impact ? 'sawtooth' : 'triangle';
      oscillator.frequency.setValueAtTime(impact ? 145 : 520, now);
      oscillator.frequency.exponentialRampToValueAtTime(
        impact ? 68 : kind === 'success' ? 780 : 390,
        now + (impact ? .13 : .07)
      );
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(impact ? .075 : .025, now + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, now + (impact ? .15 : .085));
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + (impact ? .16 : .09));
      oscillator.onended = () => context.close();
    } catch (error) {}
  }

  function playBattleFx(kind) {
    if (!soundOn()) return;
    try {
      const audio = new Audio(BATTLE_AUDIO[kind] || BATTLE_AUDIO.swing);
      audio.volume = kind === 'hit' ? .34 : kind === 'victory' ? .3 : .2;
      audio.play().catch(() => {});
    } catch (error) {}
  }

  function startBattleMusic() {
    if (!soundOn()) return;
    try {
      if (!battleMusic) {
        battleMusic = new Audio(BATTLE_AUDIO.theme);
        battleMusic.loop = true;
        battleMusic.volume = .17;
      }
      if (battleMusic.paused) battleMusic.play().catch(() => {});
    } catch (error) {}
  }

  function stopBattleMusic() {
    if (!battleMusic) return;
    try {
      battleMusic.pause();
      battleMusic.currentTime = 0;
    } catch (error) {}
    battleMusic = null;
  }

  window.LegendRoadAudioV100 = {
    soundOn,
    tone,
    playBattleFx,
    startBattleMusic,
    stopBattleMusic
  };
})();
