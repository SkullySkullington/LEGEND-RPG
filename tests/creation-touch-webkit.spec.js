const { test, expect } = require('@playwright/test');

test('Mobile Safari can complete traveler creation with touch-stable choices', async ({ page }) => {
  test.setTimeout(90_000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

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

  const inspect = async selector => page.evaluate(selector => {
    const el = document.querySelector(selector);
    if (!el) return { selector, found:false };
    const rect = el.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width/2, rect.top + rect.height/2);
    const style = getComputedStyle(el);
    return {
      selector, found:true, rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},
      viewport:{width:innerWidth,height:innerHeight,scrollY},
      hit:{tag:hit?.tagName,id:hit?.id||'',className:typeof hit?.className==='string'?hit.className:''},
      transform:style.transform, transition:style.transition, animation:style.animation,
      active:document.activeElement?.outerHTML?.slice(0,140)||''
    };
  }, selector);

  async function step(label, targetSelector, action) {
    console.log('WEBKIT_STEP_BEGIN ' + label + ' ' + JSON.stringify(await inspect(targetSelector)));
    try {
      await action();
      console.log('WEBKIT_STEP_OK ' + label);
    } catch (e) {
      console.log('WEBKIT_STEP_FAIL ' + label + ' ' + JSON.stringify({
        snapshot:await inspect(targetSelector).catch(err=>({error:String(err)})),
        screen:await page.locator('.v094-beginning').innerText().catch(()=>null),
        errors, failure:String(e)
      }));
      throw e;
    }
  }

  await step('begin', '.v120-title', async () => {
    await page.getByRole('button',{name:/Begin Your Journey/i}).click({timeout:7000});
  });
  await step('name-next', '#v094Next', async () => {
    await page.locator('#v094Name').fill('WebKitTouchQA');
    await page.locator('#v094Next').click({timeout:7000});
  });
  await step('gender-option', '[data-gender="unspoken"]', async () => {
    await page.locator('[data-gender="unspoken"]').click({timeout:7000});
  });
  await step('gender-next', '#v094Next', async () => {
    await page.locator('#v094Next').click({timeout:7000});
  });
  await step('personality-option', '[data-personality="kind"]', async () => {
    await page.locator('[data-personality="kind"]').click({timeout:7000});
  });
  await step('personality-next', '#v094Next', async () => {
    await page.locator('#v094Next').click({timeout:7000});
  });
  await step('origin-option', '[data-origin]', async () => {
    await page.locator('[data-origin]').first().click({timeout:7000});
  });
  await step('origin-next', '#v094Next', async () => {
    await page.locator('#v094Next').click({timeout:7000});
  });
  await step('class-option', '[data-class="Ranger"]', async () => {
    await page.locator('[data-class="Ranger"]').click({timeout:7000});
  });
  await step('class-next', '#v094Next', async () => {
    await page.locator('#v094Next').click({timeout:7000});
  });
  await step('keepsake-option', '[data-keepsake="Old Map"]', async () => {
    await page.locator('[data-keepsake="Old Map"]').click({timeout:7000});
  });
  await step('keepsake-next', '#v094Next', async () => {
    await page.locator('#v094Next').click({timeout:7000});
  });
  await expect(page.getByRole('heading',{name:'WebKitTouchQA',exact:true})).toBeVisible();

  await step('enter-ashmere', '#v094Next', async () => {
    await page.locator('#v094Next').click({timeout:7000});
  });
  await expect(page.locator('.ash100-town')).toBeVisible({timeout:7000});
  expect(errors).toEqual([]);
});
