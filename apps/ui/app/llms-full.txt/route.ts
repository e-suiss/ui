import { llmsIndex, pageGroups, pageMarkdown } from "@/lib/llms"

async function fullText() {
  const sections = [llmsIndex(true)]
  for (const pages of pageGroups().values()) {
    for (const page of pages) sections.push(await pageMarkdown(page, true))
  }
  return sections.join("\n\n---\n\n")
}

export async function GET() {
  return new Response(await fullText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

export const dynamic = "force-static"
