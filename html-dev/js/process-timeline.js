/**
 * Section 23: Process Timeline Interactions & GSAP Animations
 */

const TIMELINE_STEPS = [
  {
    day: 'Start',
    title: 'Free site audit',
    desc: 'We review your speed, SEO and booking flow.',
    badge: 'Free',
    ctaText: 'Start now',
    ctaLink: '#audit'
  },
  {
    day: 'Day 3',
    title: 'Discovery call',
    desc: 'We learn about your clinic and your patients.',
    badge: '30 minutes',
    ctaText: 'Start now',
    ctaLink: '#audit'
  },
  {
    day: 'Day 7',
    title: 'Project scope',
    desc: 'We agree on a clear roadmap, timeline and budget.',
    badge: 'Fixed price',
    ctaText: 'Start now',
    ctaLink: '#audit'
  },
  {
    day: 'Day 14',
    title: 'Assemble team',
    desc: 'We bring together designers, developers and SEO experts.',
    badge: 'Dedicated',
    ctaText: 'Start now',
    ctaLink: '#audit'
  },
  {
    day: 'Day 21',
    title: 'Kick-off',
    desc: 'We start building your website.',
    badge: 'Milestone',
    ctaText: 'Start now',
    ctaLink: '#audit'
  }
];

function initProcessTimeline() {
  const section = document.querySelector('#process-timeline');
  if (!section) return;

  let currentStepIndex = 0;

  // Desktop Elements
  const desktopNodes = section.querySelectorAll('.timeline-node-btn');
  const desktopCards = section.querySelectorAll('.timeline-cards-grid .timeline-step-card-outer');
  const desktopProgressLine = section.querySelector('#timeline-progress-line');
  const bannerBadge = section.querySelector('#timeline-banner-badge');
  const bannerTitle = section.querySelector('#timeline-banner-title');
  const bannerDesc = section.querySelector('#timeline-banner-desc');
  const bannerCta = section.querySelector('#timeline-banner-cta');
  const bannerInner = section.querySelector('.timeline-banner-inner');

  // Mobile Elements
  const mobileSteps = section.querySelectorAll('.timeline-mobile-step');
  const mobileProgressLine = section.querySelector('#timeline-vertical-progress-line');

  function updateDesktopStep(index) {
    if (index < 0 || index >= TIMELINE_STEPS.length) return;
    currentStepIndex = index;

    // 1. Progress line width: 0% to 100%
    if (desktopProgressLine) {
      const percentage = (index / (TIMELINE_STEPS.length - 1)) * 100;
      desktopProgressLine.style.width = `${percentage}%`;
    }

    // 2. Nodes active state
    desktopNodes.forEach((node, i) => {
      if (i <= index) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // 3. Cards active state
    desktopCards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // 4. Update banner content with smooth fade
    const step = TIMELINE_STEPS[index];
    if (bannerInner && typeof gsap !== 'undefined') {
      gsap.to(bannerInner, {
        opacity: 0.3,
        duration: 0.12,
        onComplete: () => {
          if (bannerBadge) bannerBadge.textContent = step.badge;
          if (bannerTitle) bannerTitle.textContent = step.title;
          if (bannerDesc) bannerDesc.textContent = step.desc;
          if (bannerCta) {
            bannerCta.textContent = step.ctaText;
            bannerCta.href = step.ctaLink;
          }
          gsap.to(bannerInner, { opacity: 1, duration: 0.18 });
        }
      });
    } else {
      if (bannerBadge) bannerBadge.textContent = step.badge;
      if (bannerTitle) bannerTitle.textContent = step.title;
      if (bannerDesc) bannerDesc.textContent = step.desc;
      if (bannerCta) {
        bannerCta.textContent = step.ctaText;
        bannerCta.href = step.ctaLink;
      }
    }
  }

  function updateMobileStep(index) {
    if (index < 0 || index >= TIMELINE_STEPS.length) return;
    currentStepIndex = index;

    mobileSteps.forEach((stepEl, i) => {
      const card = stepEl.querySelector('.timeline-step-card-outer');
      const dot = stepEl.querySelector('.timeline-node-dot');
      const action = stepEl.querySelector('.timeline-mobile-action');

      if (i <= index) {
        stepEl.classList.add('active');
        if (dot) dot.classList.add('active');
      } else {
        stepEl.classList.remove('active');
        if (dot) dot.classList.remove('active');
      }

      if (i === index) {
        if (card) card.classList.add('active');
        if (action) {
          action.classList.remove('hidden');
          action.classList.add('flex');
        }
      } else {
        if (card) card.classList.remove('active');
        if (action) {
          action.classList.add('hidden');
          action.classList.remove('flex');
        }
      }
    });

    // Vertical progress line calculation
    if (mobileProgressLine && mobileSteps[index]) {
      const activeStep = mobileSteps[index];
      const nodeEl = activeStep.querySelector('.timeline-mobile-node');
      if (nodeEl) {
        const topOffset = activeStep.offsetTop + nodeEl.offsetTop - 8;
        mobileProgressLine.style.height = `${Math.max(0, topOffset)}px`;
      }
    }
  }

  // Click bindings for Desktop
  desktopNodes.forEach((btn, idx) => {
    btn.addEventListener('click', () => updateDesktopStep(idx));
  });

  desktopCards.forEach((card, idx) => {
    card.addEventListener('click', () => updateDesktopStep(idx));
  });

  // Click bindings for Mobile
  mobileSteps.forEach((stepEl, idx) => {
    stepEl.addEventListener('click', () => updateMobileStep(idx));
  });

  // Initial step: 0
  updateDesktopStep(0);
  updateMobileStep(0);

  // GSAP Entrance Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const header = section.querySelector('.process-timeline-header');
    if (header) {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 88%',
          once: true
        },
        opacity: 0,
        y: 25,
        duration: 0.7,
        ease: 'power2.out'
      });
    }

    const desktopWrap = section.querySelector('.timeline-desktop-container');
    if (desktopWrap) {
      gsap.from(desktopWrap, {
        scrollTrigger: {
          trigger: desktopWrap,
          start: 'top 82%',
          once: true
        },
        opacity: 0,
        y: 35,
        duration: 0.75,
        ease: 'power3.out'
      });
    }

    const mobileWrap = section.querySelector('.timeline-mobile-container');
    if (mobileWrap) {
      gsap.from(mobileSteps, {
        scrollTrigger: {
          trigger: mobileWrap,
          start: 'top 85%',
          once: true
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', initProcessTimeline);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initProcessTimeline();
}

