import { execFileSync } from "node:child_process"
import type { MetadataRoute } from "next"

import { locales } from "@/lib/i18n"
import { products } from "@/lib/products"
import { localeUrl } from "@/lib/site"

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
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: modified,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((code) => [code, localeUrl(code, path)])
        ),
      },
    }))
  )
}

export const dynamic = "force-static"
