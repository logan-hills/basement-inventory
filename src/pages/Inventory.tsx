import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { money, photoUrls } from '../lib/data'
import { useSession } from '../lib/session'
import { loadStock, margin, type StockRow } from '../lib/stock'
import { CONDITIONS, DEPARTMENTS } from '../lib/itemFields'
import { downloadFile, toCsv } from '../lib/csv'
import { tap } from '../lib/feedback'
import CategoryRail from '../components/CategoryRail'
import Sheet from '../components/Sheet'
import DamageQtySheet, { type DamageLine } from '../components/DamageQtySheet'
import BulkEditSheet from '../components/BulkEditSheet'

type Sort = 'newest' | 'oldest' | 'name' | 'live' | 'price_hi' | 'price_lo' | 'stock_hi' | 'stock_lo' | 'value' | 'margin'
const SORTS: { key: Sort; label: string }[] = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'name', label: 'Name A to Z' },
  { key: 'live', label: 'Live # low to high' },
  { key: 'price_hi', label: 'Price high to low' },
  { key: 'price_lo', label: 'Price low to high' },
  { key: 'stock_hi', label: 'Most in stock' },
  { key: 'stock_lo', label: 'Fewest in stock' },
  { key: 'value', label: 'Shelf value (price × stock)' },
  { key: 'margin', label: 'Best profit margin' },
]
type StockView = 'in' | 'out' | 'all'
type Missing = '' | 'photo' | 'price' | 'cost' | 'bin' | 'category' | 'weight'
const MISSING: { key: Missing; label: string }[] = [
  { key: 'photo', label: 'No photo' }, { key: 'price', label: 'No price' }, { key: 'cost', label: 'No cost' },
  { key: 'bin', label: 'Not in a bin' }, { key: 'category', label: 'No category' }, { key: 'weight', label: 'No weight' },
]
type Filters = { brand: string; tag: string; condition: string; department: string; color: string; season: string; supplier: string; bin: string; age: '' | 'old' | 'new'; missing: Missing }
const NO_FILTERS: Filters = { brand: '', tag: '', condition: '', department: '', color: '', season: '', supplier: '', bin: '', age: '', missing: '' }
const FILTER_LABEL: Record<keyof Filters, string> = { brand: 'Brand', tag: 'Tag', condition: 'Condition', department: 'Department', color: 'Color', season: 'Season', supplier: 'Supplier', bin: 'Bin', age: 'Age', missing: 'Missing' }

const remember = <T extends string>(key: string, fallback: T): T => { try { return (localStorage.getItem(key) as T) || fallback } catch { return fallback } }
const save = (key: string, v: string) => { try { localStorage.setItem(key, v) } catch { /* private mode */ } }
const distinct = (xs: (string | null | undefined)[]) => [...new Set(xs.filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b))

export default function Inventory() {
  const navigate = useNavigate()
  const { settings } = useSession()
  const [rows, setRows] = useState<StockRow[] | null>(null)
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [stockView, setStockView] = useState<StockView>(() => remember('invStock', 'in'))
  const [sort, setSort] = useState<Sort>(() => remember('invSort', 'newest'))
  const [view, setView] = useState<'list' | 'grid'>(() => remember('invView', 'list'))
  const [f, setF] = useState<Filters>(NO_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [damage, setDamage] = useState<DamageLine[] | null>(null)
  const [edit, setEdit] = useState<StockRow[] | null>(null)

  useEffect(() => save('invStock', stockView), [stockView])
  useEffect(() => save('invSort', sort), [sort])
  useEffect(() => save('invView', view), [view])

  const load = useCallback(() => {
    loadStock()
      .then(async list => {
        setRows(list)
        setUrls(await photoUrls([...new Set(list.map(r => r.item.photo).filter(Boolean) as string[])]))
      })
      .catch(e => { setErr(e.message); setRows([]) })
  }, [])
  useEffect(() => { load() }, [load])

  const all = useMemo(() => rows ?? [], [rows])
  const opts = useMemo(() => ({
    brand: distinct(all.map(r => r.item.brand)),
    tag: distinct(all.flatMap(r => r.item.tags)),
    condition: distinct([...CONDITIONS.filter(c => all.some(r => r.item.condition === c)), ...all.map(r => r.item.condition)]),
    department: distinct([...DEPARTMENTS.filter(c => all.some(r => r.item.department === c)), ...all.map(r => r.item.department)]),
    color: distinct(all.map(r => r.item.color)),
    season: distinct(all.map(r => r.item.season)),
    supplier: distinct(all.map(r => r.item.supplier)),
    bin: distinct(all.flatMap(r => r.bins)),
  }), [all])

  const oldDays = settings.oldStockDays
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase()
    const hay = (r: StockRow) => [r.item.name, r.item.brand, r.item.category, r.live_number, r.label, r.sku, r.upc, r.item.color, r.item.material, r.item.supplier, r.item.season, r.item.condition, r.item.description, ...r.item.tags, ...r.bins].filter(Boolean).join(' ').toLowerCase()
    const list = all.filter(r =>
      (stockView === 'all' || (stockView === 'in' ? r.inStock > 0 : r.inStock === 0)) &&
      (!cat || r.item.category === cat) &&
      (!s || hay(r).includes(s)) &&
      (!f.brand || r.item.brand === f.brand) && (!f.tag || r.item.tags.includes(f.tag)) &&
      (!f.condition || r.item.condition === f.condition) && (!f.department || r.item.department === f.department) &&
      (!f.color || r.item.color === f.color) && (!f.season || r.item.season === f.season) && (!f.supplier || r.item.supplier === f.supplier) &&
      (!f.bin || (f.bin === '__none' ? r.inStock > 0 && r.bins.length === 0 : r.bins.includes(f.bin))) &&
      (!f.age || (f.age === 'old' ? r.ageDays >= oldDays : r.ageDays <= 7)) &&
      (!f.missing || (f.missing === 'photo' ? !r.item.photo : f.missing === 'price' ? r.price == null : f.missing === 'cost' ? r.cost == null
        : f.missing === 'bin' ? r.inStock > 0 && r.bins.length === 0 : f.missing === 'category' ? !r.item.category : r.weight_lb == null)))
    const by: Record<Sort, (a: StockRow, b: StockRow) => number> = {
      newest: (a, b) => b.item.created_at.localeCompare(a.item.created_at),
      oldest: (a, b) => b.ageDays - a.ageDays,
      name: (a, b) => a.item.name.localeCompare(b.item.name),
      live: (a, b) => a.live_number.localeCompare(b.live_number),
      price_hi: (a, b) => (b.price ?? -1) - (a.price ?? -1),
      price_lo: (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
      stock_hi: (a, b) => b.inStock - a.inStock,
      stock_lo: (a, b) => a.inStock - b.inStock,
      value: (a, b) => b.inStock * (b.price ?? 0) - a.inStock * (a.price ?? 0),
      margin: (a, b) => (margin(b) ?? -9) - (margin(a) ?? -9),
    }
    // Rank whole items by their best variation so an item's sizes and colors stay side by side.
    const rank = new Map<string, number>()
    list.slice().sort((a, b) => by[sort](a, b) || a.item.name.localeCompare(b.item.name)).forEach((r, i) => { if (!rank.has(r.item.id)) rank.set(r.item.id, i) })
    return list.sort((a, b) => (rank.get(a.item.id)! - rank.get(b.item.id)!) || a.label.localeCompare(b.label, undefined, { numeric: true }))
  }, [all, q, cat, stockView, f, sort, oldDays])

  const catStats = useMemo(() => {
    const m = new Map<string, { pieces: number; value: number; photo: string | null }>()
    for (const c of settings.categories) m.set(c, { pieces: 0, value: 0, photo: null })
    for (const r of all) { if (!r.item.category) continue; const x = m.get(r.item.category) ?? { pieces: 0, value: 0, photo: null }; x.pieces += r.inStock; x.value += r.inStock * (r.price ?? 0); if (!x.photo && r.item.photo && urls[r.item.photo]) x.photo = urls[r.item.photo]; m.set(r.item.category, x) }
    return [...m].map(([name, v]) => ({ name, ...v }))
  }, [all, settings.categories, urls])

  const toggle = (id: string) => { tap(); setSel(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n }) }
  const allShownOn = shown.length > 0 && shown.every(r => sel.has(r.id))
  const selectShown = (on: boolean) => setSel(s => { const n = new Set(s); shown.forEach(r => (on ? n.add(r.id) : n.delete(r.id))); return n })
  const picked = all.filter(r => sel.has(r.id))
  const pieces = shown.reduce((s, r) => s + r.inStock, 0)
  const value = shown.reduce((s, r) => s + r.inStock * (r.price ?? 0), 0)
  const active = (Object.keys(f) as (keyof Filters)[]).filter(k => f[k])
  const anyFilter = active.length > 0 || !!q || !!cat || stockView !== 'in'
  const chipText = (k: keyof Filters) => k === 'age' ? (f.age === 'old' ? `${oldDays}+ days old` : 'New this week') : k === 'missing' ? MISSING.find(m => m.key === f.missing)?.label : k === 'bin' && f.bin === '__none' ? 'Not in a bin' : `${FILTER_LABEL[k]}: ${f[k]}`

  function exportCsv() {
    const list = picked.length ? picked : shown
    const head = ['Item name', 'Variation', 'Live #', 'In stock', 'Price', 'Sale price', 'Cost', 'Brand', 'Category', 'Condition', 'Department', 'Color', 'Material', 'Season', 'Supplier', 'Bought on', 'Weight (lb)', 'Bin code', 'Tags', 'SKU', 'UPC', 'Days in stock', 'Notes']
    const body = list.map(r => [r.item.name, r.label, r.live_number, r.inStock, r.price, r.sale_price, r.cost, r.item.brand, r.item.category, r.item.condition, r.item.department, r.item.color, r.item.material, r.item.season, r.item.supplier, r.item.purchased_on, r.weight_lb, r.bins.join(' '), r.item.tags.join('; '), r.sku, r.upc, r.ageDays, r.item.description])
    downloadFile(`inventory-${new Date().toISOString().slice(0, 10)}.csv`, toCsv([head, ...body]) + '\r\n')
  }

  const ids = [...sel].join(',')
  const price = (r: StockRow) => r.sale_price != null && r.price != null && r.sale_price < r.price
    ? <><s className="muted">{money(r.price)}</s> <b className="sale-text">{money(r.sale_price)}</b></>
    : money(r.price) || <span className="muted">—</span>

  return (
    <div className="stack inv">
      <div className="page-head">
        <div><span className="eyebrow">Stock</span><h1>Inventory</h1></div>
        <div className="row-gap">
          <Link to="/scan" className="btn outline-gold">Scan</Link>
          <Link to="/receive/bulk" className="btn outline-gold">Bulk upload CSV</Link>
          <Link to="/intake" className="btn primary">+ Add item</Link>
        </div>
      </div>
      {all.length > 0 && <CategoryRail cats={catStats} active={cat} onPick={setCat} money={money} />}

      <div className="inv-toolbar">
        <input type="search" className="search" placeholder="Search name, Live #, brand, color, bin, SKU…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search inventory" />
        <div className="inv-controls">
          <div className="seg" role="group" aria-label="Stock">
            {([['in', 'In stock'], ['out', 'Sold out'], ['all', 'All']] as const).map(([k, l]) => <button key={k} className={stockView === k ? 'on' : ''} aria-pressed={stockView === k} onClick={() => setStockView(k)}>{l}</button>)}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value as Sort)} aria-label="Sort by" className="inv-sort">
            {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <button className={`btn ${active.length ? 'gold' : 'outline-gold'}`} onClick={() => setShowFilters(true)}>Filters{active.length ? ` · ${active.length}` : ''}</button>
          <div className="seg" role="group" aria-label="Layout">
            <button className={view === 'list' ? 'on' : ''} aria-pressed={view === 'list'} onClick={() => setView('list')}>List</button>
            <button className={view === 'grid' ? 'on' : ''} aria-pressed={view === 'grid'} onClick={() => setView('grid')}>Grid</button>
          </div>
        </div>
      </div>

      {(active.length > 0 || cat) && (
        <div className="chip-list">
          {cat && <button className="chip-mini removable" onClick={() => setCat('')}>Category: {cat} ×</button>}
          {active.map(k => <button key={k} className="chip-mini removable" onClick={() => setF(x => ({ ...x, [k]: '' }))}>{chipText(k)} ×</button>)}
          <button className="link-btn small" onClick={() => { setF(NO_FILTERS); setCat('') }}>Clear all</button>
        </div>
      )}

      {err && <p className="danger-text">{err}</p>}
      {!rows ? <div className="skeleton-list"><div /><div /><div /></div> : shown.length === 0 ? (
        <div className="empty card"><b>{all.length ? 'Nothing matches' : 'No inventory yet'}</b>
          <span className="muted">{all.length ? 'Try fewer filters, another word, or a 4-digit Live Number.' : 'Receive your first item to get Live Numbers and tags.'}</span>
          {all.length > 0 && anyFilter && <button className="btn outline-gold self-center" onClick={() => { setF(NO_FILTERS); setCat(''); setQ(''); setStockView('all') }}>Show everything</button>}
          {!all.length && <div className="row-gap"><Link to="/intake" className="btn primary">Add an item</Link><Link to="/receive/bulk" className="btn outline-gold">Bulk upload CSV</Link></div>}
        </div>
      ) : (
        <>
          <div className="row-between inv-summary">
            <label className="check-line"><input type="checkbox" checked={allShownOn} onChange={e => selectShown(e.target.checked)} /> Select all {shown.length}</label>
            <span className="muted small">{shown.length} variation{shown.length === 1 ? '' : 's'} · {pieces} piece{pieces === 1 ? '' : 's'} · {money(value)} on the shelf</span>
          </div>

          {view === 'list' ? (
            <div className="table-box">
              <table className="data-table clickable inv-table">
                <thead><tr>
                  <th className="check-col"><input type="checkbox" aria-label="Select all shown" checked={allShownOn} onChange={e => selectShown(e.target.checked)} /></th>
                  <th>Item</th><th>Live #</th><th className="hide-xs">Price</th><th>Stock</th><th className="hide-sm">Bin</th><th className="hide-sm">Age</th>
                </tr></thead>
                <tbody>
                  {shown.map(r => (
                    <tr key={r.id} className={sel.has(r.id) ? 'selected' : ''} onClick={() => navigate(`/item/${r.item.id}`)} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') navigate(`/item/${r.item.id}`) }}>
                      <td className="check-col" onClick={e => { e.stopPropagation(); toggle(r.id) }}><input type="checkbox" aria-label={`Select #${r.live_number}`} checked={sel.has(r.id)} onChange={() => {}} /></td>
                      <td>
                        <div className="cell-item">
                          <span className="mini-photo">{r.item.photo && urls[r.item.photo] ? <img src={urls[r.item.photo]} alt="" /> : null}</span>
                          <div className="cell-item-text">
                            <b>{r.item.name}</b>
                            <span className="muted small">{[r.label !== 'One size' ? r.label : '', r.item.brand, r.item.condition].filter(Boolean).join(' · ') || r.item.category || ''}</span>
                            <span className="show-xs small">{price(r)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="gold strong">{r.live_number}</td>
                      <td className="hide-xs">{price(r)}</td>
                      <td className={r.inStock ? '' : 'muted'}>{r.inStock}</td>
                      <td className="hide-sm muted">{r.bins.join(', ') || '—'}</td>
                      <td className={`hide-sm ${r.ageDays >= oldDays && r.inStock ? 'warn-text' : 'muted'}`}>{r.ageDays}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="inv-grid">
              {shown.map(r => (
                <div key={r.id} className={`inv-card ${sel.has(r.id) ? 'selected' : ''}`}>
                  <button className="inv-card-check" aria-pressed={sel.has(r.id)} aria-label={`Select #${r.live_number}`} onClick={() => toggle(r.id)}>{sel.has(r.id) ? '✓' : ''}</button>
                  <Link to={`/item/${r.item.id}`} className="inv-card-link">
                    <span className="inv-card-photo">{r.item.photo && urls[r.item.photo] ? <img src={urls[r.item.photo]} alt="" /> : <span className="muted small">No photo</span>}</span>
                    <span className="inv-card-live">#{r.live_number}</span>
                    <b className="inv-card-name">{r.item.name}</b>
                    <span className="muted small">{r.label !== 'One size' ? r.label : (r.item.brand ?? '')}</span>
                    <span className="row-between"><span>{price(r)}</span><span className={r.inStock ? 'small' : 'muted small'}>{r.inStock} in stock</span></span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {sel.size > 0 && (
        <div className="action-bar floating inv-actions">
          <span><b className="gold">{sel.size}</b> selected{sel.size < shown.length && !allShownOn ? <> · <button className="link-btn" onClick={() => selectShown(true)}>Select all {shown.length}</button></> : null}</span>
          <div className="row-gap">
            <Link className="btn gold" to={`/labels?variants=${ids}`}>Print tags</Link>
            <Link className="btn sale-btn" to={`/labels?variants=${ids}&style=sale`}>Sale tags</Link>
            <button className="btn danger" onClick={() => setDamage(picked.map(r => ({ variantId: r.id, itemId: r.item.id, name: r.item.name, label: r.label, live: r.live_number, inStock: r.inStock })))}>Damage out</button>
            <button className="btn outline-gold" onClick={() => setEdit(picked)}>Edit</button>
            <button className="btn ghost" onClick={exportCsv}>Download CSV</button>
            <button className="link-btn" onClick={() => setSel(new Set())}>Clear</button>
          </div>
        </div>
      )}
      {sel.size === 0 && shown.length > 0 && <button className="link-btn self-start small" onClick={exportCsv}>Download this list as CSV</button>}

      <Sheet open={showFilters} onClose={() => setShowFilters(false)} title="Filter inventory">
        <div className="stack">
          <div className="row2">
            {(['brand', 'tag', 'condition', 'department', 'color', 'season', 'supplier'] as const).map(k => (
              <label key={k}>{FILTER_LABEL[k]}
                <select value={f[k]} onChange={e => setF(x => ({ ...x, [k]: e.target.value }))} disabled={!opts[k].length}>
                  <option value="">{opts[k].length ? 'Any' : 'None set yet'}</option>
                  {opts[k].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
            ))}
            <label>Bin
              <select value={f.bin} onChange={e => setF(x => ({ ...x, bin: e.target.value }))}>
                <option value="">Any</option>
                <option value="__none">Not in a bin yet</option>
                {opts.bin.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
          </div>
          <div className="stack tight-gap"><span className="label-text">Age</span>
            <div className="chips">
              {([['', 'Any'], ['new', 'New this week'], ['old', `${oldDays}+ days (old stock)`]] as const).map(([k, l]) => <button key={k} className={`chip ${f.age === k ? 'on' : ''}`} onClick={() => setF(x => ({ ...x, age: k }))}>{l}</button>)}
            </div>
          </div>
          <div className="stack tight-gap"><span className="label-text">Missing info (to tidy up)</span>
            <div className="chips">
              {MISSING.map(m => <button key={m.key} className={`chip ${f.missing === m.key ? 'on' : ''}`} onClick={() => setF(x => ({ ...x, missing: x.missing === m.key ? '' : m.key }))}>{m.label}</button>)}
            </div>
          </div>
          <div className="row-between">
            <button className="link-btn" onClick={() => setF(NO_FILTERS)}>Clear filters</button>
            <button className="btn primary" onClick={() => setShowFilters(false)}>Show {shown.length}</button>
          </div>
        </div>
      </Sheet>
      <DamageQtySheet lines={damage} onClose={() => setDamage(null)} onChanged={() => { setSel(new Set()); load() }} />
      <BulkEditSheet rows={edit} onClose={() => setEdit(null)} onChanged={load} />
    </div>
  )
}
