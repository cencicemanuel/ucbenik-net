'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function PrijavaPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Preveri svojo pošto</h1>
        <p className="text-slate-500">
          Poslali smo ti povezavo na <strong>{email}</strong>. Klikni nanjo in se boš prijavil.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Prijava</h1>
      <p className="text-slate-500 mb-8">
        Vpiši svoj e-mail in poslali ti bomo povezavo za prijavo. Geslo ni potrebno.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tvoj@email.com"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Pošiljam...' : 'Pošlji povezavo za prijavo'}
        </button>
      </form>
    </div>
  )
}
