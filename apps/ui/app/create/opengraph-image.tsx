import { ogImage, ogSize } from "@/lib/og"
import { site } from "@/lib/site"
import { strings } from "@/lib/strings"

export const alt = `${strings.createTitle} – ${site.name}`
export const size = ogSize
export const contentType = "image/png"

export default function OpengraphImage() {
  return ogImage({
    title: strings.createTitle,
    description: strings.createDescription,
  })
}

export const dynamic = "force-static"
