import type { SimStatus } from '../hooks/useSimulation'
import { useElementWidth } from '../hooks/useElementWidth'
import { fmt } from '../lib/format'
import type { PhysicsParams } from '../lib/physics'
import { SimulationCanvas, VECTOR_COLORS, type VectorVisibility } from './SimulationCanvas'
import { CheckIcon } from './ui/Icons'

interface SimulationStageProps {
  params: PhysicsParams
  displayAngle: number
  status: SimStatus
  t: number
  v: number
  s: number
  a: number
  visibility: VectorVisibility
  onVisibilityChange: (v: VectorVisibility) => void
  speed: number
  onSpeedChange: (s: number) => void
  projector: boolean
  hideHints: boolean
}

const TOGGLES: { key: keyof VectorVisibility; label: string; colors: string[] }[] = [
  { key: 'weight', label: 'Og‘irlik kuchi', colors: [VECTOR_COLORS.weight] },
  { key: 'normal', label: 'Normal reaksiya', colors: [VECTOR_COLORS.normal] },
  { key: 'friction', label: 'Ishqalanish', colors: [VECTOR_COLORS.friction] },
  { key: 'components', label: 'Tashkil etuvchilar', colors: [VECTOR_COLORS.parallel, VECTOR_COLORS.perpendicular] },
]

const SPEEDS = [0.25, 0.5, 1]

const STATUS_LABEL: Record<SimStatus, string> = {
  idle: 'Tayyor',
  running: 'Ishlamoqda',
  paused: 'Pauza',
  finished: 'Yakunlandi',
}

export function SimulationStage(props: SimulationStageProps) {
  const { status, t, v, s, a, visibility, onVisibilityChange, speed, onSpeedChange, projector, hideHints } = props
  const [ref, width] = useElementWidth<HTMLDivElement>()

  const hud = [
    { k: 't', value: fmt(t, 2), unit: 's' },
    { k: 'v', value: fmt(v, 2), unit: 'm/s' },
    { k: 's', value: fmt(s, 2), unit: 'm' },
    { k: 'a', value: hideHints ? '?' : fmt(a, 2), unit: 'm/s²' },
  ]

  return (
    <section id="simulyatsiya" className="card card-glow overflow-hidden" aria-labelledby="sim-title">
      {/* Sahna foni: nozik to‘r */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_85%)]" />

      <div className="relative flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="eyebrow">Simulyatsiya</span>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs ${
              status === 'running' ? 'border-lime/50 bg-lime/10 text-glow' : 'border-white/10 bg-white/[0.03] text-fog'
            }`}
          >
            <span className={`size-1.5 rounded-full ${status === 'running' ? 'animate-pulse-soft bg-glow' : 'bg-fog'}`} />
            {STATUS_LABEL[status]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-fog">Tezlik</span>
          <div className="flex rounded-full border border-white/10 bg-ink/60 p-0.5" role="group" aria-label="Simulyatsiya tezligi">
            {SPEEDS.map((sp) => (
              <button
                key={sp}
                type="button"
                aria-pressed={speed === sp}
                onClick={() => onSpeedChange(sp)}
                className={`rounded-full px-2.5 py-1 font-mono text-xs transition-colors ${
                  speed === sp ? 'bg-lime text-ink' : 'text-fog hover:text-snow'
                }`}
              >
                {sp}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <h2 id="sim-title" className="sr-only">
        Qiya tekislikdagi jism simulyatsiyasi
      </h2>

      {/* HUD: asosiy kattaliklar */}
      <div className="relative grid grid-cols-2 gap-2 px-5 pt-4 sm:grid-cols-4 sm:px-6">
        {hud.map((h) => (
          <div key={h.k} className="rounded-2xl border border-white/[0.06] bg-ink/50 px-3 py-2 backdrop-blur">
            <div className="font-mono text-[0.7rem] text-fog">
              <span className="text-lime italic">{h.k}</span> · {h.unit}
            </div>
            <div className={`tabular font-mono font-semibold text-snow ${projector ? 'text-3xl' : 'text-xl sm:text-2xl'}`}>
              {h.value}
            </div>
          </div>
        ))}
      </div>

      <div ref={ref} className="relative px-1 pt-2 pb-1 sm:px-4">
        <SimulationCanvas
          params={props.params}
          displayAngle={props.displayAngle}
          s={s}
          v={v}
          visibility={visibility}
          width={width}
          projector={projector}
          hideHints={hideHints}
        />
      </div>

      <div className="relative flex flex-wrap items-center gap-2 border-t border-white/[0.06] px-5 py-4 sm:px-6">
        <span className="mr-1 font-mono text-xs text-fog">Vektorlar:</span>
        {TOGGLES.map((tg) => {
          const on = visibility[tg.key]
          return (
            <button
              key={tg.key}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => onVisibilityChange({ ...visibility, [tg.key]: !on })}
              className={`inline-flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-1.5 text-sm transition-all ${
                on ? 'border-white/15 bg-white/[0.05] text-snow' : 'border-white/[0.06] text-fog/70 hover:text-fog'
              }`}
            >
              <span
                className={`grid size-5 place-items-center rounded-full border transition-colors ${
                  on ? 'border-lime bg-lime text-ink' : 'border-white/20'
                }`}
              >
                {on && <CheckIcon width={12} height={12} strokeWidth={3} />}
              </span>
              {tg.label}
              <span className="flex gap-1">
                {tg.colors.map((c) => (
                  <span key={c} className="h-[3px] w-4 rounded-full" style={{ background: c, opacity: on ? 1 : 0.35 }} />
                ))}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
