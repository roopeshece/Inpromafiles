export interface AssetCategory {
  categoryId: number
  categoryName: string
  description: string | null
}

export interface CategoryReference {
  categoryId: number
  categoryName?: string
  description?: string | null
}

export interface CategoryRequest {
  categoryName: string
  description: string | null
}
