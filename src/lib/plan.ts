/* Subscription plans (see the pricing doc). shops.plan holds the shop's plan.
   null = founder / full access (Dynamic Dazzle's own shop). */
export type Plan = 'stream' | 'gem' | 'crown' | 'empire'
export const PLAN_NAMES: Record<Plan, string> = { stream: 'Stream (free)', gem: 'Gem', crown: 'Crown', empire: 'Empire' }
const RANK: Record<Plan, number> = { stream: 0, gem: 1, crown: 2, empire: 3 }
export const atLeast = (plan: Plan | null | undefined, min: Plan) => plan == null || RANK[plan] >= RANK[min]
/** Dazzle Academy (app lessons and business courses) comes with Gem and up. */
export const hasAcademy = (plan: Plan | null | undefined) => atLeast(plan, 'gem')
