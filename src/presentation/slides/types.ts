import type { ComponentType } from 'react'

export interface SlideProps {
  /** Joriy qadam (0 dan boshlanadi) */
  step: number
  /** Slayd ichidagi tugmalar uchun: to‘g‘ridan-to‘g‘ri ma’lum qadamga o‘tish */
  goToStep: (step: number) => void
}

export interface SlideDef {
  id: string
  title: string
  /** Eng katta qadam indeksi (0 — qadamsiz slayd) */
  steps: number
  Component: ComponentType<SlideProps>
}
