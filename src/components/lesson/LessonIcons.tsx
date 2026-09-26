import type { SVGProps } from 'react'

// Mavjud Icons.tsx bilan bir xil chiziqli uslub
const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

type P = SVGProps<SVGSVGElement>

export const RampIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 19h18V9z" />
    <circle cx="9" cy="13.2" r="1.6" />
  </svg>
)
export const MountainRoadIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.5 19.5 9 8l4 6 2.5-3.5 6 9z" />
    <path d="M8 19c3-1.5 1-3.5 4-4.5" strokeDasharray="1.6 2" />
  </svg>
)
export const StairsIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 20h4v-4h4v-4h4V8h4V4h2" />
  </svg>
)
export const LoadingRampIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="12" y="6" width="9" height="8" rx="1" />
    <path d="M3 19 12 14" />
    <circle cx="14.5" cy="17" r="1.6" />
    <circle cx="19" cy="17" r="1.6" />
  </svg>
)
export const SlideIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 20V5M9 20V5M5 9h4M5 13h4" />
    <path d="M9 5c5 1 6 12 12 14" />
  </svg>
)
