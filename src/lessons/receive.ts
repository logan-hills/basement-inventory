import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'receive', title: 'Receive an item', track: 'Stock', icon: 'receive',
  why: 'Every piece gets a tag, a photo and a price the moment it arrives, so nothing gets lost in a box.',
  outcomes: [
    'Set up items, variations and tags the right way the first time',
    'Price every piece for real profit, not a guess',
    'Name items so you and your helpers can find them in a second',
    'Take photos that help your team and sell the piece',
    'Run a receiving station that handles a whole haul in one sitting',
  ],
  route: { to: '/intake', label: 'Receive an item' },
  covers: ['src/pages/Intake.tsx', 'src/pages/ItemDetail.tsx', 'src/pages/Inventory.tsx'], updated: '2026-11-23',
  slides: [
    { chapter: 'Items, variations, tags', kind: 'learn', title: 'Three words to know', nova: 'Get this part right and everything else in the app just works.',
      text: 'An item is the product (a gold hoop set). A variation is a size or color, and gets a 4-digit Live Number buyers type in comments. Every single piece gets its own tag, like 4821-003.',
      points: ['Item: what it is', 'Variation: size or color, with its own Live #', 'Tag: one per piece, so you know exactly which one sold'] },
    { kind: 'learn', title: 'When is it a new variation?', text: 'Ask one question: would a buyer care which one she gets? If yes, it\'s its own variation with its own Live Number. If no, it\'s more pieces of the same variation.',
      table: { head: ['You have…', 'Set it up as'], rows: [
        ['6 identical gold hoop sets', '1 item, 1 variation, 6 tags'],
        ['The same top in S, M and L', '1 item, 3 variations'],
        ['The same bag in black and emerald', '1 item, 2 variations'],
        ['3 different vintage brooches', '3 items (each one is its own thing)'],
      ] } },
    { kind: 'quiz', q: 'You have the same top in Small, Medium and Large. How many variations?', options: ['1', '3', 'One per piece'], answer: 1, why: 'Each size is a variation with its own Live Number. Each piece still gets its own tag.' },
    { kind: 'quiz', q: 'What does a buyer type in the comments to claim a piece?', options: ['The Live Number', 'The tag code', 'The bin code'], answer: 0, why: 'The 4-digit Live Number is for buyers. Tags are for you.' },

    { chapter: 'Add it', kind: 'learn', title: 'Add it', text: 'Stock → Add item. Name it, pick a category and tags, snap photos, then add each variation with its price, what you paid, and how many.',
      screen: { title: 'Receive items', rows: ['Name', 'Category', 'Photos', 'Variations'], buttons: ['Save and print tags'], highlight: 'Save and print tags' } },
    { kind: 'order', title: 'Practice', prompt: 'Put the steps in order.', steps: ['Tap Add item', 'Name it and pick a category', 'Snap photos', 'Add variations with price, cost and count', 'Save and print tags'] },
    { kind: 'learn', title: 'Names you can find', text: 'You\'ll search for this name, read it on the pick screen, and say it on live. Use the words you\'d actually type, in the same order every time.',
      table: { head: ['Hard to find', 'Easy to find'], rows: [
        ['"Cute earrings"', '"Gold hoop earrings, 3-pack"'],
        ['"Bag 12"', '"Emerald quilted crossbody, chain strap"'],
        ['"Top"', '"Leopard wrap top, long sleeve"'],
      ] },
      tip: 'Formula: color + material or pattern + what it is + one detail.' },

    { chapter: 'Price it for profit', kind: 'learn', title: 'Why "what you paid" matters', text: 'Your cost turns sales into profit. Reports, Home and Get ready for live all use it to show your real money. Without it, a "great live" might have lost you money and you\'d never know.', tip: 'Guess if you have to. A close number beats no number.' },
    { kind: 'learn', title: 'Count every cost', text: 'The price you paid isn\'t your only cost. Before you set a price, think about everything that comes out of the sale.',
      points: ['What you paid for the piece (and its share of shipping to you)', 'Card or invoice fee, often around 3% (check your Square rate)', 'Packaging: mailer, tissue, card', 'Any shipping you cover or discount'] },
    { kind: 'learn', title: 'A simple pricing rule', text: 'Many bargain sellers start at 2 to 3 times what they paid, then adjust for how special the piece is. Here\'s the math on a bag you paid $6 for.',
      table: { head: ['Price', 'Fee (3%)', 'Packaging', 'Your cost', 'Profit'], rows: [
        ['$12 (2×)', '$0.36', '$0.50', '$6', '$5.14'],
        ['$15 (2.5×)', '$0.45', '$0.50', '$6', '$8.05'],
        ['$18 (3×)', '$0.54', '$0.50', '$6', '$10.96'],
      ] },
      tip: 'A $2 Tuesday piece is a different game: you buy in bulk at pennies each so even $2 is real profit. Do the math on those too.' },
    { kind: 'number', title: 'Price it', q: 'You paid $4 for a scarf and want to sell it at 3 times your cost. What\'s the price?', prefix: '$', answer: 12, hint: 'Multiply what you paid by 3.', why: '$4 × 3 = $12. After a 3% fee (36 cents) and 50 cents of packaging, you keep about $7.14 profit.' },
    { kind: 'scenario', title: 'Price the "one of a kind"', situation: 'You found a stunning vintage brooch in a $20 mixed lot of 40 pieces. Most pieces in the lot are worth $3 to $5 each.',
      options: [
        { text: 'Price it at $1, since the whole lot only cost $20', feedback: 'Your cost per piece is low, but price is about what it\'s worth to the buyer. You\'d be giving away profit.' },
        { text: 'Price it higher, maybe $25 or more, and make it a Steal of the Night moment on live', best: true, feedback: 'Special pieces carry the lot. Show it off and let it pay for the cheaper ones.' },
        { text: 'Don\'t enter a cost at all, it\'s too hard to figure out', feedback: 'Use 50 cents ($20 ÷ 40 pieces). A close number keeps your Reports honest.' },
      ] },

    { chapter: 'Photos and details', kind: 'learn', title: 'Photos help your whole team', text: 'Anyone who scans or looks up a piece sees its photo, so helpers grab the right one fast. Three quick shots are plenty.',
      points: ['The whole piece, on a plain background', 'A close-up of the best detail (stitching, stones, hardware)', 'Any flaw, so nobody is surprised'],
      tip: 'Set up one "photo corner" by a window with a white poster board. Same spot, same light, every time.' },
    { kind: 'learn', title: 'More details, only if you want them', text: 'Under More details you can add condition, department, color, material, season, supplier and the date you bought it. All optional. Fill in the ones you\'ll actually search by, and Inventory\'s Filters can then show, say, every emerald piece or everything from one supplier.',
      screen: { title: 'Receive items', rows: ['+ More details', 'Condition: New with tags', 'Color: Emerald', 'Supplier: Atlanta market'], buttons: ['Save and print 3 tags'] },
      tip: 'Supplier is the one most sellers wish they had started on day one. It tells you which haul actually made money.' },
    { kind: 'learn', title: 'Got a UPC? Add it', text: 'If the product has its own barcode (a UPC), scan or type it on the item page. Pickers can then scan the product\'s barcode instead of the tag, and it shows on the picking screen.' },
    { kind: 'learn', title: 'Add the weight', text: 'On the item page, each variation has a weight in pounds. Weigh one piece in its mailer once. Then every shipping file fills it in for you, and your label prices are right the first time.' },

    { chapter: 'A receiving station', kind: 'learn', title: 'Receive a haul in one sitting', text: 'Big hauls go fastest when you work in batches, not piece by piece from start to finish.',
      points: ['1. Unpack everything and sort like with like', '2. Check for damage and set those aside', '3. Photograph each group in your photo corner', '4. Add the items and print the tags', '5. Tag every piece', '6. Scan them into bins right away'],
      tip: 'Over 30 items? Use Bulk upload from a spreadsheet instead. It has its own lesson.' },
    { kind: 'number', title: 'Cost per piece in a lot', q: 'You paid $36 for a mixed lot of 48 pieces of jewelry. What should you enter as the cost for each piece?', prefix: '$', answer: 0.75, tolerance: 0.01, hint: 'Divide what you paid for the lot by the number of pieces.', why: '$36 ÷ 48 = $0.75 each. If the lot had shipping, add that to the $36 first.' },
    { kind: 'checklist', title: 'Set up your receiving station', prompt: 'Tick what you have. The rest is your shopping or setup list.', items: [
      'A table where I can sort a whole haul',
      'A photo corner by a window with a white board',
      'My label printer or label sheets ready',
      'A small postal scale',
      'A "damaged, check later" bin',
      'Bins labeled and ready for put-away',
    ] },
    { kind: 'reflect', title: 'Your pricing rule', prompt: 'Write the pricing rule you\'ll use for most pieces, and the exception for special ones.', placeholder: 'Most pieces: … Special pieces: …', example: 'Most pieces: 2.5 times what I paid, rounded to a nice number. Special pieces: what it\'s worth, and I feature it on live.' },
  ],
}
export default lesson
