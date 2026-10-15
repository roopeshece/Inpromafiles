"use client"

import { Cell, Pie, PieChart } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { getCategoryColor } from "@/lib/categories"

const SAMPLE = [
  { category: "Stocks", percent: 40, target: 35 },
  { category: "Bonds", percent: 22, target: 25 },
  { category: "Mutual Funds", percent: 18, target: 20 },
  { category: "Gold", percent: 10, target: 10 },
  { category: "Cash", percent: 10, target: 10 },
]

const chartConfig = Object.fromEntries(
  SAMPLE.map((s) => [s.category, { label: s.category, color: getCategoryColor(s.category) }])
) satisfies ChartConfig

export function SampleDashboardPreview() {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm">Allocation overview</CardTitle>
        <Badge variant="secondary">Illustrative sample</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-square w-32 shrink-0"
            aria-hidden="true"
          >
            <PieChart>
              <Pie
                data={SAMPLE}
                dataKey="percent"
                nameKey="category"
                innerRadius={36}
                outerRadius={60}
                strokeWidth={2}
                isAnimationActive={false}
              >
                {SAMPLE.map((s) => (
                  <Cell key={s.category} fill={getCategoryColor(s.category)} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <ul className="flex flex-1 flex-col gap-2 text-sm">
            {SAMPLE.map((s) => (
              <li key={s.category} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: getCategoryColor(s.category) }}
                />
                <span className="flex-1 truncate text-muted-foreground">
                  {s.category}
                </span>
                <span className="font-medium tabular-nums">{s.percent}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-muted-foreground">
            Actual vs target
          </p>
          {SAMPLE.slice(0, 3).map((s) => (
            <div key={s.category} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span>{s.category}</span>
                <span className="tabular-nums text-muted-foreground">
                  {s.percent}% / {s.target}%
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${s.percent}%`,
                    backgroundColor: getCategoryColor(s.category),
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute -top-0.5 h-3 w-0.5 rounded bg-foreground"
                  style={{ left: `${s.target}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Sample data for illustration only. Not a real user or live market data.
        </p>
      </CardContent>
    </Card>
  )
}
