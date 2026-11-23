import { useEffect, useState } from 'react'

/** The live-prep cart: variations picked for an upcoming live. Kept on this device until checkout. */
export type CartLine = { variantId: string; qty: number; salePrice: number | null; name: string; label: string; live: string; price: number | null; cost: number | null }

const KEY = 'liveCart'
const EVT = 'livecart-change'

function read(): CartLine[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}
function write(lines: CartLine[]) {
  try { localStorage.setItem(KEY, JSON.stringify(lines)) } catch { /* ignore */ }
  window.dispatchEvent(new Event(EVT))
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>(read)
  useEffect(() => {
    const on = () => setLines(read())
    window.addEventListener(EVT, on); window.addEventListener('storage', on)
    return () => { window.removeEventListener(EVT, on); window.removeEventListener('storage', on) }
  }, [])
  return {
    lines,
    count: lines.reduce((s, l) => s + l.qty, 0),
    total: lines.reduce((s, l) => s + l.qty * Number(l.salePrice ?? l.price ?? 0), 0),
    add(line: Omit<CartLine, 'qty' | 'salePrice'>, qty = 1, max = Infinity) {
      const cur = read()
      const ex = cur.find(l => l.variantId === line.variantId)
      if (ex) ex.qty = Math.min(max, ex.qty + qty)
      else cur.push({ ...line, qty: Math.min(max, qty), salePrice: null })
      write(cur)
    },
    set(variantId: string, patch: Partial<CartLine>) { write(read().map(l => (l.variantId === variantId ? { ...l, ...patch } : l)).filter(l => l.qty > 0)) },
    remove(variantId: string) { write(read().filter(l => l.variantId !== variantId)) },
    clear() { write([]) },
  }
}
