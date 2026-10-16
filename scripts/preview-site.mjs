#!/usr/bin/env node
/**
 * preview-site.mjs — serve the built site/ folder locally the way Cloudflare Pages will (Node built-ins only).
 *
 *   node scripts/preview-site.mjs            → http://localhost:4173
 *   node scripts/preview-site.mjs --port 8080
 *
 * Routing: /pricing → pricing.html · /pricing.html and /pricing/ → 308 /pricing · unknown paths → 404.html with HTTP 404.
 * It only reads files inside site/ and listens on 127.0.0.1, so nothing is exposed beyond this computer.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const i = process.argv.indexOf('--port');
const PORT = i > 0 ? Number(process.argv[i + 1]) : 4173;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

const isFile = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };
const inside = (p) => normalize(p).startsWith(ROOT + sep);

async function send(res, status, file) {
  res.writeHead(status, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
  res.end(await readFile(file));
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith('.html') || (path.length > 1 && path.endsWith('/'))) {
      const clean = path.replace(/(\/index)?\.html$/, '').replace(/\/+$/, '') || '/';
      res.writeHead(308, { Location: clean + url.search }); return res.end();
    }
    const candidates = path === '/' ? ['index.html'] : [path.slice(1), `${path.slice(1)}.html`, `${path.slice(1)}/index.html`];
    for (const c of candidates) {
      const file = join(ROOT, c);
      if (inside(file) && !c.startsWith('_') && await isFile(file)) return await send(res, 200, file);
    }
    return await send(res, 404, join(ROOT, '404.html'));
  } catch {
    res.writeHead(500); res.end('preview server error');
  }
}).listen(PORT, '127.0.0.1', () => console.log(`S Protocol site preview → http://localhost:${PORT}  (Ctrl+C to stop)`));
