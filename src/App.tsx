import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
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
import LessonPlayer from './pages/LessonPlayer'
import Planner from './pages/Planner'
import LivePlan from './pages/LivePlan'
import LiveBot from './pages/LiveBot'
import SharedPage from './pages/SharedPage'
import OnAir from './pages/OnAir'
import Overlay from './pages/Overlay'
import OnAirBar from './components/OnAirBar'
import Profile from './pages/Profile'
import FinishSignup from './pages/FinishSignup'
import Legal from './pages/Legal'

export function Crown({ size = 28 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5L3 8z" /><path d="M5 21h14" />
    </svg>
  )
}

const STOCK = [
  { to: '/', label: 'Dashboard', end: true, icon: 'dashboard' },
  { to: '/inventory', label: 'Inventory', icon: 'inventory' },
  { to: '/intake', label: 'Receive items', icon: 'receive' },
  { to: '/scan', label: 'Scan', icon: 'scan' },
  { to: '/locations', label: 'Warehouse', icon: 'warehouse' },
  { to: '/damaged', label: 'Damaged', icon: 'damaged' },
]
const SELL = [
  { to: '/planner', label: 'Live Planner', icon: 'sparkle' },
  { to: '/calendar', label: 'Live calendar', icon: 'calendar' },
  { to: '/shared-page', label: 'Shared Page lives', icon: 'clock' },
  { to: '/live', label: 'Get ready for live', icon: 'live' },
  { to: '/orders', label: 'Pick and pack', icon: 'pack' },
  { to: '/shipping', label: 'Shipping', icon: 'truck' },
  { to: '/customers', label: 'Customers', icon: 'users' },
]
const MORE = [
  { to: '/profile', label: 'My profile', icon: 'users' },
  { to: '/reports', label: 'Reports', icon: 'reports' },
  { to: '/lessons', label: 'Dazzle Academy', icon: 'lessons' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

/** The always-visible dock: the places used every day. Everything else is one tap away in More. */
const DOCK = [
  { to: '/', label: 'Home', end: true, icon: 'dashboard' },
  { to: '/inventory', label: 'Stock', icon: 'inventory' },
  { to: '/scan', label: 'Scan', icon: 'scan' },
  { to: '/planner', label: 'Planner', icon: 'sparkle' },
  { to: '/live', label: 'Sell', icon: 'live' },
  { to: '/orders', label: 'Pack', icon: 'pack' },
  { to: '/shipping', label: 'Ship', icon: 'truck' },
  { to: '/reports', label: 'Money', icon: 'reports' },
]

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const STREAM_NAV = [
  { to: '/', label: 'Live calendar', end: true, icon: 'calendar' },
  { to: '/profile', label: 'My profile', icon: 'users' },
]

/** The free "just stream" account: the shared live calendar, On Air, and a profile. */
function StreamShell() {
  return (
    <div className="shell">
      <ScrollTop />
      <aside className="dock no-print" aria-label="Main menu">
        <NavLink to="/" className="dock-logo" aria-label="Home"><Crown size={26} /></NavLink>
        {STREAM_NAV.map(n => <NavLink key={n.to} to={n.to} end={n.end} className="dock-link"><Icon name={n.icon} size={22} /><span>{n.label}</span></NavLink>)}
      </aside>
      <header className="mobile-top no-print">
        <NavLink to="/" className="brand"><span className="dock-logo small"><Crown size={20} /></span><span className="brand-text"><b>Dynamic Dazzle</b></span></NavLink>
        <NavLink to="/profile" className="btn ghost small">My profile</NavLink>
      </header>
      <main className="content">
        <OnAirBar />
        <Routes>
          <Route path="/on-air/:id" element={<OnAir />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Legal which="terms" />} />
          <Route path="/privacy" element={<Legal which="privacy" />} />
          <Route path="*" element={<SharedPage />} />
        </Routes>
      </main>
      <nav className="tabbar no-print">
        {STREAM_NAV.map(n => <NavLink key={n.to} to={n.to} end={n.end}><Icon name={n.icon} size={22} /><span>{n.label}</span></NavLink>)}
      </nav>
    </div>
  )
}

function Shell() {
  const { session, shop, loading, profile } = useSession()
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  const recovering = useRecovering()
  useEffect(() => { setMenu(false) }, [pathname])
  // The on-stream product card for Prism / OBS: public, no sign-in, nothing else on the page.
  if (pathname.startsWith('/overlay/')) return <Routes><Route path="/overlay/:token" element={<Overlay />} /></Routes>
  if (pathname === '/terms' || pathname === '/privacy') {
    if (!session || !shop) return <main className="content solo"><Legal which={pathname === '/terms' ? 'terms' : 'privacy'} /></main>
  }
  if (loading) return <div className="center-page"><div className="brand-mark pulse"><Crown size={40} /></div></div>
  if (!session) return <Login />
  if (recovering) return <NewPassword />
  // profile === undefined means the profiles table isn't set up yet; carry on as before.
  if (profile === null) return <FinishSignup />
  if (!shop && profile?.account_type === 'stream') return <StreamShell />
  if (!shop) return <CreateShop />

  return (
    <div className="shell">
      <ScrollTop />
      <aside className="dock no-print" aria-label="Main menu">
        <NavLink to="/" className="dock-logo" aria-label="Home"><Crown size={26} /></NavLink>
        {DOCK.map(n => <NavLink key={n.to} to={n.to} end={n.end} className="dock-link"><Icon name={n.icon} size={22} /><span>{n.label}</span></NavLink>)}
        <button className="dock-link" onClick={() => setMenu(true)}><Icon name="menu" size={22} /><span>More</span></button>
      </aside>

      <header className="mobile-top no-print">
        <NavLink to="/" className="brand"><span className="dock-logo small"><Crown size={20} /></span><span className="brand-text"><b>Dynamic Dazzle</b></span></NavLink>
        <button className="btn ghost small" onClick={() => setMenu(true)} aria-label="Open menu"><Icon name="menu" size={18} /> Menu</button>
      </header>
      <Sheet open={menu} onClose={() => setMenu(false)} title="Everything">
        <div className="menu-sheet">
          {[['Stock', STOCK], ['Sell', SELL], ['Manage', MORE]].map(([name, list]) => (
            <div key={name as string} className="stack tight-gap">
              <span className="nav-group">{name as string}</span>
              <div className="menu-links">{(list as typeof STOCK).map(n => <NavLink key={n.to} to={n.to} end={n.end} className="menu-link"><Icon name={n.icon} size={18} />{n.label}</NavLink>)}</div>
            </div>
          ))}
          <div className="row-between"><span className="muted small">{session.user.email}</span><button className="link-btn" onClick={() => supabase.auth.signOut()}>Sign out</button></div>
        </div>
      </Sheet>

      <main className="content">
        <OnAirBar />
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
          <Route path="/shared-page" element={<SharedPage />} />
          <Route path="/on-air/:id" element={<OnAir />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Legal which="terms" />} />
          <Route path="/privacy" element={<Legal which="privacy" />} />
          <Route path="/lives/:id" element={<LiveDetail />} />
          <Route path="/lives/:id/plan" element={<LivePlan />} />
          <Route path="/lives/:id/bot" element={<LiveBot />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:id" element={<LessonPlayer />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/upload" element={<OrdersUpload />} />
          <Route path="/order/:code" element={<OrderDetail />} />
          <Route path="/pick" element={<Pick />} />
          <Route path="/box-labels" element={<BoxLabels />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </main>

      <nav className="tabbar no-print">
        <NavLink to="/" end><Icon name="dashboard" size={22} /><span>Home</span></NavLink>
        <NavLink to="/inventory"><Icon name="inventory" size={22} /><span>Stock</span></NavLink>
        <NavLink to="/scan" className="tab-scan" aria-label="Scan">
          <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3M8 8v8M12 8v8M16 8v8" /></svg>
        </NavLink>
        <NavLink to="/planner"><Icon name="sparkle" size={22} /><span>Planner</span></NavLink>
        <NavLink to="/orders"><Icon name="pack" size={22} /><span>Pack</span></NavLink>
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
