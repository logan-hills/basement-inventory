import { toBlob } from 'html-to-image'

/* "Save for printer app": turns each label on the page into a picture, so phones can print through
   the printer maker's own app (Nelko, MUNBYN, receipt printer apps and similar). Bluetooth label printers
   don't show up in the iPhone print window, but every one of their apps can print a picture.
   Pictures are made at 203 dots per inch, the resolution of most thermal printers, so 1 inch = 203 pixels. */

const DPI = 203

export async function saveLabelsAsImages(name: string, selector = '.print-area .sheet') {
  const sheets = [...document.querySelectorAll<HTMLElement>(selector)]
  if (!sheets.length) return 0
  const files: File[] = []
  for (let i = 0; i < sheets.length; i++) {
    const el = sheets[i]
    const blob = await toBlob(el, { pixelRatio: DPI / 96, backgroundColor: '#ffffff', style: { boxShadow: 'none' } })
    if (blob) files.push(new File([blob], `${name}-${String(i + 1).padStart(3, '0')}.png`, { type: 'image/png' }))
  }
  // Phones: open the share sheet so the seller can pick the printer's app (or Save to Photos).
  try {
    if (navigator.canShare?.({ files })) { await navigator.share({ files }); return files.length }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return 0
  }
  // Computers: download the pictures.
  for (const f of files) {
    const url = URL.createObjectURL(f)
    const a = Object.assign(document.createElement('a'), { href: url, download: f.name })
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
  }
  return files.length
}
