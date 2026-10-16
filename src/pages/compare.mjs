// `/compare` — remaining-pages-spec.md D1–D7 (replaces the old `/#compare` and `/#growth` anchors). The full table uses
// the current site's verified rows; the growth path and its one condition are stated exactly as the spec words them.
import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { SP, SI, faq as faqData, site } from '../lib/data.mjs';
import { graph, webPage } from '../lib/seo.mjs';
import { tm, eyebrow, ctaLink, sectionHead, check } from '../components/ui.mjs';
import { faqList } from '../components/blocks.mjs';
import { pageHero, twoProductCta, productIcon } from '../components/sections.mjs';

const R = '/compare';

// ------------------------------------------------------------------ D1 Hero + D2 two path cards
function hero() {
  return pageHero({
    eyebrowText: 'SIDE BY SIDE',
    title: 'Which one is yours?',
    lead: 'If you schedule other people’s work, start with S Protocol. If you bill for your own, start with S Invoice — and add the operations side later on the same workspace.',
  });
}
function paths() {
  return html`<section class="section section--paper section--tight-top" id="paths" aria-label="The two products">
  <div class="container">
    <div class="path-cards">
      <article class="path-card" aria-labelledby="path-si">
        <div class="path-card__id">${productIcon('s_invoice', 40)}<h2 class="path-card__name" id="path-si">S Invoice</h2></div>
        <p class="path-card__best">Best for a solo pro or a small crew who bill for their own work.</p>
        <p class="path-card__price">Free · Pro ${SI.pro.monthly.short}</p>
        <div class="path-card__cta">${ctaLink(R, 'Start S Invoice free', { section: 'D2 Path card — S Invoice' })}</div>
      </article>
      <article class="path-card path-card--night" aria-labelledby="path-sp">
        <div class="path-card__id">${productIcon('s_protocol', 40)}<h2 class="path-card__name" id="path-sp">S Protocol</h2></div>
        <p class="path-card__best">Best for a business scheduling and dispatching other people’s work.</p>
        <p class="path-card__price">Free · Pro ${SP.pro.monthly.short}</p>
        <div class="path-card__cta">${ctaLink(R, 'Start S Protocol free', { section: 'D2 Path card — S Protocol' })}</div>
      </article>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ D3 Full comparison
const Y = 'yes', N = 'no';
const GROUPS = [
  ['GETTING PAID — BOTH PRODUCTS', [
    ['Invoices', Y, Y], ['Estimates', Y, Y], ['Customers and history', Y, Y], ['Public invoice links and PDFs', Y, Y],
    ['Online card payments', Y, Y], ['Reports', Y, Y], ['Multi-currency documents', 'USD, CAD, EUR, GBP', 'USD'], ['Customer statements', 'On iPhone', N],
  ]],
  ['RUNNING THE OPERATION — S PROTOCOL ONLY', [
    ['Jobs', N, Y], ['Scheduling and dispatch', N, Y], ['Technicians and team roles', N, [Y, 'no per-seat cost']], ['Tap to Pay on iPhone', N, [Y, 'USD']],
    ['Calls and SMS on your business line', N, 'By request'], ['Website lead intake', N, [Y, 'set up with you']], ['Team chat on the job', N, Y],
  ]],
  ['PLATFORMS & PRICE', [
    ['Web and iPhone', Y, Y], ['Price', `Free · Pro ${SI.pro.monthly.short}`, `Free · Pro ${SP.pro.monthly.short}`],
  ]],
];
function cell(v) {
  if (v === Y) return html`${icon('check', { size: 18, cls: 'cmp__yes' })}<span class="sr-only">Included</span>`;
  if (v === N) return html`${icon('minus', { size: 18, cls: 'cmp__no' })}<span class="sr-only">Not included</span>`;
  if (Array.isArray(v)) return html`${icon('check', { size: 18, cls: 'cmp__yes' })}<span class="sr-only">Included — </span><span class="cmp__note cmp__note--text">${tm(v[1])}</span>`;
  return html`<span>${tm(v)}</span>`;
}
function table() {
  return html`<section class="section section--white" id="table" aria-labelledby="table-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'THE FULL COMPARISON', title: 'Feature by feature.', id: 'table-title', cls: 'section-head--7' })}
    <div class="cmp cmp--full">
      <table class="cmp__table"><caption class="sr-only">S Invoice and S Protocol compared feature by feature</caption>
        <thead><tr><th scope="col">Feature</th><th scope="col">${productIcon('s_invoice', 24)}<span>S Invoice</span></th><th scope="col">${productIcon('s_protocol', 24)}<span>S Protocol</span></th></tr></thead>
        ${GROUPS.map(([g, rows]) => html`<tbody><tr class="cmp__group"><th scope="colgroup" colspan="3">${g}</th></tr>${rows.map(([f, a, b]) => html`<tr><th scope="row">${tm(f)}</th><td>${cell(a)}</td><td>${cell(b)}</td></tr>`)}</tbody>`)}
      </table>
      <div class="cmp__list cmp__list--grouped">${GROUPS.map(([g, rows]) => html`<h3 class="cmp__group-label">${g}</h3><dl>${rows.map(([f, a, b]) => html`<div class="cmp__item"><dt>${tm(f)}</dt><dd><span class="cmp__product">S Invoice</span>${cell(a)}</dd><dd><span class="cmp__product">S Protocol</span>${cell(b)}</dd></div>`)}</dl>`)}</div>
    </div>
    <div class="cmp-foot">
      <p>Still deciding? Start with S Invoice. If the business grows into scheduling and crews, S Protocol activates on the same workspace.</p>
      ${ctaLink(R, 'Start S Invoice free', { section: 'D3 Table footer row' })}
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ D4 Growth path (night)
function growth() {
  const today = ['Customers', 'Estimates', 'Invoices & numbering', 'Payments', 'Company details', 'Reports & statements'];
  const adds = ['Jobs', 'Scheduling', 'Dispatch board', 'Technicians', 'Tap to Pay on iPhone', 'Site leads', 'Price book', 'Operational analytics', 'Team chat'];
  return html`<section class="section section--night" id="growth-path" aria-labelledby="growth-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'ONE FAMILY', tone: 'night', title: html`Same workspace. <em>More capability.</em>`, id: 'growth-title', lead: 'S Invoice and S Protocol are two products on one foundation. Adding the operations layer isn’t a move, an export or a fresh start — the same business, the same customers, the same numbering, with more of the work inside it.', leadCls: 'lead--night', cls: 'section-head--night section-head--7' })}
    <div class="growth">
      <div class="growth__card">
        <p class="growth__label">S Invoice today</p>
        <ul class="checks checks--dark">${today.map((t) => check(t, { dark: true }))}</ul>
      </div>
      <p class="growth__bridge mono-label mono-label--night">${icon('arrow-right', { size: 20, cls: 'growth__arrow' })}<span>STAYS EXACTLY WHERE IT IS</span></p>
      <div class="growth__card growth__card--adds">
        <p class="growth__label">S Protocol adds</p>
        <ul class="checks checks--dark growth__adds">${adds.map((t) => check(t, { dark: true }))}</ul>
        <p class="growth__note">Your invoice history stays visible in S Protocol. Job invoices created in S Protocol stay on the operations side, so the S Invoice list you know doesn’t fill up with dispatch paperwork.</p>
      </div>
    </div>
    <div class="family-callout growth__condition">
      <p class="mono-label mono-label--night">THE ONE CONDITION, STATED PLAINLY</p>
      <p>Activating S Protocol on an existing S Invoice workspace starts on a paid S Protocol plan, and the workspace owner is the one who does it. Creating a free S Protocol account instead is a separate signup with a fresh, empty workspace.</p>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ D5 Using both + D6 FAQ
function both() {
  const it = faqData.items.find((i) => i.id === 'use-both');
  return html`<section class="section section--paper" id="both" aria-labelledby="both-title">
  <div class="container"><div class="narrow-block">
    ${eyebrow('USING BOTH')}
    <h2 class="h3-serif narrow-block__title" id="both-title">${it.question}</h2>
    <p class="narrow-block__body">${tm(it.answer)}</p>
  </div></div>
</section>`;
}
function faq() {
  return html`<section class="section section--white" id="faq" aria-labelledby="faq-title">
  <div class="container faq-layout">
    <div class="faq-layout__head">${sectionHead({ eyebrow: 'FAQ', title: 'Comparison questions.', id: 'faq-title' })}</div>
    <div class="faq-layout__list">
      ${faqList(R, { idPrefix: 'compare-faq', defaultOpen: 'move-to-s-protocol' })}
      <p class="faq-more">${ctaLink(R, 'See all questions →', { section: 'D6 FAQ' })}</p>
    </div>
  </div>
</section>`;
}

const TITLE = 'S Protocol vs. S Invoice — Which One Fits Your Business?';
const DESCRIPTION = 'Schedule other people’s work? Start with S Protocol. Bill for your own? Start with S Invoice — and add dispatch later on the same workspace.';

export const meta = {
  route: R, page: 'compare', title: TITLE, description: DESCRIPTION,
  jsonld: graph(webPage(R, TITLE, DESCRIPTION, { about: [{ '@id': `${site.origin}/#app` }, { '@id': `${site.origin}/s-invoice#app` }] })),
};

export function render() {
  return html`${hero()}
${paths()}
${table()}
${growth()}
${both()}
${faq()}
${twoProductCta({ route: R, section: 'D7 Final CTA', link: false })}`;
}
