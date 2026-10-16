"use client"

import * as React from "react"

import {
  CodeBlock,
  fetchSource,
  type Source,
} from "@/components/site/code-block"
import { useCodeOptions } from "@/components/site/code-options"
import { SourceCode } from "@/components/site/source-code"
import { DEFAULT_BASE, DEFAULT_ICONS, sourceUrl } from "@/lib/code-options"
import type { Variants } from "@/lib/highlight"

export function LazySource({
  file,
  variants,
  title,
  long = false,
  lines,
  fold = true,
  children,
}: {
  file: string
  variants: Variants
  title?: string
  long?: boolean
  lines?: number
  fold?: boolean
  children: React.ReactNode
}) {
  const options = useCodeOptions()
  const src = sourceUrl(file, {
    icons: variants.icons ? options.icons : DEFAULT_ICONS,
    base: variants.bases.includes(options.base) ? options.base : DEFAULT_BASE,
  })
  const [expanded, setExpanded] = React.useState(false)
  const wanted = src !== sourceUrl(file) || (long && expanded)
  const [loaded, setLoaded] = React.useState<{ src: string; source: Source }>()

  React.useEffect(() => {
    if (!wanted) return
    let live = true
    fetchSource(src).then(
      (source) => {
        if (live) setLoaded({ src, source })
      },
      () => undefined
    )
    return () => {
      live = false
    }
  }, [src, wanted])

  const source = wanted ? loaded?.source : undefined
  const block = source ? (
    <CodeBlock
      title={title}
      src={loaded?.src}
      className={source.className}
      style={source.style}
      html={source.html}
    />
  ) : (
    children
  )

  return fold ? (
    <SourceCode lines={lines} onExpand={() => setExpanded(true)}>
      {block}
    </SourceCode>
  ) : (
    block
  )
}
