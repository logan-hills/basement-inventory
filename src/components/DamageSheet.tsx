import { useEffect, useState } from 'react'
import Sheet from './Sheet'
import { DAMAGE_REASONS } from '../lib/data'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { tap } from '../lib/feedback'

type U = { id: string; tag_code: string; label: string }
type Props = {
  /** One tag (classic swipe / button). */
  unit?: U | null
  /** Several tags at once. With `chooseQty`, the user picks how many of them to remove. */
  units?: U[] | null
  chooseQty?: boolean
  onClose: () => void
  onChanged: () => void
}

export default function DamageSheet({ unit, units, chooseQty, onClose, onChanged }: Props) {
  const { shop } = useSession()
  const toast = useToast()
  const list = units ?? (unit ? [unit] : null)
  const [reason, setReason] = useState<string>('Damaged')
  const [note, setNote] = useState('')
  const [qty, setQty] = useState('1')
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (list) setQty(chooseQty ? '1' : String(list.length)) }, [list?.length, chooseQty]) // eslint-disable-line react-hooks/exhaustive-deps

  const n = list ? Math.max(1, Math.min(list.length, parseInt(qty, 10) || 1)) : 0

  async function confirm() {
    if (!list || !shop) return
    setBusy(true)
    const pick = list.slice(0, n)
    const ids = pick.map(u => u.id)
    try {
      const { error } = await supabase.from('units').update({ status: 'removed', removed_reason: reason, removed_note: note || null, removed_at: new Date().toISOString() }).in('id', ids).eq('status', 'in_stock')
      if (error) throw error
      await supabase.from('movements').insert(ids.map(id => ({ shop_id: shop.id, unit_id: id, action: `damage_out:${reason}` })))
      tap()
      toast(pick.length === 1 ? `Removed ${pick[0].tag_code} · ${reason}` : `Removed ${pick.length} items · ${reason}`, {
        undo: async () => {
          await supabase.from('units').update({ status: 'in_stock', removed_reason: null, removed_note: null, removed_at: null }).in('id', ids)
          await supabase.from('movements').insert(ids.map(id => ({ shop_id: shop.id, unit_id: id, action: 'restore' })))
          toast(pick.length === 1 ? `${pick[0].tag_code} is back in stock` : `${pick.length} items are back in stock`, { kind: 'ok' })
          onChanged()
        },
      })
      setNote('')
      onChanged()
      onClose()
    } catch (e: any) {
      toast(e.message ?? 'Could not remove those items', { kind: 'bad' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Sheet open={!!list && list.length > 0} onClose={onClose} title="Damage out">
      {list && list.length > 0 && (
        <div className="stack">
          {chooseQty ? (
            <>
              <p className="muted">{list[0].label} · <b className="gold">{list.length}</b> on the shelf. How many are damaged?</p>
              <div className="stepper qty-big">
                <button onClick={() => setQty(String(Math.max(1, n - 1)))} disabled={n <= 1} aria-label="One less">−</button>
                <input inputMode="numeric" value={qty} onChange={e => setQty(e.target.value.replace(/\D/g, ''))} aria-label="How many" />
                <button onClick={() => setQty(String(Math.min(list.length, n + 1)))} disabled={n >= list.length} aria-label="One more">+</button>
              </div>
              <button className="link-btn self-start" onClick={() => setQty(String(list.length))}>All {list.length}</button>
            </>
          ) : list.length === 1 ? (
            <p className="muted">Tag <b className="gold">{list[0].tag_code}</b> · {list[0].label}. It comes out of stock and shows on the Damaged list, where you can put it back.</p>
          ) : (
            <p className="muted"><b className="gold">{list.length} tags</b>: {list.slice(0, 8).map(u => u.tag_code).join(', ')}{list.length > 8 ? '…' : ''}. They come out of stock and show on the Damaged list, where you can put them back.</p>
          )}
          <div className="chips" role="radiogroup" aria-label="Reason">
            {DAMAGE_REASONS.map(r => (
              <button key={r} role="radio" aria-checked={reason === r} className={`chip ${reason === r ? 'on danger' : ''}`} onClick={() => { setReason(r); tap() }}>{r}</button>
            ))}
          </div>
          <label>Note (optional)<input value={note} onChange={e => setNote(e.target.value)} placeholder="Water damage from roof leak" /></label>
          <button className="btn danger big" disabled={busy} onClick={confirm}>{busy ? 'Removing…' : n === 1 ? 'Remove 1 from stock' : `Remove ${n} from stock`}</button>
        </div>
      )}
    </Sheet>
  )
}
