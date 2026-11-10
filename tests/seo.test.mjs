import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
const dist = process.env.DIST_DIR || 'dist';
const base = (process.env.SITE_URL || 'https://brionestsolutions.github.io/BrionestWebsite/').replace(/\/?$/,'/');
const pages = [
  ['index.html','', 'Home Automation'],
  ['home-automation/index.html','home-automation/','Home Automation for New Homes'],
  ['smart-ready-apartments/index.html','smart-ready-apartments/','Smart-Ready Apartments'],
  ['guides/home-automation-before-interiors/index.html','guides/home-automation-before-interiors/','Home Automation During Interiors'],
];
const sitemap=readFileSync(join(dist,'sitemap.xml'),'utf8');
const robots=readFileSync(join(dist,'robots.txt'),'utf8');
for (const [file,slug,label] of pages) {
  const html=readFileSync(join(dist,file),'utf8');
  const url=new URL(slug,base).href;
  assert.ok(html.includes('rel="canonical" href="'+url+'"'),file+': missing canonical');
  assert.ok(html.includes('property="og:url" content="'+url+'"'),file+': missing OG URL');
  assert.ok(html.includes('application/ld+json'),file+': missing structured data');
  assert.ok(html.includes('name="description"'),file+': missing description');
  assert.ok(html.includes('<h1'),file+': missing H1');
  assert.ok(html.includes(label),file+': missing relevant page content');
  assert.ok(sitemap.includes('<loc>'+url+'</loc>'),file+': missing sitemap URL');
  assert.ok(html.includes('href='),file+': missing internal navigation');
}
assert.equal((sitemap.match(/<url>/g)||[]).length,pages.length);
assert.ok(robots.includes('Sitemap: '+new URL('sitemap.xml',base).href));
for (const f of ['seo.css','brand-logo.svg','site.js','config.js']) assert.ok(existsSync(join(dist,f)),'Missing published asset '+f);
console.log('SEO QA passed: three distinct crawlable static pages, canonical URLs, structured data, sitemap and assets.');
