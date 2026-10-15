import { notFound } from "next/navigation"

import { pageMarkdown } from "@/lib/llms"
import { absolute } from "@/lib/site"
import { source } from "@/lib/source"

export async function GET(
  _request: Request,
  context: RouteContext<"/llms.mdx/docs/[[...slug]]">
) {
  const { slug } = await context.params
  const page = source.getPage(slug)
  if (!page) notFound()

  return new Response(await pageMarkdown(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${absolute(page.url)}>; rel="canonical"`,
    },
  })
}

export function generateStaticParams() {
  return source.generateParams()
}
