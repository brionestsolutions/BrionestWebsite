import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Build-time metadata: one SEO identity, independent from GitHub Pages deployment path.
// Set Actions variable BRIONEST_SITE_URL after the verified custom-domain migration.
const fallback = 'https://brionestsolutions.github.io/BrionestWebsite/';
let base = (process.env.SITE_URL || fallback).trim();
if (!/^https:\/\/[a-z0-9.-]+(?:\/[a-z0-9/_-]*)?\/?$/i.test(base)) {
  throw new Error('SITE_URL must be a full HTTPS origin or website base path without queries/fragments: ' + base);
}
if (!base.endsWith('/')) base += '/';
const siteBase = new URL(base);
const dir = process.env.DIST_DIR || 'dist';
const esc = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const pages = [
  {path: '', file: 'index.html', type: 'WebPage', title: 'Home Automation Consultancy, Installation & Products | BrioNest',
    desc: 'BrioNest consults, designs, installs and supports smart home automation. Explore homeowner packages and smart-ready apartment solutions for developers.'},
  {path: 'home-automation/', file: 'home-automation/index.html', type: 'Service', title: 'Home Automation for New Homes & Interiors | BrioNest',
    desc: 'Plan smart switches, lighting, sensors and integrated home automation alongside your interiors. Explore professional products, installation and packages.'},
  {path: 'smart-ready-apartments/', file: 'smart-ready-apartments/index.html', type: 'Service', title: 'Smart-Ready Apartments for Builders & Developers | BrioNest',
    desc: 'BrioNest helps builders plan smart-ready apartments with unit-level automation, model-flat demonstrations, project integration and buyer handover.'},
];
const orgId = new URL('#organization', base).href;
for (const page of pages) {
  const absolute = new URL(page.path, siteBase).href;
  const file = join(dir, page.file);
  let html = readFileSync(file, 'utf8');
  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + esc(page.title) + '</title>');
  html = html.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(page.desc) + '">');
  if (!html.includes('</head>')) throw new Error('Missing head close: ' + page.file);
  if (html.includes('rel="canonical"')) throw new Error('Duplicate canonical: ' + page.file);
  const seo = {
    '@context': 'https://schema.org',
    '@type': page.type === 'Service' ? 'Service' : 'WebPage',
    '@id': absolute + '#page',
    'url': absolute,
    'name': page.title,
    'description': page.desc
  };
  if (page.type === 'Service') {
    seo.provider = { '@id': orgId };
    seo.serviceType = page.path === 'home-automation/'
      ? 'Residential smart home automation consultation and installation'
      : 'Smart-ready apartment planning and integration for real estate developers';
  } else {
    seo.about = { '@id': orgId };
  }
  const org = page.path === '' ? {
    '@context': 'https://schema.org', '@type': 'Organization',
    '@id': orgId, name: 'BrioNest Solutions', url: base,
    logo: new URL('brand-logo.svg', siteBase).href,
    email: 'info@brionest.com', telephone: '+91 98335 74794',
    description: 'Home automation products, consultancy, installation, integration and ongoing support.'
  } : null;
  const json = JSON.stringify(org ? [org,seo] : seo).replace(/</g, '\\u003c');
  const tags = [
    '<link rel="canonical" href="' + esc(absolute) + '">',
    '<meta property="og:url" content="' + esc(absolute) + '">',
    '<meta property="og:site_name" content="BrioNest Solutions">',
    '<meta property="og:type" content="website">',
    '<meta property="og:title" content="' + esc(page.title) + '">',
    '<meta property="og:description" content="' + esc(page.desc) + '">',
    '<meta name="twitter:card" content="summary">',
    '<script type="application/ld+json">' + json + '</script>',
  ];
  // Homepage has existing Open Graph tags. Replace duplicates rather than stacking.
  html = html.replace(/^\s*<meta property="og:(?:type|title|description|url|site_name)"[^>]*>\s*$/gm, '');
  html = html.replace('</head>', '  ' + tags.join('\n  ') + '\n</head>');
  writeFileSync(file, html);
}

const urls = pages.map(page => new URL(page.path, siteBase).href);
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map(url => '  <url><loc>' + esc(url) + '</loc></url>').join('\n')
  + '\n</urlset>\n';
writeFileSync(join(dir,'sitemap.xml'),xml);
// For project pages, host-level robots.txt is owned by github.io; under a
// custom domain this file is located at the domain root and is authoritative.
writeFileSync(join(dir,'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: '
  + new URL('sitemap.xml',siteBase).href + '\n');
console.log('SEO: generated canonical tags, structured data, sitemap & robots for', base, '(', pages.length, 'pages )');
