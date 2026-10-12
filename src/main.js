/**
 * BIPLAB MAL — DEVELOPER PORTFOLIO
 * Production client scripts: Theme management, Mobile navigation,
 * Resume modal viewer, Skills filter, Copy to clipboard, and Smooth scrolling.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollSpy();
  initBackToTop();
  initSkillsFilter();
  initResumeModal();
  initCopyEmail();
});

/* ==========================================================================
   1. THEME MANAGEMENT (Default: Refined Light Theme)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme-preference');

  // Default to light as specified in design direction
  if (storedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme-preference', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme-preference', 'dark');
      }
    });
  }
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileBtn || !mobileMenu) return;

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : mobileMenu.hasAttribute('hidden');
    if (isOpen) {
      mobileMenu.removeAttribute('hidden');
      mobileBtn.setAttribute('aria-expanded', 'true');
      mobileBtn.setAttribute('aria-label', 'Close mobile navigation menu');
    } else {
      mobileMenu.setAttribute('hidden', '');
      mobileBtn.setAttribute('aria-expanded', 'false');
      mobileBtn.setAttribute('aria-label', 'Open mobile navigation menu');
    }
  }

  mobileBtn.addEventListener('click', () => {
    const isCurrentlyHidden = mobileMenu.hasAttribute('hidden');
    toggleMenu(isCurrentlyHidden);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.hasAttribute('hidden')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   3. SCROLL SPY & ACTIVE NAV HIGHLIGHT
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   4. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.removeAttribute('hidden');
    } else {
      backToTopBtn.setAttribute('hidden', '');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   5. SKILLS CATEGORY FILTER
   ========================================================================== */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-category-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. RESUME PREVIEW MODAL
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtnHeader = document.getElementById('btn-preview-resume');
  const openBtnMobile = document.getElementById('mobile-preview-btn');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal) return;

  function openModal() {
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (openBtnHeader) openBtnHeader.addEventListener('click', openModal);
  if (openBtnMobile) {
    openBtnMobile.addEventListener('click', () => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) mobileMenu.setAttribute('hidden', '');
      openModal();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. COPY EMAIL TO CLIPBOARD WITH TOAST
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('btn-copy-email');
  const copyText = document.getElementById('copy-text');
  const toast = document.getElementById('toast-notification');
  const emailToCopy = 'biplabmal626@gmail.com';

  if (!copyBtn) return;

  function showToast(message) {
    if (!toast) return;
    const msgSpan = document.getElementById('toast-message');
    if (msgSpan) msgSpan.textContent = message;
    toast.removeAttribute('hidden');
    setTimeout(() => {
      toast.setAttribute('hidden', '');
    }, 2800);
  }

  copyBtn.addEventListener('click', async () => {
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
        copied = true;
      }
    } catch (e) {
      // Ignore and fallback
    }

    if (!copied) {
      try {
        const textArea = document.createElement('textarea');
        textArea.id = 'clipboard_fallback';
        textArea.name = 'clipboard_fallback';
        textArea.value = emailToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copied = document.execCommand('copy');
        textArea.remove();
      } catch (err) {
        console.warn('Fallback copy error:', err);
      }
    }

    if (copyText) copyText.textContent = 'Copied!';
    showToast('Email copied to clipboard: ' + emailToCopy);
    setTimeout(() => {
      if (copyText) copyText.textContent = 'Copy';
    }, 2500);
  });
}
