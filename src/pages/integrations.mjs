// `/integrations` — remaining-pages-spec.md E1–E5 (replaces `/#integrations`). Six cards, each with its own id for deep
// links (/s-protocol A9 links to them), labeled honestly "Available with setup" or "By request". Third-party names are
// text only. Safe defaults: D-06 (Quo wording — the current site's), D-11 (no processing-fee sentence), D-12 (the setup
// paragraphs are the legend lines).
import { html, trackAttrs } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { cta, site } from '../lib/data.mjs';
import { graph, webPage } from '../lib/seo.mjs';
import { tm, ctaLink, sectionHead } from '../components/ui.mjs';
import { faqList, ctaStage } from '../components/blocks.mjs';
import { pageHero } from '../components/sections.mjs';

const R = '/integrations';
const SETUP = 'Available with setup';
const REQUEST = 'By request';

// remaining-pages-spec.md E2 — full descriptions; Quo is the D-06 safe wording until the owner confirms the behavior.
const CARDS = [
  { id: 'stripe', key: 'stripe', icon: 'credit-card', name: 'Stripe', product: 'Both products', status: SETUP, body: 'Card payments from the invoice your customer opens, plus wallets, deposits and part payments. (S Invoice: online card payments are part of Pro.)' },
  { id: 'tap-to-pay-on-iphone', key: 'tap_to_pay_on_iphone', icon: null, name: 'Tap to Pay on iPhone & card readers', product: 'S Protocol', status: SETUP, body: 'Take the payment in person on the iPhone already in the technician’s hand — no card reader to buy, carry or charge. Card readers are supported as well. In-person payments are USD.' },
  { id: 'website-leads', key: 'website_leads', icon: 'inbox', name: 'Website lead intake', product: 'S Protocol', status: SETUP, body: 'An inquiry from your own site arrives as a lead with the address and the problem, ready to become a booked job.' },
  { id: 'quo', key: 'quo', icon: 'phone-call', name: 'Quo — calls & SMS', product: 'S Protocol', status: REQUEST, body: 'Calls and SMS on your business line — by request.' },
  { id: 'thumbtack', key: 'thumbtack', icon: 'user-plus', name: 'Thumbtack', product: 'S Protocol', status: REQUEST, body: 'Inbound leads routed into your workspace. Provisioned per business rather than switched on from Settings.' },
  { id: 'api', key: 'api', icon: 'webhook', name: 'Your own systems — API access & webhooks', product: 'S Protocol', status: REQUEST, body: 'API access and webhooks for businesses running something specific. Tell us what you need to talk to.' },
];
const statusChip = (s) => html`<span class="status-chip status-chip--${s === REQUEST ? 'request' : 'setup'}">${s}</span>`;
const LEGEND = [[SETUP, 'Live — we provision it with you'], [REQUEST, 'Built case by case — talk to us']];

// ------------------------------------------------------------------ E1 Hero + legend
function hero() {
  const after = html`<dl class="legend">${LEGEND.map(([s, l]) => html`<div class="legend__row"><dt>${statusChip(s)}</dt><dd>${l}</dd></div>`)}</dl>`;
  return pageHero({
    eyebrowText: 'CONNECTIONS',
    title: 'What connects, and how it actually gets connected.',
    lead: 'Some connections are live and set up with you; others are built case by case. Each one is labeled honestly.',
    after, cls: 'page-hero--legend',
  });
}

// ------------------------------------------------------------------ E2 Six integration cards
function cards() {
  const setupCta = cta(R, 'Set it up with us →', 'E2 Cards (Available');
  const requestCta = cta(R, 'Ask about it →', 'E2 Cards (By request');
  return html`<section class="section section--white" id="list" aria-labelledby="list-title">
  <div class="container">
    <h2 class="sr-only" id="list-title">Integrations</h2>
    <ul class="integ-page-grid">${CARDS.map((c) => {
      const e = c.status === SETUP ? setupCta : requestCta;
      return html`<li class="integ-page-card" id="${c.id}">
        <div class="integ-page-card__top">${c.icon ? html`<span class="icon-tile">${icon(c.icon, { size: 20 })}</span>` : html`<span class="integ-page-card__noicon" aria-hidden="true"></span>`}${statusChip(c.status)}</div>
        <h3 class="integ-page-card__name">${tm(c.name)}</h3>
        <p class="integ-page-card__product">${c.product}</p>
        <p class="integ-page-card__body">${tm(c.body)}</p>
        <p class="integ-page-card__foot"><a class="text-link" href="${e.href}"${trackAttrs(e.track, { integration: c.key })}><span>${e.label.replace(/\s*→$/, '')}</span><span class="sr-only"> (${c.name})</span>${icon('arrow-right', { size: 16, cls: 'text-link__arrow' })}</a></p>
      </li>`;
    })}</ul>
    <div class="setup-note" id="setup">
      <h3 class="mono-label">HOW SETUP WORKS</h3>
      <dl class="setup-note__list">${LEGEND.map(([s, l]) => html`<div><dt>${statusChip(s)}</dt><dd>${l}.</dd></div>`)}</dl>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ E4 FAQ + E5 CTA band
function faq() {
  return html`<section class="section section--paper" id="faq" aria-labelledby="faq-title">
  <div class="container faq-layout">
    <div class="faq-layout__head">${sectionHead({ eyebrow: 'FAQ', title: 'Integration questions.', id: 'faq-title' })}</div>
    <div class="faq-layout__list">${faqList(R, { idPrefix: 'integ-faq', defaultOpen: 'integration-setup' })}</div>
  </div>
</section>`;
}
function finalCta() {
  return ctaStage({
    route: R, id: 'start', headingId: 'start-title', eyebrowText: 'INTEGRATIONS',
    title: html`Tell us what you need to <em>connect</em>.`,
    lead: 'We’ll tell you whether it’s live today and set up with you, or something we build by request.',
    single: html`<div class="cta-row">${ctaLink(R, 'Ask about an integration', { section: 'E5 CTA band' })}${ctaLink(R, 'Start free', { section: 'E5 CTA band' })}</div>`,
  });
}

const TITLE = 'Integrations: Stripe, Tap to Pay on iPhone & More';
const DESCRIPTION = 'What connects to S Protocol and S Invoice — Stripe, Tap to Pay on iPhone, card readers, website leads, Quo, Thumbtack and APIs — and how each is set up.';

export const meta = {
  route: R, page: 'integrations', title: TITLE, description: DESCRIPTION,
  jsonld: graph(webPage(R, TITLE, DESCRIPTION, { about: { '@id': `${site.origin}/#app` } })),
};

export function render() {
  return html`${hero()}
${cards()}
${faq()}
${finalCta()}`;
}
