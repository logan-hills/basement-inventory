import { useState } from 'react'
import Sheet from './Sheet'
import { DAMAGE_REASONS, damageOut, restoreUnit } from '../lib/data'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { tap } from '../lib/feedback'

type Props = {
  unit: { id: string; tag_code: string; label: string } | null
  onClose: () => void
  onChanged: () => void
}

export default function DamageSheet({ unit, onClose, onChanged }: Props) {
  const { shop } = useSession()
  const toast = useToast()
  const [reason, setReason] = useState<string>('Damaged')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  async function confirm() {
    if (!unit || !shop) return
    setBusy(true)
    try {
      await damageOut(shop.id, unit.id, reason, note)
      tap()
      const u = unit
      toast(`Removed ${u.tag_code} · ${reason}`, {
        undo: async () => { await restoreUnit(shop.id, u.id); toast(`${u.tag_code} is back in stock`, { kind: 'ok' }); onChanged() },
      })
      setNote('')
      onChanged()
      onClose()
    } catch (e: any) {
      toast(e.message ?? 'Could not remove that item', { kind: 'bad' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Sheet open={!!unit} onClose={onClose} title="Damage out">
      {unit && (
        <div className="stack">
          <p className="muted">Tag <b className="gold">{unit.tag_code}</b> · {unit.label}. It comes out of stock and shows on the Damaged list, where you can put it back.</p>
          <div className="chips" role="radiogroup" aria-label="Reason">
            {DAMAGE_REASONS.map(r => (
              <button key={r} role="radio" aria-checked={reason === r} className={`chip ${reason === r ? 'on danger' : ''}`} onClick={() => { setReason(r); tap() }}>{r}</button>
            ))}
          </div>
          <label>Note (optional)<input value={note} onChange={e => setNote(e.target.value)} placeholder="Torn seam on left sleeve" /></label>
          <button className="btn danger big" disabled={busy} onClick={confirm}>{busy ? 'Removing…' : 'Remove from stock'}</button>
        </div>
      )}
    </Sheet>
  )
}
