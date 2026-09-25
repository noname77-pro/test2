import { useCallback, useRef, useState } from 'react'

/** Callback-ref: element qayta yaratilganda ham kenglik kuzatiladi */
export function useElementWidth<T extends HTMLElement>() {
  const [width, setWidth] = useState(0)
  const observer = useRef<ResizeObserver | null>(null)

  const ref = useCallback((el: T | null) => {
    observer.current?.disconnect()
    observer.current = null
    if (!el) return
    setWidth(el.getBoundingClientRect().width)
    observer.current = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.current.observe(el)
  }, [])

  return [ref, width] as const
}
