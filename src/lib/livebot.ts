// Live comment bot: reads comments like "sold 4821", decides who gets each item, and keeps a waitlist.
// Everything here is plain logic with no database or Facebook calls, so it can be tested on its own.

export type BotRules = {
  /** Words that mean "I want this". Any one of them counts. */
  claimWords: string[]
  /** Words that mean "I changed my mind". */
  cancelWords: string[]
  /** Count a comment that is only a Live # (like "4821") as a claim, without a claim word. */
  plainNumbers: boolean
  /** Shop codes buyers put in front of the Live #, like "DD 4821" or "DD4821". A code + Live # always counts as a claim. */
  prefixes?: string[]
  /** The thank-you message for each buyer. {name}, {first}, {items}, {count}, {total} and {live} are filled in. */
  message?: string
}

export const DEFAULT_BUYER_MESSAGE = 'Hi {first}! 👑 Thank you for shopping {live} with us. You got:\n{items}\nTotal: {total}\nYour invoice is on the way. 💚'

type MsgLine = { liveNumber: string; title: string; qty: number; price: number }

/** Fills in a buyer's thank-you message. */
export function buyerMessage(template: string, v: { name: string; live: string; lines: MsgLine[] }) {
  const money = (n: number) => `$${n.toFixed(2)}`
  const total = v.lines.reduce((s, l) => s + l.qty * l.price, 0)
  const items = v.lines.map(l => `#${l.liveNumber} ${l.title}${l.qty > 1 ? ` x${l.qty}` : ''} ${money(l.qty * l.price)}`).join('\n')
  const first = v.name.trim().split(/\s+/)[0] || v.name
  return (template || DEFAULT_BUYER_MESSAGE)
    .replaceAll('{name}', v.name).replaceAll('{first}', first)
    .replaceAll('{items}', items).replaceAll('{count}', String(v.lines.reduce((s, l) => s + l.qty, 0)))
    .replaceAll('{total}', money(total)).replaceAll('{live}', v.live)
}

export const DEFAULT_BOT_RULES: BotRules = {
  claimWords: ['sold', 'mine', 'claim', 'wanted'],
  cancelWords: ['cancel', 'unsold', 'nevermind', 'never mind'],
  plainNumbers: true,
  prefixes: ['dd'],
}

export type BotComment = { id: string; text: string; fromId: string | null; fromName: string; at: string }

export type Parsed =
  | { kind: 'claim'; items: { liveNumber: string; qty: number }[] }
  | { kind: 'cancel'; items: { liveNumber: string; qty: number }[] }
  | { kind: 'none' }

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const hasWord = (text: string, words: string[]) =>
  words.some(w => w.trim() && new RegExp(`(^|[^a-z])${esc(w.trim().toLowerCase())}([^a-z]|$)`).test(text))

/**
 * Reads one comment. `known` is the set of Live Numbers the shop has; short numbers like "42" only count
 * when they pad to a known Live # (so "I'm 2 minutes late" is never a claim).
 */
export function parseComment(raw: string, rules: BotRules, known: Set<string>): Parsed {
  const text = raw.toLowerCase().replace(/[’']/g, '').trim()
  if (!text) return { kind: 'none' }

  // Live #s, each with an optional quantity written like "x2", "2x", "qty 2" or "(2)".
  const items: { liveNumber: string; qty: number }[] = []
  const re = /(\d{1,2})\s*x(?=[\s#]|\d{3}|$)|x\s*(\d{1,2})\b|(?<![a-z])q(?:ty)?\s*(\d{1,2})\b|\((\d{1,2})\)|(\$?)#?(\d+)/g
  let m: RegExpExecArray | null
  let pendingQty: number | null = null // "2x 4821": the quantity comes first
  let lastWasNumber = false
  while ((m = re.exec(text))) {
    const q = m[1] ?? m[2] ?? m[3] ?? m[4]
    if (q !== undefined) {
      const qty = Math.max(1, Math.min(Number(q), 20))
      if (m[1] !== undefined || !lastWasNumber || !items.length) pendingQty = qty
      else items[items.length - 1].qty = qty
      lastWasNumber = false
      continue
    }
    const n = m[6]
    lastWasNumber = false
    if (m[5] || n.length > 4) continue // prices like $15 and phone numbers
    const padded = n.padStart(4, '0')
    if (n.length < 4 && !known.has(padded)) continue
    if (items.some(i => i.liveNumber === padded)) continue
    items.push({ liveNumber: padded, qty: pendingQty ?? 1 })
    pendingQty = null
    lastWasNumber = true
  }
  const real = items.filter(i => known.has(i.liveNumber))
  const found = real.length ? real : items
  if (!found.length) return { kind: 'none' }

  if (hasWord(text, rules.cancelWords)) return { kind: 'cancel', items: found }
  if (hasWord(text, rules.claimWords)) return { kind: 'claim', items: found }
  // "DD 4821", "DD4821", "dd-4821", "DD #4821"
  const prefixes = (rules.prefixes ?? []).map(p => p.trim().toLowerCase()).filter(Boolean)
  if (prefixes.some(p => new RegExp(`(^|[^a-z])${esc(p)}[\\s#:-]*\\d`).test(text))) return { kind: 'claim', items: found }
  if (rules.plainNumbers) {
    // Only numbers, #, x, commas, "and", "please" and emoji-ish leftovers: treat as a claim.
    const noPrefix = (rules.prefixes ?? []).reduce((t, p) => p.trim() ? t.replace(new RegExp(`(^|[^a-z])${esc(p.trim().toLowerCase())}(?=[\\s#:-]*\\d)`, 'g'), '$1') : t, text)
    const leftover = noPrefix.replace(/#?\d+|\bx\b|\bq(?:ty)?\d*\b|\band\b|\bplease\b|\bpls\b|\bplz\b|[\s,.&+!()x-]/g, '').replace(/[^a-z]/g, '')
    if (!leftover && real.length) return { kind: 'claim', items: real }
  }
  return { kind: 'none' }
}

/** A saved claim, as kept in the live_claims table. */
export type Claim = {
  id: string
  live_number: string
  variant_id: string | null
  buyer_fb_id: string | null
  buyer_name: string
  qty: number
  state: 'active' | 'cancelled'
  commented_at: string
  comment_text: string | null
  source: string
  order_id: string | null
}

export const buyerKey = (c: { buyer_fb_id: string | null; buyer_name: string }) =>
  c.buyer_fb_id ? `fb:${c.buyer_fb_id}` : `name:${c.buyer_name.trim().toLowerCase()}`

export type Allocation = { claim: Claim; won: number; waiting: number }

/**
 * First come, first served. Each Live # has a number available (from tonight's list, or what's on the shelf).
 * Claims are filled in comment order; whatever doesn't fit waits in line and moves up when someone drops out.
 */
export function allocate(claims: Claim[], available: Map<string, number>): Map<string, Allocation> {
  const left = new Map(available)
  const out = new Map<string, Allocation>()
  const ordered = [...claims].filter(c => c.state === 'active')
    .sort((a, b) => a.commented_at.localeCompare(b.commented_at) || a.id.localeCompare(b.id))
  for (const c of ordered) {
    const has = left.get(c.live_number)
    if (has === undefined) { out.set(c.id, { claim: c, won: 0, waiting: 0 }); continue } // not a Live # we know
    const won = Math.min(c.qty, has)
    left.set(c.live_number, has - won)
    out.set(c.id, { claim: c, won, waiting: c.qty - won })
  }
  return out
}

/**
 * What a new comment should do to the claims, given what's already saved.
 * Returns new claims to add and claim ids to cancel.
 */
export function applyComment(
  comment: BotComment,
  parsed: Parsed,
  existing: Claim[],
): { add: { live_number: string; qty: number }[]; cancel: string[] } {
  if (parsed.kind === 'none') return { add: [], cancel: [] }
  const who = buyerKey({ buyer_fb_id: comment.fromId, buyer_name: comment.fromName })
  const mine = existing.filter(c => c.state === 'active' && buyerKey(c) === who)
  if (parsed.kind === 'cancel') {
    const nums = new Set(parsed.items.map(i => i.liveNumber))
    return { add: [], cancel: mine.filter(c => nums.has(c.live_number) && !c.order_id).map(c => c.id) }
  }
  // Repeating "sold 4821" doesn't buy a second one. Asking for more ("4821 x2") tops it up.
  const add: { live_number: string; qty: number }[] = []
  for (const it of parsed.items) {
    const have = mine.filter(c => c.live_number === it.liveNumber).reduce((s, c) => s + c.qty, 0)
    if (have === 0) add.push({ live_number: it.liveNumber, qty: it.qty })
    else if (it.qty > have) add.push({ live_number: it.liveNumber, qty: it.qty - have })
  }
  return { add, cancel: [] }
}

/** A fake live for practice: tonight's Live #s get claimed, a line forms, someone drops out and the next person moves up. */
export function practiceComments(numbers: string[]): Omit<BotComment, 'id' | 'at'>[] {
  const people = ['Keisha Monroe', 'Tasha Greene', 'Brenda Lewis', 'Monique Carter', 'Aaliyah Brooks', 'Denise Hall', 'Shanice Price', 'Gloria James', 'Renee Walker', 'Toni Baker']
  const chatter = ['Hey LaVerne! 👑', 'Love that color 😍', 'Is that real leather?', 'Hi from Atlanta!', 'Show the back please', 'Yesss queen', 'What size is that?', 'Just joined!', 'Those earrings 🔥']
  const say = (i: number, text: string) => ({ text, fromId: `practice-${i % people.length}`, fromName: people[i % people.length] })
  const nums = (numbers.length ? numbers : ['4821']).slice(0, 5)
  const out: Omit<BotComment, 'id' | 'at'>[] = [say(3, chatter[0]), say(7, chatter[3])]
  nums.forEach((n, k) => {
    const a = k * 3, b = k * 3 + 1, c = k * 3 + 2
    out.push(say(a + 4, chatter[(k + 1) % chatter.length]))
    out.push(say(a, k % 2 ? n : `sold ${n}`))            // first one in gets it
    out.push(say(b, k === 1 ? `Sold #${n} x2` : `mine ${n} please`)) // next in line
    out.push(say(a, `sold ${n}`))                        // a repeat doesn't buy a second one
    out.push(say(c, k === 2 ? `DD ${n}` : `${n}`))       // waits in line if it's sold out
    if (k === 0) out.push(say(a, `cancel ${n}`))         // drops out: the next person moves up
  })
  out.push(say(9, 'Thank you LaVerne!! 💚'))
  return out
}
