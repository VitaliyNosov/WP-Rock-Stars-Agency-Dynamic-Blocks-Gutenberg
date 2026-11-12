/**
 * Dev & Plugins Section (Section 05)
 * Handles IDE interactions (file switching, active line, status)
 * and GSAP entrance animations with IntersectionObserver fallback.
 */

(function () {
  'use strict';

  // Code snippets for interactive file switching
  const codeFiles = {
    'booking.php': {
      title: 'plugin / booking.php',
      tests: '24 tests passing',
      status: 'Ln 8, Col 13',
      html: `
        <div class="ide-code-line"><span class="ide-line-num">1</span><span class="ide-line-code"><span class="code-tag">&lt;?php</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">2</span><span class="ide-line-code"><span class="code-kw">namespace</span> <span class="code-cls">Plugin\\Booking</span><span class="code-punct">;</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">3</span><span class="ide-line-code">&nbsp;</span></div>
        <div class="ide-code-line"><span class="ide-line-num">4</span><span class="ide-line-code"><span class="code-kw">class</span> <span class="code-cls">BookingController</span> <span class="code-punct">{</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">5</span><span class="ide-line-code">    <span class="code-kw">public function</span> <span class="code-fn">create</span><span class="code-punct">(</span><span class="code-var">$req</span><span class="code-punct">)</span> <span class="code-punct">{</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">6</span><span class="ide-line-code">        <span class="code-var">$slot</span> <span class="code-op">=</span> <span class="code-cls">Slots</span><span class="code-scope">::</span><span class="code-fn">find</span><span class="code-punct">(</span><span class="code-var">$req</span><span class="code-op">-&gt;</span><span class="code-prop">slot_id</span><span class="code-punct">);</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">7</span><span class="ide-line-code">&nbsp;</span></div>
        <div class="ide-code-line active"><span class="ide-line-num">8</span><span class="ide-line-code">        <span class="code-kw">if</span> <span class="code-punct">(</span><span class="code-op">!</span><span class="code-var">$slot</span><span class="code-op">-&gt;</span><span class="code-fn">isFree</span><span class="code-punct">())</span> <span class="code-punct">{</span><span class="code-cursor"></span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">9</span><span class="ide-line-code">            <span class="code-kw">return</span> <span class="code-cls">Response</span><span class="code-scope">::</span><span class="code-fn">error</span><span class="code-punct">(</span><span class="code-num">409</span><span class="code-punct">);</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">10</span><span class="ide-line-code">        <span class="code-punct">}</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">11</span><span class="ide-line-code">&nbsp;</span></div>
        <div class="ide-code-line"><span class="ide-line-num">12</span><span class="ide-line-code">        <span class="code-var">$b</span> <span class="code-op">=</span> <span class="code-cls">Booking</span><span class="code-scope">::</span><span class="code-fn">create</span><span class="code-punct">(</span><span class="code-var">$req</span><span class="code-op">-&gt;</span><span class="code-fn">all</span><span class="code-punct">());</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">13</span><span class="ide-line-code">        <span class="code-cls">Notify</span><span class="code-scope">::</span><span class="code-fn">patient</span><span class="code-punct">(</span><span class="code-var">$b</span><span class="code-punct">);</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">14</span><span class="ide-line-code">        <span class="code-kw">return</span> <span class="code-cls">Response</span><span class="code-scope">::</span><span class="code-fn">json</span><span class="code-punct">(</span><span class="code-var">$b</span><span class="code-punct">);</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">15</span><span class="ide-line-code">    <span class="code-punct">}</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">16</span><span class="ide-line-code"><span class="code-punct">}</span></span></div>
      `
    },
    'api.php': {
      title: 'plugin / api.php',
      tests: '18 tests passing',
      status: 'Ln 6, Col 19',
      html: `
        <div class="ide-code-line"><span class="ide-line-num">1</span><span class="ide-line-code"><span class="code-tag">&lt;?php</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">2</span><span class="ide-line-code"><span class="code-kw">namespace</span> <span class="code-cls">Plugin\\Api</span><span class="code-punct">;</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">3</span><span class="ide-line-code">&nbsp;</span></div>
        <div class="ide-code-line"><span class="ide-line-num">4</span><span class="ide-line-code"><span class="code-kw">class</span> <span class="code-cls">PatientApiController</span> <span class="code-punct">{</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">5</span><span class="ide-line-code">    <span class="code-kw">public function</span> <span class="code-fn">getRecords</span><span class="code-punct">(</span><span class="code-var">$patientId</span><span class="code-punct">)</span> <span class="code-punct">{</span></span></div>
        <div class="ide-code-line active"><span class="ide-line-num">6</span><span class="ide-line-code">        <span class="code-var">$auth</span> <span class="code-op">=</span> <span class="code-cls">Patients</span><span class="code-scope">::</span><span class="code-fn">authorize</span><span class="code-punct">(</span><span class="code-var">$patientId</span><span class="code-punct">);</span><span class="code-cursor"></span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">7</span><span class="ide-line-code">&nbsp;</span></div>
        <div class="ide-code-line"><span class="ide-line-num">8</span><span class="ide-line-code">        <span class="code-kw">if</span> <span class="code-punct">(</span><span class="code-op">!</span><span class="code-var">$auth</span><span class="code-op">-&gt;</span><span class="code-fn">hasConsent</span><span class="code-punct">())</span> <span class="code-punct">{</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">9</span><span class="ide-line-code">            <span class="code-kw">return</span> <span class="code-cls">Response</span><span class="code-scope">::</span><span class="code-fn">error</span><span class="code-punct">(</span><span class="code-num">403</span><span class="code-punct">);</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">10</span><span class="ide-line-code">        <span class="code-punct">}</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">11</span><span class="ide-line-code">&nbsp;</span></div>
        <div class="ide-code-line"><span class="ide-line-num">12</span><span class="ide-line-code">        <span class="code-var">$records</span> <span class="code-op">=</span> <span class="code-cls">MedicalRecords</span><span class="code-scope">::</span><span class="code-fn">for</span><span class="code-punct">(</span><span class="code-var">$auth</span><span class="code-punct">);</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">13</span><span class="ide-line-code">        <span class="code-cls">AuditLog</span><span class="code-scope">::</span><span class="code-fn">access</span><span class="code-punct">(</span><span class="code-var">$patientId</span><span class="code-punct">,</span> <span class="code-str">'read'</span><span class="code-punct">);</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">14</span><span class="ide-line-code">        <span class="code-kw">return</span> <span class="code-cls">Response</span><span class="code-scope">::</span><span class="code-fn">json</span><span class="code-punct">(</span><span class="code-var">$records</span><span class="code-punct">);</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">15</span><span class="ide-line-code">    <span class="code-punct">}</span></span></div>
        <div class="ide-code-line"><span class="ide-line-num">16</span><span class="ide-line-code"><span class="code-punct">}</span></span></div>
      `
    }
  };

  function initFileSwitcher() {
    const tabBooking = document.getElementById('tab-booking');
    const tabApi = document.getElementById('tab-api');
    const titleEl = document.getElementById('ide-filename');
    const editorContainer = document.getElementById('ide-editor-container');
    const testStatusEl = document.getElementById('ide-test-status');
    const caretStatusEl = document.getElementById('ide-caret-status');

    if (!tabBooking || !tabApi || !editorContainer) return;

    function switchFile(fileName, activeTab, inactiveTab) {
      if (activeTab.classList.contains('active')) return;

      const fileData = codeFiles[fileName];
      if (!fileData) return;

      activeTab.classList.add('active');
      inactiveTab.classList.remove('active');

      // Smooth fade transition
      editorContainer.style.opacity = '0';
      editorContainer.style.transform = 'translateY(4px)';
      editorContainer.style.transition = 'opacity 0.15s ease, transform 0.15s ease';

      setTimeout(function () {
        titleEl.textContent = fileData.title;
        editorContainer.innerHTML = fileData.html;
        testStatusEl.textContent = fileData.tests;
        caretStatusEl.textContent = fileData.status;

        editorContainer.style.opacity = '1';
        editorContainer.style.transform = 'translateY(0)';
      }, 150);
    }

    tabBooking.addEventListener('click', function () {
      switchFile('booking.php', tabBooking, tabApi);
    });

    tabApi.addEventListener('click', function () {
      switchFile('api.php', tabApi, tabBooking);
    });

    // Keyboard navigation (Enter / Space)
    [tabBooking, tabApi].forEach(function (tab) {
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tab.click();
        }
      });
    });
  }

  function initAnimations() {
    const section = document.getElementById('development');
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Show immediately
      return;
    }

    const badge = section.querySelector('.section-badge-indicator');
    const ideWindow = section.querySelector('.ide-window-outer') || section.querySelector('.ide-window');
    const devTag = section.querySelector('.dev-tag');
    const devTitle = section.querySelector('.dev-title');
    const devDesc = section.querySelector('.dev-desc');
    const checkItems = section.querySelectorAll('.dev-check-item');
    const ctaBtn = section.querySelector('#dev-cta-btn');

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Set initial states
      gsap.set(ideWindow, { opacity: 0, y: 30, scale: 0.98 });
      if (badge) gsap.set(badge, { opacity: 0, x: -15 });
      gsap.set([devTag, devTitle, devDesc], { opacity: 0, y: 20 });
      gsap.set(checkItems, { opacity: 0, x: 20 });
      if (ctaBtn) gsap.set(ctaBtn, { opacity: 0, y: 15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: true
        }
      });

      if (badge) {
        tl.to(badge, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, 0);
      }

      // IDE Window floats in with realistic ease
      tl.to(ideWindow, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: 'power3.out'
      }, 0.1);

      // Right column content sequence
      tl.to(devTag, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.2)
        .to(devTitle, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.3)
        .to(devDesc, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.45)
        .to(checkItems, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }, 0.55)
        .to(ctaBtn, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }, 0.85);

    } else {
      // IntersectionObserver fallback
      const observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (badge) badge.style.opacity = '1';
              if (ideWindow) {
                ideWindow.style.opacity = '1';
                ideWindow.style.transform = 'none';
              }
              if (devTag) devTag.style.opacity = '1';
              if (devTitle) devTitle.style.opacity = '1';
              if (devDesc) devDesc.style.opacity = '1';
              checkItems.forEach(function (item) {
                item.style.opacity = '1';
                item.style.transform = 'none';
              });
              if (ctaBtn) ctaBtn.style.opacity = '1';
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(section);
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initFileSwitcher();
      initAnimations();
    });
  } else {
    initFileSwitcher();
    initAnimations();
  }
})();
