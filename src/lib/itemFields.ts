/** Optional details sellers can use to sort and file stock. None are required. */
export type ItemExtra = {
  condition?: string | null
  color?: string | null
  material?: string | null
  department?: string | null
  supplier?: string | null
  season?: string | null
  purchased_on?: string | null
}

export type ExtraKey = keyof ItemExtra

export const CONDITIONS = ['New with tags', 'New without tags', 'Like new', 'Gently used', 'Vintage', 'Flawed / as-is']
export const DEPARTMENTS = ['Women', 'Men', 'Kids', 'Unisex', 'Home']
export const SEASONS = ['All year', 'Spring', 'Summer', 'Fall', 'Winter', 'Holiday', 'Back to school', 'Valentine\'s']

/** In display order. `options` gives a drop-down; `suggest` gives typed suggestions. */
export const EXTRA_FIELDS: { key: ExtraKey; label: string; type: 'text' | 'date'; options?: string[]; suggest?: string[]; placeholder?: string }[] = [
  { key: 'condition', label: 'Condition', type: 'text', options: CONDITIONS },
  { key: 'department', label: 'Department', type: 'text', options: DEPARTMENTS },
  { key: 'color', label: 'Color', type: 'text', placeholder: 'Gold, Black, Emerald…' },
  { key: 'material', label: 'Material', type: 'text', placeholder: 'Leather, 14k plated, cotton…' },
  { key: 'season', label: 'Season or collection', type: 'text', suggest: SEASONS, placeholder: 'Holiday' },
  { key: 'supplier', label: 'Supplier (where you bought it)', type: 'text', placeholder: 'Wholesale market, Liquidation lot #12…' },
  { key: 'purchased_on', label: 'Bought on', type: 'date' },
]

/** Turns empty strings into null so the database stores "not set". */
export function cleanExtra(x: ItemExtra): ItemExtra {
  const out: ItemExtra = {}
  for (const f of EXTRA_FIELDS) {
    const v = x[f.key]
    if (v !== undefined) out[f.key] = typeof v === 'string' && v.trim() === '' ? null : (typeof v === 'string' ? v.trim() : v)
  }
  return out
}

/** Friendly message when the new columns haven't been added to the database yet. */
export function fieldError(msg: string) {
  return /column|schema cache/i.test(msg) && /(condition|color|material|department|supplier|season|purchased_on|sku|sale_price)/.test(msg)
    ? 'These details need a quick database update first (run supabase/014_inventory_fields.sql).'
    : msg
}
