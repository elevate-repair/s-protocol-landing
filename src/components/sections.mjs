// Page sections shared by the homepage and the industry pages (industry-pages-spec.md "reuse homepage §6/§7/§8/§12"):
// the night dispatch board with its three callouts, the technician app, the money cards and the origin story. Copy is
// the homepage's, corrected to what the app really does (no arrival status, no drag and drop, no customer history on
// the technician's phone, estimates linked to the customer — IMPLEMENTATION_STATUS.md §12); every CTA comes from the
// calling page's own cta-map entries.
import { html } from '../lib/html.mjs';
import { photo } from '../lib/images.mjs';
import { pin } from '../lib/ui-shots.mjs';
import { ctaPattern, SP, SI } from '../lib/data.mjs';
import { tm, eyebrow, ctaLink, sectionHead, featureRow, iconTile } from './ui.mjs';
import { uiCrop, appStoreBadge, artFrame } from './media.mjs';
import { estimateReplica, jobInvoiceReplica, ESTIMATE_LABEL, JOB_INVOICE_LABEL } from './replicas.mjs';
import { paymentCompare, ctaStage } from './blocks.mjs';

// ------------------------------------------------------------------ dispatch board (night) — homepage §6
/** The OFFICE-01 tile: the homepage §6 files, reused as registered in image-manifest.json (industry pages H3, I2). */
export const officeTile = () => html`<figure class="dispatch-head__tile">
        ${photo({ id: 'OFFICE-01', page: '/', section: 'Dispatch board (dark stage)', sizes: '(min-width: 1280px) 384px, (min-width: 1024px) 218px, (min-width: 768px) 704px, 0px', cls: 'photo--tile' })}
        <figcaption class="mono-caption mono-caption--night">THE OFFICE</figcaption>
      </figure>`;
export const BOARD_CALLOUTS = [
  ['A section for every technician', 'Each tech’s jobs for the day in time order, with the customer, the job, the phone number and the status.'],
  ['Nothing sits unassigned', 'New jobs wait under “Unassigned — needs tech assignment” until someone assigns them to a technician.'],
  ['The office sees the day change', 'Pending, scheduled and closed — every job’s status is on the board, next to the follow-ups due and the jobs that need attention, so nobody has to call to ask.'],
];
const BOARD = 'sp-dispatch-night';
const BOARD_NARROW = 'sp-dispatch-today-night';

/** The full Dispatch window with markers ① ② ③ and the callouts (below 768: the Today's Schedule card of the same screen). */
export function boardSection({ route, title, lead, ctaSection, eyebrowText = 'DISPATCH BOARD', tile = null, id = 'dispatch', headingId = 'dispatch-title' }) {
  const pins = html`${pin(BOARD, 'tech', 1)}${pin(BOARD, 'unassigned', 2, { at: 'top-left', dy: 2.4 })}${pin(BOARD, 'chip', 3, { at: 'right' })}`;
  return html`<section class="section section--night" id="${id}" aria-labelledby="${headingId}">
  <div class="container">
    <div class="dispatch-head${tile ? '' : ' dispatch-head--solo'}">
      <div class="dispatch-head__text">
        ${sectionHead({ eyebrow: eyebrowText, tone: 'night', title, id: headingId, lead, leadCls: 'lead--night', cls: 'section-head--night' })}
        <div class="cta-row">${ctaLink(route, 'Start free', { section: ctaSection })}${ctaLink(route, 'Tour the board →', { section: ctaSection })}</div>
      </div>
      ${tile ?? ''}
    </div>
  </div>
  <div class="container container--wide board-stage" data-reveal>
    ${artFrame({ dark: true, cls: 'ui-frame--board',
      wide: { id: BOARD, sizes: '(min-width: 1440px) 1200px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 64px)', overlays: pins },
      narrow: { id: BOARD_NARROW, sizes: 'calc(100vw - 42px)' } })}
  </div>
  <div class="container">
    <ol class="callouts">${BOARD_CALLOUTS.map(([t, b], i) => html`<li class="callout"><span class="marker" aria-hidden="true">${i + 1}</span><h3 class="callout__title">${t}</h3><p class="callout__body">${tm(b)}</p></li>`)}</ol>
    <p class="stage-note">The real Dispatch screen of the S Protocol web app, with a sample workspace. Technicians work the same jobs from S Protocol for <span class="tm">iPhone</span>.</p>
  </div>
</section>`;
}

// ------------------------------------------------------------------ technician app — homepage §7
export const TECH_ROWS = [
  { icon: 'camera', title: 'Notes and photos on the job', body: 'Before-and-after photos and notes go on the job record the office sees.' },
  { icon: 'signature', title: 'The customer’s signature', body: 'The customer signs on the technician’s iPhone, and the signature stays on the job.' },
  { icon: 'credit-card', title: 'Payment at the door', body: 'Take the card with Tap to Pay on iPhone or a card reader (USD), or record a cash payment.' },
];
export const TECH_LEAD = 'S Protocol for iPhone gives each technician their day in order, a place for notes and photos, the customer’s signature and a way to take payment at the door — on the same job record the office sees.';

/** photoSlot: { id, page, section } — the homepage MOBILE-01 slot is reused as-is (same crops and sizes). */
export function technicianSection({ route, badgeSection, photoSlot, tone = 'paper', title = 'The job, in the technician’s pocket.', lead = TECH_LEAD, eyebrowText = 'THE TECHNICIAN APP' }) {
  const badge = ctaPattern(route, badgeSection);
  return html`<section class="section section--${tone}" id="technician-app" aria-labelledby="tech-title">
  <div class="container split split--visual-left">
    <div class="split__visual tech-stage" data-reveal>
      <figure class="tech-stage__photo">
        ${photo({ ...photoSlot, sizes: '(min-width: 1280px) 460px, (min-width: 1024px) 360px, (min-width: 768px) 400px, calc(100vw - 40px)', cls: 'photo--panel' })}
        <figcaption class="mono-caption">ON THE JOB · S Protocol for <span class="tm">iPhone</span></figcaption>
      </figure>
    </div>
    <div class="split__text">
      ${sectionHead({ eyebrow: eyebrowText, title, id: 'tech-title', lead })}
      <div class="feature-rows">${TECH_ROWS.map((r) => featureRow(r))}</div>
      <div class="download-row">${appStoreBadge(badge)}<p>S Protocol runs on <span class="tm">iPhone</span> and on the web. There’s no Android app.</p></div>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ money — homepage §8 / /s-protocol A6
export const MONEY_TITLE = 'Quote it, bill it, collect it — in one place.';
export const MONEY_LEAD = 'Price the work with an estimate. When the customer approves it, it converts to the invoice in one click. They pay online from the invoice link — or your technician takes the card at the door.';

function moneyCards({ reports = false }) {
  return html`<div class="money-cards${reports ? ' money-cards--four' : ''}">
      <article class="money-card" data-reveal>
        <div class="money-card__visual">${uiCrop({ label: ESTIMATE_LABEL, content: estimateReplica(), cls: 'ui-crop--card' })}</div>
        <div class="money-card__text"><p class="mono-label">ESTIMATE</p><h3 class="h3-serif">Priced before the work</h3><p>Itemized estimates with notes. When the customer says yes, convert it to an invoice in one click — nothing retyped.</p></div>
      </article>
      <article class="money-card" data-reveal>
        <div class="money-card__visual">${uiCrop({ label: JOB_INVOICE_LABEL, content: jobInvoiceReplica(), cls: 'ui-crop--card' })}</div>
        <div class="money-card__text"><p class="mono-label">INVOICE</p><h3 class="h3-serif">An invoice they can pay from their phone</h3><p>Send a link or a PDF. Your customer opens it, sees the work and pays by card.</p><p class="footnote">Online card payments run on Stripe, connected with you during setup.</p></div>
      </article>
      <article class="money-card money-card--ttp" data-reveal>
        <div class="money-card__visual money-card__visual--text"><p class="mono-label">IN PERSON · USD</p><p class="ttp-title">Tap to Pay on <span class="tm">iPhone</span> and card readers</p></div>
        <div class="money-card__text"><p class="mono-label">PAYMENT</p><h3 class="h3-serif">Take the card at the door</h3><p>Take the payment on the <span class="tm">iPhone</span> already in the technician’s hand — no card reader to buy, carry or charge. Card readers work too. In-person payments are in USD.</p></div>
      </article>
      ${reports ? html`<article class="money-card money-card--ttp" id="reports" data-reveal>
        <div class="money-card__visual money-card__visual--text">${iconTile('chart-column')}<p class="ttp-title">Analytics and reporting</p></div>
        <div class="money-card__text"><p class="mono-label">REPORTS</p><h3 class="h3-serif">Know what came in</h3><p>Analytics and reporting on jobs, invoices and payments.</p></div>
      </article>` : ''}
    </div>`;
}

/** compare: the "WHERE EACH PAYMENT FEATURE LIVES" table and its link (html) — omitted when null. */
export function moneySection({ reports = false, compare = null, tone = 'white' }) {
  return html`<section class="section section--${tone}" id="payments" aria-labelledby="money-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'ESTIMATES · INVOICES · PAYMENTS', title: MONEY_TITLE, id: 'money-title', lead: MONEY_LEAD, cls: 'section-head--7' })}
    ${moneyCards({ reports })}
    ${compare ? html`<div class="money-compare">
      <h3 class="mono-label money-compare__title">WHERE EACH PAYMENT FEATURE LIVES</h3>
      ${paymentCompare()}
      <p class="money-compare__link">${compare}</p>
    </div>` : ''}
  </div>
</section>`;
}

// ------------------------------------------------------------------ origin (ink) — homepage §12
export const ORIGIN_BODY = 'Every workflow here started as a problem somebody had on a Tuesday morning: a technician stuck without the history, an invoice nobody chased, a job assigned twice. That’s why the dispatch board looks the way it does — and why S Invoice exists separately for people who only need the paperwork.';

/** facts: the company ledger (homepage only — its support link is a homepage CTA-map entry). */
export function originSection({ route, linkSection, facts = null, id = 'about' }) {
  return html`<section class="section section--ink" id="${id}" aria-labelledby="${id}-title">
  <div class="container about${facts ? '' : ' about--solo'}">
    <div class="about__text">
      ${eyebrow('WHERE THIS CAME FROM', { tone: 'ink' })}
      <h2 class="h2 h2--ink about__title" id="${id}-title">Built by people running the jobs. The first workspace was <em>an appliance repair business</em> — and it still runs on this.</h2>
      <p class="about__body">${ORIGIN_BODY}</p>
      <p>${ctaLink(route, 'Read the story →', { section: linkSection })}</p>
    </div>
    ${facts ?? ''}
  </div>
</section>`;
}

// ------------------------------------------------------------------ inner-page building blocks

/** Inner-page hero (paper): eyebrow → H1 → lead (+ anything after). aside: a right-hand column (visual or form). */
export function pageHero({ eyebrowText, title, lead, after = null, aside = null, cls = '', id = 'top', tone = 'paper', breadcrumbs = null }) {
  return html`<section class="page-hero page-hero--${tone}${aside ? ' page-hero--split' : ''}${cls ? ' ' + cls : ''}" id="${id}" aria-labelledby="page-title">
  <div class="container${aside ? ' page-hero__grid' : ''}">
    <div class="page-hero__text">
      ${breadcrumbs ?? ''}
      ${eyebrow(eyebrowText)}
      <h1 class="display page-hero__title" id="page-title">${title}</h1>
      ${lead ? html`<p class="lead page-hero__lead">${lead}</p>` : ''}
      ${after ?? ''}
    </div>
    ${aside ? html`<div class="page-hero__aside">${aside}</div>` : ''}
  </div>
</section>`;
}

/** Breadcrumb for /industries/* (Home › Industries › <trade>; "Industries" points at the homepage section until a hub exists). */
export const breadcrumb = (current) => html`<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/#industries">Industries</a></li><li><span aria-current="page">${current}</span></li></ol></nav>`;

/** The two-product final CTA band (homepage §14 copy, CTA-01 rule). */
export function twoProductCta({ route, section, link = true }) {
  return ctaStage({
    route, id: 'start', headingId: 'start-title', eyebrowText: 'FREE TO START · NO CARD',
    title: html`Start where the business <em>actually is</em>.`,
    lead: 'Both products are free to begin, on the web and on iPhone. Neither asks for a card to find out whether it fits.',
    rows: [
      { product: 's_protocol', name: 'S Protocol', line: `Run the whole business · Pro ${SP.pro.monthly.short} for the whole team`, ctaLabel: 'Start free', section },
      { product: 's_invoice', name: 'S Invoice', line: `Bill for your own work · Pro ${SI.pro.monthly.short}`, ctaLabel: 'Start S Invoice free', section },
    ],
    link: link ? ctaLink(route, 'Not sure? Compare the two →', { section }) : null,
  });
}

/** The S Protocol final CTA band (/s-protocol A12 copy) for the industry pages. */
export function sProtocolCta({ route, section }) {
  const a = SP.free.allowance;
  return ctaStage({
    route, id: 'start', headingId: 'start-title', eyebrowText: 'FREE TO START · NO CARD',
    title: html`Put tomorrow’s jobs on the board <em>today</em>.`,
    lead: `Free for your first ${a.jobs} jobs, ${a.invoices} invoices and ${a.recorded_payments} payments. No card.`,
    single: ctaLink(route, 'Start free', { section }),
  });
}

/** App icon (decorative) used in product heading rows and path cards. */
export const productIcon = (product, size = 40) => html`<img class="app-icon" src="/assets/brand/${product === 's_invoice' ? 's-invoice-icon' : 'app-icon'}.webp" width="${size}" height="${size}" alt="" loading="lazy" decoding="async">`;
