import { motion, type Variants } from 'framer-motion'
import { useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Tex } from '../components/ui/Tex'

/** Slaydlar 1920×1080 «kanvas»da chiziladi va ekranga proporsional moslashadi */
export const CANVAS_W = 1920
export const CANVAS_H = 1080

export const EASE = [0.22, 1, 0.36, 1] as const
export const CAMERA_EASE = [0.65, 0, 0.35, 1] as const

export function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <div
      className="absolute top-1/2 left-1/2 origin-center"
      style={{ width: CANVAS_W, height: CANVAS_H, transform: `translate(-50%, -50%) scale(${scale})` }}
    >
      {children}
    </div>
  )
}

/** Fon: nozik to‘r, yorug‘lik dog‘lari va sekin suzuvchi zarrachalar */
export function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_35%,transparent_100%)]" />
      <div className="absolute -top-48 left-1/2 h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-lime/[0.07] blur-[130px]" />
      <div className="absolute -right-40 bottom-0 h-[420px] w-[520px] rounded-full bg-olive/[0.08] blur-[120px]" />
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle absolute rounded-full bg-glow"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.s,
              height: p.s,
              opacity: p.o,
              animationDuration: `${p.d}s`,
              animationDelay: `${-p.d * p.x * 0.01}s`,
            } as CSSProperties
          }
        />
      ))}
      <div className="bg-noise absolute -inset-[20%]" />
    </div>
  )
}

// Deterministik "tasodifiy" zarrachalar (har yuklanishda bir xil)
const PARTICLES = Array.from({ length: 34 }, (_, i) => {
  const r = (k: number) => {
    const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453
    return v - Math.floor(v)
  }
  return { x: r(1) * 100, y: r(2) * 100, s: 1.5 + r(3) * 2.5, o: 0.12 + r(4) * 0.3, d: 14 + r(5) * 18 }
})

type RevealVariant = 'up' | 'fade' | 'blur' | 'zoom' | 'left' | 'right'

const REVEAL: Record<RevealVariant, Variants> = {
  up: { hidden: { opacity: 0, y: 28 }, shown: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, shown: { opacity: 1 } },
  blur: { hidden: { opacity: 0, filter: 'blur(14px)' }, shown: { opacity: 1, filter: 'blur(0px)' } },
  zoom: { hidden: { opacity: 0, scale: 0.86, filter: 'blur(8px)' }, shown: { opacity: 1, scale: 1, filter: 'blur(0px)' } },
  left: { hidden: { opacity: 0, x: -40 }, shown: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, shown: { opacity: 1, x: 0 } },
}

interface RevealProps {
  show: boolean
  variant?: RevealVariant
  delay?: number
  duration?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/** Qadamma-qadam paydo bo‘luvchi blok. Joy oldindan band — maket siljimaydi */
export function Reveal({ show, variant = 'up', delay = 0, duration = 0.55, className, style, children }: RevealProps) {
  return (
    <motion.div
      className={className}
      style={{ ...style, pointerEvents: show ? undefined : 'none' }}
      variants={REVEAL[variant]}
      initial="hidden"
      animate={show ? 'shown' : 'hidden'}
      transition={{ duration, delay: show ? delay : 0, ease: EASE }}
      aria-hidden={!show}
    >
      {children}
    </motion.div>
  )
}

/** Muhim formula uchun «kamera» urg‘usi: loyqadan aniq holatga, yengil yaqinlashish bilan */
export function Emphasis({ show, children, className }: { show: boolean; children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={
        show
          ? { opacity: 1, scale: [0.72, 1.06, 1], filter: ['blur(16px)', 'blur(0px)', 'blur(0px)'] }
          : { opacity: 0, scale: 0.72, filter: 'blur(16px)' }
      }
      transition={{ duration: 0.8, ease: EASE, times: [0, 0.65, 1] }}
      style={{ pointerEvents: show ? undefined : 'none' }}
    >
      {children}
    </motion.div>
  )
}

export function Formula({ tex, className }: { tex: string; className?: string }) {
  return <Tex math={tex} className={className} />
}

interface SlideShellProps {
  number: number
  eyebrow: string
  title: string
  children: ReactNode
}

/** Slayd ramkasi: katta sarlavha va mazmun maydoni */
export function SlideShell({ number, eyebrow, title, children }: SlideShellProps) {
  return (
    <div className="absolute inset-0 flex flex-col px-[120px] pt-[78px] pb-[120px]">
      <header>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="flex items-center gap-4 font-mono text-[20px] tracking-[0.22em] text-lime uppercase"
        >
          <span className="text-glow">{String(number).padStart(2, '0')}</span>
          <span className="h-px w-12 bg-lime/50" />
          <span className="text-fog">{eyebrow}</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="mt-4 font-display text-[68px] leading-[1.02] font-bold tracking-[-0.03em]"
        >
          {title}
        </motion.h2>
      </header>
      <div className="relative mt-10 min-h-0 flex-1">{children}</div>
    </div>
  )
}

/** Vektor ranglari simulyator bilan bir xil */
export const C = {
  mg: '#FBFAFB',
  N: '#BCD357',
  Fishq: '#FF8D6B',
  Fx: '#FFD166',
  Fy: '#9DB0FF',
  glow: '#E9FD87',
} as const

/** KaTeX uchun rangli belgilar */
export const T = {
  Fx: `\\textcolor{${C.Fx}}{F_x}`,
  Fy: `\\textcolor{${C.Fy}}{F_y}`,
  N: `\\textcolor{${C.N}}{N}`,
  Fishq: `\\textcolor{${C.Fishq}}{F_{\\text{ishq}}}`,
  mg: `\\textcolor{${C.mg}}{mg}`,
} as const
