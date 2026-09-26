import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fmt } from '../../lib/format'
import type { LabParams } from '../../lib/presets'
import { PlayIcon } from '../ui/Icons'
import type { LessonLab } from './types'

/** Ichki kartochka — sozlamalar va tayyor tajribalar bilan bir xil uslubda */
export function Tile({
  eyebrow,
  title,
  children,
  className = '',
}: {
  eyebrow?: string
  title: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">{title}</h3>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </div>
  )
}

type Verdict = 'correct' | 'wrong' | null

interface OptionButtonProps {
  selected: boolean
  onClick: () => void
  disabled?: boolean
  verdict?: Verdict
  badge?: string
  children: ReactNode
}

export function OptionButton({ selected, onClick, disabled = false, verdict = null, badge, children }: OptionButtonProps) {
  const tone =
    verdict === 'correct'
      ? 'border-lime/70 bg-lime/[0.12] text-glow'
      : verdict === 'wrong'
        ? 'border-coral/60 bg-coral/10 text-coral'
        : selected
          ? 'border-lime/60 bg-lime/[0.09] text-snow shadow-[0_0_24px_-12px_rgba(188,211,87,0.8)]'
          : 'border-white/[0.08] bg-white/[0.02] text-snow/90 enabled:hover:border-lime/35 enabled:hover:bg-white/[0.04]'
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm leading-snug transition-colors disabled:cursor-default ${tone}`}
    >
      {badge && (
        <span
          className={`grid size-7 shrink-0 place-items-center rounded-lg font-mono text-xs font-semibold ${
            selected || verdict ? 'bg-glow text-ink' : 'bg-white/[0.06] text-lime'
          }`}
        >
          {badge}
        </span>
      )}
      <span className="min-w-0">{children}</span>
    </button>
  )
}

export function Feedback({ ok, title, children }: { ok: boolean; title: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-xl border px-4 py-3 text-sm ${ok ? 'border-lime/30 bg-lime/[0.06]' : 'border-coral/30 bg-coral/[0.06]'}`}
      role="status"
    >
      <p className={`font-semibold ${ok ? 'text-glow' : 'text-coral'}`}>{title}</p>
      <p className="mt-1 leading-relaxed text-snow/80">{children}</p>
    </motion.div>
  )
}

interface RunButtonProps {
  lab: LessonLab
  id: string
  patch: Partial<LabParams>
  label: string
}

/** Mavjud simulyatorda tajriba o‘tkazish tugmasi va o‘lchangan vaqt */
export function RunButton({ lab, id, patch, label }: RunButtonProps) {
  const result = lab.results[id]
  const active = lab.activeRun === id
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-ink/40 py-1.5 pr-3 pl-1.5">
      <button type="button" className="btn btn-ghost px-3.5 py-2 text-sm" onClick={() => lab.run(id, patch)}>
        <PlayIcon width={12} height={12} />
        {label}
      </button>
      <span className="font-mono text-sm whitespace-nowrap">
        {active ? (
          <span className="animate-pulse-soft text-fog">kuzatilmoqda…</span>
        ) : result === undefined ? (
          <span className="text-graphite">t = —</span>
        ) : result === 'static' ? (
          <span className="text-coral">qo‘zg‘almadi</span>
        ) : (
          <span className="text-glow">t = {fmt(result, 2)} s</span>
        )}
      </span>
    </div>
  )
}

export function StepHint({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-fog">{children}</p>
}
