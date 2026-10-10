import type * as React from "react"
import { type StyleProp, View, type ViewStyle } from "react-native"
import { Slot } from "./slot"
import type { SlottableViewProps, ViewRef } from "./types"

type RootProps = Omit<SlottableViewProps, "style"> & {
  ratio?: number
  style?: StyleProp<ViewStyle>
}

type RootRef = ViewRef

function Root({
  asChild,
  ratio = 1,
  style,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const Component = asChild ? Slot : View
  return (
    <Component ref={ref} style={[style, { aspectRatio: ratio }]} {...props} />
  )
}

Root.displayName = "AspectRatioRoot"

export type { RootProps, RootRef }
export { Root }
