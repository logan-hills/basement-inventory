import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import GiveawayStage from '../components/GiveawayStage'
import { clockShift, type PublicShow } from '../lib/giveaway'

type Featured = { live_number: string; name?: string; label?: string; price?: number | null; photo?: string | null; at?: string }
type State = { featured: Featured | null; title: string; seller: string; status: string; ends_at: string } | null

/**
 * The on-stream product card, plus giveaway popups (wheel, lucky number, countdown, mystery boxes).
 * /overlay/<token> shows both; /overlay/<token>/giveaway shows only the giveaway (for a full-screen Prism widget). Added once to Prism (Web widget), OBS or Streamlabs (Browser source)
 * as a web overlay. Transparent everywhere except the card at the bottom.
 */
export default function Overlay() {
  const { token = '', part } = useParams()
  const onlyGiveaway = part === 'giveaway'
  const [state, setState] = useState<State>(null)
  const [gift, setGift] = useState<{ show: PublicShow; shift: number } | null>(null)

  useEffect(() => {
    const prev = document.body.style.background
    document.documentElement.classList.add('overlay-mode')
    document.body.style.background = 'transparent'
    return () => { document.body.style.background = prev; document.documentElement.classList.remove('overlay-mode') }
  }, [])

  useEffect(() => {
    let alive = true
    async function tick() {
      const [card, g] = await Promise.all([
        onlyGiveaway ? Promise.resolve({ data: null }) : supabase.rpc('overlay_state', { p_token: token }),
        supabase.rpc('giveaway_state', { p_token: token }),
      ])
      if (!alive) return
      setState((card.data as State) ?? null)
      const show = (g.data as PublicShow | null) ?? null
      // Keep the clock difference steady once known, so a spin never jumps mid-turn.
      setGift(prev => show ? { show, shift: prev && Math.abs(prev.shift - clockShift(show, Date.now())) < 1500 ? prev.shift : clockShift(show, Date.now()) } : null)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => { alive = false; clearInterval(t) }
  }, [token, onlyGiveaway])

  const f = onlyGiveaway ? null : state?.featured
  const g = gift?.show?.visible ? gift : null
  return (
    <>
      {g && (
        <div className={`overlay-gift spot-${g.show.spot === 'corner' ? 'corner' : 'middle'}`}>
          <GiveawayStage show={g.show} shift={g.shift} variant="overlay" />
        </div>
      )}
      {f?.live_number ? <ProductCard f={f} /> : <div className="overlay-root" />}
    </>
  )
}

function ProductCard({ f }: { f: Featured }) {
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
