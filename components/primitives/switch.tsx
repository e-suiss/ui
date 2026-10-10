import type * as React from "react"
import { type GestureResponderEvent, Pressable, View } from "react-native"
import { useControllableState } from "./hooks"
import { Slot } from "./slot"
import type {
  PressableRef,
  SlottablePressableProps,
  SlottableViewProps,
  ViewRef,
} from "./types"

type RootProps = SlottablePressableProps & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

type ThumbProps = SlottableViewProps

type RootRef = PressableRef
type ThumbRef = ViewRef

function Root({
  asChild,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  onPress: onPressProp,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const [checked = false, setChecked] = useControllableState<boolean>({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  })

  const onPress = (event: GestureResponderEvent) => {
    if (disabled) return
    setChecked(!checked)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={ref}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}

Root.displayName = "SwitchRoot"

function Thumb({
  asChild,
  ref,
  ...props
}: ThumbProps & React.RefAttributes<ThumbRef>) {
  const Component = asChild ? Slot : View
  return <Component ref={ref} role="presentation" {...props} />
}

Thumb.displayName = "SwitchThumb"

export type { RootProps, RootRef, ThumbProps, ThumbRef }
export { Root, Thumb }
