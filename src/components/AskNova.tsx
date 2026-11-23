import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Nova, NovaSays, type NovaMood, type NovaMove } from './Nova'
import Sheet from './Sheet'
import type { Answer } from '../lib/novaBrain'
import { hasAcademy } from '../lib/plan'
import { useSession } from '../lib/session'

/* Ask Nova: Nova floats in the corner of every screen. Tap her to ask how to do anything in the
   app. She answers from the Dazzle University lessons and takes you straight to the screen. */

const SEEN_KEY = 'askNovaSeen'
const HIDE_ON = [/^\/lessons\/./, /^\/on-air\//]
// Her brain (the lesson search) loads the first time someone opens Ask Nova, not with the app.
const brain = () => import('../lib/novaBrain')
const STARTERS = ['How do Live Numbers work?', 'How do I print tags?', 'How do I pack an order?', 'Where do I add tracking?', 'How do I set up my shelves?', 'How do I run a sale?']
const FOUND = ['Ooh, I know this one!', 'Easy. Here you go, love.', 'Say less. Here\'s how.', 'Got you, boss.']

export default function AskNova() {
  const { pathname } = useLocation()
  const { shop } = useSession()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [said, setSaid] = useState<{ mood: NovaMood; line: string }>({ mood: 'wink', line: 'Hey love! What can I help you with? Ask me how to do anything in the app.' })
  const [answers, setAnswers] = useState<Answer[] | null>(null)
  const [act, setAct] = useState<[NovaMove, number] | undefined>()
  const [seen, setSeen] = useState(() => { try { return localStorage.getItem(SEEN_KEY) === '1' } catch { return true } })
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => { if (open) { void brain(); setTimeout(() => input.current?.focus(), 250) } }, [open])

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
      setSaid({ mood: 'cheer', line: FOUND[Math.floor(Math.random() * FOUND.length)] })
    } else {
      setSaid({ mood: 'oops', line: "Hmm, I don't know that one yet. Try other words, like \"print tags\" or \"add tracking\", or tap a question below." })
    }
  }

  const academy = hasAcademy(shop?.plan)
  return (
    <>
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
                  {a.points?.length ? <ul>{a.points.map(p => <li key={p}>{p}</li>)}</ul> : null}
                  <div className="ask-nova-go">
                    {a.route && <Link className="btn primary small" to={a.route.to} onClick={() => setOpen(false)}>{a.route.label}</Link>}
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
