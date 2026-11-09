# BrioNest · Living, beautifully in sync.

Premium, mobile-first smart-living website built as a deliberately lightweight static application (HTML + modern CSS + vanilla JavaScript), ready for GitHub Pages.

## Design system (v2)

- **Direction:** understated architectural luxury meets contemporary intelligent living. Editorial layouts, deliberate asymmetry, real-room photography, precise typography and quiet motion.
- **Colors:** porcelain \`#f6f5f1\` for warmth; slate \`#18222b\` for maturity and trust; cobalt \`#465bdc\` for deliberate calls to action and smart-system cues. No decorative gold.
- **Typography:** Manrope for purposeful, confident headlines; Instrument Serif italic for emotional emphasis; DM Sans for readable supporting copy.
- **Responsive:** desktop split hero and editorial grids; dedicated tablet and mobile layouts at 1230, 1050, 790 and 520px; no horizontal scrolling intended.
- **Motion:** initial hero entrance, on-scroll section reveals, tactile hover states, interactive three-scene selector; respects \`prefers-reduced-motion\`.
- **Story:** aspiration → philosophy → interactive experience → practical solutions → developer offer → approach → consultation.
- **Accessibility:** semantic landmarks, keyboard navigation, visible focus, alt text, reduced-motion support, form validity and confirmation status.

## Deploy with GitHub Actions

1. In **Settings → Pages**, choose **Build and deployment → Source: GitHub Actions**.
2. Push to \`main\`. The workflow \`.github/workflows/deploy.yml\` runs \`node tests/smoke.test.mjs\`, then deploys.
3. Site address: https://brionestsolutions.github.io/BrionestWebsite/ (unless a custom domain is configured).
4. If configuring a custom domain, set DNS and HTTPS separately in **Settings → Pages**.

No npm, bundler, or build service is required.

## Preserve the original consultation / Google Sheets workflow

The form posts to the original FastAPI endpoint \`POST {BRIONEST_API_BASE_URL}/api/consultation\`. It submits the existing fields without changes:

\`name\`, \`email\`, \`phone\`, \`customerType\`, \`propertyType\`, \`preferredDate\`, \`message\`.

The values for customer type (\`homeowner\`, \`builder\`, \`referral\`) and property type match the original application.

1. Keep the original FastAPI backend and its Google Sheets service account deployed securely on an **HTTPS host**; GitHub Pages cannot run Python or securely store the Sheets credentials.
2. Go to **Settings → Secrets and variables → Actions → Variables** and set \`BRIONEST_API_BASE_URL\` to the existing backend's public HTTPS origin. Do not include \`/api\` at the end.
3. In the backend CORS settings, allow \`https://brionestsolutions.github.io\` and/or your production custom domain.
4. Run the workflow again and submit a test enquiry. Confirm a row appears in the Google Sheet.

**Important:** The legacy backend may reply with HTTP 200 despite a failed Google Sheets write. The frontend deliberately requires \`success === true\` and \`sheets_saved === true\` before showing confirmation. A server-side improvement would be to return a failure HTTP status on Sheets errors. The form must also have server-side spam/rate limiting before significant public traffic.

If \`BRIONEST_API_BASE_URL\` is missing, visitors receive a clear error instead of a false success message.

## Test / visual QA

Run \`node tests/smoke.test.mjs\` for basic integrity checks. Before a public launch, manually check 320/375/768/1024/1440px, keyboard focus, contact form on real API, device-based image loading, and Safari/iOS behavior. The deployment smoke test is not a substitute for browser testing.

Interior photography is currently illustrative, served from Unsplash. Replace with approved BrioNest photography and check usage permissions, client/project consent, art direction and load performance before calling this the final production art direction. Do not mistake imagery for completed BrioNest customer installations.
