import { supabase } from './supabase'

export type Bin = {
  id: string
  code: string
  name: string
  aisle: number | null
  section: number | null
  level: string | null
  bin_no: number | null
}

/** e.g. aisle 3, section 2, level C, bin 1 → "A3-S2-C-01" */
export function binCode(aisle: number, section: number, level: string, bin: number) {
  return `A${aisle}-S${section}-${level.toUpperCase()}-${String(bin).padStart(2, '0')}`
}

export function binName(aisle: number, section: number, level: string, bin: number) {
  return `Aisle ${aisle} · Section ${section} · Level ${level.toUpperCase()} · Bin ${bin}`
}

export const BIN_CODE_RE = /^A\d+-S\d+-[A-Z]-\d+$/

export function isBinCode(code: string) {
  return BIN_CODE_RE.test(code.trim().toUpperCase())
}

export async function loadBins(): Promise<Bin[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('id,code,name,aisle,section,level,bin_no')
    .order('aisle').order('section').order('level').order('bin_no')
  if (error) throw error
  return (data ?? []) as Bin[]
}

export async function findBin(code: string): Promise<Bin | null> {
  const { data } = await supabase.from('locations').select('id,code,name,aisle,section,level,bin_no').eq('code', code.trim().toUpperCase()).maybeSingle()
  return (data as Bin) ?? null
}

/** Puts a tag into a bin and records the move. Returns the previous bin id for undo. */
export async function moveUnit(shopId: string, unitId: string, toBin: string | null): Promise<string | null> {
  const { data: before } = await supabase.from('units').select('location_id').eq('id', unitId).single()
  const from = (before as any)?.location_id ?? null
  const { error } = await supabase.from('units').update({ location_id: toBin }).eq('id', unitId)
  if (error) throw error
  await supabase.from('movements').insert({ shop_id: shopId, unit_id: unitId, from_location: from, to_location: toBin, action: 'move' })
  return from
}

export type Sibling = { id: string; tag_code: string; location_id: string | null; location: { code: string } | null }

/** Every in-stock tag of one variation (all the 4821-xxx tags), for putting them away together. */
export async function loadSiblings(variantId: string): Promise<Sibling[]> {
  const { data } = await supabase.from('units').select('id,tag_code,location_id,location:locations(code)')
    .eq('variant_id', variantId).eq('status', 'in_stock').order('tag_code')
  return (data as any) ?? []
}

/** Puts several tags into one bin and records each move. Returns an undo that sends each back where it was. */
export async function moveUnitsTogether(shopId: string, units: Sibling[], toBin: string): Promise<() => Promise<void>> {
  const moving = units.filter(u => u.location_id !== toBin)
  if (moving.length) {
    const { error } = await supabase.from('units').update({ location_id: toBin }).in('id', moving.map(u => u.id))
    if (error) throw error
    await supabase.from('movements').insert(moving.map(u => ({ shop_id: shopId, unit_id: u.id, from_location: u.location_id, to_location: toBin, action: 'move' })))
  }
  return async () => {
    const byFrom = new Map<string | null, string[]>()
    for (const u of moving) byFrom.set(u.location_id, [...(byFrom.get(u.location_id) ?? []), u.id])
    for (const [from, ids] of byFrom) {
      await supabase.from('units').update({ location_id: from }).in('id', ids)
      await supabase.from('movements').insert(ids.map(id => ({ shop_id: shopId, unit_id: id, from_location: toBin, to_location: from, action: 'move' })))
    }
  }
}
