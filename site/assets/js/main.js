import { track } from './track.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const mq = (q) => window.matchMedia(q);
const reduced = mq('(prefers-reduced-motion: reduce)');
const store = {
  get(k) { try { return window.sessionStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { window.sessionStorage.setItem(k, v); } catch (_) { /* private mode */ } },
  take(k) { try { const v = window.sessionStorage.getItem(k); window.sessionStorage.removeItem(k); return v; } catch (_) { return null; } },
};
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function initHeader() {
  const header = $('.site-header');
  const sentinel = $('.header-sentinel');
  if (!header || !sentinel || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => header.classList.toggle('is-scrolled', !e.isIntersecting)).observe(sentinel);
}

function initDropdowns() {
  const items = $$('[data-dd]');
  if (!items.length) return;
  const hover = mq('(hover: hover) and (pointer: fine)');
  let open = null;
  let timer = 0;
  const parts = (dd) => ({ btn: $('.nav-dd__btn', dd), panel: $('.dd', dd) });
  function close(dd, { focus = false } = {}) {
    if (!dd) return;
    const { btn, panel } = parts(dd);
    btn.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    panel.classList.remove('is-open');
    if (open === dd) open = null;
    if (focus) btn.focus();
  }
  function show(dd) {
    if (open && open !== dd) close(open);
    const { btn, panel } = parts(dd);
    if (btn.getAttribute('aria-expanded') === 'true') return;
    btn.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    panel.classList.add('is-open');
    open = dd;
    track('nav_open', { menu: btn.dataset.navMenu });
  }
  for (const dd of items) {
    const { btn, panel } = parts(dd);
    btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? close(dd) : show(dd)));
    dd.addEventListener('pointerenter', (e) => {
      if (!hover.matches || e.pointerType !== 'mouse') return;
      clearTimeout(timer);
      timer = setTimeout(() => show(dd), 120);
    });
    dd.addEventListener('pointerleave', (e) => {
      if (!hover.matches || e.pointerType !== 'mouse') return;
      clearTimeout(timer);
      timer = setTimeout(() => { if (!dd.contains(document.activeElement)) close(dd); }, 200);
    });
    dd.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { e.preventDefault(); close(dd, { focus: true }); }
    });
    dd.addEventListener('focusout', (e) => { if (open === dd && !dd.contains(e.relatedTarget)) close(dd); });
    panel.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a && !a.dataset.track) track('nav_click', { menu: btn.dataset.navMenu, item: (a.textContent || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') });
    });
  }
  document.addEventListener('pointerdown', (e) => { if (open && !open.contains(e.target)) close(open); });
}

function initSheets() {
  let current = null;
  let opener = null;
  function openSheet(sheet, trigger) {
    if (current) closeSheet(current, { restore: false });
    current = sheet;
    opener = trigger;
    sheet.hidden = false;
    document.body.classList.add('is-locked');
    $$('[data-sheet-open]').forEach((b) => b.setAttribute('aria-expanded', String(b.dataset.sheetOpen === sheet.id)));
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('is-open')));
    const panel = $('.sheet__panel', sheet);
    (panel.querySelector(FOCUSABLE) || panel).focus({ preventScroll: true });
    track('nav_open', { menu: trigger?.dataset.navMenu || (sheet.id === 'mobile-menu' ? 'mobile' : 'start_free') });
  }
  function closeSheet(sheet, { restore = true } = {}) {
    sheet.classList.remove('is-open');
    $$(`[data-sheet-open="${sheet.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    const done = () => { if (!sheet.classList.contains('is-open')) sheet.hidden = true; };
    if (reduced.matches) done(); else setTimeout(done, 260);
    document.body.classList.remove('is-locked');
    if (current === sheet) current = null;
    if (restore && opener) opener.focus({ preventScroll: true });
  }
  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-sheet-open]');
    if (openBtn) { const s = document.getElementById(openBtn.dataset.sheetOpen); if (s) { e.preventDefault(); openSheet(s, openBtn); } return; }
    const closeBtn = e.target.closest('[data-sheet-close]');
    if (closeBtn && current) { e.preventDefault(); closeSheet(current); }
  });
  document.addEventListener('keydown', (e) => {
    if (!current) return;
    if (e.key === 'Escape') { e.preventDefault(); closeSheet(current); return; }
    if (e.key !== 'Tab') return;
    const f = $$(FOCUSABLE, $('.sheet__panel', current)).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  mq('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches && current) closeSheet(current, { restore: false }); });
  document.addEventListener('click', (e) => { const a = e.target.closest('.sheet a[href]'); if (a && current) closeSheet(current, { restore: false }); });
  $$('[data-expand]').forEach((btn) => btn.addEventListener('click', () => {
    const sub = document.getElementById(btn.getAttribute('aria-controls'));
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    if (sub) sub.hidden = isOpen;
  }));
}

const PERIOD_KEY = 'sp_billing_period';
function initPricing() {
  const blocks = $$('[data-pricing]');
  if (!blocks.length) return;
  const apply = (block, period, { announce = false } = {}) => {
    $$('[role="radio"]', block).forEach((r) => {
      const on = r.dataset.period === period;
      r.setAttribute('aria-checked', String(on));
      r.tabIndex = on ? 0 : -1;
    });
    $$('[data-period-show]', block).forEach((el) => { el.hidden = el.dataset.periodShow !== period; });
    $$('[data-track="signup_click"][data-plan="pro"]', block).forEach((a) => { a.dataset.period = period; });
    if (announce) track('billing_toggle', { period, location: block.dataset.location });
  };
  const saved = store.get(PERIOD_KEY);
  for (const block of blocks) {
    if (saved === 'yearly' || saved === 'monthly') apply(block, saved);
    const radios = $$('[role="radio"]', block);
    radios.forEach((r, i) => {
      r.addEventListener('click', () => { if (r.getAttribute('aria-checked') !== 'true') { apply(block, r.dataset.period, { announce: true }); store.set(PERIOD_KEY, r.dataset.period); } });
      r.addEventListener('keydown', (e) => {
        const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        const next = radios[(i + dir + radios.length) % radios.length];
        next.focus();
        next.click();
      });
    });
  }
}

function initFaq() {
  const supportsUntilFound = 'onbeforematch' in document.body;
  const openers = new Map(); // faq item id (the /faq hub's DOM ids) → open it
  for (const faq of $$('[data-faq]')) {
    const dflt = faq.dataset.defaultOpen;
    for (const btn of $$('.faq__q button', faq)) {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) continue;
      const set = (open, { announce = false } = {}) => {
        btn.setAttribute('aria-expanded', String(open));
        if (open) panel.removeAttribute('hidden');
        else if (supportsUntilFound) panel.setAttribute('hidden', 'until-found');
        else panel.hidden = true;
        if (announce) track('faq_toggle', { question: btn.dataset.faqId, state: open ? 'open' : 'close' });
      };
      set(btn.dataset.faqId === dflt);
      btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true', { announce: true }));
      panel.addEventListener('beforematch', () => set(true));
      const item = btn.closest('.faq__item');
      if (item && item.id) openers.set(item.id, () => set(true));
    }
  }
  if (!openers.size) return;
  const fromHash = () => {
    let id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
    const open = openers.get(id);
    if (!open) return;
    open();
    const el = document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start', behavior: 'auto' }));
  };
  fromHash();
  window.addEventListener('hashchange', fromHash);
}

function initFlow() {
  for (const flow of $$('[data-flow]')) {
    const tabs = $$('[role="tab"]', flow);
    const panel = $('[role="tabpanel"]', flow);
    const lead = $('.flow__pic--lead img', panel); // the new-lead record (step 1)
    const job = $('.flow__pic--job img', panel);   // the booked record (steps 2–5)
    const caption = $('[data-flow-caption]', flow);
    const select = (tab, method) => {
      tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      flow.dataset.step = tab.dataset.step;
      panel.setAttribute('aria-labelledby', tab.id);
      const first = tab.dataset.step === '1';
      for (const [img, on] of [[lead, first], [job, !first]]) {
        if (!img) continue;
        img.alt = on ? tab.dataset.alt : '';
        if (on) img.removeAttribute('aria-hidden'); else img.setAttribute('aria-hidden', 'true');
      }
      if (caption) caption.textContent = tab.dataset.caption;
      if (method) track('flow_step_select', { step: tab.dataset.key, method });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => { if (tab.getAttribute('aria-selected') !== 'true') select(tab, 'click'); });
      tab.addEventListener('keydown', (e) => {
        const map = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        const next = tabs[(map[e.key] + tabs.length) % tabs.length];
        next.focus();
        select(next, 'keyboard');
      });
    });
  }
}

function initSubnav() {
  if (!('IntersectionObserver' in window)) return;
  for (const nav of $$('[data-subnav]')) {
    const pills = $$('[data-subnav-link]', nav).length ? $$('[data-subnav-link]', nav) : $$('.subnav__pill', nav);
    const byId = new Map(pills.map((p) => [p.getAttribute('href').slice(1), p]));
    const visible = new Map();
    const activate = (id) => {
      pills.forEach((p) => { const on = p === byId.get(id); p.classList.toggle('is-active', on); if (on) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current'); });
      const pill = byId.get(id);
      const list = pill && pill.closest('ul');
      if (pill && list && list.scrollWidth > list.clientWidth) list.scrollTo({ left: pill.offsetLeft - 24, behavior: reduced.matches ? 'auto' : 'smooth' });
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null);
      const shown = [...visible.entries()].filter(([, top]) => top !== null).sort((a, b) => a[1] - b[1]);
      activate(shown.length ? shown[0][0] : null);
    }, { rootMargin: '-40% 0px -55% 0px' });
    for (const id of byId.keys()) { const s = document.getElementById(id); if (s) io.observe(s); }
  }
}

function initReveal() {
  const root = document.documentElement;
  if (!root.classList.contains('reveal-ready')) return;
  root.classList.add('reveal-live');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      const group = el.closest('[data-reveal-group]');
      if (group) {
        const peers = $$('[data-reveal]:not(.is-in)', group).filter((p) => p !== el);
        el.style.setProperty('--reveal-delay', `${Math.min(peers.indexOf(el) + 1, 3) * 60}ms`);
      }
      el.classList.add('is-in');
      io.unobserve(el);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
  $$('[data-reveal]').forEach((el) => io.observe(el));
  setTimeout(() => $$('[data-reveal]:not(.is-in)').forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in'); }), 1500);
}

function initDisclosures() {
  for (const btn of $$('[data-more-btn]')) {
    const list = btn.previousElementSibling;
    if (!list || !list.matches('[data-more]')) continue;
    btn.hidden = false;
    btn.addEventListener('click', () => {
      const open = !list.classList.contains('is-expanded');
      list.classList.toggle('is-expanded', open);
      btn.setAttribute('aria-expanded', String(open));
      const label = $('[data-more-label]', btn) || btn;
      label.textContent = open ? '− less' : '+ more';
    });
  }
  for (const col of $$('[data-disclosure]')) {
    const btn = $('.rec-ledger__toggle', col);
    if (!btn) continue;
    btn.hidden = false;
    btn.addEventListener('click', () => {
      const open = !col.classList.contains('is-open');
      col.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  }
}

function initLegacy() {
  const raw = store.take('sp_legacy');
  if (!raw) return;
  try { const { from, to } = JSON.parse(raw); track('legacy_anchor_redirect', { from, to }); } catch (_) { /* ignore */ }
}

for (const fn of [initHeader, initDropdowns, initSheets, initPricing, initFaq, initFlow, initSubnav, initReveal, initDisclosures, initLegacy]) {
  try { fn(); } catch (err) { if (window.console) console.error(err); }
}
