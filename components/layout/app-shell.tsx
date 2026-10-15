"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut, Menu, Settings } from "lucide-react"
import { toast } from "sonner"

import { useAuth, useCurrentUser } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/auth/require-auth"
import { Logo } from "@/components/brand/logo"
import { isActive, NAV_ITEMS } from "@/components/layout/nav-config"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getErrorMessage } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/user"

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  )
}

function useSignOut() {
  const { logout } = useAuth()
  const router = useRouter()
  return async () => {
    try {
      await logout()
      toast.success("You have been signed out.")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      router.replace("/login")
    }
  }
}

function SidebarNav({
  role,
  onNavigate,
}: {
  role: UserRole
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const signOut = useSignOut()
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar px-4 py-5 text-sidebar-foreground">
      <div className="px-2">
        <Logo href={role === "Admin" ? "/admin" : "/dashboard"} inverted />
        <p className="mt-2 text-xs text-sidebar-muted">
          {role === "Admin" ? "Administration" : "Investor workspace"}
        </p>
      </div>
      <nav aria-label="Main" className="flex-1">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS[role].map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    aria-hidden="true"
                    className={cn("size-4", active && "text-sidebar-primary")}
                  />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {role === "Admin" ? (
        <button
          type="button"
          onClick={signOut}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-muted outline-none transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Sign Out
        </button>
      ) : null}
    </div>
  )
}

function UserMenu({ role }: { role: UserRole }) {
  const user = useCurrentUser()
  const signOut = useSignOut()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-2">
          <Avatar className="size-8">
            <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-40 truncate text-sm font-medium sm:inline">
            {user.name}
          </span>
          <span className="sr-only">Open account menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate">{user.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={role === "Admin" ? "/admin/settings" : "/settings"}>
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={signOut}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Header({ role }: { role: UserRole }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const current = NAV_ITEMS[role].find((item) => isActive(pathname, item.href))
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-sidebar-border p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>INPROMA main navigation</SheetDescription>
          </SheetHeader>
          <SidebarNav role={role} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        <span className="hidden text-muted-foreground sm:inline">
          {role === "Admin" ? "Admin" : "Workspace"}
        </span>
        <span className="hidden text-muted-foreground sm:inline" aria-hidden="true">
          /
        </span>
        <span className="truncate font-medium">{current?.label ?? "INPROMA"}</span>
      </div>
      {role === "Admin" ? (
        <Badge variant="secondary" className="hidden sm:inline-flex">
          Administrator
        </Badge>
      ) : null}
      <ThemeToggle />
      <UserMenu role={role} />
    </header>
  )
}

export function AppShell({
  role,
  children,
}: {
  role: UserRole
  children: React.ReactNode
}) {
  return (
    <RequireAuth role={role}>
      <div className="flex min-h-svh bg-background">
        <aside className="sticky top-0 hidden h-svh w-64 shrink-0 border-r border-sidebar-border lg:block">
          <SidebarNav role={role} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <Header role={role} />
          <main
            id="main-content"
            className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-8 md:py-8"
          >
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}
