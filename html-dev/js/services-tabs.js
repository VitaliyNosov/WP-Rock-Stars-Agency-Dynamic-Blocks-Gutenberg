/**
 * Section 20: Services Interactive Tabs (GSAP 3)
 * Rock Stars Agency Design System
 * 
 * Features:
 * - Smooth GSAP cross-fade transition between panels without height jumps
 * - Keyboard accessibility (Left/Right, Up/Down, Home/End, Space/Enter)
 * - ScrollTrigger section entrance
 */

(function () {
  'use strict';

  function initServicesTabs() {
    const section = document.getElementById('services-tabs');
    if (!section) return;

    const tabButtons = Array.from(section.querySelectorAll('.tab-btn'));
    const tabPanels = Array.from(section.querySelectorAll('.tab-panel'));
    if (!tabButtons.length || !tabPanels.length) return;

    let currentIndex = 0;
    let isTransitioning = false;

    // Attach click events
    tabButtons.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (idx !== currentIndex && !isTransitioning) {
          switchTab(idx);
        }
      });

      // Keyboard navigation
      btn.addEventListener('keydown', (e) => {
        let targetIndex = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          targetIndex = (currentIndex + 1) % tabButtons.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          targetIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIndex = tabButtons.length - 1;
        }

        if (targetIndex !== null) {
          tabButtons[targetIndex].focus();
          switchTab(targetIndex);
        }
      });
    });

    function switchTab(newIndex) {
      if (newIndex === currentIndex || isTransitioning) return;
      isTransitioning = true;

      const prevIndex = currentIndex;
      currentIndex = newIndex;

      // Update button states
      tabButtons.forEach((btn, idx) => {
        const isActive = idx === newIndex;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      const oldPanel = tabPanels[prevIndex];
      const newPanel = tabPanels[newIndex];

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          onComplete: () => {
            isTransitioning = false;
          }
        });

        // Fade out old panel
        if (oldPanel) {
          tl.to(oldPanel, {
            autoAlpha: 0,
            y: -6,
            duration: 0.16,
            ease: 'power2.in',
            onComplete: () => {
              oldPanel.style.display = 'none';
              oldPanel.classList.remove('active');
            }
          });
        }

        // Fade in new panel
        if (newPanel) {
          tl.set(newPanel, {
            display: 'block',
            autoAlpha: 0,
            y: 8
          });

          tl.to(newPanel, {
            autoAlpha: 1,
            y: 0,
            duration: 0.28,
            ease: 'power2.out',
            onStart: () => {
              newPanel.classList.add('active');
            }
          });

          // Pop metric box slightly
          const metricVal = newPanel.querySelector('.tab-metric-val');
          if (metricVal) {
            tl.fromTo(metricVal, 
              { scale: 0.94, opacity: 0.7 }, 
              { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.5)' }, 
              '-=0.15'
            );
          }
        }
      } else {
        // Fallback without GSAP
        if (oldPanel) {
          oldPanel.style.display = 'none';
          oldPanel.style.opacity = '0';
          oldPanel.classList.remove('active');
        }
        if (newPanel) {
          newPanel.style.display = 'block';
          newPanel.style.opacity = '1';
          newPanel.classList.add('active');
        }
        isTransitioning = false;
      }
    }

    // ScrollTrigger entrance animation for the section
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const header = section.querySelector('.tabs-header');
      if (header) {
        gsap.from(header.children, {
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          y: 20,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out'
        });
      }

      const card = section.querySelector('.tabs-card-wrap');
      if (card) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesTabs);
  } else {
    initServicesTabs();
  }
})();

