"use client"

import { Cell, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { getCategoryColor } from "@/lib/categories"
import { formatINR, formatPercent } from "@/lib/formatters"
import type { AllocationSlice } from "@/lib/portfolio"

export function AllocationDonut({ slices }: { slices: AllocationSlice[] }) {
  const config = Object.fromEntries(
    slices.map((s) => [s.category, { label: s.category, color: getCategoryColor(s.category) }])
  ) satisfies ChartConfig

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <ChartContainer config={config} className="aspect-square w-44 shrink-0">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => (
                  <div className="flex w-full justify-between gap-4">
                    <span className="text-muted-foreground">{name}</span>
                    <span className="font-medium tabular-nums">{formatINR(value as number)}</span>
                  </div>
                )}
              />
            }
          />
          <Pie data={slices} dataKey="value" nameKey="category" innerRadius={50} outerRadius={80} strokeWidth={2}>
            {slices.map((s) => (
              <Cell key={s.category} fill={getCategoryColor(s.category)} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className="flex w-full flex-1 flex-col gap-2.5 text-sm">
        {slices.map((s) => (
          <li key={s.category} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: getCategoryColor(s.category) }}
            />
            <span className="flex-1 truncate">{s.category}</span>
            <span className="text-muted-foreground tabular-nums">{formatINR(s.value)}</span>
            <span className="w-16 text-right font-medium tabular-nums">{formatPercent(s.percent, { digits: 1 })}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
