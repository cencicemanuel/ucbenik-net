'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE_MB = 8
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const MAX_PHOTOS = 5

export type ListingFormState = { error: string | null }

export async function createListing(
  _prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava')

  // ── Validate photos ───────────────────────────────────────
  const photoFiles = (formData.getAll('photos') as File[]).filter(
    (f) => f && f.size > 0
  )

  if (photoFiles.length > MAX_PHOTOS) {
    return { error: `Naloži lahko največ ${MAX_PHOTOS} fotografij.` }
  }

  for (const file of photoFiles) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        error: `Datoteka "${file.name}" ni slika. Dovoljeni formati: JPEG, PNG, WebP, GIF.`,
      }
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        error: `Datoteka "${file.name}" je prevelika. Največja dovoljena velikost je ${MAX_FILE_SIZE_MB} MB.`,
      }
    }
  }

  // ── Validate required fields ──────────────────────────────
  const title = (formData.get('title') as string | null)?.trim()
  const priceRaw = formData.get('price') as string
  const condition = formData.get('condition') as string
  const sellerName = (formData.get('seller_name') as string | null)?.trim()
  const sellerContact = (formData.get('seller_contact') as string | null)?.trim()

  if (!title) return { error: 'Naslov knjige je obvezen.' }
  if (title.length > 200) return { error: 'Naslov je predolg (največ 200 znakov).' }

  const price = parseFloat(priceRaw)
  if (isNaN(price) || price < 0) return { error: 'Cena mora biti pozitivno število.' }
  if (price > 999) return { error: 'Cena ne sme presegati 999 €.' }

  const allowedConditions = ['odlično', 'dobro', 'sprejemljivo']
  if (!allowedConditions.includes(condition)) return { error: 'Neveljavno stanje knjige.' }

  if (!sellerName) return { error: 'Ime prodajalca je obvezno.' }
  if (!sellerContact) return { error: 'Kontakt prodajalca je obvezen.' }

  // ── Upload photos ─────────────────────────────────────────
  const photoUrls: string[] = []

  for (const file of photoFiles) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage
      .from('photos')
      .upload(fileName, file, { contentType: file.type })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(fileName)
      photoUrls.push(publicUrl)
    }
  }

  // ── Insert listing ────────────────────────────────────────
  const gradeRaw = formData.get('grade_year') as string

  const { data, error } = await supabase
    .from('listings')
    .insert({
      user_id: user.id,
      title,
      author: (formData.get('author') as string) || null,
      school_name: (formData.get('school_name') as string) || null,
      school_city: (formData.get('school_city') as string) || null,
      subject: (formData.get('subject') as string) || null,
      grade_year: gradeRaw ? parseInt(gradeRaw) : null,
      condition,
      price,
      description: (formData.get('description') as string) || null,
      photos: photoUrls,
      seller_name: sellerName,
      seller_contact: sellerContact,
      seller_city: (formData.get('seller_city') as string) || null,
      is_active: true,
    })
    .select('id')
    .single()

  if (error) return { error: 'Objave ni bilo mogoče shraniti. Poskusi znova.' }

  redirect(`/oglas/${data.id}`)
}
