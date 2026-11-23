import { useState } from 'react'
import ListEditor from '../components/ListEditor'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { BOT_FIELDS, DEFAULT_SETTINGS, type Settings as S } from '../lib/settings'
import { toCsv } from '../lib/csv'

export default function Settings() {
  const { shop, settings, updateSettings, refreshShop } = useSession()
  const toast = useToast()
  const [name, setName] = useState(shop?.name ?? '')

  async function save(patch: Partial<S>) {
    try { await updateSettings(patch); toast('Saved', { kind: 'ok' }) }
    catch (e: any) { toast(e.message?.includes('settings') ? 'Settings need a quick database update first. Claude is on it.' : e.message, { kind: 'bad' }) }
  }

  async function saveName() {
    if (!shop || !name.trim() || name.trim() === shop.name) return
    const { error } = await supabase.from('shops').update({ name: name.trim() }).eq('id', shop.id)
    if (error) toast(error.message, { kind: 'bad' }); else { toast('Shop name saved', { kind: 'ok' }); refreshShop() }
  }

  const cols = settings.botColumns
  const setCols = (next: S['botColumns']) => save({ botColumns: next })
  const moveCol = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= cols.length) return; const n = [...cols];[n[i], n[j]] = [n[j], n[i]]; setCols(n) }
  const unused = BOT_FIELDS.filter(f => !cols.some(c => c.key === f.key))
  const preview = toCsv([cols.map(c => c.header), cols.map(c => BOT_FIELDS.find(f => f.key === c.key)?.sample ?? '')])

  return (
    <div className="stack wide-gap">
      <div className="page-head"><div><span className="eyebrow">Settings</span><h1>Customize your shop</h1></div></div>
      <p className="muted">Everything here feeds the drop-downs across the app. Changes save as you make them.</p>

      <div className="settings-grid">
        <section className="card stack">
          <h2>Shop</h2>
          <label>Shop name<input value={name} onChange={e => setName(e.target.value)} onBlur={saveName} /></label>
        </section>

        <section className="card stack">
          <h2>Categories</h2>
          <p className="muted small">The category drop-down when you receive or edit items, and the filters in Get ready for live.</p>
          <ListEditor items={settings.categories} onChange={categories => save({ categories })} placeholder="Add a category, like Watches" />
        </section>

        <section className="card stack">
          <h2>Item tags</h2>
          <p className="muted small">Labels you can stick on items, like "Clearance" or "New arrival". Filter by them when planning a live.</p>
          <ListEditor items={settings.itemTags} onChange={itemTags => save({ itemTags })} placeholder="Add a tag, like Valentine's" />
        </section>

        <section className="card stack">
          <h2>Live themes</h2>
          <p className="muted small">Shown when you schedule a live on the calendar.</p>
          <ListEditor items={settings.liveThemes} onChange={liveThemes => save({ liveThemes })} placeholder="Add a theme, like Purse Party" />
        </section>

        <section className="card stack">
          <h2>Hosts</h2>
          <ListEditor items={settings.hosts} onChange={hosts => save({ hosts })} placeholder="Add a host name" />
        </section>

        <section className="card stack">
          <h2>Alerts and defaults</h2>
          <label>Call stock "old" after this many days
            <span className="input-suffix"><input inputMode="numeric" defaultValue={settings.oldStockDays} onBlur={e => { const n = parseInt(e.target.value, 10); if (n > 0 && n !== settings.oldStockDays) save({ oldStockDays: n }) }} /><span>days</span></span>
          </label>
          <label>Default live length
            <span className="input-suffix"><input inputMode="numeric" defaultValue={settings.liveDurationMin} onBlur={e => { const n = parseInt(e.target.value, 10); if (n > 0 && n !== settings.liveDurationMin) save({ liveDurationMin: n }) }} /><span>minutes</span></span>
          </label>
        </section>
      </div>

      <section className="card stack">
        <h2>Bot CSV columns</h2>
        <p className="muted small">Every live-sale bot wants its own columns. Pick which fields go in the file you download for a live, what each column is called, and the order. Rename a column to match exactly what your bot asks for.</p>
        <div className="stack">
          {cols.map((c, i) => (
            <div key={c.key} className="col-row">
              <span className="col-num">{i + 1}</span>
              <span className="muted small col-field">{BOT_FIELDS.find(f => f.key === c.key)?.label ?? c.key}</span>
              <input aria-label="Column header" defaultValue={c.header} onBlur={e => { const v = e.target.value.trim(); if (v && v !== c.header) setCols(cols.map(x => x.key === c.key ? { ...x, header: v } : x)) }} />
              <button className="icon-btn" aria-label="Move up" onClick={() => moveCol(i, -1)} disabled={i === 0}>↑</button>
              <button className="icon-btn" aria-label="Move down" onClick={() => moveCol(i, 1)} disabled={i === cols.length - 1}>↓</button>
              <button className="icon-btn danger-text" aria-label="Remove column" onClick={() => setCols(cols.filter(x => x.key !== c.key))} disabled={cols.length === 1}>×</button>
            </div>
          ))}
        </div>
        {unused.length > 0 && (
          <label>Add a column
            <select value="" onChange={e => { const f = BOT_FIELDS.find(x => x.key === e.target.value); if (f) setCols([...cols, { key: f.key, header: f.label }]) }}>
              <option value="">Choose a field…</option>
              {unused.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
          </label>
        )}
        <span className="eyebrow">Preview</span>
        <pre className="csv-preview">{preview}</pre>
        <button className="link-btn self-start" onClick={() => setCols(DEFAULT_SETTINGS.botColumns)}>Reset to the basic 4 columns</button>
      </section>
    </div>
  )
}
