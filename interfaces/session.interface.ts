export interface Session {
  status: 'draft' | 'published' | 'archived'
  temp_order: TempOrder[]
}

export interface TempOrder {
  product_id?: string
  price?: string
  quantity: string
  color_id: string | null
  size_id: string | null
}
