
/**
 * Hero Section Controller & GSAP Iris Reveal Master Slider
 * Based on Rock Stars Agency specifications (hero-section-dev: Boards 1, 2, 3)
 */

(function () {
  'use strict';

  // 1. Data Model for all 5 slides
  const SLIDES = [
    {
      id: "overview",
      bg: {
        src: "img/hero-clinic-bg.png",
        pos: { d: "50% 50%", m: "29% 50%" },
        iris: { d: [60, 55], m: [50, 52] }
      },
      copy: {
        eyebrow: "WEBSITE DEVELOPMENT & GROWTH",
        title: "The team behind your healthcare website growth.",
        sub: "Plugins, integrations, SEO, redesign, ads and support. One team instead of five freelancers."
      },
      card: {
        title: "Growth overview",
        period: "Last 90 days",
        metric: { label: "Organic appointments", value: "+68%" },
        vizType: "line-growth",
        stats: [
          { value: "94", label: "PageSpeed", hint: "LCP 4.8s → 1.6s", mini: "ring", pct: 94 },
          { value: "72/100", label: "AI visibility", hint: "Cited in AI answers", mini: "meter", pct: 72 },
          { value: "38%", label: "Booking rate", hint: "Inquiry → visit", mini: "bars", pct: 38 }
        ]
      }
    },
    {
      id: "redesign",
      bg: {
        src: "img/hero-clinic-bg-2.png",
        pos: { d: "50% 40%", m: "47% 50%" },
        iris: { d: [46, 48], m: [50, 38] }
      },
      copy: {
        eyebrow: "REDESIGN & UX",
        title: "A clinic website patients trust at first glance.",
        sub: "Clear services, doctor profiles and online booking, designed mobile-first for real patients."
      },
      card: {
        title: "Redesign results",
        period: "After launch",
        metric: { label: "Online booking conversion", value: "+41%" },
        vizType: "bars-steps",
        bars: [18, 24, 22, 30, 36, 44, 52, 68],
        stats: [
          { value: "96", label: "Mobile UX", hint: "Lighthouse score", mini: "ring", pct: 96 },
          { value: "-27%", label: "Bounce rate", hint: "vs. old site", mini: "meter", pct: 60 },
          { value: "3 taps", label: "To book", hint: "From homepage", mini: "bars", pct: 45 }
        ]
      }
    },
    {
      id: "seo",
      bg: {
        src: "img/hero-clinic-bg-3.png",
        pos: { d: "50% 40%", m: "55% 50%" },
        iris: { d: [56, 55], m: [50, 38] }
      },
      copy: {
        eyebrow: "SEO & AI VISIBILITY",
        title: "Be the clinic patients find first.",
        sub: "Local SEO, service pages and structured data that Google and AI assistants can cite."
      },
      card: {
        title: "Search visibility",
        period: "Last 90 days",
        metric: { label: "Top-3 local rankings", value: "+212%" },
        vizType: "line-steep",
        stats: [
          { value: "91", label: "Schema", hint: "Structured data", mini: "ring", pct: 91 },
          { value: "46/60", label: "Top-3 keywords", hint: "Local queries", mini: "meter", pct: 76 },
          { value: "3.1x", label: "Map views", hint: "Google profile", mini: "bars", pct: 75 }
        ]
      }
    },
    {
      id: "integrations",
      bg: {
        src: "img/hero-clinic-bg-4.png",
        pos: { d: "50% 35%", m: "76% 50%" },
        iris: { d: [50, 50], m: [50, 32] }
      },
      copy: {
        eyebrow: "PLUGINS & INTEGRATIONS",
        title: "Booking, portal and payments that just work.",
        sub: "Scheduling, patient portal, EHR and CRM connected to your site, tested and maintained."
      },
      card: {
        title: "Integrations",
        period: "Live",
        metric: { label: "Systems connected", value: "12" },
        vizType: "flow-wave",
        stats: [
          { value: "99", label: "Uptime", hint: "Booking and portal", mini: "ring", pct: 99 },
          { value: "1.2s", label: "Sync time", hint: "EHR → website", mini: "meter", pct: 40 },
          { value: "-58%", label: "Phone calls", hint: "Routine requests", mini: "bars", pct: 65 }
        ]
      }
    },
    {
      id: "ads",
      bg: {
        src: "img/hero-clinic-bg-5.png",
        pos: { d: "50% 40%", m: "19% 50%" },
        iris: { d: [52, 50], m: [50, 36] }
      },
      copy: {
        eyebrow: "ADS & SUPPORT",
        title: "Ads and support that keep clinics booked.",
        sub: "Google Ads for new patients and a team on call for every update, fix and release."
      },
      card: {
        title: "Campaign results",
        period: "Last 90 days",
        metric: { label: "Cost per booked visit", value: "-34%" },
        vizType: "step-down",
        bars: [68, 60, 54, 46, 40, 34, 28, 22],
        stats: [
          { value: "94", label: "Quality score", hint: "Google Ads", mini: "ring", pct: 94 },
          { value: "2.4x", label: "ROAS", hint: "Return on ad spend", mini: "bars", pct: 80 },
          { value: "<1h", label: "Support reply", hint: "Business days", mini: "meter", pct: 30 }
        ]
      }
    }
  ];

  // Motion timings configuration from Board 2 & 3
  const TIMINGS = {
    desktop: {
      at: 0.10,
      iris: 1.25,
      settle: 2.20,
      zoom: 1.10,
      out: 0.30,
      outGap: 0.05,
      inAt: 0.85,
      inDur: 0.65,
      inGap: 0.07,
      cardAt: 0.90,
      cardDur: 0.75,
      axis: "x",
      shift: 20,
      hold: 6.0
    },
    mobile: {
      at: 0.05,
      iris: 0.90,
      settle: 1.70,
      zoom: 1.07,
      out: 0.22,
      outGap: 0.03,
      inAt: 0.55,
      inDur: 0.50,
      inGap: 0.05,
      cardAt: 0.65,
      cardDur: 0.55,
      axis: "y",
      shift: 14,
      hold: 6.0
    }
  };

  function initHeroSlider() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    // DOM Elements
    const bgSlides = Array.from(heroSection.querySelectorAll('.hero-bg-slide'));
    const copySlot = heroSection.querySelector('.hero-copy-slot');
    const cardSlot = heroSection.querySelector('.hero-card-slot');
    const segmentsContainer = heroSection.querySelector('.hero-segments');
    const counterText = heroSection.querySelector('.hero-counter-num');
    const pauseBtn = heroSection.querySelector('.hero-pause-btn');

    if (!bgSlides.length || !copySlot || !cardSlot) return;

    let currentIndex = 0;
    let isTransitioning = false;
    let isPaused = false;
    let holdTween = null;
    let masterTimeline = null;
    let innerCardTimeline = null;

    // Setup initial object-positions for all slide background images
    function updateSlideObjectPositions() {
      const isMobile = window.innerWidth < 1024;
      const bp = isMobile ? 'm' : 'd';
      bgSlides.forEach((slideEl, idx) => {
        const img = slideEl.querySelector('img');
        if (img && SLIDES[idx]) {
          img.style.objectPosition = SLIDES[idx].bg.pos[bp];
        }
      });
    }
    updateSlideObjectPositions();
    window.addEventListener('resize', updateSlideObjectPositions);

    // Number Counter Animation Helper
    function animateCounter(element, targetString, duration = 0.75) {
      if (!element) return;
      const match = targetString.match(/^([+-]?)([0-9]+)(.*)$/);
      if (!match) {
        element.textContent = targetString;
        return;
      }
      const prefix = match[1] || '';
      const targetNum = parseInt(match[2], 10);
      const suffix = match[3] || '';
      const obj = { val: 0 };

      gsap.to(obj, {
        val: targetNum,
        duration: duration,
        ease: 'power2.out',
        onUpdate: () => {
          element.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
        }
      });
    }

    // Render Card Visualization based on slide.card.vizType
    function renderCardViz(slide) {
      const vizType = (slide.card && slide.card.vizType) || slide.vizType;
      const bars = (slide.card && slide.card.bars) || slide.bars || [18, 24, 22, 30, 36, 44, 52, 68];

      // Bar Chart Visualization (Slide 02 Redesign & Slide 05 Ads)
      if (vizType === 'bars-steps' || vizType === 'step-down') {
        const isStepDown = vizType === 'step-down';
        const maxVal = Math.max(...bars, 70);
        const barsHtml = bars.map((pt, i) => {
          const heightPct = Math.round((pt / maxVal) * 100);
          const isTarget = isStepDown ? i === bars.length - 1 : i === bars.length - 1;
          const bgCol = isTarget ? '#F0F0F0' : '#2A2A2A';
          return `
            <div class="flex-1 flex flex-col items-center justify-end h-full">
              <div class="growth-bar w-full max-w-[15px] rounded-t-[2px] transform origin-bottom" 
                   data-height="${heightPct}"
                   style="height: ${heightPct}%; background: ${bgCol};"></div>
            </div>`;
        }).join('');

        const label1 = isStepDown ? 'Wk 1' : 'Day 1';
        const label2 = isStepDown ? 'Wk 4' : 'Day 30';
        const label3 = isStepDown ? 'Wk 8' : 'Day 60';
        const label4 = isStepDown ? 'Wk 12' : 'Day 90';

        return `
          <div class="chart-viz-wrapper flex flex-col justify-end h-full">
            <div class="h-[84px] sm:h-[90px] flex items-end justify-between gap-1.5 sm:gap-2 px-2 pb-1 border-b border-[#2A2A2A]">
              ${barsHtml}
            </div>
            <div class="flex justify-between items-center text-[#A0A0A0] text-[11px] font-medium pt-1 px-2">
              <span>${label1}</span>
              <span>${label2}</span>
              <span>${label3}</span>
              <span>${label4}</span>
            </div>
          </div>`;
      }

      // Flow Wave Visualization (Slide 04 Integrations)
      if (vizType === 'flow-wave') {
        return `
          <div class="chart-viz-wrapper flex flex-col justify-end h-full">
            <svg viewBox="0 0 420 100" class="w-full h-[84px] sm:h-[90px] overflow-visible" aria-hidden="true">
              <defs>
                <linearGradient id="heroFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#2A2A2A" />
                  <stop offset="50%" stop-color="#F0F0F0" stop-opacity="0.95" />
                  <stop offset="100%" stop-color="#2A2A2A" />
                </linearGradient>
                <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <line x1="0" y1="24" x2="415" y2="24" stroke="#2A2A2A" stroke-width="1" />
              <line x1="0" y1="52" x2="415" y2="52" stroke="#2A2A2A" stroke-width="1" />
              <line x1="0" y1="80" x2="415" y2="80" stroke="#2A2A2A" stroke-dasharray="4 4" stroke-width="1" />
              <path class="hero-flow-path" d="M 5,66 C 100,66 140,32 210,32 C 280,32 320,66 415,66" fill="none" stroke="url(#heroFlowGrad)" stroke-width="2.5" />
              <g class="hero-flow-node" transform="translate(210, 32)">
                <circle cx="0" cy="0" r="11" fill="rgba(240,240,240,0.15)" class="chart-endpoint-pulse" />
                <circle cx="0" cy="0" r="5" fill="#F0F0F0" filter="url(#dotGlow)" />
              </g>
            </svg>
            <div class="flex justify-between items-center text-[#A0A0A0] text-[11px] font-medium pt-1 px-2 border-t border-[#2A2A2A]">
              <span>EHR</span>
              <span>Portal</span>
              <span>Booking</span>
              <span>CRM</span>
            </div>
          </div>`;
      }

      // Line Graph Visualization (Slide 01 Overview & Slide 03 SEO)
      const isSteep = vizType === 'line-steep';
      const pathCurve = isSteep
        ? "M 5,88 C 60,86 120,82 180,74 C 240,62 300,34 405,12"
        : "M 5,88 C 40,84 80,79 120,81 C 145,83 170,87 195,88 C 230,88 265,77 300,60 C 335,42 370,24 405,14";

      const pathArea = `${pathCurve} L 405,88 L 5,88 Z`;
      const endY = isSteep ? 12 : 14;

      return `
        <div class="chart-viz-wrapper flex flex-col justify-end h-full">
          <svg viewBox="0 0 420 100" class="w-full h-[84px] sm:h-[90px] overflow-visible" aria-label="${slide.card.metric.label} graph">
            <defs>
              <linearGradient id="heroChartGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#F0F0F0" stop-opacity="0.16" />
                <stop offset="60%" stop-color="#F0F0F0" stop-opacity="0.04" />
                <stop offset="100%" stop-color="#F0F0F0" stop-opacity="0.0" />
              </linearGradient>
              <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line x1="0" y1="28" x2="415" y2="28" stroke="#2A2A2A" stroke-width="1" />
            <line x1="0" y1="58" x2="415" y2="58" stroke="#2A2A2A" stroke-width="1" />
            <line x1="0" y1="88" x2="415" y2="88" stroke="#2A2A2A" stroke-dasharray="4 4" stroke-width="1" />
            <path class="hero-chart-area" d="${pathArea}" fill="url(#heroChartGlowGrad)" opacity="0" />
            <path class="hero-chart-curve" d="${pathCurve}" stroke="#F0F0F0" stroke-width="2.5" fill="none" />
            <g class="hero-chart-endpoint" transform="translate(405, ${endY})">
              <circle cx="0" cy="0" r="10" fill="rgba(240,240,240,0.15)" class="chart-endpoint-pulse" />
              <circle cx="0" cy="0" r="5" fill="#F0F0F0" filter="url(#dotGlow)" />
            </g>
          </svg>
          <div class="flex justify-between items-center text-[#A0A0A0] text-[11px] font-medium pt-1 px-2 border-t border-[#2A2A2A]">
            <span>Day 1</span>
            <span>Day 30</span>
            <span>Day 60</span>
            <span>Day 90</span>
          </div>
        </div>`;
    }

    // Render Stats Item
    function renderStatItem(stat, index) {
      const borderClass = index > 0 ? 'border-l border-[#2A2A2A]' : '';

      let indicatorHtml = '';
      if (stat.mini === 'ring') {
        const strokeOffset = Math.round(110 - (110 * stat.pct) / 100);
        indicatorHtml = `
          <div class="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center mx-auto mb-1">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="17.5" fill="none" stroke="#2A2A2A" stroke-width="3.5" />
              <circle class="stat-ring-circle" cx="22" cy="22" r="17.5" fill="none" stroke="#F0F0F0" stroke-width="3.5" 
                      stroke-dasharray="110" stroke-dashoffset="110" data-offset="${strokeOffset}" stroke-linecap="round" />
            </svg>
            <span class="absolute text-[#F0F0F0] font-bold text-xs">${stat.value}</span>
          </div>`;
      } else if (stat.mini === 'meter') {
        indicatorHtml = `
          <div class="flex items-baseline justify-center mb-0.5">
            <span class="text-[#F0F0F0] font-extrabold text-base sm:text-lg tracking-tight">${stat.value}</span>
          </div>
          <div class="w-full max-w-[64px] h-[3.5px] bg-[#2A2A2A] rounded-full overflow-hidden mb-1.5">
            <div class="stat-meter-fill h-full bg-[#F0F0F0] rounded-full w-0" data-pct="${stat.pct}"></div>
          </div>`;
      } else if (stat.mini === 'bars') {
        indicatorHtml = `
          <div class="flex items-baseline justify-center mb-0.5">
            <span class="text-[#F0F0F0] font-extrabold text-base sm:text-lg tracking-tight">${stat.value}</span>
          </div>
          <div class="flex items-end justify-center gap-[3px] h-[13px] mb-1.5" aria-hidden="true">
            <span class="stat-mini-bar w-[3px] h-[4px] bg-[#2A2A2A] rounded-[1px] transform origin-bottom"></span>
            <span class="stat-mini-bar w-[3px] h-[6px] bg-[#2A2A2A] rounded-[1px] transform origin-bottom"></span>
            <span class="stat-mini-bar w-[3px] h-[8px] bg-[#2A2A2A] rounded-[1px] transform origin-bottom"></span>
            <span class="stat-mini-bar w-[3px] h-[10px] bg-[#2A2A2A] rounded-[1px] transform origin-bottom"></span>
            <span class="stat-mini-bar w-[3px] h-[12px] bg-[#2A2A2A] rounded-[1px] transform origin-bottom"></span>
            <span class="stat-mini-bar w-[3px] h-[13px] bg-[#F0F0F0] rounded-[1px] transform origin-bottom"></span>
          </div>`;
      }

      return `
        <div class="stat-metric-col flex flex-col items-center px-1 ${borderClass}">
          ${indicatorHtml}
          <span class="stat-label text-[#F0F0F0] font-bold text-xs tracking-tight">${stat.label}</span>
          <span class="stat-hint text-[#A0A0A0] text-[10px] sm:text-[11px] mt-0.5 whitespace-nowrap">${stat.hint}</span>
        </div>`;
    }

    // Populate Slide Content
    function fillSlideContent(slideIndex) {
      const s = SLIDES[slideIndex];

      // Fill Left Copy
      const eyebrowEl = copySlot.querySelector('.hero-eyebrow-text');
      const titleEl = copySlot.querySelector('.hero-title-text');
      const subEl = copySlot.querySelector('.hero-sub-text');

      if (eyebrowEl) eyebrowEl.textContent = s.copy.eyebrow;
      if (titleEl) titleEl.textContent = s.copy.title;
      if (subEl) subEl.textContent = s.copy.sub;

      // Fill Right Card
      const cardTitleEl = cardSlot.querySelector('.card-header-title');
      const cardPeriodEl = cardSlot.querySelector('.card-header-period');
      const metricLabelEl = cardSlot.querySelector('.card-metric-label');
      const metricValEl = cardSlot.querySelector('.card-metric-value');
      const vizContainer = cardSlot.querySelector('.card-viz-container');
      const statsContainer = cardSlot.querySelector('.card-stats-grid');

      if (cardTitleEl) cardTitleEl.textContent = s.card.title;
      if (cardPeriodEl) cardPeriodEl.textContent = s.card.period;
      if (metricLabelEl) metricLabelEl.textContent = s.card.metric.label;
      if (metricValEl) metricValEl.textContent = s.card.metric.value;
      if (vizContainer) vizContainer.innerHTML = renderCardViz(s);
      if (statsContainer) {
        statsContainer.innerHTML = s.card.stats.map((st, i) => renderStatItem(st, i)).join('');
      }

      // Update counter (format "01 / 05" per design)
      if (counterText) {
        counterText.textContent = `0${slideIndex + 1}`;
      }
    }

    // Animate Inner Card Content on arrival
    function animateCardContents(slideIndex) {
      if (innerCardTimeline) innerCardTimeline.kill();
      innerCardTimeline = gsap.timeline();

      const s = SLIDES[slideIndex];
      const metricValEl = cardSlot.querySelector('.card-metric-value');

      // 1. Metric Counter Count-Up
      if (metricValEl) {
        animateCounter(metricValEl, s.card.metric.value, 0.75);
      }

      // 2. Chart Visualizations
      const lineCurve = cardSlot.querySelector('.hero-chart-curve');
      const chartArea = cardSlot.querySelector('.hero-chart-area');
      const endpointDot = cardSlot.querySelector('.hero-chart-endpoint');
      const bars = cardSlot.querySelectorAll('.growth-bar');
      const flowPath = cardSlot.querySelector('.hero-flow-path');
      const flowNode = cardSlot.querySelector('.hero-flow-node');

      if (lineCurve) {
        const pathLen = lineCurve.getTotalLength ? lineCurve.getTotalLength() : 430;
        gsap.set(lineCurve, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
        innerCardTimeline.to(lineCurve, {
          strokeDashoffset: 0,
          duration: 0.85,
          ease: 'power2.out'
        }, 0);

        if (chartArea) {
          innerCardTimeline.to(chartArea, {
            opacity: 0.9,
            duration: 0.65,
            ease: 'power2.out'
          }, 0.2);
        }

        if (endpointDot) {
          gsap.set(endpointDot, { scale: 0, transformOrigin: 'center center' });
          innerCardTimeline.to(endpointDot, {
            scale: 1,
            duration: 0.45,
            ease: 'back.out(2)'
          }, 0.6);
        }
      }

      if (bars.length) {
        gsap.set(bars, { scaleY: 0, transformOrigin: 'bottom center' });
        innerCardTimeline.to(bars, {
          scaleY: 1,
          duration: 0.55,
          stagger: 0.04,
          ease: 'back.out(1.5)'
        }, 0.05);
      }

      if (flowPath) {
        const flowLen = flowPath.getTotalLength ? flowPath.getTotalLength() : 420;
        gsap.set(flowPath, { strokeDasharray: flowLen, strokeDashoffset: flowLen });
        innerCardTimeline.to(flowPath, {
          strokeDashoffset: 0,
          duration: 0.85,
          ease: 'power2.out'
        }, 0);

        if (flowNode) {
          gsap.set(flowNode, { scale: 0, transformOrigin: 'center center' });
          innerCardTimeline.to(flowNode, {
            scale: 1,
            duration: 0.45,
            ease: 'back.out(2)'
          }, 0.45);
        }
      }

      // 3. Bottom Stats Elements
      const rings = cardSlot.querySelectorAll('.stat-ring-circle');
      rings.forEach(ring => {
        const targetOffset = parseFloat(ring.getAttribute('data-offset') || '0');
        innerCardTimeline.to(ring, {
          strokeDashoffset: targetOffset,
          duration: 0.75,
          ease: 'power2.out'
        }, 0.1);
      });

      const meters = cardSlot.querySelectorAll('.stat-meter-fill');
      meters.forEach(meter => {
        const targetPct = meter.getAttribute('data-pct') || '0';
        innerCardTimeline.to(meter, {
          width: `${targetPct}%`,
          duration: 0.75,
          ease: 'power2.out'
        }, 0.1);
      });

      const miniBars = cardSlot.querySelectorAll('.stat-mini-bar');
      if (miniBars.length) {
        gsap.set(miniBars, { scaleY: 0, transformOrigin: 'bottom center' });
        innerCardTimeline.to(miniBars, {
          scaleY: 1,
          duration: 0.4,
          stagger: 0.03,
          ease: 'back.out(1.5)'
        }, 0.15);
      }
    }

    // Setup Progress Segments: Clean 2.5px track and fill, NO fat grey pills
    function setupSegments() {
      if (!segmentsContainer) return;
      segmentsContainer.innerHTML = '';
      SLIDES.forEach((_, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hero-seg-btn';
        btn.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        btn.innerHTML = `
          <div class="hero-seg-track">
            <span class="hero-seg-fill"></span>
          </div>
        `;
        btn.addEventListener('click', () => {
          if (idx !== currentIndex && !isTransitioning) {
            goToSlide(idx);
          }
        });
        segmentsContainer.appendChild(btn);
      });
      updateSegmentStates(currentIndex);
    }

    function updateSegmentStates(activeIndex) {
      if (!segmentsContainer) return;
      const buttons = segmentsContainer.querySelectorAll('.hero-seg-btn');
      buttons.forEach((btn, idx) => {
        const fill = btn.querySelector('.hero-seg-fill');
        if (!fill) return;
        gsap.killTweensOf(fill);
        if (idx < activeIndex) {
          gsap.set(fill, { scaleX: 1 });
        } else if (idx > activeIndex) {
          gsap.set(fill, { scaleX: 0 });
        } else {
          gsap.set(fill, { scaleX: 0 });
        }
      });
    }

    // Start 6s Hold Progress on Active Segment
    function startHoldProgress() {
      if (!segmentsContainer || isPaused) return;
      const buttons = segmentsContainer.querySelectorAll('.hero-seg-btn');
      const activeBtn = buttons[currentIndex];
      if (!activeBtn) return;
      const fill = activeBtn.querySelector('.hero-seg-fill');
      if (!fill) return;

      if (holdTween) holdTween.kill();
      holdTween = gsap.to(fill, {
        scaleX: 1,
        duration: TIMINGS.desktop.hold,
        ease: 'none',
        onComplete: () => {
          if (!isPaused) {
            const nextIdx = (currentIndex + 1) % SLIDES.length;
            goToSlide(nextIdx);
          }
        }
      });
    }

    // Go to Specific Slide with Iris Reveal
    function goToSlide(nextIndex) {
      if (isTransitioning || nextIndex === currentIndex) return;
      isTransitioning = true;
      if (holdTween) holdTween.kill();

      const curSlideEl = bgSlides[currentIndex];
      const nextSlideEl = bgSlides[nextIndex];
      const nextSlide = SLIDES[nextIndex];
      const isMobile = window.innerWidth < 1024;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const t = isMobile ? TIMINGS.mobile : TIMINGS.desktop;
      const bp = isMobile ? 'm' : 'd';

      // Elements to animate
      const copyItems = [
        copySlot.querySelector('.hero-eyebrow'),
        copySlot.querySelector('.hero-title'),
        copySlot.querySelector('.hero-sub')
      ].filter(Boolean);

      const cardOuter = cardSlot.querySelector('.growth-card-outer');

      // Update segment bars up to target
      updateSegmentStates(nextIndex);

      // Reduced motion fallback: simple crossfade
      if (prefersReduced) {
        masterTimeline = gsap.timeline({
          onComplete: () => {
            curSlideEl.classList.remove('active');
            gsap.set(curSlideEl, { opacity: 0 });
            nextSlideEl.classList.add('active');
            currentIndex = nextIndex;
            isTransitioning = false;
            startHoldProgress();
          }
        });

        masterTimeline
          .to([copySlot, cardSlot], { autoAlpha: 0, duration: 0.25 })
          .call(() => {
            fillSlideContent(nextIndex);
            animateCardContents(nextIndex);
            nextSlideEl.classList.add('active');
            gsap.set(nextSlideEl, { opacity: 1 });
          })
          .to([copySlot, cardSlot], { autoAlpha: 1, duration: 0.35 });
        return;
      }

      // Prepare Incoming Photo & Iris Coordinates
      const bgBox = heroSection.getBoundingClientRect();
      const w = bgBox.width;
      const h = bgBox.height;
      const ox = nextSlide.bg.iris[bp][0];
      const oy = nextSlide.bg.iris[bp][1];

      // End radius to the farthest corner (hypotenuse)
      const R = Math.ceil(Math.hypot(
        Math.max(ox, 100 - ox) * (w / 100),
        Math.max(oy, 100 - oy) * (h / 100)
      ));

      // Setup incoming background layer
      nextSlideEl.classList.add('incoming');
      gsap.set(nextSlideEl, {
        opacity: 1,
        clipPath: `circle(0px at ${ox}% ${oy}%)`,
        scale: t.zoom,
        transformOrigin: `${ox}% ${oy}%`
      });

      // Master Timeline
      masterTimeline = gsap.timeline({
        onComplete: () => {
          // Transition cleanup: swap active class and clear GSAP properties
          curSlideEl.classList.remove('active');
          gsap.set(curSlideEl, { opacity: 0 });
          nextSlideEl.classList.add('active');
          nextSlideEl.classList.remove('incoming');
          gsap.set(nextSlideEl, { clearProps: 'clipPath,transform,transformOrigin' });
          currentIndex = nextIndex;
          isTransitioning = false;
          startHoldProgress();
        }
      });

      // 1. OUT PHASE: Exit current text and card
      masterTimeline.addLabel('out', 0);

      // Copy exit
      masterTimeline.to(copyItems, {
        y: -12,
        autoAlpha: 0,
        duration: t.out,
        stagger: t.outGap,
        ease: 'power2.in'
      }, 'out');

      // Card exit
      const cardOutProps = {
        autoAlpha: 0,
        duration: t.out + 0.08,
        ease: 'power2.in'
      };
      cardOutProps[t.axis] = t.shift;
      masterTimeline.to(cardOuter, cardOutProps, 'out');

      // 2. IRIS REVEAL & PHOTO SETTLE
      masterTimeline.addLabel('iris', t.at);

      masterTimeline.to(nextSlideEl, {
        clipPath: `circle(${R}px at ${ox}% ${oy}%)`,
        duration: t.iris,
        ease: 'power3.inOut'
      }, 'iris');

      masterTimeline.to(nextSlideEl, {
        scale: 1.0,
        duration: t.settle,
        ease: 'power2.out'
      }, 'iris');

      // 3. CONTENT SWAP (Midway while invisible)
      masterTimeline.add(() => {
        fillSlideContent(nextIndex);
      }, t.inAt - 0.2);

      // 4. IN PHASE: Enter new text, card and internal animations
      masterTimeline.addLabel('in', t.inAt);

      // Copy enter
      masterTimeline.fromTo(copyItems, {
        y: 16,
        autoAlpha: 0
      }, {
        y: 0,
        autoAlpha: 1,
        duration: t.inDur,
        stagger: t.inGap,
        ease: 'power3.out'
      }, 'in');

      // Card enter
      const cardInFrom = { autoAlpha: 0 };
      cardInFrom[t.axis] = t.shift;
      const cardInTo = {
        autoAlpha: 1,
        duration: t.cardDur,
        ease: 'power3.out'
      };
      cardInTo[t.axis] = 0;

      masterTimeline.fromTo(cardOuter, cardInFrom, cardInTo, 'in');

      // Trigger inner card entrance animation
      masterTimeline.add(() => {
        animateCardContents(nextIndex);
      }, 'in+=0.05');
    }

    // Toggle Pause/Play
    function togglePause() {
      isPaused = !isPaused;
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-label', isPaused ? 'Resume slideshow' : 'Pause slideshow');
        pauseBtn.innerHTML = isPaused
          ? `<svg class="w-3 h-3 text-[#F0F0F0]" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`
          : `<svg class="w-3 h-3 text-[#F0F0F0]" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      }
      if (isPaused) {
        if (holdTween) holdTween.pause();
      } else {
        if (holdTween) holdTween.resume();
        else startHoldProgress();
      }
    }

    // Pause on Hover / Focus / Visibility
    heroSection.addEventListener('mouseenter', () => {
      if (!isPaused && holdTween) holdTween.pause();
    });
    heroSection.addEventListener('mouseleave', () => {
      if (!isPaused && holdTween) holdTween.resume();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (holdTween) holdTween.pause();
      } else {
        if (!isPaused && holdTween) holdTween.resume();
      }
    });

    // Touch Swipe Support (Mobile)
    let touchStartX = 0;
    let touchEndX = 0;
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45 && !isTransitioning) {
        if (diff > 0) {
          goToSlide((currentIndex + 1) % SLIDES.length);
        } else {
          goToSlide((currentIndex - 1 + SLIDES.length) % SLIDES.length);
        }
      }
    }, { passive: true });

    // Keyboard Arrow Keys
    window.addEventListener('keydown', (e) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' && !isTransitioning) {
        goToSlide((currentIndex + 1) % SLIDES.length);
      } else if (e.key === 'ArrowLeft' && !isTransitioning) {
        goToSlide((currentIndex - 1 + SLIDES.length) % SLIDES.length);
      }
    });

    if (pauseBtn) {
      pauseBtn.addEventListener('click', togglePause);
    }

    // Initialize initial slide 0
    bgSlides.forEach((slideEl, idx) => {
      if (idx === 0) {
        slideEl.classList.add('active');
        gsap.set(slideEl, { opacity: 1 });
      } else {
        slideEl.classList.remove('active', 'incoming');
        gsap.set(slideEl, { opacity: 0 });
      }
    });

    fillSlideContent(0);
    animateCardContents(0);
    setupSegments();
    startHoldProgress();

    // Export public API
    window.heroSlider = {
      goTo: goToSlide,
      next: () => goToSlide((currentIndex + 1) % SLIDES.length),
      prev: () => goToSlide((currentIndex - 1 + SLIDES.length) % SLIDES.length),
      togglePause: togglePause
    };
  }

  // Auto-init on DOMContentLoaded or immediate if loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
  } else {
    initHeroSlider();
  }
})();
