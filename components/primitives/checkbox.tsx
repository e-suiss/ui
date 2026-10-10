import * as React from "react"
import { type GestureResponderEvent, Pressable, View } from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import type { BaseUIChangeEventDetails, BaseUIComponentProps } from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type ChangeEventReason = typeof REASONS.triggerPress | typeof REASONS.none

type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>

interface RootState {
  checked: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean
  indeterminate: boolean
}

type IndicatorState = RootState

type RootProps = Omit<
  BaseUIComponentProps<typeof Pressable, RootState>,
  "children"
> & {
  children?: React.ReactNode
  checked?: boolean | undefined
  defaultChecked?: boolean | undefined
  onCheckedChange?:
    | ((checked: boolean, eventDetails: ChangeEventDetails) => void)
    | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  required?: boolean | undefined
  indeterminate?: boolean | undefined
}

type IndicatorProps = BaseUIComponentProps<typeof View, IndicatorState> & {
  keepMounted?: boolean | undefined
}

interface RootContextValue {
  state: RootState
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error("Checkbox parts must be rendered inside Checkbox.Root")
  }
  return context
}

function Root({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  readOnly = false,
  required = false,
  indeterminate = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const [checked, setChecked] = useControllableState<
    boolean,
    ChangeEventDetails
  >({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })
  const rootRef = React.useRef<View>(null)

  const state = React.useMemo<RootState>(
    () => ({ checked, disabled, readOnly, required, indeterminate }),
    [checked, disabled, readOnly, required, indeterminate]
  )

  const context = React.useMemo<RootContextValue>(() => ({ state }), [state])

  const onPress = (event: GestureResponderEvent) => {
    if (disabled || readOnly) return
    setChecked(
      !checked,
      createChangeEventDetails(REASONS.triggerPress, event, rootRef.current)
    )
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
        accessibilityRole: "checkbox",
        accessibilityState: {
          checked: indeterminate ? "mixed" : checked,
          disabled,
        },
        disabled,
        onPress,
      },
      elementProps,
    ],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "CheckboxRoot"

function Indicator({
  keepMounted = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: IndicatorProps) {
  const { state } = useRootContext()
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    enabled: state.checked || state.indeterminate || keepMounted,
    props: [
      {
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      },
      elementProps,
    ],
  })
}

Indicator.displayName = "CheckboxIndicator"

export type {
  ChangeEventDetails,
  ChangeEventReason,
  IndicatorProps,
  IndicatorState,
  RootContextValue,
  RootProps,
  RootState,
}
export { Indicator, Root, useRootContext }
