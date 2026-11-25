import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { scanBoxKeyDown } from '../lib/scanner'
import { Link, useSearchParams } from 'react-router-dom'
import CameraScanner from '../components/CameraScanner'
import FreeCameraTip from '../components/FreeCameraTip'
import { supabase } from '../lib/supabase'
import { findUnit, photoUrls, UNIT_SELECT, type UnitInfo } from '../lib/data'
import JsBarcode from 'jsbarcode'
import { feedbackBad, feedbackOk } from '../lib/feedback'
import { isOrderCode, lineRemaining, loadOrders, orderRemaining, orderUnits, type Order, type OrderLine } from '../lib/orders'
import { isBinCode, normalizeBinCode } from '../lib/locations'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'

type Held = { unit: UnitInfo; fromBin: string | null; fromBinId: string | null }
type Msg = { kind: 'ok' | 'bad' | 'info'; text: string }
type Extra = { upc: string | null; photo: string | null }

/** "A3-S2-C-01" → aisle 3, section 2, shelf C, bin 1. */
function splitBin(code?: string) {
  const m = code?.match(/^A(\d+)-S(\d+)-([A-Z])-(\d+)$/)
  return m ? { aisle: m[1], section: m[2], shelf: m[3], bin: String(Number(m[4])) } : null
}

function UpcBars({ value }: { value: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const fmt = /^\d{12}$/.test(value) ? 'UPC' : /^\d{13}$/.test(value) ? 'EAN13' : 'CODE128'
    try { JsBarcode(ref.current, value, { format: fmt, displayValue: false, margin: 0, height: 46, width: 2, background: 'transparent', lineColor: '#1B1210' }) }
    catch { try { JsBarcode(ref.current, value, { format: 'CODE128', displayValue: false, margin: 0, height: 46, width: 2, background: 'transparent', lineColor: '#1B1210' }) } catch { /* ignore */ } }
  }, [value])
  return <svg ref={ref} aria-hidden="true" />
}

/** Grocery-style picking: scan an item tag, then scan the customer's box label. */
export default function Pick() {
  const [params] = useSearchParams()
  const ids = params.get('orders')?.split(',').filter(Boolean) ?? null
  const idsKey = ids?.join(',') ?? ''
  const { shop } = useSession()
  const toast = useToast()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [stock, setStock] = useState<Record<string, { code: string; n: number }[]>>({})
  const [held, setHeld] = useState<Held | null>(null)
  const [msg, setMsg] = useState<Msg>({ kind: 'info', text: 'Go to the bin shown. Scan the bin label to check it, then scan the tag (or tap "Picked it").' })
  const [manual, setManual] = useState('')
  const [camera, setCamera] = useState(() => { try { return localStorage.getItem('scanCamera') === 'on' } catch { return false } })
  const [done, setDone] = useState<string[]>([])
  const [extra, setExtra] = useState<Record<string, Extra>>({})
  const [focus, setFocus] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const heldRef = useRef<Held | null>(null)
  heldRef.current = held
  const ordersRef = useRef<Order[] | null>(null)
  ordersRef.current = orders

  const load = useCallback(async () => {
    const list = ids ? await loadOrders({ ids }) : await loadOrders({ status: ['open', 'picking'] })
    const active = list.filter(o => o.status !== 'cancelled' && o.status !== 'shipped')
    setOrders(active)
    const variantIds = [...new Set(active.flatMap(o => o.lines.filter(l => l.variant_id && lineRemaining(l) > 0).map(l => l.variant_id!)))]
    if (variantIds.length) {
      const { data } = await supabase.from('units').select('variant_id, location:locations(code)').eq('status', 'in_stock').in('variant_id', variantIds)
      const map: Record<string, Record<string, number>> = {}
      for (const u of (data ?? []) as any[]) {
        const code = u.location?.code ?? 'No bin'
        map[u.variant_id] ??= {}
        map[u.variant_id][code] = (map[u.variant_id][code] ?? 0) + 1
      }
      setStock(Object.fromEntries(Object.entries(map).map(([v, m]) => [v, Object.entries(m).map(([code, n]) => ({ code, n })).sort((a, b) => a.code.localeCompare(b.code))])))
      let { data: vs, error } = await supabase.from('variants').select('id,upc, item:items(photos:item_photos(path,sort))').in('id', variantIds)
      if (error) ({ data: vs } = await supabase.from('variants').select('id, item:items(photos:item_photos(path,sort))').in('id', variantIds) as any)
      const firstPhoto = (v: any) => [...(v.item?.photos ?? [])].sort((a: any, b: any) => a.sort - b.sort)[0]?.path ?? null
      const urls = await photoUrls([...new Set(((vs ?? []) as any[]).map(firstPhoto).filter(Boolean))] as string[])
      setExtra(Object.fromEntries(((vs ?? []) as any[]).map(v => [v.id, { upc: v.upc ?? null, photo: firstPhoto(v) ? urls[firstPhoto(v)] ?? null : null }])))
    } else setStock({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])
  useEffect(() => { load() }, [load])

  useEffect(() => { try { localStorage.setItem('scanCamera', camera ? 'on' : 'off') } catch { /* ignore */ } }, [camera])
  useEffect(() => {
    const refocus = () => { if (!document.querySelector('.sheet-panel')) inputRef.current?.focus() }
    refocus()
    const id = window.setInterval(() => { if (document.activeElement === document.body) refocus() }, 800)
    return () => clearInterval(id)
  }, [])

  // One row per item still to pick, sorted by bin so you walk the aisles in order.
  const tasks = useMemo(() => {
    const byVariant = new Map<string, { line: OrderLine; need: number; orders: Order[] }>()
    const unknown: { order: Order; line: OrderLine }[] = []
    for (const o of orders ?? []) for (const l of o.lines) {
      const rem = lineRemaining(l)
      if (!rem) continue
      if (!l.variant_id) { unknown.push({ order: o, line: l }); continue }
      const t = byVariant.get(l.variant_id) ?? { line: l, need: 0, orders: [] }
      t.need += rem
      if (!t.orders.includes(o)) t.orders.push(o)
      byVariant.set(l.variant_id, t)
    }
    const list = [...byVariant.entries()].map(([vid, t]) => ({ vid, ...t, bins: stock[vid] ?? [] }))
    list.sort((a, b) => (a.bins[0]?.code ?? 'ZZZ').localeCompare(b.bins[0]?.code ?? 'ZZZ'))
    return { list, unknown }
  }, [orders, stock])

  /** Orders (and their line) that still need this variation. */
  function needing(variantId: string) {
    const out: { order: Order; line: OrderLine }[] = []
    for (const o of ordersRef.current ?? []) for (const l of o.lines) if (l.variant_id === variantId && lineRemaining(l) > 0) out.push({ order: o, line: l })
    return out
  }

  async function handle(raw: string) {
    const code = raw.trim().toUpperCase()
    if (!code) return
    if (isOrderCode(code)) return scanBox(code)
    if (isBinCode(code)) return scanBin(normalizeBinCode(code)!)
    const unit = await findUnit(code)
    if (!unit) {
      // A product UPC or a Live # works too: grab any in-stock piece of that item.
      const vid = Object.entries(extra).find(([, x]) => x.upc && x.upc === code)?.[0]
        ?? tasks.list.find(t => (t.line.variant?.live_number ?? t.line.live_number) === code.padStart(4, '0'))?.vid
      if (vid) return grab(vid)
      feedbackBad(); setMsg({ kind: 'bad', text: `${code} isn't one of your tags or products in this pick.` }); return
    }
    if (unit.status !== 'in_stock') { feedbackBad(); setMsg({ kind: 'bad', text: `${code} isn't in stock (${unit.status}). Grab a different tag of #${unit.variant.live_number}.` }); return }
    const need = needing(unit.variant.id)
    if (!need.length) { feedbackBad(); setMsg({ kind: 'bad', text: `Nobody in this pick needs #${unit.variant.live_number}. Put it back.` }); return }
    const { data: loc } = await supabase.from('units').select('location_id').eq('id', unit.id).single()
    feedbackOk()
    setHeld({ unit, fromBin: unit.location?.code ?? null, fromBinId: (loc as any)?.location_id ?? null })
    const names = need.map(n => `${n.order.customer?.name ?? 'Customer'} (${n.order.code})`)
    setMsg({ kind: 'info', text: need.length === 1 ? `Now scan the box for ${names[0]}.` : `Now scan any of these boxes: ${[...new Set(names)].join(', ')}.` })
  }

  /** Pick a piece without scanning its tag: takes one in-stock piece of this item (from the first bin). */
  async function grab(vid: string) {
    const need = needing(vid)
    if (!need.length) { feedbackBad(); setMsg({ kind: 'bad', text: 'Nobody in this pick needs that item.' }); return }
    const { data } = await supabase.from('units').select(UNIT_SELECT + ', location_id').eq('variant_id', vid).eq('status', 'in_stock').limit(50)
    const list = ((data ?? []) as any[]).sort((a, b) => (a.location?.code ?? 'ZZZ').localeCompare(b.location?.code ?? 'ZZZ'))
    const u = list[0]
    if (!u) { feedbackBad(); setMsg({ kind: 'bad', text: 'None of these are in stock. Tap "Can\'t find it".' }); return }
    const h: Held = { unit: u as UnitInfo, fromBin: u.location?.code ?? null, fromBinId: u.location_id ?? null }
    if (need.length === 1) return packInto(h, need[0].order, need[0].line)
    feedbackOk(); setHeld(h)
    setMsg({ kind: 'info', text: 'Which box does it go in? Scan the box or tap it below.' })
  }

  /** Warehouse style: scan the bin you're standing at to confirm it's the right one before you grab. */
  function scanBin(code: string) {
    if (heldRef.current) { feedbackBad(); setMsg({ kind: 'bad', text: `That's a bin label. Scan the customer's box for #${heldRef.current.unit.variant.live_number}, or tap Put back.` }); return }
    const idx = tasks.list.findIndex(t => t.bins.some(b => b.code === code))
    if (idx >= 0) {
      const t = tasks.list[idx]
      setFocus(idx)
      feedbackOk()
      setMsg({ kind: 'ok', text: `Right bin! Grab ${t.need > 1 ? `${t.need} of ` : ''}#${t.line.variant?.live_number ?? t.line.live_number} from ${code}, then scan ${t.need > 1 ? 'each tag' : 'its tag'}.` })
      return
    }
    const next = tasks.list[Math.min(focus, tasks.list.length - 1)]
    feedbackBad()
    setMsg({ kind: 'bad', text: next?.bins[0] ? `Wrong bin. Nothing in this pick is in ${code}. Next up is #${next.line.variant?.live_number ?? next.line.live_number} in ${next.bins[0].code}.` : `Nothing in this pick is in ${code}.` })
  }

  async function scanBox(code: string) {
    const h = heldRef.current
    if (!h) { feedbackBad(); setMsg({ kind: 'bad', text: 'Scan an item first, then its box.' }); return }
    const order = (ordersRef.current ?? []).find(o => o.code === code)
    const match = order?.lines.find(l => l.variant_id === h.unit.variant.id && lineRemaining(l) > 0)
    if (!order || !match) {
      feedbackBad()
      const right = needing(h.unit.variant.id).map(n => n.order.code)
      setMsg({ kind: 'bad', text: `Wrong box. #${h.unit.variant.live_number} goes in ${[...new Set(right)].join(' or ')}.` })
      return
    }
    await packInto(h, order, match)
  }

  async function packInto(h: Held, order: Order, line: OrderLine) {
    if (!shop) return
    const { error } = await supabase.from('units').update({ status: 'packed', order_id: order.id, order_line_id: line.id, location_id: null }).eq('id', h.unit.id).eq('status', 'in_stock')
    if (error) { feedbackBad(); setMsg({ kind: 'bad', text: error.message }); return }
    await supabase.from('order_lines').update({ picked: line.picked + 1 }).eq('id', line.id)
    await supabase.from('movements').insert({ shop_id: shop.id, unit_id: h.unit.id, from_location: h.fromBinId, to_location: null, action: `pick:${order.code}` })
    const finished = orderRemaining(order) - 1 === 0
    await supabase.from('orders').update({ status: finished ? 'packed' : 'picking', updated_at: new Date().toISOString() }).eq('id', order.id)
    feedbackOk()
    setHeld(null)
    const who = order.customer?.name ?? order.code
    if (finished) {
      setDone(d => [...d, order.code])
      setMsg({ kind: 'ok', text: `${who}'s box is complete! Tape it up.` })
    } else setMsg({ kind: 'ok', text: `#${h.unit.variant.live_number} is in ${who}'s box. Scan the next item.` })
    toast(`${h.unit.tag_code} → ${order.code}`, {
      undo: async () => {
        await supabase.from('units').update({ status: 'in_stock', order_id: null, order_line_id: null, location_id: h.fromBinId }).eq('id', h.unit.id)
        await supabase.from('order_lines').update({ picked: line.picked }).eq('id', line.id)
        await supabase.from('orders').update({ status: 'picking' }).eq('id', order.id)
        await supabase.from('movements').insert({ shop_id: shop.id, unit_id: h.unit.id, to_location: h.fromBinId, action: `unpick:${order.code}` })
        setDone(d => d.filter(c => c !== order.code))
        load()
      },
    })
    load()
  }

  async function markShort(t: { vid: string }) {
    const need = needing(t.vid)
    const first = need[0]
    if (!first) return
    await supabase.from('order_lines').update({ short: first.line.short + 1 }).eq('id', first.line.id)
    if (orderRemaining(first.order) - 1 === 0) await supabase.from('orders').update({ status: 'packed', updated_at: new Date().toISOString() }).eq('id', first.order.id)
    toast(`Marked 1 short for ${first.order.code}`, {
      undo: async () => { await supabase.from('order_lines').update({ short: first.line.short }).eq('id', first.line.id); await supabase.from('orders').update({ status: 'picking' }).eq('id', first.order.id); load() },
    })
    load()
  }

  function submit(e: FormEvent) { e.preventDefault(); handle(manual); setManual('') }

  if (!orders) return <p className="muted">Loading…</p>

  const totalUnits = orders.reduce((s, o) => s + orderUnits(o), 0)
  const left = orders.reduce((s, o) => s + orderRemaining(o), 0)
  const pct = totalUnits ? Math.round(((totalUnits - left) / totalUnits) * 100) : 0
  const heldNeed = held ? needing(held.unit.variant.id) : []

  return (
    <div className="stack wide-gap">
      <Link to="/orders" className="back-link">‹ Orders</Link>
      <div className="page-head">
        <div><span className="eyebrow">Pick and pack · {orders.length} order{orders.length === 1 ? '' : 's'}</span><h1>Picking</h1></div>
        <div className="row-gap">
          <Link className="btn ghost" to={`/box-labels?ids=${orders.map(o => o.id).join(',')}`}>Print box labels</Link>
          <button className={`btn ${camera ? 'gold' : 'outline-gold'}`} onClick={() => setCamera(c => !c)}>{camera ? 'Stop camera' : 'Use camera'}</button>
        </div>
      </div>

      <div className="progress"><span style={{ width: `${pct}%` }} /></div>
      <p className="muted small">{totalUnits - left} of {totalUnits} items packed{left === 0 && totalUnits ? '. Every box is done.' : ''}</p>

      {(() => {
        const t = held ? tasks.list.find(x => x.vid === held.unit.variant.id) : tasks.list[Math.min(focus, tasks.list.length - 1)]
        if (!t) return null
        const x = extra[t.vid] ?? { upc: null, photo: null }
        const where = splitBin(held?.fromBin ?? t.bins[0]?.code)
        const live = t.line.variant?.live_number ?? t.line.live_number
        return (
          <section className={`pick-hero${held ? ' holding' : ''}${x.photo ? '' : ' no-photo'}`} aria-label="Next item to pick">
            {x.photo && <div className="pick-photo"><img src={x.photo} alt="" /></div>}
            <div className="pick-info">
              <span className="pick-kicker">{held ? 'In your hand' : `Next up · ${Math.min(focus, tasks.list.length - 1) + 1} of ${tasks.list.length}`}</span>
              <span className="pick-live">#{live}</span>
              <b className="pick-name">{t.line.variant ? t.line.variant.item.name : t.line.description}</b>
              <span className="pick-variant">{t.line.variant?.label && t.line.variant.label !== 'One size' ? t.line.variant.label : ''}{t.need > 1 ? `${t.line.variant?.label && t.line.variant.label !== 'One size' ? ' · ' : ''}Grab ${t.need}` : ''}</span>
              {where ? (
                <div className="pick-where">
                  <span><small>Aisle</small><b>{where.aisle}</b></span>
                  <span><small>Section</small><b>{where.section}</b></span>
                  <span><small>Shelf</small><b>{where.shelf}</b></span>
                  <span><small>Bin</small><b>{where.bin}</b></span>
                </div>
              ) : <p className="pick-nobin">{t.bins[0] ? `Location: ${t.bins[0].code}` : 'Not in a bin yet. Check the "No bin" pile.'}</p>}
              {t.bins.length > 1 && <span className="muted small">Also in: {t.bins.slice(1).map(b => b.code).join(', ')}</span>}
              {x.upc && <div className="pick-upc"><UpcBars value={x.upc} /><span>UPC {x.upc}</span></div>}
              <span className="pick-for">For {t.orders.map(o => o.customer?.name ?? o.code).join(', ')}</span>
              {!held && (
                <div className="pick-actions">
                  <button className="btn gold big" onClick={() => grab(t.vid)}>Picked it</button>
                  <button className="btn ghost big" onClick={() => markShort(t)}>Can't find it</button>
                  {tasks.list.length > 1 && <button className="btn ghost big" onClick={() => setFocus(f => (f + 1) % tasks.list.length)}>Skip for now</button>}
                </div>
              )}
            </div>
          </section>
        )
      })()}

      <div className={`pick-step ${held ? 'box' : 'item'}`}>
        <div className="pick-steps">
          <span className={!held ? 'on' : 'done'}>1 · Scan bin, then item</span>
          <span className={held ? 'on' : ''}>2 · Scan customer box</span>
        </div>
        {held && (
          <div className="hit-main">
            <span className="live-num">#{held.unit.variant.live_number}</span>
            <div className="hit-text"><b>{held.unit.variant.item.name}</b><span className="muted">{held.unit.variant.label} · tag {held.unit.tag_code}</span></div>
            <button className="link-btn" onClick={() => { setHeld(null); setMsg({ kind: 'info', text: 'Put it back. Scan an item tag.' }) }}>Put back</button>
          </div>
        )}
        <p className={`pick-msg ${msg.kind}`}>{msg.text}</p>
        {held && heldNeed.length > 0 && (
          <div className="row-gap">
            <span className="muted">No scanner? Tap the box:</span>
            {heldNeed.map(n => <button key={n.line.id} className="btn gold big" onClick={() => packInto(held, n.order, n.line)}>{n.order.code} · {n.order.customer?.name ?? ''}</button>)}
          </div>
        )}
      </div>

      {!camera && <FreeCameraTip onUse={() => setCamera(true)} />}
      {camera && <CameraScanner onCode={handle} repeatDelay={1500} />}
      <form onSubmit={submit} className="scan-input">
        <input ref={inputRef} value={manual} onChange={e => setManual(e.target.value)} onKeyDown={scanBoxKeyDown} placeholder={held ? 'Scan the box label (DD-…)' : 'Scan the bin, then the item tag'} autoComplete="off" autoCapitalize="characters" enterKeyHint="go" aria-label="Scan" />
        <button className="btn primary">Enter</button>
      </form>

      <div className="detail-layout">
        <div className="card stack">
          <span className="eyebrow">Pick list · walk in this order</span>
          {tasks.list.length === 0 && tasks.unknown.length === 0 && <p className="muted">Nothing left to pick.</p>}
          {tasks.list.map(t => (
            <div key={t.vid} className={`order-line ${held?.unit.variant.id === t.vid ? 'active' : ''}`}>
              <span className="live-num small-live">#{t.line.variant?.live_number ?? t.line.live_number}</span>
              <div className="hit-text grow">
                <b>{t.line.variant ? `${t.line.variant.item.name} · ${t.line.variant.label}` : t.line.description}</b>
                <span className="muted small">
                  {t.bins.length ? t.bins.map(b => `${b.code}${b.n > 1 ? ` (${b.n})` : ''}`).join(', ') : <span className="danger-text">none in stock</span>}
                  {' · for '}{t.orders.map(o => o.customer?.name ?? o.code).join(', ')}
                </span>
              </div>
              <b className="gold">×{t.need}</b>
              <button className="link-btn danger-text" onClick={() => markShort(t)} title="Can't find one">Short</button>
            </div>
          ))}
          {tasks.unknown.map(({ order, line }) => (
            <div key={line.id} className="order-line">
              <span className="live-num small-live danger-text">#{line.live_number ?? '—'}</span>
              <div className="hit-text grow"><b>{line.description ?? 'Item not in inventory'}</b><span className="muted small">Not in inventory · for {order.customer?.name ?? order.code}. Pack by hand, then mark it.</span></div>
              <button className="link-btn" onClick={async () => { await supabase.from('order_lines').update({ picked: line.picked + lineRemaining(line) }).eq('id', line.id); if (orderRemaining(order) - lineRemaining(line) === 0) await supabase.from('orders').update({ status: 'packed' }).eq('id', order.id); load() }}>Packed by hand</button>
              <button className="link-btn danger-text" onClick={async () => { await supabase.from('order_lines').update({ short: line.short + lineRemaining(line) }).eq('id', line.id); load() }}>Short</button>
            </div>
          ))}
        </div>
        <div className="card stack">
          <span className="eyebrow">Boxes</span>
          {orders.map(o => {
            const r = orderRemaining(o)
            return (
              <Link key={o.id} to={`/order/${o.code}`} className={`box-row ${r === 0 ? 'complete' : ''} ${done.includes(o.code) ? 'pop' : ''}`}>
                <span className="mono gold">{o.code}</span>
                <span className="grow">{o.customer?.name ?? '—'}</span>
                <span className={r === 0 ? 'ok-text' : 'muted'}>{r === 0 ? 'Done ✓' : `${orderUnits(o) - r}/${orderUnits(o)}`}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
