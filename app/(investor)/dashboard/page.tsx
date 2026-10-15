import type { Metadata } from "next"

import { InvestorDashboard } from "@/components/dashboard/investor-dashboard"

export const metadata: Metadata = { title: "Overview" }

export default function DashboardPage() {
  return <InvestorDashboard />
}
