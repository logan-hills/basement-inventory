import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'
import { DAZZLE_GUIDELINES, guidelinesText, guidelinesVersion } from '../lib/guidelines'

/**
 * The shared Page's rules. Shown every time the live calendar opens; the seller must tap
 * "I agree" to continue, and each agreement is saved with the server's date and time.
 */
export default function GuidelinesGate({ stageId, custom, onAgree, onDecline }: { stageId: string; custom: string | null; onAgree: () => void; onDecline: () => void }) {
  const toast = useToast()
  const [read, setRead] = useState(false)
  const [busy, setBusy] = useState(false)
  const g = DAZZLE_GUIDELINES
  const text = custom?.trim() ? custom : guidelinesText(g)

  async function agree() {
    setBusy(true)
    const { error } = await supabase.from('guideline_acceptances').insert({ stage_id: stageId, version: guidelinesVersion(text) })
    setBusy(false)
    // If the database isn't updated yet, still let them in, but say so.
    if (error && !error.message.includes('guideline_acceptances')) return toast(error.message, { kind: 'bad' })
    onAgree()
  }

  return (
    <div className="gate-backdrop" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="gate-panel">
        <div className="gate-scroll" ref={el => { if (el && el.scrollHeight <= el.clientHeight + 40) setTimeout(() => setRead(true)) }} onScroll={e => { const el = e.currentTarget; if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) setRead(true) }}>
          {custom?.trim() ? (
            <>
              <span className="gate-crown" aria-hidden="true">👑</span>
              <h2 id="gate-title">Seller guidelines</h2>
              <div className="gate-custom">{custom}</div>
            </>
          ) : (
            <>
              <span className="gate-crown" aria-hidden="true">👑</span>
              <span className="eyebrow">{g.title}</span>
              <h2 id="gate-title">{g.subtitle}</h2>
              <div className="gate-intro">{g.intro.map(l => <p key={l}>{l}</p>)}</div>
              {g.sections.map(sec => (
                <section key={sec.h} className="gate-sec">
                  <h3>{sec.h}</h3>
                  <ul>{sec.items.map(i => <li key={i}>{i}</li>)}</ul>
                  {sec.sub && <ul className="gate-sub">{sec.sub.map(i => <li key={i}>{i}</li>)}</ul>}
                  {sec.more && <ul>{sec.more.map(i => <li key={i}>{i}</li>)}</ul>}
                </section>
              ))}
              <div className="gate-closing">{g.closing.map(l => <p key={l}>{l}</p>)}</div>
            </>
          )}
          <p className="muted small">Breaking these guidelines can get your account revoked with no refund for the month or year you paid for. See the <Link to="/terms" target="_blank">Terms of Use</Link>.</p>
        </div>
        <div className="gate-actions">
          {!read && <span className="muted small">Scroll to the end to agree</span>}
          <button className="btn gold big" disabled={!read || busy} onClick={agree}>{busy ? 'Saving…' : 'I have read and agree'}</button>
          <button className="link-btn" onClick={onDecline}>Not now</button>
        </div>
      </div>
    </div>
  )
}
