"use client"

import { useCurrentUser } from "@/components/auth/auth-provider"
import { HoldingForm } from "@/components/portfolio/holding-form"
import { ErrorState } from "@/components/shared/error-state"
import { PageHeader } from "@/components/shared/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { useHolding } from "@/hooks/use-inproma-data"
import { ApiError } from "@/lib/api"

export function EditHoldingView({ holdingId }: { holdingId: number }) {
  const user = useCurrentUser()
  const holding = useHolding(Number.isInteger(holdingId) && holdingId > 0 ? holdingId : undefined)
  const notOwned = holding.data && holding.data.user?.userId !== undefined && holding.data.user.userId !== user.userId

  return (
    <>
      <PageHeader title="Edit Holding" description="Update the details of this recorded asset." />
      {!Number.isInteger(holdingId) || holdingId <= 0 ? (
        <ErrorState error={new Error("This holding link is not valid.")} title="Holding not found" />
      ) : holding.isLoading ? (
        <Skeleton className="h-96 max-w-2xl" />
      ) : holding.error ? (
        <ErrorState
          error={holding.error}
          title={holding.error instanceof ApiError && holding.error.isNotFound ? "Holding not found" : undefined}
          onRetry={() => holding.mutate()}
        />
      ) : notOwned ? (
        <ErrorState error={new Error("You do not have access to this holding.")} title="Access denied" />
      ) : holding.data ? (
        <HoldingForm holding={holding.data} />
      ) : null}
    </>
  )
}
