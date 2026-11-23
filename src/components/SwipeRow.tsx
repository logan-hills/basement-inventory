import { useRef, useState, type ReactNode } from 'react'
import { tap } from '../lib/feedback'

type Props = {
  children: ReactNode
  leftLabel?: string
  onSwipeLeft?: () => void
  rightLabel?: string
  onSwipeRight?: () => void
}

const TRIGGER = 90

/** A row you can swipe on touch screens. Swipe left (red) or right (green) to act. */
export default function SwipeRow({ children, leftLabel, onSwipeLeft, rightLabel, onSwipeRight }: Props) {
  const start = useRef<{ x: number; y: number } | null>(null)
  const [dx, setDx] = useState(0)
  const armed = useRef(false)
  const horizontal = useRef<boolean | null>(null)

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    start.current = { x: t.clientX, y: t.clientY }
    horizontal.current = null
    armed.current = false
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!start.current) return
    const t = e.touches[0]
    const mx = t.clientX - start.current.x
    const my = t.clientY - start.current.y
    if (horizontal.current === null && (Math.abs(mx) > 8 || Math.abs(my) > 8)) horizontal.current = Math.abs(mx) > Math.abs(my)
    if (!horizontal.current) return
    let x = mx
    if (x < 0 && !onSwipeLeft) x = 0
    if (x > 0 && !onSwipeRight) x = 0
    const past = Math.abs(x) > TRIGGER
    if (past !== armed.current) { armed.current = past; if (past) tap() }
    setDx(Math.max(-160, Math.min(160, x)))
  }
  function onTouchEnd() {
    if (armed.current) {
      if (dx < 0) onSwipeLeft?.()
      else onSwipeRight?.()
    }
    start.current = null
    armed.current = false
    setDx(0)
  }

  return (
    <div className="swipe-row">
      <div className={`swipe-bg left ${dx < -TRIGGER ? 'armed' : ''}`} aria-hidden="true">{leftLabel}</div>
      <div className={`swipe-bg right ${dx > TRIGGER ? 'armed' : ''}`} aria-hidden="true">{rightLabel}</div>
      <div className="swipe-fg" style={{ transform: `translateX(${dx}px)`, transition: start.current ? 'none' : 'transform .2s ease' }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}>
        {children}
      </div>
    </div>
  )
}
