import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Listing } from '@/lib/types'
import ListingCard from '@/components/ListingCard'
import HeroSearch from '@/components/HeroSearch'
import FaqAccordion from '@/components/FaqAccordion'

async function getRecentListings(): Promise<Listing[]> {
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return (data ?? []) as Listing[]
}

async function getStats(): Promise<{ total: number; thisWeek: number }> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const [{ count: total }, { count: thisWeek }] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_active', true).gte('created_at', weekAgo),
  ])
  return { total: total ?? 0, thisWeek: thisWeek ?? 0 }
}

export default async function HomePage() {
  const [listings, stats, supabaseServer] = await Promise.all([
    getRecentListings(),
    getStats(),
    createSupabaseServerClient(),
  ])

  const { data: { user } } = await supabaseServer.auth.getUser()

  let savedIds = new Set<string>()
  if (user) {
    const { data: saved } = await supabaseServer
      .from('saved_listings').select('listing_id').eq('user_id', user.id)
    savedIds = new Set((saved ?? []).map((s: any) => s.listing_id))
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-cream py-16 px-4 border-b border-warm-border">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center gap-12">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy leading-tight mb-4">
              Prodaj učbenike,<br />ki samevajo na polici.
            </h1>
            <p className="text-lg text-warm-muted mb-8 leading-relaxed">
              Največji trg rabljenih učbenikov za slovenske dijake. Brez provizij, brez posrednikov.
            </p>

            <HeroSearch />

            {stats.total > 0 && (
              <p className="mt-5 text-sm text-warm-muted">
                <span className="font-semibold text-navy">{stats.total}</span> aktivnih oglasov
                {stats.thisWeek > 0 && (
                  <> · <span className="font-semibold text-navy">{stats.thisWeek}</span> novih ta teden</>
                )}
              </p>
            )}
          </div>

          {/* Hero photo (desktop) */}
          <div className="hidden lg:block relative shrink-0 rounded-2xl overflow-hidden" style={{ width: 340, height: 260, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <Image
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=680&h=520&fit=crop&auto=format"
              alt="Učbeniki na polici"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Subject chips */}
      <section className="bg-cream border-b border-warm-border py-4 px-4 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-xs font-semibold text-warm-muted shrink-0">Po predmetih:</span>
          <div className="flex gap-2 flex-nowrap">
            {[
              'Matematika', 'Slovenščina', 'Angleščina', 'Zgodovina',
              'Geografija', 'Biologija', 'Kemija', 'Fizika', 'Informatika',
            ].map((subject) => (
              <a
                key={subject}
                href={`/oglasi?predmet=${encodeURIComponent(subject)}`}
                className="text-xs px-3 py-1.5 rounded-full border border-warm-border bg-white text-warm-muted hover:border-navy hover:text-navy transition-colors duration-200 whitespace-nowrap"
              >
                {subject}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-b border-warm-border py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Objavi oglas',
              desc: 'Dodaj fotografijo, ceno in kontakt. Traja manj kot minuto.',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
            },
            {
              title: 'Kupec te kontaktira',
              desc: 'Zainteresirani kupci pišejo ali kličejo neposredno na tvoj kontakt.',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              ),
            },
            {
              title: 'Dogovorita se osebno',
              desc: 'Knjigo predaš na srečanju, plačilo prejmeš takoj na roko.',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
            },
          ].map(({ title, desc, icon }) => (
            <div key={title} className="flex gap-4 items-start p-5 rounded-2xl bg-cream">
              <div className="w-9 h-9 rounded-xl bg-navy text-white flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-navy mb-1">{title}</h3>
                <p className="text-sm text-warm-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent listings */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-navy">Najnovejši oglasi</h2>
          <Link href="/oglasi" className="text-sm font-medium text-terra hover:underline underline-offset-4 transition-colors duration-200">
            Vsi oglasi →
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} isSaved={savedIds.has(listing.id)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border-2 border-dashed border-warm-border text-warm-muted">
            <svg className="w-12 h-12 text-warm-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-base">Še ni oglasov. Bodi prvi!</p>
            <Link href="/objavi" className="bg-terra text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity duration-200">
              Objavi oglas
            </Link>
          </div>
        )}

        {listings.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/objavi"
              className="inline-flex items-center gap-2 bg-terra text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity duration-200"
            >
              + Objavi oglas
            </Link>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-warm-border py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-navy text-center mb-8">
            Pogosta vprašanja
          </h2>
          <FaqAccordion />
        </div>
      </section>
    </div>
  )
}
