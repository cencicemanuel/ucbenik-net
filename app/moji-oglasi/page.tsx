import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Listing } from '@/lib/types'
import ListingCard from '@/components/ListingCard'
import { deleteListing } from './actions'

export default async function MojiOglasiPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/prijava')

  const [{ data: listingsData }, { data: savedData }] = await Promise.all([
    supabase.from('listings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('saved_listings').select('listing_id').eq('user_id', user.id),
  ])

  const listings = (listingsData ?? []) as Listing[]
  const savedIds = new Set((savedData ?? []).map((s: any) => s.listing_id))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Moji oglasi</h1>

      {listings.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg mb-4">Še nimaš objavljenih oglasov.</p>
          <Link
            href="/objavi"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Objavi prvi oglas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="flex flex-col gap-1">
              <ListingCard listing={listing} isSaved={savedIds.has(listing.id)} />
              <form action={deleteListing} onSubmit={(e) => { if (!confirm('Si prepričan, da želiš izbrisati ta oglas?')) e.preventDefault() }}>
                <input type="hidden" name="id" value={listing.id} />
                <button
                  type="submit"
                  className="w-full text-xs text-red-500 hover:text-red-700 py-1.5 transition-colors"
                >
                  Izbriši oglas
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
