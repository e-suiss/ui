import type { MetadataRoute } from "next"

import { dictionary } from "@/lib/dictionary"
import { site } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: dictionary.title,
    short_name: site.name,
    description: dictionary.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  }
}

export const dynamic = "force-static"
