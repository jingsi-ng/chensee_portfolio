/* ── Cursor ── */
(function initCursor() {
  const cur  = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  if (!cur || !ring) return;
  let mx = -100, my = -100, rx = -100, ry = -100;
  cur.style.left = '0'; cur.style.top = '0';
  ring.style.left = '0'; ring.style.top = '0';

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
  }, { passive: true });

  (function tick() {
    rx += (mx - rx) * 0.22;
    ry += (my - ry) * 0.22;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(tick);
  })();

  const sel = 'a, button, .proj-card, .proj-row, .design-card, .contact-row, .process-card, .skill-chip, .cs-nav-item, .avail-card';
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
  });
})();

/* ── Nav scroll ── */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const tick = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ── Active nav link ── */
(function initActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── Scroll Reveal ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });

  // Stagger siblings
  const parents = new Set();
  els.forEach(el => parents.add(el.parentElement));
  parents.forEach(p => {
    const sibs = [...p.querySelectorAll(':scope > .reveal')];
    if (sibs.length > 1) sibs.forEach((s, i) => s.style.transitionDelay = (i * 85) + 'ms');
  });
  els.forEach(el => obs.observe(el));
})();

/* ── Hero Parallax (index only) ── */
(function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const layers = hero.querySelectorAll('[data-speed]');
  let lx = 0, ly = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    tx = (e.clientX / window.innerWidth  - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  (function tick() {
    lx += (tx - lx) * 0.055;
    ly += (ty - ly) * 0.055;
    layers.forEach(layer => {
      const s = parseFloat(layer.dataset.speed || 0.02);
      const mx = lx * s * window.innerWidth  * 0.5;
      const my = ly * s * window.innerHeight * 0.5;
      layer.style.transform = `translate(${mx}px, ${my}px)`;
    });
    requestAnimationFrame(tick);
  })();
})();

/* ── Marquee pause on hover ── */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();

/* ── Terminal typing ── */
(function initTerminal() {
  const lines = document.querySelectorAll('.ctl[data-text]');
  if (!lines.length) return;
  let delay = 400;
  lines.forEach(line => {
    const text = line.getAttribute('data-text');
    line.textContent = '';
    setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        line.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(iv);
      }, 32);
    }, delay);
    delay += text.length * 32 + 140;
  });
})();

/* ── Page transition ── */
(function initPageTransition() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .4s ease';
  window.addEventListener('load', () => {
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => window.location.href = href, 260);
    });
  });
})();
