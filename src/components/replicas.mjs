// Product-UI replicas for the screens that cannot be captured from the offline copy of the S Protocol web app
// (D-30 fallback, product-ui-capture-plan.md §7): the S Protocol estimate and the customer-facing invoice, the S Invoice
// customer-facing invoice and the S Invoice web home. Each is a faithful HTML version of a screen that exists in the
// apps, with the fictional demo dataset (§3) and only labels the apps really use (invoice statuses Draft / Sent /
// Partial / Overdue / Paid; the S Invoice navigation). The S Protocol schedule, dispatch, job and client screens are
// real captures (src/lib/ui-shots.mjs) and are not replicated here.
import { html } from '../lib/html.mjs';

const chip = (label, tone) => html`<span class="rp-chip rp-chip--${tone}">${label}</span>`;

// ------------------------------------------------------------------ S Protocol estimate and customer-facing invoice
// Estimates in S Protocol belong to the customer (they are not created inside a job) and convert to an invoice.
const ITEMS_4417 = [['Heating element', '1', '$96.00'], ['Thermal fuse', '1', '$18.00'], ['Labor (1 h)', '1', '$72.00']];
export function estimateReplica() {
  return html`<div class="rp-sheet"><div class="rp-sheet__head"><div><span class="rp-label">Estimate · R. Alvarez</span><strong>Dryer not heating</strong></div>${chip('Sent', 'sent')}</div>
  <div class="rp-lines"><div class="rp-lines__head"><span>Item</span><span>Qty</span><span>Amount</span></div>${ITEMS_4417.map(([n, q, a]) => html`<div class="rp-lines__row"><span>${n}</span><span>${q}</span><span class="rp-mono">${a}</span></div>`)}</div>
  <div class="rp-total"><span>Total</span><strong class="rp-mono">$186.00</strong></div></div>`;
}
export const ESTIMATE_LABEL = 'Sample estimate for R. Alvarez, “Dryer not heating”, with three line items and the total';

export function jobInvoiceReplica() {
  return html`<div class="rp-doc rp-doc--compact"><div class="rp-doc__top"><div class="rp-doc__brand"><span class="rp-doc__logo">R</span><strong>Ruiz Appliance Repair</strong></div><span class="rp-mono rp-dim">Invoice #2184</span></div>
  <div class="rp-doc__title"><strong>Dryer not heating</strong><span>Bill to R. Alvarez · 128 Elmwood Ave</span></div>
  <div class="rp-lines rp-lines--doc">${ITEMS_4417.map(([n, , a]) => html`<div class="rp-lines__row"><span>${n}</span><span></span><span class="rp-mono">${a}</span></div>`)}</div>
  <div class="rp-doc__balance"><span>BALANCE DUE</span><strong class="rp-mono">$186.00</strong></div><span class="rp-pay">Pay $186.00</span></div>`;
}
export const JOB_INVOICE_LABEL = 'Sample customer-facing invoice #2184 for “Dryer not heating” with the line items, the balance due and a Pay button';

// ------------------------------------------------------------------ S Invoice customer-facing invoice #1042 (Paid)
const ITEMS_1042 = [
  ['Water inlet valve replacement', 'OEM part, fitted and pressure-tested', '1', '$168.00', '$168.00'],
  ['Labor', 'Diagnostic and repair, 2 hours on site', '2', '$135.00', '$270.00'],
  ['Filter cartridge', '', '1', '$14.00', '$14.00'],
];
/** variant: full | top (header → balance) | mobile (header, bill-to, first two lines, status). */
export function invoiceDocReplica({ variant = 'full' } = {}) {
  const items = variant === 'mobile' ? ITEMS_1042.slice(0, 2) : ITEMS_1042;
  return html`<div class="rp-doc rp-doc--${variant}">
  <div class="rp-doc__top"><div class="rp-doc__brand"><span class="rp-doc__logo">R</span><strong>Ruiz Appliance Repair</strong></div><span class="rp-doc__from">Buffalo, NY<br>(716) 555-0142<br>office@example.com</span></div>
  <div class="rp-doc__title"><strong>Ice maker repair</strong><span>Invoice #1042</span></div>
  <div class="rp-doc__meta"><div><span class="rp-label">Bill to</span><strong>Northside Deli</strong><span>440 Main St, Buffalo, NY</span></div><div class="rp-doc__dates"><span><span class="rp-label">Date</span>Aug 12, 2026</span><span><span class="rp-label">Status</span><span class="rp-doc__paid">PAID</span></span></div></div>
  <div class="rp-lines rp-lines--doc"><div class="rp-lines__head"><span>Description</span><span>Qty</span><span>Amount</span></div>${items.map(([n, d, q, , a]) => html`<div class="rp-lines__row"><span><strong>${n}</strong>${d ? html`<em>${d}</em>` : ''}</span><span>${q}</span><span class="rp-mono">${a}</span></div>`)}</div>
  ${variant === 'mobile' ? '' : html`<div class="rp-doc__totals"><div><span>Subtotal</span><span class="rp-mono">$452.00</span></div><div><span>Tax (7.5%)</span><span class="rp-mono">$33.90</span></div><div><span>Paid Aug 12</span><span class="rp-mono">−$485.90</span></div></div><div class="rp-doc__balance"><span>BALANCE DUE</span><strong class="rp-mono">$0.00</strong></div>`}
  ${variant === 'full' ? html`<p class="rp-doc__foot">Paid by card on Aug 12, 2026. Thank you — parts carry a 90-day warranty.</p>` : ''}
</div>`;
}
export const DOC_LABEL = 'Sample customer-facing invoice titled “Ice maker repair” from a sample repair business, marked Paid, with line items, tax and the balance due';

// ------------------------------------------------------------------ S Invoice web home (Rosa's workspace)
const RECENT = [
  ['#1042', 'Northside Deli', 'Aug 12, 2026', '$485.90', ['Paid', 'paid']],
  ['#1041', 'R. Alvarez', 'Aug 12, 2026', '$186.00', ['Sent', 'sent']],
  ['#1040', 'T. Okafor', 'Aug 10, 2026', '$640.00', ['Partial', 'partial']],
  ['#1039', 'J. Whitfield', 'Aug 2, 2026', '$320.00', ['Overdue', 'overdue']],
  ['#1038', 'P. Nowak', 'Jul 30, 2026', '$140.00', ['Paid', 'paid']],
];
const SI_RAIL = ['Home', 'Invoices', 'Estimates', 'Customers', 'Payments', 'Reports', 'Settings', 'Plan'];
export function sInvoiceHomeReplica({ withSide = true } = {}) {
  return html`<div class="rp-si">
  <div class="rp-si__rail"><div class="rp-rail__brand"><img src="/assets/brand/s-invoice-icon.webp" alt="" width="24" height="24" loading="lazy" decoding="async"><span>S Invoice</span></div>${SI_RAIL.map((r) => html`<span class="rp-rail__item${r === 'Home' ? ' is-active' : ''}">${r}</span>`)}</div>
  <div class="rp-si__main">
    <div class="rp-si__greet"><div><strong>Good morning, Rosa</strong><span class="rp-dim">Friday, August 14</span></div><span class="rp-btn rp-btn--primary">New invoice</span></div>
    <div class="rp-si__stats"><div><span>Total invoiced</span><strong>$18,940.00</strong></div><div><span>Collected</span><strong class="rp-ok">$17,134.00</strong></div><div><span>Outstanding</span><strong class="rp-warn">$1,486.00</strong></div><div><span>Overdue</span><strong class="rp-bad">$320.00</strong></div></div>
    <div class="rp-si__cols">
      <div class="rp-card"><p class="rp-label">Recent invoices</p>${RECENT.map(([no, c, d, a, s]) => html`<div class="rp-si__row"><span class="rp-mono">${no}</span><span>${c}</span><span class="rp-dim">${d}</span><span class="rp-mono">${a}</span>${chip(s[0], s[1])}</div>`)}</div>
      ${withSide ? html`<div class="rp-card"><p class="rp-label">Recent payments</p><div class="rp-si__pay"><span><strong>Northside Deli</strong><span class="rp-dim">Aug 12 · #1042 · Card</span></span><span class="rp-mono rp-ok">+$485.90</span></div><div class="rp-si__pay"><span><strong>T. Okafor</strong><span class="rp-dim">Aug 10 · #1040 · Check</span></span><span class="rp-mono rp-ok">+$300.00</span></div><div class="rp-si__pay"><span><strong>P. Nowak</strong><span class="rp-dim">Jul 30 · #1038 · Cash</span></span><span class="rp-mono rp-ok">+$140.00</span></div></div>` : ''}
    </div>
  </div>
</div>`;
}
export const SI_HOME_LABEL = 'Sample S Invoice web home for a sample business: totals invoiced, collected, outstanding and overdue, recent invoices with Paid, Sent, Partial and Overdue statuses, and recent card, check and cash payments';
