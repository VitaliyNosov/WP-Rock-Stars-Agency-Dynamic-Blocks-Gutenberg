/**
 * Section 21: Services Grid GSAP Interactions
 */
function initServicesGrid() {
  const section = document.querySelector('#services-grid');
  if (!section) return;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Header entrance
  const header = section.querySelector('.services-grid-header');
  if (header) {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 88%',
        once: true
      },
      opacity: 0,
      y: 25,
      duration: 0.7,
      ease: 'power2.out'
    });
  }

  // Cards staggered entrance
  const cards = section.querySelectorAll('.services-card-outer');
  if (cards.length > 0) {
    gsap.from(cards, {
      scrollTrigger: {
        trigger: section.querySelector('.services-cards-grid'),
        start: 'top 82%',
        once: true
      },
      opacity: 0,
      y: 40,
      duration: 0.65,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    });
  }
}

document.addEventListener('DOMContentLoaded', initServicesGrid);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initServicesGrid();
}

