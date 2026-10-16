import type { MDXComponents } from "mdx/types"
import * as React from "react"

import { Anchor } from "@/components/site/anchor"
import { Anatomy, ApiPart } from "@/components/site/api-reference"
import { Callout } from "@/components/site/callout"
import { CodeBlock } from "@/components/site/code-block"
import { ComponentPreview } from "@/components/site/component-preview"
import { ComponentSource } from "@/components/site/component-source"
import { NativeExample } from "@/components/site/native-example"
import { PiecesStep, Steps } from "@/components/site/pieces-step"
import { Only } from "@/components/site/platform"
import { RegistryIndex } from "@/components/site/registry-index"
import { Tabs } from "@/components/site/tabs"
import { strings } from "@/lib/strings"

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (
    React.isValidElement<{ children?: React.ReactNode; className?: string }>(
      node
    )
  ) {
    const text = textOf(node.props.children)
    return node.props.className === "line" ? `${text}\n` : text
  }
  return ""
}

function Pre(props: React.ComponentProps<typeof CodeBlock>) {
  return (
    <CodeBlock
      {...props}
      raw={props.title === "Terminal" ? textOf(props.children) : undefined}
    />
  )
}

function pieceNames(node: React.ReactNode): string[] {
  if (Array.isArray(node)) return node.flatMap(pieceNames)
  if (
    !React.isValidElement<{ children?: React.ReactNode; href?: string }>(node)
  )
    return []
  if (node.props.href) return [node.props.href.split("/").pop() ?? ""]
  if (node.type === "code") return [textOf(node.props.children)]
  return pieceNames(node.props.children)
}

function ListItem(props: React.ComponentProps<"li">) {
  if (!textOf(props.children).trim().startsWith(strings.piecesLead))
    return <li {...props} />
  const loose = React.Children.toArray(props.children).some(
    (child) => React.isValidElement(child) && child.type === "p"
  )
  return (
    <PiecesStep {...props} names={pieceNames(props.children)} loose={loose} />
  )
}

function OrderedList({ start, ...props }: React.ComponentProps<"ol">) {
  return start === undefined ? (
    <ol {...props} />
  ) : (
    <Steps {...props} start={Number(start)} />
  )
}

function Table(props: React.ComponentProps<"table">) {
  return (
    <div data-slot="table" className="mt-[1.2em] overflow-x-auto">
      <table {...props} />
    </div>
  )
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    a: ({ href, ...props }) => <Anchor href={href} {...props} />,
    pre: Pre,
    li: ListItem,
    ol: OrderedList,
    table: Table,
    Callout,
    ComponentPreview,
    NativeExample,
    Only,
    Tabs,
    Anatomy,
    ApiPart,
    ComponentSource,
    RegistryIndex,
    ...components,
  } satisfies MDXComponents
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
