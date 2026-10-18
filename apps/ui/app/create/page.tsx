import type { Metadata } from "next"
import { CreatePage } from "@/components/create/create-page"
import { themeDefaults } from "@/lib/create/theme-defaults"
import { absolute } from "@/lib/site"
import { strings } from "@/lib/strings"

export const metadata: Metadata = {
  title: strings.createTitle,
  description: strings.createDescription,
  alternates: { canonical: absolute("/create") },
}

export default async function Page() {
  return <CreatePage themeDefaults={await themeDefaults()} />
}
