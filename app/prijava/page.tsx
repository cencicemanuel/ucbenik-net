'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function PrijavaPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    }

    router.push('/moji-oglasi')
    router.refresh()
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        {mode === 'signin' ? 'Prijava' : 'Registracija'}
      </h1>
      <p className="text-slate-500 mb-8">
        {mode === 'signin' ? 'Prijavi se v svoj račun.' : 'Ustvari nov račun.'}
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

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
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Geslo</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="najmanj 6 znakov"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Prosim počakaj...' : mode === 'signin' ? 'Prijava' : 'Registracija'}
        </button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-6">
        {mode === 'signin' ? 'Še nimaš računa?' : 'Že imaš račun?'}{' '}
        <button
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}
          className="text-blue-600 hover:underline font-medium"
        >
          {mode === 'signin' ? 'Registracija' : 'Prijava'}
        </button>
      </p>
    </div>
  )
}
