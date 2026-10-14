import { llmsIndex, pageGroups, pageMarkdown } from "@/lib/llms";

async function fullText() {
  "use cache";
  const sections = [llmsIndex()];
  for (const pages of pageGroups().values()) {
    for (const page of pages) sections.push(await pageMarkdown(page));
  }
  return sections.join("\n\n---\n\n");
}

export async function GET() {
  return new Response(await fullText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
