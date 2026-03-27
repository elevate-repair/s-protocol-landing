// S-Protocol — main.js

(function () {
  'use strict';

  // Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.getElementById('mobileNav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Header scroll opacity
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.background = window.scrollY > 20
        ? 'rgba(8, 10, 12, 0.96)'
        : 'rgba(8, 10, 12, 0.82)';
    }, { passive: true });
  }

  // Smooth anchor scroll with fixed header offset
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // Intersection observer: fade-in cards
  const cards = document.querySelectorAll(
    '.why-card, .feature-card, .integration-card, .pricing-card'
  );

  if ('IntersectionObserver' in window && cards.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = entry.target.classList.contains('feature-card')
            ? 'translateY(0)'
            : '';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (card) {
      card.style.opacity = '0';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.transform = 'translateY(16px)';
      observer.observe(card);
    });
  }

  // Contact form — submits to the S-Protocol Apps Script webhook via fetch.
  // Uses URLSearchParams (application/x-www-form-urlencoded) — a CORS "simple
  // request" that requires no preflight OPTIONS, making it the most reliable
  // choice for Google Apps Script web app endpoints.
  var WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyOh8-2IwhL6yK6YWjJMENjv0dJugE3G7LcBg2nM22YPK7P8iXHbPQ9wuABSHij4vtp4g/exec';

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      var params = new URLSearchParams();
      params.append('name',    (contactForm.querySelector('[name="name"]').value    || '').trim());
      params.append('email',   (contactForm.querySelector('[name="email"]').value   || '').trim());
      params.append('company', (contactForm.querySelector('[name="company"]').value || '').trim());
      params.append('phone',   (contactForm.querySelector('[name="phone"]').value   || '').trim());
      params.append('message', (contactForm.querySelector('[name="message"]').value || '').trim());
      params.append('source',  's-protocol.com');
      params.append('page',    window.location.href);

      fetch(WEBHOOK_URL, { method: 'POST', body: params })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json && json.ok) {
            showFormSuccess();
          } else {
            showFormError(btn, originalText);
          }
        })
        .catch(function () {
          showFormError(btn, originalText);
        });
    });
  }

  // Mobile: remove SMIL <animate> elements so the S renders as a static shape.
  // The CSS glow pulse (s-glow-pulse) continues independently on the SVG element.
  // This prevents broken morph frames on mobile browsers without freezing CSS.
  if (window.matchMedia && window.matchMedia('(max-width: 600px)').matches) {
    var heroSvg = document.querySelector('.hero-s-svg');
    if (heroSvg) {
      heroSvg.querySelectorAll('animate').forEach(function (el) { el.parentNode.removeChild(el); });
    }
  }

  function showFormSuccess() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const card = form.closest('.contact-card');
    if (!card) return;
    let success = card.querySelector('.form-success');
    if (!success) {
      success = document.createElement('div');
      success.className = 'form-success';
      success.innerHTML =
        '<div class="form-success-icon">&#10003;</div>' +
        '<h3>Message received.</h3>' +
        '<p>We will be in touch within one business day.</p>';
      card.appendChild(success);
    }
    form.style.transition = 'opacity 0.3s';
    form.style.opacity = '0';
    setTimeout(function () {
      form.style.display = 'none';
      success.classList.add('visible');
    }, 300);
  }

  function showFormError(btn, originalText) {
    if (btn) { btn.disabled = false; btn.textContent = originalText; }
    const form = document.getElementById('contactForm');
    if (!form) return;
    let errEl = form.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-error';
      errEl.textContent = 'Something went wrong. Please try again or email us directly.';
      const actions = form.querySelector('.form-actions');
      if (actions) actions.insertAdjacentElement('afterend', errEl);
      else form.appendChild(errEl);
    }
    errEl.style.display = 'block';
  }

})();
