import { motion } from 'framer-motion'
import { useState } from 'react'
import { fmt } from '../../lib/format'
import { PLANE_LENGTH, timeToBottom } from '../../lib/physics'
import { DEFAULT_PARAMS } from '../../lib/presets'
import { Feedback, OptionButton, Tile } from './LessonUI'

const ANGLES = [15, 30, 45] as const

/**
 * Pastga yetish vaqti mavjud fizika moduli orqali hisoblanadi (m = 5 kg, μ = 0.20, g = 9.81 m/s²).
 * Jism tinch holatdan tekis tezlanuvchan harakat qiladi: s/L = (t/T)², shuning uchun «poyga» shu qonun bo‘yicha chiziladi.
 */
const RACE = ANGLES.map((angleDeg) => ({
  angleDeg,
  time: timeToBottom({ angleDeg, mass: DEFAULT_PARAMS.mass, mu: DEFAULT_PARAMS.mu, g: 9.81 }) ?? Infinity,
}))
const WINNER = RACE.reduce((a, b) => (b.time < a.time ? b : a)).angleDeg
const quadratic = (t: number) => t * t

/** «Kim tez topadi?» — kichik o‘yin */
export function SpeedChallenge() {
  const [pick, setPick] = useState<number | null>(null)
  const [race, setRace] = useState(0)
  const [finished, setFinished] = useState<number[]>([])

  const started = race > 0
  const done = finished.length === RACE.length

  const start = () => {
    setFinished([])
    setRace((r) => r + 1)
  }

  return (
    <Tile eyebrow="Mini musobaqa" title="Kim tez topadi?">
      <p className="font-medium leading-snug">Qaysi qiya tekislikda jism tezroq pastga harakat qiladi?</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {ANGLES.map((a) => (
          <OptionButton
            key={a}
            selected={pick === a}
            disabled={started}
            verdict={done && pick === a ? (a === WINNER ? 'correct' : 'wrong') : null}
            onClick={() => setPick(a)}
          >
            <span className="block text-center font-semibold">{a}°</span>
          </OptionButton>
        ))}
      </div>

      {!started ? (
        <button type="button" className="btn btn-primary mt-4 self-start" disabled={pick === null} onClick={start}>
          Natijani ko‘rish
        </button>
      ) : (
        <div className="mt-4 flex flex-1 flex-col gap-3">
          <div className="space-y-2.5" aria-label={`Poyga: ${PLANE_LENGTH} m yo‘l`}>
            {RACE.map((r) => (
              <div key={`${race}-${r.angleDeg}`} className="flex items-center gap-3">
                <span className="w-9 shrink-0 font-mono text-sm text-lime">{r.angleDeg}°</span>
                <div className="relative h-2.5 flex-1 rounded-full bg-white/[0.07]">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${r.angleDeg === WINNER && done ? 'bg-glow' : 'bg-lime/70'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: r.time, ease: quadratic }}
                    onAnimationComplete={() => setFinished((f) => (f.includes(r.angleDeg) ? f : [...f, r.angleDeg]))}
                  >
                    <span className="absolute top-1/2 -right-1.5 size-3.5 -translate-y-1/2 rounded-[4px] bg-glow shadow-[0_0_10px_#E9FD87]" />
                  </motion.div>
                </div>
                <span className="w-14 shrink-0 text-right font-mono text-xs text-fog">
                  {finished.includes(r.angleDeg) ? `${fmt(r.time, 2)} s` : '…'}
                </span>
              </div>
            ))}
          </div>
          {done && pick !== null && (
            <Feedback ok={pick === WINNER} title={pick === WINNER ? 'To‘g‘ri!' : `Tezroq: ${WINNER}°`}>
              Burchak qancha katta bo‘lsa, jism shuncha tez tushadi. {PLANE_LENGTH} m yo‘lni {WINNER}° da jism eng qisqa vaqtda
              bosib o‘tdi.
            </Feedback>
          )}
          {done && (
            <button
              type="button"
              className="btn btn-ghost mt-auto self-start"
              onClick={() => {
                setPick(null)
                setRace(0)
                setFinished([])
              }}
            >
              Qayta o‘ynash
            </button>
          )}
        </div>
      )}
    </Tile>
  )
}
