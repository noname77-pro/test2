import { LIMITS, PLANETS, type PlanetId } from '../lib/physics'
import type { LabParams } from '../lib/presets'
import type { SimStatus } from '../hooks/useSimulation'
import { Dropdown } from './ui/Dropdown'
import { PauseIcon, PlayIcon, ResetIcon } from './ui/Icons'
import { Slider } from './ui/Slider'

interface ControlPanelProps {
  params: LabParams
  onChange: (patch: Partial<LabParams>) => void
  status: SimStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
  compact?: boolean
}

const planetOptions = (Object.keys(PLANETS) as PlanetId[]).map((id) => ({
  value: id,
  label: PLANETS[id].name,
  meta: `${PLANETS[id].g} m/s²`,
}))

export function SimButtons({
  status,
  onStart,
  onPause,
  onReset,
}: Pick<ControlPanelProps, 'status' | 'onStart' | 'onPause' | 'onReset'>) {
  const running = status === 'running'
  return (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" className="btn btn-primary" onClick={onStart} disabled={running}>
        <PlayIcon width={16} height={16} />
        Boshlash
      </button>
      <button type="button" className="btn btn-ghost" onClick={onPause} disabled={!running}>
        <PauseIcon width={16} height={16} />
        To‘xtatish
      </button>
      <button type="button" className="btn btn-ghost col-span-2" onClick={onReset} title="Qayta boshlash (R)">
        <ResetIcon width={16} height={16} />
        Qayta boshlash
      </button>
    </div>
  )
}

export function ControlPanel({ params, onChange, status, onStart, onPause, onReset, compact = false }: ControlPanelProps) {
  return (
    <section className="card p-5" aria-labelledby="controls-title">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="controls-title" className="font-display text-lg font-semibold tracking-tight">
          Boshqaruv paneli
        </h2>
        <span className="eyebrow">Parametrlar</span>
      </div>

      <div className={compact ? 'grid gap-3 sm:grid-cols-2' : 'space-y-3'}>
        <Slider
          id="angle"
          title="Qiyalik burchagi"
          symbol="α"
          value={params.angleDeg}
          {...LIMITS.angle}
          digits={0}
          unit="°"
          onChange={(angleDeg) => onChange({ angleDeg })}
        />
        <Slider
          id="mass"
          title="Massa"
          symbol="m"
          value={params.mass}
          {...LIMITS.mass}
          digits={1}
          unit="kg"
          onChange={(mass) => onChange({ mass })}
        />
        <Slider
          id="mu"
          title="Ishqalanish koeffitsienti"
          symbol="μ"
          value={params.mu}
          {...LIMITS.mu}
          onChange={(mu) => onChange({ mu })}
        />

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 sm:col-span-full">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-medium text-fog">Gravitatsiya</span>
            <span className="font-mono text-sm text-lime">g</span>
          </div>
          <Dropdown
            label="Gravitatsiya"
            value={params.planet}
            options={planetOptions}
            onChange={(planet) => onChange({ planet })}
          />
        </div>
      </div>

      <div className="mt-5">
        <SimButtons status={status} onStart={onStart} onPause={onPause} onReset={onReset} />
      </div>
    </section>
  )
}
