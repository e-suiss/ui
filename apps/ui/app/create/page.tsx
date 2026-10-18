import type { Metadata } from "next"
import { CreatePage } from "@/components/create/create-page"
import { themeDefaults } from "@/lib/create/theme-defaults"
import { absolute, site } from "@/lib/site"
import { strings } from "@/lib/strings"

export const metadata: Metadata = {
  title: strings.createTitle,
  description: strings.createDescription,
  alternates: { canonical: absolute("/create") },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: absolute("/create"),
    title: strings.createTitle,
    description: strings.createDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: strings.createTitle,
    description: strings.createDescription,
  },
}

export default async function Page() {
  return <CreatePage themeDefaults={await themeDefaults()} />
}
