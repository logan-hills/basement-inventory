// DRAFT legal text. Have a lawyer review before launch.
export const LEGAL_UPDATED = 'November 25, 2026'
export const COMPANY = 'LaVerne Quarles, doing business as Dynamic Dazzle Bargain Basement'
/** Contact for the Terms, Privacy Policy and ownership questions (the owner's email). */
export const CONTACT = 'LaVerne_q@hotmail.com'
/** Where class sign-ups and coaching requests go today. Separate from the legal contact. */
export const TEAM_CONTACT = 'info@inkandembersociety.com'
/** Who owns the brand, Nova, the App and its content. */
export const IP_OWNER = 'LaVerne Quarles, owner of Dynamic Dazzle Bargain Basement'
export const COPYRIGHT_LINE = `© ${new Date().getFullYear()} LaVerne Quarles, Dynamic Dazzle Bargain Basement. All rights reserved.`
export const TRADEMARK_LINE = 'Dynamic Dazzle™, Dazzle Warehouse™, Dazzle University™, Time with the Queen™, Nova™ and the DD crown logo are trademarks of LaVerne Quarles.'

export type LegalDoc = { title: string; intro: string; sections: { h: string; p: string[] }[] }

export const TERMS: LegalDoc = {
  title: 'Terms of Use',
  intro: `These Terms are an agreement between you and ${COMPANY} ("we", "us"), which runs Dazzle Warehouse (the "App"). By creating an account or using the App you agree to these Terms and to our Privacy Policy. If you do not agree, please do not use the App. You must be at least 18 years old.`,
  sections: [
    {
      h: '1. Accounts',
      p: [
        'You can sign up with email or Sign in with Apple. Keep your login private. You are responsible for everything done with your account.',
        'There are two kinds of accounts. A free Stream account lets you build a seller profile, book time on the shared live calendar and go live. A Seller account adds the paid features you subscribe to, such as inventory, labels, live prep, picking, shipping and reports.',
        'Give us true and current information, and update it when it changes.',
      ],
    },
    {
      h: '2. Your seller profile and what other members see',
      p: [
        'Your profile can include your name, photo, bio, email and phone number. Your display name is always shown on the shared live calendar next to the time you book, so everyone can see who has each time.',
        'Your photo, bio, email and phone are shown to other signed-in members only if you switch "Show" on for each one. You can change these switches at any time in My profile. Switching one off hides it from then on, but we cannot take back what someone already saw or wrote down.',
        'Everything else in your account, including your inventory, prices, costs, customers, orders, buyer addresses and reports, is private to you and the people you add to your shop. Other sellers cannot see it.',
      ],
    },
    {
      h: '3. The shared live calendar',
      p: [
        'Live time on the shared Facebook Page is booked in 1.5-hour slots that start on the hour or the half hour. Only one seller can hold a time. Booking is first come, first served unless a host sets other rules.',
        'Start and stop times are hard. Your live is started at your start time and ended automatically at your stop time, even mid-sentence. You get a wrap-up warning before the end. Please finish on time out of respect for the next seller.',
        'Each shared Page has seller guidelines (for the Dynamic Dazzle Bargain Basement Page, the "Vendor Live Selling Guidelines"). They are shown every time you open the live calendar, and you must agree to them before booking. We save the date and time of each agreement. The guidelines are part of these Terms. Booking live time is free.',
        'If you are more than the allowed number of minutes late (10 minutes on the Dynamic Dazzle Page), your live is canceled automatically and the slot is lost.',
        'The Page owner and hosts may cancel or move bookings, remove sellers from the calendar, and end a live early to protect the Page, its followers or other sellers. If you cannot make your time, cancel it in the App so someone else can use it.',
      ],
    },
    {
      h: '4. Going live and stream keys',
      p: [
        'For each booking you get a private stream key that only works for your time. Do not share it, and do not use it for anything other than your booked live. You never receive the Page login and must not try to get it.',
        'Your live appears on a Facebook Page that belongs to someone else. Facebook\'s own terms and community standards apply to everything you stream. The Page owner may hide, keep or delete videos of your live on their Page.',
        'You keep ownership of what you stream. You give us and the Page owner permission to show, store and share your live and its comments on the Page and in the App, so the service can work.',
      ],
    },
    {
      h: '5. How you must behave',
      p: [
        'Sell only items you have the right to sell, describe them honestly, and follow the law, including consumer, tax and shipping rules. You are the seller of record for your sales and you handle your own buyers, payments, refunds and shipping.',
        'Do not harass anyone, post hateful or adult content, sell banned or counterfeit items, spam, or misuse other members\' contact details. Contact details you see in the App are for selling together on the shared Page, not for marketing lists.',
        'Do not try to break, overload, copy or get around the App\'s security.',
      ],
    },
    {
      h: '6. Subscriptions, free accounts and onboarding fees',
      p: [
        'Paid features are billed by subscription at the prices shown when you sign up. Subscriptions renew until you cancel. Cancelling stops the next renewal; we do not refund partial periods unless the law requires it.',
        'Sellers new to the shared Page may need to take a live orientation before booking time. An onboarding fee may apply; the amount is shown before you pay. Sellers who joined before the shared calendar launched may be offered free onboarding.',
        'If you buy inside the Apple App Store or Google Play, their payment terms also apply.',
      ],
    },
    {
      h: '7. Facebook and other services',
      p: [
        'The App connects to services we do not control, such as Facebook, Apple, Square, shipping services and our hosting provider. They can change or stop working, and their own terms apply. We are not responsible for them.',
      ],
    },
    {
      h: '8. Who owns the App and its content',
      p: [
        `Dynamic Dazzle, Dazzle Warehouse, Dazzle University, Time with the Queen, Nova, the DD crown logo and related names, logos and characters are trademarks of ${IP_OWNER}. The App, including its software, screen designs, layouts, graphics, lessons, courses, certificates and text, is owned by ${IP_OWNER} and protected by copyright, trademark and other laws. All rights reserved.`,
        'We give you a personal, limited right to use the App for your own selling business while your account is active. You may not copy, sell, rent, rebrand or share the App, its lessons or its designs; copy its look, screens, workflows or content to build or market a similar product; take apart, reverse engineer or scrape the App, or use bots to collect its content; use our names, logos or Nova without written permission; or remove our copyright or trademark notices.',
        'Your own inventory, photos, customer lists and posts stay yours. You let us store and show them only as needed to run the App for you. If you send us ideas or feedback, we may use them freely without paying you.',
        `To report something you believe copies your work, or ours, email ${CONTACT}.`,
      ],
    },
    {
      h: '9. No guarantees',
      p: [
        'We work hard to keep the App running, but it is provided "as is". We do not promise it will always be available or error-free, that a live will start or end exactly on time if Facebook or your internet has trouble, or that you will make any amount of sales.',
        'To the fullest extent the law allows, we are not liable for lost sales, lost profits or indirect damages, and our total liability is limited to what you paid us in the 3 months before the claim.',
      ],
    },
    {
      h: '10. Ending your account',
      p: [
        'You can stop using the App and ask us to delete your account at any time.',
        'If you break these Terms or the seller guidelines you agreed to, we may suspend or revoke your account. If your account is revoked for a violation, you will not get a refund for the month or year you have already paid for, unless the law requires one. We may also remove you from the shared live calendar.',
      ],
    },
    {
      h: '11. Changes and contact',
      p: [
        'We may update these Terms. If the change is important we will tell you in the App and ask you to agree again. These Terms are governed by the laws of the Commonwealth of Pennsylvania.',
        `Questions: ${CONTACT}.`,
      ],
    },
  ],
}

export const PRIVACY: LegalDoc = {
  title: 'Privacy Policy',
  intro: `This policy explains what ${COMPANY} collects in Dazzle Warehouse (the "App"), who can see it, and your choices.`,
  sections: [
    {
      h: 'What we collect',
      p: [
        'Account: your email, and your Apple ID login if you use Sign in with Apple. If you choose Apple\'s "Hide My Email", we only get a relay address.',
        'Seller profile: display name, photo, bio, email and phone, plus your Show or Hide choice for each.',
        'Live calendar: the times you book, cancel and go live, and the title of each live.',
        'Seller account data: the items, photos, locations, prices, costs, orders, customers (names, addresses, emails, phone numbers) and reports you enter.',
        'Facebook: when a host connects a Facebook Page, we store a Page access token on our server. During lives we read the live\'s comments, including commenters\' public names and IDs, to help sellers record claims. We never receive anyone\'s Facebook password.',
        'Technical: basic logs, such as when you sign in, to keep the App secure.',
      ],
    },
    {
      h: 'Who can see what',
      p: [
        'Everyone signed in to the App: your display name next to the times you book on the shared calendar.',
        'Other signed-in members, only if you switch them on: your photo, bio, email and phone.',
        'Only you and the people you add to your shop: everything in your seller account, including your customers\' details.',
        'Hosts of the shared Page: your bookings, and the stream key for your booking so they can help if something goes wrong.',
        'Facebook viewers: whatever you show and say on your live, which is public on the Page.',
      ],
    },
    {
      h: 'How we use it',
      p: [
        'To run the App: show the calendar, start and end your lives, give you your stream key, keep your inventory and orders, and send account emails. We do not sell your personal information and we do not use your customers\' details for our own marketing.',
      ],
    },
    {
      h: 'Where it is kept',
      p: [
        'Data is stored with our hosting provider (Supabase) in the United States and protected by access rules so each person and shop only sees what they are allowed to. Facebook data is handled under Meta\'s Platform Terms.',
      ],
    },
    {
      h: 'Your choices',
      p: [
        'Change your profile and Show or Hide switches any time in My profile.',
        `Ask us for a copy of your data, to correct it, or to delete your account by emailing ${CONTACT}. We delete or anonymise your data within 30 days, except what we must keep by law, such as payment records.`,
        'A host can disconnect the Facebook Page at any time, which deletes the stored Page token.',
      ],
    },
    {
      h: 'Children',
      p: ['The App is for adults 18 and older. We do not knowingly collect information from children.'],
    },
    {
      h: 'Changes and contact',
      p: [`If we change this policy in an important way we will tell you in the App. Questions: ${CONTACT}.`],
    },
  ],
}
