import { ArrowDown, ArrowUp, Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { BalancingStatus } from "@/types/balancing"

const STATUS = {
  Overweight: {
    icon: ArrowUp,
    className: "border-warning/30 bg-warning/10 text-warning",
  },
  Underweight: {
    icon: ArrowDown,
    className: "border-chart-2/30 bg-chart-2/10 text-chart-2",
  },
  Balanced: {
    icon: Check,
    className: "border-success/30 bg-success/10 text-success",
  },
} as const

export const STATUS_DESCRIPTIONS: Record<BalancingStatus, string> = {
  Overweight:
    "The current allocation exceeds the configured target for this category.",
  Underweight:
    "The current allocation is below the configured target for this category.",
  Balanced: "The current allocation matches the configured target.",
}

export function StatusBadge({ status }: { status: BalancingStatus }) {
  const config = STATUS[status] ?? STATUS.Balanced
  const Icon = config.icon
  return (
    <Badge variant="outline" className={cn("gap-1", config.className)}>
      <Icon aria-hidden="true" />
      {status}
    </Badge>
  )
}

export function ChangeValue({
  value,
  children,
}: {
  value: number
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "tabular-nums",
        value > 0 && "text-success",
        value < 0 && "text-destructive"
      )}
    >
      {children}
    </span>
  )
}
