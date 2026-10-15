import path from "node:path"
import { notFound } from "next/navigation"

import { type CodeOptions, codeOptions } from "@/lib/code-options"
import { highlightCode, readSource, sourceFiles } from "@/lib/highlight"

async function load(file: string, icons: CodeOptions["icons"], base: string) {
  "use cache"
  const code = (
    await readSource(file, { icons, base }).catch(() => undefined)
  )?.trimEnd()
  if (code === undefined) return undefined
  return {
    ...(await highlightCode(code, path.extname(file).slice(1) || "tsx")),
    raw: code,
  }
}

export async function GET(
  request: Request,
  context: RouteContext<"/source/[...path]">
) {
  const file = (await context.params).path.join("/")
  if (!(await sourceFiles()).includes(file)) notFound()
  const { icons, base } = codeOptions(new URL(request.url).searchParams)
  const source = await load(file, icons, base)
  if (!source) notFound()

  return Response.json(source, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "noindex",
    },
  })
}
