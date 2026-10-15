import type { Metadata } from "next"

import { HoldingForm } from "@/components/portfolio/holding-form"
import { PageHeader } from "@/components/shared/page-header"

export const metadata: Metadata = { title: "Add Holding" }

export default function NewHoldingPage() {
  return (
    <>
      <PageHeader title="Add Holding" description="Record an asset you hold. All amounts are in Indian Rupees." />
      <HoldingForm />
    </>
  )
}
