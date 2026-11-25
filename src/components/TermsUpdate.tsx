import { useState } from 'react'
import { TERMS_VERSION } from '../lib/profile'
import { useSession } from '../lib/session'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'

/**
 * Shown once to existing members when the Terms change in an important way. They must agree
 * before using the App again; the agreement is saved with the version and the time.
 */
export default function TermsUpdate() {
  const { session, refreshProfile } = useSession()
  const toast = useToast()
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)

  async function accept() {
    if (!session) return
    setBusy(true)
    const { error } = await supabase.from('profiles').update({ terms_version: TERMS_VERSION, terms_accepted_at: new Date().toISOString() }).eq('user_id', session.user.id)
    setBusy(false)
    if (error) return toast(error.message, { kind: 'bad' })
    await refreshProfile()
  }

  return (
    <div className="gate-backdrop" role="dialog" aria-modal="true" aria-labelledby="terms-update-title">
      <div className="gate-panel">
        <div className="gate-scroll">
          <span className="gate-crown" aria-hidden="true">👑</span>
          <span className="eyebrow">Terms of Use update</span>
          <h2 id="terms-update-title">We updated our Terms</h2>
          <div className="gate-intro">
            <p>Please read what changed, then agree to keep using the app.</p>
          </div>
          <ul className="gate-sub">
            <li><b>Your giveaways are yours.</b> You set the prize, the rules and the winner, and you deliver the prize. You follow Facebook's rules and the law, and never charge for a chance to win.</li>
            <li><b>You're responsible for how you use the app.</b> We aren't responsible for a seller's giveaway that goes wrong or for misuse of the tools.</li>
            <li><b>We stand with buyers.</b> If a buyer or winner is cheated, we'll pull the records the app holds to support their refund.</li>
            <li><b>Who owns what.</b> The app, Nova, the names and the lessons belong to LaVerne Quarles, Dynamic Dazzle Bargain Basement. Your own items, photos and customers stay yours.</li>
          </ul>
          <p className="muted small" style={{ textAlign: 'center' }}>Read the full <a href="#/terms" target="_blank" rel="noreferrer">Terms of Use</a> and <a href="#/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.</p>
        </div>
        <div className="gate-actions">
          <label className="check-row">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
            <span>I agree to the updated Terms of Use and Privacy Policy, including that I run my own giveaways and am responsible for them and for how I use the App.</span>
          </label>
          <button className="btn gold big" disabled={!agree || busy} onClick={accept}>{busy ? 'Saving…' : 'I agree'}</button>
          <button className="link-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </div>
    </div>
  )
}
