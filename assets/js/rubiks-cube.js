

      // Rubik's Cube Animation Logic
      (function () {
        'use strict';
      
        /* â”€â”€ CONFIG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        const S    = 80;   // face size px
        const CELL = 90;   // center-to-center spacing (S + 10px gap)
        const TZ   = S / 2; // translateZ for face placement
        const PULL = 100;  // max pull distance (cube-local px)
      
        /* face colours — Custom Purple palette (#c7c4e2) */
        const CLR = {
          top:    'rgba(199, 196, 226, 0.35)',
          bottom: 'rgba(199, 196, 226, 0.15)',
          front:  'rgba(199, 196, 226, 0.45)',
          back:   'rgba(199, 196, 226, 0.15)',
          right:  'rgba(199, 196, 226, 0.25)',
          left:   'rgba(199, 196, 226, 0.25)',
        };
      
        /* face CSS transforms */
        const FACE_XFORM = {
          front:  `translateZ(${TZ}px)`,
          back:   `rotateY(180deg) translateZ(${TZ}px)`,
          right:  `rotateY(90deg) translateZ(${TZ}px)`,
          left:   `rotateY(-90deg) translateZ(${TZ}px)`,
          top:    `rotateX(90deg) translateZ(${TZ}px)`,
          bottom: `rotateX(-90deg) translateZ(${TZ}px)`,
        };
      
        /* â”€â”€ BUILD 27 CUBIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        const cubeEl = document.getElementById('cube');
        const cubies = [];
      
        for (let gz = -1; gz <= 1; gz++) {
          for (let gy = -1; gy <= 1; gy++) {
            for (let gx = -1; gx <= 1; gx++) {
      
              const el = document.createElement('div');
              el.className = 'cubie';
              el.style.cssText = `width:${S}px;height:${S}px;left:50%;top:50%;margin-left:${-S/2}px;margin-top:${-S/2}px;`;
      
              const bx = gx * CELL, by = gy * CELL, bz = gz * CELL;
              el.style.transform = `translateX(${bx}px) translateY(${by}px) translateZ(${bz}px)`;
      
              /* 6 faces */
              Object.keys(CLR).forEach(name => {
                const f = document.createElement('div');
                f.className = `face ${name}`;
                f.style.cssText = `width:${S}px;height:${S}px;background:${CLR[name]};transform:${FACE_XFORM[name]}; border: 3px solid #c7c4e2; box-sizing: border-box;`;
                el.appendChild(f);
              });
      
              cubeEl.appendChild(el);
              cubies.push({ el, gx, gy, gz, bx, by, bz });
            }
          }
        }
      
        /* â”€â”€ ROTATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        let rotX = 0, rotY = 0, rotZ = 45;
        let velY = 0.32, velX = 0;
        let rafId = null;
        let spinning = false;
      
        function applyRot () {
          cubeEl.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
        }
        applyRot();
      
        function startSpin () {
          if (spinning) return;
          spinning = true;
          (function tick () {
            rotY += velY;
            applyRot();
            rafId = requestAnimationFrame(tick);
          })();