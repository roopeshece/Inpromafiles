import { AppShell } from "@/components/layout/app-shell"

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell role="Investor">{children}</AppShell>
}
