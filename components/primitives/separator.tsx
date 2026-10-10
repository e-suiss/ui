import * as React from "react"
import { View } from "react-native"
import type { BaseUIComponentProps, Orientation } from "./types"
import { useRender } from "./use-render"

interface RootState {
  orientation: Orientation
}

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  orientation?: Orientation | undefined
}

function Root({
  orientation = "horizontal",
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const state = React.useMemo<RootState>(() => ({ orientation }), [orientation])
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      },
      elementProps,
    ],
  })
}

Root.displayName = "Separator"

export type { RootProps, RootState }
export { Root }
