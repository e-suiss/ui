import { execFileSync } from "node:child_process"
import type { MetadataRoute } from "next"

import { products } from "@/lib/products"
import { absolute } from "@/lib/site"
import { DOCS, source } from "@/lib/source"

const HOME_FILES = ["app/page.tsx", "lib/dictionary.ts", "components"]
const PRODUCT_FILES = ["app/[product]", "lib/products.ts"]

function lastModified(files: string[], follow = false) {
  try {
    const date = execFileSync(
      "git",
      [
        "log",
        "-1",
        ...(follow ? ["--follow"] : []),
        "--format=%cI",
        "--",
        ...files,
      ],
      { encoding: "utf8" }
    ).trim()
    return date || undefined
  } catch {
    return undefined
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = source.getPages().filter((page) => page.slugs[1] === DOCS)
  const productModified = lastModified(PRODUCT_FILES)
  return [
    {
      url: absolute("/"),
      lastModified: lastModified(HOME_FILES),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...products.map((product) => ({
      url: absolute(`/${product.slug}`),
      lastModified: productModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...docs.map((page) => ({
      url: absolute(page.url),
      lastModified: lastModified([`content/${page.path}`], true),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]
}

export const dynamic = "force-static"
