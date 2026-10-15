"use client"

import { Direction } from "radix-ui"
import type * as React from "react"

function DirectionProvider({
  dir,
  direction,
  children,
}: Partial<React.ComponentProps<typeof Direction.DirectionProvider>> & {
  direction?: React.ComponentProps<typeof Direction.DirectionProvider>["dir"]
}) {
  return (
    <Direction.DirectionProvider dir={direction ?? dir ?? "ltr"}>
      {children}
    </Direction.DirectionProvider>
  )
}

const useDirection = Direction.useDirection

export { DirectionProvider, useDirection }
