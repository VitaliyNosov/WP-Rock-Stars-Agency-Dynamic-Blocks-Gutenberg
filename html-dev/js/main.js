/**
 * Docs Dev Landing - Section 01 (Hero) Interactive Script
 * Powered by GSAP 3.14.2 & ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    initHeroAnimations();
  }
});

function initHeroAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Chart Elements
  const chartLine = document.getElementById('chart-line');
  const chartArea = document.getElementById('chart-area');
  const chartEndpoint = document.getElementById('chart-endpoint');
  const aiProgressBar = document.getElementById('ai-progress-bar');
  const pagespeedRing = document.getElementById('pagespeed-ring');
  const miniBars = document.querySelectorAll('.mini-bar');

  // Counters
  const counterMetric = document.getElementById('counter-metric');
  const counterPagespeed = document.getElementById('counter-pagespeed');
  const counterAi = document.getElementById('counter-ai');
  const counterBooking = document.getElementById('counter-booking');

  if (prefersReducedMotion) {
    // Show static final state without animation for accessibility
    if (chartLine) chartLine.style.strokeDashoffset = '0';
    if (chartArea) chartArea.style.opacity = '0.9';
    if (aiProgressBar) aiProgressBar.style.width = '72%';
    if (pagespeedRing) pagespeedRing.style.strokeDashoffset = '6.6';
    return;
  }

  // Prepare SVG line path length for drawing animation
  let pathLength = 500;
  if (chartLine && typeof chartLine.getTotalLength === 'function') {
    pathLength = chartLine.getTotalLength();
    gsap.set(chartLine, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });
  }

  if (chartArea) {
    gsap.set(chartArea, { opacity: 0 });
  }

  if (chartEndpoint) {
    gsap.set(chartEndpoint, { scale: 0, transformOrigin: 'center center' });
  }

  if (aiProgressBar) {
    gsap.set(aiProgressBar, { width: '0%' });
  }

  if (pagespeedRing) {
    gsap.set(pagespeedRing, { strokeDashoffset: 110 });
  }

  if (miniBars.length > 0) {
    gsap.set(miniBars, { scaleY: 0, transformOrigin: 'bottom' });
  }

  // Create main sequential timeline
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });

  // Background subtle zoom-in settling
  tl.fromTo('.hero-bg-layer', 
    { scale: 1.05, opacity: 0.8 }, 
    { scale: 1.01, opacity: 1, duration: 1.4, ease: 'power2.out' }, 
    0
  );

  // Left Column Content Stagger
  tl.from('#hero-badge', {
    y: -20,
    opacity: 0,
    duration: 0.65
  }, 0.2);

  tl.from('#hero-title', {
    y: 35,
    opacity: 0,
    duration: 0.85
  }, 0.35);

  tl.from('#hero-subtitle', {
    y: 25,
    opacity: 0,
    duration: 0.75
  }, 0.55);

  tl.from('#hero-actions', {
    y: 20,
    opacity: 0,
    duration: 0.7
  }, 0.7);

  tl.from('#hero-trust', {
    y: 15,
    opacity: 0,
    duration: 0.6
  }, 0.85);

  // Right Column Card Entrance
  tl.from('#hero-card', {
    y: 40,
    scale: 0.95,
    opacity: 0,
    duration: 1.0,
    ease: 'power3.out'
  }, 0.4);

  // Draw chart curve line
  if (chartLine) {
    tl.to(chartLine, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: 'power2.inOut'
    }, 0.9);
  }

  // Fade in chart gradient fill area
  if (chartArea) {
    tl.to(chartArea, {
      opacity: 0.9,
      duration: 1.0,
      ease: 'power1.out'
    }, 1.4);
  }

  // Pop in endpoint circle dot
  if (chartEndpoint) {
    tl.to(chartEndpoint, {
      scale: 1,
      duration: 0.6,
      ease: 'back.out(2.2)'
    }, 1.9);
  }

  // Animate PageSpeed ring
  if (pagespeedRing) {
    tl.to(pagespeedRing, {
      strokeDashoffset: 6.6,
      duration: 1.1,
      ease: 'power2.out'
    }, 1.1);
  }

  // Animate AI progress bar fill
  if (aiProgressBar) {
    tl.to(aiProgressBar, {
      width: '72%',
      duration: 1.1,
      ease: 'power2.out'
    }, 1.2);
  }

  // Stagger animate 6 mini bars
  if (miniBars.length > 0) {
    tl.to(miniBars, {
      scaleY: 1,
      duration: 0.5,
      stagger: 0.07,
      ease: 'back.out(1.8)'
    }, 1.2);
  }

  // Number Counter Animations
  animateCounter(counterMetric, 0, 68, 1200, 700);
  animateCounter(counterPagespeed, 0, 94, 1300, 900);
  animateCounter(counterAi, 0, 72, 1200, 900);
  animateCounter(counterBooking, 0, 38, 1100, 900);

  // 3D subtle tilt on desktop hover
  initCardParallax();
}

/**
 * Animated number counter helper
 */
function animateCounter(element, start, end, duration, delay) {
  if (!element) return;
  setTimeout(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(eased * (end - start) + start);
      element.textContent = current;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end;
      }
    };
    window.requestAnimationFrame(step);
  }, delay);
}

/**
 * Interactive 3D micro-parallax for the card on desktop
 */
function initCardParallax() {
  const heroSection = document.getElementById('hero');
  const card = document.getElementById('hero-card');

  if (!heroSection || !card || window.innerWidth < 1024) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - cardCenterX) / (window.innerWidth / 2);
    const deltaY = (e.clientY - cardCenterY) / (window.innerHeight / 2);

    const rotateX = -deltaY * 5;
    const rotateY = deltaX * 6;

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power1.out'
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });
}
