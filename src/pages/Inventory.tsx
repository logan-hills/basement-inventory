import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadItems, money, photoUrls, type Item } from '../lib/data'

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([])
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    loadItems()
      .then(async list => {
        setItems(list)
        setUrls(await photoUrls(list.map(i => i.photos[0]?.path).filter(Boolean) as string[]))
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false))
  }, [])

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter(it =>
      it.name.toLowerCase().includes(s) ||
      (it.brand ?? '').toLowerCase().includes(s) ||
      (it.category ?? '').toLowerCase().includes(s) ||
      it.variants.some(v => v.live_number.includes(s) || v.label.toLowerCase().includes(s)),
    )
  }, [items, q])

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Inventory</h1>
        <Link to="/intake" className="button primary">+ Add</Link>
      </div>
      <input type="search" placeholder="Search name, brand or Live Number" value={q} onChange={e => setQ(e.target.value)} />
      {err && <p className="note error">{err}</p>}
      {loading ? <p className="muted">Loading…</p> : shown.length === 0 ? (
        <p className="muted">{items.length ? 'Nothing matches that search.' : 'No items yet. Tap Add to log your first one.'}</p>
      ) : (
        <div className="item-list">
          {shown.map(it => (
            <div key={it.id} className="card item-card">
              <div className="item-photo">{it.photos[0] && urls[it.photos[0].path] ? <img src={urls[it.photos[0].path]} alt="" /> : <span>📦</span>}</div>
              <div className="item-body">
                <div className="item-title">
                  <strong>{it.name}</strong>
                  <span className="muted small">{[it.brand, it.category].filter(Boolean).join(' · ')}</span>
                </div>
                <table className="variants">
                  <tbody>
                    {it.variants.map(v => (
                      <tr key={v.id}>
                        <td className="live">#{v.live_number}</td>
                        <td>{v.label}</td>
                        <td>{money(v.price)}</td>
                        <td>{v.in_stock} in stock</td>
                        <td><Link to={`/labels?variant=${v.id}`} className="link-text">Tags</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link to={`/labels?item=${it.id}`} className="link-text small">Print all tags for this item</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
