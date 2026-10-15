"use client"

import * as React from "react"

import {
  CodeBlock,
  fetchSource,
  type Source,
} from "@/components/site/code-block"
import { SourceCode } from "@/components/site/source-code"

export function LazySource({
  src,
  title,
  children,
}: {
  src: string
  title: string
  children: React.ReactNode
}) {
  const [source, setSource] = React.useState<Source>()

  const load = () => {
    fetchSource(src).then(setSource, () => undefined)
  }

  return (
    <SourceCode onExpand={load}>
      {source ? (
        <CodeBlock
          title={title}
          src={src}
          className={source.className}
          style={source.style}
          html={source.html}
        />
      ) : (
        children
      )}
    </SourceCode>
  )
}
