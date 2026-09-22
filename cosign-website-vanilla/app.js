/**
 * Cosign Website - Vanilla JS
 * Theme switching, hash animation, modal, smooth scroll, active nav
 */

(function() {
  'use strict';

  // ============================================================================
  // THEME SWITCHING
  // ============================================================================
  function initTheme() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const html = document.documentElement;
    
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeSwitcher(savedTheme);

    if (themeSwitcher) {
      themeSwitcher.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeSwitcher(newTheme);
      });
    }
  }

  function updateThemeSwitcher(theme) {
    const switcher = document.querySelector('.theme-switcher');
    if (!switcher) return;
    
    const icon = switcher.querySelector('.theme-switcher__icon');
    const label = switcher.querySelector('.theme-switcher__label');
    
    if (theme === 'dark') {
      icon.textContent = '☾';
      label.textContent = 'dark';
      switcher.setAttribute('aria-label', 'Switch to light theme');
      switcher.setAttribute('title', 'Switch to light theme');
    } else {
      icon.textContent = '☀';
      label.textContent = 'light';
      switcher.setAttribute('aria-label', 'Switch to dark theme');
      switcher.setAttribute('title', 'Switch to dark theme');
    }
  }

  // ============================================================================
  // HERO HASH ANIMATION
  // ============================================================================
  function initHeroHash() {
    const hashEl = document.getElementById('hero-hash');
    if (!hashEl) return;

    const chars = '0123456789abcdef';
    let currentHash = 'a1f4e8...9c2f';

    function generateHash() {
      let hash = '';
      for (let i = 0; i < 12; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
      }
      return `${hash}...9c2f`;
    }

    // Update hash every 3 seconds
    setInterval(() => {
      currentHash = generateHash();
      hashEl.textContent = currentHash;
    }, 3000);
  }

  // ============================================================================
  // SMOOTH SCROLL & ACTIVE NAV
  // ============================================================================
  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('section[id]');
    
    // Handle nav link clicks
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.slice(1);
          const target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            updateActiveNav(targetId);
          }
        }
      });
    });

    // Update active nav on scroll
    let scrollTimeout;
    function onScroll() {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        let currentSection = 'home';
        sections.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
          }
        });
        updateActiveNav(currentSection);
        scrollTimeout = null;
      }, 50);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function updateActiveNav(sectionId) {
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
      link.classList.toggle('current', link.dataset.section === sectionId);
    });
  }

  // ============================================================================
  // CONTACT MODAL
  // ============================================================================
  function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const form = document.getElementById('contact-form');
    const closeBtn = document.getElementById('contact-cancel');
    const modalCloseBtn = modal.querySelector('.modal-close');
    const statusEl = document.getElementById('contact-status');
    const reasonSelect = document.getElementById('contact-reason');
    const openedAtInput = document.getElementById('contact-opened-at');

    // Track open reason
    let currentReason = 'general';

    function openModal(reason = 'general') {
      currentReason = reason;
      reasonSelect.value = reason;
      openedAtInput.value = Date.now();
      statusEl.textContent = '';
      statusEl.className = 'contact-status';
      modal.showModal();
      // Focus first input
      setTimeout(() => {
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
      }, 0);
    }

    function closeModal() {
      modal.close();
      form.reset();
    }

    // Open modal from contact links
    document.querySelectorAll('[data-contact-reason]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const reason = link.dataset.contactReason;
        // Handle anchor links that should scroll first
        if (link.getAttribute('href')?.startsWith('#')) {
          const targetId = link.getAttribute('href').slice(1);
          const target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Open modal after scroll
            setTimeout(() => openModal(reason), 500);
          }
        } else {
          openModal(reason);
        }
      });
    });

    // Close handlers
    closeBtn.addEventListener('click', closeModal);
    modalCloseBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.open) {
        closeModal();
      }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('contact-submit');
      submitBtn.disabled = true;
      setStatus('Sending…');

      const formData = new FormData(form);
      const payload = {
        reason: formData.get('reason'),
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        message: formData.get('message').trim(),
        website: formData.get('website'), // honeypot
        opened_at: formData.get('opened_at'),
      };

      // Honeypot check
      if (payload.website) {
        setStatus('Something went wrong sending that. Please try again shortly.', 'error');
        submitBtn.disabled = false;
        return;
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        let result = null;
        try {
          result = await response.json();
        } catch (_) {
          // Non-JSON response
        }

        if (!response.ok || !result || result.ok !== true) {
          throw new Error((result && result.error) || 'Request failed');
        }

        setStatus('Thanks — we\'ll be in touch soon.', 'success');
        form.reset();
      } catch (_err) {
        setStatus('Something went wrong sending that. Please try again shortly.', 'error');
      } finally {
        submitBtn.disabled = false;
      }
    });

    function setStatus(text, variant) {
      statusEl.textContent = text;
      statusEl.className = `contact-status${variant ? ` contact-status-${variant}` : ''}`;
    }
  }

  // ============================================================================
  // INIT
  // ============================================================================
  function init() {
    initTheme();
    initHeroHash();
    initSmoothScroll();
    initContactModal();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
