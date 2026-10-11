import * as React from "react"
import { type GestureResponderEvent, Pressable, type View } from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import { useHaptics } from "./haptics"
import { useToggleGroupContext } from "./toggle-group"
import type { BaseUIChangeEventDetails, BaseUIComponentProps } from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type ToggleChangeEventReason =
  | typeof REASONS.triggerPress
  | typeof REASONS.itemPress
  | typeof REASONS.none

type ToggleChangeEventDetails =
  BaseUIChangeEventDetails<ToggleChangeEventReason>

interface ToggleState {
  pressed: boolean
  disabled: boolean
}

type ToggleProps = Omit<
  BaseUIComponentProps<typeof Pressable, ToggleState>,
  "children"
> & {
  children?: React.ReactNode
  pressed?: boolean | undefined
  defaultPressed?: boolean | undefined
  onPressedChange?:
    | ((pressed: boolean, eventDetails: ToggleChangeEventDetails) => void)
    | undefined
  disabled?: boolean | undefined
  value?: string | undefined
}

function Toggle({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  disabled: disabledProp = false,
  value,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ToggleProps) {
  const group = useToggleGroupContext()
  const generatedValue = React.useId()
  const itemValue = value ?? generatedValue

  const [localPressed, setLocalPressed] = useControllableState<
    boolean,
    ToggleChangeEventDetails
  >({
    value: pressedProp,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  })

  const pressed = group ? group.value.includes(itemValue) : localPressed
  const disabled = disabledProp || (group?.disabled ?? false)
  const rootRef = React.useRef<View>(null)
  const haptics = useHaptics()

  const state = React.useMemo<ToggleState>(
    () => ({ pressed, disabled }),
    [pressed, disabled]
  )

  const onPress = (event: GestureResponderEvent) => {
    if (disabled) return
    const next = !pressed
    if (group) {
      const details = createChangeEventDetails(
        REASONS.itemPress,
        event,
        rootRef.current
      )
      onPressedChange?.(next, details)
      if (details.isCanceled) return
      if (group.setItemPressed(itemValue, next, details)) haptics.selection()
      return
    }
    const changed = setLocalPressed(
      next,
      createChangeEventDetails(REASONS.triggerPress, event, rootRef.current)
    )
    if (changed) haptics.selection()
  }

  const singleSelect = group !== null && !group.multiple

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: [ref, rootRef],
    props: [
      {
        accessibilityRole: singleSelect ? "radio" : "togglebutton",
        accessibilityState: { checked: pressed, disabled },
        disabled,
        onPress,
      },
      elementProps,
    ],
  })
}

Toggle.displayName = "Toggle"

export type {
  ToggleChangeEventDetails,
  ToggleChangeEventReason,
  ToggleProps,
  ToggleState,
}
export { Toggle }
