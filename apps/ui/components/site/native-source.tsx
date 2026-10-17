"use client"

import * as React from "react"

import {
  CodeBlock,
  fetchSource,
  type Source,
} from "@/components/site/code-block"
import { useCodeVisible } from "@/components/site/lazy-source"

export function NativeSource({
  src,
  children,
}: {
  src?: string
  children: React.ReactNode
}) {
  const visible = useCodeVisible()
  const [source, setSource] = React.useState<Source>()

  React.useEffect(() => {
    if (!(src && visible) || source) return
    let live = true
    fetchSource(src).then(
      (loaded) => {
        if (live) setSource(loaded)
      },
      () => undefined
    )
    return () => {
      live = false
    }
  }, [src, visible, source])

  return source ? (
    <CodeBlock
      src={src}
      className={source.className}
      style={source.style}
      html={source.html}
    />
  ) : (
    children
  )
}
