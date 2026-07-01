/* ==========================================================================
   PHIL Dental Clinic — Main App JS
   Loader, mobile drawer, contact form.
   ========================================================================== */

(function () {
  /* ---------- Loading screen ---------- */
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 500);
    }
  });
  // Safety net in case 'load' fires very late (slow assets)
  setTimeout(() => {
    const loader = document.querySelector('.loader');
    if (loader) loader.classList.add('hidden');
  }, 3500);

  /* ---------- Mobile drawer ---------- */
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');

  function closeDrawer() {
    hamburger?.classList.remove('open');
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleDrawer() {
    const isOpen = drawer?.classList.toggle('open');
    hamburger?.classList.toggle('open', !!isOpen);
    overlay?.classList.toggle('open', !!isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', toggleDrawer);
  overlay?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));

  /* ---------- Hero orbit video (fallback if autoplay is blocked) ---------- */
  const orbitVideo = document.querySelector('.orbit-video');
  if (orbitVideo) {
    const tryPlay = () => orbitVideo.play().catch(() => {});
    tryPlay();
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('touchstart', tryPlay, { once: true });
  }

  /* ---------- Contact form (Formspree) ---------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusEl = contactForm.querySelector('.form-status');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          statusEl.textContent = "Thank you — your message has been sent. We'll be in touch shortly.";
          statusEl.className = 'form-status success';
          contactForm.reset();
        } else {
          statusEl.textContent = 'Something went wrong. Please call us directly at +234 806 631 0546.';
          statusEl.className = 'form-status error';
        }
      } catch (err) {
        statusEl.textContent = 'Network error. Please call us directly at +234 806 631 0546.';
        statusEl.className = 'form-status error';
      } finally {
        if (submitBtn) { submitBtn.textContent = originalLabel; submitBtn.disabled = false; }
      }
    });
  }

  /* ---------- Set active nav link based on current page ---------- */
  const currentPage = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();
