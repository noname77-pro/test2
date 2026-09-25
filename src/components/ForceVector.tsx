import type { ReactNode } from 'react'

export interface Vec {
  x: number
  y: number
}

export type LabelSide = 'auto' | 'left' | 'right'

interface ForceVectorProps {
  origin: Vec
  /** Vektor (px): yo‘nalish × uzunlik */
  vec: Vec
  color: string
  label: ReactNode
  value?: string
  dashed?: boolean
  scale?: number
  /** Yorliqni uchning qaysi tomoniga qo‘yish (yaqin vektorlar ustma-ust tushmasligi uchun) */
  side?: LabelSide
  /** Qisqa vektor yorlig‘i jism ichida qolmasligi uchun boshlang‘ich nuqtadan eng kichik masofa */
  labelMinDist?: number
}

const MIN_LENGTH = 6

export function ForceVector({
  origin,
  vec,
  color,
  label,
  value,
  dashed = false,
  scale = 1,
  side = 'auto',
  labelMinDist = 0,
}: ForceVectorProps) {
  const len = Math.hypot(vec.x, vec.y)
  if (len < MIN_LENGTH) return null

  const ux = vec.x / len
  const uy = vec.y / len
  const head = Math.min(15 * scale, len * 0.55)
  const halfW = head * 0.48
  const tip = { x: origin.x + vec.x, y: origin.y + vec.y }
  const labelDist = Math.max(len, labelMinDist)
  const lt = { x: origin.x + ux * labelDist, y: origin.y + uy * labelDist }
  const neck = { x: tip.x - ux * head, y: tip.y - uy * head }
  // Uchburchak shaklidagi strelka uchi
  const px = -uy
  const py = ux
  const headPts = [
    `${tip.x},${tip.y}`,
    `${neck.x + px * halfW},${neck.y + py * halfW}`,
    `${neck.x - px * halfW},${neck.y - py * halfW}`,
  ].join(' ')

  const fontSize = 17 * scale
  const valueSize = 12.5 * scale
  const lineH = fontSize * 1.08
  const blockH = value ? lineH + valueSize * 1.15 : lineH
  const gap = 10 * scale

  let anchor: 'start' | 'middle' | 'end' = ux > 0.3 ? 'start' : ux < -0.3 ? 'end' : 'middle'
  let lx = lt.x + ux * gap
  if (side === 'left') {
    anchor = 'end'
    lx = lt.x - gap * 1.8
  } else if (side === 'right') {
    anchor = 'start'
    lx = lt.x + gap * 1.8
  }
  const ly = lt.y + uy * gap
  // Yon tomondagi yorliq uch sathida, undan yuqorida turadi
  const top = side !== 'auto' ? lt.y - blockH : uy < -0.3 ? ly - blockH : uy > 0.3 ? ly : ly - blockH / 2

  const strokeW = 3.4 * Math.min(scale, 1.7)

  return (
    <g className="pointer-events-none">
      {/* Yumshoq nur */}
      <line
        x1={origin.x}
        y1={origin.y}
        x2={neck.x}
        y2={neck.y}
        stroke={color}
        strokeOpacity={0.22}
        strokeWidth={strokeW * 3.2}
        strokeLinecap="round"
      />
      <line
        x1={origin.x}
        y1={origin.y}
        x2={neck.x + ux * 1}
        y2={neck.y + uy * 1}
        stroke={color}
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={dashed ? `${9 * scale} ${6 * scale}` : undefined}
      />
      <polygon points={headPts} fill={color} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <text
        x={lx}
        y={top}
        textAnchor={anchor}
        dominantBaseline="hanging"
        fill={color}
        stroke="#010101"
        strokeWidth={5 * Math.min(scale, 1.6)}
        strokeLinejoin="round"
        paintOrder="stroke"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <tspan fontSize={fontSize} fontWeight={700}>
          {label}
        </tspan>
        {value && (
          <tspan
            x={lx}
            dy={lineH}
            fontSize={valueSize}
            fontWeight={500}
            fill="#FBFAFB"
            fillOpacity={0.78}
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {value}
          </tspan>
        )}
      </text>
    </g>
  )
}
