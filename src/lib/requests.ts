import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useSession } from './session'

/* Requests sellers send from forms in the app: free 1:1 coaching, and Time with the Queen.
   No email app opens. Each request lands on the Queen's Host desk (022_founder_host_desk_and_requests.sql),
   and her Home screen shows how many are new. */

export type RequestKind = 'coaching' | 'queen'
export type HostRequest = {
  id: string; user_id: string; shop_name: string | null; kind: RequestKind; name: string; email: string | null; phone: string | null
  best_time: 'Daytime' | 'Evening' | null; hours: number | null; topics: string | null; details: string
  status: 'new' | 'handled'; created_at: string; handled_at: string | null
}
export type NewRequest = Pick<HostRequest, 'kind' | 'name' | 'email' | 'phone' | 'best_time' | 'hours' | 'topics' | 'details'>

export const KIND_LABEL: Record<RequestKind, string> = { coaching: 'Free 1:1 coaching', queen: 'Time with the Queen' }

const missing = (e: { code?: string; message?: string } | null) => !!e && (e.code === '42P01' || e.code === 'PGRST205' || /host_requests/.test(e.message ?? ''))
export const REQUESTS_NOT_SET_UP = 'Requests aren\'t switched on yet. Run 022_founder_host_desk_and_requests.sql in Supabase.'

/** Send a request to the Queen's Host desk. Returns null when sent, or a message to show. */
export function useSendRequest() {
  const { shop } = useSession()
  return useCallback(async (r: NewRequest): Promise<string | null> => {
    const { error } = await supabase.from('host_requests').insert({ ...r, shop_id: shop?.id ?? null, shop_name: shop?.name ?? null })
    if (!error) return null
    return missing(error) ? 'We couldn\'t send this just yet. The team is finishing the setup. Please try again soon.' : error.message
  }, [shop])
}

/** My own recent requests, so a seller can see hers went through. */
export function useMyRequests(kind: RequestKind) {
  const { session } = useSession()
  const [list, setList] = useState<HostRequest[]>([])
  const load = useCallback(async () => {
    if (!session) return
    const { data } = await supabase.from('host_requests').select('*').eq('user_id', session.user.id).eq('kind', kind).order('created_at', { ascending: false }).limit(3)
    setList((data ?? []) as HostRequest[])
  }, [session, kind])
  useEffect(() => { load() }, [load])
  return { list, reload: load }
}

/** For the Queen and her hosts: every request, newest first, plus mark handled. */
export function useHostRequests(enabled: boolean) {
  const [list, setList] = useState<HostRequest[]>([])
  const [ready, setReady] = useState<boolean | null>(null)
  const load = useCallback(async () => {
    if (!enabled) return
    const since = new Date(Date.now() - 60 * 86400000).toISOString()
    const { data, error } = await supabase.from('host_requests').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(100)
    if (error) { setReady(missing(error) ? false : null); return }
    setReady(true); setList((data ?? []) as HostRequest[])
  }, [enabled])
  useEffect(() => {
    load()
    if (!enabled) return
    // Check again every two minutes, so a new request shows without a refresh.
    const t = setInterval(load, 120000)
    return () => clearInterval(t)
  }, [load, enabled])
  const setStatus = useCallback(async (id: string, status: HostRequest['status']) => {
    const { error } = await supabase.from('host_requests').update({ status, handled_at: status === 'handled' ? new Date().toISOString() : null }).eq('id', id)
    if (!error) await load()
    return error?.message ?? null
  }, [load])
  return { list, fresh: list.filter(r => r.status === 'new'), ready, setStatus, reload: load }
}

/** "2 hours ago", "Yesterday", "Nov 20". */
export function ago(iso: string, now = new Date()) {
  const m = Math.round((now.getTime() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`
  if (h < 48) return 'Yesterday'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
