// Real product captures (src/data/ui-shots.json, written by docs/redesign/ops/build-ui-shots.mjs from screens of the
// actual S Protocol web app with the fictional demo dataset). `shot()` renders the <picture>; `ring()` and `pin()` place a
// highlight ring or a numbered marker over a region measured on the real screen (percent of the capture).
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, attrs } from './html.mjs';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'ui-shots.json');
let shots = {};
try { shots = JSON.parse(await readFile(DATA, 'utf8')).shots ?? {}; } catch { /* no captures yet — pages fall back to replicas */ }

export const hasShot = (id) => Boolean(shots[id]);
export const shotMeta = (id) => shots[id] ?? null;
export const region = (id, name) => shots[id]?.regions?.[name] ?? null;

// A 1 × 1 transparent GIF: the <img> fallback for a capture that only exists at some widths (see `media`).
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * <picture> for a capture.
 *   sizes — the rendered-width rule; cls — extra classes on <picture>; alt — overrides the stored alt text;
 *   eager — no lazy loading; priority — eager + fetchpriority=high (the page's LCP image);
 *   media — only load it where this media query matches (e.g. a desktop-only crop): the sources carry the query and the
 *           <img> falls back to a blank pixel, so narrower screens never download it.
 */
export function shot(id, { sizes, cls = '', eager = false, priority = false, alt = null, decorative = false, media = null, imgAttrs = {} } = {}) {
  const s = shots[id];
  if (!s) throw new Error(`ui-shots.json has no capture "${id}"`);
  const m = media ? { media } : {};
  const lazy = eager || priority ? null : 'lazy';
  return html`<picture class="shot${cls ? ' ' + cls : ''}" data-shot="${id}"><source type="image/avif"${attrs(m)} srcset="${s.srcset.avif}" sizes="${sizes}"><source type="image/webp"${attrs(m)} srcset="${s.srcset.webp}" sizes="${sizes}"><img src="${media ? BLANK : s.fallback}" width="${s.width}" height="${s.height}" alt="${decorative ? '' : (alt ?? s.alt)}"${attrs({ sizes: media ? null : sizes, decoding: 'async', loading: lazy, fetchpriority: priority ? 'high' : null, ...imgAttrs })}></picture>`;
}

const box = (r, pad) => `left:${(r.x - pad).toFixed(2)}%;top:${(r.y - pad).toFixed(2)}%;width:${(r.w + 2 * pad).toFixed(2)}%;height:${(r.h + 2 * pad).toFixed(2)}%`;

/** A 2 px primary ring around a measured region. `step` ties it to one step of the homepage §5 explorer. */
export function ring(id, name, { step = null, pad = 0.8, override = null } = {}) {
  const r = override ?? region(id, name);
  if (!r) return html``;
  return html`<span class="shot-ring" aria-hidden="true"${attrs({ 'data-ring': step })} style="${box(r, pad)}"></span>`;
}

/** A numbered marker pinned beside a measured region (homepage §6 board markers). at: 'left' | 'top-left' | 'right'. */
export function pin(id, name, n, { dx = null, dy = 0, at = 'left' } = {}) {
  const r = region(id, name);
  if (!r) return html``;
  const y = at === 'top-left' ? r.y + dy : r.y + r.h / 2 + dy;
  const x = at === 'right' ? r.x + r.w + (dx ?? 0.8) : r.x + (dx ?? -1.4);
  return html`<span class="marker marker--pin${at === 'right' ? ' marker--pin-right' : ''}" aria-hidden="true" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%">${n}</span>`;
}

/** The center of a region as CSS percentages (the mobile zoom target of the §5 explorer). */
export function center(id, name) {
  const r = region(id, name);
  return r ? { x: `${(r.x + r.w / 2).toFixed(2)}%`, y: `${(r.y + r.h / 2).toFixed(2)}%` } : { x: '50%', y: '50%' };
}
