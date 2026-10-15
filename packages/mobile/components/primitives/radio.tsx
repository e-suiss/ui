import * as React from "react"
import { type GestureResponderEvent, Pressable, View } from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import { useHaptics } from "./haptics"
import { useRadioGroupContext } from "./radio-group"
import type { BaseUIComponentProps } from "./types"
import { useRender } from "./use-render"

interface RootState {
  checked: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean
}

type IndicatorState = RootState

type RootProps<Value = unknown> = Omit<
  BaseUIComponentProps<typeof Pressable, RootState>,
  "children" | "value"
> & {
  children?: React.ReactNode
  value: Value
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  required?: boolean | undefined
}

type IndicatorProps = BaseUIComponentProps<typeof View, IndicatorState> & {
  keepMounted?: boolean | undefined
}

interface RadioRootContextValue {
  state: RootState
}

const RadioRootContext = React.createContext<RadioRootContextValue | null>(null)

function useRadioRootContext() {
  const context = React.useContext(RadioRootContext)
  if (!context) {
    throw new Error("Radio.Indicator must be rendered inside Radio.Root")
  }
  return context
}

function Root<Value = unknown>({
  value: itemValue,
  disabled: disabledProp = false,
  readOnly: readOnlyProp = false,
  required: requiredProp = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps<Value>) {
  const group = useRadioGroupContext()
  if (!group) {
    throw new Error("Radio.Root must be rendered inside RadioGroup")
  }
  const disabled = group.disabled || disabledProp
  const readOnly = group.readOnly || readOnlyProp
  const required = group.required || requiredProp
  const checked = Object.is(group.value, itemValue)
  const rootRef = React.useRef<React.ComponentRef<typeof View>>(null)
  const { setValue } = group
  const haptics = useHaptics()

  const state = React.useMemo<RootState>(
    () => ({ checked, disabled, readOnly, required }),
    [checked, disabled, readOnly, required]
  )

  const context = React.useMemo<RadioRootContextValue>(
    () => ({ state }),
    [state]
  )

  const onPress = (event: GestureResponderEvent) => {
    if (disabled || readOnly || checked) return
    const changed = setValue(
      itemValue,
      createChangeEventDetails(REASONS.itemPress, event, rootRef.current)
    )
    if (changed) haptics.selection()
  }

  const element = useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: [ref, rootRef],
    props: [
      {
        accessibilityRole: "radio",
        accessibilityState: { checked, disabled },
        disabled,
        onPress,
      },
      elementProps,
    ],
  })

  return (
    <RadioRootContext.Provider value={context}>
      {element}
    </RadioRootContext.Provider>
  )
}

Root.displayName = "RadioRoot"

function Indicator({
  keepMounted = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: IndicatorProps) {
  const { state } = useRadioRootContext()
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    enabled: state.checked || keepMounted,
    props: [
      {
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      },
      elementProps,
    ],
  })
}

Indicator.displayName = "RadioIndicator"

export type {
  IndicatorProps,
  IndicatorState,
  RadioRootContextValue,
  RootProps,
  RootState,
}
export { Indicator, RadioRootContext, Root, useRadioRootContext }
