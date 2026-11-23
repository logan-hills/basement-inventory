import { Capacitor } from '@capacitor/core'
import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { friendly, setRecovering, smsAvailable, toE164 } from '../lib/recovery'
import { Crown } from '../App'

// In the iPhone app, email links must open the website (the app's own address only exists inside the app).
// Sign in with Apple needs Apple's native sign-in there, so the app shows email sign-in only for now.
const NATIVE = Capacitor.isNativePlatform()
const SITE_URL = 'https://logan-hills.github.io/basement-inventory/'
const HOME_URL = () => NATIVE ? SITE_URL : window.location.origin + window.location.pathname

const SPARKS = Array.from({ length: 14 }, (_, i) => i)

/** The sign-in look: a slow golden-hour glow behind one clean card. Also used by "Choose a new password". */
export function SignInShell({ children }: { children: ReactNode }) {
  return (
    <div className="signin">
      <div className="signin-bg" aria-hidden="true">
        <span className="signin-orb o1" /><span className="signin-orb o2" /><span className="signin-orb o3" />
        {SPARKS.map(i => <i key={i} className="signin-spark" style={{ ['--i' as string]: i } as CSSProperties} />)}
      </div>
      <div className="signin-wrap">
        <header className="signin-brand">
          <span className="auth-crown"><Crown size={30} /></span>
          <h1 className="signin-title">Dynamic <em>Dazzle</em></h1>
          <span className="signin-sub">Bargain Basement</span>
        </header>
        {children}
        <p className="signin-legal">By continuing you agree to our <a href="#/terms">Terms of Use</a> and <a href="#/privacy">Privacy Policy</a>.</p>
      </div>
    </div>
  )
}

type Mode = 'in' | 'up' | 'forgot' | 'code'

export default function Login() {
  const [mode, setMode] = useState<Mode>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  // Password reset
  const [via, setVia] = useState<'email' | 'text'>('email')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [sms, setSms] = useState(false)
  const [wait, setWait] = useState(0)

  useEffect(() => { smsAvailable().then(setSms) }, [])
  useEffect(() => { if (wait <= 0) return; const t = setTimeout(() => setWait(w => w - 1), 1000); return () => clearTimeout(t) }, [wait])

  function go(m: Mode) { setMode(m); setMsg(''); setCode('') }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg('')
    const { error } = mode === 'in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: HOME_URL() } })
    setBusy(false)
    if (error) setMsg(error.message.includes('Invalid login') ? 'That email and password don\'t match. Try again, or tap "Forgot password?"' : error.message)
    else if (mode === 'up') setMsg('Check your email to confirm your account, then sign in.')
  }

  async function sendCode(e?: FormEvent) {
    e?.preventDefault()
    setBusy(true); setMsg('')
    const { error } = via === 'email'
      ? await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: HOME_URL() })
      : await supabase.auth.signInWithOtp({ phone: toE164(phone), options: { shouldCreateUser: false } })
    setBusy(false)
    if (error) { setMsg(friendly(error.message)); return }
    setMode('code'); setCode(''); setWait(60)
  }

  async function checkCode(e: FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg('')
    // Keep the "Choose a new password" screen up once the code signs them in.
    setRecovering(true)
    const token = code.replace(/\D/g, '')
    const { error } = via === 'email'
      ? await supabase.auth.verifyOtp({ email: email.trim(), token, type: 'recovery' })
      : await supabase.auth.verifyOtp({ phone: toE164(phone), token, type: 'sms' })
    setBusy(false)
    if (error) { setRecovering(false); setMsg(friendly(error.message)) }
  }

  async function apple() {
    setMsg('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: window.location.origin + window.location.pathname } })
    if (error) setMsg(error.message.includes('provider is not enabled') ? 'Sign in with Apple is not switched on yet. Use email for now.' : error.message)
  }

  const sentTo = via === 'email' ? email.trim() : phone.trim()

  return (
    <SignInShell>
      {(mode === 'in' || mode === 'up') && (
        <form className="auth-card" onSubmit={submit} key={mode}>
          <div className="auth-head">
            <h2>{mode === 'in' ? 'Welcome back' : 'Create your account'}</h2>
            <p className="muted">{mode === 'in' ? 'Sign in to your shop.' : 'Start selling smarter today.'}</p>
          </div>
          <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" inputMode="email" /></label>
          <label>
            <span className="row-between">Password{mode === 'in' && <button type="button" className="link-btn auth-forgot" onClick={() => go('forgot')}>Forgot password?</button>}</span>
            <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} />
          </label>
          <button className="btn gold big" disabled={busy}>{busy ? 'One moment…' : mode === 'in' ? 'Sign in' : 'Create account'}</button>
          {!NATIVE && <>
            <div className="or-line"><span>or</span></div>
            <button type="button" className="btn apple big" onClick={apple}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.84.86-3.6 2.18-1.54 2.67-.39 6.62 1.1 8.79.73 1.06 1.6 2.25 2.73 2.2 1.1-.04 1.51-.7 2.84-.7 1.32 0 1.7.7 2.86.68 1.18-.02 1.93-1.07 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.33-3.5zM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.67-.92 2.66.97.08 1.96-.49 2.56-1.21z" /></svg>
              Sign in with Apple
            </button>
          </>}
          {msg && <p className="note" role="status">{msg}</p>}
          <button type="button" className="link-btn" onClick={() => go(mode === 'in' ? 'up' : 'in')}>
            {mode === 'in' ? 'New here? Create an account' : 'Have an account? Sign in'}
          </button>
        </form>
      )}

      {mode === 'forgot' && (
        <form className="auth-card" onSubmit={sendCode} key="forgot">
          <div className="auth-head">
            <h2>Reset your password</h2>
            <p className="muted">We'll send you a code. Type it in, then pick a new password.</p>
          </div>
          {sms && (
            <div className="seg auth-seg" role="tablist" aria-label="Send my code by">
              <button type="button" role="tab" aria-selected={via === 'email'} className={via === 'email' ? 'on' : ''} onClick={() => { setVia('email'); setMsg('') }}>Email me</button>
              <button type="button" role="tab" aria-selected={via === 'text'} className={via === 'text' ? 'on' : ''} onClick={() => { setVia('text'); setMsg('') }}>Text me</button>
            </div>
          )}
          {via === 'email'
            ? <label>Email on your account<input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" inputMode="email" autoFocus /></label>
            : <label>Mobile number<input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="(555) 123-4567" autoFocus /></label>}
          <button className="btn gold big" disabled={busy}>{busy ? 'Sending…' : 'Send my code'}</button>
          {msg && <p className="note" role="status">{msg}</p>}
          <button type="button" className="link-btn" onClick={() => go('in')}>Back to sign in</button>
        </form>
      )}

      {mode === 'code' && (
        <form className="auth-card" onSubmit={checkCode} key="code">
          <div className="auth-head">
            <h2>Check your {via === 'email' ? 'email' : 'texts'}</h2>
            <p className="muted">If <b>{sentTo}</b> has an account, a code is on its way. It can take a minute{via === 'email' ? ', so peek in spam too. You can type the code, or just tap the reset link in the email' : ''}.</p>
          </div>
          <label>Your code
            <input className="auth-code" required value={code} onChange={e => setCode(e.target.value.replace(/[^\d ]/g, ''))}
              inputMode="numeric" autoComplete="one-time-code" pattern="[\d ]{6,12}" maxLength={12} placeholder="123456" autoFocus />
          </label>
          <button className="btn gold big" disabled={busy || code.replace(/\D/g, '').length < 6}>{busy ? 'Checking…' : 'Continue'}</button>
          {msg && <p className="note" role="status">{msg}</p>}
          <div className="auth-links">
            <button type="button" className="link-btn" disabled={wait > 0 || busy} onClick={() => sendCode()}>{wait > 0 ? `Send a new code in ${wait}s` : 'Send a new code'}</button>
            <button type="button" className="link-btn" onClick={() => go('forgot')}>Change {via === 'email' ? 'email' : 'number'}</button>
          </div>
        </form>
      )}
    </SignInShell>
  )
}
