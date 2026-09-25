/**
 * Qiya tekislikdagi jism dinamikasi.
 * Barcha kuchlar Nyutonda, tezlanish m/s² da, burchaklar gradusda (tashqi API) beriladi.
 */

export type PlanetId = 'earth' | 'moon' | 'mars'

export interface Planet {
  id: PlanetId
  name: string
  g: number
}

export const PLANETS: Record<PlanetId, Planet> = {
  earth: { id: 'earth', name: 'Yer', g: 9.81 },
  moon: { id: 'moon', name: 'Oy', g: 1.62 },
  mars: { id: 'mars', name: 'Mars', g: 3.71 },
}

export interface PhysicsParams {
  /** Qiyalik burchagi, gradus */
  angleDeg: number
  /** Massa, kg */
  mass: number
  /** Ishqalanish koeffitsienti */
  mu: number
  /** Erkin tushish tezlanishi, m/s² */
  g: number
}

export interface MotionState {
  /** Vaqt, s */
  t: number
  /** Qiya tekislik bo‘ylab tezlik (pastga musbat), m/s */
  v: number
  /** Bosib o‘tilgan yo‘l, m */
  s: number
}

export const LIMITS = {
  angle: { min: 0, max: 60, step: 1 },
  mass: { min: 1, max: 20, step: 0.5 },
  mu: { min: 0, max: 1, step: 0.01 },
} as const

/** Qiya tekislik uzunligi (jism bosib o‘tadigan yo‘l), m */
export const PLANE_LENGTH = 10

/** tan α va μ ni solishtirishdagi sonli xatolikdan himoya */
const EPS = 1e-9

export const toRad = (deg: number) => (deg * Math.PI) / 180
export const toDeg = (rad: number) => (rad * 180) / Math.PI

export function calculateWeight({ mass, g }: PhysicsParams): number {
  return mass * g
}

/** F∥ = mg sin α — og‘irlik kuchining qiyalik bo‘ylab tashkil etuvchisi */
export function calculateParallelForce(p: PhysicsParams): number {
  return p.mass * p.g * Math.sin(toRad(p.angleDeg))
}

/** F⊥ = mg cos α — og‘irlik kuchining qiyalikka tik tashkil etuvchisi */
export function calculatePerpendicularForce(p: PhysicsParams): number {
  return p.mass * p.g * Math.cos(toRad(p.angleDeg))
}

/** N = mg cos α (qiyalikka tik yo‘nalishda tezlanish yo‘q) */
export function calculateNormalForce(p: PhysicsParams): number {
  return calculatePerpendicularForce(p)
}

/** F_ishq = μN = μmg cos α */
export function calculateSlidingFriction(p: PhysicsParams): number {
  return p.mu * calculateNormalForce(p)
}

/** Kritik burchak: tan α_kr = μ */
export function calculateCriticalAngle(mu: number): number {
  return toDeg(Math.atan(mu))
}

/**
 * Tinch turgan jism harakatga keladimi?
 * mg sin α > μmg cos α  ⇔  tan α > μ
 */
export function shouldSlide(p: PhysicsParams): boolean {
  return calculateParallelForce(p) > calculateSlidingFriction(p) + EPS
}

/**
 * Pastga harakatdagi tezlanish: a = g(sin α − μ cos α).
 * Manfiy qiymat jism tormozlanayotganini bildiradi (faqat v > 0 bo‘lganda ma’noli).
 */
export function calculateSlidingAcceleration(p: PhysicsParams): number {
  const a = toRad(p.angleDeg)
  return p.g * (Math.sin(a) - p.mu * Math.cos(a))
}

/**
 * Jismning joriy tezlanishi.
 * - Tinch turgan jism: tan α ≤ μ bo‘lsa, ishqalanish uni ushlab turadi → a = 0.
 * - Harakatdagi jism: a = g(sin α − μ cos α); manfiy a bilan u to‘xtaguncha sekinlashadi.
 * Jism hech qachon orqaga (yuqoriga) harakatlanmaydi.
 */
export function calculateAcceleration(p: PhysicsParams, v = 0): number {
  if (v > EPS) return calculateSlidingAcceleration(p)
  if (!shouldSlide(p)) return 0
  return calculateSlidingAcceleration(p)
}

/**
 * Jismga haqiqatda ta’sir qilayotgan ishqalanish kuchi (qiyalik bo‘ylab yuqoriga).
 * Harakatda: F_ishq = μN. Tinch holatda ishqalanish mg sin α ni aniq muvozanatlaydi
 * (u μN dan katta bo‘la olmaydi), aks holda jism yuqoriga tezlanib ketardi.
 */
export function calculateFrictionForce(p: PhysicsParams, v = 0): number {
  if (v > EPS || shouldSlide(p)) return calculateSlidingFriction(p)
  return calculateParallelForce(p)
}

/** F_net = mg sin α − F_ishq (tinch holatda 0) */
export function calculateNetForce(p: PhysicsParams, v = 0): number {
  return p.mass * calculateAcceleration(p, v)
}

export type MotionPhase = 'static' | 'sliding' | 'braking'

export function getMotionPhase(p: PhysicsParams, v: number): MotionPhase {
  if (v > EPS) return calculateSlidingAcceleration(p) < 0 ? 'braking' : 'sliding'
  return shouldSlide(p) ? 'sliding' : 'static'
}

/** Tinch holatdan boshlab butun qiyalikni o‘tish vaqti (harakatlanmasa — null) */
export function timeToBottom(p: PhysicsParams, length = PLANE_LENGTH): number | null {
  const a = calculateAcceleration(p, 0)
  if (a <= 0) return null
  return Math.sqrt((2 * length) / a)
}

export interface StepResult extends MotionState {
  a: number
  reachedBottom: boolean
}

/**
 * Harakat tenglamasini dt vaqt qadami bilan integrallash.
 * Qadam ichida tezlanish o‘zgarmas, shuning uchun aniq formulalar ishlatiladi:
 * s += v·dt + a·dt²/2, v += a·dt. Pastga yetish yoki to‘xtash lahzasi qadam ichida aniq topiladi.
 */
export function stepMotion(
  p: PhysicsParams,
  state: MotionState,
  dt: number,
  length = PLANE_LENGTH,
): StepResult {
  const { t, v, s } = state
  const a = calculateAcceleration(p, v)

  // Ishqalanish jismni to‘xtatadi: v = 0 lahzasidan keyin jism tinch qoladi (tan α < μ)
  let tau = dt
  if (a < 0 && v + a * dt <= 0) tau = -v / a

  let nextS = s + v * tau + 0.5 * a * tau * tau
  let nextV = Math.max(0, v + a * tau)
  let nextT = t + dt

  if (nextS >= length) {
    const remaining = length - s
    // 0.5·a·τ² + v·τ − remaining = 0 dan musbat ildiz
    const hit =
      Math.abs(a) < EPS ? remaining / v : (-v + Math.sqrt(v * v + 2 * a * remaining)) / a
    nextS = length
    nextV = v + a * hit
    nextT = t + hit
    return { t: nextT, v: nextV, s: nextS, a, reachedBottom: true }
  }

  return { t: nextT, v: nextV, s: nextS, a: nextV > EPS ? a : calculateAcceleration(p, 0), reachedBottom: false }
}

export interface ForceSummary {
  weight: number
  parallel: number
  perpendicular: number
  normal: number
  /** μN */
  slidingFriction: number
  /** Jismga haqiqatda ta’sir qilayotgan ishqalanish */
  friction: number
  netForce: number
  acceleration: number
  slidingAcceleration: number
  slides: boolean
  tanAlpha: number
  criticalAngle: number
}

export function summarizeForces(p: PhysicsParams, v = 0): ForceSummary {
  return {
    weight: calculateWeight(p),
    parallel: calculateParallelForce(p),
    perpendicular: calculatePerpendicularForce(p),
    normal: calculateNormalForce(p),
    slidingFriction: calculateSlidingFriction(p),
    friction: calculateFrictionForce(p, v),
    netForce: calculateNetForce(p, v),
    acceleration: calculateAcceleration(p, v),
    slidingAcceleration: calculateSlidingAcceleration(p),
    slides: shouldSlide(p),
    tanAlpha: Math.tan(toRad(p.angleDeg)),
    criticalAngle: calculateCriticalAngle(p.mu),
  }
}
