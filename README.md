# s-protocol-landing

Public marketing website for **S Protocol** — the service-business operating platform —
and **S Invoice**, its focused estimates & invoicing product. Both are products of
Elevate Repair LLC.

S Protocol helps service businesses manage jobs, customers, technicians, dispatch,
scheduling, estimates, invoices, payments, and daily operations in one connected
platform. A Free plan is available; S Protocol Pro unlocks unlimited use.

## Stack

Static site — plain HTML, CSS, and vanilla JS. No build step.

- `index.html` — homepage markup and metadata
- `s-invoice/index.html` — S Invoice product page (`/s-invoice`)
- `terms/index.html` — Terms of Service (`/terms`)
- `privacy/index.html` — Privacy Policy (`/privacy`)
- `style.css` — design system and layout (shared by all pages)
- `main.js` — navigation, scroll reveal, and contact form (shared)
- `site.webmanifest` — PWA manifest
- `robots.txt`, `sitemap.xml` — crawler hints

Legal pages carry a version date (`2026-07-01`) that must stay in sync with the
`CURRENT_TERMS_VERSION` / `CURRENT_PRIVACY_VERSION` constants enforced by the
signup Edge Functions.

## Assets

```
assets/
  brand/      # logos, app icon, OG image (-master.png files are source only)
  favicons/   # favicon, app-touch, and PWA icons
```

Optimized web assets (`logo-header`, `logo-footer`, `app-icon`, `og-image`) are
generated from the `*-master.png` source files. Don't reference the heavy master
files directly in the page.

## Links

- S Protocol web app: https://app.s-protocol.com
- S Invoice web app: https://invoice.s-protocol.com
- iOS app: https://apps.apple.com/us/app/s-protocol/id6763838117

## Develop

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
