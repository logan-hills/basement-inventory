import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Sheet from '../components/Sheet'
import { supabase } from '../lib/supabase'
import { money } from '../lib/data'
import { addressLines, STATUS_LABEL, type Customer } from '../lib/orders'
import { downloadFile, toCsv } from '../lib/csv'
import { customerMissing } from '../lib/customers'
import { useToast } from '../lib/toast'

type Row = Customer & { orders: { id: string; code: string; status: string; total: number | null; live_date: string | null; created_at: string }[] }

export default function Customers() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'spent' | 'recent' | 'name' | 'orders'>('spent')
  const [open, setOpen] = useState<Row | null>(null)
  const [params, setParams] = useSearchParams()
  const needsOnly = params.get('needs') === '1'
  const toast = useToast()
  const [form, setForm] = useState<Record<string, string> | null>(null)

  const load = () => supabase.from('customers').select('*, orders(id,code,status,total,live_date,created_at)').then(({ data }) => setRows((data ?? []) as any))
  useEffect(() => { load() }, [])
  const needCount = (rows ?? []).filter(c => customerMissing(c).length).length

  const FIELDS: [string, string][] = [['name', 'Name'], ['handle', 'Facebook name'], ['email', 'Email'], ['phone', 'Phone'], ['address1', 'Address'], ['address2', 'Apt / suite'], ['city', 'City'], ['state', 'State'], ['zip', 'ZIP'], ['country', 'Country']]
  async function saveCustomer() {
    if (!open || !form) return
    const patch = Object.fromEntries(FIELDS.map(([k]) => [k, (form[k] ?? '').trim() || null]))
    if (!patch.name) { toast('Add a name', { kind: 'bad' }); return }
    const { error } = await supabase.from('customers').update(patch).eq('id', open.id)
    if (error) { toast(error.message, { kind: 'bad' }); return }
    toast('Saved', { kind: 'ok' })
    const next = { ...open, ...patch } as Row
    setOpen(next); setForm(null)
    setRows(list => (list ?? []).map(c => (c.id === open.id ? next : c)))
  }

  const spent = (c: Row) => c.orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total ?? 0), 0)
  const last = (c: Row) => c.orders.reduce((m, o) => (o.created_at > m ? o.created_at : m), '')

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase()
    const list = (rows ?? []).filter(c => (!needsOnly || customerMissing(c).length) && (!s || [c.name, c.handle, c.email, c.phone, c.city].some(v => (v ?? '').toLowerCase().includes(s))))
    const by = { spent: (a: Row, b: Row) => spent(b) - spent(a), recent: (a: Row, b: Row) => last(b).localeCompare(last(a)), name: (a: Row, b: Row) => a.name.localeCompare(b.name), orders: (a: Row, b: Row) => b.orders.length - a.orders.length }
    return list.sort(by[sort])
  }, [rows, q, sort, needsOnly])

  function exportCsv() {
    downloadFile('customers.csv', toCsv([['Name', 'Handle', 'Email', 'Phone', 'Address 1', 'Address 2', 'City', 'State', 'Zip', 'Country', 'Orders', 'Total spent', 'Last order'],
      ...shown.map(c => [c.name, c.handle, c.email, c.phone, c.address1, c.address2, c.city, c.state, c.zip, c.country, c.orders.length, spent(c).toFixed(2), last(c).slice(0, 10)])]) + '\r\n')
  }

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><h1>Customers</h1></div>
        <div className="row-gap"><button className="btn ghost" disabled={!shown.length} onClick={exportCsv}>Download CSV</button></div>
      </div>
      <div className="filter-bar">
        <input type="search" className="search grow" placeholder="Search name, Facebook name, email or phone" value={q} onChange={e => setQ(e.target.value)} />
        <button className={`chip ${needsOnly ? 'on' : ''}`} onClick={() => setParams(needsOnly ? {} : { needs: '1' })}>Needs details{needCount ? ` (${needCount})` : ''}</button>
        <select value={sort} onChange={e => setSort(e.target.value as any)} aria-label="Sort">
          <option value="spent">Top spenders</option><option value="recent">Most recent</option><option value="orders">Most orders</option><option value="name">Name A–Z</option>
        </select>
      </div>
      {!rows ? <div className="skeleton-list"><div /><div /><div /></div> : shown.length === 0 ? (
        <div className="empty card"><b>{rows.length ? 'No customers match' : 'No customers yet'}</b><span className="muted">Customers are added automatically when you upload a live's sales.</span><Link to="/orders/upload" className="btn primary">Upload live sales</Link></div>
      ) : (
        <div className="table-box">
          <table className="data-table clickable">
            <thead><tr><th>Customer</th><th className="hide-sm">Location</th><th>Orders</th><th>Spent</th><th className="hide-sm">Last order</th></tr></thead>
            <tbody>
              {shown.map(c => (
                <tr key={c.id} onClick={() => setOpen(c)}>
                  <td><b>{c.name}</b>{c.handle && c.handle !== c.name ? <span className="muted"> · {c.handle}</span> : null}{c.orders.length >= 3 && <span className="chip-mini vip">Repeat</span>}{customerMissing(c).length > 0 && <span className="chip-mini warn">Needs {customerMissing(c).join(', ')}</span>}</td>
                  <td className="hide-sm muted">{[c.city, c.state].filter(Boolean).join(', ')}</td>
                  <td>{c.orders.length}</td>
                  <td className="gold">{money(spent(c))}</td>
                  <td className="hide-sm muted">{last(c) ? new Date(last(c)).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!open} onClose={() => { setOpen(null); setForm(null) }} title={open?.name ?? ''}>
        {open && form && (
          <div className="stack">
            {FIELDS.map(([k, label]) => <label key={k}>{label}<input value={form[k] ?? ''} onChange={e => setForm({ ...form, [k]: e.target.value })} /></label>)}
            <div className="row-gap"><button className="btn gold" onClick={saveCustomer}>Save</button><button className="btn ghost" onClick={() => setForm(null)}>Cancel</button></div>
          </div>
        )}
        {open && !form && (
          <div className="stack">
            {customerMissing(open).length > 0 && <p className="warn-box">Missing {customerMissing(open).join(', ')}. Add it before you ship.</p>}
            <button className="btn outline-gold self-start" onClick={() => setForm(Object.fromEntries(FIELDS.map(([k]) => [k, String((open as any)[k] ?? '')])))}>Edit details</button>
            {open.handle && <span className="muted">{open.handle}</span>}
            {addressLines(open).map((a, i) => <span key={i}>{a}</span>)}
            {open.email && <a href={`mailto:${open.email}`}>{open.email}</a>}
            {open.phone && <a href={`tel:${open.phone}`}>{open.phone}</a>}
            <div className="row-between total-row"><span>{open.orders.length} order{open.orders.length === 1 ? '' : 's'}</span><b className="gold">{money(spent(open))}</b></div>
            {[...open.orders].sort((a, b) => b.created_at.localeCompare(a.created_at)).map(o => (
              <Link key={o.id} to={`/order/${o.code}`} className="box-row">
                <span className="mono gold">{o.code}</span>
                <span className="grow muted small">{o.live_date ? new Date(o.live_date + 'T12:00').toLocaleDateString() : new Date(o.created_at).toLocaleDateString()}</span>
                <span>{money(o.total)}</span>
                <span className={`status-pill ${o.status}`}>{STATUS_LABEL[o.status] ?? o.status}</span>
              </Link>
            ))}
          </div>
        )}
      </Sheet>
    </div>
  )
}
