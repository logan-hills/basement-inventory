import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import PosterStudio from '../components/PosterMaker'
import { Ring } from '../components/Charts'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { compressImage, money, photoUrls } from '../lib/data'
import { liveWhen, projected, type Live } from '../lib/lives'
import { ENGAGEMENT_IDEAS, PALETTES, POSTER_STYLES, posterPhotos, progress, savePlan, stepKey, steps, uid, type Phase, type Plan, type Poster } from '../lib/planner'
import { feedbackOk, tap } from '../lib/feedback'

const TABS = [['plan', 'Plan', 'sparkle'], ['inspo', 'Inspiration', 'lessons'], ['poster', 'Poster', 'print'], ['check', 'Checklist', 'pack']] as const
const PHASES: [Phase, string, string][] = [['before', 'Before the live', 'Get set up'], ['during', 'During the live', 'Shine on camera'], ['after', 'After the live', 'Wrap it up']]

export default function LivePlan() {
  const { id } = useParams()
  const { shop, settings } = useSession()
  const toast = useToast()
  const [live, setLive] = useState<(Live & { plan: Plan; items?: any[] }) | null | undefined>(undefined)
  const [plan, setPlan] = useState<Plan>({})
  const [tab, setTab] = useState<typeof TABS[number][0]>(() => (location.hash.includes('tab=') ? (location.hash.split('tab=')[1] as any) : 'plan'))
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved'>('idle')
  const timer = useRef<number>(0)

  useEffect(() => {
    supabase.from('lives').select('id,title,theme,starts_at,duration_min,host,notes,status,plan, items:live_items(qty,sale_price, variant:variants(price))').eq('id', id!).maybeSingle()
      .then(({ data }) => { setLive((data as any) ?? null); setPlan(((data as any)?.plan ?? {}) as Plan) })
  }, [id])

  // Photos of the pieces picked for this live, so they can go on the poster.
  const [products, setProducts] = useState<{ path: string; label: string }[]>([])
  useEffect(() => {
    supabase.from('live_items').select('sort, variant:variants(label, item:items(name, photos:item_photos(path,sort)))').eq('live_id', id!).order('sort')
      .then(({ data }) => {
        const seen = new Set<string>(); const out: { path: string; label: string }[] = []
        for (const r of (data ?? []) as any[]) {
          const it = r.variant?.item; const ph = [...(it?.photos ?? [])].sort((a: any, b: any) => a.sort - b.sort)[0]
          if (ph && !seen.has(ph.path)) { seen.add(ph.path); out.push({ path: ph.path, label: it.name }) }
        }
        setProducts(out.slice(0, 18))
      }, () => null)
  }, [id])

  const imagePaths = useMemo(() => [...(plan.inspiration ?? []).filter(i => i.kind === 'image' && i.path).map(i => i.path!), ...products.map(p => p.path)], [plan.inspiration, products])
  useEffect(() => { if (imagePaths.some(p => !urls[p])) photoUrls(imagePaths).then(u => setUrls(x => ({ ...x, ...u }))) }, [imagePaths]) // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback((patch: Partial<Plan>) => {
    setPlan(prev => {
      const next = { ...prev, ...patch }
      window.clearTimeout(timer.current)
      setSaving('saving')
      timer.current = window.setTimeout(() => {
        savePlan(id!, next).then(() => setSaving('saved')).catch(e => { setSaving('idle'); toast(e.message.includes('plan') ? 'The planner needs a quick database update first.' : e.message, { kind: 'bad' }) })
      }, 600)
      return next
    })
  }, [id, toast])

  if (live === undefined) return <p className="muted">Loading…</p>
  if (live === null) return <div className="empty card"><b>That live wasn't found</b><Link className="btn ghost" to="/planner">Planner</Link></div>

  const pr = progress(settings.checklist, plan)
  const start = new Date(live.starts_at)
  const look = POSTER_STYLES.find(x => x.id === plan.poster?.template)
  const poster: Poster = {
    template: 'noir', palette: 6, size: 'portrait', font: 'auto', foil: look ? !!look.luxe : true, perks: [], badge: '', handle: '',
    kicker: start.toDateString() === new Date().toDateString() ? 'LIVE TONIGHT' : 'GOING LIVE',
    headline: live.title,
    when: `${start.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} · ${start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`,
    tagline: plan.vibe ?? '',
    footer: `Facebook Live · ${shop?.name ?? ''}`,
    ...(plan.poster ?? {}),
  } as Poster
  const setPoster = (patch: Partial<Poster>) => update({ poster: { ...(plan.poster ?? {}), ...patch } })

  async function addImages(files: FileList | null) {
    if (!files || !shop) return []
    const added = []
    for (const f of Array.from(files)) {
      const blob = await compressImage(f, 1400)
      const path = `${shop.id}/planner/${id}/${uid()}.jpg`
      const up = await supabase.storage.from('item-photos').upload(path, blob, { contentType: 'image/jpeg' })
      if (up.error) { toast(up.error.message, { kind: 'bad' }); continue }
      added.push({ id: uid(), kind: 'image' as const, path })
    }
    update({ inspiration: [...(plan.inspiration ?? []), ...added] })
    return added.map(a => a.path)
  }

  function toggle(phase: Phase, text: string) {
    const k = stepKey(phase, text)
    const was = !!plan.checked?.[k]
    update({ checked: { ...(plan.checked ?? {}), [k]: !was } })
    if (!was) { tap(); const after = progress(settings.checklist, { ...plan, checked: { ...(plan.checked ?? {}), [k]: true } }); if (after.done === after.total) { feedbackOk(); toast('Every step done. Go shine, Queen! 👑', { kind: 'ok' }) } }
  }

  return (
    <div className="stack wide-gap">
      <Link to="/planner" className="back-link">‹ Planner</Link>
      <div className="plan-hero">
        <div className="grow stack tight-gap">
          <span className="script">{live.theme && live.theme !== live.title ? live.theme : 'Your live plan'}</span>
          <h1>{live.title}</h1>
          <span>{liveWhen(live)}{live.host ? ` · with ${live.host}` : ''}</span>
          <span className="small">{(live.items ?? []).reduce((a: number, i: any) => a + i.qty, 0)} items planned · <b>{money(projected(live))}</b> if everything sells</span>
          <div className="row-gap">
            <Link className="btn gold" to={`/live?for=${live.id}`}><Icon name="cart" size={18} />Pick items</Link>
            <Link className="btn glass" to={`/lives/${live.id}`}>Item list & bot CSV</Link>
          </div>
        </div>
        <Ring value={pr.pct} label="Checklist progress"><small>ready</small></Ring>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map(([k, label, icon]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><Icon name={icon} size={18} />{label}</button>
        ))}
        <span className="save-state muted small">{saving === 'saving' ? 'Saving…' : saving === 'saved' ? 'Saved ✓' : ''}</span>
      </div>

      {tab === 'plan' && (
        <div className="settings-grid">
          <section className="card stack">
            <h2>The vibe</h2>
            <label>In one line, what's this live about?<input value={plan.vibe ?? ''} onChange={e => update({ vibe: e.target.value })} placeholder="Sparkle, sequins and party-ready pieces" /></label>
            <span className="label-text">Color story</span>
            <div className="palette-row">
              {PALETTES.map((p, i) => (
                <button key={p.name} className={`palette ${poster.palette === i ? 'on' : ''}`} onClick={() => setPoster({ palette: i })} title={p.name}>
                  <span style={{ background: `linear-gradient(135deg, ${p.c[0]}, ${p.c[1]} 70%, ${p.c[2]})` }} /><small>{p.name}</small>
                </button>
              ))}
            </div>
            <label>What I'm wearing<input value={plan.outfit ?? ''} onChange={e => update({ outfit: e.target.value })} placeholder="Gold hoops and the emerald blouse" /></label>
            <label>Music and set<input value={plan.music ?? ''} onChange={e => update({ music: e.target.value })} placeholder="Neo-soul playlist, ring light, velvet backdrop" /></label>
          </section>
          <section className="card stack">
            <h2>Ideas and hooks</h2>
            <textarea rows={6} value={plan.ideas ?? ''} onChange={e => update({ ideas: e.target.value })} placeholder={'• Open with the best piece\n• Bundle deal at the halfway mark'} />
            <label>Giveaway<input value={plan.giveaway ?? ''} onChange={e => update({ giveaway: e.target.value })} placeholder="Share the live to win a mystery bag" /></label>
            <span className="label-text">Need a spark? Tap one to add it.</span>
            <div className="chip-list">{ENGAGEMENT_IDEAS.slice(0, 5).map(e => <button key={e} className="idea-chip" onClick={() => update({ ideas: `${plan.ideas ? plan.ideas + '\n' : ''}• ${e}` })}>{e}</button>)}</div>
          </section>
          <section className="card stack">
            <h2>Run of show</h2>
            <p className="muted small">Plan the flow so the energy never drops.</p>
            {(plan.segments ?? []).map((s, i) => (
              <div key={s.id} className="segment-row">
                <input aria-label="Time" value={s.time} onChange={e => update({ segments: plan.segments!.map(x => x.id === s.id ? { ...x, time: e.target.value } : x) })} placeholder="7:00" />
                <input aria-label="What happens" value={s.title} onChange={e => update({ segments: plan.segments!.map(x => x.id === s.id ? { ...x, title: e.target.value } : x) })} placeholder={i === 0 ? 'Welcome and giveaway rules' : 'Next segment'} />
                <button className="icon-btn" aria-label="Remove" onClick={() => update({ segments: plan.segments!.filter(x => x.id !== s.id) })}>×</button>
              </div>
            ))}
            <button className="btn dashed" onClick={() => update({ segments: [...(plan.segments ?? []), { id: uid(), time: '', title: '' }] })}>+ Add a segment</button>
            {!(plan.segments ?? []).length && (
              <button className="link-btn self-start" onClick={() => update({ segments: [['7:00', 'Welcome, shout-outs, giveaway rules'], ['7:10', 'Best pieces first'], ['7:40', 'Bundle deals'], ['8:15', 'Giveaway winner'], ['8:30', 'Last call and thank-yous']].map(([time, title]) => ({ id: uid(), time, title })) })}>Use a starter run of show</button>
            )}
          </section>
        </div>
      )}

      {tab === 'inspo' && (
        <div className="stack">
          <div className="row-gap">
            <label className="btn gold file-btn"><Icon name="upload" size={18} />Add photos<input type="file" accept="image/*" multiple onChange={e => { addImages(e.target.files); e.target.value = '' }} /></label>
            <button className="btn ghost" onClick={() => { const url = prompt('Paste a link (Pinterest, Instagram, a video…)'); if (url) update({ inspiration: [...(plan.inspiration ?? []), { id: uid(), kind: 'link', url }] }) }}>Add a link</button>
            <button className="btn ghost" onClick={() => update({ inspiration: [...(plan.inspiration ?? []), { id: uid(), kind: 'note', text: '' }] })}>Add a note</button>
          </div>
          {!(plan.inspiration ?? []).length && <div className="empty card"><b>Your mood board is empty</b><span className="muted">Drop in outfit pics, set ideas, color swatches, flyers you love and notes. Anything that gets you excited to go live.</span></div>}
          <div className="moodboard">
            {(plan.inspiration ?? []).map(i => (
              <div key={i.id} className={`mood ${i.kind}`}>
                {i.kind === 'image' && (urls[i.path!] ? <img src={urls[i.path!]} alt="" /> : <div className="skeleton-list"><div /></div>)}
                {i.kind === 'link' && <a href={i.url} target="_blank" rel="noreferrer"><Icon name="arrow" size={16} />{i.url!.replace(/^https?:\/\/(www\.)?/, '').slice(0, 60)}</a>}
                {i.kind === 'note' && <textarea rows={4} value={i.text ?? ''} placeholder="Write an idea…" onChange={e => update({ inspiration: plan.inspiration!.map(x => x.id === i.id ? { ...x, text: e.target.value } : x) })} />}
                <div className="mood-actions">
                  {i.kind === 'image' && <button className="link-btn" onClick={() => { setPoster({ photos: [...posterPhotos(poster).filter(x => x !== i.path), i.path!].slice(-3), photo: null }); setTab('poster') }}>Use on poster</button>}
                  <button className="link-btn danger-text" onClick={() => update({ inspiration: plan.inspiration!.filter(x => x.id !== i.id) })}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'poster' && (
        <PosterStudio poster={poster} setPoster={setPoster} shop={shop?.name ?? ''} onOpenInspo={() => setTab('inspo')} onUpload={addImages}
          photoChoices={[
            ...(plan.inspiration ?? []).filter(i => i.kind === 'image' && i.path && urls[i.path]).map(i => ({ path: i.path!, url: urls[i.path!], label: 'Mood board' })),
            ...products.filter(p => urls[p.path]).map(p => ({ path: p.path, url: urls[p.path], label: p.label })),
          ]}
          fileName={`${live.title.replace(/[^\w$ -]+/g, '').trim().replace(/\s+/g, '-')}-poster.png`} />
      )}

      {tab === 'check' && (
        <div className="check-grid">
          {PHASES.map(([phase, title, sub]) => {
            const list = steps(settings.checklist, plan).filter(s => s.phase === phase)
            const done = list.filter(s => plan.checked?.[stepKey(phase, s.text)]).length
            return (
              <section key={phase} className={`card stack check-col ${phase}`}>
                <div className="row-between"><div><h2>{title}</h2><span className="muted small">{sub}</span></div><b className="check-count">{done}/{list.length}</b></div>
                {list.map(s => {
                  const on = !!plan.checked?.[stepKey(phase, s.text)]
                  return (
                    <button key={s.text} className={`check-item ${on ? 'on' : ''}`} onClick={() => toggle(phase, s.text)}>
                      <span className="check-box">{on ? '✓' : ''}</span><span className="grow">{s.text}</span>
                      {s.extra && <span className="link-btn danger-text" role="button" aria-label="Remove step" onClick={e => { e.stopPropagation(); update({ extra: (plan.extra ?? []).filter(x => !(x.phase === phase && x.text === s.text)) }) }}>×</span>}
                    </button>
                  )
                })}
                <form className="input-suffix" onSubmit={e => { e.preventDefault(); const f = e.currentTarget.elements.namedItem('t') as HTMLInputElement; const t = f.value.trim(); if (t) { update({ extra: [...(plan.extra ?? []), { phase, text: t }] }); f.value = '' } }}>
                  <input name="t" placeholder="Add a step just for this live" /><button className="btn ghost small">Add</button>
                </form>
              </section>
            )
          })}
          <p className="muted small">Want different steps on every live? Change them in <Link to="/settings/checklist">Settings, Live checklists</Link>.</p>
        </div>
      )}
    </div>
  )
}
