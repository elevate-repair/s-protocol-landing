// `/pricing` — remaining-pages-spec.md C1–C8. One page-level Monthly/Yearly toggle drives both products' cards (the
// three sections share one [data-pricing] scope). Every price, allowance and term comes from pricing.json. Safe
// defaults: D-08 (upgrade wording), D-09 (the switch-period question is omitted), D-10 (no "Team members" row).
import { html, trackAttrs } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { SP, SI, ctaMap, site } from '../lib/data.mjs';
import { graph, sProtocolApp, sInvoiceAppPage, webPage } from '../lib/seo.mjs';
import { tm, ctaLink, sectionHead } from '../components/ui.mjs';
import { pricingPair, billingToggle, faqList } from '../components/blocks.mjs';
import { pageHero, twoProductCta, productIcon } from '../components/sections.mjs';

const R = '/pricing';
const spa = SP.free.allowance;
const sia = SI.free.allowance;

// ------------------------------------------------------------------ C1 Hero + page-level toggle + jump chips
function hero() {
  const chips = (ctaMap.pages[R] ?? []).filter((e) => e.section === 'C1 Hero');
  const label = (e) => /S Invoice/.test(e.label) ? 'S Invoice' : 'S Protocol';
  const after = html`<div class="toggle-group">
      ${billingToggle('pricing-billing', 'Yearly')}
      <p class="toggle-group__note">Yearly saves ${SP.pro.yearly.savings_display} on S Protocol and ${SI.pro.yearly.savings_display} on S Invoice.</p>
    </div>
    <ul class="jump-chips" aria-label="Jump to a product">${chips.map((e) => html`<li><a class="chip-link" href="${e.href}"${trackAttrs(e.track, e.props)}>${productIcon(label(e) === 'S Invoice' ? 's_invoice' : 's_protocol', 20)}<span>${label(e)}</span></a></li>`)}</ul>`;
  return pageHero({
    eyebrowText: 'PRICING',
    title: html`Simple prices. <em>No per-seat math.</em>`,
    lead: `Both products start free with no card. S Protocol Pro is ${SP.pro.monthly.short} for the whole team; S Invoice Pro is ${SI.pro.monthly.short}.`,
    after,
  });
}

const productRow = (product, name, line, id) => html`<div class="product-row">${productIcon(product, 40)}<div><h2 class="product-row__name" id="${id}">${name}</h2><p class="product-row__line">${line}</p></div></div>`;

// ------------------------------------------------------------------ C2 S Protocol
function sProtocol() {
  return html`<section class="section section--white pricing-product" id="s-protocol" aria-labelledby="sp-name">
  <div class="container pricing-wrap">
    ${pricingPair({
      product: 's_protocol', route: R, location: 'pricing_page', standalone: false,
      head: productRow('s_protocol', 'S Protocol', SP.positioning, 'sp-name'),
      free: { label: 'S PROTOCOL FREE', section: 'C2 S Protocol — Free', cta: 'Create a free workspace', items: [`Your first ${spa.jobs} jobs, ${spa.invoices} invoices and ${spa.recorded_payments} recorded payments`, 'A one-time allowance for the business, not a monthly reset', 'Every feature unlocked — nothing held back', 'Whatever you create stays readable, always'] },
      pro: { label: 'S PROTOCOL PRO', section: 'C2 S Protocol — Pro', cta: 'Start with S Protocol', note: 'Start on Free, then upgrade when you’re ready.', items: ['Unlimited jobs, invoices and payments', html`Every role and integration included<sup>1</sup>`, 'No per-seat fees and no team-member limit', 'Cancel anytime — Pro runs to the end of the period you paid for', 'If billing lapses, your records are never hidden'] },
    })}
    <p class="footnote pricing-wrap__foot"><sup>1</sup> Integrations are set up with you or available by request — see <a href="/integrations">Integrations</a>.</p>
  </div>
</section>`;
}

// ------------------------------------------------------------------ C3 S Invoice
function sInvoice() {
  return html`<section class="section section--tint pricing-product" id="s-invoice" aria-labelledby="si-name">
  <div class="container pricing-wrap">
    ${pricingPair({
      product: 's_invoice', route: R, location: 'pricing_page', standalone: false,
      head: productRow('s_invoice', 'S Invoice', SI.positioning, 'si-name'),
      free: { label: 'S INVOICE FREE', section: 'C3 S Invoice — Free', cta: 'Send your first invoice', items: [`Your first ${sia.invoices} invoices and ${sia.recorded_payments} recorded payments`, 'A one-time allowance, not a monthly reset', 'Estimates, customers, PDFs and public links included', 'Estimates stay free until converted', 'Whatever you create stays readable, always'] },
      pro: { label: 'S INVOICE PRO', section: 'C3 S Invoice — Pro', cta: 'Start S Invoice free', items: ['Unlimited invoices and recorded payments', 'Online card payments once Stripe is connected', 'Refunds, partial payments and balance tracking', 'Reports, statements and multi-currency documents'] },
    })}
  </div>
</section>`;
}

// ------------------------------------------------------------------ C4 How Free works
function howFree() {
  const facts = [
    ['gift', 'One-time, not monthly', `Free is an allowance for the business: ${spa.jobs} jobs, ${spa.invoices} invoices and ${spa.recorded_payments} payments on S Protocol; ${sia.invoices} invoices and ${sia.recorded_payments} payments on S Invoice. Deleting a document doesn’t give it back.`],
    ['monitor-smartphone', 'The real product', 'Every S Protocol feature is unlocked on Free, and S Invoice Free is the same app Pro uses. It’s not a stripped-down demo, and there’s no Pro trial countdown.'],
    ['lock-open', 'Yours to keep', 'Hit the limit or stop paying, and everything you created stays readable.'],
  ];
  return html`<section class="section section--paper" id="free" aria-labelledby="free-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'THE FREE PLAN', title: 'How Free works.', id: 'free-title', cls: 'section-head--7' })}
    <ul class="fact-cards">${facts.map(([ic, t, b]) => html`<li class="fact-card"><span class="icon-tile">${icon(ic, { size: 20 })}</span><h3 class="fact-card__title">${t}</h3><p>${b}</p></li>`)}</ul>
  </div>
</section>`;
}

// ------------------------------------------------------------------ C5 Pro at a glance (condensed CompareTable)
// built at render time: icon() registers its symbol in the page's sprite only while that page renders
const yes = () => html`${icon('check', { size: 18, cls: 'cmp__yes' })}<span class="sr-only">Included</span>`;
const no = () => html`${icon('minus', { size: 18, cls: 'cmp__no' })}<span class="sr-only">Not included</span>`;
const proRows = () => [
  ['Price', html`<span class="cmp__price">${SI.pro.monthly.short} or ${SI.pro.yearly.short}</span>`, html`<span class="cmp__price">${SP.pro.monthly.short} or ${SP.pro.yearly.short}</span>`],
  ['Unlimited invoices and recorded payments', yes(), yes()],
  ['Unlimited jobs', no(), yes()],
  ['Online card payments (Stripe)', yes(), yes()],
  ['Tap to Pay on iPhone and card readers', no(), html`${icon('check', { size: 18, cls: 'cmp__yes' })}<span class="sr-only">Included, </span><span class="cmp__note">USD</span>`],
  ['Document currencies', 'USD, CAD, EUR, GBP', 'USD'],
  ['Customer statements', 'On iPhone', no()],
  ['Integrations', 'Stripe', 'All, set up with you or by request'],
];
const cellOf = (v) => (typeof v === 'string' ? html`<span>${tm(v)}</span>` : v);
function proGlance() {
  const PRO_ROWS = proRows();
  return html`<section class="section section--white" id="included" aria-labelledby="included-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'PRO AT A GLANCE', title: 'What Pro includes.', id: 'included-title', cls: 'section-head--7' })}
    <div class="cmp cmp--glance">
      <table class="cmp__table"><caption class="sr-only">S Invoice Pro and S Protocol Pro compared</caption>
        <thead><tr><th scope="col">Feature</th><th scope="col">S Invoice Pro</th><th scope="col">S Protocol Pro</th></tr></thead>
        <tbody>${PRO_ROWS.map(([f, a, b]) => html`<tr><th scope="row">${tm(f)}</th><td>${cellOf(a)}</td><td>${cellOf(b)}</td></tr>`)}</tbody>
      </table>
      <dl class="cmp__list">${PRO_ROWS.map(([f, a, b]) => html`<div class="cmp__item"><dt>${tm(f)}</dt><dd><span class="cmp__product">S Invoice Pro</span>${cellOf(a)}</dd><dd><span class="cmp__product">S Protocol Pro</span>${cellOf(b)}</dd></div>`)}</dl>
    </div>
    <p class="links-row">${ctaLink(R, 'See the full comparison →', { section: 'C5 Pro at a glance' })}</p>
  </div>
</section>`;
}

// ------------------------------------------------------------------ C6 The fine print
function finePrintSection() {
  const items = [
    'Prices in USD.',
    'Subscriptions renew until canceled; cancel anytime and Pro runs to the end of the period you paid for.',
    'If billing lapses, you keep read access to everything and drop back to Free limits.',
    'Subscriptions bought through the App Store are billed by Apple and managed in your Apple account.',
    html`One set of <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a> covers both products.`,
    'No free trial of Pro — the Free plan is the trial.',
  ];
  return html`<section class="section section--paper" id="billing" aria-labelledby="billing-title">
  <div class="container fine-print-layout">
    ${sectionHead({ eyebrow: 'BILLING', title: 'The fine print.', id: 'billing-title' })}
    <ul class="bullets">${items.map((i) => html`<li>${typeof i === 'string' ? tm(i) : i}</li>`)}</ul>
  </div>
</section>`;
}

// ------------------------------------------------------------------ C7 FAQ
function faq() {
  return html`<section class="section section--white" id="faq" aria-labelledby="faq-title">
  <div class="container faq-layout">
    <div class="faq-layout__head">${sectionHead({ eyebrow: 'FAQ', title: 'Pricing questions.', id: 'faq-title' })}</div>
    <div class="faq-layout__list">
      ${faqList(R, { idPrefix: 'pricing-faq', defaultOpen: 'per-technician' })}
      <p class="faq-more">${ctaLink(R, 'See all questions →', { section: 'C7 FAQ' })}</p>
    </div>
  </div>
</section>`;
}

const TITLE = `Pricing: S Protocol ${SP.pro.monthly.short}, S Invoice ${SI.pro.monthly.short}`;
const DESCRIPTION = `Public, flat pricing. S Protocol Pro is ${SP.pro.monthly.short} for your whole team with no per-seat fees. S Invoice Pro is ${SI.pro.monthly.short}. Both start free with no card.`;

export const meta = {
  route: R, page: 'pricing', title: TITLE, description: DESCRIPTION,
  jsonld: graph(webPage(R, TITLE, DESCRIPTION, { about: [{ '@id': `${site.origin}/#app` }, { '@id': `${site.origin}/s-invoice#app` }] }), sProtocolApp(), sInvoiceAppPage()),
};

export function render() {
  return html`<div class="pricing-scope" data-pricing data-location="pricing_page">
${hero()}
${sProtocol()}
${sInvoice()}
</div>
${howFree()}
${proGlance()}
${finePrintSection()}
${faq()}
${twoProductCta({ route: R, section: 'C8 Final CTA' })}`;
}
