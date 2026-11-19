/**
 * Section 19: Growth Services Cards Grid (GSAP 3 + ScrollTrigger)
 * Rock Stars Agency Design System
 * 
 * Features:
 * - ScrollTrigger staggered entrance for cards grid
 * - Smooth hover micro-interaction enhancements
 * - Graceful fallback without GSAP
 */

(function () {
  'use strict';

  function initGrowthCards() {
    const section = document.getElementById('growth-cards');
    if (!section) return;

    const cards = Array.from(section.querySelectorAll('[data-growth-card]'));
    if (!cards.length) return;

    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap !== 'undefined') {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      // Entrance animation for header
      const header = section.querySelector('.growth-cards-header');
      if (header) {
        gsap.from(header.children, {
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          y: 20,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out'
        });
      }

      // Entrance animation for cards
      gsap.from(cards, {
        scrollTrigger: {
          trigger: section.querySelector('.growth-cards-grid') || section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrowthCards);
  } else {
    initGrowthCards();
  }
})();

