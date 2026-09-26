import { useState } from 'react'
import { Feedback, Tile } from './LessonUI'

const STATEMENTS = [
  {
    text: 'Qiya tekislik burchagi oshsa, jism tezroq harakat qilishi mumkin.',
    answer: true,
    explain: 'Burchak oshganda jismni pastga tortuvchi kuch kattalashadi.',
  },
  {
    text: 'Jismning massasi oshsa, Yerning tortish kuchi kamayadi.',
    answer: false,
    explain: 'Aksincha: massa oshsa, og‘irlik kuchi (mg) ham ortadi.',
  },
  {
    text: 'Qiya tekislik yukni ko‘tarishni osonlashtirish uchun ishlatilishi mumkin.',
    answer: true,
    explain: 'Kamroq kuch kerak bo‘ladi, lekin yukni uzunroq yo‘l bo‘ylab olib chiqamiz.',
  },
  {
    text: 'Ishqalanish kuchi doim harakat yo‘nalishida ta’sir qiladi.',
    answer: false,
    explain: 'Ishqalanish kuchi harakatga qarshi yo‘naladi va uni sekinlashtiradi.',
  },
]

/** To‘g‘ri yoki noto‘g‘ri? — har bir javobdan keyin qisqa izoh */
export function TrueFalseQuiz() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])

  const done = index >= STATEMENTS.length
  const current = STATEMENTS[Math.min(index, STATEMENTS.length - 1)]
  const given = answers[index]
  const answered = given !== undefined
  const correctCount = answers.filter((a, i) => a === STATEMENTS[i].answer).length

  return (
    <Tile eyebrow={done ? 'Yakunlandi' : `${index + 1} / ${STATEMENTS.length}`} title="To‘g‘ri yoki noto‘g‘ri?">
      {done ? (
        <div className="flex flex-1 flex-col gap-3">
          <p className="font-display text-3xl font-bold">
            <span className="text-glow">{correctCount}</span> / {STATEMENTS.length}
          </p>
          <p className="text-sm text-fog">To‘g‘ri javoblar soni.</p>
          <button
            type="button"
            className="btn btn-ghost mt-auto self-start"
            onClick={() => {
              setIndex(0)
              setAnswers([])
            }}
          >
            Qayta urinib ko‘rish
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3">
          <p className="min-h-[3.5rem] font-medium leading-snug">«{current.text}»</p>
          <div className="grid grid-cols-2 gap-2">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                disabled={answered}
                aria-pressed={given === v}
                onClick={() => setAnswers((a) => Object.assign([...a], { [index]: v }))}
                className={`btn ${given === v ? 'btn-primary' : 'btn-ghost'} disabled:opacity-100`}
              >
                {v ? 'To‘g‘ri' : 'Noto‘g‘ri'}
              </button>
            ))}
          </div>
          {answered && (
            <Feedback ok={given === current.answer} title={given === current.answer ? 'To‘g‘ri javob!' : 'Aslida bunday emas'}>
              {current.explain}
            </Feedback>
          )}
          {answered && (
            <button type="button" className="btn btn-ghost mt-auto self-start" onClick={() => setIndex((i) => i + 1)}>
              {index === STATEMENTS.length - 1 ? 'Natijani ko‘rish' : 'Keyingi savol'}
            </button>
          )}
        </div>
      )}
    </Tile>
  )
}
