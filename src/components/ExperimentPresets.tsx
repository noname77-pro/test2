import { PLANETS } from '../lib/physics'
import { PRESETS, type ExperimentPreset, type LabParams } from '../lib/presets'

interface ExperimentPresetsProps {
  current: LabParams
  onSelect: (preset: ExperimentPreset) => void
  compact?: boolean
}

const same = (a: LabParams, b: LabParams) =>
  a.angleDeg === b.angleDeg && a.mass === b.mass && a.mu === b.mu && a.planet === b.planet

export function ExperimentPresets({ current, onSelect, compact = false }: ExperimentPresetsProps) {
  return (
    <section className="card p-5" aria-labelledby="presets-title">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="presets-title" className="font-display text-lg font-semibold tracking-tight">
          Tayyor tajribalar
        </h2>
        <span className="eyebrow">{PRESETS.length} ta</span>
      </div>
      <div className={`grid gap-2.5 ${compact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-1'}`}>
        {PRESETS.map((p) => {
          const active = same(current, p.params)
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(p)}
              className={`group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border px-3.5 py-3 text-left transition-all ${
                active
                  ? 'border-lime/60 bg-lime/[0.09] shadow-[0_0_30px_-12px_rgba(188,211,87,0.8)]'
                  : 'border-white/[0.07] bg-white/[0.02] hover:border-lime/35 hover:bg-white/[0.04]'
              }`}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl font-mono text-sm font-semibold transition-colors ${
                  active ? 'bg-glow text-ink' : 'bg-white/[0.05] text-lime group-hover:bg-lime/15'
                }`}
              >
                0{p.index}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.95rem] font-semibold text-snow">
                  {p.index}-tajriba: {p.title}
                </span>
                {!compact && (
                  <span className="mt-0.5 block truncate font-mono text-xs text-fog">
                    α = {p.params.angleDeg}° · μ = {p.params.mu.toFixed(2)} · g ={' '}
                    {PLANETS[p.params.planet].g}
                  </span>
                )}
                <span className={`mt-0.5 block text-xs text-fog/90 ${compact ? 'truncate' : ''}`}>{p.description}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
