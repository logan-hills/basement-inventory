import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadItems, money, photoUrls, type Item } from '../lib/data'
import { useSession } from '../lib/session'
import CategoryRail from '../components/CategoryRail'

export default function Inventory() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Item[]>([])
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const { settings } = useSession()
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [sel, setSel] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setSel(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })

  useEffect(() => {
    loadItems()
      .then(async list => {
        setItems(list)
        setUrls(await photoUrls(list.map(i => i.photos[0]?.path).filter(Boolean) as string[]))
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false))
  }, [])

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    const all = items.flatMap(it => it.variants.map(v => ({ it, v }))).filter(({ it }) => !cat || it.category === cat)
    if (!s) return all
    return all.filter(({ it, v }) =>
      it.name.toLowerCase().includes(s) || (it.brand ?? '').toLowerCase().includes(s) ||
      (it.category ?? '').toLowerCase().includes(s) || v.live_number.includes(s) || v.label.toLowerCase().includes(s))
  }, [items, q, cat])
  const catStats = useMemo(() => {
    const m = new Map<string, { pieces: number; value: number; photo: string | null }>()
    for (const c of settings.categories) m.set(c, { pieces: 0, value: 0, photo: null })
    for (const it of items) { if (!it.category) continue; const x = m.get(it.category) ?? { pieces: 0, value: 0, photo: null }; for (const v of it.variants) { x.pieces += v.in_stock ?? 0; x.value += (v.in_stock ?? 0) * (v.price ?? 0) } const ph = it.photos[0]?.path; if (!x.photo && ph && urls[ph]) x.photo = urls[ph]; m.set(it.category, x) }
    return [...m].map(([name, v]) => ({ name, ...v }))
  }, [items, settings.categories, urls])

  const units = rows.reduce((s, r) => s + (r.v.in_stock ?? 0), 0)

  return (
    <div className="stack">
      <div className="page-head">
        <div><span className="eyebrow">Stock</span><h1>Inventory</h1></div>
        <div className="row-gap">
          <Link to="/scan" className="btn outline-gold">Scan</Link>
          <Link to="/receive/bulk" className="btn outline-gold">Bulk upload CSV</Link>
          <Link to="/intake" className="btn primary">+ Add item</Link>
        </div>
      </div>
      {items.length > 0 && <CategoryRail cats={catStats} active={cat} onPick={setCat} money={money} />}
      <input type="search" className="search" placeholder="Search name, brand or Live #" value={q} onChange={e => setQ(e.target.value)} />
      {err && <p className="danger-text">{err}</p>}
      {loading ? <div className="skeleton-list"><div /><div /><div /></div> : rows.length === 0 ? (
        <div className="empty card"><b>{items.length ? 'Nothing matches that search' : 'No inventory yet'}</b>
          <span className="muted">{items.length ? 'Try a name or a 4-digit Live Number.' : 'Receive your first item to get Live Numbers and tags.'}</span>
          {!items.length && <div className="row-gap"><Link to="/intake" className="btn primary">Add an item</Link><Link to="/receive/bulk" className="btn outline-gold">Bulk upload CSV</Link></div>}
        </div>
      ) : (
        <>
          {sel.size > 0 && (
            <div className="action-bar">
              <span><b className="gold">{sel.size}</b> selected</span>
              <div className="row-gap">
                <Link className="btn gold" to={`/labels?variants=${[...sel].join(',')}`}>Print tags for selected</Link>
                <button className="link-btn" onClick={() => setSel(new Set())}>Clear</button>
              </div>
            </div>
          )}
          <span className="muted small">{rows.length} variation{rows.length === 1 ? '' : 's'} · {units} units in stock</span>
          <div className="table-box">
            <table className="data-table clickable">
              <thead><tr><th><input type="checkbox" aria-label="Select all" checked={rows.length > 0 && rows.every(r => sel.has(r.v.id))} onChange={e => setSel(e.target.checked ? new Set(rows.map(r => r.v.id)) : new Set())} /></th><th>Item</th><th>Live #</th><th>Variation</th><th>Price</th><th>Stock</th><th className="hide-sm">Weight</th></tr></thead>
              <tbody>
                {rows.map(({ it, v }) => (
                  <tr key={v.id} onClick={() => navigate(`/item/${it.id}`)} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') navigate(`/item/${it.id}`) }}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" aria-label={`Select #${v.live_number}`} checked={sel.has(v.id)} onChange={() => toggle(v.id)} /></td>
                    <td>
                      <div className="cell-item">
                        <span className="mini-photo">{it.photos[0] && urls[it.photos[0].path] ? <img src={urls[it.photos[0].path]} alt="" /> : null}</span>
                        <b>{it.name}</b>
                      </div>
                    </td>
                    <td className="gold strong">{v.live_number}</td>
                    <td>{v.label}</td>
                    <td>{money(v.price)}</td>
                    <td className={v.in_stock ? '' : 'muted'}>{v.in_stock}</td>
                    <td className="hide-sm muted">{v.weight_lb != null ? `${v.weight_lb} lb` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
