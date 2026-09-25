import { motion } from 'framer-motion'
import { Tex } from '../../components/ui/Tex'
import { SIMULATOR_URL } from '../config'
import { InclineDiagram } from '../InclineDiagram'
import { EASE, Emphasis, Reveal, SlideShell, T } from '../ui'
import type { SlideProps } from './types'

/* 12 — Interaktiv tajriba */
export function LabSlide() {
  return (
    <SlideShell number={12} eyebrow="Laboratoriya" title="Interaktiv tajriba">
      <div className="grid h-full grid-cols-[1fr_820px] items-center gap-16">
        <div>
          <Reveal show variant="blur" delay={0.3}>
            <p className="font-display text-[76px] leading-[1.02] font-bold tracking-[-0.03em]">
              Endi interaktiv <span className="text-glow">laboratoriyada</span> tekshiramiz.
            </p>
          </Reveal>
          <Reveal show variant="up" delay={0.5} className="mt-10 flex flex-wrap gap-4">
            {['α ni o‘zgartiring', 'μ ni o‘zgartiring', 'Oldindan taxmin qiling'].map((t) => (
              <span key={t} className="rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-[28px] text-snow/85">
                {t}
              </span>
            ))}
          </Reveal>
          <Reveal show variant="up" delay={0.7} className="mt-12">
            <button
              type="button"
              data-interactive
              className="btn btn-primary px-12 py-7 text-[34px]"
              onClick={() => window.open(SIMULATOR_URL, '_blank', 'noopener')}
            >
              Simulyatorni ochish
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </button>
          </Reveal>
        </div>

        {/* Stilize qilingan laboratoriya ekrani */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -12 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="card card-glow overflow-hidden p-4 [transform-style:preserve-3d]"
          style={{ perspective: 1200 }}
        >
          <div className="flex items-center gap-2 px-3 pb-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-3.5 rounded-full bg-white/15" />
            ))}
            <span className="ml-4 font-mono text-[18px] tracking-[0.2em] text-fog uppercase">Qiya tekislik laboratoriyasi</span>
          </div>
          <div className="h-[460px] rounded-2xl bg-ink/70">
            <InclineDiagram angle={30} camera="mid" vectors={{ mg: 'on', N: 'on', Fishq: 'on', Fx: 'on', Fy: 'on' }} sliding showAngle className="h-full w-full" />
          </div>
        </motion.div>
      </div>
    </SlideShell>
  )
}

/* 13 — Namunaviy masala */
const SOLUTION = [
  `${T.Fx} = mg\\sin\\alpha = 5\\cdot 9.81\\cdot 0.5 \\approx 24.53\\,\\text{N}`,
  `${T.N} = mg\\cos\\alpha = 5\\cdot 9.81\\cdot 0.866 \\approx 42.48\\,\\text{N}`,
  `${T.Fishq} = \\mu ${T.N} = 0.20\\cdot 42.48 \\approx 8.50\\,\\text{N}`,
  `F_{\\text{net}} = ${T.Fx} - ${T.Fishq} = 24.53 - 8.50 = 16.03\\,\\text{N}`,
  `a = \\dfrac{F_{\\text{net}}}{m} = \\dfrac{16.03}{5} \\approx 3.21\\,\\text{m/s}^2`,
]

export function ExampleSlide({ step }: SlideProps) {
  return (
    <SlideShell number={13} eyebrow="Masala yechamiz" title="Namunaviy masala">
      <div className="grid h-full grid-cols-[500px_1fr] gap-12">
        <div className="flex flex-col gap-6">
          <Reveal show variant="left" delay={0.25} className="card px-9 py-7">
            <div className="eyebrow">Berilgan</div>
            <div className="mt-3 space-y-1">
              {['m = 5\\,\\text{kg}', '\\alpha = 30^\\circ', '\\mu = 0.20', 'g = 9.81\\,\\text{m/s}^2'].map((g) => (
                <Tex key={g} math={g} className="block text-[42px]" />
              ))}
            </div>
            <div className="mt-5 flex items-baseline gap-5 border-t border-white/10 pt-4">
              <span className="eyebrow">Topish kerak</span>
              <Tex math="a = \,?" className="text-[42px] text-glow" />
            </div>
          </Reveal>
          <Emphasis show={step >= 6} className="card card-glow px-9 py-7">
            <div className="eyebrow">Javob</div>
            <Tex math="a \approx 3.21\,\text{m/s}^2" className="mt-2 block text-[60px] text-glow" />
          </Emphasis>
        </div>

        <div className="flex flex-col justify-center gap-4">
          {SOLUTION.map((line, i) => (
            <Reveal key={line} show={step >= i + 1} variant="left" className={`card flex items-center gap-7 px-8 ${i === 4 ? 'py-5' : 'py-6'}`}>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-lime/15 font-mono text-[24px] font-semibold text-glow">
                {i + 1}
              </span>
              <Tex math={line} className="text-[40px]" />
            </Reveal>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

/* 14 — Tezkor tekshiruv */
const QUIZ = [
  { q: 'F_x qanday aniqlanadi?', a: `${T.Fx} = mg\\sin\\alpha` },
  { q: 'F_y qanday aniqlanadi?', a: `${T.Fy} = mg\\cos\\alpha` },
  { q: 'N nimaga teng?', a: `${T.N} = ${T.Fy} = mg\\cos\\alpha` },
  { q: 'Ishqalanish kuchi formulasi?', a: `${T.Fishq} = \\mu N = \\mu mg\\cos\\alpha` },
  { q: 'Jismning sirpanish sharti?', a: '\\tan\\alpha > \\mu' },
  { q: 'Burchak ortsa F_x qanday o‘zgaradi?', a: '\\text{Ortadi, chunki } \\sin\\alpha \\text{ ortadi}' },
]

/** Savol matnidagi F_x / F_y ni formula ko‘rinishida chiqarish */
function QuestionText({ text }: { text: string }) {
  const parts = text.split(/(F_x|F_y)/)
  return (
    <>
      {parts.map((p, i) =>
        p === 'F_x' ? <Tex key={i} math={T.Fx} /> : p === 'F_y' ? <Tex key={i} math={T.Fy} /> : <span key={i}>{p}</span>,
      )}
    </>
  )
}

export function QuizSlide({ step }: SlideProps) {
  return (
    <SlideShell number={14} eyebrow="O‘zingizni tekshiring" title="Tezkor tekshiruv">
      <div className="flex h-full flex-col justify-between">
        {QUIZ.map((item, i) => (
          <Reveal
            key={item.q}
            show={step >= i * 2}
            variant="up"
            className={`card flex h-[104px] items-center justify-between gap-8 px-9 transition-shadow duration-500 ${
              step === i * 2 ? 'card-glow' : ''
            }`}
          >
            <div className="flex items-center gap-7">
              <span className="font-mono text-[26px] text-lime">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-[36px] font-semibold">
                <QuestionText text={item.q} />
              </span>
            </div>
            <Reveal show={step >= i * 2 + 1} variant="zoom" duration={0.5}>
              <Tex math={item.a} className="text-[42px] text-glow" />
            </Reveal>
          </Reveal>
        ))}
      </div>
    </SlideShell>
  )
}

/* 15 — Xulosa */
interface MapNode {
  id: string
  x: number
  y: number
  tex: string
  step: number
  accent?: boolean
}

const NODES: MapNode[] = [
  { id: 'mg', x: 840, y: 45, tex: T.mg, step: 0 },
  { id: 'fx', x: 420, y: 195, tex: `${T.Fx} = mg\\sin\\alpha`, step: 1 },
  { id: 'fy', x: 1260, y: 195, tex: `${T.Fy} = mg\\cos\\alpha`, step: 1 },
  { id: 'n', x: 1260, y: 345, tex: `${T.N} = ${T.Fy}`, step: 2 },
  { id: 'fr', x: 1260, y: 495, tex: `${T.Fishq} = \\mu ${T.N}`, step: 3 },
  { id: 'cmp', x: 420, y: 495, tex: `${T.Fx} > ${T.Fishq}`, step: 4 },
  { id: 'res', x: 420, y: 645, tex: '\\text{jism sirpanadi}', step: 4, accent: true },
]

const EDGES = [
  { d: 'M 770 80 L 520 155', step: 1 },
  { d: 'M 910 80 L 1160 155', step: 1 },
  { d: 'M 1260 240 L 1260 300', step: 2 },
  { d: 'M 1260 390 L 1260 450', step: 3 },
  { d: 'M 420 240 L 420 450', step: 4 },
  { d: 'M 1098 495 L 574 495', step: 4 },
  { d: 'M 420 540 L 420 600', step: 4 },
]

const FINAL = [`${T.Fx} = mg\\sin\\alpha`, `${T.Fishq} = \\mu mg\\cos\\alpha`, 'a = g(\\sin\\alpha - \\mu\\cos\\alpha)']

export function SummarySlide({ step }: SlideProps) {
  const mapVisible = step <= 4
  return (
    <SlideShell number={15} eyebrow="Yakun" title="Xulosa">
      <motion.div
        className="absolute inset-0"
        animate={mapVisible ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1680 730" aria-hidden="true">
          <defs>
            <marker id="map-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#BCD357" />
            </marker>
          </defs>
          {EDGES.map((e) => (
            <motion.path
              key={e.d}
              d={e.d}
              stroke="#BCD357"
              strokeOpacity={0.7}
              strokeWidth={3}
              fill="none"
              markerEnd="url(#map-arrow)"
              initial={false}
              animate={{ pathLength: step >= e.step ? 1 : 0, opacity: step >= e.step ? 1 : 0 }}
              transition={{ duration: 0.6, delay: step >= e.step ? 0.15 : 0, ease: EASE }}
            />
          ))}
        </svg>
        {NODES.map((n) => (
          <Reveal
            key={n.id}
            show={step >= n.step}
            variant="zoom"
            delay={n.id === 'res' ? 0.35 : 0.05}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-3xl border px-8 py-4 whitespace-nowrap ${
              n.accent ? 'border-lime bg-lime text-ink shadow-[0_0_40px_-6px_rgba(188,211,87,0.9)]' : 'card'
            }`}
            style={{ left: n.x, top: n.y }}
          >
            <Tex math={n.tex} className={`text-[42px] ${n.accent ? 'font-bold' : ''}`} />
          </Reveal>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6">
        {FINAL.map((f, i) => (
          <Reveal key={f} show={step >= 5} variant="zoom" delay={0.3 + i * 0.18} className={`card px-14 py-5 ${i === 2 ? 'card-glow' : ''}`}>
            <Tex math={f} className={`text-[76px] ${i === 2 ? 'text-glow' : ''}`} />
          </Reveal>
        ))}
        <Reveal show={step >= 6} variant="blur" className="mt-6 font-display text-[46px] font-semibold text-snow/90 italic">
          «Fizikani ko‘rish — uni tushunishning eng yaxshi yo‘li.»
        </Reveal>
      </div>
    </SlideShell>
  )
}
