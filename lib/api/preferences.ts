import { apiRequest } from "@/lib/api"
import type { ProfileAssetPreference } from "@/types/preference"

export function listPreferences(
  profileId: number
): Promise<ProfileAssetPreference[]> {
  return apiRequest<ProfileAssetPreference[]>(
    `/preferences/profile/${profileId}`
  )
}

export function createPreference(
  profileId: number,
  categoryId: number
): Promise<ProfileAssetPreference> {
  return apiRequest<ProfileAssetPreference>("/preferences", {
    method: "POST",
    body: { profile: { profileId }, category: { categoryId } },
  })
}

export async function deletePreference(preferenceId: number): Promise<void> {
  await apiRequest<void>(`/preferences/${preferenceId}`, { method: "DELETE" })
}

/**
 * Brings the stored preferences in line with the selected category IDs by
 * deleting deselected rows and creating newly selected ones.
 */
export async function syncPreferences(
  profileId: number,
  selectedCategoryIds: number[]
): Promise<void> {
  const existing = await listPreferences(profileId)
  const selected = new Set(selectedCategoryIds)
  const existingIds = new Set(existing.map((p) => p.category.categoryId))

  const toDelete = existing.filter((p) => !selected.has(p.category.categoryId))
  const toCreate = selectedCategoryIds.filter((id) => !existingIds.has(id))

  for (const preference of toDelete) {
    await deletePreference(preference.preferenceId)
  }
  for (const categoryId of toCreate) {
    await createPreference(profileId, categoryId)
  }
}
