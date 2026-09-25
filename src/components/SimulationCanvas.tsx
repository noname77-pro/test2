import { useMemo } from 'react'
import { fmt } from '../lib/format'
import { PLANE_LENGTH, summarizeForces, toRad, type PhysicsParams } from '../lib/physics'
import { ForceVector, type Vec } from './ForceVector'

export interface VectorVisibility {
  weight: boolean
  normal: boolean
  friction: boolean
  components: boolean
}

export const VECTOR_COLORS = {
  weight: '#FBFAFB',
  normal: '#BCD357',
  friction: '#FF8D6B',
  parallel: '#FFD166',
  perpendicular: '#9DB0FF',
} as const

interface SimulationCanvasProps {
  params: PhysicsParams
  /** Silliq animatsiya uchun ko‘rsatiladigan burchak (fizika params.angleDeg bilan hisoblanadi) */
  displayAngle: number
  s: number
  v: number
  visibility: VectorVisibility
  /** Ekrandagi kenglik (px) — mobil qurilmada yozuvlarni kattalashtirish uchun */
  width: number
  projector?: boolean
  hideHints?: boolean
}

// SVG koordinatalari (y pastga qarab o‘sadi)
const VB_W = 860
const VB_H = 720
const HYP = 540
/** mg vektorining eng katta uzunligi (sahna chegaralarini hisoblash uchun) */
const MG_MAX = 200
/** Jism pastga yetganda mg vektori uchun gorizontdan pastdagi joy */
const BOTTOM_ROOM = 175
const BLOCK_W = 82
const BLOCK_H = 54
const START_PAD = BLOCK_W / 2 + 14
const END_PAD = BLOCK_W / 2 + 8
const TRAVEL = HYP - START_PAD - END_PAD

const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y })
const mul = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k })

export function SimulationCanvas({
  params,
  displayAngle,
  s,
  v,
  visibility,
  width,
  projector = false,
  hideHints = false,
}: SimulationCanvasProps) {
  const ui = Math.min(1.9, Math.max(projector ? 1.18 : 1, 820 / Math.max(width, 1)))

  const view = useMemo(() => ({ ...params, angleDeg: displayAngle }), [params, displayAngle])
  const f = useMemo(() => summarizeForces(view, v), [view, v])

  const alpha = toRad(displayAngle)
  const cos = Math.cos(alpha)
  const sin = Math.sin(alpha)

  // Uchburchak: C — yuqori, B — to‘g‘ri burchak, A — α burchak (pastki o‘ng)
  const w = HYP * cos
  const h = HYP * sin
  // Kompozitsiyani vertikal markazlash: tepada N vektori, pastda mg uchun joy kerak
  const topRoom = 70 + (MG_MAX - 25) * cos * cos
  const GROUND_Y = Math.min(VB_H - 24, VB_H / 2 + (h + topRoom - BOTTOM_ROOM) / 2)
  const A: Vec = { x: VB_W / 2 + w / 2, y: GROUND_Y }
  const B: Vec = { x: A.x - w, y: GROUND_Y }
  const C: Vec = { x: B.x, y: GROUND_Y - h }

  // Birlik vektorlar: d — qiyalik bo‘ylab pastga, n — sirtdan tashqariga normal
  const d: Vec = { x: cos, y: sin }
  const n: Vec = { x: sin, y: -cos }

  const along = START_PAD + (Math.min(s, PLANE_LENGTH) / PLANE_LENGTH) * TRAVEL
  const contact = add(C, mul(d, along))
  const center = add(contact, mul(n, BLOCK_H / 2))
  const startContact = add(C, mul(d, START_PAD))

  // mg vektori uzunligi og‘irlikka bog‘liq, qolganlari mg ga nisbatan aniq masshtablanadi
  // Masshtab harakat davomida o‘zgarmaydi: cheklov jismning eng pastki holatiga qarab olinadi
  const endCenter = add(add(C, mul(d, HYP - END_PAD)), mul(n, BLOCK_H / 2))
  const mgLen = Math.min(150 + (MG_MAX - 150) * Math.sqrt(Math.min(1, f.weight / (20 * 9.81))), VB_H - 34 - endCenter.y)
  const k = f.weight > 0 ? mgLen / f.weight : 0
  const clearAlong = BLOCK_W / 2 + 12
  const clearNormal = BLOCK_H / 2 + 12

  const vWeight: Vec = { x: 0, y: f.weight * k }
  const vParallel = mul(d, f.parallel * k)
  const vPerp = mul(n, -f.perpendicular * k)
  const vNormal = mul(n, f.normal * k)
  const vFriction = mul(d, -f.friction * k)

  const arcR = 78
  const arcEnd = add(A, { x: -arcR * cos, y: -arcR * sin })
  // Katta burchaklarda yorliq gorizontga yaqin turadi — jism yo‘lidan uzoqroq
  const labelDir = Math.min(alpha / 2, toRad(14))
  const arcLabel = add(A, {
    x: -(arcR + 30 * ui) * Math.cos(labelDir),
    y: -(arcR + 30 * ui) * Math.sin(labelDir),
  })

  const crit = toRad(Math.min(f.criticalAngle, 75))
  const critLen = HYP * 0.62
  const critEnd = add(A, { x: -critLen * Math.cos(crit), y: -critLen * Math.sin(crit) })
  // Yorliq α yoyi yonida: kritik nur qiyalikdan past bo‘lsa — nur ostida, aks holda — ustida
  const critBelow = f.criticalAngle < displayAngle
  const critLabel = add(A, { x: -(arcR + 150) * Math.cos(crit), y: -(arcR + 150) * Math.sin(crit) + (critBelow ? 20 : -12) * ui })

  const ticks = Array.from({ length: PLANE_LENGTH + 1 }, (_, i) => {
    const p = add(C, mul(d, START_PAD + (i / PLANE_LENGTH) * TRAVEL))
    return { i, p }
  })

  const speedLines = v > 0.15 ? Math.min(1, v / 8) : 0
  // Diagrammada faqat belgilar; son qiymatlar «Fizik kattaliklar» panelida
  const subSize = 17 * ui

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className={`mx-auto block h-auto w-full overflow-visible select-none ${projector ? 'max-h-[62vh]' : 'max-h-[64vh]'}`}
      role="img"
      aria-label={`Qiya tekislik: burchak ${fmt(displayAngle, 0)} gradus, jism ${fmt(s, 2)} metr yo‘l bosgan`}
    >
      <defs>
        <linearGradient id="plane-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#74872C" stopOpacity="0.42" />
          <stop offset="1" stopColor="#505B24" stopOpacity="0.05" />
        </linearGradient>
        <pattern id="plane-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="14" stroke="#BCD357" strokeOpacity="0.09" strokeWidth="1.2" />
        </pattern>
        <pattern id="ground-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="12" stroke="#9D9D9D" strokeOpacity="0.18" strokeWidth="1" />
        </pattern>
        <linearGradient id="ground-line" x1="0" x2="1">
          <stop offset="0" stopColor="#9D9D9D" stopOpacity="0" />
          <stop offset="0.15" stopColor="#9D9D9D" stopOpacity="0.55" />
          <stop offset="0.85" stopColor="#9D9D9D" stopOpacity="0.55" />
          <stop offset="1" stopColor="#9D9D9D" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="block-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b3017" />
          <stop offset="1" stopColor="#11130b" />
        </linearGradient>
        <linearGradient id="block-top" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5d6a2a" />
          <stop offset="1" stopColor="#3b4419" />
        </linearGradient>
        <linearGradient id="trail" x1="0" x2="1">
          <stop offset="0" stopColor="#BCD357" stopOpacity="0" />
          <stop offset="1" stopColor="#E9FD87" stopOpacity="0.9" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <radialGradient id="spot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#BCD357" stopOpacity="0.16" />
          <stop offset="1" stopColor="#BCD357" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Laboratoriya yorug‘ligi */}
      <ellipse cx={VB_W / 2} cy={GROUND_Y - 120} rx={460} ry={260} fill="url(#spot)" />

      {/* Gorizontal sirt (poydevor) */}
      <rect x={40} y={GROUND_Y} width={VB_W - 80} height={18} fill="url(#ground-hatch)" />
      <line x1={30} y1={GROUND_Y} x2={VB_W - 30} y2={GROUND_Y} stroke="url(#ground-line)" strokeWidth={2} />
      <line
        x1={A.x}
        y1={GROUND_Y}
        x2={VB_W - 60}
        y2={GROUND_Y}
        stroke="#FBFAFB"
        strokeOpacity={0.35}
        strokeWidth={1.4}
        strokeDasharray="6 8"
      />
      <text
        x={VB_W - 60}
        y={GROUND_Y - 12 * ui}
        textAnchor="end"
        fill="#9D9D9D"
        fontSize={11 * ui}
        letterSpacing={2}
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        GORIZONT
      </text>

      {/* Qiya tekislik */}
      <polygon points={`${C.x},${C.y} ${B.x},${B.y} ${A.x},${A.y}`} fill="url(#plane-fill)" />
      <polygon points={`${C.x},${C.y} ${B.x},${B.y} ${A.x},${A.y}`} fill="url(#plane-hatch)" />
      <line x1={C.x} y1={C.y} x2={B.x} y2={B.y} stroke="#565656" strokeWidth={1.5} strokeDasharray="4 6" />
      {h > 24 && (
        <path
          d={`M ${B.x + 16} ${B.y} L ${B.x + 16} ${B.y - 16} L ${B.x} ${B.y - 16}`}
          fill="none"
          stroke="#565656"
          strokeWidth={1.4}
        />
      )}

      {/* Kritik burchak ko‘rsatkichi */}
      {!hideHints && f.criticalAngle > 0.5 && f.criticalAngle < 60 && (
        <g opacity={0.75}>
          <line
            x1={A.x}
            y1={A.y}
            x2={critEnd.x}
            y2={critEnd.y}
            stroke="#FF8D6B"
            strokeOpacity={0.55}
            strokeWidth={1.4}
            strokeDasharray="3 7"
          />
          <text
            x={critLabel.x}
            y={critLabel.y}
            textAnchor="middle"
            fill="#FF8D6B"
            fillOpacity={0.85}
            fontSize={13 * ui}
            stroke="#010101"
            strokeWidth={4}
            paintOrder="stroke"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            α<tspan baselineShift="sub" fontSize={10 * ui}>kr</tspan> = {fmt(f.criticalAngle, 1)}°
          </text>
        </g>
      )}

      {/* Masofa shkalasi */}
      {ticks.map(({ i, p }) => {
        const major = i % 2 === 0
        const len = major ? 12 : 7
        const q = add(p, mul(n, -len))
        const lp = add(p, mul(n, -24 * Math.min(ui, 1.4)))
        return (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#BCD357" strokeOpacity={major ? 0.55 : 0.3} strokeWidth={1.2} />
            {major && h > 30 && (
              <text
                x={lp.x}
                y={lp.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#9D9D9D"
                fontSize={10.5 * Math.min(ui, 1.5)}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {i}
              </text>
            )}
          </g>
        )
      })}

      {/* Qiyalik sirti (nurli chiziq) */}
      <line x1={C.x} y1={C.y} x2={A.x} y2={A.y} stroke="#BCD357" strokeWidth={10} strokeOpacity={0.25} filter="url(#soft-glow)" />
      <line x1={C.x} y1={C.y} x2={A.x} y2={A.y} stroke="#E9FD87" strokeWidth={3} strokeLinecap="round" />

      {/* α burchagi */}
      {displayAngle > 0.4 && (
        <>
          <path
            d={`M ${A.x - arcR} ${A.y} A ${arcR} ${arcR} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
            fill="none"
            stroke="#E9FD87"
            strokeWidth={2}
          />
          <path
            d={`M ${A.x} ${A.y} L ${A.x - arcR} ${A.y} A ${arcR} ${arcR} 0 0 1 ${arcEnd.x} ${arcEnd.y} Z`}
            fill="#E9FD87"
            fillOpacity={0.08}
          />
        </>
      )}
      <text
        x={displayAngle > 0.4 ? arcLabel.x : A.x - arcR - 14}
        y={displayAngle > 0.4 ? arcLabel.y : A.y - 22 * ui}
        textAnchor={displayAngle > 0.4 ? 'end' : 'middle'}
        dominantBaseline="central"
        fill="#E9FD87"
        fontSize={24 * ui}
        fontWeight={700}
        stroke="#010101"
        strokeWidth={4}
        paintOrder="stroke"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        α = {fmt(displayAngle, 0)}°
      </text>
      <circle cx={A.x} cy={A.y} r={4} fill="#E9FD87" />

      {/* Bosib o‘tilgan iz */}
      {s > 0.02 && (
        <line
          x1={startContact.x + n.x * 3}
          y1={startContact.y + n.y * 3}
          x2={contact.x + n.x * 3}
          y2={contact.y + n.y * 3}
          stroke="url(#trail)"
          strokeWidth={4}
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(188,211,87,0.8))' }}
        />
      )}

      {/* Jism */}
      <g transform={`translate(${center.x} ${center.y}) rotate(${displayAngle})`}>
        {speedLines > 0 &&
          [-14, 0, 14].map((y, i) => (
            <line
              key={y}
              x1={-BLOCK_W / 2 - 10 - i * 6}
              y1={y}
              x2={-BLOCK_W / 2 - 10 - i * 6 - 40 * speedLines}
              y2={y}
              stroke="#E9FD87"
              strokeOpacity={0.5 * speedLines}
              strokeWidth={2}
              strokeLinecap="round"
            />
          ))}
        <rect
          x={-BLOCK_W / 2}
          y={-BLOCK_H / 2}
          width={BLOCK_W}
          height={BLOCK_H}
          rx={10}
          fill="#BCD357"
          opacity={0.35}
          filter="url(#soft-glow)"
        />
        {/* Yuqori va yon qirralar — hajm effekti */}
        <polygon
          points={`${-BLOCK_W / 2 + 6},${-BLOCK_H / 2} ${-BLOCK_W / 2 + 18},${-BLOCK_H / 2 - 11} ${BLOCK_W / 2 + 12},${-BLOCK_H / 2 - 11} ${BLOCK_W / 2},${-BLOCK_H / 2}`}
          fill="url(#block-top)"
          stroke="#BCD357"
          strokeOpacity={0.6}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        <polygon
          points={`${BLOCK_W / 2},${-BLOCK_H / 2} ${BLOCK_W / 2 + 12},${-BLOCK_H / 2 - 11} ${BLOCK_W / 2 + 12},${BLOCK_H / 2 - 13} ${BLOCK_W / 2},${BLOCK_H / 2}`}
          fill="#1d2110"
          stroke="#BCD357"
          strokeOpacity={0.45}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        <rect
          x={-BLOCK_W / 2}
          y={-BLOCK_H / 2}
          width={BLOCK_W}
          height={BLOCK_H}
          rx={7}
          fill="url(#block-face)"
          fillOpacity={0.82}
          stroke="#E9FD87"
          strokeWidth={2}
        />
        <line
          x1={-BLOCK_W / 2 + 8}
          y1={-BLOCK_H / 2 + 5}
          x2={BLOCK_W / 2 - 8}
          y2={-BLOCK_H / 2 + 5}
          stroke="#FBFAFB"
          strokeOpacity={0.18}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Chap-yuqori chorak: bu yerdan hech bir vektor o‘tmaydi */}
        <text
          x={-BLOCK_W / 2 + 8}
          y={-BLOCK_H / 2 + 16}
          textAnchor="start"
          fill="#E9FD87"
          fillOpacity={0.8}
          fontSize={11}
          fontWeight={600}
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {fmt(params.mass, params.mass % 1 ? 1 : 0)} kg
        </text>
      </g>

      {/* Tashkil etuvchilar uchun parallelogramm yordamchi chiziqlari */}
      {visibility.components && visibility.weight && f.parallel * k > 6 && f.perpendicular * k > 6 && (
        <g stroke="#9D9D9D" strokeOpacity={0.45} strokeWidth={1.2} strokeDasharray="3 5">
          <line x1={center.x + vParallel.x} y1={center.y + vParallel.y} x2={center.x + vWeight.x} y2={center.y + vWeight.y} />
          <line x1={center.x + vPerp.x} y1={center.y + vPerp.y} x2={center.x + vWeight.x} y2={center.y + vWeight.y} />
        </g>
      )}

      {/* Kuch vektorlari — barchasi jism markazidan chiqadi */}
      {visibility.components && (
        <>
          <ForceVector
            origin={center}
            vec={vPerp}
            color={VECTOR_COLORS.perpendicular}
            dashed
            scale={ui}
            side="left"
            labelMinDist={clearNormal}
            size={1.2}
            label={
              <>
                F<tspan baselineShift="sub" fontSize={subSize * 1.2}>y</tspan>
              </>
            }
          />
          <ForceVector
            origin={center}
            vec={vParallel}
            color={VECTOR_COLORS.parallel}
            dashed
            scale={ui}
            labelMinDist={clearAlong}
            size={1.2}
            label={
              <>
                F<tspan baselineShift="sub" fontSize={subSize * 1.2}>x</tspan>
              </>
            }
          />
        </>
      )}
      {visibility.friction && (
        <ForceVector
          origin={center}
          vec={vFriction}
          color={VECTOR_COLORS.friction}
          scale={ui}
          labelMinDist={clearAlong}
          label={
            <>
              F<tspan baselineShift="sub" fontSize={subSize}>ishq</tspan>
            </>
          }
        />
      )}
      {visibility.normal && (
        <ForceVector
          origin={center}
          vec={vNormal}
          color={VECTOR_COLORS.normal}
          scale={ui}
          labelMinDist={clearNormal}
          label="N"
        />
      )}
      {visibility.weight && (
        <ForceVector
          origin={center}
          vec={vWeight}
          color={VECTOR_COLORS.weight}
          scale={ui}
          side={visibility.components && displayAngle < 35 ? 'right' : 'auto'}
          label="mg"
        />
      )}

      {/* Kuchlar qo‘yilgan nuqta */}
      <circle cx={center.x} cy={center.y} r={9} fill="none" stroke="#E9FD87" strokeOpacity={0.55} strokeWidth={1.5} />
      <circle cx={center.x} cy={center.y} r={4.5} fill="#E9FD87" filter="url(#glow)" />
    </svg>
  )
}
