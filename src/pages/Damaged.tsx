import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { money, restoreUnit } from '../lib/data'

export default function Damaged() {
  const { shop } = useSession()
  const toast = useToast()
  const [rows, setRows] = useState<any[] | null>(null)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setSel(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })

  async function putBackSelected() {
    if (!shop || !sel.size) return
    const ids = [...sel]
    const { error } = await supabase.from('units').update({ status: 'in_stock', removed_reason: null, removed_note: null, removed_at: null }).in('id', ids)
    if (error) { toast(error.message, { kind: 'bad' }); return }
    await supabase.from('movements').insert(ids.map(id => ({ shop_id: shop.id, unit_id: id, action: 'restore' })))
    toast(`${ids.length} piece${ids.length === 1 ? ' is' : 's are'} back in stock`, { kind: 'ok' })
    setSel(new Set()); load()
  }

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('units')
      .select('id,tag_code,removed_reason,removed_note,removed_at, variant:variants!inner(label,live_number,price, item:items!inner(id,name))')
      .eq('status', 'removed')
      .order('removed_at', { ascending: false })
    setRows(data ?? [])
  }, [])
  useEffect(() => { load() }, [load])

  const lost = (rows ?? []).reduce((s, r) => s + (Number(r.variant.price) || 0), 0)

  return (
    <div className="stack">
      <div className="page-head">
        <div><h1>Damaged</h1></div>
        {rows && rows.length > 0 && <span className="muted">{rows.length} removed · {money(lost)} retail value</span>}
      </div>
      {!rows ? <p className="muted">Loading…</p> : rows.length === 0 ? (
        <div className="empty card"><b>Nothing damaged out</b><span className="muted">When you remove a tag from stock, it shows up here so you can track losses or put it back.</span></div>
      ) : (
        <>
        <p className="muted small">To damage out several items at once with a quantity for each, tick them in <Link to="/inventory">Inventory</Link> and tap Damage out.</p>
        {sel.size > 0 && (
          <div className="action-bar">
            <span><b className="gold">{sel.size}</b> selected</span>
            <div className="row-gap"><button className="btn gold" onClick={putBackSelected}>Put back {sel.size}</button><button className="link-btn" onClick={() => setSel(new Set())}>Clear</button></div>
          </div>
        )}
        <div className="table-box">
          <table className="data-table">
            <thead><tr><th className="check-col"><input type="checkbox" aria-label="Select all" checked={rows.length > 0 && rows.every(r => sel.has(r.id))} onChange={e => setSel(e.target.checked ? new Set(rows.map(r => r.id)) : new Set())} /></th><th>Tag</th><th>Item</th><th>Reason</th><th>Note</th><th>When</th><th /></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="check-col"><input type="checkbox" aria-label={`Select ${r.tag_code}`} checked={sel.has(r.id)} onChange={() => toggle(r.id)} /></td>
                  <td className="mono gold">{r.tag_code}</td>
                  <td><Link to={`/item/${r.variant.item.id}`}>{r.variant.item.name}</Link> <span className="muted">· {r.variant.label}</span></td>
                  <td className="danger-text">{r.removed_reason}</td>
                  <td className="muted">{r.removed_note ?? ''}</td>
                  <td className="muted">{r.removed_at ? new Date(r.removed_at).toLocaleDateString() : ''}</td>
                  <td><button className="link-btn" onClick={async () => { if (shop) { await restoreUnit(shop.id, r.id); toast(`${r.tag_code} is back in stock`, { kind: 'ok' }); load() } }}>Put back</button></td>
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
