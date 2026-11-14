const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  for (const scheme of ['light','dark']) {
    const c = await b.newContext({ colorScheme: scheme, viewport:{width:1280,height:1000}, deviceScaleFactor:1 });
    const p = await c.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
    await p.goto('file://' + __dirname + '/index.html');
    await p.waitForTimeout(1800);
    await p.screenshot({ path:`shot-${scheme}.png`, fullPage:true });
    console.log(scheme, 'errors:', errs.length?errs:'none',
      '| scrollW', await p.evaluate(()=>document.documentElement.scrollWidth),
      '| bodyBG', await p.evaluate(()=>getComputedStyle(document.body).backgroundColor));
    await c.close();
  }
  await b.close();
})();
