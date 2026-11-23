import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { Ring } from '../components/Charts'
import { LESSONS, TRACKS } from '../lessons'
import { useLessonProgress } from '../lib/lessonProgress'

const FIXES: { q: string; steps: string[] }[] = [
  { q: 'Scanner does nothing', steps: ['Click into the scan box so it has a blinking cursor.', 'Test the scanner in a notes app. If no text appears there, re-pair or replug it.', 'Make sure the scanner adds Enter after each scan (check its manual for the "Enter suffix" barcode).'] },
  { q: 'iPhone camera won\'t open', steps: ['Open the app in Safari.', 'When asked, tap Allow for the camera.', 'If you tapped Don\'t Allow: Settings → Safari → Camera → Allow, then reload.'] },
  { q: '"Not found" when scanning a tag', steps: ['The tag may belong to a deleted item, or the barcode is smudged.', 'Type the code under the barcode instead.', 'Reprint the tag from the item page.'] },
  { q: 'Upload says columns are missing', steps: ['Use the dropdowns under Column matches to point each field to the right column.', 'Or download the template and copy your data into it.'] },
  { q: 'Labels print in the wrong spot', steps: ['Set Scale to 100% (Actual size).', 'Set Margins to None.', 'Turn off Headers and footers.'] },
  { q: 'Something looks out of date', steps: ['Pull down to refresh on a phone, or reload the page on a computer.'] },
  { q: 'Install it like an app', steps: ['iPhone: Safari → Share → Add to Home Screen.', 'Android: Chrome menu → Install app.'] },
]

export default function Lessons() {
  const { progress } = useLessonProgress()
  const [q, setQ] = useState('')
  const done = LESSONS.filter(l => progress[l.id]?.completed_at).length
  const next = LESSONS.find(l => !progress[l.id]?.completed_at)
  const s = q.trim().toLowerCase()
  const match = useMemo(() => s ? LESSONS.filter(l => JSON.stringify(l).toLowerCase().includes(s)) : LESSONS, [s])
  const fixes = s ? FIXES.filter(f => [f.q, ...f.steps].join(' ').toLowerCase().includes(s)) : FIXES

  return (
    <div className="stack wide-gap">
      <div className="lesson-hero">
        <div className="stack tight-gap grow">
          <span className="script">Learn it once, run it like a boss</span>
          <h1>Dazzle Academy</h1>
          <p className="muted">Short, hands-on lessons for every part of the app. Each one shows you how and why, lets you practice, and ends with a quick check. Your progress saves as you go.</p>
          {next
            ? <Link className="btn gold self-start" to={`/lessons/${next.id}`}><Icon name="sparkle" size={16} /> {done ? 'Keep going' : 'Start here'}: {next.title}</Link>
            : <span className="chip on self-start">Every lesson done. You're certified! 👑</span>}
        </div>
        <Ring value={done / LESSONS.length} label="Lessons done"><small>{done} of {LESSONS.length} done</small></Ring>
      </div>

      <input type="search" className="search" placeholder="Search lessons, like &quot;reprint&quot; or &quot;scanner&quot;" value={q} onChange={e => setQ(e.target.value)} />

      {TRACKS.map(t => {
        const list = match.filter(l => l.track === t)
        if (!list.length) return null
        return (
          <section key={t} className="stack">
            <h2 className="section-title">{t}</h2>
            <div className="lesson-grid">
              {list.map(l => {
                const p = progress[l.id]
                const pct = p?.completed_at ? 1 : p ? Math.min(1, p.step / l.slides.length) : 0
                return (
                  <Link key={l.id} to={`/lessons/${l.id}`} className={`lesson-card${p?.completed_at ? ' done' : ''}`}>
                    <span className="lesson-ico"><Icon name={l.icon} size={22} /></span>
                    <b>{l.title}</b>
                    <span className="muted small">{l.why}</span>
                    <div className="lesson-meta">
                      <span className="small muted">{l.minutes} min · {l.slides.filter(x => x.kind !== 'learn').length} practice</span>
                      {p?.completed_at ? <span className="chip-mini vip">✓ {p.score ?? 100}%</span> : p ? <span className="chip-mini">In progress</span> : null}
                    </div>
                    <span className="lesson-bar"><i style={{ width: `${pct * 100}%` }} /></span>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}

      {fixes.length > 0 && (
        <section className="stack">
          <h2 className="section-title">Quick fixes</h2>
          {fixes.map(f => (
            <details key={f.q} className="lesson card" open={!!s}>
              <summary>{f.q}</summary>
              <ol>{f.steps.map((x, i) => <li key={i}>{x}</li>)}</ol>
            </details>
          ))}
        </section>
      )}
      {!match.length && !fixes.length && <p className="muted">Nothing matches. Try a simpler word.</p>}
    </div>
  )
}
