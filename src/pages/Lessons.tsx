import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { Ring } from '../components/Charts'
import { LESSONS, COURSES, TRACKS, SCHOOLS, TRACK_TONE, INTERACTIVE, lessonMinutes, type Track } from '../lessons'
import { useLessonProgress } from '../lib/lessonProgress'
import { useSession } from '../lib/session'
import { hasAcademy } from '../lib/plan'
import { NovaSays, type NovaMood } from '../components/Nova'
import AcademyLocked from '../components/AcademyLocked'
import CourseBag from '../components/CourseBag'
import novaLaverne from '../assets/nova-laverne.webp'

const NOVA_TIPS: [NovaMood, string][] = [
  ['wink', 'Hey love, I\'m Nova, Head of Dazzle University. Tap me any time for a tip.'],
  ['happy', 'Fifteen minutes a day in here beats one long cram session. Little and often!'],
  ['wow', 'New here? Start with Onboarding: launch your shop in 30 days. It sets up everything else.'],
  ['think', 'Stuck on a screen in the app? Search it up top. I probably have a lesson for it.'],
  ['cheer', 'Every business course ends with a certificate. Print it and hang it up, boss.'],
  ['happy', 'Train your helpers here too. Each person\'s progress saves on their own sign-in.'],
  ['wow', 'The Operations courses teach what the big warehouses do. Most small sellers never learn this. You will.'],
]


const FIXES: { q: string; steps: string[] }[] = [
  { q: 'Scanner does nothing', steps: ['Click into the scan box so it has a blinking cursor.', 'Test the scanner in a notes app. If no text appears there, re-pair or replug it.', 'Make sure the scanner adds Enter after each scan (check its manual for the "Enter suffix" barcode).'] },
  { q: 'iPhone camera won\'t open', steps: ['Open the app in Safari.', 'When asked, tap Allow for the camera.', 'If you tapped Don\'t Allow: Settings → Safari → Camera → Allow, then reload.'] },
  { q: '"Not found" when scanning a tag', steps: ['The tag may belong to a deleted item, or the barcode is smudged.', 'Type the code under the barcode instead.', 'Reprint the tag from the item page.'] },
  { q: 'Upload says columns are missing', steps: ['Use the dropdowns under Column matches to point each field to the right column.', 'Or download the template and copy your data into it.'] },
  { q: 'Labels print in the wrong spot', steps: ['Set Scale to 100% (Actual size).', 'Set Margins to None.', 'Turn off Headers and footers.', 'On a 2×1 thermal roll: set Paper size to 2 x 1 in and let the printer re-learn the label size.'] },
  { q: 'Thermal tags come out blank', steps: ['The roll is upside down. Flip it so the shiny coated side faces the print head.', 'Then print one test tag.'] },
  { q: 'Something looks out of date', steps: ['Pull down to refresh on a phone, or reload the page on a computer.'] },
  { q: 'Install it like an app', steps: ['iPhone: Safari → Share → Add to Home Screen.', 'Android: Chrome menu → Install app.'] },
]

export default function Lessons() {
  const { progress } = useLessonProgress()
  const { shop } = useSession()
  const [q, setQ] = useState('')
  const [tip, setTip] = useState(0)
  const [track, setTrack] = useState<Track | 'All'>('All')
  const done = LESSONS.filter(l => progress[l.id]?.completed_at).length
  const coursesDone = COURSES.filter(l => progress[l.id]?.completed_at).length
  const next = LESSONS.find(l => !progress[l.id]?.completed_at)
  const s = q.trim().toLowerCase()
  const match = useMemo(() => s ? LESSONS.filter(l => JSON.stringify(l).toLowerCase().includes(s)) : LESSONS, [s])
  const courseMatch = s ? COURSES.filter(l => JSON.stringify(l).toLowerCase().includes(s)) : COURSES
  if (!hasAcademy(shop?.plan)) return <AcademyLocked />
  const fixes = s ? FIXES.filter(f => [f.q, ...f.steps].join(' ').toLowerCase().includes(s)) : FIXES
  const shownTracks = TRACKS.filter(t => track === 'All' || t === track)

  return (
    <div className="uni stack wide-gap">
      <header className="uni-hero">
        <div className="uni-hero-copy">
          <span className="uni-kicker">Est. by Dynamic Dazzle · Taught by Nova</span>
          <h1 className="uni-title">Dazzle <em>University</em></h1>
          <p className="uni-lead">Learn the app, then learn the business. Hands-on lessons, courses built on what the big brands and warehouses do, workbooks, and a certificate for every course.</p>
          <div className="row-gap">
            {next
              ? <Link className="btn uni-cta" to={`/lessons/${next.id}`}><Icon name="sparkle" size={18} /> {done ? 'Keep going' : 'Start here'}: {next.title}</Link>
              : <span className="uni-chip">Every app lesson done. You're certified!</span>}
            <a className="btn uni-ghost" href="#courses">Business courses</a>
          </div>
          <div className="uni-stats">
            <span><b>{done}</b> of {LESSONS.length}<small>app lessons</small></span>
            <span><b>{coursesDone}</b> of {COURSES.length}<small>courses</small></span>
            <span><b>{Math.round([...LESSONS, ...COURSES].reduce((a, l) => a + lessonMinutes(l), 0) / 60)}</b><small>hours of training</small></span>
          </div>
        </div>
        <figure className="uni-portrait">
          <span className="uni-arch"><img src={novaLaverne} alt="Nova the handbag with LaVerne, Queen of $2 Tuesday" /></span>
          <span className="uni-ring"><Ring value={(done + coursesDone) / (LESSONS.length + COURSES.length)} label="University progress"><small>complete</small></Ring></span>
        </figure>
      </header>

      <NovaSays mood={NOVA_TIPS[tip][0]} key={tip} onNovaClick={() => setTip(t => (t + 1) % NOVA_TIPS.length)}>{NOVA_TIPS[tip][1]}</NovaSays>

      <input type="search" className="search uni-search" placeholder="Search lessons, like &quot;reprint&quot;, &quot;scanner&quot; or &quot;slotting&quot;" value={q} onChange={e => setQ(e.target.value)} />

      {courseMatch.length > 0 && (
        <section className="stack wide-gap" id="courses">
          <div className="uni-section-head">
            <span className="uni-eyebrow">The schools</span>
            <h2 className="uni-h2">Business courses</h2>
            <p className="uni-sub">In-depth courses grounded in trusted sources like the SBA, the FTC, ASQ, Georgia Tech and the platforms themselves. Each one ends with a workbook and a certificate.</p>
          </div>
          {SCHOOLS.map(sc => {
            const list = courseMatch.filter(l => l.school === sc.id)
            if (!list.length) return null
            return (
              <div key={sc.id} className={`uni-school tone-${sc.tone}`}>
                <div className="uni-school-head">
                  <span className="uni-school-dot" aria-hidden="true" />
                  <div><h3>{sc.id}</h3><p>{sc.blurb}</p></div>
                  <span className="uni-school-count">{list.filter(l => progress[l.id]?.completed_at).length}/{list.length} done</span>
                </div>
                <div className="bag-row">
                  {list.map(l => {
                    const p = progress[l.id]
                    return <CourseBag key={l.id} to={`/lessons/${l.id}`} n={COURSES.indexOf(l)} title={l.title} minutes={lessonMinutes(l)} chapters={l.slides.filter(x => x.chapter).length} why={l.why}
                      tone={sc.tone} status={p?.completed_at ? 'done' : p ? 'started' : undefined} />
                  })}
                </div>
              </div>
            )
          })}
        </section>
      )}

      <section className="stack">
        <div className="uni-section-head">
          <span className="uni-eyebrow">How to use the app</span>
          <h2 className="uni-h2">App lessons</h2>
        </div>
        <div className="uni-tabs" role="tablist" aria-label="Lesson tracks">
          {(['All', ...TRACKS] as const).map(t => {
            const n = t === 'All' ? match.length : match.filter(l => l.track === t).length
            return <button key={t} role="tab" aria-selected={track === t} className={`uni-tab${track === t ? ' on' : ''}${t !== 'All' ? ` tone-${TRACK_TONE[t]}` : ''}`} onClick={() => setTrack(t)}>{t}<small>{n}</small></button>
          })}
        </div>
      </section>

      {shownTracks.map(t => {
        const list = match.filter(l => l.track === t)
        if (!list.length) return null
        const tDone = list.filter(l => progress[l.id]?.completed_at).length
        return (
          <section key={t} className={`stack uni-track tone-${TRACK_TONE[t]}`}>
            <div className="uni-track-head"><span className="uni-track-name">{t}</span><span className="uni-track-count">{tDone} of {list.length} done</span></div>
            <div className="uni-grid">
              {list.map(l => {
                const p = progress[l.id]
                const pct = p?.completed_at ? 1 : p ? Math.min(1, p.step / l.slides.length) : 0
                return (
                  <Link key={l.id} to={`/lessons/${l.id}`} className={`uni-card${p?.completed_at ? ' done' : ''}`}>
                    <span className="uni-card-ico"><Icon name={l.icon} size={24} /></span>
                    <b>{l.title}</b>
                    <span className="uni-card-why">{l.why}</span>
                    <div className="uni-card-meta">
                      <span>{lessonMinutes(l)} min · {l.slides.filter(x => INTERACTIVE.includes(x.kind)).length} activities</span>
                      {p?.completed_at ? <span className="uni-pill done">✓ {p.score ?? 100}%</span> : p ? <span className="uni-pill">In progress</span> : null}
                    </div>
                    <span className="uni-bar"><i style={{ width: `${pct * 100}%` }} /></span>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}

      {fixes.length > 0 && (
        <section className="stack">
          <div className="uni-section-head"><span className="uni-eyebrow">Help desk</span><h2 className="uni-h2">Quick fixes</h2></div>
          <div className="uni-fixes">
            {fixes.map(f => (
              <details key={f.q} className="uni-fix" open={!!s}>
                <summary>{f.q}</summary>
                <ol>{f.steps.map((x, i) => <li key={i}>{x}</li>)}</ol>
              </details>
            ))}
          </div>
        </section>
      )}
      {!match.length && !courseMatch.length && !fixes.length && <p className="uni-sub">Nothing matches. Try a simpler word.</p>}
    </div>
  )
}
