import { readFile } from "node:fs/promises"
import path from "node:path"
import { DEFAULT_BASE, PRIMITIVE_BASES } from "@/lib/code-options"

export type BaseDependencies = {
  dependencies: string[]
  bases: Record<string, string[]>
}

const registryRoot = path.join(process.cwd(), "../../packages/web/registry")

const registryFile = (base: string) =>
  path.join(registryRoot, base === DEFAULT_BASE ? "" : base, "registry.json")

type Registry = { items: { name: string; dependencies?: string[] }[] }

async function dependencyMap(base: string) {
  "use cache"
  const registry = JSON.parse(
    await readFile(registryFile(base), "utf8")
  ) as Registry
  return Object.fromEntries(
    registry.items.map((item) => [item.name, item.dependencies ?? []])
  ) as Record<string, string[]>
}

const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && a.every((name) => b.includes(name))

export async function baseDependencies(
  item: string
): Promise<BaseDependencies | undefined> {
  const dependencies = (await dependencyMap(DEFAULT_BASE))[item]
  if (!dependencies) return undefined
  const bases: Record<string, string[]> = {}
  for (const base of PRIMITIVE_BASES) {
    const own = (await dependencyMap(base))[item]
    if (own && !sameSet(own, dependencies)) bases[base] = own
  }
  return Object.keys(bases).length > 0 ? { dependencies, bases } : undefined
}
