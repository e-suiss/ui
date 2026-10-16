import type * as React from "react"

export function OnlyBase({
  base,
  children,
}: {
  base: string
  children: React.ReactNode
}) {
  return (
    <div data-only-base={base} className="contents">
      {children}
    </div>
  )
}
