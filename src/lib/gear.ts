/* Recommended gear: the scanners, printers and labels we've picked to work smoothly with Dazzle Warehouse.
   Links are clean Amazon product links (amazon.com/dp/ASIN) with no tracking codes.
   RULE: when you change this list, update the Recommended gear lesson (src/lessons/gear.ts). */

export type GearGroup = 'Scanners' | 'Label printer' | 'Labels' | 'Selling in person'

export type Gear = {
  id: string
  group: GearGroup
  name: string
  /** Short badge, like "Best for iPhone". */
  badge: string
  asin: string
  /** One plain sentence on what it's for. */
  why: string
  /** Label size or connection, shown as chips. */
  facts: string[]
  /** How to get it working with Dazzle Warehouse, in order. */
  setup: string[]
  /** Where in the app it gets used. */
  useIn: { to: string; label: string }[]
}

export const amazonLink = (asin: string) => `https://www.amazon.com/dp/${asin}`

export const GEAR: Gear[] = [
  {
    id: 'eyoyo', group: 'Scanners', name: 'Eyoyo Bluetooth pocket scanner', badge: 'Best for iPhone', asin: 'B09GLXVD5D',
    why: 'A little scanner that pairs with your iPhone, Android phone or computer. Clip it to your phone and pick orders with one hand.',
    facts: ['Bluetooth', 'USB cable too', 'Reads 1D and QR codes'],
    setup: [
      'Charge it, then scan the "Bluetooth HID" setup barcode in its manual.',
      'On your phone, open Settings, then Bluetooth, and tap the scanner to pair.',
      'Open Scan in Dazzle Warehouse and scan a tag. The code drops in the box and looks itself up.',
      'If the on-screen keyboard disappears on iPhone, that\'s normal. Double-press the scanner\'s button (or scan the "show keyboard" code in its manual) to bring it back.',
    ],
    useIn: [{ to: '/scan', label: 'Scan' }, { to: '/pick', label: 'Pick and pack' }],
  },
  {
    id: 'netum', group: 'Scanners', name: 'NetumScan handheld scanner', badge: 'Budget pick', asin: 'B098NKCR1G',
    why: 'A sturdy, low-cost scanner for your receiving table. Plug it into a computer and it just works.',
    facts: ['USB plug and play', 'Wireless versions too', 'Reads 1D barcodes'],
    setup: [
      'Plug the USB end into your computer (or pair it if yours is the wireless one).',
      'Open Scan in Dazzle Warehouse and scan a tag.',
      'If nothing happens, scan the "Add Enter" (carriage return) code in its manual so it presses Enter after every scan.',
    ],
    useIn: [{ to: '/scan', label: 'Scan' }, { to: '/intake', label: 'Receive items' }],
  },
  {
    id: 'pro-scanner', group: 'Scanners', name: 'Pro wireless 1D/2D scanner', badge: 'Top of the line', asin: 'B0FX8FGVDP',
    why: 'For sellers ready to invest: faster reads, longer range and a battery that lasts all day in the warehouse.',
    facts: ['Bluetooth or 2.4G dongle', 'Reads 1D, 2D and QR', 'All-day battery'],
    setup: [
      'Plug in the little USB dongle, or set it to Bluetooth mode with the code in its manual and pair it.',
      'Make sure it\'s in keyboard (HID) mode with an Enter after each scan. Most are, right out of the box.',
      'Open Scan in Dazzle Warehouse and scan a tag to test it.',
    ],
    useIn: [{ to: '/scan', label: 'Scan' }, { to: '/pick', label: 'Pick and pack' }],
  },
  {
    id: 'nelko', group: 'Label printer', name: 'Nelko Bluetooth thermal label printer', badge: 'One printer for everything', asin: 'B0BRBY6888',
    why: 'Prints 2×1 item tags, 4×4 bin labels and 4×6 shipping and box labels. No ink, ever. Works from a computer or your phone.',
    facts: ['Bluetooth and USB', 'Labels up to 4 inches wide', 'Direct thermal, no ink'],
    setup: [
      'On a computer: install the Nelko driver from nelko.net, connect by USB, and pick it in the print window.',
      'On a phone: install the Nelko app and pair the printer inside that app.',
      'Load your roll, then hold the feed button until a label feeds out so it learns the size.',
      'In Dazzle Warehouse, use Test print on the Recommended gear page to check each size before a big batch.',
    ],
    useIn: [{ to: '/labels', label: 'Print tags' }, { to: '/bin-labels', label: 'Bin labels' }, { to: '/box-labels', label: 'Box labels' }],
  },
  {
    id: 'rollo-2x1', group: 'Labels', name: 'ROLLO 2×1 inch direct thermal labels', badge: 'Item tags', asin: 'B08NDMLGDB',
    why: 'The tag that goes on every piece: Live #, price and its own barcode. Use white for regular tags and yellow for sale tags.',
    facts: ['2 × 1 in', 'Direct thermal', 'Item tags and sale tags'],
    setup: ['In Print tags, choose "Thermal roll 2×1 in, one tag per label".', 'In the print window, paper size 2 x 1 in, scale 100%, margins None.'],
    useIn: [{ to: '/labels', label: 'Print tags' }],
  },
  {
    id: 'munbyn-4x4', group: 'Labels', name: 'MUNBYN 4×4 inch thermal labels', badge: 'Bin labels', asin: 'B0DS1SW86D',
    why: 'Our bin label size. Big enough to read across the room and scan from an arm\'s length away, small enough for any shelf edge or bin.',
    facts: ['4 × 4 in', 'Direct thermal', 'Bin and shelf labels'],
    setup: ['In Bin labels, choose "Thermal roll 4×4 in, one bin per label".', 'In the print window, paper size 4 x 4 in, scale 100%, margins None.'],
    useIn: [{ to: '/bin-labels', label: 'Bin labels' }],
  },
  {
    id: 'mflabel-4x6', group: 'Labels', name: 'MFLABEL 4×6 inch thermal shipping labels (roll)', badge: 'Shipping and box labels', asin: 'B095WKTRXL',
    why: 'Standard shipping labels for Pirate Ship, plus the customer box labels you scan while you pack.',
    facts: ['4 × 6 in', 'Roll', 'Shipping and box labels'],
    setup: ['In Box labels, choose "4×6 shipping label printer".', 'In the print window, paper size 4 x 6 in, scale 100%, margins None.'],
    useIn: [{ to: '/box-labels', label: 'Box labels' }, { to: '/shipping', label: 'Shipping' }],
  },
  {
    id: 'munbyn-fanfold', group: 'Labels', name: 'MUNBYN 4×6 inch fan-fold shipping labels', badge: 'Big shipping days', asin: 'B0D2D1LGSW',
    why: 'A big stack that feeds from behind the printer, so you can print a whole live\'s worth of labels without swapping rolls.',
    facts: ['4 × 6 in', 'Fan-fold stack', 'Shipping and box labels'],
    setup: ['Set the stack behind the printer and feed the first label in.', 'Same settings as the 4×6 roll: paper size 4 x 6 in, scale 100%, margins None.'],
    useIn: [{ to: '/box-labels', label: 'Box labels' }, { to: '/shipping', label: 'Shipping' }],
  },
  {
    id: 'receipt', group: 'Selling in person', name: 'Mobile thermal receipt printer', badge: 'Pop-ups and markets', asin: 'B09TWVTW5W',
    why: 'For sellers who also sell in the community and in person. Print receipts from the Square app at the table, and Dazzle order receipts too.',
    facts: ['Bluetooth', 'Receipt paper', 'Works alongside Square'],
    setup: [
      'For Square sales: pair it in the Square app under Settings, then Hardware, then Printers, and turn on receipts.',
      'For Dazzle order receipts: open an order, tap Print receipt, and pick the paper width that matches your roll (2¼ in or 3⅛ in).',
      'On a phone, tap "Save for printer app" and open the picture in the printer\'s own app.',
    ],
    useIn: [{ to: '/orders', label: 'Pick and pack' }],
  },
]

export const GEAR_GROUPS: { id: GearGroup; blurb: string; icon: string }[] = [
  { id: 'Scanners', blurb: 'Any scanner that "types" like a keyboard works. Here are three we trust, from budget to pro.', icon: 'scan' },
  { id: 'Label printer', blurb: 'One thermal printer handles every label in your business. Just swap the roll.', icon: 'print' },
  { id: 'Labels', blurb: 'Four sizes, four jobs. Stick to these and everything lines up the first time.', icon: 'tag' },
  { id: 'Selling in person', blurb: 'Taking your boutique on the road? Print receipts right at your table.', icon: 'cart' },
]

/** Every label size the app prints. Used for test prints. Sizes in inches. */
export const TEST_SIZES = {
  '2x1': { name: '2×1 item tag', w: 2, h: 1 },
  '4x4': { name: '4×4 bin label', w: 4, h: 4 },
  '4x6': { name: '4×6 shipping / box label', w: 4, h: 6 },
  r58: { name: 'Receipt, 2¼ in roll (58 mm)', w: 2.28, h: 3 },
  r80: { name: 'Receipt, 3⅛ in roll (80 mm)', w: 3.15, h: 3 },
} as const
export type TestSize = keyof typeof TEST_SIZES
