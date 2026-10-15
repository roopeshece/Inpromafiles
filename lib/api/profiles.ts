import { ApiError, apiRequest } from "@/lib/api"
import type {
  InvestmentProfile,
  InvestmentProfileRequest,
} from "@/types/profile"

/** Returns `null` only when the backend confirms no profile exists (HTTP 404). */
export async function getProfileByUser(
  userId: number
): Promise<InvestmentProfile | null> {
  try {
    return await apiRequest<InvestmentProfile>(`/profiles/user/${userId}`)
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null
    throw error
  }
}

export async function createProfile(
  payload: InvestmentProfileRequest
): Promise<InvestmentProfile> {
  return apiRequest<InvestmentProfile>("/profiles", {
    method: "POST",
    body: payload,
  })
}

export async function updateProfile(
  userId: number,
  payload: InvestmentProfileRequest
): Promise<InvestmentProfile> {
  return apiRequest<InvestmentProfile>(`/profiles/user/${userId}`, {
    method: "PUT",
    body: payload,
  })
}

export async function deleteProfile(userId: number): Promise<void> {
  await apiRequest<void>(`/profiles/user/${userId}`, { method: "DELETE" })
}
