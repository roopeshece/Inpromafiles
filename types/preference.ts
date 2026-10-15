import type { CategoryReference } from "./category"

export interface ProfileAssetPreference {
  preferenceId: number
  profile: { profileId: number }
  category: CategoryReference
}

export interface PreferenceRequest {
  profile: { profileId: number }
  category: { categoryId: number }
}
