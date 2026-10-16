// Section-level building blocks shared by several pages: PricingPair + BillingToggle, FAQ accordion, the compact
// "where each payment feature lives" CompareTable, the final-CTA stage (CTABand), IntegrationCard grid, StickySubnav.
import { html, raw, trackAttrs, attrs } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { SP, SI, strings, faqItems, ctaPattern, cta } from '../lib/data.mjs';
import { photo } from '../lib/images.mjs';
import { ctaLink, tm, check, eyebrow } from './ui.mjs';

// ------------------------------------------------------------------ pricing
/** The Monthly / Yearly radiogroup (BillingToggle). Hidden without JS, where the monthly state shows both prices. */
export const billingToggle = (id, yearlyLabel) => html`<div class="billing-toggle" role="radiogroup" aria-label="Billing period" id="${id}">
    <button type="button" role="radio" aria-checked="true" data-period="monthly">Monthly</button>
    <button type="button" role="radio" aria-checked="false" tabindex="-1" data-period="yearly">${yearlyLabel}</button>
  </div>`;

/**
 * Free + Pro cards with a Monthly/Yearly radiogroup. product: 's_protocol' | 's_invoice'. Prices come only from
 * pricing.json. Without JS the monthly state shows both prices in text and the toggle stays hidden.
 * standalone: false — the cards answer a page-level toggle (an ancestor [data-pricing], /pricing C1) and get none of
 * their own.
 */
export function pricingPair({ product, route, location, free, pro, toggleId, head = null, standalone = true }) {
  const P = product === 's_protocol' ? SP : SI;
  const yearlyLabel = product === 's_protocol' ? strings.home_toggle_yearly_label : strings.s_invoice_toggle_yearly_label;
  const monthlyLine = product === 's_protocol' ? strings.s_protocol_pro_monthly_line : `or ${P.pro.yearly.display}/year — ${P.pro.yearly.per_month_display}, save ${P.pro.yearly.savings_display}`;
  // S Invoice's yearly state mirrors the S Protocol yearly line, built from the same pricing.json values.
  const yearlyLine = product === 's_protocol' ? strings.s_protocol_pro_yearly_line : `${P.pro.yearly.per_month_display} billed yearly — ${P.pro.yearly.savings_display} less than monthly`;
  const toggle = standalone ? billingToggle(toggleId, yearlyLabel) : '';
  return html`<div class="pricing"${standalone ? attrs({ 'data-pricing': true, 'data-location': location }) : ''}>
  ${head ? html`<div class="pricing__head">${head}${toggle}</div>` : toggle}
  <div class="pricing__cards">
    <article class="price-card">
      <p class="eyebrow eyebrow--muted">${free.label}</p>
      <p class="price"><span class="price__amount">${P.free.display_price}</span><span class="price__unit">No card required</span></p>
      <ul class="checks">${free.items.map((t) => check(t))}</ul>
      <div class="price-card__cta">${ctaLink(route, free.cta, { section: free.section, full: true })}</div>
    </article>
    <article class="price-card price-card--pro">
      <p class="eyebrow">${pro.label}</p>
      <div class="price-card__price" aria-live="polite">
        <div data-period-show="monthly"><p class="price"><span class="price__amount">${P.pro.monthly.display}</span><span class="price__unit">/month</span></p><p class="price__line">${monthlyLine}</p></div>
        <div data-period-show="yearly" hidden><p class="price"><span class="price__amount">${P.pro.yearly.display}</span><span class="price__unit">/year</span></p><p class="price__line">${yearlyLine}</p></div>
      </div>
      <ul class="checks">${pro.items.map((t) => check(t))}</ul>
      <div class="price-card__cta">${ctaLink(route, pro.cta, { section: pro.section, full: true, props: { period: 'monthly' } })}${pro.note ? html`<p class="price-card__note">${pro.note}</p>` : ''}</div>
    </article>
  </div>
</div>`;
}

export const finePrint = () => {
  const [before, after] = strings.fine_print_short.split('the Terms of Service and Privacy Policy');
  return html`<p class="fine-print">${before}the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>${after}</p>`;
};

// ------------------------------------------------------------------ FAQ
const PRODUCT_TAG = { s_protocol: 'S Protocol', s_invoice: 'S Invoice' };
/**
 * FAQ accordion. The collapsed state is in the HTML (hidden="until-found", so find-in-page still reaches every answer,
 * and nothing shifts when the script runs); without JS a <noscript> style in the head shows every answer.
 *   itemIds — each item's DOM id is its faq.json id (the /faq hub's deep links); tags — a product tag after the question
 *   of an item that applies to one product only (part of the button's accessible name); level — heading level.
 * Panels carry no region role: with up to 17 answers open, 17 landmarks would crowd the landmark list (WAI-ARIA APG).
 */
export function faqAccordion(items, { defaultOpen = null, idPrefix = 'faq', itemIds = false, tags = false, level = 3 } = {}) {
  const h = raw(`h${level}`);
  return html`<div class="faq" data-faq${attrs({ 'data-default-open': defaultOpen })}>${items.map((it) => html`<div class="faq__item"${attrs({ id: itemIds ? it.id : null })}>
    <${h} class="faq__q"><button type="button" id="${idPrefix}-q-${it.id}" aria-expanded="${it.id === defaultOpen ? 'true' : 'false'}" aria-controls="${idPrefix}-a-${it.id}" data-faq-id="${it.id}"><span class="faq__text">${tm(it.question)}${tags && it.applies_to?.length === 1 ? html`<span class="faq__tag"><span class="sr-only">, </span>${PRODUCT_TAG[it.applies_to[0]]}</span>` : ''}</span>${icon('plus', { size: 20, cls: 'faq__icon' })}</button></${h}>
    <div class="faq__a" id="${idPrefix}-a-${it.id}"${attrs({ hidden: it.id === defaultOpen ? null : 'until-found' })}><p>${tm(it.answer)}</p>${(it.links ?? []).map((l) => html`<p><a class="text-link" href="${l.href}"${trackAttrs('section_link_click', { section: 'faq', link: l.href.replace(/[^a-z]+/gi, '_').replace(/^_|_$/g, '') })}><span>${l.label.replace(/\s*→$/, '')}</span>${icon('arrow-right', { size: 16, cls: 'text-link__arrow' })}</a></p>`)}</div>
  </div>`)}</div>`;
}

/** FAQ accordion from faq.json → pages[route] ("confirm" items omitted). */
export const faqList = (route, opts = {}) => faqAccordion(faqItems(route), opts);

// ------------------------------------------------------------------ compact compare table (homepage §8 / s-protocol A6)
const PAY_ROWS = [
  ['Estimates and invoices', true, true],
  ['Payment links and PDFs', true, true],
  ['Online card payments (Stripe, set up with you)', true, true],
  ['Tap to Pay on iPhone and card readers', false, 'check-usd'],
  ['Document currencies', 'USD, CAD, EUR, GBP', 'USD'],
  ['Customer statements', 'On iPhone', false],
];
const cell = (v) => (v === true ? html`${icon('check', { size: 18, cls: 'cmp__yes' })}<span class="sr-only">Included</span>`
  : v === false ? html`${icon('minus', { size: 18, cls: 'cmp__no' })}<span class="sr-only">Not included</span>`
    : v === 'check-usd' ? html`${icon('check', { size: 18, cls: 'cmp__yes' })}<span class="sr-only">Included, </span><span class="cmp__note">USD</span>` : html`<span>${tm(v)}</span>`);
export function paymentCompare() {
  return html`<div class="cmp">
  <table class="cmp__table"><caption class="sr-only">Payment features by product</caption>
    <thead><tr><th scope="col">Feature</th><th scope="col">S Invoice</th><th scope="col">S Protocol</th></tr></thead>
    <tbody>${PAY_ROWS.map(([f, a, b]) => html`<tr><th scope="row">${tm(f)}</th><td>${cell(a)}</td><td>${cell(b)}</td></tr>`)}</tbody>
  </table>
  <dl class="cmp__list">${PAY_ROWS.map(([f, a, b]) => html`<div class="cmp__item"><dt>${tm(f)}</dt><dd><span class="cmp__product">S Invoice</span>${cell(a)}</dd><dd><span class="cmp__product">S Protocol</span>${cell(b)}</dd></div>`)}</dl>
</div>`;
}

// ------------------------------------------------------------------ final CTA stage (homepage §14 / CTABand)
/**
 * The night stage with CTA-01 (the homepage final-CTA crops — the only photo approved for CTA bands).
 * rows: [{ product, name, line, ctaLabel, section }] for the two-product variant, or a single `single` CTA.
 */
export function ctaStage({ route, id, eyebrowText, title, lead, rows = null, single = null, link = null, headingId }) {
  const sizes = '(min-width: 1440px) 1320px, (min-width: 1024px) calc(100vw - 80px), (min-width: 768px) 704px, calc(100vw - 40px)';
  return html`<section class="section section--night cta-stage-section" id="${id}" aria-labelledby="${headingId}">
  <div class="container container--wide">
    <div class="cta-stage">
      ${photo({ id: 'CTA-01', page: '/', section: 'Final CTA', sizes, cls: 'cta-stage__photo' })}
      <div class="cta-stage__content">
        ${eyebrow(eyebrowText, { tone: 'night' })}
        <h2 class="h2 h2--night" id="${headingId}">${title}</h2>
        <p class="lead lead--night">${lead}</p>
        ${rows ? html`<div class="cta-rows">${rows.map((r) => html`<div class="cta-row"><img class="app-icon" src="/assets/brand/${r.product === 's_invoice' ? 's-invoice-icon' : 'app-icon'}.webp" width="40" height="40" alt="" loading="lazy" decoding="async"><div class="cta-row__text"><p class="cta-row__name">${r.name}</p><p class="cta-row__line">${r.line}</p></div>${ctaLink(route, r.ctaLabel, { section: r.section })}</div>`)}</div>` : ''}
        ${single ? html`<div class="cta-single">${single}</div>` : ''}
        ${link ? html`<p class="cta-stage__link">${link}</p>` : ''}
      </div>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ integrations (s-protocol A9 summary)
// Names, product tags, statuses and lines from remaining-pages-spec.md E2 (first sentence of each description); Quo uses
// the D-06 safe default wording until the owner confirms the Quo behavior.
export const INTEGRATIONS = [
  { id: 'stripe', key: 'stripe', name: 'Stripe', product: 'Both products', status: 'Available with setup', line: 'Card payments from the invoice your customer opens, plus wallets, deposits and part payments.' },
  { id: 'tap-to-pay-on-iphone', key: 'tap_to_pay_on_iphone', name: 'Tap to Pay on iPhone & card readers', product: 'S Protocol', status: 'Available with setup', line: 'Take the payment in person on the iPhone already in the technician’s hand — no card reader to buy, carry or charge.' },
  { id: 'website-leads', key: 'website_leads', name: 'Website lead intake', product: 'S Protocol', status: 'Available with setup', line: 'An inquiry from your own site arrives as a lead with the address and the problem, ready to become a booked job.' },
  { id: 'quo', key: 'quo', name: 'Quo — calls & SMS', product: 'S Protocol', status: 'By request', line: 'Calls and SMS on your business line — by request.' },
  { id: 'thumbtack', key: 'thumbtack', name: 'Thumbtack', product: 'S Protocol', status: 'By request', line: 'Inbound leads routed into your workspace.' },
  { id: 'api', key: 'api', name: 'Your own systems — API access & webhooks', product: 'S Protocol', status: 'By request', line: 'API access and webhooks for businesses running something specific.' },
];
export function integrationCards(route) {
  const e = ctaPattern(route, 'A9');
  return html`<ul class="integ-grid">${INTEGRATIONS.map((it) => html`<li><a class="integ-card" href="/integrations#${it.id}"${trackAttrs(e.track, { integration: it.key })}>
    <span class="integ-card__top"><span class="integ-card__name">${tm(it.name)}</span><span class="status-chip status-chip--${it.status === 'By request' ? 'request' : 'setup'}">${it.status}</span></span>
    <span class="integ-card__product">${it.product}</span>
    <span class="integ-card__line">${tm(it.line)}</span>
    ${icon('arrow-right', { size: 18, cls: 'integ-card__arrow' })}
  </a></li>`)}</ul>
  <p class="integ-legend"><strong>Available with setup</strong> — live, we provision it with you · <strong>By request</strong> — built case by case, talk to us.</p>`;
}

// ------------------------------------------------------------------ sticky sub-navigation
export function subnav(route, items) {
  const e = ctaPattern(route, 'A2');
  return html`<nav class="subnav" aria-label="On this page" data-subnav><div class="container"><ul class="subnav__list">${items.map(([label, id]) => html`<li><a class="subnav__pill" href="#${id}"${trackAttrs(e.track, { target: id })}>${tm(label)}</a></li>`)}</ul></div></nav>`;
}

export { cta };
