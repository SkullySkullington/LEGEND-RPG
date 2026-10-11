const { test, expect } = require('@playwright/test');

// Each Playwright test runs in an isolated browser context, so clearing localStorage
// here only resets that test's synthetic traveler—not a player's live browser save.
async function openTitle(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page.locator('#enterRealm').click();
  await expect(page.getByRole('button', { name: /Begin Your Journey/i })).toBeVisible();
}

async function startFreshCharacter(page, name = 'QATraveler') {
  await openTitle(page);
  await page.getByRole('button', { name: /Begin Your Journey/i }).click();
  await page.locator('#v094Name').fill(name);
  await page.locator('#v094Next').click();
  await page.locator('[data-gender="unspoken"]').click();
  await page.locator('#v094Next').click();
  await page.locator('[data-personality="kind"]').click();
  await page.locator('#v094Next').click();
  await page.locator('[data-origin]').first().click();
  await page.locator('#v094Next').click();
  await page.locator('[data-class="Ranger"]').click();
  await page.locator('#v094Next').click();
  await page.locator('[data-keepsake="Old Map"]').click();
  await page.locator('#v094Next').click();
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Begin the Road/i }).click();
  await page.getByRole('button', { name: /Enter Ashmere/i }).click();
  await expect(page.locator('.ash100-town')).toBeVisible();
}

test.describe('LEGEND v0.20.4 browser regression tests', () => {
  test('title and visible build version are consistent', async ({ page }) => {
    await openTitle(page);
    await expect(page).toHaveTitle(/LEGEND: Roads of Ashmere v0\.20\.4/);
    await expect(page.locator('.portal-footer')).toContainText('v0.20.4');
  });


  test('title gate exposes one semantic prompt instead of a nested button role', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.reload();
    await expect(page.locator('.title-gate-card')).toBeVisible();
    await expect(page.locator('.title-gate-card[role="button"]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Press Any Key to Enter Ashmere/i })).toBeVisible();
    await page.locator('#enterRealm').click();
    await expect(page.locator('.v120-title')).toBeVisible();
  });

  test('title screen has a single cinematic brand and no duplicate traveler card', async ({ page }) => {
    await openTitle(page);
    await expect(page.locator('.v120-title')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'LEGEND', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Roads of Ashmere/i })).toBeVisible();
    await expect(page.locator('.portal100-traveler')).toHaveCount(0);
    await expect(page.locator('#newPrimary')).toBeVisible();
    await expect(page.locator('#new')).toHaveCount(0);
  });

  test('Greyfen hub changes identity and destinations after regional travel', async ({ page }) => {
    await startFreshCharacter(page, 'GreyfenQA');
    await page.evaluate(() => {
      const rt=window.LegendRuntimeV080;
      const pl=rt.loadPlayer();
      pl.currentRegion='Greyfen';
      pl.inventory=pl.inventory||{};
      pl.inventory.roadToken=5;
      rt.savePlayer(pl);
      window.LegendAshmereV099.renderAshmere();
    });
    await expect(page.locator('.ash100-town')).toContainText('Greyfen');
    await expect(page.locator('.ash100-destinations')).toContainText('Reedlight Inn');
    await expect(page.locator('.ash100-destinations')).toContainText('Marsh Market');
    await expect(page.getByRole('navigation', { name: 'Greyfen town navigation' })).toBeVisible();
    await expect(page.locator('.ash100-bottom-panel')).toHaveCount(0);
  });

  test('Greyfen uses its own local scene and keeper dialogue', async ({ page }) => {
    await startFreshCharacter(page, 'GreyfenKeepersQA');
    await page.evaluate(() => {
      const rt=window.LegendRuntimeV080;
      const pl=rt.loadPlayer();
      pl.currentRegion='Greyfen';
      pl.inventory=pl.inventory||{};
      pl.inventory.roadToken=5;
      rt.savePlayer(pl);
      window.LegendAshmereV099.renderAshmere();
    });
    await expect(page.locator('.ash100-town-greyfen .ash100-hero img')).toHaveAttribute('src', /greyfen-town\.webp/);
    await page.locator('.ash100-destination[data-ash-view="people"]').click();
    await expect(page.locator('.ash099-head')).toContainText(/People of Greyfen/i);
    await expect(page.locator('.ash099-npc-grid')).toContainText(/Boundary Archivist/i);
    await page.locator('.ash099-npc-card[data-ash-view="mara"]').click();
    await expect(page.locator('.ash099-head')).toContainText(/Boundary Archivist/i);
    await expect(page.locator('.ash099-screen')).toContainText(/drowned records/i);
  });

  test('Greyfen route board avoids starting the Ashmere Old Road expedition', async ({ page }) => {
    await startFreshCharacter(page, 'GreyfenRoutesQA');
    await page.evaluate(() => {
      const rt=window.LegendRuntimeV080;
      const pl=rt.loadPlayer();
      pl.currentRegion='Greyfen';
      pl.inventory=pl.inventory||{};
      pl.inventory.roadToken=5;
      rt.savePlayer(pl);
      window.LegendAshmereV099.renderAshmere();
    });
    await page.getByRole('navigation', { name: 'Greyfen town navigation' }).getByRole('button', { name: /Routes/i }).click();
    await expect(page.locator('.ash099-head')).toContainText(/Lowland Crossings/i);
    await expect(page.locator('[data-ash-view="road"]')).toHaveCount(0);
    await expect(page.locator('[data-ash-view="regions"]')).toBeVisible();
  });

  test('blank traveler name shows inline validation without leaving creation', async ({ page }) => {
    await openTitle(page);
    await page.getByRole('button', { name: /Begin Your Journey/i }).click();
    await page.locator('#v094Next').click();
    await expect(page.locator('#v094NameError')).toHaveText('Please enter a traveler name.');
    await expect(page.getByRole('heading', { name: 'Who reaches Ashmere?' })).toBeVisible();
    await expect(page.locator('#v094Name')).toHaveAttribute('aria-invalid', 'true');
  });

  test('new traveler reaches Ashmere', async ({ page }) => {
    await startFreshCharacter(page, 'AshmereQA');
    await expect(page.locator('.ash100-town')).toContainText('Ashmere');
    await expect(page.locator('.ash100-town')).toContainText('AshmereQA');
    await expect(page.getByRole('navigation', { name: 'Ashmere terminal navigation' })).toBeVisible();
  });

  test('Routes opens route board instead of starting an expedition', async ({ page }) => {
    await startFreshCharacter(page, 'RoutesQA');
    await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Routes/i }).click();
    await expect(page.getByRole('heading', { name: 'Routes & Expeditions' })).toBeVisible();
    await expect(page.getByRole('button', { name: /The Old Road/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Road Network/i })).toBeVisible();
    await expect(page.locator('.ash100-town')).toHaveCount(0);
  });

  test('Road Network opens regional map and stays on map', async ({ page }) => {
    await startFreshCharacter(page, 'MapQA');
    await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Routes/i }).click();
    await page.getByRole('button', { name: /Road Network/i }).click();
    await expect(page.getByRole('heading', { name: 'Roads & Regions' })).toBeVisible();
    await expect(page.getByText('Greyfen', { exact: true })).toBeVisible();
    await expect(page.getByText('Ironpass', { exact: true })).toBeVisible();
    await expect(page.locator('.ash100-town')).toHaveCount(0);
  });

  test('Profile opens account screen without falling back to town', async ({ page }) => {
    await startFreshCharacter(page, 'ProfileQA');
    await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Profile/i }).click();
    await expect(page.getByText(/LEGEND ACCOUNT/i)).toBeVisible();
    await expect(page.getByText(/ASHMERE ACCOUNT/i)).toBeVisible();
    await expect(page.locator('.ash100-town')).toHaveCount(0);
  });

  test('desktop viewport has no horizontal overflow at title and town', async ({ page }) => {
    await openTitle(page);
    let overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(overflow).toBe(false);
    await startFreshCharacter(page, 'DesktopQA');
    overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(overflow).toBe(false);
  });

  test('town job awards gold, favor, and progression XP', async ({ page }) => {
    await startFreshCharacter(page, 'JobQA');
    await page.locator('.ash100-destinations').getByRole('button', { name: /Town Hall/i }).click();
    await expect(page.getByRole('heading', { name: 'Work Board' })).toBeVisible();
    await page.locator('[data-job-open="wood"]').click();
    await page.locator('#jobStrike').click();
    await expect(page.locator('#jobResult')).toBeVisible();
    await expect(page.locator('#jobResult')).toContainText(/Earned \d+g/);
    await expect(page.locator('#jobResult')).toContainText(/XP \+\d+/);
    await expect(page.locator('#jobStrike')).toHaveText('Job Complete');
  });

  test('character creation choices are clearly selected and progress is explained', async ({ page }) => {
    await openTitle(page);
    await page.getByRole('button', { name: /Begin Your Journey/i }).click();
    await page.locator('#v094Name').fill('ChoiceQA');
    await page.locator('#v094Next').click();
    await expect(page.locator('.v094-stepper')).toContainText('STEP 2 OF 7');
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.locator('#v094Next').click();
    await expect(page.locator('#v094ChoiceError')).toBeVisible();
    const identity = page.locator('[data-gender="unspoken"]');
    await identity.click();
    await expect(page.locator('[data-gender="unspoken"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.v094-choice.is-selected')).toContainText('Keep It Unspoken');
    await expect(pageErrors).toEqual([]);
    await page.locator('#v094Next').click();
    const personality = page.locator('[data-personality="kind"]');
    await personality.click();
    await expect(page.locator('[data-personality="kind"]')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#v094Next').click();
    await page.locator('#v094Back').click();
    await expect(page.locator('[data-personality="kind"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(pageErrors).toEqual([]);
  });

  test('Ranger expedition encounter presents its distinct class technique', async ({ page }) => {
    await startFreshCharacter(page, 'BattleQA');
    await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Routes/i }).click();
    await page.getByRole('button', { name: /The Old Road/i }).click();
    for (let i = 0; i < 5; i++) {
      const push = page.locator('#push');
      if (await push.count()) await push.click();
    }
    await expect(page.locator('.exp100-combat')).toBeVisible();
    await expect(page.locator('#skill')).toContainText('Trap Shot');
    await expect(page.locator('.exp100-intent')).toContainText('Enemy intent');
    await expect(page.locator('#guard')).toContainText('Guard');
  });

  test('Old Road fork offers a persistent risk-reward route choice', async ({ page }) => {
    await startFreshCharacter(page, 'ForkQA');
    await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Routes/i }).click();
    await page.getByRole('button', { name: /The Old Road/i }).click();
    await expect(page.locator('#routeRidge')).toBeVisible();
    await expect(page.locator('#routeReeds')).toBeVisible();
    await expect(page.locator('#routeRidge')).toContainText(/Safer/i);
    await expect(page.locator('#routeReeds')).toContainText(/Riskier/i);
    await page.locator('#routeReeds').click();
    await expect(page.locator('.exp100-route-choice')).toHaveCount(0);
    await expect(page.locator('.exp100-poi-done')).toContainText('Reed Cut');
    await expect(page.locator('.exp100-head')).toContainText(/Gain 1 Bell Fragment/i);
    await expect(page.locator('#routeReeds')).toHaveCount(0);
    await page.locator('#push').click();
    await expect(page.locator('.exp100-head')).toContainText(/Reed Cut narrows behind you/i);
    await expect(page.locator('.exp100-head')).toContainText(/Road Pressure rises by 16/i);
    await expect(page.locator('#poiInspect')).toHaveCount(0);
    await page.locator('.exp100-hotspot-find').click();
    await expect(page.locator('.exp100-discovery-beat')).toContainText(/Tracks Beneath the Blue Light/i);
    await page.locator('#poiInspect').click();
    await expect(page.locator('.exp100-head')).toContainText(/Road Pressure rises by 4/i);
  });

  test('High Ridge keeps the next stretch calmer than the Reed Cut', async ({ page }) => {
    await startFreshCharacter(page, 'RidgeQA');
    await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Routes/i }).click();
    await page.getByRole('button', { name: /The Old Road/i }).click();
    await page.locator('#routeRidge').click();
    await expect(page.locator('.exp100-head')).toContainText(/Road Pressure falls by 8/i);
    await page.locator('#push').click();
    await expect(page.locator('.exp100-head')).toContainText(/arrive at Lantern Ditch/i);
    await expect(page.locator('.exp100-head')).toContainText(/High Ridge pays off/i);
    await expect(page.locator('.exp100-head')).toContainText(/Road Pressure rises by only 4/i);
    await expect(page.locator('#poiInspect')).toHaveCount(0);
    await page.locator('.exp100-hotspot-find').click();
    await expect(page.locator('.exp100-discovery-beat')).toContainText(/Ridgeway Cairn/i);
    await page.locator('#poiInspect').click();
    await expect(page.locator('.exp100-head')).toContainText(/Road Pressure falls by 3/i);
  });


  test('road discovery stays hidden until the player notices it', async ({ page }) => {
    await startFreshCharacter(page, 'DiscoveryQA');
    await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Routes/i }).click();
    await page.getByRole('button', { name: /The Old Road/i }).click();
    await expect(page.locator('#poiInspect')).toHaveCount(0);
    await expect(page.locator('.exp100-hotspot-find')).toContainText('Look closer');
    await page.locator('.exp100-hotspot-find').click();
    await expect(page.locator('.exp100-discovery-beat')).toBeVisible();
    await page.locator('#poiLeave').click();
    await expect(page.locator('.exp100-discovery-beat')).toHaveCount(0);
    await expect(page.locator('#poiInspect')).toHaveCount(0);
  });

  test('route choice changes the later waystation scene text', async ({ page }) => {
    await startFreshCharacter(page, 'RouteEchoQA');
    await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Routes/i }).click();
    await page.getByRole('button', { name: /The Old Road/i }).click();
    await page.locator('#routeReeds').click();
    await page.locator('#push').click();
    await page.locator('.exp100-hotspot-find').click();
    await page.locator('#poiInspect').click();
    await page.locator('#push').click();
    await expect(page.locator('.exp100-head')).toContainText(/wet reeds cling to your boots/i);
    await expect(page.locator('.exp100-head')).toContainText(/something followed you out/i);
  });

  test('Trading Post uses Buy and Sell tabs with illustrated goods', async ({ page }) => {
    await startFreshCharacter(page, 'MarketUXQA');
    await page.locator('[data-ash-view="trader"]').click();
    await expect(page.locator('.ash099-market-console')).toBeVisible();
    await expect(page.locator('.ash099-market-item').first()).toBeVisible();
    await expect(page.locator('.ash099-market-item img').first()).toBeVisible();
    await page.locator('[data-market-tab="sell"]').click();
    await expect(page.locator('[data-market-tab="sell"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.ash099-empty-state')).toBeVisible();
    await page.locator('[data-market-tab="buy"]').click();
    await expect(page.locator('[data-market-tab="buy"]')).toHaveAttribute('aria-selected', 'true');
  });

  test('Blacksmith puts the equipped kit first and separates weapons from armor', async ({ page }) => {
    await startFreshCharacter(page, 'ForgeUXQA');
    await page.locator('[data-ash-view="smith"]').click();
    await expect(page.locator('.ash099-forge-loadout')).toBeVisible();
    await expect(page.locator('.ash099-forge-traveler')).toBeVisible();
    await expect(page.locator('.ash099-forge-grid')).toContainText(/Wooden Sword|Stone Sword/i);
    await page.locator('[data-forge-tab="armor"]').click();
    await expect(page.locator('[data-forge-tab="armor"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.ash099-forge-grid')).toContainText(/Cloth Armor|Chain Armor/i);
  });

  test('Traveler profile shows the class portrait, loadout, and pack instead of raw stats tiles', async ({ page }) => {
    await startFreshCharacter(page, 'TravelerUXQA');
    await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: 'Traveler' }).click();
    await expect(page.locator('.ash099-traveler-profile')).toBeVisible();
    await expect(page.locator('.ash099-traveler-profile-portrait')).toBeVisible();
    await expect(page.locator('.ash099-profile-equipment-grid')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Pack' })).toBeVisible();
    await expect(page.locator('.ash099-stats')).toHaveCount(0);
  });

  test('mobile town has no horizontal overflow and navigation remains tappable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startFreshCharacter(page, 'MobileQA');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(overflow).toBe(false);
    const routes = page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Routes/i });
    const box = await routes.boundingBox();
    expect(box).not.toBeNull();
    expect(box.height).toBeGreaterThanOrEqual(40);
  });
});
