export type Condition = 'odlično' | 'dobro' | 'sprejemljivo'

export type Listing = {
  id: string
  created_at: string
  title: string
  author: string | null
  school_name: string | null
  school_city: string | null
  subject: string | null
  grade_year: number | null
  condition: Condition
  price: number
  description: string | null
  photos: string[]
  seller_name: string
  seller_contact: string
  seller_city: string | null
  is_active: boolean
}
