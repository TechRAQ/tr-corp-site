/* ==========================================================
   SITE CHROME — sticky header, mobile menu, active link, progress
   ========================================================== */
(function () {
  'use strict';

  const header = document.querySelector('[data-tq-header]');
  const progress = document.querySelector('.tq-progress');
  const burger = document.querySelector('.tq-burger');
  const mobile = document.getElementById('tqMobile');

  /* Active link: match current file name (service detail pages count as Services) */
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const servicePages = [
    'ai_solutions_enablement.html', 'application_modernization.html', 'digital_transformation.html',
    'products_innovation_and_execution.html', 'agile_dev_devops.html', 'advance_analytics.html',
    'software_quality_engineering.html', 'business_process.html'
  ];
  const activeHref = servicePages.includes(page) ? 'services.html'
    : page === 'apply.html' ? 'careers.html'
    : page === 'qisido.html' ? 'ai-accelerators.html'
    : page;
  document.querySelectorAll('.tq-nav a, .tq-mobile a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (href && href === activeHref && !a.closest('.tq-mega')) a.setAttribute('aria-current', 'page');
  });

  /* Scroll state + progress */
  // pages with a dark hero (home) keep the header transparent until the hero is scrolled past
  const darkHero = document.querySelector('.hx-hero');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', y > 10);
      if (darkHero) {
        const heroBottom = darkHero.getBoundingClientRect().bottom;
        header.classList.toggle('is-over-hero', heroBottom > header.offsetHeight);
      }
    }
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
  }
  window.addEventListener('resize', () => requestAnimationFrame(onScroll));
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* Mobile menu */
  if (burger && mobile) {
    /* Services sub-menu: built from the desktop mega menu so every page gets it without markup changes */
    const svcLink = mobile.querySelector(':scope > a[href="services.html"]');
    const megaLinks = Array.from(document.querySelectorAll('.tq-mega .tq-mega__svc'));
    if (svcLink && megaLinks.length) {
      const group = document.createElement('div');
      group.className = 'tq-mobile__group';
      svcLink.before(group);
      group.appendChild(svcLink);

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'tq-mobile__toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', 'tqMobileSvc');
      toggle.setAttribute('aria-label', 'Show service lines');
      toggle.innerHTML = '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';
      group.appendChild(toggle);

      const sub = document.createElement('div');
      sub.className = 'tq-mobile__sub';
      sub.id = 'tqMobileSvc';
      const inner = document.createElement('div');
      megaLinks.forEach(m => {
        const a = document.createElement('a');
        a.href = m.getAttribute('href');
        const icon = m.querySelector('i');
        if (icon) a.appendChild(icon.cloneNode(true));
        a.appendChild(document.createTextNode((m.querySelector('b') || m).textContent.trim()));
        inner.appendChild(a);
      });
      sub.appendChild(inner);
      group.after(sub);

      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Hide service lines' : 'Show service lines');
        sub.classList.toggle('is-open', open);
      });
    }

    mobile.querySelectorAll('a').forEach((a, i) => a.style.setProperty('--i', i));

    function setOpen(open) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mobile.classList.toggle('is-open', open);
      mobile.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('tq-lock', open);
      if (header) header.classList.toggle('menu-open', open);
    }

    burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
    mobile.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobile.classList.contains('is-open')) {
        setOpen(false);
        burger.focus();
      }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 991) setOpen(false); });
  }
})();

/* ==========================================================
   CURSOR DOTS — in whichever section the mouse is over, a dot
   grid lights up in a circle around the pointer (behind content)
   ========================================================== */
(function () {
  'use strict';

  if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const AREAS = 'main section, .tq-footer';
  const layers = new WeakMap();
  let current = null, raf = 0, px = 0, py = 0;

  function layerFor(area) {
    let lit = layers.get(area);
    if (!lit) {
      lit = document.createElement('div');
      lit.className = 'tq-dots-lit';
      lit.setAttribute('aria-hidden', 'true');
      area.classList.add('tq-has-dots');
      area.prepend(lit);
      layers.set(area, lit);
    }
    return lit;
  }

  // the glow eases towards the pointer each frame, so it glides instead of jumping
  let gx = 0, gy = 0, started = false;

  function frame() {
    raf = 0;
    if (!current) return;
    if (!started) { gx = px; gy = py; started = true; }
    gx += (px - gx) * 0.14;
    gy += (py - gy) * 0.14;
    const r = current.getBoundingClientRect();
    const lit = layerFor(current);
    lit.style.setProperty('--mx', (gx - r.left).toFixed(1) + 'px');
    lit.style.setProperty('--my', (gy - r.top).toFixed(1) + 'px');
    lit.classList.add('is-on');
    if (Math.abs(px - gx) > 0.3 || Math.abs(py - gy) > 0.3) raf = requestAnimationFrame(frame);
  }

  function kick() {
    if (current && !raf) raf = requestAnimationFrame(frame);
  }

  document.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    px = e.clientX;
    py = e.clientY;
    const area = e.target.closest ? e.target.closest(AREAS) : null;
    if (area !== current) {
      if (current && layers.get(current)) layers.get(current).classList.remove('is-on');
      current = area;
    }
    kick();
  }, { passive: true });

  // the page moves under a still mouse while scrolling: keep the glow on the pointer
  window.addEventListener('scroll', () => {
    if (!started) return;
    const el = document.elementFromPoint(px, py);
    const area = el && el.closest ? el.closest(AREAS) : null;
    if (area !== current) {
      if (current && layers.get(current)) layers.get(current).classList.remove('is-on');
      current = area;
    }
    kick();
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    if (current && layers.get(current)) layers.get(current).classList.remove('is-on');
    current = null;
    started = false;
  });
})();
