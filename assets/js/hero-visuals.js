/* ==========================================================
   PAGE HERO VISUALS — each block runs only when its visual
   is on the page (Who We Are, AI Accelerators, Careers, Case Studies)
   ========================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function swap(el, text) {
    if (!el) return;
    if (reduce) { el.textContent = text; return; }
    el.classList.add('out');
    setTimeout(function () { el.textContent = text; el.classList.remove('out'); }, 300);
  }

  /* ---------- Who We Are: value over time ---------- */
  (function () {
    var root = document.querySelector('.wwa-visual');
    if (!root) return;
    var NS = 'http://www.w3.org/2000/svg';
    var MS = [
      { x: 40, label: 'Discover', k: 'CLARITY', tt: 'Business understanding first' },
      { x: 150, label: 'Build', k: 'OWNERSHIP', tt: 'We own delivery outcomes' },
      { x: 260, label: 'First release', k: 'TRUST', tt: 'Transparent, predictable go-live' },
      { x: 370, label: 'Support', k: 'CONTINUITY', tt: 'The same team stays on' },
      { x: 480, label: 'Evolve', k: 'PARTNERSHIP', tt: 'Roadmap built together' }
    ];
    var path = root.querySelector('#wwaPath'), L = path.getTotalLength();
    var dot = root.querySelector('#wwaDot'), halo = root.querySelector('#wwaHalo'), clip = root.querySelector('#wwaClipRect');
    var tip = root.querySelector('#wwaTip'), tipK = root.querySelector('#wwaTipK'), tipT = root.querySelector('#wwaTipT');
    var vals = root.querySelectorAll('.wwa-val'), msG = root.querySelector('#wwaMs'), tkG = root.querySelector('#wwaTicks');

    // length along the path where x == target (binary search)
    function lenAtX(x) {
      var a = 0, b = L;
      for (var n = 0; n < 30; n++) {
        var m = (a + b) / 2;
        if (path.getPointAtLength(m).x < x) a = m; else b = m;
      }
      return (a + b) / 2;
    }

    MS.forEach(function (m) {
      m.len = lenAtX(m.x);
      m.y = path.getPointAtLength(m.len).y;
      var tk = document.createElementNS(NS, 'line');
      tk.setAttribute('class', 'wwa-tick');
      tk.setAttribute('x1', m.x); tk.setAttribute('x2', m.x);
      tk.setAttribute('y1', m.y + 8); tk.setAttribute('y2', 192);
      tkG.appendChild(tk); m.tick = tk;
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('class', 'wwa-ms');
      c.setAttribute('cx', m.x); c.setAttribute('cy', m.y); c.setAttribute('r', 4.5);
      msG.appendChild(c); m.c = c;
      var t = document.createElementNS(NS, 'text');
      t.setAttribute('class', 'wwa-axis');
      t.setAttribute('x', m.x); t.setAttribute('y', 210); t.setAttribute('text-anchor', 'middle');
      t.textContent = m.label;
      msG.appendChild(t); m.t = t;
    });
    path.style.strokeDasharray = L;

    var curLen = 0;
    function setLen(l) {
      curLen = l;
      path.style.strokeDashoffset = L - l;
      var p = path.getPointAtLength(Math.max(l, 0.01));
      dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
      halo.setAttribute('cx', p.x); halo.setAttribute('cy', p.y);
      clip.setAttribute('width', p.x);
    }
    function tween(to, ms, done) {
      if (reduce) { setLen(to); if (done) done(); return; }
      var from = curLen, t0 = performance.now();
      (function f(t) {
        var k = Math.min(1, (t - t0) / ms);
        var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        setLen(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(f); else if (done) done();
      })(t0);
    }
    function placeTip(m, i) {
      tip.classList.add('fade');
      tip.classList.toggle('l', i === 0);
      tip.classList.toggle('r', i === MS.length - 1);
      tip.style.left = (m.x / 520 * 100) + '%';
      tip.style.top = (m.y / 220 * 100) + '%';
      setTimeout(function () { tipK.textContent = m.k; tipT.textContent = m.tt; tip.classList.remove('fade'); }, reduce ? 0 : 350);
    }
    function step(i) {
      var m = MS[i];
      tween(m.len, i === 0 ? 300 : 1000, function () {
        MS.forEach(function (o, k) {
          o.c.classList.toggle('on', k <= i);
          o.t.classList.toggle('on', k <= i);
          o.tick.classList.toggle('on', k <= i);
        });
        vals.forEach(function (v, k) { v.classList.toggle('on', k <= i); v.classList.toggle('now', k === i); });
        root.classList.toggle('after', i >= 3);
      });
      placeTip(m, i);
    }
    function reset() {
      MS.forEach(function (o) { o.c.classList.remove('on'); o.t.classList.remove('on'); o.tick.classList.remove('on'); });
      vals.forEach(function (v) { v.classList.remove('on', 'now'); });
      root.classList.remove('after');
    }

    setLen(0);
    if (reduce) { step(4); return; }
    var i = 0;
    step(0);
    setInterval(function () {
      i++;
      if (i === MS.length) { reset(); tween(0, 500); i = -1; return; }
      step(i);
    }, 2300);
  })();

  /* ---------- AI Accelerators: lab demo ---------- */
  (function () {
    var root = document.querySelector('.acc-visual');
    if (!root) return;
    var DATA = [
      { out: 'Unstructured → usable data', toast: 'Invoice → ERP-ready fields' },
      { out: 'Modernize faster', toast: 'Legacy code → modern Python' },
      { out: 'Improve quality', toast: 'Tests generated from the story' },
      { out: 'Reduce manual effort', toast: 'Ticket handled end-to-end' }
    ];
    var DUR = 4600, i = -1, timer;
    var tabs = root.querySelectorAll('.acc-tab'), panels = root.querySelectorAll('.acc-panel');
    var outEl = root.querySelector('#accOutcome'), toastEl = root.querySelector('#accToast');

    function swapFade(el, t) {
      el.classList.add('fade');
      setTimeout(function () { el.textContent = t; el.classList.remove('fade'); }, reduce ? 0 : 300);
    }
    function go(n) {
      i = n;
      tabs.forEach(function (t, k) { t.classList.remove('on'); t.setAttribute('aria-selected', String(k === n)); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      void root.offsetWidth; // restart the CSS animations
      tabs[n].classList.add('on');
      panels[n].classList.add('active');
      swapFade(outEl, DATA[n].out);
      swapFade(toastEl, DATA[n].toast);
    }
    function loop() {
      clearInterval(timer);
      if (!reduce) timer = setInterval(function () { go((i + 1) % 4); }, DUR);
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { go(+t.dataset.i); loop(); }); });
    go(0);
    loop();
  })();

  /* ---------- Careers: growth staircase ---------- */
  (function () {
    var root = document.getElementById('crVisual');
    if (!root) return;
    var S = [
      { n: 'Learn', t: 'Pick up modern stacks alongside experienced engineers', p: [79, 142] },
      { n: 'Deliver', t: 'Ship work that solves real client problems', p: [199, 104] },
      { n: 'Own', t: 'Take ownership of outcomes, not just tasks', p: [319, 66] },
      { n: 'Grow', t: 'Grow across engineering, QA, data, cloud, AI & delivery', p: [439, 28] }
    ];
    var steps = root.querySelectorAll('.cr-step'), chips = root.querySelectorAll('.cr-chip');
    var av = root.querySelector('#crAv'), burst = root.querySelector('#crBurst'), flag = root.querySelector('#crFlag');

    function go(k) {
      var s = S[k];
      av.style.transform = 'translate(' + s.p[0] + 'px,' + s.p[1] + 'px)';
      setTimeout(function () {
        steps.forEach(function (g, j) { g.classList.toggle('on', j <= k); });
        chips.forEach(function (c) {
          var on = +c.dataset.t <= k;
          if (on && !c.classList.contains('on')) {
            c.classList.add('new');
            setTimeout(function () { c.classList.remove('new'); }, 500);
          }
          c.classList.toggle('on', on);
        });
        flag.classList.toggle('off', k < 3);
        if (k === 3) { burst.classList.remove('pop'); void burst.getBoundingClientRect(); burst.classList.add('pop'); }
      }, reduce ? 0 : 550);
      root.querySelector('#crNum').textContent = '0' + (k + 1);
      swap(root.querySelector('#crCap'), s.n.toUpperCase());
      swap(root.querySelector('#crTx'), s.t);
      swap(root.querySelector('#crToast'), 'Step ' + (k + 1) + ' of 4 · ' + s.n);
    }

    if (reduce) { go(3); return; }
    var k = 0;
    go(0);
    (function next() {
      setTimeout(function () {
        k = (k + 1) % 4;
        if (k === 0) {
          steps.forEach(function (g) { g.classList.remove('on'); });
          chips.forEach(function (c) { c.classList.remove('on'); });
          burst.classList.remove('pop');
        }
        go(k);
        next();
      }, k === 3 ? 3200 : 1900);
    })();
  })();

  /* ---------- Case Studies: rotating story deck ---------- */
  (function () {
    var root = document.getElementById('csVisual');
    if (!root) return;
    var ICON = {
      refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
      chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
      ops: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
      s0: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
      s1: '<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V21M5 12H2a10 10 0 0 0 20 0h-3"/>',
      s2: '<path d="M15 12l-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9"/><path d="M17.6 15L22 10.6M20.9 11.7l-1.3-1.3a2 2 0 0 1-.6-1.4V7.9l-2.3-2.3A6 6 0 0 0 12.5 4h-2.5l.9.9a6 6 0 0 1 1.8 4.3v1.2l2 2h1.2c.5 0 1 .2 1.4.6l1.3 1.3"/>',
      s3: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
      cup: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'
    };
    var STEPS = ['Understand', 'Stabilize', 'Build', 'Improve'];
    var CASES = [
      { tag: 'Modernization', ic: 'refresh', title: 'Legacy platform to cloud-native', ch: 'Ageing system, slow releases, rising run risk.',
        s: ['Map business-critical flows & dependencies', 'Fix recurring incidents, add monitoring', 'Re-platform module by module, no big-bang', 'Continuous releases & performance tuning'], o: ['Faster releases', 'Lower run risk'] },
      { tag: 'AI', ic: 'chip', title: 'Documents into usable business data', ch: 'Teams re-keying data from PDFs and emails.',
        s: ['Find the high-effort manual steps', 'Clean & standardise source data', 'Deploy extraction with human review', 'Retrain on feedback, widen coverage'], o: ['Less manual effort', 'Cleaner data'] },
      { tag: 'Operations', ic: 'ops', title: 'Reactive support to managed operations', ch: 'Growing ticket backlog, unclear ownership.',
        s: ['Audit tickets, SLAs & hand-offs', 'Clear backlog, write runbooks', 'Automate repetitive fixes', 'Monthly service reviews & tuning'], o: ['Predictable SLAs', 'Clear ownership'] }
    ];
    function svg(k) { return '<svg viewBox="0 0 24 24">' + ICON[k] + '</svg>'; }

    var deck = root.querySelector('#csDeck');
    var cards = CASES.map(function (c, n) {
      var el = document.createElement('div');
      el.className = 'cs-card';
      el.innerHTML = '<div class="cs-inner"><div class="cs-top"><span class="cs-tag">' + svg(c.ic) + c.tag + '</span><span class="cs-no">Approach in action · 0' + (n + 1) + '</span></div>' +
        '<div class="cs-title">' + c.title + '</div><div class="cs-ch">' + c.ch + '</div>' +
        '<div class="cs-track"><span class="fill"></span>' + STEPS.map(function (s, k) { return '<div class="cs-st"><i>' + svg('s' + k) + '</i>' + s + '</div>'; }).join('') + '</div>' +
        '<div class="cs-detail"><span class="num">01</span><div><div class="hv-cap hv-fade">UNDERSTAND</div><div class="tx hv-fade">' + c.s[0] + '</div></div></div>' +
        '<div class="cs-outs">Outcome<span class="cs-out">' + c.o[0] + '</span><span class="cs-out">' + c.o[1] + '</span><span class="cs-trophy">' + svg('cup') + '</span></div></div>';
      deck.appendChild(el);
      return el;
    });

    var order = [0, 1, 2];
    function place() { order.forEach(function (ci, p) { cards[ci].setAttribute('data-pos', p); }); }
    function setStep(el, c, k) {
      el.querySelectorAll('.cs-st').forEach(function (s, j) { s.classList.toggle('done', j <= k); s.classList.toggle('now', j === k); });
      el.querySelector('.cs-track .fill').style.width = (k < 0 ? 0 : k / 3 * 75) + '%';
      if (k >= 0) {
        el.querySelector('.num').textContent = '0' + (k + 1);
        swap(el.querySelector('.cs-detail .hv-cap'), STEPS[k].toUpperCase());
        swap(el.querySelector('.cs-detail .tx'), c.s[k]);
      }
    }
    function resetCard(n) {
      var el = cards[n];
      el.classList.remove('won');
      setStep(el, CASES[n], -1);
      el.querySelector('.num').textContent = '01';
      el.querySelector('.cs-detail .hv-cap').textContent = 'UNDERSTAND';
      el.querySelector('.cs-detail .tx').textContent = CASES[n].s[0];
    }
    cards.forEach(function (_, n) { resetCard(n); });
    place();

    function play() {
      var n = order[0], el = cards[n], c = CASES[n], k = 0;
      swap(root.querySelector('#csToast'), 'Applied to ' + (c.tag === 'AI' ? 'AI' : c.tag.toLowerCase()));
      if (reduce) { setStep(el, c, 3); el.classList.add('won'); return; }
      setStep(el, c, 0);
      var t = setInterval(function () {
        k++;
        if (k < 4) { setStep(el, c, k); return; }
        clearInterval(t);
        el.classList.add('won');
        setTimeout(function () {
          el.classList.add('exit');
          setTimeout(function () {
            order.push(order.shift());
            el.classList.remove('exit');
            resetCard(n);
            place();
            setTimeout(play, 500);
          }, 450);
        }, 1900);
      }, 1150);
    }
    play();
  })();
  /* ---------- Industries: all industries at a glance ---------- */
  (function () {
    var root = document.getElementById('igVisual');
    if (!root) return;
    var tiles = root.querySelectorAll('.ig-t'), caps = root.querySelectorAll('#igCaps span'), f = root.querySelector('#igFor'), i = -1;
    var CAP = { FinTech: [1, 2], Healthcare: [0, 3], Commerce: [0, 2], Mobility: [0, 1], Operations: [2, 3] };
    function go(n) {
      i = n;
      var nm = tiles[n].getAttribute('data-n');
      tiles.forEach(function (x, k) { x.classList.toggle('on', k === n); });
      caps.forEach(function (c, k) { c.classList.toggle('on', CAP[nm].indexOf(k) > -1); });
      swap(f, nm);
    }
    go(0);
    if (!reduce) setInterval(function () { go((i + 1) % tiles.length); }, 2400);
  })();

  /* ---------- Services: five service lines, one showcase ---------- */
  (function () {
    var root = document.getElementById('slVisual');
    if (!root) return;
    var items = root.querySelectorAll('.sl-item'), panes = root.querySelectorAll('.sl-pane'), i = -1, timer;
    function go(n) {
      i = n;
      items.forEach(function (t) { t.classList.remove('on'); });
      void root.offsetWidth; // restart the progress bar animation
      items[n].classList.add('on');
      panes.forEach(function (p, k) { p.classList.toggle('on', k === n); });
    }
    function loop() {
      clearInterval(timer);
      if (!reduce) timer = setInterval(function () { go((i + 1) % items.length); }, 4200);
    }
    items.forEach(function (t, k) { t.addEventListener('click', function () { go(k); loop(); }); });
    go(0);
    loop();
  })();

  /* ---------- Contact: a conversation that turns into a plan ---------- */
  (function () {
    var root = document.getElementById('ctVisual');
    if (!root) return;
    var S = [
      { y: 'Our legacy platform is hard to change and costly to run.', u: 'Let’s assess what’s there first, then modernize it in safe, planned phases.', s: [0, 3, 4] },
      { y: 'Our team loses hours every week to a manual approval workflow.', u: 'We’ll map the workflow, build it properly and automate the repetitive steps.', s: [0, 2, 5] },
      { y: 'We have an AI idea but aren’t sure it will work for us.', u: 'Let’s validate it quickly with a working prototype before you invest further.', s: [1, 2] }
    ];
    var you = root.querySelector('#ctYou'), yt = you.querySelector('span'), typ = root.querySelector('#ctTyping'), us = root.querySelector('#ctUs'),
      plan = root.querySelector('#ctPlan'), steps = root.querySelectorAll('#ctSteps span'), ok = root.querySelector('#ctOk'), dots = root.querySelectorAll('#ctTabs i'), T = [];
    function later(fn, ms) { T.push(setTimeout(fn, reduce ? 0 : ms)); }
    function play(n) {
      T.forEach(clearTimeout);
      T = [];
      var s = S[n];
      [you, us, plan, ok].forEach(function (e) { e.classList.remove('show'); });
      typ.classList.remove('show', 'gone');
      steps.forEach(function (x) { x.classList.remove('on'); });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === n); });
      later(function () { yt.textContent = s.y; us.textContent = s.u; you.classList.add('show'); }, 350);
      later(function () { typ.classList.add('show'); }, 1100);
      later(function () { typ.classList.add('gone'); us.classList.add('show'); }, 2300);
      later(function () { plan.classList.add('show'); }, 2900);
      s.s.forEach(function (k, j) { later(function () { steps[k].classList.add('on'); }, 3300 + j * 280); });
      later(function () { ok.classList.add('show'); }, 4300);
      if (!reduce) later(function () { play((n + 1) % S.length); }, 7600);
    }
    play(0);
  })();
})();
