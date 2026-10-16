// Lucide icons (ISC, src/icons/LICENSE-lucide.txt). icon() emits a <use> reference and registers the symbol; the layout
// injects one hidden sprite per page containing only the icons that page used.
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, raw, attrs } from './html.mjs';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'icons');
const symbols = new Map();
for (const f of (await readdir(DIR)).filter((n) => n.endsWith('.svg'))) {
  const svg = await readFile(join(DIR, f), 'utf8');
  const inner = svg.replace(/<!--[\s\S]*?-->/g, '').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\s+/g, ' ').trim();
  symbols.set(f.slice(0, -4), inner);
}

let used = new Set();
export const resetIcons = () => { used = new Set(); };

/** An inline icon. Decorative by default (aria-hidden); pass `label` for a meaningful standalone icon. */
export function icon(name, { size = 20, cls = '', label = null } = {}) {
  if (!symbols.has(name)) throw new Error(`unknown icon "${name}" — copy it from lucide-static into src/icons/`);
  used.add(name);
  const a = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true', focusable: 'false' };
  return html`<svg class="icon${cls ? ' ' + cls : ''}" width="${size}" height="${size}"${attrs(a)}><use href="#i-${name}"/></svg>`;
}

/** The sprite with every icon used on the current page (call after the page body has been rendered). */
export function sprite() {
  if (!used.size) return raw('');
  const defs = [...used].sort().map((n) => `<symbol id="i-${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${symbols.get(n)}</symbol>`).join('');
  return raw(`<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${defs}</defs></svg>`);
}
