/* ==========================================================
   HOME HERO — 3D isometric explainer timeline
   Each scene tells its message in 3 beats (blocks, beams, camera, caption)
   and the whole sequence loops.
   ========================================================== */
(function () {
  'use strict';

  const hero = document.querySelector('.hx-hero');
  if (!hero) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BEAT_MS = 2900;
  const BEATS = 3;
  const SCENE_MS = BEAT_MS * BEATS;

  const world = hero.querySelector('.hx-world');
  const cam = hero.querySelector('.hx-cam');
  const copyScenes = Array.from(hero.querySelectorAll('.hx-scene'));
  const chapters = Array.from(hero.querySelectorAll('.hx-chapter'));
  const fills = chapters.map(c => c.querySelector('.hx-chapter__fill'));
  const playBtn = hero.querySelector('.hx-play');
  const caption = hero.querySelector('.hx-caption');
  const capStep = hero.querySelector('.hx-caption__step');
  const capText = hero.querySelector('.hx-caption__text');
  const capDots = Array.from(hero.querySelectorAll('.hx-caption__dots b'));
  const chipText = hero.querySelector('[data-hx-chip]');

  /* ---------- Story data ----------
     Block state: [x, y, colour, icon, height, sx, sy, rotation] (units of --u)
     Beam: [x1, y1, x2, y2, 'belt'?] */
  const ring = (n, r, i) => [
    +(Math.cos((i / n) * Math.PI * 2 - Math.PI / 2) * r).toFixed(2),
    +(Math.sin((i / n) * Math.PI * 2 - Math.PI / 2) * r).toFixed(2)
  ];

  const corners = [[-1.7, -1.7], [1.7, -1.7], [-1.7, 1.7], [1.7, 1.7]];
  const grid3 = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) grid3.push([(c - 1) * 1.35, (r - 1) * 1.35, r + c]);
  const people = [0, 1, 2, 3, 4, 5].map(i => ring(6, 2.3, i));

  const STORY = [
    { // 1 — AI-Enabled Solutions
      chip: 'AI-Enabled Engineering',
      beats: [
        {
          cap: 'Your business today — proven systems & processes',
          cam: [58, -38, 1],
          blocks: [
            [...corners[0], 'white', 'fa-solid fa-building', 1],
            [...corners[1], 'white', 'fa-solid fa-file-invoice-dollar', 1],
            [...corners[2], 'white', 'fa-solid fa-users', 1],
            [...corners[3], 'white', 'fa-solid fa-boxes-stacked', 1]
          ]
        },
        {
          cap: 'We add an AI layer to what already works',
          cam: [54, -28, 1.06],
          blocks: [
            [...corners[0], 'white', 'fa-solid fa-building', 1],
            [...corners[1], 'white', 'fa-solid fa-file-invoice-dollar', 1],
            [...corners[2], 'white', 'fa-solid fa-users', 1],
            [...corners[3], 'white', 'fa-solid fa-boxes-stacked', 1],
            [0, 0, 'cyan', 'fa-solid fa-microchip', 1.5, 1.35, 1.35]
          ],
          beams: corners.map(c => [0, 0, c[0], c[1]])
        },
        {
          cap: 'Intelligent applications — faster & smarter',
          cam: [60, -50, 0.96],
          blocks: [
            [...corners[0], 'cyan', 'fa-solid fa-bolt', 1.7],
            [...corners[1], 'blue', 'fa-solid fa-chart-line', 2.4],
            [...corners[2], 'blue', 'fa-solid fa-robot', 2.4],
            [...corners[3], 'cyan', 'fa-solid fa-circle-check', 3.1],
            [0, 0, 'cyan', 'fa-solid fa-brain', 1.2, 1.35, 1.35]
          ],
          beams: corners.map(c => [0, 0, c[0], c[1]])
        }
      ]
    },
    { // 2 — Modernize legacy platforms
      chip: 'Application Modernization',
      beats: [
        {
          cap: 'Legacy apps, Excel & Access tools, fragile workflows',
          cam: [56, -42, 1],
          blocks: [
            [-2.5, -1.1, 'lav', 'fa-solid fa-file-excel', 0.6, 1, 1, 25],
            [-0.7, -2.6, 'white', 'fa-solid fa-database', 1.1, 1, 1, -32],
            [1.9, -2.0, 'lav', 'fa-solid fa-table', 0.5, 1, 1, 14],
            [2.7, 0.5, 'white', 'fa-solid fa-envelope', 1.3, 1, 1, 42],
            [0.2, 0.1, 'white', 'fa-solid fa-triangle-exclamation', 0.8, 1, 1, -18],
            [-2.2, 1.7, 'white', 'fa-solid fa-print', 0.9, 1, 1, 58],
            [0.8, 2.5, 'lav', 'fa-solid fa-note-sticky', 0.5, 1, 1, -40],
            [2.5, 2.6, 'white', 'fa-solid fa-file-lines', 0.7, 1, 1, 20],
            [-0.9, -0.6, 'lav', 'fa-solid fa-code', 1.2, 1, 1, 70]
          ]
        },
        {
          cap: 'Assess, convert & document — without disruption',
          cam: [62, -45, 1.04],
          blocks: grid3.map((g, i) => [g[0], g[1], 'white',
            ['fa-solid fa-magnifying-glass', 'fa-solid fa-file-lines', 'fa-solid fa-table', 'fa-solid fa-code',
              'fa-solid fa-microchip', 'fa-solid fa-vial-circle-check', 'fa-solid fa-diagram-project', 'fa-solid fa-database',
              'fa-solid fa-book'][i], 0.55])
        },
        {
          cap: 'Cloud-ready, maintainable & AI-ready platforms',
          cam: [56, -56, 0.95],
          blocks: grid3.map((g, i) => [g[0], g[1], g[2] > 2 ? 'cyan' : 'blue',
            ['fa-solid fa-cloud', 'fa-solid fa-mobile-screen', 'fa-solid fa-code', 'fa-solid fa-shield-halved',
              'fa-solid fa-gears', 'fa-solid fa-chart-pie', 'fa-solid fa-database', 'fa-solid fa-plug',
              'fa-solid fa-brain'][i], 0.6 + g[2] * 0.6])
        }
      ]
    },
    { // 3 — Scale technology teams
      chip: 'Global Delivery',
      beats: [
        {
          cap: 'Engineering, QA, data, DevOps & support talent',
          cam: [58, -40, 1],
          blocks: people.map((p, i) => [p[0], p[1], 'lav',
            ['fa-solid fa-code', 'fa-solid fa-vial-circle-check', 'fa-solid fa-chart-pie', 'fa-solid fa-cloud',
              'fa-solid fa-headset', 'fa-solid fa-diagram-project'][i], 0.8])
        },
        {
          cap: 'Aligned to your business context & priorities',
          cam: [54, -60, 1.05],
          blocks: people.map((p, i) => [p[0], p[1], 'white',
            ['fa-solid fa-code', 'fa-solid fa-vial-circle-check', 'fa-solid fa-chart-pie', 'fa-solid fa-cloud',
              'fa-solid fa-headset', 'fa-solid fa-diagram-project'][i], 0.8])
            .concat([[0, 0, 'cyan', 'fa-solid fa-building', 1.6, 1.4, 1.4]]),
          beams: people.map(p => [0, 0, p[0], p[1]])
        },
        {
          cap: 'Scale with confidence, control & ownership',
          cam: [60, -80, 0.96],
          blocks: people.map((p, i) => [p[0], p[1], i % 2 ? 'blue' : 'cyan', 'fa-solid fa-arrow-trend-up', 0.8 + i * 0.42])
            .concat([[0, 0, 'blue', 'fa-solid fa-rocket', 2.8, 1.4, 1.4]]),
          beams: people.map(p => [0, 0, p[0], p[1]])
        }
      ]
    }
  ];

  /* ---------- Build 3D pools ---------- */
  const FACES = ['f-shadow', 'f-n', 'f-w', 'f-s', 'f-e', 'f-top'];

  function makeBlock(parent) {
    const el = document.createElement('div');
    el.className = 'hx-blk c-white is-hidden';
    FACES.forEach(f => {
      const face = document.createElement('div');
      face.className = 'f ' + f;
      el.appendChild(face);
    });
    const icon = document.createElement('i');
    el.querySelector('.f-top').appendChild(icon);
    parent.appendChild(el);
    return { el, icon, iconCls: '' };
  }

  const beams = [];
  for (let i = 0; i < 7; i++) {
    const b = document.createElement('div');
    b.className = 'hx-beam';
    b.appendChild(document.createElement('span'));
    world.appendChild(b);
    beams.push(b);
  }

  const blocks = [];
  for (let i = 0; i < 9; i++) blocks.push(makeBlock(world));

  for (let i = 0; i < 3; i++) {
    const p = document.createElement('div');
    p.className = 'hx-packet';
    p.style.setProperty('--d', i);
    const blk = makeBlock(p);
    blk.el.className = 'hx-blk c-blue';
    blk.el.style.setProperty('--z', 0.02);
    world.appendChild(p);
  }

  function setVars(el, vars) {
    for (const k in vars) el.style.setProperty(k, vars[k]);
  }

  /* ---------- Intro: glass Rubik's cube (from the original hero) ----------
     The cube spins, settles, and its four bottom corner cubies glide out and grow
     into the first scene's blocks while the rest merge into the centre. */
  const INTRO_MS = 5600;
  const LOGO_MS = 800;            // opening hold: cube faces the viewer, exactly like the TechRAQ logo
  // undo the isometric camera (rotateX 60, rotateZ -40) so the cube's top faces the viewer, then turn 45deg into a diamond.
  // `spin` turns it around the screen's vertical axis, like the cube in the original hero.
  // the logo's cubies are 0.74u with gaps, so the whole cube is scaled up in the logo pose
  // to read the same size as the blocks in the story scenes
  const LOGO_SCALE = 1.3;
  const logoPose = (spin, lift) =>
    `translateZ(calc(var(--u) * ${lift.toFixed(3)})) rotateZ(40deg) rotateX(-60deg) rotateY(${spin.toFixed(2)}deg) rotateZ(45deg) translateZ(calc(var(--u) * -1.37)) scale3d(${LOGO_SCALE}, ${LOGO_SCALE}, ${LOGO_SCALE})`;
  let logoSpin = 0;
  const MORPH_AT = 2300;          // ms left in the intro when the cube starts transforming (lay down + cubies hop out)
  const CUBIE = 0.74, GAP = 1.0;  // logo-like gaps between the squares
  const rubik = document.createElement('div');
  rubik.className = 'hx-rubik is-off';
  world.appendChild(rubik);
  const cubies = [];
  for (let gz = 0; gz < 3; gz++) {
    for (let gy = -1; gy <= 1; gy++) {
      for (let gx = -1; gx <= 1; gx++) {
        const b = makeBlock(rubik);
        b.el.className = 'hx-blk c-glass';
        cubies.push({ el: b.el, gx, gy, gz });
      }
    }
  }
  let rubikAngle = 0;
  let rubikT = 0;
  let morphing = false;

  function placeRubik() {
    const bob = morphing ? 0 : 0.45 + Math.sin(rubikT / 900) * 0.12 * Math.min(rubikT / 600, 1);
    rubik.style.transform = `translateZ(calc(var(--u) * ${bob.toFixed(3)})) rotateZ(${rubikAngle.toFixed(2)}deg)`;
  }

  let morphTimers = [];
  const later = (fn, ms) => morphTimers.push(setTimeout(fn, ms));
  function clearMorph() {
    morphTimers.forEach(clearTimeout);
    morphTimers = [];
  }

  function homeCube() {
    clearMorph();
    morphing = false;
    rubikAngle = 0;
    rubikT = 0;
    cubies.forEach(c => {
      c.el.classList.remove('to-solid', 'to-merge');
      c.el.style.transition = 'none';
      setVars(c.el, {
        '--x': (c.gx * GAP).toFixed(2), '--y': (c.gy * GAP).toFixed(2), '--z': (c.gz * GAP).toFixed(2),
        '--sx': CUBIE, '--sy': CUBIE, '--sz': CUBIE, '--r': 0
      });
    });
    void rubik.offsetWidth;
    cubies.forEach(c => { c.el.style.transition = ''; });
  }

  function spinCube(dt) {
    if (morphing || intro > INTRO_MS - LOGO_MS) return;
    rubikT += dt;
    // ease into the spin so it starts gently from the still logo
    logoSpin += dt * 0.06 * Math.min(rubikT / 700, 1);
    rubik.style.transform = logoPose(logoSpin, 1.7 + Math.sin(rubikT / 700) * 0.12);
  }

  function morphCube() {
    morphing = true;
    hero.classList.remove('hx-logo');
    // from the logo pose the cube turns down onto the floor while its cubies regroup;
    // targets are expressed in the cube's local frame
    const target = 90;
    // same transform-function list on both ends, so the browser interpolates each
    // rotation on its own instead of skewing the cube through a matrix blend
    const pose = (lift, rz1, rx, ry, rz2, back, sc) =>
      `translateZ(calc(var(--u) * ${lift})) rotateZ(${rz1}deg) rotateX(${rx}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz2}deg) translateZ(calc(var(--u) * ${back})) scale3d(${sc}, ${sc}, ${sc})`;
    const spin = ((logoSpin % 360) + 360) % 360;
    clearMorph();

    // phase 1: the whole cube turns down and settles on the floor, still intact
    rubik.style.transition = 'none';
    rubik.style.transform = pose(1.7, 40, -60, spin, 45, -1.37, LOGO_SCALE);
    void rubik.offsetWidth;
    rubik.style.transition = 'transform 0.7s cubic-bezier(0.45, 0, 0.2, 1)';
    rubik.style.transform = pose(0, 0, 0, spin > 180 ? 360 : 0, target, 0, 1);
    rubikAngle = target;
    const rad = -target * Math.PI / 180;
    const cos = Math.round(Math.cos(rad)), sin = Math.round(Math.sin(rad));
    const toLocal = (x, y) => [x * cos - y * sin, x * sin + y * cos];
    const first = STORY[0].beats[0].blocks;
    // pick the bottom-layer corner cubie that will sit nearest each first-scene block
    const used = new Set();
    const solids = first.map(([wx, wy]) => {
      const [lx, ly] = toLocal(wx, wy);
      const c = cubies.find(c => c.gz === 0 && !used.has(c) && Math.sign(c.gx) === Math.sign(lx) && Math.sign(c.gy) === Math.sign(ly));
      used.add(c);
      return [c, lx, ly];
    });

    // phase 2: the corner cubies hop out one by one, land on their spot with a small bounce
    // and become the first scene's blocks; the rest give a little hop and dissolve
    const HOP_AT = 650;
    const step = (el, ms, ease, vars) => {
      el.style.transition = `transform ${ms}ms ${ease}`;
      setVars(el, vars);
    };
    const UP = 'cubic-bezier(0.2, 0.7, 0.3, 1)';     // decelerate on the way up
    const DOWN = 'cubic-bezier(0.5, 0, 0.8, 0.4)';   // accelerate on the way down
    solids.forEach(([c, lx, ly], i) => {
      const t0 = HOP_AT + i * 140;
      const sx = c.gx * GAP, sy = c.gy * GAP;
      later(() => {
        c.el.classList.add('to-solid');
        step(c.el, 380, UP, {
          '--x': ((sx + lx) / 2).toFixed(2), '--y': ((sy + ly) / 2).toFixed(2), '--z': 1.5,
          '--sx': 0.9, '--sy': 0.9, '--sz': 0.9
        });
      }, t0);
      later(() => step(c.el, 340, DOWN, {
        '--x': lx.toFixed(2), '--y': ly.toFixed(2), '--z': 0, '--sx': 1, '--sy': 1, '--sz': 1
      }), t0 + 380);
      later(() => step(c.el, 170, UP, { '--z': 0.3 }), t0 + 720);
      later(() => step(c.el, 190, DOWN, { '--z': 0 }), t0 + 890);
    });
    cubies.filter(c => !used.has(c)).forEach((c, i) => {
      const t0 = HOP_AT + 60 + (i % 7) * 45;
      later(() => step(c.el, 260, UP, { '--z': (c.gz * GAP + 0.4).toFixed(2) }), t0);
      later(() => {
        c.el.classList.add('to-merge');
        step(c.el, 520, DOWN, {
          '--x': (c.gx * 0.25).toFixed(2), '--y': (c.gy * 0.25).toFixed(2), '--z': 0.3,
          '--sx': 0.2, '--sy': 0.2, '--sz': 0.2
        });
      }, t0 + 260);
    });
  }

  /* ---------- Apply a beat ---------- */
  function applyBeat(sceneIdx, beatIdx, noDrop) {
    const scene = STORY[sceneIdx];
    const beat = scene.beats[beatIdx];

    cam.style.setProperty('--crx', beat.cam[0] + 'deg');
    cam.style.setProperty('--crz', beat.cam[1] + 'deg');
    cam.style.setProperty('--cs', beat.cam[2]);

    blocks.forEach((b, i) => {
      const s = beat.blocks[i];
      if (!s) {
        b.el.classList.add('is-hidden');
        setVars(b.el, { '--z': 3 });
        return;
      }
      const [x, y, color, icon, h = 1, sx = 1, sy = 1, r = 0] = s;
      const wasHidden = b.el.classList.contains('is-hidden');
      if (wasHidden && noDrop) {
        // appear exactly where the morphing cubie landed
        b.el.style.transition = 'none';
        b.el.className = 'hx-blk c-' + color;
        setVars(b.el, { '--x': x, '--y': y, '--z': 0, '--sx': sx, '--sy': sy, '--sz': h, '--r': r });
        void b.el.offsetWidth;
        b.el.style.transition = '';
      } else if (wasHidden) {
        // drop in from above at the target spot
        b.el.style.transition = 'none';
        setVars(b.el, { '--x': x, '--y': y, '--z': 4, '--r': r });
        void b.el.offsetWidth;
        b.el.style.transition = '';
      }
      b.el.className = 'hx-blk c-' + color;
      setVars(b.el, { '--x': x, '--y': y, '--z': 0, '--sx': sx, '--sy': sy, '--sz': h, '--r': r });
      if (b.iconCls !== icon) {
        b.icon.className = icon + ' pop';
        b.iconCls = icon;
      }
    });

    const beamDefs = beat.beams || [];
    beams.forEach((el, i) => {
      const d = beamDefs[i];
      if (!d) {
        el.classList.remove('on');
        return;
      }
      const [x1, y1, x2, y2, kind] = d;
      const len = Math.hypot(x2 - x1, y2 - y1);
      const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      const changed = el.dataset.key !== d.join(',');
      if (changed && el.classList.contains('on')) {
        el.classList.remove('on');
        void el.offsetWidth;
      }
      el.dataset.key = d.join(',');
      el.classList.toggle('belt', kind === 'belt');
      setVars(el, { '--bx': x1, '--by': y1, '--len': len.toFixed(3), '--ang': ang.toFixed(2) });
      requestAnimationFrame(() => el.classList.add('on'));
    });

    world.classList.toggle('is-belt', !!scene.belt);
    world.classList.toggle('is-fast', !!beat.fast);

    if (caption) {
      capStep.textContent = String(beatIdx + 1).padStart(2, '0');
      capText.textContent = beat.cap;
      capDots.forEach((d, i) => d.classList.toggle('on', i === beatIdx));
      caption.classList.remove('swap');
      void caption.offsetWidth;
      caption.classList.add('swap');
    }
    if (chipText) {
      const name = document.createElement('b');
      name.textContent = scene.chip;
      chipText.replaceChildren('How it works', name);
    }
  }

  /* ---------- Split titles into characters ---------- */
  copyScenes.forEach(scene => {
    let i = 0;
    scene.querySelectorAll('.hx-line').forEach(line => {
      const text = line.textContent.trim();
      line.textContent = '';
      line.setAttribute('aria-hidden', 'true');
      if (text.length > 11) line.classList.add('hx-line--long');
      text.split(' ').forEach((word, w) => {
        if (w > 0) line.appendChild(document.createTextNode(' '));
        const wordEl = document.createElement('span');
        wordEl.className = 'hx-word';
        for (const ch of word) {
          const span = document.createElement('span');
          span.className = 'hx-char';
          span.textContent = ch;
          span.style.setProperty('--i', i++);
          wordEl.appendChild(span);
        }
        line.appendChild(wordEl);
      });
    });
  });

  /* ---------- Timeline ---------- */
  let scene = 0;
  let beat = -1;
  let elapsed = 0;
  let playing = !reduceMotion;
  let inView = true;
  let lastTs = null;
  let intro = 0;          // ms of cube intro left (0 = story is running)
  let morphStarted = false;
  let outro = 0;          // ms left while the last scene folds back into the cube
  const OUTRO_MS = 4200;
  let firstIntro = true;

  function showCopy(next, prev) {
    if (prev !== null && prev !== next) {
      const p = copyScenes[prev];
      p.classList.remove('is-active');
      p.classList.add('is-leaving');
      p.setAttribute('aria-hidden', 'true');
      setTimeout(() => p.classList.remove('is-leaving'), 650);
    }
    setTimeout(() => {
      copyScenes[next].classList.add('is-active');
      copyScenes[next].removeAttribute('aria-hidden');
    }, prev === null || reduceMotion ? 0 : 350);

    chapters.forEach((c, i) => {
      c.classList.toggle('is-active', i === next);
      c.setAttribute('aria-current', i === next ? 'true' : 'false');
      fills[i].style.transform = 'scaleX(' + (i < next ? 1 : 0) + ')';
    });
  }

  function hideStage() {
    blocks.forEach(b => {
      b.el.classList.add('is-hidden');
      setVars(b.el, { '--z': 3 });
    });
    beams.forEach(el => el.classList.remove('on'));
    world.classList.remove('is-belt', 'is-fast');
  }

  function startIntro(fromOutro) {
    intro = INTRO_MS;
    morphStarted = false;
    hero.classList.add('hx-intro', 'hx-logo');
    logoSpin = 0;
    rubik.style.transition = 'none';
    if (fromOutro) {
      // the outro already rebuilt the cube in the logo pose
      morphing = false;
      rubikT = 0;
    } else {
      hideStage();
      homeCube();
      rubik.classList.remove('is-off');
      // camera and floor stay isometric; only the cube is posed like the logo
      rubik.style.transform = logoPose(0, 1.7);
    }
    if (firstIntro) cam.style.transition = 'none';
    cam.style.setProperty('--crx', '60deg');
    cam.style.setProperty('--crz', '-40deg');
    cam.style.setProperty('--cs', 1.05);
    if (firstIntro) {
      void cam.offsetWidth;
      cam.style.transition = '';
      firstIntro = false;
    }
    if (chipText) chipText.textContent = 'TechRAQ';
  }

  /* last scene -> the blocks gather in and the glass cube re-forms in the logo pose */
  const pose6 = (lift, rz1, rx, ry, rz2, back, sc) =>
    `translateZ(calc(var(--u) * ${lift})) rotateZ(${rz1}deg) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz2}deg) translateZ(calc(var(--u) * ${back})) scale3d(${sc}, ${sc}, ${sc})`;

  function startOutro() {
    clearMorph();
    outro = OUTRO_MS;
    hero.classList.add('hx-intro');
    if (chipText) chipText.textContent = 'TechRAQ';
    beams.forEach(el => el.classList.remove('on'));
    world.classList.remove('is-belt', 'is-fast');
    // ease the camera back to the intro angle while the cube rebuilds (logoPose assumes it)
    cam.style.setProperty('--crx', '60deg');
    cam.style.setProperty('--crz', '-40deg');
    cam.style.setProperty('--cs', 1.05);

    const UP = 'cubic-bezier(0.2, 0.7, 0.3, 1)';
    const DOWN = 'cubic-bezier(0.5, 0, 0.8, 0.4)';
    const step = (el, ms, ease, vars) => {
      el.style.transition = `transform ${ms}ms ${ease}`;
      setVars(el, vars);
    };
    const snapFaces = (el, fn) => {
      const faces = el.querySelectorAll('.f');
      faces.forEach(f => { f.style.transition = 'none'; });
      fn();
      void el.offsetWidth;
      faces.forEach(f => { f.style.transition = ''; });
    };

    // the cube waits on the floor (same frame as the intro's landing pose), every cubie hidden
    morphing = true;
    rubik.classList.remove('is-off');
    rubik.style.transition = 'none';
    rubik.style.transform = pose6(0, 0, 0, 0, 90, 0, 1);
    cubies.forEach(c => {
      c.el.classList.remove('to-solid');
      c.el.style.transition = 'none';
      snapFaces(c.el, () => c.el.classList.add('to-merge'));
      setVars(c.el, {
        '--x': (c.gx * GAP).toFixed(2), '--y': (c.gy * GAP).toFixed(2), '--z': (c.gz * GAP + 0.8).toFixed(2),
        '--sx': 0.2, '--sy': 0.2, '--sz': 0.2, '--r': 0
      });
    });
    void rubik.offsetWidth;

    // each visible block claims the nearest free bottom-layer cubie (rubik is turned 90deg: world = [-ly, lx])
    const live = blocks.filter(b => !b.el.classList.contains('is-hidden'));
    const free = cubies.filter(c => c.gz === 0);
    const pairs = live.map(b => {
      const bx = parseFloat(b.el.style.getPropertyValue('--x')) || 0;
      const by = parseFloat(b.el.style.getPropertyValue('--y')) || 0;
      let best = null, bestD = Infinity;
      free.forEach(c => {
        const wx = -c.gy * GAP, wy = c.gx * GAP;
        const d = (wx - bx) ** 2 + (wy - by) ** 2;
        if (d < bestD) { bestD = d; best = c; }
      });
      if (best) free.splice(free.indexOf(best), 1);
      return [b, best, bx, by];
    }).filter(p => p[1]);
    const claimed = new Set(pairs.map(p => p[1]));

    // 1) towers settle down into plain cubes
    pairs.forEach(([b]) => step(b.el, 500, 'cubic-bezier(0.34, 1.3, 0.5, 1)', { '--sx': 1, '--sy': 1, '--sz': 1, '--r': 0 }));

    // 2) one by one they turn to glass and hop onto their spot in the cube's bottom layer
    pairs.forEach(([b, c, bx, by], i) => {
      const t0 = 550 + i * 110;
      const wx = -c.gy * GAP, wy = c.gx * GAP;
      later(() => {
        b.el.className = 'hx-blk c-glass';
        b.icon.className = '';
        b.iconCls = '';
        step(b.el, 340, UP, {
          '--x': ((bx + wx) / 2).toFixed(2), '--y': ((by + wy) / 2).toFixed(2), '--z': 1.6,
          '--sx': 0.85, '--sy': 0.85, '--sz': 0.85
        });
      }, t0);
      later(() => step(b.el, 320, DOWN, {
        '--x': wx.toFixed(2), '--y': wy.toFixed(2), '--z': 0, '--sx': CUBIE, '--sy': CUBIE, '--sz': CUBIE
      }), t0 + 340);
      later(() => step(b.el, 160, UP, { '--z': 0.25 }), t0 + 660);
      later(() => step(b.el, 180, DOWN, { '--z': 0 }), t0 + 820);
    });

    // 3) the rest of the cube pops in around them, layer by layer
    cubies.filter(c => !claimed.has(c))
      .sort((p, q) => p.gz - q.gz)
      .forEach((c, i) => {
        later(() => {
          c.el.classList.remove('to-merge');
          step(c.el, 460, 'cubic-bezier(0.34, 1.4, 0.5, 1)', {
            '--z': (c.gz * GAP).toFixed(2), '--sx': CUBIE, '--sy': CUBIE, '--sz': CUBIE
          });
        }, 1300 + i * 35);
      });

    // 4) swap the landed blocks for their cubies (same spot and size), then the whole cube rises into the logo
    const SWAP_AT = 550 + (pairs.length - 1) * 110 + 1020;
    later(() => {
      pairs.forEach(([b, c]) => {
        snapFaces(b.el, () => b.el.classList.add('is-hidden'));
        b.el.style.transition = 'none';
        setVars(b.el, { '--z': 3 });
        c.el.style.transition = 'none';
        snapFaces(c.el, () => c.el.classList.remove('to-merge'));
        setVars(c.el, { '--z': (c.gz * GAP).toFixed(2), '--sx': CUBIE, '--sy': CUBIE, '--sz': CUBIE });
      });
    }, SWAP_AT);
    later(() => {
      blocks.forEach(b => { b.el.style.transition = ''; });
      cubies.forEach(c => { c.el.style.transition = ''; });
      rubik.style.transition = 'transform 1.3s cubic-bezier(0.45, 0, 0.2, 1)';
      rubik.style.transform = pose6(1.7, 40, -60, 0, 45, -1.37, LOGO_SCALE);
      hero.classList.add('hx-logo');
    }, Math.max(SWAP_AT, 1300 + 27 * 35 + 460) + 60);
  }

  function cancelOutro() {
    clearMorph();
    blocks.forEach(b => { b.el.style.transition = ''; });
    outro = 0;
    morphing = false;
    hero.classList.remove('hx-intro', 'hx-logo');
    rubik.classList.add('is-off');
  }

  function endIntro() {
    clearMorph();
    intro = 0;
    hero.classList.remove('hx-intro', 'hx-logo');
    elapsed = 0;
    beat = -1;
    tickBeats(true);
    rubik.classList.add('is-off');
  }

  function goToScene(next, withIntro) {
    next = (next + STORY.length) % STORY.length;
    const prev = scene;
    scene = next;
    elapsed = 0;
    beat = -1;
    showCopy(next, prev === next ? null : prev);
    if (withIntro && !reduceMotion) {
      startIntro(withIntro === 'fromOutro');
    } else {
      if (intro) {
        clearMorph();
        intro = 0;
        hero.classList.remove('hx-intro', 'hx-logo');
        rubik.classList.add('is-off');
      }
      if (outro) cancelOutro();
      tickBeats();
    }
  }

  function tickBeats(noDrop) {
    const b = reduceMotion && !playing ? BEATS - 1 : Math.min(Math.floor(elapsed / BEAT_MS), BEATS - 1);
    if (b !== beat) {
      beat = b;
      applyBeat(scene, beat, noDrop === true);
    }
  }

  function setPlaying(state) {
    playing = state;
    if (playBtn) {
      playBtn.setAttribute('aria-pressed', String(state));
      playBtn.setAttribute('aria-label', state ? 'Pause hero animation' : 'Play hero animation');
    }
  }

  chapters.forEach((c, i) => c.addEventListener('click', () => goToScene(i)));
  if (playBtn) playBtn.addEventListener('click', () => setPlaying(!playing));

  function loop(ts) {
    if (lastTs === null) lastTs = ts;
    const dt = Math.min(ts - lastTs, 60);
    lastTs = ts;

    if (playing && inView && !document.hidden) {
      if (outro > 0) {
        outro -= dt;
        if (outro <= 0) {
          outro = 0;
          goToScene(0, 'fromOutro');
        }
      } else if (intro > 0) {
        intro -= dt;
        spinCube(dt);
        if (!morphStarted && intro <= MORPH_AT) {
          morphStarted = true;
          morphCube();
        }
        if (intro <= 0) endIntro();
      } else {
        elapsed += dt;
        if (elapsed >= SCENE_MS) {
          // after the last scene the story folds back into the cube and replays
          if (scene === STORY.length - 1 && !reduceMotion) startOutro();
          else goToScene(scene + 1);
        } else {
          tickBeats();
        }
      }
    }
    if (fills[scene]) fills[scene].style.transform = 'scaleX(' + Math.min(elapsed / SCENE_MS, 1) + ')';
    requestAnimationFrame(loop);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; }).observe(hero);
  }

  copyScenes.forEach((s, i) => { if (i) s.setAttribute('aria-hidden', 'true'); });
  setPlaying(playing);
  showCopy(0, null);
  if (reduceMotion) {
    requestAnimationFrame(() => requestAnimationFrame(tickBeats));
  } else {
    startIntro();
  }
  requestAnimationFrame(loop);
})();
