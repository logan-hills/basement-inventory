import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { Nova, NovaSays, burst, pick, NOVA_CHEERS, NOVA_OOPS, type NovaMood } from '../components/Nova'
import { LESSONS, COURSES, GRADED, INTERACTIVE, lessonById, lessonMinutes, type Screen, type Slide } from '../lessons'
import { useLessonProgress } from '../lib/lessonProgress'
import { useSession } from '../lib/session'
import { hasAcademy } from '../lib/plan'
import { feedbackBad, feedbackOk, tap } from '../lib/feedback'
import AcademyLocked from '../components/AcademyLocked'

/** Stable shuffle so practice order doesn't jump around on re-render. */
function shuffle<T>(arr: T[], seed: string): T[] {
  let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) | 0; const j = Math.abs(h) % (i + 1); [a[i], a[j]] = [a[j], a[i]] }
  if (a.every((x, i) => x === arr[i]) && a.length > 1) a.push(a.shift()!)
  return a
}

const INTROS = ['Here\'s the tea.', 'Okay, lean in.', 'This part is good.', 'Stay with me, this one matters.', 'Let me show you.']
const PRACTICE = ['Your turn! I believe in you.', 'Show me what you\'ve got.', 'Let\'s see it, queen.']
const QUIZ = ['Quick check. No pressure.', 'Pop quiz! You know this.']
const REFLECT = ['Grab a thought and write it down. It\'s just for you.', 'Workbook time. Be honest, there\'s no wrong answer.']
const SCENARIO = ['This happens to all of us. What would you do?', 'Real life, real shop. Pick your move.', 'Put yourself right there. What\'s the play?']
const NUMBER = ['Grab your calculator, or do it in your head.', 'Money math! You\'ve got this.']
const SCRIPT = ['Steal this. Change the words so it sounds like you.', 'Here are the exact words. Copy it, keep it.']
const CHECK = ['Let\'s make it real. Tick what you\'ll do.', 'Your action plan. Small steps, big results.']

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

type Solve = (firstTry: boolean, e?: { clientX: number; clientY: number }) => void

/** Workbook answers live on this device, keyed by lesson and slide title so edits to a lesson don't scramble them. */
const workbookKey = (lessonId: string, s: Slide) => `${s.kind === 'checklist' ? 'check' : 'reflect'}:${lessonId}:${'title' in s ? s.title : ''}`
const readLocal = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
const writeLocal = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* ignore */ } }

function Practice({ slide, seed, store, onSolved, onMiss }: { slide: Slide; seed: string; store: string; onSolved: Solve; onMiss: () => void }) {
  const [missed, setMissed] = useState(false)
  const [solved, setSolved] = useState(false)
  const [picked, setPicked] = useState<string | number | null>(null)
  const [tried, setTried] = useState<number[]>([])
  const [placed, setPlaced] = useState<string[]>([])
  const [shake, setShake] = useState<string | null>(null)
  const [note, setNote] = useState(() => readLocal(store) ?? '')
  const [ticks, setTicks] = useState<number[]>(() => { try { return JSON.parse(readLocal(store) ?? '[]') } catch { return [] } })
  const [num, setNum] = useState('')
  const shuffled = useMemo(() => slide.kind === 'order' ? shuffle(slide.steps, seed) : [], [slide, seed])

  function win(first: boolean, e?: { clientX: number; clientY: number }) { setSolved(true); feedbackOk(); onSolved(first, e) }
  function miss(key: string) { setMissed(true); feedbackBad(); setShake(key); setTimeout(() => setShake(null), 450); onMiss() }

  if (slide.kind === 'tap') return (
    <div className="stack">
      <p className="lesson-prompt">{slide.prompt}</p>
      <MockScreen s={slide.screen} picked={picked as string | null} answer={slide.answer} onTap={b => {
        if (solved) return
        setPicked(b)
        if (b === slide.answer) win(!missed); else miss(b)
      }} />
      {picked && picked !== slide.answer && !solved && <p className="lesson-hint">Hint: {slide.hint}</p>}
      {solved && <p className="lesson-good">{slide.hint}</p>}
    </div>
  )

  if (slide.kind === 'order') return (
    <div className="stack">
      <p className="lesson-prompt">{slide.prompt}</p>
      {placed.length > 0 && <ol className="order-placed">{placed.map(p => <li key={p}>{p}</li>)}</ol>}
      <div className="order-pool">
        {shuffled.filter(x => !placed.includes(x)).map(x => (
          <button key={x} className={`order-chip${shake === x ? ' shake' : ''}`} onClick={e => {
            if (x === slide.steps[placed.length]) {
              tap(); const next = [...placed, x]; setPlaced(next)
              if (next.length === slide.steps.length) win(!missed, e)
            } else miss(x)
          }}>{x}</button>
        ))}
      </div>
    </div>
  )

  if (slide.kind === 'quiz') return (
    <div className="stack">
      <p className="lesson-prompt">{slide.q}</p>
      <div className="quiz-opts">
        {slide.options.map((o, i) => {
          const state = picked == null ? '' : i === slide.answer ? 'right' : picked === i ? 'wrong' : 'dim'
          return <button key={o} className={`quiz-opt ${state}`} disabled={picked != null} onClick={e => {
            setPicked(i)
            if (i === slide.answer) win(true, e); else { miss(o); setSolved(true); onSolved(false) }
          }}><span className="quiz-letter">{'ABCD'[i]}</span>{o}</button>
        })}
      </div>
      {picked != null && <p className={picked === slide.answer ? 'lesson-good' : 'lesson-hint'}>{slide.why}</p>}
    </div>
  )

  if (slide.kind === 'scenario') {
    const last = tried[tried.length - 1]
    return (
      <div className="stack">
        <div className="scenario-box"><span className="eyebrow">The situation</span><p>{slide.situation}</p></div>
        <p className="lesson-prompt">What would you do?</p>
        <div className="quiz-opts">
          {slide.options.map((o, i) => {
            const state = !tried.includes(i) ? (solved ? 'dim' : '') : o.best ? 'right' : 'wrong'
            return <button key={o.text} className={`quiz-opt ${state}${shake === o.text ? ' shake' : ''}`} disabled={solved || tried.includes(i)} onClick={e => {
              setTried(t => [...t, i])
              if (o.best) win(!missed, e); else miss(o.text)
            }}><span className="quiz-letter">{'ABCD'[i]}</span>{o.text}</button>
          })}
        </div>
        {last != null && <p className={slide.options[last].best ? 'lesson-good' : 'lesson-hint'}>{slide.options[last].feedback}{!slide.options[last].best && ' Try another one.'}</p>}
      </div>
    )
  }

  if (slide.kind === 'number') {
    const val = parseFloat(num.replace(/[^0-9.-]/g, ''))
    return (
      <div className="stack">
        <p className="lesson-prompt">{slide.q}</p>
        <form className="number-row" onSubmit={e => {
          e.preventDefault()
          if (solved || Number.isNaN(val)) return
          if (Math.abs(val - slide.answer) <= (slide.tolerance ?? 0.01)) win(!missed); else miss('num')
        }}>
          {slide.prefix && <span className="number-affix">{slide.prefix}</span>}
          <input className={`number-input${shake === 'num' ? ' shake' : ''}`} inputMode="decimal" value={num} disabled={solved} aria-label="Your answer" placeholder="?"
            onChange={e => setNum(e.target.value)} />
          {slide.suffix && <span className="number-affix">{slide.suffix}</span>}
          {!solved && <button className="btn gold" disabled={!num.trim()}>Check</button>}
        </form>
        {missed && !solved && (
          <div className="row-gap"><p className="lesson-hint grow">Not quite. Hint: {slide.hint}</p>
            <button type="button" className="link-btn" onClick={() => { setNum(String(slide.answer)); win(false) }}>Show me</button></div>
        )}
        {solved && <p className="lesson-good">{slide.prefix ?? ''}{slide.answer}{slide.suffix ? ` ${slide.suffix}` : ''}. {slide.why}</p>}
      </div>
    )
  }

  if (slide.kind === 'reflect') return (
    <div className="stack">
      <p className="lesson-prompt">{slide.prompt}</p>
      <textarea className="reflect-box" rows={4} placeholder={slide.placeholder} value={note}
        onChange={e => { setNote(e.target.value); writeLocal(store, e.target.value) }} />
      {slide.example && <p className="reflect-example"><b>Example:</b> {slide.example}</p>}
      {!solved
        ? <button className="btn outline-gold self-start" disabled={note.trim().length < 3} onClick={e => win(true, e)}>Save my answer</button>
        : <p className="lesson-good">Saved to your workbook. Look at you building a business plan!</p>}
    </div>
  )

  if (slide.kind === 'checklist') return (
    <div className="stack">
      <p className="lesson-prompt">{slide.prompt}</p>
      <ul className="action-list">
        {slide.items.map((it, n) => {
          const on = ticks.includes(n)
          return <li key={it}><button className={`action-item${on ? ' on' : ''}`} aria-pressed={on} onClick={() => {
            tap(); const next = on ? ticks.filter(x => x !== n) : [...ticks, n]; setTicks(next); writeLocal(store, JSON.stringify(next))
          }}><span className="action-box">{on ? '✓' : ''}</span>{it}</button></li>
        })}
      </ul>
      {!solved
        ? <button className="btn outline-gold self-start" onClick={e => win(true, e)}>Save my plan</button>
        : <p className="lesson-good">Saved. Tick the rest off as you do them, it'll be right here.</p>}
    </div>
  )
  return null
}

function ScriptCard({ slide }: { slide: Extract<Slide, { kind: 'script' }> }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="stack">
      <h2>{slide.title}</h2>
      {slide.text && <p>{slide.text}</p>}
      <div className="script-card">
        {slide.lines.map((l, n) => <p key={n}>{l}</p>)}
        <button className="btn outline-gold small-btn no-print" onClick={() => {
          navigator.clipboard?.writeText(slide.lines.join('\n')).then(() => { setCopied(true); tap(); setTimeout(() => setCopied(false), 1800) }).catch(() => {})
        }}>{copied ? 'Copied ✓' : 'Copy this'}</button>
      </div>
      {slide.tip && <p className="lesson-tip"><Icon name="sparkle" size={15} /> {slide.tip}</p>}
    </div>
  )
}

function LearnCard({ slide }: { slide: Extract<Slide, { kind: 'learn' }> }) {
  return (
    <div className={slide.screen ? 'learn-split' : 'stack'}>
      <div className="stack">
        <h2>{slide.title}</h2>
        <p>{slide.text}</p>
        {slide.points && <ul className="lesson-points">{slide.points.map(p => <li key={p}>{p}</li>)}</ul>}
        {slide.table && (
          <div className="lesson-table-wrap">
            <table className="lesson-table">
              <thead><tr>{slide.table.head.map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{slide.table.rows.map((r, n) => <tr key={n}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        )}
        {slide.example && <div className="lesson-example"><span className="eyebrow">Real-life example</span><p>{slide.example}</p></div>}
        {slide.tip && <p className="lesson-tip"><Icon name="sparkle" size={15} /> {slide.tip}</p>}
      </div>
      {slide.screen && <MockScreen s={slide.screen} />}
    </div>
  )
}

/** Everything she wrote or planned in this lesson, to print or keep. */
function Workbook({ lessonId, slides }: { lessonId: string; slides: Slide[] }) {
  const entries = slides.flatMap(s => {
    if (s.kind === 'reflect') { const v = readLocal(workbookKey(lessonId, s)); return v?.trim() ? [{ title: s.title, prompt: s.prompt, body: <p className="workbook-answer">{v}</p> }] : [] }
    if (s.kind === 'checklist') {
      let t: number[] = []; try { t = JSON.parse(readLocal(workbookKey(lessonId, s)) ?? '[]') } catch { /* ignore */ }
      return [{ title: s.title, prompt: s.prompt, body: <ul className="workbook-checks">{s.items.map((it, n) => <li key={it} className={t.includes(n) ? 'on' : ''}>{t.includes(n) ? '☑' : '☐'} {it}</li>)}</ul> }]
    }
    return []
  })
  if (!entries.length) return null
  return (
    <section className="workbook card stack">
      <div className="row-between"><div><span className="eyebrow">Keep this</span><h2>Your workbook</h2></div>
        <button className="btn outline-gold no-print" onClick={() => window.print()}>Print my workbook</button></div>
      {entries.map(e => <div key={e.title} className="workbook-entry"><b>{e.title}</b><span className="muted small">{e.prompt}</span>{e.body}</div>)}
    </section>
  )
}

export default function LessonPlayer() {
  const { id } = useParams()
  return <Player key={id} id={id} />
}

function Player({ id }: { id?: string }) {
  const nav = useNavigate()
  const { shop } = useSession()
  const lesson = lessonById(id)
  const { progress, save } = useLessonProgress()
  const saved = lesson ? progress[lesson.id] : undefined
  const [i, setI] = useState(() => saved && !saved.completed_at ? Math.min(saved.step, (lesson?.slides.length ?? 1) - 1) : 0)
  const [results, setResults] = useState<Record<number, boolean>>({})
  const [finished, setFinished] = useState(false)
  const [react, setReact] = useState<{ mood: NovaMood; line: string } | null>(null)

  if (!hasAcademy(shop?.plan)) return <AcademyLocked />
  if (!lesson) return <div className="stack"><h1>Lesson not found</h1><Link to="/lessons" className="btn ghost self-start">All lessons</Link></div>

  const isCourse = lesson.kind === 'course'
  const list = isCourse ? COURSES : LESSONS
  const slide = lesson.slides[i]
  const interactive = INTERACTIVE.includes(slide.kind)
  const ready = !interactive || i in results
  const graded = lesson.slides.filter(s => GRADED.includes(s.kind))
  const gradedIdx = new Set(lesson.slides.map((s, n) => GRADED.includes(s.kind) ? n : -1).filter(n => n >= 0))
  const minutes = lessonMinutes(lesson)
  const right = Object.entries(results).filter(([n, ok]) => gradedIdx.has(+n) && ok).length
  const total = graded.length
  const idx = list.indexOf(lesson)
  const nextLesson = list.slice(idx + 1).find(l => !progress[l.id]?.completed_at) ?? list[idx + 1]
  const chapter = [...lesson.slides.slice(0, i + 1)].reverse().find(s => s.chapter)?.chapter
  const chapters = lesson.slides.filter(s => s.chapter).map(s => s.chapter!)

  const seedLine = (arr: string[]) => arr[(lesson.id.length + i) % arr.length]
  const lines: Record<Slide['kind'], string[]> = { learn: INTROS, script: SCRIPT, tap: PRACTICE, order: PRACTICE, quiz: QUIZ, scenario: SCENARIO, number: NUMBER, reflect: REFLECT, checklist: CHECK }
  const novaLine = react?.line ?? slide.nova ?? (slide.kind === 'learn' && i === 0 ? `Hey love, I'm Nova. ${lesson.why}` : seedLine(lines[slide.kind]))
  const novaMood: NovaMood = react?.mood ?? (['quiz', 'reflect', 'scenario', 'number'].includes(slide.kind) ? 'think' : slide.kind === 'learn' ? (i === 0 ? 'wink' : 'happy') : 'wow')

  function go(n: number) {
    setReact(null)
    if (n >= lesson!.slides.length) {
      const score = total ? Math.round((right / total) * 100) : 100
      save(lesson!.id, { step: lesson!.slides.length, score, completed_at: new Date().toISOString() })
      feedbackOk(); setFinished(true); setTimeout(() => { burst(); setTimeout(() => burst(window.innerWidth * .3, window.innerHeight * .4), 180); setTimeout(() => burst(window.innerWidth * .7, window.innerHeight * .4), 320) }, 120); return
    }
    setI(n); tap(); window.scrollTo({ top: 0, behavior: 'smooth' })
    if (!saved?.completed_at) save(lesson!.id, { step: Math.max(n, saved?.step ?? 0) })
  }

  if (finished) {
    const score = total ? Math.round((right / total) * 100) : 100
    return (
      <div className="lesson-player stack wide-gap">
        <div className={`lesson-finish card${isCourse ? ' certificate' : ''}`}>
          {isCourse ? (
            <>
              <span className="cert-kicker">Dazzle Academy · Certificate of completion</span>
              <Nova mood="cheer" size={120} />
              <h1>{lesson.title}</h1>
              <p className="muted">Awarded to <b className="gold">{shop?.name ?? 'you'}</b> on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              {lesson.outcomes && <ul className="cert-outcomes">{lesson.outcomes.map(o => <li key={o}>{o}</li>)}</ul>}
              <span className="cert-sign">Nova <small>Head of Dazzle Academy</small></span>
            </>
          ) : (
            <>
              <Nova mood="cheer" size={120} />
              <span className="script">{score >= 80 ? 'You did that!' : 'Lesson complete'}</span>
              <h1>{lesson.title}</h1>
            </>
          )}
          <p className="big-text">{total ? <>You got <b className="gold">{right} of {total}</b> right on the first try.</> : 'All done.'}</p>
          {score < 80 && <p className="muted">Take it again any time. Practice makes it second nature.</p>}
          <div className="row-gap center-row no-print">
            {lesson.route && <Link className="btn gold" to={lesson.route.to}>Try it for real: {lesson.route.label}</Link>}
            {isCourse && <button className="btn outline-gold" onClick={() => window.print()}>Print certificate</button>}
            {nextLesson && nextLesson !== lesson && <Link className="btn ghost" to={`/lessons/${nextLesson.id}`}>Next: {nextLesson.title} →</Link>}
          </div>
          <div className="row-gap center-row no-print">
            <button className="link-btn" onClick={() => { setI(0); setResults({}); setFinished(false) }}>Retake</button>
            <Link className="link-btn" to="/lessons">All lessons</Link>
          </div>
        </div>
        <Workbook lessonId={lesson.id} slides={lesson.slides} />
      </div>
    )
  }

  return (
    <div className={`lesson-player stack wide-gap${isCourse ? ' is-course' : ''}`}>
      <div className="row-between">
        <button className="link-btn" onClick={() => nav('/lessons')}>← Dazzle Academy</button>
        <span className="muted small">{isCourse ? 'Business course' : lesson.track} · about {minutes} min · step {i + 1} of {lesson.slides.length}</span>
      </div>
      {i === 0 && (
        <div className="course-cover">
          <span className="cert-kicker">{isCourse ? 'A course by Nova' : 'A lesson by Nova'} · about {minutes} minutes</span>
          <h1>{lesson.title}</h1>
          {lesson.outcomes && <div className="stack tight-gap"><span className="eyebrow">By the end you'll be able to</span><ul className="lesson-points">{lesson.outcomes.map(o => <li key={o}>{o}</li>)}</ul></div>}
          {chapters.length > 0 && <div className="chapter-list">{chapters.map((c, n) => <span key={c}><b>{String(n + 1).padStart(2, '0')}</b>{c}</span>)}</div>}
        </div>
      )}
      <div className="lesson-steps" aria-label={`Step ${i + 1} of ${lesson.slides.length}`}>
        {lesson.slides.map((s, n) => <i key={n} className={`${n < i ? 'past' : n === i ? 'now' : ''}${s.chapter && n > 0 ? ' gap' : ''}`} data-kind={s.kind} />)}
      </div>

      <NovaSays mood={novaMood} key={`${i}-${react?.line ?? ''}`}>{novaLine}</NovaSays>

      <div className="lesson-slide card" key={`${lesson.id}-${i}`}>
        {chapter && <span className="chapter-tag">{chapter}</span>}
        {slide.kind === 'learn' ? <LearnCard slide={slide} /> : slide.kind === 'script' ? <ScriptCard slide={slide} /> : (
          <div className="stack">
            <span className="eyebrow">{{ quiz: 'Quick check', reflect: 'Workbook', checklist: 'Action plan', scenario: 'Real-life scenario', number: 'Do the math' }[slide.kind as string] ?? 'Practice'}</span>
            {'title' in slide && <h2>{slide.title.replace(/^Practice:?\s*/, '') || 'Your turn'}</h2>}
            <Practice key={`${lesson.id}-${i}`} slide={slide} seed={`${lesson.id}${i}`} store={workbookKey(lesson.id, slide)}
              onMiss={() => setReact({ mood: 'oops', line: pick(NOVA_OOPS) })}
              onSolved={(first, e) => {
                setResults(r => i in r ? r : { ...r, [i]: first })
                if (slide.kind === 'checklist') setReact({ mood: 'cheer', line: 'That\'s a plan! Come back and tick them off as you go.' })
                else if (first && slide.kind !== 'reflect') { setReact({ mood: 'cheer', line: pick(NOVA_CHEERS) }); if (e) burst(e.clientX, e.clientY) }
                else if (slide.kind === 'reflect') setReact({ mood: 'cheer', line: 'Love that. Keep it somewhere you\'ll see it.' })
                else if (slide.kind === 'quiz' || slide.kind === 'number') setReact({ mood: 'think', line: 'Now you know! That\'s how it sticks.' })
                else setReact({ mood: 'happy', line: 'There you go! You got it in the end.' })
              }} />
          </div>
        )}
      </div>

      <div className="row-between lesson-nav">
        <button className="btn ghost" disabled={i === 0} onClick={() => go(i - 1)}>Back</button>
        <button className="btn gold" disabled={!ready} onClick={() => go(i + 1)}>{i === lesson.slides.length - 1 ? 'Finish' : interactive && !ready ? (slide.kind === 'reflect' ? 'Save to continue' : 'Answer to continue') : 'Next'}</button>
      </div>
    </div>
  )
}
