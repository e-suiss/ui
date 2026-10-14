import * as React from "react"
import { View } from "react-native"
import type { BaseUIComponentProps, Orientation } from "./types"
import { useRender } from "./use-render"

interface SeparatorState {
  orientation: Orientation
}

type SeparatorProps = BaseUIComponentProps<typeof View, SeparatorState> & {
  orientation?: Orientation | undefined
}

function Separator({
  orientation = "horizontal",
  render,
  className,
  style,
  ref,
  ...elementProps
}: SeparatorProps) {
  const state = React.useMemo<SeparatorState>(
    () => ({ orientation }),
    [orientation]
  )
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

Separator.displayName = "Separator"

export type { SeparatorProps, SeparatorState }
export { Separator }
