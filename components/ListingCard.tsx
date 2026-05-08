import Link from 'next/link'
import Image from 'next/image'
import { Listing } from '@/lib/types'
import SaveButton from './SaveButton'

const CONDITION_COLORS: Record<string, string> = {
  'odlično': 'bg-green-100 text-green-800',
  'dobro': 'bg-yellow-100 text-yellow-800',
  'sprejemljivo': 'bg-orange-100 text-orange-800',
}

export default function ListingCard({ listing, isSaved }: { listing: Listing; isSaved?: boolean }) {
  const photo = listing.photos?.[0]

  return (
    <div className="relative group transition-all duration-200 ease-out hover:-translate-y-0.5">
      <Link
        href={`/oglas/${listing.id}`}
        className="block bg-white rounded-2xl overflow-hidden border border-warm-border hover:shadow-md hover:border-navy/20 transition-all duration-200"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        <div className="aspect-[4/5] bg-warm-card relative overflow-hidden">
          {photo ? (
            <Image
              src={photo}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-warm-border">
              <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1 text-navy">
              {listing.title}
            </h3>
            <span className="font-bold text-base whitespace-nowrap text-terra shrink-0">
              {listing.price} €
            </span>
          </div>

          {listing.author && (
            <p className="text-xs text-warm-muted truncate mb-2">{listing.author}</p>
          )}

          <div className="flex items-center justify-between gap-1 mt-2">
            <span className="text-xs text-warm-muted truncate">
              {listing.seller_city ?? listing.school_name ?? ''}
            </span>
            {listing.condition && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${CONDITION_COLORS[listing.condition] ?? 'bg-slate-100 text-slate-600'}`}>
                {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <SaveButton listingId={listing.id} initialSaved={isSaved ?? false} />
    </div>
  )
}
