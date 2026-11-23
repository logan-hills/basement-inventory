// Shared rules for customer details and imported sales sheets.

/** Loyal Shops and other bots write "-" for a blank. */
export const blankish = (v: string) => /^(-+|—|n\/?a|none|null|undefined)$/i.test(v.trim()) ? '' : v.trim()
/** Loyal Shops marks the winner "1st"; "2nd" and "3rd+" are backup claims waiting in line. */
export const isBackup = (status: string) => /^(2nd|3rd|[2-9]\d*(st|nd|rd|th)|backup|runner)/i.test(status.trim())
/** Customer details needed to ship and invoice. Phone is nice to have, so it isn't flagged (Loyal Shops never sends it). */
export const CUSTOMER_NEEDS: { key: string; label: string }[] = [
  { key: 'address1', label: 'address' }, { key: 'city', label: 'city' }, { key: 'state', label: 'state' }, { key: 'zip', label: 'ZIP' },
  { key: 'email', label: 'email' },
]
export const customerMissing = (c: Record<string, any>) => CUSTOMER_NEEDS.filter(n => !blankish(String(c[n.key] ?? ''))).map(n => n.label)

