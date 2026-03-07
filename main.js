/* ── Custom Cursor (instant dot, barely-trailing ring) ── */
(function initCursor() {
  const cur  = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  if (!cur || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  // Override CSS positioning — use transform instead
  cur.style.left  = '0';  cur.style.top  = '0';
  ring.style.left = '0';  ring.style.top = '0';

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // Dot: completely instant
    cur.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  }, { passive: true });

  // Ring: very light lerp, much faster than before
  (function tick() {
    rx += (mx - rx) * 0.28;
    ry += (my - ry) * 0.28;
    ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
    requestAnimationFrame(tick);
  })();

  const hoverSel = 'a, button, .proj-card, .proj-row, .design-card, .contact-row, .process-card, .skill-chip, .cs-nav-item, .avail-card';
  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
  });
})();

/* ── Nav scroll state ── */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Active nav link ── */
(function initActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
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
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  const parents = new Set();
  els.forEach(el => parents.add(el.parentElement));
  parents.forEach(parent => {
    const siblings = [...parent.querySelectorAll(':scope > .reveal')];
    if (siblings.length > 1) {
      siblings.forEach((s, i) => s.style.transitionDelay = (i * 90) + 'ms');
    }
  });

  els.forEach(el => obs.observe(el));
})();

/* ── Marquee pause on hover ── */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();

/* ── Terminal typing animation (classified card + contact) ── */
(function initTerminal() {
  const lines = document.querySelectorAll('.ctl[data-text]');
  if (!lines.length) return;

  let delay = 500;
  lines.forEach(line => {
    const text = line.getAttribute('data-text');
    line.textContent = '';

    setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        line.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(iv);
      }, 36);
    }, delay);

    delay += text.length * 36 + 160;
  });
})();

/* ── Page transition ── */
(function initPageTransition() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.transition = 'opacity .25s ease';
      document.body.style.opacity = '0';
      setTimeout(() => window.location.href = href, 240);
    });
  });

  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .4s ease';
  window.addEventListener('load', () => {
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });
})();
