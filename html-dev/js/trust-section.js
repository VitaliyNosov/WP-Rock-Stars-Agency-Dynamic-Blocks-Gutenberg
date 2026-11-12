/**
 * Docs Dev Landing - Section 02 (Trust: Logos Slider & Stats Counter)
 * Handles infinite logo marquee interactions and animated data counters on scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTrustSection();
});

function initTrustSection() {
  const section = document.getElementById('trust');
  if (!section) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize Logo Slider / Marquee
  initLogoMarquee();

  // Initialize Counter Animation with Scroll Trigger
  initStatsCounters(section, prefersReducedMotion);

  // Initialize Section Entrance Animation with GSAP if available
  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    initTrustEntranceAnimation(section);
  }
}

/**
 * Sets up seamless infinite logo marquee
 */
function initLogoMarquee() {
  const container = document.querySelector('.trust-marquee-container');
  const track = document.querySelector('.marquee-track');
  if (!container || !track) return;

  // Pause on hover / focus for accessibility and usability
  container.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  container.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });

  // Touch support for mobile devices
  container.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  container.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  }, { passive: true });
}

/**
 * Smooth counter animation triggered when section is in view
 */
function initStatsCounters(section, prefersReducedMotion) {
  const counterElements = [
    { id: 'counter-stat-sites', target: 120, decimals: 0, duration: 1800 },
    { id: 'counter-stat-pagespeed', target: 94, decimals: 0, duration: 1600 },
    { id: 'counter-stat-traffic', target: 3.2, decimals: 1, duration: 1700 },
    { id: 'counter-stat-audit', target: 48, decimals: 0, duration: 1500 }
  ];

  let hasAnimated = false;

  const runAllCounters = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    counterElements.forEach(({ id, target, decimals, duration }) => {
      const el = document.getElementById(id);
      if (!el) return;

      if (prefersReducedMotion) {
        el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString();
        return;
      }

      animateNumber(el, 0, target, duration, decimals);
    });
  };

  // Use ScrollTrigger if GSAP is available, else IntersectionObserver
  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined' && !prefersReducedMotion) {
    ScrollTrigger.create({
      trigger: '#trust',
      start: 'top 80%',
      once: true,
      onEnter: () => runAllCounters()
    });
  } else {
    // Fallback IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runAllCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(section);
  }
}

/**
 * Animate single counter from start to end with easing
 */
function animateNumber(element, start, end, duration, decimals) {
  let startTime = null;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);

    const currentValue = start + (end - start) * easedProgress;

    if (decimals > 0) {
      element.textContent = currentValue.toFixed(decimals);
    } else {
      element.textContent = Math.floor(currentValue).toString();
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = decimals > 0 ? end.toFixed(decimals) : end.toString();
    }
  }

  requestAnimationFrame(step);
}

/**
 * GSAP entrance animations for section elements
 */
function initTrustEntranceAnimation(section) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
      once: true
    },
    defaults: { ease: 'power3.out' }
  });

  // Badge animation
  tl.from('#trust .section-badge-indicator', {
    y: -15,
    opacity: 0,
    duration: 0.6
  }, 0);

  // Title fade & slide up
  tl.from('.trust-title', {
    y: 30,
    opacity: 0,
    duration: 0.8
  }, 0.1);

  // Marquee container fade in
  tl.from('.trust-marquee-container', {
    opacity: 0,
    y: 20,
    duration: 0.9
  }, 0.25);

  // Stats columns stagger in
  tl.from('.stat-col', {
    y: 35,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12
  }, 0.4);

  // Subtle flash on vertical dividers
  tl.from('.stat-divider', {
    scaleY: 0,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    transformOrigin: 'center center'
  }, 0.5);
}
