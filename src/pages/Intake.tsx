import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadBins, type Bin } from '../lib/locations'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { addUnits, uploadPhotos } from '../lib/data'
import { CategorySelect, TagPicker } from '../components/Pickers'
import { EXTRA_FIELDS, fieldError, type ItemExtra } from '../lib/itemFields'

type Row = { key: number; label: string; price: string; cost: string; qty: string }

let nextKey = 1
const newRow = (label = '', price = '', cost = ''): Row => ({ key: nextKey++, label, price, cost, qty: '1' })

export default function Intake() {
  const { shop, settings } = useSession()
  const [tags, setTags] = useState<string[]>([])
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [extra, setExtra] = useState<ItemExtra>({})
  const [rows, setRows] = useState<Row[]>([newRow('One size')])
  const [photos, setPhotos] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [bins, setBins] = useState<Bin[]>([])
  const [binId, setBinId] = useState('')
  useEffect(() => { loadBins().then(setBins).catch(() => {}) }, [])

  const previews = useMemo(() => photos.map(f => URL.createObjectURL(f)), [photos])
  const totalTags = rows.reduce((s, r) => s + (parseInt(r.qty, 10) || 0), 0)

  function update(key: number, patch: Partial<Row>) {
    setRows(rs => rs.map(r => (r.key === key ? { ...r, ...patch } : r)))
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!shop) return
    const labels = rows.map(r => r.label.trim() || 'One size')
    if (new Set(labels.map(l => l.toLowerCase())).size !== labels.length) {
      setMsg('Two variations have the same name. Give each one a different name.')
      return
    }
    setBusy(true); setMsg('')
    try {
      const { data: item, error } = await supabase
        .from('items')
        .insert({ shop_id: shop.id, name: name.trim(), brand: brand.trim() || null, category: category.trim() || null, description: description.trim() || null, ...(tags.length ? { tags } : {}), ...Object.fromEntries(Object.entries(extra).filter(([, v]) => v && String(v).trim()).map(([k, v]) => [k, String(v).trim()])) })
        .select('id')
        .single()
      if (error) throw error

      const { data: variants, error: vErr } = await supabase
        .from('variants')
        .insert(rows.map((r, i) => ({ shop_id: shop.id, item_id: item.id, label: labels[i], price: r.price ? Number(r.price) : null, cost: r.cost ? Number(r.cost) : null })))
        .select('id,label,live_number')
      if (vErr) throw vErr

      for (const v of variants ?? []) {
        const row = rows[labels.indexOf(v.label)]
        await addUnits(shop.id, v, parseInt(row?.qty ?? '0', 10) || 0, binId || null)
      }

      if (photos.length) await uploadPhotos(shop.id, item.id, photos)
      navigate(`/labels?item=${item.id}`)
    } catch (err: any) {
      setMsg(fieldError(err?.message ?? 'Something went wrong saving this item.'))
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className="stack">
      <div className="page-head"><div><h1>Receive items</h1></div><Link to="/receive/bulk" className="btn outline-gold">Bulk receive from CSV</Link></div>

      <section className="card stack">
        <label>Item name<input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Nike Air Max 90" /></label>
        <div className="row2">
          <label>Brand<input value={brand} onChange={e => setBrand(e.target.value)} /></label>
          <label>Category<CategorySelect value={category} onChange={setCategory} options={settings.categories} /></label>
        </div>
        {bins.length > 0 && (
          <label>Put in bin (optional)
            <select value={binId} onChange={e => setBinId(e.target.value)}>
              <option value="">No bin yet</option>
              {bins.map(b => <option key={b.id} value={b.id}>{b.code}</option>)}
            </select>
          </label>
        )}
        <div className="stack tight-gap"><span className="label-text">Tags</span><TagPicker value={tags} onChange={setTags} options={settings.itemTags} /></div>
        <label>Notes<textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} /></label>
        <details className="more-details">
          <summary><b>More details</b> <span className="muted small">Optional: condition, color, supplier and more, for sorting and filtering later.</span></summary>
          <div className="row2">
            {EXTRA_FIELDS.map(f => (
              <label key={f.key}>{f.label}
                {f.options ? (
                  <select value={extra[f.key] ?? ''} onChange={e => setExtra(x => ({ ...x, [f.key]: e.target.value }))}>
                    <option value="">Not set</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type} value={extra[f.key] ?? ''} placeholder={f.placeholder ?? 'Optional'} list={f.suggest ? `in-sug-${f.key}` : undefined} onChange={e => setExtra(x => ({ ...x, [f.key]: e.target.value }))} />
                )}
                {f.suggest && <datalist id={`in-sug-${f.key}`}>{f.suggest.map(o => <option key={o} value={o} />)}</datalist>}
              </label>
            ))}
          </div>
        </details>
      </section>

      <section className="card stack">
        <h2>Photos</h2>
        <label className="photo-pick">
          <input type="file" accept="image/*" capture="environment" multiple
            onChange={e => { setPhotos(p => [...p, ...Array.from(e.target.files ?? [])]); e.target.value = '' }} />
          <span>📷 Take or add photos</span>
        </label>
        {previews.length > 0 && (
          <div className="thumbs">
            {previews.map((src, i) => (
              <div key={src} className="thumb">
                <img src={src} alt="" />
                <button type="button" onClick={() => setPhotos(p => p.filter((_, j) => j !== i))} aria-label="Remove photo">×</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card stack">
        <h2>Variations</h2>
        <p className="muted small">Each variation (size, color…) gets its own Live Number. Cost is what you paid, so the app can show your profit. Quantity is how many tags to print.</p>
        {rows.map(r => (
          <div key={r.key} className="variant-row">
            <label>Variation<input value={r.label} onChange={e => update(r.key, { label: e.target.value })} placeholder="Large / Red" /></label>
            <label>Price<input inputMode="decimal" value={r.price} onChange={e => update(r.key, { price: e.target.value.replace(/[^0-9.]/g, '') })} placeholder="0.00" /></label>
            <label>Cost<input inputMode="decimal" value={r.cost} onChange={e => update(r.key, { cost: e.target.value.replace(/[^0-9.]/g, '') })} placeholder="Paid" /></label>
            <label>Qty<input inputMode="numeric" value={r.qty} onChange={e => update(r.key, { qty: e.target.value.replace(/\D/g, '') })} /></label>
            {rows.length > 1 && <button type="button" className="icon-btn" onClick={() => setRows(rs => rs.filter(x => x.key !== r.key))} aria-label="Remove variation">×</button>}
          </div>
        ))}
        <button type="button" className="btn dashed" onClick={() => setRows(rs => [...rs, newRow('', rs[rs.length - 1]?.price ?? '', rs[rs.length - 1]?.cost ?? '')])}>+ Add variation</button>
      </section>

      {msg && <p className="danger-text">{msg}</p>}
      <button className="btn primary big" disabled={busy || !name.trim()}>
        {busy ? 'Saving…' : `Save and print ${totalTags} tag${totalTags === 1 ? '' : 's'}`}
      </button>
    </form>
  )
}
