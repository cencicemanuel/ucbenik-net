'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function PhotoGallery({ photos }: { photos: string[] }) {
  const [active, setActive] = useState(0)

  if (!photos || photos.length === 0) {
    return (
      <div className="aspect-[4/3] bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-slate-100">
        <Image
          src={photos[active]}
          alt="Fotografija knjige"
          fill
          className="object-contain"
        />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                i === active ? 'border-blue-600' : 'border-transparent hover:border-slate-300'
              }`}
            >
              <Image src={photo} alt={`Foto ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
