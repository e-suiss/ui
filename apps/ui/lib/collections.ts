import { readdir, readFile } from "node:fs/promises"
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

const packagesDir = path.join(process.cwd(), "../../packages")

async function exampleCount(dir: string) {
  const files = await readdir(path.join(packagesDir, dir))
  return files.filter((file) => file.endsWith(".tsx")).length
}

export async function coverageCounts() {
  const { items } = JSON.parse(
    await readFile(path.join(packagesDir, "mobile/registry.json"), "utf8")
  ) as { items: { swift?: string[]; kotlin?: string[] }[] }
  return {
    web: await exampleCount("web/examples"),
    native: await exampleCount("mobile/examples"),
    swift: items.filter((item) => item.swift?.length).length,
    kotlin: items.filter((item) => item.kotlin?.length).length,
  }
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
