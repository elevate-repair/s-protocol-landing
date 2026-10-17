// `/s-invoice` — product-pages-spec.md B1–B10 (tinted, lighter tool for the person who does the work and the billing).
// Keeps the legacy section ids hero, for, features, flow, mobile, family, cta. Until the S Invoice captures exist
// (D-30): the customer-facing invoice and the S Invoice web home are HTML replicas of screens that exist, there is no
// device image (no bezel, no ScreenCard of an iPhone screen), and B3's steps are text cards beside the web home.
import { html } from '../lib/html.mjs';
import { SI, strings, ctaPattern } from '../lib/data.mjs';
import { photo, preloadPhoto } from '../lib/images.mjs';
import { graph, sInvoiceAppPage, webPage } from '../lib/seo.mjs';
import { eyebrow, ctaLink, sectionHead, factChip, iconTile, ledger } from '../components/ui.mjs';
import { uiFrame, docCard, appStoreBadge, marker } from '../components/media.mjs';
import { invoiceDocReplica, DOC_LABEL, sInvoiceHomeReplica, SI_HOME_LABEL } from '../components/replicas.mjs';
import { pricingPair, finePrint, faqList, ctaStage } from '../components/blocks.mjs';

const R = '/s-invoice';
const HERO_SIZES = '(min-width: 1280px) 460px, (min-width: 1024px) 360px, (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)';

// ------------------------------------------------------------------ B1 Hero (tint)
function hero() {
  return html`<section class="hero hero--tint hero--si" id="hero" aria-labelledby="hero-title">
  <div class="container container--wide-right hero__grid">
    <div class="hero__text">
      ${eyebrow('S INVOICE · AN S PROTOCOL PRODUCT', { tone: 'tint' })}
      <h1 class="display hero__title" id="hero-title">Simpler <em>invoicing</em> for service businesses.</h1>
      <p class="lead hero__lead">Create professional estimates and invoices, send them to customers, get paid by card and keep your records organized — on the web and on <span class="tm">iPhone</span>, without adopting a full operations platform on day one.</p>
      <div class="cta-row hero__ctas">${ctaLink(R, 'Start S Invoice free', { section: 'B1 Hero' })}${ctaLink(R, 'See pricing', { section: 'B1 Hero' })}</div>
      <p class="microcopy">${strings.s_invoice_microcopy}</p>
      <ul class="chips hero__chips" aria-label="What S Invoice covers">${['Estimates', 'Invoices', 'Customers', 'Payment tracking', 'Online payments', 'Attachments'].map((t) => html`<li>${factChip(t)}</li>`)}</ul>
    </div>
    <div class="hero__stage si-hero-stage" data-reveal-group>
      ${photo({ id: 'SOLO-02', page: R, section: 'Hero', sizes: HERO_SIZES, cls: 'si-hero-stage__photo', priority: true })}
      <figure class="si-hero-stage__doc" data-reveal>
        ${docCard({ label: DOC_LABEL, content: invoiceDocReplica({ variant: 'top' }), cls: 'doc-card--stage desktop-doc' })}
        ${docCard({ label: DOC_LABEL, content: invoiceDocReplica({ variant: 'mobile' }), cls: 'doc-card--stage mobile-doc' })}
        <figcaption class="mono-caption">WHAT YOUR CUSTOMER RECEIVES</figcaption>
      </figure>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ B2 Who it's for
const TRADES = ['Handyman', 'Appliance repair', 'Cleaning services', 'Locksmiths', 'HVAC', 'Plumbing', 'Electrical', 'Mobile mechanics', 'Landscaping', 'Junk removal', 'General contractors', 'Other service businesses'];
function whoFor() {
  const strip = [
    ['SINV-01', 'Who it\'s for', 'HANDYMAN & REPAIR'],
    ['IND-LAND-01', 'Who it\'s for', 'LAWN & LANDSCAPE'],
    ['MOBILE-01', 'Who it\'s for', 'FROM THE DRIVEWAY'],
  ];
  return html`<section class="section section--paper" id="for" aria-labelledby="for-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'WHO IT’S FOR', title: 'Built for independent service pros and small crews.', id: 'for-title', lead: 'If your work happens at the customer’s door — quotes, jobs and getting paid — S Invoice keeps the paperwork simple.', cls: 'section-head--7' })}
    <div class="photo-strip-wrap" tabindex="0" role="region" aria-label="Photos of the trades S Invoice is made for — scroll sideways on small screens"><ul class="photo-strip">${strip.map(([id, section, caption]) => html`<li class="photo-strip__item" data-reveal><figure>${photo({ id, page: R, section, sizes: '(min-width: 1280px) 384px, (min-width: 1024px) calc(33.33vw - 43px), (min-width: 768px) calc(33.33vw - 35px), 260px', cls: 'photo--panel photo--3x4' })}<figcaption class="mono-caption">${caption}</figcaption></figure></li>`)}</ul></div>
    <div class="also-row"><p class="mono-label">MADE FOR BUSINESSES LIKE</p><ul class="chips">${TRADES.map((t) => html`<li>${factChip(t)}</li>`)}</ul></div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ B3 How it works
const STEPS = [
  ['Send the estimate', 'Price the job with itemized line items and share it with your customer before the work starts.'],
  ['Turn it into an invoice', 'When the work is approved or done, convert the estimate straight into an invoice — no retyping.'],
  ['Track the payment', 'Collect online through Stripe or record cash and checks. Partial payments are handled too.'],
];
function howItWorks() {
  return html`<section class="section section--white" id="how-it-works" aria-labelledby="how-title">
  <div class="container">
    <span class="anchor" id="flow" aria-hidden="true"></span>
    ${sectionHead({ eyebrow: 'HOW IT WORKS', title: 'Estimate. Invoice. Get paid.', id: 'how-title', lead: 'A workflow that matches how service work actually happens — at the job site on your phone, or at home on a laptop.', cls: 'section-head--7' })}
    <div class="steps-split">
      <ol class="steps">${STEPS.map(([t, b], i) => html`<li class="step-card"><span class="step-card__num" aria-hidden="true">0${i + 1}</span><div><h3 class="step-card__title">${t}</h3><p>${b}</p></div></li>`)}</ol>
      <div class="steps-split__visual" data-reveal>${uiFrame({ host: 'invoice.s-protocol.com', label: SI_HOME_LABEL, content: sInvoiceHomeReplica({ withSide: true }), cls: 'ui-frame--si-home' })}</div>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ B4 What you get
const FEATURES = [
  ['receipt-text', 'Professional invoices', 'Clean, itemized invoices with your logo, brand color, notes and tax settings — shared with customers as polished invoice links.'],
  ['file-pen-line', 'Estimates', 'Quote the work first. Build itemized estimates, send them to the customer and convert an approved estimate into an invoice in one step.'],
  ['contact', 'Customer records', 'Keep every customer’s contact details, documents and billing history in one place — so repeat work starts from what you already know.'],
  ['split', 'Payment tracking', 'Record payments against every invoice — including partial payments — and always know what’s outstanding.'],
  ['credit-card', 'Online payments with Stripe', 'Connect Stripe to let customers pay invoices online by card. Payments reconcile automatically against the invoice.'],
  ['camera', 'Photos & attachments', 'Attach photos and documents to invoices — before-and-after shots, receipts and paperwork stay with the record they belong to.'],
];
function features() {
  return html`<section class="section section--paper" id="features" aria-labelledby="feat-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'WHAT YOU GET', title: 'The paperwork side of the job, handled.', id: 'feat-title', lead: 'Everything you need to quote work, bill for it and keep clean records — nothing you don’t.', cls: 'section-head--7' })}
    <ul class="feature-grid" data-reveal-group>${FEATURES.map(([ic, t, b]) => html`<li class="base-card" data-reveal>${iconTile(ic)}<h3 class="base-card__title">${t}</h3><p>${b}</p></li>`)}</ul>
  </div>
</section>`;
}

// ------------------------------------------------------------------ B5 What your customer receives
const CALLOUTS = ['Your logo and brand color', 'A plain-language title', 'Line items and tax, totals that add up', '“Paid” — and you can see when it was viewed'];
function customerView() {
  return html`<section class="section section--tint" id="customer-view" aria-labelledby="cv-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'WHAT THE CUSTOMER RECEIVES · A SAMPLE DOCUMENT', tone: 'tint', title: 'A document that looks like your business, not like a spreadsheet.', id: 'cv-title', lead: 'Send a link or a PDF. Your customer opens it on their phone, sees exactly what the work was, and pays by card without creating an account. You can give the invoice a plain-language title — “Hanging” — while the number stays the number.', cls: 'section-head--7' })}
    <div class="cv-grid">
      <div class="cv-grid__doc" data-reveal>
        ${docCard({ label: DOC_LABEL, content: invoiceDocReplica({ variant: 'full' }), cls: 'doc-card--full' })}
        ${marker(1, { cls: 'cv-marker cv-marker--1' })}${marker(2, { cls: 'cv-marker cv-marker--2' })}${marker(3, { cls: 'cv-marker cv-marker--3' })}${marker(4, { cls: 'cv-marker cv-marker--4' })}
      </div>
      <ol class="cv-callouts">${CALLOUTS.map((c, i) => html`<li><span class="marker" aria-hidden="true">${i + 1}</span><span>${c}</span></li>`)}</ol>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ B6 Web and iPhone
function webAndIphone() {
  const badge = ctaPattern(R, 'B6 Web and iPhone');
  return html`<section class="section section--white" id="mobile" aria-labelledby="mobile-title">
  <div class="container split split--visual-right">
    <div class="split__text">
      ${sectionHead({ eyebrow: 'WEB + iPhone', title: html`On the web and on <span class="tm">iPhone</span>.`, id: 'mobile-title', lead: 'S Invoice is designed for small screens first — create an estimate in the driveway, convert it in the kitchen and send the invoice before you leave. Use it in any browser, or with S Invoice for iPhone. Customer statements are on iPhone.' })}
      <div class="download-row">${appStoreBadge(badge)}<p>Listed on the App Store as “SInvoice: Fast Invoice Maker”.</p></div>
    </div>
    <div class="split__visual">
      ${ledger([
        ['WEB', html`Any browser at <span class="mono-inline">invoice.s-protocol.com</span> — estimates, invoices, customers, payments and reports.`],
        ['iPhone', 'S Invoice for iPhone — the same workspace, plus customer statements.'],
        ['YOUR CUSTOMER', 'Opens the invoice link on any phone and pays by card — no account, no app.'],
      ], { cls: 'ledger--platforms' })}
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ B7 Pricing
function pricing() {
  const a = SI.free.allowance;
  const head = sectionHead({ eyebrow: 'S INVOICE PRICING', title: 'Under five dollars a month.', id: 'pricing-title', lead: `Free is a genuine trial of the real thing — three invoices and three recorded payments, then it’s ${SI.pro.monthly.short} to keep going.` });
  return html`<section class="section section--paper" id="pricing" aria-labelledby="pricing-title">
  <div class="container pricing-wrap">
    ${pricingPair({
      product: 's_invoice', route: R, location: 's_invoice_page', toggleId: 'si-billing', head,
      free: { label: 'S INVOICE FREE', section: 'B7 Pricing — Free', cta: 'Send your first invoice', items: [`Your first ${a.invoices} invoices and ${a.recorded_payments} recorded payments`, 'A one-time allowance, not a monthly reset', 'Estimates, customers, PDFs and public links included', 'Estimates stay free until converted', 'Whatever you create stays readable, always'] },
      pro: { label: 'S INVOICE PRO', section: 'B7 Pricing — Pro', cta: 'Start S Invoice free', items: ['Unlimited invoices and recorded payments', 'Online card payments once Stripe is connected', 'Partial payments and balance tracking', 'Reports, statements and multi-currency documents'] },
    })}
    ${finePrint()}
  </div>
</section>`;
}

// ------------------------------------------------------------------ B8 Grow into S Protocol (night)
function family() {
  return html`<section class="section section--night" id="family" aria-labelledby="family-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'PART OF THE S PROTOCOL FAMILY', tone: 'night', title: 'Start simple. Grow into the full platform.', id: 'family-title', cls: 'section-head--night section-head--7' })}
    <div class="family-grid">
      <article class="dark-card"><p class="mono-label mono-label--night">TODAY</p><h3 class="dark-card__title">S Invoice</h3><p>Estimates, invoices, customers and payments.</p></article>
      <article class="dark-card"><p class="mono-label mono-label--night">WHEN YOU’RE READY</p><h3 class="dark-card__title">S Protocol</h3><p>The full operating platform — jobs, dispatch, scheduling, technicians, team communication and reporting on top of everything S Invoice does.</p></article>
    </div>
    <div class="family-callout"><p>Activating S Protocol on an existing S Invoice workspace starts on a paid S Protocol plan, and the workspace owner is the one who does it. Your customers, invoices, estimates, company details and numbering stay put.</p>${ctaLink(R, 'How it works →', { section: 'B8 Grow into S Protocol' })}</div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ B9 FAQ
function faq() {
  return html`<section class="section section--paper" id="faq" aria-labelledby="faq-title">
  <div class="container faq-layout">
    <div class="faq-layout__head">${sectionHead({ eyebrow: 'FAQ', title: 'Questions about S Invoice.', id: 'faq-title' })}</div>
    <div class="faq-layout__list">
      ${faqList(R, { idPrefix: 'si-faq', defaultOpen: 'free-limit' })}
      <p class="faq-more">${ctaLink(R, 'See all questions →', { section: 'B9 FAQ' })}</p>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ B10 Final CTA
function finalCta() {
  return ctaStage({
    route: R, id: 'cta', headingId: 'cta-title', eyebrowText: 'FREE TO START · NO CARD',
    title: html`Make the next invoice the easiest one you’ve <em>sent</em>.`,
    lead: 'Professional estimates and invoices for independent service businesses — free to get started.',
    single: ctaLink(R, 'Start S Invoice free', { section: 'B10 Final CTA' }),
    link: ctaLink(R, 'Need dispatch too? See S Protocol →', { section: 'B10 Final CTA' }),
  });
}

const TITLE = 'S Invoice — Estimates & Invoices for Service Pros';
const DESCRIPTION = `Create estimates and invoices, send a link your customer can pay by card, and see what’s still owed. Web and iPhone. Free for ${SI.free.allowance.invoices} invoices, then ${SI.pro.monthly.short}.`;

export const meta = {
  route: R, page: 's_invoice', title: TITLE, description: DESCRIPTION,
  // The H1's italic word can rewrap the hero when Newsreader italic swaps in late (Lighthouse CLS 0.14): preload it here.
  preloads: html`<link rel="preload" href="/assets/fonts/newsreader-500-italic.woff2" as="font" type="font/woff2" crossorigin>${preloadPhoto({ id: 'SOLO-02', page: R, section: 'Hero', sizes: HERO_SIZES })}`,
  jsonld: graph(webPage(R, TITLE, DESCRIPTION, { about: { '@id': 'https://s-protocol.com/s-invoice#app' } }), sInvoiceAppPage()),
};

export function render() {
  return html`${hero()}
${whoFor()}
${howItWorks()}
${features()}
${customerView()}
${webAndIphone()}
${pricing()}
${family()}
${faq()}
${finalCta()}`;
}
