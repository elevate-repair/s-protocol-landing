// Photos: art-directed <picture> elements from site/images/images.generated.json, which docs/redesign/assets/
// build-images.mjs writes from the verified full-resolution originals. A slot whose original has not been processed yet
// renders an honest "original pending" panel in preview builds and fails a --strict (release) build: there is no other
// image source, and previews or thumbnails are never used.
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, attrs, raw } from './html.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const slots = JSON.parse(await readFile(join(ROOT, 'src', 'data', 'photo-slots.json'), 'utf8'));
let generated = { photos: [], ui: [] };
try { generated = JSON.parse(await readFile(join(ROOT, 'site', 'images', 'images.generated.json'), 'utf8')); } catch { /* no photos processed yet */ }

export const pendingPhotos = new Set();
let strict = false;
export const setStrict = (v) => { strict = v; };

function slotOf(id, page, section) {
  const s = slots.slots.find((x) => x.id === id && x.page === page && x.section === section);
  if (!s) throw new Error(`photo-slots.json has no slot ${id} · ${page} · ${section} — only approved Version 1 slots may be used`);
  return s;
}
const variants = (id, page, section) => {
  const list = generated.photos.filter((p) => p.id === id && p.page === page && p.section === section);
  return { d: list.find((p) => p.variant === 'd'), m: list.find((p) => p.variant === 'm') };
};

/**
 * <picture> for an approved photo slot.
 *   id/page/section — the slot (image-manifest.json placements); sizes — the page spec's sizes attribute;
 *   priority — LCP image (no lazy loading, fetchpriority=high); cls — classes for the frame (aspect ratios live in CSS).
 */
export function photo({ id, page, section, sizes, cls = '', priority = false, eager = false, decorative = null }) {
  const slot = slotOf(id, page, section);
  const meta = slots.photos[id];
  const isDecorative = decorative ?? meta.decorative;
  const alt = isDecorative ? '' : meta.alt;
  const { d, m } = variants(id, page, section);
  if (!d && !m) {
    pendingPhotos.add(`${id} (${page} · ${section})`);
    if (strict) throw new Error(`photo ${id} for ${page} · ${section} has not been processed — download the original and run build-images.mjs`);
    const a11y = isDecorative ? html` aria-hidden="true"` : html` role="img" aria-label="${alt}"`;
    return html`<div class="photo photo--pending ${cls}"${a11y} data-photo="${id}"><span class="photo__pending" aria-hidden="true"><span class="photo__pending-id">Photo placeholder · ${id}</span><span>Approved photo — original not processed yet</span></span></div>`;
  }
  const img = (m ?? d).fallback;
  const lazy = priority || eager ? {} : { loading: 'lazy' };
  const sources = [];
  if (d && m) {
    const media = `(min-width: ${slot.desktop_min_width}px)`;
    sources.push(html`<source type="image/avif" media="${media}" srcset="${d.srcset.avif}" sizes="${sizes}">`, html`<source type="image/webp" media="${media}" srcset="${d.srcset.webp}" sizes="${sizes}">`);
  }
  const base = m ?? d;
  sources.push(html`<source type="image/avif" srcset="${base.srcset.avif}" sizes="${sizes}">`, html`<source type="image/webp" srcset="${base.srcset.webp}" sizes="${sizes}">`);
  return html`<picture class="photo ${cls}" data-photo="${id}">${sources}<img src="${img.url}" width="${img.width}" height="${img.height}" alt="${alt}" sizes="${sizes}" decoding="async"${attrs({ ...lazy, fetchpriority: priority ? 'high' : null })}></picture>`;
}

/** <link rel=preload> for the desktop crop of an LCP photo (same media as its <source>), or nothing while it is pending. */
export function preloadPhoto({ id, page, section, sizes }) {
  const slot = slotOf(id, page, section);
  const { d } = variants(id, page, section);
  if (!d) return raw('');
  return html`<link rel="preload" as="image" type="image/avif" media="(min-width: ${slot.desktop_min_width}px)" imagesrcset="${d.srcset.avif}" imagesizes="${sizes}" fetchpriority="high">`;
}

export const photoMeta = (id) => slots.photos[id];
export const photosProcessed = () => generated.photos.length > 0;
