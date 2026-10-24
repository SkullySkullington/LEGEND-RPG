const { test, expect } = require('@playwright/test');

test.describe('LEGEND level-up and road results v0.23.0', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#legend-boot-screen')).toBeHidden({ timeout: 10000 });
  });

  test('a level grants spendable points that persist after choosing attributes', async ({ page }) => {
    await page.evaluate(() => {
      window.LegendStorage.deleteSaves();
      const player = {
        version: window.LEGEND_DATA.VERSION,
        username: 'Growth QA',
        gender: 'unspoken',
        genderLabel: 'Unspoken',
        pronouns: 'they/them',
        personality: 'kind',
        personalityLabel: 'Kind',
        world: 'Eldermere',
        town: 'Ashmere',
        origin: 'Lost Squire',
        className: 'Ranger',
        keepsake: 'Old Map',
        level: 1,
        hp: 20,
        maxHp: 50,
        xp: 99,
        gold: 10,
        weapon: 'hand',
        armor: 'none',
        ownedWeapons: { hand: 1 },
        ownedArmor: { none: 1 },
        inventory: { food: 1, potion: 1 },
        bank: [0, 0, 0, 0, 0],
        stats: {},
        flags: {},
        traits: [],
        skills: {},
        mastery: {}
      };
      window.__growthQAPlayer = player;
      window.__growthQASummary = window.LegendProgressionV100.award(player, 1);
    });

    await expect(page.getByRole('dialog', { name: 'Level 2' })).toBeVisible();
    await expect(page.locator('#v152-growth-total')).toHaveText('2');
    await expect(page.locator('#v152-growth-confirm')).toBeDisabled();

    await page.locator('[data-attr-add="might"]').click();
    await page.locator('[data-attr-add="endurance"]').click();
    await expect(page.locator('#v152-growth-spent')).toHaveText('2');
    await expect(page.locator('#v152-growth-confirm')).toBeEnabled();
    await page.locator('#v152-growth-confirm').click();

    await expect(page.locator('#legendLevelUpOverlay')).toHaveCount(0);
    const persisted = await page.evaluate(() => {
      const saved = window.LegendRuntimeV120.loadPlayer();
      const player = window.__growthQAPlayer;
      return {
        level: player.level,
        summary: window.__growthQASummary,
        hp: player.hp,
        maxHp: player.maxHp,
        attributes: player.attributesV152,
        pending: player.pendingStatPointsV152,
        savedAttributes: saved?.attributesV152,
        savedPending: saved?.pendingStatPointsV152
      };
    });
    expect(persisted.level).toBe(2);
    expect(persisted.summary).toMatchObject({ gained: 1, levels: 1, level: 2, xp: 0, next: 200 });
    expect(persisted.hp).toBe(31);
    expect(persisted.maxHp).toBe(61);
    expect(persisted.attributes).toEqual({ might: 1, agility: 0, arcana: 0, endurance: 1, insight: 0, fortune: 0 });
    expect(persisted.pending).toBe(0);
    expect(persisted.savedAttributes).toEqual(persisted.attributes);
    expect(persisted.savedPending).toBe(0);
  });

  test('combat results expose rewards and the continue action instead of replacing victory with a log line', async ({ page }) => {
    await page.evaluate(() => {
      let continued = 0;
      let returned = 0;
      window.__resultCallbacks = {
        continue: () => { continued += 1; },
        return: () => { returned += 1; },
        counts: () => ({ continued, returned })
      };
      window.__resultViewQA = window.LegendRoadCombatResultsViewV152.create({
        renderShell: html => { document.getElementById('root').innerHTML = html; },
        getAssets: () => window.LegendAssetsV090,
        escapeHtml: value => String(value ?? '').replace(/[&<>'"]/g, ch => ({
          '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[ch])),
        onContinue: () => window.__resultCallbacks.continue(),
        onReturnToTown: () => window.__resultCallbacks.return()
      });
      window.__resultViewQA.render({
        result: 'victory',
        player: { username: 'Field QA', className: 'Ranger', level: 2, hp: 40, maxHp: 50 },
        enemy: { name: 'Road Goblin' },
        progress: { gained: 29, levels: 1, level: 2 },
        rewardName: 'Furs',
        goldGained: 8,
        routeStage: 2
      });
    });

    await expect(page.getByRole('main', { name: 'Battle victory results' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Victory' })).toBeVisible();
    await expect(page.locator('.v152-results-rewards')).toContainText('Furs');
    await expect(page.locator('.v152-results-rewards')).toContainText('+29');
    await expect(page.locator('.v152-result-level-note')).toContainText('Level 1 → level 2');
    await page.locator('#v152CombatContinue').click();
    expect(await page.evaluate(() => window.__resultCallbacks.counts())).toEqual({ continued: 1, returned: 0 });

    await page.evaluate(() => window.__resultViewQA.render({
      result: 'defeat',
      player: { username: 'Field QA', className: 'Ranger', level: 2, hp: 1, maxHp: 50 },
      enemy: { name: 'Road Goblin' },
      progress: { gained: 0, levels: 0, level: 2 },
      rewardName: '',
      goldGained: 0,
      routeStage: 0
    }));
    await expect(page.getByRole('heading', { name: 'Driven Back' })).toBeVisible();
    await page.locator('#v152CombatReturn').click();
    expect(await page.evaluate(() => window.__resultCallbacks.counts())).toEqual({ continued: 1, returned: 1 });
  });
});
