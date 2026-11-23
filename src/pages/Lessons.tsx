import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { Ring } from '../components/Charts'
import { LESSONS, COURSES, TRACKS, SCHOOLS, TRACK_TONE, INTERACTIVE, lessonMinutes, type Track, type Lesson } from '../lessons'
import { ASOF, STATE_SALES_TAX, OTHER_STATES, OFFICIAL_LINKS, TAX_DATES, IRS_NUMBERS, NOT_ADVICE } from '../lessons/resources'
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
  ['wow', 'New here? Start with Onboarding, Module 1. It sets up everything else.'],
  ['think', 'Need your state\'s sales tax ID or the tax due dates? The Resource desk has them.'],
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

const MODULE_BLURB: Record<Track, string> = {
  'Start here': 'Set up your shop, your profile and your team, then take the grand tour.',
  Stock: 'Receive, tag, print and shelve every piece so you can find it in seconds.',
  Sell: 'Plan lives, book the shared calendar and let the comment bot take the orders.',
  'Pack and ship': 'Pick, pack and ship every order right the first time.',
  Grow: 'Know your buyers and read your numbers.',
  Business: '',
}

const SECTIONS = [
  { id: 'u-onboarding', label: 'Onboarding', icon: 'sparkle' },
  { id: 'u-business', label: 'Business center', icon: 'trend' },
  { id: 'u-resources', label: 'Resource desk', icon: 'lessons' },
  { id: 'u-help', label: 'Help desk', icon: 'settings' },
]

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const hit = (l: Lesson, s: string) => JSON.stringify(l).toLowerCase().includes(s)

export default function Lessons() {
  const { progress } = useLessonProgress()
  const { shop } = useSession()
  const [q, setQ] = useState('')
  const [tip, setTip] = useState(0)
  const [st, setSt] = useState('Pennsylvania')
  const done = LESSONS.filter(l => progress[l.id]?.completed_at).length
  const coursesDone = COURSES.filter(l => progress[l.id]?.completed_at).length
  const next = LESSONS.find(l => !progress[l.id]?.completed_at)
  const s = q.trim().toLowerCase()
  const match = useMemo(() => s ? LESSONS.filter(l => hit(l, s)) : LESSONS, [s])
  const courseMatch = useMemo(() => s ? COURSES.filter(l => hit(l, s)) : COURSES, [s])
  if (!hasAcademy(shop?.plan)) return <AcademyLocked />
  const fixes = s ? FIXES.filter(f => [f.q, ...f.steps].join(' ').toLowerCase().includes(s)) : FIXES
  const state = STATE_SALES_TAX.find(x => x.state === st) ?? STATE_SALES_TAX[0]
  const isDone = (l: Lesson) => !!progress[l.id]?.completed_at

  return (
    <div className="uni stack wide-gap">
      <header className="uni-hero">
        <div className="uni-hero-copy">
          <span className="uni-kicker">Est. by Dynamic Dazzle · Taught by Nova</span>
          <h1 className="uni-title">Dazzle <em>University</em></h1>
          <p className="uni-lead">Your business resource center. Start with onboarding to learn the app, then grow in the Business center with in-depth courses built on research from Wharton, Harvard, MIT, McKinsey, the SBA and the IRS.</p>
          <div className="row-gap">
            {next
              ? <Link className="btn uni-cta" to={`/lessons/${next.id}`}><Icon name="sparkle" size={18} /> {done ? 'Keep going' : 'Start onboarding'}: {next.title}</Link>
              : <span className="uni-chip">Onboarding complete. You're certified!</span>}
            <button type="button" className="btn uni-ghost" onClick={() => go('u-business')}>Business center</button>
          </div>
          <div className="uni-stats">
            <span><b>{done}</b> of {LESSONS.length}<small>onboarding lessons</small></span>
            <span><b>{coursesDone}</b> of {COURSES.length}<small>courses</small></span>
            <span><b>{Math.round([...LESSONS, ...COURSES].reduce((a, l) => a + lessonMinutes(l), 0) / 60)}</b><small>hours of training</small></span>
          </div>
        </div>
        <figure className="uni-portrait">
          <span className="uni-arch"><img src={novaLaverne} alt="Nova the handbag with LaVerne, Queen of $2 Tuesday" /></span>
          <span className="uni-ring"><Ring value={(done + coursesDone) / (LESSONS.length + COURSES.length)} label="University progress"><small>complete</small></Ring></span>
        </figure>
      </header>

      <nav className="uni-nav" aria-label="University sections">
        {SECTIONS.map((x, i) => (
          <button key={x.id} type="button" className="uni-nav-btn" onClick={() => go(x.id)}>
            <span className="uni-nav-no">{i + 1}</span><Icon name={x.icon} size={18} /><span>{x.label}</span>
          </button>
        ))}
      </nav>

      <NovaSays mood={NOVA_TIPS[tip][0]} key={tip} onNovaClick={() => setTip(t => (t + 1) % NOVA_TIPS.length)}>{NOVA_TIPS[tip][1]}</NovaSays>

      <input type="search" className="search uni-search" placeholder="Search everything, like &quot;sales tax&quot;, &quot;scanner&quot; or &quot;Canva&quot;" value={q} onChange={e => setQ(e.target.value)} />

      {match.length > 0 && (
        <section className="stack wide-gap uni-part" id="u-onboarding">
          <div className="uni-section-head">
            <span className="uni-eyebrow">Part one · Onboarding</span>
            <h2 className="uni-h2">Learn the app, module by module</h2>
            <p className="uni-sub">Five modules take you from your first sign-in to your first shipped order. Each lesson is hands-on, with practice taps on the real screens.</p>
            <span className="uni-bar big" aria-label={`${done} of ${LESSONS.length} onboarding lessons done`}><i style={{ width: `${(done / LESSONS.length) * 100}%` }} /></span>
          </div>
          <div className="uni-modules">
            {TRACKS.map((t, mi) => {
              const list = match.filter(l => l.track === t)
              if (!list.length) return null
              const mDone = list.filter(isDone).length
              const mins = list.reduce((a, l) => a + lessonMinutes(l), 0)
              return (
                <article key={t} className={`uni-module tone-${TRACK_TONE[t]}${mDone === list.length ? ' done' : ''}`}>
                  <header className="uni-module-head">
                    <span className="uni-module-no"><small>Module</small>{mi + 1}</span>
                    <div>
                      <h3>{t}</h3>
                      <p>{MODULE_BLURB[t]}</p>
                      <span className="uni-module-meta">{list.length} lessons · {mins} min · {mDone === list.length ? '✓ Complete' : `${mDone} done`}</span>
                    </div>
                  </header>
                  <span className="uni-bar"><i style={{ width: `${(mDone / list.length) * 100}%` }} /></span>
                  <ol className="uni-syllabus">
                    {list.map((l, i) => {
                      const p = progress[l.id]
                      return (
                        <li key={l.id}>
                          <Link to={`/lessons/${l.id}`} className={`uni-lesson${p?.completed_at ? ' done' : ''}`}>
                            <span className="uni-lesson-no">{mi + 1}.{i + 1}</span>
                            <span className="uni-lesson-ico"><Icon name={l.icon} size={20} /></span>
                            <span className="uni-lesson-text"><b>{l.title}</b><small>{lessonMinutes(l)} min · {l.slides.filter(x => INTERACTIVE.includes(x.kind)).length} activities</small></span>
                            {p?.completed_at ? <span className="uni-pill done">✓ {p.score ?? 100}%</span> : p ? <span className="uni-pill">In progress</span> : <span className="uni-lesson-go" aria-hidden="true">›</span>}
                          </Link>
                        </li>
                      )
                    })}
                  </ol>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {courseMatch.length > 0 && (
        <section className="stack wide-gap uni-part" id="u-business">
          <div className="uni-section-head">
            <span className="uni-eyebrow">Part two · Business center</span>
            <h2 className="uni-h2">Nine schools to run it like a CEO</h2>
            <p className="uni-sub">{COURSES.length} in-depth courses, 15 to 20 minutes each, grounded in Wharton, Harvard Business School, MIT Sloan, McKinsey, Georgia Tech, the SBA, the IRS and the FTC. Each one ends with a workbook and a certificate.</p>
          </div>
          <div className="uni-school-tiles">
            {SCHOOLS.map(sc => {
              const list = courseMatch.filter(l => l.school === sc.id)
              if (!list.length) return null
              return (
                <button key={sc.id} type="button" className={`uni-school-tile tone-${sc.tone}`} onClick={() => go(`school-${sc.tone}`)}>
                  <span className="uni-school-tile-ico"><Icon name={sc.icon} size={22} /></span>
                  <b>{sc.id}</b>
                  <small>{list.length} course{list.length === 1 ? '' : 's'} · {list.filter(isDone).length} done</small>
                </button>
              )
            })}
          </div>
          {SCHOOLS.map(sc => {
            const list = courseMatch.filter(l => l.school === sc.id)
            if (!list.length) return null
            return (
              <div key={sc.id} id={`school-${sc.tone}`} className={`uni-school tone-${sc.tone}`}>
                <div className="uni-school-head">
                  <span className="uni-school-dot" aria-hidden="true" />
                  <div><h3>{sc.id}</h3><p>{sc.blurb}</p></div>
                  <span className="uni-school-count">{list.filter(isDone).length}/{list.length} done</span>
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

      {!s && (
        <section className="stack wide-gap uni-part" id="u-resources">
          <div className="uni-section-head">
            <span className="uni-eyebrow">Part three · Resource desk</span>
            <h2 className="uni-h2">Keep these close</h2>
            <p className="uni-sub">Quick answers and official links for making it official and staying ready for tax time. Facts as of {ASOF}.</p>
          </div>
          <p className="uni-note"><Icon name="lessons" size={18} /> {NOT_ADVICE}</p>
          <div className="uni-desk">
            <div className="uni-desk-card tone-gold">
              <h3>Your sales tax ID</h3>
              <label className="uni-desk-label">Pick your state
                <select value={st} onChange={e => setSt(e.target.value)}>
                  {STATE_SALES_TAX.map(x => <option key={x.state}>{x.state}</option>)}
                </select>
              </label>
              <div className="uni-desk-answer">
                <b>{state.name}</b>
                <span>{state.agency}</span>
                {state.note && <small>{state.note}</small>}
              </div>
              <p className="uni-desk-small">{OTHER_STATES}</p>
              <Link className="uni-desk-link" to="/lessons/salestax">Take the sales tax course ›</Link>
            </div>
            <div className="uni-desk-card tone-cobalt">
              <h3>Bookmark these</h3>
              <ul className="uni-desk-links">
                {OFFICIAL_LINKS.map(x => <li key={x.url}><a href={x.url} target="_blank" rel="noopener noreferrer"><b>{x.label} ↗</b><small>{x.what}</small></a></li>)}
              </ul>
            </div>
            <div className="uni-desk-card tone-emerald">
              <h3>Tax calendar</h3>
              <ul className="uni-desk-dates">
                {TAX_DATES.map(x => <li key={x.when}><b>{x.when}</b><span>{x.what}</span></li>)}
              </ul>
              <p className="uni-desk-small">When a date lands on a weekend or holiday, it moves to the next business day.</p>
              <Link className="uni-desk-link" to="/lessons/taxes">Take the tax time course ›</Link>
            </div>
            <div className="uni-desk-card tone-fuchsia">
              <h3>Numbers to know</h3>
              <dl className="uni-desk-nums">
                {IRS_NUMBERS.map(x => <div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}
              </dl>
            </div>
          </div>
        </section>
      )}

      {fixes.length > 0 && (
        <section className="stack uni-part" id="u-help">
          <div className="uni-section-head"><span className="uni-eyebrow">Part four · Help desk</span><h2 className="uni-h2">Quick fixes</h2></div>
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
