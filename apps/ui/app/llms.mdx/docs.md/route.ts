import { notFound } from "next/navigation"

import { pageMarkdown } from "@/lib/llms"
import { absolute } from "@/lib/site"
import { source } from "@/lib/source"

export async function GET() {
  const page = source.getPage([])
  if (!page) notFound()

  return new Response(await pageMarkdown(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${absolute(page.url)}>; rel="canonical"`,
    },
  })
}

export const dynamic = "force-static"
