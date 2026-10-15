"use client"

import useSWR from "swr"

import { getBalancingReport } from "@/lib/api/balancing"
import { listCategories } from "@/lib/api/categories"
import { getHolding, listHoldings } from "@/lib/api/holdings"
import { listPreferences } from "@/lib/api/preferences"
import { getProfileByUser } from "@/lib/api/profiles"
import { listRulesByRisk } from "@/lib/api/rules"
import { listUsers } from "@/lib/api/users"
import type { RiskTolerance } from "@/types/profile"

export const swrKeys = {
  categories: ["categories"] as const,
  users: ["users"] as const,
  profile: (userId: number) => ["profile", userId] as const,
  preferences: (profileId: number) => ["preferences", profileId] as const,
  holdings: (userId: number) => ["holdings", userId] as const,
  holding: (holdingId: number) => ["holding", holdingId] as const,
  balancing: (userId: number) => ["balancing", userId] as const,
  rules: (risk: RiskTolerance) => ["rules", risk] as const,
}

export function useCategories() {
  return useSWR(swrKeys.categories, () => listCategories())
}

export function useUsers() {
  return useSWR(swrKeys.users, () => listUsers())
}

export function useProfile(userId: number | undefined) {
  return useSWR(userId ? swrKeys.profile(userId) : null, () =>
    getProfileByUser(userId as number)
  )
}

export function usePreferences(profileId: number | undefined) {
  return useSWR(profileId ? swrKeys.preferences(profileId) : null, () =>
    listPreferences(profileId as number)
  )
}

export function useHoldings(userId: number | undefined) {
  return useSWR(userId ? swrKeys.holdings(userId) : null, () =>
    listHoldings(userId as number)
  )
}

export function useHolding(holdingId: number | undefined) {
  return useSWR(holdingId ? swrKeys.holding(holdingId) : null, () =>
    getHolding(holdingId as number)
  )
}

/** Only fetches once a profile is confirmed, because the backend errors without one. */
export function useBalancing(userId: number | undefined, enabled: boolean) {
  return useSWR(userId && enabled ? swrKeys.balancing(userId) : null, () =>
    getBalancingReport(userId as number)
  )
}

export function useRules(risk: RiskTolerance) {
  return useSWR(swrKeys.rules(risk), () => listRulesByRisk(risk))
}
