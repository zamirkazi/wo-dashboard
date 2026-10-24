const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  for (const w of [390, 768]) {
    const c = await b.newContext({ colorScheme:'light', viewport:{width:w,height:900} });
    const p = await c.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
    await p.goto('file://' + __dirname + '/index.html'); await p.waitForTimeout(900);
    console.log(w, '| scrollW', await p.evaluate(()=>document.documentElement.scrollWidth),
      '| errors', errs.length?errs:'none');
    if (w===390) await p.screenshot({path:'mob-390.png', fullPage:false});
    await c.close();
  }
  await b.close();
})();
