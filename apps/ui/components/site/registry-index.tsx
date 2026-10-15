import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr"

import type * as PageTree from "fumadocs-core/page-tree"
import type * as React from "react"

import { Anchor } from "@/components/site/anchor"
import { source } from "@/lib/source"

type Item = { url: string; title: React.ReactNode }

function folderOf(url: string) {
  return source
    .getPageTree()
    .children.find(
      (node): node is PageTree.Folder =>
        node.type === "folder" &&
        (node.index?.url === url ||
          node.children.some(
            (child) => child.type === "page" && child.url === url
          ))
    )
}

export function RegistryIndex({ category }: { category: string }) {
  const groups = new Map<string, Item[]>()
  const url = `/docs/${category}`
  let group = ""
  for (const node of folderOf(url)?.children ?? []) {
    if (node.type === "separator") group = String(node.name ?? "")
    if (node.type !== "page" || node.url === url) continue
    groups.set(group, [
      ...(groups.get(group) ?? []),
      { url: node.url, title: node.name },
    ])
  }

  return (
    <div data-not-prose className="mt-[1.2em] flex flex-col gap-12">
      {[...groups].map(([group, members]) => (
        <section key={group || "all"} className="flex flex-col gap-4">
          {group && (
            <p className="font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">
              {group} · {String(members.length).padStart(2, "0")}
            </p>
          )}
          <ul className="grid border-t border-label/12 sm:grid-cols-2">
            {members.map((item) => (
              <li
                key={item.url}
                className="border-b border-label/12 sm:odd:border-e sm:odd:pe-6 sm:even:ps-6"
              >
                <Anchor
                  href={item.url}
                  className="group flex items-center justify-between gap-4 py-3.5 text-[17px] tracking-[-0.02em] outline-none focus-visible:focus-ring"
                >
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.08,0.24,1)] group-hover:translate-x-1.5">
                    {item.title}
                  </span>
                  <ArrowUpRightIcon className="size-3.5 text-label-tertiary transition-[rotate,color] duration-500 group-hover:rotate-45 group-hover:text-label" />
                </Anchor>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
