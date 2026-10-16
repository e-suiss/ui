import { notFound } from "next/navigation"

import { pageMarkdown } from "@/lib/llms"
import { absolute } from "@/lib/site"
import { source } from "@/lib/source"

const MARKDOWN_EXTENSION = /\.md$/

export async function GET(
  _request: Request,
  context: RouteContext<"/llms.mdx/docs/[...slug]">
) {
  const { slug } = await context.params
  const last = slug.at(-1) ?? ""
  if (!MARKDOWN_EXTENSION.test(last)) notFound()
  const page = source.getPage([
    ...slug.slice(0, -1),
    last.replace(MARKDOWN_EXTENSION, ""),
  ])
  if (!page) notFound()

  return new Response(await pageMarkdown(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${absolute(page.url)}>; rel="canonical"`,
    },
  })
}

export function generateStaticParams() {
  return source
    .generateParams()
    .filter(({ slug }) => slug.length > 0)
    .map(({ slug }) => ({
      slug: [...slug.slice(0, -1), `${slug.at(-1)}.md`],
    }))
}

export const dynamic = "force-static"
