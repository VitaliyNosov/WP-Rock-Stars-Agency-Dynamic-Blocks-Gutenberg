/**
 * Integrations & Automation Section (Section 06)
 * Handles interactive hover states, dynamic line highlighting,
 * and GSAP entrance animations with IntersectionObserver fallback.
 */

(function () {
  'use strict';

  function initInteractivity() {
    const section = document.getElementById('integrations');
    if (!section) return;

    const cards = section.querySelectorAll('.integr-card');
    const monitor = section.querySelector('#mon-site');
    const allLines = section.querySelectorAll('.integr-line');

    // Hover on cards
    cards.forEach(function (card) {
      const lineId = card.getAttribute('data-line');
      const targetLine = lineId ? section.querySelector('#' + lineId) : null;

      function highlight() {
        card.classList.add('card-active');
        if (targetLine) targetLine.classList.add('line-active');
        if (monitor) monitor.classList.add('mon-active');
      }

      function unhighlight() {
        card.classList.remove('card-active');
        if (targetLine) targetLine.classList.remove('line-active');
        if (monitor) monitor.classList.remove('mon-active');
      }

      card.addEventListener('mouseenter', highlight);
      card.addEventListener('mouseleave', unhighlight);
      card.addEventListener('focus', highlight);
      card.addEventListener('blur', unhighlight);
    });

    // Hover on central monitors (desktop and mobile)
    const monitors = section.querySelectorAll('.integr-mon');
    monitors.forEach(function (mon) {
      mon.addEventListener('mouseenter', function () {
        mon.classList.add('mon-active');
        allLines.forEach(function (line) {
          line.classList.add('line-active');
        });
      });

      mon.addEventListener('mouseleave', function () {
        mon.classList.remove('mon-active');
        allLines.forEach(function (line) {
          line.classList.remove('line-active');
        });
      });
    });
  }

  function initAnimations() {
    const section = document.getElementById('integrations');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const badge = section.querySelector('.section-badge-indicator');
    const headerTag = section.querySelector('.integrations-tag');
    const headerTitle = section.querySelector('.integrations-title');
    const headerDesc = section.querySelector('.integrations-desc');
    const leftCards = section.querySelectorAll('.integr-left-cards .integr-card');
    const rightCards = section.querySelectorAll('.integr-right-cards .integr-card');
    const monitor = section.querySelector('.integr-center-monitor');
    const lines = section.querySelectorAll('.integr-line');
    const footnote = section.querySelector('.integrations-footnote');

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Initial states
      if (badge) gsap.set(badge, { opacity: 0, x: -15 });
      gsap.set([headerTag, headerTitle, headerDesc], { opacity: 0, y: 20 });
      if (monitor) gsap.set(monitor, { opacity: 0, scale: 0.92, transformOrigin: '50% 50%' });
      gsap.set(leftCards, { opacity: 0, x: -24 });
      gsap.set(rightCards, { opacity: 0, x: 24 });
      gsap.set(lines, { opacity: 0 });
      if (footnote) gsap.set(footnote, { opacity: 0, y: 15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: true
        }
      });

      if (badge) {
        tl.to(badge, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, 0);
      }

      tl.to(headerTag, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.15)
        .to(headerTitle, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.25)
        .to(headerDesc, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.4)
        .to(monitor, { opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.3)' }, 0.45)
        .to(leftCards, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0.55)
        .to(rightCards, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0.65)
        .to(lines, { opacity: 1, duration: 0.6, ease: 'power2.inOut' }, 0.75)
        .to(footnote, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.95);

    } else {
      // IntersectionObserver fallback
      const observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (badge) badge.style.opacity = '1';
              if (headerTag) headerTag.style.opacity = '1';
              if (headerTitle) headerTitle.style.opacity = '1';
              if (headerDesc) headerDesc.style.opacity = '1';
              if (monitor) monitor.style.opacity = '1';
              leftCards.forEach(function (c) { c.style.opacity = '1'; });
              rightCards.forEach(function (c) { c.style.opacity = '1'; });
              lines.forEach(function (l) { l.style.opacity = '1'; });
              if (footnote) footnote.style.opacity = '1';
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(section);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initInteractivity();
      initAnimations();
    });
  } else {
    initInteractivity();
    initAnimations();
  }
})();
