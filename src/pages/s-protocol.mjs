// `/s-protocol` — product-pages-spec.md A1–A12 (night-stage operations platform). Same corrections as the homepage
// (D-01, owner-approved: real app labels only; S Protocol screens are real captures of the web app with the fictional
// demo dataset; estimates belong to the customer) plus the owner-decision safe defaults D-02 (one combined role card),
// D-03 (earnings named only), D-04 (price book as a list of services and prices), D-05 ("Analytics and reporting") and
// D-06 (Quo wording) — IMPLEMENTATION_STATUS.md §12.
import { html } from '../lib/html.mjs';
import { SP, strings } from '../lib/data.mjs';
import { photo } from '../lib/images.mjs';
import { ring } from '../lib/ui-shots.mjs';
import { graph, sProtocolApp, webPage } from '../lib/seo.mjs';
import { tm, eyebrow, ctaLink, sectionHead, featureRow, textLink, iconTile } from '../components/ui.mjs';
import { shotFrame, shotCrop, artFrame, artCrop } from '../components/media.mjs';
import { pricingPair, finePrint, faqList, ctaStage, integrationCards, subnav } from '../components/blocks.mjs';
import { technicianSection, moneySection } from '../components/sections.mjs';

const R = '/s-protocol';
const mono = (text, cls = '') => html`<p class="mono-caption${cls ? ' ' + cls : ''}">${tm(text)}</p>`;

// ------------------------------------------------------------------ A1 Hero (night)
function hero() {
  return html`<section class="hero hero--night hero--sp" id="hero" aria-labelledby="hero-title">
  <div class="container container--wide-right hero__grid">
    <div class="hero__text">
      ${eyebrow('S PROTOCOL · FIELD SERVICE SOFTWARE', { tone: 'night' })}
      <h1 class="display display--night hero__title hero__title--long" id="hero-title">Jobs, schedules, technicians and money — <em>on one board</em>.</h1>
      <p class="lead lead--night hero__lead">S Protocol was built inside a working appliance repair business: one dispatch board for the whole office, S Protocol for <span class="tm">iPhone</span> in every technician’s pocket, estimates, invoices and payments — for ${SP.pro.monthly.short} for the whole team, with no per-seat fees.</p>
      <div class="cta-row hero__ctas">${ctaLink(R, 'Start free', { section: 'A1 Hero' })}${ctaLink(R, 'See pricing', { section: 'A1 Hero' })}</div>
      <p class="microcopy microcopy--night">${strings.s_protocol_microcopy}</p>
    </div>
    <div class="hero__stage sp-stage" data-reveal-group>
      <figure class="sp-stage__tile">
        ${photo({ id: 'OFFICE-02', page: R, section: 'Hero', sizes: '(min-width: 1024px) 280px, 0px', cls: 'photo--tile', eager: true })}
        <figcaption class="mono-caption mono-caption--night">DISPATCH · THE OFFICE</figcaption>
      </figure>
      <div class="sp-stage__board" data-reveal>${artFrame({ dark: true, cls: 'ui-frame--hero-board',
        wide: { id: 'sp-schedule-today-night', sizes: '(min-width: 1280px) 660px, (min-width: 1024px) 400px, calc(100vw - 64px)', priority: true },
        narrow: { id: 'sp-dispatch-today-night', sizes: 'calc(100vw - 42px)', visible: 0.535,
          alt: 'Today’s Schedule on the S Protocol Dispatch screen, Night theme (sample workspace): six jobs today, starting with technician M. Ruiz’s two scheduled jobs and D. Kaur’s two jobs, with times, customers, phone numbers and statuses' } })}</div>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ A3 Dispatch & scheduling
function dispatch() {
  const rows = [
    { title: 'A section for every technician', body: 'Each technician’s jobs for the day in time order, with the customer, the job, the phone number and the status.',
      visual: artCrop({ cls: 'ui-crop--row',
        wide: { id: 'sp-schedule-today-light', sizes: '(min-width: 1280px) 680px, (min-width: 1024px) 55vw, 728px' },
        narrow: { id: 'sp-dispatch-today', sizes: 'calc(100vw - 40px)', visible: 0.535, alt: 'Today’s Schedule on the S Protocol Dispatch screen (sample workspace): technician M. Ruiz’s two scheduled jobs and D. Kaur’s two jobs, each with the time, the customer, the phone number and the status' } }) },
    { title: 'The Unassigned group', body: 'New jobs wait under “Unassigned — needs tech assignment” until someone assigns them to a technician.',
      visual: shotCrop({ id: 'sp-dispatch-today', sizes: '(min-width: 768px) 400px, calc(100vw - 40px)', cls: 'ui-crop--row ui-crop--portrait', overlays: ring('sp-dispatch-today', 'unassigned', { pad: 0.6 }) }) },
    { title: 'The schedule', body: 'Pick the slot, pick the technician — the schedule and the board update together.',
      visual: artCrop({ cls: 'ui-crop--row',
        wide: { id: 'sp-job-4417', sizes: '(min-width: 1280px) 680px, (min-width: 1024px) 55vw, 728px', visible: 0.62, overlays: ring('sp-job-4417', 'sched', { pad: 0.6 }) },
        narrow: { id: 'sp-job-4417', sizes: 'calc((100vw - 40px) * 1.79)', crop: { x: 0.03, y: 0.365, w: 0.56, h: 0.24 }, overlays: ring('sp-job-4417', 'sched', { pad: 0.6 }),
          alt: 'The scheduling card of S Protocol job record J-4417 (sample workspace): August 14, 8:00–10:00 AM, technician M. Ruiz, with Message Staff, Message Customer and Notify Technician buttons' } }) },
  ];
  return html`<section class="section section--paper" id="dispatch" aria-labelledby="dispatch-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'DISPATCH & SCHEDULING', title: 'The morning starts on the board.', id: 'dispatch-title', lead: 'Who’s working, what’s booked, what needs attention and what’s still unassigned — on one screen the whole office shares.', cls: 'section-head--7' })}
    <div class="alt-rows">${rows.map((r, i) => html`<div class="alt-row${i % 2 ? ' alt-row--flip' : ''}">
      <div class="alt-row__text"><p class="mono-label">0${i + 1}</p><h3 class="h3-serif">${r.title}</h3><p>${tm(r.body)}</p></div>
      <div class="alt-row__visual" data-reveal>${r.visual}</div>
    </div>`)}</div>
    <p class="footnote alt-rows__note">Real screens of the S Protocol web app, with a sample workspace.</p>
  </div>
</section>`;
}

// ------------------------------------------------------------------ A4 Technician app
const technicianApp = () => technicianSection({
  route: R, badgeSection: 'A4 Technician app', tone: 'white', photoSlot: { id: 'IND-ELEC-01', page: R, section: 'Technician app' },
  eyebrowText: 'S PROTOCOL FOR iPhone', title: 'Everything the tech needs, nothing they don’t.',
  lead: 'Their day in order, notes and photos, the customer’s signature and payment at the door — on the same record the office sees.',
});

// ------------------------------------------------------------------ A5 Customers & history
function customers() {
  const items = [
    ['Client records'], ['Full job history'], ['Notes and photos'],
    ['Website lead intake', 'set up with you', 'Website leads arrive with the address and the problem attached, ready to become a booked job.'],
    ['Calls and SMS through Quo', 'by request', 'On your business line.'],
  ];
  return html`<section class="section section--paper" id="customers" aria-labelledby="cust-title">
  <div class="container split split--visual-right split--5-7">
    <div class="split__text">
      ${sectionHead({ eyebrow: 'CUSTOMERS', title: 'The history is there when they call back.', id: 'cust-title', lead: 'Every client record keeps the contact details, notes and the full job history — so the next visit starts from what you already know.' })}
      <ul class="fact-list">${items.map(([name, tag, line]) => html`<li class="fact-list__row"><p class="fact-list__name">${name}${tag ? html` <span class="fact-list__tag">(${tag})</span>` : ''}</p>${line ? html`<p class="fact-list__line">${line}</p>` : ''}</li>`)}</ul>
    </div>
    <div class="split__visual" data-reveal>
      ${shotFrame({ id: 'sp-client-alvarez', sizes: '(min-width: 768px) 400px, calc(100vw - 40px)', cls: 'ui-frame--client' })}
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ A6 Money
const money = () => moneySection({ reports: true, compare: textLink({ label: 'Compare everything →', href: '/compare', track: 'section_link_click', props: { section: 'payments', link: 'compare' } }) });

// ------------------------------------------------------------------ A7 Team & roles
function team() {
  return html`<section class="section section--paper" id="team" aria-labelledby="team-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'TEAM & ROLES', title: 'Add the whole crew. The price stays the same.', id: 'team-title', lead: 'Owner, dispatcher and technician roles, team chat on the job and technician earnings — with no per-seat fees and no team-member limit.', cls: 'section-head--7' })}
    <div class="team-grid">
      <figure class="team-grid__photo" data-reveal>
        ${photo({ id: 'CREW-01', page: R, section: 'Team & roles', sizes: '(min-width: 1024px) 384px, (min-width: 768px) 704px, calc(100vw - 40px)', cls: 'photo--panel' })}
        <figcaption class="mono-caption">CREWS, NOT SEATS</figcaption>
      </figure>
      <div class="team-grid__body">
        <article class="role-card">
          ${iconTile('shield-check')}
          <h3 class="role-card__title">Owner · Dispatcher · Technician</h3>
          <p>Every role is included in Pro — with no per-seat fees and no team-member limit.</p>
        </article>
        <div class="feature-rows feature-rows--two">
          ${featureRow({ icon: 'messages-square', title: 'Team chat on the job', body: 'Talk about the job on the job, not in a separate group chat.' })}
          ${featureRow({ icon: 'wallet', title: 'Technician earnings' })}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ A8 Price book & reporting
function priceBook() {
  return html`<section class="band band--white band--compact" id="price-book" aria-labelledby="pb-title">
  <div class="container">
    <h2 class="sr-only" id="pb-title">Price book and reporting</h2>
    <div class="duo-cards">
      <article class="base-card">${iconTile('book-open')}<h3 class="base-card__title">Price book</h3><p>Keep your standard services and prices in one place.</p></article>
      <article class="base-card">${iconTile('chart-column')}<h3 class="base-card__title">Analytics</h3><p>The numbers come from the same jobs, invoices and payments your team works on.</p><p>${textLink({ label: 'Know what came in →', href: '#reports', track: 'section_link_click', props: { section: 'price_book', link: 'reports' } })}</p></article>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ A9 Integrations summary
function integrations() {
  return html`<section class="section section--paper" id="integrations" aria-labelledby="int-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'INTEGRATIONS', title: 'What connects.', id: 'int-title', cls: 'section-head--7' })}
    ${integrationCards(R)}
  </div>
</section>`;
}

// ------------------------------------------------------------------ A10 Pricing
function pricing() {
  const a = SP.free.allowance;
  const head = sectionHead({ eyebrow: 'PRICING', title: 'One price for the business. No per-seat math.', id: 'pricing-title', lead: 'Add every dispatcher and technician you employ — the price doesn’t move. Free is a real way to set up and try the whole platform.' });
  return html`<section class="section section--white" id="pricing" aria-labelledby="pricing-title">
  <div class="container pricing-wrap">
    ${pricingPair({
      product: 's_protocol', route: R, location: 's_protocol_page', toggleId: 'sp-billing', head,
      free: { label: 'S PROTOCOL FREE', section: 'A10 Pricing — Free', cta: 'Create a free workspace', items: [`Your first ${a.jobs} jobs, ${a.invoices} invoices and ${a.recorded_payments} recorded payments`, 'A one-time allowance for the business, not a monthly reset', 'Every feature unlocked — nothing held back', 'Whatever you create stays readable, always'] },
      pro: { label: 'S PROTOCOL PRO', section: 'A10 Pricing — Pro', cta: 'Start with S Protocol', note: 'Start on Free, then upgrade when you’re ready.', items: ['Unlimited jobs, invoices and payments', html`Every role and integration included<sup>1</sup>`, 'No per-seat fees and no team-member limit', 'Cancel anytime — Pro runs to the end of the period you paid for', 'If billing lapses, your records are never hidden'] },
    })}
    <p class="footnote pricing-wrap__foot"><sup>1</sup> Integrations are set up with you or available by request — see <a href="#integrations">Integrations</a>.</p>
    ${finePrint()}
    <p class="links-row">${ctaLink(R, 'See full pricing →', { section: 'A10 Pricing' })}</p>
  </div>
</section>`;
}

// ------------------------------------------------------------------ A11 FAQ
function faq() {
  return html`<section class="section section--paper" id="faq" aria-labelledby="faq-title">
  <div class="container faq-layout">
    <div class="faq-layout__head">${sectionHead({ eyebrow: 'FAQ', title: 'Questions about S Protocol.', id: 'faq-title' })}</div>
    <div class="faq-layout__list">
      ${faqList(R, { idPrefix: 'sp-faq', defaultOpen: 'per-technician' })}
      <p class="faq-more">${ctaLink(R, 'See all questions →', { section: 'A11 FAQ' })}</p>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ A12 Final CTA
function finalCta() {
  const a = SP.free.allowance;
  return ctaStage({
    route: R, id: 'start', headingId: 'start-title', eyebrowText: 'FREE TO START · NO CARD',
    title: html`Put tomorrow’s jobs on the board <em>today</em>.`,
    lead: `Free for your first ${a.jobs} jobs, ${a.invoices} invoices and ${a.recorded_payments} payments. No card.`,
    single: ctaLink(R, 'Start free', { section: 'A12 Final CTA' }),
  });
}

const SUBNAV = [['Dispatch', 'dispatch'], ['Technician app', 'technician-app'], ['Customers', 'customers'], ['Money', 'payments'], ['Team', 'team'], ['Integrations', 'integrations'], ['Pricing', 'pricing'], ['FAQ', 'faq']];

const TITLE = 'S Protocol: Dispatch Board, Technician App & Payments';
const DESCRIPTION = `A shared dispatch board, S Protocol for iPhone, estimates, invoices and card payments in one place. Free to start; Pro is ${SP.pro.monthly.short} for the whole team.`;

export const meta = {
  route: R, page: 's_protocol', title: TITLE, description: DESCRIPTION,
  ogImage: { url: 'https://s-protocol.com/assets/brand/og-s-protocol.png', width: 1200, height: 630 },
  ogImageAlt: `“Jobs, schedules, technicians and money — on one board.” S Protocol, ${SP.pro.monthly.short} for the whole team and free to start, beside the real Dispatch screen with a sample workspace`,
  jsonld: graph(webPage(R, TITLE, DESCRIPTION, { about: { '@id': 'https://s-protocol.com/#app' } }), sProtocolApp()),
};

export function render() {
  return html`${hero()}
${subnav(R, SUBNAV)}
${dispatch()}
${technicianApp()}
${customers()}
${money()}
${team()}
${priceBook()}
${integrations()}
${pricing()}
${faq()}
${finalCta()}`;
}
