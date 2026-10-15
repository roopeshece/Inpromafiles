import { CheckCircle2 } from "lucide-react"

import { Logo } from "@/components/brand/logo"

const POINTS = [
  "Record your investment profile and risk tolerance",
  "Track holdings across six asset categories",
  "Compare actual allocation with configured targets",
]

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-brand p-10 text-brand-foreground lg:flex">
        <Logo inverted />
        <div className="flex max-w-md flex-col gap-6">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            A structured workspace for your investment picture.
          </h2>
          <p className="opacity-75 text-pretty">
            INPROMA helps you document your goals, organise your holdings, and
            understand how your allocation compares with your risk profile.
          </p>
          <ul className="flex flex-col gap-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm">
                <CheckCircle2
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs opacity-60">
          Educational tool. Not investment advice.
        </p>
      </aside>
      <main className="flex flex-col items-center justify-center gap-8 px-4 py-12">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
