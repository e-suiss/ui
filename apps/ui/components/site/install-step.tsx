"use client"

import type * as React from "react"
import { useBaseItems } from "@/components/site/base-items"
import { usePackageLines } from "@/components/site/package-command"

export function InstallStep({
  bare,
  children,
  ...props
}: React.ComponentProps<"li"> & { bare: React.ReactNode }) {
  const command = useBaseItems().packages?.command
  const lines = usePackageLines(command ?? "")
  const empty = command !== undefined && lines.length === 0
  return <li {...props}>{empty ? bare : children}</li>
}
