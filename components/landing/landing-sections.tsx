import Link from "next/link"
import {
  BarChart3,
  ClipboardList,
  Lightbulb,
  ShieldCheck,
  Wallet,
} from "lucide-react"

import { SampleDashboardPreview } from "@/components/landing/sample-dashboard-preview"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Hero() {
  return (
    <section className="border-b bg-gradient-to-b from-accent/40 to-background">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-medium text-primary">
            Investment Profile Management System
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Build a Clearer Picture of Your Investments.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground text-pretty">
            Understand your investment profile, organize your holdings, and
            evaluate your portfolio allocation in one structured workspace.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/register">Create Your Profile</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#how-it-works">Explore How It Works</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <SampleDashboardPreview />
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Investment Profile",
    body: "Document financial goals, time horizon, risk tolerance, and investment preferences.",
  },
  {
    icon: Wallet,
    title: "Portfolio Tracking",
    body: "Organize holdings and record invested amounts, quantities, and current values.",
  },
  {
    icon: BarChart3,
    title: "Allocation Analysis",
    body: "Compare current asset allocation with configured target percentages.",
  },
  {
    icon: Lightbulb,
    title: "Structured Insights",
    body: "Understand overweight and underweight categories using transparent, rule-based calculations.",
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-16 py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:px-6">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Everything you need to understand your allocation
          </h2>
          <p className="text-muted-foreground text-pretty">
            INPROMA brings your profile, holdings, and target allocations into a
            single consistent view.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <feature.icon aria-hidden="true" className="size-5" />
                </span>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.body}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  "Create an account.",
  "Complete your investment profile.",
  "Record your portfolio holdings.",
  "Review your allocation report.",
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-y bg-card py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step} className="flex flex-col gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground tabular-nums">
                {index + 1}
              </span>
              <p className="font-medium">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const TRUST = [
  "Recommendations are based on configured portfolio allocation rules.",
  "Portfolio percentages depend on the values you enter.",
  "The platform does not guarantee investment performance.",
  "You should independently evaluate every financial decision.",
]

export function Trust() {
  return (
    <section id="about" className="scroll-mt-16 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Transparent by design
          </h2>
          <p className="text-muted-foreground text-pretty">
            INPROMA is an educational portfolio organisation tool. Every figure
            it shows is calculated from your own records and from allocation
            rules configured by an administrator. It does not connect to live
            market data.
          </p>
        </div>
        <ul className="flex flex-col gap-4">
          {TRUST.map((item) => (
            <li key={item} className="flex gap-3">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-primary"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
