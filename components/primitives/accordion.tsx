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

type AccordionValue = string | string[] | undefined

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
    collapsible?: boolean
  }

type ItemProps = SlottableViewProps & {
  value: string
  disabled?: boolean
}

type HeaderProps = SlottableViewProps
type TriggerProps = SlottablePressableProps & {
  disabled?: boolean
}
type ContentProps = ForceMountable & SlottableViewProps

type RootRef = ViewRef
type ItemRef = ViewRef
type HeaderRef = ViewRef
type TriggerRef = PressableRef
type ContentRef = ViewRef

interface RootContext {
  type: "single" | "multiple"
  value: AccordionValue
  onValueChange: (value: AccordionValue) => void
  collapsible: boolean
  disabled: boolean
}

interface ItemContext {
  value: string
  disabled: boolean
  isExpanded: boolean
}

function toArray(value: AccordionValue): string[] {
  if (value === undefined) return []
  return typeof value === "string" ? [value] : value
}

function isItemExpanded(rootValue: AccordionValue, value: string) {
  return Array.isArray(rootValue)
    ? rootValue.includes(value)
    : rootValue === value
}

const AccordionContext = React.createContext<RootContext | null>(null)

function useRootContext() {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error(
      "Accordion compound components cannot be rendered outside the Accordion component"
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
    collapsible = true,
    ref,
    ...viewProps
  } = props

  const onChange = (next: AccordionValue) => {
    if (props.type === "multiple") props.onValueChange?.(toArray(next))
    else props.onValueChange?.(typeof next === "string" ? next : undefined)
  }

  const [value = type === "multiple" ? [] : undefined, setValue] =
    useControllableState<AccordionValue>({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange,
    })

  const context = React.useMemo<RootContext>(
    () => ({ type, value, onValueChange: setValue, collapsible, disabled }),
    [type, value, setValue, collapsible, disabled]
  )

  const Component = asChild ? Slot : View
  return (
    <AccordionContext.Provider value={context}>
      <Component ref={ref} {...viewProps} />
    </AccordionContext.Provider>
  )
}

Root.displayName = "AccordionRoot"

const AccordionItemContext = React.createContext<ItemContext | null>(null)

function useItemContext() {
  const context = React.useContext(AccordionItemContext)
  if (!context) {
    throw new Error(
      "AccordionItem compound components cannot be rendered outside the AccordionItem component"
    )
  }
  return context
}

function Item({
  asChild,
  value,
  disabled = false,
  ref,
  ...props
}: ItemProps & React.RefAttributes<ItemRef>) {
  const { value: rootValue } = useRootContext()
  const isExpanded = isItemExpanded(rootValue, value)

  const context = React.useMemo<ItemContext>(
    () => ({ value, disabled, isExpanded }),
    [value, disabled, isExpanded]
  )

  const Component = asChild ? Slot : View
  return (
    <AccordionItemContext.Provider value={context}>
      <Component ref={ref} {...props} />
    </AccordionItemContext.Provider>
  )
}

Item.displayName = "AccordionItem"

function Header({
  asChild,
  ref,
  ...props
}: HeaderProps & React.RefAttributes<HeaderRef>) {
  const { disabled: rootDisabled } = useRootContext()
  const { disabled: itemDisabled, isExpanded } = useItemContext()
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role="heading"
      aria-expanded={isExpanded}
      aria-disabled={rootDisabled || itemDisabled}
      {...props}
    />
  )
}

Header.displayName = "AccordionHeader"

function Trigger({
  asChild,
  disabled: disabledProp = false,
  onPress: onPressProp,
  ref,
  ...props
}: TriggerProps & React.RefAttributes<TriggerRef>) {
  const {
    type,
    value: rootValue,
    onValueChange,
    collapsible,
    disabled: rootDisabled,
  } = useRootContext()
  const { value, disabled: itemDisabled, isExpanded } = useItemContext()
  const disabled = disabledProp || rootDisabled || itemDisabled

  const onPress = (event: GestureResponderEvent) => {
    if (disabled) return
    if (type === "single") {
      if (isExpanded) {
        if (collapsible) onValueChange(undefined)
      } else {
        onValueChange(value)
      }
    } else {
      const current = toArray(rootValue)
      onValueChange(
        isExpanded
          ? current.filter((entry) => entry !== value)
          : [...current, value]
      )
    }
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={ref}
      role="button"
      aria-expanded={isExpanded}
      aria-disabled={disabled}
      accessibilityState={{ expanded: isExpanded, disabled }}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}

Trigger.displayName = "AccordionTrigger"

function Content({
  asChild,
  forceMount,
  ref,
  ...props
}: ContentProps & React.RefAttributes<ContentRef>) {
  const { isExpanded } = useItemContext()
  if (!forceMount && !isExpanded) return null
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role="region"
      aria-hidden={!isExpanded}
      importantForAccessibility={isExpanded ? "auto" : "no-hide-descendants"}
      {...props}
    />
  )
}

Content.displayName = "AccordionContent"

export type {
  ContentProps,
  ContentRef,
  HeaderProps,
  HeaderRef,
  ItemContext,
  ItemProps,
  ItemRef,
  RootContext,
  RootProps,
  RootRef,
  TriggerProps,
  TriggerRef,
}
export { Content, Header, Item, Root, Trigger, useItemContext, useRootContext }
