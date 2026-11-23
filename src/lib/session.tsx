import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { saveSettings, withDefaults, type Settings } from './settings'

export type Shop = { id: string; name: string; settings: Settings }

type Ctx = {
  session: Session | null
  shop: Shop | null
  loading: boolean
  refreshShop: () => Promise<void>
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => Promise<void>
}

const SessionContext = createContext<Ctx>({ session: null, shop: null, loading: true, refreshShop: async () => {}, settings: withDefaults(null), updateSettings: async () => {} })

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadShop(s: Session | null) {
    if (!s) { setShop(null); return }
    let { data, error } = await supabase.from('shops').select('id,name,settings').order('created_at').limit(1)
    // Before the settings column exists, fall back to the basics.
    if (error) ({ data } = await supabase.from('shops').select('id,name').order('created_at').limit(1) as any)
    const row: any = data?.[0]
    setShop(row ? { id: row.id, name: row.name, settings: withDefaults(row.settings) } : null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      await loadShop(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      loadShop(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <SessionContext.Provider value={{
      session, shop, loading, refreshShop: () => loadShop(session),
      settings: shop?.settings ?? withDefaults(null),
      updateSettings: async patch => {
        if (!shop) return
        const next = { ...shop.settings, ...patch }
        setShop({ ...shop, settings: next })
        await saveSettings(shop.id, next)
      },
    }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
