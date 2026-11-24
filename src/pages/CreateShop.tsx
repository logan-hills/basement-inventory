import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { joinTeam } from '../lib/team'

/** A new seller names their shop, or a new team member joins their boss's shop with an invite code. */
export default function CreateShop() {
  const { refreshShop } = useSession()
  const [mode, setMode] = useState<'shop' | 'team'>('shop')
  const [name, setName] = useState('Dynamic Dazzle Bargain Basement')
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg('')
    try {
      if (mode === 'team') await joinTeam(code)
      else { const { error } = await supabase.from('shops').insert({ name }); if (error) throw error }
      await refreshShop()
    } catch (err: any) { setMsg(err.message) }
    setBusy(false)
  }

  return (
    <div className="center-page">
      <form className="card auth" onSubmit={submit}>
        {mode === 'shop' ? <>
          <h1>Name your shop</h1>
          <p className="muted">You can add team members later in Settings.</p>
          <label>Shop name<input required value={name} onChange={e => setName(e.target.value)} /></label>
          <button className="btn primary big" disabled={busy}>Create shop</button>
          <button type="button" className="link-btn" onClick={() => { setMode('team'); setMsg('') }}>I'm joining a team (I have an invite code)</button>
        </> : <>
          <h1>Join your team</h1>
          <p className="muted">Type the code the shop owner sent you. It looks like ABCD-EFGH.</p>
          <label>Invite code<input required autoFocus autoCapitalize="characters" autoComplete="off" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="ABCD-EFGH" className="mono" /></label>
          <button className="btn primary big" disabled={busy}>Join the team</button>
          <button type="button" className="link-btn" onClick={() => { setMode('shop'); setMsg('') }}>I'm starting my own shop instead</button>
        </>}
        {msg && <p className="note">{msg}</p>}
      </form>
    </div>
  )
}
