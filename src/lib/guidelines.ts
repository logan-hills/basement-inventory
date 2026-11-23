// The shared Page's vendor rules, word for word from Dynamic Dazzle Bargain Basement.
// Sellers must agree every time they open the live calendar (see GuidelinesGate).
// A host can replace them for their own shared Page in Host tools; then that text is shown instead.

export type Guidelines = {
  title: string
  subtitle: string
  intro: string[]
  sections: { h: string; items: string[]; sub?: string[]; more?: string[] }[]
  closing: string[]
}

export const DAZZLE_GUIDELINES: Guidelines = {
  title: 'Dynamic Dazzle Bargain Basement',
  subtitle: 'Vendor Live Selling Guidelines',
  intro: [
    'Welcome to Dynamic Dazzle Bargain Basement — where it goes down in the basement and it’s always a bargain party! 🎉',
    'Affordable prices, great quality, and good vibes only.',
    'Platform Owner: LaVerne Quarles 👑',
    'Admin: Saketha',
  ],
  sections: [
    { h: 'Communication 📣', items: ['Questions or concerns? Reach out to LaVerne via Dynamic Dazzle Bargain Basement Facebook Messenger for the quickest response.'] },
    {
      h: 'Before You Go Live 📝',
      items: [
        '✔ Submit your flyer at least 24 hours in advance',
        '✔ Like & follow the business page (required for tagging)',
        '✔ Same-day live? Message LaVerne to check availability',
        '✔ Calendar is EST — please adjust for your time zone',
      ],
    },
    {
      h: 'Live Day Expectations ⏰',
      items: ['✔ Log in 5–10 minutes early', '✔ Test your bot before starting', '❌ More than 10 minutes late = live canceled'],
    },
    {
      h: 'During Your Live 🎥',
      items: [
        '🚫 No music, TV, or background noise (Facebook will flag it)',
        '🚫 No designer names or the word “inspired”',
        '📌 Do not use the business page inbox unless approved',
        '📣 State your rules at the beginning and end of your live:',
      ],
      sub: ['Invoicing process', 'Payment due time', 'Payment methods', 'Whether invoices are detailed'],
      more: ['💬 Engage your audience & invite people to your live', '📢 Tagging & sharing may happen — sales are not guaranteed'],
    },
    {
      h: 'Professional Standards 👑',
      items: [
        '✨ Be professional and respectful at all times',
        '🚫 Disrespect is not tolerated',
        '🚫 Vendors reported for ghosting customers should not book',
        'ℹ Platform owner/admin may not always attend your live',
      ],
    },
    { h: 'Additional Info 🎉', items: ['✅ Live booking is always FREE', '📩 Rights are sent 2 hours before your live, if not earlier'] },
    { h: 'Basement Vibes Only 🛍', items: ['Have fun, bring the energy, and enjoy the bargains!'] },
  ],
  closing: [
    'By booking, you confirm that you’ve read, understand, and agree to all guidelines above.',
    '📨 Questions? Message Dynamic Dazzle Bargain Basement Facebook Messenger',
  ],
}

/** Short fingerprint of the rules text, saved with each agreement so we know which version was agreed to. */
export function guidelinesVersion(text: string) {
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

export const guidelinesText = (g: Guidelines) =>
  [g.title, g.subtitle, ...g.intro, ...g.sections.flatMap(s => [s.h, ...s.items, ...(s.sub ?? []), ...(s.more ?? [])]), ...g.closing].join('\n')
