import Link from "next/link"

import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="32" height="32" rx="8" fill="#14B8A6" />
      <path d="M16 6 A10 10 0 0 1 26 16 L16 16 Z" fill="#042F2E" />
      <path
        d="M16 16 L26 16 A10 10 0 1 1 16 6 Z"
        fill="none"
        stroke="#042F2E"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Logo({
  href = "/",
  className,
  inverted = false,
}: {
  href?: string
  className?: string
  inverted?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-base font-semibold tracking-wide",
            inverted ? "text-sidebar-accent-foreground" : "text-foreground"
          )}
        >
          INPROMA
        </span>
        <span className="sr-only">Investment Profile Management System</span>
      </span>
    </Link>
  )
}
