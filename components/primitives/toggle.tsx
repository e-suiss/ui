import * as React from "react"
import { type GestureResponderEvent, Pressable, type View } from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import { useToggleGroupContext } from "./toggle-group"
import type { BaseUIChangeEventDetails, BaseUIComponentProps } from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type ChangeEventReason =
  | typeof REASONS.triggerPress
  | typeof REASONS.itemPress
  | typeof REASONS.none

type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>

interface RootState {
  pressed: boolean
  disabled: boolean
}

type RootProps = Omit<
  BaseUIComponentProps<typeof Pressable, RootState>,
  "children"
> & {
  children?: React.ReactNode
  pressed?: boolean | undefined
  defaultPressed?: boolean | undefined
  onPressedChange?:
    | ((pressed: boolean, eventDetails: ChangeEventDetails) => void)
    | undefined
  disabled?: boolean | undefined
  value?: string | undefined
}

function Root({
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
}: RootProps) {
  const group = useToggleGroupContext()
  const generatedValue = React.useId()
  const itemValue = value ?? generatedValue

  const [localPressed, setLocalPressed] = useControllableState<
    boolean,
    ChangeEventDetails
  >({
    value: pressedProp,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  })

  const pressed = group ? group.value.includes(itemValue) : localPressed
  const disabled = disabledProp || (group?.disabled ?? false)
  const rootRef = React.useRef<View>(null)

  const state = React.useMemo<RootState>(
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
      group.setItemPressed(itemValue, next, details)
      return
    }
    setLocalPressed(
      next,
      createChangeEventDetails(REASONS.triggerPress, event, rootRef.current)
    )
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

Root.displayName = "Toggle"

export type { ChangeEventDetails, ChangeEventReason, RootProps, RootState }
export { Root }
