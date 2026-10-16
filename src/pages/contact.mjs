// `/contact` — remaining-pages-spec.md G1–G2 (replaces `/#contact`). The form keeps the Stage 1 contract exactly
// (REPO_AUDIT.md §9): no action/method, the same five fields with the same names, types and required flags, no hidden
// fields; src/scripts/contact.js sends the same URLSearchParams request to the same Apps Script endpoint and treats a
// JSON reply with `ok` as success. New, owner-approved (D-33, Pass 2): Name and Email are checked in the browser
// before anything is sent, errors are announced inline, and a failed send keeps the input with a retry.
import { html } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../lib/data.mjs';
import { graph, webPage } from '../lib/seo.mjs';
import { ctaLink, sectionHead } from '../components/ui.mjs';
import { pageHero } from '../components/sections.mjs';

const R = '/contact';
const SUPPORT = site.organization.email;

const field = ({ id, name, label, type = 'text', required = false, optional = false, autocomplete, placeholder = null, textarea = false }) => {
  const err = `${id}-error`;
  const control = textarea
    ? html`<textarea id="${id}" name="${name}" rows="5" placeholder="${placeholder}"></textarea>`
    : html`<input type="${type}" id="${id}" name="${name}"${required ? html` required aria-required="true"` : ''} autocomplete="${autocomplete}"${type === 'email' ? html` inputmode="email" spellcheck="false"` : ''}>`;
  return html`<div class="field${textarea ? ' field--full' : ''}">
        <label for="${id}">${label}${required ? html` <span class="field__req" aria-hidden="true">*</span>` : ''}${optional ? html` <span class="field__opt">(optional)</span>` : ''}</label>
        ${control}
        ${required ? html`<p class="field__error" id="${err}" hidden>${icon('circle-alert', { size: 16 })}<span></span></p>` : ''}
      </div>`;
};

function form() {
  return html`<div class="contact-card" data-contact>
    <form class="contact-form" id="contactForm" novalidate aria-describedby="contact-required">
      <p class="contact-form__note" id="contact-required">Fields marked <span aria-hidden="true">*</span><span class="sr-only">with an asterisk</span> are required.</p>
      <div class="contact-form__grid">
      ${field({ id: 'contact-name', name: 'name', label: 'Name', required: true, autocomplete: 'name' })}
      ${field({ id: 'contact-email', name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' })}
      ${field({ id: 'contact-company', name: 'company', label: 'Business', autocomplete: 'organization' })}
      ${field({ id: 'contact-phone', name: 'phone', label: 'Phone', type: 'tel', optional: true, autocomplete: 'tel' })}
      ${field({ id: 'contact-message', name: 'message', label: 'Message', textarea: true, placeholder: 'Tell us about your business, or the workflow you’d like to see.' })}
      </div>
      <div class="alert alert--error" role="alert" data-contact-error hidden>
        ${icon('circle-alert', { size: 20 })}
        <div class="alert__body"><p class="alert__title" data-contact-error-text></p><p>Please try again, or email <a href="mailto:${SUPPORT}" data-track="email_click" data-location="contact_error">${SUPPORT}</a>. Everything you typed is still here.</p><button type="button" class="alert__retry" data-contact-retry>Try again</button></div>
      </div>
      <div class="contact-form__actions">
        <button type="submit" class="btn btn--primary btn--lg" data-contact-submit><span data-label-idle>Send message</span><span data-label-busy hidden>Sending…</span></button>
        <p class="contact-form__promise">We typically respond within one business day.</p>
      </div>
      <p class="sr-only" role="status" aria-live="polite" data-contact-status></p>
    </form>
    <div class="contact-success" data-contact-success hidden>
      <span class="contact-success__icon">${icon('circle-check', { size: 24 })}</span>
      <h2 class="contact-success__title" tabindex="-1">Thanks — we’ll reply within one business day.</h2>
      <p>Your message reached us. If it’s urgent, email <a href="mailto:${SUPPORT}" data-track="email_click" data-location="contact_success">${SUPPORT}</a>.</p>
    </div>
    <noscript><p class="contact-form__noscript">This form needs JavaScript to send. You can always email <a href="mailto:${SUPPORT}">${SUPPORT}</a>.</p></noscript>
  </div>`;
}

function hero() {
  return pageHero({
    eyebrowText: 'GET IN TOUCH',
    title: 'Build with us — or just say hello.',
    lead: 'Want to run your business on S Protocol, start invoicing with S Invoice, or request a workflow? Send a note and we’ll get back to you.',
    aside: form(), cls: 'page-hero--contact',
  });
}

function otherWays() {
  return html`<section class="section section--white" id="other-ways" aria-labelledby="other-title">
  <div class="container">
    ${sectionHead({ eyebrow: 'OTHER WAYS', title: 'Or reach us directly.', id: 'other-title', cls: 'section-head--7' })}
    <div class="other-ways">
      <div class="other-ways__col"><h3 class="other-ways__title">Email</h3><p>${ctaLink(R, SUPPORT, { section: 'G2 Email' })}</p><p class="other-ways__line">We typically respond within one business day.</p></div>
      <div class="other-ways__col"><h3 class="other-ways__title">Already a customer?</h3><ul class="other-ways__links"><li>${ctaLink(R, 'Sign in to S Protocol ↗', { section: 'G2 Already a customer?' })}</li><li>${ctaLink(R, 'Sign in to S Invoice ↗', { section: 'G2 Already a customer?' })}</li></ul></div>
      <div class="other-ways__col"><h3 class="other-ways__title">Before you sign up</h3><ul class="other-ways__links"><li>${ctaLink(R, 'See pricing →', { section: 'G2 Before you sign up' })}</li><li>${ctaLink(R, 'Read the FAQ →', { section: 'G2 Before you sign up' })}</li></ul></div>
    </div>
  </div>
</section>`;
}

const TITLE = 'Contact S Protocol';
const DESCRIPTION = 'Questions about S Protocol or S Invoice? Send a note or email support@s-protocol.com. We typically respond within one business day.';

export const meta = {
  route: R, page: 'contact', title: TITLE, description: DESCRIPTION,
  jsonld: graph(webPage(R, TITLE, DESCRIPTION, { '@type': 'ContactPage', about: { '@id': `${site.origin}/#organization` } })),
  scripts: ['/assets/js/contact.js'],
};

export function render() {
  return html`${hero()}
${otherWays()}`;
}
