const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ colorScheme:'light', viewport:{width:1280,height:1000} });
  const p = await c.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://' + __dirname + '/index.html');
  await p.waitForTimeout(1500);
  await p.screenshot({ path:'c-all.png', clip:{x:0,y:0,width:1280,height:1500} });
  // click through each cohort and confirm nothing throws
  for (const sel of ['[data-c="institutional"]','[data-c="family-office"]','[data-c="all"]']) {
    await p.click(sel); await p.waitForTimeout(400);
    const live = await p.$eval('#livecount', e => e.textContent);
    const reps = await p.$eval('#replycount', e => e.textContent);
    console.log(sel, '-> live', live, '| replies', reps, '| errors', errs.length ? errs : 'none');
  }
  await p.click('[data-c="family-office"]'); await p.waitForTimeout(400);
  await p.screenshot({ path:'c-fo.png', clip:{x:0,y:0,width:1280,height:1400} });
  await b.close();
})();
