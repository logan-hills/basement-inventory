import { useEffect, useRef, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'

type Featured = { live_number: string; name?: string; label?: string; price?: number | null; photo?: string | null }
type Comment = { id: string; message: string; created_time: string; from?: { id: string; name: string } }

const OVERLAY_BASE = () => `${window.location.origin}${window.location.pathname}#/overlay/`

/** Claim-looking comments: "sold", 4-digit Live Numbers, or DD-style claim words. */
const isClaim = (m: string) => /\b(sold|claim|mine)\b|\b\d{4}\b|\bDD\w*/i.test(m)

/** Find a Live Number in the seller's own inventory: name, variation, price and a photo link the overlay can show. */
async function lookup(shopId: string, num: string): Promise<Featured | null> {
  const { data } = await supabase.from('variants')
    .select('live_number,label,price, item:items(id,name, photos:item_photos(path,sort))')
    .eq('shop_id', shopId).eq('live_number', num).limit(1)
  const v: any = data?.[0]
  if (!v) return null
  const path = [...(v.item?.photos ?? [])].sort((a: any, b: any) => a.sort - b.sort)[0]?.path
  let photo: string | null = null
  if (path) photo = (await supabase.storage.from('item-photos').createSignedUrl(path, 60 * 60 * 12)).data?.signedUrl ?? null
  return { live_number: v.live_number, name: v.item?.name, label: v.label, price: v.price, photo }
}

/**
 * The seller's live control panel: put a product on the stream (type, tap or say the Live Number),
 * the overlay link for Prism/OBS, and the Facebook comments in real time.
 */
export default function LiveControl({ slotId, liveId, active }: { slotId: string; liveId: string | null; active: boolean }) {
  const { shop } = useSession()
  const toast = useToast()
  const [num, setNum] = useState('')
  const [manual, setManual] = useState({ name: '', price: '' })
  const [current, setCurrent] = useState<Featured | null>(null)
  const [quick, setQuick] = useState<{ live_number: string; name: string }[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [commentNote, setCommentNote] = useState('')
  const rec = useRef<any>(null)

  useEffect(() => {
    supabase.rpc('my_overlay_token').then(({ data }) => setToken((data as string) ?? null), () => null)
    supabase.from('live_slots').select('featured').eq('id', slotId).maybeSingle().then(({ data }) => setCurrent((data as any)?.featured ?? null), () => null)
  }, [slotId])

  // Quick picks: the items planned for this live.
  useEffect(() => {
    if (!liveId) return
    supabase.from('live_items').select('sort, variant:variants(live_number, item:items(name))').eq('live_id', liveId).order('sort')
      .then(({ data }) => setQuick((data ?? []).map((r: any) => ({ live_number: r.variant?.live_number, name: r.variant?.item?.name })).filter(x => x.live_number)), () => null)
  }, [liveId])

  // Comments in real time (every 3 seconds while live).
  useEffect(() => {
    if (!active) return
    let alive = true, since: string | undefined
    async function poll() {
      const { data, error } = await supabase.functions.invoke('facebook-live-comments', { body: { live_slot_id: slotId, since } })
      if (!alive) return
      if (error) { setCommentNote('Comments show here once the Facebook Page is connected.'); return }
      setCommentNote('')
      const fresh = ((data?.comments ?? []) as Comment[])
      if (fresh.length) {
        setComments(prev => {
          const seen = new Set(prev.map(c => c.id))
          return [...fresh.filter(c => !seen.has(c.id)), ...prev].slice(0, 200)
        })
        since = new Date(Date.parse(fresh[0].created_time) - 10000).toISOString()
      }
    }
    poll()
    const t = setInterval(poll, 3000)
    return () => { alive = false; clearInterval(t) }
  }, [active, slotId])

  async function show(n: string) {
    const live_number = n.replace(/\D/g, '').slice(0, 4)
    if (live_number.length !== 4) return toast('Live Numbers have 4 digits', { kind: 'bad' })
    let f: Featured | null = shop ? await lookup(shop.id, live_number) : null
    if (!f) f = { live_number, name: manual.name.trim() || undefined, price: manual.price ? Number(manual.price) : null }
    const { error } = await supabase.rpc('set_featured', { p_slot: slotId, p_featured: f })
    if (error) return toast(error.message.includes('set_featured') ? 'The on-stream card needs a quick database update first.' : error.message, { kind: 'bad' })
    setCurrent(f); setNum('')
  }
  async function clear() {
    await supabase.rpc('set_featured', { p_slot: slotId, p_featured: null })
    setCurrent(null)
  }

  function toggleMic() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return toast('Voice is not available in this browser. Type the number instead.', { kind: 'bad' })
    if (listening) { rec.current?.stop(); setListening(false); return }
    const r = new SR()
    r.continuous = true; r.interimResults = false; r.lang = 'en-US'
    r.onresult = (e: any) => {
      const text = String(e.results[e.results.length - 1][0].transcript)
      setHeard(text)
      const m = text.replace(/(\d)[\s-]+(?=\d)/g, '$1').match(/\b\d{4}\b/)
      if (m) show(m[0])
    }
    r.onend = () => { if (rec.current === r && listening) r.start() }
    r.start(); rec.current = r; setListening(true)
  }
  useEffect(() => () => rec.current?.stop(), [])

  const overlayUrl = token ? OVERLAY_BASE() + token : ''

  return (
    <div className="live-control">
      <div className="card stack">
        <div className="row-between">
          <h2>Show on stream</h2>
          {current && <button className="link-btn" onClick={clear}>Hide card</button>}
        </div>
        {current ? (
          <div className="now-showing">
            {current.photo ? <img src={current.photo} alt="" /> : <span className="ns-blank">👜</span>}
            <div><span className="eyebrow">On stream now</span><b>#{current.live_number}</b><span className="muted small">{current.name}{current.price != null ? ` · $${current.price}` : ''}</span></div>
          </div>
        ) : <p className="muted small">Nothing on stream yet. Type, tap or say a Live Number.</p>}

        <form className="row-gap" onSubmit={(e: FormEvent) => { e.preventDefault(); show(num) }}>
          <input className="num-input" inputMode="numeric" pattern="[0-9]*" maxLength={4} value={num} onChange={e => setNum(e.target.value.replace(/\D/g, ''))} placeholder="4821" aria-label="Live Number" />
          <button className="btn gold" disabled={num.length !== 4}>Show</button>
          <button type="button" className={`btn ${listening ? 'primary' : 'ghost'} mic-btn`} onClick={toggleMic} aria-pressed={listening}>{listening ? '🎙 Listening…' : '🎙 Say it'}</button>
        </form>
        {listening && heard && <span className="muted small">Heard: “{heard}”</span>}
        {!shop && (
          <div className="row2">
            <label>Name (optional)<input value={manual.name} onChange={e => setManual(m => ({ ...m, name: e.target.value }))} placeholder="Gold hoop earrings" /></label>
            <label>Price (optional)<input inputMode="decimal" value={manual.price} onChange={e => setManual(m => ({ ...m, price: e.target.value }))} placeholder="12" /></label>
          </div>
        )}
        {quick.length > 0 && (
          <div className="quick-nums">
            {quick.map(q => <button key={q.live_number} type="button" className={`chip ${current?.live_number === q.live_number ? 'on' : ''}`} onClick={() => show(q.live_number)}>#{q.live_number} <span className="chip-sub">{q.name}</span></button>)}
          </div>
        )}
      </div>

      <div className="card stack">
        <h2>Live comments</h2>
        {commentNote && <p className="muted small">{commentNote}</p>}
        {!active && <p className="muted small">Comments appear here while you are live.</p>}
        <div className="comment-feed" aria-live="polite">
          {comments.map(c => (
            <div key={c.id} className={`comment ${isClaim(c.message) ? 'claim' : ''}`}>
              <b>{c.from?.name ?? 'Viewer'}</b> <span>{c.message}</span>
            </div>
          ))}
        </div>
      </div>

      <details className="card stack">
        <summary><b>Set up the on-stream card (once)</b></summary>
        <p className="muted small">Add this private link to your streaming app one time. It shows the product card at the bottom of your video whenever you pick a Live Number here.</p>
        {overlayUrl && (
          <div className="key-row">
            <span className="key-label">Overlay link</span>
            <code className="key-value">{overlayUrl}</code>
            <button type="button" className="btn gold small" onClick={() => navigator.clipboard.writeText(overlayUrl).then(() => toast('Overlay link copied', { kind: 'ok' }))}>Copy</button>
          </div>
        )}
        <ol className="plain-steps">
          <li><b>Prism (iPhone or Android):</b> before you go live, tap Widget, then Web, paste the link, and stretch it across the bottom of the screen.</li>
          <li><b>OBS or Streamlabs (computer):</b> add a Browser source, paste the link, and set it to 1280 × 720.</li>
        </ol>
        <p className="muted small">Your phone is busy being the camera, so open this On Air screen on a second device (a tablet, laptop or spare phone) to pick numbers and read comments.</p>
        <button type="button" className="link-btn" onClick={async () => { const { data } = await supabase.rpc('reset_overlay_token'); if (data) { setToken(data as string); toast('New overlay link made. Paste it into your app again.', { kind: 'ok' }) } }}>Make a new link</button>
      </details>
    </div>
  )
}
