import type { Plan } from './plan'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { saveSettings, withDefaults, type Settings } from './settings'
import { loadProfile, type Profile } from './profile'

export type Shop = { id: string; name: string; settings: Settings; plan: Plan | null }

type Ctx = {
  session: Session | null
  shop: Shop | null
  loading: boolean
  /** null = needs to finish sign-up; undefined = profiles not set up in the database yet. */
  profile: Profile | null | undefined
  refreshProfile: () => Promise<void>
  refreshShop: () => Promise<void>
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => Promise<void>
}

const SessionContext = createContext<Ctx>({ session: null, shop: null, loading: true, profile: undefined, refreshProfile: async () => {}, refreshShop: async () => {}, settings: withDefaults(null), updateSettings: async () => {} })

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined)

  async function loadMe(s: Session | null) {
    if (!s) { setProfile(undefined); return }
    const p = await loadProfile(s.user.id)
    setProfile(p)
    // Everyone joins the community live calendar.
    if (p) supabase.rpc('join_open_stages').then(() => null, () => null)
  }

  async function loadShop(s: Session | null) {
    if (!s) { setShop(null); return }
    let { data, error } = await supabase.from('shops').select('id,name,settings,plan').order('created_at').limit(1)
    // Before newer columns exist, fall back step by step.
    if (error) ({ data, error } = await supabase.from('shops').select('id,name,settings').order('created_at').limit(1) as any)
    if (error) ({ data } = await supabase.from('shops').select('id,name').order('created_at').limit(1) as any)
    const row: any = data?.[0]
    setShop(row ? { id: row.id, name: row.name, settings: withDefaults(row.settings), plan: row.plan ?? null } : null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      await Promise.all([loadShop(data.session), loadMe(data.session)])
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      loadShop(s); loadMe(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <SessionContext.Provider value={{
      session, shop, loading, refreshShop: () => loadShop(session),
      profile, refreshProfile: () => loadMe(session),
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
