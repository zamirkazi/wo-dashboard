const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
// index.html sits beside the sources when flat, one level up when they live in src/.
const PAGE = ['index.html','../index.html'].map(f => path.join(__dirname, f)).find(fs.existsSync);

(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ colorScheme:'light', viewport:{width:1280,height:1000} });
  const p = await c.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://' + PAGE);
  await p.waitForTimeout(600);
  for (const ch of ['direct','kirsh','slocumb','all']) {
    await p.click(`.cbtn[data-ch="${ch}"]`); await p.waitForTimeout(250);
    console.log('channel', ch, '| live', await p.textContent('#livecount'),
      '| kpi', (await p.textContent('#kpis')).replace(/\s+/g,' ').slice(0,80));
  }
  for (const f of ['live','pass','conditional','all']) {
    await p.click(`.fbtn[data-f="${f}"]`); await p.waitForTimeout(200);
    console.log('filter', f, '| rows', await p.evaluate(()=>document.querySelectorAll('#ledger tr').length));
  }
  await p.fill('#q','houston'); await p.waitForTimeout(250);
  console.log('search "houston" rows', await p.evaluate(()=>document.querySelectorAll('#ledger tr').length));
  await p.fill('#q','zzzz'); await p.waitForTimeout(250);
  console.log('search miss empty-visible', await p.evaluate(()=>getComputedStyle(document.getElementById('empty')).display));
  await p.fill('#q','');
  await p.click('.card input'); await p.waitForTimeout(150);
  console.log('tick persisted', await p.evaluate(()=>localStorage.getItem('ag-done')));
  await p.click(`.cbtn[data-ch="slocumb"]`); await p.waitForTimeout(250);
  await p.screenshot({ path:'c-slocumb.png', fullPage:true });
  console.log('errors:', errs.length?errs:'none');
  await b.close();
})();
