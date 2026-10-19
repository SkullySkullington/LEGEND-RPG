const { test, expect } = require('@playwright/test');

test.describe('LegendRoadsV100 pure content resolver contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('applies route variants without mutating the source catalog', async ({ page }) => {
    const result = await page.evaluate(() => {
      const roads = window.LegendRoadsV100;
      const sourceScene = roads.oldRoad.scenes[2];
      const sourceSnapshot = JSON.stringify(sourceScene);
      const ridge = roads.resolveScene(2, 'ridge');
      const reeds = roads.resolveScene(2, 'reeds');
      const fallback = roads.resolveScene(-5, 'unknown');

      return {
        sourceName: sourceScene.name,
        sourceHasRidgeVariant: Boolean(sourceScene.routeVariants?.ridge),
        sourceHasReedVariant: Boolean(sourceScene.routeVariants?.reeds),
        sourceUnchanged: JSON.stringify(sourceScene) === sourceSnapshot,
        ridgeText: ridge.text,
        ridgeHasVariants: Object.prototype.hasOwnProperty.call(ridge, 'routeVariants'),
        reedsText: reeds.text,
        reedsHasVariants: Object.prototype.hasOwnProperty.call(reeds, 'routeVariants'),
        fallbackName: fallback.name
      };
    });

    expect(result.sourceName).toBe("Wayfarer's Camp");
    expect(result.sourceHasRidgeVariant).toBe(true);
    expect(result.sourceHasReedVariant).toBe(true);
    expect(result.sourceUnchanged).toBe(true);
    expect(result.ridgeText).toContain('High Ridge');
    expect(result.ridgeHasVariants).toBe(false);
    expect(result.reedsText).toContain('Reed Cut');
    expect(result.reedsHasVariants).toBe(false);
    expect(result.fallbackName).toBe('South Fork');
  });
});
