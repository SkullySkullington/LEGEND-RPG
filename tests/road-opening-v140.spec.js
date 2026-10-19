const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const indexSource = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const versionSource = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
const versionMatch = versionSource.match(/VERSION:\s*['"]v([^'"]+)['"]/);
if (!versionMatch) throw new Error('Could not read LEGEND_DATA.VERSION from js/data.js');
const version = versionMatch[1];

async function openTitle(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }' });
  await expect(page.locator('.v120-title')).toBeVisible();
  await expect(page.getByRole('button', { name: /Begin Your Journey/i })).toBeVisible();
}

async function createTravelerToLantern(page, name = 'VeilRoadQA') {
  await openTitle(page);
  await page.getByRole('button', { name: /Begin Your Journey/i }).click();
  await expect(page.getByText('A VOICE IN THE VEIL · ???')).toBeVisible();
  await page.locator('#v094Name').fill(name);
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
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Begin the Road/i }).click();
  await expect(page.getByRole('heading', { name: 'Beneath the Dead Lantern' })).toBeVisible();
}

test.describe('LEGEND v' + version + ' road-born opening', () => {
  test('the title News & Roadmap opens a real screen and returns to the title', async ({ page }) => {
    await openTitle(page);
    await expect(page.getByRole('button', { name: /News & Roadmap/i })).toBeVisible();
    await page.getByRole('button', { name: /News & Roadmap/i }).click();
    await expect(page.getByRole('heading', { name: 'News & Roadmap' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Development News' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The Roadmap' })).toBeVisible();
    await expect(page.locator('.dispatches-v140-card')).toHaveCount(6);
    await page.getByRole('button', { name: 'Return to Title' }).click();
    await expect(page.locator('.v120-title')).toBeVisible();
  });

  test('the Oric ambush teaches ACT then guides a full road expedition and secured return', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await createTravelerToLantern(page, 'FirstRoadQA');

    await expect(page.getByRole('group', { name: 'Your answer to Captain Oric' })).toBeVisible();
    await expect(page.locator('.ash100-town')).toHaveCount(0);
    await page.locator('[data-oric-response="honest"]').click();
    await expect(page.locator('.rpg-battle')).toBeVisible();
    await expect(page.locator('.rpg-battle')).toContainText('Blackroot Wolf');
    await expect(page.locator('.rpg-battle')).toContainText('Awaken');
    await expect(page.locator('#strike')).toBeDisabled();
    await expect(page.locator('#guard')).toBeDisabled();
    await expect(page.locator('#skill')).toContainText('Awaken');

    await page.locator('#skill').click();
    await expect(page.getByRole('heading', { name: 'Oric saw what you did.' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => {
      const p = window.LegendRuntimeV120.loadPlayer();
      return p.memories.some(m => m.includes('whispered “Awaken”')) &&
        p.stats.roadVictories === 1 && p.flags.openingRoadV140.awakened === true;
    })).toBe(true);

    await page.getByRole('button', { name: 'Follow the road' }).click();
    await expect(page.locator('.exp100-wrap')).toBeVisible();
    await expect(page.locator('.opening-road-v140-guide')).toContainText('The road forks');
    await expect(page.locator('#routeRidge')).toBeVisible();
    await expect(page.locator('#search')).toBeDisabled();
    await expect(page.locator('#push')).toBeDisabled();

    await page.locator('#routeRidge').click();
    await expect(page.locator('#push')).toBeDisabled();
    await page.locator('.exp100-hotspot-find').click();
    await expect(page.locator('#poiInspect')).toBeVisible();
    await page.locator('#poiInspect').click();
    await expect(page.locator('#search')).toBeEnabled();
    await page.locator('#search').click();
    await expect(page.locator('#push')).toBeEnabled();
    await page.locator('#push').click();
    await expect(page.locator('.exp100-head h1')).toHaveText('Lantern Ditch');
    await page.locator('#push').click();
    await expect(page.locator('.exp100-head h1')).toHaveText("Wayfarer's Camp");
    await expect(page.locator('.exp100-camp')).toBeVisible();

    await page.locator('#campRest').click();
    await expect(page.locator('.exp100-head')).toContainText('rest at Wayfarer');
    await page.locator('#push').click();
    await expect(page.locator('.exp100-head h1')).toHaveText('Blackroot Bend');
    await page.locator('#push').click();
    await expect(page.locator('.exp100-head h1')).toHaveText('Reedwatch Shelter');
    await page.locator('#push').click();
    await expect(page.locator('.exp100-head h1')).toHaveText('Greyfen Approach');
    await page.locator('#finish').click();
    await expect(page.getByRole('heading', { name: 'Expedition Secured' })).toBeVisible();

    const saved = await page.evaluate(() => {
      const player = window.LegendRuntimeV120.loadPlayer();
      return {
        completed: player.flags.openingRoadV140.completed,
        tutorialStep: player.flags.tutorialStep,
        roadToken: player.inventory.roadToken,
        discoveries: player.stats.pointsOfInterest,
        campsMade: player.stats.campsMade
      };
    });
    expect(saved).toMatchObject({ completed: true, tutorialStep: 'people', roadToken: 1, discoveries: 1, campsMade: 1 });
    await page.getByRole('button', { name: /Return to Ashmere/i }).click();
    await expect(page.locator('.ash100-town')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('an unfinished lantern conversation resumes safely after reload', async ({ page }) => {
    await createTravelerToLantern(page, 'OpeningResumeQA');
    await page.locator('[data-oric-response="peaceful"]').click();
    await expect(page.locator('.rpg-battle')).toBeVisible();
    await page.reload();
    await expect(page.locator('.v120-title')).toBeVisible();
    await page.getByRole('button', { name: /Continue Journey/i }).click();
    await expect(page.locator('.rpg-battle')).toBeVisible();
    await expect(page.locator('.rpg-battle')).toContainText('Awaken');
    const phase = await page.evaluate(() => window.LegendRuntimeV120.loadPlayer().flags.openingRoadV140.phase);
    expect(phase).toBe('combat');
  });

  test('new opening uses existing save key and production script order', async () => {
    expect(indexSource).toContain('js/systems/road-opening-v140.js');
    expect(indexSource).toContain('js/screens/title-dispatches-v140.js');
    expect(indexSource.indexOf('js/systems/road-controller-v100.js')).toBeLessThan(indexSource.indexOf('js/systems/road-opening-v140.js'));
    expect(indexSource).toContain('css/opening-road-v140.css');
    expect(indexSource).toContain('css/title-dispatches-v140.css');
    expect(indexSource).toContain("SAVE_KEY: 'legend-roads-of-ashmere-v09'");
  });
});
