"use client"

import Link from "next/link"
import {
  ArrowRight,
  Coins,
  Layers,
  PiggyBank,
  Plus,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react"

import { useCurrentUser } from "@/components/auth/auth-provider"
import { AllocationDonut } from "@/components/portfolio/allocation-donut"
import { CategoryLabel } from "@/components/shared/category-label"
import { ErrorState } from "@/components/shared/error-state"
import { MetricCard } from "@/components/shared/metric-card"
import { PageHeader } from "@/components/shared/page-header"
import { ChangeValue, StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useBalancing,
  useCategories,
  useHoldings,
  useProfile,
} from "@/hooks/use-inproma-data"
import {
  EMPLOYMENT_LABELS,
  formatINR,
  formatPercent,
  formatSignedINR,
  toNumber,
} from "@/lib/formatters"
import {
  allocationByCategory,
  holdingGainLoss,
  holdingTimestamp,
  resolveCategoryName,
  summarizeHoldings,
} from "@/lib/portfolio"

export function InvestorDashboard() {
  const user = useCurrentUser()
  const profile = useProfile(user.userId)
  const holdings = useHoldings(user.userId)
  const categories = useCategories()
  const hasProfile = !!profile.data
  const hasHoldings = (holdings.data?.length ?? 0) > 0
  const balancing = useBalancing(user.userId, hasProfile && hasHoldings)

  const summary = summarizeHoldings(holdings.data ?? [])
  const slices = allocationByCategory(holdings.data ?? [], categories.data)
  const recent = [...(holdings.data ?? [])]
    .sort((a, b) => holdingTimestamp(b) - holdingTimestamp(a))
    .slice(0, 5)
  const firstName = user.name.split(" ")[0]

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="A summary of your investment profile and recorded holdings."
        actions={
          <Button asChild>
            <Link href="/portfolio/new">
              <Plus data-icon="inline-start" />
              Add Holding
            </Link>
          </Button>
        }
      />

      {!profile.isLoading && !profile.error && !hasProfile ? (
        <Card className="border-primary/30 bg-accent/40">
          <CardHeader>
            <CardTitle>Complete your investment profile</CardTitle>
            <CardDescription>
              Your risk tolerance determines which target allocation is used
              for your balancing report.
            </CardDescription>
            <CardAction>
              <Button asChild size="sm">
                <Link href="/profile">Set up profile</Link>
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
      ) : null}

      {holdings.error ? (
        <ErrorState error={holdings.error} onRetry={() => holdings.mutate()} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Invested" icon={PiggyBank} loading={holdings.isLoading} value={formatINR(summary.totalInvested)} />
          <MetricCard label="Current Value" icon={Wallet} loading={holdings.isLoading} value={formatINR(summary.totalCurrent)} />
          <MetricCard
            label="Gain / Loss"
            icon={TrendingUp}
            loading={holdings.isLoading}
            value={<ChangeValue value={summary.gainLoss}>{formatSignedINR(summary.gainLoss)}</ChangeValue>}
            footnote={
              summary.gainLossPercent === null
                ? "No invested amount recorded"
                : <ChangeValue value={summary.gainLoss}>{formatPercent(summary.gainLossPercent, { signed: true })} overall</ChangeValue>
            }
          />
          <MetricCard
            label="Holdings"
            icon={Coins}
            loading={holdings.isLoading}
            value={summary.holdingCount}
            footnote={`Across ${slices.length} ${slices.length === 1 ? "category" : "categories"}`}
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Current allocation</CardTitle>
            <CardDescription>Share of current value by asset category.</CardDescription>
          </CardHeader>
          <CardContent>
            {holdings.isLoading ? (
              <Skeleton className="h-44 w-full" />
            ) : slices.length > 0 && summary.totalCurrent > 0 ? (
              <AllocationDonut slices={slices} />
            ) : (
              <NoHoldings />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Investment profile</CardTitle>
            <CardDescription>Your recorded preferences.</CardDescription>
            <CardAction>
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile">
                  {hasProfile ? "Edit" : "Create"}
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {profile.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : profile.error ? (
              <ErrorState error={profile.error} onRetry={() => profile.mutate()} />
            ) : profile.data ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <ProfileItem label="Risk tolerance" value={<Badge variant="secondary">{profile.data.riskTolerance}</Badge>} />
                <ProfileItem label="Duration" value={`${profile.data.investmentDuration} years`} />
                <ProfileItem label="Goal" value={profile.data.investmentGoal} />
                <ProfileItem
                  label="Employment"
                  value={profile.data.employmentStatus ? EMPLOYMENT_LABELS[profile.data.employmentStatus] : "Not set"}
                />
                <ProfileItem label="Experience" value={profile.data.investmentExperience ?? "Not set"} />
                <ProfileItem label="Crypto investor" value={profile.data.cryptoInvestor ?? "Not set"} />
              </dl>
            ) : (
              <Empty className="p-6">
                <EmptyHeader>
                  <EmptyMedia variant="icon"><UserRound /></EmptyMedia>
                  <EmptyTitle>No profile yet</EmptyTitle>
                  <EmptyDescription>Record your goals and risk tolerance.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent holdings</CardTitle>
            <CardDescription>Your most recently recorded assets.</CardDescription>
            <CardAction>
              <Button asChild variant="ghost" size="sm">
                <Link href="/portfolio">
                  View all
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {holdings.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : recent.length === 0 ? (
              <NoHoldings />
            ) : (
              <ul className="flex flex-col divide-y">
                {recent.map((h) => {
                  const { change } = holdingGainLoss(h)
                  return (
                    <li key={h.holdingId} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="truncate font-medium">{h.assetName}</span>
                        <span className="text-xs text-muted-foreground">
                          <CategoryLabel name={resolveCategoryName(h, categories.data)} />
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-sm">
                        <span className="font-medium tabular-nums">{formatINR(h.currentValue)}</span>
                        <span className="text-xs">
                          <ChangeValue value={change}>{formatSignedINR(change)}</ChangeValue>
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Balancing summary</CardTitle>
            <CardDescription>Actual vs target allocation.</CardDescription>
            <CardAction>
              <Button asChild variant="ghost" size="sm">
                <Link href="/balancing">
                  Report
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {!hasProfile || !hasHoldings ? (
              <p className="text-sm text-muted-foreground">
                {!hasProfile
                  ? "Create your investment profile to see a balancing summary."
                  : "Add holdings to see a balancing summary."}
              </p>
            ) : balancing.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : balancing.error ? (
              <ErrorState error={balancing.error} onRetry={() => balancing.mutate()} />
            ) : (balancing.data?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">
                No target allocation rules are configured for your risk tolerance.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {balancing.data?.map((item) => (
                  <li key={item.category} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">{item.category}</span>
                    <span className="flex items-center gap-3">
                      <span className="text-muted-foreground tabular-nums">
                        {formatPercent(toNumber(item.difference), { signed: true })}
                      </span>
                      <StatusBadge status={item.status} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function ProfileItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  )
}

function NoHoldings() {
  return (
    <Empty className="p-6">
      <EmptyHeader>
        <EmptyMedia variant="icon"><Layers /></EmptyMedia>
        <EmptyTitle>No holdings yet</EmptyTitle>
        <EmptyDescription>Record your first asset to see your allocation.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild size="sm">
          <Link href="/portfolio/new">Add Holding</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
