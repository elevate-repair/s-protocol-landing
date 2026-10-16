// `/s-protocol` — product-pages-spec.md A1–A12 (night-stage operations platform). Same D-01 / D-30 adaptations as the
// homepage (real app labels only; HTML replicas of existing web screens until the captures exist; no device images)
// plus the owner-decision safe defaults D-02 (one combined role card), D-03 (earnings named only), D-04 (price book as
// a list of services and prices), D-05 ("Analytics and reporting") and D-06 (Quo wording) — status §12.
import { html, trackAttrs } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { SP, strings, ctaPattern } from '../lib/data.mjs';
import { photo } from '../lib/images.mjs';
import { graph, sProtocolApp, webPage } from '../lib/seo.mjs';
import { tm, eyebrow, ctaLink, sectionHead, featureRow, textLink, iconTile } from '../components/ui.mjs';
import { uiFrame, uiCrop, appStoreBadge, replicaBody } from '../components/media.mjs';
import { boardReplica, BOARD_LABEL, jobRecordReplica, estimateReplica, jobInvoiceReplica } from '../components/replicas.mjs';
import { pricingPair, finePrint, faqList, paymentCompare, ctaStage, integrationCards, subnav } from '../components/blocks.mjs';

const R = '/s-protocol';
const mono = (text, cls = '') => html`<p class="mono-caption${cls ? ' ' + cls : ''}">${tm(text)}</p>`;

// ------------------------------------------------------------------ A1 Hero (night)
function hero() {
  return html`<section class="hero hero--night hero--sp" id="hero" aria-labelledby="hero-title">
  <div class="container container--wide-right hero__grid">
    <div class="hero__text">
      ${eyebrow('S PROTOCOL · FIELD SERVICE SOFTWARE', { tone: 'night' })}
      <h1 class="display display--night hero__title hero__title--long" id="hero-title">Jobs, schedules, technicians and money — <em>on one board</em>.</h1>
      <p class="lead lead--night hero__lead">S Protocol was built inside a working appliance repair business: a live dispatch board, S Protocol for <span class="tm">iPhone</span> in every technician’s pocket, estimates, invoices and payments — for ${SP.pro.monthly.short} for the whole team, with no per-seat fees.</p>
      <div class="cta-row hero__ctas">${ctaLink(R, 'Start free', { section: 'A1 Hero' })}${ctaLink(R, 'See pricing', { section: 'A1 Hero' })}</div>
      <p class="microcopy microcopy--night">${strings.s_protocol_microcopy}</p>
    </div>
    <div class="hero__stage sp-stage" data-reveal-group>
      <figure class="sp-stage__tile">
        ${photo({ id: 'OFFICE-02', page: R, section: 'Hero', sizes: '(min-width: 1024px) 280px, 0px', cls: 'photo--tile', priority: true })}
        <figcaption class="mono-caption mono-caption--night">DISPATCH · THE OFFICE</figcaption>
      </figure>
      <figure class="ui-frame ui-frame--dark ui-frame--hero-board" data-reveal>
        <div class="ui-frame__bar" aria-hidden="true"><span class="ui-frame__dots"><i></i><i></i><i></i></span><span class="ui-frame__host">app.s-protocol.com</span></div>
        <div class="board-scroll board-scroll--hero" data-board-scroll tabindex="0" role="region" aria-label="Dispatch board sample — scroll sideways">${replicaBody(BOARD_LABEL, boardReplica({ withRail: false }), 'ui-frame__body')}</div>
      </figure>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ A3 Dispatch & scheduling
function dispatch() {
  const rows = [
    { title: 'Technician columns', body: 'Each technician gets a column for the day, in time order, with live updates from their iPhone.', visual: uiCrop({ label: 'Dispatch board crop (sample workspace): the day’s columns for technicians M. Ruiz and D. Kaur next to the Unassigned group', content: boardReplica({ cols: ['ruiz', 'kaur'], withRail: false, head: false }), cls: 'ui-crop--dark ui-crop--row' }) },
    { title: 'The Unassigned group', body: 'New jobs wait there until someone assigns them to a technician.', visual: uiCrop({ label: 'Dispatch board crop (sample workspace): the Unassigned group with two Pending jobs — a website lead and an inbound call', content: boardReplica({ cols: [], withRail: false, head: false, cls: 'rp-board--lane' }), cls: 'ui-crop--dark ui-crop--row ui-crop--narrow' }) },
    { title: 'The schedule', body: 'Pick the slot, pick the technician — the schedule and the board update together.', visual: uiCrop({ label: 'Job #4417 “Dryer not heating” booked for technician M. Ruiz on Thursday, August 14 at 8:00 AM (sample workspace)', content: html`<div class="rp-static" data-step="2">${jobRecordReplica()}</div>`, cls: 'ui-crop--row ui-crop--record' }) },
  ];
  return html`<section class="section section--paper" id="dispatch" aria-labelledby="dispatch-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'DISPATCH & SCHEDULING', title: 'The morning starts on the board.', id: 'dispatch-title', lead: 'Who’s working, what’s booked, what’s running late and what’s still unassigned — on one screen the whole office shares.', cls: 'section-head--7' })}
    <div class="alt-rows">${rows.map((r, i) => html`<div class="alt-row${i % 2 ? ' alt-row--flip' : ''}">
      <div class="alt-row__text"><p class="mono-label">0${i + 1}</p><h3 class="h3-serif">${r.title}</h3><p>${tm(r.body)}</p></div>
      <div class="alt-row__visual" data-reveal>${r.visual}</div>
    </div>`)}</div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ A4 Technician app
function technicianApp() {
  const badge = ctaPattern(R, 'A4 Technician app');
  return html`<section class="section section--white" id="technician-app" aria-labelledby="tech-title">
  <div class="container split split--visual-left">
    <div class="split__visual tech-stage" data-reveal>
      <figure class="tech-stage__photo">
        ${photo({ id: 'IND-ELEC-01', page: R, section: 'Technician app', sizes: '(min-width: 1280px) 460px, (min-width: 1024px) 360px, (min-width: 768px) 400px, calc(100vw - 40px)', cls: 'photo--panel' })}
        <figcaption class="mono-caption">ON THE JOB · S Protocol for <span class="tm">iPhone</span></figcaption>
      </figure>
    </div>
    <div class="split__text">
      ${sectionHead({ eyebrow: 'S PROTOCOL FOR iPhone', title: 'Everything the tech needs, nothing they don’t.', id: 'tech-title', lead: 'Their day in order, the customer’s history, notes and photos, and payment at the door — on the same record the office sees.' })}
      <div class="feature-rows">
        ${featureRow({ icon: 'camera', title: 'Notes and photos', body: 'Before-and-after photos and notes stay in the customer’s history.' })}
        ${featureRow({ icon: 'history', title: 'The customer’s history', body: 'Previous visits and what was paid, right on the job.' })}
        ${featureRow({ icon: 'credit-card', title: 'Payment at the door', body: 'Tap to Pay on iPhone or a card reader, in USD, or record a cash payment.' })}
      </div>
      <div class="download-row">${appStoreBadge(badge)}<p>S Protocol runs on <span class="tm">iPhone</span> and on the web. There’s no Android app.</p></div>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ A5 Customers & history
function customers() {
  const items = [
    ['Client records'], ['Full job history'], ['Notes and photos'],
    ['Website lead intake', 'set up with you', 'Website leads arrive with the address and the problem attached, ready to become a booked job.'],
    ['Calls and SMS through Quo', 'by request', 'Calls and SMS on your business line — by request.'],
  ];
  return html`<section class="section section--paper" id="customers" aria-labelledby="cust-title">
  <div class="container split split--visual-right split--5-7">
    <div class="split__text">
      ${sectionHead({ eyebrow: 'CUSTOMERS', title: 'The history is there when they call back.', id: 'cust-title', lead: 'Every client record keeps the full job history, notes and photos — so the next visit starts from what you already know.' })}
      <ul class="fact-list">${items.map(([name, tag, line]) => html`<li class="fact-list__row"><p class="fact-list__name">${name}${tag ? html` <span class="fact-list__tag">(${tag})</span>` : ''}</p>${line ? html`<p class="fact-list__line">${line}</p>` : ''}</li>`)}</ul>
    </div>
    <div class="split__visual" data-reveal>
      ${uiFrame({ label: 'S Protocol job record for R. Alvarez (sample workspace) with the customer’s history: this visit and two previous paid visits', content: html`<div class="rp-static" data-step="5">${jobRecordReplica()}</div>`, cls: 'ui-frame--record' })}
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ A6 Money
function money() {
  return html`<section class="section section--white" id="payments" aria-labelledby="money-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'ESTIMATES · INVOICES · PAYMENTS', title: 'Quote it, bill it, collect it — on the same job.', id: 'money-title', lead: 'Build the estimate on the job. Approved work converts straight to the invoice. Your customer pays online from the invoice link — or your technician takes the card at the door.', cls: 'section-head--7' })}
    <div class="money-cards money-cards--four">
      <article class="money-card" data-reveal>
        <div class="money-card__visual">${uiCrop({ label: 'Estimate for the job “Dryer not heating” with three line items and the total', content: estimateReplica(), cls: 'ui-crop--card' })}</div>
        <div class="money-card__text"><p class="mono-label">ESTIMATE</p><h3 class="h3-serif">Priced on the job</h3><p>Line items and notes live on the job record. When the customer says yes, the estimate becomes the invoice — nothing retyped.</p></div>
      </article>
      <article class="money-card" data-reveal>
        <div class="money-card__visual">${uiCrop({ label: 'Customer-facing invoice #2184 for “Dryer not heating” with the line items, the balance due and a Pay button', content: jobInvoiceReplica(), cls: 'ui-crop--card' })}</div>
        <div class="money-card__text"><p class="mono-label">INVOICE</p><h3 class="h3-serif">An invoice they can pay from their phone</h3><p>Send a link or a PDF. Your customer opens it, sees the work and pays by card.</p><p class="footnote">Online card payments run on Stripe, connected with you during setup.</p></div>
      </article>
      <article class="money-card money-card--ttp" data-reveal>
        <div class="money-card__visual money-card__visual--text"><p class="mono-label">IN PERSON · USD</p><p class="ttp-title">Tap to Pay on <span class="tm">iPhone</span> and card readers</p></div>
        <div class="money-card__text"><p class="mono-label">PAYMENT</p><h3 class="h3-serif">Take the card at the door</h3><p>Take the payment on the <span class="tm">iPhone</span> already in the technician’s hand — no card reader to buy, carry or charge. Card readers work too. In-person payments are in USD.</p></div>
      </article>
      <article class="money-card money-card--ttp" id="reports" data-reveal>
        <div class="money-card__visual money-card__visual--text">${iconTile('chart-column')}<p class="ttp-title">Analytics and reporting</p></div>
        <div class="money-card__text"><p class="mono-label">REPORTS</p><h3 class="h3-serif">Know what came in</h3><p>Analytics and reporting on jobs, invoices and payments.</p></div>
      </article>
    </div>
    <div class="money-compare">
      <h3 class="mono-label money-compare__title">WHERE EACH PAYMENT FEATURE LIVES</h3>
      ${paymentCompare()}
      <p class="money-compare__link">${textLink({ label: 'Compare everything →', href: '/compare', track: 'section_link_click', props: { section: 'payments', link: 'compare' } })}</p>
    </div>
  </div>
</section>`;
}

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
      <article class="base-card">${iconTile('chart-column')}<h3 class="base-card__title">Analytics</h3><p>Analytics and reporting on jobs, invoices and payments.</p><p>${textLink({ label: 'Know what came in →', href: '#reports', track: 'section_link_click', props: { section: 'price_book', link: 'reports' } })}</p></article>
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
const DESCRIPTION = `A live dispatch board, S Protocol for iPhone, estimates, invoices and card payments in one place. Free to start; Pro is ${SP.pro.monthly.short} for the whole team.`;

export const meta = {
  route: R, page: 's_protocol', title: TITLE, description: DESCRIPTION,
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
