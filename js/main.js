(function () {
  'use strict';

  /* ── Nav elevation ─────────────────────────── */
  const nav = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('elevated', y > 20);
    let current = '';
    sections.forEach(s => { if (y >= s.offsetTop - 60) current = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Smooth scroll ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); window.scrollTo({ top: el.offsetTop - 44, behavior: 'smooth' }); }
    });
  });

  /* ── Mobile nav ─────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const close = document.querySelector('.mobile-close');
  const openMob = () => { mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; toggle.setAttribute('aria-expanded', 'true'); };
  const closeMob = () => { mobileNav.classList.remove('open'); document.body.style.overflow = ''; toggle.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', openMob);
  close?.addEventListener('click', closeMob);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));

  /* ── Scroll reveal ──────────────────────────── */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const sec = entry.target.closest('section, footer');
        const siblings = sec ? [...sec.querySelectorAll('.reveal:not(.in)')] : [];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in'), Math.min(idx * 55, 280));
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ── Counter animation ──────────────────────── */
  if ('IntersectionObserver' in window) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseFloat(el.dataset.target);
        const pre = el.dataset.prefix || '';
        const suf = el.dataset.suffix || '';
        const dur = 1500;
        const t0 = performance.now();
        const step = now => {
          const p = Math.min((now - t0) / dur, 1);
          const v = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.round(end * v) + suf;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.stat-num[data-target]').forEach(el => cObs.observe(el));
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
