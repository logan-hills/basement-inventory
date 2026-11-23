import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { addUnits, money } from '../lib/data'
import { downloadFile, parseCsv, toCsv } from '../lib/csv'
import { loadBins } from '../lib/locations'
import { feedbackOk } from '../lib/feedback'

const COLUMNS = ['Item name', 'Variation', 'Quantity', 'Price', 'Cost', 'Brand', 'Category', 'Weight (lb)', 'Bin code', 'Notes', 'Tags', 'UPC'] as const
type Key = 'name' | 'variation' | 'qty' | 'price' | 'cost' | 'brand' | 'category' | 'weight' | 'bin' | 'notes' | 'tags' | 'upc'
const KEYS: Key[] = ['name', 'variation', 'qty', 'price', 'cost', 'brand', 'category', 'weight', 'bin', 'notes', 'tags', 'upc']

type Row = Record<Key, string> & { line: number; errors: string[]; binId: string | null }
type Group = { key: string; name: string; brand: string; category: string; notes: string; tags: string[]; variants: { label: string; qty: number; price: number | null; cost: number | null; weight: number | null; binId: string | null; bin: string; upc: string }[] }

function headerKey(h: string): Key | null {
  const t = h.toLowerCase().replace(/[^a-z]/g, '')
  if (t.startsWith('itemname') || t === 'name' || t === 'item' || t === 'title') return 'name'
  if (t.startsWith('variation') || t === 'variant' || t === 'size' || t === 'option') return 'variation'
  if (t.startsWith('qty') || t.startsWith('quantity')) return 'qty'
  if (t.startsWith('price')) return 'price'
  if (t.startsWith('cost')) return 'cost'
  if (t.startsWith('brand')) return 'brand'
  if (t.startsWith('category')) return 'category'
  if (t.startsWith('weight')) return 'weight'
  if (t.startsWith('bin') || t.startsWith('location')) return 'bin'
  if (t === 'upc' || t.startsWith('barcode') || t === 'ean' || t === 'gtin') return 'upc'
  if (t.startsWith('tag')) return 'tags'
  if (t.startsWith('note') || t.startsWith('description')) return 'notes'
  return null
}

const num = (v: string) => (v.trim() === '' ? null : Number(v.replace(/[$,\s]/g, '')))

export default function BulkReceive() {
  const { shop, settings, updateSettings } = useSession()
  const [rows, setRows] = useState<Row[] | null>(null)
  const [fileName, setFileName] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState<{ items: string[]; variants: number; tags: number } | null>(null)
  const [err, setErr] = useState('')

  function template() {
    downloadFile('receive-items-template.csv', toCsv([[...COLUMNS]]) + '\r\n')
  }

  async function onFile(file: File | undefined) {
    if (!file) return
    setErr(''); setDone(null); setFileName(file.name)
    const grid = parseCsv(await file.text())
    if (grid.length < 2) { setErr('That file has no item rows under the header.'); setRows(null); return }
    const map = grid[0].map(headerKey)
    if (!map.includes('name') || !map.includes('qty')) { setErr('The file needs at least "Item name" and "Quantity" columns. Download the template to start from.'); setRows(null); return }
    const bins = await loadBins().catch(() => [])
    const binBy = new Map(bins.map(b => [b.code.toUpperCase(), b.id]))
    const parsed: Row[] = grid.slice(1).map((cells, i) => {
      const r = { line: i + 2, errors: [] as string[], binId: null } as unknown as Row
      KEYS.forEach(k => { r[k] = '' })
      map.forEach((k, ci) => { if (k) r[k] = (cells[ci] ?? '').trim() })
      if (!r.name) r.errors.push('Missing item name')
      const q = Number(r.qty)
      if (!Number.isInteger(q) || q < 1) r.errors.push('Quantity must be a whole number, 1 or more')
      if (r.price && Number.isNaN(num(r.price)!)) r.errors.push('Price is not a number')
      if (r.cost && Number.isNaN(num(r.cost)!)) r.errors.push('Cost is not a number')
      if (r.weight && Number.isNaN(num(r.weight)!)) r.errors.push('Weight is not a number')
      if (r.bin) {
        r.binId = binBy.get(r.bin.toUpperCase()) ?? null
        if (!r.binId) r.errors.push(`Bin ${r.bin} doesn't exist yet`)
      }
      return r
    })
    setRows(parsed)
  }

  const groups = useMemo<Group[]>(() => {
    if (!rows) return []
    const out = new Map<string, Group>()
    for (const r of rows) {
      if (r.errors.length) continue
      const key = `${r.name.toLowerCase()}|${r.brand.toLowerCase()}`
      let g = out.get(key)
      if (!g) { g = { key, name: r.name, brand: r.brand, category: r.category, notes: r.notes, tags: r.tags.split(/[;|]/).map(t => t.trim()).filter(Boolean), variants: [] }; out.set(key, g) }
      const label = r.variation || 'One size'
      const existing = g.variants.find(v => v.label.toLowerCase() === label.toLowerCase() && v.binId === r.binId)
      if (existing) existing.qty += Number(r.qty)
      else g.variants.push({ label, qty: Number(r.qty), price: num(r.price), cost: num(r.cost), weight: num(r.weight), binId: r.binId, bin: r.bin, upc: (r as any).upc ?? '' })
    }
    return [...out.values()]
  }, [rows])

  const errorCount = rows?.filter(r => r.errors.length).length ?? 0
  const totalTags = groups.reduce((s, g) => s + g.variants.reduce((a, v) => a + v.qty, 0), 0)
  const totalVariants = groups.reduce((s, g) => s + new Set(g.variants.map(v => v.label.toLowerCase())).size, 0)

  async function importAll() {
    if (!shop) return
    setBusy(true); setErr(''); setProgress(0)
    const itemIds: string[] = []
    let tags = 0
    try {
      for (let gi = 0; gi < groups.length; gi++) {
        const g = groups[gi]
        const { data: item, error } = await supabase.from('items')
          .insert({ shop_id: shop.id, name: g.name, brand: g.brand || null, category: g.category || null, description: g.notes || null, ...(g.tags.length ? { tags: g.tags } : {}) })
          .select('id').single()
        if (error) throw error
        itemIds.push(item.id)
        const labels = [...new Map(g.variants.map(v => [v.label.toLowerCase(), v])).values()]
        const { data: vs, error: vErr } = await supabase.from('variants')
          .insert(labels.map(v => ({ shop_id: shop.id, item_id: item.id, label: v.label, price: v.price, cost: v.cost, weight_lb: v.weight, ...(v.upc ? { upc: v.upc.trim() } : {}) })))
          .select('id,label,live_number')
        if (vErr) throw vErr
        for (const v of g.variants) {
          const created = vs!.find(x => x.label.toLowerCase() === v.label.toLowerCase())!
          await addUnits(shop.id, created, v.qty, v.binId)
          tags += v.qty
        }
        setProgress(Math.round(((gi + 1) / groups.length) * 100))
      }
      feedbackOk()
      setDone({ items: itemIds, variants: totalVariants, tags })
      // New categories and tags from the file join the Settings lists.
      const newCats = [...new Set(groups.map(g => g.category).filter(c => c && !settings.categories.some(x => x.toLowerCase() === c.toLowerCase())))]
      const newTags = [...new Set(groups.flatMap(g => g.tags).filter(t => !settings.itemTags.some(x => x.toLowerCase() === t.toLowerCase())))]
      if (newCats.length || newTags.length) updateSettings({ categories: [...settings.categories, ...newCats], itemTags: [...settings.itemTags, ...newTags] }).catch(() => {})
      setRows(null)
    } catch (e: any) {
      setErr(`Stopped after ${itemIds.length} item(s): ${e.message ?? e}. Items already added are saved; remove them from the file before uploading again.`)
      if (itemIds.length) setDone({ items: itemIds, variants: 0, tags })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><span className="eyebrow">Stock · Receive items</span><h1>Bulk receive</h1></div>
        <Link to="/intake" className="btn ghost">Add one item instead</Link>
      </div>

      {done && (
        <div className="card success-card stack">
          <b className="big-text">Received {done.items.length} item{done.items.length === 1 ? '' : 's'} · {done.tags} tag{done.tags === 1 ? '' : 's'}</b>
          <span className="muted">Every variation has its own Live Number. Print the tags now, or later from Inventory.</span>
          <div className="row-gap">
            <Link className="btn gold" to={`/labels?items=${done.items.join(',')}`}>Print {done.tags} label{done.tags === 1 ? '' : 's'}</Link>
            <Link className="btn ghost" to="/inventory">View inventory</Link>
          </div>
        </div>
      )}

      <ol className="steps">
        <li className="card">
          <span className="step-num">1</span>
          <div className="stack">
            <b>Download the template</b>
            <span className="muted">Open it in Excel, Google Sheets or Numbers. One row per item and variation. Rows with the same item name become one item with several variations.</span>
            <button className="btn outline-gold" onClick={template}>Download CSV template</button>
          </div>
        </li>
        <li className="card">
          <span className="step-num">2</span>
          <div className="stack">
            <b>Fill it in</b>
            <div className="table-box">
              <table className="data-table">
                <thead><tr>{COLUMNS.map(c => <th key={c}>{c}</th>)}</tr></thead>
                <tbody>
                  <tr><td>Croc handbag</td><td>Emerald</td><td>3</td><td>38</td><td>12</td><td></td><td>Bags</td><td>1.6</td><td>A3-S2-C-01</td><td></td></tr>
                  <tr><td>Croc handbag</td><td>Black</td><td>2</td><td>38</td><td>12</td><td></td><td>Bags</td><td>1.6</td><td>A3-S2-C-01</td><td></td></tr>
                  <tr><td>Gold chain necklace</td><td></td><td>14</td><td>2</td><td>0.5</td><td></td><td>Jewelry</td><td></td><td></td><td>18 inch</td></tr>
                </tbody>
              </table>
            </div>
            <span className="muted small">Only Item name and Quantity are required. Bin code is optional and must match a bin you've created. Separate several tags with a semicolon, like New arrival; Clearance. Save as CSV when you're done.</span>
          </div>
        </li>
        <li className="card">
          <span className="step-num">3</span>
          <div className="stack">
            <b>Upload it</b>
            <label className="drop">
              <input type="file" accept=".csv,text/csv" hidden onChange={e => { onFile(e.target.files?.[0]); e.target.value = '' }} />
              <span>{fileName ? `Choose a different file (${fileName})` : 'Choose your CSV file'}</span>
            </label>
          </div>
        </li>
      </ol>

      {err && <p className="danger-text">{err}</p>}

      {rows && (
        <div className="stack">
          <div className="page-head">
            <div>
              <h2>Check before importing</h2>
              <span className="muted">{groups.length} item{groups.length === 1 ? '' : 's'} · {totalVariants} variation{totalVariants === 1 ? '' : 's'} · {totalTags} tag{totalTags === 1 ? '' : 's'}{errorCount ? ` · ${errorCount} row${errorCount === 1 ? '' : 's'} with problems` : ''}</span>
            </div>
            <button className="btn primary" disabled={busy || groups.length === 0 || errorCount > 0} onClick={importAll}>
              {busy ? `Importing… ${progress}%` : `Import and assign Live Numbers`}
            </button>
          </div>
          {errorCount > 0 && <p className="danger-text">Fix the rows marked in red in your spreadsheet, save, and upload again.</p>}
          {busy && <div className="progress"><span style={{ width: `${progress}%` }} /></div>}
          <div className="table-box">
            <table className="data-table">
              <thead><tr><th>Row</th><th>Item</th><th>Variation</th><th>Qty</th><th>Price</th><th className="hide-sm">Weight</th><th className="hide-sm">Bin</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.line} className={r.errors.length ? 'row-error' : ''}>
                    <td className="muted">{r.line}</td>
                    <td>{r.name}</td>
                    <td>{r.variation || 'One size'}</td>
                    <td>{r.qty}</td>
                    <td>{r.price ? money(num(r.price)) : ''}</td>
                    <td className="hide-sm">{r.weight ? `${r.weight} lb` : ''}</td>
                    <td className="hide-sm mono">{r.bin}</td>
                    <td>{r.errors.length ? <span className="danger-text">{r.errors.join('; ')}</span> : <span className="ok-text">Ready</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
