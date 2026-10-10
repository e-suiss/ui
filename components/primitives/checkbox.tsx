import * as React from "react"
import { type GestureResponderEvent, Pressable, View } from "react-native"
import { useControllableState } from "./hooks"
import { Slot } from "./slot"
import type {
  ForceMountable,
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

type IndicatorProps = ForceMountable & SlottableViewProps

type RootRef = PressableRef
type IndicatorRef = ViewRef

interface RootContextValue {
  checked: boolean
  disabled: boolean
  setChecked: (checked: boolean) => void
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "Checkbox compound components cannot be rendered outside the Checkbox component"
    )
  }
  return context
}

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

  const value = React.useMemo<RootContextValue>(
    () => ({ checked, disabled, setChecked }),
    [checked, disabled, setChecked]
  )

  const onPress = (event: GestureResponderEvent) => {
    if (disabled) return
    setChecked(!checked)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <RootContext.Provider value={value}>
      <Component
        ref={ref}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        accessibilityState={{ checked, disabled }}
        disabled={disabled}
        onPress={onPress}
        {...props}
      />
    </RootContext.Provider>
  )
}

Root.displayName = "CheckboxRoot"

function Indicator({
  asChild,
  forceMount,
  ref,
  ...props
}: IndicatorProps & React.RefAttributes<IndicatorRef>) {
  const { checked } = useRootContext()
  if (!forceMount && !checked) return null
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role="presentation"
      aria-hidden={!checked}
      {...props}
    />
  )
}

Indicator.displayName = "CheckboxIndicator"

export type { IndicatorProps, IndicatorRef, RootProps, RootRef }
export { Indicator, Root, useRootContext }
