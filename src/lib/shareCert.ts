import { toBlob } from 'html-to-image'

/* Share a Dazzle University certificate on Facebook.
   Facebook only lets websites share links, not pictures, so we turn the certificate into a picture first:
   - Phones and tablets: the share sheet opens with the picture and a caption; pick Facebook (or Messenger, Photos…).
   - Computers: the picture downloads, the caption is copied, and Facebook opens in a new tab ready for a post. */

export const certCaption = (title: string) =>
  `I just earned my certificate in "${title}" from Dazzle University! 🎓✨ Always learning, always growing my shop. #DazzleUniversity #LiveSeller #SmallBusiness`

export type ShareResult = 'shared' | 'downloaded' | 'cancelled' | 'failed'

export async function shareCertificate(el: HTMLElement, title: string): Promise<ShareResult> {
  const caption = certCaption(title)
  let blob: Blob | null = null
  try { blob = await toBlob(el, { pixelRatio: 2, backgroundColor: '#FFFBF3', style: { boxShadow: 'none', margin: '0' } }) } catch { blob = null }
  if (!blob) return 'failed'
  const name = `Dazzle-University-${title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60)}.png`
  const file = new File([blob], name, { type: 'image/png' })
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: caption, title: 'My Dazzle University certificate' })
      return 'shared'
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return 'cancelled'
  }
  const url = URL.createObjectURL(file)
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
  try { await navigator.clipboard?.writeText(caption) } catch { /* the caption is also shown on screen */ }
  window.open('https://www.facebook.com/', '_blank', 'noopener')
  return 'downloaded'
}
