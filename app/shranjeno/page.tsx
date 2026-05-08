import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Listing } from '@/lib/types'
import ListingCard from '@/components/ListingCard'

export default async function ShranjenoPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/prijava')

  const { data } = await supabase
    .from('saved_listings')
    .select('listing_id, listings(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const listings = ((data ?? []) as any[]).map((d) => d.listings).filter(Boolean) as Listing[]
  const savedIds = new Set(listings.map((l) => l.id))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Shranjeni oglasi</h1>

      {listings.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg mb-4">Še nimaš shranjenih oglasov.</p>
          <Link
            href="/oglasi"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Brskaj po oglasih
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} isSaved={savedIds.has(listing.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
