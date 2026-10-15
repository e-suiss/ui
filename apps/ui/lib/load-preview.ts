import type * as React from "react"

import type { PreviewType } from "@/lib/previews"

const pascal = (name: string) =>
  name.replace(/(^|-)([a-z0-9])/g, (_, __, letter: string) =>
    letter.toUpperCase()
  )

type Module = Record<string, React.ComponentType>

export async function loadPreview(
  type: PreviewType,
  name: string
): Promise<React.ComponentType | undefined> {
  if (type === "chart") {
    const module: Module = await import(`@/components/charts/${name}`)
    return module[pascal(name)]
  }
  if (type === "block") {
    const module: Module = await import(`@/components/blocks/${name}`)
    return module[pascal(name)]
  }
  const module: Module = await import(`@/examples/${name}`)
  return module.default
}
