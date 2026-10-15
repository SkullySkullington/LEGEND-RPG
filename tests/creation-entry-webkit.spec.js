const { test, expect } = require('@playwright/test');

test('Mobile Safari can complete the final traveler creation handoff', async ({ page }) => {
  test.setTimeout(25_000);
  const pageErrors = [];
  const consoleErrors = [];
  const failedRequests = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('requestfailed', r => failedRequests.push({url:r.url(),failure:r.failure()?.errorText}));

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
  await page.locator('#v094Name').fill('WebKitCreationQA');
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
  await expect(page.getByRole('heading', { name:'WebKitCreationQA', exact:true })).toBeVisible();

  await page.evaluate(() => {
    window.__creationClickTrace = [];
    for (const type of ['pointerdown','pointerup','mousedown','mouseup','click']) {
      document.addEventListener(type, e => {
        if (!e.target?.closest?.('#v094Next')) return;
        window.__creationClickTrace.push({
          type,
          phase: 'capture',
          trusted: e.isTrusted,
          target: e.target?.tagName,
          targetId: e.target?.id || '',
          x: e.clientX,
          y: e.clientY,
          prevented: e.defaultPrevented
        });
      }, true);
      document.addEventListener(type, e => {
        if (!e.target?.closest?.('#v094Next')) return;
        window.__creationClickTrace.push({
          type,
          phase: 'bubble',
          trusted: e.isTrusted,
          target: e.target?.tagName,
          targetId: e.target?.id || '',
          x: e.clientX,
          y: e.clientY,
          prevented: e.defaultPrevented
        });
      }, false);
    }
  });
  const button = page.locator('#v094Next');
  const before = await page.evaluate(() => {
    const b = document.querySelector('#v094Next');
    const r = b.getBoundingClientRect();
    const x=r.left+r.width/2, y=r.top+r.height/2;
    const hit=document.elementFromPoint(x,y);
    return {
      rect:{x:r.x,y:r.y,width:r.width,height:r.height},
      viewport:{width:innerWidth,height:innerHeight,scrollX,scrollY},
      hit:{tag:hit?.tagName,id:hit?.id||'',className:typeof hit?.className==='string'?hit.className:''},
      buttonStyle:{position:getComputedStyle(b).position,transform:getComputedStyle(b).transform,zIndex:getComputedStyle(b).zIndex}
    };
  });
  console.log('WEBKIT_CREATION_BEFORE ' + JSON.stringify(before));
  try {
    await button.click({ timeout: 9000 });
  } catch (error) {
    const after = await page.evaluate(() => ({
      trace: window.__creationClickTrace,
      button: document.querySelector('#v094Next')?.outerHTML || null,
      screen: document.querySelector('.v094-beginning')?.innerText?.slice(-700) || null,
      town: Boolean(document.querySelector('.ash100-town')),
      active: document.activeElement?.outerHTML?.slice(0,250) || null
    })).catch(e=>({evaluateError:String(e)}));
    console.log('WEBKIT_CREATION_CLICK_FAILED ' + JSON.stringify({before,after,pageErrors,consoleErrors,failedRequests,error:String(error)}));
    throw error;
  }
  await expect(page.locator('.ash100-town')).toBeVisible({timeout:5000});
  const after = await page.evaluate(() => ({trace:window.__creationClickTrace,town:Boolean(document.querySelector('.ash100-town'))}));
  console.log('WEBKIT_CREATION_AFTER ' + JSON.stringify({before,after,pageErrors,consoleErrors,failedRequests}));
  expect(pageErrors).toEqual([]);
});
