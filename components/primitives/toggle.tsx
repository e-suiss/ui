import type * as React from "react"
import { type GestureResponderEvent, Pressable } from "react-native"
import { useControllableState } from "./hooks"
import { Slot } from "./slot"
import type { PressableRef, SlottablePressableProps } from "./types"

type RootProps = SlottablePressableProps & {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  disabled?: boolean
}

type RootRef = PressableRef

function Root({
  asChild,
  pressed: pressedProp,
  defaultPressed,
  onPressedChange,
  disabled = false,
  onPress: onPressProp,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const [pressed = false, setPressed] = useControllableState<boolean>({
    prop: pressedProp,
    defaultProp: defaultPressed,
    onChange: onPressedChange,
  })

  const onPress = (event: GestureResponderEvent) => {
    if (disabled) return
    setPressed(!pressed)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={ref}
      role="button"
      aria-selected={pressed}
      aria-disabled={disabled}
      accessibilityState={{ selected: pressed, disabled }}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}

Root.displayName = "ToggleRoot"

export type { RootProps, RootRef }
export { Root }
