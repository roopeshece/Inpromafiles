import { apiRequest } from "@/lib/api"
import type { AssetCategory, CategoryRequest } from "@/types/category"

export function listCategories(): Promise<AssetCategory[]> {
  return apiRequest<AssetCategory[]>("/categories")
}

export function getCategory(categoryId: number): Promise<AssetCategory> {
  return apiRequest<AssetCategory>(`/categories/${categoryId}`)
}

export function createCategory(
  payload: CategoryRequest
): Promise<AssetCategory> {
  return apiRequest<AssetCategory>("/categories", {
    method: "POST",
    body: payload,
  })
}

export function updateCategory(
  categoryId: number,
  payload: CategoryRequest
): Promise<AssetCategory> {
  return apiRequest<AssetCategory>(`/categories/${categoryId}`, {
    method: "PUT",
    body: payload,
  })
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await apiRequest<void>(`/categories/${categoryId}`, { method: "DELETE" })
}
