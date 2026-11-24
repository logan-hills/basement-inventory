import { NavLink } from 'react-router-dom'
import { useSession } from '../lib/session'

/** The app's main areas. Each one is a short row of sub-pages, so the main menu stays small. */
export const SECTIONS = {
  stock: { label: 'Stock', links: [
    { to: '/inventory', label: 'Inventory' },
    { to: '/intake', label: 'Receive' },
    { to: '/locations', label: 'Warehouse' },
    { to: '/damaged', label: 'Damaged' },
  ] },
  lives: { label: 'Lives', links: [
    { to: '/planner', label: 'Planner' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/live', label: 'Get ready' },
    { to: '/giveaways', label: 'Giveaways' },
    { to: '/shared-page', label: 'Shared Page' },
  ] },
  orders: { label: 'Orders', links: [
    { to: '/orders', label: 'Pick and pack' },
    { to: '/shipping', label: 'Shipping' },
    { to: '/customers', label: 'Customers' },
  ] },
} as const
export type SectionKey = keyof typeof SECTIONS

/** Which area a page belongs to, for the menu highlight. Detail pages count too. */
export function sectionOf(path: string): SectionKey | 'home' | 'scan' | 'money' | 'more' {
  if (path === '/') return 'home'
  if (path === '/scan') return 'scan'
  if (path.startsWith('/reports')) return 'money'
  if (/^\/(inventory|intake|locations|damaged|item|bin|bin-labels|labels|receive)/.test(path)) return 'stock'
  if (/^\/(planner|calendar|live|lives|giveaways|shared-page|on-air)/.test(path)) return 'lives'
  if (/^\/(orders|order|pick|box-labels|shipping|customers)/.test(path)) return 'orders'
  return 'more'
}

/** The sub-page row at the top of a main page. Shown only on the area's own pages, not on detail pages. */
export default function SubNav({ path }: { path: string }) {
  const { isTeam } = useSession()
  const key = sectionOf(path)
  if (!(key in SECTIONS)) return null
  const sec = SECTIONS[key as SectionKey]
  if (!sec.links.some(l => l.to === path)) return null
  return (
    <nav className="subnav no-print" aria-label={`${sec.label} pages`}>
      <span className="subnav-area">{sec.label}</span>
      <div className="subnav-links">
        {sec.links.filter(l => !(isTeam && l.to === '/shared-page')).map(l => <NavLink key={l.to} to={l.to} end className="subnav-link">{l.label}</NavLink>)}
      </div>
    </nav>
  )
}
