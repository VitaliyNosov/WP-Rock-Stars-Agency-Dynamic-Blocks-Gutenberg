/**
 * Process Section (Section 12: How We Work)
 * Handles GSAP ScrollTrigger entrance animations (staggered timeline dots,
 * lines expansion, hollow counter reveals, atmospheric media card) with
 * graceful fallback for prefers-reduced-motion.
 * Matches design 12.png.
 */

(function () {
  'use strict';

  function initAnimations() {
    const section = document.getElementById('how-we-work');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const badge = section.querySelector('.section-badge-indicator');
    const headerTag = section.querySelector('.process-tag');
    const headerTitle = section.querySelector('.process-title');
    const headerDesc = section.querySelector('.process-desc');
    const stepItems = section.querySelectorAll('.process-step-item');
    const mediaCard = section.querySelector('.process-media-card');

    if (prefersReducedMotion) {
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Set initial states
      if (badge) gsap.set(badge, { opacity: 0, x: -15 });
      gsap.set([headerTag, headerTitle, headerDesc], { opacity: 0, y: 24 });
      
      stepItems.forEach(function (step) {
        const dot = step.querySelector('.step-dot');
        const line = step.querySelector('.step-line');
        const num = step.querySelector('.step-number-wrap, .step-number');
        const title = step.querySelector('.step-title');
        const desc = step.querySelector('.step-desc');

        if (dot) gsap.set(dot, { scale: 0, opacity: 0 });
        if (line) gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
        if (num) gsap.set(num, { opacity: 0, y: 15 });
        if (title) gsap.set(title, { opacity: 0, y: 10 });
        if (desc) gsap.set(desc, { opacity: 0, y: 10 });
      });

      if (mediaCard) {
        gsap.set(mediaCard, { opacity: 0, y: 35 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: true
        }
      });

      // 1. Badge indicator
      if (badge) {
        tl.to(badge, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0);
      }

      // 2. Header elements
      tl.to(headerTag, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.1)
        .to(headerTitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.2)
        .to(headerDesc, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.35);

      // 3. Staggered timeline steps
      stepItems.forEach(function (step, index) {
        const stepDelay = 0.45 + index * 0.12;
        const dot = step.querySelector('.step-dot');
        const line = step.querySelector('.step-line');
        const num = step.querySelector('.step-number-wrap, .step-number');
        const title = step.querySelector('.step-title');
        const desc = step.querySelector('.step-desc');

        if (dot) {
          tl.to(dot, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.8)' }, stepDelay);
        }
        if (line) {
          tl.to(line, { scaleX: 1, duration: 0.45, ease: 'power2.out' }, stepDelay + 0.1);
        }
        if (num) {
          tl.to(num, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, stepDelay + 0.15);
        }
        if (title) {
          tl.to(title, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, stepDelay + 0.22);
        }
        if (desc) {
          tl.to(desc, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, stepDelay + 0.28);
        }
      });

      // 4. Media Card Reveal
      if (mediaCard) {
        tl.to(
          mediaCard,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          },
          1.1
        );
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})();
