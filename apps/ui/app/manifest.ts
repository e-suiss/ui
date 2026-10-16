import type { MetadataRoute } from "next"

import { basePath, withBase } from "@/lib/base-path"
import { site } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.name,
    description: site.description,
    start_url: basePath,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: withBase("/icon.png"), sizes: "512x512", type: "image/png" },
      { src: withBase("/apple-icon.png"), sizes: "180x180", type: "image/png" },
    ],
  }
}

export const dynamic = "force-static"
