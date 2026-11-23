import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'dropship', kind: 'course', school: 'Platforms and trends', title: 'Drop shipping and Shopify, the honest guide', track: 'Business', icon: 'truck',
  why: 'Drop shipping lets you sell products you never touch. It can add income, but only if you understand the margins, the risks and the right setup.',
  outcomes: [
    'Explain how drop shipping works, and how it differs from live selling',
    'Know why Shopify is the most common platform for drop shippers',
    'Do the margin math before you list a single product',
    'Vet suppliers and order samples to protect your reputation',
    'Follow shipping-time rules and decide if drop shipping fits your shop',
  ],
  route: { to: '/lessons', label: 'Back to Dazzle University' },
  sources: [
    { org: 'Shopify', title: 'Shopify pricing', url: 'https://www.shopify.com/pricing' },
    { org: 'Shopify', title: 'What is dropshipping?', url: 'https://www.shopify.com/blog/what-is-dropshipping' },
    { org: 'Federal Trade Commission', title: 'Business guide to the Mail, Internet, or Telephone Order Merchandise Rule', url: 'https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'How it works', kind: 'learn', title: 'You sell, they ship', nova: 'Drop shipping is all over the internet with big promises. Let\'s look at it with clear eyes.',
      text: 'With drop shipping, you list a product in your online store. When someone buys, you pass the order to a supplier, who ships it straight to your customer. You never hold the stock.',
      table: { head: ['', 'Live selling (your stock)', 'Drop shipping'], rows: [
        ['Who holds the stock', 'You', 'The supplier'],
        ['Upfront cost', 'You buy stock first', 'Little or none'],
        ['Profit per piece', 'Higher (you bought low)', 'Lower (supplier keeps more)'],
        ['Control of quality and speed', 'Full', 'Limited'],
        ['Best channel', 'Facebook and TikTok lives', 'An online store with ads and content'],
      ] } },
    { kind: 'quiz', q: 'A customer buys a phone case from your drop shipping store. Who ships it?', options: ['You, from your basement', 'Your supplier, straight to the customer', 'Shopify'], answer: 1, why: 'That\'s the whole model: the supplier ships directly. You handle the store, marketing and customer service.' },

    { chapter: 'Why Shopify', kind: 'learn', title: 'Built for online stores', text: 'Shopify is the platform most drop shippers start on, and for good reasons.',
      points: ['A full online store with checkout, built in', 'A huge app store, including apps that connect you to drop shipping suppliers and send orders to them automatically', 'Professional themes that look like a real boutique', 'Sales channels: connect the store to Facebook, Instagram and TikTok', 'Built-in reports, discounts and email marketing', 'Large community, lots of tutorials'],
      tip: 'Shopify\'s Basic plan has been around $39 a month billed monthly (less on a yearly plan), plus payment fees and any paid apps. Check shopify.com/pricing for today\'s prices and free-trial offers.' },
    { kind: 'learn', title: 'Other options', text: 'Shopify isn\'t the only choice.',
      table: { head: ['Platform', 'Good for'], rows: [
        ['Shopify', 'A full branded store, most drop shipping apps'],
        ['WooCommerce (WordPress)', 'People comfortable managing their own website'],
        ['TikTok Shop', 'Selling to TikTok\'s audience; has its own rules for fulfillment speed'],
        ['Etsy', 'Handmade and vintage only; most drop shipping isn\'t allowed'],
      ] } },

    { chapter: 'The margin math', kind: 'learn', title: 'Where the money goes', text: 'Drop shipping margins look big until you count everything. Most of the cost is often finding the buyer.',
      table: { head: ['Item', 'Example'], rows: [
        ['Sale price', '$39.99'],
        ['Product + shipping from supplier', '− $14.50'],
        ['Payment fee (about 3%)', '− $1.20'],
        ['Ads to get the sale (cost per purchase)', '− $12.00'],
        ['Apps and Shopify plan, per order', '− $1.50'],
        ['Refunds and problems (set aside ~5%)', '− $2.00'],
        ['Profit', '$8.79'],
      ] } },
    { kind: 'number', title: 'Your margin', q: 'You sell a necklace for $30. The supplier charges $11 with shipping, fees are $0.90, ads cost $10 per sale, and apps are $1 per order. What\'s your profit?', prefix: '$', answer: 7.1, tolerance: 0.01, hint: '$30 − $11 − $0.90 − $10 − $1.', why: '$30 − $22.90 = $7.10. Without the ad cost it looks like $17, which is why many new drop shippers think they\'re profitable when they\'re not.' },

    { chapter: 'Protect your name', kind: 'learn', title: 'Vet suppliers', text: 'Your customer doesn\'t know the supplier exists. If the order is late or cheap, it\'s your name on it.',
      points: ['Order samples of everything you plan to list, to your own address', 'Time how long the sample takes to arrive', 'Check reviews, return policy and how fast they answer messages', 'Prefer suppliers with warehouses in the US for faster shipping', 'Never list branded or designer goods from unknown suppliers (counterfeit risk)'] },
    { kind: 'learn', title: 'Shipping time is the law', text: 'The FTC\'s Mail, Internet, or Telephone Order Merchandise Rule applies to online stores. You must have a reasonable basis to ship within the time you state, or within 30 days if you state no time. If you can\'t, you must tell the customer and offer to cancel with a refund.',
      tip: 'Show realistic delivery times on every product page. "Ships in 7 to 12 business days" beats a broken promise.' },
    { kind: 'scenario', title: 'The slow supplier', situation: 'Your store says "Ships in 3 to 5 days." Your supplier is now taking 15 days, and 20 orders are waiting.',
      options: [
        { text: 'Stay quiet and hope they arrive', feedback: 'That risks breaking the FTC rule and earning chargebacks and bad reviews.' },
        { text: 'Email every waiting customer with the new date and an option to cancel for a refund, update the product page, and find a backup supplier', best: true, feedback: 'You follow the rule, protect your reputation, and fix the root cause.' },
        { text: 'Refund everyone without asking', feedback: 'Some would happily wait. Give them the choice.' },
      ] },

    { chapter: 'Does it fit you?', kind: 'learn', title: 'Live sellers and drop shipping', text: 'For most live sellers, drop shipping works best as an extra, not a replacement. Live buyers expect to see and feel the real piece, claim it on the spot, and get it fast.',
      table: { head: ['Good fit', 'Poor fit'], rows: [
        ['An online store for your brand between lives', 'Selling drop-shipped pieces on live without holding them'],
        ['Testing a new product before buying stock', 'Designer or brand-name goods'],
        ['Basic accessories and add-ons', 'Anything your buyers expect within a few days'],
      ] } },
    { kind: 'reflect', title: 'Your verdict', prompt: 'Would drop shipping help your shop? If yes, what would you sell and how would you find buyers? If no, why not?', placeholder: 'For my shop, drop shipping…', example: 'Not on lives. Maybe a small Shopify store for phone accessories as add-ons, after I test 3 samples.' },
    { kind: 'learn', title: 'Customer service is on you', text: 'In drop shipping, you never touch the product, but every question, complaint and return still comes to you.',
      points: ['Write clear policies for returns and damaged items before you launch', 'Know your supplier\'s return process and how long refunds take', 'Answer messages within a day', 'Track every problem order by supplier so you can drop bad ones'] },
    { kind: 'scenario', title: 'The wrong color', situation: 'A Shopify customer orders a gold necklace and receives silver from your supplier.',
      options: [
        { text: 'Tell her to contact the supplier', feedback: 'She bought from you and doesn\'t know the supplier exists. It\'s your job to fix it.' },
        { text: 'Apologize, send the right one or a refund right away, and file a claim with the supplier', best: true, feedback: 'The customer stays happy, and you recover your cost from the supplier.' },
        { text: 'Ignore it, she\'ll get over it', feedback: 'That\'s how chargebacks and bad reviews happen.' },
      ] },
    { kind: 'quiz', q: "A supplier says delivery takes 'about 2 to 3 weeks.' What must your store say?", options: ["Fast shipping", "Nothing, buyers don't read it", "A clear delivery time you can actually meet, like 'Arrives in 2 to 3 weeks'"], answer: 2, why: "The FTC's Mail Order Rule says you need a reasonable basis for any shipping time you state, and if you don't state one, you must ship within 30 days. Honest times protect you." },
    { kind: 'learn', title: 'Test before you list', text: "Order the product yourself before you sell it. You'll see the quality, the packaging, and the real delivery time your buyer will get. It's the cheapest insurance in drop shipping.",
      points: ["Order 1 of each new product to your own house", "Time how long it took to arrive", "Check the packaging for supplier logos or price tags", "Photograph it yourself instead of using the supplier's photos"] },
    { kind: 'number', title: 'The real profit', q: "You sell a bag for $40. The supplier charges $18 plus $6 shipping, payment fees are about $1.50, and you spend $5 on ads for each sale. What's your profit per bag?", prefix: '$', answer: 9.5, tolerance: 0.1, hint: "Add up every cost, then subtract from $40.", why: "$18 + $6 + $1.50 + $5 = $30.50 in costs, so $9.50 profit. One return wipes out the profit of several sales, which is why careful suppliers and honest listings matter so much." },
    { kind: 'checklist', title: 'Before you start', prompt: 'If you try drop shipping, tick these first.', items: ['Pick a niche that fits my brand', 'Order and time samples from 2 or 3 suppliers', 'Do the full margin math, including ads', 'Set realistic shipping times on every page', 'Start a Shopify free trial and build one collection', 'Decide a test budget and a stop date'] },
  ],
}
export default lesson
