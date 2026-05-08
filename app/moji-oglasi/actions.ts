'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function deleteListing(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/prijava')

  const id = formData.get('id') as string

  const { data: listing } = await supabase
    .from('listings')
    .select('photos')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (listing?.photos?.length) {
    const fileNames = listing.photos.map((url: string) => url.split('/').pop()!)
    await supabase.storage.from('photos').remove(fileNames)
  }

  await supabase.from('listings').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/moji-oglasi')
}
