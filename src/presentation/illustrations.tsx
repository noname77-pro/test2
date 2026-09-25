import { AnimatePresence, motion } from 'framer-motion'
import { C, EASE } from './ui'

/* ---------------------------------------------------------------------------
 * 3-slayd: yukni tik va qiya tekislik bo‘ylab ko‘tarish
 * ------------------------------------------------------------------------- */

interface LiftSceneProps {
  mode: 'vertical' | 'ramp'
  showForce: boolean
}

export function LiftScene({ mode, showForce }: LiftSceneProps) {
  const ground = 400
  const top = 150
  const platX = 520
  // Qiyalik: (150, 400) → (520, 150)
  const rampAngle = Math.atan2(ground - top, platX - 150)
  const rampDeg = (rampAngle * 180) / Math.PI
  const t = 0.42
  const rp = { x: 150 + (platX - 150) * t, y: ground - (ground - top) * t }
  // Qiyalik sirtidan tashqariga (yuqoriga) normal
  const nx = -Math.sin(rampAngle)
  const ny = -Math.cos(rampAngle)
  const crate = mode === 'vertical' ? { x: 420, y: ground - 32 } : { x: rp.x + nx * 32, y: rp.y + ny * 32 }
  const Fvert = 200
  const Framp = Fvert * Math.sin(rampAngle)
  const dir = mode === 'vertical' ? { x: 0, y: -1 } : { x: Math.cos(rampAngle), y: -Math.sin(rampAngle) }
  const F = mode === 'vertical' ? Fvert : Framp
  const tip = { x: crate.x + dir.x * F, y: crate.y + dir.y * F }

  return (
    <svg viewBox="0 0 800 470" className="h-full w-full" role="img" aria-label={mode === 'vertical' ? 'Yukni tik ko‘tarish' : 'Yukni qiya tekislik bo‘ylab ko‘tarish'}>
      <line x1={30} y1={ground} x2={770} y2={ground} stroke="#9D9D9D" strokeOpacity={0.5} strokeWidth={2.5} />
      {/* Supa */}
      <rect x={platX} y={top} width={220} height={ground - top} fill="rgba(116,135,44,0.18)" stroke="#565656" strokeWidth={2} />
      <line x1={platX} y1={top} x2={platX + 220} y2={top} stroke={C.glow} strokeWidth={4} />
      {/* Balandlik h */}
      <g stroke="#9D9D9D" strokeWidth={2}>
        <line x1={platX + 250} y1={top} x2={platX + 250} y2={ground} strokeDasharray="5 6" />
        <line x1={platX + 238} y1={top} x2={platX + 262} y2={top} />
        <line x1={platX + 238} y1={ground} x2={platX + 262} y2={ground} />
      </g>
      <text x={platX + 272} y={(top + ground) / 2} dominantBaseline="central" fill="#FBFAFB" fontSize={34} fontWeight={700} style={{ fontFamily: 'var(--font-display)' }}>
        h
      </text>

      {mode === 'ramp' && (
        <>
          <polygon points={`150,${ground} ${platX},${top} ${platX},${ground}`} fill="rgba(116,135,44,0.28)" />
          <line x1={150} y1={ground} x2={platX} y2={top} stroke={C.glow} strokeWidth={4} strokeLinecap="round" />
        </>
      )}

      {/* Yo‘l */}
      {mode === 'vertical' ? (
        <line x1={420} y1={ground - 70} x2={420} y2={top - 10} stroke="#FBFAFB" strokeOpacity={0.35} strokeWidth={2.5} strokeDasharray="8 8" />
      ) : (
        <line
          x1={crate.x + dir.x * 50}
          y1={crate.y + dir.y * 50}
          x2={platX - 10}
          y2={top - 36}
          stroke="#FBFAFB"
          strokeOpacity={0.35}
          strokeWidth={2.5}
          strokeDasharray="8 8"
        />
      )}

      {/* Yuk */}
      <g transform={`translate(${crate.x} ${crate.y}) rotate(${mode === 'ramp' ? -rampDeg : 0})`}>
        <rect x={-40} y={-32} width={80} height={64} rx={8} fill="#1b1f10" stroke={C.glow} strokeWidth={3} />
        <line x1={-40} y1={-32} x2={40} y2={32} stroke={C.glow} strokeOpacity={0.35} strokeWidth={2} />
        <line x1={40} y1={-32} x2={-40} y2={32} stroke={C.glow} strokeOpacity={0.35} strokeWidth={2} />
      </g>

      <AnimatePresence>
        {showForce && (
          <motion.g key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.line
              x1={crate.x}
              y1={crate.y}
              initial={{ x2: crate.x, y2: crate.y }}
              animate={{ x2: tip.x - dir.x * 24, y2: tip.y - dir.y * 24 }}
              transition={{ duration: 0.7, ease: EASE }}
              stroke={C.N}
              strokeWidth={8}
              strokeLinecap="round"
            />
            <motion.polygon
              points={`${tip.x},${tip.y} ${tip.x - dir.x * 28 - dir.y * 13},${tip.y - dir.y * 28 + dir.x * 13} ${tip.x - dir.x * 28 + dir.y * 13},${tip.y - dir.y * 28 - dir.x * 13}`}
              fill={C.N}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
            <motion.text
              x={tip.x + (mode === 'vertical' ? -24 : -8)}
              y={tip.y + (mode === 'vertical' ? 30 : -22)}
              textAnchor="end"
              fill={C.N}
              fontSize={40}
              fontWeight={700}
              stroke="#010101"
              strokeWidth={7}
              paintOrder="stroke"
              style={{ fontFamily: 'var(--font-display)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {mode === 'vertical' ? 'F = mg' : 'F < mg'}
            </motion.text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

/* ---------------------------------------------------------------------------
 * 4-slayd: hayotiy misollar uchun chiziqli belgilar
 * ------------------------------------------------------------------------- */

export type ExampleKind = 'ramp' | 'mountain' | 'loading'

export function ExampleIcon({ kind }: { kind: ExampleKind }) {
  const common = { fill: 'none', stroke: C.glow, strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <svg viewBox="0 0 96 80" width={96} height={80} aria-hidden="true">
      {kind === 'ramp' && (
        <g {...common}>
          <path d="M8 66 H88 V34 Z" fill="rgba(188,211,87,0.15)" />
          <path d="M14 50 L86 18" strokeOpacity={0.7} />
          <path d="M30 43 V60 M58 31 V48 M86 18 V34" strokeOpacity={0.7} />
        </g>
      )}
      {kind === 'mountain' && (
        <g {...common}>
          <path d="M4 68 L34 20 L50 42 L62 28 L92 68 Z" fill="rgba(188,211,87,0.12)" />
          <path d="M22 66 C40 58 26 50 44 46 C60 42 52 36 62 32" strokeDasharray="5 6" strokeOpacity={0.9} />
        </g>
      )}
      {kind === 'loading' && (
        <g {...common}>
          <rect x={46} y={18} width={42} height={34} rx={3} fill="rgba(188,211,87,0.12)" />
          <path d="M8 66 L46 50" />
          <path d="M4 66 H92" strokeOpacity={0.6} />
          <circle cx={56} cy={60} r={6} />
          <circle cx={80} cy={60} r={6} />
          <rect x={18} y={48} width={12} height={10} rx={2} transform="rotate(-23 24 53)" />
        </g>
      )}
    </svg>
  )
}

/* ---------------------------------------------------------------------------
 * 11-slayd: turli burchakli qiya tekisliklar
 * ------------------------------------------------------------------------- */

interface MiniInclineProps {
  angle: number
  showFx: boolean
  highlight?: boolean
}

export function MiniIncline({ angle, showFx, highlight = false }: MiniInclineProps) {
  const a = (angle * Math.PI) / 180
  const cos = Math.cos(a)
  const sin = Math.sin(a)
  const A = { x: 560, y: 350 }
  const hyp = 440
  const Cc = { x: A.x - hyp * cos, y: A.y - hyp * sin }
  const along = hyp * 0.36
  const center = { x: Cc.x + cos * along + sin * 24, y: Cc.y + sin * along - cos * 24 }
  const L = 140
  const fx = { x: cos * L * sin, y: sin * L * sin }
  const arcR = 70
  const labelA = { x: A.x - (arcR + 36) * Math.cos(a / 2), y: A.y - (arcR + 36) * Math.sin(a / 2) }

  return (
    <svg viewBox="0 0 620 480" className="h-full w-full" role="img" aria-label={`Qiyalik burchagi ${angle} gradus`}>
      <line x1={20} y1={A.y} x2={600} y2={A.y} stroke="#9D9D9D" strokeOpacity={0.5} strokeWidth={2.5} />
      <polygon points={`${Cc.x},${Cc.y} ${Cc.x},${A.y} ${A.x},${A.y}`} fill={highlight ? 'rgba(188,211,87,0.28)' : 'rgba(116,135,44,0.22)'} />
      <line x1={Cc.x} y1={Cc.y} x2={A.x} y2={A.y} stroke={C.glow} strokeWidth={4.5} strokeLinecap="round" />
      <path d={`M ${A.x - arcR} ${A.y} A ${arcR} ${arcR} 0 0 1 ${A.x - arcR * cos} ${A.y - arcR * sin}`} fill="none" stroke={C.glow} strokeWidth={3} />
      <text x={labelA.x - 6} y={labelA.y} textAnchor="end" dominantBaseline="central" fill={C.glow} fontSize={34} fontWeight={700} style={{ fontFamily: 'var(--font-display)' }}>
        α
      </text>

      <g transform={`translate(${center.x} ${center.y})`}>
        <g transform={`rotate(${angle})`}>
          <rect x={-34} y={-24} width={68} height={48} rx={7} fill="#1b1f10" fillOpacity={0.85} stroke={C.glow} strokeWidth={3} />
        </g>
        {/* mg — hamma holatda bir xil */}
        <line x1={0} y1={0} x2={0} y2={L - 20} stroke={C.mg} strokeWidth={6} strokeLinecap="round" />
        <polygon points={`0,${L} -11,${L - 22} 11,${L - 22}`} fill={C.mg} />
        <text x={18} y={L - 6} fill={C.mg} fontSize={34} fontWeight={700} stroke="#010101" strokeWidth={6} paintOrder="stroke" style={{ fontFamily: 'var(--font-display)' }}>
          mg
        </text>
        <AnimatePresence>
          {showFx && (
            <motion.g key="fx" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line
                x1={0}
                y1={0}
                initial={{ x2: 0, y2: 0 }}
                animate={{ x2: fx.x - cos * 18, y2: fx.y - sin * 18 }}
                transition={{ duration: 0.7, ease: EASE }}
                stroke={C.Fx}
                strokeWidth={7}
                strokeLinecap="round"
                strokeDasharray="12 8"
              />
              <motion.g initial={{ x: 0, y: 0 }} animate={{ x: fx.x, y: fx.y }} transition={{ duration: 0.7, ease: EASE }}>
                <polygon points="0,0 -22,-10 -22,10" transform={`rotate(${angle})`} fill={C.Fx} />
              </motion.g>
              <motion.text
                x={Math.max(fx.x, 44) + 14}
                y={Math.max(fx.y, 20) + 34}
                fill={C.Fx}
                fontSize={36}
                fontWeight={700}
                stroke="#010101"
                strokeWidth={6}
                paintOrder="stroke"
                style={{ fontFamily: 'var(--font-display)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                F<tspan baselineShift="sub" fontSize={23}>x</tspan>
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>
        <circle r={5} fill={C.glow} />
      </g>
    </svg>
  )
}
