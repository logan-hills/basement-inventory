// Facebook Login in the browser, used only by a host to connect the shared Page once.
// The App ID is public by design (like the Supabase publishable key). The App Secret lives only
// in Supabase Edge Function secrets.
const APP_ID = import.meta.env.VITE_FB_APP_ID as string | undefined
// Facebook Login for Business configuration (holds the four Page permissions below). Public, like the App ID.
const CONFIG_ID = import.meta.env.VITE_FB_CONFIG_ID as string | undefined
export const fbConfigured = !!APP_ID

export const FB_SCOPES = ['pages_show_list', 'pages_manage_posts', 'pages_read_engagement', 'pages_read_user_content']

let loading: Promise<any> | null = null

export function loadFacebook(): Promise<any> {
  if (!APP_ID) return Promise.reject(new Error('The Facebook app is not set up yet'))
  const w = window as any
  if (w.FB) return Promise.resolve(w.FB)
  if (loading) return loading
  loading = new Promise((resolve, reject) => {
    w.fbAsyncInit = () => { w.FB.init({ appId: APP_ID, version: 'v21.0', xfbml: false, cookie: false }); resolve(w.FB) }
    const s = document.createElement('script')
    s.src = 'https://connect.facebook.net/en_US/sdk.js'
    s.async = true; s.crossOrigin = 'anonymous'
    s.onerror = () => { loading = null; reject(new Error('Could not load Facebook. Check your connection or ad blocker.')) }
    document.body.appendChild(s)
  })
  return loading
}

/** Must be called straight from a button tap, or the browser blocks the Facebook popup. */
export function facebookLogin(FB: any): Promise<string> {
  return new Promise((resolve, reject) => {
    FB.login((res: any) => {
      const t = res?.authResponse?.accessToken
      if (t) resolve(t); else reject(new Error('Facebook login was cancelled'))
    }, CONFIG_ID
      ? { config_id: CONFIG_ID, auth_type: 'rerequest', return_scopes: true }
      : { scope: FB_SCOPES.join(','), auth_type: 'rerequest', return_scopes: true })
  })
}
