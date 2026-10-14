import * as React from "react"
import { View } from "react-native"
import type { BaseUIComponentProps } from "./types"
import { useRender } from "./use-render"

interface RootState {
  ratio: number
}

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  ratio?: number | undefined
}

function Root({
  ratio = 1,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const state = React.useMemo<RootState>(() => ({ ratio }), [ratio])
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [elementProps, { style: { aspectRatio: ratio } }],
  })
}

Root.displayName = "AspectRatio"

export type { RootProps, RootState }
export { Root }
