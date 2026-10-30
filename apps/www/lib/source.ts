import type * as PageTree from "fumadocs-core/page-tree"
import { loader } from "fumadocs-core/source"
import { pageSchema } from "fumadocs-core/source/schema"
import { defineDocs } from "fumadocs-mdx/macro"

const docs = defineDocs({
  dir: "content",
  docs: {
    async: true,
    schema: pageSchema,
    postprocess: { includeProcessedMarkdown: true },
  },
})

export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
})

export const DOCS = "docs"

function docsOf(product: string) {
  return source.getPages().filter((page) => {
    const [owner, section] = page.slugs
    return owner === product && section === DOCS
  })
}

export function hasDocs(product: string) {
  return docsOf(product).length > 0
}

function findFolder(
  nodes: PageTree.Node[],
  url: string
): PageTree.Folder | undefined {
  for (const node of nodes) {
    if (node.type !== "folder") continue
    if (
      node.index?.url === url ||
      node.children.some((child) => child.type === "page" && child.url === url)
    )
      return node
    const found = findFolder(node.children, url)
    if (found) return found
  }
  return undefined
}

export function docsTree(product: string) {
  return findFolder(source.getPageTree().children, `/${product}/${DOCS}`)
}
