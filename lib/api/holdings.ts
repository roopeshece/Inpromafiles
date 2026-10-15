import { apiRequest } from "@/lib/api"
import type { HoldingRequest, PortfolioHolding } from "@/types/holding"

export function listHoldings(userId: number): Promise<PortfolioHolding[]> {
  return apiRequest<PortfolioHolding[]>(`/holdings/user/${userId}`)
}

export function listHoldingsByCategory(
  userId: number,
  categoryId: number
): Promise<PortfolioHolding[]> {
  return apiRequest<PortfolioHolding[]>(
    `/holdings/user/${userId}/category/${categoryId}`
  )
}

export function getHolding(holdingId: number): Promise<PortfolioHolding> {
  return apiRequest<PortfolioHolding>(`/holdings/${holdingId}`)
}

export function createHolding(
  payload: HoldingRequest
): Promise<PortfolioHolding> {
  return apiRequest<PortfolioHolding>("/holdings", {
    method: "POST",
    body: payload,
  })
}

/** The `user` reference is intentionally omitted so a holding cannot be reassigned. */
export function updateHolding(
  holdingId: number,
  payload: Omit<HoldingRequest, "user">
): Promise<PortfolioHolding> {
  return apiRequest<PortfolioHolding>(`/holdings/${holdingId}`, {
    method: "PUT",
    body: payload,
  })
}

export async function deleteHolding(holdingId: number): Promise<void> {
  await apiRequest<void>(`/holdings/${holdingId}`, { method: "DELETE" })
}
