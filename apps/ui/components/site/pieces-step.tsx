"use client"

import * as React from "react"
import { Anchor } from "@/components/site/anchor"
import { useBaseItems } from "@/components/site/base-items"
import { useCodeOptions } from "@/components/site/code-options"
import { usePlatformSection } from "@/components/site/platform"
import { strings } from "@/lib/strings"

export function Steps({
  start,
  ...props
}: React.ComponentProps<"ol"> & { start: number }) {
  const { base } = useCodeOptions()
  const { pieces } = useBaseItems()
  const section = usePlatformSection()
  const dropped =
    section === "web" &&
    pieces?.step !== undefined &&
    pieces.bases[base]?.length === 0 &&
    start > pieces.step
  return <ol {...props} start={dropped ? start - 1 : start} />
}

export function PiecesStep({
  names,
  loose,
  children,
  ...props
}: React.ComponentProps<"li"> & { names: string[]; loose: boolean }) {
  const { base } = useCodeOptions()
  const { pieces } = useBaseItems()
  const own = pieces?.bases[base]
  const matches =
    pieces !== undefined &&
    names.length === pieces.from.length &&
    names.every((name) => pieces.from.includes(name))
  if (!own || !matches) return <li {...props}>{children}</li>
  if (own.length === 0) return null
  const content = (
    <>
      {strings.piecesLead}{" "}
      {own.map((piece, index) => (
        <React.Fragment key={piece.name}>
          {index > 0 && ", "}
          {piece.href ? (
            <Anchor href={piece.href}>{piece.title}</Anchor>
          ) : (
            <code>{piece.name}</code>
          )}
        </React.Fragment>
      ))}
      .
    </>
  )
  return <li {...props}>{loose ? <p>{content}</p> : content}</li>
}
