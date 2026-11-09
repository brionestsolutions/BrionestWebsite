# BrioNest — premium smart living website

A responsive, accessible, dependency-free HTML/CSS/JavaScript website with subtle motion, mobile navigation, premium architectural imagery and a consultation form.

## Deployment

1. GitHub repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. A push to `main` triggers `.github/workflows/deploy.yml` and publishes the site to `https://brionestsolutions.github.io/BrionestWebsite/` (unless a custom domain is configured).
3. If Pages requires initial enablement, complete step 1 before re-running Actions.

## Keep original consultation → Google Sheets behavior

The form posts JSON to `{BRIONEST_API_BASE_URL}/api/consultation` with the original fields: `name`, `email`, `phone`, `customerType`, `propertyType`, `preferredDate`, `message`.

**GitHub Pages cannot run FastAPI.** Keep the existing Google-Sheets-backed backend independently hosted over HTTPS. Configure repository **Settings → Secrets and variables → Actions → Variables → New repository variable** named `BRIONEST_API_BASE_URL` and set it to your backend HTTPS origin (without `/api`). Trigger the deployment again. Set backend CORS to allow the Pages/custom-domain origin. Never commit Google service-account credentials.

The original API could return HTTP 200 even when Sheets failed; this UI checks `success === true` AND `sheets_saved === true` and never shows false success. The backend should also be hardened with rate limiting, spam protection and HTTP 503 on a storage failure.

## Launch checklist

- Configure Pages, HTTPS API base URL and backend CORS.
- Submit a test inquiry and verify a row was added to the Google Sheet.
- Replace illustrative Unsplash photos with licensed BrioNest photography; verify branding and contact details.
- Test responsive layouts, accessibility and browser support on real devices.

Preview locally using any static web server, e.g. `python -m http.server 8000`.
