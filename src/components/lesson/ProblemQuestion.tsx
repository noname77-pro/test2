import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Feedback, OptionButton } from './LessonUI'

export const PROBLEM_QUESTION =
  'Og‘ir yukni tik yuqoriga ko‘tarishdan ko‘ra qiya tekislik orqali ko‘tarish nima uchun osonroq?'

export const PROBLEM_OPTIONS = [
  { id: 'A', text: 'Qiya tekislik kuchdan yutish imkonini beradi', correct: true },
  { id: 'B', text: 'Jismning massasi kamayadi', correct: false },
  { id: 'C', text: 'Yerning tortish kuchi yo‘qoladi', correct: false },
] as const

export type ProblemAnswer = (typeof PROBLEM_OPTIONS)[number]['id']

interface ProblemQuestionProps {
  answer: ProblemAnswer | null
  onAnswer: (a: ProblemAnswer) => void
}

/** 1-bosqich: muammoli savol — javob hozircha ochilmaydi */
export function ProblemQuestion({ answer, onAnswer }: ProblemQuestionProps) {
  return (
    <div className="grid gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
      <div>
        <span className="eyebrow">Muammoli savol</span>
        <p className="mt-3 font-display text-2xl leading-snug font-semibold tracking-tight sm:text-[1.7rem]">
          {PROBLEM_QUESTION}
        </p>
        <p className="mt-3 text-sm text-fog">Avval o‘z fikringizni belgilang. To‘g‘ri javobni tajribadan keyin bilib olamiz.</p>
      </div>
      <div className="flex flex-col justify-center gap-2.5">
        {PROBLEM_OPTIONS.map((o) => (
          <OptionButton key={o.id} badge={o.id} selected={answer === o.id} onClick={() => onAnswer(o.id)}>
            {o.text}
          </OptionButton>
        ))}
        <AnimatePresence>
          {answer && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-1 text-sm text-lime"
              role="status"
            >
              Fikringiz belgilandi. Javobni «Xulosa» bosqichida tekshiramiz.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** 4-bosqich: muammoli savolga qaytish va tajriba xulosalari */
export function ProblemConclusion({ answer }: { answer: ProblemAnswer | null }) {
  const [revealed, setRevealed] = useState(false)
  const chosen = PROBLEM_OPTIONS.find((o) => o.id === answer)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
        <span className="eyebrow">Muammoli savolga qaytamiz</span>
        <p className="mt-2 font-display text-lg leading-snug font-semibold">{PROBLEM_QUESTION}</p>
        <p className="mt-3 text-sm text-fog">
          Sizning javobingiz:{' '}
          <span className="text-snow">{chosen ? `${chosen.id}) ${chosen.text}` : 'hali belgilanmagan'}</span>
        </p>
        <div className="mt-4">
          {revealed ? (
            <Feedback
              ok={chosen?.correct ?? true}
              title={chosen ? (chosen.correct ? 'To‘g‘ri!' : 'Qayta o‘ylab ko‘ring') : 'To‘g‘ri javob: A'}
            >
              Qiya tekislik kuchdan yutish imkonini beradi. Yukni qiya tekislik bo‘ylab tortganda og‘irlik kuchining
              faqat bir qismini yengamiz — shuning uchun kamroq kuch kerak bo‘ladi, lekin yo‘l uzunroq bo‘ladi. Massa ham,
              tortish kuchi ham o‘zgarmaydi.
            </Feedback>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setRevealed(true)}>
              Javobni tekshirish
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
        <span className="eyebrow">Tajribadan xulosalar</span>
        <ul className="mt-3 space-y-2.5 text-[0.95rem] leading-snug">
          {[
            'Burchak ortsa, jism tezroq harakatlanadi.',
            'Massa o‘zgarsa, jismning tezlanishi o‘zgarmaydi.',
            'Ishqalanish ortsa, jism sekinroq harakatlanadi yoki umuman qo‘zg‘almaydi.',
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-glow shadow-[0_0_10px_#E9FD87]" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
