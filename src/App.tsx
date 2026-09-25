import { useMotionValueEvent, useSpring } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ControlPanel } from './components/ControlPanel'
import { ExperimentPresets } from './components/ExperimentPresets'
import { ExplanationSection } from './components/ExplanationSection'
import { FormulaPanel } from './components/FormulaPanel'
import { GraphPanel } from './components/GraphPanel'
import { Hero, TopBar } from './components/Header'
import { PhysicsPanel } from './components/PhysicsPanel'
import { PredictionMode, type Prediction } from './components/PredictionMode'
import { ProjectorBadge, ProjectorToggle, useProjectorMode } from './components/ProjectorMode'
import type { VectorVisibility } from './components/SimulationCanvas'
import { SimulationStage } from './components/SimulationStage'
import { StatusCard } from './components/StatusCard'
import { CollapseIcon, ExpandIcon, HomeIcon } from './components/ui/Icons'
import { useFullscreen } from './hooks/useFullscreen'
import { useSimulation } from './hooks/useSimulation'
import { PLANETS, summarizeForces, type PhysicsParams } from './lib/physics'
import { DEFAULT_PARAMS, type ExperimentPreset, type LabParams } from './lib/presets'

const ALL_VECTORS: VectorVisibility = { weight: true, normal: true, friction: true, components: true }

export default function App() {
  const [lab, setLab] = useState<LabParams>(DEFAULT_PARAMS)
  const [visibility, setVisibility] = useState<VectorVisibility>(ALL_VECTORS)
  const [projector, setProjector] = useProjectorMode()
  const fullscreen = useFullscreen()

  const [predictEnabled, setPredictEnabled] = useState(true)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const params: PhysicsParams = useMemo(
    () => ({ angleDeg: lab.angleDeg, mass: lab.mass, muS: lab.muS, muK: lab.muK, g: PLANETS[lab.planet].g }),
    [lab],
  )

  const sim = useSimulation(params)
  const { status, snapshot } = sim
  const moving = snapshot.v > 1e-6
  const forces = useMemo(() => summarizeForces(params, snapshot.v), [params, snapshot.v])

  // Burchak o‘zgarishi (ayniqsa tayyor tajribalarda) sahnada silliq ko‘rinishi uchun prujina
  const angleSpring = useSpring(lab.angleDeg, { stiffness: 170, damping: 26 })
  const [displayAngle, setDisplayAngle] = useState(lab.angleDeg)
  useMotionValueEvent(angleSpring, 'change', setDisplayAngle)
  useEffect(() => {
    // Simulyatsiya ishlayotganda sahna fizikadan orqada qolmasligi kerak
    if (status === 'running') angleSpring.jump(lab.angleDeg)
    else angleSpring.set(lab.angleDeg)
  }, [lab.angleDeg, angleSpring, status])

  const hideHints = predictEnabled && prediction === null && status === 'idle'

  const updateLab = useCallback((patch: Partial<LabParams>) => setLab((l) => ({ ...l, ...patch })), [])

  const resetMotion = useCallback(() => {
    sim.reset()
    setPrediction(null)
  }, [sim])

  const resetAll = useCallback(() => {
    resetMotion()
    setLab(DEFAULT_PARAMS)
    setVisibility(ALL_VECTORS)
    sim.setSpeed(1)
  }, [resetMotion, sim])

  const selectPreset = useCallback(
    (p: ExperimentPreset) => {
      resetMotion()
      setLab(p.params)
    },
    [resetMotion],
  )

  const predict = useCallback(
    (guess: boolean) => {
      const answer = forces.slides
      setPrediction({ guess, answer, tanAlpha: forces.tanAlpha, muS: params.muS })
      setScore((s) => ({ correct: s.correct + (guess === answer ? 1 : 0), total: s.total + 1 }))
      sim.start()
    },
    [forces.slides, forces.tanAlpha, params.muS, sim],
  )

  const toggleRun = useCallback(() => {
    if (status === 'running') sim.pause()
    else sim.start()
  }, [status, sim])

  // O‘qituvchi uchun klaviatura yorliqlari
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (e.metaKey || e.ctrlKey || e.altKey || el.closest('textarea, input:not([type="range"])')) return
      const key = e.key.toLowerCase()
      if (key === ' ') {
        // Fokusdagi tugma probelni o‘zi qayta ishlaydi
        if (el.closest('button, [role="switch"], [role="checkbox"], [role="tab"]')) return
        e.preventDefault()
        toggleRun()
      } else if (key === 'r') resetMotion()
      else if (key === 'p') setProjector((p) => !p)
      else if (key === 'f') fullscreen.toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleRun, resetMotion, setProjector, fullscreen])

  const statusCard = (
    <StatusCard
      status={status}
      forces={forces}
      v={snapshot.v}
      t={snapshot.t}
      a={snapshot.a}
      hidden={hideHints}
      large={projector}
    />
  )

  const predictionCard = (
    <PredictionMode
      enabled={predictEnabled}
      onToggle={(on) => {
        setPredictEnabled(on)
        setPrediction(null)
      }}
      prediction={prediction}
      canPredict={status === 'idle'}
      onPredict={predict}
      onRetry={resetMotion}
      score={score}
    />
  )

  return (
    <div className="relative min-h-screen">
      {/* Fon qatlamlari */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-lime/[0.07] blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-olive/[0.08] blur-[120px]" />
        <div className="bg-noise absolute -inset-[20%]" />
      </div>

      <TopBar
        actions={
          <>
            <ProjectorToggle enabled={projector} onToggle={() => setProjector((p) => !p)} />
            {fullscreen.supported && (
              <button type="button" className="btn btn-ghost" onClick={fullscreen.toggle} aria-pressed={fullscreen.isFullscreen} title="To‘liq ekran (F)">
                {fullscreen.isFullscreen ? <CollapseIcon width={17} height={17} /> : <ExpandIcon width={17} height={17} />}
                <span className="hidden sm:inline">To‘liq ekran</span>
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={resetAll} title="Boshlang‘ich holat">
              <HomeIcon width={17} height={17} />
              <span className="hidden lg:inline">Boshlang‘ich holat</span>
            </button>
          </>
        }
      />

      <main className="mx-auto max-w-[1760px] px-4 pb-16 sm:px-6 lg:px-10">
        {!projector && (
          <Hero
            angle={lab.angleDeg}
            acceleration={forces.slides ? forces.kineticAcceleration : 0}
            g={params.g}
            planetName={PLANETS[lab.planet].name}
            hidden={hideHints}
          />
        )}

        <div className={`lab-grid ${projector ? 'pt-6' : ''}`}>
          <div className="[grid-area:sim] min-w-0">
            <SimulationStage
              params={params}
              displayAngle={displayAngle}
              status={status}
              t={snapshot.t}
              v={snapshot.v}
              s={snapshot.s}
              a={snapshot.a}
              visibility={visibility}
              onVisibilityChange={setVisibility}
              speed={sim.speed}
              onSpeedChange={sim.setSpeed}
              projector={projector}
              hideHints={hideHints}
            />
          </div>
          <div className="[grid-area:status] min-w-0">{statusCard}</div>
          <div className="[grid-area:predict] min-w-0">{predictionCard}</div>
          <div className="[grid-area:controls] min-w-0">
            <ControlPanel
              params={lab}
              onChange={updateLab}
              status={status}
              onStart={sim.start}
              onPause={sim.pause}
              onReset={resetMotion}
              compact={projector}
            />
          </div>
          <div className="[grid-area:physics] min-w-0">
            <PhysicsPanel
              params={params}
              forces={forces}
              snapshot={snapshot}
              moving={moving}
              hideVerdict={hideHints}
              compact={projector}
            />
          </div>
          <div className="[grid-area:presets] min-w-0">
            <ExperimentPresets current={lab} onSelect={selectPreset} compact={projector} />
          </div>
        </div>

        <div id="grafik" className="mt-4 scroll-mt-24">
          <GraphPanel history={sim.history} params={params} />
        </div>

        {!projector && (
          <>
            <div id="formulalar" className="mt-24 scroll-mt-24">
              <FormulaPanel />
            </div>
            <div id="tushuntirish" className="mt-16 scroll-mt-24">
              <ExplanationSection />
            </div>
            <footer className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 text-sm text-fog sm:flex-row sm:items-center">
              <span>Qiya tekislik laboratoriyasi · Mexanika bo‘limi uchun interaktiv dars vositasi</span>
              <span className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
                <span><kbd className="text-snow">Probel</kbd> boshlash/to‘xtatish</span>
                <span><kbd className="text-snow">R</kbd> qayta boshlash</span>
                <span><kbd className="text-snow">P</kbd> proyektor</span>
                <span><kbd className="text-snow">F</kbd> to‘liq ekran</span>
              </span>
            </footer>
          </>
        )}
      </main>

      <ProjectorBadge enabled={projector} onExit={() => setProjector(false)} />
    </div>
  )
}
