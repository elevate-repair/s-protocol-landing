import { track } from './track.js';

const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyOh8-2IwhL6yK6YWjJMENjv0dJugE3G7LcBg2nM22YPK7P8iXHbPQ9wuABSHij4vtp4g/exec';
const TIMEOUT_MS = 20000;
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const MESSAGES = { network: 'Your message wasn’t sent — the connection failed.', server: 'Your message wasn’t sent — something went wrong on our side.' };

const root = document.querySelector('[data-contact]');
const form = root ? root.querySelector('#contactForm') : null;
if (form) init(root, form);

function init(root, form) {
  const submit = form.querySelector('[data-contact-submit]');
  const idle = submit.querySelector('[data-label-idle]');
  const busy = submit.querySelector('[data-label-busy]');
  const status = form.querySelector('[data-contact-status]');
  const alertBox = form.querySelector('[data-contact-error]');
  const alertText = alertBox.querySelector('[data-contact-error-text]');
  const success = root.querySelector('[data-contact-success]');
  const val = (name) => ((form.elements[name] && form.elements[name].value) || '').trim();
  const RULES = [
    { name: 'name', check: (v) => (v ? '' : 'Enter your name.') },
    { name: 'email', check: (v) => (!v ? 'Enter your email address.' : EMAIL.test(v) ? '' : 'Enter an email address like name@business.com.') },
  ];
  let attempted = false;
  let sending = false;

  function showError(el, msg) {
    const err = document.getElementById(`${el.id}-error`);
    if (!err) return;
    err.querySelector('span').textContent = msg;
    err.hidden = !msg;
    if (msg) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', err.id); }
    else { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); }
  }
  function validate() {
    let first = null;
    for (const r of RULES) {
      const el = form.elements[r.name];
      const msg = r.check(val(r.name));
      showError(el, msg);
      if (msg && !first) first = el;
    }
    return first;
  }
  for (const r of RULES) {
    const el = form.elements[r.name];
    el.addEventListener('input', () => { if (attempted && el.getAttribute('aria-invalid') === 'true') showError(el, r.check(val(r.name))); });
    el.addEventListener('blur', () => { if (attempted) showError(el, r.check(val(r.name))); });
  }

  function setBusy(on) {
    sending = on;
    submit.setAttribute('aria-disabled', String(on));
    idle.hidden = on;
    busy.hidden = !on;
    status.textContent = on ? 'Sending your message…' : '';
  }
  function succeed() {
    track('contact_submit', { status: 'success' });
    form.hidden = true;
    success.hidden = false;
    const h = success.querySelector('h2');
    if (h) h.focus();
  }
  function fail(kind) {
    track('contact_submit', { status: 'error' });
    alertText.textContent = '';
    alertBox.hidden = false;
    setTimeout(() => { alertText.textContent = MESSAGES[kind]; }, 50);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    attempted = true;
    const invalid = validate();
    if (invalid) { invalid.focus(); return; }
    alertBox.hidden = true;
    setBusy(true);
    const params = new URLSearchParams();
    params.append('name', val('name'));
    params.append('email', val('email'));
    params.append('company', val('company'));
    params.append('phone', val('phone'));
    params.append('message', val('message'));
    params.append('source', 's-protocol.com');
    params.append('page', window.location.href);
    const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), TIMEOUT_MS) : 0;
    let outcome = 'server';
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: params, signal: ctrl ? ctrl.signal : undefined });
      const json = await res.json().catch(() => null);
      outcome = json && json.ok ? 'ok' : 'server';
    } catch (_) {
      outcome = 'network';
    }
    clearTimeout(timer);
    setBusy(false);
    if (outcome === 'ok') succeed(); else fail(outcome);
  });

  const retry = alertBox.querySelector('[data-contact-retry]');
  if (retry) retry.addEventListener('click', () => { if (typeof form.requestSubmit === 'function') form.requestSubmit(); else submit.click(); });
}
