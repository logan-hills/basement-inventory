import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'upload', title: 'Bring in your live sales', track: 'Pack and ship', icon: 'upload',
  why: 'Turning sales into orders is what starts picking, packing and shipping.',
  route: { to: '/orders/upload', label: 'Upload live sales' },
  covers: ['src/pages/OrdersUpload.tsx', 'src/pages/Orders.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Three ways in', text: 'Pick the one that matches how you sell.',
      points: ['Dynamic Dazzle comment bot: sales flow straight into Pick and pack', 'Loyal Shops: export your sales and upload the file here', 'Any other bot, or sales written down: fill in our sales template'] },
    { kind: 'learn', title: 'From Loyal Shops', text: 'In Loyal Shops, open Sales History for the live and tap Export Sales. Then come to Upload live sales and choose that file. Items match by claim number (your Live #), UPC, or product title. Claims like "Sold 123 Blue M" or "Sold 88 Q2" read fine, and waitlisted runner-ups are skipped so you only pack for the winner.',
      screen: { title: 'Upload live sales', rows: ['Using Loyal Shops?'], buttons: ['Choose the sales CSV'], highlight: 'Choose the sales CSV' } },
    { kind: 'learn', title: 'The sales template', text: 'On Upload live sales, tap Download the sales template. Fill in one row per piece sold: who bought it, their address, the Live #, quantity and price. Save as CSV and upload.',
      screen: { title: 'Upload live sales', buttons: ['Choose the sales CSV', 'Download the sales template'], highlight: 'Download the sales template' },
      tip: 'Your bot\'s own export works too. The app matches the columns for you.' },
    { kind: 'learn', title: 'Check and create', text: 'Check the column matches and the preview. Red Live #s aren\'t in inventory yet. Tap Create orders and every customer gets one order with its own ID, like DD-7K3P9Q.' },
    { kind: 'order', title: 'Practice', prompt: 'Put the steps in order.', steps: ['Download the sales template', 'Fill in one row per piece sold', 'Upload the CSV', 'Check the matches and preview', 'Create orders'] },
    { kind: 'quiz', q: 'A buyer claimed three pieces. How many orders get made for her?', options: ['One, with three lines', 'Three'], answer: 0, why: 'Sales are grouped per customer (or per order number) into one box.' },
    { kind: 'quiz', q: 'A Live # shows in red in the preview. What does that mean?', options: ['It isn\'t in your inventory', 'It already shipped', 'The price is wrong'], answer: 0, why: 'The line still imports, flagged so you can check it.' },
    { kind: 'quiz', q: 'Your Loyal Shops file lists a waitlisted runner-up for #123. What happens to that row?', options: ['It is skipped, only the winner gets packed', 'She gets a second box'], answer: 0, why: 'Runner-ups only matter if the winner passes. Loyal Shops moves the claim to them, and the next export shows them as the winner.' },
  ],
}
export default lesson
