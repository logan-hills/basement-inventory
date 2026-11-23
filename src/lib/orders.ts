import { supabase } from './supabase'

export const ORDER_CODE_RE = /^DD-[2-9A-HJ-NP-Z]{6}$/
export const isOrderCode = (s: string) => ORDER_CODE_RE.test(s.trim().toUpperCase())

export type Customer = {
  id: string; name: string; handle: string | null; email: string | null; phone: string | null
  address1: string | null; address2: string | null; city: string | null; state: string | null; zip: string | null; country: string | null
}

export type OrderLine = {
  id: string; order_id: string; variant_id: string | null; live_number: string | null; description: string | null
  qty: number; price: number | null; picked: number; short: number
  variant?: { id: string; label: string; live_number: string; item: { id: string; name: string } } | null
}

export type Order = {
  id: string; code: string; status: string; live_date: string | null; external_ref: string | null; total: number | null
  tracking: string | null; carrier: string | null; created_at: string
  customer: Customer | null
  lines: OrderLine[]
}

export const ORDER_SELECT = 'id,code,status,live_date,external_ref,total,tracking,carrier,created_at, customer:customers(*), lines:order_lines(id,order_id,variant_id,live_number,description,qty,price,picked,short, variant:variants(id,label,live_number, item:items(id,name)))'

export async function loadOrders(filter?: { ids?: string[]; status?: string[] }): Promise<Order[]> {
  let q = supabase.from('orders').select(ORDER_SELECT).order('created_at', { ascending: false })
  if (filter?.ids) q = q.in('id', filter.ids)
  if (filter?.status) q = q.in('status', filter.status)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as any
}

export async function loadOrderByCode(code: string): Promise<Order | null> {
  const { data } = await supabase.from('orders').select(ORDER_SELECT).eq('code', code.trim().toUpperCase()).maybeSingle()
  return (data as any) ?? null
}

export const lineRemaining = (l: OrderLine) => Math.max(0, l.qty - l.picked - l.short)
export const orderUnits = (o: Order) => o.lines.reduce((s, l) => s + l.qty, 0)
export const orderPicked = (o: Order) => o.lines.reduce((s, l) => s + l.picked, 0)
export const orderRemaining = (o: Order) => o.lines.reduce((s, l) => s + lineRemaining(l), 0)

export function addressLines(c: Customer | null): string[] {
  if (!c) return []
  const cityLine = [c.city, [c.state, c.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ')
  return [c.address1, c.address2, cityLine, c.country && c.country.toUpperCase() !== 'US' && c.country.toUpperCase() !== 'USA' ? c.country : null].filter(Boolean) as string[]
}

export const STATUS_LABEL: Record<string, string> = {
  open: 'Ready to pick', picking: 'Picking', packed: 'Packed', shipped: 'Shipped', cancelled: 'Cancelled',
}
