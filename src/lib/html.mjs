// Tiny HTML templating: html`` escapes every interpolated value unless it is already safe (another html`` result or raw()).
const SAFE = Symbol('safe-html');

export const raw = (s) => ({ [SAFE]: true, value: String(s ?? '') });
export const isSafe = (v) => Boolean(v && v[SAFE]);
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function value(v) {
  if (v === null || v === undefined || v === false) return '';
  if (Array.isArray(v)) return v.map(value).join('');
  if (isSafe(v)) return v.value;
  return esc(v);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += value(values[i]) + strings[i + 1];
  return raw(out);
}

/** Renders an attribute map: true → bare attribute, false/null/undefined → omitted, everything else escaped. */
export function attrs(map = {}) {
  let out = '';
  for (const [k, v] of Object.entries(map)) {
    if (v === null || v === undefined || v === false) continue;
    out += v === true ? ` ${k}` : ` ${k}="${esc(v)}"`;
  }
  return raw(out);
}

/** data-track + data-<prop> attributes for the delegated tracking listener (conversion-and-tracking.md §4). */
export function trackAttrs(track, props = {}) {
  if (!track) return raw('');
  const map = { 'data-track': track };
  for (const [k, v] of Object.entries(props)) map[`data-${k}`] = v;
  return attrs(map);
}

export const join = (parts, sep = '') => raw(parts.filter(Boolean).map(value).join(sep));
