const { test, expect } = require('@playwright/test');

test('Bent Coin keepsake improves individual and bulk market sale proceeds', async ({ page }) => {
  await page.goto('/');
  const initial = await page.evaluate(() => {
    const player = { username:'MarketQA', keepsake:'Bent Coin', gold:0, currentRegion:'Ashmere', inventory:{ wolfFang:2 } };
    const root = document.getElementById('root');
    const esc = window.LegendHtmlV120.escapeHtml;
    const context = {
      getPlayer: () => player,
      savePlayer: () => {},
      getAssets: () => window.LegendAssetsV090 || {},
      getData: () => window.LEGEND_DATA,
      itemIcon: () => '',
      itemName: id => window.LEGEND_DATA.itemNames?.[id] || id,
      gold: value => String(value) + 'g',
      locationInterior: () => '',
      head: () => '',
      screen: (header, body) => { root.innerHTML = String(header || '') + String(body || ''); },
      esc,
      icon: () => '',
      canAfford: () => true,
      owned: (pl, id) => Number(pl.inventory?.[id] || 0),
      note: () => {},
      canCraft: () => false,
      needsMarkup: () => '',
      armorArt: () => '',
      weaponName: () => '',
      armorName: () => '',
      regionShopArt: () => ''
    };
    window.LegendAshmereMarketV099.render(context, 'sell');
    return {
      itemPrice: Number(root.querySelector('[data-sell="wolfFang"]')?.dataset.value),
      sellAllLabel: root.querySelector('#sellAllLoot')?.textContent,
      player,
      context
    };
  });
  expect(initial.itemPrice).toBe(13);
  expect(initial.sellAllLabel).toContain('26g');

  await page.locator('[data-sell="wolfFang"]').click();
  const afterSingle = await page.evaluate(() => ({
    gold: window.__marketQAPlayer?.gold,
    button: document.querySelector('#sellAllLoot')?.textContent
  }));
  // The page fixture itself owns this player through the render closure; after one sale,
  // the remaining one-item bulk price is also increased from 12g to 13g.
  expect(afterSingle.button).toContain('13g');

  const final = await page.evaluate(() => {
    const root = document.getElementById('root');
    root.querySelector('#sellAllLoot')?.click();
    return root.textContent;
  });
  expect(final).toContain('Purse');
});
