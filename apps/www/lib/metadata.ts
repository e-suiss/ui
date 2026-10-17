import type { Metadata } from "next"

import { site } from "@/lib/site"

export function pageMetadata({
  path,
  title,
  description,
  image,
}: {
  path: string
  title: string
  description: string
  image: string
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      url: path,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}
