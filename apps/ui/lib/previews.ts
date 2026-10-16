import { contentPages } from "@/lib/highlight"

export type PreviewType = "example" | "chart" | "block"
export type PreviewLayout = "centered" | "padded" | "fullscreen" | "panel"

export type Preview = {
  name: string
  type: PreviewType
  layout: PreviewLayout
  responsive: boolean
}

const PREVIEW_TAG = /<ComponentPreview\b([^>]*?)\/>/g
const RESPONSIVE = /\bresponsive\b/

const attribute = (tag: string, name: string) =>
  tag.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1]

export function previewOf({
  name,
  type = "example",
  layout = "centered",
  responsive = false,
}: {
  name: string
  type?: PreviewType
  layout?: PreviewLayout
  responsive?: boolean
}): Preview {
  return {
    name,
    type,
    layout,
    responsive: responsive || type === "block",
  }
}

export async function framedPreviews() {
  const found = new Map<string, Preview>()
  for (const page of await contentPages()) {
    for (const [, tag = ""] of page.matchAll(PREVIEW_TAG)) {
      const name = attribute(tag, "name")
      if (!name) continue
      const preview = previewOf({
        name,
        type: attribute(tag, "type") as PreviewType | undefined,
        layout: attribute(tag, "layout") as PreviewLayout | undefined,
        responsive: RESPONSIVE.test(tag),
      })
      if (preview.responsive) found.set(name, preview)
    }
  }
  return [...found.values()]
}
