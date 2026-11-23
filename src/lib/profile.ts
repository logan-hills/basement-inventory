import { supabase } from './supabase'

/** Bump when the Terms or Privacy Policy change in a way people must agree to again. */
export const TERMS_VERSION = '2026-11-23'

export type Profile = {
  user_id: string; display_name: string; photo_path: string | null; bio: string | null
  email: string | null; phone: string | null
  show_photo: boolean; show_bio: boolean; show_email: boolean; show_phone: boolean
  account_type: 'stream' | 'seller'; terms_version: string | null; terms_accepted_at: string | null
}
export type PublicProfile = Pick<Profile, 'user_id' | 'display_name' | 'photo_path' | 'bio' | 'email' | 'phone'>

/** null = no profile yet; undefined = the profiles table isn't there yet (database update pending). */
export async function loadProfile(userId: string): Promise<Profile | null | undefined> {
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle()
  if (error) return undefined
  return data as Profile | null
}

export async function saveProfile(p: Partial<Profile> & { user_id: string }) {
  const { error } = await supabase.from('profiles').upsert(p)
  if (error) throw error
}

export async function loadPublicProfiles(ids: string[]): Promise<Record<string, PublicProfile>> {
  if (!ids.length) return {}
  const { data } = await supabase.from('public_profiles').select('*').in('user_id', [...new Set(ids)])
  return Object.fromEntries((data ?? []).map((p: any) => [p.user_id, p as PublicProfile]))
}

export function avatarUrl(path: string | null | undefined) {
  if (!path) return null
  return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
}

/** Shrinks the photo to a 512px square-ish JPEG before upload, so it loads fast on phones. */
export async function uploadAvatar(userId: string, file: File) {
  const img = await createImageBitmap(file)
  const size = 512, s = Math.min(img.width, img.height)
  const c = document.createElement('canvas'); c.width = size; c.height = size
  c.getContext('2d')!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size)
  const blob: Blob = await new Promise(r => c.toBlob(b => r(b!), 'image/jpeg', 0.85))
  const path = `${userId}/${Date.now()}.jpg`
  const { error } = await supabase.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg', upsert: true })
  if (error) throw error
  return path
}

export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('') || '?'
