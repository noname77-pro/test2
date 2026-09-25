# Qiya tekislik laboratoriyasi

An interactive physics web app (UI in Uzbek, Latin script) about **the motion of a body on an inclined plane**. It is built for projector use in open physics lessons.

- Inclined plane, block and force vectors are drawn in SVG, with arrow lengths scaled to the force magnitudes
- School-level friction model with one coefficient μ (`F_ishq = μN`, `tan α > μ`, `a = g(sin α − μ cos α)`)
- Live physical quantities, a v(t)/s(t) chart, a formula section
- "Oldindan taxmin qil" prediction mode, 4 preset experiments, projector mode, fullscreen

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
    ├── main.tsx                     # entry point, fonts and KaTeX styles
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
    └── components/
        ├── Header.tsx               # top bar + hero
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
| Parallel component | `F∥ = mg sin α` |
| Perpendicular component | `F⊥ = mg cos α` |
| Normal reaction | `N = mg cos α` |
| Friction force | `F_ishq = μN = μmg cos α` |
| Net force (downward motion) | `F_net = mg sin α − μmg cos α` |
| Condition for motion | `mg sin α > μmg cos α  ⇔  tan α > μ` |
| Acceleration | `a = g(sin α − μ cos α)` |

- If `mg sin α ≤ μmg cos α`, the body stays at rest ("Jism tinch holatda"), `a = 0` and `F_net = 0`. The friction arrow then balances `mg sin α` exactly, because friction can never exceed `μN` and cannot push the body up the slope.
- If `mg sin α > μmg cos α`, the body moves down the slope ("Jism qiya tekislik bo‘ylab pastga harakatlanmoqda") with `a = g(sin α − μ cos α) > 0`.
- If the angle is lowered during motion and `a < 0`, the body slows down, stops exactly at `v = 0`, and never moves backwards.
- Motion is integrated with the exact constant-acceleration formulas at each step. The moment the body reaches the bottom (L = 10 m) is solved for exactly, so the final `t` matches `√(2L/a)`.
