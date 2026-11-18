/**
 * Section 17: Services Accordion Controller (GSAP)
 * Strictly matches Rock Stars Agency Dev Spec (gsap-services-accordion)
 */

(function () {
  'use strict';

  function initServicesAccordion() {
    const accSection = document.getElementById('services-accordion');
    if (!accSection) return;

    const accContainer = accSection.querySelector('[data-acc]');
    if (!accContainer) return;

    const items = Array.from(accContainer.querySelectorAll('[data-acc-item]'));
    if (!items.length) return;

    let cur = 0;
    let tl = null;

    // Number Counter Count-Up Helper
    function animateCounter(element, targetNum, suffix = '', duration = 0.65) {
      if (!element) return;
      const isNegative = String(targetNum).startsWith('-');
      const cleanNum = parseFloat(String(targetNum).replace(/[^0-9.]/g, ''));
      const obj = { val: 0 };

      gsap.to(obj, {
        val: cleanNum,
        duration: duration,
        ease: 'power2.out',
        onUpdate: () => {
          const formatted = cleanNum % 1 !== 0 ? obj.val.toFixed(1) : Math.round(obj.val);
          element.textContent = `${isNegative ? '-' : ''}${formatted}${suffix}`;
        }
      });
    }

    // Prepare Sparklines (Compute length & set dasharray)
    function setupSparkline(item) {
      const path = item.querySelector('.acc-spark-path');
      if (!path) return;
      const len = path.getTotalLength ? path.getTotalLength() : 210;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    }

    // Set Accessible & DOM State for an item
    function setItemState(item, isOpen) {
      item.setAttribute('data-state', isOpen ? 'open' : 'closed');
      item.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      const panel = item.querySelector('.acc-panel-body');
      const stripBtn = item.querySelector('.acc-strip-btn');

      if (isOpen) {
        if (panel) {
          panel.removeAttribute('inert');
          panel.removeAttribute('aria-hidden');
        }
        if (stripBtn) {
          stripBtn.setAttribute('tabindex', '-1');
        }
      } else {
        if (panel) {
          panel.setAttribute('inert', '');
          panel.setAttribute('aria-hidden', 'true');
        }
        if (stripBtn) {
          stripBtn.removeAttribute('tabindex');
        }
      }
    }

    // Open Target Service by Index
    function openService(next, immediate = false) {
      if (next === cur && !immediate) return;
      if (next < 0 || next >= items.length) return;

      const from = items[cur];
      const to = items[next];
      const isDesktop = window.innerWidth >= 1024;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Kill active timeline (retargeting, never queue)
      if (tl) {
        tl.kill();
        tl = null;
      }

      setItemState(from, false);
      setItemState(to, true);
      cur = next;

      // Elements inside target item
      const toReveals = to.querySelectorAll('[data-reveal]');
      const sparkPath = to.querySelector('.acc-spark-path');
      const metricValEl = to.querySelector('.acc-metric-val');
      const ringCircle = to.querySelector('.acc-ring-circle');

      // Metric Data
      const targetMetric = metricValEl ? metricValEl.getAttribute('data-target') : null;
      const metricSuffix = metricValEl ? (metricValEl.getAttribute('data-suffix') || '') : '';

      // Ring Target Offset (circle circumference = 2 * PI * 9 ≈ 56.5)
      // 01 -> 45.2, 02 -> 33.9, 03 -> 22.6, 04 -> 11.3, 05 -> 0.0
      const ringOffsets = [45.2, 33.9, 22.6, 11.3, 0.0];
      const targetRingOffset = ringOffsets[next] !== undefined ? ringOffsets[next] : 0;

      // Immediate State (e.g. init or deep-link)
      if (immediate || prefersReduced) {
        items.forEach((item, idx) => {
          if (idx === next) {
            if (isDesktop) {
              gsap.set(item, { flexGrow: 1, flexBasis: 0 });
            } else {
              gsap.set(item, { clearProps: 'all' });
            }
            gsap.set(item.querySelectorAll('[data-reveal]'), { autoAlpha: 1, y: 0 });
          } else {
            if (isDesktop) {
              gsap.set(item, { flexGrow: 0, flexBasis: 88 });
            } else {
              gsap.set(item, { clearProps: 'all' });
            }
            gsap.set(item.querySelectorAll('[data-reveal]'), { autoAlpha: 0, y: -8 });
          }
        });

        if (sparkPath) gsap.set(sparkPath, { strokeDashoffset: 0 });
        if (ringCircle) gsap.set(ringCircle, { strokeDashoffset: targetRingOffset });
        return;
      }

      // Desktop GSAP Timeline (Horizontal Accordion)
      if (isDesktop) {
        const fromReveals = from.querySelectorAll('[data-reveal]');

        tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            tl = null;
          }
        });

        // 1. Exit old content
        tl.to(fromReveals, {
          autoAlpha: 0,
          y: -8,
          duration: 0.25,
          stagger: 0.03,
          ease: 'power2.in'
        }, 0);

        // 2. Collapse old panel & Expand new panel
        tl.to(from, {
          flexGrow: 0,
          flexBasis: 88,
          duration: 0.7,
          ease: 'power3.inOut'
        }, 0.1);

        tl.to(to, {
          flexGrow: 1,
          flexBasis: 0,
          duration: 0.7,
          ease: 'power3.inOut'
        }, 0.1);

        // 3. Reveal new content
        tl.fromTo(toReveals, {
          autoAlpha: 0,
          y: 16
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power3.out'
        }, 0.55);

        // 4. Draw sparkline curve
        if (sparkPath) {
          const len = sparkPath.getTotalLength ? sparkPath.getTotalLength() : 210;
          tl.fromTo(sparkPath, {
            strokeDashoffset: len
          }, {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: 'power2.out'
          }, 0.6);
        }

        // 5. Fill progress ring
        if (ringCircle) {
          tl.to(ringCircle, {
            strokeDashoffset: targetRingOffset,
            duration: 0.6,
            ease: 'power2.out'
          }, 0.5);
        }

        // 6. Animate counter number
        if (targetMetric && metricValEl) {
          animateCounter(metricValEl, targetMetric, metricSuffix, 0.65);
        }

      } else {
        // Tablet / Mobile Layout: Vertical Stack Transition
        tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            tl = null;
          }
        });

        tl.fromTo(toReveals, {
          autoAlpha: 0,
          y: 12
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05
        }, 0.1);

        if (sparkPath) {
          const len = sparkPath.getTotalLength ? sparkPath.getTotalLength() : 210;
          tl.fromTo(sparkPath, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.6 }, 0.2);
        }

        if (targetMetric && metricValEl) {
          animateCounter(metricValEl, targetMetric, metricSuffix, 0.6);
        }
      }
    }

    // Attach Event Listeners
    items.forEach((item, idx) => {
      setupSparkline(item);

      // Click on closed strip button
      const stripBtn = item.querySelector('.acc-strip-btn');
      if (stripBtn) {
        stripBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openService(idx);
        });
      }

      // Keyboard support: Enter / Space opens, Arrows navigate
      item.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'Enter' || e.key === ' ') {
          if (item.getAttribute('data-state') === 'closed') {
            e.preventDefault();
            openService(idx);
          }
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIdx = (idx + 1) % items.length;
          items[nextIdx].querySelector('.acc-strip-btn')?.focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIdx = (idx - 1 + items.length) % items.length;
          items[prevIdx].querySelector('.acc-strip-btn')?.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0].querySelector('.acc-strip-btn')?.focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1].querySelector('.acc-strip-btn')?.focus();
        }
      });

      // Prev / Next button click handlers (inside open panel)
      const prevBtn = item.querySelector('.acc-nav-prev');
      const nextBtn = item.querySelector('.acc-nav-next');

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openService((cur - 1 + items.length) % items.length);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openService((cur + 1) % items.length);
        });
      }
    });

    // Touch Swipe on Open Panel (Mobile)
    let touchStartX = 0;
    let touchEndX = 0;
    accContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    accContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          openService((cur + 1) % items.length);
        } else {
          openService((cur - 1 + items.length) % items.length);
        }
      }
    }, { passive: true });

    // Handle Deep-Links (#services=seo, #services-accordion=ads, etc.)
    function checkDeepLink() {
      const hash = window.location.hash.toLowerCase();
      if (!hash) return;

      const idMap = {
        redesign: 0,
        integrations: 1,
        plugins: 1,
        seo: 2,
        ads: 3,
        support: 4
      };

      for (const [key, index] of Object.entries(idMap)) {
        if (hash.includes(key)) {
          openService(index, true);
          break;
        }
      }
    }

    // Responsive Resize Listener
    let currentIsDesktop = window.innerWidth >= 1024;
    window.addEventListener('resize', () => {
      const newIsDesktop = window.innerWidth >= 1024;
      if (newIsDesktop !== currentIsDesktop) {
        currentIsDesktop = newIsDesktop;
        openService(cur, true);
      }
    });

    // ScrollTrigger Entrance Animation (Runs once when section enters viewport)
    if (window.ScrollTrigger && window.gsap) {
      ScrollTrigger.create({
        trigger: accSection,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.fromTo(items, {
            autoAlpha: 0,
            y: 24
          }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            onComplete: () => {
              openService(cur, false);
            }
          });
        }
      });
    }

    // Initialize Default State
    openService(0, true);
    checkDeepLink();
    window.addEventListener('hashchange', checkDeepLink);

    // Export public API
    window.servicesAccordion = {
      open: openService,
      next: () => openService((cur + 1) % items.length),
      prev: () => openService((cur - 1 + items.length) % items.length),
      getCurrent: () => cur
    };
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesAccordion);
  } else {
    initServicesAccordion();
  }
})();

