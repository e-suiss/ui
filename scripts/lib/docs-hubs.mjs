import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const FRONTMATTER = /^---\n([\s\S]*?)\n---/
const VARIANTS = /^variants:\n((?: {2}- .+\n?)+)/m
const ITEM = /^ {2}- /
const MDX = /\.mdx$/

export const DOCS = path.resolve(
  import.meta.dirname,
  "../../apps/ui/content/docs"
)

export function hubVariants(text) {
  const block = text.match(FRONTMATTER)?.[1]?.match(VARIANTS)?.[1]
  return block
    ? block
        .split("\n")
        .map((line) => line.replace(ITEM, "").trim())
        .filter(Boolean)
    : undefined
}

export function isHub(file) {
  return hubVariants(readFileSync(file, "utf8")) !== undefined
}

export function docsHubs(docs = DOCS) {
  const owners = new Map()
  for (const section of readdirSync(docs, { withFileTypes: true })) {
    if (!section.isDirectory()) continue
    const folder = path.join(docs, section.name)
    for (const file of readdirSync(folder)) {
      if (!file.endsWith(".mdx")) continue
      const variants = hubVariants(
        readFileSync(path.join(folder, file), "utf8")
      )
      if (!variants) continue
      const hub = file.replace(MDX, "")
      for (const name of variants) {
        const anchor = name.startsWith(`${hub}-`)
          ? name.slice(hub.length + 1)
          : name
        owners.set(`/docs/${section.name}/${name}`, {
          hub: `/docs/${section.name}/${hub}`,
          anchor,
        })
      }
    }
  }
  return owners
}

export function docsHref(url, owners = docsHubs()) {
  const owner = owners.get(url)
  return owner ? `${owner.hub}#${owner.anchor}` : url
}
