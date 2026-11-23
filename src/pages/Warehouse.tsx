import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { binCode, binName, loadBins, type Bin } from '../lib/locations'
import Sheet from '../components/Sheet'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default function Warehouse() {
  const { shop } = useSession()
  const toast = useToast()
  const navigate = useNavigate()
  const [bins, setBins] = useState<Bin[] | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [creating, setCreating] = useState(false)
  const [view, setView] = useState<'map' | 'list'>('map')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setSel(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })

  // generator form
  const [aisleFrom, setAisleFrom] = useState('1')
  const [aisleTo, setAisleTo] = useState('1')
  const [sections, setSections] = useState('4')
  const [levels, setLevels] = useState('4')
  const [perLevel, setPerLevel] = useState('2')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const [b, u] = await Promise.all([
      loadBins(),
      supabase.from('units').select('location_id').eq('status', 'in_stock').not('location_id', 'is', null),
    ])
    const c: Record<string, number> = {}
    for (const row of (u.data ?? []) as any[]) c[row.location_id] = (c[row.location_id] ?? 0) + 1
    setBins(b)
    setCounts(c)
  }, [])
  useEffect(() => { load().catch(e => toast(e.message, { kind: 'bad' })) }, [load, toast])

  const plan = useMemo(() => {
    const a1 = parseInt(aisleFrom, 10), a2 = parseInt(aisleTo, 10)
    const s = parseInt(sections, 10), l = parseInt(levels, 10), p = parseInt(perLevel, 10)
    if (![a1, a2, s, l, p].every(n => Number.isInteger(n) && n > 0) || a2 < a1 || l > 26) return []
    const out: { aisle: number; section: number; level: string; bin: number }[] = []
    for (let a = a1; a <= a2; a++) for (let si = 1; si <= s; si++) for (let li = 0; li < l; li++) for (let b = 1; b <= p; b++)
      out.push({ aisle: a, section: si, level: LETTERS[li], bin: b })
    return out
  }, [aisleFrom, aisleTo, sections, levels, perLevel])

  const existing = useMemo(() => new Set((bins ?? []).map(b => b.code)), [bins])
  const newCount = plan.filter(p => !existing.has(binCode(p.aisle, p.section, p.level, p.bin))).length
  // Bins in the chosen aisles that the new layout no longer includes.
  const [removeExtra, setRemoveExtra] = useState(true)
  const extra = useMemo(() => {
    if (!plan.length) return { empty: [] as Bin[], full: [] as Bin[] }
    const want = new Set(plan.map(p => binCode(p.aisle, p.section, p.level, p.bin)))
    const a1 = plan[0].aisle, a2 = plan[plan.length - 1].aisle
    const out = (bins ?? []).filter(b => b.aisle != null && b.aisle >= a1 && b.aisle <= a2 && !want.has(b.code))
    return { empty: out.filter(b => !counts[b.id]), full: out.filter(b => counts[b.id]) }
  }, [plan, bins, counts])
  const removeCount = removeExtra ? extra.empty.length : 0

  /** Opens the layout editor pre-filled with what's already set up. */
  function openLayout() {
    const bs = (bins ?? []).filter(b => b.aisle != null)
    if (bs.length) {
      setAisleFrom(String(Math.min(...bs.map(b => b.aisle!))))
      setAisleTo(String(Math.max(...bs.map(b => b.aisle!))))
      setSections(String(Math.max(...bs.map(b => b.section ?? 1))))
      setLevels(String(Math.max(...bs.map(b => LETTERS.indexOf(b.level ?? 'A') + 1))))
      setPerLevel(String(Math.max(...bs.map(b => b.bin_no ?? 1))))
    }
    setCreating(true)
  }

  async function create() {
    if (!shop) return
    setBusy(true)
    if (removeCount) {
      const ids = extra.empty.map(b => b.id)
      for (let i = 0; i < ids.length; i += 200) {
        const { error } = await supabase.from('locations').delete().in('id', ids.slice(i, i + 200))
        if (error) { toast(error.message, { kind: 'bad' }); setBusy(false); return }
      }
    }
    const rows = plan
      .map(p => ({ shop_id: shop.id, kind: 'bin', aisle: p.aisle, section: p.section, level: p.level, bin_no: p.bin, code: binCode(p.aisle, p.section, p.level, p.bin), name: binName(p.aisle, p.section, p.level, p.bin) }))
      .filter(r => !existing.has(r.code))
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await supabase.from('locations').insert(rows.slice(i, i + 500))
      if (error) { toast(error.message, { kind: 'bad' }); setBusy(false); return }
    }
    setBusy(false)
    setCreating(false)
    toast([rows.length ? `Added ${rows.length} bin${rows.length === 1 ? '' : 's'}` : '', removeCount ? `removed ${removeCount}` : ''].filter(Boolean).join(', ') || 'Layout saved', { kind: 'ok' })
    load()
  }

  // Map structure: aisle → section → level → bins
  const tree = useMemo(() => {
    const t = new Map<number, Map<number, Map<string, Bin[]>>>()
    for (const b of bins ?? []) {
      if (b.aisle == null || b.section == null || !b.level) continue
      if (!t.has(b.aisle)) t.set(b.aisle, new Map())
      const a = t.get(b.aisle)!
      if (!a.has(b.section)) a.set(b.section, new Map())
      const s = a.get(b.section)!
      if (!s.has(b.level)) s.set(b.level, [])
      s.get(b.level)!.push(b)
    }
    return t
  }, [bins])

  const shown = (bins ?? []).filter(b => !q || b.code.toLowerCase().includes(q.toLowerCase()) || b.name.toLowerCase().includes(q.toLowerCase()))
  const maxCount = Math.max(1, ...Object.values(counts))

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><h1>Warehouse</h1></div>
        <div className="row-gap">
          {bins && bins.length > 0 && <Link className="btn ghost" to="/bin-labels">Print bin labels</Link>}
          <button className="btn primary" onClick={openLayout}>{bins && bins.length ? 'Edit layout' : '+ Add bins'}</button>
        </div>
      </div>

      {bins && bins.length === 0 && (
        <div className="empty card">
          <b>Set up your warehouse</b>
          <span className="muted">Every bin gets an address: aisle number, section number, shelf level letter and bin number, like <b className="gold mono">A3-S2-C-01</b>. Bins hold many different items. Create them in one go, print their labels, then scan a bin and its items to put stock away.</span>
          <button className="btn primary" onClick={() => setCreating(true)}>Create bins</button>
        </div>
      )}

      {bins && bins.length > 0 && (
        <>
          <div className="row-gap">
            <div className="seg" role="tablist">
              <button role="tab" aria-selected={view === 'map'} className={view === 'map' ? 'on' : ''} onClick={() => setView('map')}>Map</button>
              <button role="tab" aria-selected={view === 'list'} className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>List</button>
            </div>
            <span className="muted small">{bins.length} bins · {Object.values(counts).reduce((a, b) => a + b, 0)} units shelved</span>
          </div>

          {view === 'map' && (
            <div className="wh-map">
              {[...tree.entries()].map(([aisle, secs]) => (
                <section key={aisle} className="aisle">
                  <h2>Aisle {aisle}</h2>
                  <div className="aisle-row">
                    {[...secs.entries()].map(([section, lvls]) => (
                      <div key={section} className="section-col">
                        {[...lvls.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([level, list]) => (
                          <div key={level} className="level-row">
                            <span className="level-tag">{level}</span>
                            {list.map(b => {
                              const n = counts[b.id] ?? 0
                              return (
                                <button key={b.id} className={`bin-cell ${n ? 'full' : ''}`} style={n ? { ['--fill' as any]: String(0.25 + 0.75 * (n / maxCount)) } : undefined}
                                  onClick={() => navigate(`/bin/${b.id}`)} title={`${b.name} · ${n} units`} aria-label={`${b.name}, ${n} units`}>
                                  <span>{String(b.bin_no).padStart(2, '0')}</span>
                                  {n > 0 && <small>{n}</small>}
                                </button>
                              )
                            })}
                          </div>
                        ))}
                        <span className="section-tag">S{section}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
              <p className="muted small">Each column is a section, levels run top to bottom (highest letter on top). Gold bins have stock; brighter means fuller. Tap a bin to see what's in it.</p>
            </div>
          )}

          {view === 'list' && (
            <>
              <input type="search" className="search" placeholder="Search bin code, like A3-S2" value={q} onChange={e => setQ(e.target.value)} />
              {sel.size > 0 && (
                <div className="action-bar">
                  <span><b className="gold">{sel.size}</b> bin{sel.size === 1 ? '' : 's'} selected</span>
                  <div className="row-gap">
                    <Link className="btn gold" to={`/bin-labels?ids=${[...sel].join(',')}`}>Reprint labels</Link>
                    <button className="link-btn" onClick={() => setSel(new Set())}>Clear</button>
                  </div>
                </div>
              )}
              <div className="table-box">
                <table className="data-table clickable">
                  <thead><tr><th><input type="checkbox" aria-label="Select all" checked={shown.length > 0 && shown.every(b => sel.has(b.id))} onChange={e => setSel(e.target.checked ? new Set(shown.map(b => b.id)) : new Set())} /></th><th>Code</th><th>Aisle</th><th>Section</th><th>Level</th><th>Bin</th><th>Units</th></tr></thead>
                  <tbody>
                    {shown.map(b => (
                      <tr key={b.id} onClick={() => navigate(`/bin/${b.id}`)} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') navigate(`/bin/${b.id}`) }}>
                        <td onClick={e => e.stopPropagation()}><input type="checkbox" aria-label={`Select ${b.code}`} checked={sel.has(b.id)} onChange={() => toggle(b.id)} /></td>
                        <td className="mono gold">{b.code}</td><td>{b.aisle}</td><td>{b.section}</td><td>{b.level}</td><td>{b.bin_no}</td><td>{counts[b.id] ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      <Sheet open={creating} onClose={() => setCreating(false)} title={bins && bins.length ? 'Edit warehouse layout' : 'Add bins'}>
        <div className="stack">
          <p className="muted">Set how the aisles should look. New bins are added, and bins in these aisles that no longer fit can be removed. To change one aisle only, set First and Last aisle to that number.</p>
          <div className="row2">
            <label>First aisle #<input inputMode="numeric" value={aisleFrom} onChange={e => setAisleFrom(e.target.value.replace(/\D/g, ''))} /></label>
            <label>Last aisle #<input inputMode="numeric" value={aisleTo} onChange={e => setAisleTo(e.target.value.replace(/\D/g, ''))} /></label>
            <label>Sections per aisle<input inputMode="numeric" value={sections} onChange={e => setSections(e.target.value.replace(/\D/g, ''))} /></label>
            <label>Shelf levels (A, B, C…)<input inputMode="numeric" value={levels} onChange={e => setLevels(e.target.value.replace(/\D/g, ''))} /></label>
            <label>Bins per level<input inputMode="numeric" value={perLevel} onChange={e => setPerLevel(e.target.value.replace(/\D/g, ''))} /></label>
          </div>
          {extra.empty.length > 0 && (
            <label className="check-row"><input type="checkbox" checked={removeExtra} onChange={e => setRemoveExtra(e.target.checked)} /> Remove {extra.empty.length} empty bin{extra.empty.length === 1 ? '' : 's'} that aren't in this layout</label>
          )}
          {extra.full.length > 0 && (
            <p className="warn-box">{extra.full.length} bin{extra.full.length === 1 ? ' has' : 's have'} items in it, so {extra.full.length === 1 ? 'it stays' : 'they stay'}: {extra.full.slice(0, 6).map(b => b.code).join(', ')}{extra.full.length > 6 ? '…' : ''}. Move the items out first, then edit again.</p>
          )}
          {plan.length > 0 && (
            <p className="muted">Adds <b className="gold">{newCount}</b>{removeCount ? <>, removes <b className="danger-text">{removeCount}</b></> : ''}. Layout runs from <span className="mono">{binCode(plan[0].aisle, 1, 'A', 1)}</span> to <span className="mono">{binCode(plan[plan.length - 1].aisle, plan[plan.length - 1].section, plan[plan.length - 1].level, plan[plan.length - 1].bin)}</span>.</p>
          )}
          <button className="btn primary big" disabled={busy || (newCount === 0 && removeCount === 0)} onClick={create}>{busy ? 'Saving…' : newCount === 0 && removeCount === 0 ? 'Already matches this layout' : `Save layout: add ${newCount}${removeCount ? `, remove ${removeCount}` : ''}`}</button>
        </div>
      </Sheet>
    </div>
  )
}
