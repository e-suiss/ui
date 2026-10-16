import path from "node:path"
import { notFound } from "next/navigation"

import {
  DEFAULT_BASE,
  DEFAULT_ICONS,
  ICON_LIBRARIES,
  isBase,
  isIconLibrary,
} from "@/lib/code-options"
import {
  highlightCode,
  readSource,
  sourceFiles,
  sourceVariants,
} from "@/lib/highlight"

export async function GET(
  _request: Request,
  context: RouteContext<"/source/[...path]">
) {
  const [base, icons, ...rest] = (await context.params).path
  const file = rest.join("/")
  if (!(isBase(base) && isIconLibrary(icons))) notFound()
  if (!(await sourceFiles()).includes(file)) notFound()
  const code = (
    await readSource(file, { icons, base }).catch(() => undefined)
  )?.trimEnd()
  if (code === undefined) notFound()

  return Response.json({
    ...(await highlightCode(code, path.extname(file).slice(1) || "tsx")),
    raw: code,
  })
}

export async function generateStaticParams() {
  const files = await sourceFiles()
  const params = await Promise.all(
    files.map(async (file) => {
      const variants = await sourceVariants(file)
      const bases = [DEFAULT_BASE, ...variants.bases]
      const icons = variants.icons ? ICON_LIBRARIES : [DEFAULT_ICONS]
      return bases.flatMap((base) =>
        icons.map((library) => ({
          path: [base, library, ...file.split("/")],
        }))
      )
    })
  )
  return params.flat()
}

export const dynamic = "force-static"
