import Link from "next/link"

import { Logo } from "@/components/brand/logo"

export function SiteFooter() {
  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <Logo inverted />
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/#features" className="opacity-80 hover:opacity-100">
              Features
            </Link>
            <Link href="/#about" className="opacity-80 hover:opacity-100">
              About
            </Link>
            <Link href="/privacy" className="opacity-80 hover:opacity-100">
              Privacy Policy
            </Link>
            <Link href="/terms" className="opacity-80 hover:opacity-100">
              Terms of Use
            </Link>
          </nav>
        </div>
        <p className="max-w-3xl text-xs leading-relaxed opacity-70">
          Educational disclaimer: INPROMA is provided for educational and
          organisational purposes only. It does not provide investment, tax, or
          legal advice, and it does not guarantee investment outcomes. Consider
          consulting a qualified professional before making financial decisions.
        </p>
        <p className="text-xs opacity-60">
          {"© "}
          {new Date().getFullYear()} INPROMA. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
