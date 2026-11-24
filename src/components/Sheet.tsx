import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** Slides up from the bottom on phones, appears as a centered panel on laptops.
    It is drawn at the top of the page (a portal), so a sticky bar or an animated section can never trap it
    under the bottom tabs. Inside Dazzle University it keeps the University look. */
export default function Sheet({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const [inUni, setInUni] = useState(false)
  const mark = (el: HTMLSpanElement | null) => { if (el) setInUni(!!el.closest('.uni')) }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    // Keep the page behind still while the pop-up scrolls.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  const sheet = (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className={`sheet-panel${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} onClick={e => e.stopPropagation()}>
        <div className="sheet-grip" aria-hidden="true" />
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  )
  return (
    <>
      <span ref={mark} hidden />
      {open && createPortal(inUni ? <div className="uni uni-portal">{sheet}</div> : sheet, document.body)}
    </>
  )
}
