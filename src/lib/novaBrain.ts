/* Ask Nova: answers sellers' questions about the app, right on the device.
   No AI service and no keys: she searches the Dazzle University lessons (which the standing
   rule keeps in step with every feature) plus a few quick answers, and points to the screen.
   Because she reads the lessons, she learns every new feature the day its lesson ships. */
import { ALL_LESSONS, type Lesson, type Slide } from '../lessons/index'

export type Answer = {
  id: string
  /** Where it came from, e.g. "Receive an item" */
  from: string
  title: string
  text: string
  points?: string[]
  route?: { to: string; label: string }
  lessonId?: string
  /** A step-by-step tutorial for this answer (filled in by ask). */
  steps?: string[]
  score: number
}

/* Words sellers use for the same thing. Every word in a group counts as a match for the others. */
const SYNONYMS: string[][] = [
  ['tag', 'label', 'sticker', 'barcode', 'tags'],
  ['print', 'printer', 'printing', 'reprint', 'thermal', 'avery'],
  ['ship', 'shipping', 'tracking', 'pirate', 'postage', 'mail', 'usps'],
  ['pack', 'pick', 'box', 'packing', 'picking'],
  ['bin', 'shelf', 'location', 'warehouse', 'spot', 'rack'],
  ['live', 'stream', 'show', 'facebook', 'broadcast'],
  ['order', 'sold', 'sale', 'claim', 'purchase'],
  ['customer', 'buyer', 'shopper', 'client'],
  ['money', 'profit', 'report', 'revenue', 'earn', 'made'],
  ['receive', 'add', 'intake', 'new', 'create', 'enter'],
  ['bot', 'comment', 'csv', 'spreadsheet', 'upload', 'import', 'file'],
  ['damage', 'damaged', 'broken', 'ruined'],
  ['discount', 'clearance', 'markdown', 'sale', 'old'],
  ['calendar', 'schedule', 'book', 'slot', 'time'],
  ['giveaway', 'prize', 'winner', 'raffle'],
  ['planner', 'poster', 'theme', 'flyer', 'idea'],
  ['scan', 'scanner', 'camera', 'phone'],
  ['stock', 'inventory', 'item', 'product', 'piece'],
  ['setting', 'settings', 'goal', 'category', 'checklist'],
  ['profile', 'privacy', 'photo', 'bio'],
  ['lesson', 'course', 'class', 'university', 'learn', 'academy'],
  ['tax', 'taxes', 'irs', 'ein', 'license'],
]
const STOP = new Set('a an and are as at be but by can do does for from get go how i if in is it its me my of on or so that the then this to up use was what when where which who why will with you your yo'.split(' '))

const stem = (w: string) => w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '') : w
const groupOf = new Map<string, string>()
SYNONYMS.forEach((g, n) => g.forEach(w => groupOf.set(stem(w), `g${n}`)))
const norm = (w: string) => { const s = stem(w); return groupOf.get(s) ?? s }

export function tokens(text: string): string[] {
  return text.toLowerCase().replace(/live\s*(#|numbers?)/g, ' livenumber ').split(/[^a-z0-9#]+/).filter(w => w && !STOP.has(w)).map(norm)
}

type Doc = { a: Omit<Answer, 'score'>; title: Set<string>; body: Map<string, number>; len: number }
let docs: Doc[] | null = null
let df = new Map<string, number>()

const QUICK: { q: string; title: string; text: string; to: string; label: string; lessonId: string; steps?: string[] }[] = [
  { q: 'live number what is', title: 'What a Live Number is', text: 'Every item and variation gets its own 4-digit Live Number when you receive it. Buyers type it in your live comments to claim it, like "sold 4821". Pieces that are exactly the same share one Live Number, and each piece still gets its own tag.', to: '/intake', label: 'Receive an item', lessonId: 'receive' },
  { q: 'print tag label sticker', title: 'Print tags', text: 'Tags print when you receive an item. To print again, open the item in Stock, tick the tags you need and tap Reprint. White 2×1 labels are your normal tags; for sale tags, load the yellow roll, select the items in Stock and tap More, then Print yellow sale tags.', to: '/inventory', label: 'Open Stock', lessonId: 'labels', steps: ['Find the item in Stock and open it', 'Tick the tags you need', 'Tap Reprint (or Print tags for the whole item)', 'For sale tags, load the yellow roll first, select the items in Stock, tap More, then Print yellow sale tags'] },
  { q: 'pack order box pick', title: 'Pack an order', text: 'Open Pick and pack, pick an order, scan each piece, then scan the buyer\'s box label. The app checks every piece made it into the right box before you close it.', to: '/orders', label: 'Open Pick and pack', lessonId: 'pick' },
  { q: 'tracking ship pirate', title: 'Add tracking', text: 'Buy the label in Pirate Ship, then open Shipping in the app, add the tracking number to the order and tap Shipped. That closes the order and updates the customer\'s history.', to: '/shipping', label: 'Open Shipping', lessonId: 'shipping' },
  { q: 'shelf bin warehouse set up location', title: 'Set up your shelves', text: 'Open Warehouse to add shelves and bins, then print a label for each bin. Scan the bin, then scan the pieces you put there.', to: '/locations', label: 'Open Warehouse', lessonId: 'warehouse', steps: ['Tap Create bins and add your aisles, shelves and bins', 'Tap Print bin labels and stick one on each bin', 'Go to Scan, scan a bin label, then scan each piece you put in that bin'] },
  { q: 'upload sales orders after live', title: 'Bring in your live sales', text: 'After a live, download the sales file from your comment bot and upload it in Upload live sales. Each buyer becomes an order, ready to pick and pack.', to: '/orders/upload', label: 'Upload live sales', lessonId: 'upload' },
]

function build() {
  const list: Omit<Answer, 'score'>[] = []
  QUICK.forEach((x, n) => list.push({ id: `q${n}`, from: 'Quick answer', title: x.title, text: x.text, route: { to: x.to, label: x.label }, lessonId: x.lessonId, steps: x.steps }))
  const extra = new Map<string, string>(QUICK.map((x, n) => [`q${n}`, x.q]))
  for (const l of ALL_LESSONS) addLesson(list, l)
  docs = list.map(a => {
    const title = new Set(tokens(`${a.title} ${a.from} ${extra.get(a.id) ?? ''}`))
    const words = tokens(`${a.text} ${(a.points ?? []).join(' ')}`)
    const body = new Map<string, number>()
    words.forEach(w => body.set(w, (body.get(w) ?? 0) + 1))
    return { a, title, body, len: words.length }
  })
  df = new Map()
  for (const d of docs) for (const w of new Set([...d.title, ...d.body.keys()])) df.set(w, (df.get(w) ?? 0) + 1)
}

function addLesson(list: Omit<Answer, 'score'>[], l: Lesson) {
  const route = l.route
  list.push({ id: `${l.id}:why`, from: l.title, title: l.title, text: l.why, points: l.outcomes?.slice(0, 3), route, lessonId: l.id })
  l.slides.forEach((s: Slide, n) => {
    if (s.kind === 'learn') list.push({ id: `${l.id}:${n}`, from: l.title, title: s.title, text: s.text, points: s.points?.slice(0, 4), route, lessonId: l.id })
    else if (s.kind === 'tap') list.push({ id: `${l.id}:${n}`, from: l.title, title: s.prompt, text: `Tap ${s.answer}. ${s.hint}`, route, lessonId: l.id })
    else if (s.kind === 'quiz') list.push({ id: `${l.id}:${n}`, from: l.title, title: s.q, text: `${s.options[s.answer]}. ${s.why}`, route, lessonId: l.id })
    else if (s.kind === 'howto') list.push({ id: `${l.id}:${n}`, from: l.title, title: s.title, text: s.text ?? s.steps.map(x => x.title).join('. '), points: s.steps.slice(0, 4).map(x => x.title), route, lessonId: l.id })
  })
}

/** Nova's best answers to a question, best first. */
export function ask(question: string, max = 3): Answer[] {
  if (!docs) build()
  const q = [...new Set(tokens(question))]
  if (!q.length) return []
  const N = docs!.length
  const scored = docs!.map(d => {
    let s = 0, hits = 0
    for (const w of q) {
      const idf = Math.log(1 + N / (1 + (df.get(w) ?? 0)))
      const inTitle = d.title.has(w), tf = d.body.get(w) ?? 0
      if (inTitle || tf) hits++
      s += idf * ((inTitle ? 3 : 0) + Math.min(tf, 3) / (1 + d.len / 80))
    }
    // Reward answers that cover more of the question; quick answers win ties.
    s *= hits / q.length
    if (d.a.id.startsWith('q')) s *= 1.25
    return { ...d.a, score: s }
  }).filter(a => a.score > 0.8).sort((a, b) => b.score - a.score)
  // At most two answers from the same lesson, so she offers some variety.
  const per = new Map<string, number>(), out: Answer[] = []
  for (const a of scored) {
    const k = a.lessonId ?? a.id
    if ((per.get(k) ?? 0) >= 2) continue
    per.set(k, (per.get(k) ?? 0) + 1)
    out.push(a)
    if (out.length >= max) break
  }
  return out.map(a => ({ ...a, steps: tutorial(a, q) }))
}

/** Little things she says that aren't app questions. */
export function smallTalk(q: string): string | null {
  const t = q.toLowerCase().trim()
  if (/^(hi|hey|hello|good (morning|afternoon|evening))\b/.test(t)) return 'Hey love! Ask me anything about the app, like "how do I print tags?"'
  if (/who are you|your name|what are you/.test(t)) return "I'm Nova, Head of Dazzle University and your shop's right-hand bag. Ask me how to do anything in the app."
  if (/thank/.test(t)) return 'Anytime, boss. Go sell something fabulous!'
  if (/ka-?ching|dance|boogie|groove|shimmy|\bwave\b|spin|curtsy/.test(t)) return 'You asked for it!'
  return null
}

/* ---------- step-by-step tutorials ---------- */

/** Build a short step-by-step tutorial for an answer. She uses the lesson's own "put the steps in
   order" practice when it fits the question (those are the real steps, kept current by the lesson
   rule), then a list of points from the lesson, then the answer itself, sentence by sentence. */
const VERB = /^(tap|open|scan|print|pick|add|type|choose|stick|download|upload|paste|check|walk|set|load|hold|put|select|save|snap|name|tick|drop|read|send|close|slide|let|import|buy|go|find|make|write|mark|share|turn|post|wait|export|fill|start|unpack|photograph|tag|sort|give|move|enter|copy|book|spin)\b/i

function tutorial(a: Omit<Answer, 'score'>, q: string[]): string[] {
  const lesson = ALL_LESSONS.find(l => l.id === a.lessonId)
  const want = new Set([...q, ...tokens(a.title)])
  const overlap = (text: string) => tokens(text).filter(w => want.has(w)).length
  // Real steps start with something to do: "Tap Pick", "Scan its box".
  const doable = (list: string[]) => list.filter(x => VERB.test(x.replace(/^\d+\.\s*/, ''))).length / list.length
  const lists: { steps: string[]; score: number }[] = []
  for (const sl of lesson?.slides ?? []) {
    if (sl.kind === 'order') lists.push({ steps: sl.steps, score: overlap(`${sl.title} ${sl.prompt} ${sl.steps.join(' ')}`) + 2 + doable(sl.steps) * 4 })
    else if (sl.kind === 'howto') lists.push({ steps: sl.steps.map(x => x.title), score: overlap(`${sl.title} ${sl.text ?? ''} ${sl.steps.map(x => `${x.title} ${x.detail}`).join(' ')}`) * 0.6 + (sl.title === a.title ? 3 : 0) + 2 + doable(sl.steps.map(x => x.title)) * 4 })
    else if (sl.kind === 'learn' && (sl.points?.length ?? 0) >= 3) lists.push({ steps: sl.points!, score: overlap(`${sl.title} ${sl.text} ${sl.points!.join(' ')}`) * 0.6 + (sl.title === a.title ? 3 : 0) + doable(sl.points!) * 4 - (doable(sl.points!) < 0.5 ? 4 : 0) })
  }
  lists.sort((x, y) => y.score - x.score)
  let steps = a.steps ?? (lists[0] && lists[0].score >= 3 ? lists[0].steps : a.points && a.points.length >= 2 ? a.points : sentences(a.text))
  steps = steps.slice(0, 8).map(x => x.replace(/^\d+\.\s*/, '').replace(/\s+/g, ' ').trim()).filter(Boolean)
  if (a.route) steps = [`Open ${a.route.label.replace(/^Open /, '')}. Tap the button below and I'll come with you.`, ...steps]
  return steps
}

function sentences(t: string) {
  return t.split(/(?<=[.!?])\s+(?=[A-Z"])/).filter(x => x.length > 3)
}
