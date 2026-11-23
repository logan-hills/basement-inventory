import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useSession } from './session'

export type Progress = { step: number; score: number | null; completed_at: string | null }
type Map = Record<string, Progress>

const KEY = 'lessonProgress'
const readLocal = (): Map => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} } }
const writeLocal = (m: Map) => { try { localStorage.setItem(KEY, JSON.stringify(m)) } catch { /* ignore */ } }

/** Lesson progress for the signed-in person: saved to the shop (so owners can see the team) with a local copy as backup. */
export function useLessonProgress() {
  const { shop, session } = useSession()
  const [map, setMap] = useState<Map>(readLocal)

  useEffect(() => {
    if (!shop || !session) return
    supabase.from('lesson_progress').select('lesson_id,step,score,completed_at').eq('user_id', session.user.id).then(({ data }) => {
      if (!data) return
      setMap(prev => {
        const next = { ...prev }
        for (const r of data as any[]) {
          const p = next[r.lesson_id]
          if (!p || (r.completed_at && !p.completed_at) || r.step > p.step) next[r.lesson_id] = { step: r.step, score: r.score, completed_at: r.completed_at }
        }
        writeLocal(next); return next
      })
    })
  }, [shop, session])

  const save = useCallback((id: string, patch: Partial<Progress>) => {
    setMap(prev => {
      const cur = prev[id] ?? { step: 0, score: null, completed_at: null }
      const nextP = { ...cur, ...patch }
      const next = { ...prev, [id]: nextP }
      writeLocal(next)
      if (shop && session) supabase.from('lesson_progress').upsert({ shop_id: shop.id, user_id: session.user.id, lesson_id: id, ...nextP, updated_at: new Date().toISOString() }).then(() => {})
      return next
    })
  }, [shop, session])

  return { progress: map, save }
}
