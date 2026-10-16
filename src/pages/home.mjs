// Homepage (`/`) — homepage-spec.md §1–§15, in the definitive section order. Copy is the spec's final copy, corrected to
// what the app really does (D-01, owner-approved in Pass 2: job statuses Scheduled / Pending / Closed / Cancelled /
// Unable to Complete, technicians never change a job's status, jobs are assigned — not dragged — the office does not
// see an arrival status, technicians cannot open client records, and estimates belong to the customer and convert to
// an invoice). S Protocol screens are real captures of the web app with the fictional demo dataset; the estimate and
// the customer-facing invoices stay labeled replicas. Every adaptation is listed in IMPLEMENTATION_STATUS.md §12.
import { html, raw, trackAttrs } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { SP, SI, strings, ctaPattern, site } from '../lib/data.mjs';
import { photo, preloadPhoto } from '../lib/images.mjs';
import { shot, ring, center, region } from '../lib/ui-shots.mjs';
import { graph, organization, website, sProtocolApp, sInvoiceAppHome, webPage } from '../lib/seo.mjs';
import { tm, eyebrow, ctaLink, chip, factChip, sectionHead, check, ledger } from '../components/ui.mjs';
import { docCard, shotFrame } from '../components/media.mjs';
import { invoiceDocReplica, DOC_LABEL } from '../components/replicas.mjs';
import { pricingPair, finePrint, faqList, ctaStage } from '../components/blocks.mjs';
import { boardSection, technicianSection, moneySection, originSection, officeTile } from '../components/sections.mjs';

const R = '/';
const HERO_SIZES = '(min-width: 1280px) 460px, (min-width: 1024px) 360px, (min-width: 768px) 704px, calc(100vw - 40px)';
const appIcon = (product, size) => html`<img class="app-icon" src="/assets/brand/${product === 's_invoice' ? 's-invoice-icon' : 'app-icon'}.webp" width="${size}" height="${size}" alt="" loading="lazy" decoding="async">`;
const mono = (text, cls = '') => html`<p class="mono-caption${cls ? ' ' + cls : ''}">${tm(text)}</p>`;

// ------------------------------------------------------------------ §2 Hero
function hero() {
  return html`<section class="hero hero--home" id="top" aria-labelledby="hero-title">
  <div class="container container--wide-right hero__grid">
    <div class="hero__text">
      ${eyebrow('FIELD SERVICE SOFTWARE · WEB + iPhone')}
      <h1 class="display hero__title" id="hero-title"><span class="hero__line">Book the job.</span> <span class="hero__line">Send the tech.</span> <em class="hero__line">Get paid.</em></h1>
      <p class="lead hero__lead">S Protocol keeps every job on one record — the call or web lead, the schedule, the dispatch board, the technician’s notes, the invoice and the payment — with one price for your whole team.</p>
      <div class="cta-row hero__ctas">${ctaLink(R, 'Start free', { section: '§2 Hero' })}${ctaLink(R, 'See pricing', { section: '§2 Hero' })}</div>
      <p class="microcopy">${strings.s_protocol_microcopy}</p>
      <p class="hero__lane">Billing only for your own work? ${ctaLink(R, 'S Invoice starts free, then $4.99/mo →', { section: '§2 Hero (solo lane)', cls: 'text-link--inline' })}</p>
    </div>
    <div class="hero__stage" data-reveal-group>
      ${photo({ id: 'HERO-01', page: R, section: 'Hero', sizes: HERO_SIZES, cls: 'hero__photo', priority: true })}
      <span class="job-chip hero__chip" aria-hidden="true"><i class="job-chip__dot job-chip__dot--scheduled"></i><span class="job-chip__text">Scheduled · AC not cooling</span></span>
      <div class="hero__board" data-reveal>
        ${shotFrame({ id: 'sp-dispatch-today', sizes: '(min-width: 1280px) 440px, 340px', media: '(min-width: 1024px)', eager: true, cls: 'ui-frame--crop', crop: { h: 0.535 },
          alt: 'Today’s Schedule on the S Protocol Dispatch screen (sample workspace): technician M. Ruiz’s two scheduled jobs, for R. Alvarez and Northside Deli, and D. Kaur’s two jobs, one closed and one scheduled, each with the time, the customer, the phone number and the status' })}
        ${mono('THE OFFICE · TODAY’S SCHEDULE')}
      </div>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ §3 Proof strip
const PROOF = [
  ['PRICING', 'One price for the business', `Pro is ${SP.pro.monthly.short} or ${SP.pro.yearly.short}. Add every dispatcher and technician — no per-seat fees.`, true],
  ['FREE PLAN', 'Start without a card', `Your first ${SP.free.allowance.jobs} jobs, ${SP.free.allowance.invoices} invoices and ${SP.free.allowance.recorded_payments} recorded payments are free, with every feature unlocked.`],
  ['OFFICE + FIELD', 'Web for the office, iPhone for the van', 'The office and every technician work from the same jobs, records and payments.'],
  ['YOUR RECORDS', 'Never held hostage', 'If billing lapses, everything you created stays readable.'],
];
function proof() {
  return html`<section class="band band--white proof" id="why" aria-labelledby="why-title">
  <div class="container">
    <h2 class="sr-only" id="why-title">Why S Protocol</h2>
    <ul class="proof__grid">${PROOF.map(([label, statement, line, link]) => html`<li class="proof__cell">
      <p class="mono-label">${label}</p>
      <h3 class="proof__statement">${tm(statement)}</h3>
      <p class="proof__line">${line}</p>
      ${link ? ctaLink(R, 'See pricing →', { section: '§3 Proof strip' }) : ''}
    </li>`)}</ul>
  </div>
</section>`;
}

// ------------------------------------------------------------------ §4 Product chooser
function chooser() {
  const spBullets = ['Jobs, scheduling and a dispatch board for the whole office', 'Technician app for iPhone — notes, photos, signature, payment at the door', 'Estimates, invoices and online card payments', 'Tap to Pay on iPhone and card readers (USD)', 'Owner, dispatcher and technician roles — no per-seat fees'];
  const siBullets = ['Estimates that convert to invoices in one step', 'A payment link your customer opens on any phone', 'Online card payments through Stripe', 'Partial payments and deposits', 'Reports, plus customer statements on iPhone', 'Documents in USD, CAD, EUR or GBP'];
  return html`<section class="section section--paper" id="choose" aria-labelledby="choose-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'TWO PRODUCTS · ONE WORKSPACE', title: 'Run the operation, or just send the invoice.', id: 'choose-title', lead: 'If you schedule other people’s work, start with S Protocol. If you bill for your own, start with S Invoice — and add the operations side later on the same workspace.', cls: 'section-head--7' })}
    <div class="choose-grid">
      <article class="product-card product-card--night" id="s-protocol" aria-labelledby="pc-sp">
        <div class="product-card__media">${shotFrame({ id: 'sp-schedule-today-night', sizes: '(min-width: 1024px) 508px, (min-width: 768px) 640px, 480px', dark: true, cls: 'ui-frame--card',
          alt: 'Today in the S Protocol Schedule, Night theme (sample workspace): technician M. Ruiz’s two scheduled jobs, for R. Alvarez and Northside Deli, and the start of D. Kaur’s day' })}</div>
        <div class="product-card__body">
          <div class="product-card__id">${appIcon('s_protocol', 36)}<div><h3 class="product-card__name" id="pc-sp">S Protocol</h3><p class="eyebrow eyebrow--accent">RUN THE WHOLE BUSINESS</p></div></div>
          <ul class="checks checks--dark">${spBullets.map((b) => check(b, { dark: true }))}</ul>
          <p class="product-card__price"><span class="product-card__amount">${SP.pro.monthly.display}</span><span class="product-card__unit">/mo for the whole team · Free to start</span></p>
          <div class="cta-row">${ctaLink(R, 'Start S Protocol free', { section: '§4 Chooser — S Protocol card' })}${ctaLink(R, 'Tour S Protocol →', { section: '§4 Chooser — S Protocol card' })}</div>
          <p class="mono-caption mono-caption--night">WEB · <span class="tm">iPhone</span></p>
        </div>
      </article>
      <article class="product-card product-card--light" aria-labelledby="pc-si">
        <div class="product-card__media product-card__media--doc">${docCard({ label: DOC_LABEL, content: invoiceDocReplica({ variant: 'top' }), cls: 'doc-card--crop' })}</div>
        <div class="product-card__body">
          <div class="product-card__id">${appIcon('s_invoice', 36)}<div><h3 class="product-card__name" id="pc-si">S Invoice</h3><p class="eyebrow">CREATE · SEND · GET PAID</p></div></div>
          <ul class="checks checks--more" id="si-more-list" data-more>${siBullets.map((b, i) => (i === 5 ? html`<li class="checks__extra">${icon('check', { size: 16, cls: 'check' })}<span>${b}</span></li>` : check(b)))}</ul>
          <button class="more-btn" type="button" data-more-btn aria-expanded="false" aria-controls="si-more-list" hidden><span data-more-label>+ more</span><span class="sr-only"> S Invoice features</span></button>
          <p class="product-card__price"><span class="product-card__amount">${SI.pro.monthly.display}</span><span class="product-card__unit">/mo · Free to start</span></p>
          <div class="cta-row">${ctaLink(R, 'Start S Invoice free', { section: '§4 Chooser — S Invoice card' })}${ctaLink(R, 'See S Invoice →', { section: '§4 Chooser — S Invoice card' })}</div>
          <p class="mono-caption">WEB · <span class="tm">iPhone</span></p>
        </div>
      </article>
    </div>
    <div class="growth-band">
      <p class="mono-label">GROWTH PATH</p>
      <p class="growth-band__text">Already on S Invoice? S Protocol activates on the same workspace — customers, invoices and numbering stay put. Activation starts on a paid S Protocol plan.</p>
      ${ctaLink(R, 'How it works →', { section: '§4 Growth-path band' })}
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ §5 One record — the five-step explorer
// The panel is the real job record J-4417: the new-lead state for step 1, the booked record for steps 2–5, with a ring
// on the part of the screen each step describes (and, below 1024, a 2× zoom centered on it).
const LEAD = 'sp-job-4417-pending';
const JOB = 'sp-job-4417';
const STEPS = [
  { key: 'lead', idx: '01 · LEAD', chip: ['Pending', 'pending'], title: 'The customer calls — or your website form arrives', body: 'It lands as a lead with the address and the problem already attached.', note: 'Website lead intake is set up with you; calls through Quo are by request.', ring: [LEAD, 'lead'],
    alt: 'S Protocol job record J-4417 for R. Alvarez as a new lead: status Pending, no date and no technician yet, with the service address, 128 Elmwood Ave, and the customer’s problem, “Dryer not heating”, already attached.' },
  { key: 'booked', idx: '02 · BOOKED', chip: ['Scheduled', 'scheduled'], title: 'Job booked', body: 'Pick the slot, pick the technician. The schedule and the dispatch board update together.', ring: [JOB, 'sched'],
    alt: 'The same job record, now Scheduled: August 14, 8:00–10:00 AM, technician M. Ruiz, with buttons to message the staff and the customer and to notify the technician.' },
  { key: 'onsite', idx: '03 · ON THE JOB', chip: ['Scheduled', 'scheduled'], title: 'The technician works', body: 'Notes, photos and the customer’s signature from their iPhone — on the record the office sees.', ring: [JOB, 'notes'],
    alt: 'The Signature and Notes tabs of the job record, where the customer’s signature and the job’s notes are kept.' },
  { key: 'invoice', idx: '04 · INVOICE', chip: ['Sent', 'sent'], title: 'The invoice comes from the job', body: 'Create the invoice from the job record, then send it as a link or a PDF.', ring: [JOB, 'invoice'],
    alt: 'The Create invoice button on the job record, which starts the invoice from this job.' },
  { key: 'paid', idx: '05 · PAID', chip: ['Paid', 'paid'], title: 'Paid and filed', body: 'Card, Tap to Pay on iPhone or cash. It reconciles to the invoice and stays in the customer’s history.', note: 'In-person payments are USD.', ring: [JOB, 'paid'],
    alt: 'The Payments tab of the job record, where the payment is recorded against the invoice.' },
];
const LEDGER = [
  ['OPERATIONS', 'ops', ['Jobs', 'Scheduling', 'Dispatch board', 'Technician mobile workflow', 'Price book'], 'See dispatch →'],
  ['CUSTOMERS', 'customers', ['Client records', 'Full job history', 'Notes and photos', 'Website lead intake', 'Calls and SMS through Quo (by request)'], 'See customers →'],
  ['MONEY', 'money', ['Estimates', 'Invoices', 'Card and online payments', 'Tap to Pay on iPhone', 'Analytics and reporting'], 'See payments →'],
  ['TEAM', 'team', ['Owner, dispatcher and technician roles', 'Team chat on the job', 'Technician earnings', 'No per-seat pricing', 'Web and iPhone'], 'See team & roles →'],
];
const FLOW_SIZES = '(min-width: 1280px) 690px, (min-width: 1024px) 60vw, calc(200vw - 80px)';
function flowShot() {
  // per step: the zoom center and a scale (at most 2×) that keeps the whole ringed region inside the window
  const zoom = STEPS.map((st, i) => {
    const c = center(st.ring[0], st.ring[1]);
    const r = region(st.ring[0], st.ring[1]);
    const s = r ? Math.min(2, 88 / (r.w + 1.6), 88 / (r.h + 1.6)) : 1.6;
    return `--c${i + 1}x:${c.x};--c${i + 1}y:${c.y};--s${i + 1}:${s.toFixed(2)}`;
  }).join(';');
  return html`<figure class="ui-frame ui-frame--shot ui-frame--flow">
  <div class="ui-frame__bar" aria-hidden="true"><span class="ui-frame__dots"><i></i><i></i><i></i></span><span class="ui-frame__host">app.s-protocol.com</span></div>
  <div class="ui-frame__body shot-body flow__shot"><div class="shot-stage flow__zoom" style="${zoom}">
    ${shot(LEAD, { sizes: FLOW_SIZES, cls: 'flow__pic--lead', alt: STEPS[0].alt })}
    ${shot(JOB, { sizes: FLOW_SIZES, cls: 'flow__pic--job', alt: '', imgAttrs: { 'aria-hidden': 'true' } })}
    ${STEPS.map((st, i) => ring(st.ring[0], st.ring[1], { step: i + 1 }))}
  </div></div>
</figure>`;
}
function oneRecord() {
  const tab = (s, i) => html`<button class="flow__tab" type="button" role="tab" id="flow-tab-${s.key}" aria-selected="${i === 0 ? 'true' : 'false'}" aria-controls="flow-panel" tabindex="${i === 0 ? '0' : '-1'}" data-step="${i + 1}" data-key="${s.key}" data-alt="${s.alt}" data-caption="STEP ${i + 1} OF 5 · ${s.idx.split(' · ').slice(1).join(' · ')}">
    <span class="flow__top"><span class="flow__index">${s.idx}</span>${chip(s.chip[0], s.chip[1], { cls: 'flow__chip' })}</span>
    <span class="flow__title">${s.title}</span>
    <span class="flow__body">${tm(s.body)}</span>
    ${s.note ? html`<span class="flow__note">${s.note}</span>` : ''}
  </button>`;
  return html`<section class="section section--white" id="how-it-works" aria-labelledby="hiw-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'HOW THE WORK MOVES', title: 'One record follows the job from the phone call to the payment.', id: 'hiw-title', lead: 'Nothing gets retyped between stages. The customer, the technician, the notes and the invoice stay on the same job — so the history is still there a year later when the customer calls back.', cls: 'section-head--7' })}
    <div class="flow" data-flow data-step="1">
      <div class="flow__tabs" role="tablist" aria-orientation="vertical" aria-label="The five moments of one job">${STEPS.map(tab)}</div>
      <div class="flow__panel" id="flow-panel" role="tabpanel" aria-labelledby="flow-tab-lead" tabindex="0">
        ${flowShot()}
        <p class="mono-caption flow__caption" aria-hidden="true" data-flow-caption>STEP 1 OF 5 · LEAD</p>
        <p class="flow__source">The real job record in the S Protocol web app (sample workspace).</p>
      </div>
    </div>
    <div class="rec-ledger">${LEDGER.map(([label, id, rows, link]) => html`<div class="rec-ledger__col" data-disclosure>
      <h3 class="rec-ledger__label">${label}</h3>
      <button class="rec-ledger__toggle" type="button" aria-expanded="false" aria-controls="ledger-${id}" hidden><span>${label[0] + label.slice(1).toLowerCase()} · ${rows.length}</span>${icon('chevron-down', { size: 18, cls: 'rec-ledger__chev' })}</button>
      <div class="rec-ledger__body" id="ledger-${id}"><ul>${rows.map((r) => html`<li>${tm(r)}</li>`)}</ul>${ctaLink(R, link, { section: '§5 Ledger' })}</div>
    </div>`)}</div>
    <p class="footnote">Website lead intake and Tap to Pay on <span class="tm">iPhone</span> are set up with you. Calls through Quo, Thumbtack leads and API access are by request. ${ctaLink(R, 'See integrations →', { section: '§5 Ledger footnote', cls: 'text-link--inline' })}</p>
  </div>
</section>`;
}

// ------------------------------------------------------------------ §6 Dispatch board (night stage #1)
function dispatch() {
  return boardSection({ route: R, title: 'Every job, every technician, one board.', lead: 'The morning starts here: who’s working, what’s booked, what needs attention and what’s still unassigned — without a group chat and three calendars.', ctaSection: '§6 Dispatch', tile: officeTile() });
}

// ------------------------------------------------------------------ §7 Technician app
const technicianApp = () => technicianSection({ route: R, badgeSection: '§7 Technician app', photoSlot: { id: 'MOBILE-01', page: R, section: 'Technician app (iPhone)' } });

// ------------------------------------------------------------------ §8 Money
const money = () => moneySection({ compare: ctaLink(R, 'Compare everything →', { section: '§8 Money' }) });

// ------------------------------------------------------------------ §9 S Invoice spotlight
function sInvoiceSpotlight() {
  return html`<section class="section section--tint" id="s-invoice" aria-labelledby="si-title">
  <div class="container split split--visual-right split--si">
    <div class="split__text">
      ${sectionHead({ eyebrow: 'S INVOICE · FOR SOLO PROS', tone: 'tint', title: 'Price it, send it, get paid for it.', id: 'si-title', lead: 'For the person who does the work and also does the billing: professional estimates and invoices, a link your customer can pay from, and an honest answer to “What am I still owed?”' })}
      ${ledger([
        ['CREATE', 'Estimates that convert to invoices in one step, with your logo, brand color, photos and an optional plain-language title.'],
        ['SEND', 'A link your customer opens on their phone, or a print-ready PDF. No account, no app — and you can see when it was viewed.'],
        ['GET PAID', 'Card payments through Stripe, partial payments and deposits.'],
        ['KNOW', 'What’s paid, what’s outstanding and what’s overdue — plus customer statements on iPhone.'],
      ], { cls: 'ledger--tint' })}
      <p class="price-line"><span class="price-line__amount">${SI.pro.monthly.display}</span><span class="price-line__unit">/mo after your first ${SI.free.allowance.invoices} free invoices · or ${SI.pro.yearly.short}</span></p>
      <div class="cta-row cta-row--stack">${ctaLink(R, 'Start S Invoice free', { section: '§9 S Invoice spotlight' })}${ctaLink(R, 'See S Invoice', { section: '§9 S Invoice spotlight' })}</div>
      <p class="small-link">${ctaLink(R, 'S Invoice for iPhone — “SInvoice” on the App Store ↗', { section: '§9 S Invoice spotlight' })}</p>
      <p class="growth-note">Need scheduling and dispatch later? S Protocol activates on the same workspace — starting on a paid S Protocol plan. ${ctaLink(R, 'How it works →', { section: '§9 Growth note', cls: 'text-link--inline' })}</p>
    </div>
    <div class="split__visual si-stage" data-reveal>
      ${photo({ id: 'SINV-01', page: R, section: 'S Invoice spotlight', sizes: '(min-width: 1280px) 460px, (min-width: 1024px) 360px, (min-width: 768px) 420px, calc(100vw - 40px)', cls: 'si-stage__photo photo--panel' })}
      <figure class="si-stage__doc">
        ${docCard({ label: DOC_LABEL, content: invoiceDocReplica({ variant: 'top' }), cls: 'doc-card--stage desktop-doc' })}
        ${docCard({ label: DOC_LABEL, content: invoiceDocReplica({ variant: 'mobile' }), cls: 'doc-card--stage mobile-doc' })}
        <figcaption class="mono-caption">WHAT YOUR CUSTOMER RECEIVES</figcaption>
      </figure>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ §10 Industries (bento)
const CARDS = [
  { k: 'a', id: 'IND-APPL-01', label: 'Appliance repair', d: 'Where S Protocol started: same-day calls and the full history of every customer.', link: '§10 Industries — card A', sizes: '(min-width: 1024px) 588px, (min-width: 768px) 704px, calc(100vw - 40px)' },
  { k: 'b', id: 'IND-HVAC-01', label: 'HVAC', d: 'Busy-season boards and one price for every tech.', link: '§10 Industries — card B', sizes: '(min-width: 1024px) 282px, (min-width: 768px) 342px, calc(50vw - 28px)' },
  { k: 'c', id: 'IND-PLMB-01', label: 'Plumbing', d: 'Urgent calls on the board, photos on the job.', sizes: '(min-width: 1024px) 282px, (min-width: 768px) 342px, calc(50vw - 28px)' },
  { k: 'd', id: 'IND-ELEC-01', label: 'Electrical', d: 'Estimates on site, invoices before you leave.', sizes: '(min-width: 1024px) 282px, (min-width: 768px) 342px, calc(50vw - 28px)' },
  { k: 'e', id: 'IND-HNDY-01', label: 'Handyman', d: 'Small jobs and quick invoices — with S Invoice or S Protocol.', sizes: '(min-width: 1024px) 282px, (min-width: 768px) 342px, calc(50vw - 28px)' },
  { k: 'f', id: 'IND-GC-01', label: 'General contractors', d: 'Estimates, invoices and deposits with S Invoice.', sizes: '(min-width: 1024px) 282px, (min-width: 768px) 704px, calc(100vw - 40px)' },
  { k: 'g', id: 'IND-CLEAN-01', label: 'Cleaning', d: 'Crews on the board, payment at the door.', sizes: '(min-width: 1024px) 282px, (min-width: 768px) 342px, calc(50vw - 28px)' },
  { k: 'h', id: 'IND-LAND-01', label: 'Landscaping', d: 'Crews out all day, invoices out the same evening.', sizes: '(min-width: 1024px) 282px, (min-width: 768px) 342px, calc(50vw - 28px)' },
];
function industries() {
  const card = (c) => {
    const inner = html`${photo({ id: c.id, page: R, section: 'Industries (bento)', sizes: c.sizes, cls: 'bento__photo', decorative: true })}
      ${c.k === 'a' ? html`<span class="job-chip bento__chip" aria-hidden="true"><i class="job-chip__dot job-chip__dot--scheduled"></i><span class="job-chip__text">Scheduled · Dryer not heating</span></span>` : ''}
      <span class="bento__text"><span class="bento__label">${c.label}</span><span class="bento__desc">${c.d}</span></span>
      ${c.link ? icon('arrow-right', { size: 20, cls: 'bento__arrow' }) : ''}`;
    if (!c.link) return html`<li class="bento__item bento__item--${c.k}"><div class="bento__card">${inner}</div></li>`;
    const e = ctaPattern(R, c.link);
    return html`<li class="bento__item bento__item--${c.k}"><a class="bento__card bento__card--link" href="${e.href}"${trackAttrs(e.track, e.props)}>${inner}</a></li>`;
  };
  return html`<section class="section section--paper" id="industries" aria-labelledby="ind-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'TRADES', title: 'For trades that send people to the job.', id: 'ind-title', lead: 'Appliance repair is where S Protocol started. The same shape of work — book it, dispatch it, do it on site, get paid — runs through every trade below.', cls: 'section-head--7' })}
    <ul class="bento" data-reveal-group>${CARDS.map(card)}</ul>
    <div class="also-row"><p class="mono-label">ALSO FITS</p><ul class="chips">${['Locksmiths', 'Garage doors', 'Mobile mechanics', 'Junk removal'].map((t) => html`<li>${factChip(t)}</li>`)}</ul></div>
    <p class="closing-line">Don’t see your trade? If you book visits and send people to do the work, S Protocol fits the shape of it. ${ctaLink(R, 'Compare the products →', { section: '§10 Industries', cls: 'text-link--inline' })}</p>
  </div>
</section>`;
}

// ------------------------------------------------------------------ §11 Pricing preview
function pricingPreview() {
  const a = SP.free.allowance;
  const head = sectionHead({ eyebrow: 'PRICING', title: 'One price for the business. No per-seat math.', id: 'pricing-title', lead: 'Add every dispatcher and technician you employ — the price doesn’t move. Free is a real way to set up and try the whole platform.' });
  return html`<section class="section section--white" id="pricing" aria-labelledby="pricing-title">
  <div class="container pricing-wrap">
    ${pricingPair({
      product: 's_protocol', route: R, location: 'home_pricing', toggleId: 'home-billing', head,
      free: { label: 'S PROTOCOL FREE', section: '§11 Pricing — Free card', cta: 'Create a free workspace', items: [`Your first ${a.jobs} jobs, ${a.invoices} invoices and ${a.recorded_payments} recorded payments`, 'A one-time allowance for the business, not a monthly reset', 'Every feature unlocked — nothing held back', 'Whatever you create stays readable, always'] },
      pro: { label: 'S PROTOCOL PRO', section: '§11 Pricing — Pro card', cta: 'Start with S Protocol', note: 'Start on Free, then upgrade when you’re ready.', items: ['Unlimited jobs, invoices and payments', raw('Every role and integration included<sup>1</sup>'), 'No per-seat fees and no team-member limit', 'Cancel anytime — Pro runs to the end of the period you paid for', 'If billing lapses, your records are never hidden'] },
    })}
    <p class="footnote pricing-wrap__foot"><sup>1</sup> Integrations are set up with you or available by request — see <a href="/integrations"${trackAttrs('section_link_click', { section: 'pricing', link: 'integrations' })}>Integrations</a>.</p>
    <div class="si-band"><p class="mono-label mono-label--link">S INVOICE</p><p class="si-band__text">Working on your own? S Invoice is free for your first ${SI.free.allowance.invoices} invoices, then ${SI.pro.monthly.short} or ${SI.pro.yearly.short}.</p>${ctaLink(R, 'S Invoice pricing →', { section: '§11 S Invoice band' })}</div>
    ${finePrint()}
    <p class="links-row">${ctaLink(R, 'See full pricing →', { section: '§11 Links row' })}${ctaLink(R, 'Compare products →', { section: '§11 Links row' })}</p>
  </div>
</section>`;
}

// ------------------------------------------------------------------ §12 Built by a service business (ink)
function about() {
  const facts = html`<dl class="facts">
      <div class="facts__row"><dt>COMPANY</dt><dd>${site.organization.legal_name}</dd></div>
      <div class="facts__row"><dt>PRODUCTS</dt><dd>S Protocol and S Invoice</dd></div>
      <div class="facts__row"><dt>RUNS ON</dt><dd>The web and <span class="tm">iPhone</span></dd></div>
      <div class="facts__row"><dt>SUPPORT</dt><dd>${ctaLink(R, 'support@s-protocol.com', { section: '§12 Facts ledger', cls: 'text-link--plain' })}<span class="facts__note">We typically respond within one business day.</span></dd></div>
    </dl>`;
  return originSection({ route: R, linkSection: '§12 Built by a service business', facts });
}

// ------------------------------------------------------------------ §13 FAQ
function faqSection() {
  return html`<section class="section section--paper" id="faq" aria-labelledby="faq-title">
  <div class="container faq-layout">
    <div class="faq-layout__head">
      ${sectionHead({ eyebrow: 'QUESTIONS WORTH ANSWERING PROPERLY', title: 'The things people ask before signing up.', id: 'faq-title' })}
      <p class="faq-layout__note">Still deciding? Email ${ctaLink(R, 'support@s-protocol.com', { section: '§13 FAQ side note', cls: 'text-link--inline text-link--strong' })} or ${ctaLink(R, 'send us a note →', { section: '§13 FAQ side note', cls: 'text-link--inline' })}</p>
    </div>
    <div class="faq-layout__list">
      ${faqList(R, { idPrefix: 'home-faq', defaultOpen: 'per-technician' })}
      <p class="faq-more">More questions on the <a href="/pricing#faq"${trackAttrs('section_link_click', { section: 'faq', link: 'pricing_faq' })}>Pricing</a> and <a href="/compare#faq"${trackAttrs('section_link_click', { section: 'faq', link: 'compare_faq' })}>Compare</a> pages — or ${ctaLink(R, 'see all questions →', { section: '§13 Under the list', cls: 'text-link--inline' })}</p>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ §14 Final CTA
function finalCta() {
  return ctaStage({
    route: R, id: 'start', headingId: 'start-title', eyebrowText: 'FREE TO START · NO CARD',
    title: html`Start where the business <em>actually is</em>.`,
    lead: 'Both products are free to begin, on the web and on iPhone. Neither asks for a card to find out whether it fits.',
    rows: [
      { product: 's_protocol', name: 'S Protocol', line: `Run the whole business · Pro ${SP.pro.monthly.short} for the whole team`, ctaLabel: 'Start free', section: '§14 Final CTA — S Protocol row' },
      { product: 's_invoice', name: 'S Invoice', line: `Bill for your own work · Pro ${SI.pro.monthly.short}`, ctaLabel: 'Start S Invoice free', section: '§14 Final CTA — S Invoice row' },
    ],
    link: ctaLink(R, 'Not sure? Compare the two →', { section: '§14 Final CTA' }),
  });
}

export const meta = {
  route: R, page: 'home', verification: true,
  title: 'S Protocol — Field Service Software, No Per-Seat Fees',
  description: `Book jobs, dispatch technicians and get paid on one record, on the web and iPhone. Start free; Pro is ${SP.pro.monthly.short} for your whole team — no per-seat fees.`,
  preloads: preloadPhoto({ id: 'HERO-01', page: R, section: 'Hero', sizes: HERO_SIZES }),
  jsonld: graph(organization(), website(), sProtocolApp(), sInvoiceAppHome()),
  legacyAnchors: true,
};

export function render() {
  return html`${hero()}
${proof()}
${chooser()}
${oneRecord()}
${dispatch()}
${technicianApp()}
${money()}
${sInvoiceSpotlight()}
${industries()}
${pricingPreview()}
${about()}
${faqSection()}
${finalCta()}`;
}

export { webPage };
