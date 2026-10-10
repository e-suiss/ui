import * as React from "react"
import { type GestureResponderEvent, Pressable, View } from "react-native"
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
  SlottablePressableProps,
  SlottableViewProps,
  TriggerRef,
  ViewRef,
} from "./types"

type RootProps = SlottableViewProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

type TriggerProps = SlottablePressableProps

interface PortalProps extends ForceMountable {
  children: React.ReactNode
  hostName?: string
}

type ContentProps = FloatingContentProps

type RootRef = ViewRef
type ContentRef = ViewRef

type RootContextValue = FloatingRoot

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "DropdownMenu compound components cannot be rendered outside the DropdownMenu component"
    )
  }
  return context
}

function Root({
  asChild,
  open,
  defaultOpen,
  onOpenChange,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const value = useFloatingRoot({ open, defaultOpen, onOpenChange })
  const Component = asChild ? Slot : View
  return (
    <RootContext.Provider value={value}>
      <Component ref={ref} {...props} />
    </RootContext.Provider>
  )
}

Root.displayName = "DropdownMenuRoot"

function Trigger({
  asChild,
  disabled,
  onPress: onPressProp,
  ref,
  ...props
}: TriggerProps & React.RefAttributes<TriggerRef>) {
  const root = useRootContext()
  const composedRef = useTriggerRef(ref, root)

  function onPress(event: GestureResponderEvent) {
    if (disabled) return
    root.onOpenChange(!root.open)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={composedRef}
      role="button"
      aria-haspopup="menu"
      aria-expanded={root.open}
      aria-disabled={!!disabled}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}

Trigger.displayName = "DropdownMenuTrigger"

function Portal({ forceMount, hostName, children }: PortalProps) {
  const value = useRootContext()
  if (!forceMount && !value.open) return null
  return (
    <PortalPrimitive hostName={hostName} name={`${value.nativeID}_portal`}>
      <RootContext.Provider value={value}>{children}</RootContext.Provider>
    </PortalPrimitive>
  )
}

Portal.displayName = "DropdownMenuPortal"

function Overlay(props: OverlayProps & React.RefAttributes<OverlayRef>) {
  const { open, close } = useRootContext()
  return <FloatingOverlay open={open} close={close} {...props} />
}

Overlay.displayName = "DropdownMenuOverlay"

function Content(props: ContentProps & React.RefAttributes<ContentRef>) {
  const root = useRootContext()
  return <FloatingContentPrimitive state={root} role="menu" {...props} />
}

Content.displayName = "DropdownMenuContent"

export type {
  CheckboxItemProps,
  CheckboxItemRef,
  GroupProps,
  GroupRef,
  ItemIndicatorProps,
  ItemIndicatorRef,
  ItemProps,
  ItemRef,
  LabelProps,
  LabelRef,
  OverlayProps,
  OverlayRef,
  RadioGroupProps,
  RadioGroupRef,
  RadioItemProps,
  RadioItemRef,
  SeparatorProps,
  SeparatorRef,
  SubContentProps,
  SubContentRef,
  SubProps,
  SubRef,
  SubTriggerProps,
  SubTriggerRef,
} from "./menu-core"
export {
  CheckboxItem,
  Group,
  Item,
  ItemIndicator,
  Label,
  RadioGroup,
  RadioItem,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  useSubContext,
} from "./menu-core"
export type {
  ContentProps,
  ContentRef,
  PortalProps,
  RootContextValue,
  RootProps,
  RootRef,
  TriggerProps,
  TriggerRef,
}
export { Content, Overlay, Portal, Root, Trigger, useRootContext }
