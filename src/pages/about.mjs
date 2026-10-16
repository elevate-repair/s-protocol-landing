// `/about` — remaining-pages-spec.md F1–F5. Only verified facts ship (D-16): the origin paragraph in the owner's words,
// the four policy-backed principles and the company ledger; the story paragraphs 2–4, any pull quote and "Based in"
// wait for the owner. No people photography (D-21): the hero visual is the real job record (UI-SP-JOB-01).
import { html } from '../lib/html.mjs';
import { SP, site } from '../lib/data.mjs';
import { graph, webPage } from '../lib/seo.mjs';
import { tm, ctaLink, sectionHead, ledger } from '../components/ui.mjs';
import { artFrame } from '../components/media.mjs';
import { pageHero, twoProductCta, ORIGIN_BODY } from '../components/sections.mjs';

const R = '/about';

function hero() {
  // the page's LCP element: requested early (fetchpriority=high) and never held back by the scroll reveal
  const aside = html`<figure class="about-hero__visual">
      ${artFrame({ wide: { id: 'sp-job-4417', sizes: '(min-width: 1280px) 588px, (min-width: 1024px) 46vw, 728px', visible: 0.62, priority: true },
        narrow: { id: 'sp-job-4417', sizes: 'calc((100vw - 42px) * 1.79)', crop: { x: 0.03, y: 0.05, w: 0.56, h: 0.31 }, priority: true,
          alt: 'S Protocol job record J-4417 for R. Alvarez, Dryer (sample workspace): status Scheduled with technician M. Ruiz, and the Details, Invoice, Payments, Signature and Notes tabs' } })}
      <figcaption class="mono-caption">A REAL JOB RECORD · S PROTOCOL WEB APP · SAMPLE WORKSPACE</figcaption>
    </figure>`;
  return pageHero({
    eyebrowText: 'ABOUT',
    title: html`Built by people running the <em>jobs</em>.`,
    lead: `S Protocol and S Invoice are made by ${site.organization.legal_name}. The first workspace was an appliance repair business — and it still runs on this.`,
    aside,
  });
}

function story() {
  return html`<section class="section section--white" id="story" aria-labelledby="story-title">
  <div class="container"><div class="editorial">
    ${sectionHead({ eyebrow: 'THE STORY', title: 'Made by a service business, for service businesses.', id: 'story-title' })}
    <p class="editorial__body">${ORIGIN_BODY}</p>
  </div></div>
</section>`;
}

function principles() {
  const items = [
    ['One price for the business.', `S Protocol Pro is ${SP.pro.monthly.short} with no per-seat fees and no team-member limit.`],
    ['Free means the real product.', 'Free is the same product Pro uses. No stripped-down demo, no trial countdown.'],
    ['Your records are never held hostage.', 'If billing lapses, everything you created stays readable.'],
    ['Honest labels.', html`Integrations are marked <em>available with setup</em> or <em>by request</em>. There’s no Android app, and we won’t claim one until there is.`],
  ];
  return html`<section class="section section--paper" id="principles" aria-labelledby="principles-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'WHAT WE BELIEVE', title: 'Four policies we hold ourselves to.', id: 'principles-title', cls: 'section-head--7' })}
    <ol class="principles">${items.map(([t, b], i) => html`<li class="principle"><p class="principle__num mono-label">0${i + 1}</p><h3 class="principle__title">${t}</h3><p class="principle__body">${typeof b === 'string' ? tm(b) : b}</p></li>`)}</ol>
  </div>
</section>`;
}

function company() {
  return html`<section class="section section--white" id="company" aria-labelledby="company-title">
  <div class="container company">
    ${sectionHead({ eyebrow: 'THE COMPANY', title: 'Who you’re dealing with.', id: 'company-title' })}
    ${ledger([
      ['Company', site.organization.legal_name],
      ['Products', 'S Protocol and S Invoice'],
      ['Runs on', 'The web and iPhone'],
      ['Support', html`${ctaLink(R, 'support@s-protocol.com', { section: 'F4 The company', cls: 'text-link--plain' })}<span class="ledger__note">We typically respond within one business day.</span>`],
      ['Legal', html`${ctaLink(R, 'Terms', { section: 'F4 The company', cls: 'text-link--inline' })} and ${ctaLink(R, 'Privacy Policy', { section: 'F4 The company', cls: 'text-link--inline' })} — one set for both products.`],
    ], { cls: 'ledger--company' })}
  </div>
</section>`;
}

const TITLE = 'About S Protocol — Built Inside an Appliance Repair Business';
const DESCRIPTION = 'S Protocol and S Invoice are made by Elevate Repair LLC. The first workspace was an appliance repair business, and it still runs on S Protocol.';

export const meta = {
  route: R, page: 'about', title: TITLE, description: DESCRIPTION,
  jsonld: graph(webPage(R, TITLE, DESCRIPTION, { '@type': 'AboutPage', about: { '@id': `${site.origin}/#organization` } })),
};

export function render() {
  return html`${hero()}
${story()}
${principles()}
${company()}
${twoProductCta({ route: R, section: 'F5 CTA band' })}`;
}
