import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { extname } from 'node:path';
import assert from 'node:assert/strict';

const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'};
const allowed=['index.html','styles.css','audience.css','segments.css','site.js','audience.js','config.js','favicon.svg','brand-logo.svg'];
const server=createServer((req,res)=>{
  const url=String(req.url||'/').split('?')[0];
  const filename=url==='/'?'index.html':url.replace(/^\/+/,'');
  if (!allowed.includes(filename)||!existsSync(filename)){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[extname(filename)]||'text/plain','Cache-Control':'no-store'});
  res.end(readFileSync(filename));
});
await new Promise(resolve=>server.listen(8127,'0.0.0.0',resolve));
mkdirSync('qa-screenshots',{recursive:true});
let browser;
try {
  browser=await chromium.launch({headless:true});
  for(const [name,width,height] of [
    ['small-mobile',320,740],['mobile',375,812],['tablet',768,1024],
    ['laptop',1180,820],['desktop',1440,900]
  ]){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:8127/',{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('.hero h1').waitFor();
    assert.match(await page.title(),/Home Automation/);
    assert.equal(await page.locator('main section').count(),11,'Missing audience section');
    assert.equal(await page.locator('.product-segment').count(),4,'Product groups');
    assert.equal(await page.locator('.builder-solution-card').count(),6,'Builder solution groups');
    assert.equal(await page.locator('.trust-item').count(),3,'Trust statements');
    assert.equal(await page.locator('#pricing [data-plan-cta]').count(),3);
    assert.equal(await page.locator('#builder-pricing [data-plan-cta]').count(),3);
    assert.equal(await page.locator('#pricing .price-card').first().isVisible(),true);
    assert.equal(await page.locator('#builder-pricing .price-card').first().isVisible(),true);
    assert.equal(await page.locator('#builderos').count(),0);

    const logoWidth=await page.locator('.official-brand img').evaluate(el=>el.getBoundingClientRect().width);
    assert.ok(logoWidth<175,'Logo dominates header at '+name+': '+logoWidth);
    if(width<=560)assert.ok(logoWidth<=130,'Mobile logo too big: '+logoWidth);
    const trust=await page.locator('.trust-item').evaluateAll(els=>els.map(e=>{
      const r=e.getBoundingClientRect();return {top:r.top,left:r.left,right:r.right,width:r.width};
    }));
    if(width<=820){
      assert.ok(trust[0].top<trust[1].top&&trust[1].top<trust[2].top,name+' trust strip should be three stacked rows');
    }else{
      assert.ok(Math.abs(trust[0].top-trust[1].top)<3&&Math.abs(trust[1].top-trust[2].top)<3,name+' trust strip should be single row');
    }

    await page.locator('[data-scene="away"]').click();
    assert.equal(await page.locator('#scene-title').textContent(),'Peace of mind');
    await page.locator('[data-scene="home"]').click();
    await page.locator('#builder-pricing [data-plan-name="Smart Premium"]').click();
    assert.equal(await page.locator('[name="customerType"]').inputValue(),'builder');
    assert.equal(await page.locator('#consultation-form').getAttribute('data-selected-package'),'Smart Premium');
    await page.locator('#pricing [data-plan-name="Smart Energy"]').click();
    assert.equal(await page.locator('[name="customerType"]').inputValue(),'homeowner');
    assert.equal(await page.locator('#consultation-form').getAttribute('data-selected-package'),'Smart Energy');
    if(width<1091){
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
      await page.locator('#mobile-nav a[href="#builders"]').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    }

    // Mock only the external API, verifying the unchanged legacy Google Sheets schema.
    let payload=null;
    await page.route('https://test-api.example/api/consultation',async route=>{
      payload=route.request().postDataJSON();
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true,sheets_saved:true})});
    });
    await page.evaluate(()=>{window.BRIONEST_API_BASE_URL='https://test-api.example';});
    await page.locator('[name="name"]').fill('Test Customer');
    await page.locator('[name="email"]').fill('test@example.com');
    await page.locator('[name="phone"]').fill('+919876543210');
    await page.locator('#submit-button').click();
    await page.locator('#form-feedback.success').waitFor({timeout:7000});
    assert.ok(payload&&payload.message.includes('Selected package: Smart Energy'),'Package lost in original lead payload');
    assert.equal(payload.customerType,'homeowner');
    assert.deepEqual(Object.keys(payload).sort(),['customerType','email','message','name','phone','preferredDate','propertyType'].sort());
    assert.equal(await page.locator('#consultation-form').getAttribute('data-selected-package'),null,'Package should reset');

    for(const section of await page.locator('main section').all())await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const measures=await page.evaluate(()=>({
      width:innerWidth,doc:document.documentElement.scrollWidth,body:document.body.scrollWidth,
      images:[...document.images].map(i=>({alt:i.alt,loaded:i.complete&&i.naturalWidth>0}))
    }));
    assert.ok(measures.doc<=measures.width+2,name+' page horizontal overflow: '+JSON.stringify(measures));
    assert.ok(measures.body<=measures.width+2,name+' body horizontal overflow');
    assert.deepEqual(errors,[],name+' runtime errors');
    await page.evaluate(()=>scrollTo(0,0));
    await page.waitForTimeout(150);
    assert.equal(await page.locator('.official-brand img').evaluate(i=>i.complete&&i.naturalWidth>0),true,'Brand logo failed loading');
    await page.screenshot({path:'qa-screenshots/'+name+'-hero.png',fullPage:false,animations:'disabled'});
    await page.screenshot({path:'qa-screenshots/'+name+'.png',fullPage:true,animations:'disabled'});
    console.log(name,JSON.stringify({width,logoWidth,trustRows:trust.map(x=>Math.round(x.top)),images:measures.images,passes:true}));
    await context.close();
  }
} finally {
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
console.log('PASS BrioNest browser QA: 320–1440px, small logo, trust-strip rows, separate pricing, product groups, Builder services, original lead schema.');
