import { apiRequest } from "@/lib/api"
import type { RiskTolerance } from "@/types/profile"
import type { PortfolioRule, RuleRequest } from "@/types/rule"

export function listRulesByRisk(
  riskTolerance: RiskTolerance
): Promise<PortfolioRule[]> {
  return apiRequest<PortfolioRule[]>(`/rules/risk/${riskTolerance}`)
}

export function getRule(ruleId: number): Promise<PortfolioRule> {
  return apiRequest<PortfolioRule>(`/rules/${ruleId}`)
}

export function createRule(payload: RuleRequest): Promise<PortfolioRule> {
  return apiRequest<PortfolioRule>("/rules", { method: "POST", body: payload })
}

export function updateRule(
  ruleId: number,
  payload: RuleRequest
): Promise<PortfolioRule> {
  return apiRequest<PortfolioRule>(`/rules/${ruleId}`, {
    method: "PUT",
    body: payload,
  })
}

export async function deleteRule(ruleId: number): Promise<void> {
  await apiRequest<void>(`/rules/${ruleId}`, { method: "DELETE" })
}
