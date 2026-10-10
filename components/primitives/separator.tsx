import type * as React from "react"
import { View } from "react-native"
import { Slot } from "./slot"
import type { SlottableViewProps, ViewRef } from "./types"

type RootProps = SlottableViewProps & {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}

type RootRef = ViewRef

function Root({
  asChild,
  decorative,
  orientation = "horizontal",
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role={decorative ? "presentation" : "separator"}
      aria-hidden={decorative === true}
      aria-orientation={orientation}
      importantForAccessibility={decorative ? "no-hide-descendants" : "auto"}
      {...props}
    />
  )
}

Root.displayName = "SeparatorRoot"

export type { RootProps, RootRef }
export { Root }
