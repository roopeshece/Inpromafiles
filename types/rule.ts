import type { CategoryReference } from "./category"
import type { Decimal } from "./holding"
import type { RiskTolerance } from "./profile"

export interface PortfolioRule {
  ruleId: number
  riskTolerance: RiskTolerance
  category: CategoryReference
  recommendedPercentage: Decimal
}

export interface RuleRequest {
  riskTolerance: RiskTolerance
  category: { categoryId: number }
  recommendedPercentage: string
}
