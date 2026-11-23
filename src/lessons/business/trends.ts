/* Where creators are getting paid right now. This changes fast: update `asOf` and the list
   whenever the picture changes. The "Who pays creators" course reads from here. */
export const PAY_TRENDS = {
  asOf: 'November 2026',
  topPick: 'Facebook Reels',
  topPickWhy: 'Sellers in our community are seeing the biggest creator payouts from Facebook Reels right now, and your buyers are already on Facebook, so every Reel also sells your next live.',
  platforms: [
    { name: 'Facebook Reels', how: 'Facebook\'s creator monetization program pays for views on Reels, longer videos and photos. Turn it on in Professional mode once you\'re invited or eligible.', fit: 'Best fit: your buyers already live here.' },
    { name: 'TikTok', how: 'TikTok pays for longer videos (over a minute) through its creator rewards program, and TikTok Shop pays commission on what you sell.', fit: 'Best fit: reaching brand-new buyers.' },
    { name: 'Instagram Reels', how: 'Payouts come and go as short-term bonuses. Most of the money is in brand deals and sending traffic to your lives.', fit: 'Best fit: a pretty showroom for your brand.' },
    { name: 'YouTube Shorts', how: 'Shorts share ad money once your channel joins the YouTube Partner Program.', fit: 'Best fit: how-tos and styling videos that keep getting found.' },
  ],
  checkIt: 'Rules, minimums and payout rates change often. Always check each app\'s creator or monetization page for today\'s requirements before you plan around the money.',
}
