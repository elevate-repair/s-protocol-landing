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

/**
 * The capture plus its overlays. `visible` (0–1) shows only that top fraction of it, at the same scale. `crop`
 * { x, y, w, h } (fractions of the capture) shows only that region, enlarged to the window's width so the UI text stays
 * readable on small screens; rings and pins keep their positions on the capture. With a crop, `sizes` must describe the
 * enlarged image (window width ÷ w).
 */
function stage(id, { sizes, eager, priority, media, alt, overlays, visible, crop }) {
  const inner = html`<div class="shot-stage">${shot(id, { sizes, eager, priority, media, alt })}${overlays ?? ''}</div>`;
  const m = shotMeta(id);
  if (crop) {
    const { x = 0, y = 0, w = 1, h = 1 } = crop;
    const n = (v) => +v.toFixed(3);
    return html`<div class="shot-window" style="aspect-ratio:${Math.round(m.width * w)} / ${Math.round(m.height * h)}"><div class="shot-zoom" style="width:${n(100 / w)}%;transform:translate(${n(-x * 100)}%,${n(-y * 100)}%)">${inner}</div></div>`;
  }
  if (!visible || visible >= 1) return inner;
  return html`<div class="shot-window" style="aspect-ratio:${m.width} / ${Math.round(m.height * visible)}">${inner}</div>`;
}

/** A real capture in a browser frame (UiFrame). overlays: rings / pins positioned in percent of the capture. */
export function shotFrame({ id, sizes, host = 'app.s-protocol.com', dark = false, cls = '', bodyCls = '', overlays = null, eager = false, priority = false, media = null, alt = null, caption = null, visible = null, crop = null }) {
  const body = html`<div class="ui-frame__body shot-body${bodyCls ? ' ' + bodyCls : ''}">${stage(id, { sizes, eager, priority, media, alt, overlays, visible, crop })}</div>`;
  return html`<figure class="ui-frame ui-frame--shot${dark ? ' ui-frame--dark' : ''}${cls ? ' ' + cls : ''}">${bar(host)}${body}${caption ? html`<figcaption class="ui-caption">${caption}</figcaption>` : ''}</figure>`;
}

/** A focused real capture without browser chrome (UiCrop). */
export function shotCrop({ id, sizes, cls = '', overlays = null, eager = false, alt = null, dark = false, visible = null, crop = null }) {
  return html`<div class="ui-crop ui-crop--shot${dark ? ' ui-crop--dark' : ''}${cls ? ' ' + cls : ''}">${stage(id, { sizes, eager, alt, overlays, visible, crop })}</div>`;
}

// Art direction: `wide` from 768 px up, `narrow` below (each { id, sizes, overlays?, visible?, crop?, alt?, priority?,
// eager? }). Each picture carries its media query, so phones never download the wide one and desktops never the narrow.
const WIDE = '(min-width: 768px)';
const NARROW = '(max-width: 767.98px)';
const artPair = (wide, narrow) => html`<div class="art art--wide">${stage(wide.id, { ...wide, media: WIDE })}</div><div class="art art--narrow">${stage(narrow.id, { ...narrow, media: NARROW })}</div>`;

/** Art-directed capture in one browser frame. */
export function artFrame({ host = 'app.s-protocol.com', dark = false, cls = '', wide, narrow }) {
  return html`<figure class="ui-frame ui-frame--shot${dark ? ' ui-frame--dark' : ''}${cls ? ' ' + cls : ''}">${bar(host)}<div class="ui-frame__body shot-body">${artPair(wide, narrow)}</div></figure>`;
}

/** Art-directed focused capture without browser chrome. */
export function artCrop({ dark = false, cls = '', wide, narrow }) {
  return html`<div class="ui-crop ui-crop--shot${dark ? ' ui-crop--dark' : ''}${cls ? ' ' + cls : ''}">${artPair(wide, narrow)}</div>`;
}
