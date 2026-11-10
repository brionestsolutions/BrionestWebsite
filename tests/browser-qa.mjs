import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { extname } from 'node:path';
import assert from 'node:assert/strict';

const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'};
const allowed=['index.html','styles.css','audience.css','segments.css','conversion.css','site.js','audience.js','config.js','favicon.svg','brand-logo.svg'];
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
    assert.equal(await page.locator('main section').count(),13,'Missing audience section');
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

    assert.ok(await page.locator('#experience').evaluate(el=>el.compareDocumentPosition(document.getElementById('products'))&Node.DOCUMENT_POSITION_FOLLOWING), 'Home demo must precede product catalogue');
    await page.locator('[data-showflat="upgrade"]').click();
    assert.equal(await page.locator('#showflat-name').textContent(),'An easy next conversation.');
    assert.equal(await page.locator('[data-showflat="upgrade"]').getAttribute('aria-pressed'),'true');
    await page.locator('[data-showflat="ready"]').click();
    assert.equal(await page.locator('#showflat-name').textContent(),'A memorable standard feature.');
    await page.locator('[data-scene="away"]').click();
    assert.equal(await page.locator('#scene-title').textContent(),'Peace of mind');
    await page.locator('[data-scene="home"]').click();
    await page.locator('#builder-pricing [data-plan-name="Smart Premium"]').click();
    assert.equal(await page.locator('[name="customerType"]').inputValue(),'builder');
    assert.equal(await page.locator('#builder-details').isVisible(),true);
    assert.equal(await page.locator('#homeowner-details').isVisible(),false);
    assert.equal(await page.locator('#consultation-form').getAttribute('data-selected-package'),'Smart Premium');
    if(width<1091){
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
      await page.locator('#mobile-nav a[href="#builders"]').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    }

    // Mock the external API to check the original Google Sheets schema for BOTH audiences.
    const payloads=[];
    await page.route('https://test-api.example/api/consultation',async route=>{
      payloads.push(route.request().postDataJSON());
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true,sheets_saved:true})});
    });
    await page.evaluate(()=>{window.BRIONEST_API_BASE_URL='https://test-api.example';});
    await page.locator('[name="builderStage"]').selectOption('Construction / electrical stage');
    await page.locator('[name="approxUnits"]').fill('120');
    await page.locator('[name="name"]').fill('Test Developer');
    await page.locator('[name="email"]').fill('builder@example.com');
    await page.locator('[name="phone"]').fill('+919876543210');
    await page.locator('#submit-button').click();
    await page.locator('#form-feedback.success').waitFor({timeout:7000});
    assert.equal(payloads.length,1,'Builder enquiry not posted');
    assert.equal(payloads[0].customerType,'builder');
    assert.match(payloads[0].message,/Project stage: Construction \/ electrical stage/);
    assert.match(payloads[0].message,/Approximate units: 120/);
    assert.match(payloads[0].message,/Selected package: Smart Premium/);
    assert.deepEqual(Object.keys(payloads[0]).sort(),['customerType','email','message','name','phone','preferredDate','propertyType'].sort());

    await page.locator('#pricing [data-plan-name="Smart Energy"]').click();
    assert.equal(await page.locator('[name="customerType"]').inputValue(),'homeowner');
    assert.equal(await page.locator('#homeowner-details').isVisible(),true);
    assert.equal(await page.locator('#builder-details').isVisible(),false);
    await page.locator('[name="homeStage"]').selectOption('Interiors being planned');
    await page.locator('[name="homeFocus"]').selectOption('Lighting and everyday convenience');
    await page.locator('[name="name"]').fill('Test Homeowner');
    await page.locator('[name="email"]').fill('home@example.com');
    await page.locator('[name="phone"]').fill('+919876543210');
    await page.locator('#submit-button').click();
    await page.locator('#form-feedback.success').waitFor({timeout:7000});
    assert.equal(payloads.length,2,'Homeowner enquiry not posted');
    assert.equal(payloads[1].customerType,'homeowner');
    assert.match(payloads[1].message,/Home stage: Interiors being planned/);
    assert.match(payloads[1].message,/Home priority: Lighting and everyday convenience/);
    assert.match(payloads[1].message,/Selected package: Smart Energy/);
    assert.deepEqual(Object.keys(payloads[1]).sort(),['customerType','email','message','name','phone','preferredDate','propertyType'].sort());
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
console.log('PASS: responsive conversion journeys, home-scene placement, builder showflat, audience-stage forms and unchanged lead payload.');
