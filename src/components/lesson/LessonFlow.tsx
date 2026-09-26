import { motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { CheckIcon, ChevronIcon } from '../ui/Icons'
import { ExitTicket } from './ExitTicket'
import { FinalTest } from './FinalTest'
import { GroupActivity } from './GroupActivity'
import { PredictObserveExplain } from './PredictObserveExplain'
import { ProblemConclusion, ProblemQuestion, type ProblemAnswer } from './ProblemQuestion'
import { RealLifeExamples } from './RealLifeExamples'
import { SpeedChallenge } from './SpeedChallenge'
import { ThinkPairShare } from './ThinkPairShare'
import { TrueFalseQuiz } from './TrueFalseQuiz'
import type { LessonLab } from './types'

const STEPS = ['Muammo', 'Taxmin', 'Tajriba', 'Xulosa', 'Test'] as const

interface LessonFlowProps {
  lab: LessonLab
  /** Proyektor rejimida bo‘lim yig‘iladi — tajriba ekranda markazda qoladi */
  projector: boolean
}

/** Dars bosqichlari: mavjud laboratoriyani to‘ldiruvchi pedagogik mashg‘ulotlar */
export function LessonFlow({ lab, projector }: LessonFlowProps) {
  const [step, setStep] = useState(0)
  const [open, setOpen] = useState(!projector)
  const [problemAnswer, setProblemAnswer] = useState<ProblemAnswer | null>(null)

  useEffect(() => {
    if (projector) setOpen(false)
  }, [projector])

  const panels: ReactNode[] = [
    <ProblemQuestion key="p" answer={problemAnswer} onAnswer={setProblemAnswer} />,
    <div key="t" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <PredictObserveExplain lab={lab} />
      <ThinkPairShare lab={lab} />
      <div className="md:col-span-2 xl:col-span-1">
        <SpeedChallenge />
      </div>
    </div>,
    <GroupActivity key="g" lab={lab} />,
    <div key="x" className="grid gap-4 xl:grid-cols-[1fr_1.35fr]">
      <ProblemConclusion answer={problemAnswer} />
      <RealLifeExamples />
    </div>,
    <div key="s" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <TrueFalseQuiz />
      <FinalTest />
      <div className="md:col-span-2 xl:col-span-1">
        <ExitTicket />
      </div>
    </div>,
  ]

  const goTo = (i: number) => {
    setStep(i)
    setOpen(true)
  }

  return (
    <section id="dars" className="card scroll-mt-24 p-5 sm:p-6" aria-labelledby="lesson-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center gap-3 text-left">
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03]">
            <ChevronIcon className={`transition-transform ${open ? '' : '-rotate-90'}`} width={16} height={16} />
          </span>
          <span>
            <span className="eyebrow block">Ochiq dars</span>
            <span id="lesson-title" className="font-display text-lg font-semibold tracking-tight">
              Dars bosqichlari
            </span>
          </span>
        </button>

        {/* Bosqich ko‘rsatkichi — mavjud v(t)/s(t) tugmalari uslubida */}
        <div className="-mx-1 max-w-full overflow-x-auto px-1">
          <div role="tablist" aria-label="Dars bosqichlari" className="flex w-max rounded-full border border-white/10 bg-ink/60 p-1">
            {STEPS.map((label, i) => {
              const active = i === step
              const passed = i < step
              return (
                <button
                  key={label}
                  id={`lesson-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`lesson-panel-${i}`}
                  onClick={() => goTo(i)}
                  className={`flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-1.5 text-sm transition-colors ${
                    active ? 'bg-glow text-ink' : passed ? 'text-lime hover:text-glow' : 'text-fog hover:text-snow'
                  }`}
                >
                  <span
                    className={`grid size-6 place-items-center rounded-full font-mono text-xs font-semibold ${
                      active ? 'bg-ink/15' : passed ? 'bg-lime/15' : 'bg-white/[0.06]'
                    }`}
                  >
                    {passed ? <CheckIcon width={12} height={12} strokeWidth={3} /> : i + 1}
                  </span>
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Yig‘ilganda ham mashg‘ulotlar o‘chirilmaydi — o‘quvchilar javoblari saqlanadi */}
      <motion.div
        initial={false}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
        inert={!open}
      >
        <div className="pt-5">
          {panels.map((panel, i) => (
            // Faol bo‘lmagan bosqichlar yashiriladi, lekin javoblar saqlanib qoladi
            <motion.div
              key={i}
              id={`lesson-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`lesson-tab-${i}`}
              hidden={i !== step}
              initial={false}
              animate={i === step ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              {panel}
            </motion.div>
          ))}

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
            <button type="button" className="btn btn-ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              ← Oldingi
            </button>
            <span className="font-mono text-xs text-fog">
              {step + 1} / {STEPS.length}
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={step === STEPS.length - 1}
              onClick={() => setStep((s) => s + 1)}
            >
              {step < STEPS.length - 1 ? `${STEPS[step + 1]} →` : 'Tugadi'}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
