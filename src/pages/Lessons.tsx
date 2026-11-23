import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { Ring } from '../components/Charts'
import { LESSONS, COURSES, TRACKS, INTERACTIVE, lessonMinutes } from '../lessons'
import { useLessonProgress } from '../lib/lessonProgress'
import { useSession } from '../lib/session'
import { hasAcademy } from '../lib/plan'
import { NovaSays, type NovaMood } from '../components/Nova'
import AcademyLocked from '../components/AcademyLocked'
import Tome from '../components/Tome'
import novaLaverne from '../assets/nova-laverne.webp'

const NOVA_TIPS: [NovaMood, string][] = [
  ['wink', 'Hey love, I\'m Nova, your Academy guide. Tap me any time for a tip.'],
  ['happy', 'Ten minutes a day in here beats one long cram session. Little and often!'],
  ['wow', 'Did you know? Sellers who post a poster two days ahead usually see more people show up.'],
  ['think', 'Stuck on a screen in the app? Search it up top. I probably have a lesson for it.'],
  ['cheer', 'Every course ends with a certificate. Print it and hang it up, boss.'],
  ['happy', 'Train your helpers here too. Each person\'s progress saves on their own sign-in.'],
]

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
  const { shop } = useSession()
  const [q, setQ] = useState('')
  const [tip, setTip] = useState(0)
  const done = LESSONS.filter(l => progress[l.id]?.completed_at).length
  const next = LESSONS.find(l => !progress[l.id]?.completed_at)
  const s = q.trim().toLowerCase()
  const match = useMemo(() => s ? LESSONS.filter(l => JSON.stringify(l).toLowerCase().includes(s)) : LESSONS, [s])
  const courseMatch = s ? COURSES.filter(l => JSON.stringify(l).toLowerCase().includes(s)) : COURSES
  const coursesDone = COURSES.filter(l => progress[l.id]?.completed_at).length
  if (!hasAcademy(shop?.plan)) return <AcademyLocked />
  const fixes = s ? FIXES.filter(f => [f.q, ...f.steps].join(' ').toLowerCase().includes(s)) : FIXES

  return (
    <div className="stack wide-gap">
      <div className="lesson-hero">
        <div className="stack tight-gap grow">
          <span className="script">Learn it once, run it like a boss</span>
          <h1 className="academy-title">Dazzle <em>Academy</em></h1>
          <p className="muted">Hands-on lessons for every part of the app, plus business courses to grow your brand. Practice as you go, earn certificates, and pick up right where you left off.</p>
          <div className="row-gap">
            {next
              ? <Link className="btn gold" to={`/lessons/${next.id}`}><Icon name="sparkle" size={16} /> {done ? 'Keep going' : 'Start here'}: {next.title}</Link>
              : <span className="chip on">Every app lesson done. You're certified!</span>}
            <a className="btn ghost" href="#courses">Business courses</a>
          </div>
          <div className="academy-stats">
            <span><b>{done}</b>/{LESSONS.length} app lessons</span>
            <span><b>{coursesDone}</b>/{COURSES.length} courses</span>
          </div>
        </div>
        <figure className="academy-portrait">
          <img src={novaLaverne} alt="Nova the handbag with LaVerne, Queen of $2 Tuesday" />
          <figcaption><b>Nova</b> &amp; <b>LaVerne</b><span>Bringing the Bargains to Life</span></figcaption>
          <span className="portrait-ring"><Ring value={(done + coursesDone) / (LESSONS.length + COURSES.length)} label="Academy progress"><small>complete</small></Ring></span>
        </figure>
      </div>

      <NovaSays mood={NOVA_TIPS[tip][0]} key={tip} onNovaClick={() => setTip(t => (t + 1) % NOVA_TIPS.length)}>{NOVA_TIPS[tip][1]}</NovaSays>

      <input type="search" className="search" placeholder="Search lessons, like &quot;reprint&quot; or &quot;scanner&quot;" value={q} onChange={e => setQ(e.target.value)} />

      {courseMatch.length > 0 && (
        <section className="stack" id="courses">
          <div className="row-between"><div><span className="eyebrow">Taught by Nova</span><h2 className="section-title">Business courses</h2></div><span className="muted small">Workbooks · certificates</span></div>
          <div className="tome-shelf">
            {courseMatch.map((l, n) => {
              const p = progress[l.id]
              return <Tome key={l.id} to={`/lessons/${l.id}`} n={n} title={l.title} minutes={lessonMinutes(l)} chapters={l.slides.filter(x => x.chapter).length} why={l.why}
                tone={['garnet', 'emerald', 'onyx', 'violet', 'cognac', 'emerald', 'garnet'][n % 7]} status={p?.completed_at ? 'done' : p ? 'started' : undefined} />
            })}
          </div>
        </section>
      )}

      <h2 className="section-title">App lessons</h2>
      {TRACKS.map(t => {
        const list = match.filter(l => l.track === t)
        if (!list.length) return null
        return (
          <section key={t} className="stack">
            <span className="eyebrow">{t}</span>
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
                      <span className="small muted">{lessonMinutes(l)} min · {l.slides.filter(x => INTERACTIVE.includes(x.kind)).length} activities</span>
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
      {!match.length && !courseMatch.length && !fixes.length && <p className="muted">Nothing matches. Try a simpler word.</p>}
    </div>
  )
}
