import { percentChange, sumCurrency, toNumber } from "@/lib/formatters"
import type { AssetCategory } from "@/types/category"
import type { PortfolioHolding } from "@/types/holding"

export interface PortfolioSummary {
  totalInvested: number
  totalCurrent: number
  gainLoss: number
  gainLossPercent: number | null
  holdingCount: number
}

export function summarizeHoldings(
  holdings: PortfolioHolding[]
): PortfolioSummary {
  const totalInvested = sumCurrency(holdings.map((h) => h.investedAmount))
  const totalCurrent = sumCurrency(holdings.map((h) => h.currentValue))
  const gainLoss = Math.round((totalCurrent - totalInvested) * 100) / 100
  return {
    totalInvested,
    totalCurrent,
    gainLoss,
    gainLossPercent: percentChange(gainLoss, totalInvested),
    holdingCount: holdings.length,
  }
}

export function holdingGainLoss(holding: PortfolioHolding) {
  const invested = toNumber(holding.investedAmount)
  const current = toNumber(holding.currentValue)
  const change = Math.round((current - invested) * 100) / 100
  return { change, percent: percentChange(change, invested) }
}

export function resolveCategoryName(
  holding: PortfolioHolding,
  categories: AssetCategory[] | undefined
): string {
  return (
    holding.category?.categoryName ??
    categories?.find((c) => c.categoryId === holding.category?.categoryId)
      ?.categoryName ??
    "Uncategorised"
  )
}

export interface AllocationSlice {
  category: string
  value: number
  percent: number
}

/** Actual allocation from holdings, for display only. */
export function allocationByCategory(
  holdings: PortfolioHolding[],
  categories: AssetCategory[] | undefined
): AllocationSlice[] {
  const totals = new Map<string, number>()
  for (const holding of holdings) {
    const name = resolveCategoryName(holding, categories)
    totals.set(
      name,
      (totals.get(name) ?? 0) + Math.round(toNumber(holding.currentValue) * 100)
    )
  }
  const totalPaise = [...totals.values()].reduce((a, b) => a + b, 0)
  return [...totals.entries()]
    .map(([category, paise]) => ({
      category,
      value: paise / 100,
      percent: totalPaise > 0 ? (paise / totalPaise) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value)
}

export function holdingTimestamp(holding: PortfolioHolding): number {
  const source = holding.createdAt ?? holding.purchaseDate
  const time = source ? new Date(source).getTime() : NaN
  return Number.isNaN(time) ? holding.holdingId : time
}
