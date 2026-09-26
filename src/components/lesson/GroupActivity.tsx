import { useState } from 'react'
import type { LabParams } from '../../lib/presets'
import { Feedback, OptionButton, RunButton, StepHint } from './LessonUI'
import type { LessonLab } from './types'

interface Group {
  n: number
  task: string
  hint: string
  runs: { id: string; label: string; patch: Partial<LabParams> }[]
  options: { text: string; correct: boolean }[]
  explain: string
}

// Qolgan parametrlar boshlang‘ich qiymatda: α = 30°, m = 5 kg, μ = 0.20, Yer
const GROUPS: Group[] = [
  {
    n: 1,
    task: 'Burchakning ta’sirini tekshiring.',
    hint: 'Faqat burchakni o‘zgartiring.',
    runs: [
      { id: 'g1-a', label: 'α = 20°', patch: { angleDeg: 20 } },
      { id: 'g1-b', label: 'α = 40°', patch: { angleDeg: 40 } },
    ],
    options: [
      { text: 'Burchak ortganda jism tezroq tushdi', correct: true },
      { text: 'Burchak ortganda jism sekinroq tushdi', correct: false },
      { text: 'Hech narsa o‘zgarmadi', correct: false },
    ],
    explain: 'Burchak ortsa, jismni qiyalik bo‘ylab pastga tortuvchi kuch kattalashadi.',
  },
  {
    n: 2,
    task: 'Massaning ta’sirini tekshiring.',
    hint: 'Faqat massani o‘zgartiring.',
    runs: [
      { id: 'g2-a', label: 'm = 2 kg', patch: { mass: 2 } },
      { id: 'g2-b', label: 'm = 10 kg', patch: { mass: 10 } },
    ],
    options: [
      { text: 'Og‘ir jism tezroq tushdi', correct: false },
      { text: 'Ikkalasi bir xil vaqtda tushdi', correct: true },
      { text: 'Og‘ir jism sekinroq tushdi', correct: false },
    ],
    explain:
      'Massa ortsa, pastga tortuvchi kuch ham, ishqalanish ham bir xil marta ortadi. Shuning uchun tezlanish massaga bog‘liq emas.',
  },
  {
    n: 3,
    task: 'Sirt yoki ishqalanishning ta’sirini tekshiring.',
    hint: 'Faqat ishqalanish koeffitsientini o‘zgartiring.',
    runs: [
      { id: 'g3-a', label: 'μ = 0.10', patch: { mu: 0.1 } },
      { id: 'g3-b', label: 'μ = 0.40', patch: { mu: 0.4 } },
    ],
    options: [
      { text: 'Ishqalanish ortganda jism sekinroq tushdi', correct: true },
      { text: 'Ishqalanish ortganda jism tezroq tushdi', correct: false },
      { text: 'Ishqalanish harakatga ta’sir qilmaydi', correct: false },
    ],
    explain: 'Ishqalanish kuchi harakatga qarshi yo‘nalgan. Sirt g‘adir-budur bo‘lsa, u kattalashadi va jism sekinlashadi.',
  },
]

/** 3-bosqich: guruhlar bilan tajriba (mavjud simulyator parametrlari bilan) */
export function GroupActivity({ lab }: { lab: LessonLab }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-semibold tracking-tight">Guruhlar bilan tajriba</h3>
        <StepHint>Har bir guruh ikki tajribani solishtiradi. Qolgan qiymatlar: α = 30°, m = 5 kg, μ = 0.20.</StepHint>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <GroupCard key={g.n} group={g} lab={lab} />
        ))}
      </div>
    </div>
  )
}

function GroupCard({ group, lab }: { group: Group; lab: LessonLab }) {
  const [answer, setAnswer] = useState<number | null>(null)
  const picked = answer !== null ? group.options[answer] : null

  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-lime/15 font-mono text-sm font-semibold text-glow">
          {group.n}
        </span>
        <div>
          <span className="eyebrow">{group.n}-guruh</span>
          <p className="font-semibold leading-snug">{group.task}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-fog">{group.hint}</p>
      <div className="mt-2 space-y-2">
        {group.runs.map((r) => (
          <RunButton key={r.id} lab={lab} id={r.id} patch={r.patch} label={r.label} />
        ))}
      </div>
      <p className="mt-4 font-medium">Nima o‘zgardi?</p>
      <div className="mt-2 space-y-2">
        {group.options.map((o, i) => (
          <OptionButton
            key={o.text}
            selected={answer === i}
            verdict={answer === i ? (o.correct ? 'correct' : 'wrong') : null}
            onClick={() => setAnswer(i)}
          >
            {o.text}
          </OptionButton>
        ))}
      </div>
      {picked && (
        <div className="mt-3">
          <Feedback ok={picked.correct} title={picked.correct ? 'To‘g‘ri xulosa!' : 'Tajriba natijasiga qarang'}>
            {group.explain}
          </Feedback>
        </div>
      )}
    </div>
  )
}
