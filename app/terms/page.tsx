import type { Metadata } from "next"

import { LegalPage } from "@/components/landing/legal-page"

export const metadata: Metadata = { title: "Terms of Use" }

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      paragraphs={[
        "INPROMA is an educational tool for organising investment information. It does not provide investment, tax, or legal advice.",
        "Allocation reports are calculated from values you enter and from target allocations configured by an administrator. They do not guarantee any investment outcome.",
        "You are responsible for the accuracy of the information you record and for independently evaluating any financial decision.",
        "These terms are a placeholder summary for an educational project. The deploying organisation is responsible for publishing complete terms.",
      ]}
    />
  )
}
