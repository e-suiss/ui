import { readFile } from "node:fs/promises"
import path from "node:path"
import { source } from "@/lib/source"

export type PieceCounts = Record<string, number>

const registryFile = path.join(
  process.cwd(),
  "../../packages/web/registry/registry.json"
)

async function hookCount() {
  const { items } = JSON.parse(await readFile(registryFile, "utf8")) as {
    items: { type: string }[]
  }
  return items.filter((item) => item.type === "registry:hook").length
}

export async function pieceCounts(): Promise<PieceCounts> {
  const counts: PieceCounts = {}
  for (const page of source.getPages()) {
    const [collection] = page.slugs
    if (page.slugs.length !== 2 || !collection) continue
    counts[collection] = (counts[collection] ?? 0) + 1
  }
  counts.hooks = await hookCount()
  return counts
}
