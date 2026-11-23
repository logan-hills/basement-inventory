import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'warehouse', title: 'Set up your shelves and bins', track: 'Stock', icon: 'warehouse',
  why: 'When every piece has a bin, anyone on your team can find it in seconds.',
  outcomes: [
    'Read and say any bin code, like A3-S2-C-01',
    'Plan a basement, closet or garage into aisles, sections, levels and bins',
    'Put fast sellers where they\'re easiest to grab',
    'Build your bins in the app and print bin labels',
    'Keep it tidy with a few simple house rules',
  ],
  route: { to: '/locations', label: 'Open Warehouse' },
  covers: ['src/pages/Warehouse.tsx', 'src/pages/BinDetail.tsx', 'src/pages/BinLabels.tsx'], updated: '2026-11-23',
  slides: [
    { chapter: 'How bins are named', kind: 'learn', title: 'A home for every piece', nova: "Real warehouses don't search. They know. Let's get you there.",
      text: 'Big warehouses don\'t keep things "somewhere over there." Every spot has an address, and every piece lives at one address. You\'re about to do the same thing in your basement, and it\'s simpler than it sounds.' },
    { kind: 'learn', title: 'Aisle, section, level, bin', text: 'A bin code reads like a street address, from big to small. Levels are letters and count up from the floor, so A is the bottom shelf.',
      table: { head: ['Part', 'Means', 'In A3-S2-C-01'], rows: [
        ['A3', 'Aisle 3 (a row of shelving)', 'The third shelving row'],
        ['S2', 'Section 2 (one shelving unit in that row)', 'The second unit'],
        ['C', 'Level C (shelf height, A = bottom)', 'The third shelf up'],
        ['01', 'Bin 1 (a spot or tub on that shelf)', 'The first spot from the left'],
      ] } },
    { kind: 'quiz', q: 'Level A is…', options: ['The bottom shelf', 'The top shelf', 'The first aisle'], answer: 0, why: 'Levels count up from the floor, so A is the bottom.' },
    { kind: 'quiz', q: 'Where is bin A1-S3-B-02?', options: ['Aisle 1, unit 3, second shelf up, second spot', 'Aisle 3, unit 1, bottom shelf, first spot', 'Aisle 2, unit 1, top shelf'], answer: 0, why: 'Read it left to right: Aisle 1, Section 3, Level B (second from the floor), Bin 02.' },

    { chapter: 'Plan your space', kind: 'learn', title: 'Walk your space first', text: 'Before you touch the app, stand in your space with paper and a pen. Sketch it from above.',
      points: ['Mark each shelving unit, and number the rows (aisles) starting from the door', 'Count the shelves on each unit (levels)', 'Decide how many tubs or spots fit on each shelf (bins)', 'Leave a clear walking path, about as wide as your shoulders plus a little', 'Keep a packing table near the door, where orders leave'] },
    { kind: 'learn', title: 'A worked example', text: 'Here\'s a basement with two rows of shelving, three units in each row, four shelves per unit, and four tubs per shelf.',
      table: { head: ['', 'Count'], rows: [
        ['Aisles (rows of shelving)', '2'],
        ['Sections per aisle (units)', '3'],
        ['Shelf levels (A, B, C, D)', '4'],
        ['Bins per level (tubs)', '4'],
        ['Total bins: 2 × 3 × 4 × 4', '96'],
      ] } },
    { kind: 'number', title: 'Count your bins', q: 'One aisle, 2 shelving units, 5 shelves each, 3 tubs per shelf. How many bins?', answer: 30, hint: 'Aisles × sections × levels × bins per level.', why: '1 × 2 × 5 × 3 = 30 bins, A1-S1-A-01 through A1-S2-E-03.' },
    { kind: 'learn', title: 'The golden zone', text: 'Not all shelves are equal. The shelves between your waist and your shoulders are the fastest to reach, with no bending or stretching. Warehouses call this the golden zone. Put your best sellers there.',
      table: { head: ['Where', 'Put'], rows: [
        ['Waist to shoulder (golden zone)', 'Best sellers, this week\'s live pieces'],
        ['Bottom shelf', 'Heavy things, bulk backstock'],
        ['Top shelf', 'Light, slow movers and seasonal pieces'],
        ['Nearest the packing table', 'Mailers, tape, the things you grab every order'],
      ] },
      tip: 'Reports → Best sellers tells you what deserves the golden zone. Check it once a month.' },
    { kind: 'scenario', title: 'Where do the hoops go?', situation: 'Your gold hoops sell 20 pairs a week. Your winter scarves sell 2 a month until December.',
      options: [
        { text: 'Hoops on the bottom shelf in the back, scarves at eye level by the door', feedback: 'You\'d bend and walk for your best seller 20 times a week. Flip it.' },
        { text: 'Hoops at waist-to-shoulder height near the front, scarves up top or at the back until the season', best: true, feedback: 'Fast movers in the golden zone, slow movers out of the way. That\'s how pick time drops.' },
        { text: 'Put them together because they\'re both accessories', feedback: 'Grouping by type is fine within the golden zone, but how often it sells matters more for where it goes.' },
      ] },
    { kind: 'reflect', title: 'Sketch your space', prompt: 'Describe your space: how many rows of shelving, units per row, shelves per unit, and spots per shelf. Which shelves are your golden zone?', placeholder: 'I have…', example: '2 rows, 2 units each, 5 shelves, 4 tubs per shelf = 80 bins. Golden zone is levels B and C. Bags go on the bottom.' },

    { kind: 'learn', title: 'Pick your bins', text: 'What you put on the shelves matters as much as the shelves. Clear, same-size tubs stack neatly, show what\'s inside, and make every bin the same size in your head.',
      table: { head: ['Container', 'Good for', 'Tip'], rows: [
        ['Clear shoebox-size tubs', 'Jewelry, scarves, small accessories', 'Stack two high at most, so you can see the label'],
        ['Larger clear tubs with lids', 'Folded tops, soft bags', 'One variation per tub when you can'],
        ['Open shelf spot, no tub', 'Structured bags, boxed shoes', 'Label the shelf edge'],
        ['Bead or tackle organizers', 'Rings and earrings in bags', 'One organizer = one bin, label the lid'],
      ] } },
    { kind: 'scenario', title: 'Not enough shelves yet', situation: 'You only have one 5-shelf unit and a closet floor full of tubs. You want to start today.',
      options: [
        { text: 'Wait until you can buy all the shelving you\'ll ever need', feedback: 'Waiting means another live of digging through tubs. Start with what you have.' },
        { text: 'Set up 1 aisle, 1 section, 5 levels now, and call the closet floor Aisle 2 with each tub as a bin. Add shelving later with Edit layout.', best: true, feedback: 'Any spot can be a bin as long as it has a label and stays put. Grow the layout as you grow.' },
        { text: 'Skip bins and use the Notes field to say where things are', feedback: 'Notes can\'t be scanned, and the pick list can\'t sort by them. Bins are what make picking fast.' },
      ] },
    { chapter: 'Build it in the app', kind: 'learn', title: 'Build it once, change it anytime', text: 'Warehouse → Set up your warehouse. Enter your first and last aisle number, sections per aisle, shelf levels and bins per level, and tap Create bins. Every bin is made at once. Use Edit layout to add bins or remove empty ones later.',
      screen: { title: 'Warehouse', buttons: ['Edit layout', 'Print bin labels'], highlight: 'Edit layout' } },
    { kind: 'quiz', q: 'Can you remove a bin that still has items in it?', options: ['No, empty it first', 'Yes, items are deleted too'], answer: 0, why: 'Only empty bins can be removed, so nothing goes missing.' },
    { kind: 'learn', title: 'Bin labels', text: 'Print bin labels gives each bin a label with its code and a big barcode. Choose a 4×6 landscape label for your shipping printer, a letter sheet of 10 (4×2 in, Avery 5163 size), or Thermal roll 2×1 in, one bin per label, using the same small roll as your item tags. Stick one on the front edge of each shelf spot, or on the tub itself.',
      tip: 'Label the shelf spot, not just the tub. Tubs get moved. The shelf stays put.' },
    { kind: 'learn', title: 'Open a bin', text: 'Tap any bin on the map or list to see everything in it, how many units, and the retail value. Tap Put items here, then scan tags to shelve them. Swipe a tag left to take it out.' },

    { chapter: 'Keep it tidy', kind: 'learn', title: 'House rules', text: 'A system only works if everyone follows it. Tape these up by the shelves.',
      points: ['Every piece gets scanned into a bin. No "I\'ll do it later" piles.', 'One variation per bin when you can, so pickers grab the right one', 'If you move it, scan it into its new bin', 'Empty tub? Leave it labeled and ready for the next haul', 'Unsorted returns and new hauls go in ONE "inbox" spot near the door'] },
    { kind: 'quiz', q: 'Your helper moved 5 bags to a new shelf but didn\'t scan them. What happens on pick day?', options: ['Nothing, the app knows', 'The pick screen sends you to the old bin and you can\'t find them', 'The bags get deleted'], answer: 1, why: 'The app only knows what\'s scanned. Moved it? Scan the new bin, then scan the tags.' },
    { kind: 'quiz', q: 'Where should a bin label go?', options: ['On the shelf spot itself', 'Only on the lid of the tub', 'Anywhere nearby'], answer: 0, why: 'Tubs get moved and swapped. The shelf spot stays put, so label the shelf (and the tub too, if you like).' },
    { kind: 'checklist', title: 'Set up your warehouse', prompt: 'Tick each step as you do it.', items: [
      'Sketch my space and count aisles, sections, levels and bins',
      'Decide my golden zone',
      'Create my bins in Warehouse',
      'Print bin labels',
      'Stick a label on every shelf spot',
      'Tape up the house rules',
    ] },
  ],
}
export default lesson
