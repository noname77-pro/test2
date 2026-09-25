import { VECTOR_COLORS } from './SimulationCanvas'

const POINTS = [
  { color: VECTOR_COLORS.weight, title: 'Og‘irlik kuchi', text: 'Og‘irlik kuchi mg vertikal pastga yo‘naladi.' },
  {
    color: VECTOR_COLORS.parallel,
    title: 'Ikki tashkil etuvchi',
    text: 'Qiya tekislikda u ikki tashkil etuvchiga ajratiladi: F_x = mg sin α jismni qiya tekislik bo‘ylab harakatlantiradi.',
  },
  { color: VECTOR_COLORS.perpendicular, title: 'Tayanchga bosim', text: 'F_y = mg cos α esa jismni tayanchga bosadi va N bilan muvozanatlashadi.' },
  { color: VECTOR_COLORS.friction, title: 'Ishqalanish', text: 'Ishqalanish kuchi harakatga (yoki harakatga intilishga) qarshi yo‘naladi.' },
]

export function ExplanationSection() {
  return (
    <section className="card overflow-hidden p-6 sm:p-10" aria-labelledby="explain-title">
      <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-lime/[0.07] blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
        <div>
          <span className="eyebrow">Xulosa</span>
          <h2 id="explain-title" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Nima sodir bo‘lmoqda?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-snow/80">
            Og‘irlik kuchi vertikal pastga yo‘naladi. Qiya tekislikda u ikki tashkil etuvchiga ajratiladi.{' '}
            <span className="text-amber">F_x = mg sin α</span> jismni qiya tekislik bo‘ylab harakatlantiradi,{' '}
            <span className="text-periwinkle">F_y = mg cos α</span> esa tayanchga bosadi. Ishqalanish kuchi harakatga qarshi
            yo‘naladi.
          </p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {POINTS.map((p, i) => (
            <li key={p.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <span className="h-1 w-8 rounded-full" style={{ background: p.color }} />
                <span className="font-mono text-xs text-graphite">0{i + 1}</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-fog">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
