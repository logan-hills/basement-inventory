import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { moveUnit, type Bin } from '../lib/locations'
import { money } from '../lib/data'
import SwipeRow from '../components/SwipeRow'

export default function BinDetail() {
  const { id } = useParams()
  const { shop } = useSession()
  const toast = useToast()
  const [bin, setBin] = useState<Bin | null>(null)
  const [units, setUnits] = useState<any[] | null>(null)
  const navigate = useNavigate()

  async function removeBin() {
    if (!bin || (units ?? []).length) return
    const { error } = await supabase.from('locations').delete().eq('id', bin.id)
    if (error) { toast(error.message, { kind: 'bad' }); return }
    toast(`Removed bin ${bin.code}`, { kind: 'ok' })
    navigate('/locations')
  }

  const load = useCallback(async () => {
    const [b, u] = await Promise.all([
      supabase.from('locations').select('id,code,name,aisle,section,level,bin_no').eq('id', id!).single(),
      supabase.from('units').select('id,tag_code, variant:variants!inner(label,live_number,price, item:items!inner(id,name))').eq('location_id', id!).eq('status', 'in_stock').order('tag_code'),
    ])
    setBin(b.data as any)
    setUnits(u.data ?? [])
  }, [id])
  useEffect(() => { load() }, [load])

  async function takeOut(u: any) {
    if (!shop) return
    const from = await moveUnit(shop.id, u.id, null)
    toast(`${u.tag_code} taken out of ${bin?.code}`, { undo: async () => { await moveUnit(shop.id, u.id, from); load() } })
    load()
  }

  if (!bin) return <p className="muted">Loading…</p>
  const value = (units ?? []).reduce((s, u) => s + (Number(u.variant.price) || 0), 0)
  const kinds = new Set((units ?? []).map(u => u.variant.live_number)).size

  return (
    <div className="stack wide-gap">
      <Link to="/locations" className="back-link">‹ Warehouse</Link>
      <div className="page-head">
        <div><span className="eyebrow">{bin.name}</span><h1 className="mono">{bin.code}</h1></div>
        <div className="row-gap">
          <Link className="btn ghost" to={`/bin-labels?ids=${bin.id}`}>Print bin label</Link>
          <Link className="btn outline-gold" to={`/scan?bin=${bin.code}`}>Put items here</Link>
        </div>
      </div>
      <div className="stat-grid three">
        <div className="stat"><span>Units</span><b>{units?.length ?? '—'}</b></div>
        <div className="stat"><span>Different items</span><b>{kinds}</b></div>
        <div className="stat"><span>Retail value</span><b className="gold">{money(value).replace('.00', '')}</b></div>
      </div>
      {units && units.length === 0 ? (
        <div className="empty card"><b>This bin is empty</b><span className="muted">Tap "Put items here", then scan item tags to shelve them in this bin.</span><button className="link-btn danger-text" onClick={removeBin}>Remove this bin</button></div>
      ) : (
        <div className="card unit-list">
          <span className="eyebrow">Tags in this bin · swipe left to take one out</span>
          {(units ?? []).map(u => (
            <SwipeRow key={u.id} leftLabel="Take out" onSwipeLeft={() => takeOut(u)}>
              <div className="unit-row wide">
                <span className="gold strong">#{u.variant.live_number}</span>
                <Link to={`/item/${u.variant.item.id}`}>{u.variant.item.name} <span className="muted">· {u.variant.label}</span></Link>
                <span className="mono muted">{u.tag_code}</span>
              </div>
            </SwipeRow>
          ))}
        </div>
      )}
    </div>
  )
}
