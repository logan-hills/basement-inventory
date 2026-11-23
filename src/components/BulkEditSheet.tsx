import { useEffect, useState } from 'react'
import Sheet from './Sheet'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { loadBins, type Bin } from '../lib/locations'
import { EXTRA_FIELDS, fieldError } from '../lib/itemFields'
import type { StockRow } from '../lib/stock'

const KEEP = '__keep'
const CLEAR = '__clear'

type SaleMode = 'keep' | 'set' | 'pct' | 'clear'

/** Change details on many items at once. Only the fields you touch are changed. */
export default function BulkEditSheet({ rows, onClose, onChanged }: { rows: StockRow[] | null; onClose: () => void; onChanged: () => void }) {
  const { shop, settings } = useSession()
  const toast = useToast()
  const [vals, setVals] = useState<Record<string, string>>({})
  const [addTag, setAddTag] = useState('')
  const [removeTag, setRemoveTag] = useState('')
  const [sale, setSale] = useState<SaleMode>('keep')
  const [saleVal, setSaleVal] = useState('')
  const [bins, setBins] = useState<Bin[]>([])
  const [bin, setBin] = useState('')
  const [busy, setBusy] = useState(false)
  const open = !!rows && rows.length > 0

  useEffect(() => {
    if (!open) return
    setVals({}); setAddTag(''); setRemoveTag(''); setSale('keep'); setSaleVal(''); setBin('')
    loadBins().then(setBins).catch(() => setBins([]))
  }, [open])

  const itemIds = [...new Set((rows ?? []).map(r => r.item.id))]
  const v = (k: string) => vals[k] ?? KEEP
  const setV = (k: string, x: string) => setVals(s => ({ ...s, [k]: x }))
  const usedTags = [...new Set((rows ?? []).flatMap(r => r.item.tags))]

  async function apply() {
    if (!shop || !rows) return
    setBusy(true)
    const done: string[] = []
    try {
      // 1. Item details: category, brand and the optional extras.
      const patch: Record<string, unknown> = {}
      for (const k of ['category', 'brand', ...EXTRA_FIELDS.map(f => f.key)]) {
        const x = v(k)
        if (x === KEEP) continue
        patch[k] = x === CLEAR || x.trim() === '' ? null : x.trim()
      }
      if (Object.keys(patch).length) {
        const { error } = await supabase.from('items').update(patch).in('id', itemIds)
        if (error) throw error
        done.push(`${Object.keys(patch).length} detail${Object.keys(patch).length === 1 ? '' : 's'}`)
      }
      // 2. Tags.
      if (addTag || removeTag) {
        for (const id of itemIds) {
          const cur = rows.find(r => r.item.id === id)!.item.tags
          let next = cur.filter(t => t !== removeTag)
          if (addTag && !next.includes(addTag)) next = [...next, addTag]
          if (next.join('|') === cur.join('|')) continue
          const { error } = await supabase.from('items').update({ tags: next }).eq('id', id)
          if (error) throw error
        }
        done.push('tags')
      }
      // 3. Sale price, per variation.
      if (sale !== 'keep') {
        const n = Number(saleVal.replace(/[$,%\s]/g, ''))
        if (sale !== 'clear' && (!saleVal || Number.isNaN(n) || n < 0)) throw new Error('Enter a sale price or percent first.')
        for (const r of rows) {
          const price = sale === 'clear' ? null : sale === 'set' ? n : r.price != null ? Math.round(r.price * (100 - Math.min(n, 100))) / 100 : null
          if (sale === 'pct' && r.price == null) continue
          const { error } = await supabase.from('variants').update({ sale_price: price }).eq('id', r.id)
          if (error) throw error
        }
        done.push(sale === 'clear' ? 'sale prices cleared' : 'sale prices')
      }
      // 4. Move everything in stock to one bin.
      if (bin) {
        const { data: units, error } = await supabase.from('units').select('id,location_id').in('variant_id', rows.map(r => r.id)).eq('status', 'in_stock')
        if (error) throw error
        const moving = (units ?? []).filter(u => u.location_id !== bin)
        if (moving.length) {
          const up = await supabase.from('units').update({ location_id: bin }).in('id', moving.map(u => u.id))
          if (up.error) throw up.error
          await supabase.from('movements').insert(moving.map(u => ({ shop_id: shop.id, unit_id: u.id, from_location: u.location_id, to_location: bin, action: 'move' })))
        }
        done.push(`${moving.length} piece${moving.length === 1 ? '' : 's'} moved to ${bins.find(b => b.id === bin)?.code ?? 'the bin'}`)
      }
      if (!done.length) { toast('Nothing changed. Pick something to update first.'); setBusy(false); return }
      toast(`Updated ${rows.length} row${rows.length === 1 ? '' : 's'}: ${done.join(', ')}`, { kind: 'ok' })
      onChanged()
      onClose()
    } catch (e: any) {
      toast(fieldError(e.message ?? 'Could not save those changes'), { kind: 'bad' })
    } finally {
      setBusy(false)
    }
  }

  // Plain functions (not components) so inputs keep focus while typing.
  function pick(k: string, label: string, options: string[]) {
    return (
      <label key={k}>{label}
        <select value={v(k)} onChange={e => setV(k, e.target.value)}>
          <option value={KEEP}>Leave as is</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
          <option value={CLEAR}>Clear it</option>
        </select>
      </label>
    )
  }
  function text(k: string, label: string, placeholder?: string) {
    const on = v(k) !== KEEP
    return (
      <label key={k}>{label}
        <input value={on && v(k) !== CLEAR ? v(k) : ''} placeholder={v(k) === CLEAR ? 'Will be cleared' : placeholder ?? 'Leave as is'} onChange={e => setV(k, e.target.value === '' ? KEEP : e.target.value)} />
      </label>
    )
  }

  return (
    <Sheet open={open} onClose={onClose} title={`Edit ${rows?.length ?? 0} selected`}>
      {open && (
        <div className="stack">
          <p className="muted small">Only what you change gets saved. Everything left as is stays the same. Item details apply to {itemIds.length} item{itemIds.length === 1 ? '' : 's'}.</p>
          <div className="row2">
            {pick('category', 'Category', settings.categories)}
            {text('brand', 'Brand')}
          </div>
          <div className="row2">
            {EXTRA_FIELDS.filter(f => f.type === 'text').map(f => f.options
              ? pick(f.key, f.label, f.options)
              : text(f.key, f.label, f.placeholder ? `Leave as is (e.g. ${f.placeholder.split(',')[0]})` : undefined))}
          </div>
          <div className="row2">
            <label>Add a tag
              <select value={addTag} onChange={e => setAddTag(e.target.value)}>
                <option value="">No</option>
                {settings.itemTags.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label>Remove a tag
              <select value={removeTag} onChange={e => setRemoveTag(e.target.value)}>
                <option value="">No</option>
                {usedTags.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>
          <div className="row2">
            <label>Sale price (for yellow sale tags)
              <select value={sale} onChange={e => setSale(e.target.value as SaleMode)}>
                <option value="keep">Leave as is</option>
                <option value="pct">Percent off the regular price</option>
                <option value="set">Same sale price for all</option>
                <option value="clear">Clear the sale price</option>
              </select>
            </label>
            {(sale === 'pct' || sale === 'set') && (
              <label>{sale === 'pct' ? 'Percent off' : 'Sale price'}
                <span className="input-suffix">
                  <input inputMode="decimal" value={saleVal} onChange={e => setSaleVal(e.target.value.replace(/[^0-9.]/g, ''))} placeholder={sale === 'pct' ? '30' : '10.00'} />
                  <span>{sale === 'pct' ? '% off' : '$'}</span>
                </span>
              </label>
            )}
          </div>
          {bins.length > 0 && (
            <label>Move everything in stock to a bin
              <select value={bin} onChange={e => setBin(e.target.value)}>
                <option value="">Don't move</option>
                {bins.map(b => <option key={b.id} value={b.id}>{b.code}</option>)}
              </select>
            </label>
          )}
          <button className="btn primary big" disabled={busy} onClick={apply}>{busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      )}
    </Sheet>
  )
}
