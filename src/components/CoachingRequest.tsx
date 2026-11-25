import { useState } from 'react'
import Sheet from './Sheet'
import Icon from './Icon'
import { useSession } from '../lib/session'
import { useSendRequest } from '../lib/requests'

/* Book free 1:1 coaching in a pop-up form. Sending it puts the request on the Queen's Host desk,
   with an alert on her Home screen. No email app opens. */

const HELP_WITH = ['Printing tags and labels', 'My scanner', 'Setting up my stock', 'Shelves and bins', 'Going live', 'The comment bot', 'Orders and shipping', 'Something else']

export default function CoachingRequest({ when: startWhen, onClose }: { when?: 'Daytime' | 'Evening'; onClose: () => void }) {
  const { profile, shop, session } = useSession()
  const send = useSendRequest()
  const [name, setName] = useState(profile?.display_name || shop?.name || '')
  const [email, setEmail] = useState(profile?.email || session?.user.email || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [when, setWhen] = useState<'Daytime' | 'Evening'>(startWhen ?? 'Daytime')
  const [picks, setPicks] = useState<string[]>([])
  const [details, setDetails] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)
  const toggle = (t: string) => setPicks(p => (p.includes(t) ? p.filter(x => x !== t) : [...p, t]))
  const ready = name.trim() && (picks.length > 0 || details.trim())

  async function go() {
    if (!ready) return
    setBusy(true); setErr('')
    const e = await send({ kind: 'coaching', name: name.trim(), email: email.trim() || null, phone: phone.trim() || null, best_time: when, hours: null,
      topics: picks.join(', ') || null, details: details.trim() || picks.join(', ') })
    setBusy(false)
    if (e) setErr(e); else setSent(true)
  }

  return (
    <Sheet open onClose={onClose} title={sent ? 'Request sent!' : 'Book 1:1 coaching'}>
      {sent ? (
        <div className="stack">
          <div className="pop-banner tone-emerald"><small>✓ Sent to the team</small><b>We've got you</b>
            <span>Your request is with LaVerne and the Dynamic Dazzle team. They'll reach out{email ? ` at ${email}` : ''}{phone ? ` or ${phone}` : ''} to set a {when.toLowerCase()} time. Coaching is free.</span></div>
          <p className="muted">While you wait, the Help desk quick fixes and the free live classes on the University home answer a lot of questions.</p>
          <button type="button" className="btn gold big" onClick={onClose}>Done</button>
        </div>
      ) : (
        <div className="stack class-form">
          <div className="pop-banner"><small>✦ Free · with the Dynamic Dazzle team</small><b>1:1 coaching</b><span>Tell us what you need. We'll reach out to set a time.</span></div>
          <fieldset><legend>What do you need help with?</legend>
            <div className="class-chips">{HELP_WITH.map(t => <button key={t} type="button" aria-pressed={picks.includes(t)} className={`class-chip${picks.includes(t) ? ' on' : ''}`} onClick={() => toggle(t)}><b>{picks.includes(t) ? '✓ ' : ''}{t}</b></button>)}</div>
          </fieldset>
          <label>Tell us a little more (optional)<textarea rows={3} value={details} onChange={e => setDetails(e.target.value)} placeholder="My printer prints blank labels since yesterday…" /></label>
          <fieldset><legend>Best time for you</legend>
            <div className="class-chips">{(['Daytime', 'Evening'] as const).map(w => <button key={w} type="button" aria-pressed={when === w} className={`class-chip${when === w ? ' on' : ''}`} onClick={() => setWhen(w)}><b>{w}</b></button>)}</div>
          </fieldset>
          <label>Your name<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></label>
          <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
          <label>Phone (optional, for a call or text)<input type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" /></label>
          {err && <p className="danger-text">{err}</p>}
          <button type="button" className="btn gold big" disabled={busy || !ready} onClick={go}><Icon name="upload" size={18} />{busy ? 'Sending…' : 'Send my request'}</button>
          {!ready && <p className="muted small">Pick what you need help with (or write it), then send.</p>}
        </div>
      )}
    </Sheet>
  )
}
