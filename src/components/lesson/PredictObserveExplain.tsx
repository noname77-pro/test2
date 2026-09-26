import { useState } from 'react'
import { fmt } from '../../lib/format'
import { Feedback, OptionButton, RunButton, StepHint, Tile } from './LessonUI'
import type { LessonLab } from './types'

const PREDICTIONS = ['Tezroq harakat qiladi', 'Sekinroq harakat qiladi', 'O‘zgarmaydi'] as const
type PredictionText = (typeof PREDICTIONS)[number]

const REASONS = [
  { text: 'Burchak katta bo‘lsa, jismni pastga tortuvchi kuch kattaroq bo‘ladi.', correct: true },
  { text: 'Burchak katta bo‘lsa, jismning massasi ortadi.', correct: false },
  { text: 'Burchak katta bo‘lsa, ishqalanish butunlay yo‘qoladi.', correct: false },
]

const PHASES = ['Taxmin qil', 'Kuzat', 'Tushuntir'] as const

/** Taxmin qil → Kuzat → Tushuntir (POE) */
export function PredictObserveExplain({ lab }: { lab: LessonLab }) {
  const [phase, setPhase] = useState(0)
  const [prediction, setPrediction] = useState<PredictionText | null>(null)
  const [reason, setReason] = useState<number | null>(null)

  const small = lab.results['poe-15']
  const large = lab.results['poe-40']
  const observed = typeof small === 'number' && typeof large === 'number'
  // Kichik vaqt — tezroq harakat
  const outcome: PredictionText | null = observed
    ? large < small
      ? 'Tezroq harakat qiladi'
      : large > small
        ? 'Sekinroq harakat qiladi'
        : 'O‘zgarmaydi'
    : null

  return (
    <Tile eyebrow="Taxmin qil · Kuzat · Tushuntir" title="Burchak oshsa nima bo‘ladi?">
      <div className="mb-4 flex rounded-full border border-white/10 bg-ink/60 p-1" role="tablist" aria-label="POE bosqichlari">
        {PHASES.map((p, i) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={phase === i}
            onClick={() => setPhase(i)}
            className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
              phase === i ? 'bg-glow text-ink' : 'text-fog hover:text-snow'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {phase === 0 && (
        <div className="flex flex-1 flex-col gap-2.5">
          <p className="font-medium leading-snug">Qiya tekislik burchagi oshirilsa, jismning harakati qanday o‘zgaradi?</p>
          {PREDICTIONS.map((p) => (
            <OptionButton key={p} selected={prediction === p} onClick={() => setPrediction(p)}>
              {p}
            </OptionButton>
          ))}
          <button type="button" className="btn btn-primary mt-auto self-start" disabled={!prediction} onClick={() => setPhase(1)}>
            Kuzatishga o‘tish
          </button>
        </div>
      )}

      {phase === 1 && (
        <div className="flex flex-1 flex-col gap-2.5">
          <StepHint>Ikki tajribani simulyatorda o‘tkazing (μ = 0.20, m = 5 kg). t — jismning pastga yetish vaqti.</StepHint>
          <RunButton lab={lab} id="poe-15" patch={{ angleDeg: 15 }} label="α = 15°" />
          <RunButton lab={lab} id="poe-40" patch={{ angleDeg: 40 }} label="α = 40°" />
          {observed && outcome && (
            <div className="mt-1 space-y-1.5 rounded-xl border border-white/[0.07] bg-ink/40 px-4 py-3 text-sm">
              <p>
                <span className="text-fog">Sizning taxminingiz: </span>
                <span className="text-snow">{prediction ?? 'belgilanmagan'}</span>
              </p>
              <p>
                <span className="text-fog">Tajriba natijasi: </span>
                <span className="text-glow">{outcome}</span>{' '}
                <span className="font-mono text-xs text-fog">
                  ({fmt(large as number, 2)} s &lt; {fmt(small as number, 2)} s)
                </span>
              </p>
              {prediction && (
                <p className={prediction === outcome ? 'text-lime' : 'text-coral'}>
                  {prediction === outcome ? 'Taxmin tajribada tasdiqlandi.' : 'Taxmin tajribaga mos kelmadi — bu ham muhim natija.'}
                </p>
              )}
            </div>
          )}
          <button type="button" className="btn btn-ghost mt-auto self-start" disabled={!observed} onClick={() => setPhase(2)}>
            Tushuntirishga o‘tish
          </button>
        </div>
      )}

      {phase === 2 && (
        <div className="flex flex-1 flex-col gap-2.5">
          <p className="font-medium">Nima uchun?</p>
          {REASONS.map((r, i) => (
            <OptionButton
              key={r.text}
              selected={reason === i}
              verdict={reason === i ? (r.correct ? 'correct' : 'wrong') : null}
              onClick={() => setReason(i)}
            >
              {r.text}
            </OptionButton>
          ))}
          {reason !== null && (
            <Feedback ok={REASONS[reason].correct} title={REASONS[reason].correct ? 'To‘g‘ri!' : 'Qayta o‘ylab ko‘ring'}>
              Burchak oshganda og‘irlik kuchining qiyalik bo‘ylab tashkil etuvchisi kattalashadi, ishqalanish esa biroz
              kamayadi. Shuning uchun jism tezroq tushadi.
            </Feedback>
          )}
        </div>
      )}
    </Tile>
  )
}
