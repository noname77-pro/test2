import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { fmt } from '../lib/format'

export interface Prediction {
  guess: boolean
  /** Taxmin paytidagi to‘g‘ri javob */
  answer: boolean
  tanAlpha: number
  mu: number
}

interface PredictionModeProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  prediction: Prediction | null
  canPredict: boolean
  onPredict: (guess: boolean) => void
  onRetry: () => void
  score: { correct: number; total: number }
}

/** Natija darhol emas, jism harakatini biroz kuzatgandan keyin ochiladi */
const REVEAL_DELAY = 1100

export function PredictionMode({ enabled, onToggle, prediction, canPredict, onPredict, onRetry, score }: PredictionModeProps) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setRevealed(false)
    if (!prediction) return
    const id = window.setTimeout(() => setRevealed(true), REVEAL_DELAY)
    return () => window.clearTimeout(id)
  }, [prediction])

  const correct = prediction ? prediction.guess === prediction.answer : false

  return (
    <section className="card card-glow overflow-hidden p-5 sm:p-6" aria-labelledby="predict-title">
      <div className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-lime/10 blur-3xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <span className="eyebrow">Sinf bilan interaktiv</span>
          <h2 id="predict-title" className="mt-1 font-display text-xl font-semibold tracking-tight">
            Oldindan taxmin qil
          </h2>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Taxmin rejimi"
          onClick={() => onToggle(!enabled)}
          className={`relative mt-1 h-7 w-12 shrink-0 rounded-full border transition-colors ${
            enabled ? 'border-lime/60 bg-lime/25' : 'border-white/15 bg-white/5'
          }`}
        >
          <span
            className={`absolute top-1/2 size-5 -translate-y-1/2 rounded-full transition-all ${
              enabled ? 'left-6 bg-glow shadow-[0_0_12px_#E9FD87]' : 'left-1 bg-fog'
            }`}
          />
        </button>
      </div>

      <div className="relative mt-4 min-h-[9.5rem]">
        <AnimatePresence mode="wait">
          {!enabled ? (
            <motion.p key="off" {...fade} className="text-fog">
              Taxmin rejimi o‘chirilgan. Uni yoqsangiz, natija simulyatsiyadan oldin yashiriladi va o‘quvchilar avval javob
              beradi.
            </motion.p>
          ) : !prediction ? (
            <motion.div key="ask" {...fade}>
              <p className="font-display text-3xl font-bold tracking-tight">Jism sirpanadimi?</p>
              {canPredict ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button type="button" className="btn btn-primary py-3.5 text-base" onClick={() => onPredict(true)}>
                    Ha
                  </button>
                  <button type="button" className="btn btn-ghost py-3.5 text-base" onClick={() => onPredict(false)}>
                    Yo‘q
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-sm text-fog">
                  Simulyatsiya allaqachon boshlangan. Yangi taxmin uchun «Qayta boshlash» tugmasini bosing.
                </p>
              )}
            </motion.div>
          ) : !revealed ? (
            <motion.div key="wait" {...fade} className="flex h-[9.5rem] flex-col justify-center">
              <p className="text-fog">
                Sizning javobingiz: <span className="font-semibold text-snow">{prediction.guess ? 'Ha' : 'Yo‘q'}</span>
              </p>
              <p className="mt-2 flex items-center gap-3 font-display text-2xl font-semibold">
                <span className="size-3 animate-pulse-soft rounded-full bg-glow" />
                Kuzatamiz…
              </p>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <p className={`font-display text-4xl font-bold tracking-tight ${correct ? 'text-glow' : 'text-coral'}`}>
                {correct ? 'To‘g‘ri!' : 'Qayta o‘ylab ko‘ring'}
              </p>
              <p className="mt-2 text-snow/80">
                tan α = {fmt(prediction.tanAlpha, 3)} {prediction.answer ? '>' : '≤'} μ = {fmt(prediction.mu, 2)} — jism{' '}
                {prediction.answer ? 'pastga harakatlanadi.' : 'tinch qoladi.'}
              </p>
              <button type="button" className="btn btn-ghost mt-4" onClick={onRetry}>
                Yangi taxmin
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {enabled && score.total > 0 && (
        <div className="relative mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-xs text-fog">
          <span>To‘g‘ri javoblar</span>
          <span className="text-snow">
            <span className="text-glow">{score.correct}</span> / {score.total}
          </span>
        </div>
      )}
    </section>
  )
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
}
