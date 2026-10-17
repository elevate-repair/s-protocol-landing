#!/usr/bin/env node
/**
 * build-images.mjs — crops and encodes the 17 approved photos for the site.
 *
 *   photo-originals/<id>.jpg  →  site/images/photos/<name>/<page>-<section>-<d|m>-<width>.{avif,webp}   (width ladder)
 *                             →  site/images/photos/<name>/<page>-<section>-<d|m>-<width>.jpg           (one fallback)
 *                             →  site/images/images.generated.json   (srcsets, fallbacks, alt — read by src/lib/images.mjs)
 *
 * Every placement, crop and width ladder comes from scripts/images/photos.json. Crops are fractions of the full frame, so
 * a photo replaced by a larger copy of the same picture (for example the full-resolution original) needs no other change:
 * run this script again and then node scripts/build-site.mjs. The d crop serves viewports at or above the slot's
 * desktop_min_width, the m crop below it (src/lib/images.mjs writes the <picture> sources).
 *
 * Gates (exit 3): a missing or undecodable source, or a source whose aspect ratio is not the approved photo's.
 * Never upscaled: ladder rungs wider than the crop are dropped, and one top rung is added — twice the slot's widest
 * rendered size (max_css_width, for 2x screens) or the full crop width, whichever is smaller — when it is at least 10%
 * wider than the last rung kept. Resolution is reported for every crop, never hidden: the crop width against the
 * original requirement (target_min_width) and against twice the widest rendered size.
 * --require-originals also fails when a source is smaller than the verified original, --strict-resolution when a crop
 * is below its target.
 *
 * Usage (repository root, Node 18+; sharp lives in this folder's own package — Cloudflare Pages never installs it):
 *   npm --prefix scripts/images ci                       once
 *   node scripts/images/build-images.mjs                 all photos (replaces site/images/photos/)
 *   node scripts/images/build-images.mjs --only SOLO-02  one photo; keeps every other entry of the previous run
 *        [--contact-sheet [file]]                        review page of every crop (default .redesign-qa/image-contact-sheet.html)
 *        [--require-originals] [--strict-resolution]
 * then: node scripts/build-site.mjs
 */
import sharp from 'sharp';
import { readFile, writeFile, mkdir, rm, access } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'site', 'images');
const PUBLIC_PREFIX = '/images';
const args = parseArgs(process.argv.slice(2));
const ONLY = args.only ? new Set(String(args.only).split(',')) : null;
const SHEET = args['contact-sheet'] ? resolve(typeof args['contact-sheet'] === 'string' ? args['contact-sheet'] : join(ROOT, '.redesign-qa', 'image-contact-sheet.html')) : null;

// Same encoders as the approved package pipeline: AVIF q56 / WebP q80 / JPEG q82 (mozjpeg), sRGB, metadata stripped.
const ENC = {
  avif: (s) => s.avif({ quality: 56, effort: 4, chromaSubsampling: '4:2:0' }),
  webp: (s) => s.webp({ quality: 80, smartSubsample: true }),
  jpg: (s) => s.jpeg({ quality: 82, mozjpeg: true, progressive: true }),
};
const JPEG_MAX = 1280; // one JPEG fallback per crop: the widest rung up to this width

const manifest = JSON.parse(await readFile(join(ROOT, 'scripts', 'images', 'photos.json'), 'utf8'));
const generated = { generated: new Date().toISOString(), public_prefix: PUBLIC_PREFIX, photos: [], ui: [] };
const gates = [], report = [];

if (!ONLY) await rm(join(OUT, 'photos'), { recursive: true, force: true });
for (const photo of manifest.photos) {
  if (ONLY && !ONLY.has(photo.id)) continue;
  const file = join(ROOT, photo.source);
  if (!(await exists(file))) { gates.push(`${photo.id}: ${photo.source} is missing`); continue; }
  let meta;
  try { meta = await sharp(file).metadata(); await sharp(file).stats(); }
  catch (e) { gates.push(`${photo.id}: ${photo.source} does not decode (${e.message})`); continue; }
  const turned = [5, 6, 7, 8].includes(meta.orientation);
  const W = turned ? meta.height : meta.width, H = turned ? meta.width : meta.height;
  const scale = W / photo.original.width;
  if (Math.abs(W / H - photo.original.width / photo.original.height) > 0.005) {
    gates.push(`${photo.id}: ${photo.source} is ${W}×${H} — not the aspect ratio of the approved photo (${photo.original.width}×${photo.original.height})`);
    continue;
  }
  const kind = scale >= 0.999 ? 'full-resolution original' : `downsized copy (${Math.round(scale * 1000) / 10}% of the original ${photo.original.width}×${photo.original.height})`;
  if (args['require-originals'] && scale < 0.999) gates.push(`${photo.id}: ${photo.source} is a ${kind}`);
  console.log(`• ${photo.id} ${photo.source} ${W}×${H} — ${kind}`);
  const dir = join(OUT, 'photos', photo.name);
  await mkdir(dir, { recursive: true });

  for (const p of photo.placements) {
    const key = `${slug(p.page === '/' ? 'home' : p.page)}-${slug(p.section)}`;
    const dRect = rectFor(p.d.crop, W, H, parseAspect(p.d.aspect));
    for (const variant of ['d', 'm']) {
      const v = p[variant];
      if (!v) continue; // the slot is not rendered at this size (e.g. "hidden" below 1024 px)
      const aspect = parseAspect(v.aspect);
      const rect = variant === 'd' ? dRect : v.crop ? rectFor(v.crop, W, H, aspect) : p.d.crop.rect ? rectWithin(dRect, aspect) : rectFor(p.d.crop, W, H, aspect);
      const kept = [...new Set(v.widths.filter((w) => w <= rect.width))];
      const top = Math.min(rect.width, Math.max(v.widths.at(-1), v.max_css_width * 2));
      if (!kept.length || top >= kept.at(-1) * 1.1) kept.push(top);
      const jpegWidth = kept.filter((w) => w <= JPEG_MAX).at(-1) ?? kept[0];
      const base = sharp(file).rotate().extract(rect);
      const files = [];
      for (const w of kept) {
        for (const ext of ['avif', 'webp', 'jpg']) {
          if (ext === 'jpg' && w !== jpegWidth) continue;
          let s = base.clone().resize({ width: w, withoutEnlargement: true, kernel: 'lanczos3' });
          if (photo.grade) s = s.modulate(photo.grade);
          const name = `${key}-${variant}-${w}.${ext}`;
          const info = await ENC[ext](s.toColorspace('srgb')).toFile(join(dir, name));
          files.push({ file: rel(join(dir, name)), url: `${PUBLIC_PREFIX}/photos/${photo.name}/${name}`, width: info.width, height: info.height, bytes: info.size, format: ext });
        }
      }
      const srcset = Object.fromEntries(['avif', 'webp', 'jpg'].map((ext) => [ext, files.filter((f) => f.format === ext).map((f) => `${f.url} ${f.width}w`).join(', ')]));
      const fallback = files.find((f) => f.format === 'jpg');
      generated.photos.push({ id: photo.id, page: p.page, section: p.section, slot: p.slot, variant, desktop_min_width: p.desktop_min_width,
        reused_on: p.reused_on, aspect: v.aspect, crop: rect, alt: photo.decorative ? '' : photo.alt, decorative: photo.decorative, credit: photo.credit,
        fallback: { url: fallback.url, width: fallback.width, height: fallback.height }, largest: files.filter((f) => f.format === 'avif').at(-1), srcset, files });
      const need2x = v.max_css_width * 2;
      report.push({ id: photo.id, page: p.page, section: p.section, variant, crop: rect.width, target: v.target_min_width, need2x, top: kept.at(-1), source: kind });
      const notes = [rect.width < v.target_min_width ? `below the ${v.target_min_width} px requirement` : null, rect.width < need2x ? `below 2x of its ${v.max_css_width} px slot (${need2x} px)` : null].filter(Boolean);
      console.log(`  ${notes.length ? '!' : '✓'} ${key}-${variant} crop ${rect.width}×${rect.height} → ${kept.join('/')} px (jpg ${jpegWidth})${notes.length ? ' — ' + notes.join('; ') : ''}`);
    }
  }
}

await mkdir(OUT, { recursive: true });
const genFile = join(OUT, 'images.generated.json');
if (ONLY && (await exists(genFile))) {
  const prev = JSON.parse(await readFile(genFile, 'utf8'));
  generated.photos.unshift(...(prev.photos ?? []).filter((x) => !ONLY.has(x.id)));
}
const order = new Map(manifest.photos.map((p, i) => [p.id, i]));
generated.photos.sort((a, b) => order.get(a.id) - order.get(b.id));
await writeFile(genFile, JSON.stringify(generated, null, 2) + '\n');
if (SHEET) await writeContactSheet(SHEET);

const files = generated.photos.flatMap((p) => p.files);
console.log(`\n${new Set(generated.photos.map((p) => p.id)).size} photos · ${generated.photos.length} crops · ${files.length} files · ${(files.reduce((n, f) => n + f.bytes, 0) / 1e6).toFixed(1)} MB → ${rel(genFile)}${SHEET ? ` and ${rel(SHEET)}` : ''}`);
const below = report.filter((r) => r.crop < r.target), soft = report.filter((r) => r.crop < r.need2x);
console.log(`resolution: ${report.length - below.length}/${report.length} crops meet the original requirement · ${report.length - soft.length}/${report.length} are sharp at 2x of their widest rendered size`);
for (const r of below) console.log(`  below requirement: ${r.id} ${r.page} · ${r.section} (${r.variant}) crop ${r.crop} px < ${r.target} px`);
for (const r of soft) console.log(`  below 2x: ${r.id} ${r.page} · ${r.section} (${r.variant}) crop ${r.crop} px < ${r.need2x} px`);
if (args['strict-resolution'] && below.length) gates.push(`${below.length} crop(s) below the original requirement (--strict-resolution)`);
if (gates.length) { console.error(`\n✗ ${gates.length} gate failure(s):\n- ${gates.join('\n- ')}`); process.exit(3); }

// ---------- helpers ----------
// rect: [x0, y0, x1, y1] fractions of the frame; focal: the point kept in view, at the slot aspect (largest such crop).
function rectFor(crop, W, H, aspect) {
  if (crop.rect) {
    const [x0, y0, x1, y1] = crop.rect;
    const left = Math.round(x0 * W), top = Math.round(y0 * H);
    return { left, top, width: Math.min(Math.round(x1 * W), W) - left, height: Math.min(Math.round(y1 * H), H) - top };
  }
  const [fx, fy] = crop.focal ?? [0.5, 0.5];
  let w = W, h = Math.round(W / aspect);
  if (h > H) { h = H; w = Math.round(H * aspect); }
  return { left: clamp(Math.round(fx * W - w / 2), 0, W - w), top: clamp(Math.round(fy * H - h / 2), 0, H - h), width: w, height: h };
}
// the largest crop of the given aspect centred inside r (a mobile crop that must stay inside a logo-safe rectangle)
function rectWithin(r, aspect) {
  let w = r.width, h = Math.round(r.width / aspect);
  if (h > r.height) { h = r.height; w = Math.round(r.height * aspect); }
  return { left: r.left + Math.round((r.width - w) / 2), top: r.top + Math.round((r.height - h) / 2), width: w, height: h };
}
async function writeContactSheet(sheetFile) {
  await mkdir(dirname(sheetFile), { recursive: true });
  const src = (f) => relative(dirname(sheetFile), join(ROOT, f.file)).split('\\').join('/');
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const cards = generated.photos.map((p) => {
    const big = p.files.filter((f) => f.format === 'webp').at(-1);
    const r = report.find((x) => x.id === p.id && x.page === p.page && x.section === p.section && x.variant === p.variant);
    const flags = r ? [r.crop < r.target ? `below the ${r.target} px requirement` : '', r.crop < r.need2x ? `below 2x (${r.need2x} px)` : ''].filter(Boolean).join(' · ') : '';
    return `<figure><img loading="lazy" src="${esc(src(big))}" alt=""><figcaption><b>${esc(p.id)}</b> · ${esc(p.page)} · ${esc(p.section)} · <b>${p.variant === 'd' ? `desktop ≥ ${p.desktop_min_width}px` : `mobile < ${p.desktop_min_width}px`}</b> ${esc(p.aspect)}${p.reused_on.length ? ` · also on ${esc(p.reused_on.map((x) => x.page).join(', '))}` : ''}<br>crop ${p.crop.width}×${p.crop.height} at ${p.crop.left},${p.crop.top} · widths ${p.files.filter((f) => f.format === 'avif').map((f) => f.width).join('/')}${flags ? ` · <span class="warn">${esc(flags)}</span>` : ''}<br><i>${esc(p.alt || 'decorative (alt="")')}</i></figcaption></figure>`;
  }).join('\n');
  await writeFile(sheetFile, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Photo contact sheet — S Protocol site</title>
<style>body{font:14px/1.45 system-ui,sans-serif;margin:24px;background:#FAF9F6;color:#14161A}h1{font-size:20px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}figure{margin:0;background:#fff;border:1px solid #E7E6E1;border-radius:12px;overflow:hidden}
img{display:block;width:100%;height:260px;object-fit:contain;background:#F3F1EC}figcaption{padding:10px 12px;font-size:12.5px;color:#55635F}b{color:#14161A}.warn{color:#B42318}</style>
<h1>Photo contact sheet</h1><p>Generated ${esc(generated.generated)} by scripts/images/build-images.mjs — ${generated.photos.length} crops. Check: faces, hands and tools in frame; no third-party logos; a sensible crop at both aspects.</p>
<div class="grid">${cards}</div></html>`);
}
function parseAspect(s) { const m = /(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/.exec(String(s ?? '')); return m ? Number(m[1]) / Number(m[2]) : null; }
function slug(s) { return String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48); }
function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
function rel(p) { return relative(ROOT, p).split('\\').join('/'); }
function parseArgs(list) {
  const out = {};
  for (let i = 0; i < list.length; i++) {
    const k = list[i]; if (!k.startsWith('--')) continue;
    const next = list[i + 1];
    if (next && !next.startsWith('--')) { out[k.slice(2)] = next; i++; } else out[k.slice(2)] = true;
  }
  return out;
}
async function exists(p) { try { await access(p); return true; } catch { return false; } }
