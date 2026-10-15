import { apiRequest } from "@/lib/api"
import type { BalancingReportItem } from "@/types/balancing"

export function getBalancingReport(
  userId: number
): Promise<BalancingReportItem[]> {
  return apiRequest<BalancingReportItem[]>(`/balancing/user/${userId}`)
}
