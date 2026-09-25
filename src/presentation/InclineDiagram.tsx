import { AnimatePresence, motion, useTime, useTransform } from 'framer-motion'
import { useId, useRef, type ReactNode } from 'react'
import { C, CAMERA_EASE, EASE } from './ui'

export type VecKind = 'mg' | 'N' | 'Fishq' | 'Fx' | 'Fy'
/** on — oddiy, hi — urg‘u berilgan, dim — xiralashtirilgan */
export type VecState = 'on' | 'hi' | 'dim'
export type CameraBox = { x: number; y: number; w: number; h: number }
/** wide — butun qiya tekislik, mid — biroz yaqin, block — jismga yaqinlashtirilgan */
export type Camera = 'wide' | 'mid' | 'block' | CameraBox

interface Vec {
  x: number
  y: number
}

// Dunyo koordinatalari (SVG, y pastga)
const W = 1600
const H = 900
const GROUND = 780
const HYP = 900
const A: Vec = { x: 1230, y: GROUND }
const BW = 110
const BH = 72
/** mg vektorining uzunligi; qolganlari unga nisbatan aniq masshtablanadi */
const L = 220
const START = 105
const END = HYP - 95

const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y })
const mul = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k })

interface InclineDiagramProps {
  angle?: number
  camera?: Camera
  vectors?: Partial<Record<VecKind, VecState>>
  showBlock?: boolean
  showAngle?: boolean
  /** mg va F_y orasidagi α burchagi (jism markazida) */
  showBlockAngle?: boolean
  /** mg ni tashkil etuvchilarga ajratuvchi parallelogramm chiziqlari */
  showGuides?: boolean
  /** Qiya tekislik chizilib paydo bo‘ladi */
  drawIn?: boolean
  /** Jism qiyalik bo‘ylab sirpanib tushishi (takrorlanuvchi) */
  sliding?: boolean
  /** Ishqalanish vektori uzunligi uchun μ (faqat tasvir) */
  mu?: number
  /** Jism joylashuvi: 0 — tepada, 1 — pastda */
  blockAt?: number
  className?: string
  labelSize?: number
  cameraDuration?: number
}

export function geometry(angle: number, blockAt = 0.36) {
  const a = (angle * Math.PI) / 180
  const cos = Math.cos(a)
  const sin = Math.sin(a)
  const d: Vec = { x: cos, y: sin }
  const n: Vec = { x: sin, y: -cos }
  const Cc: Vec = { x: A.x - HYP * cos, y: A.y - HYP * sin }
  const B: Vec = { x: Cc.x, y: GROUND }
  const centerAt = (t: number) => add(add(Cc, mul(d, START + t * (END - START))), mul(n, BH / 2))
  return { a, cos, sin, d, n, C: Cc, B, center: centerAt(blockAt), centerAt }
}

function cameraBox(camera: Camera, center: Vec): CameraBox {
  if (typeof camera === 'object') return camera
  if (camera === 'wide') return { x: 0, y: 0, w: W, h: H }
  // block ≈ 1.9× yaqinlashish: barcha vektorlar va yorliqlar kadrda qoladi
  const h = camera === 'mid' ? 640 : 480
  const w = (h * 16) / 9
  const cy = center.y + (camera === 'block' ? 12 : 0)
  return { x: center.x - w / 2, y: cy - h / 2, w, h }
}

const box = (b: CameraBox) => `${b.x} ${b.y} ${b.w} ${b.h}`

export function InclineDiagram({
  angle = 30,
  camera = 'wide',
  vectors = {},
  showBlock = true,
  showAngle = false,
  showBlockAngle = false,
  showGuides = false,
  drawIn = false,
  sliding = false,
  mu = 0.45,
  blockAt = 0.36,
  className,
  labelSize = 50,
  cameraDuration = 1,
}: InclineDiagramProps) {
  const uid = useId().replace(/:/g, '')
  const g = geometry(angle, blockAt)
  const { cos, sin, d, n } = g
  const vb = box(cameraBox(camera, g.center))

  // Vektorlar jism markaziga nisbatan (lokal koordinatalar)
  const tips: Record<VecKind, Vec> = {
    mg: { x: 0, y: L },
    Fx: mul(d, L * sin),
    Fy: mul(n, -L * cos),
    N: mul(n, L * cos),
    Fishq: mul(d, -mu * L * cos),
  }
  const colors: Record<VecKind, string> = { mg: C.mg, N: C.N, Fishq: C.Fishq, Fx: C.Fx, Fy: C.Fy }
  const labels: Record<VecKind, ReactNode> = {
    mg: 'mg',
    N: 'N',
    Fx: <Sub base="F" sub="x" size={labelSize} />,
    Fy: <Sub base="F" sub="y" size={labelSize} />,
    Fishq: <Sub base="F" sub="ishq" size={labelSize} />,
  }
  const order: VecKind[] = ['Fy', 'Fx', 'Fishq', 'N', 'mg']

  const arcR = 120
  const arcEnd = add(A, { x: -arcR * cos, y: -arcR * sin })
  const angleLabel = add(A, { x: -(arcR + 52) * Math.cos(g.a / 2), y: -(arcR + 52) * Math.sin(g.a / 2) })

  const start = g.centerAt(0.04)
  const end = g.centerAt(1)
  const loop = useSlideLoop(sliding, start, end, g.center)

  // Jism markazidagi α: mg (pastga) va F_y (tekislik tomon) orasida
  const bR = 84
  const bArcStart = { x: 0, y: bR }
  const bArcEnd = { x: -bR * sin, y: bR * cos }
  const bLabel = { x: -(bR + 34) * Math.sin(g.a / 2), y: (bR + 34) * Math.cos(g.a / 2) }

  return (
    <motion.svg
      className={className}
      viewBox={vb}
      initial={false}
      animate={{ viewBox: vb }}
      transition={{ duration: cameraDuration, ease: CAMERA_EASE }}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Qiya tekislikdagi jism va unga ta’sir etuvchi kuchlar"
    >
      <defs>
        <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#74872C" stopOpacity="0.5" />
          <stop offset="1" stopColor="#505B24" stopOpacity="0.06" />
        </linearGradient>
        <pattern id={`hatch-${uid}`} width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="18" stroke="#BCD357" strokeOpacity="0.1" strokeWidth="1.5" />
        </pattern>
        <pattern id={`ground-${uid}`} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="16" stroke="#9D9D9D" strokeOpacity="0.2" strokeWidth="1.3" />
        </pattern>
        <linearGradient id={`face-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f3519" />
          <stop offset="1" stopColor="#12140b" />
        </linearGradient>
        <filter id={`soft-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <radialGradient id={`spot-${uid}`}>
          <stop offset="0" stopColor="#BCD357" stopOpacity="0.14" />
          <stop offset="1" stopColor="#BCD357" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx={g.center.x} cy={g.center.y + 60} rx={620} ry={380} fill={`url(#spot-${uid})`} />

      {/* Gorizont */}
      <rect x={40} y={GROUND} width={W - 80} height={26} fill={`url(#ground-${uid})`} />
      <line x1={30} y1={GROUND} x2={W - 30} y2={GROUND} stroke="#9D9D9D" strokeOpacity={0.5} strokeWidth={2.5} />

      {/* Qiya tekislik */}
      <motion.g
        initial={drawIn ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: drawIn ? 0.5 : 0 }}
      >
        <polygon points={`${g.C.x},${g.C.y} ${g.B.x},${g.B.y} ${A.x},${A.y}`} fill={`url(#fill-${uid})`} />
        <polygon points={`${g.C.x},${g.C.y} ${g.B.x},${g.B.y} ${A.x},${A.y}`} fill={`url(#hatch-${uid})`} />
        <line x1={g.C.x} y1={g.C.y} x2={g.B.x} y2={g.B.y} stroke="#565656" strokeWidth={2} strokeDasharray="6 8" />
        <path d={`M ${g.B.x + 26} ${GROUND} L ${g.B.x + 26} ${GROUND - 26} L ${g.B.x} ${GROUND - 26}`} fill="none" stroke="#565656" strokeWidth={2} />
      </motion.g>
      <line x1={g.C.x} y1={g.C.y} x2={A.x} y2={A.y} stroke="#BCD357" strokeWidth={16} strokeOpacity={0.22} filter={`url(#soft-${uid})`} />
      <motion.path
        d={`M ${g.C.x} ${g.C.y} L ${A.x} ${A.y}`}
        stroke={C.glow}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        initial={drawIn ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
      />

      {/* α burchagi */}
      <AnimatePresence>
        {showAngle && (
          <motion.g key="angle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <motion.path
              d={`M ${A.x - arcR} ${A.y} A ${arcR} ${arcR} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
              fill="none"
              stroke={C.glow}
              strokeWidth={4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
            <path d={`M ${A.x} ${A.y} L ${A.x - arcR} ${A.y} A ${arcR} ${arcR} 0 0 1 ${arcEnd.x} ${arcEnd.y} Z`} fill={C.glow} fillOpacity={0.1} />
            <motion.text
              x={angleLabel.x}
              y={angleLabel.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={C.glow}
              fontSize={60}
              fontWeight={700}
              style={{ fontFamily: 'var(--font-display)' }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
            >
              α
            </motion.text>
          </motion.g>
        )}
      </AnimatePresence>
      <circle cx={A.x} cy={A.y} r={6} fill={C.glow} />

      {/* Jism va unga bog‘langan vektorlar (lokal koordinatalar) */}
      {showBlock && (
        <motion.g style={loop}>
          <Block angle={angle} uid={uid} />

          {/* Parallelogramm yordamchi chiziqlari */}
          <AnimatePresence>
            {showGuides && (
              <motion.g
                key="guides"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                stroke="#9D9D9D"
                strokeOpacity={0.6}
                strokeWidth={2.2}
                strokeDasharray="7 9"
              >
                <line x1={tips.mg.x} y1={tips.mg.y} x2={tips.Fx.x} y2={tips.Fx.y} />
                <line x1={tips.mg.x} y1={tips.mg.y} x2={tips.Fy.x} y2={tips.Fy.y} />
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {order.map((k) => {
              const state = vectors[k]
              if (!state) return null
              return (
                <Arrow
                  key={k}
                  uid={uid}
                  to={tips[k]}
                  color={colors[k]}
                  state={state}
                  dashed={k === 'Fx' || k === 'Fy'}
                  label={labels[k]}
                  labelSize={labelSize}
                  side={k === 'mg' ? 'right' : k === 'Fy' ? 'left' : 'auto'}
                  // Ishqalanish yorlig‘i qiyalik chizig‘ini kesib o‘tmasligi uchun sirtdan tashqariga suriladi
                  nudge={k === 'Fishq' ? mul(n, 36) : undefined}
                />
              )
            })}
          </AnimatePresence>

          {/* mg va F_y orasidagi α */}
          <AnimatePresence>
            {showBlockAngle && (
              <motion.g key="b-angle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <path
                  d={`M ${bArcStart.x} ${bArcStart.y} A ${bR} ${bR} 0 0 1 ${bArcEnd.x} ${bArcEnd.y}`}
                  fill="none"
                  stroke={C.glow}
                  strokeWidth={3.5}
                />
                <text
                  x={bLabel.x}
                  y={bLabel.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={C.glow}
                  fontSize={38}
                  fontWeight={700}
                  stroke="#010101"
                  strokeWidth={6}
                  paintOrder="stroke"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  α
                </text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Kuchlar qo‘yilgan nuqta */}
          <circle r={13} fill="none" stroke={C.glow} strokeOpacity={0.6} strokeWidth={2.5} />
          <circle r={6.5} fill={C.glow} />
        </motion.g>
      )}
    </motion.svg>
  )
}

const LOOP_MS = 3400
const SLIDE_MS = 2600

/**
 * Jismning qiyalik bo‘ylab tekis tezlanuvchan sirpanishi (s ~ t²), takrorlanadi.
 * Vaqtga bog‘liq transformatsiya — React qayta chizilmaydi.
 */
function useSlideLoop(active: boolean, start: Vec, end: Vec, rest: Vec) {
  const ref = useRef({ active, start, end, rest })
  ref.current = { active, start, end, rest }
  const time = useTime()
  const phase = (t: number) => Math.min((t % LOOP_MS) / SLIDE_MS, 1)
  const x = useTransform(time, (t) => {
    const r = ref.current
    if (!r.active) return r.rest.x
    const k = phase(t)
    return r.start.x + (r.end.x - r.start.x) * k * k
  })
  const y = useTransform(time, (t) => {
    const r = ref.current
    if (!r.active) return r.rest.y
    const k = phase(t)
    return r.start.y + (r.end.y - r.start.y) * k * k
  })
  const opacity = useTransform(time, (t) => {
    if (!ref.current.active) return 1
    const k = phase(t)
    return k < 0.08 ? k / 0.08 : k > 0.92 ? Math.max(0, (1 - k) / 0.08) : 1
  })
  return { x, y, opacity }
}

function Sub({ base, sub, size }: { base: string; sub: string; size: number }) {
  return (
    <>
      {base}
      <tspan baselineShift="sub" fontSize={size * 0.64}>
        {sub}
      </tspan>
    </>
  )
}

function Block({ angle, uid }: { angle: number; uid: string }) {
  const hw = BW / 2
  const hh = BH / 2
  const dx = 15
  const dy = -13
  return (
    <g transform={`rotate(${angle})`}>
      <rect x={-hw} y={-hh} width={BW} height={BH} rx={12} fill="#BCD357" opacity={0.3} filter={`url(#soft-${uid})`} />
      <polygon
        points={`${-hw + 8},${-hh} ${-hw + 8 + dx},${-hh + dy} ${hw + dx},${-hh + dy} ${hw},${-hh}`}
        fill="#4d5822"
        stroke="#BCD357"
        strokeOpacity={0.6}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <polygon
        points={`${hw},${-hh} ${hw + dx},${-hh + dy} ${hw + dx},${hh + dy - 2} ${hw},${hh}`}
        fill="#1d2110"
        stroke="#BCD357"
        strokeOpacity={0.45}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <rect x={-hw} y={-hh} width={BW} height={BH} rx={9} fill={`url(#face-${uid})`} fillOpacity={0.85} stroke={C.glow} strokeWidth={3} />
      <text x={-hw + 12} y={-hh + 24} fill={C.glow} fillOpacity={0.85} fontSize={20} fontWeight={700} style={{ fontFamily: 'var(--font-mono)' }}>
        m
      </text>
    </g>
  )
}

interface ArrowProps {
  uid: string
  to: Vec
  color: string
  state: VecState
  dashed: boolean
  label: ReactNode
  labelSize: number
  side: 'auto' | 'left' | 'right'
  nudge?: Vec
}

/** Jism markazidan o‘sib chiquvchi kuch vektori */
function Arrow({ uid, to, color, state, dashed, label, labelSize, side, nudge }: ArrowProps) {
  const len = Math.hypot(to.x, to.y)
  if (len < 4) return null
  const ux = to.x / len
  const uy = to.y / len
  const head = Math.min(30, len * 0.5)
  const neck = { x: to.x - ux * head, y: to.y - uy * head }
  const deg = (Math.atan2(uy, ux) * 180) / Math.PI
  const width = state === 'hi' ? 9 : 7

  // Yorliq jism ichida qolib ketmasligi uchun eng kamida 96 birlik uzoqlikda
  const ld = Math.max(len, 96) + 26
  let lx = ux * ld
  const ly = uy * ld
  let anchor: 'start' | 'middle' | 'end' = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle'
  if (side === 'right') {
    anchor = 'start'
    lx = to.x + 26
  } else if (side === 'left') {
    anchor = 'end'
    lx = ux * ld - 8
  }
  const baseline = side === 'right' ? 'central' : uy > 0.35 ? 'hanging' : uy < -0.35 ? 'alphabetic' : 'central'
  const labelY = (side === 'right' ? to.y - 18 : ly) + (nudge?.y ?? 0)
  lx += nudge?.x ?? 0

  const grow = { duration: 0.65, ease: EASE }

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: state === 'dim' ? 0.16 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      {state === 'hi' && (
        <motion.line
          x1={0}
          y1={0}
          initial={{ x2: 0, y2: 0 }}
          animate={{ x2: neck.x, y2: neck.y }}
          transition={grow}
          stroke={color}
          strokeOpacity={0.4}
          strokeWidth={26}
          strokeLinecap="round"
          filter={`url(#soft-${uid})`}
        />
      )}
      <motion.line
        x1={0}
        y1={0}
        initial={{ x2: 0, y2: 0 }}
        animate={{ x2: neck.x, y2: neck.y }}
        transition={grow}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '16 11' : undefined}
      />
      <motion.g initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: to.x, y: to.y, opacity: 1 }} transition={grow}>
        <polygon points={`0,0 ${-head},${-head * 0.45} ${-head},${head * 0.45}`} transform={`rotate(${deg})`} fill={color} />
      </motion.g>
      <motion.text
        x={lx}
        y={labelY}
        textAnchor={anchor}
        dominantBaseline={baseline}
        fill={color}
        fontSize={labelSize}
        fontWeight={700}
        stroke="#010101"
        strokeWidth={8}
        strokeLinejoin="round"
        paintOrder="stroke"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.45 }}
      >
        {label}
      </motion.text>
    </motion.g>
  )
}
