import type { ReactNode } from 'react'
import { fmt } from '../../lib/format'

interface SliderProps {
  id: string
  title: string
  symbol: ReactNode
  value: number
  min: number
  max: number
  step: number
  digits?: number
  unit?: string
  hint?: ReactNode
  compact?: boolean
  onChange: (value: number) => void
}

export function Slider({
  id,
  title,
  symbol,
  value,
  min,
  max,
  step,
  digits = 2,
  unit,
  hint,
  compact = false,
  onChange,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className={`group ${compact ? '' : 'rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 pt-3.5 pb-2.5'} transition-colors hover:border-lime/25`}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-fog transition-colors group-hover:text-snow">
          {title}
        </label>
        <div className="flex items-baseline gap-1.5 font-mono text-snow">
          <span className="text-sm text-lime">{symbol}</span>
          <span className="text-fog">=</span>
          <span className="tabular text-xl font-semibold text-glow">{fmt(value, digits)}</span>
          {unit && <span className="text-sm text-fog">{unit}</span>}
        </div>
      </div>
      <div className="relative mt-1">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-olive via-lime to-glow shadow-[0_0_14px_rgba(188,211,87,0.7)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          id={id}
          type="range"
          className="range relative"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
      <div className="flex justify-between font-mono text-[0.65rem] text-graphite">
        <span>{fmt(min, digits === 0 ? 0 : digits)}</span>
        {hint && <span className="text-fog/80">{hint}</span>}
        <span>{fmt(max, digits === 0 ? 0 : digits)}</span>
      </div>
    </div>
  )
}
