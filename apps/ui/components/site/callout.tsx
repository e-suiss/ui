"use client"

import { cn } from "cn"
import type * as React from "react"

import { strings } from "@/lib/strings"

type CalloutType = "note" | "tip" | "important" | "warning" | "deprecated"

const styles: Record<CalloutType, string> = {
  note: "border-border bg-muted",
  tip: "border-teal-500/50 bg-teal-500/8",
  important: "border-yellow-500/60 bg-yellow-500/10",
  warning: "border-destructive/50 bg-destructive/10 dark:bg-destructive/20",
  deprecated: "border-orange-500/50 bg-orange-500/8",
}

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}) {
  return (
    <aside
      data-slot="callout"
      data-type={type}
      className={cn(
        "mt-[1.2em] rounded-[20px] border px-5 py-4 [&>p:first-of-type]:mt-1",
        styles[type]
      )}
    >
      <p className="font-mono text-[11px] tracking-[0.02em] uppercase">
        {title ?? strings[type]}
      </p>
      {children}
    </aside>
  )
}
