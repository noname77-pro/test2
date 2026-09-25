import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { fmt } from '../../lib/format'

interface AnimatedNumberProps {
  value: number
  digits?: number
  className?: string
}

/** Slayder o‘zgarganda raqam silliq "oqib" o‘tadi */
export function AnimatedNumber({ value, digits = 2, className }: AnimatedNumberProps) {
  const mv = useSpring(value, { stiffness: 260, damping: 32, mass: 0.5 })
  const text = useTransform(mv, (v) => fmt(v, digits))

  useEffect(() => {
    mv.set(value)
  }, [mv, value])

  return <motion.span className={className}>{text}</motion.span>
}
