import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"

export function LegalPage({
  title,
  paragraphs,
}: {
  title: string
  paragraphs: string[]
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-16 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {paragraphs.map((p) => (
          <p key={p} className="leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
      </main>
      <SiteFooter />
    </>
  )
}
