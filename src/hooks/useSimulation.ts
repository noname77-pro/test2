import { useCallback, useEffect, useRef, useState } from 'react'
import { calculateAcceleration, stepMotion, type PhysicsParams } from '../lib/physics'

export type SimStatus = 'idle' | 'running' | 'paused' | 'finished'

export interface SimSnapshot {
  t: number
  v: number
  s: number
  a: number
}

export interface SamplePoint {
  t: number
  v: number
  s: number
}

/** Kadrlar orasidagi eng katta qadam — tab almashganda "sakrash" bo‘lmasligi uchun */
const MAX_FRAME_DT = 1 / 20
const MAX_SAMPLES = 1500

export function useSimulation(params: PhysicsParams) {
  const paramsRef = useRef(params)
  paramsRef.current = params

  const [status, setStatus] = useState<SimStatus>('idle')
  const [snapshot, setSnapshot] = useState<SimSnapshot>({ t: 0, v: 0, s: 0, a: 0 })
  const [speed, setSpeed] = useState(1)
  const [history, setHistory] = useState<SamplePoint[]>([{ t: 0, v: 0, s: 0 }])

  const stateRef = useRef<SimSnapshot>({ t: 0, v: 0, s: 0, a: 0 })
  const historyRef = useRef<SamplePoint[]>([{ t: 0, v: 0, s: 0 }])
  const speedRef = useRef(speed)
  speedRef.current = speed
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    lastTsRef.current = null
  }, [])

  const pushSample = (p: SamplePoint) => {
    const h = historyRef.current
    h.push(p)
    // Juda uzun yozuvlarda har ikkinchi nuqtani tashlab, grafikni yengil saqlaymiz
    if (h.length > MAX_SAMPLES) historyRef.current = h.filter((_, i) => i % 2 === 0 || i === h.length - 1)
  }

  const tick = useCallback(
    (ts: number) => {
      const last = lastTsRef.current ?? ts
      lastTsRef.current = ts
      const dt = Math.min((ts - last) / 1000, MAX_FRAME_DT) * speedRef.current

      if (dt > 0) {
        const r = stepMotion(paramsRef.current, stateRef.current, dt)
        stateRef.current = { t: r.t, v: r.v, s: r.s, a: r.a }
        pushSample({ t: r.t, v: r.v, s: r.s })
        setSnapshot(stateRef.current)
        setHistory(historyRef.current.slice())
        if (r.reachedBottom) {
          stopLoop()
          setStatus('finished')
          return
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    },
    [stopLoop],
  )

  const reset = useCallback(() => {
    stopLoop()
    stateRef.current = { t: 0, v: 0, s: 0, a: 0 }
    historyRef.current = [{ t: 0, v: 0, s: 0 }]
    setSnapshot(stateRef.current)
    setHistory(historyRef.current.slice())
    setStatus('idle')
  }, [stopLoop])

  const start = useCallback(() => {
    if (rafRef.current !== null) return
    if (status === 'finished') {
      stateRef.current = { t: 0, v: 0, s: 0, a: 0 }
      historyRef.current = [{ t: 0, v: 0, s: 0 }]
    }
    setStatus('running')
    lastTsRef.current = null
    rafRef.current = requestAnimationFrame(tick)
  }, [status, tick])

  const pause = useCallback(() => {
    if (rafRef.current === null) return
    stopLoop()
    setStatus('paused')
  }, [stopLoop])

  useEffect(() => stopLoop, [stopLoop])

  // Tinch holatda ham ko‘rsatiladigan tezlanish parametrlarga mos bo‘lsin
  const a = status === 'running' ? snapshot.a : calculateAcceleration(params, snapshot.v)

  return {
    status,
    snapshot: { ...snapshot, a },
    history,
    speed,
    setSpeed,
    start,
    pause,
    reset,
  }
}

export type Simulation = ReturnType<typeof useSimulation>
