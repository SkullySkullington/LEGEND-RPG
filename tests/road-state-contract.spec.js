const { test, expect } = require('@playwright/test');

test.describe('Old Road expedition state compatibility contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addScriptTag({ path: 'js/systems/road-state-v100.js' });
  });

  test('creates the existing default expedition state without changing its shape', async ({ page }) => {
    const result = await page.evaluate(() => {
      const player = {};
      const state = window.LegendRoadStateV100.state(player);
      return { flags: player.flags, sameReference: state === player.flags.roadExpeditionV100 };
    });

    expect(result.flags).toEqual({
      roadExpeditionV100: {
        stage: 0, pressure: 0, trips: 0, events: 0, finds: 0, battles: 0
      }
    });
    expect(result.sameReference).toBe(true);
  });

  test('normalizes stage and pressure to the established bounds while preserving other state', async ({ page }) => {
    const result = await page.evaluate(() => {
      const player = { flags: { roadExpeditionV100: {
        stage: 9, pressure: 140, trips: 3, events: 4, finds: 5, battles: 6, routeChoice: 'ridge'
      } } };
      const state = window.LegendRoadStateV100.ensure(player);
      return { state, sameReference: state === player.flags.roadExpeditionV100 };
    });

    expect(result.state).toEqual({
      stage: 5, pressure: 100, trips: 3, events: 4, finds: 5, battles: 6, routeChoice: 'ridge'
    });
    expect(result.sameReference).toBe(true);
  });

  test('clamps lower bounds without changing unrelated state fields', async ({ page }) => {
    const state = await page.evaluate(() => {
      const player = { flags: { roadExpeditionV100: { stage: -2, pressure: -8, trips: 1 } } };
      return window.LegendRoadStateV100.ensure(player);
    });

    expect(state.stage).toBe(0);
    expect(state.pressure).toBe(0);
    expect(state.trips).toBe(1);
  });
});
