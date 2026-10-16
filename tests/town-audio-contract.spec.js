const { test, expect } = require('@playwright/test');

test.describe('Ashmere town audio adapter compatibility contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addScriptTag({ path: 'js/systems/town-audio-v100.js' });
  });

  test('binds town controls once and preserves hover/confirm cue paths and volumes', async ({ page }) => {
    const result = await page.evaluate(() => {
      const played = [];
      window.Audio = function (src) {
        this.src = src;
        this.volume = 1;
        this.play = () => {
          played.push({ src: this.src, volume: this.volume });
          return Promise.resolve();
        };
      };
      const host = document.createElement('div');
      host.innerHTML = '<button id="sample">Sample</button>';
      document.body.appendChild(host);
      const adapter = window.LegendTownAudioV100;
      adapter.bindUiAudio(host);
      adapter.bindUiAudio(host);
      const button = host.querySelector('button');
      button.dispatchEvent(new Event('pointerenter'));
      button.click();
      return {
        hasApi: typeof adapter.bindUiAudio === 'function',
        boundMarker: button.dataset.legendAudioBound,
        played
      };
    });

    expect(result.hasApi).toBe(true);
    expect(result.boundMarker).toBe('1');
    expect(result.played).toEqual([
      { src: 'assets/audio/ui/ui_hover_soft.wav', volume: 0.1 },
      { src: 'assets/audio/ui/ui_confirm_gate.wav', volume: 0.18 }
    ]);
  });
});
