import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type Lesson = { title: string; steps?: string[]; body?: string; link?: { to: string; label: string } }
type Section = { name: string; lessons: Lesson[] }

const SECTIONS: Section[] = [
  { name: 'Getting started', lessons: [
    { title: 'How the app fits together', body: 'Stuff comes in (Receive items), gets a tag and a home (Labels, Warehouse), gets planned into a live (Calendar, Get ready for live), sells (Upload live sales), gets picked into boxes (Pick and pack) and ships (Shipping). Reports shows how it all adds up.' },
    { title: 'Set up your lists first', steps: ['Open Settings.', 'Add your categories, item tags, live themes and hosts.', 'Set how many days before stock counts as "old".', 'Set up your bot CSV columns to match your bot.'], link: { to: '/settings', label: 'Open Settings' } },
    { title: 'Live Numbers and tags', body: 'Every variation (a size or color) gets a 4-digit Live Number that viewers type in comments. Every single piece gets its own tag, like 4821-003, so you always know exactly which one sold and where it is.' },
  ] },
  { name: 'Receiving items', lessons: [
    { title: 'Add one item', steps: ['Inventory → Add item.', 'Name it, choose a category and tags.', 'Snap photos with your phone.', 'Add each variation with its price, what you paid, and how many.', 'Save. Tags open ready to print.'], link: { to: '/intake', label: 'Add an item' } },
    { title: 'Bulk upload a delivery', steps: ['Inventory → Bulk upload CSV.', 'Download the template and fill it in (Excel or Google Sheets, then save as CSV).', 'Drop the file in, check the preview, and import.', 'Print every tag in one go.'], link: { to: '/receive/bulk', label: 'Bulk upload' } },
    { title: 'Photos help the whole team', body: 'Anyone who scans or looks up an item sees its photo, so helpers can grab the right piece fast. Add photos when receiving, or later from the item page.' },
  ] },
  { name: 'Labels and printing', lessons: [
    { title: 'Print or reprint tags', steps: ['Open an item and tap Print tags for a whole variation.', 'To reprint a few damaged tags, tick them on the item page and tap Reprint.', 'To reprint for many items, tick rows in Inventory and tap Print tags for selected.'] },
    { title: 'Labels come out misaligned', steps: ['In the print window, set Scale to 100% (or Actual size).', 'Set Margins to None.', 'Turn off "Headers and footers".', 'Pick the label type that matches your paper.', 'On a sheet with some labels used, enter how many to skip.'] },
    { title: 'Bin labels', body: 'Warehouse → Print bin labels. The 4×6 landscape label shows a huge bin code, the Aisle, Section, Level and Bin, and a barcode. Tick bins in the list view to reprint just those.' },
  ] },
  { name: 'Warehouse and scanning', lessons: [
    { title: 'Set up bins', steps: ['Warehouse → Add bins.', 'Enter your aisles, sections per aisle, levels (A is the bottom) and bins per level.', 'Print the bin labels and stick them on the shelves.'], link: { to: '/locations', label: 'Open Warehouse' } },
    { title: 'Put items away', steps: ['Open Scan.', 'Scan the bin label. A gold banner shows the bin you are filling.', 'Scan each tag you put in it. Each one is recorded instantly.', 'Tap Done when you move on.'] },
    { title: 'Which scanner works?', body: 'Any USB or Bluetooth barcode scanner works (it types the code and presses Enter). Android scanner phones work in the browser. On an iPhone, tap Use camera on the Scan page.' },
    { title: 'Damaged or missing pieces', body: 'On an item page, swipe a tag left (or tap Damage out), pick a reason and add a note. It leaves stock right away. Tap Undo, or Put back from the Damaged page, if it was a mistake.' },
  ] },
  { name: 'Planning a live', lessons: [
    { title: 'Schedule your lives', steps: ['Open Calendar and tap a day (or + Schedule a live).', 'Give it a title, theme, host, start time and length.', 'Set it to repeat weekly for your regular show. There is no limit on how far ahead.'], link: { to: '/calendar', label: 'Open Calendar' } },
    { title: 'Pick what to sell', steps: ['Open Get ready for live. It works like an online shop.', 'Filter by category or tag, sort by age or profit.', 'Tap Add to cart on what you want to sell.', 'Open the cart, set any special live prices, pick the live, and check out.'], link: { to: '/live', label: 'Get ready for live' } },
    { title: 'Run a sale on old stock', body: 'When items pass your "old stock" age, the Dashboard and Get ready for live show an alert. Tap Run a sale to see the oldest items first, then Add all to put them in your cart.' },
    { title: 'Send the list to your bot', steps: ['Open the live from the Calendar.', 'Tap Download bot CSV.', 'Upload that file to your live-sale bot.', 'If your bot wants different columns, change them in Settings → Bot CSV columns.'] },
    { title: 'Projected total', body: 'Each live shows what it brings in if everything on its list sells, plus the profit after cost. Add costs to your items to make the profit number accurate.' },
  ] },
  { name: 'After the live', lessons: [
    { title: 'Upload your sales', steps: ['Download the sales or invoices CSV from your bot.', 'Pick and pack → Upload live sales.', 'Check the column matching and the preview.', 'Import. Every customer gets an order with its own ID, like DD-7K3P9Q.'], link: { to: '/orders/upload', label: 'Upload sales' } },
    { title: 'Grocery-style picking', steps: ['Print box labels for the orders you are picking and stick one on each box.', 'Tap Pick (one order, a few, or all).', 'Walk the list in bin order. Scan an item, then scan the box it goes in.', 'Wrong box? The app buzzes and tells you the right one.', 'Can\'t find something? Tap Short.'] },
    { title: 'Look up any order', body: 'Scan or type an order ID (DD-…) on the Scan page, or search it on Pick and pack. Each order has its own page forever.' },
    { title: 'Ship it', steps: ['Shipping → Download for Pirate Ship.', 'Import that file at Pirate Ship and buy labels.', 'Paste each tracking number back here and tap Shipped.'], link: { to: '/shipping', label: 'Open Shipping' } },
  ] },
  { name: 'Troubleshooting', lessons: [
    { title: 'Scanner does nothing', steps: ['Click into the scan box so it has a blinking cursor.', 'Test the scanner in a notes app. If no text appears there, re-pair or replug it.', 'Make sure the scanner is set to add Enter after each scan (check its manual for the "Enter suffix" barcode).'] },
    { title: 'iPhone camera won\'t open', steps: ['Open the app in Safari.', 'When asked, tap Allow for the camera.', 'If you tapped Don\'t Allow: Settings → Safari → Camera → Allow, then reload.'] },
    { title: '"Not found" when scanning a tag', body: 'The tag may belong to an item that was deleted, or the barcode is smudged. Type the code under the barcode instead, then reprint the tag from the item page.' },
    { title: 'Upload says columns are missing', body: 'The app guesses columns from the header row. Use the dropdowns under "Match your columns" to point each field to the right column, or download the template and copy your data into it.' },
    { title: 'Something looks out of date', body: 'Pull down to refresh on a phone, or reload the page on a computer. The app always shows the latest saved data after a reload.' },
  ] },
  { name: 'Tips and tricks', lessons: [
    { title: 'Speed tips', body: 'Keep the scan box focused and never touch the mouse: scan bin, scan, scan, scan. Toasts with Undo let you fix a mis-scan instantly. Swipe tags left on a phone to damage them out.' },
    { title: 'Price smarter', body: 'Sort Get ready for live by "Best profit margin" to lead with your money-makers, and by "Oldest first" for flash sales. Reports → Low margin items shows what to stop buying.' },
    { title: 'Install it like an app', body: 'On iPhone: Safari → Share → Add to Home Screen. On Android: Chrome menu → Install app. It opens full screen with the crown icon.' },
  ] },
]

export default function Lessons() {
  const [q, setQ] = useState('')
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return SECTIONS
    return SECTIONS.map(sec => ({ ...sec, lessons: sec.lessons.filter(l => [l.title, l.body ?? '', ...(l.steps ?? [])].join(' ').toLowerCase().includes(s)) })).filter(sec => sec.lessons.length)
  }, [q])

  return (
    <div className="stack wide-gap">
      <div className="page-head"><div><span className="eyebrow">Help</span><h1>Lessons</h1></div></div>
      <input type="search" className="search" placeholder="Search how-tos, like &quot;reprint&quot; or &quot;scanner&quot;" value={q} onChange={e => setQ(e.target.value)} />
      {shown.length === 0 && <p className="muted">Nothing matches. Try a simpler word.</p>}
      {shown.map(sec => (
        <section key={sec.name} className="stack">
          <span className="eyebrow">{sec.name}</span>
          {sec.lessons.map(l => (
            <details key={l.title} className="lesson card" open={!!q}>
              <summary>{l.title}</summary>
              <div className="stack">
                {l.body && <p>{l.body}</p>}
                {l.steps && <ol>{l.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>}
                {l.link && <Link className="btn ghost self-start" to={l.link.to}>{l.link.label}</Link>}
              </div>
            </details>
          ))}
        </section>
      ))}
    </div>
  )
}
