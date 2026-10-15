import {
  Features,
  Hero,
  HowItWorks,
  Trust,
} from "@/components/landing/landing-sections"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Trust />
      </main>
      <SiteFooter />
    </>
  )
}
