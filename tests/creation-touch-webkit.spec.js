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

  await page.evaluate(() => {
    window.__ashmereHandoffQA = {
      events: [], buttonHandlerCalls: 0, renderCalls: 0, runtimeReturnCalls: 0,
      originalButtonHandlerSource: '', buttonHandlerHadSource: false,
      storageAvailable: typeof window.LegendStorage,
      savePlayerAvailable: typeof window.LegendStorage?.savePlayer,
      loadPlayerAvailable: typeof window.LegendStorage?.loadPlayer
    };
    document.addEventListener('click', event => {
      if (event.target?.closest?.('#v094Next')) {
        window.__ashmereHandoffQA.events.push({
          trusted:event.isTrusted, target:event.target?.tagName, targetId:event.target?.id || '',
          defaultPrevented:event.defaultPrevented, phase:'capture'
        });
      }
    }, true);
    const button=document.getElementById('v094Next');
    const originalButtonHandler=button?.onclick;
    window.__ashmereHandoffQA.originalButtonHandlerSource = originalButtonHandler ? String(originalButtonHandler) : '';
    window.__ashmereHandoffQA.buttonHandlerHadSource = Boolean(originalButtonHandler);
    if(button&&originalButtonHandler){
      button.onclick=function(event){
        window.__ashmereHandoffQA.buttonHandlerCalls++;
        return originalButtonHandler.call(this,event);
      };
    }
    const controller=window.LegendAshmereV099;
    if(controller?.renderAshmere){
      const original=controller.renderAshmere;
      controller.renderAshmere=function(){
        window.__ashmereHandoffQA.renderCalls++;
        window.__ashmereHandoffQA.renderStateBefore={
          runtimePlayer:window.LegendRuntimeV080?.loadPlayer?.() ? {
            username:window.LegendRuntimeV080.loadPlayer().username,
            town:window.LegendRuntimeV080.loadPlayer().town,
            currentRegion:window.LegendRuntimeV080.loadPlayer().currentRegion,
            intro:window.LegendRuntimeV080.loadPlayer().flags?.introV094Complete
          } : null,
          rootBefore:document.getElementById('root')?.innerText?.slice(0,160)||''
        };
        return original.apply(this,arguments);
      };
    }
    const runtime=window.LegendRuntimeV080;
    if(runtime?.returnToAshmere){
      const original=runtime.returnToAshmere;
      runtime.returnToAshmere=function(){
        window.__ashmereHandoffQA.runtimeReturnCalls++;
        return original.apply(this,arguments);
      };
    }
  });

  await step('enter-ashmere', '#v094Next', async () => {
    await page.locator('#v094Next').click({timeout:7000});
  });
  await page.waitForTimeout(150);
  const handoff = await page.evaluate(() => {
    const rt=window.LegendRuntimeV080;
    const pl=rt?.loadPlayer?.();
    return {
      qa:window.__ashmereHandoffQA,
      rootText:document.getElementById('root')?.innerText?.slice(0,700)||'',
      rootHTML:document.getElementById('root')?.innerHTML?.slice(0,700)||'',
      townVisible:Boolean(document.querySelector('.ash100-town')),
      introVisible:Boolean(document.querySelector('.v094-beginning')),
      buttonSource:document.getElementById('v094Next')?.onclick ? String(document.getElementById('v094Next').onclick) : '',
      globalPlayer:rt?.loadPlayer?.() ? {username:rt.loadPlayer().username,town:rt.loadPlayer().town,intro:rt.loadPlayer().flags?.introV094Complete} : null,
      storageRawLength:localStorage.getItem(window.LEGEND_DATA?.SAVE_KEY||'')?.length||0,
      storageKey:window.LEGEND_DATA?.SAVE_KEY,
      storedPlayer:pl?{
        username:pl.username,town:pl.town,currentRegion:pl.currentRegion,
        intro:pl.flags?.introV094Complete,flags:pl.flags?.tutorialStep
      }:null,
      available:{
        legendAshmere:typeof window.LegendAshmereV099?.renderAshmere,
        legendRuntime:typeof rt?.returnToAshmere,
        legendTown:typeof window.LegendTownControllerV080?.renderTown,
        beginning:typeof window.LegendBeginningV094
      }
    };
  });
  console.log('WEBKIT_ASHMERE_HANDOFF ' + JSON.stringify({handoff, errors}));
  await expect(page.locator('.ash100-town')).toBeVisible({timeout:7000});
  expect(errors).toEqual([]);
});
