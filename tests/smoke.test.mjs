import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync('index.html','utf8');
const css = readFileSync('styles.css','utf8');
const js = readFileSync('site.js','utf8');
const workflow = readFileSync('.github/workflows/deploy.yml','utf8');

for (const id of ['main','approach','living','solutions','developers','contact','consultation-form','scene-image','scene-name','form-feedback']) {
  assert.match(html, new RegExp('id="' + id + '"'), 'Missing section/control: ' + id);
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs');
for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
  assert.ok(ids.includes(match[1]), 'Broken in-page anchor: ' + match[1]);
}
for (const image of html.matchAll(/<img\b[^>]*>/g)) {
  assert.match(image[0], /\balt="[^"]+"/, 'Missing image alt text');
}
for (const field of ['name','email','phone','customerType','propertyType','preferredDate','message']) {
  assert.match(html, new RegExp('name="' + field + '"'), 'Missing legacy backend field: ' + field);
}
for (const key of ['evening','morning','away']) {
  assert.match(html, new RegExp('data-scene="' + key + '"'));
  assert.match(js, new RegExp('(?:^|\\s)' + key + ':\\s*\\{'));
}
assert.match(css, /@media\(max-width:520px\)/, 'Small mobile breakpoint missing');
assert.match(css, /prefers-reduced-motion:reduce/, 'Reduced-motion mode missing');
assert.match(js, /result\.sheets_saved\s*!==\s*true/, 'Must validate Sheets save result');
assert.match(workflow, /actions\/deploy-pages@v4/);
assert.match(workflow, /BRIONEST_API_BASE_URL/);
assert.match(workflow, /favicon\.svg/);
console.log('BrioNest smoke checks passed: page anchors, responsive styles, scene controls, lead fields, Pages deployment.');
