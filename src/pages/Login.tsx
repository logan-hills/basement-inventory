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
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + window.location.pathname } })
    setBusy(false)
    if (error) setMsg(error.message)
    else if (mode === 'up') setMsg('Check your email to confirm your account, then sign in.')
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
