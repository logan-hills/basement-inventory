import { COPYRIGHT_LINE, TRADEMARK_LINE } from '../lib/legal'

/** Quiet ownership notice at the bottom of every screen: copyright, trademarks, Terms and Privacy. */
export default function BrandFooter() {
  return (
    <footer className="brand-footer">
      <p>{COPYRIGHT_LINE}</p>
      <p>{TRADEMARK_LINE} <a href="#/terms">Terms of Use</a> · <a href="#/privacy">Privacy Policy</a></p>
    </footer>
  )
}
