const { test, expect } = require('@playwright/test');
const { version } = require('../package.json');

async function openTitle(page) {
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
  await expect(page.getByRole('button', { name: /Begin Your Journey/i })).toBeVisible();
}
async function startFreshCharacter(page, name) {
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
async function expectNoHorizontalOverflow(page) {
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  expect(widths.document, JSON.stringify(widths)).toBeLessThanOrEqual(widths.viewport + 1);
  expect(widths.body, JSON.stringify(widths)).toBeLessThanOrEqual(widths.viewport + 1);
}

test.describe('LEGEND mobile compatibility smoke tests', () => {
  test('title and character creation reach Ashmere without overflow', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: 390, height: 844 });
    await openTitle(page);
    await expect(page).toHaveTitle(`LEGEND: Roads of Ashmere v${version}`);
    await expect.poll(() => page.evaluate(() => window.LEGEND_DATA?.VERSION)).toBe(`v${version}`);
    await expectNoHorizontalOverflow(page);
    await page.getByRole('button', { name: /Begin Your Journey/i }).click();
    await page.locator('#v094Name').fill('MobileCreationQA');
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
    await expect(page.getByRole('heading', { name: 'MobileCreationQA', exact: true })).toBeVisible();
    await page.getByRole('button', { name: /Begin the Road/i }).click();
    await page.getByRole('button', { name: /Enter Ashmere/i }).click();
    await expect(page.locator('.ash100-town')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Ashmere terminal navigation' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });

  test('Work Board signal job accepts taps and fits the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startFreshCharacter(page, 'MobileWorkQA');
    await page.locator('.ash100-destinations').getByRole('button', { name: /Work Board/i }).click();
    await expect(page.locator('[data-job-open="wood"]')).toContainText(/Timing challenge/i);
    await expect(page.locator('[data-job-open="gate"]')).toContainText(/Read the signal/i);
    await expect(page.locator('[data-job-open="crates"]')).toContainText(/Memory sequence/i);
    await page.locator('[data-job-open="gate"]').click();
    await expect(page.locator('.ash099-job-mode-signal')).toBeVisible();
    await page.locator('[data-job-choice="0"]').click();
    await expect(page.locator('#jobResult')).toContainText(/recognize Oric/i);
    await expectNoHorizontalOverflow(page);
  });

  test('Old Road route and discovery respond to touch input', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startFreshCharacter(page, 'MobileRoadQA');
    await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Routes/i }).click();
    await page.getByRole('button', { name: /The Old Road/i }).click();
    await expect(page.locator('#routeRidge')).toBeVisible();
    await page.locator('#routeRidge').click();
    await page.locator('#push').click();
    await expect(page.locator('.exp100-head')).toContainText(/arrive at Lantern Ditch/i);
    await page.locator('.exp100-hotspot-find').click();
    await expect(page.locator('.exp100-discovery-beat')).toContainText(/Ridgeway Cairn/i);
    await page.locator('#poiInspect').click();
    await expect(page.locator('.exp100-head')).toContainText(/Road Pressure falls by 3/i);
    await expectNoHorizontalOverflow(page);
  });

  test('Road combat controls render and accept a touch action', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startFreshCharacter(page, 'MobileCombatQA');
    await page.evaluate(() => {
      const rt = window.LegendRuntimeV080;
      const pl = rt.loadPlayer();
      pl.flags = pl.flags || {};
      pl.flags.roadExpeditionV100 = { ...(pl.flags.roadExpeditionV100 || {}), stage: 0, pressure: 70, trips: 0, events: 0, finds: 0, battles: 0 };
      rt.savePlayer(pl);
    });
    await page.getByRole('navigation', { name: 'Ashmere terminal navigation' }).getByRole('button', { name: /Routes/i }).click();
    await page.getByRole('button', { name: /The Old Road/i }).click();
    await page.locator('#routeRidge').click();
    await page.locator('#push').click();
    await expect(page.locator('.exp100-combat')).toBeVisible();
    await expect(page.locator('.rpg-command-grid .rpg-command')).toHaveCount(4);
    await expect(page.locator('#strike')).toContainText('FIGHT');
    await expect(page.locator('#skill')).toContainText('ACT');
    await page.locator('#guard').click();
    await expect(page.locator('.exp100-combat')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
