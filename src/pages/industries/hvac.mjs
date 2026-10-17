// `/industries/hvac` — industry-pages-spec.md I1–I7, counter-positioned against per-technician pricing. Copy is
// corrected to what the app really does (no "On site" status and no drag-and-drop columns: jobs are assigned from the
// Unassigned group — D-01, IMPLEMENTATION_STATUS.md §12); maintenance agreements are held back (D-20). Text never sits on
// the hero photo.
import { html } from '../../lib/html.mjs';
import { SP, strings, site } from '../../lib/data.mjs';
import { photo, preloadPhoto } from '../../lib/images.mjs';
import { graph, webPage } from '../../lib/seo.mjs';
import { ctaLink, sectionHead, featureRow } from '../../components/ui.mjs';
import { faqList } from '../../components/blocks.mjs';
import { pageHero, breadcrumb, boardSection, moneySection, sProtocolCta, TECH_ROWS, officeTile } from '../../components/sections.mjs';

const R = '/industries/hvac';
const HERO_SIZES = '(min-width: 1280px) 646px, (min-width: 1024px) calc(58.33vw - 101px), (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)';

function hero() {
  const aside = html`<div class="ind-stage ind-stage--chip" data-reveal-group>
      ${photo({ id: 'HERO-01', page: R, section: 'Hero', sizes: HERO_SIZES, cls: 'ind-stage__photo', priority: true })}
      <span class="job-chip ind-stage__chip" aria-hidden="true"><i class="job-chip__dot job-chip__dot--scheduled"></i><span class="job-chip__text">Scheduled · AC not cooling</span></span>
    </div>`;
  const after = html`<div class="cta-row hero__ctas">${ctaLink(R, 'Start free', { section: 'I1 Hero' })}${ctaLink(R, 'See pricing', { section: 'I1 Hero' })}</div>
    <p class="microcopy">${strings.s_protocol_microcopy_short}</p>`;
  return pageHero({
    breadcrumbs: breadcrumb('HVAC'),
    eyebrowText: 'HVAC SOFTWARE',
    title: html`One price for every tech, even in <em>peak season</em>.`,
    lead: `When the AC quits in July, the board fills fast. S Protocol keeps every call, every technician and every payment on one record — ${SP.pro.monthly.short} for the whole team, not per technician.`,
    after, aside, cls: 'page-hero--industry',
  });
}

// ------------------------------------------------------------------ I3 Rooftop to driveway
function rooftop() {
  return html`<section class="section section--paper" id="rooftop" aria-labelledby="rooftop-title">
  <div class="container split split--visual-left">
    <figure class="split__visual rooftop__visual" data-reveal>
      ${photo({ id: 'IND-HVAC-01', page: R, section: 'Commercial & rooftop work', sizes: '(min-width: 1280px) 686px, (min-width: 1024px) calc(50vw - 52px), (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)', cls: 'photo--panel rooftop__photo' })}
      <figcaption class="mono-caption">COMMERCIAL &amp; ROOFTOP WORK</figcaption>
    </figure>
    <div class="split__text">
      ${sectionHead({ eyebrow: 'IN THE FIELD', title: 'The job record goes where the tech goes.', id: 'rooftop-title', lead: 'Notes, photos and the customer’s signature from S Protocol for iPhone, on the same record the office sees.' })}
      <div class="feature-rows">${TECH_ROWS.map((r) => featureRow(r))}</div>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ I5 Crews, not seats
function crews() {
  return html`<section class="section section--paper" id="crews" aria-labelledby="crews-title">
  <div class="container crews">
    ${sectionHead({ eyebrow: 'CREWS, NOT SEATS', title: 'Add a seasonal tech without changing the price.', id: 'crews-title', lead: 'S Protocol Pro has no per-seat charge and no team-member limit — owner, dispatcher and technician roles are all included.', cls: 'section-head--7' })}
    <p class="price-line"><span class="price-line__amount">${SP.pro.monthly.display}</span><span class="price-line__unit">/mo for the whole team · or ${SP.pro.yearly.short} · Free to start</span></p>
    <div class="cta-row crews__cta">${ctaLink(R, 'Start free', { section: 'I5 Crews, not seats' })}</div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ I6 FAQ
function faq() {
  return html`<section class="section section--white" id="faq" aria-labelledby="faq-title">
  <div class="container faq-layout">
    <div class="faq-layout__head">${sectionHead({ eyebrow: 'FAQ', title: 'Questions from HVAC teams.', id: 'faq-title' })}</div>
    <div class="faq-layout__list">${faqList(R, { idPrefix: 'hvac-faq', defaultOpen: 'hvac-per-tech' })}</div>
  </div>
</section>`;
}

const TITLE = 'HVAC Software With No Per-Technician Fees | S Protocol';
const DESCRIPTION = `Dispatch, technician app, estimates, invoices and payments for HVAC teams — one price for the whole business, ${SP.pro.monthly.short}, with no per-technician fees.`;

export const meta = {
  route: R, page: 'industry_hvac', title: TITLE, description: DESCRIPTION,
  preloads: preloadPhoto({ id: 'HERO-01', page: R, section: 'Hero', sizes: HERO_SIZES }),
  jsonld: graph(
    webPage(R, TITLE, DESCRIPTION, { about: { '@id': `${site.origin}/#app` }, breadcrumb: { '@id': `${site.origin}${R}#breadcrumb` } }),
    { '@type': 'BreadcrumbList', '@id': `${site.origin}${R}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
      { '@type': 'ListItem', position: 2, name: 'HVAC', item: `${site.origin}${R}` },
    ] },
  ),
};

export function render() {
  return html`${hero()}
${boardSection({ route: R, title: 'Every call, every tech, one board.', lead: 'When the Unassigned group fills up, the dispatcher sees it first — and assigns each job to the right technician.', ctaSection: 'I2 Board', eyebrowText: 'THE BOARD IN A HEAT WAVE', tile: officeTile() })}
${rooftop()}
${moneySection({})}
${crews()}
${faq()}
${sProtocolCta({ route: R, section: 'I7 CTA band' })}`;
}
