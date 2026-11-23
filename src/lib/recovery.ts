// Password reset. A seller who forgot their password gets a code by email (or by text once an SMS
// provider is connected in Supabase), enters it, and is then asked to choose a new password.
// While that last step is open we keep showing the "Choose a new password" screen, even though
// Supabase has already signed them in.
import { useSyncExternalStore } from 'react'
import { supabase, SUPABASE_KEY, SUPABASE_URL } from './supabase'

const KEY = 'dd-recovering'
const listeners = new Set<() => void>()
let recovering = read()

function read() { try { return sessionStorage.getItem(KEY) === '1' } catch { return false } }

export function setRecovering(on: boolean) {
  recovering = on
  try { on ? sessionStorage.setItem(KEY, '1') : sessionStorage.removeItem(KEY) } catch { /* private mode */ }
  listeners.forEach(l => l())
}

export function useRecovering() {
  return useSyncExternalStore(l => { listeners.add(l); return () => listeners.delete(l) }, () => recovering)
}

// Someone tapped the link in the reset email instead of typing the code.
supabase.auth.onAuthStateChange(e => {
  if (e === 'PASSWORD_RECOVERY') setRecovering(true)
  if (e === 'SIGNED_OUT') setRecovering(false)
})

/** True once a text-message provider (Twilio, etc.) is switched on in Supabase. Then "Text me a code" appears. */
let smsCheck: Promise<boolean> | null = null
export function smsAvailable(): Promise<boolean> {
  smsCheck ??= fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_KEY } })
    .then(r => r.ok ? r.json() : null)
    .then(s => !!s?.external?.phone)
    .catch(() => false)
  return smsCheck
}

/** US numbers can be typed any way: (555) 123-4567 → +15551234567. Other countries need the + and country code. */
export function toE164(raw: string) {
  const t = raw.trim()
  const digits = t.replace(/\D/g, '')
  if (t.startsWith('+')) return '+' + digits
  if (digits.length === 10) return '+1' + digits
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits
  return '+' + digits
}

/** Supabase error text, said kindly. */
export function friendly(msg: string) {
  const m = msg.toLowerCase()
  if (m.includes('expired') || m.includes('invalid') && m.includes('token')) return 'That code didn\'t work. It may have expired. Tap "Send a new code" and try the newest one.'
  if (m.includes('rate limit') || m.includes('security purposes') || m.includes('too many')) return 'Too many tries for now. Give it a minute, then send a new code.'
  if (m.includes('signups not allowed') || m.includes('user not found')) return 'We couldn\'t find an account with that phone number. Try your email instead, or add your phone in My profile once you\'re signed in.'
  if (m.includes('same') && m.includes('password')) return 'That\'s your old password. Pick a new one.'
  if (m.includes('sms') || m.includes('phone provider')) return 'Text messages aren\'t switched on yet. Use your email for now.'
  return msg
}
