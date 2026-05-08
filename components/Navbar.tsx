import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { signOut } from '@/app/auth/actions'

export default async function Navbar() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="bg-white border-b border-warm-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold text-navy flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="15" width="18" height="4" rx="1.5" fill="currentColor" opacity="0.3"/>
            <rect x="2" y="9" width="18" height="4" rx="1.5" fill="currentColor" opacity="0.6"/>
            <rect x="2" y="3" width="18" height="4" rx="1.5" fill="currentColor"/>
          </svg>
          Učbenik.net
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/oglasi"
            className="text-sm text-warm-muted hover:text-navy transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-terra after:transition-all after:duration-200"
          >
            Oglasi
          </Link>

          {user ? (
            <>
              <Link
                href="/moji-oglasi"
                className="text-sm text-warm-muted hover:text-navy transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-terra after:transition-all after:duration-200"
              >
                Moji oglasi
              </Link>
              <Link
                href="/shranjeno"
                className="text-sm text-warm-muted hover:text-navy transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-terra after:transition-all after:duration-200"
              >
                Shranjeno
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm text-warm-muted hover:text-navy transition-colors duration-200"
                >
                  Odjava
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/prijava"
              className="text-sm text-warm-muted hover:text-navy transition-colors duration-200"
            >
              Prijava
            </Link>
          )}

          <Link
            href="/objavi"
            className="bg-terra text-white text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity duration-200 flex items-center gap-1.5"
          >
            <span>+</span> Objavi oglas
          </Link>
        </div>
      </div>
    </nav>
  )
}
