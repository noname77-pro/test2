import { describe, expect, it } from 'vitest'
import {
  PLANE_LENGTH,
  calculateAcceleration,
  calculateCriticalAngle,
  calculateFrictionForce,
  calculateNetForce,
  calculateNormalForce,
  calculateSlidingFriction,
  shouldSlide,
  stepMotion,
  timeToBottom,
  type MotionState,
  type PhysicsParams,
} from './physics'

const base: PhysicsParams = { angleDeg: 30, mass: 5, mu: 0.2, g: 9.81 }

function simulate(p: PhysicsParams, dt = 1 / 120, maxT = 60) {
  let st: MotionState = { t: 0, v: 0, s: 0 }
  while (st.t < maxT) {
    const r = stepMotion(p, st, dt)
    st = r
    if (r.reachedBottom) break
  }
  return st
}

describe('kuchlar', () => {
  it('boshlang‘ich qiymatlar uchun to‘g‘ri hisoblaydi', () => {
    const cos30 = Math.cos(Math.PI / 6)
    expect(calculateNormalForce(base)).toBeCloseTo(5 * 9.81 * cos30, 6)
    // F_ishq = μN = μmg cos α
    expect(calculateSlidingFriction(base)).toBeCloseTo(0.2 * 5 * 9.81 * cos30, 6)
    // a = g(sin α − μ cos α)
    expect(calculateAcceleration(base)).toBeCloseTo(9.81 * (0.5 - 0.2 * cos30), 6)
    // F_net = mg sin α − μmg cos α
    expect(calculateNetForce(base)).toBeCloseTo(5 * 9.81 * 0.5 - 0.2 * 5 * 9.81 * cos30, 6)
  })

  it('tinch holatda ishqalanish mg sin α ni muvozanatlaydi, a = 0', () => {
    const p = { ...base, angleDeg: 10 }
    expect(shouldSlide(p)).toBe(false)
    expect(calculateFrictionForce(p)).toBeCloseTo(5 * 9.81 * Math.sin((10 * Math.PI) / 180), 6)
    expect(calculateAcceleration(p)).toBe(0)
    expect(calculateNetForce(p)).toBe(0)
  })

  it('harakat sharti tan α > μ', () => {
    expect(calculateCriticalAngle(0.5)).toBeCloseTo(26.565, 2)
    expect(shouldSlide({ ...base, mu: 0.5, angleDeg: 26 })).toBe(false)
    expect(shouldSlide({ ...base, mu: 0.5, angleDeg: 27 })).toBe(true)
    expect(shouldSlide({ ...base, angleDeg: 0, mu: 0 })).toBe(false)
  })
})

describe('harakat', () => {
  it('ishqalanishsiz: t = √(2L / g sin α)', () => {
    const p = { ...base, mu: 0 }
    const end = simulate(p)
    const expected = Math.sqrt((2 * PLANE_LENGTH) / (9.81 * 0.5))
    expect(end.s).toBe(PLANE_LENGTH)
    expect(end.t).toBeCloseTo(expected, 6)
    expect(timeToBottom(p)).toBeCloseTo(expected, 9)
    expect(end.v).toBeCloseTo(9.81 * 0.5 * expected, 6)
  })

  it('tinch jism joyidan qo‘zg‘almaydi', () => {
    const end = simulate({ ...base, angleDeg: 10 }, 1 / 60, 3)
    expect(end.s).toBe(0)
    expect(end.v).toBe(0)
  })

  it('kichik burchakda harakatdagi jism tormozlanib to‘xtaydi va orqaga ketmaydi', () => {
    const p = { ...base, angleDeg: 5 }
    let st: MotionState = { t: 0, v: 3, s: 0 }
    for (let i = 0; i < 600; i++) st = stepMotion(p, st, 1 / 60)
    const a = calculateAcceleration(p, 1)
    expect(a).toBeLessThan(0)
    expect(st.v).toBe(0)
    expect(st.s).toBeCloseTo((3 * 3) / (2 * -a), 6)
  })
})
