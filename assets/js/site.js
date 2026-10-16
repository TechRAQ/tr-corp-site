/* ==========================================================
   SITE — page interactions for the redesigned pages
   ========================================================== */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Accordions (accelerators on home) ---------- */
  document.querySelectorAll('[data-accordion]').forEach(group => {
    const items = Array.from(group.querySelectorAll('.tq-acc'));
    items.forEach(item => {
      const btn = item.querySelector('.tq-acc__top');
      btn.addEventListener('click', () => {
        const open = !item.classList.contains('is-open');
        items.forEach(i => {
          i.classList.remove('is-open');
          i.querySelector('.tq-acc__top').setAttribute('aria-expanded', 'false');
        });
        if (open) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });

  /* ---------- Scrollspy: side nav ↔ stacked cards ---------- */
  function scrollspy(linkSel, cardSel) {
    const links = Array.from(document.querySelectorAll(linkSel));
    const cards = Array.from(document.querySelectorAll(cardSel));
    if (!links.length || !cards.length || !('IntersectionObserver' in window)) return;
    const setActive = id => {
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
      cards.forEach(c => c.classList.toggle('is-current', c.id === id));
    };
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    cards.forEach(c => io.observe(c));
    setActive(cards[0].id);
  }
  scrollspy('.tq-suite__nav a', '.tq-feature');

  /* ---------- Services nav: highlight that glides to the active link ---------- */
  document.querySelectorAll('.tq-suite__nav').forEach(nav => {
    const links = Array.from(nav.querySelectorAll('a'));
    links.forEach(a => {
      const label = Array.from(a.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim());
      if (!label.length) return;
      const span = document.createElement('span');
      label.forEach(n => span.appendChild(n));
      a.appendChild(span);
    });
    const pill = document.createElement('span');
    pill.className = 'tq-suite__pill';
    pill.setAttribute('aria-hidden', 'true');
    nav.prepend(pill);
    nav.classList.add('has-pill');
    const place = () => {
      const a = nav.querySelector('a.is-active');
      if (!a) { pill.style.opacity = '0'; return; }
      pill.style.opacity = '1';
      pill.style.width = a.offsetWidth + 'px';
      pill.style.height = a.offsetHeight + 'px';
      pill.style.transform = 'translate(' + a.offsetLeft + 'px,' + a.offsetTop + 'px)';
    };
    new MutationObserver(place).observe(nav, { subtree: true, attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', place);
    window.addEventListener('load', place);
    place();
  });
  scrollspy('.tq-lab__metrics a', '.tq-acard');

  /* ---------- Filter chips (case studies, jobs) ---------- */
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const target = document.querySelectorAll(group.dataset.filterGroup);
    const buttons = Array.from(group.querySelectorAll('button'));
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.filter;
        buttons.forEach(b => {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
        target.forEach(el => {
          const show = f === 'all' || (el.dataset.cat || '').split(' ').includes(f);
          if (show) {
            el.classList.remove('is-hidden');
            el.classList.add('is-filtering');
            requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('is-filtering')));
          } else {
            el.classList.add('is-hidden');
          }
        });
      });
    });
  });

  /* ---------- Job accordion ---------- */
  document.querySelectorAll('.tq-job').forEach(job => {
    const head = job.querySelector('.tq-job__head');
    head.addEventListener('click', () => {
      const open = job.classList.toggle('is-open');
      head.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Timeline progress on scroll ---------- */
  const timeline = document.querySelector('.tq-timeline');
  if (timeline) {
    const miles = Array.from(timeline.querySelectorAll('.tq-mile'));
    const update = () => {
      const r = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = reduceMotion ? 1 : clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      timeline.style.setProperty('--p', p.toFixed(3));
      miles.forEach((m, i) => m.classList.toggle('on', p >= i / miles.length));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();

/* ---------- Home: industry explorer (tabs + auto-cycle) ---------- */
(function () {
  'use strict';
  const root = document.querySelector('[data-ix]');
  if (!root) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabs = Array.from(root.querySelectorAll('.tq-ix__tab'));
  const panels = Array.from(root.querySelectorAll('.tq-ix__panel'));
  const stage = root.querySelector('.tq-ix__stage');
  const CYCLE = 6000;
  let active = 0, t = 0, hold = false, visible = false, last = performance.now();

  function select(i, focus) {
    active = i;
    t = 0;
    tabs.forEach((tab, k) => {
      const on = k === i;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p, k) => {
      const on = k === i;
      p.classList.toggle('is-active', on);
      p.hidden = !on;
    });
    if (focus) tabs[i].focus();
    // keep the active chip in view on the mobile horizontal strip
    const strip = tabs[i].parentElement;
    if (strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: tabs[i].offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('mouseenter', () => { if (window.matchMedia('(hover: hover)').matches) select(i); });
    tab.addEventListener('keydown', e => {
      if (['ArrowDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); select((i + 1) % tabs.length, true); }
      if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
    });
  });
  root.addEventListener('mouseenter', () => { hold = true; });
  root.addEventListener('mouseleave', () => { hold = false; });
  root.addEventListener('focusin', () => { hold = true; });
  root.addEventListener('focusout', () => { hold = false; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(en => { visible = en[0].isIntersecting; }, { threshold: 0.35 }).observe(root);
  }

  if (reduceMotion) return;
  (function tick(now) {
    const dt = Math.min(now - last, 60);
    last = now;
    if (visible && !hold && !document.hidden) {
      t += dt;
      if (t >= CYCLE) select((active + 1) % tabs.length);
    }
    stage.style.setProperty('--t', Math.min(t / CYCLE, 1).toFixed(3));
    requestAnimationFrame(tick);
  })(last);
})();

/* ---------- Industries page: navigator panel follows the card in view ---------- */
(function () {
  'use strict';
  const lab = document.querySelector('.tq-ilab');
  if (!lab || !('IntersectionObserver' in window)) return;
  const cards = Array.from(lab.querySelectorAll('.tq-icard'));
  const links = Array.from(lab.querySelectorAll('.tq-ilab__nav a'));
  const ring = lab.querySelector('.tq-ilab__ring');
  const icon = lab.querySelector('[data-ilab-icon]');
  const title = lab.querySelector('[data-ilab-title]');
  const num = lab.querySelector('[data-ilab-n]');
  let current = -1;

  function swap(el) {
    el.classList.remove('is-swap');
    void el.offsetWidth;
    el.classList.add('is-swap');
  }

  function setActive(i) {
    if (i === current) return;
    current = i;
    const c = cards[i];
    cards.forEach((x, k) => x.classList.toggle('is-current', k === i));
    links.forEach((l, k) => l.classList.toggle('is-active', k === i));
    icon.className = 'fa-solid ' + c.dataset.icon;
    title.innerHTML = c.dataset.title;
    num.textContent = String(i + 1).padStart(2, '0');
    ring.style.setProperty('--p', ((i + 1) / cards.length).toFixed(3));
    swap(icon);
    swap(title);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(cards.indexOf(e.target)); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  cards.forEach(c => io.observe(c));
  setActive(0);
})();
