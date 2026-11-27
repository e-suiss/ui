"use client"

import * as React from "react"

import {
  CodeBlock,
  fetchSource,
  type Source,
} from "@/components/site/code-block"
import { useCodeOptions } from "@/components/site/code-options"
import { DEFAULT_BASE, DEFAULT_ICONS, sourceUrl } from "@/lib/code-options"
import type { Variants } from "@/lib/highlight"
import { strings } from "@/lib/strings"

export function CompactSource({
  file,
  variants,
}: {
  file: string
  variants: Variants
}) {
  const options = useCodeOptions()
  const src = sourceUrl(file, {
    icons: variants.icons ? options.icons : DEFAULT_ICONS,
    base: variants.bases.includes(options.base) ? options.base : DEFAULT_BASE,
  })
  const [open, setOpen] = React.useState(false)
  const [loaded, setLoaded] = React.useState<{ src: string; source: Source }>()

  React.useEffect(() => {
    if (!open) return
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
  }, [open, src])

  const source = loaded?.src === src ? loaded.source : undefined
  if (open && source)
    return (
      <CodeBlock
        title={file}
        src={src}
        className={source.className}
        style={source.style}
        html={source.html}
      />
    )

  return (
    <div
      data-not-prose
      className="mt-[1.2em] flex items-center justify-between gap-4 rounded-[20px] bg-muted px-5 py-3.5"
    >
      <span className="min-w-0 truncate font-mono text-[13px] text-muted-foreground">
        {file}
      </span>
      <button
        type="button"
        disabled={open}
        onClick={() => setOpen(true)}
        className="h-8 shrink-0 cursor-pointer rounded-full bg-foreground px-4 text-[13px] font-medium text-background outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default disabled:opacity-60"
      >
        {open ? strings.loadingCode : strings.showCode}
      </button>
    </div>
  )
}
