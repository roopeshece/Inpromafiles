import type { Metadata } from "next"

import { LegalPage } from "@/components/landing/legal-page"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      paragraphs={[
        "INPROMA stores the account details, investment profile, and portfolio holdings that you enter so that it can calculate your allocation reports.",
        "Your data is used only to provide the features of this application. INPROMA does not sell personal data and does not connect to external brokerage or market data services.",
        "This policy is a placeholder summary for an educational project. The deploying organisation is responsible for publishing a complete privacy policy that reflects its actual data handling practices.",
      ]}
    />
  )
}
