#!/usr/bin/env node
/**
 * build-preview.mjs — a REVIEW COPY of the built site, for a separate, Access-protected Cloudflare Pages project
 * (Direct Upload). It never touches site/ (the production output). It copies site/ to preview/ and changes only what
 * a review copy must not have, then checks the result:
 *   • no contact endpoint — the form still validates, then says "Preview only — this message was not sent";
 *   • no analytics — clarity.js is a no-op, so reviews never reach the production Clarity project;
 *   • never indexed — noindex on every page and every host, robots.txt "Disallow: /", no sitemap;
 *   • a preview bar on every page: what this is, and that striped "Photo placeholder" panels wait for the 17 photos.
 *
 *   node scripts/build-site.mjs && node scripts/build-preview.mjs      → preview/ (gitignored)
 * Upload the preview/ folder (or a zip of its contents) in Cloudflare: Workers & Pages → Create → Pages → Upload assets.
 * Node 18+ built-ins only.
 */
import { cp, readFile, writeFile, readdir, rm, stat } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site');
const OUT = join(ROOT, 'preview');

const BAR = `<div role="note" aria-label="Preview notice" style="position:relative;z-index:1000;padding:9px 16px;background:#0B1220;color:#F4F6FA;font:500 13px/1.45 Inter,system-ui,sans-serif;text-align:center">` +
  `<strong style="letter-spacing:.06em">PREVIEW</strong> · The redesigned S Protocol site, for review only — not live, not indexed. ` +
  `Striped panels marked “Photo placeholder” are waiting for the 17 approved original photos. The contact form here sends nothing.</div>`;

const files = async (dir) => (await Promise.all((await readdir(dir, { withFileTypes: true })).map((e) => (e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)])))).flat();

await stat(join(SITE, 'index.html')); // run build-site.mjs first
const endpoint = (await readFile(join(SITE, 'assets/js/contact.js'), 'utf8')).match(/const ENDPOINT = '([^']*)';/)?.[1];
if (!endpoint || !endpoint.startsWith('https://')) throw new Error('site/assets/js/contact.js has no built endpoint — run node scripts/build-site.mjs first');

await rm(OUT, { recursive: true, force: true });
await cp(SITE, OUT, { recursive: true });

let pages = 0;
for (const f of await files(OUT)) {
  if (!f.endsWith('.html')) continue;
  let h = await readFile(f, 'utf8');
  h = h.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
  h = h.replace(/(<body[^>]*>)/, `$1${BAR}`);
  if (!h.includes('content="noindex, nofollow"') || !h.includes('aria-label="Preview notice"')) throw new Error(`could not mark ${relative(OUT, f)} as a preview`);
  await writeFile(f, h);
  pages++;
}
const contact = join(OUT, 'assets/js/contact.js');
await writeFile(contact, (await readFile(contact, 'utf8')).replace(/const ENDPOINT = '[^']*';/, "const ENDPOINT = '';"));
await writeFile(join(OUT, 'clarity.js'), '/* Analytics are off in the review preview. */\n');
await writeFile(join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
await rm(join(OUT, 'sitemap.xml'), { force: true });
await writeFile(join(OUT, '_headers'), `/*\n  X-Robots-Tag: noindex, nofollow\n${await readFile(join(OUT, '_headers'), 'utf8')}`);

// nothing in the copy may still carry the contact endpoint
for (const f of await files(OUT)) {
  if (/\.(avif|webp|png|jpg|ico|woff2)$/.test(f)) continue;
  if ((await readFile(f, 'utf8')).includes(endpoint)) throw new Error(`the contact endpoint is still in ${relative(OUT, f)}`);
}
console.log(`✓ preview/ written — ${pages} pages, ${(await files(OUT)).length} files: preview bar, noindex, no contact endpoint, no analytics`);
