import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import ObjavljaForm from './ObjavljaForm'

export default async function ObjavljaPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/prijava')

  return <ObjavljaForm />
}
