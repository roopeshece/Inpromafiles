"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { KeyRound, RefreshCw, ShieldAlert, WifiOff } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { LogoMark } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { API_BASE_URL } from "@/lib/api"
import { AUTH_ENDPOINTS } from "@/lib/api/auth"
import type { UserRole } from "@/types/user"

export function homeForRole(role: UserRole) {
  return role === "Admin" ? "/admin" : "/dashboard"
}

function FullScreen({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      {children}
    </main>
  )
}

export function AuthNotImplemented() {
  return (
    <Empty className="max-w-lg border bg-card">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <KeyRound />
        </EmptyMedia>
        <EmptyTitle>Authentication service not available</EmptyTitle>
        <EmptyDescription>
          The backend at <code className="font-mono">{API_BASE_URL}</code> does
          not yet expose{" "}
          <code className="font-mono">{AUTH_ENDPOINTS.me}</code>. Secure sign-in
          must be implemented in Spring Boot before private pages can be
          accessed. See BACKEND_REQUIREMENTS.md in the repository.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export function RequireAuth({
  role,
  children,
}: {
  role: UserRole
  children: React.ReactNode
}) {
  const { status, user, refresh, error } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [status, router, pathname])

  if (status === "loading" || status === "unauthenticated") {
    return (
      <FullScreen>
        <div
          className="flex flex-col items-center gap-3 text-muted-foreground"
          role="status"
        >
          <LogoMark />
          <Spinner />
          <span className="text-sm">Checking your session</span>
        </div>
      </FullScreen>
    )
  }

  if (status === "not-implemented") {
    return (
      <FullScreen>
        <AuthNotImplemented />
      </FullScreen>
    )
  }

  if (status === "unavailable") {
    return (
      <FullScreen>
        <Empty className="max-w-lg border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <WifiOff />
            </EmptyMedia>
            <EmptyTitle>Unable to verify your session</EmptyTitle>
            <EmptyDescription>
              {error?.message ?? "The INPROMA server could not be reached."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => refresh()}>
              <RefreshCw data-icon="inline-start" />
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      </FullScreen>
    )
  }

  if (user && user.role !== role) {
    return (
      <FullScreen>
        <Empty className="max-w-lg border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldAlert />
            </EmptyMedia>
            <EmptyTitle>Access restricted</EmptyTitle>
            <EmptyDescription>
              Your account does not have permission to view this area.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href={homeForRole(user.role)}>Go to your workspace</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </FullScreen>
    )
  }

  return <>{children}</>
}
