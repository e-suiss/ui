import * as React from "react"
import { type GestureResponderEvent, Pressable, View } from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import { useHaptics } from "./haptics"
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
}

type ThumbState = RootState

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
}

type ThumbProps = BaseUIComponentProps<typeof View, ThumbState>

interface RootContextValue {
  state: RootState
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error("Switch parts must be rendered inside Switch.Root")
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
  const rootRef = React.useRef<React.ComponentRef<typeof View>>(null)
  const haptics = useHaptics()

  const state = React.useMemo<RootState>(
    () => ({ checked, disabled, readOnly, required }),
    [checked, disabled, readOnly, required]
  )

  const context = React.useMemo<RootContextValue>(() => ({ state }), [state])

  const onPress = (event: GestureResponderEvent) => {
    if (disabled || readOnly) return
    const changed = setChecked(
      !checked,
      createChangeEventDetails(REASONS.triggerPress, event, rootRef.current)
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
        accessibilityRole: "switch",
        accessibilityState: { checked, disabled },
        disabled,
        onPress,
      },
      elementProps,
    ],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "SwitchRoot"

function Thumb({ render, className, style, ref, ...elementProps }: ThumbProps) {
  const { state } = useRootContext()
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

Thumb.displayName = "SwitchThumb"

export type {
  ChangeEventDetails,
  ChangeEventReason,
  RootContextValue,
  RootProps,
  RootState,
  ThumbProps,
  ThumbState,
}
export { Root, Thumb, useRootContext }
