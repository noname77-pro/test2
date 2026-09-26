# Qiya tekislik laboratoriyasi

An interactive physics web app (UI in Uzbek, Latin script) about **the motion of a body on an inclined plane**. It is built for projector use in open physics lessons.

- Inclined plane, block and force vectors are drawn in SVG, with arrow lengths scaled to the force magnitudes
- School-level friction model with one coefficient μ (`F_ishq = μN`, `tan α > μ`, `a = g(sin α − μ cos α)`)
- Live physical quantities, a v(t)/s(t) chart, a formula section
- "Oldindan taxmin qil" prediction mode, 4 preset experiments, projector mode, fullscreen

## Two parts, one app

| Route | What it is |
| --- | --- |
| `/` | Interactive inclined-plane simulator |
| `/presentation` | Open-lesson slide presentation (15 slides) |

The simulator has an **"Ochiq dars prezentatsiyasi"** button that opens the presentation. The presentation has a **"Simulyatorga qaytish"** button that returns to the simulator. The presentation is lazy-loaded as a separate chunk, so the simulator doesn't load its code.

## Lesson activities (simulator page)

A collapsible **"Dars bosqichlari"** card above the lab guides a school lesson in five steps: Muammo, Taxmin, Tajriba, Xulosa, Test.

- **Muammo:** a problem question; the answer is revealed only in the Xulosa step.
- **Taxmin:** Predict–Observe–Explain, Think–Pair–Share, and the "Kim tez topadi?" mini race.
- **Tajriba:** three group tasks (angle, mass, friction).
- **Xulosa:** return to the problem question, plus real-life examples.
- **Test:** true/false questions, a 5-question final test, and an exit ticket.

The "run" buttons set the existing simulator's parameters, start it, and record the measured time to reach the bottom. The race uses `timeToBottom()` from `lib/physics.ts`. No physics code was changed, and all answers stay in the browser's memory (nothing is sent or stored). The components are in `src/components/lesson/`.

## Running locally

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm run build      # typecheck + production build (dist/)
npm run preview    # serve the built version
npm test           # physics unit tests (vitest)
```

### Keyboard shortcuts for the teacher

| Key | Action |
| --- | --- |
| `Space` | Start / pause |
| `R` | Restart |
| `P` | Projector mode |
| `F` | Fullscreen |

## Presentation

Controls (keyboard, projector clicker or mouse):

| Key | Action |
| --- | --- |
| `Space`, `PageDown`, `↓`, click on the slide | Next step / animation (moves to the next slide once all steps are shown) |
| `PageUp`, `↑`, `Backspace` | Previous step |
| `→` | Next slide |
| `←` | Previous slide (opens fully revealed) |
| `Home` / `End` | First / last slide |
| `F` | Fullscreen |
| `Esc` | Exit fullscreen |

- Slides are laid out on a fixed 1920×1080 canvas and scaled to the screen, so they look the same at 1920×1080 and 1366×768.
- The current slide number is kept in the URL hash (`/presentation#6`), so a reload keeps your place.
- Animations use Framer Motion. Camera zooms animate the SVG `viewBox`; formulas are rendered with KaTeX.
- **Simulator URL:** the `SIMULATOR_URL` constant in `src/presentation/config.ts` controls where "Simulyatorni ochish" (slide 12, opens in a new tab) and "Simulyatorga qaytish" go. The default is `/`, the simulator in this same project.

## Deploying to Vercel

**Option 1: via GitHub**

1. Push the repository to GitHub.
2. On [vercel.com/new](https://vercel.com/new), choose **Import Git Repository** and select this repository.
3. Vercel detects Vite automatically (settings are also in `vercel.json`):
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. Every later push is deployed automatically.

**Option 2: via the CLI**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

## Project structure

```
├── index.html
├── public/favicon.svg
├── vercel.json
├── vite.config.ts
└── src/
    ├── main.tsx                     # entry point: / → simulator, /presentation → slides
    ├── index.css                    # Tailwind v4 theme, cards, sliders, layout grid
    ├── App.tsx                      # state, layout, keyboard shortcuts
    ├── lib/
    │   ├── physics.ts               # all physics: forces, sliding condition, integration
    │   ├── physics.test.ts          # unit tests
    │   ├── presets.ts               # default values and the 4 experiments
    │   └── format.ts
    ├── hooks/
    │   ├── useSimulation.ts         # requestAnimationFrame loop, start/pause/reset
    │   ├── useFullscreen.ts
    │   └── useElementWidth.ts
    ├── presentation/                # /presentation — open-lesson slides
    │   ├── config.ts                # SIMULATOR_URL, PRESENTATION_PATH
    │   ├── Presentation.tsx         # deck: navigation, keyboard, progress, fullscreen
    │   ├── InclineDiagram.tsx       # SVG diagram with camera zoom and force vectors
    │   ├── illustrations.tsx        # lifting scenes, example icons, mini inclines
    │   ├── ui.tsx                   # Stage (1920×1080 scaling), Reveal, Emphasis, SlideShell
    │   └── slides/                  # 15 slides (Intro, Force, Motion, Practice)
    └── components/
        ├── Header.tsx               # top bar + hero (+ "Ochiq dars prezentatsiyasi" button)
        ├── SimulationStage.tsx      # simulation card: HUD, speed, vector toggles
        ├── SimulationCanvas.tsx     # SVG scene: plane, block, angle, scale
        ├── ForceVector.tsx          # a single force arrow with its label
        ├── ControlPanel.tsx         # α, m, μ sliders, gravity, buttons
        ├── PhysicsPanel.tsx         # "Fizik kattaliklar"
        ├── StatusCard.tsx           # large status indicator and force comparison
        ├── PredictionMode.tsx       # "Oldindan taxmin qil"
        ├── ExperimentPresets.tsx    # preset experiments
        ├── GraphPanel.tsx           # v(t) / s(t) chart
        ├── FormulaPanel.tsx         # "Asosiy formulalar" (KaTeX)
        ├── ExplanationSection.tsx   # "Nima sodir bo‘lmoqda?"
        ├── ProjectorMode.tsx        # projector mode
        └── ui/                      # Slider, Dropdown, Tex, AnimatedNumber, Icons
```

## Physics model

| Quantity | Formula |
| --- | --- |
| Weight | `P = mg` |
| Component along the plane | `F_x = mg sin α` |
| Component perpendicular to the plane | `F_y = mg cos α` |
| Normal reaction | `N = mg cos α` |
| Friction force | `F_ishq = μN = μmg cos α` |
| Net force (downward motion) | `F_net = mg sin α − μmg cos α` |
| Condition for motion | `mg sin α > μmg cos α  ⇔  tan α > μ` |
| Acceleration | `a = g(sin α − μ cos α)` |

- If `mg sin α ≤ μmg cos α`, the body stays at rest ("Jism tinch holatda"), `a = 0` and `F_net = 0`. The friction arrow then balances `mg sin α` exactly, because friction can never exceed `μN` and cannot push the body up the slope.
- If `mg sin α > μmg cos α`, the body moves down the slope ("Jism qiya tekislik bo‘ylab pastga harakatlanmoqda") with `a = g(sin α − μ cos α) > 0`.
- If the angle is lowered during motion and `a < 0`, the body slows down, stops exactly at `v = 0`, and never moves backwards.
- Motion is integrated with the exact constant-acceleration formulas at each step. The moment the body reaches the bottom (L = 10 m) is solved for exactly, so the final `t` matches `√(2L/a)`.
