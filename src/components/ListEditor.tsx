import { useState } from 'react'

/** Chips you can add to, remove from and reorder. Used for categories, tags, themes… */
export default function ListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (next: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState('')
  function add() {
    const v = draft.trim()
    if (!v || items.some(i => i.toLowerCase() === v.toLowerCase())) { setDraft(''); return }
    onChange([...items, v]); setDraft('')
  }
  function move(i: number, d: number) {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const n = [...items];[n[i], n[j]] = [n[j], n[i]]; onChange(n)
  }
  return (
    <div className="stack">
      <div className="chip-list">
        {items.map((it, i) => (
          <span key={it} className="edit-chip">
            <button className="chip-move" aria-label={`Move ${it} left`} onClick={() => move(i, -1)} disabled={i === 0}>‹</button>
            {it}
            <button className="chip-move" aria-label={`Move ${it} right`} onClick={() => move(i, 1)} disabled={i === items.length - 1}>›</button>
            <button className="chip-x" aria-label={`Remove ${it}`} onClick={() => onChange(items.filter(x => x !== it))}>×</button>
          </span>
        ))}
        {!items.length && <span className="muted small">Nothing yet.</span>}
      </div>
      <form className="input-suffix" onSubmit={e => { e.preventDefault(); add() }}>
        <input value={draft} onChange={e => setDraft(e.target.value)} placeholder={placeholder} />
        <button className="btn ghost small">Add</button>
      </form>
    </div>
  )
}
