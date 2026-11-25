import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sheet from './Sheet'
import Icon from './Icon'
import { addUnits, money } from '../lib/data'
import { loadBins, loadSiblings, moveUnitsTogether, type Bin } from '../lib/locations'
import { useSession } from '../lib/session'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'
import type { StockRow } from '../lib/stock'

/** The everyday jobs for one Live #, in one pop-up: how many, where it lives, print tags.
    Opens when a seller taps a row on Stock, so they don't have to dig through the full item page. */
export default function StockQuickView({ row, photo, onClose, onChanged, onDamage }: {
  row: StockRow | null; photo?: string; onClose: () => void; onChanged: () => void; onDamage: (r: StockRow) => void
}) {
  const { shop } = useSession()
  const toast = useToast()
  const [add, setAdd] = useState(1)
  const [busy, setBusy] = useState(false)
  const [newTags, setNewTags] = useState<string[]>([])
  const [bins, setBins] = useState<Bin[] | null>(null)
  const [bin, setBin] = useState('')
  const [priceText, setPriceText] = useState('')

  // Fresh start each time a different piece opens.
  useEffect(() => { setAdd(1); setNewTags([]); setBin(''); setBusy(false); setPriceText('') }, [row?.id])
  useEffect(() => { if (row && bins === null) loadBins().then(setBins, () => setBins([])) }, [row, bins])

  if (!row) return <Sheet open={false} onClose={onClose} title="">{null}</Sheet>
  const r = row
  const onSale = r.sale_price != null && r.price != null && r.sale_price < r.price

  async function addPieces() {
    if (!shop || add < 1) return
    setBusy(true)
    try {
      const codes = await addUnits(shop.id, r, add)
      setNewTags(codes)
      toast(`Added ${add} to #${r.live_number}. Now print ${add === 1 ? 'its tag' : 'their tags'}.`, { kind: 'ok' })
      setAdd(1)
      onChanged()
    } catch (e: any) { toast(e.message ?? 'Could not add them. Try again.', { kind: 'bad' }) }
    setBusy(false)
  }

  async function savePrice() {
    const val = Number(priceText.replace(/[$,\s]/g, ''))
    if (!priceText.trim() || Number.isNaN(val) || val < 0) { toast('Type a price, like 12 or 12.50', { kind: 'bad' }); return }
    setBusy(true)
    const { error } = await supabase.from('variants').update({ price: val }).eq('id', r.id)
    setBusy(false)
    if (error) { toast(error.message, { kind: 'bad' }); return }
    toast(`#${r.live_number} is now ${money(val)}`, { kind: 'ok' })
    setPriceText('')
    onChanged()
  }

  async function putAway() {
    if (!shop || !bin) return
    setBusy(true)
    try {
      const units = await loadSiblings(r.id)
      await moveUnitsTogether(shop.id, units, bin)
      const code = bins?.find(b => b.id === bin)?.code ?? 'the bin'
      toast(`All ${units.length} of #${r.live_number} are in ${code}`, { kind: 'ok' })
      setBin('')
      onChanged()
    } catch (e: any) { toast(e.message ?? 'Could not move them. Try again.', { kind: 'bad' }) }
    setBusy(false)
  }

  return (
    <Sheet open onClose={onClose} title={r.item.name}>
      <div className="stack qv">
        <div className="qv-top">
          <span className="qv-photo">{photo ? <img src={photo} alt="" /> : <Icon name="tag" size={30} />}</span>
          <div className="qv-facts">
            <span className="qv-live">#{r.live_number}</span>
            {r.label !== 'One size' && <b>{r.label}</b>}
            <span className="qv-price">{r.price == null ? <span className="muted">No price yet</span> : onSale ? <><s className="muted">{money(r.price)}</s> <b className="sale-text">{money(r.sale_price)}</b></> : money(r.price)}</span>
          </div>
        </div>

        <div className="qv-stats">
          <div><span className="qv-big">{r.inStock}</span><span className="muted small">in stock</span></div>
          <div><span className="qv-big qv-bin">{r.bins.length ? r.bins.join(', ') : '—'}</span><span className="muted small">{r.bins.length > 1 ? 'bins' : 'bin'}</span></div>
          <div><span className="qv-big">{r.ageDays}</span><span className="muted small">{r.ageDays === 1 ? 'day' : 'days'} on the shelf</span></div>
        </div>

        <div className="qv-actions">
          <Link className="btn gold big" to={`/labels?variant=${r.id}`}><Icon name="print" size={20} />Print tags</Link>
          <Link className="btn outline-gold" to={`/item/${r.item.id}`}>Edit details</Link>
        </div>

        {r.price == null && (
          <section className="qv-box qv-attn">
            <h3>Add a price</h3>
            <p className="muted small">It shows on the tag and on your live lists.</p>
            <div className="qv-stepper-row">
              <span className="qv-money"><span>$</span><input inputMode="decimal" placeholder="0.00" value={priceText} onChange={e => setPriceText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') savePrice() }} aria-label="Price" /></span>
              <button className="btn primary" disabled={busy || !priceText.trim()} onClick={savePrice}>Save</button>
            </div>
          </section>
        )}

        <section className="qv-box">
          <h3>Got more of these?</h3>
          <p className="muted small">Add the new pieces here. Each one gets its own tag with this Live #.</p>
          <div className="qv-stepper-row">
            <div className="stepper" role="group" aria-label="How many to add">
              <button type="button" onClick={() => setAdd(n => Math.max(1, n - 1))} aria-label="One less" disabled={add <= 1}>−</button>
              <input inputMode="numeric" value={add} aria-label="How many to add" onChange={e => setAdd(Math.min(500, Math.max(1, parseInt(e.target.value.replace(/\D/g, '') || '1', 10))))} />
              <button type="button" onClick={() => setAdd(n => Math.min(500, n + 1))} aria-label="One more">+</button>
            </div>
            <button className="btn primary" disabled={busy} onClick={addPieces}>Add {add}</button>
          </div>
          {newTags.length > 0 && (
            <Link className="btn gold qv-newtags" to={`/labels?tags=${newTags.join(',')}`}><Icon name="print" size={18} />Print the {newTags.length} new tag{newTags.length === 1 ? '' : 's'}</Link>
          )}
        </section>

        {r.inStock > 0 && (
          <section className="qv-box">
            <h3>Put them in a bin</h3>
            <p className="muted small">Moves all {r.inStock} piece{r.inStock === 1 ? '' : 's'} of #{r.live_number} into one bin.</p>
            {bins && bins.length === 0 ? (
              <Link className="btn ghost" to="/locations">Set up your bins first</Link>
            ) : (
              <div className="qv-stepper-row">
                <select value={bin} onChange={e => setBin(e.target.value)} aria-label="Choose a bin">
                  <option value="">Choose a bin…</option>
                  {(bins ?? []).map(b => <option key={b.id} value={b.id}>{b.code}</option>)}
                </select>
                <button className="btn primary" disabled={!bin || busy} onClick={putAway}>Move</button>
              </div>
            )}
            <span className="muted small">Have a scanner? On <Link to="/scan">Scan</Link>, scan one tag, then the bin label.</span>
          </section>
        )}

        <div className="qv-foot">
          <Link className="link-btn" to={`/labels?variant=${r.id}&style=sale`}><Icon name="tag" size={16} /> Yellow sale tags</Link>
          {r.inStock > 0 && <button className="link-btn danger-text" onClick={() => onDamage(r)}><Icon name="damaged" size={16} /> Some are damaged or missing</button>}
        </div>
      </div>
    </Sheet>
  )
}
