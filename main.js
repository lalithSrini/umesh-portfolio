/* ============================================================
   VENKATA UMESH KHANDE — PORTFOLIO JAVASCRIPT
   ============================================================ */

'use strict';

// ── 1. Navbar: sticky + active section highlighting ──────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navLinksWrapper = document.getElementById('navLinks');

  // Sticky navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveSection();
    updateScrollTopBtn();
  }, { passive: true });

  // Active section detection
  function updateActiveSection() {
    let current = '';
    sections.forEach(section => {
      const sTop = section.offsetTop - 100;
      if (window.scrollY >= sTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  }

  // Hamburger menu
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinksWrapper.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close mobile menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksWrapper.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ── 2. Theme Toggle ──────────────────────────────────────────
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const body = document.body;
  const STORAGE_KEY = 'vuk-theme';

  // Load saved preference
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light') {
    setLight();
  } else {
    setDark();
  }

  btn.addEventListener('click', () => {
    if (body.classList.contains('light-theme')) {
      setDark();
      localStorage.setItem(STORAGE_KEY, 'dark');
    } else {
      setLight();
      localStorage.setItem(STORAGE_KEY, 'light');
    }
  });

  function setDark() {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    icon.textContent = '☀️';
  }
  function setLight() {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    icon.textContent = '🌙';
  }
})();

// ── 3. Hero Typing Animation ─────────────────────────────────
(function initTyping() {
  const el = document.getElementById('heroTyped');
  if (!el) return;

  // Use words from data-loader if available, otherwise defaults
  window.__VUK_TYPED_WORDS = window.__VUK_TYPED_WORDS || [
    'Java Developer',
    'AWS Cloud Engineer',
    'Full Stack Developer',
    'Microservices Expert',
    'Spring Boot Engineer'
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const TYPING_SPEED = 80;
  const DELETING_SPEED = 45;
  const PAUSE = 2200;

  function type() {
    const words = window.__VUK_TYPED_WORDS;
    const currentWord = words[wordIdx % words.length];

    if (!isDeleting) {
      el.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === currentWord.length) {
        isDeleting = true;
        setTimeout(type, PAUSE);
        return;
      }
    } else {
      el.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }
    setTimeout(type, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  setTimeout(type, 800);
})();

// ── 4. Scroll Reveal ─────────────────────────────────────────
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

// ── 6. Counter Animation ─────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }
})();

// ── 7. Skill & Cloud Bars Animation ──────────────────────────
(function initBars() {
  const fills = document.querySelectorAll('.skill-bar-fill, .cloud-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width;
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();

// ── 8. Scroll To Top Button ───────────────────────────────────
function updateScrollTopBtn() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}

document.getElementById('scrollTopBtn')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── 9. Contact Form — EmailJS Integration ─────────────────────
(function initContactForm() {
  // ── EmailJS credentials ── fill these in after setting up at emailjs.com ──
  const EMAILJS_PUBLIC_KEY       = 'fsOn_1gzYYiMSmyZA';  // ✅ Account → API Keys
  const EMAILJS_SERVICE_ID       = 'service_tfk5zbv';     // ✅ Email Services
  const EMAILJS_TEMPLATE_ID      = 'template_qnzilrj';    // ✅ Contact Us template
  const EMAILJS_AUTOREPLY_ID     = 'template_e6a3yev';    // ✅ Auto-Reply template

  // Initialise EmailJS with your public key
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    contactName:       { errorId: 'nameError',    label: 'Name',    minLen: 2 },
    contactEmailInput: { errorId: 'emailError',   label: 'Email',   isEmail: true },
    contactSubject:    { errorId: 'subjectError', label: 'Subject', minLen: 3 },
    contactMessage:    { errorId: 'messageError', label: 'Message', minLen: 20 }
  };

  function showError(errorEl, input, msg) {
    errorEl.textContent = msg;
    input.classList.add('error');
  }
  function clearError(errorEl, input) {
    errorEl.textContent = '';
    input.classList.remove('error');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateField(fieldId, opts) {
    const input   = document.getElementById(fieldId);
    const errorEl = document.getElementById(opts.errorId);
    const value   = input.value.trim();

    if (!value) {
      showError(errorEl, input, `${opts.label} is required.`);
      return false;
    }
    if (opts.isEmail && !validateEmail(value)) {
      showError(errorEl, input, 'Please enter a valid email address.');
      return false;
    }
    if (opts.minLen && value.length < opts.minLen) {
      showError(errorEl, input, `${opts.label} must be at least ${opts.minLen} characters.`);
      return false;
    }
    clearError(errorEl, input);
    return true;
  }

  // Real-time validation on blur / input
  Object.entries(fields).forEach(([id, opts]) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('blur',  () => validateField(id, opts));
      input.addEventListener('input', () => {
        const errorEl = document.getElementById(opts.errorId);
        if (errorEl.textContent) validateField(id, opts);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Run all field validations
    let valid = true;
    Object.entries(fields).forEach(([id, opts]) => {
      if (!validateField(id, opts)) valid = false;
    });
    if (!valid) return;

    const btn       = document.getElementById('submitFormBtn');
    const btnText   = btn.querySelector('.btn-text');
    const successEl = document.getElementById('formSuccess');

    // Loading state
    btn.disabled         = true;
    btnText.textContent  = 'Sending…';
    successEl.style.display = 'none';
    successEl.className  = 'form-success';

    // Variable names match your EmailJS template placeholders exactly
    const now = new Date();
    const templateParams = {
      name:    document.getElementById('contactName').value.trim(),
      email:   document.getElementById('contactEmailInput').value.trim(),
      title:   document.getElementById('contactSubject').value.trim(),
      message: document.getElementById('contactMessage').value.trim(),
      time:    now.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    };

    console.log('[EmailJS] Sending with params:', templateParams);

    // Send both emails in parallel: notification to you + auto-reply to sender
    Promise.all([
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams),
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_ID, templateParams)
    ])
      .then(([mainRes, replyRes]) => {
        console.log('[EmailJS] Contact notification sent:', mainRes.status);
        console.log('[EmailJS] Auto-reply sent:', replyRes.status);
        btn.disabled        = false;
        btnText.textContent = 'Send Message';
        form.reset();
        successEl.textContent   = '✅ Message sent! I\'ll get back to you within 24 hours.';
        successEl.style.display = 'block';
        successEl.classList.add('form-success--ok');
        setTimeout(() => { successEl.style.display = 'none'; }, 7000);
      })
      .catch((error) => {
        console.error('[EmailJS] FAILED:', error);
        btn.disabled        = false;
        btnText.textContent = 'Send Message';
        successEl.textContent   = '❌ Something went wrong. Please email me directly at kvuc2021@gmail.com';
        successEl.style.display = 'block';
        successEl.classList.add('form-success--err');
        setTimeout(() => { successEl.style.display = 'none'; }, 8000);
      });
  });
})();

// ── 10. Smooth Scroll for anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── 11. Cloud Icon Tooltips ───────────────────────────────────
(function initTooltips() {
  const items = document.querySelectorAll('[data-tooltip]');
  items.forEach(item => {
    item.style.position = 'relative';
    const tooltip = document.createElement('div');
    tooltip.textContent = item.dataset.tooltip;
    tooltip.style.cssText = `
      position: absolute;
      bottom: 110%;
      left: 50%;
      transform: translateX(-50%);
      background: #1E293B;
      color: #E2E8F0;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      border: 1px solid rgba(255,255,255,0.1);
      z-index: 10;
    `;
    item.appendChild(tooltip);
    item.addEventListener('mouseenter', () => tooltip.style.opacity = '1');
    item.addEventListener('mouseleave', () => tooltip.style.opacity = '0');
  });
})();

// ── 12. Page Load Animation ───────────────────────────────────
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // Safety fallback
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
})();

// ── 13. Timeline hover effect with progress line ─────────────
(function initTimelineEffect() {
  const items = document.querySelectorAll('.timeline-item');
  items.forEach(item => {
    const card = item.querySelector('.timeline-card');
    const dot = item.querySelector('.timeline-dot');

    card?.addEventListener('mouseenter', () => {
      if (dot) {
        dot.style.transform = 'scale(1.3)';
        dot.style.transition = 'transform 0.3s ease';
      }
    });
    card?.addEventListener('mouseleave', () => {
      if (dot) dot.style.transform = 'scale(1)';
    });
  });
})();

// ── 14. Project cards 3D tilt effect ─────────────────────────
(function initTiltEffect() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((y - centerY) / centerY) * -4;
      const rotY = ((x - centerX) / centerX) * 4;

      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

console.log('%c VUK Portfolio ', 'background:#2563EB;color:white;padding:4px 12px;border-radius:4px;font-weight:bold;font-size:14px;');
console.log('%c Built with HTML, CSS & Vanilla JavaScript', 'color:#06B6D4;font-size:12px;');
