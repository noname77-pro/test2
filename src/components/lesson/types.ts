import type { LabParams } from '../../lib/presets'

/** Tajriba natijasi: pastga yetish vaqti (s) yoki jism qo‘zg‘almagani */
export type RunResult = number | 'static'

/** Dars mashg‘ulotlari mavjud simulyatorni shu interfeys orqali boshqaradi */
export interface LessonLab {
  /** Simulyatorni berilgan parametrlar bilan sozlab, tajribani boshlaydi */
  run: (id: string, patch: Partial<LabParams>) => void
  results: Record<string, RunResult>
  activeRun: string | null
}
