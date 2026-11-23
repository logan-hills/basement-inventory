import { supabase } from './supabase'

/** One sellable variation with everything the planning screens need. */
export type StockRow = {
  id: string; label: string; live_number: string; price: number | null; cost: number | null; weight_lb: number | null
  item: { id: string; name: string; brand: string | null; category: string | null; description: string | null; tags: string[]; created_at: string; photo: string | null }
  inStock: number
  sold: number
  bins: string[]
  ageDays: number
}

export async function loadStock(): Promise<StockRow[]> {
  const { data, error } = await supabase
    .from('variants')
    .select('id,label,live_number,price,cost,weight_lb, item:items!inner(*, photos:item_photos(path,sort)), units(status,created_at, location:locations(code))')
  if (error) throw error
  const now = Date.now()
  return (data ?? []).map((v: any) => {
    const inStock = (v.units ?? []).filter((u: any) => u.status === 'in_stock')
    const oldest = inStock.reduce((m: number, u: any) => Math.min(m, new Date(u.created_at).getTime()), new Date(v.item.created_at).getTime())
    const photos = [...(v.item.photos ?? [])].sort((a: any, b: any) => a.sort - b.sort)
    return {
      id: v.id, label: v.label, live_number: v.live_number, price: v.price, cost: v.cost, weight_lb: v.weight_lb,
      item: { id: v.item.id, name: v.item.name, brand: v.item.brand, category: v.item.category, description: v.item.description, tags: v.item.tags ?? [], created_at: v.item.created_at, photo: photos[0]?.path ?? null },
      inStock: inStock.length,
      sold: (v.units ?? []).filter((u: any) => ['packed', 'shipped', 'picked'].includes(u.status)).length,
      bins: [...new Set(inStock.map((u: any) => u.location?.code).filter(Boolean))] as string[],
      ageDays: Math.floor((now - oldest) / 86400000),
    }
  })
}

export const margin = (r: { price: number | null; cost: number | null }) =>
  r.price != null && r.cost != null && r.price > 0 ? (r.price - r.cost) / r.price : null
