import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy text-blue-200 py-12 px-4 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-display text-xl font-bold text-white mb-2">Učbenik.net</div>
            <p className="text-sm leading-relaxed">
              Trg rabljenih učbenikov za slovenske dijake. Brezplačno, hitro, brez posrednikov.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-white mb-3">Koristne povezave</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/oglasi" className="hover:text-white transition-colors duration-200">Oglasi</Link></li>
              <li><Link href="/objavi" className="hover:text-white transition-colors duration-200">Objavi oglas</Link></li>
              <li><Link href="/moji-oglasi" className="hover:text-white transition-colors duration-200">Moji oglasi</Link></li>
              <li><Link href="/shranjeno" className="hover:text-white transition-colors duration-200">Shranjeni oglasi</Link></li>
              <li><Link href="/prijava" className="hover:text-white transition-colors duration-200">Prijava</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-white mb-3">O projektu</h3>
            <p className="text-sm leading-relaxed">
              Narejeno v Sloveniji 🇸🇮<br />
              Brezplačno za vse dijake.<br />
              Brez provizij, brez skritih stroškov.
            </p>
            <p className="text-xs mt-4 text-blue-300">© 2025 Učbenik.net</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
