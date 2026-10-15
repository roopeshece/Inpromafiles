import {
  Banknote,
  Bitcoin,
  Building2,
  Coins,
  Landmark,
  Layers,
  PieChart,
  type LucideIcon,
} from "lucide-react"

const KNOWN_CATEGORIES: Record<string, { color: string; icon: LucideIcon }> = {
  stocks: { color: "var(--chart-1)", icon: Building2 },
  bonds: { color: "var(--chart-2)", icon: Landmark },
  "mutual funds": { color: "var(--chart-3)", icon: PieChart },
  gold: { color: "var(--chart-4)", icon: Coins },
  cryptocurrency: { color: "var(--chart-5)", icon: Bitcoin },
  cash: { color: "var(--chart-6)", icon: Banknote },
}

const FALLBACK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
]

function hash(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function getCategoryColor(name: string | undefined): string {
  const key = (name ?? "").trim().toLowerCase()
  return (
    KNOWN_CATEGORIES[key]?.color ??
    FALLBACK_COLORS[hash(key) % FALLBACK_COLORS.length]
  )
}

export function getCategoryIcon(name: string | undefined): LucideIcon {
  const key = (name ?? "").trim().toLowerCase()
  return KNOWN_CATEGORIES[key]?.icon ?? Layers
}
