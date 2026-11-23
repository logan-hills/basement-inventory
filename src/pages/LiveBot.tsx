import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Sheet from '../components/Sheet'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { money } from '../lib/data'
import { downloadFile, toCsv } from '../lib/csv'
import { feedbackOk, tap } from '../lib/feedback'
import { loadLive, liveWhen, type Live } from '../lib/lives'
import { getPageToken, listenToComments, listenToSlot, parseVideoId, type StreamStatus } from '../lib/fbcomments'
import {
  allocate, applyComment, buyerKey, buyerMessage, DEFAULT_BOT_RULES, DEFAULT_BUYER_MESSAGE, parseComment, practiceComments,
  type BotComment, type BotRules, type Claim, type Parsed,
} from '../lib/livebot'

type Product = { variantId: string; liveNumber: string; name: string; label: string; price: number; available: number; onList: boolean }
type FeedRow = { c: BotComment; parsed: Parsed; note: string }

const CLAIM_SELECT = 'id,live_number,variant_id,buyer_fb_id,buyer_name,qty,state,commented_at,comment_text,source,order_id'

export default function LiveBot() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { shop, settings, updateSettings } = useSession()
  const toast = useToast()
  const rules: BotRules = useMemo(() => ({ ...DEFAULT_BOT_RULES, ...(settings.botRules ?? {}) }), [settings.botRules])

  const [live, setLive] = useState<Live | null | undefined>(undefined)
  const [products, setProducts] = useState<Map<string, Product>>(new Map())
  const [claims, setClaims] = useState<Claim[]>([])
  const claimsRef = useRef<Claim[]>([])
  const [feed, setFeed] = useState<FeedRow[]>([])
  const [mode, setMode] = useState<'idle' | 'facebook' | 'practice'>('idle')
  const [status, setStatus] = useState<{ s: StreamStatus; detail?: string } | null>(null)
  const [videoInput, setVideoInput] = useState(params.get('video') ?? '')
  const [manualToken, setManualToken] = useState('')
  const [connectErr, setConnectErr] = useState('')
  const [rulesOpen, setRulesOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [filter, setFilter] = useState<'all' | 'claims'>('all')
  const [view, setView] = useState<'items' | 'buyers'>('items')
  const [sent, setSent] = useState<Set<string>>(new Set())
  const stopRef = useRef<(() => void) | null>(null)
  const queue = useRef<Promise<void>>(Promise.resolve())

  const setAllClaims = (list: Claim[]) => { claimsRef.current = list; setClaims(list) }

  const load = useCallback(async () => {
    const r = await loadLive(id!).catch(() => null)
    setLive(r?.live ?? null)
    if (!r) return
    // Every Live # the shop has. Tonight's list sets how many are for sale; anything else uses what's on the shelf.
    const { data: vs } = await supabase.from('variants').select('id,live_number,label,price, item:items(name), units(status)')
    const map = new Map<string, Product>()
    for (const v of (vs ?? []) as any[]) {
      map.set(v.live_number, {
        variantId: v.id, liveNumber: v.live_number, name: v.item?.name ?? 'Item', label: v.label, price: Number(v.price ?? 0),
        available: (v.units ?? []).filter((u: any) => u.status === 'in_stock').length, onList: false,
      })
    }
    for (const li of r.items) {
      const p = map.get(li.variant.live_number)
      if (p) Object.assign(p, { available: li.qty, onList: true, price: Number(li.sale_price ?? li.variant.price ?? 0) })
    }
    setProducts(map)
    const { data: cs, error } = await supabase.from('live_claims').select(CLAIM_SELECT).eq('live_id', id!).order('commented_at')
    if (error) setConnectErr(error.message.includes('live_claims') ? 'The bot’s database table isn’t set up yet (run supabase/008_live_bot.sql).' : error.message)
    setAllClaims((cs ?? []) as Claim[])
  }, [id])
  useEffect(() => { load() }, [load])

  // Everyone helping with the live (host's phone, a helper's laptop) sees the same claims as they happen.
  useEffect(() => {
    if (!id) return
    let t: ReturnType<typeof setTimeout> | null = null
    const refresh = () => {
      if (t) clearTimeout(t)
      t = setTimeout(async () => {
        const { data } = await supabase.from('live_claims').select(CLAIM_SELECT).eq('live_id', id).order('commented_at')
        if (data) setAllClaims(data as Claim[])
      }, 400)
    }
    const ch = supabase.channel(`claims-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_claims', filter: `live_id=eq.${id}` }, refresh)
      .subscribe()
    return () => { if (t) clearTimeout(t); supabase.removeChannel(ch) }
  }, [id])
  useEffect(() => () => stopRef.current?.(), [])

  const known = useMemo(() => new Set(products.keys()), [products])
  const available = useMemo(() => new Map([...products.values()].map(p => [p.liveNumber, p.available])), [products])
  const alloc = useMemo(() => allocate(claims, available), [claims, available])

  // ---- Reading comments -------------------------------------------------------------------------------------
  const handleComments = useCallback((list: BotComment[], source: 'facebook' | 'practice', videoId: string | null) => {
    queue.current = queue.current.then(async () => {
      for (const c of list) {
        const parsed = parseComment(c.text, rules, known)
        const { add, cancel } = applyComment(c, parsed, claimsRef.current)
        let note = ''
        if (add.length) {
          const rows = add.map(a => ({
            shop_id: shop!.id, live_id: id!, fb_video_id: videoId, comment_id: c.id, comment_text: c.text, commented_at: c.at,
            buyer_fb_id: c.fromId, buyer_name: c.fromName, live_number: a.live_number, variant_id: products.get(a.live_number)?.variantId ?? null,
            qty: a.qty, source,
          }))
          const { data, error } = await supabase.from('live_claims').insert(rows).select(CLAIM_SELECT)
          if (error && error.code !== '23505') note = `Not saved: ${error.message}`
          else if (data) { setAllClaims([...claimsRef.current, ...(data as Claim[])]); feedbackOk() }
          if (!note) note = add.map(a => `#${a.live_number}${a.qty > 1 ? ` ×${a.qty}` : ''}${known.has(a.live_number) ? '' : ' (not in inventory)'}`).join(', ')
        } else if (cancel.length) {
          await supabase.from('live_claims').update({ state: 'cancelled' }).in('id', cancel)
          setAllClaims(claimsRef.current.map(x => (cancel.includes(x.id) ? { ...x, state: 'cancelled' } : x)))
          note = 'Dropped their claim, next in line moves up'
        } else if (parsed.kind === 'claim') note = 'Already claimed'
        else if (parsed.kind === 'cancel') note = 'Nothing to drop'
        setFeed(f => [{ c, parsed, note }, ...f].slice(0, 300))
      }
    })
  }, [rules, known, products, shop, id])

  const slotId = params.get('slot')

  async function startFacebook() {
    setConnectErr('')
    if (slotId && !manualToken.trim()) {
      // A booked slot on the shared Page: the app's server reads the comments for us.
      stopRef.current?.()
      setMode('facebook')
      stopRef.current = listenToSlot(slotId, (cs, vid) => handleComments(cs, 'facebook', vid), (s, detail) => setStatus({ s, detail }))
      return
    }
    const vid = parseVideoId(videoInput)
    if (!vid) { setConnectErr('Paste the link to the live video (or its number) from Facebook.'); return }
    const token = manualToken.trim() || await getPageToken()
    if (!token) { setConnectErr('Facebook isn’t connected to the app yet. You can still try the bot with a practice live below.'); return }
    stopRef.current?.()
    setMode('facebook')
    stopRef.current = listenToComments(vid, token, cs => handleComments(cs, 'facebook', vid), (s, detail) => setStatus({ s, detail }))
  }

  function startPractice() {
    stopRef.current?.()
    setMode('practice'); setStatus(null)
    const numbers = [...products.values()].filter(p => p.onList).map(p => p.liveNumber)
    const script = practiceComments(numbers.length ? numbers : [...products.keys()].slice(0, 4))
    let i = 0
    const t = setInterval(() => {
      if (i >= script.length) { clearInterval(t); setMode('idle'); toast('Practice live finished', { kind: 'ok' }); return }
      const c = script[i++]
      handleComments([{ ...c, id: `practice-${Date.now()}-${i}`, at: new Date().toISOString() }], 'practice', null)
    }, 1100)
    stopRef.current = () => clearInterval(t)
  }

  function stop() { stopRef.current?.(); stopRef.current = null; setMode('idle'); setStatus(null) }

  // ---- Fixing things by hand ----------------------------------------------------------------------------------
  async function unclaim(c: Claim) {
    tap()
    await supabase.from('live_claims').update({ state: 'cancelled' }).eq('id', c.id)
    setAllClaims(claimsRef.current.map(x => (x.id === c.id ? { ...x, state: 'cancelled' } : x)))
    toast(`Took #${c.live_number} from ${c.buyer_name}`, {
      undo: async () => {
        await supabase.from('live_claims').update({ state: 'active' }).eq('id', c.id)
        setAllClaims(claimsRef.current.map(x => (x.id === c.id ? { ...x, state: 'active' } : x)))
      },
    })
  }

  const [manual, setManual] = useState({ name: '', number: '', qty: '1' })
  async function addManual() {
    const n = manual.number.replace(/\D/g, '').padStart(4, '0')
    if (!manual.name.trim() || !/^\d{4}$/.test(n)) return
    const { data, error } = await supabase.from('live_claims').insert({
      shop_id: shop!.id, live_id: id!, buyer_name: manual.name.trim(), live_number: n, variant_id: products.get(n)?.variantId ?? null,
      qty: Math.max(1, parseInt(manual.qty, 10) || 1), source: 'manual', comment_text: 'Added by hand',
    }).select(CLAIM_SELECT).single()
    if (error) { toast(error.message, { kind: 'bad' }); return }
    setAllClaims([...claimsRef.current, data as Claim])
    setManual({ name: manual.name, number: '', qty: '1' })
    feedbackOk()
  }

  async function clearPractice() {
    if (!window.confirm('Remove all practice claims from this live?')) return
    await supabase.from('live_claims').delete().eq('live_id', id!).eq('source', 'practice').is('order_id', null)
    load()
  }

  // ---- Turning claims into orders -----------------------------------------------------------------------------
  const winners = [...alloc.values()].filter(a => a.won > 0)
  const toOrder = winners.filter(a => !a.claim.order_id)
  const buyersToOrder = new Set(toOrder.map(a => a.claim.buyer_name.trim().toLowerCase()))
  const salesTotal = winners.reduce((s, a) => s + a.won * (products.get(a.claim.live_number)?.price ?? 0), 0)

  async function createOrders() {
    if (!shop || !live || !toOrder.length) return
    setBusy(true)
    const ids: string[] = []
    try {
      const { data: existing } = await supabase.from('customers').select('id,name,handle,facebook_id')
      const custs = (existing ?? []) as any[]
      // A claim added by hand joins the same order as that person's comment claims.
      const fbByName = new Map(toOrder.filter(a => a.claim.buyer_fb_id).map(a => [a.claim.buyer_name.trim().toLowerCase(), buyerKey(a.claim)]))
      const groups = new Map<string, typeof toOrder>()
      for (const a of toOrder) {
        const k = a.claim.buyer_fb_id ? buyerKey(a.claim) : fbByName.get(a.claim.buyer_name.trim().toLowerCase()) ?? buyerKey(a.claim)
        groups.set(k, [...(groups.get(k) ?? []), a])
      }
      for (const list of groups.values()) {
        const c0 = list.find(a => a.claim.buyer_fb_id)?.claim ?? list[0].claim
        const name = c0.buyer_name.trim()
        let cust = custs.find(x => c0.buyer_fb_id && x.facebook_id === c0.buyer_fb_id)
          ?? custs.find(x => (x.handle ?? x.name ?? '').toLowerCase() === name.toLowerCase())
        if (!cust) {
          const { data, error } = await supabase.from('customers').insert({ shop_id: shop.id, name, handle: name, facebook_id: c0.buyer_fb_id }).select('id,name,handle,facebook_id').single()
          if (error) throw error
          cust = data; custs.push(data)
        } else if (c0.buyer_fb_id && !cust.facebook_id) {
          await supabase.from('customers').update({ facebook_id: c0.buyer_fb_id }).eq('id', cust.id)
        }
        const lines = list.map(a => {
          const p = products.get(a.claim.live_number)
          return {
            shop_id: shop.id, variant_id: p?.variantId ?? null, live_number: a.claim.live_number,
            description: p ? `${p.name}${p.label && p.label !== 'One size' ? ` - ${p.label}` : ''}` : a.claim.comment_text, qty: a.won, price: p?.price ?? null,
          }
        })
        const total = lines.reduce((s, l) => s + (l.price ?? 0) * l.qty, 0)
        const { data: order, error: oErr } = await supabase.from('orders')
          .insert({ shop_id: shop.id, customer_id: cust.id, live_id: live.id, live_date: new Date(live.starts_at).toLocaleDateString('en-CA'), source: 'live_bot', total })
          .select('id').single()
        if (oErr) throw oErr
        ids.push(order.id)
        const { error: lErr } = await supabase.from('order_lines').insert(lines.map(l => ({ ...l, order_id: order.id })))
        if (lErr) throw lErr
        await supabase.from('live_claims').update({ order_id: order.id }).in('id', list.map(a => a.claim.id))
      }
      feedbackOk()
      toast(`Created ${ids.length} order${ids.length === 1 ? '' : 's'}`, { kind: 'ok' })
      navigate(`/pick?orders=${ids.join(',')}`)
    } catch (e: any) {
      toast(`Stopped after ${ids.length} order(s): ${e.message ?? e}`, { kind: 'bad' })
      load()
    } finally { setBusy(false) }
  }

  function downloadSales() {
    const rows = [['Customer name', 'Facebook name', 'Facebook ID', 'Live #', 'Description', 'Qty', 'Price', 'Claimed at', 'Comment']]
    for (const a of winners) {
      const p = products.get(a.claim.live_number)
      rows.push([a.claim.buyer_name, a.claim.buyer_name, a.claim.buyer_fb_id ?? '', a.claim.live_number, p ? `${p.name} ${p.label === 'One size' ? '' : p.label}`.trim() : '', String(a.won), p ? p.price.toFixed(2) : '', new Date(a.claim.commented_at).toLocaleTimeString(), a.claim.comment_text ?? ''])
    }
    downloadFile(`${(live?.title ?? 'live').replace(/[^\w$ -]+/g, '').trim().replace(/\s+/g, '-')}-sales.csv`, toCsv(rows) + '\r\n')
  }

  // ---- Board: one card per Live # that got a claim, plus tonight's list --------------------------------------
  const board = useMemo(() => {
    const nums = new Set<string>([...products.values()].filter(p => p.onList).map(p => p.liveNumber))
    for (const c of claims) if (c.state === 'active') nums.add(c.live_number)
    return [...nums].map(n => {
      const list = [...alloc.values()].filter(a => a.claim.live_number === n)
      return { n, p: products.get(n), won: list.filter(a => a.won > 0), waiting: list.filter(a => a.waiting > 0) }
    }).sort((a, b) => (b.won.length + b.waiting.length) - (a.won.length + a.waiting.length) || a.n.localeCompare(b.n))
  }, [products, claims, alloc])

  // ---- Buyers: each person's cart, with a thank-you message ready to paste into Messenger ----------------------
  const buyers = useMemo(() => {
    type B = { key: string; name: string; lines: { liveNumber: string; title: string; qty: number; price: number }[]; waiting: string[]; ordered: boolean }
    const m = new Map<string, B>()
    for (const a of alloc.values()) {
      if (!a.won && !a.waiting) continue
      const key = a.claim.buyer_fb_id ? buyerKey(a.claim) : `name:${a.claim.buyer_name.trim().toLowerCase()}`
      const b: B = m.get(key) ?? { key, name: a.claim.buyer_name, lines: [], waiting: [], ordered: true }
      const p = products.get(a.claim.live_number)
      if (a.won) {
        b.lines.push({ liveNumber: a.claim.live_number, title: p ? `${p.name}${p.label && p.label !== 'One size' ? ` - ${p.label}` : ''}` : 'Item', qty: a.won, price: p?.price ?? 0 })
        if (!a.claim.order_id) b.ordered = false
      }
      if (a.waiting) b.waiting.push(a.claim.live_number)
      m.set(key, b)
    }
    const total = (b: B) => b.lines.reduce((s, l) => s + l.qty * l.price, 0)
    return [...m.values()].sort((x, y) => total(y) - total(x))
  }, [alloc, products])

  async function copyMessage(b: (typeof buyers)[number]) {
    const text = buyerMessage(rules.message ?? DEFAULT_BUYER_MESSAGE, { name: b.name, live: live?.title ?? 'our live', lines: b.lines })
    try { await navigator.clipboard.writeText(text); toast(`Copied ${b.name.split(' ')[0]}’s message`, { kind: 'ok' }) } catch { window.prompt('Copy this message', text) }
    setSent(s => new Set(s).add(b.key))
  }

  if (live === undefined) return <p className="muted">Loading…</p>
  if (live === null) return <div className="empty card"><b>That live wasn't found</b><Link className="btn ghost" to="/calendar">Calendar</Link></div>

  const statusText = mode === 'practice' ? 'Practice live running'
    : mode === 'facebook' ? (status?.s === 'live' ? 'Listening to comments' : status?.s === 'polling' ? 'Reading comments (checks every few seconds)' : status?.s === 'error' ? `Having trouble: ${status.detail ?? ''}` : 'Connecting to Facebook…')
    : 'Not listening'
  const practiceCount = claims.filter(c => c.source === 'practice' && !c.order_id).length
  const shown = filter === 'claims' ? feed.filter(f => f.parsed.kind !== 'none') : feed

  return (
    <div className="stack wide-gap">
      <Link to={`/lives/${live.id}`} className="back-link">‹ {live.title}</Link>
      <div className="page-head">
        <div>
          <span className="eyebrow">Comment bot · {liveWhen(live)}</span>
          <h1>{live.title}</h1>
          <span className={`bot-status ${mode}`}><span className="bot-dot" />{statusText}</span>
        </div>
        <div className="row-gap">
          <button className="btn ghost" onClick={() => setRulesOpen(true)}>Bot settings</button>
          {mode !== 'idle' && <button className="btn ghost" onClick={stop}>Stop</button>}
        </div>
      </div>

      <div className="stat-row">
        <div className="stat"><span>Comments read</span><b>{feed.length}</b></div>
        <div className="stat"><span>Items claimed</span><b>{winners.reduce((s, a) => s + a.won, 0)}</b></div>
        <div className="stat"><span>Buyers</span><b>{new Set(winners.map(a => buyerKey(a.claim))).size}</b></div>
        <div className="stat"><span>Sales so far</span><b className="gold">{money(salesTotal)}</b></div>
      </div>

      {mode === 'idle' && (
        <div className="card stack bot-connect">
          <b className="big-text">Start the bot</b>
          <span className="muted">Go live on the Page first, then paste the live’s link here. The bot reads every comment, and when someone writes <b>sold 4821</b> (or just <b>4821</b>), it gives them that item. If more people want it than you have, they wait in line and move up if someone drops out.</span>
          <div className="row-gap">
            {slotId
              ? <span className="grow muted">Connected to your booked slot on the Page.</span>
              : <input className="grow" placeholder="Facebook live link or video number" value={videoInput} onChange={e => setVideoInput(e.target.value)} />}
            <button className="btn gold" onClick={startFacebook}>Start listening</button>
          </div>
          {connectErr && <p className="danger-text">{connectErr}</p>}
          <details className="muted small">
            <summary>Testing with a Page token from Facebook’s developer tools</summary>
            <input type="password" autoComplete="off" placeholder="Page access token (kept only until you close this page)" value={manualToken} onChange={e => setManualToken(e.target.value)} />
          </details>
          <div className="row-gap">
            <button className="btn outline-gold" onClick={startPractice}>Try a practice live</button>
            <span className="muted small self-start">Pretend buyers comment on tonight’s items so you can see how it works.</span>
          </div>
        </div>
      )}

      <div className="bot-layout">
        <section className="stack">
          <div className="row-between">
            <h2>{view === 'items' ? 'Who got what' : 'Buyers'}</h2>
            <div className="seg-mini">
              <button className={view === 'items' ? 'on' : ''} onClick={() => setView('items')}>Items ({board.length})</button>
              <button className={view === 'buyers' ? 'on' : ''} onClick={() => setView('buyers')}>Buyers ({buyers.length})</button>
            </div>
          </div>
          {view === 'buyers' && buyers.length === 0 && <div className="empty card"><b>No buyers yet</b><span className="muted">Everyone who claims something gets a cart here, with their total and a thank-you message to send.</span></div>}
          {view === 'buyers' && (
            <div className="bot-board">
              {buyers.map(b => {
                const total = b.lines.reduce((s, l) => s + l.qty * l.price, 0)
                return (
                  <div key={b.key} className="card bot-item">
                    <div className="row-between"><b>{b.name}</b><span className="bot-count">{money(total)}</span></div>
                    {b.lines.map(l => <span key={l.liveNumber} className="small"><span className="gold strong">#{l.liveNumber}</span> {l.title}{l.qty > 1 ? ` ×${l.qty}` : ''}</span>)}
                    {b.waiting.length > 0 && <span className="muted small">In line for {b.waiting.map(n => `#${n}`).join(', ')}</span>}
                    <div className="row-gap">
                      {b.lines.length > 0 && <button className={`btn small ${sent.has(b.key) ? 'ghost' : 'outline-gold'}`} onClick={() => copyMessage(b)}>{sent.has(b.key) ? 'Copied ✓' : 'Copy message'}</button>}
                      {b.ordered && b.lines.length > 0 && <span className="status-pill packed">Ordered</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {view === 'items' && board.length === 0 && <div className="empty card"><b>No items yet</b><span className="muted">Add items to this live, or start the bot and claims will show up here.</span></div>}
          {view === 'items' && <div className="bot-board">
            {board.map(({ n, p, won, waiting }) => {
              const sold = won.reduce((s, a) => s + a.won, 0)
              const cap = p?.available ?? 0
              return (
                <div key={n} className={`card bot-item ${!p ? 'unknown' : sold >= cap && cap > 0 ? 'soldout' : ''}`}>
                  <div className="row-between">
                    <span className="live-num small-live">#{n}</span>
                    <span className={`bot-count ${sold >= cap && cap > 0 ? 'full' : ''}`}>{p ? `${sold} of ${cap}` : 'Not in inventory'}</span>
                  </div>
                  <b>{p ? p.name : 'Unknown Live #'}</b>
                  {p && <span className="muted small">{p.label !== 'One size' ? `${p.label} · ` : ''}{money(p.price)}{p.onList ? '' : ' · not on tonight’s list'}</span>}
                  {won.map(a => (
                    <div key={a.claim.id} className="bot-buyer">
                      <span className="grow">{a.claim.buyer_name}{a.won > 1 ? ` ×${a.won}` : ''}{a.claim.source !== 'facebook' && <span className="muted small"> · {a.claim.source === 'manual' ? 'by hand' : 'practice'}</span>}</span>
                      {a.claim.order_id ? <span className="status-pill packed">Ordered</span> : <button className="icon-btn small" aria-label={`Take from ${a.claim.buyer_name}`} onClick={() => unclaim(a.claim)}>×</button>}
                    </div>
                  ))}
                  {waiting.length > 0 && (
                    <div className="bot-wait">
                      <span className="eyebrow">Waiting in line</span>
                      {waiting.map((a, i) => (
                        <div key={a.claim.id} className="bot-buyer dim">
                          <span className="grow">{i + 1}. {a.claim.buyer_name}{a.waiting > 1 ? ` ×${a.waiting}` : ''}</span>
                          {!a.claim.order_id && <button className="icon-btn small" aria-label={`Remove ${a.claim.buyer_name} from line`} onClick={() => unclaim(a.claim)}>×</button>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>}

          <div className="card stack">
            <b>Add a claim by hand</b>
            <span className="muted small">For a sale the bot missed, or someone who bought another way.</span>
            <div className="row-gap">
              <input className="grow" placeholder="Buyer’s Facebook name" value={manual.name} onChange={e => setManual({ ...manual, name: e.target.value })} />
              <input style={{ width: 110 }} inputMode="numeric" placeholder="Live #" value={manual.number} onChange={e => setManual({ ...manual, number: e.target.value })} />
              <input style={{ width: 70 }} inputMode="numeric" placeholder="Qty" value={manual.qty} onChange={e => setManual({ ...manual, qty: e.target.value })} />
              <button className="btn ghost" onClick={addManual}>Add</button>
            </div>
          </div>
        </section>

        <aside className="stack">
          <div className="row-between">
            <h2>Comments</h2>
            <div className="seg-mini">
              <button className={filter === 'claims' ? 'on' : ''} onClick={() => setFilter('claims')}>Claims</button>
              <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>All</button>
            </div>
          </div>
          <div className="card bot-feed">
            {shown.length === 0 && <span className="muted small">{mode === 'idle' ? 'Comments show up here once the bot is listening.' : 'Waiting for comments…'}</span>}
            {shown.map(f => (
              <div key={f.c.id} className={`bot-comment ${f.parsed.kind}`}>
                <div className="row-between"><b>{f.c.fromName}</b><span className="muted small">{new Date(f.c.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span></div>
                <span>{f.c.text}</span>
                {f.note && <span className={`small ${f.parsed.kind === 'claim' ? 'gold' : 'muted'}`}>{f.note}</span>}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="card stack bot-finish">
        <div className="row-between">
          <div className="stack tight-gap">
            <b className="big-text">Done selling?</b>
            <span className="muted">{toOrder.length ? `Make orders for ${buyersToOrder.size} buyer${buyersToOrder.size === 1 ? '' : 's'}. They go straight to Pick and pack. Add addresses in Customers before shipping.` : winners.length ? 'Every claim is already in an order.' : 'Orders appear here once people claim items.'}</span>
          </div>
          <div className="row-gap">
            <button className="btn ghost" disabled={!winners.length} onClick={downloadSales}>Download sales sheet</button>
            <button className="btn primary" disabled={busy || !toOrder.length} onClick={createOrders}>{busy ? 'Making orders…' : `Make ${buyersToOrder.size} order${buyersToOrder.size === 1 ? '' : 's'}`}</button>
          </div>
        </div>
        {practiceCount > 0 && <button className="link-btn self-start" onClick={clearPractice}>Remove {practiceCount} practice claim{practiceCount === 1 ? '' : 's'}</button>}
      </div>

      {rulesOpen && <RulesSheet open rules={rules} onClose={() => setRulesOpen(false)} onSave={r => { updateSettings({ botRules: r }); setRulesOpen(false); toast('Saved', { kind: 'ok' }) }} />}
    </div>
  )
}

function RulesSheet({ open, rules, onClose, onSave }: { open: boolean; rules: BotRules; onClose: () => void; onSave: (r: BotRules) => void }) {
  const [claimWords, setClaimWords] = useState(rules.claimWords.join(', '))
  const [cancelWords, setCancelWords] = useState(rules.cancelWords.join(', '))
  const [plain, setPlain] = useState(rules.plainNumbers)
  const [prefixes, setPrefixes] = useState((rules.prefixes ?? []).join(', ').toUpperCase())
  const [message, setMessage] = useState(rules.message ?? DEFAULT_BUYER_MESSAGE)
  const split = (s: string) => s.split(',').map(w => w.trim().toLowerCase()).filter(Boolean)
  return (
    <Sheet open={open} onClose={onClose} title="Bot settings">
      <div className="stack">
        <label>Words that mean “I want it”<input value={claimWords} onChange={e => setClaimWords(e.target.value)} /></label>
        <label>Your shop code in front of the Live # (like DD in “DD 4821”)<input value={prefixes} onChange={e => setPrefixes(e.target.value)} placeholder="DD" /></label>
        <label>Words that mean “I changed my mind”<input value={cancelWords} onChange={e => setCancelWords(e.target.value)} /></label>
        <label className="check-row"><input type="checkbox" checked={plain} onChange={e => setPlain(e.target.checked)} /> A comment that’s only a Live # (like “4821”) counts as a claim</label>
        <span className="muted small">Separate words with commas. Quantities work too: “sold 4821 x2” or “Q2”.</span>
        <label>Thank-you message for each buyer<textarea rows={6} value={message} onChange={e => setMessage(e.target.value)} /></label>
        <span className="muted small">These fill in for each buyer: {'{first}'} first name, {'{name}'} full name, {'{items}'} what they got, {'{count}'} how many pieces, {'{total}'} their total, {'{live}'} the live’s title.</span>
        <button className="btn gold" onClick={() => onSave({ claimWords: split(claimWords), cancelWords: split(cancelWords), plainNumbers: plain, prefixes: split(prefixes), message: message.trim() || DEFAULT_BUYER_MESSAGE })}>Save</button>
      </div>
    </Sheet>
  )
}
