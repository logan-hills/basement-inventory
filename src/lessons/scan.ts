import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'scan', title: 'Scan to put away and look up', track: 'Stock', icon: 'scan',
  why: 'Scanning records where every piece lives without typing a thing.',
  outcomes: [
    'Put a whole tub away in a minute: bin, scan, scan, scan, Done',
    'Look up any tag, bin or order with one scan',
    'Choose and set up a scanner, or use your phone\'s camera',
    'Run a quick weekly count so the app always matches your shelves',
    'Fix a scanner that "does nothing"',
  ],
  route: { to: '/scan', label: 'Open Scan' },
  covers: ['src/pages/Scan.tsx'], updated: '2026-11-23',
  slides: [
    { chapter: 'Put away', kind: 'learn', title: 'Scan the bin, then the pieces', nova: 'This is my favorite part. Beep, beep, beep, done.',
      text: 'Scan a bin label and a gold banner shows the bin you\'re putting away into. Every tag you scan next goes in that bin. Tap Done when you move on.',
      screen: { title: 'Scan', rows: ['Putting away into A1-S2-B-03', '✓ 4821-003', '✓ 4821-004'], buttons: ['Done'], highlight: 'Done' } },
    { kind: 'order', title: 'Practice', prompt: 'Put away three pieces. Tap the steps in order.', steps: ['Open Scan', 'Scan the bin label', 'Scan each tag', 'Tap Done'] },
    { kind: 'learn', title: 'Moving a piece is the same', text: 'Scanning a tag into a new bin moves it there. No need to "take it out" of the old one first. That makes reorganizing easy: scan the new bin, scan everything you moved.' },
    { kind: 'quiz', q: 'You move 4 scarves from A1-S1-A-02 to A1-S2-C-01. What do you scan?', options: ['The old bin, then the scarves', 'The new bin, then the scarves', 'Just the scarves'], answer: 1, why: 'The bin you scan first is where they go. Scanning them into the new bin moves them.' },

    { chapter: 'Look anything up', kind: 'learn', title: 'Scan anything to look it up', text: 'With no bin active, a scan is a lookup.',
      table: { head: ['Scan', 'You see', 'Handy for'], rows: [
        ['A tag (4821-003)', 'The item, its photo, price and bin', 'A buyer asks about a piece on the table'],
        ['A bin label', 'Everything in that bin', 'Checking what\'s on a shelf'],
        ['An order ID (DD-…)', 'That order', 'A box on the packing table'],
      ] } },
    { kind: 'quiz', q: 'You scan a tag with no bin scanned first. What happens?', options: ['It opens the item so you can look it up', 'It deletes the tag', 'Nothing'], answer: 0, why: 'With no bin active, a scan is a lookup.' },

    { kind: 'learn', title: 'Lookups on live night', text: 'Keep a scanner or your phone next to your live table. When a buyer asks a question you can\'t answer from memory, one scan answers it.',
      example: '"Is that the large or the extra large?" "How much was the emerald one?" "Do you have another one of those?" Scan the tag and the item, variation, price and how many are left are right there.' },
    { kind: 'scenario', title: 'The returned bracelet', situation: 'A buyer returned a bracelet. It still has its tag. You set it on the packing table.',
      options: [
        { text: 'Leave it on the table and put it away this weekend', feedback: 'By the weekend it\'s under a pile of mailers, and if someone claims it on Thursday, the pick screen sends you to the wrong place.' },
        { text: 'Walk it to a bin now: scan the bin label, scan the tag, Done', best: true, feedback: 'Fifteen seconds and it\'s home, findable and sellable again.' },
        { text: 'Put it in your purse so you don\'t lose it', feedback: 'Your purse isn\'t a bin the app knows about! Scan it home.' },
      ] },
    { chapter: 'Scanners', kind: 'learn', title: 'Which scanner?', text: 'Any USB or Bluetooth scanner works, because they type like a keyboard. Android scanner phones work in the browser. On an iPhone, pair a Bluetooth scanner or tap Use camera. Recommended gear (in the More menu) lists three we trust, from budget to pro, and has a scanner test box that tells you if yours is set up right.',
      table: { head: ['Scanner', 'Good for', 'Watch out for'], rows: [
        ['USB corded', 'A desk or packing table. Cheapest and never needs charging', 'The cord limits how far you walk'],
        ['Bluetooth or wireless', 'Walking the shelves', 'Charge it overnight'],
        ['Android scanner phone', 'All-in-one: scan and see the screen in your hand', 'Costs more'],
        ['Phone camera', 'Free, and always with you', 'Slower in dim light'],
      ] },
      tip: 'A clip-on scanner for your iPhone makes picking fast and keeps the big screen in your hand.' },
    { kind: 'quiz', q: 'You do most of your scanning walking up and down the shelves. Best pick?', options: ['A USB corded scanner', 'A Bluetooth scanner or an Android scanner phone', 'A desktop computer webcam'], answer: 1, why: 'Wireless goes where you go. Save the corded one for the packing table.' },
    { kind: 'learn', title: 'Set up a new scanner', text: 'Most scanners work out of the box. If yours doesn\'t, the fix is almost always in the little manual that came with it. It has setup barcodes you scan to change settings.',
      points: ['Pair Bluetooth scanners in your device\'s Bluetooth settings, like headphones', 'Make sure it sends "Enter" after each scan. The manual calls it an Enter or CR suffix. (Scanners that send Tab instead work too: the scan box treats Tab like Enter.)', 'Set it to US keyboard if numbers come out wrong', 'Test it in a notes app first: scan a tag and the code should appear and jump to a new line'] },
    { kind: 'scenario', title: 'The scanner beeps but nothing happens', situation: 'Your new Bluetooth scanner beeps when you scan a tag, but nothing shows up in the app.',
      options: [
        { text: 'Return it, it\'s broken', feedback: 'It beeps, so it\'s reading the barcode. The problem is where the text is going.' },
        { text: 'Tap into the scan box so it has a blinking cursor, then test the scanner in a notes app. If nothing types there either, re-pair it in Bluetooth settings.', best: true, feedback: 'That\'s the order that fixes 9 out of 10 cases: focus, test, re-pair.' },
        { text: 'Type the codes in by hand from now on', feedback: 'That\'s the slow road you bought a scanner to avoid. It\'s almost always a quick fix.' },
      ] },
    { kind: 'learn', title: 'Camera tips', text: 'No scanner? Your phone camera works. Help it out:',
      points: ['Good light. Turn on a lamp, or scan near a window.', 'Hold the barcode flat and fill about half the screen', 'Hold still for a second. Moving blurs the lines.', 'Tap Stop camera when you\'re done to save battery'] },

    { kind: 'quiz', q: 'Your phone camera keeps missing the barcode. What helps most?', options: ['Move the phone around faster', 'Better light and hold still, with the barcode filling about half the screen', 'Zoom all the way in'], answer: 1, why: 'Light and stillness do most of the work. Too close or too far both make it miss.' },
    { chapter: 'Work fast', kind: 'learn', title: 'The rhythm', text: 'Keep the scan box focused and never touch the mouse: bin, scan, scan, scan. Turn sound on so you hear each scan land, and you don\'t have to look up after every beep.',
      tip: 'Put away right after you receive. A tub of tagged but un-binned pieces is a tub you\'ll be digging through on live night.' },
    { kind: 'number', title: 'Is it worth it?', q: 'Typing a tag code by hand takes about 8 seconds. Scanning takes about 2. How many seconds do you save putting away 150 pieces?', answer: 900, suffix: 'seconds', hint: 'Find the seconds saved per piece, then multiply by 150.', why: '(8 − 2) × 150 = 900 seconds. That\'s 15 minutes saved on one haul, with no typos.' },
    { kind: 'learn', title: 'A 10-minute weekly count', text: 'Pieces wander: a helper sets one down, a buyer returns one. Count one aisle a week and you\'ll check the whole basement every month without a big inventory day.',
      points: ['Pick one aisle this week', 'Scan a bin label to see what the app thinks is there (with no bin active, it\'s a lookup)', 'Compare to what\'s really on the shelf', 'Found a stray? Scan the right bin, then scan it in', 'Missing something? Check the "inbox" spot, then mark it in Damaged as Missing if it\'s truly gone'] },
    { kind: 'reflect', title: 'Your scan plan', prompt: 'Which scanner (or camera) will you use, and which day each week will you count one aisle?', placeholder: 'I\'ll use…', example: 'A USB scanner at the packing table and my phone camera on the shelves. I\'ll count one aisle every Monday morning.' },
    { kind: 'checklist', title: 'Scanner setup', prompt: 'Tick each one.', items: [
      'My scanner types a tag code into a notes app',
      'It sends Enter after each scan',
      'Sound is on in the app',
      'Everything I\'ve tagged is scanned into a bin',
      'I\'ve picked my weekly count day',
    ] },
  ],
}
export default lesson
