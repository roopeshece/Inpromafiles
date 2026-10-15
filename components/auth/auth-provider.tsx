"use client"

import { createContext, useCallback, useContext, useMemo } from "react"
import useSWR, { useSWRConfig } from "swr"

import { ApiError } from "@/lib/api"
import * as authApi from "@/lib/api/auth"
import type { User } from "@/types/user"

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "unavailable"
  | "not-implemented"

interface AuthContextValue {
  user: User | null
  status: AuthStatus
  error: ApiError | null
  refresh: () => Promise<unknown>
  login: (credentials: { email: string; password: string }) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const ME_KEY = ["auth", "me"] as const

async function fetchSession(): Promise<User | null> {
  try {
    return await authApi.getCurrentUser()
  } catch (error) {
    if (error instanceof ApiError && (error.isUnauthorized || error.isForbidden)) {
      return null
    }
    throw error
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { mutate: globalMutate } = useSWRConfig()
  const { data, error, isLoading, mutate } = useSWR(ME_KEY, fetchSession, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  })

  const apiError = error instanceof ApiError ? error : null

  let status: AuthStatus
  if (isLoading) status = "loading"
  else if (apiError?.isNotFound) status = "not-implemented"
  else if (error) status = "unavailable"
  else if (data) status = "authenticated"
  else status = "unauthenticated"

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const user = await authApi.login(credentials)
      await mutate(user, { revalidate: false })
      return user
    },
    [mutate]
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      await globalMutate(() => true, undefined, { revalidate: false })
      await mutate(null, { revalidate: false })
    }
  }, [globalMutate, mutate])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data ?? null,
      status,
      error: apiError,
      refresh: () => mutate(),
      login,
      logout,
    }),
    [data, status, apiError, mutate, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

/** Narrowed hook for pages already wrapped by RequireAuth. */
export function useCurrentUser(): User {
  const { user } = useAuth()
  if (!user) throw new Error("useCurrentUser requires an authenticated user")
  return user
}
