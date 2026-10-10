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

type RootProps = SlottableViewProps & {
  value?: string | undefined
  defaultValue?: string | undefined
  onValueChange?: (value: string) => void
  disabled?: boolean
}

type ItemProps = SlottablePressableProps & {
  value: string
  disabled?: boolean
  "aria-labelledby"?: string
}

type IndicatorProps = SlottableViewProps & ForceMountable

type RootRef = ViewRef
type ItemRef = PressableRef
type IndicatorRef = ViewRef

interface RootContextValue {
  value: string | undefined
  disabled: boolean
  onValueChange: (value: string) => void
}

interface ItemContextValue {
  itemValue: string
  isChecked: boolean
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "RadioGroup compound components cannot be rendered outside the RadioGroup component"
    )
  }
  return context
}

function Root({
  asChild,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const [value, setValue] = useControllableState<string>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })

  const context = React.useMemo<RootContextValue>(
    () => ({ value, disabled, onValueChange: setValue }),
    [value, disabled, setValue]
  )

  const Component = asChild ? Slot : View
  return (
    <RootContext.Provider value={context}>
      <Component
        ref={ref}
        role="radiogroup"
        aria-disabled={disabled}
        {...props}
      />
    </RootContext.Provider>
  )
}

Root.displayName = "RadioGroupRoot"

const ItemContext = React.createContext<ItemContextValue | null>(null)

function useItemContext() {
  const context = React.useContext(ItemContext)
  if (!context) {
    throw new Error(
      "RadioGroupItem compound components cannot be rendered outside the RadioGroupItem component"
    )
  }
  return context
}

function Item({
  asChild,
  value: itemValue,
  disabled: disabledProp = false,
  onPress: onPressProp,
  ref,
  ...props
}: ItemProps & React.RefAttributes<ItemRef>) {
  const { value, disabled: rootDisabled, onValueChange } = useRootContext()
  const disabled = rootDisabled || disabledProp
  const isChecked = value === itemValue

  const itemContext = React.useMemo<ItemContextValue>(
    () => ({ itemValue, isChecked }),
    [itemValue, isChecked]
  )

  const onPress = (event: GestureResponderEvent) => {
    if (disabled) return
    onValueChange(itemValue)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <ItemContext.Provider value={itemContext}>
      <Component
        ref={ref}
        role="radio"
        aria-checked={isChecked}
        aria-disabled={disabled}
        accessibilityState={{ checked: isChecked, disabled }}
        disabled={disabled}
        onPress={onPress}
        {...props}
      />
    </ItemContext.Provider>
  )
}

Item.displayName = "RadioGroupItem"

function Indicator({
  asChild,
  forceMount,
  ref,
  ...props
}: IndicatorProps & React.RefAttributes<IndicatorRef>) {
  const { isChecked } = useItemContext()
  if (!forceMount && !isChecked) return null
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role="presentation"
      aria-hidden={!isChecked}
      {...props}
    />
  )
}

Indicator.displayName = "RadioGroupIndicator"

export type {
  IndicatorProps,
  IndicatorRef,
  ItemProps,
  ItemRef,
  RootProps,
  RootRef,
}
export { Indicator, Item, Root, useItemContext, useRootContext }
