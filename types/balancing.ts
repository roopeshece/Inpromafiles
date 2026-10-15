import type { Decimal } from "./holding"

export type BalancingStatus = "Overweight" | "Underweight" | "Balanced"

export interface BalancingReportItem {
  category: string
  recommendedPercentage: Decimal
  actualPercentage: Decimal
  difference: Decimal
  status: BalancingStatus
  actualValue: Decimal
}
