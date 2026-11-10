# BrioNest organic digital marketing roadmap
Updated: 10 November 2026

## Goal and positioning

Acquire qualified organic enquiries from (a) homeowners planning their new home/interior work and (b) builders planning smart-ready apartments. The conversion is an assessed **consultation or project proposal**, not an unverified savings or faster-sales claim. The site and this plan deliberately do not invent testimonials, brand partnerships, project counts, service locations, or performance guarantees.

The marketing website can remain on **GitHub Pages deployed via GitHub Actions**. Hosting does not prevent SEO: HTML pages, descriptive paths, sitemap, metadata, and schema can all be published at build time. External analytics and search ownership verification require separate account setup.

## P0: Decide and verify the primary domain before promotion

Existing public domain: \`https://brionest.in/\` (currently a separate version of the website). New GitHub Pages project site: \`https://brionestsolutions.github.io/BrionestWebsite/\`.

- Recommendation: make **brionest.in** the single public primary domain for the redesigned GitHub Pages site once launch readiness and DNS ownership are confirmed. Do not send organic traffic to two parallel BrioNest homepages.
- GitHub repository **Settings → Pages → Custom domain**; verify the domain under organization settings and configure DNS/HTTPS based on official GitHub Pages instructions. With Actions deployment, GitHub does not automatically add a CNAME file to the repository.
- **Do not switch DNS abruptly** if the existing brionest.in backend/API or email/DNS records share the host. Preserve MX/TXT and the independently hosted FastAPI endpoint.
- When the domain is fully serving the new site with HTTPS, add repository Actions variable \`BRIONEST_SITE_URL=https://brionest.in/\` (with trailing slash); the next build regenerates canonical URLs and sitemap at the new domain automatically. Leave unset until migration.
- Verify redirects for www versus apex; avoid two indexable, identical homepage copies. Existing indexed URLs should remain reachable or redirect to the closest relevant replacement where possible.
- GitHub Pages **project subpath** robots.txt at /BrionestWebsite/robots.txt does not control the github.io host root. The generated sitemap is still usable; at a real custom domain the same file is published at /robots.txt and acts as the host-level file.

## Phase 1: Technical foundation (now committed)

- Unique, server-delivered HTML at \`/home-automation/\` and \`/smart-ready-apartments/\`.
- Dedicated titles and descriptions, semantic headings, contextual links to the homepage/form, and useful FAQs.
- GitHub Actions script \`scripts/build-seo.mjs\`: injects canonical URL, Open Graph URL/title/description, Organization and Service structured data; writes \`sitemap.xml\` and \`robots.txt\` for the configured site origin.
- Workflow verifies SEO output with \`tests/seo.test.mjs\`.
- \`BRIONEST_API_BASE_URL\` remains separate from \`BRIONEST_SITE_URL\`; the backend/Google Sheet are not hosted by GitHub Pages.
- No marketing analytics scripts are enabled without measurement setup.

## Search intent & content map

| Audience | Search intent (working hypotheses; validate in Search Console) | Destination | CTA |
|---|---|---|---|
| New-home homeowner | smart home automation for new flat, home automation during interior work | /home-automation/ | Discuss my new home |
| Budget-conscious homeowner | smart home automation cost, smart switches installation cost | /home-automation/#packages | Request tailored quote |
| Existing-home homeowner | retrofit home automation, upgrade normal switches to smart controls | Planned retrofit guide | Check compatibility |
| Builder/developer | smart-ready apartments, home automation for builders, bulk smart switches | /smart-ready-apartments/ | Request developer proposal |
| Builder project manager | smart wiring provisions, unit-level automation installation | Planned builder integration guide | Scope a project |
| Local high-intent search | home automation installation in **verified service area** | Future genuinely local service page | Book consultation |

These are **target themes**, not measured search volumes or ranking claims.

## Phase 2: Local visibility and measurement

Owner action:

1. Verify \`brionest.in\` in [Google Search Console](https://search.google.com/search-console), preferably as a domain property once DNS access is available. Submit \`https://brionest.in/sitemap.xml\` only once the new website is actually live on that domain. Check Pages / Indexing / Performance, and use URL Inspection for important pages.
2. Configure a Google Business Profile only if BrioNest is an eligible real service-area or storefront business. Verify its real-world name, phone, category, correct service areas, support hours and a website URL. Hide a residential or other non-customer-facing address as required by Google. **Do not invent a Mumbai, Panvel or Navi Mumbai address or fake offices.**
3. Set up GA4 and/or privacy-appropriate measurement using your own IDs. Primary events: \`consultation_submit_success\` (only after actual Sheets success), \`contact_call_click\`, \`email_click\`, \`package_interest\`, \`builder_proposal_interest\`. Do not send phone/email/name as event parameters.
4. Use PageSpeed Insights / Lighthouse to inspect LCP, CLS, interaction responsiveness and mobile image sizes. Replace remote illustrative photos with approved photos of real devices, technicians, sample flats and documented projects when available.
5. Ask real customers to leave genuine reviews after completed jobs; obtain consent before publishing any customer home photos or testimonials.

## 90-day editorial and distribution plan

**Month 1 — Intent and trust**
- Homeowner guide: *When to plan automation during flat interiors* — checklist of electrical coordination stages, retrofit alternatives and 5 product decisions.
- Homeowner guide: *How much does basic home automation cost?* — explain packages, exclusions and compatibility; use current verified pricing and update as needed.
- Builder guide: *What makes an apartment genuinely smart-ready?* — practical inclusions, electrical provisions and model-flat demonstration.
- Organic social: 2–3 short real-device demonstrations weekly on Instagram/Reels and YouTube Shorts, with a link to the matching guide.

**Month 2 — Consideration and local proof**
- Homeowner guide: *Smart switches vs smart plugs vs automation hubs*.
- Homeowner guide: *Home automation in a completed apartment: what may need rewiring?*
- Builder guide: *Smart-ready provisions to decide before electrical rough-in*.
- Builder guide: *How to demonstrate smart features in a model flat without overpromising*.
- LinkedIn: one thoughtful builder-facing post a week on specification, model-flat experience or execution; do not mass-message.
- GBP: publish genuine project/device photos and current service updates if the profile is eligible and active.

**Month 3 — Authority and conversion**
- Two approved mini case studies with before/after scope, photographed hardware, explanation of the installation, and actual customer quotes (only with consent).
- One buyer-handover guide and one builder automation specification checklist.
- Refresh and interlink the best-performing pages based on Search Console queries and conversions.
- Reach out to real interior designers, architects, electricians and property developers for legitimate referral/content collaborations, never paid links marketed as organic.

## Weekly scorecard

| KPI | Measurement | Why |
|---|---|---|
| Google organic clicks / impressions | Search Console | Actual search visibility |
| Top query groups by audience | Search Console | What people are searching |
| Indexed service/content pages | Search Console | Discoverability problems |
| Qualified homeowner enquiries | Confirmed form submissions + manual lead tags | Core conversion |
| Qualified builder enquiries | Confirmed form submissions + manual lead tags | Higher-value B2B conversion |
| Enquiry conversion rate by landing page | Analytics with approved setup | Improve page messaging |
| GBP calls / website clicks (if eligible) | Google Business Profile | Local organic leads |

Review weekly; don't promise search rankings or specific lead volumes. An initial 8–12 weeks builds a content base, but SEO growth timing varies.

## Launch safeguards

- Confirm real service areas before creating any city/neighbourhood landing pages.
- One genuine, distinct page per user need; avoid dozens of boilerplate city pages or keyword stuffing.
- Use useful photos and original knowledge. No fabricated success stories, star ratings, guaranteed energy savings or claims that builders will sell units faster.
- Current pricing on the site is **indicative** pending owner review.
- Keep contact and plan eligibility aligned with the original website.
- Verify the FastAPI endpoint and Google Sheets success with a real test lead before scaling traffic.
- Reassess Google Ads only separately if desired; this plan is exclusively **organic**.

### Official documentation
- Google Search Central SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Search essentials: https://developers.google.com/search/docs/essentials
- Build / submit sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Local-business structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google Business Profile service-area guidelines: https://support.google.com/business/answer/3038177
- GitHub Pages custom domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
