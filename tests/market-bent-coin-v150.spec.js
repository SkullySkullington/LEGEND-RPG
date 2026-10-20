const { test, expect } = require('@playwright/test');

test('Bent Coin keepsake improves individual and bulk market sale proceeds', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(() => {
    const player = { username:'MarketQA', keepsake:'Bent Coin', gold:0, currentRegion:'Ashmere', inventory:{ wolfFang:2 } };
    const root = document.getElementById('root');
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
      esc: window.LegendHtmlV120.escapeHtml,
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
    const itemPrice = Number(root.querySelector('[data-sell="wolfFang"]')?.dataset.value);
    const bulkBefore = root.querySelector('.ash099-market-wallet > div:nth-child(2) strong')?.textContent || '';
    root.querySelector('[data-sell="wolfFang"]')?.click();
    const afterSingleGold = player.gold;
    const afterSingleInventory = player.inventory.wolfFang;
    const bulkAfterSingle = root.querySelector('.ash099-market-wallet > div:nth-child(2) strong')?.textContent || '';
    root.querySelector('#sellAllLoot')?.click();
    const finalGold = player.gold;
    const finalInventory = player.inventory.wolfFang;
    player.keepsake = 'Rusty Charm';
    player.gold = 0;
    player.inventory.wolfFang = 2;
    window.LegendAshmereMarketV099.render(context, 'sell');
    return {
      itemPrice,
      bulkBefore,
      afterSingleGold,
      afterSingleInventory,
      bulkAfterSingle,
      finalGold,
      finalInventory,
      normalUnitPrice: Number(root.querySelector('[data-sell="wolfFang"]')?.dataset.value),
      normalBulkTotal: root.querySelector('.ash099-market-wallet > div:nth-child(2) strong')?.textContent || ''
    };
  });
  expect(result).toMatchObject({
    itemPrice: 13,
    afterSingleGold: 13,
    afterSingleInventory: 1,
    finalGold: 26,
    finalInventory: 0
  });
  expect(result.bulkBefore).toContain('26g');
  expect(result.bulkAfterSingle).toContain('13g');
  expect(result.normalUnitPrice).toBe(12);
  expect(result.normalBulkTotal).toContain('24g');
});
