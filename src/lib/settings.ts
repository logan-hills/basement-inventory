import { supabase } from './supabase'
import type { BotRules } from './livebot'

export type BotColumn = { key: string; header: string }

export type Settings = {
  categories: string[]
  itemTags: string[]
  liveThemes: string[]
  hosts: string[]
  oldStockDays: number
  liveDurationMin: number
  botColumns: BotColumn[]
  checklist: { before: string[]; during: string[]; after: string[] }
  monthlyGoal: number
  /** Comment bot: which words count as a claim or a cancel. */
  botRules?: BotRules
}

/** Every field the live-sale bot CSV can include. */
export const BOT_FIELDS: { key: string; label: string; sample: string }[] = [
  { key: 'live_number', label: 'Live #', sample: '4821' },
  { key: 'name', label: 'Item name', sample: 'Quilted Crossbody Bag' },
  { key: 'variation', label: 'Variation', sample: 'Black' },
  { key: 'title', label: 'Name + variation', sample: 'Quilted Crossbody Bag - Black' },
  { key: 'price', label: 'Sale price', sample: '15.00' },
  { key: 'regular_price', label: 'Regular price', sample: '20.00' },
  { key: 'qty', label: 'Quantity for the live', sample: '3' },
  { key: 'in_stock', label: 'In stock now', sample: '4' },
  { key: 'cost', label: 'Cost (bought for)', sample: '6.00' },
  { key: 'brand', label: 'Brand', sample: 'Maison Belle' },
  { key: 'category', label: 'Category', sample: 'Bags' },
  { key: 'tags', label: 'Item tags', sample: 'New arrival' },
  { key: 'weight', label: 'Weight (lb)', sample: '1.2' },
  { key: 'bins', label: 'Bin location', sample: 'A1-S2-B-03' },
  { key: 'description', label: 'Description', sample: 'Gold chain strap' },
  { key: 'sku', label: 'SKU (Live # + variation)', sample: '4821-BLACK' },
]

export const DEFAULT_CHECKLIST: Settings['checklist'] = {
  before: ['Pick a theme and title', 'Make and post the poster', 'Pull the items and check their tags', 'Set live prices and download the bot CSV', 'Upload the item list to the bot', 'Charge the phone and ring light', 'Test lighting, sound and internet', 'Set up the display table and props', 'Water and snacks within reach', 'Share the live link in your groups'],
  during: ['Greet viewers by name as they join', 'Explain how to claim: comment the Live #', 'Show each piece up close, front and back', 'Say the Live # and price clearly, twice', 'Shout out new viewers and buyers', 'Run the giveaway', 'Remind everyone of the payment and shipping cutoff', 'Thank everyone and tease the next live'],
  after: ['Download the sales file from the bot', 'Upload sales to Pick and pack', 'Send invoices', 'Print box labels and pick orders', 'Put unsold items back on the shelves', 'Post a thank-you and the replay link', 'Write down what sold best'],
}

export const DEFAULT_SETTINGS: Settings = {
  categories: ['Jewelry', 'Bags', 'Apparel', 'Accessories', 'Shoes', 'Home'],
  itemTags: ['New arrival', '$2 Tuesday', 'Clearance', 'Bundle deal', 'Holiday', 'Best seller'],
  liveThemes: ['$2 Tuesday', 'Jewelry Night', 'Bag Bonanza', 'Clearance Blowout', 'Holiday Special'],
  hosts: ['LaVerne'],
  oldStockDays: 60,
  liveDurationMin: 120,
  botColumns: [
    { key: 'live_number', header: 'Item Number' },
    { key: 'title', header: 'Item Name' },
    { key: 'price', header: 'Price' },
    { key: 'qty', header: 'Quantity' },
  ],
  checklist: DEFAULT_CHECKLIST,
  monthlyGoal: 1000,
}

export function withDefaults(raw: Partial<Settings> | null | undefined): Settings {
  const s = { ...DEFAULT_SETTINGS, ...(raw ?? {}) }
  if (!Array.isArray(s.botColumns) || !s.botColumns.length) s.botColumns = DEFAULT_SETTINGS.botColumns
  s.checklist = { ...DEFAULT_CHECKLIST, ...(s.checklist ?? {}) }
  return s
}

export async function saveSettings(shopId: string, settings: Settings) {
  const { error } = await supabase.from('shops').update({ settings }).eq('id', shopId)
  if (error) throw error
}
