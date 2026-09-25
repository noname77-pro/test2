import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { SamplePoint } from '../hooks/useSimulation'
import { useElementWidth } from '../hooks/useElementWidth'
import { fmt } from '../lib/format'
import { PLANE_LENGTH, calculateAcceleration, timeToBottom, type PhysicsParams } from '../lib/physics'
import { ChevronIcon } from './ui/Icons'

type Metric = 'v' | 's'

interface GraphPanelProps {
  history: SamplePoint[]
  params: PhysicsParams
}

const METRICS: Record<Metric, { title: string; axis: string; unit: string }> = {
  v: { title: 'Tezlik grafigi v(t)', axis: 'v', unit: 'm/s' },
  s: { title: 'Yo‘l grafigi s(t)', axis: 's', unit: 'm' },
}

/** 1, 2, 2.5, 5 × 10ⁿ ko‘rinishidagi chiroyli qadam */
function niceStep(range: number, target = 5) {
  const raw = range / target
  const pow = 10 ** Math.floor(Math.log10(raw))
  const n = raw / pow
  const k = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
  return k * pow
}

function niceMax(v: number) {
  const step = niceStep(v)
  return Math.ceil(v / step) * step
}

export function GraphPanel({ history, params }: GraphPanelProps) {
  const [open, setOpen] = useState(true)
  const [metric, setMetric] = useState<Metric>('v')
  const [hover, setHover] = useState<number | null>(null)
  const [ref, width] = useElementWidth<HTMLDivElement>()

  const H = 260
  const W = Math.max(width, 280)
  const pad = { l: 52, r: 18, t: 30, b: 38 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b

  const last = history[history.length - 1]
  const tEnd = timeToBottom(params)
  const a0 = calculateAcceleration(params, 0)

  const { xMax, yMax } = useMemo(() => {
    const tSpan = Math.max(tEnd ?? 0, last.t, 1)
    const observedV = history.reduce((m, p) => Math.max(m, p.v), 0)
    const vSpan = Math.max(tEnd ? a0 * tEnd : 0, observedV, 1)
    return { xMax: niceMax(tSpan), yMax: metric === 'v' ? niceMax(vSpan) : PLANE_LENGTH }
  }, [tEnd, last.t, history, a0, metric])

  const x = (t: number) => pad.l + (t / xMax) * iw
  const y = (val: number) => pad.t + ih - (val / yMax) * ih

  const path = history.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)},${y(p[metric]).toFixed(1)}`).join(' ')
  const area = history.length > 1 ? `${path} L${x(last.t).toFixed(1)},${y(0)} L${x(0)},${y(0)} Z` : ''

  const xStep = niceStep(xMax)
  const yStep = niceStep(yMax, 4)
  const xTicks = Array.from({ length: Math.round(xMax / xStep) + 1 }, (_, i) => i * xStep)
  const yTicks = Array.from({ length: Math.round(yMax / yStep) + 1 }, (_, i) => i * yStep)

  const hovered = hover !== null ? history[hover] : null

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const t = ((e.clientX - rect.left) / rect.width) * xMax
    if (t > last.t + xStep * 0.25 || history.length < 2) return setHover(null)
    // Eng yaqin nuqtani ikkilik qidiruv bilan topamiz
    let lo = 0
    let hi = history.length - 1
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (history[mid].t < t) lo = mid
      else hi = mid
    }
    setHover(Math.abs(history[lo].t - t) < Math.abs(history[hi].t - t) ? lo : hi)
  }

  const m = METRICS[metric]

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="graph-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center gap-3 text-left"
        >
          <span className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.03]">
            <ChevronIcon className={`transition-transform ${open ? '' : '-rotate-90'}`} width={16} height={16} />
          </span>
          <span>
            <span className="eyebrow block">Jonli grafik</span>
            <span id="graph-title" className="font-display text-lg font-semibold tracking-tight">
              {m.title}
            </span>
          </span>
        </button>
        <div role="tablist" aria-label="Grafik turi" className="flex rounded-full border border-white/10 bg-ink/60 p-1">
          {(Object.keys(METRICS) as Metric[]).map((k) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={metric === k}
              onClick={() => {
                setMetric(k)
                setOpen(true)
              }}
              className={`rounded-full px-4 py-1.5 font-mono text-sm transition-colors ${
                metric === k ? 'bg-glow text-ink' : 'text-fog hover:text-snow'
              }`}
            >
              {k}(t)
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div ref={ref} className="relative mt-4">
              <svg width={W} height={H} className="block max-w-full" role="img" aria-label={m.title}>
                <defs>
                  <linearGradient id={`area-${metric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#BCD357" stopOpacity="0.28" />
                    <stop offset="1" stopColor="#BCD357" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {yTicks.map((v) => (
                  <g key={v}>
                    <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#FBFAFB" strokeOpacity={v === 0 ? 0.25 : 0.06} />
                    <text x={pad.l - 10} y={y(v)} textAnchor="end" dominantBaseline="central" fill="#9D9D9D" fontSize={11} className="font-mono">
                      {fmt(v, yStep % 1 ? 1 : 0)}
                    </text>
                  </g>
                ))}
                {xTicks.map((t) => (
                  <text key={t} x={x(t)} y={H - pad.b + 18} textAnchor="middle" fill="#9D9D9D" fontSize={11} className="font-mono">
                    {fmt(t, xStep % 1 ? 1 : 0)}
                  </text>
                ))}
                <text x={W - pad.r} y={H - 4} textAnchor="end" fill="#9D9D9D" fontSize={11} className="font-mono">
                  t, s
                </text>
                <text x={pad.l - 10} y={12} textAnchor="start" fill="#9D9D9D" fontSize={11} className="font-mono">
                  {m.axis}, {m.unit}
                </text>

                {area && <path d={area} fill={`url(#area-${metric})`} />}
                <path d={path} fill="none" stroke="#E9FD87" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                <circle cx={x(last.t)} cy={y(last[metric])} r={5} fill="#E9FD87" stroke="#010101" strokeWidth={2} />

                {hovered && (
                  <g pointerEvents="none">
                    <line x1={x(hovered.t)} x2={x(hovered.t)} y1={pad.t} y2={pad.t + ih} stroke="#FBFAFB" strokeOpacity={0.3} strokeDasharray="3 4" />
                    <circle cx={x(hovered.t)} cy={y(hovered[metric])} r={5} fill="#010101" stroke="#E9FD87" strokeWidth={2} />
                  </g>
                )}
                <rect
                  x={pad.l}
                  y={pad.t}
                  width={iw}
                  height={ih}
                  fill="transparent"
                  onPointerMove={onMove}
                  onPointerLeave={() => setHover(null)}
                />
              </svg>

              {hovered && (
                <div
                  className="pointer-events-none absolute top-2 rounded-xl border border-white/10 bg-ink-2/95 px-3 py-2 font-mono text-xs shadow-xl"
                  style={{
                    left: Math.min(Math.max(x(hovered.t) + 12, 0), W - 150),
                  }}
                >
                  <div className="text-fog">t = {fmt(hovered.t, 2)} s</div>
                  <div className="text-snow">v = {fmt(hovered.v, 2)} m/s</div>
                  <div className="text-snow">s = {fmt(hovered.s, 2)} m</div>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-fog">
              {metric === 'v'
                ? 'Tezlanish o‘zgarmas bo‘lgani uchun v(t) — to‘g‘ri chiziq; uning qiyaligi a ga teng.'
                : 'Tekis tezlanuvchan harakatda s(t) = at²/2 — parabola.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
