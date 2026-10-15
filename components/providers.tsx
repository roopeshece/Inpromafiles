"use client"

import { SWRConfig } from "swr"

import { AuthProvider } from "@/components/auth/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ApiError } from "@/lib/api"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
            if (error instanceof ApiError && error.status >= 400 && error.status < 500) return
            if (retryCount >= 2) return
            setTimeout(() => revalidate({ retryCount }), 2000 * (retryCount + 1))
          },
        }}
      >
        <TooltipProvider>
          <AuthProvider>{children}</AuthProvider>
        </TooltipProvider>
        <Toaster richColors closeButton />
      </SWRConfig>
    </ThemeProvider>
  )
}
