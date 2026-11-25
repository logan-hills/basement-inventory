import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import { useToast } from '../lib/toast'
import { saveProfile, uploadAvatar, TERMS_VERSION, type Profile } from '../lib/profile'

type Mode = 'signup' | 'edit'

function Toggle({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={`${on ? 'Hide' : 'Show'} my ${label}`} className={`show-toggle ${on ? 'on' : ''}`} onClick={() => set(!on)}>
      {on ? 'Shown' : 'Hidden'}
    </button>
  )
}

/** Seller profile: name (always on the calendar), photo, bio, email, phone, each with Show/Hide. */
export default function ProfileForm({ userId, email: loginEmail, initial, mode, onSaved }: { userId: string; email: string; initial: Profile | null; mode: Mode; onSaved: () => void }) {
  const toast = useToast()
  const [name, setName] = useState(initial?.display_name ?? '')
  const [photo, setPhoto] = useState<string | null>(initial?.photo_path ?? null)
  const [bio, setBio] = useState(initial?.bio ?? '')
  const [email, setEmail] = useState(initial?.email ?? (loginEmail.includes('privaterelay.appleid.com') ? '' : loginEmail))
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [show, setShow] = useState({ photo: initial?.show_photo ?? true, bio: initial?.show_bio ?? true, email: initial?.show_email ?? false, phone: initial?.show_phone ?? false })
  const [type, setType] = useState<'stream' | 'seller'>(initial?.account_type ?? 'stream')
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)

  async function pickPhoto(f: File | undefined) {
    if (!f) return
    setBusy(true)
    try { setPhoto(await uploadAvatar(userId, f)) } catch (e: any) { toast(e.message, { kind: 'bad' }) }
    setBusy(false)
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    if (mode === 'signup' && !agree) return toast('Please agree to the Terms and Privacy Policy', { kind: 'bad' })
    setBusy(true)
    try {
      await saveProfile({
        user_id: userId, display_name: name.trim(), photo_path: photo, bio: bio.trim() || null, email: email.trim() || null, phone: phone.trim() || null,
        show_photo: show.photo, show_bio: show.bio, show_email: show.email, show_phone: show.phone, account_type: type,
        ...(mode === 'signup' ? { terms_version: TERMS_VERSION, terms_accepted_at: new Date().toISOString() } : {}),
      })
      toast(mode === 'signup' ? 'Welcome! Your profile is ready.' : 'Profile saved', { kind: 'ok' })
      onSaved()
    } catch (e: any) { toast(e.message, { kind: 'bad' }) }
    setBusy(false)
  }

  return (
    <form className="stack" onSubmit={save}>
      {mode === 'signup' && (
        <div className="stack tight-gap">
          <span className="eyebrow">How will you use the app?</span>
          <div className="type-pick">
            <button type="button" className={`type-card ${type === 'stream' ? 'on' : ''}`} onClick={() => setType('stream')}>
              <b>Just stream</b><span>Free. Book a 1.5-hour slot on the shared Page and go live.</span>
            </button>
            <button type="button" className={`type-card ${type === 'seller' ? 'on' : ''}`} onClick={() => setType('seller')}>
              <b>Full seller app</b><span>Inventory, labels, live prep, picking and shipping, plus streaming.</span>
            </button>
          </div>
          <span className="muted small">Joining someone's shop as a team member? Pick Full seller app, then type your invite code on the next screen.</span>
        </div>
      )}

      <div className="profile-photo">
        <Avatar name={name || '?'} path={photo} size={84} />
        <div className="stack tight-gap">
          <label className="btn ghost small file-btn">{photo ? 'Change photo' : 'Add a photo'}<input type="file" accept="image/*" onChange={e => pickPhoto(e.target.files?.[0])} hidden /></label>
          {photo && <button type="button" className="link-btn" onClick={() => setPhoto(null)}>Remove photo</button>}
        </div>
        <Toggle on={show.photo} set={v => setShow(s => ({ ...s, photo: v }))} label="photo" />
      </div>

      <label>Name on the live calendar<input required maxLength={60} value={name} onChange={e => setName(e.target.value)} placeholder="Your name or shop name" /></label>
      <p className="muted small field-note">Always shown next to the hours you book, so everyone knows whose live it is.</p>

      <div className="field-with-toggle">
        <label>Bio<textarea rows={3} maxLength={600} value={bio} onChange={e => setBio(e.target.value)} placeholder="What you sell, your live style, your shop vibe…" /></label>
        <Toggle on={show.bio} set={v => setShow(s => ({ ...s, bio: v }))} label="bio" />
      </div>
      <div className="field-with-toggle">
        <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
        <Toggle on={show.email} set={v => setShow(s => ({ ...s, email: v }))} label="email" />
      </div>
      <div className="field-with-toggle">
        <label>Phone<input type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" /></label>
        <Toggle on={show.phone} set={v => setShow(s => ({ ...s, phone: v }))} label="phone" />
      </div>
      <p className="muted small">"Shown" means other sellers in the app can see it. "Hidden" keeps it just for you and the app team.</p>

      {mode === 'edit' && (
        <label>Account
          <select value={type} onChange={e => setType(e.target.value as 'stream' | 'seller')}>
            <option value="stream">Just stream (free)</option>
            <option value="seller">Full seller app</option>
          </select>
        </label>
      )}

      {mode === 'signup' && (
        <label className="check-row">
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
          <span>I am 18 or older and agree to the <Link to="/terms" target="_blank">Terms of Use</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link>, including that my calendar name is shown to other members.</span>
        </label>
      )}
      <button className="btn primary big" disabled={busy || (mode === 'signup' && !agree)}>{busy ? 'Saving…' : mode === 'signup' ? 'Finish sign-up' : 'Save profile'}</button>
    </form>
  )
}
