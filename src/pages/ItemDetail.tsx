import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { addUnits, money, photoUrls, restoreUnit, uploadPhotos } from '../lib/data'
import DamageSheet from '../components/DamageSheet'
import SwipeRow from '../components/SwipeRow'
import { CategorySelect, TagPicker } from '../components/Pickers'
import { EXTRA_FIELDS, fieldError, type ItemExtra } from '../lib/itemFields'

type UnitRow = { id: string; tag_code: string; status: string; removed_reason: string | null; location: { name: string } | null }
type VariantRow = { id: string; label: string; live_number: string; price: number | null; cost: number | null; weight_lb: number | null; upc?: string | null; sku?: string | null; sale_price?: number | null; units: UnitRow[] }
type ItemRow = ItemExtra & { id: string; name: string; brand: string | null; category: string | null; description: string | null; tags?: string[]; created_at: string; variants: VariantRow[]; photos: { id: string; path: string; sort: number }[] }

export default function ItemDetail() {
  const { id } = useParams()
  const { shop, settings } = useSession()
  const toast = useToast()
  const [item, setItem] = useState<ItemRow | null>(null)
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [photo, setPhoto] = useState(0)
  const [reprint, setReprint] = useState<Set<string>>(new Set())
  const [bulk, setBulk] = useState<{ units: { id: string; tag_code: string; label: string }[]; choose: boolean } | null>(null)
  const toggleReprint = (code: string) => setReprint(s => { const n = new Set(s); if (n.has(code)) n.delete(code); else n.add(code); return n })
  const [damage, setDamage] = useState<{ id: string; tag_code: string; label: string } | null>(null)
  const [addQty, setAddQty] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*, variants(*, units(id,tag_code,status,removed_reason, location:locations(name))), photos:item_photos(id,path,sort)')
      .eq('id', id!)
      .single()
    if (error) { toast(error.message, { kind: 'bad' }); return }
    const it = data as any as ItemRow
    it.photos.sort((a, b) => a.sort - b.sort)
    it.variants.sort((a, b) => a.label.localeCompare(b.label))
    it.variants.forEach(v => v.units.sort((a, b) => a.tag_code.localeCompare(b.tag_code)))
    setItem(it)
    setUrls(await photoUrls(it.photos.map(p => p.path)))
  }, [id, toast])

  useEffect(() => { load() }, [load])

  async function saveItem(patch: Record<string, unknown>, msg: string) {
    if (!item) return
    setItem({ ...item, ...patch } as ItemRow)
    const { error } = await supabase.from('items').update(patch).eq('id', item.id)
    if (error) { toast(error.message.includes('tags') ? 'Tags need a quick database update first.' : fieldError(error.message), { kind: 'bad' }); load() }
    else toast(msg, { kind: 'ok' })
  }

  async function saveMoney(v: VariantRow, field: 'price' | 'cost', raw: string) {
    const val = raw.trim() === '' ? null : Number(raw.replace(/[$,]/g, ''))
    if (val !== null && Number.isNaN(val)) return
    if (val === v[field]) return
    const { error } = await supabase.from('variants').update({ [field]: val }).eq('id', v.id)
    if (error) toast(error.message, { kind: 'bad' })
    else { toast(`${field === 'price' ? 'Price' : 'Cost'} saved`, { kind: 'ok' }); load() }
  }

  async function saveWeight(v: VariantRow, raw: string) {
    const val = raw.trim() === '' ? null : Number(raw)
    if (val !== null && Number.isNaN(val)) return
    if (val === v.weight_lb) return
    const { error } = await supabase.from('variants').update({ weight_lb: val }).eq('id', v.id)
    if (error) toast(error.message, { kind: 'bad' })
    else { toast(val === null ? 'Weight cleared' : `Weight saved: ${val} lb`, { kind: 'ok' }); load() }
  }

  async function saveUpc(v: VariantRow, raw: string) {
    const val = raw.replace(/\s+/g, '') || null
    if (val === (v.upc ?? null)) return
    const { error } = await supabase.from('variants').update({ upc: val }).eq('id', v.id)
    if (error) toast(error.message, { kind: 'bad' })
    else { toast(val ? `UPC saved: ${val}` : 'UPC cleared', { kind: 'ok' }); load() }
  }

  async function saveVariant(v: VariantRow, field: 'sku' | 'sale_price', raw: string) {
    let val: string | number | null = raw.trim() === '' ? null : raw.trim()
    if (field === 'sale_price' && val !== null) { val = Number(String(val).replace(/[$,]/g, '')); if (Number.isNaN(val)) return }
    if (val === (v[field] ?? null)) return
    const { error } = await supabase.from('variants').update({ [field]: val }).eq('id', v.id)
    if (error) toast(fieldError(error.message), { kind: 'bad' })
    else { toast(field === 'sku' ? (val ? `SKU saved: ${val}` : 'SKU cleared') : (val == null ? 'Sale price cleared' : `Sale price saved: ${money(val as number)}`), { kind: 'ok' }); load() }
  }

  function saveText(field: string, raw: string, label: string) {
    if (!item) return
    const val = raw.trim() || null
    if (val === ((item as any)[field] ?? null)) return
    if (field === 'name' && !val) return
    saveItem({ [field]: val }, val ? `${label} saved` : `${label} cleared`)
  }

  async function addMore(v: VariantRow) {
    if (!shop) return
    const n = parseInt(addQty[v.id] ?? '', 10)
    if (!n) return
    await addUnits(shop.id, v, n)
    setAddQty(q => ({ ...q, [v.id]: '' }))
    toast(`Added ${n} tag${n === 1 ? '' : 's'} to #${v.live_number}`, { kind: 'ok' })
    load()
  }

  async function onPhotos(files: FileList | null) {
    if (!shop || !item || !files?.length) return
    toast('Uploading photos…')
    await uploadPhotos(shop.id, item.id, Array.from(files), item.photos.length)
    load()
  }

  if (!item) return <p className="muted">Loading…</p>
  const mainPhoto = item.photos[photo] ?? item.photos[0]

  return (
    <div className="detail-layout">
      <section className="detail-media">
        <Link to="/inventory" className="back-link">‹ Inventory</Link>
        <div className="hero-photo">
          {mainPhoto && urls[mainPhoto.path] ? <img src={urls[mainPhoto.path]} alt={item.name} /> : <span className="muted">No photos yet</span>}
        </div>
        <div className="thumb-strip">
          {item.photos.map((p, i) => (
            <button key={p.id} className={`thumb-btn ${i === photo ? 'on' : ''}`} onClick={() => setPhoto(i)} aria-label={`Photo ${i + 1}`}>
              {urls[p.path] && <img src={urls[p.path]} alt="" />}
            </button>
          ))}
          <label className="thumb-btn add" aria-label="Add photos">
            <input type="file" accept="image/*" capture="environment" multiple hidden onChange={e => { onPhotos(e.target.files); e.target.value = '' }} />+
          </label>
        </div>
      </section>

      <section className="detail-info stack">
        <div>
          <span className="eyebrow">{[item.brand, item.category].filter(Boolean).join(' · ') || 'Item'}</span>
          <h1>{item.name}</h1>
          {item.description && <p className="muted">{item.description}</p>}
          <span className="muted small">Received {new Date(item.created_at).toLocaleDateString()} · {Math.floor((Date.now() - new Date(item.created_at).getTime()) / 86400000)} days in stock</span>
        </div>

        <div className="card stack">
          <div className="row2">
            <label>Item name<input defaultValue={item.name} onBlur={e => saveText('name', e.target.value, 'Name')} /></label>
            <label>Brand<input defaultValue={item.brand ?? ''} placeholder="Optional" onBlur={e => saveText('brand', e.target.value, 'Brand')} /></label>
          </div>
          <label>Category<CategorySelect value={item.category ?? ''} onChange={v => saveItem({ category: v || null }, 'Category saved')} options={settings.categories} /></label>
          <div className="stack tight-gap"><span className="label-text">Tags</span><TagPicker value={item.tags ?? []} onChange={tags => saveItem({ tags }, 'Tags saved')} options={settings.itemTags} /></div>
        </div>

        <details className="card more-details" open={EXTRA_FIELDS.some(f => item[f.key])}>
          <summary><b>More details</b> <span className="muted small">Optional. Use them to sort, filter and find pieces faster.</span></summary>
          <div className="row2">
            {EXTRA_FIELDS.map(f => (
              <label key={f.key}>{f.label}
                {f.options ? (
                  <select defaultValue={item[f.key] ?? ''} onChange={e => saveText(f.key, e.target.value, f.label)}>
                    <option value="">Not set</option>
                    {[...f.options, ...(item[f.key] && !f.options.includes(item[f.key]!) ? [item[f.key]!] : [])].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type} defaultValue={item[f.key] ?? ''} placeholder={f.placeholder ?? 'Optional'} list={f.suggest ? `sug-${f.key}` : undefined} onBlur={e => saveText(f.key, e.target.value, f.label)} />
                )}
                {f.suggest && <datalist id={`sug-${f.key}`}>{f.suggest.map(o => <option key={o} value={o} />)}</datalist>}
              </label>
            ))}
            <label>Notes<textarea rows={2} defaultValue={item.description ?? ''} onBlur={e => saveText('description', e.target.value, 'Notes')} /></label>
          </div>
        </details>

        {item.variants.map(v => {
          const inStock = v.units.filter(u => u.status === 'in_stock')
          const removed = v.units.filter(u => u.status !== 'in_stock')
          return (
            <div key={v.id} className="card stack variant-card">
              <div className="variant-head">
                <span className="live-num">#{v.live_number}</span>
                <div className="hit-text"><b>{v.label}</b><span className="muted">{money(v.price)} · {inStock.length} in stock</span></div>
                <div className="row-gap"><Link to={`/labels?variant=${v.id}`} className="btn ghost">Print tags</Link><Link to={`/labels?variant=${v.id}&style=sale`} className="btn ghost sale-link">Sale tags</Link></div>
              </div>
              <div className="row3">
                <label>Price
                  <input inputMode="decimal" defaultValue={v.price ?? ''} placeholder="0.00" onBlur={e => saveMoney(v, 'price', e.target.value)} />
                </label>
                <label>Cost (paid)
                  <input inputMode="decimal" defaultValue={v.cost ?? ''} placeholder="0.00" onBlur={e => saveMoney(v, 'cost', e.target.value)} />
                </label>
                <div className="margin-box">
                  <span className="label-text">Profit each</span>
                  {v.price != null && v.cost != null ? <b className={v.price - v.cost >= 0 ? 'ok-text' : 'danger-text'}>{money(v.price - v.cost)}{v.price > 0 ? ` · ${Math.round(((v.price - v.cost) / v.price) * 100)}%` : ''}</b> : <span className="muted">Add a cost</span>}
                </div>
              </div>
              <div className="row2">
                <label>Weight per item (optional)
                  <span className="input-suffix">
                    <input inputMode="decimal" defaultValue={v.weight_lb ?? ''} placeholder="0.0" onBlur={e => saveWeight(v, e.target.value)} />
                    <span>lb</span>
                  </span>
                </label>
                <label>Sale price (yellow sale tag)
                  <input inputMode="decimal" defaultValue={v.sale_price ?? ''} placeholder="Optional" onBlur={e => saveVariant(v, 'sale_price', e.target.value)} />
                </label>
                <label>Your SKU (optional)
                  <input defaultValue={v.sku ?? ''} placeholder="Optional" onBlur={e => saveVariant(v, 'sku', e.target.value)} />
                </label>
                <label>UPC / barcode on the product (optional)
                  <input inputMode="numeric" defaultValue={v.upc ?? ''} placeholder="Scan or type it" onBlur={e => saveUpc(v, e.target.value)} onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }} />
                </label>
                <label>Add more tags
                  <span className="input-suffix">
                    <input inputMode="numeric" value={addQty[v.id] ?? ''} onChange={e => setAddQty(q => ({ ...q, [v.id]: e.target.value.replace(/\D/g, '') }))} placeholder="Qty" />
                    <button className="btn ghost small" onClick={() => addMore(v)}>Add</button>
                  </span>
                </label>
              </div>
              <div className="unit-list">
                <div className="row-between">
                  <span className="eyebrow">Tags · tick to reprint or damage out</span>
                  {inStock.length > 1 && (
                    <div className="row-gap">
                      <button className="link-btn" onClick={() => setReprint(r => { const n = new Set(r); const all = inStock.every(u => n.has(u.tag_code)); inStock.forEach(u => (all ? n.delete(u.tag_code) : n.add(u.tag_code))); return n })}>{inStock.every(u => reprint.has(u.tag_code)) ? 'Unselect all' : 'Select all'}</button>
                      <button className="link-btn danger-text" onClick={() => setBulk({ units: inStock.map(u => ({ id: u.id, tag_code: u.tag_code, label: `${item.name} · ${v.label}` })), choose: true })}>Damage out several</button>
                    </div>
                  )}
                </div>
                {inStock.map(u => (
                  <SwipeRow key={u.id} leftLabel="Damage out" onSwipeLeft={() => setDamage({ id: u.id, tag_code: u.tag_code, label: `${item.name} · ${v.label}` })}>
                    <div className="unit-row">
                      <input type="checkbox" aria-label={`Reprint ${u.tag_code}`} checked={reprint.has(u.tag_code)} onChange={() => toggleReprint(u.tag_code)} />
                      <span className="mono">{u.tag_code}</span>
                      <span className="muted">{u.location?.name ?? 'No location'}</span>
                      <button className="link-btn danger-text" onClick={() => setDamage({ id: u.id, tag_code: u.tag_code, label: `${item.name} · ${v.label}` })}>Damage out</button>
                    </div>
                  </SwipeRow>
                ))}
                {removed.map(u => (
                  <div key={u.id} className="unit-row removed">
                    <span className="mono">{u.tag_code}</span>
                    <span className="danger-text">{u.removed_reason ?? u.status}</span>
                    <button className="link-btn" onClick={async () => { if (shop) { await restoreUnit(shop.id, u.id); toast(`${u.tag_code} is back in stock`, { kind: 'ok' }); load() } }}>Put back</button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {reprint.size > 0 && (
        <div className="action-bar floating">
          <span><b className="gold">{reprint.size}</b> tag{reprint.size === 1 ? '' : 's'} picked</span>
          <div className="row-gap">
            <Link className="btn gold" to={`/labels?tags=${[...reprint].join(',')}`}>Reprint {reprint.size === 1 ? 'this tag' : 'these tags'}</Link>
            <button className="btn danger" onClick={() => setBulk({ units: item.variants.flatMap(v => v.units.filter(u => u.status === 'in_stock' && reprint.has(u.tag_code)).map(u => ({ id: u.id, tag_code: u.tag_code, label: `${item.name} · ${v.label}` }))), choose: false })}>Damage out {reprint.size}</button>
            <button className="link-btn" onClick={() => setReprint(new Set())}>Clear</button>
          </div>
        </div>
      )}

      <DamageSheet unit={damage} onClose={() => setDamage(null)} onChanged={load} />
      <DamageSheet units={bulk?.units ?? null} chooseQty={bulk?.choose} onClose={() => setBulk(null)} onChanged={() => { setReprint(new Set()); load() }} />
    </div>
  )
}
