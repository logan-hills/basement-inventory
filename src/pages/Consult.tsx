import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sheet from '../components/Sheet'
import { useSession } from '../lib/session'
import { QUEEN_SESSION as Q, consultPrice, consultDeposit } from '../lessons/classes'

/* Schedule time with the Queen: a paid 1:1 business consult. Sellers learn how pricing works,
   prepare, and send a request that arrives as an email with everything the Queen needs. */

const TOPICS: { name: string; glyph: string; blurb: string }[] = [
  { name: 'Strategy and planning', glyph: '♛', blurb: 'Goals, a plan for the year, what to do first' },
  { name: 'Money and pricing', glyph: '$', blurb: 'Pricing, profit, and where the money goes' },
  { name: 'Sourcing and vendors', glyph: '◆', blurb: 'Where to buy, how much, and from whom' },
  { name: 'Marketing and social media', glyph: '✦', blurb: 'Posts, reels, AI helpers, getting seen' },
  { name: 'Lives and sales', glyph: '●', blurb: 'Running lives that sell, themes, flow' },
  { name: 'Operations and packing', glyph: '▣', blurb: 'Stock, shipping, packing, saving time' },
  { name: 'Making it official and taxes', glyph: '§', blurb: 'LLC, permits, records, sales tax basics' },
  { name: 'Something else', glyph: '❖', blurb: 'Anything on your mind, big or small' },
]
const LENGTHS = [0.5, 1, 1.5, 2, 3]
const PLAN = ['Yes, I\'ll bring it', 'It\'s in progress', 'Not yet']
const fmt = (n: number) => `$${n % 1 ? n.toFixed(2) : n}`
const len = (h: number) => (h < 1 ? `${h * 60} minutes` : `${h} hour${h === 1 ? '' : 's'}`)

export default function Consult() {
  const { shop } = useSession()
  const [topics, setTopics] = useState<string[]>([])
  const [goal, setGoal] = useState('')
  const [now, setNow] = useState('')
  const [plan, setPlan] = useState(PLAN[0])
  const [when, setWhen] = useState<'Daytime' | 'Evening'>('Daytime')
  const [hours, setHours] = useState(1)
  const price = consultPrice(hours)
  const deposit = consultDeposit(hours)
  const addIdea = (idea: string) => setGoal(g => (g.includes(idea) ? g : `${g.trim() ? `${g.trim()}\n` : ''}• ${idea}`))
  const toggle = (t: string) => setTopics(x => (x.includes(t) ? x.filter(y => y !== t) : [...x, t]))
  const ready = topics.length > 0 && goal.trim().length > 0
  const [picker, setPicker] = useState<0 | 1 | null>(null)
  const topicCards = (
    <div className="consult-topics">{TOPICS.map(t => {
      const on = topics.includes(t.name)
      return (
        <button key={t.name} type="button" aria-pressed={on} className={`consult-topic${on ? ' on' : ''}`} onClick={() => toggle(t.name)}>
          <span className="consult-topic-glyph" aria-hidden="true">{t.glyph}</span>
          <span className="consult-topic-text"><b>{t.name}</b><small>{t.blurb}</small></span>
          <span className="consult-topic-check" aria-hidden="true">{on ? '✓' : ''}</span>
        </button>
      )
    })}</div>
  )
  const ideaChips = (
    <div className="consult-chips">{Q.ideas.map(i => <button key={i} type="button" className={`consult-chip idea${goal.includes(i) ? ' on' : ''}`} onClick={() => addIdea(i)}>{goal.includes(i) ? '✓ ' : '+ '}{i}</button>)}</div>
  )

  const body = [
    `Shop: ${shop?.name ?? ''}`,
    `Length: ${len(hours)} (estimate ${fmt(price)})`,
    `Deposit to book (50%): ${fmt(deposit)}, balance ${fmt(price - deposit)} after the session`,
    `Best time: ${when}`,
    `Topics: ${topics.join(', ')}`,
    `Business plan: ${plan}`,
    '',
    'What I want to work on:',
    goal.trim(),
    '',
    'What I\'m doing now:',
    now.trim() || '(not filled in)',
  ].join('\n')
  const href = `mailto:${Q.email}?subject=${encodeURIComponent(`Schedule time with the Queen: ${shop?.name ?? 'my shop'}`)}&body=${encodeURIComponent(body)}`

  return (
    <div className="uni stack wide-gap consult">
      <header className="uni-queen consult-hero">
        <div className="uni-queen-copy">
          <span className="uni-class-day">{Q.tagline}</span>
          <h1 className="consult-title">{Q.title}</h1>
          <p>{Q.what}</p>
          <span className="uni-queen-cred">♛ {Q.credential}</span>
        </div>
        <div className="uni-queen-price">
          <span className="uni-queen-first"><small>Your first full hour</small><b>{fmt(Q.rate * (1 - Q.firstHourOff))}</b><em>{Math.round(Q.firstHourOff * 100)}% off</em></span>
          <span className="uni-queen-then">Then {fmt(Q.rate)} an hour, prorated</span>
        </div>
      </header>

      <section className="stack">
        <div className="uni-section-head"><span className="uni-eyebrow">How pricing works</span><h2 className="uni-h2">Use the full hour. It's worth it!</h2></div>
        <div className="consult-rates">
          <div><b>{fmt(Q.rate * (1 - Q.firstHourOff))}</b><span>Your first full hour, {Math.round(Q.firstHourOff * 100)}% off</span></div>
          <div><b>{fmt(Q.rate)}/hr</b><span>Each additional hour, prorated by the minute. 30 more minutes is {fmt(Q.rate / 2)}.</span></div>
          <div><b>No discount</b><span>On a session shorter than an hour. It's prorated at {fmt(Q.rate)} an hour, so 30 minutes is {fmt(consultPrice(0.5))}, the same as a full first hour.</span></div>
          <div><b>{Math.round(Q.deposit * 100)}% to book</b><span>Pay half up front to hold your time, the rest after your session. A full first hour is {fmt(consultPrice(1))}, so the deposit is {fmt(consultDeposit(1))}.</span></div>
          <div><b>About {fmt(Q.researchRate)}/hr</b><span>Follow-up research and written solutions, when your question needs digging. You'll get the estimate before any research starts.</span></div>
        </div>
      </section>

      <section className="stack">
        <div className="uni-section-head"><span className="uni-eyebrow">Come prepared</span><h2 className="uni-h2">Bring these to your session</h2></div>
        <ul className="consult-prep">
          <li><b>Your questions</b> and what you want to walk away with</li>
          <li><b>Your current business plan</b>, even if it's one page or still in progress</li>
          <li><b>What you're doing now</b>: how you buy, sell, price, ship and market</li>
          <li><b>Your numbers</b>: sales, orders and average order from Reports</li>
          <li><b>Your biggest challenge</b> right now, in one sentence</li>
        </ul>
        <p className="uni-sub">New to planning? Take <Link to="/lessons/strategy1">Strategic planning, part 1</Link> and the <Link to="/lessons/consult">Get the most from time with the Queen</Link> lesson first.</p>
      </section>

      <section className="stack consult-form">
        <div className="uni-section-head"><span className="uni-eyebrow">Request a session</span><h2 className="uni-h2">Tell the Queen what you need</h2></div>

        <fieldset><legend>What do you want to talk about? Pick any.</legend>
          {topicCards}
        </fieldset>

        <div className="consult-ideas">
          <span>Need ideas? Tap any to add it.</span>
          {ideaChips}
        </div>
        <label>What do you want to work on?
          <textarea rows={4} value={goal} onChange={e => setGoal(e.target.value)} placeholder="My questions, and what I want to leave the session with…" />
        </label>
        <label>What are you doing now?
          <textarea rows={3} value={now} onChange={e => setNow(e.target.value)} placeholder="How I buy, sell, price and ship today…" />
        </label>

        <fieldset><legend>Do you have a business plan?</legend>
          <div className="consult-chips">{PLAN.map(p => <button key={p} type="button" aria-pressed={plan === p} className={`consult-chip${plan === p ? ' on' : ''}`} onClick={() => setPlan(p)}>{p}</button>)}</div>
        </fieldset>

        <fieldset><legend>Best time for you</legend>
          <div className="consult-chips">{(['Daytime', 'Evening'] as const).map(w => <button key={w} type="button" aria-pressed={when === w} className={`consult-chip${when === w ? ' on' : ''}`} onClick={() => setWhen(w)}>{w}</button>)}</div>
        </fieldset>

        <fieldset><legend>How long?</legend>
          <div className="consult-chips">{LENGTHS.map(h => <button key={h} type="button" aria-pressed={hours === h} className={`consult-chip${hours === h ? ' on' : ''}`} onClick={() => setHours(h)}>{len(h)}<small>{fmt(consultPrice(h))} · {fmt(consultDeposit(h))} to book</small></button>)}</div>
        </fieldset>

        <div className="consult-total">
          <span>Estimated session cost</span>
          <b>{fmt(price)}</b>
          <span className="consult-deposit">Deposit to book today: <b>{fmt(deposit)}</b> · Balance after your session: {fmt(price - deposit)}</span>
          {hours < 1 && <small>Tip: a full hour is the same price with the first-hour discount. Use the full hour, it's worth it!</small>}
          {hours >= 1 && <small>Includes {Math.round(Q.firstHourOff * 100)}% off your first hour. Follow-up research, if you want it, is about {fmt(Q.researchRate)} an hour and quoted first.</small>}
        </div>

        {ready
          ? <a className="btn uni-cta consult-send" href={href}>♛ Send my request</a>
          : <button type="button" className="btn uni-cta consult-send" onClick={() => setPicker(topics.length ? 1 : 0)}>♛ {topics.length ? 'Tell us what you want to work on' : 'Pick your topics'}</button>}
        <p className="consult-small">Your request opens as an email to the Queen at {Q.email}. She'll reply to confirm a time and send how to pay your {fmt(deposit)} deposit. Your time is booked once the deposit is paid. Sessions are business consulting, not legal or tax advice.</p>
      </section>

      <Sheet open={picker !== null} onClose={() => setPicker(null)} title={picker === 1 ? 'What do you want to leave with?' : 'What shall we talk about?'} wide>
        <div className="stack consult-picker">
          <div className="consult-steps" aria-label={`Step ${(picker ?? 0) + 1} of 2`}><i className="on" /><i className={picker === 1 ? 'on' : ''} /></div>
          {picker === 1 ? (
            <>
              <p className="consult-picker-sub">Tap any idea to add it, or write your own. A sentence or two is plenty.</p>
              {ideaChips}
              <label className="consult-picker-goal">In your words
                <textarea rows={4} value={goal} onChange={e => setGoal(e.target.value)} placeholder="My questions, and what I want to leave the session with…" />
              </label>
              <div className="row-between">
                <button type="button" className="btn ghost" onClick={() => setPicker(0)}>‹ Topics</button>
                <button type="button" className="btn gold" disabled={!goal.trim()} onClick={() => setPicker(null)}>{goal.trim() ? '♛ All set' : 'Add a line first'}</button>
              </div>
            </>
          ) : (
            <>
              <p className="consult-picker-sub">Pick as many as you like. The Queen will shape your session around them.</p>
              {topicCards}
              <div className="row-between">
                <span className="consult-picker-count">{topics.length ? `${topics.length} picked` : 'Nothing picked yet'}</span>
                <button type="button" className="btn gold" disabled={!topics.length} onClick={() => setPicker(1)}>Next ›</button>
              </div>
            </>
          )}
        </div>
      </Sheet>
    </div>
  )
}
