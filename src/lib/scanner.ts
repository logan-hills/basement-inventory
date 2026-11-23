import type { KeyboardEvent } from 'react'

/* Hardware scanners (USB, Bluetooth, the 2.4G dongle kind and Android scanner phones) act like a keyboard:
   they "type" the barcode and then press Enter. Some come set to press Tab instead, which would jump
   out of the scan box. This treats Tab after a code like Enter, so those scanners work without
   re-programming. Use it as onKeyDown on any scan box that sits in a <form>. */
export function scanBoxKeyDown(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key === 'Tab' && !e.shiftKey && e.currentTarget.value.trim()) {
    e.preventDefault()
    e.currentTarget.form?.requestSubmit()
  }
}

/** Keys typed this fast (ms between keys, on average) came from a scanner, not fingers. */
export const SCANNER_SPEED_MS = 35
