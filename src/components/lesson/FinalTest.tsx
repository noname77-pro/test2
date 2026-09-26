import { useState } from 'react'
import { OptionButton, Tile } from './LessonUI'

const QUESTIONS = [
  {
    q: 'Qiya tekislik burchagi oshsa, jism qanday harakatlanadi?',
    options: ['Tezroq', 'Sekinroq', 'O‘zgarmaydi'],
    answer: 0,
  },
  {
    q: 'Jismni qiya tekislik bo‘ylab pastga harakatlantiruvchi kuch qaysi?',
    options: ['Og‘irlik kuchining qiyalik bo‘ylab tashkil etuvchisi (F_x)', 'Normal reaksiya kuchi (N)', 'Ishqalanish kuchi'],
    answer: 0,
  },
  {
    q: 'Ishqalanish kuchi qanday yo‘nalgan?',
    options: ['Harakat yo‘nalishida', 'Harakatga qarshi', 'Vertikal yuqoriga'],
    answer: 1,
  },
  {
    q: 'Ishqalanish koeffitsienti oshsa, jism qanday tushadi?',
    options: ['Tezroq', 'Sekinroq yoki umuman qo‘zg‘almaydi', 'O‘zgarishsiz'],
    answer: 1,
  },
  {
    q: 'Qaysi biri qiya tekislikning hayotdagi misoli?',
    options: ['Termometr', 'Pandus', 'Kompas'],
    answer: 1,
  },
]

function feedbackFor(score: number) {
  if (score === 5) return 'A’lo! Mavzuni juda yaxshi tushundingiz.'
  if (score === 4) return 'Juda yaxshi!'
  if (score === 3) return 'Yaxshi. Ayrim tushunchalarni yana bir bor ko‘rib chiqing.'
  return 'Tajriba va tushuntirishlarni yana bir bor ko‘rib chiqing.'
}

/** Bilimingizni tekshiring — 5 ta savol, natija faqat shu qurilmada */
export function FinalTest() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | undefined)[]>([])
  const done = index >= QUESTIONS.length
  const score = answers.filter((a, i) => a === QUESTIONS[i].answer).length

  if (done) {
    return (
      <Tile eyebrow="Natija" title="Bilimingizni tekshiring">
        <div className="flex flex-1 flex-col gap-3">
          <p className="font-display text-3xl font-bold">
            Natija: <span className="text-glow">{score}</span> / {QUESTIONS.length}
          </p>
          <p className={score >= 4 ? 'text-lime' : 'text-snow/85'}>{feedbackFor(score)}</p>
          <div className="flex gap-1.5" aria-label="Savollar bo‘yicha natija">
            {QUESTIONS.map((q, i) => (
              <span
                key={q.q}
                title={`${i + 1}-savol`}
                className={`h-2 flex-1 rounded-full ${answers[i] === q.answer ? 'bg-glow' : 'bg-coral/70'}`}
              />
            ))}
          </div>
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
      </Tile>
    )
  }

  const item = QUESTIONS[index]
  const chosen = answers[index]
  const last = index === QUESTIONS.length - 1

  return (
    <Tile eyebrow={`${index + 1} / ${QUESTIONS.length}`} title="Bilimingizni tekshiring">
      <div className="flex flex-1 flex-col gap-2.5">
        <p className="min-h-[3rem] font-medium leading-snug">{item.q}</p>
        {item.options.map((o, i) => (
          <OptionButton
            key={o}
            badge={String.fromCharCode(65 + i)}
            selected={chosen === i}
            onClick={() => setAnswers((a) => Object.assign([...a], { [index]: i }))}
          >
            {o}
          </OptionButton>
        ))}
        <button
          type="button"
          className={`btn ${last ? 'btn-primary' : 'btn-ghost'} mt-auto self-start`}
          disabled={chosen === undefined}
          onClick={() => setIndex((i) => i + 1)}
        >
          {last ? 'Javoblarni tekshirish' : 'Keyingi savol'}
        </button>
      </div>
    </Tile>
  )
}
