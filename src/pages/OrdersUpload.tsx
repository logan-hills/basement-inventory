import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { parseCsv, toCsv, downloadFile } from '../lib/csv'
import { money } from '../lib/data'
import { feedbackOk } from '../lib/feedback'

const FIELDS = [
  { key: 'order', label: 'Order / invoice #', hints: ['orderid', 'ordernumber', 'order', 'invoice', 'invoicenumber', 'orderno'] },
  { key: 'name', label: 'Customer name', hints: ['customername', 'name', 'buyer', 'buyername', 'fullname', 'customer'] },
  { key: 'handle', label: 'Facebook name / username', hints: ['username', 'handle', 'facebook', 'fbname', 'facebookname', 'profile', 'user'] },
  { key: 'email', label: 'Email', hints: ['email', 'emailaddress', 'buyeremail'] },
  { key: 'phone', label: 'Phone', hints: ['phone', 'phonenumber', 'mobile', 'cell'] },
  { key: 'address1', label: 'Address line 1', hints: ['address', 'address1', 'addressline1', 'street', 'shippingaddress', 'streetaddress'] },
  { key: 'address2', label: 'Address line 2', hints: ['address2', 'addressline2', 'apt', 'suite', 'unit'] },
  { key: 'city', label: 'City', hints: ['city', 'town'] },
  { key: 'state', label: 'State', hints: ['state', 'province', 'region'] },
  { key: 'zip', label: 'ZIP', hints: ['zip', 'zipcode', 'postal', 'postalcode', 'postcode'] },
  { key: 'country', label: 'Country', hints: ['country'] },
  { key: 'live', label: 'Live #', hints: ['livenumber', 'live', 'liveno', 'itemnumber', 'item', 'number', 'code', 'sku', 'claim', 'claimnumber'] },
  { key: 'desc', label: 'Item description', hints: ['description', 'itemname', 'product', 'productname', 'title', 'itemdescription'] },
  { key: 'qty', label: 'Quantity', hints: ['qty', 'quantity', 'count'] },
  { key: 'price', label: 'Price', hints: ['price', 'amount', 'saleprice', 'itemprice', 'total'] },
] as const
type FieldKey = typeof FIELDS[number]['key']

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

function guessMap(headers: string[]): Record<FieldKey, number> {
  const map = {} as Record<FieldKey, number>
  const used = new Set<number>()
  for (const f of FIELDS) {
    let idx = headers.findIndex((h, i) => !used.has(i) && (f.hints as readonly string[]).includes(norm(h)))
    if (idx < 0) idx = headers.findIndex((h, i) => !used.has(i) && (f.hints as readonly string[]).some(x => x.length > 3 && norm(h).includes(x)))
    map[f.key] = idx
    if (idx >= 0) used.add(idx)
  }
  return map
}

type Draft = {
  key: string
  ref: string
  customer: Record<string, string>
  lines: { live: string; desc: string; qty: number; price: number | null; variantId: string | null; itemName: string | null }[]
}

export default function OrdersUpload() {
  const { shop } = useSession()
  const [headers, setHeaders] = useState<string[]>([])
  const [data, setData] = useState<string[][]>([])
  const [map, setMap] = useState<Record<FieldKey, number> | null>(null)
  const [variants, setVariants] = useState<Map<string, { id: string; name: string }>>(new Map())
  const [liveDate, setLiveDate] = useState(() => new Date().toLocaleDateString('en-CA'))
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<{ ids: string[]; lines: number } | null>(null)
  const [err, setErr] = useState('')
  const [fileName, setFileName] = useState('')

  async function onFile(f?: File) {
    if (!f) return
    setErr(''); setDone(null); setFileName(f.name)
    const grid = parseCsv(await f.text())
    if (grid.length < 2) { setErr('That file has no sale rows under the header.'); return }
    setHeaders(grid[0]); setData(grid.slice(1)); setMap(guessMap(grid[0]))
    const { data: vs } = await supabase.from('variants').select('id,live_number, item:items(name)')
    setVariants(new Map((vs ?? []).map((v: any) => [v.live_number, { id: v.id, name: v.item?.name ?? '' }])))
  }

  const drafts = useMemo<Draft[]>(() => {
    if (!map) return []
    const get = (row: string[], k: FieldKey) => (map[k] >= 0 ? (row[map[k]] ?? '').trim() : '')
    const out = new Map<string, Draft>()
    for (const row of data) {
      const ref = get(row, 'order')
      const name = get(row, 'name'), email = get(row, 'email'), handle = get(row, 'handle')
      const who = (email || handle || name).toLowerCase()
      if (!who && !ref) continue
      const key = ref ? `ref:${ref}` : `who:${who}`
      let d = out.get(key)
      if (!d) {
        d = { key, ref, customer: {}, lines: [] }
        out.set(key, d)
      }
      for (const f of ['name', 'handle', 'email', 'phone', 'address1', 'address2', 'city', 'state', 'zip', 'country'] as FieldKey[]) {
        const v = get(row, f); if (v && !d.customer[f]) d.customer[f] = v
      }
      const liveRaw = get(row, 'live').replace(/^#/, '')
      const live = /^\d{1,4}$/.test(liveRaw) ? liveRaw.padStart(4, '0') : liveRaw
      const qty = parseInt(get(row, 'qty') || '1', 10) || 1
      const priceRaw = get(row, 'price').replace(/[$,\s]/g, '')
      const v = variants.get(live)
      if (live || get(row, 'desc')) d.lines.push({ live, desc: get(row, 'desc'), qty, price: priceRaw ? Number(priceRaw) : null, variantId: v?.id ?? null, itemName: v?.name ?? null })
    }
    return [...out.values()].filter(d => d.lines.length)
  }, [map, data, variants])

  const unknown = drafts.reduce((s, d) => s + d.lines.filter(l => !l.variantId).length, 0)
  const lineCount = drafts.reduce((s, d) => s + d.lines.reduce((a, l) => a + l.qty, 0), 0)
  const noName = map && map.name < 0 && map.handle < 0 && map.email < 0

  async function importAll() {
    if (!shop) return
    setBusy(true); setErr('')
    const ids: string[] = []
    try {
      const { data: existing } = await supabase.from('customers').select('id,name,handle,email')
      const custs = (existing ?? []) as any[]
      const uploadId = crypto.randomUUID()
      for (const d of drafts) {
        const c = d.customer
        let cust = custs.find(x =>
          (c.email && x.email?.toLowerCase() === c.email.toLowerCase()) ||
          (c.handle && x.handle?.toLowerCase() === c.handle.toLowerCase()) ||
          (!c.email && !c.handle && c.name && x.name?.toLowerCase() === c.name.toLowerCase()))
        const fields = { name: c.name || c.handle || c.email || 'Customer', handle: c.handle || null, email: c.email || null, phone: c.phone || null, address1: c.address1 || null, address2: c.address2 || null, city: c.city || null, state: c.state || null, zip: c.zip || null, country: c.country || null }
        if (cust) {
          const patch = Object.fromEntries(Object.entries(fields).filter(([, v]) => v))
          await supabase.from('customers').update(patch).eq('id', cust.id)
        } else {
          const { data: nc, error } = await supabase.from('customers').insert({ shop_id: shop.id, ...fields }).select('id,name,handle,email').single()
          if (error) throw error
          cust = nc; custs.push(nc)
        }
        const total = d.lines.reduce((s, l) => s + (l.price ?? 0) * l.qty, 0)
        const { data: order, error: oErr } = await supabase.from('orders')
          .insert({ shop_id: shop.id, customer_id: cust.id, external_ref: d.ref || null, live_date: liveDate || null, total, upload_id: uploadId })
          .select('id').single()
        if (oErr) throw oErr
        ids.push(order.id)
        const { error: lErr } = await supabase.from('order_lines').insert(d.lines.map(l => ({
          shop_id: shop.id, order_id: order.id, variant_id: l.variantId, live_number: l.live || null, description: l.desc || l.itemName || null, qty: l.qty, price: l.price,
        })))
        if (lErr) throw lErr
      }
      feedbackOk()
      setDone({ ids, lines: lineCount })
      setData([]); setMap(null)
    } catch (e: any) {
      setErr(`Stopped after ${ids.length} order(s): ${e.message ?? e}`)
      if (ids.length) setDone({ ids, lines: 0 })
    } finally { setBusy(false) }
  }

  function template() {
    downloadFile('live-sales-template.csv', toCsv([['Order #', 'Customer name', 'Facebook name', 'Email', 'Phone', 'Address', 'Address 2', 'City', 'State', 'ZIP', 'Live #', 'Description', 'Qty', 'Price']]) + '\r\n')
  }

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><span className="eyebrow">Sell · Orders</span><h1>Upload live sales</h1></div>
        <Link to="/orders" className="btn ghost">All orders</Link>
      </div>

      {done && (
        <div className="card success-card stack">
          <b className="big-text">Created {done.ids.length} order{done.ids.length === 1 ? '' : 's'}{done.lines ? ` · ${done.lines} items to pick` : ''}</b>
          <span className="muted">Each order has its own ID for its box label, invoice and lookups.</span>
          <div className="row-gap">
            <Link className="btn gold" to={`/pick?orders=${done.ids.join(',')}`}>Start picking</Link>
            <Link className="btn ghost" to={`/box-labels?ids=${done.ids.join(',')}`}>Print box labels</Link>
          </div>
        </div>
      )}

      <div className="card stack">
        <b>Upload the sales CSV from your live-sale bot</b>
        <span className="muted">Any layout works. I match the columns automatically, and you can fix any match below. One order is made per customer (or per order number, if your file has one). Items are matched to inventory by Live #.</span>
        <div className="row-gap">
          <label className="drop grow">
            <input type="file" accept=".csv,text/csv" hidden onChange={e => { onFile(e.target.files?.[0]); e.target.value = '' }} />
            <span>{fileName ? `Choose a different file (${fileName})` : 'Choose the sales CSV'}</span>
          </label>
        </div>
        <button className="link-btn self-start" onClick={template}>No bot export? Download a blank sales template</button>
      </div>

      {err && <p className="danger-text">{err}</p>}

      {map && (
        <>
          <div className="card stack">
            <b>Column matches</b>
            <div className="map-grid">
              {FIELDS.map(f => (
                <label key={f.key}>{f.label}
                  <select value={map[f.key]} onChange={e => setMap({ ...map, [f.key]: Number(e.target.value) })}>
                    <option value={-1}>(not in file)</option>
                    {headers.map((h, i) => <option key={i} value={i}>{h || `Column ${i + 1}`}</option>)}
                  </select>
                </label>
              ))}
              <label>Live date<input type="date" value={liveDate} onChange={e => setLiveDate(e.target.value)} /></label>
            </div>
            {noName && <p className="danger-text">Match at least one of Customer name, Facebook name or Email so orders can be grouped by customer.</p>}
          </div>

          <div className="page-head">
            <div>
              <h2>{drafts.length} order{drafts.length === 1 ? '' : 's'} · {lineCount} item{lineCount === 1 ? '' : 's'}</h2>
              {unknown > 0 && <span className="danger-text small">{unknown} line{unknown === 1 ? '' : 's'} have a Live # that isn't in inventory. They'll still be added, flagged for you to check.</span>}
            </div>
            <button className="btn primary" disabled={busy || !drafts.length || !!noName} onClick={importAll}>{busy ? 'Creating orders…' : `Create ${drafts.length} orders`}</button>
          </div>

          <div className="order-preview">
            {drafts.map(d => (
              <div key={d.key} className="card stack tight">
                <div className="row-between"><b>{d.customer.name || d.customer.handle || d.customer.email}</b>{d.ref && <span className="muted small">#{d.ref}</span>}</div>
                <span className="muted small">{[d.customer.address1, d.customer.city, d.customer.state].filter(Boolean).join(', ') || 'No address in file'}</span>
                {d.lines.map((l, i) => (
                  <div key={i} className="line-row">
                    <span className={l.variantId ? 'gold strong' : 'danger-text strong'}>#{l.live || '—'}</span>
                    <span className="grow">{l.itemName || l.desc || 'Unknown item'}{l.qty > 1 ? ` × ${l.qty}` : ''}</span>
                    <span>{money(l.price)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
