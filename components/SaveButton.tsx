'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function SaveButton({ listingId, initialSaved }: { listingId: string; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/prijava')
      return
    }

    if (saved) {
      await supabase.from('saved_listings').delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
    } else {
      await supabase.from('saved_listings').insert({ user_id: user.id, listing_id: listingId })
    }

    setSaved(!saved)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
      title={saved ? 'Odstrani iz shranjenih' : 'Shrani oglas'}
      suppressHydrationWarning
    >
      <svg
        className={`w-4 h-4 transition-colors ${saved ? 'text-blue-600' : 'text-slate-400'}`}
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  )
}
