// S-Protocol — main.js

(function () {
  'use strict';

  // ---- Mobile menu toggle ----
  var menuBtn = document.querySelector('.mobile-menu-btn');
  var mobileNav = document.getElementById('mobileNav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
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

  // ---- Header border/background on scroll ----
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Smooth anchor scroll with fixed-header offset ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ---- Scroll reveal (subtle, staggered) ----
  var revealEls = document.querySelectorAll(
    '.card, .tile, .feature, .integ, .build-list li, .mini'
  );

  if ('IntersectionObserver' in window && revealEls.length &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(function (el) {
      el.classList.add('reveal');
      // small stagger based on position among its siblings
      var siblings = Array.prototype.slice.call(el.parentNode.children);
      var i = siblings.indexOf(el);
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + 'ms';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // ---- Contact form ----
  // Submits to the S-Protocol Apps Script webhook via fetch using
  // URLSearchParams (application/x-www-form-urlencoded) — a CORS "simple
  // request" that needs no preflight, the most reliable choice for
  // Google Apps Script web app endpoints.
  var WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyOh8-2IwhL6yK6YWjJMENjv0dJugE3G7LcBg2nM22YPK7P8iXHbPQ9wuABSHij4vtp4g/exec';

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      var val = function (sel) {
        var el = contactForm.querySelector(sel);
        return el ? (el.value || '').trim() : '';
      };

      var params = new URLSearchParams();
      params.append('name', val('[name="name"]'));
      params.append('email', val('[name="email"]'));
      params.append('company', val('[name="company"]'));
      params.append('phone', val('[name="phone"]'));
      params.append('message', val('[name="message"]'));
      params.append('source', 's-protocol.com');
      params.append('page', window.location.href);

      fetch(WEBHOOK_URL, { method: 'POST', body: params })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json && json.ok) { showFormSuccess(); }
          else { showFormError(btn, originalText); }
        })
        .catch(function () { showFormError(btn, originalText); });
    });
  }

  function showFormSuccess() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var card = form.closest('.contact-card');
    if (!card) return;
    var success = card.querySelector('.form-success');
    if (!success) {
      success = document.createElement('div');
      success.className = 'form-success';
      success.innerHTML =
        '<div class="form-success-icon">&#10003;</div>' +
        '<h3>Message received.</h3>' +
        '<p>We&rsquo;ll be in touch within one business day.</p>';
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
    var form = document.getElementById('contactForm');
    if (!form) return;
    var errEl = form.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-error';
      errEl.textContent = 'Something went wrong. Please try again, or email support@s-protocol.com.';
      var actions = form.querySelector('.form-actions');
      if (actions) actions.insertAdjacentElement('afterend', errEl);
      else form.appendChild(errEl);
    }
    errEl.style.display = 'block';
  }

})();
