import { toBlob } from 'html-to-image'

/* "Save for printer app": turns each label on the page into a picture, so phones can print through
   the printer maker's own app (Nelko, MUNBYN, receipt printer apps and similar). Bluetooth label printers
   don't show up in the iPhone print window, but every one of their apps can print a picture.
   Pictures are made at 203 dots per inch, the resolution of most thermal printers, so 1 inch = 203 pixels. */

const DPI = 203

/** Gives a picture a quarter turn clockwise, the same way the page turns when it prints. */
async function turnQuarter(blob: Blob): Promise<Blob> {
  const img = await createImageBitmap(blob)
  const c = document.createElement('canvas')
  c.width = img.height; c.height = img.width
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height)
  ctx.translate(c.width, 0); ctx.rotate(Math.PI / 2); ctx.drawImage(img, 0, 0)
  return await new Promise<Blob>((ok, bad) => c.toBlob(b => (b ? ok(b) : bad(new Error('turn'))), 'image/png'))
}

/** `turn`: the label feeds the long way (DYMO rolls, landscape 4×6). Printer apps print a picture along the
    feed exactly as it is, so the picture gets the same quarter turn as the printed page. */
export async function saveLabelsAsImages(name: string, selector = '.print-area .sheet', turn = false) {
  const sheets = [...document.querySelectorAll<HTMLElement>(selector)]
  if (!sheets.length) return 0
  const files: File[] = []
  // The on-screen preview shrinks pages to fit and hides extras. Show every page at true size while we take the pictures.
  const areas = [...document.querySelectorAll<HTMLElement>('.print-area')]
  areas.forEach(a => a.classList.add('capturing'))
  try {
    for (let i = 0; i < sheets.length; i++) {
      const el = sheets[i]
      let blob = await toBlob(el, { pixelRatio: DPI / 96, backgroundColor: '#ffffff', style: { boxShadow: 'none', zoom: '1' } })
      if (blob && turn) blob = await turnQuarter(blob)
      if (blob) files.push(new File([blob], `${name}-${String(i + 1).padStart(3, '0')}.png`, { type: 'image/png' }))
    }
  } finally {
    areas.forEach(a => a.classList.remove('capturing'))
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
