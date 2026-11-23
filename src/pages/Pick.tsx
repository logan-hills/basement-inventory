import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CameraScanner from '../components/CameraScanner'
import { supabase } from '../lib/supabase'
import { findUnit, type UnitInfo } from '../lib/data'
import { feedbackBad, feedbackOk } from '../lib/feedback'
import { isOrderCode, lineRemaining, loadOrders, orderRemaining, orderUnits, type Order, type OrderLine } from '../lib/orders'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'

type Held = { unit: UnitInfo; fromBin: string | null; fromBinId: string | null }
type Msg = { kind: 'ok' | 'bad' | 'info'; text: string }

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
  const [msg, setMsg] = useState<Msg>({ kind: 'info', text: 'Scan an item tag to start.' })
  const [manual, setManual] = useState('')
  const [camera, setCamera] = useState(() => { try { return localStorage.getItem('scanCamera') === 'on' } catch { return false } })
  const [done, setDone] = useState<string[]>([])
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
    const unit = await findUnit(code)
    if (!unit) { feedbackBad(); setMsg({ kind: 'bad', text: `${code} isn't one of your tags.` }); return }
    if (unit.status !== 'in_stock') { feedbackBad(); setMsg({ kind: 'bad', text: `${code} isn't in stock (${unit.status}). Grab a different tag of #${unit.variant.live_number}.` }); return }
    const need = needing(unit.variant.id)
    if (!need.length) { feedbackBad(); setMsg({ kind: 'bad', text: `Nobody in this pick needs #${unit.variant.live_number}. Put it back.` }); return }
    const { data: loc } = await supabase.from('units').select('location_id').eq('id', unit.id).single()
    feedbackOk()
    setHeld({ unit, fromBin: unit.location?.code ?? null, fromBinId: (loc as any)?.location_id ?? null })
    const names = need.map(n => `${n.order.customer?.name ?? 'Customer'} (${n.order.code})`)
    setMsg({ kind: 'info', text: need.length === 1 ? `Now scan the box for ${names[0]}.` : `Now scan any of these boxes: ${[...new Set(names)].join(', ')}.` })
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

      <div className={`pick-step ${held ? 'box' : 'item'}`}>
        <div className="pick-steps">
          <span className={!held ? 'on' : 'done'}>1 · Scan item</span>
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
            <span className="muted small">No scanner? Tap the box:</span>
            {heldNeed.map(n => <button key={n.line.id} className="btn ghost" onClick={() => packInto(held, n.order, n.line)}>{n.order.code} · {n.order.customer?.name ?? ''}</button>)}
          </div>
        )}
      </div>

      {camera && <CameraScanner onCode={handle} repeatDelay={1500} />}
      <form onSubmit={submit} className="scan-input">
        <input ref={inputRef} value={manual} onChange={e => setManual(e.target.value)} placeholder={held ? 'Scan the box label (DD-…)' : 'Scan an item tag'} autoComplete="off" autoCapitalize="characters" enterKeyHint="go" aria-label="Scan" />
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
