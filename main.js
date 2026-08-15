// S Protocol / S Invoice — main.js

(function () {
  'use strict';

  var DESKTOP = '(min-width: 1024px)';
  var isDesktop = function () { return window.matchMedia(DESKTOP).matches; };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mobile drawer ----------------------------------------------------
  var menuBtn = document.querySelector('.mobile-menu-btn');
  var mobileNav = document.getElementById('mobileNav');

  function setDrawer(open) {
    if (!menuBtn || !mobileNav) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      mobileNav.removeAttribute('hidden');
      mobileNav.classList.add('is-open');
    } else {
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('hidden', '');
    }
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      setDrawer(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setDrawer(false); });
    });
  }

  // ---- Header dropdowns (Products, Sign in) ------------------------------
  var drops = Array.prototype.slice.call(document.querySelectorAll('.nav-drop'));

  function closeDrops(except) {
    drops.forEach(function (drop) {
      if (drop === except) return;
      var btn = drop.querySelector('.nav-drop-btn');
      var menu = drop.querySelector('.nav-menu');
      if (!btn || !menu) return;
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('hidden', '');
    });
  }

  drops.forEach(function (drop) {
    var btn = drop.querySelector('.nav-drop-btn');
    var menu = drop.querySelector('.nav-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = btn.getAttribute('aria-expanded') === 'true';
      closeDrops(drop);
      btn.setAttribute('aria-expanded', String(!open));
      if (open) menu.setAttribute('hidden', '');
      else menu.removeAttribute('hidden');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { closeDrops(null); });
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.nav-drop')) closeDrops(null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeDrops(null);
    if (menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') {
      setDrawer(false);
      menuBtn.focus();
    }
  });

  // ---- Header shadow on scroll ------------------------------------------
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Smooth anchor scroll with fixed-header offset ---------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = isDesktop() ? 84 : 70;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (target.id) history.replaceState(null, '', '#' + target.id);
    });
  });

  // ---- Integrations: a grid on desktop, an accordion on mobile ----------
  var accordions = Array.prototype.slice.call(document.querySelectorAll('.integ'));

  function syncAccordions() {
    var desktop = isDesktop();
    accordions.forEach(function (item, i) {
      if (desktop) {
        item.open = true;
      } else if (!item.dataset.touched) {
        item.open = i === 0;
      }
    });
  }

  accordions.forEach(function (item) {
    var summary = item.querySelector('summary');
    if (!summary) return;
    summary.addEventListener('click', function (e) {
      // On desktop the panels are always open and the summary is inert.
      if (isDesktop()) { e.preventDefault(); return; }
      item.dataset.touched = '1';
    });
  });

  syncAccordions();

  // ---- Dispatch-board scroller: page indicator --------------------------
  var scroller = document.querySelector('[data-scroller]');
  var hint = document.querySelector('[data-scroll-hint]');

  if (scroller && hint) {
    var bars = Array.prototype.slice.call(hint.querySelectorAll('.bar'));
    var syncHint = function () {
      var max = scroller.scrollWidth - scroller.clientWidth;
      var ratio = max > 0 ? scroller.scrollLeft / max : 0;
      var active = Math.round(ratio * (bars.length - 1));
      bars.forEach(function (bar, i) { bar.classList.toggle('is-on', i === active); });
    };
    scroller.addEventListener('scroll', syncHint, { passive: true });
    syncHint();
  }

  // ---- Re-sync on breakpoint change -------------------------------------
  var mq = window.matchMedia(DESKTOP);
  var onBreakpoint = function () {
    syncAccordions();
    if (isDesktop()) { setDrawer(false); } else { closeDrops(null); }
  };
  if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
  else if (mq.addListener) mq.addListener(onBreakpoint);

  // ---- Scroll reveal (subtle, staggered) --------------------------------
  var revealEls = document.querySelectorAll(
    '.door, .flow-step, .cluster, .stage, .plan, .integ, .faq-item, .growth-card, .closing-card, .cmp-card'
  );

  if ('IntersectionObserver' in window && revealEls.length && !reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add('reveal');
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

  // ---- Contact form ------------------------------------------------------
  // Submits to the S Protocol Apps Script webhook via fetch using
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
