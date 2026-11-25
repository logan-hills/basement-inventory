import { useEffect, useRef, useState, type FormEvent } from 'react'
import { scanBoxKeyDown } from '../lib/scanner'
import { Link, useSearchParams } from 'react-router-dom'
import CameraScanner from '../components/CameraScanner'
import FreeCameraTip from '../components/FreeCameraTip'
import DamageSheet from '../components/DamageSheet'
import { findByLiveNumber, findUnit, money, type UnitInfo } from '../lib/data'
import { feedbackBad, feedbackOk, setSound, soundEnabled } from '../lib/feedback'
import { findBin, isBinCode, moveUnit, type Bin } from '../lib/locations'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { isOrderCode, loadOrderByCode, orderUnits, STATUS_LABEL, type Order } from '../lib/orders'

type Hit =
  | { kind: 'unit'; code: string; unit: UnitInfo }
  | { kind: 'variant'; code: string; v: any }
  | { kind: 'miss'; code: string }
  | { kind: 'bin'; code: string; bin: Bin }
  | { kind: 'order'; code: string; order: Order }

export default function Scan() {
  const [camera, setCamera] = useState(() => {
    try { return localStorage.getItem('scanCamera') === 'on' } catch { return false }
  })
  const [manual, setManual] = useState('')
  const [hits, setHits] = useState<Hit[]>([])
  const [sound, setSoundState] = useState(soundEnabled())
  const [damage, setDamage] = useState<UnitInfo | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { shop } = useSession()
  const toast = useToast()
  const [params] = useSearchParams()
  const [activeBin, setActiveBin] = useState<Bin | null>(null)
  const binRef = useRef<Bin | null>(null)
  binRef.current = activeBin
  // A tag with no bin yet waits here for the next bin scan: scan the tag, then the bin, and they're linked.
  const [pending, setPending] = useState<UnitInfo | null>(null)
  const pendingRef = useRef<UnitInfo | null>(null)
  pendingRef.current = pending

  // "Try it now" on Recommended gear opens Scan with the camera on.
  useEffect(() => { if (params.get('camera') === 'on') setCamera(true) }, [params])

  useEffect(() => {
    const b = params.get('bin')
    if (b) findBin(b).then(found => { if (found) setActiveBin(found) })
  }, [params])

  useEffect(() => { try { localStorage.setItem('scanCamera', camera ? 'on' : 'off') } catch { /* ignore */ } }, [camera])

  // USB and Bluetooth scanners type the code and press Enter, so keep the box focused.
  useEffect(() => {
    const refocus = () => { if (!document.querySelector('.sheet-panel')) inputRef.current?.focus() }
    refocus()
    const id = window.setInterval(() => { if (document.activeElement === document.body) refocus() }, 800)
    return () => clearInterval(id)
  }, [])

  async function handle(raw: string) {
    const code = raw.trim().toUpperCase()
    if (!code) return
    let hit: Hit
    if (isOrderCode(code)) {
      const order = await loadOrderByCode(code)
      hit = order ? { kind: 'order', code, order } : { kind: 'miss', code }
    } else if (isBinCode(code)) {
      const bin = await findBin(code)
      const waiting = pendingRef.current
      if (bin && waiting && shop) {
        // The bin answers the put-away prompt: link the waiting tag to it, then keep the bin open for more tags.
        try {
          const from = await moveUnit(shop.id, waiting.id, bin.id)
          toast(`${waiting.tag_code} is put away in ${bin.code}`, { undo: async () => { await moveUnit(shop.id, waiting.id, from) } })
          const placed = { ...waiting, location: { code: bin.code, name: bin.name } }
          setHits(h => h.map(x => (x.kind === 'unit' && x.unit.id === waiting.id ? { ...x, unit: placed } : x)))
          setPending(null)
          setActiveBin(bin)
          hit = { kind: 'bin', code, bin }
        } catch {
          toast('That didn\'t save. Check your internet and scan the bin again.')
          feedbackBad()
          return
        }
      } else if (bin) { setActiveBin(bin); hit = { kind: 'bin', code, bin } } else hit = { kind: 'miss', code }
    } else if (/^\d{4}$/.test(code)) {
      const v = await findByLiveNumber(code)
      hit = v ? { kind: 'variant', code, v } : { kind: 'miss', code }
    } else {
      let unit = await findUnit(code)
      const bin = binRef.current
      if (unit && bin && shop && unit.status === 'in_stock') {
        if (unit.location?.code !== bin.code) {
          const from = await moveUnit(shop.id, unit.id, bin.id)
          const u = unit
          toast(`${u.tag_code} → ${bin.code}`, { undo: async () => { await moveUnit(shop.id, u.id, from) } })
        }
        unit = { ...unit, location: { code: bin.code, name: bin.name } }
      }
      hit = unit ? { kind: 'unit', code, unit } : { kind: 'miss', code }
      // No bin open and this tag has no home yet: ask for a bin (they can skip and just look).
      setPending(unit && !bin && unit.status === 'in_stock' && !unit.location ? unit : null)
    }
    if (hit.kind === 'order' || hit.kind === 'variant') setPending(null)
    if (hit.kind === 'miss') feedbackBad()
    else feedbackOk()
    setHits(h => [hit, ...h].slice(0, 30))
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    handle(manual)
    setManual('')
  }

  const okCount = hits.filter(h => h.kind !== 'miss').length

  async function refreshUnit(code: string) {
    const unit = await findUnit(code)
    if (unit) setHits(h => h.map(x => (x.kind === 'unit' && x.code === code ? { ...x, unit } : x)))
  }

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <span className="eyebrow">Stock</span>
          <h1>Scan</h1>
        </div>
        <div className="row-gap">
          <button className={`btn ${sound ? 'ghost' : 'ghost dim'}`} onClick={() => { setSound(!sound); setSoundState(!sound) }}>{sound ? 'Sound on' : 'Sound off'}</button>
          <button className={`btn ${camera ? 'gold' : 'outline-gold'}`} onClick={() => setCamera(c => !c)}>{camera ? 'Stop camera' : 'Use camera'}</button>
        </div>
      </div>

      {activeBin ? (
        <div className="putaway-banner">
          <div><span className="eyebrow light">Putting away into</span><b className="mono">{activeBin.code}</b><span>{activeBin.name}</span></div>
          <button className="btn gold" onClick={() => setActiveBin(null)}>Done</button>
        </div>
      ) : (
        <p className="muted small">Scan a bin label first to put items away into it. Scan an item tag on its own to look it up. If the tag has no bin yet, we'll ask you to scan one.</p>
      )}

      {pending && (
        <div className="putaway-ask" role="alert">
          <span className="putaway-ask-badge">No bin yet</span>
          <div className="putaway-ask-item">
            <span className="live-num">#{pending.variant.live_number}</span>
            <div className="hit-text">
              <b>{pending.variant.item.name}</b>
              <span className="muted">{pending.variant.label} · tag <span className="mono">{pending.tag_code}</span></span>
            </div>
          </div>
          <h2 className="putaway-ask-title">Scan a bin to put this away</h2>
          <p className="muted">Scan the bin label where this piece will live, and they're linked. Just looking? Skip it.</p>
          <div className="putaway-ask-actions">
            <button className="btn ghost big" onClick={() => setPending(null)}>Skip</button>
            <Link className="btn outline-gold big" to={`/item/${pending.variant.item.id}`}>Review product</Link>
          </div>
        </div>
      )}

      {!camera && <FreeCameraTip onUse={() => setCamera(true)} />}
      {camera && <CameraScanner onCode={handle} />}

      <form onSubmit={submit} className="scan-input">
        <input ref={inputRef} value={manual} onChange={e => setManual(e.target.value)} onKeyDown={scanBoxKeyDown}
          placeholder="Scan with a scanner, or type a tag or Live #" autoComplete="off" autoCapitalize="characters" enterKeyHint="go" aria-label="Scan or type a code" />
        <button className="btn primary">Look up</button>
      </form>

      {hits.length > 0 && (
        <div className="scan-counter"><span className="gold big-num">{okCount}</span> scanned this session{hits.length > okCount ? ` · ${hits.length - okCount} not found` : ''}
          <button className="link-btn" onClick={() => setHits([])}>Clear</button>
        </div>
      )}

      <div className="stack">
        {hits.map((h, i) => (
          <div key={i} className={`card scan-hit ${h.kind === 'miss' ? 'miss' : ''} ${i === 0 ? 'latest' : ''}`}>
            {h.kind === 'miss' && <><b>{h.code}</b><span className="danger-text">Not found in your inventory</span></>}
            {h.kind === 'order' && (
              <>
                <div className="hit-main"><span className="live-num">Box</span><div className="hit-text"><b className="mono">{h.order.code}</b><span className="muted">{h.order.customer?.name ?? 'Customer'} · {orderUnits(h.order)} items · {STATUS_LABEL[h.order.status] ?? h.order.status}</span></div></div>
                <Link className="btn ghost" to={`/order/${h.order.code}`}>Open order</Link>
              </>
            )}
            {h.kind === 'bin' && (
              <>
                <div className="hit-main"><span className="live-num">Bin</span><div className="hit-text"><b className="mono">{h.bin.code}</b><span className="muted">{h.bin.name} · now scan items to put them here</span></div></div>
                <Link className="btn ghost" to={`/bin/${h.bin.id}`}>See contents</Link>
              </>
            )}
            {h.kind === 'variant' && (
              <>
                <div className="hit-main">
                  <span className="live-num">#{h.v.live_number}</span>
                  <div className="hit-text"><b>{h.v.item.name}</b><span className="muted">{h.v.label} · {money(h.v.price)}</span></div>
                </div>
                <Link className="btn ghost" to={`/item/${h.v.item.id}`}>Open</Link>
              </>
            )}
            {h.kind === 'unit' && (
              <>
                <div className="hit-main">
                  <span className="live-num">#{h.unit.variant.live_number}</span>
                  <div className="hit-text">
                    <b>{h.unit.variant.item.name}</b>
                    <span className="muted">{h.unit.variant.label} · {money(h.unit.variant.price)} · tag {h.unit.tag_code}</span>
                    <span className={h.unit.status === 'in_stock' ? 'muted' : 'danger-text'}>
                      {h.unit.status === 'in_stock' ? (h.unit.location ? `In ${h.unit.location.code}` : 'In stock · no bin yet') : `Removed · ${h.unit.removed_reason ?? h.unit.status}`}
                    </span>
                  </div>
                </div>
                <div className="row-gap">
                  <Link className="btn ghost" to={`/item/${h.unit.variant.item.id}`}>Open</Link>
                  {h.unit.status === 'in_stock' && !h.unit.location && pending?.id !== h.unit.id && <button className="btn outline-gold" onClick={() => setPending(h.unit)}>Put away</button>}
                  {h.unit.status === 'in_stock' && <button className="btn ghost danger-text" onClick={() => setDamage(h.unit)}>Damage out</button>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <DamageSheet
        unit={damage ? { id: damage.id, tag_code: damage.tag_code, label: `${damage.variant.item.name} · ${damage.variant.label}` } : null}
        onClose={() => setDamage(null)}
        onChanged={() => damage && refreshUnit(damage.tag_code)}
      />
    </div>
  )
}
