import type * as PageTree from "fumadocs-core/page-tree"
import { repository, sections } from "@/lib/sections"
import { source } from "@/lib/source"
import { strings } from "@/lib/strings"
import type { NavItem, NavLink } from "@/site/global-nav"

const EXPLORE_LIMIT = 6
const DOCS_PREFIX = /^\/docs\/?/

const featured: Record<string, string[]> = {
  "/docs/components": ["button", "dialog", "input", "select", "sidebar"],
}

function folderOf(path: string) {
  return source
    .getPageTree()
    .children.find(
      (node): node is PageTree.Folder =>
        node.type === "folder" &&
        (node.index?.url === path ||
          node.children.some(
            (child) => child.type === "page" && child.url === path
          ))
    )
}

function pageLink(url: string): NavLink {
  const page = source.getPage(
    url.replace(DOCS_PREFIX, "").split("/").filter(Boolean)
  )
  if (!page) throw new Error(`Missing docs page for the nav: ${url}`)
  return { label: page.data.title, href: page.url }
}

function explore(path: string): NavLink[] {
  if (path === "/docs") {
    return ["/docs", "/docs/installation", "/docs/theming", "/docs/cli"].map(
      pageLink
    )
  }
  const overview = { label: strings.overview, href: path }
  const picks = featured[path]
  if (picks)
    return [overview, ...picks.map((slug) => pageLink(`${path}/${slug}`))]

  const folder = folderOf(path)
  const groups: NavLink[] = []
  const pages: NavLink[] = []
  let group: string | undefined
  for (const node of folder?.children ?? []) {
    if (node.type === "separator") group = String(node.name ?? "")
    if (node.type !== "page" || node.url === path) continue
    if (group && !groups.some((link) => link.label === group)) {
      groups.push({ label: group, href: node.url })
    }
    pages.push({ label: String(node.name), href: node.url })
  }
  return [overview, ...(groups.length ? groups : pages)].slice(0, EXPLORE_LIMIT)
}

export function navItems(): NavItem[] {
  const quick = [
    pageLink("/docs/installation"),
    pageLink("/docs/cli"),
    pageLink("/docs/theming"),
    { label: strings.github, href: repository },
  ]
  return sections.map((section) => ({
    label: section.label,
    href: section.path,
    explore: explore(section.path),
    quick: section.path === "/docs" ? quick.slice(3) : quick,
  }))
}
