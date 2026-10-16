const { test, expect } = require('@playwright/test');

test.describe('Old Road audio adapter compatibility contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addScriptTag({ path: 'js/systems/road-audio-v100.js' });
  });

  test('exposes the controller-facing audio API and respects the existing sound preference', async ({ page }) => {
    const result = await page.evaluate(() => {
      const audio = window.LegendRoadAudioV100;
      localStorage.setItem('legend-road-sound', 'off');
      const disabled = audio.soundOn();
      localStorage.setItem('legend-road-sound', 'on');
      const enabled = audio.soundOn();
      return {
        methods: ['soundOn', 'tone', 'playBattleFx', 'startBattleMusic', 'stopBattleMusic']
          .every(name => typeof audio[name] === 'function'),
        disabled,
        enabled
      };
    });

    expect(result).toEqual({ methods: true, disabled: false, enabled: true });
  });

  test('uses the existing effect paths and reuses battle music until it is stopped', async ({ page }) => {
    const result = await page.evaluate(() => {
      const played = [];
      window.Audio = function (src) {
        this.src = src;
        this.volume = 1;
        this.loop = false;
        this.paused = true;
        this.currentTime = 0;
        this.play = () => {
          played.push({ src: this.src, volume: this.volume, loop: this.loop });
          this.paused = false;
          return Promise.resolve();
        };
        this.pause = () => { this.paused = true; };
      };
      localStorage.setItem('legend-road-sound', 'on');
      const audio = window.LegendRoadAudioV100;
      audio.playBattleFx('victory');
      audio.playBattleFx('unknown-effect');
      audio.startBattleMusic();
      audio.startBattleMusic();
      audio.stopBattleMusic();
      audio.startBattleMusic();
      audio.stopBattleMusic();
      return played;
    });

    expect(result).toEqual([
      { src: 'assets/audio/battle/battle_victory.wav', volume: 0.3, loop: false },
      { src: 'assets/audio/battle/battle_swing.wav', volume: 0.2, loop: false },
      { src: 'assets/audio/battle/old-road-battle_loop.wav', volume: 0.17, loop: true },
      { src: 'assets/audio/battle/old-road-battle_loop.wav', volume: 0.17, loop: true }
    ]);
  });
});
