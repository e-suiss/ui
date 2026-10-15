import type { MetadataRoute } from "next"

import { contentDates } from "@/lib/dates"
import { absolute } from "@/lib/site"
import { source } from "@/lib/source"

function priorityOf(depth: number) {
  if (depth === 0) return 0.9
  if (depth === 1) return 0.8
  return 0.6
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages().map((page) => {
    const depth = page.slugs.length
    return {
      url: absolute(page.url),
      lastModified: contentDates(page.path).modified,
      changeFrequency: "weekly" as const,
      priority: priorityOf(depth),
    }
  })
  return [
    { url: absolute("/"), changeFrequency: "weekly", priority: 1 },
    ...pages,
  ]
}
