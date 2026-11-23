import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import ListEditor from '../components/ListEditor'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { BOT_FIELDS, DEFAULT_SETTINGS, type Settings as S } from '../lib/settings'
import { toCsv } from '../lib/csv'

const PAGES = [
  { k: 'shop', label: 'Your shop', icon: 'settings' },
  { k: 'lists', label: 'Categories and tags', icon: 'tag' },
  { k: 'lives', label: 'Live themes and hosts', icon: 'live' },
  { k: 'checklist', label: 'Live checklists', icon: 'sparkle' },
  { k: 'goals', label: 'Goals, alerts and defaults', icon: 'trend' },
  { k: 'bot', label: 'Bot CSV columns', icon: 'download' },
] as const

/** Settings is a short list; each row opens its own page so there's only one thing to look at at a time. */
export default function Settings() {
  const { section } = useParams<{ section?: string }>()
  const page = PAGES.find(p => p.k === section)
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

  const hint: Record<typeof PAGES[number]['k'], string> = {
    shop: shop?.name ?? 'Your shop name',
    lists: `${settings.categories.length} categories · ${settings.itemTags.length} item tags`,
    lives: `${settings.liveThemes.length} themes · ${settings.hosts.length} host${settings.hosts.length === 1 ? '' : 's'}`,
    checklist: `${settings.checklist.before.length + settings.checklist.during.length + settings.checklist.after.length} steps for before, during and after`,
    goals: `$${settings.monthlyGoal.toLocaleString()} monthly goal · old stock after ${settings.oldStockDays} days`,
    bot: `${cols.length} column${cols.length === 1 ? '' : 's'} in the file you give your bot`,
  }

  if (!page) return (
    <div className="stack wide-gap">
      <div className="page-head"><div><h1>Settings</h1><p className="lede">Make the app speak your language. Everything here feeds the drop-downs across the app, and changes save as you make them.</p></div></div>
      <div className="hub-list">
        {PAGES.map(p => (
          <Link key={p.k} to={`/settings/${p.k}`} className="hub-row">
            <span className="action-ico"><Icon name={p.icon} size={22} /></span>
            <span className="action-text"><b>{p.label}</b><small>{hint[p.k]}</small></span>
            <Icon name="chevron" size={20} className="action-chev" />
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <div className="stack wide-gap settings-page">
      <Link to="/settings" className="back-link">‹ Settings</Link>
      <div className="page-head"><div><h1>{page.label}</h1><span className="muted">Changes save as you make them.</span></div></div>
      {page.k === 'shop' && <div className="settings-one">
        <section className="card stack">
          <label>Shop name<input value={name} onChange={e => setName(e.target.value)} onBlur={saveName} /></label>
        </section>
      </div>}
      {page.k === 'lists' && <div className="settings-grid two">
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
      </div>}
      {page.k === 'lives' && <div className="settings-grid two">
        <section className="card stack">
          <h2>Live themes</h2>
          <p className="muted small">Shown when you schedule a live on the calendar.</p>
          <ListEditor items={settings.liveThemes} onChange={liveThemes => save({ liveThemes })} placeholder="Add a theme, like Purse Party" />
        </section>
        <section className="card stack">
          <h2>Hosts</h2>
          <ListEditor items={settings.hosts} onChange={hosts => save({ hosts })} placeholder="Add a host name" />
        </section>
      </div>}
      {page.k === 'checklist' && <div className="settings-grid">
        <section className="card stack">
          <h2>Before the live</h2>
          <p className="muted small">The steps every live starts with. Each live in the Planner gets its own copy to tick off.</p>
          <ListEditor items={settings.checklist.before} onChange={before => save({ checklist: { ...settings.checklist, before } })} placeholder="Add a step" />
        </section>
        <section className="card stack">
          <h2>During the live</h2>
          <ListEditor items={settings.checklist.during} onChange={during => save({ checklist: { ...settings.checklist, during } })} placeholder="Add a step" />
        </section>
        <section className="card stack">
          <h2>After the live</h2>
          <ListEditor items={settings.checklist.after} onChange={after => save({ checklist: { ...settings.checklist, after } })} placeholder="Add a step" />
        </section>
      </div>}
      {page.k === 'goals' && <div className="settings-one">
        <section className="card stack">
          <label>Call stock "old" after this many days
            <span className="input-suffix"><input inputMode="numeric" defaultValue={settings.oldStockDays} onBlur={e => { const n = parseInt(e.target.value, 10); if (n > 0 && n !== settings.oldStockDays) save({ oldStockDays: n }) }} /><span>days</span></span>
          </label>
          <label>Monthly sales goal
            <span className="input-suffix"><span>$</span><input inputMode="numeric" defaultValue={settings.monthlyGoal} onBlur={e => { const n = parseInt(e.target.value.replace(/\D/g, ''), 10); if (n > 0 && n !== settings.monthlyGoal) save({ monthlyGoal: n }) }} /></span>
          </label>
          <label>Default live length
            <span className="input-suffix"><input inputMode="numeric" defaultValue={settings.liveDurationMin} onBlur={e => { const n = parseInt(e.target.value, 10); if (n > 0 && n !== settings.liveDurationMin) save({ liveDurationMin: n }) }} /><span>minutes</span></span>
          </label>
        </section>
      </div>}
      {page.k === 'bot' && (
      <section className="card stack">
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
      )}
    </div>
  )
}
