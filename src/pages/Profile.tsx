import { Link } from 'react-router-dom'
import ProfileForm from '../components/ProfileForm'
import PhoneForReset from '../components/PhoneForReset'
import { useSession } from '../lib/session'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { session, profile, refreshProfile, refreshShop } = useSession()
  if (!session || !profile) return null
  return (
    <div className="stack wide-gap narrow-page">
      <div className="page-head"><div><span className="eyebrow">Account</span><h1>My profile</h1></div></div>
      <div className="card">
        <ProfileForm userId={session.user.id} email={session.user.email ?? ''} initial={profile} mode="edit" onSaved={() => { refreshProfile(); refreshShop() }} />
      </div>
      <PhoneForReset current={session.user.phone ? '+' + session.user.phone : undefined} />
      <p className="muted small"><Link to="/terms">Terms of Use</Link> · <Link to="/privacy">Privacy Policy</Link> · <button className="link-btn" onClick={() => supabase.auth.signOut()}>Sign out</button></p>
    </div>
  )
}
