// 404 — remaining-pages-spec.md J. Served as site/404.html, which Cloudflare Pages returns with a real HTTP 404 for
// unknown paths. noindex, normal header and footer, no canonical.
import { html } from '../lib/html.mjs';
import { ctaMap } from '../lib/data.mjs';
import { ctaLink } from '../components/ui.mjs';

const R = '/404';

export const meta = {
  route: R, page: 'not_found', title: 'Page Not Found | S Protocol', robots: 'noindex',
  description: null,
};

export function render() {
  const links = ctaMap.pages[R].map((e) => e.label);
  return html`<section class="not-found" aria-labelledby="nf-title">
  <div class="container not-found__inner">
    <p class="mono-label">ERROR 404</p>
    <h1 class="h1-page" id="nf-title">That page isn’t here.</h1>
    <p class="lead">The link may be old — we reorganized the site. These will get you back on track:</p>
    <ul class="link-list">${links.map((l) => html`<li>${ctaLink(R, l, { cls: 'text-link--lg' })}</li>`)}</ul>
  </div>
</section>`;
}
