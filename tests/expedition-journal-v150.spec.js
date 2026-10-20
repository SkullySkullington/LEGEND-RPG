const { test, expect } = require('@playwright/test');

async function openTitle(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page.addStyleTag({ content: `
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  ` });
  await expect(page.locator('.v120-title')).toBeVisible();
}

async function startFreshTraveler(page) {
  await openTitle(page);
  await page.getByRole('button', { name: /Begin Your Journey/i }).click();
  await page.locator('#v094Name').fill('FieldJournalQA');
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
  await expect(page.getByRole('heading', { name: 'FieldJournalQA', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Let Me Wake/i }).click();
  await page.evaluate(() => {
    const player = window.LegendRuntimeV120.loadPlayer();
    window.LegendRoadOpeningV140.complete(player, 'abandoned');
    window.LegendAshmereV099.renderAshmere();
  });
  await expect(page.locator('.ash100-town')).toBeVisible();
}

test('expedition map and field journal preserve keyboard focus and recorded discoveries', async ({ page }) => {
  await startFreshTraveler(page);

  await page.getByRole('navigation', { name: 'Ashmere terminal navigation' })
    .getByRole('button', { name: /Routes/i }).click();
  await page.getByRole('button', { name: /The Old Road/i }).click();
  await expect(page.locator('.exp150-world-page')).toBeVisible();

  await page.locator('#routeRidge').click();
  await expect(page.locator('.exp150-world-page')).toContainText(/High Ridge chosen|choose the High Ridge/i);
  await page.locator('.exp100-hotspot-find').click();
  await expect(page.locator('.exp100-discovery-beat')).toBeVisible();
  await page.locator('#poiInspect').click();

  const journalButton = page.locator('#exp150OpenJournal');
  await journalButton.click();
  const journalDialog = page.getByRole('dialog', { name: 'Field journal' });
  await expect(journalDialog).toBeVisible();
  await expect(journalDialog).toContainText('What the road remembers');
  await expect(journalDialog).toContainText('The Split Milestone');
  const journalClose = page.getByRole('button', { name: 'Return to the road' });
  await expect(journalClose).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(journalClose).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(journalDialog).toBeHidden();
  await expect(journalButton).toBeFocused();

  const mapButton = page.locator('#exp150OpenMap');
  await mapButton.click();
  const mapDialog = page.getByRole('dialog', { name: 'Road map' });
  await expect(mapDialog).toBeVisible();
  await expect(mapDialog).toContainText('The road you know');
  const mapClose = page.getByRole('button', { name: 'Return to the road' });
  await mapClose.click();
  await expect(mapDialog).toBeHidden();
  await expect(mapButton).toBeFocused();

  await page.reload();
  const savedJournal = await page.evaluate(() => {
    const player = window.LegendRuntimeV120.loadPlayer();
    const journal = player?.flags?.roadFieldJournalV150;
    return {
      routes: journal?.routes || [],
      discoveries: journal?.discoveries || [],
      visitedPlaces: journal?.visitedPlaces || []
    };
  });
  expect(savedJournal.routes.some(entry => entry.title === 'High Ridge')).toBe(true);
  expect(savedJournal.discoveries.some(entry => entry.key === 'fork-marker' && entry.name === 'The Split Milestone')).toBe(true);
  expect(savedJournal.visitedPlaces).toContain('South Fork');
});
