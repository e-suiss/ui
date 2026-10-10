import * as React from "react"
import { type GestureResponderEvent, Pressable, View } from "react-native"
import { useControllableState } from "./hooks"
import { Slot } from "./slot"
import type {
  PressableRef,
  SlottablePressableProps,
  SlottableViewProps,
  ViewRef,
} from "./types"

type GroupValue = string | string[] | undefined

interface SingleRootProps {
  type: "single"
  value?: string | undefined
  defaultValue?: string | undefined
  onValueChange?: (value: string | undefined) => void
}

interface MultipleRootProps {
  type: "multiple"
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

type RootProps = (SingleRootProps | MultipleRootProps) &
  SlottableViewProps & {
    disabled?: boolean
  }

type ItemProps = SlottablePressableProps & {
  value: string
  disabled?: boolean
}

type RootRef = ViewRef
type ItemRef = PressableRef

interface RootContextValue {
  type: "single" | "multiple"
  value: GroupValue
  disabled: boolean
  onValueChange: (value: GroupValue) => void
}

interface ItemContextValue {
  value: string
  isSelected: boolean
  disabled: boolean
}

function toArray(value: GroupValue): string[] {
  if (value === undefined) return []
  return typeof value === "string" ? [value] : value
}

function getIsSelected(value: GroupValue, itemValue: string) {
  if (value === undefined) return false
  if (typeof value === "string") return value === itemValue
  return value.includes(itemValue)
}

function getNewSingleValue(value: GroupValue, itemValue: string) {
  return getIsSelected(value, itemValue) ? undefined : itemValue
}

function getNewMultipleValue(value: GroupValue, itemValue: string) {
  const current = toArray(value)
  return current.includes(itemValue)
    ? current.filter((entry) => entry !== itemValue)
    : [...current, itemValue]
}

const utils = { getIsSelected, getNewMultipleValue, getNewSingleValue }

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "ToggleGroup compound components cannot be rendered outside the ToggleGroup component"
    )
  }
  return context
}

function Root(props: RootProps & React.RefAttributes<RootRef>) {
  const {
    asChild,
    type,
    value: valueProp,
    defaultValue,
    onValueChange: _onValueChange,
    disabled = false,
    ref,
    ...viewProps
  } = props

  const onChange = (next: GroupValue) => {
    if (props.type === "multiple") props.onValueChange?.(toArray(next))
    else props.onValueChange?.(typeof next === "string" ? next : undefined)
  }

  const [value = type === "multiple" ? [] : undefined, setValue] =
    useControllableState<GroupValue>({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange,
    })

  const context = React.useMemo<RootContextValue>(
    () => ({ type, value, disabled, onValueChange: setValue }),
    [type, value, disabled, setValue]
  )

  const Component = asChild ? Slot : View
  return (
    <RootContext.Provider value={context}>
      <Component
        ref={ref}
        role={type === "single" ? "radiogroup" : "group"}
        aria-disabled={disabled}
        {...viewProps}
      />
    </RootContext.Provider>
  )
}

Root.displayName = "ToggleGroupRoot"

const ItemContext = React.createContext<ItemContextValue | null>(null)

function useItemContext() {
  const context = React.useContext(ItemContext)
  if (!context) {
    throw new Error(
      "ToggleGroupItem compound components cannot be rendered outside the ToggleGroupItem component"
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
  const {
    type,
    value,
    disabled: rootDisabled,
    onValueChange,
  } = useRootContext()
  const disabled = rootDisabled || disabledProp
  const isSelected = getIsSelected(value, itemValue)

  const itemContext = React.useMemo<ItemContextValue>(
    () => ({ value: itemValue, isSelected, disabled }),
    [itemValue, isSelected, disabled]
  )

  const onPress = (event: GestureResponderEvent) => {
    if (disabled) return
    onValueChange(
      type === "single"
        ? getNewSingleValue(value, itemValue)
        : getNewMultipleValue(value, itemValue)
    )
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <ItemContext.Provider value={itemContext}>
      <Component
        ref={ref}
        role={type === "single" ? "radio" : "checkbox"}
        aria-checked={isSelected}
        aria-disabled={disabled}
        accessibilityState={{ checked: isSelected, disabled }}
        disabled={disabled}
        onPress={onPress}
        {...props}
      />
    </ItemContext.Provider>
  )
}

Item.displayName = "ToggleGroupItem"

export type { ItemProps, ItemRef, RootProps, RootRef }
export { Item, Root, useItemContext, useRootContext, utils }
