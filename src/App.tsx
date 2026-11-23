import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SessionProvider, useSession } from './lib/session'
import { ToastProvider } from './lib/toast'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import CreateShop from './pages/CreateShop'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'
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

export function Crown({ size = 28 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5L3 8z" /><path d="M5 21h14" />
    </svg>
  )
}

const STOCK = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/inventory', label: 'Inventory' },
  { to: '/intake', label: 'Receive items' },
  { to: '/scan', label: 'Scan' },
  { to: '/locations', label: 'Warehouse' },
  { to: '/damaged', label: 'Damaged' },
]
const SELL = [
  { to: '/live', label: 'Get ready for live' },
  { to: '/orders', label: 'Pick and pack' },
  { to: '/shipping', label: 'Shipping' },
  { to: '/customers', label: 'Customers' },
]

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Shell() {
  const { session, shop, loading } = useSession()
  if (loading) return <div className="center-page"><div className="brand-mark pulse"><Crown size={40} /></div></div>
  if (!session) return <Login />
  if (!shop) return <CreateShop />

  return (
    <div className="shell">
      <ScrollTop />
      <aside className="sidebar no-print">
        <NavLink to="/" className="brand">
          <span className="gold"><Crown /></span>
          <span className="brand-text"><b>Dynamic Dazzle</b><small>Basement Warehouse</small></span>
        </NavLink>
        <span className="nav-group">Stock</span>
        {STOCK.map(n => <NavLink key={n.to} to={n.to} end={n.end} className="nav-link">{n.label}</NavLink>)}
        <span className="nav-group">Sell</span>
        {SELL.map(n => <NavLink key={n.to} to={n.to} className="nav-link">{n.label}</NavLink>)}
        <div className="sidebar-foot">
          <span className="muted small">{session.user.email}</span>
          <button className="link-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </aside>

      <header className="mobile-top no-print">
        <NavLink to="/" className="brand"><span className="gold"><Crown size={24} /></span><span className="brand-text"><b>Dynamic Dazzle</b></span></NavLink>
        <button className="link-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </header>

      <main className="content">
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
          <Route path="/live" element={<ComingSoon title="Get ready for live" />} />
          <Route path="/orders" element={<ComingSoon title="Pick and pack" />} />
          <Route path="/shipping" element={<ComingSoon title="Shipping" />} />
          <Route path="/customers" element={<ComingSoon title="Customers" />} />
        </Routes>
      </main>

      <nav className="tabbar no-print">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/inventory">Inventory</NavLink>
        <NavLink to="/scan" className="tab-scan" aria-label="Scan">
          <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3M8 8v8M12 8v8M16 8v8" /></svg>
        </NavLink>
        <NavLink to="/intake">Receive</NavLink>
        <NavLink to="/live">Live</NavLink>
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
