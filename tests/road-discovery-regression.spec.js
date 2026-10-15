const { test, expect } = require('@playwright/test');

async function startFreshCharacter(page) {
  await page.goto('/');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload();
  await page.addStyleTag({ content: `
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  ` });
  await expect(page.locator('.v120-title')).toBeVisible();
  await page.getByRole('button', { name: /Begin Your Journey/i }).click();
  await page.locator('#v094Name').fill('SingleClickQA');
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
  await expect(page.getByRole('heading', { name: 'SingleClickQA', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Begin the Road/i }).click();
  await page.getByRole('button', { name: /Enter Ashmere/i }).click();
  await expect(page.locator('.ash100-town')).toBeVisible();
}

test('a single ordinary tap opens and resolves a road discovery', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await startFreshCharacter(page);
  await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Routes/i }).click();
  await page.getByRole('button', { name: /The Old Road/i }).click();
  await expect(page.locator('.exp100-scene-live')).toBeVisible();
  await page.locator('#routeReeds').click();
  await page.locator('#push').click();
  await expect(page.locator('.exp100-scene-live')).toHaveAttribute('data-stage', '1');

  const hotspot = page.locator('.exp100-hotspot-find');
  await expect(hotspot).toBeVisible();
  // Intentionally use one standard browser click. No forced click, dispatchEvent,
  // or retry should be needed for the player-facing interaction to work.
  await hotspot.click();
  const discovery = page.locator('.exp100-discovery-beat');
  await expect(discovery).toBeVisible();
  await expect(discovery).toContainText(/Tracks Beneath the Blue Light/i);

  await page.locator('#poiInspect').click();
  await expect(page.locator('.exp100-head')).toContainText(/Road Pressure rises by 4/i);
  const after = await page.evaluate(() => {
    const p = window.LegendRuntimeV080.loadPlayer();
    return {
      herbs: Number(p.inventory?.roadHerb || 0),
      discovered: Number(p.stats?.pointsOfInterest || 0),
      open: Boolean(p.flags?.roadExpeditionV100?.discoveryOpen)
    };
  });
  expect(after.herbs).toBeGreaterThanOrEqual(1);
  expect(after.discovered).toBe(1);
  expect(pageErrors).toEqual([]);
});
