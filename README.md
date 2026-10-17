# s-protocol-landing

Public marketing website for **S Protocol** — the service-business operating platform —
and **S Invoice**, its focused estimates & invoicing product. Both are products of
Elevate Repair LLC.

S Protocol helps service businesses manage jobs, customers, technicians, dispatch,
scheduling, estimates, invoices, payments, and daily operations in one connected
platform. A Free plan is available; S Protocol Pro unlocks unlimited use.

## Redesigned site (`site/`)

The redesigned website is the committed, prebuilt `site/` folder. Cloudflare Pages
serves that folder and nothing else: `wrangler.toml` sets the build output directory
to `site`, and there is no build command. Branch previews use it as soon as a branch
contains the file; production uses it once the file is on `main`, so merging it is
the release. The legacy files described under **Legacy site** stay in the repository as
build inputs (legal text, `clarity.js`, the contact endpoint in `main.js`,
`site.webmanifest`). They are no longer published once `wrangler.toml` is on `main`.

```
src/               page sources, styles, scripts, data   → node scripts/build-site.mjs → site/
photo-originals/   the 17 approved photos (source files, never published)
scripts/images/    photo pipeline (sharp)                → site/images/photos/ + images.generated.json
```

```bash
npm --prefix scripts/images ci              # once: sharp for the photo pipeline
node scripts/images/build-images.mjs        # photos → site/images/ (only after a photo changes)
node scripts/build-site.mjs --strict        # pages → site/ (fails if a photo slot is still pending)
node scripts/build-site.mjs --check         # exit 1 if the committed site/ is stale
node scripts/preview-site.mjs               # serve site/ locally like Cloudflare Pages
```

Commit `site/` together with its sources: Cloudflare publishes exactly what is
committed. The **Site build check** GitHub workflow (`.github/workflows/site-check.yml`)
runs `node scripts/build-site.mjs --check --strict` on every push and pull request, and
fails if `site/` is stale, holds files the build would delete, or has a pending photo. On `*.pages.dev` previews the contact form only says "Preview only — this
message was not sent"; it sends from s-protocol.com (and localhost for testing) only.
See `photo-originals/README.md` for the photos, their sizes and credits.

## Legacy site (repository root)

The pre-redesign site, served from the repository root until `wrangler.toml` reaches
`main`. Static site — plain HTML, CSS, and vanilla JS. No build step.

- `index.html` — homepage markup and metadata
- `s-invoice/index.html` — S Invoice product page (`/s-invoice`)
- `terms/index.html` — Terms of Service (`/terms`)
- `privacy/index.html` — Privacy Policy (`/privacy`)
- `style.css` — design system and layout (shared by all pages)
- `main.js` — navigation, scroll reveal, and contact form (shared)
- `clarity.js` — shared Microsoft Clarity loader for all pages, carrying the
  approved s-protocol.com project ID in `CLARITY_PROJECT_ID` (Clarity
  dashboard → Settings → Overview; same source as the existing Elevate public
  sites). Clearing the ID turns the loader into a no-op. Never commit a
  guessed/placeholder ID.
- `site.webmanifest` — PWA manifest
- `robots.txt`, `sitemap.xml` — crawler hints

## Legal-version release note

The public Terms and Privacy pages are effective **2026-07-19** (their actual
publication date). The S Protocol app repository must be updated separately, in
its own release, to match:

- set `CURRENT_TERMS_VERSION` and `CURRENT_PRIVACY_VERSION` to `2026-07-19`
  (signup Edge Functions and `src/data/legal.js`);
- point the signup/legal links at the canonical pages
  `https://s-protocol.com/terms` and `https://s-protocol.com/privacy`.

Until that app release ships, the app keeps recording acceptance of its current
constants. Historical acceptance records are version-stamped and must not be
rewritten to this version.

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

For the redesigned site, see **Redesigned site** above. For the legacy site, open
`index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
