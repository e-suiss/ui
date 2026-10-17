import type { Metadata } from "next"
import { CreatePage } from "@/components/create/create-page"
import { absolute } from "@/lib/site"
import { strings } from "@/lib/strings"

export const metadata: Metadata = {
  title: strings.createTitle,
  description: strings.createDescription,
  alternates: { canonical: absolute("/create") },
}

export default function Page() {
  return <CreatePage />
}
