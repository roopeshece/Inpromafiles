"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { MoreHorizontal, Pencil, Plus, Trash2, Wallet } from "lucide-react"
import { useSWRConfig } from "swr"

import { useCurrentUser } from "@/components/auth/auth-provider"
import { CategoryLabel } from "@/components/shared/category-label"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { ErrorState } from "@/components/shared/error-state"
import { PageHeader } from "@/components/shared/page-header"
import { ChangeValue } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCategories, useHoldings } from "@/hooks/use-inproma-data"
import { deleteHolding } from "@/lib/api/holdings"
import {
  formatDate,
  formatINR,
  formatPercent,
  formatQuantity,
  formatSignedINR,
} from "@/lib/formatters"
import {
  holdingGainLoss,
  resolveCategoryName,
  summarizeHoldings,
} from "@/lib/portfolio"
import type { PortfolioHolding } from "@/types/holding"

export function PortfolioView() {
  const user = useCurrentUser()
  const holdings = useHoldings(user.userId)
  const categories = useCategories()
  const { mutate } = useSWRConfig()
  const [filter, setFilter] = useState("all")
  const [pendingDelete, setPendingDelete] = useState<PortfolioHolding | null>(null)

  const visible = useMemo(
    () =>
      (holdings.data ?? []).filter(
        (h) => filter === "all" || String(h.category?.categoryId) === filter
      ),
    [holdings.data, filter]
  )
  const summary = summarizeHoldings(visible)

  return (
    <>
      <PageHeader
        title="My Portfolio"
        description="Holdings you have recorded. Values reflect what you entered, not live market prices."
        actions={
          <Button asChild>
            <Link href="/portfolio/new">
              <Plus data-icon="inline-start" />
              Add Holding
            </Link>
          </Button>
        }
      />

      {holdings.error ? (
        <ErrorState error={holdings.error} onRetry={() => holdings.mutate()} />
      ) : holdings.isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : (holdings.data?.length ?? 0) === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Wallet /></EmptyMedia>
            <EmptyTitle>No holdings recorded</EmptyTitle>
            <EmptyDescription>Add stocks, bonds, funds, gold, crypto, or cash you hold.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/portfolio/new">Add your first holding</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <Card className="py-0">
          <CardContent className="flex flex-col gap-0 px-0">
            <div className="flex items-center justify-between gap-4 border-b p-4">
              <p className="text-sm text-muted-foreground">
                {visible.length} {visible.length === 1 ? "holding" : "holdings"}
              </p>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48" aria-label="Filter by category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.data?.map((c) => (
                      <SelectItem key={c.categoryId} value={String(c.categoryId)}>{c.categoryName}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Asset</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Invested</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Gain / Loss</TableHead>
                  <TableHead>Purchased</TableHead>
                  <TableHead className="w-12 pr-4"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((h) => {
                  const { change, percent } = holdingGainLoss(h)
                  return (
                    <TableRow key={h.holdingId}>
                      <TableCell className="pl-4 font-medium">{h.assetName}</TableCell>
                      <TableCell><CategoryLabel name={resolveCategoryName(h, categories.data)} /></TableCell>
                      <TableCell className="text-right tabular-nums">{formatQuantity(h.quantity)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatINR(h.investedAmount)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatINR(h.currentValue)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <ChangeValue value={change}>{formatSignedINR(change)}</ChangeValue>
                          <span className="text-xs text-muted-foreground tabular-nums">{formatPercent(percent, { signed: true })}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(h.purchaseDate)}</TableCell>
                      <TableCell className="pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal />
                              <span className="sr-only">Actions for {h.assetName}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem asChild>
                                <Link href={`/portfolio/${h.holdingId}/edit`}>
                                  <Pencil />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="destructive" onSelect={() => setPendingDelete(h)}>
                                <Trash2 />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="pl-4" colSpan={3}>Total</TableCell>
                  <TableCell className="text-right tabular-nums">{formatINR(summary.totalInvested)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatINR(summary.totalCurrent)}</TableCell>
                  <TableCell className="text-right">
                    <ChangeValue value={summary.gainLoss}>{formatSignedINR(summary.gainLoss)}</ChangeValue>
                  </TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete holding?"
        description={`"${pendingDelete?.assetName ?? ""}" will be permanently removed from your portfolio.`}
        successMessage="Holding deleted."
        onConfirm={async () => {
          if (!pendingDelete) return
          await deleteHolding(pendingDelete.holdingId)
          await mutate((key) => Array.isArray(key) && ["holdings", "balancing"].includes(key[0]))
        }}
      />
    </>
  )
}
