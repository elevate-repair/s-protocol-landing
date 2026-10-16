// Interim product-UI fallback (D-30): faithful HTML replicas of screens that exist in the apps, adapted from the replicas
// the live site already shows, with the fictional demo dataset (product-ui-capture-plan.md §3) and only the labels the
// apps really use — job statuses Scheduled / Pending / Closed, the Unassigned group, the recorded arrival time, invoice
// statuses Draft / Sent / Partial / Overdue / Paid. Replace each with the real capture once it exists (status §9).
import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';

const chip = (label, tone) => html`<span class="rp-chip rp-chip--${tone}">${label}</span>`;
const avatar = (t) => html`<span class="rp-avatar">${t}</span>`;

// ------------------------------------------------------------------ S Protocol dispatch board (dark)
const TECHS = {
  ruiz: { initials: 'MR', name: 'M. Ruiz', jobs: [
    { time: '8:00 AM', status: ['Scheduled', 'scheduled'], title: 'Dryer not heating', who: 'R. Alvarez · Elmwood Ave', extra: html`<span class="rp-job__ok">Arrived 8:06 AM</span>` },
    { time: '11:30 AM', status: ['Scheduled', 'scheduled'], title: 'Fridge leaking', who: 'Northside Deli · Main St' },
  ] },
  kaur: { initials: 'DK', name: 'D. Kaur', jobs: [
    { time: '9:15 AM', status: ['Closed', 'closed'], title: 'Oven install', who: 'T. Okafor · Linden Rd', extra: html`<span class="rp-job__money"><span>Invoice #2161</span><span class="rp-job__ok">Paid</span></span>` },
    { time: '1:00 PM', status: ['Scheduled', 'scheduled'], title: 'Washer diagnostic', who: 'J. Whitfield · Parkside' },
  ] },
  petrov: { initials: 'AP', name: 'A. Petrov', jobs: [
    { time: '2:30 PM', status: ['Scheduled', 'scheduled'], title: 'Dishwasher not draining', who: 'P. Nowak · Grant St' },
  ] },
};
const UNASSIGNED = [
  { time: 'Today', status: ['Pending', 'pending'], title: 'Ice maker repair', who: 'Website lead · 8:42 AM' },
  { time: 'Tomorrow', status: ['Pending', 'pending'], title: 'Range hood fan', who: 'Inbound call · 9:10 AM' },
];
// Board markers (homepage §6): ① first technician column header, ② Unassigned header, ③ a status chip on a job card.
const mk = (n, on, cls = '') => (on ? html`<span class="marker marker--board${cls}" aria-hidden="true">${n}</span>` : '');
const job = (j, m3 = false) => html`<div class="rp-job"><div class="rp-job__top"><span class="rp-mono">${j.time}</span><span class="rp-chipwrap">${chip(j.status[0], j.status[1])}${mk(3, m3)}</span></div><strong>${j.title}</strong><span class="rp-job__who">${j.who}</span>${j.extra ?? ''}</div>`;
const techCol = (key, i, markers) => {
  const t = TECHS[key];
  return html`<div class="rp-col"><div class="rp-col__head">${avatar(t.initials)}<span><strong>${t.name}</strong><span class="rp-mono rp-dim">${t.jobs.length} ${t.jobs.length === 1 ? 'job' : 'jobs'}</span></span>${mk(1, markers && i === 0, ' marker--inline')}</div>${t.jobs.map((j, k) => job(j, markers && i === 2 && k === 0))}</div>`;
};
const unassignedCol = (markers) => html`<div class="rp-col rp-col--unassigned"><div class="rp-col__head rp-col__head--plain"><span class="rp-col__title"><strong>Unassigned</strong>${mk(2, markers, ' marker--inline')}</span><span class="rp-count">${UNASSIGNED.length}</span></div>${UNASSIGNED.map((j) => job(j))}</div>`;

const RAIL = ['Dashboard', 'Jobs', 'Schedule', 'Operations', 'Clients', 'Estimates', 'Invoices', 'Team chat', 'Analytics', 'Site leads', 'Settings'];
const rail = () => html`<div class="rp-rail"><div class="rp-rail__brand"><img src="/assets/brand/app-icon.webp" alt="" width="24" height="24" loading="lazy" decoding="async"><span>S Protocol</span></div>${RAIL.map((r) => html`<span class="rp-rail__item${r === 'Jobs' ? ' is-active' : ''}">${r}</span>`)}</div>`;

/** cols: which technician columns; withRail: app navigation on the left; unassigned: show the Unassigned group. */
export function boardReplica({ cols = ['ruiz', 'kaur', 'petrov'], unassigned = true, withRail = true, head = true, markers = false, cls = '' } = {}) {
  return html`<div class="rp-board${withRail ? '' : ' rp-board--bare'}${cls ? ' ' + cls : ''}">${withRail ? rail() : ''}<div class="rp-board__main">${head ? html`<div class="rp-board__head"><div><strong>Today</strong><span class="rp-mono rp-dim">Thu, Aug 14 · 6 jobs</span></div><span class="rp-btn rp-btn--primary">New job</span></div>` : ''}<div class="rp-board__cols" style="--cols:${cols.length + (unassigned ? 1 : 0)}">${cols.map((c, i) => techCol(c, i, markers))}${unassigned ? unassignedCol(markers) : ''}</div></div></div>`;
}
export const BOARD_LABEL = 'S Protocol dispatch board for Thursday (sample workspace): columns for technicians M. Ruiz, D. Kaur and A. Petrov with their jobs and statuses, and an Unassigned group with two jobs waiting for a technician.';

// ------------------------------------------------------------------ S Protocol job record #4417 (light)
/** One record whose visible state follows the explorer step (data-step on an ancestor; step 1 without JS). */
export function jobRecordReplica() {
  return html`<div class="rp-record">
  <div class="rp-record__head"><div><strong>Dryer not heating</strong><span>R. Alvarez · 128 Elmwood Ave · Job #4417</span></div><span class="rp-state" data-hl="status">${chip('Pending', 'pending')}${chip('Scheduled', 'scheduled')}</span></div>
  <div class="rp-tabs"><span data-tab="overview">Overview</span><span data-tab="invoice">Invoice</span><span data-tab="history">History</span></div>
  <div class="rp-record__grid">
    <div class="rp-cell" data-hl="lead"><span class="rp-label">Source</span><strong>Website lead</strong><span class="rp-dim">Received 8:42 AM · address and problem attached</span></div>
    <div class="rp-cell" data-hl="booked"><span class="rp-label">Technician</span><strong class="rp-tech"><span class="rp-when-1">Unassigned</span><span class="rp-when-2">M. Ruiz</span></strong><span class="rp-dim"><span class="rp-when-1">Not scheduled yet</span><span class="rp-when-2">Thu, Aug 14 · 8:00 AM</span></span></div>
    <div class="rp-cell rp-cell--wide" data-hl="onsite"><span class="rp-label">On site</span><span class="rp-when-3"><span class="rp-ok">Arrived 8:06 AM</span><span class="rp-note">“Heating element open — replaced element and thermal fuse.”</span><span class="rp-thumbs"><i>${icon('camera', { size: 16 })}</i><i>${icon('camera', { size: 16 })}</i></span></span><span class="rp-when-pre3 rp-dim">Notes and photos from the visit appear here.</span></div>
    <div class="rp-cell" data-hl="invoice"><span class="rp-label">Balance due</span><strong class="rp-mono rp-big"><span class="rp-when-pre5">$186.00</span><span class="rp-when-5">$0.00</span></strong><span class="rp-dim"><span class="rp-when-pre4">No invoice yet</span><span class="rp-when-4only">Invoice #2184 · ${chip('Sent', 'sent')}</span><span class="rp-when-5">Invoice #2184 · ${chip('Paid', 'paid')}</span></span></div>
    <div class="rp-cell rp-cell--wide" data-hl="paid"><span class="rp-label">History</span><div class="rp-visit rp-when-5"><span>Dryer not heating · Aug 2026</span><span class="rp-mono rp-ok">Paid $186.00</span></div><div class="rp-visit"><span>Washer drum bearing · Mar 2026</span><span class="rp-mono rp-ok">Paid $420.00</span></div><div class="rp-visit"><span>Dishwasher install · Nov 2025</span><span class="rp-mono rp-ok">Paid $260.00</span></div></div>
  </div>
</div>`;
}

// ------------------------------------------------------------------ estimate and customer-facing invoice (S Protocol job #4417)
const ITEMS_4417 = [['Heating element', '1', '$96.00'], ['Thermal fuse', '1', '$18.00'], ['Labor (1 h)', '1', '$72.00']];
export function estimateReplica() {
  return html`<div class="rp-sheet"><div class="rp-sheet__head"><div><span class="rp-label">Estimate · Job #4417</span><strong>Dryer not heating</strong></div>${chip('Sent', 'sent')}</div>
  <div class="rp-lines"><div class="rp-lines__head"><span>Item</span><span>Qty</span><span>Amount</span></div>${ITEMS_4417.map(([n, q, a]) => html`<div class="rp-lines__row"><span>${n}</span><span>${q}</span><span class="rp-mono">${a}</span></div>`)}</div>
  <div class="rp-total"><span>Total</span><strong class="rp-mono">$186.00</strong></div></div>`;
}
export function jobInvoiceReplica() {
  return html`<div class="rp-doc rp-doc--compact"><div class="rp-doc__top"><div class="rp-doc__brand"><span class="rp-doc__logo">R</span><strong>Ruiz Appliance Repair</strong></div><span class="rp-mono rp-dim">Invoice #2184</span></div>
  <div class="rp-doc__title"><strong>Dryer not heating</strong><span>Bill to R. Alvarez · 128 Elmwood Ave</span></div>
  <div class="rp-lines rp-lines--doc">${ITEMS_4417.map(([n, , a]) => html`<div class="rp-lines__row"><span>${n}</span><span></span><span class="rp-mono">${a}</span></div>`)}</div>
  <div class="rp-doc__balance"><span>BALANCE DUE</span><strong class="rp-mono">$186.00</strong></div><span class="rp-pay">Pay $186.00</span></div>`;
}

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
export const DOC_LABEL = 'Customer-facing invoice titled “Ice maker repair” from a sample repair business, marked Paid, with line items, tax and the balance due';

// ------------------------------------------------------------------ S Invoice web home (Rosa's workspace)
const RECENT = [
  ['#1042', 'Northside Deli', 'Aug 12, 2026', '$485.90', ['Paid', 'paid']],
  ['#1041', 'R. Alvarez', 'Aug 12, 2026', '$186.00', ['Sent', 'sent']],
  ['#1040', 'T. Okafor', 'Aug 10, 2026', '$640.00', ['Partial', 'partial']],
  ['#1039', 'J. Whitfield', 'Aug 2, 2026', '$320.00', ['Overdue', 'overdue']],
  ['#1038', 'P. Nowak', 'Jul 30, 2026', '$140.00', ['Paid', 'paid']],
];
const SI_RAIL = ['Home', 'Invoices', 'Estimates', 'Customers', 'Payments', 'Reports', 'Settings'];
export function sInvoiceHomeReplica({ withSide = true } = {}) {
  return html`<div class="rp-si">
  <div class="rp-si__rail"><div class="rp-rail__brand"><img src="/assets/brand/s-invoice-icon.webp" alt="" width="24" height="24" loading="lazy" decoding="async"><span>S Invoice</span></div>${SI_RAIL.map((r) => html`<span class="rp-rail__item${r === 'Home' ? ' is-active' : ''}">${r}</span>`)}</div>
  <div class="rp-si__main">
    <div class="rp-si__greet"><div><strong>Good morning, Rosa</strong><span class="rp-dim">Thursday, August 14</span></div><span class="rp-btn rp-btn--primary">New invoice</span></div>
    <div class="rp-si__stats"><div><span>Total invoiced</span><strong>$18,940.00</strong></div><div><span>Collected</span><strong class="rp-ok">$17,134.00</strong></div><div><span>Outstanding</span><strong class="rp-warn">$1,486.00</strong></div><div><span>Overdue</span><strong class="rp-bad">$320.00</strong></div></div>
    <div class="rp-si__cols">
      <div class="rp-card"><p class="rp-label">Recent invoices</p>${RECENT.map(([no, c, d, a, s]) => html`<div class="rp-si__row"><span class="rp-mono">${no}</span><span>${c}</span><span class="rp-dim">${d}</span><span class="rp-mono">${a}</span>${chip(s[0], s[1])}</div>`)}</div>
      ${withSide ? html`<div class="rp-card"><p class="rp-label">Recent payments</p><div class="rp-si__pay"><span><strong>Northside Deli</strong><span class="rp-dim">Aug 12 · #1042 · Card</span></span><span class="rp-mono rp-ok">+$485.90</span></div><div class="rp-si__pay"><span><strong>T. Okafor</strong><span class="rp-dim">Aug 10 · #1040 · Check</span></span><span class="rp-mono rp-ok">+$300.00</span></div><div class="rp-si__pay"><span><strong>P. Nowak</strong><span class="rp-dim">Jul 30 · #1038 · Cash</span></span><span class="rp-mono rp-ok">+$140.00</span></div></div>` : ''}
    </div>
  </div>
</div>`;
}
export const SI_HOME_LABEL = 'S Invoice web home for a sample business: totals invoiced, collected, outstanding and overdue, recent invoices with Paid, Sent, Partial and Overdue statuses, and recent card, check and cash payments';
