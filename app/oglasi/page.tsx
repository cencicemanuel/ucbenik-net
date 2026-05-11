import { Suspense } from 'react'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Listing } from '@/lib/types'
import ListingCard from '@/components/ListingCard'
import FilterSidebar from '@/components/FilterSidebar'

const PER_PAGE = 12

type Params = Promise<Record<string, string | string[] | undefined>>

function get(params: Record<string, string | string[] | undefined>, key: string) {
  const v = params[key]
  return typeof v === 'string' ? v : undefined
}

async function getListings(
  params: Record<string, string | string[] | undefined>,
  page: number
): Promise<{ listings: Listing[]; total: number }> {
  const supabase = await createSupabaseServerClient()

  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  let query = supabase
    .from('listings')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  const q = get(params, 'q')
  const predmet = get(params, 'predmet')
  const letnik = get(params, 'letnik')
  const stanje = get(params, 'stanje')
  const od = get(params, 'od')
  const doParam = get(params, 'do')
  const mesto = get(params, 'mesto')

  if (q) query = query.ilike('title', `%${q}%`)
  if (predmet) query = query.ilike('subject', `%${predmet}%`)
  if (letnik) query = query.eq('grade_year', parseInt(letnik))
  if (stanje) query = query.eq('condition', stanje)
  if (od) query = query.gte('price', parseFloat(od))
  if (doParam) query = query.lte('price', parseFloat(doParam))
  if (mesto) query = query.eq('seller_city', mesto)

  const { data, error, count } = await query
  if (error) return { listings: [], total: 0 }
  return { listings: data as Listing[], total: count ?? 0 }
}

function buildUrl(
  params: Record<string, string | string[] | undefined>,
  page: number
): string {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v && k !== 'stran') p.set(k, String(v))
  }
  if (page > 1) p.set('stran', String(page))
  const qs = p.toString()
  return `/oglasi${qs ? `?${qs}` : ''}`
}

export default async function OglasiPage({ searchParams }: { searchParams: Params }) {
  const params = await searchParams
  const page = Math.max(1, parseInt(get(params, 'stran') ?? '1') || 1)

  const supabase = await createSupabaseServerClient()
  const [{ listings, total }, { data: { user } }] = await Promise.all([
    getListings(params, page),
    supabase.auth.getUser(),
  ])

  let savedIds = new Set<string>()
  if (user) {
    const { data: saved } = await supabase
      .from('saved_listings')
      .select('listing_id')
      .eq('user_id', user.id)
    savedIds = new Set((saved ?? []).map((s: any) => s.listing_id))
  }

  const totalPages = Math.ceil(total / PER_PAGE)
  const hasFilters = Object.entries(params).some(([k, v]) => k !== 'stran' && Boolean(v))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <Suspense fallback={<div className="w-full lg:w-64 shrink-0" />}>
          <FilterSidebar />
        </Suspense>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-slate-900 mb-4">
            {hasFilters ? `${total} rezultatov` : 'Vsi oglasi'}
          </h1>

          {listings.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} isSaved={savedIds.has(listing.id)} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  {page > 1 ? (
                    <Link
                      href={buildUrl(params, page - 1)}
                      className="px-4 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      ← Prejšnja
                    </Link>
                  ) : (
                    <span className="px-4 py-2 text-sm rounded-lg border border-slate-100 text-slate-300 cursor-not-allowed">
                      ← Prejšnja
                    </span>
                  )}

                  <span className="text-sm text-slate-500">
                    {page} / {totalPages}
                  </span>

                  {page < totalPages ? (
                    <Link
                      href={buildUrl(params, page + 1)}
                      className="px-4 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      Naslednja →
                    </Link>
                  ) : (
                    <span className="px-4 py-2 text-sm rounded-lg border border-slate-100 text-slate-300 cursor-not-allowed">
                      Naslednja →
                    </span>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <p className="text-base">Ni najdenih oglasov.</p>
              <p className="text-sm mt-1">Poskusi z drugačnimi filtri.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
