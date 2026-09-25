import type { SimSnapshot } from '../hooks/useSimulation'
import { fmt } from '../lib/format'
import type { ForceSummary, PhysicsParams } from '../lib/physics'
import { AnimatedNumber } from './ui/AnimatedNumber'
import { Tex } from './ui/Tex'

interface PhysicsPanelProps {
  params: PhysicsParams
  forces: ForceSummary
  snapshot: SimSnapshot
  moving: boolean
  hideVerdict?: boolean
  compact?: boolean
}

interface Row {
  tex: string
  value: number
  unit: string
  accent?: string
  /** Taxmin rejimida javobni oshkor qilmaslik uchun qiymat yashiriladi */
  secret?: boolean
}

export function PhysicsPanel({ params, forces, snapshot, moving, hideVerdict = false, compact = false }: PhysicsPanelProps) {
  // Tinch holatda F_net = 0; harakatda (yoki tan α > μ bo‘lganda) a = g(sin α − μ cos α)
  const sliding = moving || forces.slides
  const acceleration = moving ? snapshot.a : forces.slides ? forces.acceleration : 0
  const netForce = params.mass * acceleration

  const rows: Row[] = [
    { tex: 'P = mg', value: forces.weight, unit: 'N', accent: 'bg-snow' },
    { tex: 'F_{\\parallel} = mg\\sin\\alpha', value: forces.parallel, unit: 'N', accent: 'bg-amber' },
    { tex: 'F_{\\perp} = mg\\cos\\alpha', value: forces.perpendicular, unit: 'N', accent: 'bg-periwinkle' },
    { tex: 'N = mg\\cos\\alpha', value: forces.normal, unit: 'N', accent: 'bg-lime' },
    { tex: 'F_{\\text{ishq}} = \\mu N', value: forces.slidingFriction, unit: 'N', accent: 'bg-coral' },
    {
      tex: hideVerdict
        ? 'F_{\\text{net}}'
        : sliding
          ? 'F_{\\text{net}} = mg\\sin\\alpha - \\mu mg\\cos\\alpha'
          : 'F_{\\text{net}} = 0',
      value: netForce,
      unit: 'N',
      accent: 'bg-glow',
      secret: hideVerdict,
    },
  ]

  return (
    <section className="card p-5" aria-labelledby="physics-title">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="physics-title" className="font-display text-lg font-semibold tracking-tight">
          Fizik kattaliklar
        </h2>
        <span className="flex items-center gap-2 eyebrow">
          <span className="size-1.5 animate-pulse-soft rounded-full bg-glow" />
          Jonli
        </span>
      </div>

      {/* Jonli harakat ko‘rsatkichlari */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          { k: 't', v: snapshot.t, u: 's' },
          { k: 'v', v: snapshot.v, u: 'm/s' },
          { k: 's', v: snapshot.s, u: 'm' },
        ].map((it) => (
          <div key={it.k} className="rounded-2xl border border-lime/15 bg-lime/[0.04] px-3 py-2.5">
            <div className="font-mono text-xs text-fog">
              <span className="italic text-lime">{it.k}</span>, {it.u}
            </div>
            <div className={`tabular font-mono font-semibold text-snow ${compact ? 'text-2xl' : 'text-[1.6rem] leading-tight'}`}>
              {fmt(it.v, 2)}
            </div>
          </div>
        ))}
      </div>

      <dl className="divide-y divide-white/[0.06]">
        {rows.map((r) => (
          <div key={r.accent} className="flex items-center justify-between gap-3 py-2.5">
            <dt className="flex min-w-0 items-center gap-2.5 text-snow/90">
              <span className={`h-4 w-1 shrink-0 rounded-full ${r.accent}`} />
              <Tex math={r.tex} />
            </dt>
            <dd className="shrink-0 font-mono text-base">
              {r.secret ? (
                <span className="font-semibold text-fog">?</span>
              ) : (
                <AnimatedNumber value={r.value} className="tabular font-semibold text-snow" />
              )}
              <span className="ml-1 text-sm text-fog">{r.unit}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 rounded-2xl border border-lime/25 bg-gradient-to-br from-lime/[0.09] to-transparent p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow">Tezlanish</span>
          {!hideVerdict && (
            <span className="font-mono text-xs text-fog">{sliding ? 'pastga harakat' : 'tinch holat'}</span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-snow/90">
            {hideVerdict ? <Tex math="a = \,?" /> : sliding ? <Tex math="a = g(\sin\alpha - \mu\cos\alpha)" /> : <Tex math="a = 0" />}
          </span>
          <span className="font-mono">
            {hideVerdict ? (
              <span className="text-2xl font-semibold text-fog">?</span>
            ) : (
              <>
                <AnimatedNumber value={acceleration} className="tabular text-2xl font-semibold text-glow" />
                <span className="ml-1 text-sm text-fog">m/s²</span>
              </>
            )}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-sm">
        <div className="rounded-xl bg-white/[0.03] px-3 py-2">
          <span className="text-fog">tan α = </span>
          <span className="tabular text-snow">{fmt(forces.tanAlpha, 3)}</span>
        </div>
        <div className="rounded-xl bg-white/[0.03] px-3 py-2">
          <span className="text-fog">g = </span>
          <span className="tabular text-snow">{fmt(params.g, 2)}</span>
          <span className="text-fog"> m/s²</span>
        </div>
      </div>
    </section>
  )
}
