'use client'

import { useRef, useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import { createListing, ListingFormState } from './actions'
import { SCHOOLS } from '@/lib/schools'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Objavljam...' : 'Objavi oglas'}
    </button>
  )
}

const CONDITIONS = [
  { value: 'odlično', label: 'Odlično', desc: 'Kot nova, brez poškodb' },
  { value: 'dobro', label: 'Dobro', desc: 'Normalna uporaba, brez večjih poškodb' },
  { value: 'sprejemljivo', label: 'Sprejemljivo', desc: 'Vidna obraba, morda zapisi v notranjosti' },
]

const initialState: ListingFormState = { error: null }

export default function ObjavljaForm() {
  const [state, formAction] = useActionState(createListing, initialState)
  const [previews, setPreviews] = useState<string[]>([])
  const [selectedSchool, setSelectedSchool] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const schoolCity = SCHOOLS.find((s) => s.name === selectedSchool)?.city ?? ''

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Objavi oglas</h1>

      <form action={formAction} className="space-y-6">

        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {state.error}
          </div>
        )}

        <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-900">Podatki o knjigi</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Naslov knjige <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              required
              placeholder="npr. Matematika 1"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Avtor</label>
            <input
              name="author"
              placeholder="npr. Aleš Cotič"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Šola</label>
            <select
              name="school_name"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Izberi šolo...</option>
              {SCHOOLS.map((school) => (
                <option key={`${school.name}-${school.city}`} value={school.name}>
                  {school.name} ({school.city})
                </option>
              ))}
            </select>
            <input type="hidden" name="school_city" value={schoolCity} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Predmet</label>
              <input
                name="subject"
                placeholder="npr. Matematika"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Letnik</label>
              <select
                name="grade_year"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Izberi...</option>
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y}>
                    {y}. letnik
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Stanje <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {CONDITIONS.map(({ value, label, desc }) => (
                <label
                  key={value}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50"
                >
                  <input type="radio" name="condition" value={value} required className="mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-slate-900">{label}</span>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cena (€) <span className="text-red-500">*</span>
            </label>
            <input
              name="price"
              type="number"
              required
              min="0"
              max="999"
              step="0.5"
              placeholder="npr. 8"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Opis</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Kratko opiši stanje knjige, ali so v njej zapisi ipd."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div>
            <h2 className="font-semibold text-slate-900">Fotografije</h2>
            <p className="text-sm text-slate-500 mt-0.5">Do 5 fotografij (JPEG, PNG, WebP · največ 8 MB vsaka). Oglasi s fotografijami se hitreje prodajo.</p>
          </div>

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previews.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                  <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-200 rounded-xl py-6 text-sm text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
          >
            + Dodaj fotografije
          </button>

          <input
            ref={fileInputRef}
            type="file"
            name="photos"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="hidden"
          />
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-900">Tvoji podatki</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ime in priimek <span className="text-red-500">*</span>
            </label>
            <input
              name="seller_name"
              required
              placeholder="npr. Maja Novak"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Telefon ali e-mail <span className="text-red-500">*</span>
            </label>
            <input
              name="seller_contact"
              required
              placeholder="npr. 041 123 456 ali maja@email.com"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kraj</label>
            <input
              name="seller_city"
              placeholder="npr. Ljubljana"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        <SubmitButton />
      </form>
    </div>
  )
}
