#!/usr/bin/env node
/**
 * build-site.mjs — renders src/ into the committed, deployable site/ folder (D-26 Option A). Node built-ins only; there
 * is no package.json at the repository root, so the host never installs or builds anything: Cloudflare Pages serves
 * site/ as-is once the owner switches the build output directory from "/" to "site" at release.
 *
 *   node scripts/build-site.mjs            build site/ (site/images/ from build-images.mjs is kept)
 *   node scripts/build-site.mjs --check    exit 1 when the committed site/ differs from a fresh build (stale output)
 *   node scripts/build-site.mjs --strict   release build: fail when any approved photo is still pending
 *
 * Output: <route>.html files (Pages serves /s-protocol from s-protocol.html), 404.html (real HTTP 404), assets/
 * (css, js, fonts, brand, favicons), clarity.js (verbatim copy of the root loader), sitemap.xml, robots.txt,
 * site.webmanifest, favicon.ico. Nothing from docs/, assets-src/ or tooling is ever copied.
 */
import { mkdir, readFile, writeFile, readdir, rm, copyFile, stat, mkdtemp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site');
const args = new Set(process.argv.slice(2));
const CHECK = args.has('--check');
const STRICT = args.has('--strict');

const { renderPage } = await import('../src/components/layout.mjs');
const { raw } = await import('../src/lib/html.mjs');
const images = await import('../src/lib/images.mjs');
const { site } = await import('../src/lib/data.mjs');
images.setStrict(STRICT);

const OUT = await mkdtemp(join(tmpdir(), 'sp-site-'));

const write = async (rel, data) => { const p = join(OUT, rel); await mkdir(dirname(p), { recursive: true }); await writeFile(p, data); };
async function copyDir(from, to, filter = () => true) {
  for (const ent of await readdir(from, { withFileTypes: true })) {
    const src = join(from, ent.name);
    const dst = join(to, ent.name);
    if (ent.isDirectory()) await copyDir(src, dst, filter);
    else if (filter(ent.name)) { await mkdir(dirname(dst), { recursive: true }); await copyFile(src, dst); }
  }
}

// ------------------------------------------------------------------ head script (inline, before first paint)
// js class · reveal-ready only with IntersectionObserver and no reduced motion · 1.5 s safety net if main.js never runs
const HEAD = "(function(d,w){var h=d.documentElement;h.classList.add('js');try{if('IntersectionObserver'in w&&!w.matchMedia('(prefers-reduced-motion: reduce)').matches)h.classList.add('reveal-ready')}catch(e){}setTimeout(function(){if(!h.classList.contains('reveal-live'))h.classList.remove('reveal-ready')},1500)})(document,window);";
// Legacy homepage anchors (sitemap.md §4 + the five Stage 1 additions): fragments never reach the server, so `/` maps
// them before first paint. Same-page targets only rewrite the hash; the event is reported on the next page by main.js.
const LEGACY = {
  '#s-protocol': '/s-protocol', '#compare': '/compare', '#growth': '/compare#growth-path', '#integrations': '/integrations',
  '#contact': '/contact', '#s-invoice-story': '/s-invoice#how-it-works', '#s-invoice-pricing': '/pricing#s-invoice',
  '#product': '#choose', '#features': '/s-protocol', '#s-invoice-document': '/s-invoice#customer-view', '#origin': '#about', '#cta': '#start',
};
const legacyScript = `(function(l,w){var m=${JSON.stringify(LEGACY)};function go(){var t=m[l.hash];if(l.pathname!=='/'||!t)return;try{w.sessionStorage.setItem('sp_legacy',JSON.stringify({from:'/'+l.hash,to:t.charAt(0)==='#'?'/'+t:t}))}catch(e){}if(t.charAt(0)==='#'){w.history.replaceState(null,'','/'+t);w.addEventListener('DOMContentLoaded',function(){var el=document.getElementById(t.slice(1));if(el)el.scrollIntoView()})}else{l.replace(t)}}go();w.addEventListener('hashchange',go)})(location,window);`;

// ------------------------------------------------------------------ pages
const home = await import('../src/pages/home.mjs');
const sProtocol = await import('../src/pages/s-protocol.mjs');
const sInvoice = await import('../src/pages/s-invoice.mjs');
const notFound = await import('../src/pages/not-found.mjs');
const { legalPage } = await import('../src/pages/legal.mjs');
const terms = await legalPage('/terms');
const privacy = await legalPage('/privacy');

const PAGES = [
  { file: 'index.html', mod: home, sitemap: { priority: '1.0', changefreq: 'weekly' } },
  { file: 's-protocol.html', mod: sProtocol, sitemap: { priority: '0.9', changefreq: 'monthly' } },
  { file: 's-invoice.html', mod: sInvoice, sitemap: { priority: '0.9', changefreq: 'monthly' } },
  { file: 'terms.html', mod: terms, sitemap: { priority: '0.3', changefreq: 'yearly', lastmod: site.legal_lastmod } },
  { file: 'privacy.html', mod: privacy, sitemap: { priority: '0.3', changefreq: 'yearly', lastmod: site.legal_lastmod } },
  { file: '404.html', mod: notFound, sitemap: null },
];

const EXTRA_HEAD = '<link rel="modulepreload" href="/assets/js/track.js">';
for (const p of PAGES) {
  const meta = { ...p.mod.meta, headScript: HEAD + (p.mod.meta.legacyAnchors ? legacyScript : ''), headExtra: raw(EXTRA_HEAD) };
  const out = renderPage(meta, p.mod.render);
  await write(p.file, out);
}

// ------------------------------------------------------------------ assets
const CSS_ORDER = ['tokens.css', 'tokens-extended.css', 'fonts.css', 'base.css', 'layout.css', 'components.css', 'replicas.css', 'sections.css'];
const css = (await Promise.all(CSS_ORDER.map(async (f) => `/* ${f} */\n${await readFile(join(ROOT, 'src/styles', f), 'utf8')}`))).join('\n');
const minCss = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '\n').replace(/\n{2,}/g, '\n').trim() + '\n';
await write('assets/css/site.css', minCss);
// shipped JS keeps its code and drops full-line comments (the annotated source stays in src/scripts/)
for (const f of ['main.js', 'track.js']) await write(`assets/js/${f}`, (await readFile(join(ROOT, 'src/scripts', f), 'utf8')).replace(/^[ \t]*\/\/.*\n/gm, ''));
await copyDir(join(ROOT, 'src/fonts'), join(OUT, 'assets/fonts'));
await copyDir(join(ROOT, 'src/brand'), join(OUT, 'assets/brand'));
await copyDir(join(ROOT, 'src/favicons'), join(OUT, 'assets/favicons'), (n) => n !== 'site.webmanifest');
await copyFile(join(ROOT, 'src/favicons/white/favicon.ico'), join(OUT, 'favicon.ico'));
await copyFile(join(ROOT, 'clarity.js'), join(OUT, 'clarity.js'));

// ------------------------------------------------------------------ manifest, robots, sitemap
const manifest = JSON.parse(await readFile(join(ROOT, 'site.webmanifest'), 'utf8'));
manifest.theme_color = '#FAF9F6';
manifest.background_color = '#FAF9F6';
manifest.icons = manifest.icons.map((i) => ({ ...i, src: '/' + i.src.replace('assets/favicons/', 'assets/favicons/app/') }));
await write('site.webmanifest', JSON.stringify(manifest, null, 2) + '\n');
await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
const urls = PAGES.filter((p) => p.sitemap).map((p) => {
  const route = p.mod.meta.route;
  const loc = route === '/' ? `${site.origin}/` : `${site.origin}${route}`;
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${p.sitemap.lastmod ?? site.lastmod}</lastmod>\n    <changefreq>${p.sitemap.changefreq}</changefreq>\n    <priority>${p.sitemap.priority}</priority>\n  </url>`;
});
await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);

// ------------------------------------------------------------------ report, then publish (or check)
const pending = [...images.pendingPhotos];
const gz = (s) => (gzipSync(Buffer.from(s)).length / 1024).toFixed(1);
const js = (await readFile(join(OUT, 'assets/js/main.js'), 'utf8')) + (await readFile(join(OUT, 'assets/js/track.js'), 'utf8'));
console.log(`pages: ${PAGES.map((p) => p.file).join(', ')}`);
console.log(`css ${gz(minCss)} KB gzip (budget 20) · js ${gz(js)} KB gzip (budget 25)`);
if (pending.length) console.log(`photos pending (${pending.length}): ${pending.join('; ')}`);

async function listFiles(dir, base = dir, skip = (rel) => rel.startsWith(`images${sep}`)) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    const rel = relative(base, p);
    if (skip(rel) || rel === 'images') continue;
    if (ent.isDirectory()) out.push(...await listFiles(p, base, skip)); else out.push(rel);
  }
  return out.sort();
}
const hash = async (p) => createHash('sha256').update(await readFile(p)).digest('hex');

if (CHECK) {
  const fresh = await listFiles(OUT);
  const committed = await listFiles(SITE);
  const diffs = [];
  for (const f of new Set([...fresh, ...committed])) {
    if (!fresh.includes(f)) diffs.push(`stale file ${f}`);
    else if (!committed.includes(f)) diffs.push(`missing ${f}`);
    else if (await hash(join(OUT, f)) !== await hash(join(SITE, f))) diffs.push(`changed ${f}`);
  }
  await rm(OUT, { recursive: true, force: true });
  if (diffs.length) { console.error(`✗ site/ is out of date — run node scripts/build-site.mjs\n  ${diffs.join('\n  ')}`); process.exit(1); }
  console.log('✓ site/ matches a fresh build');
} else {
  // replace everything in site/ except images/ (written by docs/redesign/assets/build-images.mjs)
  await mkdir(SITE, { recursive: true });
  for (const ent of await readdir(SITE)) if (ent !== 'images') await rm(join(SITE, ent), { recursive: true, force: true });
  await copyDir(OUT, SITE);
  await rm(OUT, { recursive: true, force: true });
  const files = await listFiles(SITE);
  let bytes = 0;
  for (const f of files) bytes += (await stat(join(SITE, f))).size;
  console.log(`✓ site/ written — ${files.length} files, ${(bytes / 1024).toFixed(0)} KB (photos excluded)`);
}
if (STRICT && pending.length) process.exit(2);
