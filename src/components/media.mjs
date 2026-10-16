// Product-UI frames and Apple assets. "Photos sit, product floats": only UI frames carry the elevation shadow.
// S Protocol web screens are real captures (src/lib/ui-shots.mjs → shotFrame / shotCrop). Screens that cannot be
// captured from the offline app copy (the customer-facing invoice, S Invoice, the iPhone app) stay faithful HTML replicas
// of screens that exist in the apps (product-ui-capture-plan.md §7): a replica's root is role="img" with an aria-label,
// its inner markup is aria-hidden, and it carries data-qa-ignore so its sample amounts are never read as claims.
import { html, attrs, trackAttrs } from '../lib/html.mjs';
import { shot, shotMeta } from '../lib/ui-shots.mjs';

/** Browser-framed UI (UiFrame). host: app.s-protocol.com | invoice.s-protocol.com. */
export function uiFrame({ host = 'app.s-protocol.com', dark = false, label, content, cls = '', caption = null, bodyCls = '' }) {
  return html`<figure class="ui-frame${dark ? ' ui-frame--dark' : ''}${cls ? ' ' + cls : ''}">
  <div class="ui-frame__bar" aria-hidden="true"><span class="ui-frame__dots"><i></i><i></i><i></i></span><span class="ui-frame__host">${host}</span></div>
  ${replicaBody(label, content, `ui-frame__body${bodyCls ? ' ' + bodyCls : ''}`)}
  ${caption ? html`<figcaption class="ui-caption">${caption}</figcaption>` : ''}
</figure>`;
}

/** A focused crop without browser chrome (UiCrop). */
export const uiCrop = ({ label, content, cls = '' }) => html`<div class="ui-crop${cls ? ' ' + cls : ''}">${replicaBody(label, content, 'ui-crop__body')}</div>`;

/** The customer-facing document on white (DocCard). */
export const docCard = ({ label, content, cls = '' }) => html`<div class="doc-card${cls ? ' ' + cls : ''}">${replicaBody(label, content, 'doc-card__body')}</div>`;

export const replicaBody = (label, content, cls) => html`<div class="${cls}" role="img" aria-label="${label}" data-qa-ignore data-replica><div class="replica" aria-hidden="true">${content}</div></div>`;

/**
 * Official "Download on the App Store" badge (BADGE-APPLE-01): unmodified SVG, 48 px tall, one per page, never animated.
 * The CTA entry supplies href and tracking (cta-map.json).
 */
export function appStoreBadge(entry) {
  return html`<a class="app-store-badge" href="${entry.href}"${trackAttrs(entry.track, entry.props)}><img src="/assets/brand/download-on-the-app-store.svg" width="144" height="48" alt="Download on the App Store" loading="lazy" decoding="async"></a>`;
}

/** Marker circle used on UI stages (aria-hidden; the text callouts carry the meaning). */
export const marker = (n, { x, y, cls = '' } = {}) => html`<span class="marker${cls ? ' ' + cls : ''}" aria-hidden="true"${attrs({ style: x !== undefined ? `left:${x}%;top:${y}%` : null })}>${n}</span>`;

// ------------------------------------------------------------------ real captures
const bar = (host) => html`<div class="ui-frame__bar" aria-hidden="true"><span class="ui-frame__dots"><i></i><i></i><i></i></span><span class="ui-frame__host">${host}</span></div>`;

/** The capture plus its overlays; `visible` (0–1) shows only that top fraction of it, at the same scale. */
function stage(id, { sizes, eager, priority, media, alt, overlays, visible }) {
  const inner = html`<div class="shot-stage">${shot(id, { sizes, eager, priority, media, alt })}${overlays ?? ''}</div>`;
  if (!visible || visible >= 1) return inner;
  const m = shotMeta(id);
  return html`<div class="shot-window" style="aspect-ratio:${m.width} / ${Math.round(m.height * visible)}">${inner}</div>`;
}

/** A real capture in a browser frame (UiFrame). overlays: rings / pins positioned in percent of the capture. */
export function shotFrame({ id, sizes, host = 'app.s-protocol.com', dark = false, cls = '', bodyCls = '', overlays = null, eager = false, priority = false, media = null, alt = null, caption = null, visible = null }) {
  const body = html`<div class="ui-frame__body shot-body${bodyCls ? ' ' + bodyCls : ''}">${stage(id, { sizes, eager, priority, media, alt, overlays, visible })}</div>`;
  return html`<figure class="ui-frame ui-frame--shot${dark ? ' ui-frame--dark' : ''}${cls ? ' ' + cls : ''}">${bar(host)}${body}${caption ? html`<figcaption class="ui-caption">${caption}</figcaption>` : ''}</figure>`;
}

/** A focused real capture without browser chrome (UiCrop). */
export function shotCrop({ id, sizes, cls = '', overlays = null, eager = false, alt = null, dark = false, visible = null }) {
  return html`<div class="ui-crop ui-crop--shot${dark ? ' ui-crop--dark' : ''}${cls ? ' ' + cls : ''}">${stage(id, { sizes, eager, alt, overlays, visible })}</div>`;
}

/**
 * Art-directed capture in one browser frame: `wide` from 768 px up, `narrow` below (each { id, sizes, overlays?,
 * visible?, priority? }). The wide picture carries media="(min-width: 768px)" so phones never download it; the narrow
 * one is lazy inside a container hidden from 768 up, so desktops never download it.
 */
export function artFrame({ host = 'app.s-protocol.com', dark = false, cls = '', wide, narrow }) {
  const w = stage(wide.id, { sizes: wide.sizes, priority: wide.priority, eager: wide.eager, media: '(min-width: 768px)', overlays: wide.overlays, visible: wide.visible });
  const n = stage(narrow.id, { sizes: narrow.sizes, overlays: narrow.overlays, visible: narrow.visible });
  return html`<figure class="ui-frame ui-frame--shot${dark ? ' ui-frame--dark' : ''}${cls ? ' ' + cls : ''}">${bar(host)}<div class="ui-frame__body shot-body"><div class="art art--wide">${w}</div><div class="art art--narrow">${n}</div></div></figure>`;
}
