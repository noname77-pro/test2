import { useState } from 'react'
import { Tile } from './LessonUI'

const SCALE = ['Ha', 'Qisman', 'Yo‘q'] as const

const PROMPTS = [
  'Qiya tekislik burchagi oshganda nima o‘zgarishini tushundimmi?',
  'Qiya tekislikning hayotdagi bir misolini ayta olamanmi?',
]

/** Dars yakuni — bir daqiqalik mulohaza (hech qayerga yuborilmaydi) */
export function ExitTicket() {
  const [learned, setLearned] = useState('')
  const [ratings, setRatings] = useState<(string | undefined)[]>([])
  const [submitted, setSubmitted] = useState(false)

  const ready = learned.trim().length > 0 || ratings.some(Boolean)

  return (
    <Tile eyebrow="Mulohaza" title="Dars yakuni">
      {submitted ? (
        <div className="flex flex-1 flex-col gap-3">
          <p className="font-display text-2xl font-bold text-glow">Rahmat!</p>
          <p className="text-snow/85">Bugungi dars yakunlandi. Javoblaringiz faqat shu qurilmada ko‘rinadi.</p>
          <button type="button" className="btn btn-ghost mt-auto self-start" onClick={() => setSubmitted(false)}>
            Javoblarni o‘zgartirish
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4">
          <label className="block">
            <span className="font-medium">Bugun nimani bildim?</span>
            <input
              type="text"
              value={learned}
              maxLength={120}
              onChange={(e) => setLearned(e.target.value)}
              placeholder="Qisqacha yozing…"
              className="mt-2 w-full rounded-xl border border-white/10 bg-ink/60 px-3.5 py-2.5 text-sm text-snow placeholder:text-graphite focus:border-lime/50 focus:outline-none"
            />
          </label>
          {PROMPTS.map((p, i) => (
            <div key={p}>
              <p className="text-sm font-medium leading-snug">{p}</p>
              <div className="mt-2 flex gap-2" role="group" aria-label={p}>
                {SCALE.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={ratings[i] === s}
                    onClick={() => setRatings((r) => Object.assign([...r], { [i]: s }))}
                    className="btn btn-ghost px-4 py-2 text-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-primary mt-auto self-start" disabled={!ready} onClick={() => setSubmitted(true)}>
            Yakunlash
          </button>
        </div>
      )}
    </Tile>
  )
}
