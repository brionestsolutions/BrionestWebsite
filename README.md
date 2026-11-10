# BrioNest · Home automation, expertly delivered

A premium, responsive, GitHub Pages website for BrioNest Solutions, representing the **actual business model**: home automation products, consultancy, system architecture and product selection, deployment, integration, commissioning, and ongoing management/support.

## What the site communicates

The homepage deliberately distinguishes BrioNest from a generic smart-gadget shop or interior design business:

1. **Value proposition:** "Intelligent spaces. Expertly delivered." — a systems-integration and deployment partner.
2. **Services:** consultation/planning → product selection/system design → installation/integration → support/maintenance.
3. **Product categories:** smart light controls/switches, sensors/cameras/security, hubs/controllers/infrastructure, plus sockets, fan regulators, locks, doorbells and automation scenes.
4. **How delivery works:** discovery → design/specification → deployment/commissioning → management/improvement.
5. **Interactive example:** non-connected demonstration of an "I'm home", "Away mode", or "Movie night" automation scene.
6. **Customers:** dedicated messaging for homeowners and real-estate builders/developers.
7. **Consultation:** functional frontend using original API contract.

No unverified years in business, client testimonials, project counts, certifications, brand authorisations, or fake project photographs.


## Canonical logo and current-site alignment

The website header and footer use the **BrioNest blue/navy logo supplied by the business owner** (adapted as a vector asset in `brand-logo.svg`). The user-supplied logo takes precedence over the generic home icon previously used. Its icon geometry and navy/blue wordmark are kept consistent across responsive layouts.

Customer/builder pricing and features are aligned with the supplied original frontend source, including ₹20,000 Basic Smart, ₹45,000 Smart Energy, ₹80,000 Whole Home, per-unit Smart Ready and custom-quote Smart Premium and Smart Luxury. The product catalogue now has four immediately visible groups: switching & power, sensors & safety, security & access, and hubs & automation. These include the original Smart Light Switch, Smart Fan Regulator and Smart Power Socket categories. Contact details from brionest.in are **+91 98335 74794** and **info@brionest.com**. The original free-consultation expectations (home assessment, customized plan, transparent pricing and demonstration) are reflected in the contact section.

Builder/developer **home automation** service pages and prices remain. Unreleased other platforms are intentionally excluded from public-facing branding, navigation and calls to action.

## Original BrioNest content restored (homeowners + builders)

The homepage now has **two fully visible, separate pricing sections**: homeowner prices after the product catalogue, and developer packages after six project-service areas. This brings back the original site's customer/builder segmentation while retaining the more service-focused V3 branding, consultation, installation/integration, and after-sales story.

**Homeowners:**

| Package | Indicative one-time price | Core inclusion |
|---|---|---|
| Basic Smart | ₹20,000 | 5 smart switches, 2 smart plugs, app and voice control, installation, 1-year support |
| Smart Energy | ₹45,000 | 10 switches, 4 plugs, 3 motion sensors, energy monitoring, gas detector, setup, priority support |
| Whole Home | ₹80,000 | Whole-home smart controls, plugs, motion sensing, cameras, lock, doorbell, hub, detectors, training and support |

**Builders/developers:**

| Package | Price basis | Core inclusion |
|---|---|---|
| Smart Ready | Per-unit pricing | Smart wiring provisions, switches, fan regulators, voice readiness, buyer demo and training |
| Smart Premium | Custom quote | Smart Ready plus motion sensing, energy management, gas detection, scheduling, optional branding and project support |
| Smart Luxury | Custom quote | Smart Premium plus integrated security, doors/doorbells, whole-home/community options, project management and extended support |

The site also incorporates the original use-case ideas: homeowners' living room/kitchen convenience, bedroom/bathroom routines, remote whole-home control, and developers' market differentiation, site coordination and buyer handover.

**Commercial caution:** Pricing and inclusions were reproduced from the user's earlier BrioNest website code and may be outdated; all pricing is prominently labelled *indicative*. The original "unlimited switches", app branding, community integration and long-term support assertions are softened or explicitly subject to written scope and feasibility. Do not publish unsubstantiated case studies, savings statistics, developer-client claims, performance guarantees or measured business outcomes.

Buttons in each package select the correct audience, put the tier in the enquiry, and navigate to the form. The tier is stored inside the existing \`message\` field so the original Google Sheets schema remains unchanged. Homeowner and builder navigation/quick-choice links go directly to their separate sections, rather than switching hidden tabs.

## Current website strategy and flow

BrioNest is presented as a **consulting, integration, installation and ongoing-support partner**, not a standalone gadget shop. The site supports two clearly visible audiences, with tailored reasons to request a consultation.

**Shared:** a premium responsive hero with **For my new home** and **For my project** choices → service expertise → audience routes.

**Homeowners:** new-home and interior-planning positioning → why to coordinate during the electrical/interior stage → interactive everyday smart-home scenes → four product categories → indicative Basic Smart (₹20,000), Smart Energy (₹45,000), Whole Home (₹80,000) packages.

**Builders/developers:** market differentiation and a simple smart-ready feature to demonstrate, **without any guaranteed sales results** → interactive model-flat concept comparing baseline controls and optional buyer upgrades → six project solution groups → per-unit/custom-quote builder packages → optional partnership conversations (no published/unconfirmed commission promise).

**Shared close:** delivery methodology → consultation with a form that **adapts to the visitor** (home stage and desired features OR development stage and approximate units) → direct contact.

- The supplied blue/navy logo remains intact, with a compact 150px desktop / 120px small-mobile header size.
- `segments.css`: brand, mobile trust strip, homeowner and builder sections.
- `conversion.css`: move-in timing, home-scene journey, builder model-flat concept, partner opportunity, audience form styling.
- `site.js`: interactions and the existing backend API call.
- `audience.js`: audience field visibility, package selection and enquiry hints.
- All audience-dependent details are prefixed into the existing `message` key, keeping the original seven-field FastAPI / Sheets API request unchanged.
- The builder exterior photograph is an **illustrative licensed Unsplash residential development image**, not a BrioNest installation or client project. Replace it with approved first-party project imagery when available.

### QA

GitHub Actions runs `node tests/smoke.test.mjs`, followed by GitHub Pages publishing. A separate browser workflow checks 320px, 375px, 768px, 1180px and 1440px, navigation, layout overflow, mobile promise-strip alignment, homeowner demo placement, builder model-flat controls, six original packages and mocked successful enquiries from both audiences. Live Google Sheets submission remains a separate integration step requiring a configured API base URL.

## Art direction

Engineering confidence + warm, approachable premium service.

- **Deep pine** \`#142c2b\`: credibility, technical expertise, consistency and calm.
- **Warm paper** \`#f7f5f0\`: approachability, openness, premium restraint.
- **Warm brass** \`#dfad71\`: limited emphasis and high-visibility consultation action.
- **Manrope** headings + **Instrument Serif** editorial emphasis + **DM Sans** body text.
- **Product-relevant photographs:** wall-mounted smart switch, real control device, smart-home security camera and wired automation control panel. Residential backgrounds are used only to illustrate homeowner/developer contexts. Photography is licensed third-party illustrative imagery, not claimed to be BrioNest's work. Replace with verified BrioNest project images when available.
- Mobile layouts at 1090 / 820 / 560px; reduced-motion support; keyboard-accessible navigation and scene controls; dynamic current year; meaningful alt text.

## Deploy to GitHub Pages

1. **Settings → Pages → Source → GitHub Actions**
2. Push to \`main\`. Workflow: \`.github/workflows/deploy.yml\`.
3. The workflow executes \`node tests/smoke.test.mjs\` and uploads a static site.
4. Default URL: https://brionestsolutions.github.io/BrionestWebsite/

There is no npm build dependency.

## Original Google Sheets backend retained

The new frontend sends \`POST {BRIONEST_API_BASE_URL}/api/consultation\` with **exactly the original fields**:

- \`name\`, \`email\`, \`phone\`, \`customerType\`, \`propertyType\`, \`preferredDate\`, \`message\`

The additional "What can we help you with?" choice is prefixed inside the original \`message\` field, so no backend-schema or Google Sheet column changes are needed.

Configure repository **Settings → Secrets and variables → Actions → Variables → New repository variable** named \`BRIONEST_API_BASE_URL\`, set to the public HTTPS origin of your running original FastAPI backend. **Do not put /api at the end.**

Set backend CORS allowed origins to include \`https://brionestsolutions.github.io\` and/or the production custom domain. The original backend has to be **separately hosted**: GitHub Pages cannot execute FastAPI, and credentials for Google Sheets must remain on the server.

**Failure handling:** The legacy FastAPI handler can respond HTTP 200 even if Google Sheets saving fails. This frontend only displays a success message when both \`success === true\` and \`sheets_saved === true\`. The backend should return a suitable failure status on persistence failure and enforce rate limiting and spam protection.

## QA & launch checklist

- Run \`node tests/smoke.test.mjs\` (included in Actions).
- Test on 320/375/768/1024/1440px across Chrome, Edge and Safari, including keyboard navigation and reduced-motion preferences.
- Configure API URL, CORS, confirm actual successful Google Sheet row and failure behavior.
- Replace illustrative imagery with BrioNest's real installations/products with rights and consent when available.
- Verify product scope, service levels and support offerings with the business owner before public marketing claims.
- If launching a custom domain, configure DNS and HTTPS in GitHub Pages settings.

## Files

- \`index.html\` — semantic sections and enquiry form
- \`styles.css\` — visual system and responsive layouts
- \`audience.css\` — package pricing cards and styling
- \`segments.css\` — 4 product groups, developer services, audience chapters, compact logo and trust strip
- \`audience.js\` — package-to-contact selection without hidden tabs
- \`site.js\` — navigation, scene demo, animations and form submission
- \`config.js\` — local fallback API config (Actions generates a deployed version from the repository variable)
- \`favicon.svg\` — custom BrioNest mark
- \`tests/smoke.test.mjs\` — structural and integration-contract smoke checks
- \`.github/workflows/deploy.yml\` — automated GitHub Pages publishing
