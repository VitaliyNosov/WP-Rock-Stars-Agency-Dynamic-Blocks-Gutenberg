/**
 * Section 08: GEO (Generative Engine Optimization)
 * Pinned stacking scroll timeline with GSAP 3.14+ & ScrollTrigger.
 * Matches specifications in desing/gsap-js-block/geo-scroll-spec.png
 */

(function () {
  'use strict';

  function initGeoSection() {
    const section = document.getElementById('geo');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mm = gsap.matchMedia();

    // Responsive setup: Pin and stack only on desktop (>= 1024px)
    mm.add('(min-width: 1024px)', function () {
      const frames = gsap.utils.toArray('.geo-frame');
      if (frames.length < 2) return;

      if (prefersReducedMotion) {
        // If reduced motion is preferred, keep frames accessible without heavy scroll lock
        return;
      }

      // Initial state: Frames 2..7 stacked below the viewport
      gsap.set(frames.slice(1), { 
        yPercent: 100, 
        scale: 1, 
        filter: 'brightness(1)' 
      });
      gsap.set(frames[0], { 
        yPercent: 0, 
        scale: 1, 
        filter: 'brightness(1)' 
      });

      const stage = document.querySelector('.geo-pinned-stage') || document.getElementById('geo');

      // Master scrubbed timeline pinned for 600% of viewport height (6 transitions x 100vh)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'center center',
          end: '+=600%',
          pin: true,
          pinSpacing: true,
          scrub: 1,
          snap: {
            snapTo: 'labels',
            duration: 0.4,
            ease: 'power1.inOut'
          },
          anticipatePin: 1,
          onUpdate: function (self) {
            updateActiveIndicators(self.progress, frames.length);
          }
        }
      });

      // Add start label for Frame 01
      tl.addLabel('f0');

      // Stacking loop: each frame slides up to 0 while previous frame recedes
      frames.forEach(function (frame, i) {
        if (!i) return;

        tl.to(frame, {
          yPercent: 0,
          ease: 'none',
          duration: 1
        })
        .to(frames[i - 1], {
          scale: 0.94,
          filter: 'brightness(0.5)',
          ease: 'none',
          duration: 1
        }, '<')
        .addLabel('f' + i);
      });

      // Inner reveal micro-animations & counter for Frame 07
      setupFrameInteractions(frames);

      return function () {
        // Cleanup if viewport resizes below 1024px
        frames.forEach(function (f) {
          gsap.set(f, { clearProps: 'all' });
        });
      };
    });

    // Mobile fallback (< 1024px): regular vertical list with fade-ins
    mm.add('(max-width: 1023px)', function () {
      const frames = gsap.utils.toArray('.geo-frame');
      frames.forEach(function (frame) {
        gsap.set(frame, { clearProps: 'all' });
        if (!prefersReducedMotion) {
          gsap.from(frame, {
            scrollTrigger: {
              trigger: frame,
              start: 'top 85%',
              toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power2.out'
          });
        }
      });

      // Frame 07 counters on mobile
      initFrame7Metrics(true);
    });

    // Refresh ScrollTrigger once fonts and images are fully loaded
    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });

    // Handle dynamic zoom changes (100% -> 125% -> 150%) and window resizing
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        ScrollTrigger.refresh();
      }, 120);
    });
  }

  // Update dots and frame counters during scroll
  function updateActiveIndicators(progress, totalFrames) {
    // progress is 0..1 across totalFrames - 1 transitions
    const step = progress * (totalFrames - 1);
    const activeIndex = Math.min(Math.round(step), totalFrames - 1);

    const frames = document.querySelectorAll('.geo-frame');
    frames.forEach(function (frame, fIdx) {
      const dots = frame.querySelectorAll('.geo-dot');
      dots.forEach(function (dot, dIdx) {
        if (dIdx === fIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    });

    // Trigger Frame 07 metrics when arriving at the last frame
    if (activeIndex === totalFrames - 1) {
      initFrame7Metrics(false);
    }
  }

  // Inner element animations for each frame
  function setupFrameInteractions(frames) {
    frames.forEach(function (frame, i) {
      const items = frame.querySelectorAll('.geo-reveal-item');
      if (items.length > 0) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: frame,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 16,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });
  }

  // Frame 07 numbers count-up and progress bars fill
  let frame7Animated = false;
  function initFrame7Metrics(isMobile) {
    if (frame7Animated) return;
    frame7Animated = true;

    const counter = document.getElementById('geo-score-counter');
    if (counter) {
      const target = parseInt(counter.getAttribute('data-target') || '72', 10);
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: function () {
          counter.textContent = Math.round(this.targets()[0].val);
        }
      });
    }

    const fills = document.querySelectorAll('.geo-engine-bar-fill');
    fills.forEach(function (fill) {
      const width = fill.getAttribute('data-width') || '70%';
      fill.style.width = width;
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGeoSection);
  } else {
    initGeoSection();
  }

})();
