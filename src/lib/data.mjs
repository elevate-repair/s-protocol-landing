// Single-source content (copies of docs/redesign/content/*.json, see src/data/). Components never hard-code a price,
// an FAQ answer, a destination or a CTA: they read them from here.
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const load = async (name) => JSON.parse(await readFile(join(DATA, `${name}.json`), 'utf8'));

export const pricing = await load('pricing');
export const faq = await load('faq');
export const nav = await load('navigation');
export const destinations = await load('destinations');
export const ctaMap = await load('cta-map');
export const site = await load('site');

export const SP = pricing.products.s_protocol;
export const SI = pricing.products.s_invoice;
export const strings = pricing.display_strings;

/** An external destination URL by key (destinations.json → external). */
export function dest(key) {
  const d = destinations.external[key];
  if (!d) throw new Error(`unknown destination "${key}"`);
  return d.url;
}

/**
 * The CTA-map entry for a literal label on a route (cta-map.json → pages[route]). Throws when it is missing, so a
 * page can never ship a CTA that the map (and qa-content.mjs) does not know. `section` disambiguates repeated labels.
 */
export function cta(route, label, section) {
  const list = ctaMap.pages[route] ?? [];
  const hit = list.filter((e) => e.label === label && (!section || e.section.startsWith(section)));
  if (!hit.length) throw new Error(`cta-map.json has no "${label}"${section ? ` in "${section}"` : ''} on ${route}`);
  return hit[0];
}

/** CTA entries matched by a pattern label (the "<…>" entries) — used for badges, cards and pills. */
export function ctaPattern(route, section) {
  const hit = (ctaMap.pages[route] ?? []).find((e) => e.section.startsWith(section));
  if (!hit) throw new Error(`cta-map.json has no entry for section "${section}" on ${route}`);
  return hit;
}

const faqById = new Map(faq.items.map((i) => [i.id, i]));

/** FAQ items for a route, in the order of faq.json → pages[route]; "confirm" items are omitted (safe default). */
export function faqItems(route) {
  const page = faq.pages[route];
  if (!page || !Array.isArray(page.items)) return [];
  return page.items.map((id) => {
    const it = faqById.get(id);
    if (!it) throw new Error(`faq.json has no item "${id}"`);
    return it;
  }).filter((it) => it.status === 'ready' && it.answer);
}
export const faqDefaultOpen = (route) => faq.pages[route]?.default_open ?? null;

/** The header "Start free" context override for a route, if any (navigation.json). */
export function startFreeOverride(route) {
  const chooser = nav.header.right.find((g) => g.id === 'start_free');
  return Object.values(chooser.context_overrides ?? {}).find((o) => (o.applies_to_routes ?? []).includes(route)) ?? null;
}

export const year = () => new Date().getUTCFullYear();
