// Product-UI frames and Apple assets. "Photos sit, product floats": only UI frames carry the elevation shadow.
// Real captures come from images.generated.json → ui; until they exist, pages pass a faithful HTML replica of a screen
// that exists in the app (product-ui-capture-plan.md §7). A replica's root is role="img" with an aria-label, its inner
// markup is aria-hidden, and it carries data-qa-ignore so its sample amounts are never read as marketing claims.
import { html, attrs, trackAttrs } from '../lib/html.mjs';

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
