import type { Metadata } from "next"

import NotFound from "@/app/[lang]/not-found"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

export default NotFound
