import type { LucideIcon } from "lucide-react"

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MetricCard({
  label,
  value,
  icon: Icon,
  footnote,
  loading,
}: {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  footnote?: React.ReactNode
  loading?: boolean
}) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardAction>
          <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Icon aria-hidden="true" className="size-4" />
          </span>
        </CardAction>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {loading ? <Skeleton className="h-8 w-32" /> : value}
        </CardTitle>
        {footnote ? (
          <div className="text-xs text-muted-foreground">
            {loading ? <Skeleton className="h-4 w-24" /> : footnote}
          </div>
        ) : null}
      </CardHeader>
    </Card>
  )
}
