/** Category drop-down fed by Settings. Keeps an old value visible even if it was removed from the list. */
export function CategorySelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const list = value && !options.includes(value) ? [value, ...options] : options
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">No category</option>
      {list.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  )
}

/** Tap-to-toggle tag chips fed by Settings. */
export function TagPicker({ value, onChange, options }: { value: string[]; onChange: (v: string[]) => void; options: string[] }) {
  const all = [...options, ...value.filter(v => !options.includes(v))]
  if (!all.length) return <span className="muted small">Add item tags in Settings.</span>
  return (
    <div className="chip-list">
      {all.map(t => {
        const on = value.includes(t)
        return <button type="button" key={t} className={`chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => onChange(on ? value.filter(x => x !== t) : [...value, t])}>{t}</button>
      })}
    </div>
  )
}
