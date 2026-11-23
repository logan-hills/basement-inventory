import ProfileForm from '../components/ProfileForm'
import { Crown } from '../App'
import { useSession } from '../lib/session'
import { supabase } from '../lib/supabase'

/** One-time step after the first sign-in: profile, account type, and agreeing to the Terms. */
export default function FinishSignup() {
  const { session, profile, refreshProfile } = useSession()
  if (!session) return null
  return (
    <div className="center-page">
      <div className="card auth wide">
        <div className="auth-brand"><span className="gold"><Crown size={40} /></span><h1>Welcome!</h1><span className="eyebrow">Set up your seller profile</span></div>
        <ProfileForm userId={session.user.id} email={session.user.email ?? ''} initial={profile ?? null} mode="signup" onSaved={refreshProfile} />
        <button className="link-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    </div>
  )
}
