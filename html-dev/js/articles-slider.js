/**
 * Section 16: Articles Stacking Slider (Pinned Scroll)
 * GSAP 3.12+ ScrollTrigger Interactive Controller
 * Matches stacking-slider-spec.png from Rock Stars Agency
 */

(function () {
  'use strict';

  function initSlider() {
    const sec = document.getElementById('articles');
    if (!sec) return;

    const cards = Array.from(sec.querySelectorAll('.card'));
    const N = cards.length;
    if (N < 2) return;

    const bar = sec.querySelector('.bar');
    const count = sec.querySelector('.count');
    const tot = sec.querySelector('.tot');
    const prev = sec.querySelector('.prev');
    const next = sec.querySelector('.next');
    const C = 2 * Math.PI * 8; // ~50.265
    const M = Math.max(1, N - 2); // scroll steps: last 2 cards land side-by-side fully visible

    if (tot) {
      tot.textContent = String(N).padStart(2, '0');
    }

    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Desktop only with no reduced motion preference
    gsap.matchMedia().add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      sec.classList.add('is-pinned');

      const STACK_SHIFT = [14, 24]; // px offset per stacked card (min, max)
      const GAP = 0.057; // gap between cards as share of viewport width
      let step = 0;
      let off = 0;
      let idx = -1;

      const measure = () => {
        if (!cards[0]) return;
        step = cards[0].offsetWidth + window.innerWidth * GAP;
        off = gsap.utils.clamp(STACK_SHIFT[0], STACK_SHIFT[1], window.innerWidth * 0.0125);
      };

      // p = 0..M is the scroll progress in card steps
      const render = (p) => {
        cards.forEach((c, j) => {
          const d = p - j;
          let x = 0;
          let s = 1;
          let dim = 0;
          let o = 1;

          if (d <= 0) {
            // Still on the right belt, sliding into view
            x = -d * step;
          } else {
            // Landed, now receding into stack on the left
            const k = Math.min(d, 3);
            x = -k * off;
            s = 1 - 0.06 * k;
            dim = Math.min(0.7, 0.5 * k);
            o = Math.min(1, Math.max(0, 4 - d)); // max 3 visible edges
          }

          c.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) scale(${s.toFixed(3)})`;
          c.style.opacity = o.toFixed(3);
          c.style.setProperty('--dim', dim.toFixed(2));
        });

        if (bar) {
          const progressRatio = Math.min(1, (p + 2) / N);
          bar.style.strokeDashoffset = (C * (1 - progressRatio)).toFixed(2);
        }

        const i = Math.round(p);
        if (i !== idx) {
          idx = i;
          if (count) {
            count.textContent = String(Math.min(N, i + 2)).padStart(2, '0');
          }
          if (prev) prev.disabled = (i === 0);
          if (next) next.disabled = (i === M);
          cards.forEach((c, j) => {
            c.inert = (j < i);
          });
        }
      };

      const state = { p: 0 };
      const tween = gsap.to(state, {
        p: M,
        ease: 'none',
        onUpdate: () => render(state.p),
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: () => '+=' + (M * window.innerHeight),
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          snap: {
            snapTo: 1 / M,
            duration: { min: 0.25, max: 0.6 },
            ease: 'power1.inOut'
          },
          onRefresh: () => {
            measure();
            render(state.p);
          }
        }
      });

      const goToStep = (targetIndex) => {
        const st = tween.scrollTrigger;
        if (!st) return;
        const targetScroll = st.start + (targetIndex / M) * (st.end - st.start);
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      };

      if (prev) {
        prev.onclick = (e) => {
          e.preventDefault();
          goToStep(Math.max(0, idx - 1));
        };
      }

      if (next) {
        next.onclick = (e) => {
          e.preventDefault();
          goToStep(Math.min(M, idx + 1));
        };
      }

      measure();
      render(0);

      return () => {
        sec.classList.remove('is-pinned');
        cards.forEach((c) => {
          c.style.cssText = '';
          c.inert = false;
        });
      };
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
  } else {
    initSlider();
  }
})();

