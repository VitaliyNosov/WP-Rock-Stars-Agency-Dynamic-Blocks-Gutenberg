/**
 * Results Section (Section 13: Growth you can measure)
 * Handles:
 * 1. Testimonials slider (6 slides, auto-play with pause-on-hover, dot navigation,
 *    arrow buttons, link-click behavior, swipe/keyboard support).
 * 2. GSAP ScrollTrigger entrance animations for header, case study card and metrics.
 * Matches design 13.png.
 */

(function () {
  'use strict';

  function initSlider() {
    const section = document.getElementById('results');
    if (!section) return;

    const slides = section.querySelectorAll('.testimonial-slide');
    const dots = section.querySelectorAll('.t-dot');
    const prevBtn = section.querySelector('.t-prev');
    const nextBtn = section.querySelector('.t-next');
    const sliderCard = section.querySelector('.testimonial-card-outer');

    if (!slides.length) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    const AUTOPLAY_INTERVAL = 5500;

    function goToSlide(newIndex) {
      if (newIndex < 0) {
        newIndex = slides.length - 1;
      } else if (newIndex >= slides.length) {
        newIndex = 0;
      }

      slides.forEach(function (slide, idx) {
        if (idx === newIndex) {
          slide.classList.remove('hidden');
          slide.classList.add('active');
          if (window.gsap) {
            gsap.fromTo(
              slide,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
            );
          }
        } else {
          slide.classList.remove('active');
          slide.classList.add('hidden');
        }
      });

      dots.forEach(function (dot, idx) {
        if (idx === newIndex) {
          dot.classList.add('active');
          dot.classList.remove('bg-[#2A2A2A]');
          dot.classList.add('bg-[#F0F0F0]');
        } else {
          dot.classList.remove('active');
          dot.classList.remove('bg-[#F0F0F0]');
          dot.classList.add('bg-[#2A2A2A]');
        }
      });

      currentIndex = newIndex;
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Arrow navigation
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
        startAutoplay();
      });
    }

    // Dot navigation
    dots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(targetIndex)) {
          goToSlide(targetIndex);
          startAutoplay();
        }
      });
    });

    // Pause on hover
    if (sliderCard) {
      sliderCard.addEventListener('mouseenter', stopAutoplay);
      sliderCard.addEventListener('mouseleave', startAutoplay);
    }

    // Keyboard navigation when card or controls are focused
    sliderCard.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        startAutoplay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        startAutoplay();
      }
    });

    // Start auto-rotation
    startAutoplay();
  }

  function initAnimations() {
    const section = document.getElementById('results');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const badge = section.querySelector('.section-badge-indicator');
    const headerTag = section.querySelector('.results-tag');
    const headerTitle = section.querySelector('.results-title');
    const headerDesc = section.querySelector('.results-desc');
    const caseCard = section.querySelector('.results-case-card-outer');
    const mainMetric = section.querySelector('.case-main-metric');
    const subMetrics = section.querySelectorAll('.sub-metric-item');
    const sliderWrapper = section.querySelector('.testimonial-slider-wrapper');

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      if (badge) gsap.set(badge, { opacity: 0, x: -15 });
      gsap.set([headerTag, headerTitle, headerDesc], { opacity: 0, y: 22 });
      if (caseCard) gsap.set(caseCard, { opacity: 0, y: 35 });
      if (mainMetric) gsap.set(mainMetric, { opacity: 0, scale: 0.95 });
      if (subMetrics.length) gsap.set(subMetrics, { opacity: 0, y: 15 });
      if (sliderWrapper) gsap.set(sliderWrapper, { opacity: 0, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: true
        }
      });

      if (badge) {
        tl.to(badge, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0);
      }

      tl.to(headerTag, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.1)
        .to(headerTitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.2)
        .to(headerDesc, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.35);

      if (caseCard) {
        tl.to(caseCard, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.45);
      }

      if (mainMetric) {
        tl.to(mainMetric, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, 0.65);
      }

      if (subMetrics.length) {
        tl.to(subMetrics, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out' }, 0.8);
      }

      if (sliderWrapper) {
        tl.to(sliderWrapper, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.95);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initSlider();
      initAnimations();
    });
  } else {
    initSlider();
    initAnimations();
  }
})();
