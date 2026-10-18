import type { Metadata } from "next"
import { CreateFrame } from "@/components/create/frame"

export const metadata: Metadata = { robots: { index: false } }

export default function Page() {
  return <CreateFrame />
}
