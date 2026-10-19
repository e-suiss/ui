import { readFile } from "node:fs/promises"
import path from "node:path"
import { type Preview, previewOf } from "@/lib/previews"

type CreateExample = Preview & { title: string }

export type CreateItem = {
  name: string
  title: string
  examples: CreateExample[]
}

export type CreateGroup = {
  title: string
  items: CreateItem[]
}

const DOCS = path.join(process.cwd(), "content/docs")

const SECTIONS = [
  { folder: "components", title: "Components" },
  { folder: "patterns", title: "Patterns" },
  { folder: "interactions", title: "Interactions" },
  { folder: "ai", title: "AI" },
  { folder: "charts", title: "Charts" },
  { folder: "blocks", title: "Blocks" },
]

const LINE = /^(#{2,3}) (.+)$|<ComponentPreview\b([^>]*?)\/>/gm
const TITLE = /^title: (.+)$/m
const CHART_KIND = /^(.+?)-chart-/
const DEFAULT_TITLE = "Default"

const attribute = (tag: string, name: string) =>
  tag.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1]

async function pageNames(folder: string) {
  const meta = JSON.parse(
    await readFile(path.join(DOCS, folder, "meta.json"), "utf8")
  ) as { pages: string[] }
  return meta.pages.filter((page) => page !== "index" && !page.startsWith("-"))
}

async function readPage(folder: string, name: string) {
  const text = await readFile(path.join(DOCS, folder, `${name}.mdx`), "utf8")
  const title = text.match(TITLE)?.[1]?.replace(/^"|"$/g, "") ?? name
  const examples: CreateExample[] = []
  let heading = title
  for (const [, , label, tag] of text.matchAll(LINE)) {
    if (label) {
      heading = label
      continue
    }
    const exampleName = attribute(tag ?? "", "name")
    if (!exampleName || examples.some((item) => item.name === exampleName))
      continue
    examples.push({
      ...previewOf({
        name: exampleName,
        type: attribute(tag ?? "", "type") as Preview["type"] | undefined,
        layout: attribute(tag ?? "", "layout") as Preview["layout"] | undefined,
      }),
      title: examples.length === 0 ? DEFAULT_TITLE : heading,
    })
  }
  return { name, title, examples }
}

function chartGroups(pages: CreateItem[]) {
  const kinds = new Map<string, CreateItem>()
  for (const page of pages) {
    const kind = page.name.match(CHART_KIND)?.[1] ?? page.name
    const item = kinds.get(kind) ?? {
      name: `${kind}-charts`,
      title: `${kind[0]?.toUpperCase()}${kind.slice(1)} Charts`,
      examples: [],
    }
    item.examples.push(
      ...page.examples.map((example) => ({ ...example, title: page.title }))
    )
    kinds.set(kind, item)
  }
  return [...kinds.values()]
}

export async function createGroups(): Promise<CreateGroup[]> {
  const groups = await Promise.all(
    SECTIONS.map(async ({ folder, title }) => {
      const pages = await Promise.all(
        (await pageNames(folder)).map((name) => readPage(folder, name))
      )
      const items = pages.filter((page) => page.examples.length > 0)
      return {
        folder,
        title,
        items: folder === "charts" ? chartGroups(items) : items,
      }
    })
  )
  const taken = new Set<string>()
  return groups.map(({ folder, title, items }) => ({
    title,
    items: items.map((item) => {
      const name = taken.has(item.name) ? `${folder}-${item.name}` : item.name
      taken.add(name)
      return { ...item, name }
    }),
  }))
}

export async function createItem(name: string) {
  for (const group of await createGroups()) {
    const item = group.items.find((entry) => entry.name === name)
    if (item) return { group: group.title, item }
  }
  return undefined
}
