import { useState } from 'react'
import Sheet from './Sheet'
import { CLASS_TZ, type LiveClass } from '../lessons/classes'
import { nextDates, prettyDate } from '../lib/classSignups'
import { to12, to24, WEEKDAYS, type ScheduleRow, useLiveClasses } from '../lib/classSchedule'

/* For the Queen (hosts of the community calendar): pick the day each live class meets, its daytime
   and evening times, and tap off any date there's no class. Sellers see the change right away. */

type Draft = { weekday: number; day: string; evening: string; skip: string[] }

const draftOf = (c: LiveClass): Draft => ({
  weekday: c.weekday,
  day: to24(c.sessions.find(s => s.label === 'Daytime')?.time ?? '12:00 PM'),
  evening: to24(c.sessions.find(s => s.label === 'Evening')?.time ?? '7:00 PM'),
  skip: c.skip ?? [],
})

export default function ClassScheduleEditor({ onClose }: { onClose: () => void }) {
  const { classes, save } = useLiveClasses()
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() => Object.fromEntries(classes.map(c => [c.id, draftOf(c)])))
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const set = (id: string, patch: Partial<Draft>) => { setMsg(null); setDrafts(d => ({ ...d, [id]: { ...d[id], ...patch } })) }

  async function saveAll() {
    setBusy(true); setMsg(null)
    const today = new Date().toISOString().slice(0, 10)
    for (const c of classes) {
      const d = drafts[c.id]
      const row: ScheduleRow = { class_id: c.id, weekday: d.weekday, day_time: to12(d.day), evening_time: to12(d.evening), skip_dates: d.skip.filter(x => x >= today).sort() }
      const err = await save(row)
      if (err) { setBusy(false); setMsg({ ok: false, text: err }); return }
    }
    setBusy(false)
    setMsg({ ok: true, text: 'Saved! Sellers see the new class times now.' })
  }

  return (
    <Sheet open onClose={onClose} title="Edit class times" wide>
      <div className="stack sched">
        <div className="pop-banner foil">
          <small>♛ Hosts only · Class schedule</small>
          <b>Set the week's live classes</b>
          <span>Pick the day and times for each class. Tap a date to mark it "No class" for a holiday or a week off. Times are {CLASS_TZ}.</span>
        </div>
        {classes.map(c => {
          const d = drafts[c.id]
          const upcoming = nextDates({ ...c, weekday: d.weekday, skip: [] }, to12(d.day), 8)
          return (
            <section key={c.id} className={`sched-class tone-${c.tone}`}>
              <h3>{c.title}</h3>
              <fieldset>
                <legend>Day</legend>
                <div className="class-chips sched-days">
                  {WEEKDAYS.map((w, i) => (
                    <button key={w} type="button" aria-pressed={d.weekday === i} className={`class-chip${d.weekday === i ? ' on' : ''}`} onClick={() => set(c.id, { weekday: i })}>
                      <b>{w.slice(0, 3)}</b>
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="sched-times">
                <label>Daytime<input type="time" value={d.day} onChange={e => e.target.value && set(c.id, { day: e.target.value })} /></label>
                <label>Evening<input type="time" value={d.evening} onChange={e => e.target.value && set(c.id, { evening: e.target.value })} /></label>
              </div>
              <fieldset>
                <legend>Upcoming {WEEKDAYS[d.weekday]}s</legend>
                <div className="class-chips">
                  {upcoming.map(date => {
                    const off = d.skip.includes(date)
                    return (
                      <button key={date} type="button" aria-pressed={!off} className={`class-chip sched-date${off ? ' off' : ' on'}`}
                        onClick={() => set(c.id, { skip: off ? d.skip.filter(x => x !== date) : [...d.skip, date] })}>
                        <b>{prettyDate(date)}</b><small>{off ? 'No class' : 'Class'}</small>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            </section>
          )
        })}
        {msg && <p className={msg.ok ? 'sched-ok' : 'error'}>{msg.text}</p>}
        <button type="button" className="btn gold big" disabled={busy} onClick={saveAll}>{busy ? 'Saving…' : 'Save class times'}</button>
        <button type="button" className="btn ghost" onClick={onClose}>Close</button>
      </div>
    </Sheet>
  )
}
