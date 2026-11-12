/**
 * Docs Dev Landing - Section 03 (The Problem: Disconnected Website Ecosystem)
 * Handles GSAP ScrollTrigger entrance, interactive cross-hover, and floating micro-animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProblemSection();
});

function initProblemSection() {
  const section = document.getElementById('problem');
  if (!section) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Setup interactive hover synchronization between cards and diagram nodes
  setupDiagramInteractions();

  // Refresh ScrollTrigger once images and fonts are loaded
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

  // If GSAP is available and motion is allowed, setup entrance and ambient animations
  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    initProblemEntranceAnimation(section);
    initFloatingNodes();
  }
}

/**
 * GSAP ScrollTrigger entrance animation for Section 03
 */
function initProblemEntranceAnimation(section) {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      gsap.set('#problem .problem-card, #problem .diagram-node, #problem .diagram-line, #problem .diagram-cross, #problem .section-badge-indicator, #diagram-center-site', {
        clearProps: 'all'
      });
    }
  });

  // Section badge indicator
  tl.from('#problem .section-badge-indicator', {
    y: -15,
    opacity: 0,
    duration: 0.6,
    immediateRender: false
  }, 0);

  // Category Tag
  tl.from('#problem .problem-tag', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    immediateRender: false
  }, 0.1);

  // Title
  tl.from('#problem .problem-title', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    immediateRender: false
  }, 0.2);

  // Description
  tl.from('#problem .problem-desc', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    immediateRender: false
  }, 0.3);

  // Problem cards stagger in
  tl.from('#problem .problem-card', {
    x: -25,
    opacity: 0,
    duration: 0.65,
    stagger: 0.1,
    ease: 'power2.out',
    immediateRender: false
  }, 0.45);

  // Center monitor scale and fade in
  tl.from('#diagram-center-site', {
    scale: 0.88,
    opacity: 0,
    transformOrigin: '340px 220px',
    duration: 0.85,
    ease: 'back.out(1.5)',
    immediateRender: false
  }, 0.4);

  // Dashed lines drawing / fading in
  tl.from('.diagram-line', {
    opacity: 0,
    duration: 0.75,
    stagger: 0.08,
    immediateRender: false
  }, 0.65);

  // Disconnection crosses pop in
  tl.from('.diagram-cross', {
    scale: 0,
    opacity: 0,
    transformOrigin: 'center center',
    duration: 0.5,
    stagger: 0.08,
    ease: 'back.out(2)',
    immediateRender: false
  }, 0.8);

  // Satellite nodes pop in
  tl.from('.diagram-node', {
    scale: 0.82,
    opacity: 0,
    duration: 0.65,
    stagger: 0.1,
    ease: 'back.out(1.6)',
    immediateRender: false
  }, 0.75);

  // Trigger via ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: () => tl.play()
    });
  }

  // Native IntersectionObserver fallback to guarantee animation always plays when scrolled into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && tl.progress() === 0) {
          tl.play();
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(section);
  } else {
    tl.play();
  }
}

/**
 * Subtle floating / breathing animation for satellite nodes
 */
function initFloatingNodes() {
  if (typeof gsap === 'undefined') return;

  const nodeConfigs = [
    { id: '#node-developer', y: 3.5, duration: 3.6, delay: 0 },
    { id: '#node-seo', y: -4, duration: 4.1, delay: 0.4 },
    { id: '#node-designer', y: 3, duration: 3.4, delay: 0.8 },
    { id: '#node-ads', y: -3.5, duration: 3.9, delay: 0.2 },
    { id: '#node-hosting', y: 4, duration: 4.4, delay: 0.6 }
  ];

  nodeConfigs.forEach(cfg => {
    const el = document.querySelector(cfg.id);
    if (!el) return;

    gsap.to(el, {
      y: cfg.y,
      duration: cfg.duration,
      delay: cfg.delay,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
}

/**
 * Sets up synchronized hover states between cards and diagram nodes
 */
function setupDiagramInteractions() {
  const cards = document.querySelectorAll('#problem .problem-card');
  const nodes = document.querySelectorAll('#problem .diagram-node');

  // Mapping from nodes to associated problem cards
  const nodeToCardIndex = {
    'developer': [0, 2],
    'seo': [0],
    'ads': [1],
    'hosting': [2],
    'designer': [0]
  };

  // Card hover -> highlight nodes and lines
  cards.forEach((card, index) => {
    const highlightAttr = card.getAttribute('data-highlight');
    if (!highlightAttr) return;

    const targets = highlightAttr.split(',').map(s => s.trim());

    card.addEventListener('mouseenter', () => {
      targets.forEach(target => activateNode(target));
    });

    card.addEventListener('mouseleave', () => {
      targets.forEach(target => deactivateNode(target));
    });

    card.addEventListener('focus', () => {
      targets.forEach(target => activateNode(target));
    });

    card.addEventListener('blur', () => {
      targets.forEach(target => deactivateNode(target));
    });
  });

  // Node hover -> highlight card and line
  nodes.forEach(node => {
    const target = node.getAttribute('data-target');
    if (!target) return;

    node.addEventListener('mouseenter', () => {
      activateNode(target);
      const cardIndices = nodeToCardIndex[target] || [];
      cardIndices.forEach(idx => {
        if (cards[idx]) cards[idx].classList.add('problem-card-highlighted');
      });
    });

    node.addEventListener('mouseleave', () => {
      deactivateNode(target);
      const cardIndices = nodeToCardIndex[target] || [];
      cardIndices.forEach(idx => {
        if (cards[idx]) cards[idx].classList.remove('problem-card-highlighted');
      });
    });
  });
}

function activateNode(name) {
  const node = document.getElementById(`node-${name}`);
  const line = document.getElementById(`line-${name}`);
  const cross = document.getElementById(`cross-${name}`);

  if (node) node.classList.add('node-active');
  if (line) line.classList.add('line-active');
  if (cross) cross.classList.add('cross-active');
}

function deactivateNode(name) {
  const node = document.getElementById(`node-${name}`);
  const line = document.getElementById(`line-${name}`);
  const cross = document.getElementById(`cross-${name}`);

  if (node) node.classList.remove('node-active');
  if (line) line.classList.remove('line-active');
  if (cross) cross.classList.remove('cross-active');
}
