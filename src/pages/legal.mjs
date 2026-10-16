// `/terms` and `/privacy` — remaining-pages-spec.md K. The legal text is never retyped: the build extracts the title,
// the "Last updated" line, the intro, the table of contents and the body verbatim from the untouched legacy pages
// (terms/index.html, privacy/index.html at the repository root) and only restyles them. qa-regression.mjs compares the
// text of .legal-body (and the legal-header baseline the other three) against the Stage 1 baseline.
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, raw } from '../lib/html.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** The outer HTML of the first element whose class list contains `cls`, with nested same-name tags balanced. */
function extract(src, cls, file) {
  const open = new RegExp(`<([a-z][a-z0-9]*)\\b[^>]*\\bclass="(?:[^"]*\\s)?${cls}(?:\\s[^"]*)?"[^>]*>`, 'i');
  const m = open.exec(src);
  if (!m) throw new Error(`${file}: no element with class "${cls}"`);
  const tag = m[1].toLowerCase();
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = m.index;
  let depth = 0;
  for (let t; (t = re.exec(src));) {
    depth += t[1] ? -1 : 1;
    if (depth === 0) return src.slice(m.index, re.lastIndex);
  }
  throw new Error(`${file}: unbalanced <${tag}> for "${cls}"`);
}
const metaContent = (src, name) => (new RegExp(`<meta name="${name}" content="([^"]*)"`).exec(src) ?? [])[1] ?? null;
const ldBlocks = (src) => [...src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

export async function legalPage(route) {
  const file = `${route.slice(1)}/index.html`;
  const src = await readFile(join(ROOT, file), 'utf8');
  const parts = Object.fromEntries(['legal-title', 'legal-meta', 'legal-intro', 'legal-toc', 'legal-body'].map((c) => [c, extract(src, c, file)]));
  const title = decode((/<title>([^<]*)<\/title>/.exec(src) ?? [])[1] ?? '');
  const meta = {
    route, page: route.slice(1), title, description: decode(metaContent(src, 'description') ?? ''),
    jsonld: ldBlocks(src),
  };
  const render = () => html`<div class="legal-page" id="top">
  <div class="container legal-layout">
    <aside class="legal-layout__toc">${raw(parts['legal-toc'])}</aside>
    <article class="legal">
      ${raw(parts['legal-title'])}
      ${raw(parts['legal-meta'])}
      ${raw(parts['legal-intro'])}
      ${raw(parts['legal-body'])}
      <p class="legal-backtop-wrap"><a href="#top" class="legal-backtop">↑ Back to top</a></p>
    </article>
  </div>
</div>`;
  return { meta, render };
}
