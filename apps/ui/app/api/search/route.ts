import type { Node } from "fumadocs-core/page-tree"

import { hubVariants } from "@/lib/hubs"
import { source } from "@/lib/source"

type Entry = { title: string; description?: string; url: string }

function pagesOf(nodes: Node[]): string[] {
  return nodes.flatMap((node) => {
    if (node.type === "page") return [node.url]
    if (node.type === "folder")
      return [
        ...(node.index ? [node.index.url] : []),
        ...pagesOf(node.children),
      ]
    return []
  })
}

export function GET() {
  const pages = new Map(source.getPages().map((page) => [page.url, page]))
  const entry = (url: string): Entry[] => {
    const page = pages.get(url)
    if (!page) return []
    const variants = (hubVariants(page) ?? []).map(
      ({ page: variant, anchor }) => ({
        title: variant.data.title,
        description: variant.data.description,
        url: `${url}#${anchor}`,
      })
    )
    return [
      {
        title: page.data.title ?? url,
        description: page.data.description,
        url,
      },
      ...variants,
    ]
  }
  const groups: { name: string; pages: Entry[] }[] = []
  let current: { name: string; pages: Entry[] } | undefined

  for (const node of source.getPageTree().children) {
    if (node.type === "separator") {
      current = { name: String(node.name ?? ""), pages: [] }
      groups.push(current)
    } else if (node.type === "folder") {
      groups.push({
        name: String(node.name),
        pages: pagesOf([node]).flatMap(entry),
      })
      current = undefined
    } else {
      if (!current) {
        current = { name: "", pages: [] }
        groups.push(current)
      }
      current.pages.push(...entry(node.url))
    }
  }

  return Response.json(groups.filter((group) => group.pages.length > 0))
}

export const dynamic = "force-static"
