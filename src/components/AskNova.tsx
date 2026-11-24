import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Nova, NovaSays, burst, type NovaMood, type NovaMove } from './Nova'
import Sheet from './Sheet'
import type { Answer } from '../lib/novaBrain'
import { hasAcademy } from '../lib/plan'
import { useSession } from '../lib/session'

/* Ask Nova: Nova floats in the corner of every screen. Tap her to ask how to do anything in the
   app. She answers from the Dazzle University lessons, takes you straight to the screen, and can
   walk you through it step by step: a little card follows you onto the real screen and she points
   at the button to tap next. */

const SEEN_KEY = 'askNovaSeen'
const GUIDE_KEY = 'novaGuide'
const HIDE_ON = [/^\/lessons\/./, /^\/on-air\//]
// Her brain (the lesson search) loads the first time someone opens Ask Nova, not with the app.
const brain = () => import('../lib/novaBrain')
const STARTERS = ['How do Live Numbers work?', 'How do I print tags?', 'How do I pack an order?', 'Where do I add tracking?', 'How do I set up my shelves?', 'How do I run a sale?']
const FOUND = ['Ooh, I know this one!', 'Easy. Here you go, love.', 'Say less. Here\'s how.', 'Got you, boss.']
const CHEERS = ['You did that!', 'Look at you go, boss!', 'Nailed it. Ka-ching!']

type Guide = { title: string; steps: string[]; route?: { to: string; label: string }; i: number }

const loadGuide = (): Guide | null => { try { return JSON.parse(sessionStorage.getItem(GUIDE_KEY) ?? 'null') } catch { return null } }
const saveGuide = (g: Guide | null) => { try { if (g) sessionStorage.setItem(GUIDE_KEY, JSON.stringify(g)); else sessionStorage.removeItem(GUIDE_KEY) } catch { /* ignore */ } }

/** The button or link on screen that a step is talking about ("Tap Print box labels" → that button). */
function findTarget(step: string): HTMLElement | null {
  const text = ` ${step.toLowerCase().replace(/[^a-z0-9#×]+/g, ' ')} `
  let best: HTMLElement | null = null, bestScore = 0
  for (const el of document.querySelectorAll<HTMLElement>('main button, main a, main [role="button"], main [role="tab"], .topnav a, .topnav button, .tabbar a')) {
    if (el.closest('.nova-guide, .sheet-panel, .ask-nova-fab')) continue
    if (!el.getClientRects().length) continue
    const label = (el.innerText || el.getAttribute('aria-label') || '').toLowerCase().replace(/[^a-z0-9#×]+/g, ' ').trim()
    if (label.length < 3 || label.length > 40) continue
    if (!text.includes(` ${label} `)) continue
    const score = label.length + (el.closest('main') ? 5 : 0)
    if (score > bestScore) { best = el; bestScore = score }
  }
  return best
}

export default function AskNova() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { shop, isTeam } = useSession()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [said, setSaid] = useState<{ mood: NovaMood; line: string }>({ mood: 'wink', line: 'Hey love! What can I help you with? Ask me how to do anything in the app, and I can walk you through it step by step.' })
  const [answers, setAnswers] = useState<Answer[] | null>(null)
  const [act, setAct] = useState<[NovaMove, number] | undefined>()
  const [seen, setSeen] = useState(() => { try { return localStorage.getItem(SEEN_KEY) === '1' } catch { return true } })
  const [guide, setGuideState] = useState<Guide | null>(loadGuide)
  const input = useRef<HTMLInputElement>(null)

  const setGuide = (g: Guide | null) => { setGuideState(g); saveGuide(g) }

  useEffect(() => { if (open) { void brain(); setTimeout(() => input.current?.focus(), 250) } }, [open])

  // Point at the button the current step talks about, on whatever screen she's on.
  const step = guide ? guide.steps[guide.i] : null
  useEffect(() => {
    if (!step) return
    let el: HTMLElement | null = null, scrolled = false
    const mark = () => {
      const next = findTarget(step)
      if (next === el) return
      el?.classList.remove('nova-point')
      el = next
      if (el) {
        el.classList.add('nova-point')
        if (!scrolled) { scrolled = true; el.scrollIntoView({ block: 'center', behavior: 'smooth' }) }
      }
    }
    mark()
    const t = setInterval(mark, 700)
    return () => { clearInterval(t); el?.classList.remove('nova-point') }
  }, [step, pathname])

  if (HIDE_ON.some(r => r.test(pathname))) return null

  const show = () => {
    setOpen(true)
    if (!seen) { setSeen(true); try { localStorage.setItem(SEEN_KEY, '1') } catch { /* ignore */ } }
  }

  const submit = async (text: string, e?: FormEvent) => {
    e?.preventDefault()
    const t = text.trim()
    if (!t) return
    setQ(t)
    const { ask, smallTalk } = await brain()
    const chat = smallTalk(t)
    if (chat) {
      setAnswers(null)
      setSaid({ mood: 'cheer', line: chat })
      if (/ka-?ching|dance|spin|curtsy/i.test(t)) setAct(a => [/curtsy/i.test(t) ? 'curtsy' : /spin/i.test(t) ? 'spin' : 'kaching', (a?.[1] ?? 0) + 1])
      return
    }
    const found = ask(t)
    setAnswers(found)
    if (found.length) {
      setSaid({ mood: 'cheer', line: `${FOUND[Math.floor(Math.random() * FOUND.length)]} Tap "Show me step by step" and I'll walk you through it.` })
    } else {
      setSaid({ mood: 'oops', line: "Hmm, I don't know that one yet. Try other words, like \"print tags\" or \"add tracking\", or tap a question below." })
    }
  }

  const startGuide = (a: Answer) => {
    if (!a.steps?.length) return
    // Already on the right screen? Skip the "open it" step.
    const skip = a.route && pathname === a.route.to && a.steps[0].startsWith('Open ') ? 1 : 0
    setGuide({ title: a.title, steps: a.steps, route: a.route, i: Math.min(skip, a.steps.length - 1) })
    setOpen(false)
  }
  const go = (d: number) => {
    if (!guide) return
    const i = guide.i + d
    if (i >= guide.steps.length) {
      setGuide(null)
      setAct(a => ['kaching', (a?.[1] ?? 0) + 1])
      burst(window.innerWidth - 80, window.innerHeight - 160)
      setSaid({ mood: 'cheer', line: CHEERS[Math.floor(Math.random() * CHEERS.length)] })
      return
    }
    setGuide({ ...guide, i: Math.max(0, i) })
  }
  const openScreen = () => {
    if (!guide?.route) return
    navigate(guide.route.to)
    setGuide({ ...guide, i: Math.min(guide.i + 1, guide.steps.length - 1) })
  }

  const academy = hasAcademy(shop?.plan) && !isTeam
  const first = guide && guide.i === 0 && guide.route && guide.steps[0].startsWith('Open ')
  return (
    <>
      {guide && step && (
        <section className="nova-guide no-print" aria-live="polite" aria-label={`Nova's walkthrough: ${guide.title}`}>
          <div className="nova-guide-head">
            <span className="nova-guide-count">Step {guide.i + 1} of {guide.steps.length}</span>
            <span className="nova-guide-title">{guide.title}</span>
            <button className="nova-guide-x" onClick={() => setGuide(null)} aria-label="Stop the walkthrough">×</button>
          </div>
          <div className="nova-guide-dots" aria-hidden="true">{guide.steps.map((_, k) => <i key={k} className={k <= guide.i ? 'on' : ''} />)}</div>
          <NovaSays mood={guide.i === guide.steps.length - 1 ? 'cheer' : 'wink'} key={`${guide.title}-${guide.i}`} size={60}>
            {first ? `First, let's open ${guide.route!.label.replace(/^Open /, '')}.` : step}
          </NovaSays>
          <div className="nova-guide-go">
            <button className="btn ghost small" onClick={() => go(-1)} disabled={guide.i === 0}>Back</button>
            {first
              ? <button className="btn primary small" onClick={openScreen}>{guide.route!.label}</button>
              : <button className="btn primary small" onClick={() => go(1)}>{guide.i === guide.steps.length - 1 ? 'All done!' : 'Next'}</button>}
          </div>
        </section>
      )}
      <button className={`ask-nova-fab no-print${seen ? '' : ' fresh'}`} onClick={show} aria-label="Ask Nova a question">
        <Nova mood="wink" size={58} act={act} />
        <span className="ask-nova-pill">Ask Nova</span>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Ask Nova">
        <div className="ask-nova stack">
          <NovaSays mood={said.mood} key={said.line} size={76}>{said.line}</NovaSays>
          <form className="ask-nova-form" onSubmit={e => void submit(q, e)}>
            <input ref={input} className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="How do I…" aria-label="Your question for Nova" enterKeyHint="search" />
            <button className="btn primary" type="submit">Ask</button>
          </form>
          {answers?.length ? (
            <div className="ask-nova-answers">
              {answers.map(a => (
                <article key={a.id} className="ask-nova-answer">
                  <span className="ask-nova-from">{a.from}</span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                  {a.steps && a.steps.length > 1 && (
                    <ol className="ask-nova-steps">{a.steps.map(s => <li key={s}>{s.replace(/ Tap the button below and I'll come with you\.$/, '')}</li>)}</ol>
                  )}
                  <div className="ask-nova-go">
                    {a.steps && a.steps.length > 1 && <button className="btn primary small" onClick={() => startGuide(a)}>Show me step by step</button>}
                    {a.route && <Link className="btn ghost small" to={a.route.to} onClick={() => setOpen(false)}>{a.route.label}</Link>}
                    {academy && a.lessonId && <Link className="btn ghost small" to={`/lessons/${a.lessonId}`} onClick={() => setOpen(false)}>Take the lesson</Link>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="ask-nova-starters">
              <span className="muted small">Try one of these</span>
              <div className="chips">{STARTERS.map(s => <button key={s} type="button" className="chip" onClick={() => void submit(s)}>{s}</button>)}</div>
            </div>
          )}
          <p className="muted small ask-nova-tip">Psst: double tap me for my Ka-ching, or press and hold me for a curtsy.</p>
        </div>
      </Sheet>
    </>
  )
}
