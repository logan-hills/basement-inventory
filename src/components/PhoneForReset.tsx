import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { friendly, smsAvailable, toE164 } from '../lib/recovery'

/** Link a mobile number to the account so "Forgot password? → Text me" works. Shows only once texting is switched on. */
export default function PhoneForReset({ current }: { current?: string }) {
  const [on, setOn] = useState(false)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [linked, setLinked] = useState(current ?? '')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  useEffect(() => { smsAvailable().then(setOn) }, [])
  if (!on) return null

  async function send() {
    setBusy(true); setMsg('')
    const { error } = await supabase.auth.updateUser({ phone: toE164(phone) })
    setBusy(false)
    if (error) setMsg(friendly(error.message)); else setSent(true)
  }
  async function verify() {
    setBusy(true); setMsg('')
    const { error } = await supabase.auth.verifyOtp({ phone: toE164(phone), token: code.replace(/\D/g, ''), type: 'phone_change' })
    setBusy(false)
    if (error) { setMsg(friendly(error.message)); return }
    setLinked(toE164(phone)); setSent(false); setPhone(''); setCode(''); setMsg('Done! You can now get reset codes by text.')
  }

  return (
    <div className="card stack">
      <h2>Password reset by text</h2>
      <p className="muted small">{linked ? <>Reset codes can be texted to <b>{linked}</b>. Add a different number below to change it.</> : 'Add your mobile number so you can get a code by text if you ever forget your password.'}</p>
      {!sent
        ? <div className="row-gap"><input type="tel" inputMode="tel" autoComplete="tel" placeholder="(555) 123-4567" value={phone} onChange={e => setPhone(e.target.value)} /><button className="btn gold" disabled={busy || phone.replace(/\D/g, '').length < 10} onClick={send}>Text me a code</button></div>
        : <div className="row-gap"><input inputMode="numeric" autoComplete="one-time-code" placeholder="Code from your text" value={code} onChange={e => setCode(e.target.value)} /><button className="btn gold" disabled={busy || code.replace(/\D/g, '').length < 6} onClick={verify}>Confirm</button></div>}
      {msg && <p className="note">{msg}</p>}
    </div>
  )
}
