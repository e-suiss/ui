import * as React from "react"

interface AnatomyNode {
  name: string
  href?: string
  children: AnatomyNode[]
}

function Tag({
  node,
  closing,
  selfClosing,
}: {
  node: AnatomyNode
  closing?: boolean
  selfClosing?: boolean
}) {
  const name = node.href ? (
    <a
      href={node.href}
      className="text-primary underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
    >
      {node.name}
    </a>
  ) : (
    <span className="text-foreground">{node.name}</span>
  )
  return (
    <span>
      <span className="text-muted-foreground">{closing ? "</" : "<"}</span>
      {name}
      <span className="text-muted-foreground">{selfClosing ? " />" : ">"}</span>
    </span>
  )
}

function Lines({ nodes, depth }: { nodes: AnatomyNode[]; depth: number }) {
  return nodes.map((node) => {
    const pad = { paddingInlineStart: `${depth * 1.25}rem` }
    if (!node.children.length) {
      return (
        <div key={node.name} style={pad}>
          <Tag node={node} selfClosing />
        </div>
      )
    }
    return (
      <React.Fragment key={node.name}>
        <div style={pad}>
          <Tag node={node} />
        </div>
        <div className="relative">
          <span
            aria-hidden
            className="absolute top-1 bottom-1 border-l border-foreground/10"
            style={{ insetInlineStart: `${depth * 1.25 + 0.3}rem` }}
          />
          <Lines nodes={node.children} depth={depth + 1} />
        </div>
        <div style={pad}>
          <Tag node={node} closing />
        </div>
      </React.Fragment>
    )
  })
}

type Element = React.ReactElement<{
  children?: React.ReactNode
  href?: string
}>

const elements = (node: React.ReactNode) =>
  React.Children.toArray(node).filter((child): child is Element =>
    React.isValidElement(child)
  )

function textOf(node: React.ReactNode): string {
  return React.Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number")
        return String(child)
      if (React.isValidElement<{ children?: React.ReactNode }>(child))
        return textOf(child.props.children)
      return ""
    })
    .join("")
}

function treeOf(node: React.ReactNode): AnatomyNode[] {
  const nodes: AnatomyNode[] = []
  for (const element of elements(node)) {
    if (element.type === "ul") {
      nodes.push(...treeOf(element.props.children))
      continue
    }
    if (element.type !== "li") continue
    const parts = React.Children.toArray(element.props.children)
    const link = elements(parts).find((part) => part.props.href)
    const nested = elements(parts).find((part) => part.type === "ul")
    nodes.push({
      name: (link
        ? textOf(link.props.children)
        : textOf(parts.filter((part) => part !== nested))
      ).trim(),
      href: link?.props.href,
      children: nested ? treeOf(nested.props.children) : [],
    })
  }
  return nodes
}

export function Anatomy({ children }: { children: React.ReactNode }) {
  const tree = treeOf(children)
  return (
    <figure
      data-not-prose
      className="mt-6 overflow-hidden rounded-3xl bg-muted"
    >
      <figcaption className="flex items-center justify-between px-6 pt-5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        <span>Anatomy</span>
        <span>{count(tree)} parts</span>
      </figcaption>
      <div className="overflow-x-auto px-6 pt-4 pb-6 font-mono text-[13.5px] leading-7 whitespace-nowrap">
        <Lines nodes={tree} depth={0} />
      </div>
    </figure>
  )
}

function count(nodes: AnatomyNode[]): number {
  return nodes.reduce((total, node) => total + 1 + count(node.children), 0)
}

export function ApiPart({
  index,
  children,
}: {
  index: number
  children: React.ReactNode
}) {
  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl pt-6 ring-1 ring-foreground/10 [&>:not([data-slot=table])]:px-6 [&>h3]:mt-0! [&>h3]:pe-14 [&>[data-slot=table]]:mt-5 [&>[data-slot=table]]:rounded-none [&>[data-slot=table]]:border-t [&>[data-slot=table]]:border-foreground/10 [&>[data-slot=table]]:ring-0 [&>[data-slot=table]_:is(th,td):first-child]:ps-6! [&>[data-slot=table]_:is(th,td):last-child]:pe-6! [&>:last-child:not([data-slot=table])]:mb-6">
      <span
        aria-hidden
        className="absolute top-[1.9rem] right-6 font-mono text-[12px] leading-none text-muted-foreground"
      >
        {String(index).padStart(2, "0")}
      </span>
      {children}
    </section>
  )
}
