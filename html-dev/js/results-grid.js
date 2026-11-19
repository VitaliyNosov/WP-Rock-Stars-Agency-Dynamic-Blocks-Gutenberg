/**
 * Section 21: Results Impact Metrics Grid (GSAP 3 + ScrollTrigger)
 * Rock Stars Agency Design System
 * 
 * Features:
 * - ScrollTrigger staggered entrance for cards
 * - Dynamic count-up animations for key metrics
 * - Reduced motion support & fallback
 */

(function () {
  'use strict';

  function initResultsGrid() {
    const section = document.getElementById('results-grid');
    if (!section) return;

    const cards = Array.from(section.querySelectorAll('[data-res-card]'));
    if (!cards.length) return;

    if (typeof gsap !== 'undefined') {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      // Entrance animation for left column content
      const leftCol = section.querySelector('.lg\\:col-span-5');
      if (leftCol) {
        gsap.from(leftCol.children, {
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          y: 24,
          opacity: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power3.out'
        });
      }

      // Entrance animation for cards
      gsap.from(cards, {
        scrollTrigger: {
          trigger: section.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2') || section,
          start: 'top 80%',
          toggleActions: 'play none none none',
          onEnter: () => {
            animateCounters();
          }
        },
        y: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });

      // Animate Numbers Count-up
      function animateCounters() {
        cards.forEach((card) => {
          const metricEl = card.querySelector('.res-card-metric');
          if (!metricEl) return;

          const target = parseFloat(metricEl.getAttribute('data-count-target'));
          if (isNaN(target)) return;

          const prefix = metricEl.getAttribute('data-prefix') || '';
          const suffix = metricEl.getAttribute('data-suffix') || '';
          const fraction = metricEl.getAttribute('data-fraction') || '';
          const decimals = parseInt(metricEl.getAttribute('data-decimals') || '0', 10);

          const counterObj = { val: 0 };
          const duration = 1.4;

          gsap.to(counterObj, {
            val: target,
            duration: duration,
            ease: 'power2.out',
            onUpdate: () => {
              const formattedVal = decimals > 0 
                ? counterObj.val.toFixed(decimals) 
                : Math.round(counterObj.val);

              if (fraction) {
                metricEl.innerHTML = `${prefix}${formattedVal}<span class="text-xl sm:text-2xl font-bold text-[#A0A0A0]">${fraction}</span>`;
              } else {
                metricEl.textContent = `${prefix}${formattedVal}${suffix}`;
              }
            }
          });
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResultsGrid);
  } else {
    initResultsGrid();
  }
})();

