import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Sheet from '../components/Sheet'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { money, photoUrls } from '../lib/data'
import { tap } from '../lib/feedback'
import { useCart } from '../lib/cart'
import { loadLives, liveWhen, type Live } from '../lib/lives'
import { loadStock, margin, type StockRow } from '../lib/stock'
import CategoryRail from '../components/CategoryRail'

type Sort = 'newest' | 'oldest' | 'margin' | 'price_hi' | 'price_lo' | 'stock'

export default function LivePrep() {
  const [params, setParams] = useSearchParams()
  const forLive = params.get('for')
  const navigate = useNavigate()
  const { shop, settings } = useSession()
  const toast = useToast()
  const cart = useCart()
  const [rows, setRows] = useState<StockRow[] | null>(null)
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [tag, setTag] = useState('')
  const [sort, setSort] = useState<Sort>(params.get('sale') ? 'oldest' : 'newest')
  const [oldOnly, setOldOnly] = useState(!!params.get('sale'))
  const [showCart, setShowCart] = useState(false)
  const [lives, setLives] = useState<Live[]>([])
  const [target, setTarget] = useState(forLive ?? '')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    loadStock().then(async list => {
      setRows(list)
      setUrls(await photoUrls([...new Set(list.map(r => r.item.photo).filter(Boolean) as string[])]))
    }).catch(e => { setErr(e.message); setRows([]) })
    const now = new Date(); now.setHours(0, 0, 0, 0)
    loadLives(now).then(l => setLives(l.filter(x => x.status === 'planned'))).catch(() => {})
  }, [])
  useEffect(() => { if (!target && lives[0]) setTarget(lives[0].id) }, [lives, target])

  const oldDays = settings.oldStockDays
  const catStats = useMemo(() => {
    const m = new Map<string, { pieces: number; value: number; photo: string | null }>()
    for (const c of settings.categories) m.set(c, { pieces: 0, value: 0, photo: null })
    for (const r of rows ?? []) { if (r.inStock <= 0 || !r.item.category) continue; const x = m.get(r.item.category) ?? { pieces: 0, value: 0, photo: null }; x.pieces += r.inStock; x.value += r.inStock * (r.price ?? 0); if (!x.photo && r.item.photo && urls[r.item.photo]) x.photo = urls[r.item.photo]; m.set(r.item.category, x) }
    return [...m].map(([name, v]) => ({ name, ...v }))
  }, [rows, settings.categories, urls])
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase()
    const list = (rows ?? []).filter(r => r.inStock > 0 &&
      (!s || r.item.name.toLowerCase().includes(s) || r.live_number.includes(s) || (r.item.brand ?? '').toLowerCase().includes(s) || r.label.toLowerCase().includes(s)) &&
      (!cat || r.item.category === cat) && (!tag || r.item.tags.includes(tag)) && (!oldOnly || r.ageDays >= oldDays))
    const by: Record<Sort, (a: StockRow, b: StockRow) => number> = {
      newest: (a, b) => a.ageDays - b.ageDays,
      oldest: (a, b) => b.ageDays - a.ageDays,
      margin: (a, b) => (margin(b) ?? -9) - (margin(a) ?? -9),
      price_hi: (a, b) => (b.price ?? 0) - (a.price ?? 0),
      price_lo: (a, b) => (a.price ?? 0) - (b.price ?? 0),
      stock: (a, b) => b.inStock - a.inStock,
    }
    // Rank whole items by their best variation, then keep that item's variations together, side by side.
    const rank = new Map<string, number>()
    list.slice().sort(by[sort]).forEach((r, i) => { if (!rank.has(r.item.id)) rank.set(r.item.id, i) })
    return list.sort((a, b) => (rank.get(a.item.id)! - rank.get(b.item.id)!) || a.label.localeCompare(b.label, undefined, { numeric: true }))
  }, [rows, q, cat, tag, sort, oldOnly, oldDays])

  const oldCount = (rows ?? []).filter(r => r.inStock > 0 && r.ageDays >= oldDays).length
  const inCart = (id: string) => cart.lines.find(l => l.variantId === id)?.qty ?? 0
  const targetLive = lives.find(l => l.id === target)

  function runSale() {
    setOldOnly(true); setSort('oldest'); setCat(''); setTag(''); setQ('')
    setParams(p => { p.set('sale', '1'); return p }, { replace: true })
    tap()
  }
  function addAllShown() {
    shown.forEach(r => { if (!inCart(r.id)) cart.add(cartLine(r), r.inStock, r.inStock) })
    toast(`Added ${shown.length} variations, every piece on the shelf`, { kind: 'ok' })
  }
  const cartLine = (r: StockRow) => ({ variantId: r.id, name: r.item.name, label: r.label, live: r.live_number, price: r.price, cost: r.cost, inStock: r.inStock })

  async function checkout() {
    if (!shop || !target || !cart.lines.length) return
    setBusy(true)
    const { data: existing } = await supabase.from('live_items').select('variant_id,qty,sort').eq('live_id', target)
    const have = new Map((existing ?? []).map((e: any) => [e.variant_id, e]))
    let sort = (existing ?? []).reduce((m: number, e: any) => Math.max(m, e.sort), 0)
    const rowsToSave = cart.lines.map(l => ({
      shop_id: shop.id, live_id: target, variant_id: l.variantId,
      qty: l.qty + ((have.get(l.variantId) as any)?.qty ?? 0), sale_price: l.salePrice,
      sort: (have.get(l.variantId) as any)?.sort ?? ++sort,
    }))
    const { error } = await supabase.from('live_items').upsert(rowsToSave, { onConflict: 'live_id,variant_id' })
    setBusy(false)
    if (error) { toast(error.message.includes('live_items') ? 'Lives need a quick database update first.' : error.message, { kind: 'bad' }); return }
    cart.clear(); setShowCart(false)
    toast(`Added to ${targetLive?.title ?? 'the live'}`, { kind: 'ok' })
    navigate(`/lives/${target}`)
  }

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><span className="eyebrow">Sell</span><h1>Get ready for live</h1>{forLive && targetLive && <span className="muted">Picking items for {targetLive.title}</span>}</div>
        <div className="row-gap">
          <Link className="btn ghost" to="/calendar">Calendar</Link>
          <button className="btn gold" onClick={() => setShowCart(true)}>Cart · {cart.count}</button>
        </div>
      </div>

      {oldCount > 0 && !oldOnly && (
        <div className="alert-card">
          <div><b>{oldCount} item{oldCount === 1 ? ' has' : 's have'} been sitting {oldDays}+ days.</b><span className="muted small">Move them before they collect dust.</span></div>
          <button className="btn gold" onClick={runSale}>Run a sale</button>
        </div>
      )}
      {oldOnly && (
        <div className="alert-card sale">
          <div><b>Sale mode: oldest stock first</b><span className="muted small">Showing items {oldDays}+ days old. Add them to your cart, then set a live price at checkout.</span></div>
          <div className="row-gap">
            {shown.length > 0 && <button className="btn gold" onClick={addAllShown}>Add all {shown.length}</button>}
            <button className="link-btn" onClick={() => { setOldOnly(false); setSort('newest'); setParams(p => { p.delete('sale'); return p }, { replace: true }) }}>Show everything</button>
          </div>
        </div>
      )}

      {rows && rows.length > 0 && <CategoryRail cats={catStats} active={cat} onPick={setCat} money={money} />}
      <div className="filter-bar">
        <input type="search" className="search grow" placeholder="Search name, brand or Live #" value={q} onChange={e => setQ(e.target.value)} />
        <select value={tag} onChange={e => setTag(e.target.value)} aria-label="Tag"><option value="">All tags</option>{settings.itemTags.map(c => <option key={c}>{c}</option>)}</select>
        <select value={sort} onChange={e => setSort(e.target.value as Sort)} aria-label="Sort">
          <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="margin">Best profit margin</option>
          <option value="price_hi">Price: high to low</option><option value="price_lo">Price: low to high</option><option value="stock">Most in stock</option>
        </select>
      </div>
      {err && <p className="danger-text">{err}</p>}

      {!rows ? <div className="skeleton-list"><div /><div /><div /></div> : shown.length === 0 ? (
        <div className="empty card"><b>Nothing matches</b><span className="muted">Try another filter, or receive more items.</span></div>
      ) : (
        <div className="shop-grid">
          {shown.map(r => {
            const m = margin(r), n = inCart(r.id)
            return (
              <div key={r.id} className={`shop-card ${n ? 'in-cart' : ''}`}>
                <Link to={`/item/${r.item.id}`} className="shop-photo">
                  {r.item.photo && urls[r.item.photo] ? <img src={urls[r.item.photo]} alt="" loading="lazy" /> : <span className="muted small">No photo</span>}
                  <span className="shop-live">#{r.live_number}</span>
                  {r.ageDays >= oldDays && <span className="shop-age">{r.ageDays} days</span>}
                </Link>
                <div className="shop-body">
                  <b className="shop-name">{r.item.name}</b>
                  {r.label !== 'One size' && <span className="variant-badge">{r.label}</span>}
                  <span className="muted small">{[r.item.brand, r.item.category].filter(Boolean).join(' · ')}</span>
                  <div className="shop-money">
                    <span className="gold shop-price">{money(r.price)}</span>
                    <span className="muted small">cost {r.cost != null ? money(r.cost) : '—'}</span>
                    {m != null && <span className={`margin-pill ${m >= 0.5 ? 'good' : m >= 0.25 ? 'ok' : 'low'}`}>{Math.round(m * 100)}%</span>}
                  </div>
                  <span className="small"><b className="shelf-count">{r.inStock} on shelf</b>{r.bins.length ? <span className="muted">{` · ${r.bins.slice(0, 2).join(', ')}${r.bins.length > 2 ? '…' : ''}`}</span> : null}</span>
                  {r.item.tags.length > 0 && <div className="chip-list">{r.item.tags.map(t => <span key={t} className="chip-mini">{t}</span>)}</div>}
                  {n ? (
                    <div className="stepper">
                      <button onClick={() => cart.set(r.id, { qty: n - 1 })} aria-label="One less">−</button>
                      <b>{n} of {r.inStock} in cart</b>
                      <button onClick={() => cart.set(r.id, { qty: Math.min(r.inStock, n + 1) })} disabled={n >= r.inStock} aria-label="One more">+</button>
                    </div>
                  ) : (
                    <button className="btn outline-gold" onClick={() => { cart.add(cartLine(r), r.inStock, r.inStock); tap() }}>Add all {r.inStock} to cart</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {cart.count > 0 && !showCart && (
        <button className="cart-fab" onClick={() => setShowCart(true)}>Cart · {cart.count} · {money(cart.total)}</button>
      )}

      <Sheet open={showCart} onClose={() => setShowCart(false)} title={`Cart for a live · ${cart.count} item${cart.count === 1 ? '' : 's'}`}>
        <div className="stack">
          {cart.lines.length === 0 && <p className="muted">Your cart is empty. Tap Add to cart on the items you want to sell.</p>}
          {cart.lines.map(l => (
            <div key={l.variantId} className="cart-line">
              <span className="live-num small-live">#{l.live}</span>
              <div className="hit-text grow"><b>{l.name}</b><span className="muted small">{l.label !== 'One size' ? `${l.label} · ` : ''}<b className="shelf-count">{l.inStock ?? '?'} on shelf</b> · regular {money(l.price)}</span></div>
              <label className="mini-field">Qty<input inputMode="numeric" value={l.qty} onChange={e => cart.set(l.variantId, { qty: parseInt(e.target.value.replace(/\D/g, '') || '0', 10) })} /></label>
              <label className="mini-field">Live price<input inputMode="decimal" defaultValue={l.salePrice ?? ''} placeholder={l.price != null ? Number(l.price).toFixed(2) : ''} onBlur={e => { const v = e.target.value.trim(); cart.set(l.variantId, { salePrice: v === '' || Number.isNaN(Number(v)) ? null : Number(v) }) }} /></label>
              <button className="icon-btn" aria-label="Remove" onClick={() => cart.remove(l.variantId)}>×</button>
            </div>
          ))}
          {cart.lines.length > 0 && (
            <>
              <div className="row-between total-row"><span>If everything sells</span><b className="gold">{money(cart.total)}</b></div>
              <span className="eyebrow">Checkout</span>
              {lives.length === 0 ? (
                <p className="muted">No planned lives yet. <Link className="link-text" to="/calendar">Schedule one on the calendar</Link>, then come back. Your cart stays here.</p>
              ) : (
                <label>Link this cart to a live
                  <select value={target} onChange={e => setTarget(e.target.value)}>
                    {lives.map(l => <option key={l.id} value={l.id}>{l.title} · {liveWhen(l)}</option>)}
                  </select>
                </label>
              )}
              <button className="btn primary big" disabled={busy || !target} onClick={checkout}>{busy ? 'Saving…' : 'Check out to this live'}</button>
              <p className="muted small">After checkout, open the live to download its CSV for your bot.</p>
              <button className="link-btn self-start" onClick={() => cart.clear()}>Empty cart</button>
            </>
          )}
        </div>
      </Sheet>
    </div>
  )
}
