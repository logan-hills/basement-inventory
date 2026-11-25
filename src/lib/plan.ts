/* Subscription plans (see the pricing doc). shops.plan holds the shop's plan.
   'founder' = Dynamic Dazzle's own shop (LaVerne, the creator) and her team: every feature, free forever.
   Only the platform owner can set it, in Supabase (supabase/020). null = a shop from before plans
   existed, which 020 turns into founder; until that update runs we treat it the same way. */
export type Plan = 'stream' | 'gem' | 'crown' | 'empire' | 'founder'
export const PLAN_NAMES: Record<Plan, string> = { stream: 'Stream (free)', gem: 'Gem', crown: 'Crown', empire: 'Empire', founder: 'Founder (free forever)' }
const RANK: Record<Plan, number> = { stream: 0, gem: 1, crown: 2, empire: 3, founder: 4 }
export const isFounder = (plan: Plan | null | undefined) => plan == null || plan === 'founder'
export const atLeast = (plan: Plan | null | undefined, min: Plan) => isFounder(plan) || RANK[plan!] >= RANK[min]
/** Dazzle University (app lessons and business courses) comes with Gem and up. */
export const hasAcademy = (plan: Plan | null | undefined) => atLeast(plan, 'gem')
