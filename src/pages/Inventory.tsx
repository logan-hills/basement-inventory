import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadItems, money, photoUrls, type Item } from '../lib/data'

export default function Inventory() {
  const navigate = useNavigate()
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

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    const all = items.flatMap(it => it.variants.map(v => ({ it, v })))
    if (!s) return all
    return all.filter(({ it, v }) =>
      it.name.toLowerCase().includes(s) || (it.brand ?? '').toLowerCase().includes(s) ||
      (it.category ?? '').toLowerCase().includes(s) || v.live_number.includes(s) || v.label.toLowerCase().includes(s))
  }, [items, q])

  const units = rows.reduce((s, r) => s + (r.v.in_stock ?? 0), 0)

  return (
    <div className="stack">
      <div className="page-head">
        <div><span className="eyebrow">Stock</span><h1>Inventory</h1></div>
        <div className="row-gap">
          <Link to="/scan" className="btn outline-gold">Scan</Link>
          <Link to="/intake" className="btn primary">+ Receive items</Link>
        </div>
      </div>
      <input type="search" className="search" placeholder="Search name, brand or Live #" value={q} onChange={e => setQ(e.target.value)} />
      {err && <p className="danger-text">{err}</p>}
      {loading ? <div className="skeleton-list"><div /><div /><div /></div> : rows.length === 0 ? (
        <div className="empty card"><b>{items.length ? 'Nothing matches that search' : 'No inventory yet'}</b>
          <span className="muted">{items.length ? 'Try a name or a 4-digit Live Number.' : 'Receive your first item to get Live Numbers and tags.'}</span>
          {!items.length && <Link to="/intake" className="btn primary">Receive items</Link>}
        </div>
      ) : (
        <>
          <span className="muted small">{rows.length} variation{rows.length === 1 ? '' : 's'} · {units} units in stock</span>
          <div className="table-box">
            <table className="data-table clickable">
              <thead><tr><th>Item</th><th>Live #</th><th>Variation</th><th>Price</th><th>Stock</th><th className="hide-sm">Weight</th></tr></thead>
              <tbody>
                {rows.map(({ it, v }) => (
                  <tr key={v.id} onClick={() => navigate(`/item/${it.id}`)} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') navigate(`/item/${it.id}`) }}>
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
