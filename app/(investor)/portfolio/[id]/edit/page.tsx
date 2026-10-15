import type { Metadata } from "next"

import { EditHoldingView } from "@/components/portfolio/edit-holding-view"

export const metadata: Metadata = { title: "Edit Holding" }

export default async function EditHoldingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditHoldingView holdingId={Number(id)} />
}
