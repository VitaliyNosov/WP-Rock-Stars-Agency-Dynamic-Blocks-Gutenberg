/**
 * FAQ Section (Section 15: Questions before you book?)
 * Smooth, zero-jitter CSS grid accordion transitions.
 * Ensures the top first item is open by default.
 * Matches design 15.png.
 */

(function () {
  'use strict';

  function initAccordion() {
    const section = document.getElementById('faq');
    if (!section) return;

    const items = Array.from(section.querySelectorAll('.faq-item-outer'));
    if (!items.length) return;

    // Ensure the top first item is strictly open by default
    items.forEach(function (item, index) {
      const icon = item.querySelector('.faq-icon');
      if (index === 0) {
        item.classList.add('active');
        item.setAttribute('aria-expanded', 'true');
        if (icon) icon.innerHTML = '&minus;';
      } else {
        item.classList.remove('active');
        item.setAttribute('aria-expanded', 'false');
        if (icon) icon.innerHTML = '&plus;';
      }
    });

    function selectItem(clickedItem) {
      const isCurrentlyActive = clickedItem.classList.contains('active');

      items.forEach(function (item) {
        const icon = item.querySelector('.faq-icon');
        if (item === clickedItem) {
          if (isCurrentlyActive) {
            // If already open, keep it open (or collapse if clicked again)
            item.classList.remove('active');
            item.setAttribute('aria-expanded', 'false');
            if (icon) icon.innerHTML = '&plus;';
          } else {
            // Open clicked item
            item.classList.add('active');
            item.setAttribute('aria-expanded', 'true');
            if (icon) icon.innerHTML = '&minus;';
          }
        } else {
          // Close other items
          item.classList.remove('active');
          item.setAttribute('aria-expanded', 'false');
          if (icon) icon.innerHTML = '&plus;';
        }
      });
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        selectItem(item);
      });

      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectItem(item);
        }
      });
    });
  }

  function initAnimations() {
    const section = document.getElementById('faq');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const badge = section.querySelector('.section-badge-indicator');
    const headerTag = section.querySelector('.faq-tag');
    const headerTitle = section.querySelector('.faq-title');
    const headerDesc = section.querySelector('.faq-desc');
    const specialistCard = section.querySelector('.faq-specialist-outer');
    const items = section.querySelectorAll('.faq-item-outer');

    if (prefersReducedMotion) {
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Set initial states
      if (badge) gsap.set(badge, { opacity: 0, x: -15 });
      gsap.set([headerTag, headerTitle, headerDesc], { opacity: 0, y: 15 });
      if (specialistCard) gsap.set(specialistCard, { opacity: 0, y: 15 });
      gsap.set(items, { opacity: 0, y: 15 });

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

      // 3. Specialist Card
      if (specialistCard) {
        tl.to(specialistCard, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, 0.35);
      }

      // 4. Accordion items (staggered)
      if (items.length) {
        tl.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out'
        }, 0.4);
      }

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
              if (specialistCard) specialistCard.style.opacity = '1';
              items.forEach(function (item) { item.style.opacity = '1'; });
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
      initAccordion();
      initAnimations();
    });
  } else {
    initAccordion();
    initAnimations();
  }
})();
