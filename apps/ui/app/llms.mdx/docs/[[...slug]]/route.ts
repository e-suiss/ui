import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";

import { source } from "@/lib/source";

const fence = (code: string, lang: string, title?: string) =>
  `\`\`\`${lang}${title ? ` title="${title}"` : ""}\n${code.trimEnd()}\n\`\`\``;

const decode = (text: string) =>
  text.replace(/&#x([0-9a-f]+);/gi, (_match, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)));

async function toMarkdown(body: string) {
  const files = new Map<string, string>();
  for (const [, file] of body.matchAll(/<SourceFile path="([^"]+)"[^>]*\/>/g)) {
    files.set(file, await readFile(path.join(process.cwd(), "components", path.relative("components", file)), "utf8").catch(() => ""));
  }
  return body
    .replace(/<Code lang="(\w+)"(?: title="([^"]*)")? code="([^"]*)" \/>/g, (_match, lang: string, title: string | undefined, code: string) =>
      fence(JSON.parse(decode(code)), lang, title),
    )
    .replace(/<SourceFile path="([^"]+)"[^>]*\/>/g, (_match, file: string) =>
      fence(files.get(file) ?? "", path.extname(file).slice(1) || "tsx", file),
    );
}

export async function GET(_request: Request, context: RouteContext<"/llms.mdx/docs/[[...slug]]">) {
  const { slug } = await context.params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const body = await toMarkdown(await page.data.getText("processed"));
  const lines = [`# ${page.data.title}`, page.data.description ?? "", body].filter(Boolean);
  return new Response(lines.join("\n\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
