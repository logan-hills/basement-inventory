import { Link } from 'react-router-dom'
import { LEGAL_UPDATED, PRIVACY, TERMS } from '../lib/legal'

/** Terms of Use / Privacy Policy. Readable without signing in. */
export default function Legal({ which }: { which: 'terms' | 'privacy' }) {
  const doc = which === 'terms' ? TERMS : PRIVACY
  return (
    <div className="legal stack">
      <span className="eyebrow">Dazzle Warehouse · updated {LEGAL_UPDATED}</span>
      <h1>{doc.title}</h1>
      <p>{doc.intro}</p>
      {doc.sections.map(s => (
        <section key={s.h} className="stack tight-gap">
          <h2>{s.h}</h2>
          {s.p.map((t, i) => <p key={i}>{t}</p>)}
        </section>
      ))}
      <p className="muted small">See also: {which === 'terms' ? <Link to="/privacy">Privacy Policy</Link> : <Link to="/terms">Terms of Use</Link>} · <Link to="/">Back to the app</Link></p>
    </div>
  )
}
