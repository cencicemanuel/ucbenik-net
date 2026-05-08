import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Listing } from '@/lib/types'
import PhotoGallery from '@/components/PhotoGallery'

const CONDITION_LABEL: Record<string, string> = {
  'odlično': 'Odlično',
  'dobro': 'Dobro',
  'sprejemljivo': 'Sprejemljivo',
}

const CONDITION_COLOR: Record<string, string> = {
  'odlično': 'bg-green-100 text-green-800',
  'dobro': 'bg-yellow-100 text-yellow-800',
  'sprejemljivo': 'bg-orange-100 text-orange-800',
}

type Params = Promise<{ id: string }>

export default async function OglasPage({ params }: { params: Params }) {
  const { id } = await params

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const listing = data as Listing
  const date = new Date(listing.created_at).toLocaleDateString('sl-SI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const isEmail = listing.seller_contact.includes('@')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/oglasi" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
        ← Nazaj na oglase
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PhotoGallery photos={listing.photos ?? []} />

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
            {listing.author && <p className="text-slate-500 mt-1">{listing.author}</p>}
          </div>

          <div className="text-3xl font-bold text-blue-700">{listing.price} €</div>

          <div className="flex flex-wrap gap-2">
            {listing.condition && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${CONDITION_COLOR[listing.condition] ?? ''}`}>
                {CONDITION_LABEL[listing.condition] ?? listing.condition}
              </span>
            )}
            {listing.grade_year && (
              <span className="px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700">
                {listing.grade_year}. letnik
              </span>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
            {listing.school_name && (
              <div className="flex gap-2">
                <span className="text-slate-500 w-20 shrink-0">Šola</span>
                <span className="text-slate-900">{listing.school_name}</span>
              </div>
            )}
            {listing.subject && (
              <div className="flex gap-2">
                <span className="text-slate-500 w-20 shrink-0">Predmet</span>
                <span className="text-slate-900">{listing.subject}</span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="text-slate-500 w-20 shrink-0">Objavljeno</span>
              <span className="text-slate-900">{date}</span>
            </div>
          </div>

          {listing.description && (
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Opis</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-semibold text-slate-900 mb-3">Kontakt prodajalca</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-16 shrink-0">Ime</span>
                <span className="font-medium text-slate-900">{listing.seller_name}</span>
              </div>
              {listing.seller_city && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-16 shrink-0">Kraj</span>
                  <span className="text-slate-900">{listing.seller_city}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-16 shrink-0">Kontakt</span>
                <a
                  href={isEmail ? `mailto:${listing.seller_contact}` : `tel:${listing.seller_contact}`}
                  className="text-blue-700 font-medium hover:underline"
                >
                  {listing.seller_contact}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
