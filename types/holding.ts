import type { CategoryReference } from "./category"

export type Decimal = number | string

export interface PortfolioHolding {
  holdingId: number
  user: { userId: number }
  category: CategoryReference
  assetName: string
  investedAmount: Decimal
  quantity: Decimal
  currentValue: Decimal
  purchaseDate: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface HoldingRequest {
  user?: { userId: number }
  category: { categoryId: number }
  assetName: string
  investedAmount: string
  quantity: string
  currentValue: string
  purchaseDate: string | null
}
