import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync('index.html', 'utf8');
const css = readFileSync('styles.css', 'utf8');
const js = readFileSync('site.js', 'utf8');
const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
for (const id of [
  'main', 'services', 'products', 'process', 'experience', 'audiences',
  'pricing', 'tab-homeowner', 'tab-builder', 'panel-homeowner', 'panel-builder', 'contact', 'consultation-form', 'scene-title', 'form-feedback'
]) assert.match(html, new RegExp('id="' + id + '"'), 'Missing section/control: ' + id);

assert.doesNotMatch(html, /BuilderOS|builderos/i, 'Remove all upcoming-platform mentions');
assert.match(html, /<span class="brand-name">BrioNest Solutions<\/span>/);
assert.match(html, /footer-logo[^>]*[\s\S]*?BrioNest Solutions/);
assert.match(html, /tel:\+919833574794/);
assert.match(html, /mailto:info@brionest.com/);
assert.match(html, /What to expect/);
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
for (const word of ['Consultancy','system design','Installation','support','Smart Light Switch','Smart Fan Regulator','Smart Power Socket']) {
  assert.ok(html.toLowerCase().includes(word.toLowerCase()), 'Missing core business positioning: ' + word);
}
for (const name of ['home', 'away', 'evening']) {
  assert.match(html, new RegExp('data-scene="' + name + '"'), 'Scene control missing: ' + name);
  assert.match(js, new RegExp('(?:^|\\s)' + name + ':\\s*\\{'), 'Scene model missing: ' + name);
}
const audienceCSS = readFileSync('audience.css', 'utf8');
const audienceJS = readFileSync('audience.js', 'utf8');
for (const tier of ['Basic Smart','Smart Energy','Whole Home','Smart Ready','Smart Premium','Smart Luxury']) {
  assert.ok(html.includes(tier), 'Missing pricing tier: ' + tier);
}
for (const price of ['₹20,000','₹45,000','₹80,000','Per unit','Custom quote']) {
  assert.ok(html.includes(price), 'Missing original price: ' + price);
}
assert.match(audienceJS, /data-price-tab/);
assert.match(audienceJS, /data-plan-cta/);
assert.match(js, /selectedPackage/, 'Original backend must receive selected plan');
assert.match(audienceCSS, /@media\(max-width:560px\)/);
assert.match(workflow, /audience\.css site\.js audience\.js/);
assert.match(css, /@media\(max-width:560px\)/);
assert.match(css, /@media\(max-width:820px\)/);
assert.match(css, /prefers-reduced-motion:reduce/);
assert.match(js, /result\.sheets_saved\s*!==\s*true/, 'Must verify Google Sheets persistence');
assert.match(js, /delete data\.interest/, 'Interest should be folded into original API schema');
assert.match(js, /data\.message\s*=/, 'Interest should be retained in stored message');
assert.match(workflow, /node tests\/smoke\.test\.mjs/);
assert.match(workflow, /actions\/deploy-pages@v4/);
assert.match(workflow, /BRIONEST_API_BASE_URL/);
assert.match(workflow, /favicon\.svg/);
console.log('PASS BrioNest: business content, page anchors, product images, mobile breakpoints, scene demo, legacy API contract, Pages workflow.');
