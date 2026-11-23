import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'upload', title: 'Bring in your live sales', track: 'Pack and ship', icon: 'upload',
  why: 'Turning sales into orders is what starts picking, packing and shipping.',
  outcomes: [
    'Pick the right way in: our bot, Loyal Shops, or the sales template',
    'Export from Loyal Shops and upload it in a minute',
    'Fill in the sales template so every buyer gets one box',
    'Read the preview and fix red rows before you create orders',
    'Keep customer details clean so shipping just works',
  ],
  route: { to: '/orders/upload', label: 'Upload live sales' },
  covers: ['src/pages/OrdersUpload.tsx', 'src/pages/Orders.tsx'], updated: '2026-11-23',
  slides: [
    { chapter: 'Three ways in', kind: 'learn', title: 'Three ways in', nova: 'The live is over, the money is waiting. Let\'s turn claims into boxes.',
      text: 'Pick the one that matches how you sell.',
      table: { head: ['How you sold', 'How sales get in'], rows: [
        ['Dynamic Dazzle comment bot', 'Tap Make orders. Sales flow straight into Pick and pack, no upload.'],
        ['Loyal Shops', 'Export Sales there, upload the file here'],
        ['Any other bot, or sales written down', 'Fill in the sales template and upload it'],
      ] } },
    { kind: 'quiz', q: 'You used the Dynamic Dazzle comment bot tonight. What\'s next?', options: ['Download a file and upload it here', 'Tap Make orders in the bot', 'Type each sale in by hand'], answer: 1, why: 'Our bot makes the orders for you. Uploads are for Loyal Shops, other bots, and handwritten sales.' },

    { chapter: 'From Loyal Shops', kind: 'learn', title: 'Export, then upload', text: 'In Loyal Shops, open Sales History for the live and tap Export Sales. Then come to Upload live sales and choose that file. Items match by claim number (your Live #), UPC, or product title. Claims like "Sold 123 Blue M" or "Sold 88 Q2" read fine, and waitlisted runner-ups are skipped so you only pack for the winner.',
      screen: { title: 'Upload live sales', rows: ['Using Loyal Shops?'], buttons: ['Choose the sales CSV'], highlight: 'Choose the sales CSV' } },
    { kind: 'quiz', q: 'Your Loyal Shops file lists a waitlisted runner-up for #123. What happens to that row?', options: ['It is skipped, only the winner gets packed', 'She gets a second box'], answer: 0, why: 'Runner-ups only matter if the winner passes. Loyal Shops moves the claim to them, and the next export shows them as the winner.' },
    { kind: 'learn', title: 'When to export', text: 'Export after your payment deadline, not the second the live ends. That way the file shows who actually kept their pieces, and claims that moved to the next in line are already sorted out.',
      example: 'Tuesday live ends at 8 PM. Payment is due Wednesday 8 PM. At 8:15 Wednesday you export, upload, and print box labels. Packing starts Thursday morning with only paid orders.' },

    { chapter: 'The sales template', kind: 'learn', title: 'The sales template', text: 'On Upload live sales, tap Download the sales template. Fill in one row per piece sold, save as CSV and upload. Tap See a filled-in example to see one done right.',
      table: { head: ['Column', 'What goes in it'], rows: [
        ['Customer name, Facebook name', 'Who bought it'],
        ['Email, Phone', 'For tracking and questions'],
        ['Address, Address 2, City, State, ZIP, Country', 'Where it ships'],
        ['Live #, Description, Qty, Price', 'What she bought'],
        ['Order #', 'Leave blank unless your bot gives you one'],
      ] },
      tip: 'Your bot\'s own export works too. The app matches the columns for you.' },
    { kind: 'learn', title: 'One buyer, one box', text: 'Rows for the same customer become one order and one box. The app recognizes the same customer by email first, then Facebook name, then customer name. So spelling matters.',
      table: { head: ['Rows in your sheet', 'Result'], rows: [
        ['Keisha Johnson ×3, same email', '1 order, 3 pieces'],
        ['Keisha Johnson + Keisha J, no email', '2 orders (the app can\'t tell they\'re the same person)'],
        ['Keisha J + Keisha J, same Facebook name', '1 order'],
      ] } },
    { kind: 'quiz', q: 'A buyer claimed three pieces. How many orders get made for her?', options: ['One, with three lines', 'Three'], answer: 0, why: 'Sales are grouped per customer (or per order number) into one box.' },
    { kind: 'scenario', title: 'Two boxes for one buyer', situation: 'The preview shows two orders: "Monique Reed" with 2 pieces and "Mo Reed" with 1 piece. It\'s the same buyer.',
      options: [
        { text: 'Create orders anyway and pack two boxes', feedback: 'Two boxes means two labels and double the postage, for one buyer.' },
        { text: 'Fix the sheet so all three rows say "Monique Reed" (or share one email), save, and upload again', best: true, feedback: 'Same name or email, one order, one box, one label.' },
        { text: 'Delete Mo\'s piece', feedback: 'She paid for it! Fix the name so it joins her order.' },
      ] },

    { chapter: 'Check and create', kind: 'learn', title: 'Check and create', text: 'Check the Column matches and the preview. If a column landed in the wrong place, use the dropdowns under Column matches to point it right. Red Live #s aren\'t in your inventory yet. When it looks right, tap Create orders (it says how many, like Create 14 orders) and every customer gets one order with its own ID, like DD-7K3P9Q.' },
    { kind: 'quiz', q: 'A Live # shows in red in the preview. What does that mean?', options: ['It isn\'t in your inventory', 'It already shipped', 'The price is wrong'], answer: 0, why: 'The line still imports, flagged so you can check it. Usually it\'s a typo in the Live # or a piece you never received in the app.' },
    { kind: 'quiz', q: 'Column matches put "Facebook name" under Customer name by mistake. What do you do?', options: ['Start over in a new spreadsheet', 'Use the dropdown under Column matches to point each field to the right column', 'Create orders and fix them later'], answer: 1, why: 'The dropdowns let you fix any column in seconds, right there in the preview.' },
    { kind: 'learn', title: 'Clean addresses, happy labels', text: 'Bad addresses are the number one cause of returned packages. Catch them here, before you ever buy a label.',
      points: ['Apartment or unit numbers go in Address 2', 'Use the 5-digit ZIP code', 'Two-letter state codes (GA, MI, TX) are safest', 'No address in file? Add it in Customers before you ship', 'If an address looks odd, message the buyer now, not after it bounces'] },
    { kind: 'quiz', q: 'Keisha lives at 410 Peach St, Apt 3B. Where does "Apt 3B" go?', options: ['At the end of Address', 'In Address 2', 'In Notes'], answer: 1, why: 'Address 2 is made for apartment and unit numbers, and label software reads it the right way.' },
    { kind: 'script', title: 'Missing address message', text: 'Send this the moment you see an order with no address. Most buyers answer within the hour.',
      lines: ['"Hi [name]! Thank you for shopping with me tonight 💛 I\'m getting your box ready, and I just need your shipping address (with apartment number if you have one). Reply here and it ships [day]!"'] },
    { kind: 'scenario', title: 'Exported too early', situation: 'You exported from Loyal Shops right as the live ended. Now two buyers haven\'t paid, and their pieces are already orders in Pick and pack.',
      options: [
        { text: 'Pack and ship them anyway', feedback: 'You\'d be mailing pieces nobody paid for.' },
        { text: 'Hold those two boxes until the payment deadline. If they don\'t pay, release the pieces to the next in line in Loyal Shops and bring in the new winners.', best: true, feedback: 'Nothing ships unpaid, and the runner-ups get their chance. Next time, export after the deadline.' },
        { text: 'Delete everything and start over', feedback: 'No need. Only two orders are affected.' },
      ] },
    { kind: 'order', title: 'Practice', prompt: 'Put the steps in order.', steps: ['Wait for the payment deadline', 'Export or fill in the sales template', 'Upload the CSV', 'Check the matches and preview', 'Create orders', 'Print box labels'] },
    { kind: 'reflect', title: 'Your after-live routine', prompt: 'Write when you\'ll bring in sales after each live, and how you\'ll make sure addresses are right.', placeholder: 'After each live I…', example: 'I export from Loyal Shops 15 minutes after the payment deadline, upload, check for red rows and missing addresses, then print box labels.' },
    { kind: 'checklist', title: 'Before you tap Create orders', prompt: 'Tick each one.', items: [
      'The payment deadline has passed',
      'No red Live #s I can\'t explain',
      'Each buyer shows up as one order, not two',
      'Every order has an address (or I\'ll add it in Customers)',
      'Apartment numbers are in Address 2',
    ] },
  ],
}
export default lesson
