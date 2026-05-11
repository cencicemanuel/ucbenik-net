'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { CITIES } from '@/lib/schools'

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/oglasi?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearAll = () => router.push('/oglasi')

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Filtri</h2>
          <button onClick={clearAll} className="text-xs text-blue-600 hover:underline">
            Počisti vse
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Iskanje</label>
          <input
            type="text"
            placeholder="Naslov knjige..."
            defaultValue={searchParams.get('q') ?? ''}
            onChange={(e) => updateParam('q', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Predmet</label>
          <input
            type="text"
            placeholder="npr. Matematika"
            defaultValue={searchParams.get('predmet') ?? ''}
            onChange={(e) => updateParam('predmet', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">Letnik</label>
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((year) => {
              const active = searchParams.get('letnik') === String(year)
              return (
                <button
                  key={year}
                  onClick={() => updateParam('letnik', active ? '' : String(year))}
                  className={`py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {year}.
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">Stanje</label>
          <div className="space-y-1">
            {[
              { value: 'odlično', label: 'Odlično', color: 'bg-green-100 text-green-800' },
              { value: 'dobro', label: 'Dobro', color: 'bg-yellow-100 text-yellow-800' },
              { value: 'sprejemljivo', label: 'Sprejemljivo', color: 'bg-orange-100 text-orange-800' },
            ].map(({ value, label, color }) => {
              const active = searchParams.get('stanje') === value
              return (
                <button
                  key={value}
                  onClick={() => updateParam('stanje', active ? '' : value)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    active ? `${color} font-medium` : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Cena (€)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Od"
              defaultValue={searchParams.get('od') ?? ''}
              onChange={(e) => updateParam('od', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            <span className="text-slate-400 shrink-0">–</span>
            <input
              type="number"
              placeholder="Do"
              defaultValue={searchParams.get('do') ?? ''}
              onChange={(e) => updateParam('do', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Kraj prodajalca</label>
          <select
            value={searchParams.get('mesto') ?? ''}
            onChange={(e) => updateParam('mesto', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Vsa mesta</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  )
}
