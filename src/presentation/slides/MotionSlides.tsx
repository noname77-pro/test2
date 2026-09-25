import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Tex } from '../../components/ui/Tex'
import { InclineDiagram } from '../InclineDiagram'
import { MiniIncline } from '../illustrations'
import { C, EASE, Emphasis, Reveal, SlideShell, T } from '../ui'
import type { SlideProps } from './types'

function BigSlider({
  label,
  symbol,
  value,
  min,
  max,
  step,
  digits,
  unit = '',
  onChange,
}: {
  label: string
  symbol: string
  value: number
  min: number
  max: number
  step: number
  digits: number
  unit?: string
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div data-interactive className="card px-7 pt-4 pb-3">
      <div className="flex items-baseline justify-between gap-3 whitespace-nowrap">
        <span className="text-[21px] text-fog">{label}</span>
        <span className="font-mono text-[30px] font-semibold text-glow">
          <Tex math={symbol} className="text-lime" /> = {value.toFixed(digits)}
          {unit}
        </span>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-olive via-lime to-glow" style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range"
          className="range range-lg relative"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={label}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  )
}

/* 9 — Jism qachon sirpanadi? */
export function SlideConditionSlide({ step }: SlideProps) {
  const [angle, setAngle] = useState(20)
  const [mu, setMu] = useState(0.45)
  const a = (angle * Math.PI) / 180
  const fx = Math.sin(a)
  const fr = mu * Math.cos(a)
  const slides = fx > fr
  const scale = 300 // 1·mg = 300 px

  return (
    <SlideShell
      number={9}
      eyebrow="Sirpanish sharti"
      title="Jism qachon sirpanadi?"
      keyIdea={
        <>
          Jism <Tex math={`${T.Fx} > ${T.Fishq}`} /> bo‘lganda sirpanadi.
        </>
      }
      showKeyIdea={step >= 4}
    >
      <motion.div
        className="grid h-full grid-cols-[980px_1fr] gap-12"
        animate={step >= 4 ? { opacity: 0.18, scale: 0.97, filter: 'blur(6px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="flex flex-col gap-5">
          <div className="card relative h-[520px] overflow-hidden">
            <InclineDiagram
              angle={angle}
              mu={mu}
              camera={{ x: 180, y: 80, w: 1400, h: 788 }}
              vectors={{ mg: 'dim', Fx: 'hi', Fishq: 'hi' }}
              sliding={slides}
              showAngle
              labelSize={60}
              cameraDuration={0.4}
              className="h-full w-full"
            />
            <div
              className={`absolute top-5 right-5 rounded-full border px-6 py-2 font-display text-[28px] font-bold transition-colors duration-300 ${
                slides ? 'border-lime/60 bg-lime/15 text-glow' : 'border-coral/50 bg-coral/10 text-coral'
              }`}
            >
              {slides ? 'Jism sirpanadi' : 'Jism sirpanmaydi'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <BigSlider label="Qiyalik burchagi" symbol="\alpha" value={angle} min={5} max={50} step={1} digits={0} unit="°" onChange={setAngle} />
            <BigSlider label="Ishqalanish koeffitsienti" symbol="\mu" value={mu} min={0.1} max={0.9} step={0.01} digits={2} onChange={setMu} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Qiyalik bo‘ylab qarama-qarshi kuchlar */}
          <div className="card px-8 py-7">
            <div className="eyebrow">Qiyalik bo‘ylab</div>
            <div className="relative mt-6 h-[150px]">
              <div className="absolute top-0 bottom-0 left-1/2 w-[3px] -translate-x-1/2 rounded bg-snow/60" />
              <motion.div
                className="absolute top-3 right-1/2 h-12 rounded-l-full"
                style={{ background: C.Fishq, boxShadow: `0 0 24px ${C.Fishq}80` }}
                animate={{ width: fr * scale }}
                transition={{ type: 'spring', stiffness: 220, damping: 30 }}
              />
              <motion.div
                className="absolute top-[84px] left-1/2 h-12 rounded-r-full"
                style={{ background: C.Fx, boxShadow: `0 0 24px ${C.Fx}80` }}
                animate={{ width: fx * scale }}
                transition={{ type: 'spring', stiffness: 220, damping: 30 }}
              />
              <Tex math={T.Fishq} className="absolute top-2 left-0 text-[44px]" />
              <Tex math={T.Fx} className="absolute top-[78px] right-0 text-[44px]" />
            </div>
            <div className="mt-4 flex justify-between font-mono text-[24px] text-fog">
              <span>μ cos α ≈ {fr.toFixed(2)}</span>
              <span>sin α ≈ {fx.toFixed(2)}</span>
            </div>
          </div>

          <Reveal show={step >= 1} variant="up" className="card flex items-center justify-between px-8 py-5">
            <Tex math={`${T.Fx} > ${T.Fishq}`} className="text-[54px]" />
            <span className="text-[28px] text-glow">⇒ jism sirpanadi</span>
          </Reveal>
          <Reveal show={step >= 2} variant="up" className="card flex items-center justify-between px-8 py-5">
            <Tex math="mg\sin\alpha > \mu mg\cos\alpha" className="text-[46px]" />
            <span className="w-[120px] shrink-0 text-right text-[21px] leading-tight text-fog">o‘rniga qo‘yamiz</span>
          </Reveal>
          <Reveal show={step >= 3} variant="up" className="card flex items-center justify-between px-8 py-5">
            <Tex math="\sin\alpha > \mu\cos\alpha" className="text-[54px]" />
            <span className="w-[120px] shrink-0 text-right text-[21px] leading-tight text-fog">mg ga qisqartiramiz</span>
          </Reveal>
        </div>
      </motion.div>

      {/* Yakuniy shart — kuchli yaqinlashish bilan */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <Emphasis show={step >= 4} className="card card-glow px-24 py-14 text-center">
          <div className="font-display text-[54px] font-semibold text-snow/90">Sirpanish sharti</div>
          <Tex math="\tan\alpha > \mu" className="mt-3 block text-[140px] text-glow" />
          <div className="mt-2 font-mono text-[24px] text-fog">sin α &gt; μ cos α tengsizlikni cos α ga bo‘lamiz</div>
        </Emphasis>
      </div>
    </SlideShell>
  )
}

/* 10 — Qiya tekislik bo‘ylab tezlanish */
const CANCEL = '\\textcolor{#FF8D6B}{\\cancel{m}}'

export function AccelerationSlide({ step }: SlideProps) {
  return (
    <SlideShell
      number={10}
      eyebrow="Nyutonning II qonuni"
      title="Qiya tekislik bo‘ylab tezlanish"
      keyIdea="Tezlanish natijaviy kuch bilan aniqlanadi."
      showKeyIdea={step >= 3}
    >
      <div className="grid h-full grid-cols-[640px_1fr] items-center gap-14">
        <div className="flex flex-col gap-5">
          <div className="card h-[360px] overflow-hidden">
            {/* Kadr jism va α burchagini birga qamraydi — α kesilib qolmaydi */}
            <InclineDiagram
              angle={30}
              camera={{ x: 500, y: 345, w: 830, h: 467 }}
              vectors={{ mg: 'dim', Fx: 'hi', Fishq: 'hi' }}
              showAngle
              className="h-full w-full"
            />
          </div>
          <div className="card px-8 py-5">
            <div className="eyebrow">Nyutonning II qonuni</div>
            <Tex math="F_{\text{net}} = ma" className="mt-1 block text-[52px]" />
          </div>
        </div>

        <div className="flex flex-col gap-7">
          <Reveal show variant="up" delay={0.3} className="card px-10 py-7">
            <Tex math={`F_{\\text{net}} = ${T.Fx} - ${T.Fishq}`} className="text-[64px]" />
          </Reveal>

          {/* Bir xil joyda: avval oddiy, keyin m qisqartirilgan ko‘rinish */}
          <div className="relative h-[150px]">
            <Reveal show={step === 1} variant="up" className="card absolute inset-0 flex items-center px-10">
              <Tex math="ma = mg\sin\alpha - \mu mg\cos\alpha" className="text-[62px]" />
            </Reveal>
            <Reveal show={step >= 2} variant="blur" className="card absolute inset-0 flex items-center px-10">
              <Tex math={`${CANCEL}a = ${CANCEL}g\\sin\\alpha - \\mu ${CANCEL}g\\cos\\alpha`} className="text-[62px]" />
            </Reveal>
          </div>

          <Emphasis show={step >= 3} className="card card-glow px-10 py-9">
            <div className="eyebrow">Tezlanish</div>
            <Tex math="a = g(\sin\alpha - \mu\cos\alpha)" className="mt-2 block text-[84px] text-glow" />
          </Emphasis>
        </div>
      </div>
    </SlideShell>
  )
}

/* 11 — Burchak oshsa nima bo‘ladi? */
const ANGLES = [10, 30, 45]

export function AngleCompareSlide({ step, goToStep }: SlideProps) {
  const [choice, setChoice] = useState<number | null>(null)
  const answered = step >= 3
  const maxSin = Math.sin((45 * Math.PI) / 180)

  return (
    <SlideShell number={11} eyebrow="Taqqoslash" title="Burchak oshsa nima bo‘ladi?">
      <div className="grid grid-cols-3 gap-10">
        {ANGLES.map((deg, i) => {
          const s = Math.sin((deg * Math.PI) / 180)
          const best = answered && deg === 45
          return (
            <motion.div
              key={deg}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: answered && !best ? 0.45 : 1, y: 0 }}
              transition={{ duration: 0.6, delay: step === 0 ? 0.2 + i * 0.12 : 0, ease: EASE }}
              className={`card px-6 pt-4 pb-6 transition-shadow duration-500 ${best ? 'card-glow' : ''}`}
            >
              <div className="font-display text-[44px] font-bold text-glow">α = {deg}°</div>
              <div className="h-[330px]">
                <MiniIncline angle={deg} showFx={step >= 1} highlight={best} />
              </div>
              <Reveal show={step >= 1} variant="fade" delay={0.3} className="mt-2">
                <div className="flex items-baseline justify-between font-mono text-[24px]">
                  <Tex math={T.Fx} className="text-[34px]" />
                  <span className="text-fog">sin {deg}° ≈ {s.toFixed(2)}</span>
                </div>
                <div className="mt-2 h-4 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: C.Fx, boxShadow: `0 0 14px ${C.Fx}` }}
                    initial={{ width: 0 }}
                    animate={{ width: step >= 1 ? `${(s / maxSin) * 100}%` : 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: EASE }}
                  />
                </div>
              </Reveal>
            </motion.div>
          )
        })}
      </div>

      <div className="relative mt-8 h-[120px]">
        <Reveal show={step >= 2 && !answered} variant="up" className="absolute inset-0 flex items-center justify-between gap-8">
          <p className="font-display text-[44px] font-bold">Qaysi holatda jism sirpanishga ko‘proq moyil?</p>
          <div className="flex gap-4" data-interactive>
            {ANGLES.map((deg) => (
              <button
                key={deg}
                type="button"
                className="btn btn-ghost px-9 py-5 text-[30px]"
                onClick={() => {
                  setChoice(deg)
                  goToStep(3)
                }}
              >
                {deg}°
              </button>
            ))}
          </div>
        </Reveal>
        <AnimatePresence>
          {answered && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute inset-0 flex items-center gap-8 rounded-[28px] border border-lime/40 bg-lime/[0.07] px-10"
            >
              {choice !== null && (
                <span className={`font-display text-[40px] font-bold ${choice === 45 ? 'text-glow' : 'text-coral'}`}>
                  {choice === 45 ? 'To‘g‘ri!' : 'Qayta o‘ylab ko‘ring:'}
                </span>
              )}
              <span className="text-[32px] leading-snug">
                α ortishi bilan <Tex math={`${T.Fx} = mg\\sin\\alpha`} /> ortadi — <b className="text-glow">α = 45°</b> da jism
                sirpanishga eng moyil.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SlideShell>
  )
}
