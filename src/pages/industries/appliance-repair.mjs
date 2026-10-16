// `/industries/appliance-repair` — industry-pages-spec.md H1–H8, S Protocol's origin trade. The sample day is rewritten
// to what the app really does (no "On site" status, no technician-side customer history — D-01, IMPLEMENTATION_STATUS.md
// §12); the past-visits and inventory questions are held back (status "confirm"). The board, technician-app, money and
// origin sections reuse the homepage's, with this page's own CTA-map entries.
import { html } from '../../lib/html.mjs';
import { SP, strings, site } from '../../lib/data.mjs';
import { photo, preloadPhoto } from '../../lib/images.mjs';
import { graph, webPage } from '../../lib/seo.mjs';
import { tm, ctaLink, sectionHead } from '../../components/ui.mjs';
import { shotCrop } from '../../components/media.mjs';
import { faqList } from '../../components/blocks.mjs';
import { pageHero, breadcrumb, boardSection, technicianSection, moneySection, originSection, sProtocolCta, officeTile } from '../../components/sections.mjs';

const R = '/industries/appliance-repair';
const HERO_SIZES = '(min-width: 1280px) 690px, (min-width: 1024px) 52vw, calc(100vw - 40px)';

function hero() {
  const aside = html`<div class="ind-stage" data-reveal-group>
      ${photo({ id: 'IND-APPL-01', page: R, section: 'Hero', sizes: HERO_SIZES, cls: 'ind-stage__photo', priority: true })}
      <div class="ind-stage__crop" data-reveal>${shotCrop({ id: 'sp-dispatch-today', sizes: '(min-width: 1024px) 300px, 260px', visible: 0.44, eager: true, alt: 'Today’s Schedule on the S Protocol Dispatch screen (sample workspace): six jobs, starting with technician M. Ruiz’s two scheduled jobs' })}</div>
    </div>`;
  const after = html`<div class="cta-row hero__ctas">${ctaLink(R, 'Start free', { section: 'H1 Hero' })}${ctaLink(R, 'See pricing', { section: 'H1 Hero' })}</div>
    <p class="microcopy">${strings.s_protocol_microcopy_short}</p>`;
  return pageHero({
    breadcrumbs: breadcrumb('Appliance repair'),
    eyebrowText: 'APPLIANCE REPAIR SOFTWARE',
    title: html`Software built inside an appliance repair <em>business</em>.`,
    lead: `Same-day calls land on the board, every technician’s day is in order on their iPhone, and the invoice gets paid at the door — for ${SP.pro.monthly.short} for the whole team.`,
    after, aside, cls: 'page-hero--industry',
  });
}

// ------------------------------------------------------------------ H2 A sample day
const DAY = [
  ['7:45 AM', 'Two new jobs are waiting under Unassigned: one from the website form, one taken by phone.'],
  ['8:00 AM', 'The first dryer call is on the technician’s iPhone, with the address and the customer’s problem.'],
  ['9:30 AM', 'Photos of the worn part and a note go onto the job record.'],
  ['10:15 AM', 'The customer approves the estimate, and it converts to the invoice in one click.'],
  ['10:40 AM', 'Paid at the door with Tap to Pay on iPhone.'],
  ['5:30 PM', 'The office checks what’s paid and what’s still owed.'],
];
function sampleDay() {
  return html`<section class="section section--white" id="a-day" aria-labelledby="day-title">
  <div class="container day">
    <div class="day__text">
      ${sectionHead({ eyebrow: 'A SAMPLE DAY', title: 'From the first call to the last payment.', id: 'day-title' })}
      <p class="day__caption">Illustrative day using the sample workspace.</p>
      <ol class="timeline">${DAY.map(([t, b]) => html`<li class="timeline__item"><span class="timeline__time">${t}</span><p class="timeline__body">${tm(b)}</p></li>`)}</ol>
      <p class="footnote">Website lead intake and Tap to Pay on <span class="tm">iPhone</span> are set up with you.</p>
    </div>
    <figure class="day__visual" data-reveal>
      ${photo({ id: 'IND-APPL-02', page: R, section: '"A typical day" (second visual)', sizes: '(min-width: 1280px) 588px, (min-width: 1024px) 46vw, (min-width: 768px) 704px, calc(100vw - 40px)', cls: 'photo--panel day__photo' })}
    </figure>
  </div>
</section>`;
}

// ------------------------------------------------------------------ H7 FAQ
function faq() {
  return html`<section class="section section--paper" id="faq" aria-labelledby="faq-title">
  <div class="container faq-layout">
    <div class="faq-layout__head">${sectionHead({ eyebrow: 'FAQ', title: 'Questions from appliance repair shops.', id: 'faq-title' })}</div>
    <div class="faq-layout__list">${faqList(R, { idPrefix: 'appl-faq', defaultOpen: 'per-technician' })}</div>
  </div>
</section>`;
}

const TITLE = 'Appliance Repair Software: Dispatch & Invoicing | S Protocol';
const DESCRIPTION = `Field service software built inside an appliance repair business: same-day dispatch board, technician app, invoices and payment at the door. ${SP.pro.monthly.short}.`;

export const meta = {
  route: R, page: 'industry_appliance_repair', title: TITLE, description: DESCRIPTION,
  preloads: preloadPhoto({ id: 'IND-APPL-01', page: R, section: 'Hero', sizes: HERO_SIZES }),
  jsonld: graph(
    webPage(R, TITLE, DESCRIPTION, { about: { '@id': `${site.origin}/#app` }, breadcrumb: { '@id': `${site.origin}${R}#breadcrumb` } }),
    { '@type': 'BreadcrumbList', '@id': `${site.origin}${R}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
      { '@type': 'ListItem', position: 2, name: 'Appliance repair', item: `${site.origin}${R}` },
    ] },
  ),
};

export function render() {
  return html`${hero()}
${sampleDay()}
${boardSection({ route: R, title: 'Same-day calls, on one board.', lead: 'Every technician’s jobs, every job’s status and every call still waiting — before the first job of the day.', ctaSection: 'H3 Board', tile: officeTile() })}
${technicianSection({ route: R, badgeSection: 'H4 Technician app', photoSlot: { id: 'MOBILE-01', page: '/', section: 'Technician app (iPhone)' } })}
${moneySection({})}
${originSection({ route: R, linkSection: 'H6 Where S Protocol started', id: 'origin' })}
${faq()}
${sProtocolCta({ route: R, section: 'H8 CTA band' })}`;
}
