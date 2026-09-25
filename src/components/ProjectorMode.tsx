import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ProjectorIcon } from './ui/Icons'

/** Proyektor rejimi: <html> ga klass qo‘shib, barcha rem o‘lchamlarni kattalashtiradi */
export function useProjectorMode() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('projector', enabled)
  }, [enabled])

  return [enabled, setEnabled] as const
}

export function ProjectorToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="btn btn-ghost" aria-pressed={enabled} onClick={onToggle} title="Proyektor rejimi (P)">
      <ProjectorIcon width={17} height={17} />
      <span className="hidden sm:inline">Proyektor rejimi</span>
    </button>
  )
}

export function ProjectorBadge({ enabled, onExit }: { enabled: boolean; onExit: () => void }) {
  return (
    <AnimatePresence>
      {enabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-4 z-50 opacity-70 transition-opacity hover:opacity-100 flex items-center gap-3 rounded-full border border-lime/40 bg-ink/85 py-1.5 pr-1.5 pl-4 text-sm shadow-[0_0_40px_-10px_rgba(188,211,87,0.6)] backdrop-blur-xl"
        >
          <span className="size-2 animate-pulse-soft rounded-full bg-glow" />
          <span className="text-snow/90">Proyektor rejimi</span>
          <button type="button" onClick={onExit} className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-xs text-snow hover:bg-white/15">
            Chiqish · P
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
