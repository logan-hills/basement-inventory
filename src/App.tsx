import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import { SessionProvider, useSession } from './lib/session'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import CreateShop from './pages/CreateShop'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'
import Intake from './pages/Intake'
import Inventory from './pages/Inventory'
import Labels from './pages/Labels'

function Shell() {
  const { session, shop, loading } = useSession()
  if (loading) return <div className="center-page muted">Loading…</div>
  if (!session) return <Login />
  if (!shop) return <CreateShop />

  return (
    <div className="shell">
      <header className="topbar no-print">
        <NavLink to="/" className="brand">The Basement</NavLink>
        <nav>
          <NavLink to="/intake">Add</NavLink>
          <NavLink to="/inventory">Inventory</NavLink>
          <NavLink to="/locations">Warehouse</NavLink>
          <NavLink to="/scan">Scan</NavLink>
        </nav>
        <button className="link" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/labels" element={<Labels />} />
          <Route path="/locations" element={<ComingSoon title="Warehouse" />} />
          <Route path="/scan" element={<ComingSoon title="Scan" />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <SessionProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </SessionProvider>
  )
}
