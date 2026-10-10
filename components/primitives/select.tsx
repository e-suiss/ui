import * as React from "react"
import { type GestureResponderEvent, Pressable, Text, View } from "react-native"
import { useControllableState } from "./hooks"
import {
  FloatingContent as FloatingContentPrimitive,
  type FloatingContentProps,
  FloatingOverlay,
  type FloatingRoot,
  type OverlayProps,
  type OverlayRef,
  useFloatingRoot,
  useTriggerRef,
} from "./menu-core"
import { Portal as PortalPrimitive } from "./portal"
import { Slot } from "./slot"
import type {
  ForceMountable,
  PressableRef,
  SlottablePressableProps,
  SlottableTextProps,
  SlottableViewProps,
  TextRef,
  TriggerRef,
  ViewRef,
} from "./types"

type Option =
  | {
      value: string
      label: string
    }
  | undefined

type RootProps = SlottableViewProps & {
  value?: Option
  defaultValue?: Option
  onValueChange?: (option: Option) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

type TriggerProps = SlottablePressableProps

type ValueProps = SlottableTextProps & {
  placeholder: string
}

interface PortalProps extends ForceMountable {
  children: React.ReactNode
  hostName?: string
}

type ContentProps = FloatingContentProps & {
  position?: "popper" | "item-aligned"
}

type ViewportProps = Pick<SlottableViewProps, "style"> & {
  children?: React.ReactNode
  className?: string
}

type ItemProps = SlottablePressableProps & {
  value: string
  label: string
  closeOnPress?: boolean
}

type ItemTextProps = Omit<SlottableTextProps, "children">
type ItemIndicatorProps = SlottableViewProps & ForceMountable
type GroupProps = SlottableViewProps
type LabelProps = SlottableTextProps
type SeparatorProps = SlottableViewProps & {
  decorative?: boolean
}

type RootRef = ViewRef
type ValueRef = TextRef
type ContentRef = ViewRef
type ItemRef = PressableRef
type ItemTextRef = TextRef
type ItemIndicatorRef = ViewRef
type GroupRef = ViewRef
type LabelRef = TextRef
type SeparatorRef = ViewRef

interface RootContextValue extends FloatingRoot {
  value: Option
  onValueChange: (option: Option) => void
  disabled: boolean
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "Select compound components cannot be rendered outside the Select component"
    )
  }
  return context
}

function Root({
  asChild,
  value: valueProp,
  defaultValue,
  onValueChange: onValueChangeProp,
  open,
  defaultOpen,
  onOpenChange,
  disabled = false,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const floating = useFloatingRoot({ open, defaultOpen, onOpenChange })
  const [value, setValue] = useControllableState<Option>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChangeProp,
  })
  const onValueChange = React.useCallback(
    (option: Option) => setValue(option),
    [setValue]
  )
  const context = React.useMemo(
    () => ({ ...floating, value, onValueChange, disabled }),
    [floating, value, onValueChange, disabled]
  )
  const Component = asChild ? Slot : View
  return (
    <RootContext.Provider value={context}>
      <Component ref={ref} {...props} />
    </RootContext.Provider>
  )
}

Root.displayName = "SelectRoot"

function Trigger({
  asChild,
  disabled: disabledProp,
  onPress: onPressProp,
  ref,
  ...props
}: TriggerProps & React.RefAttributes<TriggerRef>) {
  const root = useRootContext()
  const composedRef = useTriggerRef(ref, root)
  const disabled = !!disabledProp || root.disabled

  function onPress(event: GestureResponderEvent) {
    if (disabled) return
    root.onOpenChange(!root.open)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={composedRef}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={root.open}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}

Trigger.displayName = "SelectTrigger"

function Value({
  asChild,
  placeholder,
  ref,
  ...props
}: ValueProps & React.RefAttributes<ValueRef>) {
  const { value } = useRootContext()
  const Component = asChild ? Slot : Text
  return (
    <Component ref={ref} {...props}>
      {value?.label ?? placeholder}
    </Component>
  )
}

Value.displayName = "SelectValue"

function Portal({ forceMount, hostName, children }: PortalProps) {
  const value = useRootContext()
  if (!forceMount && !value.open) return null
  return (
    <PortalPrimitive hostName={hostName} name={`${value.nativeID}_portal`}>
      <RootContext.Provider value={value}>{children}</RootContext.Provider>
    </PortalPrimitive>
  )
}

Portal.displayName = "SelectPortal"

function Overlay(props: OverlayProps & React.RefAttributes<OverlayRef>) {
  const { open, close } = useRootContext()
  return <FloatingOverlay open={open} close={close} {...props} />
}

Overlay.displayName = "SelectOverlay"

function Content({
  position: _position,
  ...props
}: ContentProps & React.RefAttributes<ContentRef>) {
  const root = useRootContext()
  return <FloatingContentPrimitive state={root} role="menu" {...props} />
}

Content.displayName = "SelectContent"

function Viewport({ children }: ViewportProps) {
  return <>{children}</>
}

Viewport.displayName = "SelectViewport"

interface ItemContextValue {
  itemValue: string
  label: string
}

const ItemContext = React.createContext<ItemContextValue | null>(null)

function useItemContext() {
  const context = React.useContext(ItemContext)
  if (!context) {
    throw new Error(
      "Select Item compound components cannot be rendered outside of an Item component"
    )
  }
  return context
}

function Item({
  asChild,
  value: itemValue,
  label,
  closeOnPress = true,
  disabled,
  onPress: onPressProp,
  ref,
  ...props
}: ItemProps & React.RefAttributes<ItemRef>) {
  const { value, onValueChange, close } = useRootContext()
  const context = React.useMemo(
    () => ({ itemValue, label }),
    [itemValue, label]
  )
  const selected = value?.value === itemValue

  function onPress(event: GestureResponderEvent) {
    if (disabled) return
    onValueChange({ value: itemValue, label })
    onPressProp?.(event)
    if (closeOnPress) close()
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <ItemContext.Provider value={context}>
      <Component
        ref={ref}
        role="menuitem"
        aria-label={label}
        aria-selected={selected}
        aria-disabled={!!disabled}
        disabled={disabled}
        onPress={onPress}
        {...props}
      />
    </ItemContext.Provider>
  )
}

Item.displayName = "SelectItem"

function ItemText({
  asChild,
  ref,
  ...props
}: ItemTextProps & React.RefAttributes<ItemTextRef>) {
  const { label } = useItemContext()
  const Component = asChild ? Slot : Text
  return (
    <Component ref={ref} {...props}>
      {label}
    </Component>
  )
}

ItemText.displayName = "SelectItemText"

function ItemIndicator({
  asChild,
  forceMount,
  ref,
  ...props
}: ItemIndicatorProps & React.RefAttributes<ItemIndicatorRef>) {
  const { itemValue } = useItemContext()
  const { value } = useRootContext()
  if (!forceMount && value?.value !== itemValue) return null
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role="presentation"
      aria-hidden={true}
      importantForAccessibility="no-hide-descendants"
      {...props}
    />
  )
}

ItemIndicator.displayName = "SelectItemIndicator"

function Group({
  asChild,
  ref,
  ...props
}: GroupProps & React.RefAttributes<GroupRef>) {
  const Component = asChild ? Slot : View
  return <Component ref={ref} role="group" {...props} />
}

Group.displayName = "SelectGroup"

function Label({
  asChild,
  ref,
  ...props
}: LabelProps & React.RefAttributes<LabelRef>) {
  const Component = asChild ? Slot : Text
  return <Component ref={ref} {...props} />
}

Label.displayName = "SelectLabel"

function Separator({
  asChild,
  decorative,
  ref,
  ...props
}: SeparatorProps & React.RefAttributes<SeparatorRef>) {
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role={decorative ? "presentation" : "separator"}
      aria-hidden={decorative === true}
      importantForAccessibility={decorative ? "no-hide-descendants" : "auto"}
      {...props}
    />
  )
}

Separator.displayName = "SelectSeparator"

export type {
  OverlayProps,
  OverlayRef,
} from "./menu-core"
export type {
  ContentProps,
  ContentRef,
  GroupProps,
  GroupRef,
  ItemIndicatorProps,
  ItemIndicatorRef,
  ItemProps,
  ItemRef,
  ItemTextProps,
  ItemTextRef,
  LabelProps,
  LabelRef,
  Option,
  PortalProps,
  RootContextValue,
  RootProps,
  RootRef,
  SeparatorProps,
  SeparatorRef,
  TriggerProps,
  TriggerRef,
  ValueProps,
  ValueRef,
  ViewportProps,
}
export {
  Content,
  Group,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Overlay,
  Portal,
  Root,
  Separator,
  Trigger,
  useItemContext,
  useRootContext,
  Value,
  Viewport,
}
