import { useLayoutEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

/**
 * A Code 128 barcode sized for thermal printers. Each bar is a whole number of printer dots
 * (203 dots per inch on most shipping label printers), so bars print crisp and scan first time,
 * instead of being stretched to fill the label.
 */
export default function CrispBarcode({ value, heightIn, maxWidthIn, dpi = 203, maxDots = 3 }: { value: string; heightIn: number; maxWidthIn: number; dpi?: number; maxDots?: number }) {
  const ref = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => {
    const svg = ref.current
    if (!svg) return
    JsBarcode(svg, value, { format: 'CODE128', displayValue: false, margin: 0, height: 100, width: 1 })
    const modules = parseFloat(svg.getAttribute('width') || '0') || 1
    const dots = Math.max(1, Math.min(maxDots, Math.floor((maxWidthIn * dpi) / modules)))
    // Thermal printers spread a little heat into the gaps, which can close the thin white spaces.
    // So each bar is drawn one printer dot narrower (bar width reduction, the standard fix); spaces get that dot.
    if (dots >= 2) svg.querySelectorAll('rect').forEach(r => {
      const w = parseFloat(r.getAttribute('width') || '0')
      if (w > 0 && w < modules) r.setAttribute('width', String(w - 1 / dots))
    })
    // One blank module each side, so rounding at the picture's edge can never shave the first or last bar.
    svg.setAttribute('viewBox', `-1 0 ${modules + 2} 100`)
    svg.setAttribute('preserveAspectRatio', 'none')
    svg.style.width = `${((modules + 2) * dots) / dpi}in`
    svg.style.height = `${heightIn}in`
    svg.removeAttribute('width')
    svg.removeAttribute('height')
  }, [value, heightIn, maxWidthIn, dpi, maxDots])
  return <svg ref={ref} className="crisp-barcode" shapeRendering="crispEdges" />
}
