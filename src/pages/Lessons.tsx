import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { Ring } from '../components/Charts'
import { LESSONS, COURSES, lessonById, TRACKS, SCHOOLS, TRACK_TONE, INTERACTIVE, lessonMinutes, lessonTone, type Track, type Lesson } from '../lessons'
import { ASOF, STATE_SALES_TAX, OTHER_STATES, OFFICIAL_LINKS, TAX_DATES, IRS_NUMBERS, NOT_ADVICE } from '../lessons/resources'
import { useLessonProgress } from '../lib/lessonProgress'
import { useSession } from '../lib/session'
import { hasAcademy } from '../lib/plan'
import { NovaSays, type NovaMood } from '../components/Nova'
import AcademyLocked from '../components/AcademyLocked'
import CourseBag from '../components/CourseBag'
import LessonTag from '../components/LessonTag'
import { CLASS_TZ, LIVE_CLASSES, ONE_ON_ONE, QUEEN_SESSION } from '../lessons/classes'
import { CONTACT } from '../lib/legal'
import novaLaverne from '../assets/nova-laverne.webp'

const NOVA_TIPS: [NovaMood, string][] = [
  ['wink', 'Hey love, I\'m Nova, Head of Dazzle University. Tap me any time for a tip.'],
  ['happy', 'Fifteen minutes a day in here beats one long cram session. Little and often!'],
  ['wow', 'New here? Start with Orientation, Module 1, and join a live class on Monday or Wednesday.'],
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

type Tab = 'home' | 'orientation' | 'classes' | 'business' | 'resources' | 'help'
/** The University's sub-pages. Home links to each one; each one has a way back home. */
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'University home', icon: 'dashboard' },
  { id: 'orientation', label: 'Orientation', icon: 'sparkle' },
  { id: 'classes', label: 'Live classes', icon: 'live' },
  { id: 'business', label: 'Business school', icon: 'trend' },
  { id: 'resources', label: 'Resource desk', icon: 'lessons' },
  { id: 'help', label: 'Help desk', icon: 'settings' },
]
/** First courses we suggest, in order, until each is finished. */
const STARTER_COURSES = ['strategy1', 'liveplan', 'official', 'retention', 'growth', 'finance']

const hit = (l: Lesson, s: string) => JSON.stringify(l).toLowerCase().includes(s)
const top = () => window.scrollTo({ top: 0, behavior: 'smooth' })

export default function Lessons() {
  const { progress } = useLessonProgress()
  const { shop } = useSession()
  const [params, setParams] = useSearchParams()
  const tab = (TABS.find(x => x.id === params.get('tab'))?.id ?? 'home') as Tab
  const school = SCHOOLS.find(x => x.tone === params.get('school'))
  const [openModule, setOpenModule] = useState<Track | null>(null)
  const [q, setQ] = useState('')
  const [tip, setTip] = useState(0)
  const [st, setSt] = useState('Pennsylvania')
  const s = q.trim().toLowerCase()
  const lessonHits = useMemo(() => (s ? LESSONS.filter(l => hit(l, s)) : []), [s])
  const courseHits = useMemo(() => (s ? COURSES.filter(l => hit(l, s)) : []), [s])
  if (!hasAcademy(shop?.plan)) return <AcademyLocked />

  const isDone = (l: Lesson) => !!progress[l.id]?.completed_at
  const started = (l: Lesson) => !!progress[l.id] && !progress[l.id]?.completed_at
  const done = LESSONS.filter(isDone).length
  const coursesDone = COURSES.filter(isDone).length
  const nextLesson = LESSONS.find(l => !isDone(l))
  const resume = LESSONS.find(started) ?? COURSES.find(started) ?? nextLesson ?? COURSES.find(l => !isDone(l))
  const starters = STARTER_COURSES.map(id => lessonById(id)).filter((l): l is Lesson => !!l && !isDone(l)).slice(0, 3)
  const currentModule = TRACKS.find(t => LESSONS.some(l => l.track === t && !isDone(l))) ?? TRACKS[0]
  const shownModule = openModule ?? currentModule
  const fixes = s ? FIXES.filter(f => [f.q, ...f.steps].join(' ').toLowerCase().includes(s)) : FIXES
  const state = STATE_SALES_TAX.find(x => x.state === st) ?? STATE_SALES_TAX[0]
  const go = (next: Tab, extra?: Record<string, string>) => { setQ(''); setParams({ tab: next, ...extra }); top() }
  const pct = (a: number, b: number) => `${Math.round((a / Math.max(1, b)) * 100)}%`
  const kindOf = (l: Lesson) => (l.kind === 'course' ? `Business course · ${l.school}` : `Orientation · ${l.track}`)

  const bag = (l: Lesson) => {
    const p = progress[l.id]
    const tone = SCHOOLS.find(x => x.id === l.school)?.tone ?? 'gold'
    return <CourseBag key={l.id} to={`/lessons/${l.id}`} n={COURSES.indexOf(l)} title={l.title} minutes={lessonMinutes(l)} chapters={l.slides.filter(x => x.chapter).length} why={l.why}
      tone={tone} status={p?.completed_at ? 'done' : p ? 'started' : undefined} />
  }
  const row = (l: Lesson) => {
    const p = progress[l.id]
    return (
      <Link key={l.id} to={`/lessons/${l.id}`} className={`uni-row tone-${lessonTone(l)}${p?.completed_at ? ' done' : ''}`}>
        <span className="uni-row-ico"><Icon name={l.icon} size={22} /></span>
        <span className="uni-row-text"><b>{l.title}</b><small>{kindOf(l)} · {lessonMinutes(l)} min</small></span>
        {p?.completed_at ? <span className="uni-pill done">✓ Done</span> : p ? <span className="uni-pill">In progress</span> : <span className="uni-row-go" aria-hidden="true">›</span>}
      </Link>
    )
  }

  return (
    <div className="uni stack wide-gap">
      <header className="uni-bar-head">
        <button type="button" className="uni-brand" onClick={() => go('home')} aria-label="Dazzle University home">
          <span className="uni-brand-mark">DU</span>
          <span><b>Dazzle <em>University</em></b><small>Taught by Nova · Est. by Dynamic Dazzle</small></span>
        </button>
        <span className="uni-mini-ring"><Ring value={(done + coursesDone) / (LESSONS.length + COURSES.length)} label="University progress"><small>done</small></Ring></span>
      </header>

      {tab !== 'home' && !s && (
        <nav className="uni-crumbs" aria-label="Breadcrumb">
          <button type="button" className="btn uni-back" onClick={() => go('home')}>‹ University home</button>
          <span className="uni-crumb-here"><Icon name={TABS.find(x => x.id === tab)!.icon} size={20} /> {TABS.find(x => x.id === tab)!.label}{school ? ` · ${school.id}` : ''}</span>
        </nav>
      )}

      <input type="search" className="search uni-search" aria-label="Search the University" placeholder="Search, like &quot;sales tax&quot;, &quot;scanner&quot; or &quot;Canva&quot;" value={q} onChange={e => setQ(e.target.value)} />

      {s ? (
        <section className="stack wide-gap">
          <div className="uni-section-head"><span className="uni-eyebrow">Search</span><h2 className="uni-h2">Results for “{q.trim()}”</h2></div>
          {lessonHits.length + courseHits.length > 0 && <div className="uni-rows">{[...lessonHits, ...courseHits].map(row)}</div>}
          {fixes.length > 0 && (
            <div className="uni-fixes">
              {fixes.map(f => <details key={f.q} className="uni-fix" open><summary>{f.q}</summary><ol>{f.steps.map((x, i) => <li key={i}>{x}</li>)}</ol></details>)}
            </div>
          )}
          {!lessonHits.length && !courseHits.length && !fixes.length && <p className="uni-sub">Nothing matches. Try a simpler word, like “tags” or “taxes”.</p>}
          <button type="button" className="btn uni-ghost-dark" onClick={() => setQ('')}>Clear search</button>
        </section>
      ) : tab === 'home' ? (
        <>
          <section className="uni-hero uni-hero-home">
            <div className="uni-hero-copy">
              <span className="uni-kicker">{resume && started(resume) ? 'Pick up where you left off' : done ? 'Your next lesson' : 'Welcome, boss'}</span>
              {resume ? (
                <>
                  <h1 className="uni-title uni-title-sm">{resume.title}</h1>
                  <p className="uni-lead">{resume.why}</p>
                  <span className="uni-resume-meta">{kindOf(resume)} · {lessonMinutes(resume)} min</span>
                  {progress[resume.id] && <span className="uni-resume-bar"><i style={{ width: pct(progress[resume.id]!.step, resume.slides.length) }} /></span>}
                  <div className="row-gap"><Link className="btn uni-cta uni-cta-xl" to={`/lessons/${resume.id}`}><Icon name="sparkle" size={22} /> {started(resume) ? 'Continue' : 'Start'}</Link></div>
                </>
              ) : (
                <><h1 className="uni-title uni-title-sm">You finished everything!</h1><p className="uni-lead">Every lesson and course is done. Print your certificates and come back when new courses arrive.</p></>
              )}
            </div>
            <figure className="uni-portrait">
              <span className="uni-arch"><img src={novaLaverne} alt="Nova the handbag with LaVerne, Queen of $2 Tuesday" /></span>
            </figure>
          </section>

          <section className="stack">
            <div className="uni-section-head"><span className="uni-eyebrow">Your path</span><h2 className="uni-h2">Three simple steps</h2></div>
            <ol className="uni-path">
              <li><button type="button" className="uni-step tone-violet" onClick={() => go('orientation')}>
                <span className="uni-step-no">1</span>
                <span className="uni-step-text"><b>Learn the app</b><span>{LESSONS.length} short lessons on using the app.</span>
                  <span className="uni-step-bar"><i style={{ width: pct(done, LESSONS.length) }} /></span><small>{done} of {LESSONS.length} done</small></span>
                <span className="uni-step-go" aria-hidden="true">›</span>
              </button></li>
              <li><button type="button" className="uni-step tone-fuchsia" onClick={() => go('classes')}>
                <span className="uni-step-no">2</span>
                <span className="uni-step-text"><b>Join a live class</b><span>Mondays and Wednesdays, day or evening.</span></span>
                <span className="uni-step-go" aria-hidden="true">›</span>
              </button></li>
              <li><button type="button" className="uni-step tone-gold" onClick={() => go('business')}>
                <span className="uni-step-no">3</span>
                <span className="uni-step-text"><b>Grow your business</b><span>{COURSES.length} business courses.</span>
                  <span className="uni-step-bar"><i style={{ width: pct(coursesDone, COURSES.length) }} /></span><small>{coursesDone} of {COURSES.length} done</small></span>
                <span className="uni-step-go" aria-hidden="true">›</span>
              </button></li>
            </ol>
          </section>

          <section className="stack">
            <div className="uni-section-head"><span className="uni-eyebrow">Always here for you</span><h2 className="uni-h2">Quick help</h2></div>
            <div className="uni-doors">
              <button type="button" className="uni-door tone-emerald" onClick={() => go('resources')}><Icon name="lessons" size={26} /><b>Resource desk</b><span>Sales tax IDs, tax dates, official links</span></button>
              <button type="button" className="uni-door tone-cobalt" onClick={() => go('help')}><Icon name="settings" size={26} /><b>Help desk</b><span>Quick fixes for scanners, printers and more</span></button>
              <Link className="uni-door tone-gold" to="/consult"><Icon name="sparkle" size={26} /><b>Time with the Queen</b><span>1:1 business consulting</span></Link>
            </div>
          </section>

          <NovaSays mood={NOVA_TIPS[tip][0]} key={tip} onNovaClick={() => setTip(t => (t + 1) % NOVA_TIPS.length)}>{NOVA_TIPS[tip][1]}</NovaSays>
        </>
      ) : tab === 'orientation' ? (
        <section className="stack wide-gap">
          <div className="uni-section-head">
            <span className="uni-eyebrow">Orientation</span>
            <h2 className="uni-h2">Learn the app, one module at a time</h2>
            <p className="uni-sub">Tap a module to see its lessons. Start with the one that's open, then join a live class.</p>
          </div>
          <div className="uni-modules">
            {TRACKS.map((t, mi) => {
              const list = LESSONS.filter(l => l.track === t)
              if (!list.length) return null
              const mDone = list.filter(isDone).length
              const open = shownModule === t
              return (
                <article key={t} className={`uni-module tone-${TRACK_TONE[t]}${mDone === list.length ? ' done' : ''}${open ? ' open' : ''}`}>
                  <button type="button" className="uni-module-head" aria-expanded={open} onClick={() => setOpenModule(open ? null : t)}>
                    <span className="uni-module-no"><small>Module</small>{mi + 1}</span>
                    <span className="uni-module-text">
                      <b>{t}</b>
                      <span>{MODULE_BLURB[t]}</span>
                      <span className="uni-module-meta">{list.length} lessons · {list.reduce((a, l) => a + lessonMinutes(l), 0)} min · {mDone === list.length ? '✓ Complete' : `${mDone} done`}{t === currentModule && mDone < list.length ? ' · You are here' : ''}</span>
                    </span>
                    <span className="uni-module-chev" aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                  <span className="uni-bar"><i style={{ width: pct(mDone, list.length) }} /></span>
                  {open && (
                    <div className="htag-row">
                      {list.map((l, i) => {
                        const p = progress[l.id]
                        return <LessonTag key={l.id} to={`/lessons/${l.id}`} no={`${mi + 1}.${i + 1}`} title={l.title} minutes={lessonMinutes(l)} icon={l.icon}
                          activities={l.slides.filter(x => INTERACTIVE.includes(x.kind)).length} tone={TRACK_TONE[t]} status={p?.completed_at ? 'done' : p ? 'started' : undefined} score={p?.score} />
                      })}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
          <button type="button" className="uni-step tone-fuchsia" onClick={() => go('classes')}>
            <span className="uni-step-no"><Icon name="live" size={24} /></span>
            <span className="uni-step-text"><b>Rather learn it live?</b><span>Join a Monday or Wednesday class, daytime or evening, or book 1:1 help.</span></span>
            <span className="uni-step-go" aria-hidden="true">›</span>
          </button>
        </section>
      ) : tab === 'classes' ? (
        <section className="stack wide-gap">
          <LiveClasses isDone={isDone} />
        </section>
      ) : tab === 'business' ? (
        <section className="stack wide-gap">
          {school ? (
            <>
              <button type="button" className="btn uni-back" onClick={() => go('business')}>‹ All schools</button>
              <div className={`uni-school tone-${school.tone}`}>
                <div className="uni-school-head">
                  <span className="uni-school-dot" aria-hidden="true" />
                  <div><h3>{school.id}</h3><p>{school.blurb}</p></div>
                </div>
                <div className="bag-grid">{COURSES.filter(l => l.school === school.id).map(bag)}</div>
              </div>
            </>
          ) : (
            <>
              <div className="uni-section-head">
                <span className="uni-eyebrow">Business school</span>
                <h2 className="uni-h2">Grow your business</h2>
                <p className="uni-sub">{COURSES.length} courses, 15 to 20 minutes each, with a workbook and a certificate. Built on Wharton, Harvard Business School, MIT Sloan, McKinsey, Georgia Tech, the SBA, the IRS and the FTC.</p>
              </div>
              {starters.length > 0 && (
                <div className="uni-start-with">
                  <h3 className="uni-h3">New here? Start with these</h3>
                  <div className="uni-rows">{starters.map(row)}</div>
                </div>
              )}
              <h3 className="uni-h3">Or pick a school</h3>
              <div className="uni-school-tiles">
                {SCHOOLS.map(sc => {
                  const list = COURSES.filter(l => l.school === sc.id)
                  if (!list.length) return null
                  return (
                    <button key={sc.id} type="button" className={`uni-school-tile tone-${sc.tone}`} onClick={() => go('business', { school: sc.tone })}>
                      <span className="uni-school-tile-ico"><Icon name={sc.icon} size={22} /></span>
                      <b>{sc.id}</b>
                      <small>{list.length} course{list.length === 1 ? '' : 's'} · {list.filter(isDone).length} done</small>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </section>
      ) : tab === 'resources' ? (
        <section className="stack wide-gap">
          <div className="uni-section-head">
            <span className="uni-eyebrow">Resource desk</span>
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
              <div className="uni-desk-answer"><b>{state.name}</b><span>{state.agency}</span>{state.note && <small>{state.note}</small>}</div>
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
              <ul className="uni-desk-dates">{TAX_DATES.map(x => <li key={x.when}><b>{x.when}</b><span>{x.what}</span></li>)}</ul>
              <p className="uni-desk-small">When a date lands on a weekend or holiday, it moves to the next business day.</p>
              <Link className="uni-desk-link" to="/lessons/taxes">Take the tax time course ›</Link>
            </div>
            <div className="uni-desk-card tone-fuchsia">
              <h3>Numbers to know</h3>
              <dl className="uni-desk-nums">{IRS_NUMBERS.map(x => <div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl>
            </div>
          </div>
        </section>
      ) : (
        <section className="stack wide-gap">
          <div className="uni-section-head"><span className="uni-eyebrow">Help desk</span><h2 className="uni-h2">Quick fixes</h2><p className="uni-sub">Tap a problem to see the fix.</p></div>
          <div className="uni-fixes">
            {FIXES.map(f => <details key={f.q} className="uni-fix"><summary>{f.q}</summary><ol>{f.steps.map((x, i) => <li key={i}>{x}</li>)}</ol></details>)}
          </div>
          <div className="uni-help-more">
            <b>Still stuck?</b>
            <span>Book free 1:1 coaching with the Dynamic Dazzle team, daytime or evening.</span>
            <a className="btn uni-step-btn" href={`mailto:${CONTACT}?subject=${encodeURIComponent('Book a 1:1 coaching session')}`}>Book 1:1 coaching ›</a>
          </div>
        </section>
      )}
    </div>
  )
}

/** Weekly live classes, 1:1 coaching and time with the Queen. */
function LiveClasses({ isDone }: { isDone: (l: Lesson) => boolean }) {
  return (
    <div className="uni-classes" id="u-classes">
      <div className="uni-classes-head">
        <h3>Live orientation classes</h3>
        <p>Learn it with us, on camera, with time for your questions. Pick daytime or evening. All times are {CLASS_TZ}.</p>
      </div>
      <div className="uni-class-grid">
        {LIVE_CLASSES.map(c => (
          <article key={c.id} className={`uni-class tone-${c.tone}`}>
            <span className="uni-class-day">{c.day}</span>
            <h4>{c.title}</h4>
            <p>{c.what}</p>
            <ul className="uni-class-covers">{c.covers.map(x => <li key={x}>{x}</li>)}</ul>
            <div className="uni-class-times">
              {c.sessions.map(s => (
                <a key={s.label} className="uni-class-time" href={`mailto:${CONTACT}?subject=${encodeURIComponent(`Save my seat: ${c.title}, ${c.day} ${s.label.toLowerCase()} (${s.time})`)}`}>
                  <small>{s.label}</small><b>{s.time}</b><span>Save my seat ›</span>
                </a>
              ))}
            </div>
            <div className="uni-class-prep">
              <small>Take these first</small>
              {c.prep.map(id => lessonById(id)).filter((l): l is Lesson => !!l).map(l => <Link key={l.id} to={`/lessons/${l.id}`}>{l.title}{isDone(l) ? ' ✓' : ''}</Link>)}
            </div>
          </article>
        ))}
        <article className="uni-class tone-gold">
          <span className="uni-class-day">By appointment</span>
          <h4>{ONE_ON_ONE.title}</h4>
          <p>{ONE_ON_ONE.what}</p>
          <div className="uni-class-times">
            <a className="uni-class-time" href={`mailto:${CONTACT}?subject=${encodeURIComponent('Book a 1:1 coaching session (daytime)')}`}><small>Daytime</small><b>1:1</b><span>Book it ›</span></a>
            <a className="uni-class-time" href={`mailto:${CONTACT}?subject=${encodeURIComponent('Book a 1:1 coaching session (evening)')}`}><small>Evening</small><b>1:1</b><span>Book it ›</span></a>
          </div>
        </article>
      </div>
      <article className="uni-queen">
        <div className="uni-queen-copy">
          <span className="uni-class-day">{QUEEN_SESSION.tagline}</span>
          <h4>{QUEEN_SESSION.title}</h4>
          <p>{QUEEN_SESSION.what}</p>
          <span className="uni-queen-cred">♛ {QUEEN_SESSION.credential}</span>
          <Link className="uni-queen-prep" to="/lessons/consult">Prep with the "Get the most from time with the Queen" lesson ›</Link>
        </div>
        <div className="uni-queen-price">
          <span className="uni-queen-first"><small>Your first full hour</small><b>${QUEEN_SESSION.rate * (1 - QUEEN_SESSION.firstHourOff)}</b><em>{Math.round(QUEEN_SESSION.firstHourOff * 100)}% off</em></span>
          <span className="uni-queen-then">Then ${QUEEN_SESSION.rate} an hour, prorated. Use the full hour, it's worth it!</span>
          <Link className="btn uni-cta" to="/consult">♛ Schedule time with the Queen</Link>
        </div>
      </article>
    </div>
  )
}
