// `/faq` — remaining-pages-spec.md M1–M3. Every faq.json item with hub: true and status "ready", grouped in the file's
// category order; each item's DOM id is its faq.json id (deep links /faq#<id> open it), single-product items carry a
// product tag that is part of the button's accessible name, and everything is collapsed by default (hidden=until-found,
// so find-in-page still reaches the answers). No FAQPage JSON-LD (spec M2).
import { html, trackAttrs } from '../lib/html.mjs';
import { faq as faqData, ctaMap, site } from '../lib/data.mjs';
import { graph, webPage } from '../lib/seo.mjs';
import { ctaLink } from '../components/ui.mjs';
import { faqAccordion } from '../components/blocks.mjs';
import { pageHero, twoProductCta } from '../components/sections.mjs';

const R = '/faq';
const ITEMS = faqData.items.filter((i) => i.hub && i.status === 'ready' && i.answer);
const CATS = faqData.categories.map((c) => ({ ...c, items: ITEMS.filter((i) => i.category === c.id) })).filter((c) => c.items.length);

function hero() {
  const lead = html`Pricing, the Free plan, billing, platforms, payments and integrations — the straight answers. If yours isn’t here, email ${ctaLink(R, 'support@s-protocol.com', { section: 'M1 Hero', cls: 'text-link--inline text-link--strong' })}.`;
  return pageHero({ eyebrowText: 'FAQ', title: html`Questions worth answering <em>properly</em>.`, lead });
}

/** Category chips (M1): a sticky, scrollable bar below 1024; the sticky side list takes over from 1024. */
function chips() {
  const e = (ctaMap.pages[R] ?? []).find((x) => x.section === 'M1 Hero' && x.label.startsWith('<jump chip'));
  return html`<nav class="subnav subnav--faq" aria-label="FAQ categories" data-subnav><div class="container"><ul class="subnav__list">${CATS.map((c) => html`<li><a class="subnav__pill" href="#${c.id}"${trackAttrs(e.track, { section: e.props.section, link: c.id })}>${c.label}</a></li>`)}</ul></div></nav>`;
}

function questions() {
  const e = (ctaMap.pages[R] ?? []).find((x) => x.section === 'M1 Hero' && x.label.startsWith('<jump chip'));
  return html`<section class="section section--white faq-hub" id="questions" aria-label="Questions by category">
  <div class="container faq-hub__grid">
    <nav class="faq-hub__nav" aria-label="Categories" data-subnav>
      <p class="mono-label">CATEGORIES</p>
      <ul>${CATS.map((c) => html`<li><a class="faq-hub__link" href="#${c.id}" data-subnav-link${trackAttrs(e.track, { section: e.props.section, link: c.id })}><span>${c.label}</span><span class="faq-hub__count">${c.items.length}</span></a></li>`)}</ul>
    </nav>
    <div class="faq-hub__content">${CATS.map((c) => html`<section class="faq-hub__cat" id="${c.id}" aria-labelledby="${c.id}-title">
      <h2 class="h3-serif faq-hub__title" id="${c.id}-title">${c.label}</h2>
      ${faqAccordion(c.items, { idPrefix: 'hub', itemIds: true, tags: true, level: 3 })}
    </section>`)}</div>
  </div>
</section>`;
}

const TITLE = 'S Protocol & S Invoice FAQ — Pricing, Free Plan, Payments';
const DESCRIPTION = 'Straight answers about S Protocol and S Invoice: pricing, the Free plan, billing, iPhone apps, payments and integrations.';

export const meta = {
  route: R, page: 'faq', title: TITLE, description: DESCRIPTION,
  jsonld: graph(webPage(R, TITLE, DESCRIPTION, { about: [{ '@id': `${site.origin}/#app` }, { '@id': `${site.origin}/s-invoice#app` }] })),
};

export function render() {
  return html`${hero()}
${chips()}
${questions()}
${twoProductCta({ route: R, section: 'M3 Final CTA' })}`;
}
