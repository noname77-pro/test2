import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'
import { CheckIcon, ChevronIcon } from './Icons'

export interface DropdownOption<T extends string> {
  value: T
  label: string
  meta?: string
}

interface DropdownProps<T extends string> {
  label: string
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
}

export function Dropdown<T extends string>({ label, value, options, onChange }: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink/60 px-3.5 py-2.5 text-left transition-colors hover:border-lime/40"
      >
        <span className="font-medium text-snow">{current.label}</span>
        <span className="flex items-center gap-2 font-mono text-sm text-glow">
          {current.meta}
          <ChevronIcon className={`text-fog transition-transform ${open ? 'rotate-180' : ''}`} width={16} height={16} />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-lime/25 bg-ink-2/95 p-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            {options.map((o) => {
              const selected = o.value === value
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(o.value)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                      selected ? 'bg-lime/12 text-glow' : 'text-snow hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CheckIcon width={15} height={15} className={selected ? 'opacity-100' : 'opacity-0'} />
                      {o.label}
                    </span>
                    <span className="font-mono text-sm text-fog">{o.meta}</span>
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
