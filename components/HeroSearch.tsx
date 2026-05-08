'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CHIPS = [
  { label: '1. letnik', href: '/oglasi?letnik=1' },
  { label: '2. letnik', href: '/oglasi?letnik=2' },
  { label: '3. letnik', href: '/oglasi?letnik=3' },
  { label: '4. letnik', href: '/oglasi?letnik=4' },
  { label: 'Matura', href: '/oglasi?q=matura' },
  { label: 'Gimnazija', href: '/oglasi?q=gimnazija' },
  { label: 'Srednja šola', href: '/oglasi?q=srednja' },
]

export default function HeroSearch() {
  const [q, setQ] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    router.push(`/oglasi${params.size ? '?' + params : ''}`)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-lg">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Išči po naslovu ali predmetu..."
          className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terra/40 bg-white border border-warm-border"
        />
        <button
          type="submit"
          className="bg-terra text-white px-5 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
        >
          Išči
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        {CHIPS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-xs px-3 py-1.5 rounded-full border border-warm-border bg-white text-warm-muted hover:border-navy hover:text-navy transition-colors duration-200"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
