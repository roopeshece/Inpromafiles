import {
  CircleHelp,
  Layers,
  LayoutDashboard,
  ListChecks,
  Scale,
  Settings,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import type { UserRole } from "@/types/user"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  Investor: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Investment Profile", href: "/profile", icon: UserRound },
    { label: "My Portfolio", href: "/portfolio", icon: Wallet },
    { label: "Portfolio Balancing", href: "/balancing", icon: Scale },
    { label: "Asset Categories", href: "/asset-categories", icon: Layers },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Help", href: "/help", icon: CircleHelp },
  ],
  Admin: [
    { label: "Admin Overview", href: "/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Asset Categories", href: "/admin/categories", icon: Layers },
    { label: "Portfolio Rules", href: "/admin/rules", icon: ListChecks },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
  ],
}

export function isActive(pathname: string, href: string) {
  if (href === "/dashboard" || href === "/admin") return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}
