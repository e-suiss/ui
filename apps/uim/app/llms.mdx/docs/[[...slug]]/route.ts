import { notFound } from "next/navigation";

import { source } from "@/lib/source";

export async function GET(_request: Request, context: RouteContext<"/llms.mdx/docs/[[...slug]]">) {
  const { slug } = await context.params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const body = await page.data.getText("processed");
  const lines = [`# ${page.data.title}`, page.data.description ?? "", body].filter(Boolean);
  return new Response(lines.join("\n\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
