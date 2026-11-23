import { Capacitor } from '@capacitor/core'
import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { Crown } from '../App'
import { artFor } from '../components/CategoryRail'
import { Nova } from '../components/Nova'
import novaLaverne from '../assets/nova-laverne.webp'

const LINES = [
  'Where it goes down in the basement.',
  'Affordable prices. Great quality. Good vibes only.',
  'Inventory, lives, picking and shipping in one place.',
  'Built for sellers who run it like a boss.',
]
// In the iPhone app, email links must open the website (the app's own address only exists inside the app).
// Sign in with Apple needs Apple's native sign-in there, so the app shows email sign-in only for now.
const NATIVE = Capacitor.isNativePlatform()
const SITE_URL = 'https://logan-hills.github.io/basement-inventory/'

const SHOWCASE = ['Jewelry', 'Bags', 'Apparel', 'Shoes', 'Accessories', 'Home']

export default function Login() {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [line, setLine] = useState(0)

  useEffect(() => { const t = setInterval(() => setLine(l => (l + 1) % LINES.length), 3600); return () => clearInterval(t) }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg('')
    const { error } = mode === 'in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: NATIVE ? SITE_URL : window.location.origin + window.location.pathname } })
    setBusy(false)
    if (error) setMsg(error.message)
    else if (mode === 'up') setMsg('Check your email to confirm your account, then sign in.')
  }

  async function apple() {
    setMsg('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: window.location.origin + window.location.pathname } })
    if (error) setMsg(error.message.includes('provider is not enabled') ? 'Sign in with Apple is not switched on yet. Use email for now.' : error.message)
  }

  return (
    <div className="welcome">
      <section className="welcome-show" aria-hidden="false">
        <div className="welcome-glow" />
        <div className="welcome-orbit" aria-hidden="true">
          {SHOWCASE.map((c, i) => {
            const a = artFor(c, i)
            return <span key={c} className={`orbit-gem tone-${a.tone}`} style={{ ['--i' as string]: i } as CSSProperties}><svg viewBox="0 0 100 100">{a.draw}</svg></span>
          })}
        </div>
        <div className="welcome-copy">
          <span className="cert-kicker">Est. by LaVerne Quarles</span>
          <h1 className="welcome-title">Dynamic <em>Dazzle</em></h1>
          <span className="welcome-script">Bargain Basement</span>
          <p className="welcome-line" key={line}>{LINES[line]}</p>
        </div>
        <figure className="founder-note">
          <img className="founder-art" src={novaLaverne} alt="LaVerne with Nova the handbag" />
          <p>Every bargain party starts with her. This app was built around how LaVerne runs the basement, so every seller can run it like she does.</p>
          <figcaption><b>LaVerne Quarles</b><span>Founder · Queen of $2 Tuesday</span></figcaption>
        </figure>
      </section>

      <section className="welcome-form">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-head">
            <span className="auth-crown"><Crown size={34} /></span>
            <h2>{mode === 'in' ? 'Welcome back, Queen' : 'Join the basement'}</h2>
            <p className="muted">{mode === 'in' ? 'Sign in to your shop.' : 'Create your seller account.'}</p>
          </div>
          <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
          <label>Password<input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} /></label>
          <button className="btn gold big" disabled={busy}>{busy ? 'One moment…' : mode === 'in' ? 'Sign in' : 'Create account'}</button>
          {!NATIVE && <>
          <div className="or-line"><span>or</span></div>
          <button type="button" className="btn apple big" onClick={apple}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.84.86-3.6 2.18-1.54 2.67-.39 6.62 1.1 8.79.73 1.06 1.6 2.25 2.73 2.2 1.1-.04 1.51-.7 2.84-.7 1.32 0 1.7.7 2.86.68 1.18-.02 1.93-1.07 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.33-3.5zM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.67-.92 2.66.97.08 1.96-.49 2.56-1.21z" /></svg>
            Sign in with Apple
          </button>
          </>}
          <p className="muted small center-text">By continuing you agree to our <a href="#/terms">Terms of Use</a> and <a href="#/privacy">Privacy Policy</a>.</p>
          {msg && <p className="note">{msg}</p>}
          <button type="button" className="link-btn" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setMsg('') }}>
            {mode === 'in' ? 'New here? Create an account' : 'Have an account? Sign in'}
          </button>
          <div className="auth-nova"><Nova mood="wink" size={54} /><span>I'm Nova. I'll show you around once you're in.</span></div>
        </form>
      </section>
    </div>
  )
}
