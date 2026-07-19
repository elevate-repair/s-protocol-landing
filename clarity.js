// Microsoft Clarity — shared loader for every public s-protocol.com page.
// One file, included by /, /s-invoice, /terms, and /privacy, so the snippet
// can never drift between pages.
//
// ── ACTIVATION ──────────────────────────────────────────────────────────────
// CLARITY_PROJECT_ID below must be the APPROVED Clarity project ID for
// s-protocol.com (Clarity dashboard → Settings → Overview → Project ID —
// the same place the existing Elevate public sites take theirs from).
// It is intentionally EMPTY in source control: until a real ID is pasted in,
// this file is a complete no-op — no Clarity script, cookies, or network
// requests. Never commit a guessed or placeholder ID.
(function () {
  'use strict';

  var CLARITY_PROJECT_ID = '';

  // Plausibility guard: only a Clarity-shaped ID (lowercase letters/digits)
  // activates the loader, so a blank or malformed value can never inject a
  // broken tag.
  if (!/^[a-z0-9]{6,20}$/.test(CLARITY_PROJECT_ID)) return;

  // Never inject twice, even if this file is accidentally included twice.
  if (window.clarity) return;

  // Official Microsoft Clarity bootstrap (async — does not block rendering).
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_PROJECT_ID);
})();
