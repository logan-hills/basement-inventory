import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'storage', kind: 'course', school: 'Operations', title: 'Organize your stock like the big warehouses', track: 'Business', icon: 'warehouse',
  why: 'Every minute you spend searching for a piece is a minute you are not selling, packing or resting.',
  outcomes: [
    'Give every shelf and bin an address anyone can find in seconds',
    'Choose fixed homes, open homes, or a mix, the way large fulfillment centers do',
    'Put your fastest sellers in the "golden zone" so picking takes half the steps',
    'Run a 5S reset on your stock room and keep it that way',
    'Count your stock a little at a time instead of one miserable day a year',
  ],
  route: { to: '/locations', label: 'Open Warehouse' },
  sources: [
    { org: 'ASQ (American Society for Quality)', title: 'What is 5S?', url: 'https://asq.org/quality-resources/five-s-tutorial' },
    { org: 'Georgia Tech, Bartholdi and Hackman', title: 'Warehouse and Distribution Science (free textbook)', url: 'https://www2.isye.gatech.edu/~jjb/wh/book/' },
    { org: 'Shopify', title: 'Warehouse slotting: strategies for faster picking', url: 'https://www.shopify.com/enterprise/blog/warehouse-slotting' },
    { org: 'Amazon', title: 'Inside Amazon\'s fulfillment centers', url: 'https://www.aboutamazon.com/amazon-fulfillment/our-fulfillment-centers/inside-amazons-fulfillment-centers-what-you-can-expect-to-see-on-a-warehouse-tour/' },
  ],
  queen: {
    welcome: "Every minute spent searching is a minute you're not selling, packing or resting. Let's organize your stock like the big warehouses do, just sized for your home.",
    signoff: "Give every piece a home, put your best sellers in the golden zone, and count a little every week. An organized shop is a calmer life.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Where the time goes', kind: 'learn', title: 'Searching is the silent thief', nova: 'Grab a coffee, boss. This course is going to give you hours back every single week.',
      text: 'Big warehouses obsess over one thing: how long it takes to put a hand on the right item. Researchers who study warehouses (like the Georgia Tech professors behind the free textbook Warehouse and Distribution Science) found that walking and searching eat up most of a picker\'s day, often more than the picking itself. The same thing happens in a basement, a spare bedroom or a storage unit.',
      points: ['Searching feels like work, but the buyer never pays for it', 'It grows quietly: 30 seconds a piece turns into hours a week', 'A good system makes searching close to zero, even for a helper on her first day'] },
    { kind: 'learn', title: 'Put a number on it', text: 'Here\'s what searching costs one seller who pulls 80 pieces for each of two lives a week.',
      table: { head: ['How she finds pieces', 'Time per piece', 'Time per week (160 pieces)'], rows: [
        ['Dig through tubs', 'About 90 seconds', 'About 4 hours'],
        ['Shelves, but no addresses', 'About 40 seconds', 'About 1 hour 45 minutes'],
        ['Bin addresses, list in bin order', 'About 15 seconds', 'About 40 minutes'],
      ] },
      example: 'Going from tubs to addressed bins gives this seller back over 3 hours every week. That is a whole extra live, or a whole evening with her family.' },
    { kind: 'number', title: 'Your search time', q: 'You pull 60 pieces a week and it takes about 2 minutes to find each one. How many hours a week is that?', answer: 2, tolerance: 0.05, suffix: 'hours', hint: '60 pieces × 2 minutes = how many minutes? Divide by 60.', why: '60 × 2 = 120 minutes, which is 2 hours a week, or about 100 hours a year. That\'s two and a half full work weeks spent digging.' },

    { chapter: 'An address for everything', kind: 'learn', title: 'Think like the post office', nova: 'If the mail carrier can find your house, your helper can find a bracelet.',
      text: 'Every spot that holds stock gets an address, read from big to small, the same way every time. Warehouses usually go zone, then aisle or rack, then shelf, then bin. Keep it short enough to say out loud.',
      table: { head: ['Part', 'Means', 'Example'], rows: [
        ['Zone', 'A room or area', 'A = basement, B = garage'],
        ['Rack', 'One shelving unit, numbered left to right', '02'],
        ['Shelf', 'Counted from the floor up', '3'],
        ['Bin', 'Lettered left to right on that shelf', 'C'],
      ] },
      tip: 'Read it out loud: A-02-3-C is "basement, rack two, third shelf, bin C." In the app, each bin gets a printed barcode label so you can scan it instead of reading it.' },
    { kind: 'quiz', q: 'Your helper needs bin B-04-1-A. Where does she go?', options: ['Basement, rack 1, shelf 4, bin A', 'Garage, rack 4, bottom shelf, first bin on the left', 'Garage, rack 1, shelf 4, bin A'], answer: 1, why: 'Big to small: zone B (garage), rack 04, shelf 1 (counted from the floor), bin A (leftmost). Same order every time, so nobody has to guess.' },
    { kind: 'learn', title: 'Fixed homes or open homes?', text: 'Warehouses use two styles. With fixed homes, each item always lives in the same bin. With open homes (sometimes called random or "chaotic" storage), you put new stock in whatever bin has room and the system remembers where. Amazon\'s fulfillment centers are famous for open homes: items are stowed wherever there\'s space, and every move is scanned.',
      table: { head: ['', 'Fixed homes', 'Open homes'], rows: [
        ['Best for', 'Steady items you restock (basics, staples)', 'One-of-a-kind pieces, hauls, fast-changing stock'],
        ['Upside', 'People learn where things are', 'No wasted shelf space, faster put-away'],
        ['Catch', 'Empty bins sit waiting for their item', 'Only works if every move is scanned'],
      ] },
      tip: 'Most live sellers do best with a mix: fixed homes for repeat items, open homes for hauls. The Scan page is what makes open homes safe: scan the bin, then scan the tags.' },
    { kind: 'scenario', title: 'The new haul', situation: 'A 40-piece haul of mixed handbags arrives. Your "handbags" shelf is full, but there are three half-empty bins on the next rack over.',
      options: [
        { text: 'Stack the haul on the floor until the handbag shelf has room', feedback: 'Floor stock is where pieces go to get lost and stepped on. It also hides from your system.' },
        { text: 'Put the bags in the half-empty bins, scanning each bin and then each tag', best: true, feedback: 'That\'s open storage done right. The bins get used, and the app knows exactly where every bag is.' },
        { text: 'Put them in the half-empty bins and remember where they went', feedback: 'Your memory is good, but not 40-bags-and-two-lives-a-week good. And your helper can\'t read your mind. Scan it.' },
      ] },

    { chapter: 'Fast sellers up front', kind: 'learn', title: 'ABC: not every piece deserves the same spot', nova: 'This is the trick the big companies use that almost no small seller knows.',
      text: 'In most shops, a small share of items makes up most of the action. It\'s often close to the 80/20 rule: about 20% of your items cause about 80% of your picks. Warehouses sort items into A, B and C by how often they move, then give the best spots to the A items. This is called slotting.',
      table: { head: ['Class', 'What it is', 'Where it lives'], rows: [
        ['A', 'Your fastest movers and repeat items', 'Closest to your packing table, at waist-to-shoulder height'],
        ['B', 'Steady sellers', 'Next ring out'],
        ['C', 'Slow movers, off-season, overstock', 'Top shelves, bottom shelves, back corners'],
      ] } },
    { kind: 'learn', title: 'The golden zone', text: 'The "golden zone" is the band between your waist and your shoulders. Grabbing from there needs no bending, stretching or step stool, so it\'s the fastest and easiest on your body. Warehouses save it for A items. Heavy items go low (never overhead), light and slow items go high.',
      points: ['Waist to shoulder: A items', 'Knee to waist: B items and anything heavy', 'Above the shoulder or near the floor: C items and overstock', 'The rack nearest your packing table is prime real estate. Treat it that way.'],
      tip: 'Your Reports page shows your best sellers and best categories. Check it once a month and move the winners into the golden zone.' },
    { kind: 'order', title: 'Slot it right', prompt: 'Order these spots from best (first) to worst for your top-selling earrings.', steps: ['Rack by the packing table, chest height', 'Rack by the packing table, top shelf', 'Back rack, top shelf', 'Back rack, floor, behind a box of overstock'] },
    { kind: 'scenario', title: 'The heavy winner', situation: 'Your boot drop is selling like crazy. The boots are heavy, and the only golden-zone spot left is above your packing table.',
      options: [
        { text: 'Put the boots on the top shelf so they are out of the way', feedback: 'Heavy items overhead are a safety risk and slow to reach. That\'s the opposite of what a fast seller needs.' },
        { text: 'Put the boots at knee-to-waist height near the table and move a slow, light item up top', best: true, feedback: 'Exactly. Heavy goes low, fast goes close, and the slow item gives up its spot.' },
        { text: 'Leave them in the back, you\'ll walk', feedback: 'You\'ll walk dozens of extra trips this week. Re-slotting takes ten minutes once.' },
      ] },

    { chapter: '5S your stock room', queen: "Do your 5S reset on the same day each month. Tidy spaces stay tidy when it's routine.", kind: 'learn', title: 'The five S\'s', nova: 'This one comes from Japanese factories, and it works in a basement just as well.',
      text: '5S is a method for keeping a workspace organized so problems show up right away. The American Society for Quality (ASQ) teaches it as five steps, each starting with S.',
      table: { head: ['Step', 'What you do', 'In your stock room'], rows: [
        ['Sort', 'Remove what doesn\'t belong', 'Pull empty boxes, broken hangers, personal stuff'],
        ['Set in order', 'A place for everything', 'Bin addresses, labeled supply spots'],
        ['Shine', 'Clean and inspect', 'Wipe shelves, check for damage, fix wobbly racks'],
        ['Standardize', 'Make it the same every time', 'A written reset routine and labels everywhere'],
        ['Sustain', 'Keep it going', 'A 10-minute reset after every pack day'],
      ] } },
    { kind: 'learn', title: 'The red tag trick', text: 'During Sort, anything you aren\'t sure about gets a red tag (a red sticky note works) and goes to one "decide later" shelf. After 30 days, anything nobody needed is sold off in a clearance live, donated or tossed.',
      example: 'One seller red-tagged 120 slow pieces. Two weeks later she ran a "$5 Red Tag Rescue" live, cleared 85 of them, and freed up an entire rack for new hauls.',
      tip: 'Damaged pieces don\'t belong on the selling shelves at all. Mark them damaged in the app so they leave your counts, and keep them in one labeled box.' },
    { kind: 'checklist', title: 'Your 5S reset', prompt: 'Pick a day this week and tick these off as you go.', items: ['Sort: pull out everything that isn\'t stock or supplies', 'Red-tag anything you\'re unsure about', 'Set in order: give every shelf and bin an address label', 'Shine: wipe down shelves and check for damaged pieces', 'Standardize: write a 5-line reset routine and tape it to the rack', 'Sustain: put a 10-minute reset on your calendar after every pack day'] },

    { chapter: 'Count without closing', queen: "Count one shelf a week while your coffee cools. You'll never need a dreaded all-day count again.", kind: 'learn', title: 'Cycle counting', text: 'Big warehouses rarely shut down for one giant count. Instead they count a few bins every week, so every bin gets counted on a schedule. This is called cycle counting. The fast A items get counted most often, because that\'s where mistakes cost the most.',
      table: { head: ['Class', 'How often to count', 'Time it takes'], rows: [
        ['A items', 'Every week', '10 to 15 minutes'],
        ['B items', 'Every month', '15 to 20 minutes'],
        ['C items', 'Every quarter', 'About 30 minutes'],
      ] },
      tip: 'Count right before you plan a live. Finding a missing piece on Monday beats telling a buyer it\'s gone on Wednesday.' },
    { kind: 'number', title: 'How accurate are you?', q: 'You count 50 bins and 47 match what the app says. What percent are accurate?', answer: 94, tolerance: 0.5, suffix: '%', hint: 'Divide 47 by 50, then multiply by 100.', why: '47 ÷ 50 = 0.94, so 94%. Good start! Large warehouses aim for well above 99%. Every bin you fix brings you closer, and fewer buyers hear "sorry, it\'s missing."' },
    { kind: 'learn', title: 'When a count is off', text: 'A count that doesn\'t match is a clue, not a crisis. Find the cause so it doesn\'t happen again.',
      points: ['Check the bins on either side first. Most "missing" pieces are next door.', 'Check the damaged box and your packing table', 'Look at the item\'s history: was it sold but never picked?', 'Fix the count in the app and jot down what caused it', 'If the same cause shows up twice, change the process, not just the number'] },

    { chapter: 'Room to grow', kind: 'learn', title: 'Forward pick and back stock', text: 'When stock outgrows your shelves, warehouses split storage in two. The forward pick area holds a few of each item close to packing. Back stock (reserve) holds the rest in bulk, further away, and refills the front when it runs low.',
      example: 'You have 24 of the same crossbody bag. Keep 4 in the golden zone by your packing table and 20 boxed in back stock. When the front gets down to 1, refill it before your next live.',
      tip: 'Give back stock its own zone letter (like Z) so a refill is a simple scan: scan the back bin, scan the front bin, done.' },
    { kind: 'reflect', title: 'Your one big change', prompt: 'Walk through your stock area in your head. What is the one change from this course that would save you the most time? What day will you do it?', placeholder: 'The biggest change I\'ll make is…', example: 'Move jewelry, my top category, to the rack next to my packing table at chest height, and give every bin an address. Sunday afternoon.' },
    { kind: 'checklist', title: 'Your 30-day plan', prompt: 'Tick what you\'ll commit to this month.', items: ['Address every shelf and bin, and print bin labels', 'Pick fixed homes, open homes, or a mix, and write it down', 'Move my top sellers into the golden zone by my packing table', 'Run a 5S reset and a red-tag clearance live', 'Start cycle counting my A items every week', 'Check Reports monthly and re-slot my winners'] },
  ],
}
export default lesson
