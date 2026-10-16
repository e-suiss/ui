import { notFound } from "next/navigation"

import { ogImage } from "@/lib/og"
import { source } from "@/lib/source"

export async function GET(
  _request: Request,
  context: RouteContext<"/og/docs/[...slug]">
) {
  const { slug } = await context.params
  const page =
    slug.at(-1) === "image.png" ? source.getPage(slug.slice(0, -1)) : undefined
  if (!page) notFound()

  return ogImage({
    title: page.data.title,
    description: page.data.description,
    eyebrow: page.data.eyebrow,
  })
}

export function generateStaticParams() {
  return source
    .getPages()
    .map((page) => ({ slug: [...page.slugs, "image.png"] }))
}

export const dynamic = "force-static"
