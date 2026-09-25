import type { PlanetId } from './physics'

export interface LabParams {
  angleDeg: number
  mass: number
  muS: number
  muK: number
  planet: PlanetId
}

export const DEFAULT_PARAMS: LabParams = {
  angleDeg: 30,
  mass: 5,
  muS: 0.25,
  muK: 0.2,
  planet: 'earth',
}

export interface ExperimentPreset {
  id: string
  index: number
  title: string
  description: string
  params: LabParams
}

export const PRESETS: ExperimentPreset[] = [
  {
    id: 'frictionless',
    index: 1,
    title: 'Ishqalanishsiz',
    description: 'Ideal silliq sirt: a = g sin α',
    params: { angleDeg: 30, mass: 5, muS: 0, muK: 0, planet: 'earth' },
  },
  {
    id: 'friction',
    index: 2,
    title: 'Ishqalanish bilan',
    description: 'μs = 0.25, μk = 0.20 — tezlanish kamayadi',
    params: { angleDeg: 30, mass: 5, muS: 0.25, muK: 0.2, planet: 'earth' },
  },
  {
    id: 'critical',
    index: 3,
    title: 'Kritik burchak',
    description: 'tan 27° ≈ 0.51 — μs = 0.50 dan biroz katta',
    params: { angleDeg: 27, mass: 5, muS: 0.5, muK: 0.4, planet: 'earth' },
  },
  {
    id: 'moon',
    index: 4,
    title: 'Oy gravitatsiyasi',
    description: 'g = 1.62 m/s² — harakat sekinlashadi',
    params: { angleDeg: 30, mass: 5, muS: 0.25, muK: 0.2, planet: 'moon' },
  },
]
