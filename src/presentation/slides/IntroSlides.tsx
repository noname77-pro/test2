import { motion } from 'framer-motion'
import { Tex } from '../../components/ui/Tex'
import { InclineDiagram } from '../InclineDiagram'
import { ExampleIcon, LiftScene, type ExampleKind } from '../illustrations'
import { EASE, Reveal, SlideShell, T } from '../ui'
import type { SlideProps } from './types'

/* 1 — Titul */
export function TitleSlide() {
  return (
    <div className="absolute inset-0">
      <div className="absolute right-[40px] bottom-[96px] h-[720px] w-[1280px]">
        <InclineDiagram angle={30} camera={{ x: 0, y: 180, w: 1280, h: 720 }} drawIn sliding showAngle className="h-full w-full" />
      </div>

      <div className="absolute top-[120px] left-[120px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-3 rounded-full border border-lime/35 bg-lime/[0.07] px-6 py-2.5 font-mono text-[20px] tracking-wide text-glow"
        >
          <span className="size-2.5 animate-pulse-soft rounded-full bg-glow shadow-[0_0_12px_#E9FD87]" />
          Ochiq dars · Fizika
        </motion.div>

        <h1 className="mt-10 font-display text-[124px] leading-[0.9] font-bold tracking-[-0.045em]">
          {['Jismning qiya', 'tekislikdagi'].map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: EASE }}
            >
              {line}
            </motion.span>
          ))}
          <motion.span
            className="block bg-gradient-to-r from-glow via-lime to-olive bg-clip-text pb-2 text-transparent"
            initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.39, ease: EASE }}
          >
            harakati
          </motion.span>
        </h1>

        <div className="relative mt-8 h-px w-[760px] overflow-hidden bg-gradient-to-r from-lime/60 via-lime/15 to-transparent">
          <span className="absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-glow to-transparent" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          className="mt-8 text-[34px] text-fog"
        >
          Mexanika • Kuchlar • Ishqalanish • Nyutonning II qonuni
        </motion.p>
      </div>
    </div>
  )
}

/* 2 — O‘tilgan mavzuni eslaymiz */
const RECALL = [
  { q: 'Nyutonning II qonuni qanday yoziladi?', a: 'F = ma' },
  { q: 'Og‘irlik kuchi qanday aniqlanadi?', a: 'P = mg' },
  { q: 'Ishqalanish kuchi qanday topiladi?', a: `${T.Fishq} = \\mu N` },
  { q: 'Teng ta’sir etuvchi kuch nima?', a: '\\vec F = \\vec F_1 + \\vec F_2 + \\ldots', note: 'barcha kuchlarning vektor yig‘indisi' },
]

export function RecallSlide({ step }: SlideProps) {
  const answers = step >= 4
  return (
    <SlideShell number={2} eyebrow="Takrorlash" title="O‘tilgan mavzuni eslaymiz">
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-7">
        {RECALL.map((r, i) => (
          <Reveal key={r.q} show={step >= i} variant="up" className="card flex flex-col justify-between p-10">
            <div className="flex items-start gap-6">
              <span className="font-mono text-[26px] text-lime">{String(i + 1).padStart(2, '0')}</span>
              <p className="font-display text-[42px] leading-[1.15] font-semibold">{r.q}</p>
            </div>
            <Reveal show={answers} variant="zoom" delay={i * 0.12} className="pl-[62px]">
              <Tex math={r.a} className="text-[60px] text-glow" />
              {r.note && <div className="mt-1 text-[26px] text-fog">{r.note}</div>}
            </Reveal>
          </Reveal>
        ))}
      </div>
    </SlideShell>
  )
}

/* 3 — Muammoli vaziyat */
export function ProblemSlide({ step }: SlideProps) {
  return (
    <SlideShell number={3} eyebrow="Savol" title="Muammoli vaziyat">
      <div className="grid h-[470px] grid-cols-2 gap-8">
        {(['vertical', 'ramp'] as const).map((mode, i) => (
          <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: EASE }}
            className={`card relative overflow-hidden px-8 pt-6 pb-2 ${step >= 2 && mode === 'ramp' ? 'card-glow' : ''}`}
          >
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-lime/15 font-display text-[26px] font-bold text-glow">
                {i === 0 ? 'A' : 'B'}
              </span>
              <span className="font-display text-[36px] font-semibold">
                {i === 0 ? 'Yukni tik ko‘tarish' : 'Yukni qiya tekislik bo‘ylab ko‘tarish'}
              </span>
            </div>
            <div className="h-[370px]">
              <LiftScene mode={mode} showForce={step >= 2} />
            </div>
          </motion.div>
        ))}
      </div>

      <Reveal show={step >= 1} variant="blur" className="mt-10 text-center">
        <p className="font-display text-[54px] leading-[1.12] font-bold tracking-tight">
          Nima uchun qiya tekislikdan foydalanilganda
          <br />
          yukni ko‘tarish <span className="text-glow">osonroq</span>?
        </p>
      </Reveal>

      <Reveal show={step >= 2} variant="up" className="mt-6 flex justify-center">
        <div className="rounded-full border border-lime/40 bg-lime/[0.08] px-10 py-4 text-[32px]">
          Og‘irlik kuchining faqat bir qismini yengamiz — <span className="text-glow">kuch kamayadi</span>, yo‘l esa uzayadi
        </div>
      </Reveal>
    </SlideShell>
  )
}

/* 4 — Qiya tekislik nima? */
const EXAMPLES: { kind: ExampleKind; label: string }[] = [
  { kind: 'ramp', label: 'Pandus' },
  { kind: 'mountain', label: 'Tog‘ yo‘li' },
  { kind: 'loading', label: 'Yuk ortish rampasi' },
  { kind: 'slide', label: 'Sirpanchiq' },
]

export function DefinitionSlide({ step }: SlideProps) {
  return (
    <SlideShell number={4} eyebrow="Tushuncha" title="Qiya tekislik nima?">
      <div className="grid grid-cols-[1040px_1fr] items-center gap-12">
        <div className="h-[585px]">
          <InclineDiagram angle={30} camera={{ x: 180, y: 160, w: 1200, h: 675 }} showBlock={false} drawIn showAngle={step >= 1} className="h-full w-full" />
        </div>
        <div>
          <Reveal show variant="blur" delay={0.4}>
            <p className="font-display text-[46px] leading-[1.22] font-medium">
              <span className="text-fog">Gorizontal tekislik bilan ma’lum </span>
              <span className="font-bold text-glow">α burchak</span>
              <span className="text-fog"> hosil qiluvchi tekislik </span>
              <span className="font-bold text-snow">qiya tekislik</span>
              <span className="text-fog"> deyiladi.</span>
            </p>
          </Reveal>
          <Reveal show={step >= 1} variant="up" className="mt-10 inline-flex items-center gap-4 rounded-2xl border border-lime/30 bg-lime/[0.06] px-7 py-4">
            <Tex math="\alpha" className="text-[48px] text-glow" />
            <span className="text-[30px] text-snow/85">— qiyalik burchagi</span>
          </Reveal>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-6">
        {EXAMPLES.map((e, i) => (
          <Reveal key={e.kind} show={step >= 2} variant="up" delay={i * 0.1} className="card flex items-center gap-6 px-7 py-5">
            <ExampleIcon kind={e.kind} />
            <span className="font-display text-[32px] font-semibold">{e.label}</span>
          </Reveal>
        ))}
      </div>
    </SlideShell>
  )
}
