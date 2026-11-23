import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { friendly, setRecovering } from '../lib/recovery'
import { SignInShell } from './Login'

/** Last step of "Forgot password?": the code checked out, now they choose a new password. */
export default function NewPassword() {
  const [password, setPassword] = useState('')
  const [again, setAgain] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function save(e: FormEvent) {
    e.preventDefault()
    if (password !== again) { setMsg('Those two passwords don\'t match yet.'); return }
    setBusy(true); setMsg('')
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) setMsg(friendly(error.message))
    else setRecovering(false)
  }

  async function cancel() {
    setRecovering(false)
    await supabase.auth.signOut()
  }

  return (
    <SignInShell>
      <form className="auth-card" onSubmit={save}>
        <div className="auth-head">
          <h2>Choose a new password</h2>
          <p className="muted">You're verified. Pick something you'll remember, at least 8 characters.</p>
        </div>
        <label>New password<input type={show ? 'text' : 'password'} required minLength={8} value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" autoFocus /></label>
        <label>Type it again<input type={show ? 'text' : 'password'} required minLength={8} value={again} onChange={e => setAgain(e.target.value)} autoComplete="new-password" /></label>
        <label className="auth-show"><input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)} /> Show passwords</label>
        <button className="btn gold big" disabled={busy}>{busy ? 'Saving…' : 'Save and sign in'}</button>
        {msg && <p className="note" role="status">{msg}</p>}
        <button type="button" className="link-btn" onClick={cancel}>Cancel</button>
      </form>
    </SignInShell>
  )
}
