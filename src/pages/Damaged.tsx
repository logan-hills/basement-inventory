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
        <div><span className="eyebrow">Stock</span><h1>Damaged</h1></div>
        {rows && rows.length > 0 && <span className="muted">{rows.length} removed · {money(lost)} retail value</span>}
      </div>
      {!rows ? <p className="muted">Loading…</p> : rows.length === 0 ? (
        <div className="empty card"><b>Nothing damaged out</b><span className="muted">When you remove a tag from stock, it shows up here so you can track losses or put it back.</span></div>
      ) : (
        <div className="table-box">
          <table className="data-table">
            <thead><tr><th>Tag</th><th>Item</th><th>Reason</th><th>Note</th><th>When</th><th /></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
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
      )}
    </div>
  )
}
