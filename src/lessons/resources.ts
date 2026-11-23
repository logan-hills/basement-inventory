/* Dazzle University Resource desk: quick-reference facts and official links.
   These change. Check each source and update `ASOF` whenever you touch this file. */

export const ASOF = 'November 2026'

/** What each state calls the registration you need to collect sales tax, and who issues it. */
export type StateTax = { state: string; name: string; agency: string; note?: string }
export const STATE_SALES_TAX: StateTax[] = [
  { state: 'Pennsylvania', name: 'Sales tax license', agency: 'PA Department of Revenue, registered online through myPATH', note: '6% state rate, +1% in Allegheny County, +2% in Philadelphia. Everyday clothing and shoes are exempt; handbags, jewelry, wallets, hair accessories and formal wear are taxable.' },
  { state: 'New Jersey', name: 'Certificate of Authority', agency: 'NJ Division of Revenue (NJ-REG online registration)' },
  { state: 'New York', name: 'Certificate of Authority', agency: 'NYS Department of Taxation and Finance' },
  { state: 'Delaware', name: 'No sales tax', agency: 'Delaware Division of Revenue', note: 'Delaware has no sales tax but uses a business license and gross receipts tax.' },
  { state: 'Maryland', name: 'Sales and use tax license', agency: 'Comptroller of Maryland' },
  { state: 'Ohio', name: 'Vendor\'s license', agency: 'Ohio Department of Taxation (Ohio Business Gateway)' },
  { state: 'Virginia', name: 'Sales and use tax certificate of registration', agency: 'Virginia Tax' },
  { state: 'North Carolina', name: 'Certificate of registration', agency: 'NC Department of Revenue' },
  { state: 'South Carolina', name: 'Retail license', agency: 'SC Department of Revenue' },
  { state: 'Georgia', name: 'Sales and use tax number', agency: 'Georgia Department of Revenue (Georgia Tax Center)' },
  { state: 'Florida', name: 'Sales tax certificate of registration', agency: 'Florida Department of Revenue' },
  { state: 'Tennessee', name: 'Sales and use tax registration', agency: 'Tennessee Department of Revenue' },
  { state: 'Texas', name: 'Sales and use tax permit', agency: 'Texas Comptroller of Public Accounts' },
  { state: 'California', name: 'Seller\'s permit', agency: 'California Department of Tax and Fee Administration (CDTFA)' },
  { state: 'Illinois', name: 'Certificate of registration', agency: 'Illinois Department of Revenue (MyTax Illinois)' },
  { state: 'Michigan', name: 'Sales tax license', agency: 'Michigan Department of Treasury' },
  { state: 'Alaska', name: 'No state sales tax', agency: 'Local cities and boroughs', note: 'Some Alaska towns charge local sales tax.' },
  { state: 'Montana', name: 'No sales tax', agency: 'Montana Department of Revenue' },
  { state: 'New Hampshire', name: 'No sales tax', agency: 'NH Department of Revenue Administration' },
  { state: 'Oregon', name: 'No sales tax', agency: 'Oregon Department of Revenue' },
]
export const OTHER_STATES = 'Not listed? Search "[your state] department of revenue sales tax registration." Most states let you register free online. Many states also accept one registration for several states through the Streamlined Sales Tax Registration System.'

/** Free, official links every seller should bookmark. */
export const OFFICIAL_LINKS: { label: string; what: string; url: string }[] = [
  { label: 'Get an EIN (IRS)', what: 'Free, online, in one sitting. Never pay a website for this.', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number' },
  { label: 'Get a D-U-N-S Number', what: 'Free from Dun & Bradstreet; can take up to 30 business days.', url: 'https://www.dnb.com/en-us/smb/duns/get-a-duns.html' },
  { label: 'PA business tax registration (myPATH)', what: 'Where Pennsylvania sellers register for a sales tax license.', url: 'https://www.pa.gov/en/services/revenue/register-my-business-for-taxes.html' },
  { label: 'PA Business One-Stop Shop', what: 'Pennsylvania\'s guide to starting and registering a business.', url: 'https://business.pa.gov/' },
  { label: 'SBA business guide', what: 'Plan, launch, manage and grow, from the U.S. Small Business Administration.', url: 'https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan' },
  { label: 'Free SCORE mentor', what: 'Volunteer business mentors, free.', url: 'https://www.score.org/' },
  { label: 'Streamlined Sales Tax registration', what: 'Register for sales tax in many states at once.', url: 'https://www.streamlinedsalestax.org/for-businesses/sales-tax-registration-sstrs' },
]

/** Federal estimated tax due dates for self-employed sellers (when a date lands on a weekend or holiday, it moves to the next business day). */
export const TAX_DATES: { when: string; what: string }[] = [
  { when: 'April 15', what: '1st quarter estimated tax payment, and last year\'s tax return' },
  { when: 'June 15', what: '2nd quarter estimated tax payment' },
  { when: 'September 15', what: '3rd quarter estimated tax payment' },
  { when: 'January 15', what: '4th quarter estimated tax payment (for last year)' },
]

/** A few IRS numbers that come up for sellers. */
export const IRS_NUMBERS: { label: string; value: string }[] = [
  { label: 'Self-employment tax', value: '15.3% on net earnings, if they are $400 or more' },
  { label: 'Form 1099-K from payment apps', value: 'Sent when payments are over $20,000 AND over 200 transactions. All income is taxable either way.' },
  { label: 'Estimated taxes', value: 'Generally required if you expect to owe $1,000 or more' },
  { label: 'Business mileage', value: '76¢ a mile for July to December 2026 (72.5¢ January to June)' },
  { label: 'Simplified home office', value: '$5 per square foot, up to 300 sq ft ($1,500), space used only and regularly for the business' },
  { label: 'Keep records', value: 'Generally 3 years after filing; longer in some cases' },
]

export const NOT_ADVICE = 'This is general education, not legal or tax advice. Rules change and every situation is different, so check the official source or ask a tax professional before you act.'
