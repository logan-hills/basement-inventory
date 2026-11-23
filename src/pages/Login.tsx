import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { Crown } from '../App'

export default function Login() {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg('')
    const { error } = mode === 'in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + window.location.pathname } })
    setBusy(false)
    if (error) setMsg(error.message)
    else if (mode === 'up') setMsg('Check your email to confirm your account, then sign in.')
  }

  return (
    <div className="center-page">
      <form className="card auth" onSubmit={submit}>
        <div className="auth-brand"><span className="gold"><Crown size={44} /></span><h1>Dynamic Dazzle</h1><span className="eyebrow">Basement Warehouse</span></div>
        <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
        <label>Password<input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} /></label>
        <button className="btn primary big" disabled={busy}>{mode === 'in' ? 'Sign in' : 'Create account'}</button>
        {msg && <p className="note">{msg}</p>}
        <button type="button" className="link-btn" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setMsg('') }}>
          {mode === 'in' ? 'New here? Create an account' : 'Have an account? Sign in'}
        </button>
      </form>
    </div>
  )
}
