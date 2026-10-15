"use client"

import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ApiError, getErrorMessage } from "@/lib/api"

export function ErrorState({
  error,
  title,
  onRetry,
}: {
  error: unknown
  title?: string
  onRetry?: () => void
}) {
  const isNetwork = error instanceof ApiError && error.isNetworkError
  const Icon = isNetwork ? WifiOff : AlertTriangle
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>
          {title ?? (isNetwork ? "Server unavailable" : "Something went wrong")}
        </EmptyTitle>
        <EmptyDescription>{getErrorMessage(error)}</EmptyDescription>
      </EmptyHeader>
      {onRetry ? (
        <EmptyContent>
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw data-icon="inline-start" />
            Try again
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
