/**
 * Docs Dev Landing - Section 04 (Services: What We Do)
 * Handles GSAP ScrollTrigger entrance animation and micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initServicesSection();
});

function initServicesSection() {
  const section = document.getElementById('services');
  if (!section) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Refresh ScrollTrigger once images/fonts are loaded
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    initServicesEntranceAnimation(section);
  }
}

/**
 * GSAP ScrollTrigger entrance animation for Section 04
 */
function initServicesEntranceAnimation(section) {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      gsap.set('#services .section-badge-indicator, #services .services-tag, #services .services-title, #services .services-desc, #services .services-divider, #services .service-item', {
        clearProps: 'all'
      });
    }
  });

  // Section badge indicator
  tl.from('#services .section-badge-indicator', {
    y: -15,
    opacity: 0,
    duration: 0.6,
    immediateRender: false
  }, 0);

  // Category Tag
  tl.from('#services .services-tag', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    immediateRender: false
  }, 0.1);

  // Title
  tl.from('#services .services-title', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    immediateRender: false
  }, 0.2);

  // Description
  tl.from('#services .services-desc', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    immediateRender: false
  }, 0.3);

  // Horizontal divider lines draw in
  tl.from('#services .services-divider', {
    scaleX: 0,
    opacity: 0,
    duration: 0.75,
    stagger: 0.1,
    ease: 'power2.out',
    immediateRender: false
  }, 0.35);

  // Service items stagger in
  tl.from('#services .service-item', {
    y: 24,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.out',
    immediateRender: false
  }, 0.45);

  // Trigger via ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: () => tl.play()
    });
  }

  // Native IntersectionObserver fallback to guarantee animation always plays when scrolled into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && tl.progress() === 0) {
          tl.play();
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(section);
  } else {
    tl.play();
  }
}
