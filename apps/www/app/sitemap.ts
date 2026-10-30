import { execFileSync } from "node:child_process"
import type { MetadataRoute } from "next"

import { products } from "@/lib/products"
import { absolute } from "@/lib/site"
import { DOCS, source } from "@/lib/source"

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

function priority(path: string, docs: string[]) {
  if (path === "/") return 1
  if (docs.includes(path)) return 0.6
  return 0.8
}

export default function sitemap(): MetadataRoute.Sitemap {
  const modified = lastModified()
  const docs = source
    .getPages()
    .filter((page) => page.slugs[1] === DOCS)
    .map((page) => page.url)
  const paths = ["/", ...products.map((product) => `/${product.slug}`), ...docs]
  return paths.map((path) => ({
    url: absolute(path),
    lastModified: modified,
    changeFrequency: "weekly" as const,
    priority: priority(path, docs),
  }))
}

export const dynamic = "force-static"
