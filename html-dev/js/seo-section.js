/**
 * SEO & Core Web Vitals Section (Section 07)
 * Handles chart drawing animations, vital progress bar fills,
 * and GSAP entrance animations with IntersectionObserver fallback.
 * Matches design 7.png.
 */

(function () {
  'use strict';

  function initChartAnimation() {
    const section = document.getElementById('seo');
    if (!section) return;

    const chartLine = section.querySelector('#seo-chart-line');
    const chartArea = section.querySelector('#seo-chart-area');
    const vitalFills = section.querySelectorAll('.seo-vital-fill');

    // Pre-calculate line length for stroke-dash animation
    if (chartLine && typeof chartLine.getTotalLength === 'function') {
      try {
        const length = chartLine.getTotalLength();
        chartLine.style.strokeDasharray = length;
        chartLine.style.strokeDashoffset = length;
      } catch (e) {
        // Fallback if SVG measurement fails in some contexts
        chartLine.style.strokeDasharray = '1000';
        chartLine.style.strokeDashoffset = '1000';
      }
    }

    // Set initial zero widths on vital fills so they animate cleanly
    vitalFills.forEach(function (fill) {
      fill.style.width = '0%';
    });
  }

  function initAnimations() {
    const section = document.getElementById('seo');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const badge = section.querySelector('.section-badge-indicator');
    const headerTag = section.querySelector('.seo-tag');
    const headerTitle = section.querySelector('.seo-title');
    const headerDesc = section.querySelector('.seo-desc');
    const chartCard = section.querySelector('.lg\\:col-span-7');
    const chartLine = section.querySelector('#seo-chart-line');
    const chartArea = section.querySelector('#seo-chart-area');
    const growthBadge = section.querySelector('.seo-growth-badge-outer');
    const vitalCards = section.querySelectorAll('.seo-vital-card-outer');
    const vitalFills = section.querySelectorAll('.seo-vital-fill');
    const tableCard = section.querySelector('.seo-container > .seo-card-outer:last-child');
    const tableRows = section.querySelectorAll('.seo-table-row');

    if (prefersReducedMotion) {
      // Instantly show everything
      vitalFills.forEach(function (fill) {
        fill.style.width = fill.getAttribute('data-target-width') || '88%';
      });
      if (chartLine) chartLine.style.strokeDashoffset = '0';
      if (chartArea) chartArea.style.opacity = '1';
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Set initial states
      if (badge) gsap.set(badge, { opacity: 0, x: -15 });
      gsap.set([headerTag, headerTitle, headerDesc], { opacity: 0, y: 20 });
      if (chartCard) gsap.set(chartCard, { opacity: 0, y: 24 });
      if (growthBadge) gsap.set(growthBadge, { opacity: 0, scale: 0.8 });
      if (chartArea) gsap.set(chartArea, { opacity: 0 });
      gsap.set(vitalCards, { opacity: 0, x: 24 });
      if (tableCard) gsap.set(tableCard, { opacity: 0, y: 30 });
      gsap.set(tableRows, { opacity: 0, y: 12 });

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

      // 3. Growth Chart Card & Curve
      if (chartCard) {
        tl.to(chartCard, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.35);
      }

      if (chartLine) {
        tl.to(chartLine, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: 'power2.out'
        }, 0.5);
      }

      if (chartArea) {
        tl.to(chartArea, {
          opacity: 1,
          duration: 1.0,
          ease: 'power1.inOut'
        }, 0.7);
      }

      if (growthBadge) {
        tl.to(growthBadge, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.5)'
        }, 0.6);
      }

      // 4. Core Web Vitals Cards & Progress Bars
      if (vitalCards.length) {
        tl.to(vitalCards, {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: 'power2.out'
        }, 0.45);
      }

      vitalFills.forEach(function (fill, idx) {
        const target = fill.getAttribute('data-target-width') || '88%';
        tl.to(fill, {
          width: target,
          duration: 1.1,
          ease: 'power2.out'
        }, 0.7 + idx * 0.12);
      });

      // 5. Table Card & Rows
      if (tableCard) {
        tl.to(tableCard, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.75);
      }

      if (tableRows.length) {
        tl.to(tableRows, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out'
        }, 0.85);
      }

    } else {
      // Fallback with IntersectionObserver
      const observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (badge) badge.style.opacity = '1';
              if (headerTag) headerTag.style.opacity = '1';
              if (headerTitle) headerTitle.style.opacity = '1';
              if (headerDesc) headerDesc.style.opacity = '1';
              if (chartCard) chartCard.style.opacity = '1';
              if (chartLine) chartLine.style.strokeDashoffset = '0';
              if (chartArea) chartArea.style.opacity = '1';
              if (growthBadge) {
                growthBadge.style.opacity = '1';
                growthBadge.style.transform = 'scale(1)';
              }
              vitalCards.forEach(function (c) { c.style.opacity = '1'; });
              vitalFills.forEach(function (fill) {
                fill.style.width = fill.getAttribute('data-target-width') || '88%';
              });
              if (tableCard) tableCard.style.opacity = '1';
              tableRows.forEach(function (r) { r.style.opacity = '1'; });

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
      initChartAnimation();
      initAnimations();
    });
  } else {
    initChartAnimation();
    initAnimations();
  }
})();
