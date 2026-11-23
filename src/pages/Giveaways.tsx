import { Capacitor } from '@capacitor/core'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import GiveawayStage from '../components/GiveawayStage'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'
import { chime } from '../lib/stage'
import {
  GAMES, SPIN_MS, ROLL_MS, loadShow, saveShow, pushShow, publicShow, loadWinners, saveWinners, makeSpin, makeRoll, dealBoxes,
  parseEntrants, totalSlots, pct, fanfare, WHEEL_COLORS, slices, type Show, type Game, type WinnerLog,
} from '../lib/giveaway'

// The overlay link must point at the website, even when copied from inside the iPhone app.
const OVERLAY_BASE = () => Capacitor.isNativePlatform()
  ? 'https://logan-hills.github.io/basement-inventory/#/overlay/'
  : `${window.location.origin}${window.location.pathname}#/overlay/`

const when = (t: number) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

/** Live giveaways: the slot wheel, lucky number, countdown and mystery boxes, shown on stream. */
export default function Giveaways() {
  const toast = useToast()
  const [show, setShowState] = useState<Show>(loadShow)
  const [winners, setWinners] = useState<WinnerLog[]>(loadWinners)
  const [full, setFull] = useState(false)
  const [sound, setSound] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [synced, setSynced] = useState<boolean | null>(null)
  const [name, setName] = useState('')
  const [slots, setSlots] = useState(1)
  const [paste, setPaste] = useState('')
  const [announce, setAnnounce] = useState({ name: '', detail: '' })
  const fullRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const setShow = (fn: (s: Show) => Show) => setShowState(s => { const n = fn(s); saveShow(n); return n })
  const logWinner = (w: Omit<WinnerLog, 'at'>) => setWinners(list => { const n = [{ ...w, at: Date.now() }, ...list]; saveWinners(n); return n })

  // Keep the stream overlay in step (a short pause so typing doesn't send every letter).
  useEffect(() => {
    const t = setTimeout(() => { pushShow(show).then(setSynced) }, 250)
    return () => clearTimeout(t)
  }, [show])

  useEffect(() => { supabase.rpc('my_overlay_token').then(({ data }) => setToken((data as string) ?? null), () => null) }, [])

  // Full screen: use the real thing where the browser allows it, and leave it cleanly with Esc.
  useEffect(() => {
    if (!full) return
    fullRef.current?.requestFullscreen?.().catch(() => null)
    const onChange = () => { if (!document.fullscreenElement) setFull(false) }
    document.addEventListener('fullscreenchange', onChange)
    return () => { document.removeEventListener('fullscreenchange', onChange); if (document.fullscreenElement) document.exitFullscreen().catch(() => null) }
  }, [full])

  // Countdown: chime at the end.
  const cd = show.countdown
  const [, bump] = useState(0)
  useEffect(() => {
    if (!cd.endsAt) return
    const left = cd.endsAt - Date.now()
    if (left <= 0) return
    const t = setTimeout(() => { bump(n => n + 1); if (sound) chime(3) }, left)
    return () => clearTimeout(t)
  }, [cd.endsAt, sound])

  const entrants = show.wheel.entrants
  const total = totalSlots(entrants)
  const colors = useMemo(() => new Map(slices(entrants).map(s => [s.entrant.id, s.color])), [entrants])
  const spin = show.wheel.spin
  const [busy, setBusy] = useState(false)

  function pick(game: Game) { setShow(s => ({ ...s, game, winner: null })) }

  function spinNow(dropId?: string) {
    if (busy) return
    const list = dropId ? entrants.filter(e => e.id !== dropId) : entrants
    const next = makeSpin(list)
    if (!next) { toast('Add at least one name to the wheel first.', { kind: 'bad' }); nameRef.current?.focus(); return }
    setShow(s => ({ ...s, winner: null, visible: true, wheel: { entrants: list, spin: next } }))
    setBusy(true)
    const w = list.find(e => e.id === next.winnerId)!
    setTimeout(() => {
      setBusy(false)
      if (sound) fanfare()
      logWinner({ name: w.name, game: 'Spin the wheel', prize: show.prize })
    }, SPIN_MS)
  }

  function drawNumber() {
    if (busy) return
    const roll = makeRoll(show.number.min, show.number.max)
    setShow(s => ({ ...s, winner: null, visible: true, number: { ...s.number, roll } }))
    setBusy(true)
    setTimeout(() => { setBusy(false); if (sound) fanfare(); logWinner({ name: `Lucky number ${roll.value}`, game: 'Lucky number', prize: show.prize }) }, ROLL_MS)
  }

  const running = !!cd.endsAt && cd.endsAt > Date.now()
  function startTimer() { setShow(s => ({ ...s, visible: true, countdown: { ...s.countdown, endsAt: Date.now() + (s.countdown.left > 0 ? s.countdown.left : s.countdown.seconds * 1000) } })) }
  function pauseTimer() { setShow(s => ({ ...s, countdown: { ...s.countdown, left: Math.max(0, (s.countdown.endsAt ?? 0) - Date.now()), endsAt: null } })) }
  function resetTimer(seconds = cd.seconds) { setShow(s => ({ ...s, countdown: { ...s.countdown, seconds, left: seconds * 1000, endsAt: null } })) }
  function addTime(sec: number) {
    setShow(s => {
      const c = s.countdown
      return c.endsAt && c.endsAt > Date.now()
        ? { ...s, countdown: { ...c, endsAt: c.endsAt + sec * 1000, seconds: c.seconds + sec } }
        : { ...s, countdown: { ...c, left: Math.max(0, c.left) + sec * 1000, seconds: Math.max(c.seconds, Math.ceil((Math.max(0, c.left) + sec * 1000) / 1000)), endsAt: null } }
    })
  }

  function newBoxes(count = show.boxes.count) {
    setShow(s => ({ ...s, boxes: { ...s.boxes, count, deck: dealBoxes(count, s.boxes.prizes), opened: {} } }))
  }
  function openBox(n: number) {
    setShow(s => {
      const deck = s.boxes.deck.length === s.boxes.count ? s.boxes.deck : dealBoxes(s.boxes.count, s.boxes.prizes)
      return { ...s, visible: true, boxes: { ...s.boxes, deck, opened: { ...s.boxes.opened, [String(n)]: deck[n - 1] } } }
    })
    if (sound) fanfare()
  }

  function addEntrant(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    setShow(s => ({ ...s, wheel: { ...s.wheel, entrants: parseEntrants(`${n} ${Math.max(1, slots)}`, s.wheel.entrants) } }))
    setName(''); setSlots(1); nameRef.current?.focus()
  }
  function changeSlots(id: string, by: number) {
    setShow(s => ({ ...s, wheel: { ...s.wheel, entrants: s.wheel.entrants.map(x => x.id === id ? { ...x, slots: Math.max(1, x.slots + by) } : x) } }))
  }
  function removeEntrant(id: string) { setShow(s => ({ ...s, wheel: { ...s.wheel, entrants: s.wheel.entrants.filter(x => x.id !== id) } })) }

  function sendWinner(e: FormEvent) {
    e.preventDefault()
    if (!announce.name.trim()) return
    setShow(s => ({ ...s, visible: true, winner: { name: announce.name.trim(), detail: announce.detail.trim() || (s.prize ? `Wins ${s.prize}` : ''), at: Date.now() } }))
    logWinner({ name: announce.name.trim(), game: GAMES.find(g => g.id === show.game)!.name, prize: show.prize })
    setAnnounce({ name: '', detail: '' })
  }

  const overlayUrl = token ? `${OVERLAY_BASE()}${token}` : ''
  const copy = (text: string, what: string) => navigator.clipboard.writeText(text).then(() => toast(`${what} copied`, { kind: 'ok' }), () => toast('Copy did not work. Press and hold to copy.', { kind: 'bad' }))
  const view = publicShow(show)
  const spinWinner = spin ? entrants.find(e => e.id === spin.winnerId) : undefined

  /** The one big button for the game that's showing. */
  const mainAction = (big = false) => {
    const cls = `btn gold ${big ? 'gw-go' : 'big'}`
    if (show.game === 'wheel') return <button type="button" className={cls} disabled={busy || !entrants.length} onClick={() => spinNow()}>{busy ? 'Spinning…' : '🎡 Spin the wheel'}</button>
    if (show.game === 'number') return <button type="button" className={cls} disabled={busy} onClick={drawNumber}>{busy ? 'Drawing…' : '🎲 Draw a number'}</button>
    if (show.game === 'countdown') return running
      ? <button type="button" className={`btn ghost ${big ? 'gw-go' : 'big'}`} onClick={pauseTimer}>⏸ Pause</button>
      : <button type="button" className={cls} onClick={startTimer}>▶ {cd.left > 0 && cd.left < cd.seconds * 1000 ? 'Keep going' : 'Start the countdown'}</button>
    return <button type="button" className={`btn ghost ${big ? 'gw-go' : 'big'}`} onClick={() => newBoxes()}>🔀 New round of boxes</button>
  }

  return (
    <div className="stack wide-gap giveaways">
      <div className="page-head">
        <div>
          <span className="script">Make it a party</span>
          <h1>Live <em>giveaways</em></h1>
          <p className="muted">Spin a wheel, draw a number, run a countdown or open mystery boxes, right on your live.</p>
        </div>
        <div className="row-gap">
          <button type="button" className={`chip ${sound ? 'on' : ''}`} onClick={() => setSound(v => !v)} aria-pressed={sound}>{sound ? '🔊 Sound on' : '🔈 Sound off'}</button>
          <button type="button" className="btn gold" onClick={() => setFull(true)}>⛶ Full screen</button>
        </div>
      </div>

      <div className="gw-games" role="tablist" aria-label="Pick a game">
        {GAMES.map(g => (
          <button key={g.id} type="button" role="tab" aria-selected={show.game === g.id} className={`gw-game ${show.game === g.id ? 'on' : ''}`} onClick={() => pick(g.id)}>
            <span className="gw-game-emoji" aria-hidden="true">{g.emoji}</span>
            <b>{g.name}</b>
            <span>{g.blurb}</span>
          </button>
        ))}
      </div>

      <div className="gw-layout">
        <div className="stack">
          <GiveawayStage show={view} variant="panel" sound={sound} onSpin={show.game === 'wheel' && !busy && entrants.length ? () => spinNow() : undefined} onOpenBox={show.game === 'boxes' ? openBox : undefined} />
          {mainAction()}
          {show.game === 'wheel' && spinWinner && !busy && (
            <div className="row-gap">
              <button type="button" className="btn outline-gold" onClick={() => spinNow(spinWinner.id)}>Take {spinWinner.name} off and spin again</button>
              <button type="button" className="btn ghost" onClick={() => setShow(s => ({ ...s, wheel: { ...s.wheel, spin: null } }))}>Clear the winner</button>
            </div>
          )}
          {show.winner && <button type="button" className="btn ghost" onClick={() => setShow(s => ({ ...s, winner: null }))}>Hide the winner banner</button>}
        </div>

        <div className="stack">
          <div className="card stack">
            <h2>What are we giving away?</h2>
            <div className="row2">
              <label>Headline<input value={show.title} maxLength={40} onChange={e => setShow(s => ({ ...s, title: e.target.value }))} placeholder="Giveaway time!" /></label>
              <label>Prize<input value={show.prize} maxLength={40} onChange={e => setShow(s => ({ ...s, prize: e.target.value }))} placeholder="Designer tote" /></label>
            </div>
          </div>

          {show.game === 'wheel' && (
            <div className="card stack">
              <div className="row-between"><h2>Who's on the wheel</h2><span className="muted small">{entrants.length} people · {total} slots</span></div>
              <form className="gw-add" onSubmit={addEntrant}>
                <label className="grow">Name<input ref={nameRef} value={name} onChange={e => setName(e.target.value)} placeholder="Tasha B." autoComplete="off" /></label>
                <label>Slots bought
                  <div className="gw-stepper">
                    <button type="button" aria-label="One less" onClick={() => setSlots(n => Math.max(1, n - 1))}>−</button>
                    <input type="number" inputMode="numeric" min={1} max={999} value={slots} onChange={e => setSlots(Math.max(1, Math.min(999, Number(e.target.value) || 1)))} />
                    <button type="button" aria-label="One more" onClick={() => setSlots(n => Math.min(999, n + 1))}>+</button>
                  </div>
                </label>
                <button className="btn primary" type="submit" disabled={!name.trim()}>Add</button>
              </form>
              {entrants.length > 0 ? (
                <ul className="gw-list">
                  {entrants.map(e => (
                    <li key={e.id} className={spin?.winnerId === e.id && !busy ? 'won' : ''}>
                      <i style={{ background: colors.get(e.id) ?? WHEEL_COLORS[0] }} aria-hidden="true" />
                      <div className="grow gw-who"><b>{e.name}</b><span className="gw-odds">{pct(e.slots, total)} chance</span></div>
                      <div className="gw-stepper small">
                        <button type="button" aria-label={`One less slot for ${e.name}`} onClick={() => changeSlots(e.id, -1)} disabled={busy}>−</button>
                        <span>{e.slots}</span>
                        <button type="button" aria-label={`One more slot for ${e.name}`} onClick={() => changeSlots(e.id, 1)} disabled={busy}>+</button>
                      </div>
                      <button type="button" className="icon-btn gw-x" aria-label={`Remove ${e.name}`} onClick={() => removeEntrant(e.id)} disabled={busy}>×</button>
                    </li>
                  ))}
                </ul>
              ) : <p className="muted">Nobody yet. Add each buyer and how many slots they bought. 3 slots = 3 times the room on the wheel.</p>}
              <details className="gw-paste">
                <summary>Paste a whole list at once</summary>
                <p className="muted small">One person per line, name then slots. Like <code>Tasha 3</code> or <code>Mary Ann, 2</code>. A name with no number gets 1 slot. Same name twice? We add them up.</p>
                <textarea rows={5} value={paste} onChange={e => setPaste(e.target.value)} placeholder={'Tasha 3\nMary Ann, 2\nDee x5'} />
                <button type="button" className="btn gold small" disabled={!paste.trim()} onClick={() => { setShow(s => ({ ...s, wheel: { ...s.wheel, entrants: parseEntrants(paste, s.wheel.entrants) } })); setPaste(''); toast('Added to the wheel', { kind: 'ok' }) }}>Add to the wheel</button>
              </details>
              {entrants.length > 0 && <button type="button" className="link-btn danger-text" onClick={() => { if (confirm('Clear everyone off the wheel?')) setShow(s => ({ ...s, wheel: { entrants: [], spin: null } })) }}>Start a new wheel (clears everyone)</button>}
            </div>
          )}

          {show.game === 'number' && (
            <div className="card stack">
              <h2>Number range</h2>
              <p className="muted small">Ask everyone to comment a number. Draw one, and the closest comment wins. Great for free giveaways with no slots.</p>
              <div className="row2">
                <label>From<input type="number" inputMode="numeric" value={show.number.min} onChange={e => setShow(s => ({ ...s, number: { ...s.number, min: Math.floor(Number(e.target.value) || 0) } }))} /></label>
                <label>To<input type="number" inputMode="numeric" value={show.number.max} onChange={e => setShow(s => ({ ...s, number: { ...s.number, max: Math.floor(Number(e.target.value) || 0) } }))} /></label>
              </div>
              <div className="chips">{[[1, 10], [1, 50], [1, 100], [1, 500]].map(([a, b]) => <button key={b} type="button" className={`chip ${show.number.min === a && show.number.max === b ? 'on' : ''}`} onClick={() => setShow(s => ({ ...s, number: { ...s.number, min: a, max: b } }))}>{a} to {b}</button>)}</div>
            </div>
          )}

          {show.game === 'countdown' && (
            <div className="card stack">
              <h2>Countdown</h2>
              <label>Message on screen<input value={cd.message} maxLength={60} onChange={e => setShow(s => ({ ...s, countdown: { ...s.countdown, message: e.target.value } }))} /></label>
              <div className="chips">{['Comment ENTER to get in!', 'Last call for slots!', 'Flash sale ends in…', 'Last call to join the wheel!'].map(m => <button key={m} type="button" className={`chip ${cd.message === m ? 'on' : ''}`} onClick={() => setShow(s => ({ ...s, countdown: { ...s.countdown, message: m } }))}>{m}</button>)}</div>
              <span className="eyebrow">How long</span>
              <div className="chips">{[30, 60, 120, 300, 600].map(sec => <button key={sec} type="button" className={`chip ${cd.seconds === sec ? 'on' : ''}`} disabled={running} onClick={() => resetTimer(sec)}>{sec < 60 ? `${sec} sec` : `${sec / 60} min`}</button>)}</div>
              <div className="row-gap">
                <button type="button" className="btn ghost" onClick={() => addTime(30)}>+30 seconds</button>
                <button type="button" className="btn ghost" onClick={() => resetTimer()}>Reset</button>
              </div>
            </div>
          )}

          {show.game === 'boxes' && (
            <div className="card stack">
              <h2>Mystery boxes</h2>
              <p className="muted small">Write the prizes, one per line. We shuffle them into the boxes in secret. A buyer calls a number, you tap that box, and it opens on screen. Only you can see what's inside before it opens.</p>
              <label>Prizes<textarea rows={5} value={show.boxes.prizes} onChange={e => setShow(s => ({ ...s, boxes: { ...s.boxes, prizes: e.target.value, deck: [] } }))} /></label>
              <span className="eyebrow">How many boxes</span>
              <div className="chips">{[4, 6, 9, 12, 16].map(n => <button key={n} type="button" className={`chip ${show.boxes.count === n ? 'on' : ''}`} onClick={() => newBoxes(n)}>{n}</button>)}</div>
              <p className="muted small">More boxes than prizes? The extra boxes get your last prize line, so end the list with "Try again" or a small treat.</p>
            </div>
          )}

          <form className="card stack" onSubmit={sendWinner}>
            <h2>Announce a winner</h2>
            <p className="muted small">Pops a big "We have a winner!" banner with confetti for 30 seconds. Use it for the closest number, a box prize, or the first comment.</p>
            <div className="row2">
              <label>Winner's name<input value={announce.name} onChange={e => setAnnounce(a => ({ ...a, name: e.target.value }))} placeholder="Keisha M." /></label>
              <label>Note (optional)<input value={announce.detail} onChange={e => setAnnounce(a => ({ ...a, detail: e.target.value }))} placeholder={show.prize ? `Wins ${show.prize}` : 'Wins a free bag!'} /></label>
            </div>
            <button className="btn primary" type="submit" disabled={!announce.name.trim()}>🎉 Show the winner</button>
          </form>

          <div className="card stack">
            <div className="row-between">
              <h2>On your live</h2>
              <button type="button" className={`gw-switch ${show.visible ? 'on' : ''}`} role="switch" aria-checked={show.visible} onClick={() => setShow(s => ({ ...s, visible: !s.visible }))}>
                <span /> {show.visible ? 'Showing on stream' : 'Hidden from stream'}
              </button>
            </div>
            <div className="row-gap">
              <span className="muted small">Pop up in the</span>
              <div className="seg">{(['middle', 'corner'] as const).map(p => <button key={p} type="button" className={show.spot === p ? 'on' : ''} onClick={() => setShow(s => ({ ...s, spot: p }))}>{p === 'middle' ? 'Middle' : 'Top corner'}</button>)}</div>
            </div>
            <ol className="plain-steps">
              <li><b>Sharing your screen or holding up a tablet?</b> Tap <b>Full screen</b>. Everything gets big and bright, and the spin button stays at the bottom.</li>
              <li><b>Streaming with OBS, Streamlabs or Prism?</b> Add your overlay link once (below). The giveaway pops up on your video whenever "Showing on stream" is on.</li>
            </ol>
            {overlayUrl ? (
              <div className="stack tight-gap">
                <div className="key-row"><span className="key-label">Overlay link</span><code className="key-value">{overlayUrl}</code><button type="button" className="btn gold small" onClick={() => copy(overlayUrl, 'Overlay link')}>Copy</button></div>
                <div className="key-row"><span className="key-label">Giveaway only</span><code className="key-value">{overlayUrl}/giveaway</code><button type="button" className="btn ghost small" onClick={() => copy(`${overlayUrl}/giveaway`, 'Giveaway link')}>Copy</button></div>
                <p className="muted small">The first link also shows your product card, so if it's already in your app you're done. In Prism, add the <b>Giveaway only</b> link as a second Web widget and stretch it over the whole screen. In OBS or Streamlabs, add a Browser source at 1280 × 720. Keep these links private.</p>
              </div>
            ) : <p className="muted small">Your overlay link shows up here once you're signed in and online.</p>}
            {synced === false && <p className="gw-note">Stream popups need a one-time setup step from your admin (database update 015). Full screen works right now.</p>}
          </div>

          <div className="card stack">
            <div className="row-between">
              <h2>Today's winners</h2>
              {winners.length > 0 && <div className="row-gap">
                <button type="button" className="btn ghost small" onClick={() => copy(winners.map(w => `${when(w.at)}  ${w.name}  (${w.game}${w.prize ? `, ${w.prize}` : ''})`).join('\n'), 'Winners list')}>Copy list</button>
                <button type="button" className="link-btn" onClick={() => { if (confirm('Clear the winners list on this device?')) { setWinners([]); saveWinners([]) } }}>Clear</button>
              </div>}
            </div>
            {winners.length ? (
              <ul className="gw-winners">{winners.slice(0, 20).map((w, i) => <li key={`${w.at}-${i}`}><span className="muted small">{when(w.at)}</span><b>{w.name}</b><span className="muted small">{w.game}{w.prize ? ` · ${w.prize}` : ''}</span></li>)}</ul>
            ) : <p className="muted small">Winners land here automatically so you can message them and ship their prize.</p>}
          </div>
        </div>
      </div>

      {full && (
        <div className="gw-fullscreen" ref={fullRef}>
          <GiveawayStage show={view} variant="full" sound={sound} onSpin={show.game === 'wheel' && !busy && entrants.length ? () => spinNow() : undefined} onOpenBox={show.game === 'boxes' ? openBox : undefined} />
          <div className="gw-full-bar">
            {mainAction(true)}
            {show.game === 'wheel' && spinWinner && !busy && <button type="button" className="btn glass" onClick={() => spinNow(spinWinner.id)}>Take winner off, spin again</button>}
            <button type="button" className="btn glass" onClick={() => setFull(false)}>Exit full screen</button>
          </div>
        </div>
      )}
    </div>
  )
}
