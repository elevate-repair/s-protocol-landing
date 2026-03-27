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

  // Contact form — front-end handler
  // The form uses formsubmit.co as action. This JS layer adds a success state
  // overlay so users get immediate feedback without a page reload.
  // To connect a different backend, change the form action attribute.
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      // If formsubmit.co or similar service is configured, let the form POST normally.
      // For pure front-end demo mode (action="#"), prevent default and show success.
      const action = contactForm.getAttribute('action') || '';
      if (action === '' || action === '#' || action === '#contact') {
        e.preventDefault();
        showFormSuccess();
        return;
      }
      // For real endpoint (formsubmit.co etc.), submit naturally but also show
      // an optimistic success state after a short delay.
      setTimeout(showFormSuccess, 800);
    });
  }

  // Mobile hero animation fix:
  // The SMIL morph between S (M+6C) and infinity (M+4C) paths is broken on mobile
  // because mismatched command counts produce distorted intermediate frames.
  // Pause the SMIL on mobile and apply a clean CSS-only sway animation instead.
  if (window.matchMedia && window.matchMedia('(max-width: 600px)').matches) {
    var heroSvg = document.querySelector('.hero-s-svg');
    if (heroSvg && typeof heroSvg.pauseAnimations === 'function') {
      heroSvg.pauseAnimations(); // pauses all SMIL on this <svg> element
      heroSvg.classList.add('hero-s-mobile'); // CSS sway takes over
    }
  }

  function showFormSuccess() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    // Build success message inline
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

})();
