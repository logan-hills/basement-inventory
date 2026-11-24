import { useState } from 'react'
import Icon from './Icon'

/** Reminds sellers that the camera on their phone or iPad is a free scanner. Hidden for good once they tap "Got it". */
export default function FreeCameraTip({ onUse }: { onUse: () => void }) {
  const [hidden, setHidden] = useState(() => { try { return localStorage.getItem('freeCamTip') === 'off' } catch { return false } })
  if (hidden) return null
  const hide = () => { setHidden(true); try { localStorage.setItem('freeCamTip', 'off') } catch { /* ignore */ } }
  return (
    <div className="free-cam" role="note">
      <span className="free-cam-ico" aria-hidden="true"><Icon name="scan" size={22} /></span>
      <div className="grow">
        <b>No scanner? Your camera is free.</b>
        <span>Your phone or iPad camera works as a scanner. Tap <b>Use camera</b>, then tap <b>Allow</b> when it asks.</span>
      </div>
      <div className="free-cam-actions">
        <button className="btn gold" onClick={onUse}>Use camera</button>
        <button className="link-btn" onClick={hide}>Got it</button>
      </div>
    </div>
  )
}
