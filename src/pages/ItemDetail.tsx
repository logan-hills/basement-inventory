import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { addUnits, money, photoUrls, restoreUnit, uploadPhotos } from '../lib/data'
import DamageSheet from '../components/DamageSheet'
import SwipeRow from '../components/SwipeRow'

type UnitRow = { id: string; tag_code: string; status: string; removed_reason: string | null; location: { name: string } | null }
type VariantRow = { id: string; label: string; live_number: string; price: number | null; weight_lb: number | null; units: UnitRow[] }
type ItemRow = { id: string; name: string; brand: string | null; category: string | null; description: string | null; variants: VariantRow[]; photos: { id: string; path: string; sort: number }[] }

export default function ItemDetail() {
  const { id } = useParams()
  const { shop } = useSession()
  const toast = useToast()
  const [item, setItem] = useState<ItemRow | null>(null)
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [photo, setPhoto] = useState(0)
  const [damage, setDamage] = useState<{ id: string; tag_code: string; label: string } | null>(null)
  const [addQty, setAddQty] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('items')
      .select('id,name,brand,category,description, variants(id,label,live_number,price,weight_lb, units(id,tag_code,status,removed_reason, location:locations(name))), photos:item_photos(id,path,sort)')
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

  async function saveWeight(v: VariantRow, raw: string) {
    const val = raw.trim() === '' ? null : Number(raw)
    if (val !== null && Number.isNaN(val)) return
    if (val === v.weight_lb) return
    const { error } = await supabase.from('variants').update({ weight_lb: val }).eq('id', v.id)
    if (error) toast(error.message, { kind: 'bad' })
    else { toast(val === null ? 'Weight cleared' : `Weight saved: ${val} lb`, { kind: 'ok' }); load() }
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
        </div>

        {item.variants.map(v => {
          const inStock = v.units.filter(u => u.status === 'in_stock')
          const removed = v.units.filter(u => u.status !== 'in_stock')
          return (
            <div key={v.id} className="card stack variant-card">
              <div className="variant-head">
                <span className="live-num">#{v.live_number}</span>
                <div className="hit-text"><b>{v.label}</b><span className="muted">{money(v.price)} · {inStock.length} in stock</span></div>
                <Link to={`/labels?variant=${v.id}`} className="btn ghost">Print tags</Link>
              </div>
              <div className="row2">
                <label>Weight per item (optional)
                  <span className="input-suffix">
                    <input inputMode="decimal" defaultValue={v.weight_lb ?? ''} placeholder="0.0" onBlur={e => saveWeight(v, e.target.value)} />
                    <span>lb</span>
                  </span>
                </label>
                <label>Add more tags
                  <span className="input-suffix">
                    <input inputMode="numeric" value={addQty[v.id] ?? ''} onChange={e => setAddQty(q => ({ ...q, [v.id]: e.target.value.replace(/\D/g, '') }))} placeholder="Qty" />
                    <button className="btn ghost small" onClick={() => addMore(v)}>Add</button>
                  </span>
                </label>
              </div>
              <div className="unit-list">
                <span className="eyebrow">Tags · swipe left to damage out</span>
                {inStock.map(u => (
                  <SwipeRow key={u.id} leftLabel="Damage out" onSwipeLeft={() => setDamage({ id: u.id, tag_code: u.tag_code, label: `${item.name} · ${v.label}` })}>
                    <div className="unit-row">
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

      <DamageSheet unit={damage} onClose={() => setDamage(null)} onChanged={load} />
    </div>
  )
}
