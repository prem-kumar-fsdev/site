# DriesTech — The Shape of Business

The homepage now presents DriesTech using the supplied company-and-services deck. The retained exhibition's animations, sculpture controls, learning experiment, sound controls and motion preference remain in place.

- `/` — DriesTech's eight-chapter introduction.
- `/services/` — Capabilities, development process and project scopes.
- `/company/` — Team background and adaptation credits.
- Original reading rooms, AI-history archive, narration and credits remain available and are labelled as original exhibition material on the homepage. They are not DriesTech case studies.
- Contact information is a marked placeholder pending confirmed details.

Run `npm start` and open `http://localhost:3000/`.

Content adaptation is recorded in `scripts/rebrand_site.py`. It updates rendered HTML, React Flight data and client text together; the Flight schema byte length is regenerated so the interactive page can hydrate correctly. The pre-edit homepage and JavaScript bundles are backed up under `tmp/driestech-original/`. Keep that backup if you want to rerun the script. Only text literals changed in the two exhibition bundles; CSS, animation logic, models, images, audio and datasets were preserved.

Verified: desktop and 390px phone layouts; chapter drawer; sculpture poses; anamorphic viewpoints; rule classification; classifier training; context selection; threshold opening; project-scope choices; motion and sound controls; local links and assets. Browser checks reported no console errors.

## Original exhibition documentation

A clone of [The Shape of Intelligence](https://shapeofintelligence.com/) — an interactive exhibition by Jamie McKaye tracing the history of artificial intelligence from 1936 to the present.

---

## ✦ System Architecture & Design Inspection

### 1. Typography & Fonts
- **Headings & Body Sans**: `ABC Diatype` (`diatype-regular.woff2`, `diatype-medium.woff2`, `diatype-italic.woff2`) with system fallback metrics (`ascent-override: 98.48%`, `descent-override: 27.27%`).
- **Code & Labels Mono**: `ABC Diatype Mono` (`diatype-mono-regular.woff2`) with system fallback metrics (`ascent-override: 97.13%`, `descent-override: 26.89%`).
- **Scale & Leading**:
  - `--text-question`: `clamp(44px, 7vw, 128px)`
  - `--text-title`: `clamp(32px, 4.6vw, 72px)`
  - `--text-body`: `19px` with `--leading-body: 1.55` and `--measure: 64ch`
  - `--text-label`: `12px` with `--tracking-label: .1em`
  - `--text-caption`: `13px` with `--tracking-display: -.02em`

### 2. Color System & Design Tokens
- **Themes**:
  - `data-mode="paper"`: Light theme (`--bg: #f2f4f1`, `--fg: #202623`)
  - `data-mode="carbon"`: Dark theme (`--bg: #202623`, `--fg: #f2f4f1`)
  - `data-mode="blue"`: Accent theme (`--bg: #234ae8`, `--fg: #f2f4f1`)
  - `data-mode="night"`: Deep dark theme (`--bg: #090e13`)
- **Accents**:
  - `--blue`: `#234ae8`
  - `--coral`: `#c44d40` (with text contrast `--coral-ink: #a83a2e`)
  - `--green`: `#406b5b`
  - `--silver`: `#b8c4c5`
  - `--hair-on-white`: `#20262329`
  - `--hair-on-carbon`: `#f2f4f129`

---

## ✦ Interactive Components & Animations

1. **Continuum Sculpture (Opening)**
   - Reshapes smoothly across 3 states: `01 Rules` (`pose-0.webp`), `02 Learning` (`pose-1.webp`), `03 Context` (`pose-2.webp`).
   - Supports range slider interaction, horizontal pointer dragging on the sculpture, and button selection.

2. **Chapter 01: Anamorph Sculpture**
   - Perspective viewpoint slider (`-0.75` to `+0.75`).
   - Live angle calculation (`0°` when aligned, up to `±36°`).
   - Dynamically resolves between `aligned.webp` ("The word THINK is aligned") and `oblique.webp` ("The word THINK is distorted").

3. **Chapter 02: Rule Engine**
   - 8 geometrical specimens (`square`, `circle`, `triangle`, `ring`, `star`, `crescent`, `rounded square`, `blob`).
   - Sequential rule checking animation with status indicators (`idle`, `evaluating`, `matched`, `failed`).
   - Rule additions dynamically injected into the evaluation chain with counter updates (`6 rules · 7 junctions` -> `7 rules · 8 junctions`).

4. **Chapter 03: Fracture Title Animation**
   - 7 slices of `"promise."` rendered with CSS `clip-path: inset(...)`.
   - Scroll and pointer-driven 3D transforms (`translate3d` and `rotate`) creating an physical fracture and reassembly effect.

5. **Chapter 04: In-Browser Machine Learning Lab**
   - Real interactive gradient descent classifier running in the browser.
   - 3 datasets: *Two blobs*, *Four quadrants* (XOR), *A ring*.
   - 2 architectures: *Straight wire* (Logistic regression) and *Bending wire* (2-layer Multi-Layer Perceptron with 97 weights).
   - Real-time decision boundary contour tracing via Marching Squares on a 40x40 raster grid.
   - Live metric tracking (training accuracy, step count, held-out test set toggle).

6. **Chapter 06: Context & Attention Visualizer**
   - Token-level attention highlighting with language poses `pose-0.webp` through `pose-2.webp`.
   - 3 semantic contexts for the word "bank" (*river's edge*, *financial institution*, *tilt in turn*).

7. **Chapter 07: Interface Threshold**
   - Smooth opening slider controlling `--opening: 0..1` and switching threshold poses `0` through `3`.

8. **Chapter 08: Choice Forks**
   - 3 philosophical paths (*Purpose*, *Evidence*, *Consequences*) controlling decision sculpture poses.

9. **Navigation & Audio Narration**
   - Top scroll progress indicator bar (`hair`).
   - Fixed bottom bar with active chapter dot indicators, dialog chapter drawer modal with scene thumbnails.
   - Sound toggle & Motion reduction toggle.
   - Full synthesised audio narration players for Chapter 01 (`the-question.mp3`) and Chapter 02 (`the-rules.mp3`).

10. **Timeline Ledger & Archive**
    - Sourced dataset of 169 historical events from 1943 to present.
    - Live search query filtering by title, people, organizations, or tags.
    - Era pill filters (Foundations, AI Winter, Connection, Deep Learning, Transformers, Agents).
    - 169 individual detail pages (`/timeline/[id]/`).

---

## ✦ Asset Inventory

All 58 core media assets were downloaded directly from the live site:
- **Fonts (4)**: `diatype-regular.woff2`, `diatype-medium.woff2`, `diatype-mono-regular.woff2`, `diatype-italic.woff2`
- **Audio (2)**: `the-question.mp3`, `the-rules.mp3`
- **Data (4)**: `events.json`, `events.csv`, `schema.json`, `ml_presets.json`
- **Cinema Scenes (16)**: Desktop (`2400x1350`) and Mobile (`1080x1440`) for all 8 scenes
- **Interactive Sculptures (30)**:
  - Continuum: poses 0, 1, 2 (desktop + mobile)
  - Anamorph: aligned, oblique (desktop + mobile)
  - Threshold: poses 0, 1, 2, 3 (desktop + mobile)
  - Decision: poses 0, 1, 2 (desktop + mobile)
  - Language: poses 0, 1, 2 (desktop + mobile)
- **Branding (3)**: `icon.svg`, `favicon.ico`, `og.png`

---

## ✦ Running the Project Locally

To run the local server with zero dependencies:

```bash
# Using Node.js (already tested and verified):
node server.js

# Or using npm:
npm start

# Or using Python:
python -m http.server 3000 --directory public
```

Then open your browser at **`http://localhost:3000/`**.

### Available Routes
- `http://localhost:3000/` — Main Exhibition (8 chapters)
- `http://localhost:3000/read/` — Editorial Reader Overview
- `http://localhost:3000/read/the-question/` through `/read/the-choices/` — 8 Reading Rooms
- `http://localhost:3000/timeline/` — Searchable 169-Event Sourced Archive
- `http://localhost:3000/timeline/1943-mcculloch-pitts-neuron/` — Individual Event Detail Pages
- `http://localhost:3000/sources/` — Dataset & Methodology
- `http://localhost:3000/about/` — Colophon & Credits
- `http://localhost:3000/how/rules/` & `/how/learning/` — Technical Explanations
