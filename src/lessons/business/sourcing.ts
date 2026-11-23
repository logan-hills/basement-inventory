import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'sourcing', kind: 'course', school: 'Money and buying', title: 'Buy smarter: purchasing that pays', track: 'Business', icon: 'cart',
  why: 'You make your profit when you buy, not when you sell. Smart purchasing means more of what sells and less of what sits.',
  outcomes: [
    'Know the main ways live sellers source stock, and the trade-offs of each',
    'Work out landed cost: what a piece really costs you to get on the shelf',
    'Use sell-through and your top categories to decide what to buy',
    'Set an "open to buy" budget so you never overbuy',
    'Inspect and record every delivery so problems get caught early',
  ],
  route: { to: '/reports', label: 'Open Reports' },
  sources: [
    { org: 'U.S. Small Business Administration', title: 'Manage your finances', url: 'https://www.sba.gov/business-guide/manage-your-business/manage-your-finances' },
    { org: 'Shopify', title: 'Warehouse slotting and inventory strategy', url: 'https://www.shopify.com/enterprise/blog/warehouse-slotting' },
    { org: 'PA Department of Revenue', title: 'Sales, use and hotel occupancy tax (resale exemptions)', url: 'https://www.pa.gov/en/agencies/revenue/resources/tax-types-and-information/sales-use-and-hotel-occupancy-tax.html' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Where stock comes from', kind: 'learn', title: 'Your sourcing options', nova: 'Here\'s a secret the big retailers live by: you make your money the day you buy.',
      text: 'Live sellers usually mix several sources. Each has a different cost, risk and amount of work.',
      table: { head: ['Source', 'Good for', 'Watch out for'], rows: [
        ['Wholesale vendors', 'New items in sizes and colors, repeatable', 'Minimum orders; need a resale certificate'],
        ['Liquidation and closeout lots', 'Big discounts, brand names', 'Mixed condition, unknown contents, damage'],
        ['Customer returns pallets', 'Very low cost per piece', 'Lots of sorting, broken or missing pieces'],
        ['Thrift and estate sales', 'One-of-a-kind and vintage', 'Time-heavy, one piece at a time'],
        ['Trade shows and markets', 'Meeting vendors face to face, new trends', 'Travel cost, buying too much in excitement'],
      ] } },
    { kind: 'reflect', title: 'Your current mix', prompt: 'Where does your stock come from now, roughly by percent? Which source makes you the most profit for your time?', placeholder: 'About …% from…', example: '60% liquidation lots, 30% thrift, 10% one wholesale vendor. The wholesale pieces sell fastest with the least sorting.' },

    { chapter: 'Landed cost', kind: 'learn', title: 'What it really costs', text: 'The price on the invoice isn\'t your cost. Landed cost adds everything it took to get the piece onto your shelf.',
      table: { head: ['Cost', 'Example lot of 100 pieces'], rows: [
        ['Lot price', '$800'],
        ['Freight or shipping to you', '$120'],
        ['Damaged or unsellable pieces (10)', 'Spread over the 90 good ones'],
        ['Your sorting and tagging time', 'Worth counting, even if you don\'t pay yourself for it'],
        ['Landed cost per good piece', '($800 + $120) ÷ 90 = about $10.22'],
      ] } },
    { kind: 'number', title: 'Landed cost', q: 'A lot costs $600 plus $90 freight. Of 75 pieces, 6 are damaged. What\'s the landed cost per sellable piece? (Round to the cent.)', prefix: '$', answer: 10, tolerance: 0.01, hint: '($600 + $90) ÷ (75 − 6).', why: '$690 ÷ 69 = $10.00 per piece. Price from that number, not from $600 ÷ 75 = $8, or you\'ll underprice.' },
    { kind: 'learn', title: 'Mark damaged pieces right away', text: 'Damaged pieces raise the cost of the good ones. Mark them damaged in the app (you can damage out several at once and set how many) so your counts and costs stay honest, and so you can show the vendor what came broken.' },

    { chapter: 'What to buy', kind: 'learn', title: 'Sell-through tells the truth', text: 'Sell-through is the share of what you bought that sold in a set time. It\'s how retail buyers judge every purchase.',
      table: { head: ['Category', 'Bought (90 days)', 'Sold', 'Sell-through'], rows: [
        ['Handbags', '120', '96', '80%: buy more'],
        ['Jewelry', '200', '150', '75%: steady'],
        ['Tops', '180', '54', '30%: buy less, or cheaper'],
        ['Home decor', '60', '9', '15%: stop and clear it out'],
      ] },
      tip: 'Reports shows your top categories and the percent of sales each makes. Use it before every buying trip.' },
    { kind: 'number', title: 'Sell-through', q: 'You bought 80 scarves and sold 52 in 60 days. What\'s the sell-through in percent?', answer: 65, tolerance: 0.5, suffix: '%', hint: '52 ÷ 80 × 100.', why: '52 ÷ 80 = 65%. Solid. Compare it to your other categories before you reorder.' },

    { chapter: 'Open to buy', kind: 'learn', title: 'A budget before you shop', text: 'Retail buyers use an "open to buy" budget: how much they can spend on new stock this month without overloading the shelves or the bank account.',
      points: ['Start with your Restock bucket (from the money course)', 'Subtract anything already ordered', 'Look at old stock: if it\'s over about 15 to 20% of your shelves, buy less and run a sale', 'Split the budget by category using sell-through', 'Bring the number with you. When it\'s spent, you\'re done.'] },
    { kind: 'scenario', title: 'The trade show', situation: 'You\'re at a trade show with a $1,500 open-to-buy budget. You\'ve spent $1,300. A vendor shows you gorgeous home decor for $600, "today only."',
      options: [
        { text: 'Buy it, it\'s gorgeous', feedback: 'You\'d blow the budget on your slowest category (15% sell-through). Gorgeous isn\'t the same as profitable.' },
        { text: 'Take the vendor\'s card, note the line, and pass for now. Maybe test a small order later.', best: true, feedback: 'The budget protects you from "today only" pressure. Good vendors will still be there for a small test order.' },
        { text: 'Buy it and skip next month\'s buying instead', feedback: 'That leaves you short on your best sellers next month. Stick to the plan.' },
      ] },

    { chapter: 'Receiving', kind: 'learn', title: 'Check every delivery', text: 'Problems are easiest to fix the day a delivery arrives. Big retailers check every shipment against the order before it goes on a shelf.',
      points: ['Count pieces against the invoice or packing list', 'Photograph damage before you unpack further', 'Record cost on each item as you receive it', 'Contact the vendor within their claim window (often a few days)', 'Tag and shelve within 48 hours so it can sell'] },
    { kind: 'learn', title: 'Case study: two lots', text: 'Two lots, same price. Which is better?',
      table: { head: ['', 'Lot A: mixed returns', 'Lot B: manifested closeouts'], rows: [
        ['Price + freight', '$700', '$700'],
        ['Pieces', '150', '60'],
        ['Unsellable', '45', '2'],
        ['Landed cost per good piece', '$6.67', '$12.07'],
        ['Average sale price', '$14', '$32'],
        ['Hours to sort and tag', '10', '3'],
        ['Profit before your time', '$770', '$1,156'],
      ] },
      example: 'Lot B costs more per piece but earns more total profit in a third of the time. Cheaper per piece isn\'t always cheaper.' },
    { kind: 'number', title: 'Profit per hour', q: 'Lot B earns $1,156 profit and takes 3 hours to process. Lot A earns $770 and takes 10 hours. How much more profit per hour does Lot B earn? (Round to the dollar.)', prefix: '$', answer: 308, tolerance: 1, hint: 'Lot B: $1,156 ÷ 3. Lot A: $770 ÷ 10. Subtract.', why: '$385 − $77 = $308 more per hour of your time. Your hours are worth counting.' },
    { kind: 'reflect', title: 'Your buying rules', prompt: 'Write three buying rules for yourself, like a professional buyer would.', placeholder: 'Rule 1… Rule 2… Rule 3…', example: '1. No category under 40% sell-through gets reordered. 2. Landed cost under 1/3 of my sale price. 3. Never spend past my open-to-buy.' },
    { kind: 'checklist', title: 'Smarter buying', prompt: 'Tick what you\'ll do before your next buying trip.', items: ['Work out landed cost on my last 2 lots', 'Check sell-through by category in Reports', 'Set this month\'s open-to-buy budget', 'Split the budget by category', 'Write a receiving checklist and tape it by the door', 'Have my resale certificate ready for vendors'] },
  ],
}
export default lesson
