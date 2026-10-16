// Small shared components: Apple-mark casing, eyebrows, buttons, text links, chips, icon tiles, feature rows, ledgers,
// section heads. Every CTA that the CTA map knows is rendered from cta-map.json (label, href, tracking) via ctaLink().
import { html, raw, attrs, trackAttrs, esc, isSafe } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { cta } from '../lib/data.mjs';

const APPLE_MARKS = /(Tap to Pay on iPhone|App Store|iPhone|iPad)/g;
/** Wraps Apple marks in span.tm so uppercase labels never render them in capitals (Apple marketing guidelines). */
export function tm(text) {
  if (isSafe(text)) return text;
  return raw(esc(text).replace(APPLE_MARKS, (m) => (m === 'Tap to Pay on iPhone' ? 'Tap to Pay on <span class="tm">iPhone</span>' : `<span class="tm">${m}</span>`)));
}

/** Strips a trailing → / ↗ from a label (arrows are icons, copy-and-cta-map.md §1) and returns [text, iconName|null]. */
export function splitArrow(label) {
  const m = /\s*([→↗])\s*$/u.exec(label);
  if (!m) return [label, null];
  return [label.slice(0, m.index), m[1] === '→' ? 'arrow-right' : 'arrow-up-right'];
}

export const eyebrow = (text, { tone = '', cls = '', id = null } = {}) =>
  html`<p class="eyebrow${tone ? ' eyebrow--' + tone : ''}${cls ? ' ' + cls : ''}"${attrs({ id })}>${tm(text)}</p>`;

/** A button-styled link. variant: primary | secondary | on-dark; size: lg | md | sm. */
export function btn({ label, href, variant = 'primary', size = 'lg', full = false, track = null, props = {}, cls = '', attrs: extra = {} }) {
  const [text, arrow] = splitArrow(label);
  const c = `btn btn--${variant} btn--${size}${full ? ' btn--full' : ''}${cls ? ' ' + cls : ''}`;
  return html`<a class="${c}" href="${href}"${trackAttrs(track, props)}${attrs(extra)}><span>${tm(text)}</span>${arrow ? icon(arrow, { size: 16, cls: 'btn__arrow' }) : ''}</a>`;
}

/** An arrow text link. */
export function textLink({ label, href, dark = false, track = null, props = {}, cls = '', srContext = null }) {
  const [text, arrow] = splitArrow(label);
  return html`<a class="text-link${dark ? ' text-link--dark' : ''}${cls ? ' ' + cls : ''}" href="${href}"${trackAttrs(track, props)}><span>${tm(text)}</span>${srContext ? html`<span class="sr-only"> (${srContext})</span>` : ''}${arrow ? icon(arrow, { size: 16, cls: 'text-link__arrow' }) : ''}</a>`;
}

const STYLE = {
  'primary-lg': ['btn', 'primary', 'lg'], 'primary-md': ['btn', 'primary', 'md'], 'secondary-lg': ['btn', 'secondary', 'lg'], 'secondary-md': ['btn', 'secondary', 'md'],
  'secondary-on-dark-lg': ['btn', 'on-dark', 'lg'], 'primary-lg-full': ['btn', 'primary', 'lg', true], 'secondary-lg-full': ['btn', 'secondary', 'lg', true],
  'text-link': ['link', false], 'text-link-on-dark': ['link', true], 'text-link-lg': ['link', false],
};

/** A CTA rendered exactly as cta-map.json defines it for this route (label → href, style, data-track, data-*). */
export function ctaLink(route, label, { section = null, cls = '', props = {}, variant = null, size = null, full = null } = {}) {
  const e = cta(route, label, section);
  const s = STYLE[e.style];
  if (!s) throw new Error(`no renderer for CTA style ${e.style} ("${label}")`);
  const p = { ...e.props, ...props };
  for (const [k, v] of Object.entries(p)) if (String(v).startsWith('<')) delete p[k]; // pattern props are filled by the page (e.g. period)
  if (s[0] === 'btn') return btn({ label: e.label, href: e.href, variant: variant ?? s[1], size: size ?? s[2], full: full ?? Boolean(s[3]), track: e.track, props: { ...p, ...props }, cls });
  return textLink({ label: e.label, href: e.href, dark: s[1], track: e.track, props: { ...p, ...props }, cls });
}

/** Status chips reproduce the apps' chip styles (design-system.md §8.3). Text is always present. */
export const chip = (label, tone, { cls = '' } = {}) => html`<span class="chip chip--${tone}${cls ? ' ' + cls : ''}">${label}</span>`;
export const factChip = (label) => html`<span class="fact-chip">${tm(label)}</span>`;

export const iconTile = (name, { dark = false } = {}) => html`<span class="icon-tile${dark ? ' icon-tile--dark' : ''}">${icon(name, { size: 20 })}</span>`;

export const featureRow = ({ icon: name, title, body = null, dark = false, tag = 'h3' }) => html`<div class="feature-row${dark ? ' feature-row--dark' : ''}">${iconTile(name, { dark })}<div><${raw(tag)} class="feature-row__title">${tm(title)}</${raw(tag)}>${body ? html`<p class="feature-row__body">${tm(body)}</p>` : ''}</div></div>`;

/** A <dl> ledger of hairline-separated facts. rows: [[term, description(html|string)], …] */
export const ledger = (rows, { cls = '' } = {}) => html`<dl class="ledger${cls ? ' ' + cls : ''}">${rows.map(([t, d]) => html`<div class="ledger__row"><dt>${tm(t)}</dt><dd>${isSafe(d) ? d : tm(d)}</dd></div>`)}</dl>`;

/** Eyebrow → H2 → lead, the standard section rhythm. title may contain html (italic accent). */
export function sectionHead({ eyebrow: eb, title, lead = null, tone = '', id, cls = '', leadCls = '' }) {
  return html`<div class="section-head${cls ? ' ' + cls : ''}">${eb ? eyebrow(eb, { tone }) : ''}<h2 class="h2" id="${id}">${title}</h2>${lead ? html`<p class="lead${leadCls ? ' ' + leadCls : ''}">${isSafe(lead) ? lead : tm(lead)}</p>` : ''}</div>`;
}

export const check = (text, { dark = false } = {}) => html`<li>${icon('check', { size: 16, cls: dark ? 'check check--dark' : 'check' })}<span>${isSafe(text) ? text : tm(text)}</span></li>`;
