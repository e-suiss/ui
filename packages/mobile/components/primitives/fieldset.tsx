import * as React from "react"
import { Text as RNText, View } from "react-native"
import type { BaseUIComponentProps } from "./types"
import { useRender } from "./use-render"

interface RootState {
  disabled: boolean
}

type LegendState = RootState

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  disabled?: boolean | undefined
}

type LegendProps = BaseUIComponentProps<typeof RNText, LegendState>

interface RootContextValue {
  state: RootState
  legendId: string
}

const RootContext = React.createContext<RootContextValue | null>(null)

const DEFAULT_STATE: RootState = { disabled: false }

function useFieldsetContext() {
  return React.useContext(RootContext)
}

function Root({
  disabled: disabledProp = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const parent = React.useContext(RootContext)
  const disabled = disabledProp || (parent?.state.disabled ?? false)
  const legendId = React.useId()

  const state = React.useMemo<RootState>(() => ({ disabled }), [disabled])
  const context = React.useMemo<RootContextValue>(
    () => ({ state, legendId }),
    [state, legendId]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        role: "group",
        accessibilityLabelledBy: legendId,
        accessibilityState: { disabled },
      },
      elementProps,
    ],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "FieldsetRoot"

function Legend({
  render,
  className,
  style,
  ref,
  ...elementProps
}: LegendProps) {
  const context = React.useContext(RootContext)
  const state = context?.state ?? DEFAULT_STATE
  return useRender({
    defaultComponent: RNText,
    render,
    className,
    style,
    state,
    ref,
    props: [
      { nativeID: context?.legendId, accessibilityRole: "header" },
      elementProps,
    ],
  })
}

Legend.displayName = "FieldsetLegend"

export type { LegendProps, LegendState, RootContextValue, RootProps, RootState }
export { Legend, Root, useFieldsetContext }
