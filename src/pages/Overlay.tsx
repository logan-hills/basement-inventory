import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type Featured = { live_number: string; name?: string; label?: string; price?: number | null; photo?: string | null; at?: string }
type State = { featured: Featured | null; title: string; seller: string; status: string; ends_at: string } | null

/**
 * The on-stream product card. Added once to Prism (Web widget), OBS or Streamlabs (Browser source)
 * as a web overlay. Transparent everywhere except the card at the bottom.
 */
export default function Overlay() {
  const { token = '' } = useParams()
  const [state, setState] = useState<State>(null)

  useEffect(() => {
    const prev = document.body.style.background
    document.documentElement.classList.add('overlay-mode')
    document.body.style.background = 'transparent'
    return () => { document.body.style.background = prev; document.documentElement.classList.remove('overlay-mode') }
  }, [])

  useEffect(() => {
    let alive = true
    async function tick() {
      const { data } = await supabase.rpc('overlay_state', { p_token: token })
      if (alive) setState((data as State) ?? null)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => { alive = false; clearInterval(t) }
  }, [token])

  const f = state?.featured
  if (!f?.live_number) return <div className="overlay-root" />
  return (
    <div className="overlay-root">
      <div className="overlay-card" key={f.at ?? f.live_number}>
        {f.photo ? <img className="overlay-photo" src={f.photo} alt="" /> : <div className="overlay-photo blank">👜</div>}
        <div className="overlay-info">
          <span className="overlay-tag">LIVE #</span>
          <b className="overlay-num">{f.live_number}</b>
          {(f.name || f.label) && <span className="overlay-name">{[f.name, f.label && f.label !== 'Default' ? f.label : ''].filter(Boolean).join(' · ')}</span>}
        </div>
        {f.price != null && <div className="overlay-price">${Number(f.price).toFixed(Number(f.price) % 1 ? 2 : 0)}</div>}
      </div>
    </div>
  )
}
