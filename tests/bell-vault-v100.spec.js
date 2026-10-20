const { test, expect } = require('@playwright/test');

async function openTitle(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }' });
  await expect(page.locator('.v120-title')).toBeVisible();
}

async function createTraveler(page) {
  await openTitle(page);
  await page.getByRole('button', { name: /Begin Your Journey/i }).click();
  await expect(page.locator('.v140-creation-brand img')).toHaveAttribute('src', /\.png(?:\?.*)?$/);
  await expect(page.locator('.v140-creation-brand .v150-logo-lockup')).toHaveAttribute('aria-label', 'LEGEND: The Awakening');
  await page.locator('#v094Name').fill('VaultExplorerQA');
  await page.locator('#v094Next').click();
  await page.locator('[data-gender="unspoken"]').click();
  await page.locator('#v094Next').click();
  await page.locator('[data-personality="kind"]').click();
  await page.locator('#v094Next').click();
  await page.locator('[data-origin]').first().click();
  await page.locator('#v094Next').click();
  await page.getByRole('button', { name: /Ranger Better road sense, scouting, and fleeing/i }).click();
  await page.locator('#v094Next').click();
  await page.locator('[data-keepsake="Old Map"]').click();
  await page.locator('#v094Next').click();
  await expect(page.getByRole('heading', { name: 'VaultExplorerQA', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Let Me Wake/i }).click();
  await expect(page.getByRole('heading', { name: 'Beneath the Dead Lantern' })).toBeVisible();

  await page.evaluate(() => {
    const player = window.LegendRuntimeV120.loadPlayer();
    window.LegendRoadOpeningV140.complete(player, 'abandoned');
    player.flags.firstRoadReturnSeen = false;
    player.currentRegion = 'Ashmere';
    player.town = 'Ashmere';
    window.LegendRuntimeV120.savePlayer(player);
    window.LegendAshmereV099.renderAshmere();
  });
  await expect(page.locator('.ash100-town')).toBeVisible();
}

test('first secured road return unlocks the Bell Cellar, with gear-sensitive rooms and safe tactical retreat', async ({ page }) => {
  await createTraveler(page);

  await expect(page.getByRole('button', { name: /The Bell Cellar/i })).toHaveCount(0);
  await page.evaluate(() => {
    const player = window.LegendRuntimeV120.loadPlayer();
    player.flags.firstRoadReturnSeen = true;
    window.LegendRuntimeV120.savePlayer(player);
    window.LegendAshmereV099.renderAshmere();
  });

  await expect(page.getByRole('button', { name: /The Bell Cellar/i })).toBeVisible();
  await page.getByRole('button', { name: /The Bell Cellar/i }).click();
  await expect(page.locator('.bell-vault-banner h1')).toHaveText('The Bell Cellar');
  await page.locator('#vaultBegin').click();
  await expect(page.locator('.bell-vault-room-heading')).toContainText('ROOM 1 / 4');
  await page.locator('#vaultDescend').click();

  await expect(page.locator('.bell-vault-room-heading')).toContainText('ROOM 2 / 4');
  await expect(page.locator('.bell-vault-loadout')).toContainText('WEAPON');
  await expect(page.locator('.bell-vault-loadout')).toContainText('ARMOR');
  await page.locator('#vaultReadGlyphs').click();
  await expect(page.locator('.bell-vault-banner h1')).toHaveText('The Drowned Reliquary');

  const gate = await page.evaluate(() => {
    const run = window.LegendRuntimeV120.loadPlayer().flags.bellVaultV100;
    return { room: run.room, gateApproach: run.gateApproach, gatePassed: run.gatePassed };
  });
  expect(gate).toMatchObject({ room: 2, gateApproach: 'read', gatePassed: true });

  await page.locator('#vaultCopyRunes').click();
  await expect(page.locator('.bell-vault-banner h1')).toHaveText('The Drowned Reliquary');
  await expect(page.locator('.bell-vault-keeper-card')).toContainText('Mirebound Sentinel');
  await page.locator('#vaultFight').click();
  await expect(page.locator('.rpg-battle')).toBeVisible();
  await expect(page.locator('.rpg-battle')).toContainText('Mirebound Sentinel');
  await expect(page.locator('.rpg-combat-status')).toContainText('VaultExplorerQA');

  const inBattle = await page.evaluate(() => {
    const run = window.LegendRuntimeV120.loadPlayer().flags.bellVaultV100;
    return { active: run.active, inBattle: run.inBattle, room: run.room };
  });
  expect(inBattle).toMatchObject({ active: true, inBattle: true, room: 2 });

  await page.locator('#flee').click();
  await expect(page.locator('.ash100-town')).toBeVisible();
  const afterRetreat = await page.evaluate(() => {
    const player = window.LegendRuntimeV120.loadPlayer();
    const run = player.flags.bellVaultV100;
    return { active: run.active, inBattle: run.inBattle, failed: run.failed, retreats: run.retreats, hp: player.hp };
  });
  expect(afterRetreat).toMatchObject({ active: false, inBattle: false, failed: false, retreats: 1, hp: expect.any(Number) });

  await page.getByRole('button', { name: /The Bell Cellar/i }).click();
  await expect(page.locator('#vaultBegin')).toBeVisible();
});

test('claiming the first Bell Cellar clear equips the Reinforced Buckle for +6 Defense', async ({ page }) => {
  await createTraveler(page);
  await page.evaluate(() => {
    const player = window.LegendRuntimeV120.loadPlayer();
    player.flags.firstRoadReturnSeen = true;
    player.flags.bellVaultV100 = {
      active: true, room: 3, battleWon: true, tookFragment: false, clears: 0,
      attempts: 1, inBattle: false, rewardClaimed: false, records: []
    };
    window.LegendRuntimeV120.savePlayer(player);
    window.LegendAshmereV099.route('dungeon');
  });

  await expect(page.locator('.bell-vault-banner h1')).toHaveText('The Bell Chamber');
  await page.locator('#vaultCollect').click();
  await expect(page.locator('.bell-vault-banner h1')).toHaveText('The Cellar Remembers');
  await expect(page.locator('.bell-vault-v100')).toContainText('Reinforced Buckle (+6 Defense, automatically equipped)');

  const upgrade = await page.evaluate(() => {
    const player = window.LegendRuntimeV120.loadPlayer();
    const rules = window.LegendRoadStateV100.create({
      getData: () => window.LEGEND_DATA,
      clamp: (value, min, max) => Math.max(min, Math.min(max, value))
    });
    return {
      defense: rules.armor(player).defense,
      armorName: rules.armor(player).name,
      buckleCount: player.inventory.reinforcedBuckle,
      equipped: player.flags.bellVaultV100.reinforcedBuckleEquipped,
      clears: player.flags.bellVaultV100.clears
    };
  });
  expect(upgrade).toMatchObject({
    defense: 6,
    armorName: 'No Armor + Reinforced Buckle',
    buckleCount: 1,
    equipped: true,
    clears: 1
  });

  await page.locator('#vaultRetry').click();
  await expect(page.locator('#vaultDescend')).toBeVisible();
  const retainedDefense = await page.evaluate(() => {
    const player = window.LegendRuntimeV120.loadPlayer();
    const rules = window.LegendRoadStateV100.create({
      getData: () => window.LEGEND_DATA,
      clamp: (value, min, max) => Math.max(min, Math.min(max, value))
    });
    return rules.armor(player).defense;
  });
  expect(retainedDefense).toBe(6);
});
