/**
 * Section 18: Interactive Process Stepper (GSAP 3)
 * Rock Stars Agency Design System
 * 
 * Features:
 * - Two-way sync: Step accordion in right column + Stage summary card in left column
 * - Smooth GSAP height / opacity transitions without layout jumps
 * - Timeline vertical progress track fill
 * - Dynamic 5-segment indicator and circular SVG progress ring
 * - Keyboard navigation (Up/Down arrows, Home/End, Enter, Space)
 */

(function () {
  'use strict';

  function initProcessStepper() {
    const section = document.getElementById('process-stepper');
    if (!section) return;

    const stepItems = Array.from(section.querySelectorAll('.step-item'));
    if (!stepItems.length) return;

    const durationEl = section.querySelector('.step-metric-duration');
    const delivEl = section.querySelector('.step-deliv-text');
    const counterLabel = section.querySelector('.step-counter-label');
    const ringProgress = section.querySelector('.step-ring-progress');
    const segFills = Array.from(section.querySelectorAll('.step-seg-fill'));
    const timelineFill = section.querySelector('.step-timeline-line-fill');

    let currentIndex = 0;
    let isAnimating = false;
    const totalSteps = stepItems.length;

    // Set initial heights and states
    stepItems.forEach((item, idx) => {
      const body = item.querySelector('.step-body');
      const btn = item.querySelector('.step-header-btn');
      const chevron = item.querySelector('.step-chevron-icon svg');

      if (idx === 0) {
        item.classList.add('active');
        if (btn) btn.setAttribute('aria-expanded', 'true');
        if (body) {
          body.style.height = 'auto';
          body.style.opacity = '1';
        }
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      } else {
        item.classList.remove('active');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (body) {
          body.style.height = '0px';
          body.style.opacity = '0';
        }
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }

      // Click handler
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (idx !== currentIndex && !isAnimating) {
            goToStep(idx);
          }
        });
      }

      // Keyboard navigation
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = (currentIndex + 1) % totalSteps;
          goToStep(next);
          focusStepBtn(next);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (currentIndex - 1 + totalSteps) % totalSteps;
          goToStep(prev);
          focusStepBtn(prev);
        } else if (e.key === 'Home') {
          e.preventDefault();
          goToStep(0);
          focusStepBtn(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          goToStep(totalSteps - 1);
          focusStepBtn(totalSteps - 1);
        }
      });
    });

    function focusStepBtn(index) {
      const btn = stepItems[index]?.querySelector('.step-header-btn');
      if (btn) btn.focus();
    }

    function updateTimelineTrack(index) {
      if (!timelineFill) return;
      if (totalSteps <= 1) {
        timelineFill.style.height = '0%';
        return;
      }
      // Calculate height based on active step position
      const percentage = (index / (totalSteps - 1)) * 100;
      timelineFill.style.height = `${percentage}%`;
    }

    function updateLeftCard(index) {
      const activeItem = stepItems[index];
      if (!activeItem) return;

      const duration = activeItem.getAttribute('data-duration') || '';
      const deliverable = activeItem.getAttribute('data-deliverable') || '';

      // Update counter text
      if (counterLabel) {
        counterLabel.textContent = `${index + 1}/${totalSteps}`;
      }

      // Update circular ring progress
      // Circumference for r=14 is ~88
      if (ringProgress) {
        const offset = 88 - (88 * (index + 1)) / totalSteps;
        ringProgress.style.strokeDashoffset = offset;
      }

      // Animate Duration value
      if (durationEl && typeof gsap !== 'undefined') {
        gsap.to(durationEl, {
          opacity: 0,
          y: -5,
          duration: 0.16,
          ease: 'power2.in',
          onComplete: () => {
            durationEl.textContent = duration;
            gsap.to(durationEl, {
              opacity: 1,
              y: 0,
              duration: 0.26,
              ease: 'power2.out'
            });
          }
        });
      } else if (durationEl) {
        durationEl.textContent = duration;
      }

      // Animate Deliverable text
      if (delivEl && typeof gsap !== 'undefined') {
        gsap.to(delivEl, {
          opacity: 0,
          y: -4,
          duration: 0.16,
          ease: 'power2.in',
          onComplete: () => {
            delivEl.textContent = deliverable;
            gsap.to(delivEl, {
              opacity: 1,
              y: 0,
              duration: 0.26,
              ease: 'power2.out'
            });
          }
        });
      } else if (delivEl) {
        delivEl.textContent = deliverable;
      }

      // Update 5-segment bar
      segFills.forEach((fill, i) => {
        if (i <= index) {
          fill.style.transform = 'scaleX(1)';
        } else {
          fill.style.transform = 'scaleX(0)';
        }
      });
    }

    function goToStep(targetIndex) {
      if (targetIndex === currentIndex || targetIndex < 0 || targetIndex >= totalSteps) return;

      const prevIndex = currentIndex;
      currentIndex = targetIndex;
      isAnimating = true;

      const prevItem = stepItems[prevIndex];
      const nextItem = stepItems[targetIndex];

      const prevBody = prevItem?.querySelector('.step-body');
      const nextBody = nextItem?.querySelector('.step-body');
      const prevBtn = prevItem?.querySelector('.step-header-btn');
      const nextBtn = nextItem?.querySelector('.step-header-btn');
      const prevChevron = prevItem?.querySelector('.step-chevron-icon svg');
      const nextChevron = nextItem?.querySelector('.step-chevron-icon svg');

      // Update ARIA
      if (prevBtn) prevBtn.setAttribute('aria-expanded', 'false');
      if (nextBtn) nextBtn.setAttribute('aria-expanded', 'true');

      // Update active/completed classes
      stepItems.forEach((item, idx) => {
        if (idx === targetIndex) {
          item.classList.add('active');
          item.classList.remove('completed');
        } else if (idx < targetIndex) {
          item.classList.remove('active');
          item.classList.add('completed');
        } else {
          item.classList.remove('active');
          item.classList.remove('completed');
        }
      });

      // Update timeline & left summary card
      updateTimelineTrack(targetIndex);
      updateLeftCard(targetIndex);

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating = false;
          }
        });

        // Rotate chevrons
        if (prevChevron) {
          tl.to(prevChevron, { transform: 'rotate(0deg)', duration: 0.25, ease: 'power2.out' }, 0);
        }
        if (nextChevron) {
          tl.to(nextChevron, { transform: 'rotate(180deg)', duration: 0.3, ease: 'power2.out' }, 0);
        }

        // Collapse old body
        if (prevBody) {
          tl.to(prevBody, {
            height: 0,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.inOut',
            onComplete: () => {
              prevBody.style.display = 'none';
            }
          }, 0);
        }

        // Expand new body
        if (nextBody) {
          nextBody.style.display = 'block';
          nextBody.style.height = 'auto';
          const targetHeight = nextBody.scrollHeight;
          nextBody.style.height = '0px';

          tl.to(nextBody, {
            height: targetHeight,
            opacity: 1,
            duration: 0.45,
            ease: 'power3.out',
            onComplete: () => {
              nextBody.style.height = 'auto'; // Keep responsive
            }
          }, 0.1);
        }
      } else {
        // Fallback without GSAP
        if (prevBody) {
          prevBody.style.height = '0px';
          prevBody.style.opacity = '0';
          prevBody.style.display = 'none';
        }
        if (nextBody) {
          nextBody.style.display = 'block';
          nextBody.style.height = 'auto';
          nextBody.style.opacity = '1';
        }
        if (prevChevron) prevChevron.style.transform = 'rotate(0deg)';
        if (nextChevron) nextChevron.style.transform = 'rotate(180deg)';
        isAnimating = false;
      }
    }

    // Initial sync
    updateTimelineTrack(0);
    updateLeftCard(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProcessStepper);
  } else {
    initProcessStepper();
  }
})();

