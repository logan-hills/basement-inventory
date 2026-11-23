import { supabase } from './supabase'

export type Live = {
  id: string; title: string; theme: string | null; starts_at: string; duration_min: number
  host: string | null; notes: string | null; status: string
  items?: { qty: number; sale_price: number | null; variant: { price: number | null } | null }[]
}

export type LiveItem = {
  id: string; live_id: string; variant_id: string; qty: number; sale_price: number | null; sort: number
  variant: {
    id: string; label: string; live_number: string; price: number | null; cost: number | null; weight_lb: number | null
    item: { id: string; name: string; brand: string | null; category: string | null; description: string | null; tags?: string[] }
    units: { status: string; location: { code: string } | null }[]
  }
}

const LIVE_SELECT = 'id,title,theme,starts_at,duration_min,host,notes,status, items:live_items(qty,sale_price, variant:variants(price))'

export async function loadLives(from?: Date, to?: Date): Promise<Live[]> {
  let q = supabase.from('lives').select(LIVE_SELECT).order('starts_at')
  if (from) q = q.gte('starts_at', from.toISOString())
  if (to) q = q.lt('starts_at', to.toISOString())
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as any
}

export async function loadLive(id: string) {
  const { data, error } = await supabase.from('lives').select('id,title,theme,starts_at,duration_min,host,notes,status').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) return null
  const { data: items } = await supabase.from('live_items')
    .select('id,live_id,variant_id,qty,sale_price,sort, variant:variants(id,label,live_number,price,cost,weight_lb,upc, item:items(*), units(status, location:locations(code)))')
    .eq('live_id', id).order('sort').order('created_at')
  return { live: data as Live, items: (items ?? []) as any as LiveItem[] }
}

/** What the live brings in if everything on its list sells. */
export function projected(l: Live) {
  return (l.items ?? []).reduce((s, i) => s + i.qty * Number(i.sale_price ?? i.variant?.price ?? 0), 0)
}

export const liveEnd = (l: Live) => new Date(new Date(l.starts_at).getTime() + l.duration_min * 60000)

export function liveWhen(l: Live) {
  const s = new Date(l.starts_at)
  const day = s.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: s.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' })
  const t = (d: Date) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return `${day} · ${t(s)} to ${t(liveEnd(l))}`
}

export function durationText(min: number) {
  const h = Math.floor(min / 60), m = min % 60
  return [h ? `${h} hr` : '', m ? `${m} min` : ''].filter(Boolean).join(' ')
}
