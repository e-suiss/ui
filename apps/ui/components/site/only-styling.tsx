import type * as React from "react"
import { strings } from "@/lib/strings"

export function OnlyStyling({
  styling,
  children,
}: {
  styling: string
  children: React.ReactNode
}) {
  return (
    <div data-only-styling={styling} className="contents">
      {children}
    </div>
  )
}

export function StylingNote() {
  return <p>{strings.stylingNote}</p>
}
