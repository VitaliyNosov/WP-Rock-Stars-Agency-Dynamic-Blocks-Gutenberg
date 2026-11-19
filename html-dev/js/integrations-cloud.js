/**
 * Section 24: Integrations Cloud Interactions & GSAP Animations
 */

function initIntegrationsCloud() {
  const section = document.querySelector('#integrations-cloud');
  if (!section) return;

  const pills = section.querySelectorAll('.integration-pill');

  // Pill click interaction to switch active filled state
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(pill, 
          { scale: 0.94 }, 
          { scale: 1, duration: 0.35, ease: 'back.out(2)' }
        );
      }
    });
  });

  // GSAP ScrollTrigger entrance
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const header = section.querySelector('.integrations-header');
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

    if (pills.length > 0) {
      gsap.from(pills, {
        scrollTrigger: {
          trigger: section.querySelector('.integrations-pill-container'),
          start: 'top 85%',
          once: true
        },
        opacity: 0,
        y: 24,
        scale: 0.92,
        stagger: 0.04,
        duration: 0.5,
        ease: 'back.out(1.5)',
        clearProps: 'transform,opacity'
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', initIntegrationsCloud);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initIntegrationsCloud();
}

