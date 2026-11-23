import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Sheet from './Sheet'
import Icon from './Icon'

export type Action = {
  label: string
  hint?: string
  icon?: string
  to?: string
  onClick?: () => void
  tone?: 'danger' | 'sale'
  disabled?: boolean
}

/** Big, plain rows for a pop-up list of actions: one line of what it does, one line of why. */
export function ActionList({ items, onPicked }: { items: Action[]; onPicked?: () => void }) {
  return (
    <div className="action-list">
      {items.map(a => {
        const body = <>
          <span className="action-ico"><Icon name={a.icon ?? 'arrow'} size={20} /></span>
          <span className="action-text"><b>{a.label}</b>{a.hint && <small>{a.hint}</small>}</span>
          <Icon name="chevron" size={18} className="action-chev" />
        </>
        const cls = `action-row${a.tone ? ` ${a.tone}` : ''}`
        return a.to && !a.disabled
          ? <Link key={a.label} to={a.to} className={cls} onClick={onPicked}>{body}</Link>
          : <button key={a.label} type="button" className={cls} disabled={a.disabled} onClick={() => { onPicked?.(); a.onClick?.() }}>{body}</button>
      })}
    </div>
  )
}

/** A quiet "More" button that opens a pop-up of the less-used actions, so each page has one clear main button. */
export default function MoreActions({ title, items, label = 'More', className = 'btn ghost', children }: { title: string; items: Action[]; label?: string; className?: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog"><Icon name="more" size={18} />{label}</button>
      <Sheet open={open} onClose={() => setOpen(false)} title={title}>
        <div className="stack">
          {children}
          <ActionList items={items} onPicked={() => setOpen(false)} />
        </div>
      </Sheet>
    </>
  )
}
