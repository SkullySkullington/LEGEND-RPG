const { test, expect } = require('@playwright/test');

test.describe('LegendRoadActionsV100 compatibility contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('expedition kickoff resets trip-local state, increments trips, and applies wick-sensitive pressure', async ({ page }) => {
    const result = await page.evaluate(() => {
      const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
      const rules = window.LegendRoadStateV100.create({
        getData: () => window.LEGEND_DATA,
        clamp
      });

      function startWithWick(wickCount) {
        const player = {
          inventory: { wispLanternWick: wickCount },
          flags: {
            roadExpeditionV100: {
              stage: 4,
              pressure: 20,
              trips: 7,
              events: 9,
              finds: 3,
              battles: 2,
              routeChoice: 'reeds',
              poiUsed: { stalePoi: true },
              searchUsed: { staleSearch: true },
              readUsed: { staleRead: true }
            }
          }
        };
        let saves = 0;
        const actions = window.LegendRoadActionsV100.create({
          getPlayer: () => player,
          savePlayer: () => { saves += 1; },
          ensureState: rules.ensure,
          getRoadData: () => window.LegendRoadsV100.oldRoad,
          getScore: () => 0,
          addInventory: (target, item, amount) => {
            target.inventory = target.inventory || {};
            target.inventory[item] = Number(target.inventory[item] || 0) + Number(amount || 0);
          },
          pick: values => values?.[0] ?? null,
          randomInt: (minimum) => minimum,
          clamp,
          itemName: item => item,
          skillLabel: skill => skill,
          renderExpedition: () => {},
          combat: () => {},
          getAreaForStage: () => ({ name: 'Test Area', text: 'Test scene' })
        });
        const openingNote = actions.start();
        return {
          openingNote,
          state: { ...player.flags.roadExpeditionV100 },
          inventory: { ...player.inventory },
          firstRoadEvent: player.flags.firstRoadEvent,
          saves
        };
      }

      return {
        withWick: startWithWick(1),
        withoutWick: startWithWick(0)
      };
    });

    expect(result.withWick.openingNote).toContain('opening Road Pressure rises by only 3 instead of 8');
    expect(result.withWick.state).toMatchObject({
      stage: 0,
      pressure: 23,
      trips: 8,
      events: 9,
      finds: 3,
      battles: 2,
      routeChoice: null,
      poiUsed: {},
      searchUsed: {},
      readUsed: {}
    });
    expect(result.withWick.inventory.wispLanternWick).toBe(0);
    expect(result.withWick.firstRoadEvent).toBe(true);
    expect(result.withWick.saves).toBe(1);

    expect(result.withoutWick.openingNote).toContain('You leave Ashmere with a clear route');
    expect(result.withoutWick.state).toMatchObject({
      stage: 0,
      pressure: 28,
      trips: 8,
      events: 9,
      finds: 3,
      battles: 2,
      routeChoice: null,
      poiUsed: {},
      searchUsed: {},
      readUsed: {}
    });
    expect(result.withoutWick.inventory.wispLanternWick).toBe(0);
    expect(result.withoutWick.firstRoadEvent).toBe(true);
    expect(result.withoutWick.saves).toBe(1);
  });
});
