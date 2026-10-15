import type { Decimal } from "@/types/holding"

export const PLACEHOLDER = "\u2014"

/** Converts a JSON number or BigDecimal string into a finite number. */
export function toNumber(value: Decimal | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Sums in integer paise to avoid floating-point drift on 2dp currency. */
export function sumCurrency(values: Decimal[]): number {
  const paise = values.reduce<number>(
    (total, value) => total + Math.round(toNumber(value) * 100),
    0
  )
  return paise / 100
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const inrCompactFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
})

const quantityFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 4,
})

export function formatINR(value: Decimal | null | undefined): string {
  return inrFormatter.format(toNumber(value))
}

export function formatINRCompact(value: Decimal | null | undefined): string {
  return inrCompactFormatter.format(toNumber(value))
}

export function formatSignedINR(value: number): string {
  if (value === 0) return inrFormatter.format(0)
  return `${value > 0 ? "+" : "\u2212"}${inrFormatter.format(Math.abs(value))}`
}

export function formatQuantity(value: Decimal | null | undefined): string {
  return quantityFormatter.format(toNumber(value))
}

export function formatPercent(
  value: number | null | undefined,
  options: { signed?: boolean; digits?: number } = {}
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return PLACEHOLDER
  }
  const digits = options.digits ?? 2
  const formatted = Math.abs(value).toFixed(digits)
  if (!options.signed) return `${value < 0 ? "\u2212" : ""}${formatted}%`
  if (value === 0) return `${formatted}%`
  return `${value > 0 ? "+" : "\u2212"}${formatted}%`
}

/** Returns a percentage change, or null when the base is not positive. */
export function percentChange(change: number, base: number): number | null {
  if (!(base > 0)) return null
  return (change / base) * 100
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

export function formatDate(value: string | null | undefined): string {
  if (!value) return PLACEHOLDER
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value)
  if (Number.isNaN(date.getTime())) return PLACEHOLDER
  return dateFormatter.format(date)
}

export const EMPLOYMENT_LABELS = {
  Student: "Student",
  Employed: "Employed",
  Self_Employed: "Self-Employed",
  Unemployed: "Unemployed",
  Retired: "Retired",
  Other: "Other",
} as const
