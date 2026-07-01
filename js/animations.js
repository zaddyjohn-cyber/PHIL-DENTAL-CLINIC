/* ==========================================================================
   PHIL Dental Clinic — Animations
   Navbar scroll state, scroll-reveal, GSAP ScrollTrigger, CountUp stats,
   VanillaTilt cards, custom cursor.
   ========================================================================== */

(function () {
  /* ---------- Navbar scroll state ---------- */
  const navbar = document.querySelector('.navbar');
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---------- Scroll reveal (IntersectionObserver, no GSAP dependency) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- GSAP ScrollTrigger enhancements (if loaded) ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.gsap-fade-up').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    });

    gsap.utils.toArray('.gsap-stagger').forEach((group) => {
      const items = group.children;
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 82%' },
        }
      );
    });
  }

  /* ---------- CountUp stats ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const runCounter = (el) => {
      const end = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      if (window.CountUp) {
        const cu = new window.CountUp.CountUp(el, end, {
          duration: 2.2,
          suffix,
        });
        if (!cu.error) cu.start();
        else el.textContent = end + suffix;
      } else {
        // simple fallback counter
        let cur = 0;
        const step = Math.max(1, Math.ceil(end / 60));
        const timer = setInterval(() => {
          cur += step;
          if (cur >= end) { cur = end; clearInterval(timer); }
          el.textContent = cur + suffix;
        }, 25);
      }
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              cio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => cio.observe(el));
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- VanillaTilt ---------- */
  if (window.VanillaTilt) {
    const tiltEls = document.querySelectorAll('.tilt-card, .team-card, .service-detail-card, .contact-info-card');
    if (tiltEls.length) {
      VanillaTilt.init(tiltEls, {
        max: 8,
        speed: 500,
        glare: true,
        'max-glare': 0.15,
        scale: 1.02,
      });
    }
  }

  /* ---------- Custom cursor (desktop only) ---------- */
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isFinePointer) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.left = targetX + 'px';
      dot.style.top = targetY + 'px';
    });

    function ringLoop() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(ringLoop);
    }
    ringLoop();

    const hoverables = 'a, button, .btn, .flip-card, .filter-tab, input, textarea, select, .masonry-item';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) ring.classList.remove('hover');
    });
  }
})();
