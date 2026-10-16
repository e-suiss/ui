import { llmsIndex, pageGroups, pageMarkdown, sharedSources } from "@/lib/llms"

async function fullText() {
  const sections = [llmsIndex()]
  const shared = new Map<string, string>()
  for (const pages of pageGroups().values()) {
    for (const page of pages) sections.push(await pageMarkdown(page, shared))
  }
  if (shared.size > 0) sections.push(sharedSources(shared))
  return sections.join("\n\n---\n\n")
}

export async function GET() {
  return new Response(await fullText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

export const dynamic = "force-static"
