(function () {
  'use strict';

  /* ── Nav elevation + active links ──────────── */
  const nav = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    nav.classList.toggle('elevated', window.scrollY > 20);
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 60) current = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Smooth scroll (offset for sticky nav 44px) ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        window.scrollTo({ top: el.offsetTop - 44, behavior: 'smooth' });
      }
    });
  });

  /* ── Mobile nav ─────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn = document.querySelector('.mobile-close');
  const openMob = () => { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; toggle.setAttribute('aria-expanded', 'true'); };
  const closeMob = () => { mobileNav.classList.remove('open'); document.body.style.overflow = ''; toggle.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', openMob);
  closeBtn?.addEventListener('click', closeMob);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));

  /* ── Scroll reveal ──────────────────────────── */
  if ('IntersectionObserver' in window) {
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        // Stagger siblings within same parent section
        const sec = entry.target.closest('section, footer');
        const siblings = sec ? [...sec.querySelectorAll('.reveal:not(.in)')] : [];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in'), Math.min(idx * 60, 300));
        revObs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ── Counter animation ──────────────────────── */
  // Only fires when stat number scrolls into view at 50% threshold
  if ('IntersectionObserver' in window) {
    const counters = document.querySelectorAll('.stat-num[data-target]');

    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseFloat(el.dataset.target);
        const pre = el.dataset.prefix || '';
        const suf = el.dataset.suffix || '';
        const dur = 1400;
        const t0 = performance.now();

        function step(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.round(end * eased) + suf;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => countObs.observe(el));
  }

  /* ── Track tabs ─────────────────────────────── */
  document.querySelectorAll('.track-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.track-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.track-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-' + btn.dataset.panel)?.classList.add('active');
    });
  });

})();
