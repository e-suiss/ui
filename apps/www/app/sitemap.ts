import { execFileSync } from "node:child_process"
import type { MetadataRoute } from "next"

import { products } from "@/lib/products"
import { absolute } from "@/lib/site"

function lastModified() {
  try {
    const date = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", "app", "lib", "components"],
      { encoding: "utf8" }
    ).trim()
    return date || undefined
  } catch {
    return undefined
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const modified = lastModified()
  const paths = ["/", ...products.map((product) => `/${product.slug}`)]
  return paths.map((path) => ({
    url: absolute(path),
    lastModified: modified,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }))
}

export const dynamic = "force-static"
