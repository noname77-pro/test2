import { AnimatePresence, motion } from 'framer-motion'
import type { SimStatus } from '../hooks/useSimulation'
import { fmt } from '../lib/format'
import { PLANE_LENGTH, type ForceSummary } from '../lib/physics'

interface StatusCardProps {
  status: SimStatus
  forces: ForceSummary
  v: number
  t: number
  a: number
  hidden?: boolean
  large?: boolean
}

type Tone = 'moving' | 'static' | 'ready' | 'done' | 'hidden' | 'braking'

interface View {
  key: string
  tone: Tone
  title: string
  subtitle: string
  text: string
}

function describe({ status, forces, v, t, a, hidden }: StatusCardProps): View {
  const par = `F_x = mg sin α = ${fmt(forces.parallel, 1)} N`
  const fr = `μmg cos α = ${fmt(forces.slidingFriction, 1)} N`

  if (hidden) {
    return {
      key: 'hidden',
      tone: 'hidden',
      title: 'TAXMIN KUTILMOQDA',
      subtitle: 'Natija hozircha yashirin',
      text: 'Avval sinf bilan birga taxmin qiling: jism sirpanadimi? Keyin simulyatsiya javobni ko‘rsatadi.',
    }
  }
  if (status === 'finished') {
    return {
      key: 'done',
      tone: 'done',
      title: 'JISM PASTGA YETIB KELDI',
      subtitle: `${PLANE_LENGTH} m yo‘l ${fmt(t, 2)} s da bosib o‘tildi`,
      text: `Oxirgi tezlik v = ${fmt(v, 2)} m/s. Tekis tezlanuvchan harakat: v = at, s = at²/2.`,
    }
  }
  if (v > 1e-6 && a < 0) {
    return {
      key: 'braking',
      tone: 'braking',
      title: 'JISM SEKINLASHMOQDA',
      subtitle: 'Ishqalanish kuchi harakatga qarshi',
      text: `Ishqalanish kuchi ${fr} ${par} dan katta — jism tormozlanib to‘xtaydi.`,
    }
  }
  if (v > 1e-6) {
    return {
      key: status === 'paused' ? 'paused' : 'moving',
      tone: 'moving',
      title: status === 'paused' ? 'PAUZA' : 'JISM HARAKATLANMOQDA',
      subtitle: status === 'paused' ? 'Holat saqlandi — davom ettirish uchun Boshlash' : 'Jism qiya tekislik bo‘ylab pastga harakatlanmoqda',
      text: `Og‘irlik kuchining qiya tekislik bo‘ylab tashkil etuvchisi ishqalanish kuchidan katta: ${par} > ${fr}.`,
    }
  }
  if (forces.slides) {
    return {
      key: 'ready',
      tone: 'ready',
      title: 'JISM PASTGA HARAKATLANADI',
      subtitle: status === 'running' ? 'Jism qiya tekislik bo‘ylab pastga harakatlanmoqda' : 'tan α > μ — «Boshlash» tugmasini bosing',
      text: `Og‘irlik kuchining qiya tekislik bo‘ylab tashkil etuvchisi ishqalanish kuchidan katta: ${par} > ${fr}.`,
    }
  }
  return {
    key: 'static',
    tone: 'static',
    title: 'JISM TINCH HOLATDA',
    subtitle: 'tan α ≤ μ — harakat sharti bajarilmadi',
    text: `Ishqalanish kuchi jismning sirpanishiga to‘sqinlik qilmoqda: ${par} ≤ ${fr}.`,
  }
}

const toneStyles: Record<Tone, { dot: string; title: string; ring: string }> = {
  moving: { dot: 'bg-glow shadow-[0_0_24px_#E9FD87]', title: 'text-glow', ring: 'border-lime/40' },
  ready: { dot: 'bg-lime shadow-[0_0_18px_#BCD357]', title: 'text-lime', ring: 'border-lime/30' },
  done: { dot: 'bg-glow shadow-[0_0_24px_#E9FD87]', title: 'text-glow', ring: 'border-lime/40' },
  static: { dot: 'bg-coral shadow-[0_0_18px_#FF8D6B]', title: 'text-snow', ring: 'border-coral/30' },
  braking: { dot: 'bg-coral shadow-[0_0_18px_#FF8D6B]', title: 'text-coral', ring: 'border-coral/35' },
  hidden: { dot: 'bg-fog', title: 'text-snow', ring: 'border-white/15' },
}

export function StatusCard(props: StatusCardProps) {
  const { forces, hidden, large } = props
  const view = describe(props)
  const tone = toneStyles[view.tone]

  // Kuchlar "tortishuvi": pastga tortuvchi kuch va unga qarshi ishqalanish μmg cos α
  const opposing = forces.slidingFriction
  const scale = Math.max(forces.parallel, opposing, 1e-6)

  return (
    <section
      className={`card overflow-hidden p-5 transition-colors duration-500 sm:p-6 ${tone.ring}`}
      aria-live="polite"
      aria-labelledby="status-title"
    >
      <div className="flex items-center gap-2 eyebrow">
        <span className={`size-2.5 rounded-full ${tone.dot} ${view.tone === 'moving' ? 'animate-pulse-soft' : ''}`} />
        Holat
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <h2
            id="status-title"
            className={`mt-3 font-display font-bold leading-[0.95] tracking-tight ${tone.title} ${
              large ? 'text-4xl xl:text-5xl' : 'text-3xl sm:text-[2.15rem]'
            }`}
          >
            {view.title}
          </h2>
          <p className="mt-2 font-mono text-sm text-lime/90">{view.subtitle}</p>
          <p className={`mt-3 leading-relaxed text-snow/80 ${large ? 'text-lg' : ''}`}>{view.text}</p>
        </motion.div>
      </AnimatePresence>

      {!hidden && (
        <div className="mt-5 space-y-2.5">
          <ForceBar label="F_x = mg sin α" hint="pastga tortadi" value={forces.parallel} scale={scale} color="bg-amber" />
          <ForceBar
            label="μmg cos α"
            hint="ishqalanish kuchi"
            value={opposing}
            scale={scale}
            color="bg-coral"
          />
        </div>
      )}
    </section>
  )
}

function ForceBar({ label, hint, value, scale, color }: { label: string; hint: string; value: number; scale: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between font-mono text-xs">
        <span className="text-snow">
          {label} <span className="text-fog">· {hint}</span>
        </span>
        <span className="tabular text-snow">{fmt(value, 1)} N</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={false}
          animate={{ width: `${(value / scale) * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>
    </div>
  )
}
