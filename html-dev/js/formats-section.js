/**
 * Formats Section (Section 14: Ways to Work Together)
 * Handles interactive format selection (single border for selected card,
 * double border for unselected cards), smooth switching, and GSAP
 * ScrollTrigger entrance animations with an IntersectionObserver fallback.
 * Matches design 14.png.
 */

(function () {
  'use strict';

  function initInteractivity() {
    const section = document.getElementById('formats');
    if (!section) return;

    const cards = section.querySelectorAll('.format-card-outer');

    function selectCard(selectedCard) {
      cards.forEach(function (card) {
        const btn = card.querySelector('.format-card-btn');
        if (card === selectedCard) {
          card.classList.add('featured');
          card.setAttribute('aria-selected', 'true');
          if (btn) {
            btn.classList.remove('format-btn-ghost');
            btn.classList.add('format-btn-solid');
          }
        } else {
          card.classList.remove('featured');
          card.setAttribute('aria-selected', 'false');
          if (btn) {
            btn.classList.remove('format-btn-solid');
            btn.classList.add('format-btn-ghost');
          }
        }
      });
    }

    cards.forEach(function (card) {
      // Click event
      card.addEventListener('click', function (e) {
        // Prevent default anchor navigation if button clicked
        if (e.target.closest('a')) {
          e.preventDefault();
        }
        selectCard(card);
      });

      // Keyboard navigation (Enter or Space)
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectCard(card);
        }
      });
    });
  }

  function initAnimations() {
    const section = document.getElementById('formats');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const badge = section.querySelector('.section-badge-indicator');
    const headerTag = section.querySelector('.formats-tag');
    const headerTitle = section.querySelector('.formats-title');
    const headerDesc = section.querySelector('.formats-desc');
    const cards = section.querySelectorAll('.format-card-outer');

    if (prefersReducedMotion) {
      // Instantly show everything without animation
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Set initial states
      if (badge) gsap.set(badge, { opacity: 0, x: -15 });
      gsap.set([headerTag, headerTitle, headerDesc], { opacity: 0, y: 20 });
      gsap.set(cards, { opacity: 0, y: 30 });

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
        .to(headerDesc, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3);

      // 3. Formats Cards (staggered entrance)
      if (cards.length) {
        tl.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.15,
          ease: 'power2.out'
        }, 0.35);
      }

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
              cards.forEach(function (card) { card.style.opacity = '1'; });
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      observer.observe(section);
    }
  }

  // Initialize once DOM is ready
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
