import path from "node:path";
import { notFound } from "next/navigation";

import { highlightCode, readSource, sourceFiles } from "@/lib/highlight";

async function load(file: string) {
  "use cache";
  const code = (await readSource(file).catch(() => undefined))?.trimEnd();
  if (code === undefined) return undefined;
  return { ...(await highlightCode(code, path.extname(file).slice(1) || "tsx")), raw: code };
}

export async function GET(_request: Request, context: RouteContext<"/source/[...path]">) {
  const file = (await context.params).path.join("/");
  if (!(await sourceFiles()).includes(file)) notFound();
  const source = await load(file);
  if (!source) notFound();

  return Response.json(
    source,
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400", "X-Robots-Tag": "noindex" } },
  );
}

export async function generateStaticParams() {
  return (await sourceFiles()).map((file) => ({ path: file.split("/") }));
}
