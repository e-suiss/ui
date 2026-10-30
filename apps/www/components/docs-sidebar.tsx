"use client"

import type * as PageTree from "fumadocs-core/page-tree"
import { usePathname } from "next/navigation"
import type * as React from "react"
import { Anchor } from "@/components/anchor"
import { cn } from "@/lib/utils"

const TRAILING_SLASH = /\/$/

function Item({ item, active }: { item: PageTree.Item; active: boolean }) {
  return (
    <li>
      <Anchor
        href={item.url}
        aria-current={active ? "page" : undefined}
        className={cn(
          "block rounded-md py-1.5 text-[14px] leading-[1.3] tracking-[-0.015em] transition-colors duration-300 hover:text-foreground",
          active ? "font-medium text-foreground" : "text-foreground/60"
        )}
      >
        {item.name}
      </Anchor>
    </li>
  )
}

function Nodes({
  nodes,
  pathname,
}: {
  nodes: PageTree.Node[]
  pathname: string
}): React.ReactNode {
  return nodes.map((node, index) => {
    if (node.type === "separator")
      return (
        <li
          key={`separator-${index}`}
          className="mt-6 mb-1 font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase"
        >
          {node.name}
        </li>
      )
    if (node.type === "page")
      return <Item key={node.url} item={node} active={node.url === pathname} />
    return (
      <li key={node.$id ?? String(node.name)} className="mt-4">
        <p className="py-1.5 text-[14px] font-medium tracking-[-0.015em]">
          {node.name}
        </p>
        <ul className="flex flex-col border-s border-foreground/12 ps-3">
          {node.index && (
            <Item item={node.index} active={node.index.url === pathname} />
          )}
          <Nodes nodes={node.children} pathname={pathname} />
        </ul>
      </li>
    )
  })
}

export function DocsSidebar({
  tree,
  label,
}: {
  tree: PageTree.Folder
  label: string
}) {
  const pathname = usePathname().replace(TRAILING_SLASH, "")
  const list = (
    <ul className="flex flex-col">
      {tree.index && (
        <Item item={tree.index} active={tree.index.url === pathname} />
      )}
      <Nodes nodes={tree.children} pathname={pathname} />
    </ul>
  )
  return (
    <>
      <nav
        aria-label={label}
        className="sticky top-20 hidden max-h-[calc(100svh-6rem)] w-60 shrink-0 overflow-y-auto pe-4 pb-10 md:block"
      >
        <p className="mb-4 font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
          {label}
        </p>
        {list}
      </nav>
      <details className="group border-b border-foreground/12 px-5 py-4 md:hidden">
        <summary className="cursor-pointer list-none font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
          {label}
        </summary>
        <nav aria-label={label} className="pt-4">
          {list}
        </nav>
      </details>
    </>
  )
}
