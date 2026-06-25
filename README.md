# s-protocol-landing

Landing page for **S-Protocol** — a free, adaptive CRM for service businesses.

S-Protocol helps service businesses manage customers, jobs, technicians, dispatch,
scheduling, invoices, payments, and daily operations in one simple system. The core
CRM stays free; the platform grows through optional surrounding products and services
(insurance, payment processing, premium integrations, branded systems, and more).

## Stack

Static site — plain HTML, CSS, and vanilla JS. No build step.

- `index.html` — page markup and metadata
- `style.css` — design system and layout
- `main.js` — navigation, scroll reveal, and contact form
- `site.webmanifest` — PWA manifest
- `robots.txt`, `sitemap.xml` — crawler hints

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

- Web app: https://app.s-protocol.com
- iOS app: https://apps.apple.com/us/app/s-protocol/id6763838117

## Develop

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
