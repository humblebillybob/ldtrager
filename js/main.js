(function () {
  'use strict';

  /* ── Rose rule: position exactly below hero-name after fonts load ──
     Rule is position:absolute inside .hero-top (position:relative).
     So top is measured relative to .hero-top's top edge.
     Photo-wrap is z-index:2 in #hero context so it renders over rule.
  ----------------------------------------------------------------- */
  function positionHeroRule() {
    const name = document.getElementById('hero-name');
    const rule = document.getElementById('hero-rule');
    if (!name || !rule) return;
    // top relative to .hero-top = name's offsetTop + name's offsetHeight
    rule.style.top = (name.offsetTop + name.offsetHeight) + 'px';
  }

  // Run immediately, after fonts load, and on resize
  positionHeroRule();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(positionHeroRule);
  }
  window.addEventListener('load', positionHeroRule);
  window.addEventListener('resize', positionHeroRule, { passive: true });

  /* ── Sticky nav ─────────────────────────────────────────────────
     Nav sits in normal flow below hero.
     Once it reaches the viewport top, it becomes fixed.
     A placeholder div takes its space so content doesn't jump.
  ----------------------------------------------------------------- */
  const nav = document.getElementById('site-nav');
  const sentinel = document.getElementById('nav-sentinel');

  const placeholder = document.createElement('div');
  placeholder.id = 'nav-placeholder';
  nav.after(placeholder);

  const stickyObs = new IntersectionObserver(
    ([entry]) => {
      const shouldStick = !entry.isIntersecting;
      nav.classList.toggle('is-sticky', shouldStick);
      placeholder.classList.toggle('visible', shouldStick);
    },
    { threshold: 0, rootMargin: '-44px 0px 0px 0px' }
  );
  stickyObs.observe(sentinel);

  /* ── Active nav links on scroll ─────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function updateActive() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 80) current = s.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  /* ── Smooth scroll (offset for nav height 44px) ──────────── */
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

  /* ── Mobile nav ──────────────────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn = document.querySelector('.mobile-close');
  const openMob  = () => { mobileNav.classList.add('open');    document.body.style.overflow = 'hidden'; toggle.setAttribute('aria-expanded', 'true');  };
  const closeMob = () => { mobileNav.classList.remove('open'); document.body.style.overflow = '';       toggle.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', openMob);
  closeBtn?.addEventListener('click', closeMob);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));

  /* ── Scroll reveal ───────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
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

  /* ── Counter animation ───────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const end = parseFloat(el.dataset.target);
        const pre = el.dataset.prefix || '';
        const suf = el.dataset.suffix || '';
        const dur = 1400;
        const t0  = performance.now();
        const step = now => {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-num[data-target]').forEach(el => countObs.observe(el));
  }

  /* ── Track tabs ──────────────────────────────────────────── */
  document.querySelectorAll('.track-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.track-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.track-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-' + btn.dataset.panel)?.classList.add('active');
    });
  });

})();
