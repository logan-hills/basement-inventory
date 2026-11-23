import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sheet from './Sheet'
import { DAMAGE_REASONS } from '../lib/data'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { tap } from '../lib/feedback'

export type DamageLine = { variantId: string; itemId: string; name: string; label: string; live: string; inStock: number }

/**
 * Damage out one or many variations at once, with a quantity for each.
 * Used from Inventory when rows are selected. To pick exact tags, sellers open the item page.
 */
export default function DamageQtySheet({ lines, onClose, onChanged }: { lines: DamageLine[] | null; onClose: () => void; onChanged: () => void }) {
  const { shop } = useSession()
  const toast = useToast()
  const [qty, setQty] = useState<Record<string, number>>({})
  const [reason, setReason] = useState<string>('Damaged')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const open = !!lines && lines.length > 0
  const usable = (lines ?? []).filter(l => l.inStock > 0)

  useEffect(() => {
    if (!lines) return
    setQty(Object.fromEntries(lines.map(l => [l.variantId, l.inStock > 0 ? 1 : 0])))
    setNote('')
  }, [lines])

  const set = (id: string, n: number, max: number) => setQty(q => ({ ...q, [id]: Math.max(0, Math.min(max, n)) }))
  const total = usable.reduce((s, l) => s + (qty[l.variantId] ?? 0), 0)

  async function confirm() {
    if (!shop || !total) return
    setBusy(true)
    try {
      const want = usable.filter(l => (qty[l.variantId] ?? 0) > 0)
      const { data, error } = await supabase.from('units').select('id,tag_code,variant_id').in('variant_id', want.map(l => l.variantId)).eq('status', 'in_stock').order('tag_code')
      if (error) throw error
      const ids: string[] = []
      for (const l of want) ids.push(...(data ?? []).filter(u => u.variant_id === l.variantId).slice(0, qty[l.variantId]).map(u => u.id))
      if (!ids.length) throw new Error('Those pieces are no longer in stock.')
      const up = await supabase.from('units').update({ status: 'removed', removed_reason: reason, removed_note: note || null, removed_at: new Date().toISOString() }).in('id', ids).eq('status', 'in_stock')
      if (up.error) throw up.error
      await supabase.from('movements').insert(ids.map(id => ({ shop_id: shop.id, unit_id: id, action: `damage_out:${reason}` })))
      tap()
      toast(`Removed ${ids.length} piece${ids.length === 1 ? '' : 's'} · ${reason}`, {
        undo: async () => {
          await supabase.from('units').update({ status: 'in_stock', removed_reason: null, removed_note: null, removed_at: null }).in('id', ids)
          await supabase.from('movements').insert(ids.map(id => ({ shop_id: shop.id, unit_id: id, action: 'restore' })))
          toast(`${ids.length} piece${ids.length === 1 ? ' is' : 's are'} back in stock`, { kind: 'ok' })
          onChanged()
        },
      })
      onChanged()
      onClose()
    } catch (e: any) {
      toast(e.message ?? 'Could not remove those pieces', { kind: 'bad' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title={lines && lines.length > 1 ? `Damage out ${lines.length} items` : 'Damage out'}>
      {open && (
        <div className="stack">
          <p className="muted small">Set how many of each are damaged. Leave a row at 0 to skip it.</p>
          <div className="dmg-lines">
            {lines!.map(l => {
              const n = qty[l.variantId] ?? 0
              return (
                <div key={l.variantId} className={`dmg-line ${n ? 'on' : ''}`}>
                  <div className="dmg-line-text">
                    <b>{l.name}</b>
                    <span className="muted small"><span className="gold">#{l.live}</span> · {l.label} · {l.inStock} on the shelf</span>
                  </div>
                  {l.inStock > 0 ? (
                    <div className="stepper mini">
                      <button type="button" onClick={() => set(l.variantId, n - 1, l.inStock)} disabled={n <= 0} aria-label={`One less ${l.name}`}>−</button>
                      <input inputMode="numeric" value={n} aria-label={`How many ${l.name} damaged`} onChange={e => set(l.variantId, parseInt(e.target.value.replace(/\D/g, '') || '0', 10), l.inStock)} />
                      <button type="button" onClick={() => set(l.variantId, n + 1, l.inStock)} disabled={n >= l.inStock} aria-label={`One more ${l.name}`}>+</button>
                    </div>
                  ) : <span className="muted small">None in stock</span>}
                </div>
              )
            })}
          </div>
          {usable.length > 1 && (
            <div className="row-gap">
              <button type="button" className="link-btn" onClick={() => setQty(Object.fromEntries(usable.map(l => [l.variantId, 1])))}>1 of each</button>
              <button type="button" className="link-btn" onClick={() => setQty(Object.fromEntries(usable.map(l => [l.variantId, l.inStock])))}>All of each</button>
              <button type="button" className="link-btn" onClick={() => setQty({})}>Reset to 0</button>
            </div>
          )}
          <div className="chips" role="radiogroup" aria-label="Reason">
            {DAMAGE_REASONS.map(r => (
              <button key={r} type="button" role="radio" aria-checked={reason === r} className={`chip ${reason === r ? 'on danger' : ''}`} onClick={() => { setReason(r); tap() }}>{r}</button>
            ))}
          </div>
          <label>Note (optional)<input value={note} onChange={e => setNote(e.target.value)} placeholder="Water damage from roof leak" /></label>
          <p className="muted small">The app takes the lowest tag numbers first. To choose exact tags, open the item{lines!.length === 1 ? <> (<Link to={`/item/${lines![0].itemId}`} onClick={onClose}>open it</Link>)</> : ''} and tick them.</p>
          <button className="btn danger big" disabled={busy || !total} onClick={confirm}>{busy ? 'Removing…' : total === 0 ? 'Pick how many' : `Remove ${total} from stock`}</button>
        </div>
      )}
    </Sheet>
  )
}
