import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { useFullscreen } from '../hooks/useFullscreen'
import { DECK_TITLE, SIMULATOR_URL } from './config'
import { SLIDES } from './slides'
import { Backdrop, EASE, Stage } from './ui'

interface Position {
  index: number
  step: number
}

const LAST = SLIDES.length - 1

/** URL xeshidan (#5) slayd raqamini o‘qish — sahifa yangilansa ham joy saqlanadi */
function readHash(): Position {
  const n = Number.parseInt(window.location.hash.replace('#', ''), 10)
  const index = Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), LAST) : 0
  return { index, step: 0 }
}

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 70, scale: 0.985, filter: 'blur(12px)' }),
  center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({ opacity: 0, x: -dir * 70, scale: 0.985, filter: 'blur(12px)' }),
}

export default function Presentation() {
  const [pos, setPos] = useState<Position>(readHash)
  const [dir, setDir] = useState(1)
  const posRef = useRef(pos)
  posRef.current = pos
  const fullscreen = useFullscreen()
  const slide = SLIDES[pos.index]

  const go = useCallback((index: number, step: number) => {
    const p = posRef.current
    if (index === p.index && step === p.step) return
    setDir(index >= p.index ? 1 : -1)
    setPos({ index, step })
  }, [])

  /** Keyingi qadam; qadamlar tugasa — keyingi slayd */
  const next = useCallback(() => {
    const p = posRef.current
    if (p.step < SLIDES[p.index].steps) go(p.index, p.step + 1)
    else if (p.index < LAST) go(p.index + 1, 0)
  }, [go])

  /** Oldingi qadam; birinchi qadamda — oldingi slayd to‘liq ochilgan holatda */
  const prev = useCallback(() => {
    const p = posRef.current
    if (p.step > 0) go(p.index, p.step - 1)
    else if (p.index > 0) go(p.index - 1, SLIDES[p.index - 1].steps)
  }, [go])

  const nextSlide = useCallback(() => {
    const p = posRef.current
    if (p.index < LAST) go(p.index + 1, 0)
  }, [go])

  /** Oldingi slayd — tushuntirishni takrorlash uchun to‘liq ochilgan holatda */
  const prevSlide = useCallback(() => {
    const p = posRef.current
    if (p.index > 0) go(p.index - 1, SLIDES[p.index - 1].steps)
    else go(0, 0)
  }, [go])

  useEffect(() => {
    document.title = `${DECK_TITLE} — prezentatsiya`
  }, [])

  useEffect(() => {
    window.history.replaceState(null, '', `#${pos.index + 1}`)
  }, [pos.index])

  // Manzil satrida #7 kabi raqam yozilsa — shu slaydga o‘tish
  useEffect(() => {
    const onHash = () => {
      const h = readHash()
      go(h.index, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [go])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement
      // Slayder fokusda bo‘lsa, strelkalar uning qiymatini o‘zgartiradi
      if (target.closest('input[type="range"]') && e.key.startsWith('Arrow')) return
      let handled = true
      switch (e.key) {
        case 'ArrowRight':
          nextSlide()
          break
        case 'ArrowLeft':
          prevSlide()
          break
        case ' ':
        case 'PageDown':
        case 'ArrowDown':
          next()
          break
        case 'PageUp':
        case 'ArrowUp':
        case 'Backspace':
          prev()
          break
        case 'Home':
          go(0, 0)
          break
        case 'End':
          go(LAST, 0)
          break
        case 'f':
        case 'F':
          fullscreen.toggle()
          break
        case 'Escape':
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
          break
        default:
          handled = false
      }
      if (handled) e.preventDefault()
    }
    // Tugma yoki slayder bosilgach fokusni olib tashlaymiz — klaviatura boshqaruvi ishlashda davom etadi
    const onPointerUp = () =>
      window.setTimeout(() => {
        const el = document.activeElement as HTMLElement | null
        if (el && el !== document.body) el.blur()
      }, 0)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [next, prev, nextSlide, prevSlide, go, fullscreen])

  // Bo‘sh joyni bosish — keyingi qadam
  const onStageClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input, [data-interactive]')) return
    next()
  }

  const progress = (pos.index + (slide.steps ? pos.step / slide.steps : 1)) / SLIDES.length

  const SlideComponent = slide.Component

  return (
    <div className="deck fixed inset-0 overflow-hidden bg-ink text-snow select-none" onClick={onStageClick}>
      <Backdrop />
      <Stage>
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={pos.index}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-0"
          >
            <SlideComponent step={pos.step} goToStep={(s) => go(pos.index, Math.min(s, slide.steps))} />
          </motion.div>
        </AnimatePresence>

        <DeckChrome
          index={pos.index}
          step={pos.step}
          steps={slide.steps}
          title={slide.title}
          progress={progress}
          isFullscreen={fullscreen.isFullscreen}
          onPrev={prev}
          onNext={next}
          onFullscreen={fullscreen.toggle}
        />
      </Stage>
    </div>
  )
}

interface DeckChromeProps {
  index: number
  step: number
  steps: number
  title: string
  progress: number
  isFullscreen: boolean
  onPrev: () => void
  onNext: () => void
  onFullscreen: () => void
}

function DeckChrome({ index, step, steps, title, progress, isFullscreen, onPrev, onNext, onFullscreen }: DeckChromeProps) {
  return (
    <>
      {/* Yuqori o‘ng burchak: simulyatorga qaytish */}
      <a
        href={SIMULATOR_URL}
        className="absolute top-[28px] right-[40px] z-20 flex items-center gap-3 rounded-full border border-white/10 bg-ink/60 px-6 py-3 text-[20px] text-snow/80 backdrop-blur-xl transition-colors hover:border-lime/50 hover:text-glow"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18 9 12l6-6" />
        </svg>
        Simulyatorga qaytish
      </a>

      <div className="absolute inset-x-0 bottom-0 z-20 h-[72px]">
        <div className="absolute inset-x-0 bottom-0 h-[5px] bg-white/[0.06]">
          <motion.div
            className="h-full bg-gradient-to-r from-olive via-lime to-glow shadow-[0_0_16px_rgba(188,211,87,0.9)]"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>

        <div className="flex h-full items-center justify-between px-[40px] pb-[5px] text-[20px] text-fog">
          <div className="flex w-[640px] items-center gap-4 truncate">
            <span className="size-2 rounded-full bg-glow shadow-[0_0_10px_#E9FD87]" />
            <span className="truncate">{title}</span>
          </div>

          {/* Qadam nuqtalari */}
          <div className="flex items-center gap-2.5" aria-label={`Qadam ${step + 1} / ${steps + 1}`}>
            {steps > 0 &&
              Array.from({ length: steps + 1 }, (_, i) => (
                <span
                  key={i}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === step ? 'w-8 bg-glow' : i < step ? 'w-2.5 bg-lime/70' : 'w-2.5 bg-white/15'
                  }`}
                />
              ))}
          </div>

          <div className="flex w-[640px] items-center justify-end gap-3">
            <span className="mr-3 font-mono text-[22px] text-snow">
              {String(index + 1).padStart(2, '0')}
              <span className="text-graphite"> / {String(SLIDES.length).padStart(2, '0')}</span>
            </span>
            <ChromeButton label="Oldingi" onClick={onPrev}>
              <path d="M15 18 9 12l6-6" />
            </ChromeButton>
            <ChromeButton label="Keyingi" onClick={onNext}>
              <path d="m9 18 6-6-6-6" />
            </ChromeButton>
            <ChromeButton label={isFullscreen ? 'To‘liq ekrandan chiqish' : 'To‘liq ekran (F)'} onClick={onFullscreen}>
              {isFullscreen ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
            </ChromeButton>
          </div>
        </div>
      </div>
    </>
  )
}

function ChromeButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="grid size-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-snow/80 transition-colors hover:border-lime/50 hover:text-glow"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  )
}
