/**
 * The Shape of Intelligence — Complete Interactive Exhibition Runtime
 * Cloned with exact fidelity for design, typography, animations, and interactive instruments.
 */

(function () {
  'use strict';

  // --- 1. Global Navigation & Chrome ---
  function initChrome() {
    const hair = document.querySelector('.Chrome-module__jYh-RW__hair');
    const indexToggle = document.querySelector('.Chrome-module__jYh-RW__indexToggle');
    const currentSpan = document.querySelector('.Chrome-module__jYh-RW__current');
    const dialog = document.querySelector('.Chrome-module__jYh-RW__dialog');
    const closeDialogBtn = dialog ? dialog.querySelector('button[aria-label="Close chapters"]') : null;
    const dots = document.querySelectorAll('.Chrome-module__jYh-RW__indexIcon i');
    const chapterLinks = dialog ? dialog.querySelectorAll('.Chrome-module__jYh-RW__rail a') : [];
    const previewImages = dialog ? dialog.querySelectorAll('.Chrome-module__jYh-RW__menuPreview img') : [];
    const previewNum = dialog ? dialog.querySelector('.Chrome-module__jYh-RW__menuPreview span') : null;
    const soundToggle = document.querySelector('.Chrome-module__jYh-RW__toggle:has(.Chrome-module__jYh-RW__wave)');
    const motionToggle = Array.from(document.querySelectorAll('.Chrome-module__jYh-RW__toggle')).find(b => b.textContent.includes('Motion'));

    // Scroll progress bar (hair)
    function updateProgress() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      if (hair) {
        hair.style.width = Math.min(100, Math.max(0, progress)) + '%';
      }
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // Active Chapter Observer
    const chapters = [
      'the-question', 'the-rules', 'the-promise', 'the-examples',
      'the-scale', 'the-context', 'the-interface', 'the-choices'
    ];
    let currentChapterIndex = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const idx = chapters.indexOf(id);
          if (idx !== -1) {
            currentChapterIndex = idx;
            updateActiveChapter(idx);
          }
        }
      });
    }, { threshold: 0.3 });

    chapters.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    function updateActiveChapter(idx) {
      dots.forEach((dot, i) => {
        dot.setAttribute('data-active', i === idx ? 'true' : 'false');
      });
      if (currentSpan) {
        const numStr = String(idx + 1).padStart(2, '0');
        currentSpan.textContent = `${numStr} / 08`;
      }
    }

    // Dialog Modal
    if (indexToggle && dialog) {
      indexToggle.addEventListener('click', () => {
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
        updateDialogPreview(currentChapterIndex);
      });
    }

    if (closeDialogBtn && dialog) {
      closeDialogBtn.addEventListener('click', () => {
        if (typeof dialog.close === 'function') {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
        }
      });
    }

    function updateDialogPreview(idx) {
      previewImages.forEach((img, i) => {
        img.setAttribute('data-selected', i === idx ? 'true' : 'false');
      });
      if (previewNum) {
        previewNum.textContent = String(idx + 1).padStart(2, '0');
      }
    }

    chapterLinks.forEach((link, idx) => {
      link.addEventListener('mouseenter', () => updateDialogPreview(idx));
      link.addEventListener('focus', () => updateDialogPreview(idx));
      link.addEventListener('click', (e) => {
        if (dialog && typeof dialog.close === 'function') dialog.close();
        updateActiveChapter(idx);
      });
    });

    // Sound toggle
    let soundOn = false;
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        soundOn = !soundOn;
        soundToggle.setAttribute('aria-pressed', String(soundOn));
        soundToggle.innerHTML = `<span class="Chrome-module__jYh-RW__wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span>Sound ${soundOn ? 'on' : 'off'}`;
        // Mute or unmute any playing audio
        document.querySelectorAll('audio').forEach(a => {
          a.muted = !soundOn;
        });
      });
    }

    // Motion toggle
    let motionOn = true;
    if (motionToggle) {
      motionToggle.addEventListener('click', () => {
        motionOn = !motionOn;
        motionToggle.setAttribute('aria-pressed', String(motionOn));
        motionToggle.textContent = `Motion ${motionOn ? 'on' : 'off'}`;
        if (!motionOn) {
          document.documentElement.setAttribute('data-reduced-motion', 'true');
        } else {
          document.documentElement.removeAttribute('data-reduced-motion');
        }
      });
    }
  }

  // --- 2. Continuum Sculpture (Opening Section) ---
  function initContinuum() {
    const continuum = document.querySelector('.Exhibition-module__Q5YJhq__continuum');
    const range = document.querySelector('.Exhibition-module__Q5YJhq__poseRange');
    const buttons = document.querySelectorAll('.Exhibition-module__Q5YJhq__poseButtons button');
    const thought = document.querySelector('.Exhibition-module__Q5YJhq__poseThought');
    if (!continuum || !range) return;

    const thoughts = [
      'A structure defined by rules.',
      'A structure changed by experience.',
      'A structure shaped by its context.'
    ];

    function setPose(val) {
      const poseIdx = Math.min(2, Math.max(0, Math.round(val)));
      continuum.setAttribute('data-pose', String(poseIdx));
      continuum.setAttribute('data-ready', 'true');

      const img = continuum.querySelector('.Exhibition-module__Q5YJhq__continuumStill');
      const source = continuum.querySelector('source');
      if (img) img.src = `/continuum/pose-${poseIdx}.webp`;
      if (source) source.srcset = `/continuum/pose-${poseIdx}-mobile.webp`;

      buttons.forEach((btn, i) => {
        btn.setAttribute('aria-pressed', i === poseIdx ? 'true' : 'false');
      });

      if (thought) {
        thought.textContent = thoughts[poseIdx];
      }
      range.value = val;
      range.setAttribute('aria-valuetext', `${['Rules', 'Learning', 'Context'][poseIdx]}: ${thoughts[poseIdx]}`);
    }

    range.addEventListener('input', (e) => {
      setPose(parseFloat(e.target.value));
    });

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        setPose(i);
      });
    });

    // Pointer drag on sculpture
    let isDragging = false;
    let startX = 0;
    let startVal = 1;

    continuum.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startVal = parseFloat(range.value);
      continuum.setPointerCapture(e.pointerId);
    });

    continuum.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const newVal = Math.min(2, Math.max(0, startVal + dx / 150));
      setPose(newVal);
    });

    const stopDrag = () => { isDragging = false; };
    continuum.addEventListener('pointerup', stopDrag);
    continuum.addEventListener('pointercancel', stopDrag);

    // Initial state
    setPose(1);
  }

  // --- 3. Chapter 01 Anamorph Sculpture ---
  function initAnamorph() {
    const container = document.querySelector('.Anamorph-module__TbR9GG__object');
    const range = document.querySelector('.Anamorph-module__TbR9GG__controls input[type="range"]');
    const labelAngle = document.querySelector('.Anamorph-module__TbR9GG__controlLabel span:last-child');
    const buttons = document.querySelectorAll('.Anamorph-module__TbR9GG__buttons button');
    if (!container || !range) return;

    function setAngle(val) {
      val = parseFloat(val);
      const isAligned = Math.abs(val) < 0.15;
      const filename = isAligned ? 'aligned' : 'oblique';

      const img = container.querySelector('img');
      const source = container.querySelector('source');
      if (img) img.src = `/anamorph/${filename}.webp`;
      if (source) source.srcset = `/anamorph/${filename}-mobile.webp`;
      container.setAttribute('data-ready', 'true');

      const deg = isAligned ? 0 : Math.round(val * 48);
      if (labelAngle) {
        labelAngle.textContent = (deg > 0 ? `+${deg}` : `${deg}`) + '°';
      }

      if (buttons.length >= 2) {
        buttons[0].setAttribute('aria-pressed', isAligned ? 'true' : 'false');
        buttons[1].setAttribute('aria-pressed', !isAligned ? 'true' : 'false');
      }

      range.value = val;
      range.setAttribute('aria-valuetext', isAligned ? 'The word THINK is aligned' : 'The word THINK is distorted');
    }

    range.addEventListener('input', (e) => {
      setAngle(e.target.value);
    });

    if (buttons.length >= 2) {
      buttons[0].addEventListener('click', () => setAngle(0));
      buttons[1].addEventListener('click', () => setAngle(0.45));
    }

    // Drag on anamorph object
    let isDragging = false;
    let startX = 0;
    let startVal = 0;

    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startVal = parseFloat(range.value);
      container.setPointerCapture(e.pointerId);
    });

    container.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const newVal = Math.min(0.75, Math.max(-0.75, startVal + dx / 300));
      setAngle(newVal);
    });

    const stopDrag = () => { isDragging = false; };
    container.addEventListener('pointerup', stopDrag);
    container.addEventListener('pointercancel', stopDrag);

    // Initial state
    setAngle(0);
  }

  // --- 4. Chapter 02 Rule Machine ---
  function initRuleMachine() {
    const scene = document.querySelector('[data-instrument="rules"]');
    if (!scene) return;

    const counter = scene.querySelector('.Rules-module__bTvO5G__counter');
    const specimens = scene.querySelectorAll('.Rules-module__bTvO5G__specimen');
    const selectedShape = scene.querySelector('.Rules-module__bTvO5G__selectedShape');
    const rulesList = scene.querySelector('.Rules-module__bTvO5G__rules');
    const readout = scene.querySelector('.Rules-module__bTvO5G__readout');
    const additions = scene.querySelectorAll('.Rules-module__bTvO5G__addition');
    const resetBtn = scene.querySelector('.Rules-module__bTvO5G__actions button.door');

    const specimenData = {
      'square': { id: 'square', sides: 4, corners: 'sharp', hole: false, symmetric: true },
      'circle': { id: 'circle', sides: 0, corners: 'none', hole: false, symmetric: true },
      'triangle': { id: 'triangle', sides: 3, corners: 'sharp', hole: false, symmetric: true },
      'ring': { id: 'ring', sides: 0, corners: 'none', hole: true, symmetric: true },
      'star': { id: 'star', sides: 10, corners: 'sharp', hole: false, symmetric: true },
      'crescent': { id: 'crescent', sides: 0, corners: 'sharp', hole: false, symmetric: false },
      'rounded square': { id: 'rounded square', sides: 4, corners: 'rounded', hole: false, symmetric: true },
      'blob': { id: 'blob', sides: 0, corners: 'none', hole: false, symmetric: false }
    };

    const initialRules = [
      { id: 'r1', text: 'If it has a hole, it is a ring.', check: s => s.hole === true, label: 'ring' },
      { id: 'r2', text: 'If it has no straight sides and looks the same turned around, it is a circle.', check: s => s.sides === 0 && s.symmetric === true, label: 'circle' },
      { id: 'r3', text: 'If it has three straight sides, it is a triangle.', check: s => s.sides === 3, label: 'triangle' },
      { id: 'r4', text: 'If it has four straight sides and sharp corners, it is a square.', check: s => s.sides === 4 && s.corners === 'sharp', label: 'square' },
      { id: 'r5', text: 'If it has more than four straight sides, it is a star.', check: s => s.sides > 4, label: 'star' },
      { id: 'r6', text: 'If it has no straight sides and sharp points, it is a crescent.', check: s => s.sides === 0 && s.corners === 'sharp', label: 'crescent' }
    ];

    let activeRules = [...initialRules];
    let addedCount = 0;

    function renderRules() {
      rulesList.innerHTML = '';
      activeRules.forEach((rule, idx) => {
        const li = document.createElement('li');
        li.className = 'Rules-module__bTvO5G__rule';
        li.setAttribute('data-rule', rule.id);
        li.setAttribute('data-state', 'idle');
        li.innerHTML = `<span>${rule.text}</span><span class="Rules-module__bTvO5G__mark"></span>`;
        rulesList.appendChild(li);
      });
      if (counter) {
        counter.textContent = `${activeRules.length} rules · ${activeRules.length + 1} junctions`;
      }
    }

    function evaluateSpecimen(specName, specBtn) {
      specimens.forEach(b => b.setAttribute('aria-pressed', b === specBtn ? 'true' : 'false'));
      const spec = specimenData[specName];
      if (!spec) return;

      // Update selected shape preview
      const svg = specBtn.querySelector('svg').cloneNode(true);
      selectedShape.innerHTML = '';
      const div = document.createElement('div');
      div.appendChild(svg);
      selectedShape.appendChild(div);
      const span = document.createElement('span');
      span.textContent = specName;
      selectedShape.appendChild(span);

      // Reset rule states
      const ruleEls = rulesList.querySelectorAll('.Rules-module__bTvO5G__rule');
      ruleEls.forEach(r => r.setAttribute('data-state', 'idle'));

      // Step-by-step evaluation
      let matchedIdx = -1;
      for (let i = 0; i < activeRules.length; i++) {
        const rule = activeRules[i];
        if (rule.check(spec)) {
          matchedIdx = i;
          break;
        }
      }

      ruleEls.forEach((rEl, i) => {
        if (matchedIdx !== -1 && i === matchedIdx) {
          rEl.setAttribute('data-state', 'matched');
        } else if (matchedIdx !== -1 && i < matchedIdx) {
          rEl.setAttribute('data-state', 'failed');
        } else if (matchedIdx === -1) {
          rEl.setAttribute('data-state', 'failed');
        } else {
          rEl.setAttribute('data-state', 'idle');
        }
      });

      if (readout) {
        if (matchedIdx !== -1) {
          readout.textContent = `Matched rule ${matchedIdx + 1}: It is a ${activeRules[matchedIdx].label}.`;
        } else {
          readout.textContent = `No rule matched for ${specName}. The explicit rules have met their boundary.`;
        }
      }
    }

    specimens.forEach(btn => {
      const name = btn.textContent.trim().toLowerCase();
      btn.addEventListener('click', () => evaluateSpecimen(name, btn));
    });

    // Additions
    const additionRules = [
      { id: 'a1', text: 'If it has four sides and rounded corners, call it a square anyway.', check: s => s.sides === 4 && s.corners === 'rounded', label: 'square' },
      { id: 'a2', text: 'If it has no straight sides and is not symmetric, it is a blob.', check: s => s.sides === 0 && s.symmetric === false, label: 'blob' },
      { id: 'a3', text: 'If it has rounded corners, whatever else is true, it is a pebble.', check: s => s.corners === 'rounded', label: 'pebble' }
    ];

    additions.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const toAdd = additionRules[idx];
        if (!activeRules.find(r => r.id === toAdd.id)) {
          activeRules.push(toAdd);
          renderRules();
          btn.style.display = 'none';
        }
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeRules = [...initialRules];
        renderRules();
        additions.forEach(b => b.style.display = '');
        specimens.forEach(b => b.setAttribute('aria-pressed', 'false'));
        selectedShape.innerHTML = '<div><span>Choose<br/>a shape.</span></div><span>What makes it what it is?</span>';
        if (readout) readout.textContent = 'Pick a specimen to run it through the rules.';
      });
    }

    renderRules();
  }

  // --- 5. Chapter 03 Fracture Animation (The Promise) ---
  function initFracture() {
    const frame = document.querySelector('[data-promise-frame="true"]');
    const slices = document.querySelectorAll('[data-fracture-slice]');
    const whole = document.querySelector('[data-promise-whole="true"]');
    const caption = document.querySelector('[data-promise-caption="true"]');
    if (!frame || !slices.length) return;

    function handleScroll() {
      const rect = frame.getBoundingClientRect();
      const h = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (h - rect.top) / (h + rect.height)));

      if (progress > 0.2 && progress < 0.8) {
        const amount = Math.sin((progress - 0.2) / 0.6 * Math.PI);
        if (whole) whole.style.opacity = amount > 0.1 ? '0' : '1';
        frame.dataset.fractured = String(amount > 0.1);

        slices.forEach((slice, t) => {
          const n = t % 2 ? 1 : -1;
          slice.style.transform = `translate3d(${n * amount * (16 + 8 * t)}px, ${amount * (t - 3) * 10}px, 0) rotate(${n * amount * (0.4 + 0.05 * t)}deg)`;
        });

        if (caption) {
          caption.textContent = amount > 0.6 ? 'A promise meets its limits.' : 'A promise takes shape.';
        }
      } else {
        if (whole) whole.style.opacity = '1';
        slices.forEach(slice => { slice.style.transform = 'none'; });
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --- 6. Chapter 04 Interactive Machine Learning Lab ---
  function initMachineLearning() {
    const scene = document.querySelector('[data-instrument="learning"]');
    if (!scene) return;

    const counter = scene.querySelector('.Learning-module__4eaJ8G__counter');
    const plate = scene.querySelector('.Learning-module__4eaJ8G__plate');
    const svg = plate ? plate.querySelector('svg') : null;
    const readout = scene.querySelector('.Learning-module__4eaJ8G__readout');
    const accuracyEl = scene.querySelector('.Learning-module__4eaJ8G__metrics strong:first-of-type');
    const stepsEl = scene.querySelector('.Learning-module__4eaJ8G__metrics div:last-child strong');
    const runBtn = scene.querySelector('button[data-run="true"]');
    const heldOutBtn = Array.from(scene.querySelectorAll('.Learning-module__4eaJ8G__actions button')).find(b => b.textContent.includes('held-out'));
    const resetBtn = Array.from(scene.querySelectorAll('.Learning-module__4eaJ8G__actions button')).find(b => b.textContent.includes('Reset'));

    const exampleChips = scene.querySelectorAll('.Learning-module__4eaJ8G__group:first-child button');
    const modelChips = scene.querySelectorAll('.Learning-module__4eaJ8G__group:last-child button');

    let currentPreset = 'blobs';
    let currentModel = 'logistic';
    let showHeldOut = false;
    let totalSteps = 0;
    let mlData = null;
    let params = null;

    // Load presets
    fetch('/data/ml_presets.json')
      .then(res => res.json())
      .then(data => {
        mlData = data;
        initPreset();
      })
      .catch(() => {
        // Fallback to inline generated data if fetch blocked
        initPreset();
      });

    // Model mathematics (exact from extracted 75211)
    const sigmoid = e => 1 / (1 + Math.exp(-e));
    function forwardMLP(p, x, y) {
      let h1 = Array(8);
      for (let a = 0; a < 8; a++) h1[a] = Math.tanh(p.w1[2 * a] * x + p.w1[2 * a + 1] * y + p.b1[a]);
      let h2 = Array(8);
      for (let l = 0; l < 8; l++) {
        let t = p.b2[l];
        for (let a = 0; a < 8; a++) t += p.w2[8 * l + a] * h1[a];
        h2[l] = Math.tanh(t);
      }
      let s = p.b3;
      for (let l = 0; l < 8; l++) s += p.w3[l] * h2[l];
      return { h1, h2, p: sigmoid(s) };
    }

    function predict(p, x, y) {
      return p.kind === 'logistic' ? sigmoid(p.w[0] * x + p.w[1] * y + p.b) : forwardMLP(p, x, y).p;
    }

    function initModelParams(kind) {
      if (kind === 'logistic') {
        return { kind: 'logistic', w: [0, 0], b: 0 };
      }
      return {
        kind: 'mlp',
        w1: Array.from({ length: 16 }, () => (Math.random() * 2 - 1) * Math.sqrt(0.6)),
        b1: Array(8).fill(0),
        w2: Array.from({ length: 64 }, () => (Math.random() * 2 - 1) * Math.sqrt(0.375)),
        b2: Array(8).fill(0),
        w3: Array.from({ length: 8 }, () => (Math.random() * 2 - 1) * Math.sqrt(6 / 9)),
        b3: 0
      };
    }

    function trainBatch(p, dataset, lr) {
      let loss = 0;
      for (let pt of dataset) {
        const x = pt.x, y = pt.y, label = pt.label;
        if (p.kind === 'logistic') {
          const prob = sigmoid(p.w[0] * x + p.w[1] * y + p.b);
          loss += -(label * Math.log(prob + 1e-9) + (1 - label) * Math.log(1 - prob + 1e-9));
          const diff = prob - label;
          p.w[0] -= lr * diff * x;
          p.w[1] -= lr * diff * y;
          p.b -= lr * diff;
        } else {
          const out = forwardMLP(p, x, y);
          loss += -(label * Math.log(out.p + 1e-9) + (1 - label) * Math.log(1 - out.p + 1e-9));
          const diff = out.p - label;
          let a = Array(8);
          for (let t = 0; t < 8; t++) a[t] = diff * p.w3[t] * (1 - out.h2[t] * out.h2[t]);
          let c = Array(8).fill(0);
          for (let l = 0; l < 8; l++) {
            let t = 0;
            for (let e = 0; e < 8; e++) t += a[e] * p.w2[8 * e + l];
            c[l] = t * (1 - out.h1[l] * out.h1[l]);
          }
          for (let r = 0; r < 8; r++) {
            p.w3[r] -= lr * diff * out.h2[r];
            p.b2[r] -= lr * a[r];
            for (let l = 0; l < 8; l++) p.w2[8 * r + l] -= lr * a[r] * out.h1[l];
          }
          p.b3 -= lr * diff;
          for (let e = 0; e < 8; e++) {
            p.w1[2 * e] -= lr * c[e] * x;
            p.w1[2 * e + 1] -= lr * c[e] * y;
            p.b1[e] -= lr * c[e];
          }
        }
      }
      return loss / dataset.length;
    }

    // Marching squares contour extraction
    function computeContours(p, resolution = 40) {
      const grid = [];
      for (let j = 0; j < resolution; j++) {
        const y = -1 + (j + 0.5) * 2 / resolution;
        for (let i = 0; i < resolution; i++) {
          const x = -1 + (i + 0.5) * 2 / resolution;
          grid[j * resolution + i] = predict(p, x, y);
        }
      }

      const segments = [];
      const coord = (i, j) => [-1 + (i + 0.5) * 2 / resolution, -1 + (j + 0.5) * 2 / resolution];
      const val = (i, j) => grid[j * resolution + i];

      for (let j = 0; j < resolution - 1; j++) {
        for (let i = 0; i < resolution - 1; i++) {
          const corners = [val(i, j), val(i + 1, j), val(i + 1, j + 1), val(i, j + 1)];
          const pts = [coord(i, j), coord(i + 1, j), coord(i + 1, j + 1), coord(i, j + 1)];
          const cross = [];
          for (let e = 0; e < 4; e++) {
            const next = (e + 1) % 4;
            if ((corners[e] >= 0.5) !== (corners[next] >= 0.5)) {
              const frac = (0.5 - corners[e]) / (corners[next] - corners[e]);
              cross.push([
                pts[e][0] + (pts[next][0] - pts[e][0]) * frac,
                pts[e][1] + (pts[next][1] - pts[e][1]) * frac
              ]);
            }
          }
          if (cross.length === 2) {
            segments.push([cross[0], cross[1]]);
          } else if (cross.length === 4) {
            segments.push([cross[0], cross[3]]);
            segments.push([cross[1], cross[2]]);
          }
        }
      }
      return segments;
    }

    function initPreset() {
      totalSteps = 0;
      params = initModelParams(currentModel);
      renderPlate();
      updateMetrics();
    }

    function getPoints() {
      if (mlData && mlData.presets) {
        const p = mlData.presets.find(x => x.id === currentPreset || x.name.toLowerCase().includes(currentPreset));
        if (p) return p;
      }
      // Built-in backup
      return {
        train: Array.from({ length: 40 }, (_, i) => ({ x: -0.5 + (Math.random() - 0.5) * 0.4, y: -0.5 + (Math.random() - 0.5) * 0.4, label: 0 }))
          .concat(Array.from({ length: 40 }, (_, i) => ({ x: 0.5 + (Math.random() - 0.5) * 0.4, y: 0.5 + (Math.random() - 0.5) * 0.4, label: 1 }))),
        heldOut: Array.from({ length: 20 }, (_, i) => ({ x: -0.5 + (Math.random() - 0.5) * 0.5, y: -0.5 + (Math.random() - 0.5) * 0.5, label: 0 }))
          .concat(Array.from({ length: 20 }, (_, i) => ({ x: 0.5 + (Math.random() - 0.5) * 0.5, y: 0.5 + (Math.random() - 0.5) * 0.5, label: 1 })))
      };
    }

    function renderPlate() {
      if (!svg) return;
      const data = getPoints();
      const train = data.train || [];
      const heldOut = showHeldOut ? (data.heldOut || []) : [];

      // Remove previous points and wire
      const oldPts = svg.querySelectorAll('g[data-point], path.wire-contour');
      oldPts.forEach(el => el.remove());

      // Render wire decision boundary
      if (totalSteps > 0 && params) {
        const segments = computeContours(params, 45);
        if (segments.length > 0) {
          let dStr = '';
          segments.forEach(seg => {
            const x1 = (seg[0][0] + 1) * 200;
            const y1 = (seg[0][1] + 1) * 200;
            const x2 = (seg[1][0] + 1) * 200;
            const y2 = (seg[1][1] + 1) * 200;
            dStr += `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} `;
          });
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', dStr);
          path.setAttribute('stroke', '#ffffff');
          path.setAttribute('stroke-width', '2.5');
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke-linecap', 'round');
          path.setAttribute('class', 'wire-contour');
          svg.appendChild(path);
        }
      }

      // Render points
      const allRender = train.map(p => ({ ...p, isHeld: false }))
        .concat(heldOut.map(p => ({ ...p, isHeld: true })));

      allRender.forEach(p => {
        const cx = (p.x + 1) * 200;
        const cy = (p.y + 1) * 200;
        const isWrong = totalSteps > 0 ? (predict(params, p.x, p.y) >= 0.5 ? 1 : 0) !== p.label : false;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('data-point', String(p.label));

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx.toFixed(1));
        circle.setAttribute('cy', cy.toFixed(1));
        circle.setAttribute('r', '4.5');

        if (p.label === 0) {
          circle.setAttribute('fill', isWrong ? '#c44d40' : '#ffffff');
        } else {
          circle.setAttribute('fill', 'none');
          circle.setAttribute('stroke', isWrong ? '#c44d40' : '#ffffff');
          circle.setAttribute('stroke-width', '2.2');
        }

        if (p.isHeld) {
          circle.setAttribute('stroke-dasharray', '2,2');
          circle.setAttribute('opacity', '0.75');
        }

        g.appendChild(circle);
        svg.appendChild(g);
      });
    }

    function updateMetrics() {
      if (counter) {
        counter.textContent = `${totalSteps} steps · training ${totalSteps > 0 ? 'active' : '—'}`;
      }
      if (stepsEl) {
        stepsEl.textContent = String(totalSteps);
      }
      if (totalSteps === 0) {
        if (accuracyEl) accuracyEl.textContent = '—';
        if (readout) readout.textContent = `${currentPreset}: 40 in tray A, 40 in tray B. Run the model to draw the wire.`;
      } else {
        const data = getPoints();
        const train = data.train || [];
        let correct = 0;
        train.forEach(pt => {
          const pred = predict(params, pt.x, pt.y) >= 0.5 ? 1 : 0;
          if (pred === pt.label) correct++;
        });
        const acc = ((correct / train.length) * 100).toFixed(0);
        if (accuracyEl) accuracyEl.textContent = `${acc}%`;
        if (readout) readout.textContent = `Step ${totalSteps}: Training accuracy is ${acc}%. Wire reshaped by gradient updates.`;
      }
    }

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const lr = currentModel === 'logistic' ? 0.15 : 0.05;
        const data = getPoints();
        const train = data.train || [];

        // Run 50 steps
        for (let i = 0; i < 50; i++) {
          trainBatch(params, train, lr);
        }
        totalSteps += 50;
        renderPlate();
        updateMetrics();
      });
    }

    if (heldOutBtn) {
      heldOutBtn.addEventListener('click', () => {
        showHeldOut = !showHeldOut;
        heldOutBtn.setAttribute('aria-pressed', String(showHeldOut));
        renderPlate();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        initPreset();
      });
    }

    exampleChips.forEach((chip, i) => {
      chip.addEventListener('click', () => {
        exampleChips.forEach(c => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
        const ids = ['blobs', 'quadrants', 'ring'];
        currentPreset = ids[i] || 'blobs';
        initPreset();
      });
    });

    modelChips.forEach((chip, i) => {
      chip.addEventListener('click', () => {
        modelChips.forEach(c => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
        currentModel = i === 0 ? 'logistic' : 'mlp';
        initPreset();
      });
    });
  }

  // --- 7. Chapter 06 Context & Attention ---
  function initContext() {
    const stage = document.querySelector('.Exhibition-module__Q5YJhq__contextStage');
    if (!stage) return;

    const range = stage.querySelector('input[type="range"]');
    const wordWorld = stage.querySelector('.Context-module__sHRFTG__wordWorld');
    const fixedWord = stage.querySelector('.Context-module__sHRFTG__fixedWord span');
    const meaning = stage.querySelector('.Context-module__sHRFTG__meaning');
    const stillImg = stage.querySelector('[data-language-still="true"]');
    const stillSource = stage.querySelector('source[srcSet*="language"]');
    const sentenceButtons = stage.querySelectorAll('.Context-module__sHRFTG__sentenceToggle');

    const contexts = [
      { world: 0, text: 'bank', meaning: 'a river’s edge', explanation: '“River” gives “bank” a geographical context: the land beside water.' },
      { world: 1, text: 'bank', meaning: 'a place for money', explanation: '“Savings” gives “bank” a financial context: an institution that holds money.' },
      { world: 2, text: 'bank', meaning: 'a change of direction', explanation: '“Pilot” and “aircraft” make “bank” an action: to tilt during a turn.' }
    ];

    let currentWorld = 0;

    function updateContext(worldIdx, bend = 0) {
      currentWorld = worldIdx;
      if (wordWorld) wordWorld.setAttribute('data-context-world', String(worldIdx));
      const ctx = contexts[worldIdx];
      if (meaning) meaning.textContent = ctx.meaning;

      const poseIdx = Math.min(2, Math.max(0, worldIdx));
      if (stillImg) stillImg.src = `/language/pose-${poseIdx}.webp`;
      if (stillSource) stillSource.srcset = `/language/pose-${poseIdx}-mobile.webp`;

      sentenceButtons.forEach((btn, i) => {
        btn.setAttribute('aria-pressed', i === worldIdx ? 'true' : 'false');
      });
    }

    if (range) {
      range.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        const world = Math.min(2, Math.round(val * 2));
        updateContext(world, val);
      });
    }

    sentenceButtons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        if (range) range.value = i / 2;
        updateContext(i);
      });
    });

    updateContext(0);
  }

  // --- 8. Chapter 07 Interface Portal ---
  function initInterfaceThreshold() {
    const stage = document.querySelector('.InterfaceThreshold-module__qCqjqG__stage');
    const range = document.querySelector('.InterfaceThreshold-module__qCqjqG__controls input[type="range"]');
    const thresholdImg = document.querySelector('[data-threshold-volume="true"] img');
    const thresholdSource = document.querySelector('[data-threshold-volume="true"] source');
    if (!stage || !range) return;

    function setThreshold(val) {
      val = parseFloat(val);
      stage.style.setProperty('--opening', val.toFixed(3));
      stage.setAttribute('data-open', val.toFixed(3));

      const poseIdx = Math.min(3, Math.round(val * 3));
      if (thresholdImg) thresholdImg.src = `/threshold/pose-${poseIdx}.webp`;
      if (thresholdSource) thresholdSource.srcset = `/threshold/pose-${poseIdx}-mobile.webp`;
    }

    range.addEventListener('input', (e) => {
      setThreshold(e.target.value);
    });

    setThreshold(0);
  }

  // --- 9. Chapter 08 Choice Fork ---
  function initChoiceFork() {
    const fork = document.querySelector('.ChoiceFork-module__OhuYiq__fork');
    if (!fork) return;

    const selectors = fork.querySelectorAll('.ChoiceFork-module__OhuYiq__selectors button');
    const geometryImg = fork.querySelector('.ChoiceFork-module__OhuYiq__geometry img');
    const geometrySource = fork.querySelector('.ChoiceFork-module__OhuYiq__geometry source');
    const questionEl = fork.querySelector('h3');
    const noteEl = fork.querySelector('.ChoiceFork-module__OhuYiq__answer');

    const choices = [
      {
        name: "Purpose",
        question: "Who chooses what intelligence is for?",
        note: "Who defines the goal? Which measures count as success? What gets left outside the frame?"
      },
      {
        name: "Evidence",
        question: "What would make it worth trusting?",
        note: "What counts as evidence? Who checks the answer? Where does confidence end and understanding begin?"
      },
      {
        name: "Consequences",
        question: "Who lives with the consequences?",
        note: "Whose work makes it possible? Who gets the benefit? Who has a say when the costs fall elsewhere?"
      }
    ];

    function selectChoice(idx) {
      fork.setAttribute('data-choice', String(idx));
      fork.setAttribute('data-explored', 'true');

      selectors.forEach((btn, i) => {
        btn.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
      });

      if (geometryImg) geometryImg.src = `/decision/pose-${idx}.webp`;
      if (geometrySource) geometrySource.srcset = `/decision/pose-${idx}-mobile.webp`;

      if (questionEl) questionEl.textContent = choices[idx].question;
      if (noteEl) noteEl.textContent = choices[idx].note;
    }

    selectors.forEach((btn, i) => {
      btn.addEventListener('click', () => selectChoice(i));
    });

    selectChoice(0);
  }

  // --- 10. Narration Audio Players ---
  function initNarrations() {
    const narrations = document.querySelectorAll('.Narration-module__tnkSFq__narration');
    narrations.forEach(narration => {
      const summary = narration.querySelector('summary');
      const audio = narration.querySelector('audio');
      if (!audio) return;

      audio.addEventListener('play', () => {
        // Pause other audios
        document.querySelectorAll('audio').forEach(other => {
          if (other !== audio) other.pause();
        });
      });
    });
  }

  // Initialize all interactive modules on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  
  // --- 11. Timeline Ledger Filtering & Search ---
  function initTimeline() {
    const searchInput = document.getElementById('ledger-q');
    const filterButtons = document.querySelectorAll('.Ledger-module__V3ex6q__pill');
    const list = document.querySelector('.Ledger-module__V3ex6q__list');
    const countEl = document.querySelector('.Ledger-module__V3ex6q__count');
    if (!list) return;

    const items = Array.from(list.querySelectorAll('.Ledger-module__V3ex6q__item'));
    let activeFilter = null;
    let query = '';

    function filterEvents() {
      let visibleCount = 0;
      const q = query.toLowerCase().trim();

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        let matchesQuery = !q || text.includes(q);
        let matchesFilter = true;

        if (activeFilter) {
          const pillText = activeFilter.toLowerCase();
          // Match era or category
          matchesFilter = text.includes(pillText) || (item.getAttribute('data-event') || '').includes(pillText);
        }

        if (matchesQuery && matchesFilter) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      if (countEl) {
        countEl.textContent = `${visibleCount} of ${items.length} events`;
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        query = e.target.value;
        filterEvents();
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const isPressed = btn.getAttribute('aria-pressed') === 'true';
        filterButtons.forEach(b => {
          b.setAttribute('aria-pressed', 'false');
          b.classList.remove('Ledger-module__V3ex6q__pillOn');
        });

        if (!isPressed) {
          btn.setAttribute('aria-pressed', 'true');
          btn.classList.add('Ledger-module__V3ex6q__pillOn');
          // Extract text without span count
          const clone = btn.cloneNode(true);
          const spans = clone.querySelectorAll('span');
          spans.forEach(s => s.remove());
          activeFilter = clone.textContent.trim();
        } else {
          activeFilter = null;
        }

        filterEvents();
      });
    });
  }

  function initAll() {
    initTimeline();
    initChrome();
    initContinuum();
    initAnamorph();
    initRuleMachine();
    initFracture();
    initMachineLearning();
    initContext();
    initInterfaceThreshold();
    initChoiceFork();
    initNarrations();
  }
})();
