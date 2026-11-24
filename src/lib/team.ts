import { supabase } from './supabase'
import type { Plan } from './plan'

/** Team members each plan includes (the owner doesn't count). Matches team_limit() in supabase/018. */
export const TEAM_LIMIT: Record<Plan, number> = { stream: 0, gem: 1, crown: 2, empire: 5 }
export const teamLimit = (plan: Plan | null | undefined) => (plan ? TEAM_LIMIT[plan] : 5)

export type TeamMember = { user_id: string; role: 'owner' | 'staff'; display_name: string; email: string | null; joined_at: string }
export type TeamInvite = { code: string; name: string | null; created_at: string; expires_at: string }

/** Friendlier words for database errors, and a hint when the 018 update hasn't been run yet. */
function plain(e: { message: string } | null): never | void {
  if (!e) return
  if (/function .* does not exist|schema cache|relation .* does not exist/i.test(e.message)) throw new Error('Team members need a quick database update first.')
  throw new Error(e.message)
}

export async function loadTeam(shopId: string) {
  const [m, i] = await Promise.all([
    supabase.rpc('team_members'),
    supabase.from('shop_invites').select('code,name,created_at,expires_at').eq('shop_id', shopId).is('used_by', null).gt('expires_at', new Date().toISOString()).order('created_at'),
  ])
  plain(m.error); plain(i.error)
  return { members: (m.data ?? []) as TeamMember[], invites: (i.data ?? []) as TeamInvite[] }
}

export async function createInvite(name: string) {
  const { data, error } = await supabase.rpc('create_team_invite', { p_name: name.trim() || null })
  plain(error)
  return data as string
}
export async function cancelInvite(code: string) { plain((await supabase.rpc('cancel_team_invite', { p_code: code })).error) }
export async function removeMember(userId: string) { plain((await supabase.rpc('remove_team_member', { p_user: userId })).error) }
export async function joinTeam(code: string) { plain((await supabase.rpc('join_team', { p_code: code })).error) }

/** Codes print as ABCD-EFGH so they're easy to read out loud. */
export const prettyCode = (c: string) => c.length === 8 ? `${c.slice(0, 4)}-${c.slice(4)}` : c
