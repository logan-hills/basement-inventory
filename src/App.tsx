import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import TermsUpdate from './components/TermsUpdate'
import { TERMS_VERSION } from './lib/profile'
import BrandFooter from './components/BrandFooter'
import AskNova from './components/AskNova'
import { useEffect, useState } from 'react'
import Sheet from './components/Sheet'
import Icon from './components/Icon'
import { SessionProvider, useSession } from './lib/session'
import { ToastProvider } from './lib/toast'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import NewPassword from './pages/NewPassword'
import { useRecovering } from './lib/recovery'
import CreateShop from './pages/CreateShop'
import Home from './pages/Home'
import Intake from './pages/Intake'
import Inventory from './pages/Inventory'
import Labels from './pages/Labels'
import Scan from './pages/Scan'
import ItemDetail from './pages/ItemDetail'
import Damaged from './pages/Damaged'
import BulkReceive from './pages/BulkReceive'
import Warehouse from './pages/Warehouse'
import BinDetail from './pages/BinDetail'
import BinLabels from './pages/BinLabels'
import Orders from './pages/Orders'
import OrdersUpload from './pages/OrdersUpload'
import OrderDetail from './pages/OrderDetail'
import Pick from './pages/Pick'
import BoxLabels from './pages/BoxLabels'
import Settings from './pages/Settings'
import Calendar from './pages/Calendar'
import LiveDetail from './pages/LiveDetail'
import LivePrep from './pages/LivePrep'
import Customers from './pages/Customers'
import Shipping from './pages/Shipping'
import Reports from './pages/Reports'
import Lessons from './pages/Lessons'
import Consult from './pages/Consult'
import HostDesk from './pages/HostDesk'
import { useIsHost } from './lib/meetings'
import LessonPlayer from './pages/LessonPlayer'
import Planner from './pages/Planner'
import LivePlan from './pages/LivePlan'
import LiveBot from './pages/LiveBot'
import SharedPage from './pages/SharedPage'
import OnAir from './pages/OnAir'
import Overlay from './pages/Overlay'
import Giveaways from './pages/Giveaways'
import OnAirBar from './components/OnAirBar'
import SubNav, { sectionOf } from './components/SubNav'
import Profile from './pages/Profile'
import FinishSignup from './pages/FinishSignup'
import Legal from './pages/Legal'
import Gear from './pages/Gear'
import Receipt from './pages/Receipt'
import OwnerOnly from './components/OwnerOnly'

export function Crown({ size = 28 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5L3 8z" /><path d="M5 21h14" />
    </svg>
  )
}

/** The full menu (opened from More / Menu), grouped by the same areas as the top bar and bottom tabs. */
const STOCK = [
  { to: '/inventory', label: 'Inventory', icon: 'inventory' },
  { to: '/intake', label: 'Receive items', icon: 'receive' },
  { to: '/scan', label: 'Scan', icon: 'scan' },
  { to: '/locations', label: 'Warehouse', icon: 'warehouse' },
  { to: '/damaged', label: 'Damaged', icon: 'damaged' },
]
const LIVES = [
  { to: '/planner', label: 'Live Planner', icon: 'sparkle' },
  { to: '/calendar', label: 'Live calendar', icon: 'calendar' },
  { to: '/live', label: 'Get ready for live', icon: 'live' },
  { to: '/giveaways', label: 'Giveaways', icon: 'gift' },
  { to: '/shared-page', label: 'Shared Page lives', icon: 'clock' },
]
const ORDERS = [
  { to: '/orders', label: 'Pick and pack', icon: 'pack' },
  { to: '/shipping', label: 'Shipping', icon: 'truck' },
  { to: '/customers', label: 'Customers', icon: 'users' },
]
/** Seller-only extras. Team members (employees) don't see these in the menu. */
const OWNER_ONLY = new Set(['/lessons', '/consult', '/shared-page'])

const MORE = [
  { to: '/reports', label: 'Reports', icon: 'reports' },
  { to: '/profile', label: 'My profile', icon: 'users' },
  { to: '/lessons', label: 'Dazzle University', icon: 'lessons' },
  { to: '/gear', label: 'Recommended gear', icon: 'scan' },
  { to: '/consult', label: 'Time with the Queen', icon: 'sparkle' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
  { to: '/settings/team', label: 'Team members', icon: 'users' },
]

/** Computers and iPads sideways get a top bar with room for more buttons than the phone's bottom tabs.
 *  `fit` says from which screen width a button shows; narrower screens find it under More. */
type TopItem = { to: string; label: string; icon: string; area: ReturnType<typeof sectionOf> | 'customers' | 'university' | 'settings'; fit?: 'wide' | 'wider' }
const TOP: TopItem[] = [
  { to: '/', label: 'Home', icon: 'dashboard', area: 'home' },
  { to: '/inventory', label: 'Stock', icon: 'inventory', area: 'stock' },
  { to: '/scan', label: 'Scan', icon: 'scan', area: 'scan' },
  { to: '/planner', label: 'Lives', icon: 'sparkle', area: 'lives' },
  { to: '/orders', label: 'Orders', icon: 'pack', area: 'orders' },
  { to: '/customers', label: 'Customers', icon: 'users', area: 'customers', fit: 'wide' },
  { to: '/reports', label: 'Money', icon: 'reports', area: 'money' },
  { to: '/lessons', label: 'University', icon: 'lessons', area: 'university', fit: 'wider' },
]
/** Which top-bar button lights up. Customers and University have their own buttons up top. */
function topArea(path: string): TopItem['area'] {
  if (path.startsWith('/customers')) return 'customers'
  if (path.startsWith('/lessons')) return 'university'
  if (path.startsWith('/settings')) return 'settings'
  return sectionOf(path)
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const STREAM_NAV = [
  { to: '/', label: 'Live calendar', end: true, icon: 'calendar' },
  { to: '/giveaways', label: 'Giveaways', icon: 'gift' },
  { to: '/profile', label: 'My profile', icon: 'users' },
]

/** The free "just stream" account: the shared live calendar, On Air, and a profile. */
function StreamShell() {
  return (
    <div className="shell">
      <ScrollTop />
      <header className="topnav no-print" aria-label="Main menu">
        <NavLink to="/" className="topnav-brand" aria-label="Home"><span className="dock-logo small"><Crown size={20} /></span><b>Dynamic Dazzle<span className="tm">™</span></b></NavLink>
        <nav className="topnav-links">
          {STREAM_NAV.map(n => <NavLink key={n.to} to={n.to} end={n.end} className="topnav-link"><Icon name={n.icon} size={20} /><span>{n.label}</span></NavLink>)}
        </nav>
      </header>
      <header className="mobile-top no-print">
        <NavLink to="/" className="brand"><span className="dock-logo small"><Crown size={20} /></span><span className="brand-text"><b>Dynamic Dazzle<span className="tm">™</span></b></span></NavLink>
        <NavLink to="/profile" className="btn ghost small">My profile</NavLink>
      </header>
      <main className="content">
        <OnAirBar />
        <Routes>
          <Route path="/on-air/:id" element={<OnAir />} />
          <Route path="/giveaways" element={<Giveaways />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Legal which="terms" />} />
          <Route path="/privacy" element={<Legal which="privacy" />} />
          <Route path="*" element={<SharedPage />} />
        </Routes>
        <BrandFooter />
      </main>
      <nav className="tabbar no-print">
        {STREAM_NAV.map(n => <NavLink key={n.to} to={n.to} end={n.end}><Icon name={n.icon} size={22} /><span>{n.label}</span></NavLink>)}
      </nav>
    </div>
  )
}

function Shell() {
  const { session, shop, loading, profile, isTeam } = useSession()
  const host = useIsHost()
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  const recovering = useRecovering()
  useEffect(() => { setMenu(false) }, [pathname])
  const area = sectionOf(pathname)
  const top = topArea(pathname)
  // The on-stream product card for Prism / OBS: public, no sign-in, nothing else on the page.
  if (pathname.startsWith('/overlay/')) return <Routes><Route path="/overlay/:token/:part?" element={<Overlay />} /></Routes>
  if (pathname === '/terms' || pathname === '/privacy') {
    if (!session || !shop) return <main className="content solo"><Legal which={pathname === '/terms' ? 'terms' : 'privacy'} /><BrandFooter /></main>
  }
  if (loading) return <div className="center-page"><div className="brand-mark pulse"><Crown size={40} /></div></div>
  if (!session) return <Login />
  if (recovering) return <NewPassword />
  // profile === undefined means the profiles table isn't set up yet; carry on as before.
  if (profile === null) return <FinishSignup />
  // Important Terms change: existing members agree once more (the Terms pages stay readable).
  if (profile && profile.terms_version !== TERMS_VERSION && pathname !== '/terms' && pathname !== '/privacy') return <TermsUpdate />
  if (!shop && profile?.account_type === 'stream') return <StreamShell />
  if (!shop) return <CreateShop />

  return (
    <div className="shell">
      <ScrollTop />
      <header className="topnav no-print" aria-label="Main menu">
        <NavLink to="/" className="topnav-brand" aria-label="Home"><span className="dock-logo small"><Crown size={20} /></span><b>Dynamic Dazzle<span className="tm">™</span></b></NavLink>
        <nav className="topnav-links">
          {TOP.filter(n => !(isTeam && OWNER_ONLY.has(n.to))).map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={() => `topnav-link${n.fit ? ` fit-${n.fit}` : ''}${top === n.area ? ' active' : ''}`}>
              <Icon name={n.icon} size={20} /><span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="topnav-end">
          <NavLink to="/settings" className={() => `topnav-link icon-only${top === 'settings' ? ' active' : ''}`} aria-label="Settings" title="Settings"><Icon name="settings" size={20} /></NavLink>
          <button className={`topnav-link topnav-more${area === 'more' && top !== 'settings' && top !== 'university' ? ' active' : ''}${top === 'university' ? ' holds-wider' : top === 'customers' ? ' holds-wide' : ''}`} onClick={() => setMenu(true)} aria-label="More: everything in the app"><Icon name="menu" size={20} /><span>More</span></button>
        </div>
      </header>

      <header className="mobile-top no-print">
        <NavLink to="/" className="brand"><span className="dock-logo small"><Crown size={20} /></span><span className="brand-text"><b>Dynamic Dazzle<span className="tm">™</span></b></span></NavLink>
        <button className="btn ghost small" onClick={() => setMenu(true)} aria-label="Open menu"><Icon name="menu" size={18} /> Menu</button>
      </header>
      <Sheet open={menu} onClose={() => setMenu(false)} title="Everything">
        <div className="menu-sheet">
          {[['Stock', STOCK], ['Lives', LIVES], ['Orders', ORDERS], ['You and your shop', MORE]].map(([name, list]) => (
            <div key={name as string} className="stack tight-gap">
              <span className="nav-group">{name as string}</span>
              <div className="menu-links">
                {name === 'You and your shop' && host && <NavLink to="/host" className="menu-link"><Icon name="live" size={18} />♛ Host desk</NavLink>}
                {(list as typeof STOCK).filter(n => !(isTeam && (OWNER_ONLY.has(n.to) || n.to === '/settings/team'))).map(n => <NavLink key={n.to} to={n.to} className="menu-link"><Icon name={n.icon} size={18} />{n.label}</NavLink>)}
              </div>
            </div>
          ))}
          <div className="row-between"><span className="muted small">{session.user.email}</span><button className="link-btn" onClick={() => supabase.auth.signOut()}>Sign out</button></div>
        </div>
      </Sheet>

      <main className="content">
        <OnAirBar />
        <SubNav path={pathname} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/labels" element={<Labels />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/damaged" element={<Damaged />} />
          <Route path="/locations" element={<Warehouse />} />
          <Route path="/bin/:id" element={<BinDetail />} />
          <Route path="/bin-labels" element={<BinLabels />} />
          <Route path="/receive/bulk" element={<BulkReceive />} />
          <Route path="/live" element={<LivePrep />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/shared-page" element={isTeam ? <OwnerOnly what="Shared Page lives" /> : <SharedPage />} />
          <Route path="/on-air/:id" element={isTeam ? <OwnerOnly what="Going live on the Shared Page" /> : <OnAir />} />
          <Route path="/giveaways" element={<Giveaways />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Legal which="terms" />} />
          <Route path="/privacy" element={<Legal which="privacy" />} />
          <Route path="/lives/:id" element={<LiveDetail />} />
          <Route path="/lives/:id/plan" element={<LivePlan />} />
          <Route path="/lives/:id/bot" element={<LiveBot />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/planner/ideas" element={<Planner view="ideas" />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/:section" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:view" element={<Reports />} />
          <Route path="/lessons" element={isTeam ? <OwnerOnly what="Dazzle University" /> : <Lessons />} />
          <Route path="/host" element={<HostDesk />} />
          <Route path="/consult" element={isTeam ? <OwnerOnly what="Time with the Queen" /> : <Consult />} />
          <Route path="/lessons/:id" element={isTeam ? <OwnerOnly what="Dazzle University" /> : <LessonPlayer />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/upload" element={<OrdersUpload />} />
          <Route path="/order/:code" element={<OrderDetail />} />
          <Route path="/order/:code/receipt" element={<Receipt />} />
          <Route path="/gear" element={<Gear />} />
          <Route path="/pick" element={<Pick />} />
          <Route path="/box-labels" element={<BoxLabels />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </main>

      <AskNova />

      <nav className="tabbar no-print">
        <NavLink to="/" end><Icon name="dashboard" size={22} /><span>Home</span></NavLink>
        <NavLink to="/inventory" className={() => area === 'stock' ? 'active' : ''}><Icon name="inventory" size={22} /><span>Stock</span></NavLink>
        <NavLink to="/scan" className="tab-scan" aria-label="Scan">
          <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3M8 8v8M12 8v8M16 8v8" /></svg>
        </NavLink>
        <NavLink to="/planner" className={() => area === 'lives' ? 'active' : ''}><Icon name="sparkle" size={22} /><span>Lives</span></NavLink>
        <NavLink to="/orders" className={() => area === 'orders' ? 'active' : ''}><Icon name="pack" size={22} /><span>Orders</span></NavLink>
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </ToastProvider>
    </SessionProvider>
  )
}
