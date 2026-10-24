const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const indexSource = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const bootSource = fs.readFileSync(path.join(__dirname, '../js/systems/boot-sequence-v140.js'), 'utf8');
const transitionSource = fs.readFileSync(path.join(__dirname, '../js/systems/scene-transitions-v120.js'), 'utf8');
const dataSource = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
const versionMatch = dataSource.match(/VERSION:\s*['"]v([^'"]+)['"]/);
if (!versionMatch) throw new Error('Could not read LEGEND_DATA.VERSION from js/data.js');
const version = versionMatch[1];

test.describe('LEGEND v' + version + ' startup and realm entrance', () => {
  test('startup curtain yields to the first scene after its minimum show time', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const boot = page.locator('#legend-boot-sequence');
    await expect(boot).toHaveCount(0, { timeout: 15000 });
    const metrics = await page.evaluate(() => window.__legendBootMetricsV140);
    expect(metrics).not.toBeNull();
    expect(metrics.completedAt - metrics.startedAt).toBeGreaterThanOrEqual(metrics.minimumDurationMs - 80);
    expect(metrics.scriptTotal).toBeGreaterThan(10);
    expect(metrics.scriptSettled).toBe(metrics.scriptTotal);
    expect(metrics.scriptFailures).toBe(0);
    expect(await page.evaluate(() => window.__legendRuntimeScriptsReadyV140)).toBe(true);
    await expect(page.locator('.title-v140-world')).toBeVisible();
    await expect(page.locator('.v140-world-console')).toBeVisible();
    await expect(page.locator('.v140-realm-feature')).toContainText(/Ashmere Vale|Greyfen Lowlands/i);
    await expect(page.locator('.v140-realm-node')).toHaveCount(2);
    expect(errors).toEqual([]);
  });

  test('loading curtain remains visible for a readable scene transition', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await expect(page.locator('#legend-boot-sequence')).toHaveCount(0, { timeout: 15000 });
    const elapsed = await page.evaluate(() => new Promise(resolve => {
      const started = performance.now();
      window.LegendSceneTransitionsV120.transitionTo('Preparing a destination scene', () => {});
      const poll = () => {
        const curtain = document.getElementById('legend-scene-curtain');
        if (curtain?.classList.contains('is-revealing')) resolve(performance.now() - started);
        else requestAnimationFrame(poll);
      };
      poll();
    }));
    expect(elapsed).toBeGreaterThanOrEqual(1450);
    await expect(page.locator('#legend-scene-curtain')).not.toHaveClass(/is-covering/);
  });

  test('startup shell loads before the runtime and retains the raster logo', () => {
    expect(indexSource.indexOf('js/systems/boot-sequence-v140.js')).toBeGreaterThanOrEqual(0);
    expect(indexSource.indexOf('js/systems/boot-sequence-v140.js')).toBeLessThan(indexSource.indexOf('js/data.js'));
    expect(indexSource.indexOf('js/systems/runtime-ready-v140.js')).toBeGreaterThan(indexSource.indexOf('js/systems/scene-transitions-v120.js'));
    expect(indexSource).toContain('css/boot-sequence-v140.css');
    expect(indexSource).toContain('css/title-world-console-v140.css');
    expect(indexSource).toContain('logo_legend_awakening_wordmark.png');
    expect(bootSource).toContain('MIN_DURATION_MS = 3200');
    expect(bootSource).toContain('!window.__legendRuntimeScriptsReadyV140');
    expect(indexSource).toContain('js/systems/runtime-ready-v140.js');
    expect(transitionSource).toContain('1650 - (Date.now() - startedAt)');
    expect(transitionSource).toContain('transitionArt(target, destinationLabel(target))');
  });
});
