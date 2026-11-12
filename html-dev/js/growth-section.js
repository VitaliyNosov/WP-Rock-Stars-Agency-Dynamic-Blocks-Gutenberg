/**
 * Growth Section (Section 10: Ads, Email & Reports)
 * Handles interactive hover states, funnel stage animations,
 * 12-month bar chart growth animations, and GSAP ScrollTrigger
 * with an IntersectionObserver fallback.
 * Matches design 10.png.
 */

(function () {
  'use strict';

  function initInteractivity() {
    const section = document.getElementById('growth');
    if (!section) return;

    // Funnel stage hover interactions
    const funnelStages = section.querySelectorAll('.funnel-stage-group');
    funnelStages.forEach(function (stage) {
      stage.addEventListener('mouseenter', function () {
        const outer = stage.querySelector('.funnel-stage-outer');
        const inner = stage.querySelector('.funnel-stage-inner');
        if (outer) outer.style.stroke = '#F0F0F0';
        if (inner) inner.style.stroke = '#A0A0A0';
      });

      stage.addEventListener('mouseleave', function () {
        const outer = stage.querySelector('.funnel-stage-outer');
        const inner = stage.querySelector('.funnel-stage-inner');
        if (outer) outer.style.stroke = '';
        if (inner) inner.style.stroke = '';
      });
    });

    // Bar chart hover interactions
    const bars = section.querySelectorAll('.reports-bar-rect');
    bars.forEach(function (bar) {
      bar.addEventListener('mouseenter', function () {
        if (!bar.classList.contains('bar-active')) {
          bar.style.fill = '#3A3A3A';
        }
      });
      bar.addEventListener('mouseleave', function () {
        if (!bar.classList.contains('bar-active')) {
          bar.style.fill = '';
        }
      });
    });
  }

  function initAnimations() {
    const section = document.getElementById('growth');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const badge = section.querySelector('.section-badge-indicator');
    const headerTag = section.querySelector('.growth-tag');
    const headerTitle = section.querySelector('.growth-title');
    const headerDesc = section.querySelector('.growth-desc');
    const funnelStages = section.querySelectorAll('.funnel-stage-group');
    const reportCard = section.querySelector('.reports-card-outer');
    const reportStats = section.querySelectorAll('.reports-stat');
    const bars = section.querySelectorAll('.reports-bar-rect');

    if (prefersReducedMotion) {
      // Instantly show everything without animation
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Set initial states
      if (badge) gsap.set(badge, { opacity: 0, x: -15 });
      gsap.set([headerTag, headerTitle, headerDesc], { opacity: 0, y: 20 });
      gsap.set(funnelStages, { opacity: 0, y: 15, scale: 0.96, transformOrigin: '50% 50%' });
      if (reportCard) gsap.set(reportCard, { opacity: 0, y: 25 });
      gsap.set(reportStats, { opacity: 0, y: 12 });
      
      // Store target bar heights and set to zero initial height
      bars.forEach(function (bar) {
        const targetH = parseFloat(bar.getAttribute('data-target-height') || '30');
        const targetY = parseFloat(bar.getAttribute('data-target-y') || '110');
        gsap.set(bar, {
          attr: { y: 140, height: 0 },
          opacity: 0.4
        });
        bar._targetH = targetH;
        bar._targetY = targetY;
      });

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

      // 2. Header
      tl.to(headerTag, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.1)
        .to(headerTitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.2)
        .to(headerDesc, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3);

      // 3. Funnel Stages (staggered from top to bottom)
      if (funnelStages.length) {
        tl.to(funnelStages, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.12,
          ease: 'back.out(1.2)'
        }, 0.35);
      }

      // 4. Report Card container
      if (reportCard) {
        tl.to(reportCard, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out'
        }, 0.4);
      }

      // 5. Report 3 Stats
      if (reportStats.length) {
        tl.to(reportStats, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }, 0.6);
      }

      // 6. Report 12 Bars (rising from bottom with stagger)
      bars.forEach(function (bar, idx) {
        tl.to(bar, {
          attr: {
            y: bar._targetY,
            height: bar._targetH
          },
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out'
        }, 0.65 + idx * 0.05);
      });

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
              funnelStages.forEach(function (s) { s.style.opacity = '1'; });
              if (reportCard) reportCard.style.opacity = '1';
              reportStats.forEach(function (st) { st.style.opacity = '1'; });
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
