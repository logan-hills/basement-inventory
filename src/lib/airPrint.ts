import { Capacitor, registerPlugin } from '@capacitor/core'

/* AirPrint in the iPhone and iPad app. Inside an app, a web page's Print (window.print) does nothing,
   so every Print button quietly goes to Apple's print sheet instead. It prints the page's print layout,
   on paper that matches the label size when the printer has it. On the website nothing changes. */

type AirPrintPlugin = { printPage(o: { name?: string; w?: number; h?: number }): Promise<{ printed: boolean }> }
const AirPrint = registerPlugin<AirPrintPlugin>('AirPrint')

export const canAirPrint = () => Capacitor.getPlatform() === 'ios' && Capacitor.isPluginAvailable('AirPrint')

/** The page size a label page asks for with `@page { size: Win Hin }`, if any (the last one wins, like in CSS). */
function pageSize() {
  let w = 0, h = 0
  for (const el of document.querySelectorAll('style')) {
    for (const m of (el.textContent ?? '').matchAll(/@page\s*\{[^}]*size:\s*([\d.]+)in\s+([\d.]+)in/g)) { w = +m[1]; h = +m[2] }
  }
  return { w, h }
}

/** Prints the page and finishes once the print window closes: AirPrint in the app, the browser's print window on the web. */
export async function printPage() {
  if (!canAirPrint()) { webPrint(); return }
  const { w, h } = pageSize()
  try { await AirPrint.printPage({ name: document.title || 'Dazzle Warehouse', w, h }) } catch { /* closed the sheet */ }
}

const webPrint = () => Window.prototype.print.call(window)
export function setUpAirPrint() {
  if (!canAirPrint()) return
  window.print = () => { void printPage() }
}
