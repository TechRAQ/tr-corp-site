/* ==========================================================
   HOME — interactive sections (below the hero)
   ========================================================== */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.hs-reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Split text into words for scroll-linked reveal ---------- */
  function splitWords(root) {
    const words = [];
    (function walk(node) {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) {
              frag.appendChild(document.createTextNode(' '));
            } else {
              const s = document.createElement('span');
              s.className = 'hs-w';
              s.textContent = p;
              frag.appendChild(s);
              words.push(s);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(root);
    return words;
  }

  const wordGroups = Array.from(document.querySelectorAll('.hs-words')).map(el => ({
    el,
    words: splitWords(el),
    // reveal finishes when the block's centre reaches this fraction of the viewport
    end: parseFloat(el.dataset.end || '0.45')
  }));

  const diamonds = Array.from(document.querySelectorAll('.hs-diamonds span'));

  /* ---------- Section refs for the scroll loop ---------- */
  const process = document.querySelector('.hs-process');
  const steps = process ? Array.from(process.querySelectorAll('.hs-step')) : [];

  /* vertical (mobile) timeline: run the track from the first dot's centre to the last dot's centre */
  function sizeStepTrack() {
    if (!steps.length) return;
    const list = process.querySelector('.hs-steps');
    const lr = list.getBoundingClientRect();
    const first = steps[0].querySelector('.hs-step__dot').getBoundingClientRect();
    const last = steps[steps.length - 1].querySelector('.hs-step__dot').getBoundingClientRect();
    list.style.setProperty('--track-start', (first.top + first.height / 2 - lr.top) + 'px');
    list.style.setProperty('--track-end', (lr.bottom - (last.top + last.height / 2)) + 'px');
  }
  sizeStepTrack();
  window.addEventListener('resize', sizeStepTrack);
  window.addEventListener('load', sizeStepTrack);
  const better = document.querySelector('.hs-better');
  const betterWords = better ? Array.from(better.querySelectorAll('.hs-better__word')) : [];
  const betterBars = better ? Array.from(better.querySelectorAll('.hs-better__bars i')) : [];
  const betterNow = better ? better.querySelector('[data-better-now]') : null;
  const vision = document.querySelector('.hs-vision');

  function onScroll() {
    const vh = window.innerHeight;

    wordGroups.forEach(g => {
      const r = g.el.getBoundingClientRect();
      const start = vh * 0.92;
      const end = vh * g.end;
      const p = reduceMotion ? 1 : clamp((start - (r.top + r.height * 0.3)) / (start - end), 0, 1);
      const n = Math.round(p * g.words.length);
      g.words.forEach((w, i) => w.classList.toggle('on', i < n));
      if (g.el.classList.contains('hs-statement__heading') && diamonds.length) {
        const d = Math.round(p * diamonds.length);
        diamonds.forEach((el, i) => el.classList.toggle('on', i < d));
      }
    });

    if (process) {
      const r = process.querySelector('.hs-steps').getBoundingClientRect();
      const p = reduceMotion ? 1 : clamp((vh * 0.8 - r.top) / (r.height + vh * 0.25), 0, 1);
      process.style.setProperty('--p', p.toFixed(3));
      steps.forEach((s, i) => s.classList.toggle('on', p >= (i / steps.length) + 0.02 || p === 1));
    }

    if (better) {
      const r = better.getBoundingClientRect();
      const total = r.height - vh;
      const p = clamp(-r.top / total, 0, 1);
      better.style.setProperty('--bp', p.toFixed(3));
      const seg = 1 / betterWords.length;
      const idx = Math.min(Math.floor(p / seg), betterWords.length - 1);
      betterWords.forEach((w, i) => {
        const local = clamp((p - i * seg) / seg, 0, 1);
        // fill completes in the first 70% of each word's segment, then holds
        const f = reduceMotion ? 1 : clamp(local / 0.7, 0, 1);
        w.style.setProperty('--f', f.toFixed(3));
        w.classList.toggle('on', i === idx);
        w.classList.toggle('past', i < idx);
        if (betterBars[i]) betterBars[i].style.setProperty('--f', (i < idx ? 1 : i === idx ? f : 0).toFixed(3));
      });
      if (betterNow) betterNow.textContent = String(idx + 1).padStart(2, '0');
    }

    if (vision && !reduceMotion) {
      const r = vision.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      vision.style.setProperty('--vx', ((0.5 - p) * 240).toFixed(1) + 'px');
    }
  }

  let ticking = false;
  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        onScroll();
      });
    }
  }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  onScroll();

  /* ---------- Count-up numbers ---------- */
  const counters = document.querySelectorAll('[data-count]');
  function runCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    // number and suffix are separate nodes so the suffix can be styled on its own
    const num = document.createTextNode('');
    el.textContent = '';
    el.appendChild(num);
    if (suffix) {
      const sfx = document.createElement('span');
      sfx.className = 'tq-count__sfx';
      sfx.textContent = suffix;
      el.appendChild(sfx);
    }
    if (reduceMotion) {
      num.nodeValue = target.toLocaleString('en-US');
      return;
    }
    const dur = 1600;
    const t0 = performance.now();
    (function step(now) {
      const k = clamp((now - t0) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      num.nodeValue = Math.round(target * eased).toLocaleString('en-US');
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          runCount(e.target);
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => co.observe(c));
  } else {
    counters.forEach(runCount);
  }

  /* ---------- Spotlight (mouse-follow glow) ---------- */
  document.querySelectorAll('.hs-spot:not(.hs-svc)').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  if (finePointer && !reduceMotion) {
    /* 3D tilt for the about visual and product cards */
    function tilt(el, strength, glare) {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.classList.add('is-tilting');
        el.style.setProperty('--ry', ((x - 0.5) * strength).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * strength).toFixed(2) + 'deg');
        if (glare) {
          el.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
          el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
        }
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('is-tilting');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    }
    document.querySelectorAll('.hs-tilt').forEach(el => tilt(el, 14, false));
    document.querySelectorAll('.hs-prod').forEach(el => tilt(el, 16, true));
  }

  /* ---------- Testimonial deck ---------- */
  const deck = document.querySelector('.hs-deck');
  if (deck) {
    const cards = Array.from(deck.querySelectorAll('.hs-quote'));
    const dots = Array.from(document.querySelectorAll('.hs-dots button'));
    const prevBtn = document.querySelector('[data-voice-prev]');
    const nextBtn = document.querySelector('[data-voice-next]');
    const AUTO_MS = 6500;
    let order = cards.map((_, i) => i); // order[0] is the front card
    let busy = false;
    let autoT = 0;
    let hovering = false;
    let last = null;

    function layout() {
      order.forEach((cardIdx, pos) => {
        const c = cards[cardIdx];
        c.style.setProperty('--k', pos);
        c.setAttribute('aria-hidden', pos === 0 ? 'false' : 'true');
      });
      dots.forEach((d, i) => {
        d.classList.toggle('on', i === order[0]);
        d.setAttribute('aria-current', i === order[0] ? 'true' : 'false');
      });
    }

    function next(dir = 1, throwX = 0) {
      if (busy) return;
      busy = true;
      autoT = 0;
      if (dir > 0) {
        const front = cards[order[0]];
        front.classList.add('is-out');
        front.style.transform = `translate(${throwX || 120}%, -10%) rotate(${throwX < 0 ? -14 : 14}deg)`;
        setTimeout(() => {
          order.push(order.shift());
          front.classList.remove('is-out');
          front.style.transform = '';
          layout();
          busy = false;
        }, 420);
      } else {
        order.unshift(order.pop());
        layout();
        setTimeout(() => { busy = false; }, 300);
      }
    }

    function goTo(i) {
      if (order[0] === i || busy) return;
      while (order[0] !== i) order.push(order.shift());
      autoT = 0;
      layout();
    }

    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
    if (prevBtn) prevBtn.addEventListener('click', () => next(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => next(1));

    // Drag / swipe to throw the front card
    let startX = 0, dx = 0, dragging = false;
    deck.addEventListener('pointerdown', e => {
      if (busy) return;
      dragging = true;
      startX = e.clientX;
      dx = 0;
      deck.classList.add('is-dragging');
      deck.setPointerCapture(e.pointerId);
    });
    deck.addEventListener('pointermove', e => {
      if (!dragging) return;
      dx = e.clientX - startX;
      const front = cards[order[0]];
      front.style.transition = 'none';
      front.style.transform = `translate(${dx}px, ${Math.abs(dx) * -0.05}px) rotate(${dx * 0.04}deg)`;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      deck.classList.remove('is-dragging');
      const front = cards[order[0]];
      front.style.transition = '';
      if (Math.abs(dx) > 90) {
        next(1, dx > 0 ? 120 : -120);
      } else if (Math.abs(dx) < 5) {
        front.style.transform = '';
        next(1); // simple click advances
      } else {
        front.style.transform = '';
      }
    }
    deck.addEventListener('pointerup', endDrag);
    deck.addEventListener('pointercancel', endDrag);

    deck.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') next(1);
      if (e.key === 'ArrowLeft') next(-1);
    });

    const voices = deck.closest('.hs-voices');
    voices.addEventListener('pointerenter', () => { hovering = true; });
    voices.addEventListener('pointerleave', () => { hovering = false; });

    let deckVisible = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(en => { deckVisible = en[0].isIntersecting; }).observe(deck);
    }

    (function tick(now) {
      if (last === null) last = now;
      const dt = Math.min(now - last, 60);
      last = now;
      if (!reduceMotion && deckVisible && !hovering && !dragging && !document.hidden) {
        autoT += dt;
        if (autoT >= AUTO_MS) next(1);
      }
      const on = dots[order[0]];
      if (on) on.style.setProperty('--t', reduceMotion ? 1 : clamp(autoT / AUTO_MS, 0, 1).toFixed(3));
      requestAnimationFrame(tick);
    })(performance.now());

    layout();
  }
})();

/* ---------- Ribbon marquees: endless loop, hover to pause ---------- */
(function () {
  'use strict';

  const rows = Array.from(document.querySelectorAll('.hs-ribbon__row'));
  if (!rows.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state = rows.map(row => {
    const track = row.querySelector('.hs-ribbon__track');
    return {
      row, track,
      set: track.querySelector('.hs-ribbon__set'),
      dir: parseFloat(row.dataset.dir || '-1'),
      speed: parseFloat(row.dataset.speed || '30'), // px per second
      x: 0, setW: 0, paused: false, visible: true
    };
  });

  function fill(s) {
    Array.from(s.track.querySelectorAll('.hs-ribbon__set')).slice(1).forEach(n => n.remove());
    s.setW = s.set.getBoundingClientRect().width;
    if (!s.setW) return;
    const need = Math.ceil((s.row.clientWidth * 2) / s.setW) + 1;
    for (let i = 0; i < need; i++) {
      const c = s.set.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      s.track.appendChild(c);
    }
  }

  state.forEach(s => {
    fill(s);
    s.row.addEventListener('pointerenter', () => { s.paused = true; });
    s.row.addEventListener('pointerleave', () => { s.paused = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(en => { s.visible = en[0].isIntersecting; }).observe(s.row);
    }
  });

  if (reduceMotion) return;

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => state.forEach(fill), 200);
  });

  let last = performance.now();
  (function tick(now) {
    const dt = Math.min(now - last, 60) / 1000;
    last = now;
    state.forEach(s => {
      if (!s.visible || !s.setW || s.paused) return;
      s.x += s.speed * dt * s.dir;
      if (s.x <= -s.setW) s.x += s.setW;
      if (s.x > 0) s.x -= s.setW;
      s.track.style.transform = `translate3d(${s.x.toFixed(2)}px, 0, 0)`;
    });
    requestAnimationFrame(tick);
  })(last);
})();
