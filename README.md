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
7. **BuilderOS:** separately positioned **upcoming** BuilderOS software vision; explicitly marked in development with a conceptual preview. Not marketed as a released product.
8. **Consultation:** functional frontend using original API contract.

No unverified years in business, client testimonials, project counts, certifications, brand authorisations, or fake project photographs.

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
- \`site.js\` — navigation, scene demo, animations and form submission
- \`config.js\` — local fallback API config (Actions generates a deployed version from the repository variable)
- \`favicon.svg\` — custom BrioNest mark
- \`tests/smoke.test.mjs\` — structural and integration-contract smoke checks
- \`.github/workflows/deploy.yml\` — automated GitHub Pages publishing
