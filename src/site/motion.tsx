import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

/** Counts up once when scrolled into view. Writes to the DOM node directly so no React re-render per frame. */
export function CountUp({ to, suffix = '', className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    if (reduce) { node.textContent = to.toLocaleString('en-US') + suffix; return }
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { node.textContent = Math.round(v).toLocaleString('en-US') + suffix } })
    return () => c.stop()
  }, [inView, to, suffix, reduce])
  return <span ref={ref} className={className}>0{suffix}</span>
}
