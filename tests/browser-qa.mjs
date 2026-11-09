import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import assert from 'node:assert/strict';

const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'};
const server = createServer((req,res)=>{
  const path = String(req.url || '/').split('?')[0];
  const name = path === '/' ? 'index.html' : path.replace(/^\/+/, '');
  if (!['index.html','styles.css','audience.css','site.js','audience.js','config.js','favicon.svg'].includes(name) || !existsSync(name)) {
    res.writeHead(404); res.end('Not found'); return;
  }
  res.writeHead(200, {'Content-Type':mime[extname(name)] || 'text/plain','Cache-Control':'no-store'});
  res.end(readFileSync(name));
});
await new Promise(resolve => server.listen(8127,'0.0.0.0',resolve));
mkdirSync('qa-screenshots',{recursive:true});
let browser;
try {
  browser = await chromium.launch({headless:true});
  for (const [name, width, height] of [['small-mobile',320,740],['mobile',375,812],['tablet',768,1024],['laptop',1180,820],['desktop',1440,900]]) {
    const context = await browser.newContext({ viewport:{width,height}, deviceScaleFactor:1, reducedMotion:'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8127/',{waitUntil:'domcontentloaded', timeout:30000});
    await page.locator('.hero h1').waitFor();
    assert.match(await page.title(), /Home Automation/);
    await page.locator('[data-scene="away"]').click();
    assert.equal(await page.locator('#scene-title').textContent(),'Peace of mind');
    await page.locator('[data-scene="home"]').click();
    // Verify the new pricing tabs and the original package enquiry pipeline.
    await page.locator('#tab-builder').click();
    assert.equal(await page.locator('#tab-builder').getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('#panel-homeowner').isVisible(), false);
    assert.equal(await page.locator('#panel-builder').isVisible(), true);
    await page.locator('#panel-builder [data-plan-name="Smart Premium"]').click();
    assert.equal(await page.locator('[name="customerType"]').inputValue(), 'builder');
    assert.equal(await page.locator('#consultation-form').getAttribute('data-selected-package'), 'Smart Premium');
    await page.locator('#tab-homeowner').click();
    assert.equal(await page.locator('#panel-homeowner').isVisible(), true);
    await page.locator('#panel-homeowner [data-plan-name="Smart Energy"]').click();
    assert.equal(await page.locator('[name="customerType"]').inputValue(), 'homeowner');
    assert.equal(await page.locator('#consultation-form').getAttribute('data-selected-package'), 'Smart Energy');
    await page.locator('.builderos-link').click();
    assert.equal(await page.locator('[name="customerType"]').inputValue(), 'builder');
    assert.equal(await page.locator('[name="interest"]').inputValue(), 'BuilderOS enquiry');
    if (width < 1091) {
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
      await page.locator('#mobile-nav a[href="#services"]').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    }
    // Trigger lazy-load and catch overflow below the fold.
    const sections = page.locator('main section');
    for (let i=0;i<await sections.count();i++) await sections.nth(i).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1100);
    const measures = await page.evaluate(() => ({
      vw: innerWidth, doc: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
      sections: document.querySelectorAll('main section').length,
      images: [...document.images].map(i=>({alt:i.alt,loaded:i.complete&&i.naturalWidth>0}))
    }));
    assert.ok(measures.doc <= measures.vw + 2, name+' horizontal overflow '+JSON.stringify(measures));
    assert.ok(measures.body <= measures.vw + 2, name+' body horizontal overflow '+JSON.stringify(measures));
    assert.equal(measures.sections,9);
    assert.deepEqual(errors,[],name+' runtime errors');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(220);
    assert.equal(await page.locator('.site-header .brand').isVisible(), true, name+' header not visible');
    await page.screenshot({path:'qa-screenshots/'+name+'-hero.png',fullPage:false,animations:'disabled'});
    await page.screenshot({path:'qa-screenshots/'+name+'.png',fullPage:true,animations:'disabled'});
    console.log(name,JSON.stringify(measures));
    await context.close();
  }
} finally {
  if (browser) await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
console.log('Browser QA passed: responsive widths, navigation, interactive demo, page scripts.');
