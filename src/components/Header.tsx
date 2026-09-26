import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fmt } from '../lib/format'

interface TopBarProps {
  actions: ReactNode
}

export function TopBar({ actions }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.05] bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1760px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <a href="#top" className="flex shrink-0 items-center gap-3">
          <Logo />
          <span className="hidden leading-tight md:block">
            <span className="block font-display text-[0.95rem] font-semibold tracking-tight">Qiya tekislik</span>
            <span className="block font-mono text-[0.65rem] tracking-[0.2em] text-fog uppercase">Fizika laboratoriyasi</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-fog 2xl:flex" aria-label="Bo‘limlar">
          <a href="#simulyatsiya" className="transition-colors hover:text-glow">Simulyatsiya</a>
          <a href="#grafik" className="transition-colors hover:text-glow">Grafik</a>
          <a href="#formulalar" className="transition-colors hover:text-glow">Formulalar</a>
          <a href="#tushuntirish" className="transition-colors hover:text-glow">Tushuntirish</a>
        </nav>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">{actions}</div>
      </div>
    </header>
  )
}

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="18" fill="#121410" stroke="#BCD357" strokeOpacity=".35" />
      <path d="M12 48 L52 48 L12 22 Z" fill="#505B24" fillOpacity=".6" stroke="#E9FD87" strokeWidth="2.5" strokeLinejoin="round" />
      <g transform="translate(27 31.5) rotate(33)">
        <rect x="-6.5" y="-9" width="13" height="9" rx="2" fill="#E9FD87" />
      </g>
    </svg>
  )
}

interface HeroProps {
  angle: number
  acceleration: number
  g: number
  planetName: string
  /** Taxmin rejimida natijani oldindan ko‘rsatmaslik uchun */
  hidden?: boolean
}

export function Hero({ angle, acceleration, g, planetName, hidden }: HeroProps) {
  return (
    <section id="top" className="relative pt-10 pb-8 sm:pt-16 lg:pt-20 lg:pb-12">
      <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-lime/30 bg-lime/[0.06] px-4 py-1.5 font-mono text-xs tracking-wide text-glow"
          >
            <span className="size-1.5 animate-pulse-soft rounded-full bg-glow shadow-[0_0_10px_#E9FD87]" />
            Fizika • Mexanika • Interaktiv simulyatsiya
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="mt-6 font-display text-[clamp(2.4rem,7.2vw,7.4rem)] leading-[0.9] font-bold tracking-[-0.045em]"
          >
            QIYA TEKISLIK
            <span className="block bg-gradient-to-r from-glow via-lime to-olive bg-clip-text text-transparent">
              LABORATORIYASI
            </span>
          </motion.h1>

          {/* Yorug‘lik o‘tib turadigan lime chiziq */}
          <div className="relative mt-7 h-px w-full max-w-3xl overflow-hidden bg-gradient-to-r from-lime/60 via-lime/15 to-transparent">
            <span className="absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-glow to-transparent" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-fog sm:text-xl"
          >
            Jism harakatini kuchlar, ishqalanish va burchak orqali interaktiv o‘rganing
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:block"
        >
          <HeroGlyph angle={angle} acceleration={hidden ? 0 : acceleration} g={g} planetName={planetName} hidden={hidden} />
        </motion.div>
      </div>
    </section>
  )
}

/** Hero dagi kichik jonli belgi: joriy α burchagini aks ettiradi */
function HeroGlyph({ angle, acceleration, g, planetName, hidden }: HeroProps) {
  const size = 260
  const rad = (angle * Math.PI) / 180
  const L = 210
  const A = { x: size - 20, y: size - 40 }
  const C = { x: A.x - L * Math.cos(rad), y: A.y - L * Math.sin(rad) }

  return (
    <div className="card card-glow relative w-[300px] overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Joriy tajriba</span>
        <span className="font-mono text-xs text-lime">{planetName}</span>
      </div>
      <svg viewBox={`0 0 ${size} ${size - 20}`} className="mt-2 w-full" aria-hidden="true">
        <line x1="10" y1={A.y} x2={size - 6} y2={A.y} stroke="#565656" strokeDasharray="3 5" />
        <motion.path
          initial={false}
          d={`M ${C.x} ${C.y} L ${C.x} ${A.y} L ${A.x} ${A.y} Z`}
          animate={{ d: `M ${C.x} ${C.y} L ${C.x} ${A.y} L ${A.x} ${A.y} Z` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          fill="rgba(116,135,44,0.25)"
          stroke="#E9FD87"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Nuqta transform orqali harakatlanadi (atributlar emas) */}
        <motion.g
          initial={false}
          animate={
            acceleration > 0
              ? { x: [C.x + 8 * Math.cos(rad), A.x - 12 * Math.cos(rad)], y: [C.y + 8 * Math.sin(rad) - 7, A.y - 12 * Math.sin(rad) - 7], opacity: [0, 1, 1, 0] }
              : { x: C.x + 60 * Math.cos(rad), y: C.y + 60 * Math.sin(rad) - 7, opacity: 1 }
          }
          transition={
            acceleration > 0
              ? { duration: Math.max(1.2, 6 / Math.sqrt(acceleration)), repeat: Infinity, ease: 'easeIn', repeatDelay: 0.4 }
              : { duration: 0.4 }
          }
        >
          <circle r="6" fill="#E9FD87" style={{ filter: 'drop-shadow(0 0 8px #E9FD87)' }} />
        </motion.g>
      </svg>
      <div className="mt-1 grid grid-cols-3 gap-2 font-mono text-xs">
        <div>
          <div className="text-fog">α</div>
          <div className="text-base text-snow">{fmt(angle, 0)}°</div>
        </div>
        <div>
          <div className="text-fog">g</div>
          <div className="text-base text-snow">{fmt(g, 2)}</div>
        </div>
        <div>
          <div className="text-fog">a</div>
          <div className="text-base text-glow">{hidden ? '?' : fmt(acceleration, 2)}</div>
        </div>
      </div>
    </div>
  )
}
