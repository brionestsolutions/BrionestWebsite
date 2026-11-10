import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = name => readFileSync(name, 'utf8');
const html = read('index.html');
const css = read('styles.css');
const segmentsCSS = read('segments.css');
const audienceCSS = read('audience.css');
const conversionCSS = read('conversion.css');
const js = read('site.js');
const audienceJS = read('audience.js');
const workflow = read('.github/workflows/deploy.yml');

for (const id of [
  'main', 'services', 'homeowners', 'new-home-timing', 'experience', 'products', 'pricing', 'home-packages-content',
  'builders', 'showflat', 'builder-solutions', 'builder-pricing', 'builder-packages-content',
  'process', 'contact', 'homeowner-details', 'builder-details', 'showflat-name', 'consultation-form', 'scene-title', 'form-feedback'
]) assert.match(html, new RegExp('id="' + id + '"'), 'Missing section/control: ' + id);

assert.equal([...html.matchAll(/<section\b/g)].length, 13, 'Unexpected homepage section count');
assert.doesNotMatch(html, /BuilderOS|builderos/i, 'Remove all upcoming-platform mentions');
assert.match(html, /class="brand official-brand"[^>]*[\s\S]*?brand-logo\.svg/);
assert.match(html, /official-footer-logo[^>]*[\s\S]*?brand-logo\.svg/);
assert.match(html, /tel:\+919833574794/);
assert.match(html, /mailto:info@brionest.com/);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate IDs');
for (const link of html.matchAll(/\bhref="#([^"]+)"/g)) {
  assert.ok(ids.includes(link[1]), 'Broken in-page link: ' + link[1]);
}
for (const match of html.matchAll(/<img\b[^>]*>/g)) {
  assert.match(match[0], /\balt="[^"]+"/, 'Image missing alt text');
}
for (const field of ['name','email','phone','customerType','propertyType','preferredDate','message']) {
  assert.match(html, new RegExp('name="' + field + '"'), 'Missing original API field: ' + field);
}
for (const keyword of [
  'Consultancy', 'system design', 'installation', 'support',
  'Smart light switches', 'Smart fan regulators', 'Smart plugs', 'Motion sensors',
  'Gas leak detectors', 'Smoke detectors', 'Security cameras', 'Smart door locks',
  'Video doorbells', 'Smart hubs', 'Automation scenes',
  'Smart-ready infrastructure', 'Unit-wise control packages', 'Common-area automation',
  'Demonstration & handover', 'Delivery & ongoing care'
]) {
  assert.ok(html.toLowerCase().includes(keyword.toLowerCase()), 'Missing product/service: ' + keyword);
}
assert.equal([...html.matchAll(/class="product-segment"/g)].length, 4, 'Expected 4 homeowner product groups');
assert.equal([...html.matchAll(/class="builder-solution-card"/g)].length, 6, 'Expected 6 developer solution groups');
assert.equal([...html.matchAll(/class="trust-item"/g)].length, 3, 'Expected 3 trust statements');
assert.match(segmentsCSS, /trust-band-inner\s+\.trust-star\{display:none!important\}/, 'Mobile trust separators must be hidden');
assert.match(segmentsCSS, /\.official-brand img\{width:150px!important/, 'Logo must be compact');
assert.match(segmentsCSS, /@media\(max-width:560px\)/, 'Missing small mobile layout');
assert.match(segmentsCSS, /@media\(max-width:820px\)/, 'Missing mobile layout');
assert.match(segmentsCSS, /prefers-reduced-motion:reduce/);
assert.match(html, /segments\.css/);
assert.match(html, /conversion\.css/);
assert.match(conversionCSS, /@media\(max-width:560px\)/);
assert.match(conversionCSS, /@media\(max-width:820px\)/);
assert.ok(html.indexOf('id="experience"') < html.indexOf('id="products"'), 'Home scene demo belongs within homeowner journey');
assert.ok(html.indexOf('id="showflat"') > html.indexOf('id="builders"'), 'Show flat must be part of builder journey');
assert.ok(html.indexOf('id="showflat"') < html.indexOf('id="builder-solutions"'), 'Show flat precedes builder solutions');
assert.match(html, /data-showflat="ready"/);
assert.match(html, /data-showflat="upgrade"/);
assert.match(js, /showflatOptions/);
assert.match(audienceJS, /refreshAudience/);
for (const field of ['homeStage','homeFocus','builderStage','approxUnits']) assert.match(html,new RegExp('name="'+field+'"'));
for (const field of ['homeStage','homeFocus','builderStage','approxUnits']) assert.ok(js.includes(field), 'Missing lead-field folding: '+field);
assert.doesNotMatch(html, /25% Faster|6% Higher|100% Competitive|₹3,000 – ₹5,000/, 'Unverified performance claims not permitted');
assert.doesNotMatch(html, /data-price-tab|data-price-panel/, 'Pricing is now always visible');
for (const plan of ['Basic Smart','Smart Energy','Whole Home','Smart Ready','Smart Premium','Smart Luxury']) {
  assert.ok(html.includes(plan), 'Missing package: ' + plan);
}
for (const value of ['₹20,000','₹45,000','₹80,000','Per unit','Custom quote']) {
  assert.ok(html.includes(value), 'Missing package price: ' + value);
}
for (const name of ['home','away','evening']) {
  assert.match(html, new RegExp('data-scene="' + name + '"'), 'Missing automation scene: ' + name);
  assert.match(js, new RegExp('(?:^|\\s)' + name + ':\\s*\\{'));
}
assert.match(audienceJS, /data-plan-cta/);
assert.match(js, /selectedPackage/, 'Selected package must reach the original backend');
assert.match(audienceCSS, /@media\(max-width:560px\)/);
assert.match(css, /@media\(max-width:560px\)/);
assert.match(js, /result\.sheets_saved\s*!==\s*true/, 'Do not display false success on Sheets failure');
assert.match(js, /delete data\.interest/, 'Keep unchanged original API schema');
assert.match(js, /data\.message\s*=/, 'Store interest in message');
assert.match(workflow, /node tests\/smoke\.test\.mjs/);
assert.match(workflow, /segments\.css/);
assert.match(workflow, /conversion\.css/);
assert.match(workflow, /actions\/deploy-pages@v4/);
assert.match(workflow, /BRIONEST_API_BASE_URL/);
assert.match(read('brand-logo.svg'), /BrioNest/);
console.log('PASS: compact brand, mobile trust strip, all audience sections, catalog, visible pricing, anchor integrity and legacy consultation contract.');
