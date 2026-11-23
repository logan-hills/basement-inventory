import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { LESSONS, lessonById, type Screen, type Slide } from '../lessons'
import { useLessonProgress } from '../lib/lessonProgress'
import { feedbackBad, feedbackOk, tap } from '../lib/feedback'

/** Stable shuffle so practice order doesn't jump around on re-render. */
function shuffle<T>(arr: T[], seed: string): T[] {
  let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) | 0; const j = Math.abs(h) % (i + 1); [a[i], a[j]] = [a[j], a[i]] }
  if (a.every((x, i) => x === arr[i]) && a.length > 1) a.push(a.shift()!)
  return a
}

function MockScreen({ s, onTap, picked, answer }: { s: Screen; onTap?: (b: string) => void; picked?: string | null; answer?: string }) {
  return (
    <div className="mock-screen" aria-label={`Example screen: ${s.title}`}>
      <div className="mock-bar"><i /><i /><i /><span>{s.title}</span></div>
      {s.rows?.map(r => <div key={r} className="mock-row">{r}</div>)}
      <div className="mock-btns">
        {s.buttons.map(b => {
          const state = picked === b ? (b === answer ? 'right' : 'wrong') : ''
          return onTap
            ? <button key={b} className={`mock-btn ${state}`} onClick={() => onTap(b)}>{b}</button>
            : <span key={b} className={`mock-btn${s.highlight === b ? ' hl' : ''}`}>{b}</span>
        })}
      </div>
    </div>
  )
}

function Practice({ slide, seed, onSolved }: { slide: Slide; seed: string; onSolved: (firstTry: boolean) => void }) {
  const [missed, setMissed] = useState(false)
  const [solved, setSolved] = useState(false)
  const [picked, setPicked] = useState<string | number | null>(null)
  const [placed, setPlaced] = useState<string[]>([])
  const [shake, setShake] = useState<string | null>(null)
  const shuffled = useMemo(() => slide.kind === 'order' ? shuffle(slide.steps, seed) : [], [slide, seed])

  function win(first: boolean) { setSolved(true); feedbackOk(); onSolved(first) }
  function miss(key: string) { setMissed(true); feedbackBad(); setShake(key); setTimeout(() => setShake(null), 450) }

  if (slide.kind === 'tap') return (
    <div className="stack">
      <p className="lesson-prompt">{slide.prompt}</p>
      <MockScreen s={slide.screen} picked={picked as string | null} answer={slide.answer} onTap={b => {
        if (solved) return
        setPicked(b)
        if (b === slide.answer) win(!missed); else miss(b)
      }} />
      {picked && picked !== slide.answer && !solved && <p className="lesson-hint">Not quite. {slide.hint}</p>}
      {solved && <p className="lesson-good">Yes! {slide.hint}</p>}
    </div>
  )

  if (slide.kind === 'order') return (
    <div className="stack">
      <p className="lesson-prompt">{slide.prompt}</p>
      {placed.length > 0 && <ol className="order-placed">{placed.map(p => <li key={p}>{p}</li>)}</ol>}
      <div className="order-pool">
        {shuffled.filter(x => !placed.includes(x)).map(x => (
          <button key={x} className={`order-chip${shake === x ? ' shake' : ''}`} onClick={() => {
            if (x === slide.steps[placed.length]) {
              tap(); const next = [...placed, x]; setPlaced(next)
              if (next.length === slide.steps.length) win(!missed)
            } else miss(x)
          }}>{x}</button>
        ))}
      </div>
      {missed && !solved && <p className="lesson-hint">Not that one yet. What has to happen first?</p>}
      {solved && <p className="lesson-good">Perfect order!</p>}
    </div>
  )

  if (slide.kind === 'quiz') return (
    <div className="stack">
      <span className="eyebrow">Quick check</span>
      <p className="lesson-prompt">{slide.q}</p>
      <div className="quiz-opts">
        {slide.options.map((o, i) => {
          const state = picked == null ? '' : i === slide.answer ? 'right' : picked === i ? 'wrong' : 'dim'
          return <button key={o} className={`quiz-opt ${state}`} disabled={picked != null} onClick={() => {
            setPicked(i)
            if (i === slide.answer) win(true); else { miss(o); setSolved(true); onSolved(false) }
          }}><span className="quiz-letter">{'ABCD'[i]}</span>{o}</button>
        })}
      </div>
      {picked != null && <p className={picked === slide.answer ? 'lesson-good' : 'lesson-hint'}>{picked === slide.answer ? 'Right! ' : 'Good try. '}{slide.why}</p>}
    </div>
  )
  return null
}

export default function LessonPlayer() {
  const { id } = useParams()
  return <Player key={id} id={id} />
}

function Player({ id }: { id?: string }) {
  const nav = useNavigate()
  const lesson = lessonById(id)
  const { progress, save } = useLessonProgress()
  const saved = lesson ? progress[lesson.id] : undefined
  const [i, setI] = useState(() => saved && !saved.completed_at ? Math.min(saved.step, (lesson?.slides.length ?? 1) - 1) : 0)
  const [results, setResults] = useState<Record<number, boolean>>({})
  const [finished, setFinished] = useState(false)

  if (!lesson) return <div className="stack"><h1>Lesson not found</h1><Link to="/lessons" className="btn ghost self-start">All lessons</Link></div>

  const slide = lesson.slides[i]
  const interactive = slide.kind !== 'learn'
  const ready = !interactive || i in results
  const total = lesson.slides.filter(s => s.kind !== 'learn').length
  const right = Object.values(results).filter(Boolean).length
  const idx = LESSONS.indexOf(lesson)
  const nextLesson = LESSONS.slice(idx + 1).find(l => !progress[l.id]?.completed_at) ?? LESSONS[idx + 1]

  function go(n: number) {
    if (n >= lesson!.slides.length) {
      const score = total ? Math.round((right / total) * 100) : 100
      save(lesson!.id, { step: lesson!.slides.length, score, completed_at: new Date().toISOString() })
      feedbackOk(); setFinished(true); return
    }
    setI(n); tap()
    if (!saved?.completed_at) save(lesson!.id, { step: Math.max(n, saved?.step ?? 0) })
  }

  if (finished) {
    const score = total ? Math.round((right / total) * 100) : 100
    return (
      <div className="lesson-player stack wide-gap">
        <div className="lesson-finish card">
          <div className="finish-badge"><Icon name={lesson.icon} size={38} /></div>
          <span className="script">{score >= 80 ? 'You did that!' : 'Lesson complete'}</span>
          <h1>{lesson.title}</h1>
          <p className="big-text">{total ? <>You got <b className="gold">{right} of {total}</b> right on the first try.</> : 'All done.'}</p>
          {score < 80 && <p className="muted">Take it again any time. Practice makes it second nature.</p>}
          <div className="row-gap center-row">
            {lesson.route && <Link className="btn gold" to={lesson.route.to}>Try it for real: {lesson.route.label}</Link>}
            {nextLesson && nextLesson !== lesson && <Link className="btn ghost" to={`/lessons/${nextLesson.id}`}>Next lesson: {nextLesson.title} →</Link>}
          </div>
          <div className="row-gap center-row">
            <button className="link-btn" onClick={() => { setI(0); setResults({}); setFinished(false) }}>Retake</button>
            <Link className="link-btn" to="/lessons">All lessons</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lesson-player stack wide-gap">
      <div className="row-between">
        <button className="link-btn" onClick={() => nav('/lessons')}>← All lessons</button>
        <span className="muted small">{lesson.track} · {lesson.minutes} min</span>
      </div>
      <div className="lesson-steps" aria-label={`Step ${i + 1} of ${lesson.slides.length}`}>
        {lesson.slides.map((s, n) => <i key={n} className={n < i ? 'past' : n === i ? 'now' : ''} data-kind={s.kind} />)}
      </div>

      {i === 0 && (
        <div className="lesson-why">
          <span className="lesson-ico big"><Icon name={lesson.icon} size={26} /></span>
          <div><span className="eyebrow">Why it matters</span><p>{lesson.why}</p></div>
        </div>
      )}

      <div className="lesson-slide card" key={`${lesson.id}-${i}`}>
        {slide.kind === 'learn' ? (
          <div className={slide.screen ? 'learn-split' : 'stack'}>
            <div className="stack">
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>
              {slide.points && <ul className="lesson-points">{slide.points.map(p => <li key={p}>{p}</li>)}</ul>}
              {slide.tip && <p className="lesson-tip"><Icon name="sparkle" size={15} /> {slide.tip}</p>}
            </div>
            {slide.screen && <MockScreen s={slide.screen} />}
          </div>
        ) : (
          <div className="stack">
            {slide.kind !== 'quiz' && <><span className="eyebrow">Practice</span><h2>{slide.title.replace(/^Practice:?\s*/, '') || 'Your turn'}</h2></>}
            <Practice key={`${lesson.id}-${i}`} slide={slide} seed={`${lesson.id}${i}`} onSolved={first => setResults(r => i in r ? r : { ...r, [i]: first })} />
          </div>
        )}
      </div>

      <div className="row-between lesson-nav">
        <button className="btn ghost" disabled={i === 0} onClick={() => go(i - 1)}>Back</button>
        <button className="btn gold" disabled={!ready} onClick={() => go(i + 1)}>{i === lesson.slides.length - 1 ? 'Finish' : interactive && !ready ? 'Answer to continue' : 'Next'}</button>
      </div>
    </div>
  )
}
