import { supabase } from './supabase'

export type Variant = {
  id: string
  item_id: string
  label: string
  live_number: string
  price: number | null
  weight_lb?: number | null
  in_stock?: number
}

export type Item = {
  id: string
  name: string
  brand: string | null
  category: string | null
  description: string | null
  created_at: string
  variants: Variant[]
  photos: { id: string; path: string; sort: number }[]
}

export type Unit = {
  id: string
  tag_code: string
  status: string
  variant_id: string
}

const PHOTO_BUCKET = 'item-photos'

/** Shrinks a phone photo to at most 1600px on the long side, JPEG ~80%. */
export async function compressImage(file: File, maxSide = 1600): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Could not process photo'))), 'image/jpeg', 0.8),
  )
}

export async function uploadPhotos(shopId: string, itemId: string, files: File[], startSort = 0) {
  for (let i = 0; i < files.length; i++) {
    const blob = await compressImage(files[i])
    const path = `${shopId}/${itemId}/${crypto.randomUUID()}.jpg`
    const up = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: 'image/jpeg' })
    if (up.error) throw up.error
    const ins = await supabase.from('item_photos').insert({ shop_id: shopId, item_id: itemId, path, sort: startSort + i })
    if (ins.error) throw ins.error
  }
}

export async function photoUrls(paths: string[]): Promise<Record<string, string>> {
  if (paths.length === 0) return {}
  const { data } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrls(paths, 60 * 60)
  const out: Record<string, string> = {}
  for (const row of data ?? []) if (row.path && row.signedUrl) out[row.path] = row.signedUrl
  return out
}

/** Creates `count` new tag rows for a variation, numbered after any existing tags (e.g. 4821-001). */
export async function addUnits(shopId: string, variant: { id: string; live_number: string }, count: number, locationId: string | null = null) {
  if (count <= 0) return
  const { data: existing, error } = await supabase.from('units').select('tag_code').eq('variant_id', variant.id)
  if (error) throw error
  let max = 0
  for (const u of existing ?? []) {
    const n = parseInt(String(u.tag_code).split('-')[1] ?? '0', 10)
    if (n > max) max = n
  }
  const rows = Array.from({ length: count }, (_, i) => ({
    shop_id: shopId,
    variant_id: variant.id,
    tag_code: `${variant.live_number}-${String(max + i + 1).padStart(3, '0')}`,
    location_id: locationId,
  }))
  const ins = await supabase.from('units').insert(rows)
  if (ins.error) throw ins.error
}

export async function loadItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('id,name,brand,category,description,created_at, variants(id,item_id,label,live_number,price,weight_lb, units(status)), photos:item_photos(id,path,sort)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((it: any) => ({
    ...it,
    photos: [...(it.photos ?? [])].sort((a: any, b: any) => a.sort - b.sort),
    variants: (it.variants ?? []).map((v: any) => ({
      ...v,
      in_stock: (v.units ?? []).filter((u: any) => u.status === 'in_stock').length,
    })),
  }))
}

export function money(n: number | null | undefined) {
  return n == null ? '' : `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const DAMAGE_REASONS = ['Damaged', 'Stained', 'Missing', 'Defective', 'Other'] as const

export type UnitInfo = {
  id: string
  tag_code: string
  status: string
  removed_reason: string | null
  variant: { id: string; label: string; live_number: string; price: number | null; item: { id: string; name: string } }
  location: { code: string; name: string } | null
}

export const UNIT_SELECT = 'id, tag_code, status, removed_reason, variant:variants!inner(id,label,live_number,price, item:items!inner(id,name)), location:locations(code,name)'

/** Finds a tag by its barcode (e.g. 4821-001). */
export async function findUnit(code: string): Promise<UnitInfo | null> {
  const { data } = await supabase.from('units').select(UNIT_SELECT).eq('tag_code', code.trim().toUpperCase()).maybeSingle()
  return (data as any) ?? null
}

/** Finds a variation by Live Number (e.g. 4821). */
export async function findByLiveNumber(live: string) {
  const { data } = await supabase.from('variants').select('id,label,live_number,price,item:items!inner(id,name)').eq('live_number', live).maybeSingle()
  return (data as any) ?? null
}

export async function damageOut(shopId: string, unitId: string, reason: string, note: string) {
  const { error } = await supabase.from('units').update({
    status: 'removed', removed_reason: reason, removed_note: note || null, removed_at: new Date().toISOString(),
  }).eq('id', unitId)
  if (error) throw error
  await supabase.from('movements').insert({ shop_id: shopId, unit_id: unitId, action: `damage_out:${reason}` })
}

export async function restoreUnit(shopId: string, unitId: string) {
  const { error } = await supabase.from('units').update({
    status: 'in_stock', removed_reason: null, removed_note: null, removed_at: null,
  }).eq('id', unitId)
  if (error) throw error
  await supabase.from('movements').insert({ shop_id: shopId, unit_id: unitId, action: 'restore' })
}
