// conversion-and-tracking.md §4 — one allowed-event list, a dataLayer push (harmless today, ready for GA4/GTM if the
// owner ever adds it) and Microsoft Clarity custom events + tags. No PII, never delays navigation, never throws.
const ALLOWED = new Set(['signup_click', 'hero_cta_click', 'section_cta_click', 'section_link_click', 'nav_open', 'nav_click',
  'chooser_select', 'app_open_click', 'app_store_click', 'flow_step_select', 'board_scroll', 'industry_card_click',
  'billing_toggle', 'faq_toggle', 'integration_card_click', 'subnav_click',
  'contact_submit', 'email_click', 'footer_link_click', 'legacy_anchor_redirect']);

export function track(name, props = {}) {
  if (!ALLOWED.has(name)) return;
  const page = document.body.dataset.page || location.pathname;
  const payload = { event: name, page, ...props };
  (window.dataLayer = window.dataLayer || []).push(payload);
  try {
    if (typeof window.clarity === 'function') {
      window.clarity('event', name);
      for (const [k, v] of Object.entries(props)) window.clarity('set', k, String(v));
    }
  } catch (_) { /* analytics must never break the page */ }
}

// One delegated listener: <a data-track="signup_click" data-product="s_protocol" data-location="hero">
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-track]');
  if (!el) return;
  const { track: name, ...rest } = el.dataset;
  track(name, rest);
}, { capture: true });
