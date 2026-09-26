import { useState } from 'react'
import { Feedback, OptionButton, RunButton, Tile } from './LessonUI'
import type { LessonLab } from './types'

const CHOICES = ['10°', '30°', 'Farqi yo‘q'] as const
const CORRECT = '30°'

const STEPS = ['Avval mustaqil o‘ylang.', 'Javobingizni belgilang.', 'Juftingiz bilan muhokama qiling.', 'Tajriba orqali tekshiring.']

/** O‘yla – Juftlikda muhokama qil – Javob ber (faqat sinf ichidagi usul, tarmoq yo‘q) */
export function ThinkPairShare({ lab }: { lab: LessonLab }) {
  const [choice, setChoice] = useState<(typeof CHOICES)[number] | null>(null)
  const [locked, setLocked] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const current = !choice ? 0 : !locked ? 1 : !revealed ? 2 : 3

  return (
    <Tile eyebrow="Juftlikda ishlash" title="O‘yla – Juftlikda muhokama qil – Javob ber">
      <p className="font-medium leading-snug">10° va 30° qiya tekisliklardan qaysi birida jism tezroq harakat qiladi?</p>

      <ol className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        {STEPS.map((s, i) => (
          <li key={s} className={`flex gap-2 ${i === current ? 'text-glow' : i < current ? 'text-lime/70' : 'text-fog'}`}>
            <span className="font-mono">{i + 1}.</span>
            {s}
          </li>
        ))}
      </ol>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {CHOICES.map((c) => (
          <OptionButton
            key={c}
            selected={choice === c}
            disabled={locked}
            verdict={revealed && choice === c ? (c === CORRECT ? 'correct' : 'wrong') : null}
            onClick={() => setChoice(c)}
          >
            <span className="block text-center font-semibold">{c}</span>
          </OptionButton>
        ))}
      </div>

      {!locked ? (
        <button type="button" className="btn btn-primary mt-4 self-start" disabled={!choice} onClick={() => setLocked(true)}>
          Taxminimni belgilash
        </button>
      ) : (
        <div className="mt-4 flex flex-1 flex-col gap-2.5">
          <p className="text-sm text-lime">Belgilandi. Endi juftingiz bilan muhokama qiling, so‘ng tekshiring:</p>
          <RunButton lab={lab} id="tps-10" patch={{ angleDeg: 10 }} label="α = 10°" />
          <RunButton lab={lab} id="tps-30" patch={{ angleDeg: 30 }} label="α = 30°" />
          {revealed ? (
            <Feedback ok={choice === CORRECT} title={choice === CORRECT ? 'To‘g‘ri!' : 'To‘g‘ri javob: 30°'}>
              30° da jismni pastga tortuvchi kuch kattaroq. 10° da esa ishqalanish jismni ushlab qoladi — u umuman
              sirpanmaydi.
            </Feedback>
          ) : (
            <button type="button" className="btn btn-ghost mt-auto self-start" onClick={() => setRevealed(true)}>
              Javobni tekshirish
            </button>
          )}
        </div>
      )}
    </Tile>
  )
}
