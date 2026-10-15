import type { ComponentType } from "react"
import { test } from "vitest"

import { renderExample } from "@/tests/render-example"

const examples = import.meta.glob<{ default: ComponentType }>(
  "../../examples/*.tsx"
)

for (const [file, load] of Object.entries(examples)) {
  const name = file.slice(file.lastIndexOf("/") + 1, -".tsx".length)
  test(name, async () => {
    const { default: Example } = await load()
    await renderExample(<Example />)
  })
}
