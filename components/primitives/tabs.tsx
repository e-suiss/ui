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
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

type ListProps = SlottableViewProps

type TriggerProps = SlottablePressableProps & {
  value: string
  disabled?: boolean
}

type ContentProps = SlottableViewProps &
  ForceMountable & {
    value: string
  }

type RootRef = ViewRef
type ListRef = ViewRef
type TriggerRef = PressableRef
type ContentRef = ViewRef

interface RootContextValue {
  value: string | undefined
  onValueChange: (value: string) => void
}

interface TriggerContextValue {
  value: string
  isSelected: boolean
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "Tabs compound components cannot be rendered outside the Tabs component"
    )
  }
  return context
}

function Root({
  asChild,
  value: valueProp,
  defaultValue,
  onValueChange,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const [value, setValue] = useControllableState<string>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })

  const context = React.useMemo<RootContextValue>(
    () => ({ value, onValueChange: setValue }),
    [value, setValue]
  )

  const Component = asChild ? Slot : View
  return (
    <RootContext.Provider value={context}>
      <Component ref={ref} {...props} />
    </RootContext.Provider>
  )
}

Root.displayName = "TabsRoot"

function List({
  asChild,
  ref,
  ...props
}: ListProps & React.RefAttributes<ListRef>) {
  const Component = asChild ? Slot : View
  return <Component ref={ref} role="tablist" {...props} />
}

List.displayName = "TabsList"

const TriggerContext = React.createContext<TriggerContextValue | null>(null)

function useTriggerContext() {
  const context = React.useContext(TriggerContext)
  if (!context) {
    throw new Error(
      "Tabs.Trigger compound components cannot be rendered outside the Tabs.Trigger component"
    )
  }
  return context
}

function Trigger({
  asChild,
  value: tabValue,
  disabled = false,
  onPress: onPressProp,
  ref,
  ...props
}: TriggerProps & React.RefAttributes<TriggerRef>) {
  const { value, onValueChange } = useRootContext()
  const isSelected = value === tabValue

  const triggerContext = React.useMemo<TriggerContextValue>(
    () => ({ value: tabValue, isSelected }),
    [tabValue, isSelected]
  )

  const onPress = (event: GestureResponderEvent) => {
    if (disabled) return
    onValueChange(tabValue)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <TriggerContext.Provider value={triggerContext}>
      <Component
        ref={ref}
        role="tab"
        aria-selected={isSelected}
        aria-disabled={disabled}
        accessibilityState={{ selected: isSelected, disabled }}
        disabled={disabled}
        onPress={onPress}
        {...props}
      />
    </TriggerContext.Provider>
  )
}

Trigger.displayName = "TabsTrigger"

function Content({
  asChild,
  forceMount,
  value: tabValue,
  ref,
  ...props
}: ContentProps & React.RefAttributes<ContentRef>) {
  const { value } = useRootContext()
  const isSelected = value === tabValue
  if (!forceMount && !isSelected) return null
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role="tabpanel"
      aria-hidden={!isSelected}
      importantForAccessibility={isSelected ? "auto" : "no-hide-descendants"}
      {...props}
    />
  )
}

Content.displayName = "TabsContent"

export type {
  ContentProps,
  ContentRef,
  ListProps,
  ListRef,
  RootProps,
  RootRef,
  TriggerProps,
  TriggerRef,
}
export { Content, List, Root, Trigger, useRootContext, useTriggerContext }
